/**
 * Epic 6, Story 6.5: Bulk Approval Service
 * Handles bulk document approval/rejection
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { BulkApprovalJobEntity } from "../infrastructure/persistence/relational/entities/bulk-approval-job.entity";
import { DocumentEntity } from "../infrastructure/persistence/relational/entities/document.entity";
import { BulkApprovalDto } from "../dto/bulk-approval.dto";
import {
  BulkApprovalStatus,
  ReviewAction,
  BulkApprovalResult,
} from "../domain/document-review";
import { DocumentStatus } from "../domain/document";
import { AppWebSocketGateway } from "../../websocket/websocket.gateway";
import { QueueService } from "../../queue/services/queue.service";
import { QueueName, EmailJobType } from "../../queue/types/queue-jobs.type";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class BulkApprovalService {
  private readonly logger = new Logger(BulkApprovalService.name);

  constructor(
    @InjectRepository(BulkApprovalJobEntity)
    private readonly bulkJobRepository: Repository<BulkApprovalJobEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    @InjectQueue(QueueName.BATCH_PROCESSING)
    private readonly batchQueue: Queue,
    private readonly webSocketGateway: AppWebSocketGateway,
    private readonly queueService: QueueService,
  ) { }

  /**
   * Submit bulk approval/rejection request
   */
  async submitBulkApproval(
    dto: BulkApprovalDto,
    reviewerId: string,
    tenantId: string,
  ): Promise<any> {
    // Validate document count
    if (dto.documentIds.length === 0) {
      throw new BadRequestException("At least one document ID is required");
    }

    if (dto.documentIds.length > 50) {
      throw new BadRequestException(
        "Maximum 50 documents can be processed at once",
      );
    }

    // Validate rejection requires reason
    if (dto.action === ReviewAction.REJECT && !dto.rejectionReason) {
      throw new BadRequestException(
        "Rejection reason is required for bulk rejection",
      );
    }

    // Verify all documents exist and are pending
    const documents = await this.documentRepository.find({
      where: {
        id: In(dto.documentIds),
        tenant_id: tenantId,
      },
    });

    if (documents.length !== dto.documentIds.length) {
      throw new BadRequestException("One or more documents not found");
    }

    const nonPendingDocs = documents.filter(
      (doc) => doc.status !== DocumentStatus.PENDING,
    );

    if (nonPendingDocs.length > 0) {
      throw new BadRequestException(
        `${nonPendingDocs.length} document(s) are not in pending status`,
      );
    }

    // Create bulk approval job
    const bulkJob = this.bulkJobRepository.create({
      id: uuidv4(),
      tenant_id: tenantId,
      reviewer_id: reviewerId,
      action: dto.action,
      document_ids: dto.documentIds,
      status: BulkApprovalStatus.PENDING,
      rejection_reason: dto.rejectionReason,
    });

    const savedJob = await this.bulkJobRepository.save(bulkJob);

    // Queue bulk processing job
    await this.batchQueue.add(
      "process-bulk-approval",
      {
        jobId: savedJob.id,
        tenantId,
        reviewerId,
      },
      {
        jobId: savedJob.id,
      },
    );

    this.logger.log(`Bulk approval job queued: ${savedJob.id}`);

    return {
      jobId: savedJob.id,
      status: BulkApprovalStatus.PENDING,
      message: `Bulk ${dto.action} job created for ${dto.documentIds.length} documents`,
    };
  }

  /**
   * Get bulk approval job status
   */
  async getBulkJobStatus(jobId: string, tenantId: string): Promise<any> {
    const job = await this.bulkJobRepository.findOne({
      where: { id: jobId, tenant_id: tenantId },
    });

    if (!job) {
      throw new NotFoundException(
        `Bulk approval job with ID ${jobId} not found`,
      );
    }

    return {
      jobId: job.id,
      action: job.action,
      status: job.status,
      totalDocuments: job.total_documents,
      processedDocuments: job.processed_documents,
      successfulDocuments: job.successful_documents,
      failedDocuments: job.failed_documents,
      progress: this.calculateProgress(
        job.processed_documents,
        job.total_documents,
      ),
      errorReport: job.error_report,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    };
  }

  /**
   * Process bulk approval (called by BullMQ processor)
   */
  async processBulkApproval(
    jobId: string,
    tenantId: string,
    reviewerId: string,
  ): Promise<void> {
    const job = await this.bulkJobRepository.findOne({
      where: { id: jobId, tenant_id: tenantId },
    });

    if (!job) {
      throw new NotFoundException(
        `Bulk approval job with ID ${jobId} not found`,
      );
    }

    try {
      // Start processing
      job.status = BulkApprovalStatus.PROCESSING;
      job.total_documents = job.document_ids.length;
      job.started_at = new Date();
      await this.bulkJobRepository.save(job);

      const results: BulkApprovalResult[] = [];

      // Process each document
      for (const documentId of job.document_ids) {
        const result = await this.processDocument(
          documentId,
          job.action,
          reviewerId,
          job.rejection_reason,
          tenantId,
        );
        results.push(result);

        // Update progress
        job.processed_documents += 1;
        if (result.success) {
          job.successful_documents += 1;
        } else {
          job.failed_documents += 1;
        }
        await this.bulkJobRepository.save(job);

        // Send WebSocket progress update
        this.webSocketGateway.emitToTenant(tenantId, "bulk-approval.progress", {
          jobId,
          progress: this.calculateProgress(
            job.processed_documents,
            job.total_documents,
          ),
          processed: job.processed_documents,
          total: job.total_documents,
        });
      }

      // Generate error report if there are failures
      if (job.failed_documents > 0) {
        job.error_report = this.generateErrorReport(results);
      }

      // Complete job
      job.status =
        job.failed_documents === 0
          ? BulkApprovalStatus.COMPLETED
          : BulkApprovalStatus.FAILED;
      job.completed_at = new Date();
      await this.bulkJobRepository.save(job);

      // Send completion notification
      this.webSocketGateway.emitToTenant(tenantId, "bulk-approval.completed", {
        jobId,
        status: job.status,
        totalDocuments: job.total_documents,
        successfulDocuments: job.successful_documents,
        failedDocuments: job.failed_documents,
      });

      this.logger.log(`Bulk approval job completed: ${jobId}`);
    } catch (error) {
      this.logger.error(`Bulk approval job failed: ${error.message}`);

      job.status = BulkApprovalStatus.FAILED;
      job.error_report = error.message;
      job.completed_at = new Date();
      await this.bulkJobRepository.save(job);

      throw error;
    }
  }

  /**
   * Process individual document
   */
  private async processDocument(
    documentId: string,
    action: ReviewAction,
    reviewerId: string,
    rejectionReason: string | null,
    tenantId: string,
  ): Promise<BulkApprovalResult> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id: documentId, tenant_id: tenantId },
        relations: ["jamaah"],
      });

      if (!document) {
        return {
          documentId,
          success: false,
          error: "Document not found",
        };
      }

      if (document.status !== DocumentStatus.PENDING) {
        return {
          documentId,
          success: false,
          error: `Document is not pending (current status: ${document.status})`,
        };
      }

      // Update document
      document.status =
        action === ReviewAction.APPROVE
          ? DocumentStatus.APPROVED
          : DocumentStatus.REJECTED;
      document.reviewed_by_id = reviewerId;
      document.reviewed_at = new Date();
      document.rejection_reason =
        action === ReviewAction.REJECT ? rejectionReason : null;

      await this.documentRepository.save(document);

      // Send individual notification
      await this.sendNotification(document, action);

      return {
        documentId,
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Failed to process document ${documentId}: ${error.message}`,
      );
      return {
        documentId,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send notification for individual document
   */
  private async sendNotification(
    document: DocumentEntity,
    action: ReviewAction,
  ): Promise<void> {
    const statusText =
      action === ReviewAction.APPROVE ? "approved" : "rejected";

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
  }

  /**
   * Generate error report
   */
  private generateErrorReport(results: BulkApprovalResult[]): string {
    const failedResults = results.filter((r) => !r.success);

    if (failedResults.length === 0) {
      return "";
    }

    const lines = failedResults.map(
      (r) => `Document ${r.documentId}: ${r.error}`,
    );

    return lines.join("\n");
  }

  /**
   * Calculate progress percentage
   */
  private calculateProgress(processed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((processed / total) * 100);
  }
}
