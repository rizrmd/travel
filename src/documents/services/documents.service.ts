/**
 * Epic 6, Story 6.1 & 6.2: Documents Service
 * Handles document upload, CRUD operations, and business logic
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
import { FileStorageService } from "./file-storage.service";
import {
  Document,
  DocumentType,
  DocumentStatus,
  UploaderType,
  FileMimeType,
} from "../domain/document";
import { UploadDocumentDto } from "../dto/upload-document.dto";
import {
  DocumentResponseDto,
  DocumentListResponseDto,
} from "../dto/document-response.dto";
import { DocumentsListQueryDto } from "../dto/documents-list-query.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Upload a single document
   */
  async uploadDocument(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    tenantId: string,
    uploaderId: string,
    uploaderType: UploaderType,
  ): Promise<DocumentResponseDto> {
    // Validate file size
    if (!Document.isValidFileSize(file.size)) {
      throw new BadRequestException(
        `File size exceeds maximum allowed (${Document.MAX_FILE_SIZE / 1024 / 1024}MB)`,
      );
    }

    // Validate MIME type
    if (!Document.isValidMimeType(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${Document.ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }

    // Validate extension matches MIME type
    if (!Document.validateExtensionMimeType(file.originalname, file.mimetype)) {
      throw new BadRequestException("File extension does not match MIME type");
    }

    // Check for existing document of same type (not rejected)
    const existingDocument = await this.documentRepository.findOne({
      where: {
        tenant_id: tenantId,
        jamaah_id: dto.jamaahId,
        document_type: dto.documentType,
        status: DocumentStatus.PENDING || DocumentStatus.APPROVED,
      },
    });

    // Soft delete existing document if found
    if (existingDocument) {
      this.logger.log(
        `Soft deleting existing document ${existingDocument.id} for replacement`,
      );
      await this.documentRepository.softDelete(existingDocument.id);
    }

    // Generate unique filename
    const uniqueFilename = this.fileStorageService.generateUniqueFilename(
      file.originalname,
    );

    // Generate storage path
    const filePath = Document.generateFilePath(
      tenantId,
      dto.jamaahId,
      dto.documentType,
      uniqueFilename,
    );

    // Upload file to storage
    const fileUrl = await this.fileStorageService.upload(
      file.buffer,
      filePath,
      file.mimetype,
    );

    // Create document entity
    const document = this.documentRepository.create({
      id: uuidv4(),
      tenant_id: tenantId,
      jamaah_id: dto.jamaahId,
      document_type: dto.documentType,
      file_url: fileUrl,
      file_size: file.size,
      file_mime_type: file.mimetype as FileMimeType,
      status: DocumentStatus.PENDING,
      uploader_type: uploaderType,
      uploaded_by_id: uploaderId,
      expires_at: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });

    // Save to database
    const savedDocument = await this.documentRepository.save(document);

    this.logger.log(`Document uploaded successfully: ${savedDocument.id}`);

    return this.mapToResponseDto(savedDocument);
  }

  /**
   * Get document by ID
   */
  async getDocumentById(
    id: string,
    tenantId: string,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.mapToResponseDto(document);
  }

  /**
   * List documents with filtering and pagination
   */
  async listDocuments(
    query: DocumentsListQueryDto,
    tenantId: string,
    userId?: string,
    userRole?: string,
  ): Promise<DocumentListResponseDto> {
    const { page = 1, limit = 10, ...filters } = query;

    const queryBuilder = this.documentRepository
      .createQueryBuilder("document")
      .where("document.tenant_id = :tenantId", { tenantId })
      .andWhere("document.deleted_at IS NULL");

    // Apply filters
    if (filters.jamaahId) {
      queryBuilder.andWhere("document.jamaah_id = :jamaahId", {
        jamaahId: filters.jamaahId,
      });
    }

    if (filters.documentType) {
      queryBuilder.andWhere("document.document_type = :documentType", {
        documentType: filters.documentType,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere("document.status = :status", {
        status: filters.status,
      });
    }

    // Apply RLS: Agents can only see documents for their jamaah
    if (userRole === "agent") {
      queryBuilder
        .innerJoin("document.jamaah", "jamaah")
        .andWhere("jamaah.agent_id = :userId", { userId });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy("document.created_at", "DESC");

    // Execute query
    const [documents, total] = await queryBuilder.getManyAndCount();

    return {
      data: documents.map((doc) => this.mapToResponseDto(doc)),
      total,
      page,
      limit,
    };
  }

  /**
   * Delete document (soft delete)
   */
  async deleteDocument(
    id: string,
    tenantId: string,
    userId: string,
    userRole: string,
  ): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ["jamaah"],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Only admins or the uploader can delete
    if (userRole !== "admin" && document.uploaded_by_id !== userId) {
      throw new ForbiddenException(
        "You do not have permission to delete this document",
      );
    }

    // Delete file from storage
    try {
      const filePath = this.extractFilePathFromUrl(document.file_url);
      await this.fileStorageService.delete(filePath);
    } catch (error) {
      this.logger.error(`Failed to delete file from storage: ${error.message}`);
      // Continue with soft delete even if file deletion fails
    }

    // Soft delete from database
    await this.documentRepository.softDelete(id);

    this.logger.log(`Document deleted: ${id}`);
  }

  /**
   * Get download URL (pre-signed)
   */
  async getDownloadUrl(id: string, tenantId: string): Promise<string> {
    const document = await this.documentRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const filePath = this.extractFilePathFromUrl(document.file_url);
    return this.fileStorageService.getPresignedUrl(filePath, 15); // 15 minutes expiry
  }

  /**
   * Check for duplicate document
   */
  async checkDuplicate(
    jamaahId: string,
    documentType: DocumentType,
    tenantId: string,
  ): Promise<boolean> {
    const count = await this.documentRepository.count({
      where: {
        tenant_id: tenantId,
        jamaah_id: jamaahId,
        document_type: documentType,
        status: DocumentStatus.PENDING || DocumentStatus.APPROVED,
      },
    });

    return count > 0;
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

  /**
   * Extracts file path from URL
   */
  private extractFilePathFromUrl(url: string): string {
    // Extract path after /uploads/
    const match = url.match(/\/uploads\/(.+)/);
    return match ? match[1] : url;
  }
}
