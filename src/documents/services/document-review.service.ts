/**
 * Epic 6, Story 6.4: Document Review Service
 * Handles document review workflow
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentEntity } from "../infrastructure/persistence/relational/entities/document.entity";
import { DocumentStatus } from "../domain/document";
import { ReviewDocumentDto } from "../dto/review-document.dto";
import { DocumentResponseDto } from "../dto/document-response.dto";
import { AppWebSocketGateway } from "../../websocket/websocket.gateway";
import { QueueService } from "../../queue/services/queue.service";
import { QueueName, EmailJobType } from "../../queue/types/queue-jobs.type";

@Injectable()
export class DocumentReviewService {
  private readonly logger = new Logger(DocumentReviewService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly webSocketGateway: AppWebSocketGateway,
    private readonly queueService: QueueService,
  ) { }

  /**
   * Review a document (approve or reject)
   */
  async reviewDocument(
    documentId: string,
    dto: ReviewDocumentDto,
    reviewerId: string,
    tenantId: string,
  ): Promise<DocumentResponseDto> {
    // Find document
    const document = await this.documentRepository.findOne({
      where: { id: documentId, tenant_id: tenantId },
      relations: ["jamaah", "uploaded_by"],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Validate document can be reviewed
    if (document.status !== DocumentStatus.PENDING) {
      throw new BadRequestException(
        `Document cannot be reviewed. Current status: ${document.status}`,
      );
    }

    // Validate rejection requires notes
    if (dto.status === DocumentStatus.REJECTED && !dto.reviewNotes) {
      throw new BadRequestException(
        "Review notes are required for rejected documents",
      );
    }

    // Update document
    document.status = dto.status;
    document.reviewed_by_id = reviewerId;
    document.reviewed_at = new Date();

    if (dto.status === DocumentStatus.REJECTED) {
      document.rejection_reason = dto.reviewNotes;
    } else {
      document.rejection_reason = null;
    }

    // Update extracted data if provided
    if (dto.extractedData) {
      document.extracted_data = dto.extractedData;
    }

    const savedDocument = await this.documentRepository.save(document);

    this.logger.log(
      `Document ${documentId} ${dto.status} by reviewer ${reviewerId}`,
    );

    // Send notifications
    await this.sendReviewNotification(document, dto.status);

    // Emit WebSocket event
    this.webSocketGateway.emitToTenant(tenantId, "document.reviewed", {
      documentId: savedDocument.id,
      jamaahId: savedDocument.jamaah_id,
      status: savedDocument.status,
      reviewedBy: reviewerId,
    });

    return this.mapToResponseDto(savedDocument);
  }

  /**
   * Get pending review queue
   */
  async getPendingReviewQueue(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [documents, total] = await this.documentRepository
      .createQueryBuilder("document")
      .leftJoinAndSelect("document.jamaah", "jamaah")
      .leftJoinAndSelect("document.uploaded_by", "uploaded_by")
      .where("document.tenant_id = :tenantId", { tenantId })
      .andWhere("document.status = :status", { status: DocumentStatus.PENDING })
      .orderBy("document.created_at", "ASC") // Oldest first
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: documents.map((doc) => ({
        ...this.mapToResponseDto(doc),
        jamaahName: doc.jamaah?.full_name,
        uploadedByName: doc.uploaded_by?.fullName,
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Get review statistics
   */
  async getReviewStatistics(tenantId: string): Promise<any> {
    const totalPending = await this.documentRepository.count({
      where: { tenant_id: tenantId, status: DocumentStatus.PENDING },
    });

    const totalApproved = await this.documentRepository.count({
      where: { tenant_id: tenantId, status: DocumentStatus.APPROVED },
    });

    const totalRejected = await this.documentRepository.count({
      where: { tenant_id: tenantId, status: DocumentStatus.REJECTED },
    });

    // Get oldest pending document
    const oldestPending = await this.documentRepository.findOne({
      where: { tenant_id: tenantId, status: DocumentStatus.PENDING },
      order: { created_at: "ASC" },
    });

    const oldestPendingDays = oldestPending
      ? Math.floor(
        (Date.now() - oldestPending.created_at.getTime()) /
        (1000 * 60 * 60 * 24),
      )
      : 0;

    // Get pending by type
    const pendingByType = await this.documentRepository
      .createQueryBuilder("document")
      .select("document.document_type", "type")
      .addSelect("COUNT(*)", "count")
      .where("document.tenant_id = :tenantId", { tenantId })
      .andWhere("document.status = :status", { status: DocumentStatus.PENDING })
      .groupBy("document.document_type")
      .getRawMany();

    const pendingByTypeMap = pendingByType.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count, 10);
      return acc;
    }, {});

    // Calculate average review time
    const reviewedDocs = await this.documentRepository
      .createQueryBuilder("document")
      .where("document.tenant_id = :tenantId", { tenantId })
      .andWhere("document.reviewed_at IS NOT NULL")
      .andWhere("document.created_at IS NOT NULL")
      .select(
        "AVG(EXTRACT(EPOCH FROM (document.reviewed_at - document.created_at)))",
        "avg",
      )
      .getRawOne();

    const avgReviewTimeMinutes = reviewedDocs?.avg
      ? Math.round(parseFloat(reviewedDocs.avg) / 60)
      : 0;

    return {
      totalPending,
      totalApproved,
      totalRejected,
      oldestPendingDays,
      pendingByType: pendingByTypeMap,
      avgReviewTimeMinutes,
    };
  }

  /**
   * Send review notification
   */
  private async sendReviewNotification(
    document: DocumentEntity,
    status: DocumentStatus,
  ): Promise<void> {
    const statusText =
      status === DocumentStatus.APPROVED ? "approved" : "rejected";

    // Queue email notification
    await this.queueService.addEmailJob({
      to: document.jamaah?.email || "noreply@example.com",
      subject: `Document ${statusText}`,
      template: "document-review",
      data: {
        jamaahName: document.jamaah?.full_name,
        documentType: document.document_type,
        status: statusText,
        rejectionReason: document.rejection_reason,
      },
      tenantId: document.tenant_id,
      type: EmailJobType.SEND_DOCUMENT_APPROVAL,
    });

    this.logger.log(`Review notification sent for document ${document.id}`);
  }

  /**
   * Maps entity to response DTO
   */
  private mapToResponseDto(entity: DocumentEntity): DocumentResponseDto {
    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      documentType: entity.document_type,
      fileUrl: entity.file_url,
      fileSize: entity.file_size,
      fileMimeType: entity.file_mime_type,
      status: entity.status,
      uploaderType: entity.uploader_type,
      uploadedById: entity.uploaded_by_id,
      reviewedById: entity.reviewed_by_id,
      reviewedAt: entity.reviewed_at,
      rejectionReason: entity.rejection_reason,
      extractedData: entity.extracted_data,
      expiresAt: entity.expires_at,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    };
  }
}
