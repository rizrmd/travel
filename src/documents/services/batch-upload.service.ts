/**
 * Epic 6, Story 6.3: Batch Upload Service
 * Handles ZIP file batch upload and processing
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { BatchUploadJobEntity } from "../infrastructure/persistence/relational/entities/batch-upload-job.entity";
import { DocumentEntity } from "../infrastructure/persistence/relational/entities/document.entity";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { FileStorageService } from "./file-storage.service";
import {
  BatchUploadJob,
  BatchUploadParser,
  BatchFileResult,
  BatchUploadStatus,
} from "../domain/batch-upload";
import { DocumentType, DocumentStatus, UploaderType, FileMimeType } from "../domain/document";
import {
  BatchUploadResponseDto,
  BatchUploadStatusDto,
} from "../dto/batch-upload-response.dto";
import { AppWebSocketGateway } from "../../websocket/websocket.gateway";
import { v4 as uuidv4 } from "uuid";
import AdmZip from "adm-zip";
import { QueueName } from "../../queue/types/queue-jobs.type";

@Injectable()
export class BatchUploadService {
  private readonly logger = new Logger(BatchUploadService.name);

  constructor(
    @InjectRepository(BatchUploadJobEntity)
    private readonly batchJobRepository: Repository<BatchUploadJobEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    @InjectQueue(QueueName.BATCH_PROCESSING)
    private readonly batchQueue: Queue,
    private readonly fileStorageService: FileStorageService,
    private readonly webSocketGateway: AppWebSocketGateway,
  ) { }

  /**
   * Upload ZIP file and queue batch processing job
   */
  async uploadBatch(
    file: Express.Multer.File,
    tenantId: string,
    uploaderId: string,
  ): Promise<BatchUploadResponseDto> {
    // Validate ZIP file size
    if (!BatchUploadJob.isValidZipSize(file.size)) {
      throw new BadRequestException(
        `ZIP file size exceeds maximum allowed (${BatchUploadJob.MAX_ZIP_SIZE / 1024 / 1024}MB)`,
      );
    }

    // Validate MIME type
    if (
      !["application/zip", "application/x-zip-compressed"].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException("File must be a ZIP archive");
    }

    // Generate unique filename and path
    const uniqueFilename = this.fileStorageService.generateUniqueFilename(
      file.originalname,
    );
    const filePath = `uploads/${tenantId}/batch/${uniqueFilename}`;

    // Upload ZIP to temporary storage
    const zipUrl = await this.fileStorageService.upload(
      file.buffer,
      filePath,
      file.mimetype,
    );

    // Create batch job entity
    const batchJob = this.batchJobRepository.create({
      id: uuidv4(),
      tenant_id: tenantId,
      uploaded_by_id: uploaderId,
      zip_file_url: zipUrl,
      zip_file_size: file.size,
      status: BatchUploadStatus.PENDING,
    });

    const savedJob = await this.batchJobRepository.save(batchJob);

    // Queue batch processing job
    await this.batchQueue.add(
      "process-batch-upload",
      {
        jobId: savedJob.id,
        tenantId,
        uploaderId,
        zipFileBuffer: file.buffer,
      },
      {
        jobId: savedJob.id,
      },
    );

    this.logger.log(`Batch upload job queued: ${savedJob.id}`);

    return {
      jobId: savedJob.id,
      status: BatchUploadStatus.PENDING,
      message: "Batch upload job created successfully",
    };
  }

  /**
   * Get batch job status
   */
  async getBatchStatus(
    jobId: string,
    tenantId: string,
  ): Promise<BatchUploadStatusDto> {
    const job = await this.batchJobRepository.findOne({
      where: { id: jobId, tenant_id: tenantId },
    });

    if (!job) {
      throw new NotFoundException(`Batch job with ID ${jobId} not found`);
    }

    return {
      jobId: job.id,
      status: job.status,
      totalFiles: job.total_files,
      processedFiles: job.processed_files,
      successfulFiles: job.successful_files,
      failedFiles: job.failed_files,
      progress: this.calculateProgress(job.processed_files, job.total_files),
      estimatedTimeRemaining: this.calculateEstimatedTime(job),
      errorReport: job.error_report,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    };
  }

  /**
   * Process batch upload (called by BullMQ processor)
   */
  async processBatchUpload(
    jobId: string,
    tenantId: string,
    uploaderId: string,
    zipFileBuffer: Buffer,
  ): Promise<void> {
    const job = await this.batchJobRepository.findOne({
      where: { id: jobId, tenant_id: tenantId },
    });

    if (!job) {
      throw new NotFoundException(`Batch job with ID ${jobId} not found`);
    }

    try {
      // Extract ZIP file
      const zip = new AdmZip(zipFileBuffer);
      const zipEntries = zip.getEntries();

      // Filter out directories and system files
      const fileEntries = zipEntries.filter(
        (entry) =>
          !entry.isDirectory && !entry.entryName.startsWith("__MACOSX"),
      );

      // Validate file count
      if (fileEntries.length > BatchUploadJob.MAX_FILES_PER_BATCH) {
        throw new BadRequestException(
          `Batch contains too many files. Maximum: ${BatchUploadJob.MAX_FILES_PER_BATCH}`,
        );
      }

      // Start processing
      job.status = BatchUploadStatus.PROCESSING;
      job.total_files = fileEntries.length;
      job.started_at = new Date();
      await this.batchJobRepository.save(job);

      // Process each file
      const results: BatchFileResult[] = [];

      for (const entry of fileEntries) {
        const result = await this.processFile(
          entry,
          tenantId,
          uploaderId,
          jobId,
        );
        results.push(result);

        // Update progress
        job.processed_files += 1;
        if (result.success) {
          job.successful_files += 1;
        } else {
          job.failed_files += 1;
        }
        await this.batchJobRepository.save(job);

        // Send WebSocket progress update
        this.webSocketGateway.emitToTenant(tenantId, "batch.progress", {
          jobId,
          progress: this.calculateProgress(
            job.processed_files,
            job.total_files,
          ),
          processed: job.processed_files,
          total: job.total_files,
        });
      }

      // Generate error report if there are failures
      if (job.failed_files > 0) {
        job.error_report = BatchUploadParser.generateErrorReport(results);
      }

      // Complete job
      job.status =
        job.failed_files === 0
          ? BatchUploadStatus.COMPLETED
          : BatchUploadStatus.PARTIAL_SUCCESS;
      job.completed_at = new Date();
      await this.batchJobRepository.save(job);

      // Send completion notification
      this.webSocketGateway.emitToTenant(tenantId, "batch.completed", {
        jobId,
        status: job.status,
        totalFiles: job.total_files,
        successfulFiles: job.successful_files,
        failedFiles: job.failed_files,
        summary: BatchUploadParser.generateSummary(results),
      });

      this.logger.log(`Batch job completed: ${jobId}`);
    } catch (error) {
      this.logger.error(`Batch job failed: ${error.message}`);

      job.status = BatchUploadStatus.FAILED;
      job.error_report = error.message;
      job.completed_at = new Date();
      await this.batchJobRepository.save(job);

      // Send failure notification
      this.webSocketGateway.emitToTenant(tenantId, "batch.failed", {
        jobId,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Process individual file from ZIP
   */
  private async processFile(
    entry: AdmZip.IZipEntry,
    tenantId: string,
    uploaderId: string,
    batchJobId: string,
  ): Promise<BatchFileResult> {
    const filename = entry.entryName.split("/").pop(); // Get filename without path

    try {
      // Parse filename
      const parsed = BatchUploadParser.parseFilename(filename);

      if (!parsed) {
        return {
          filename,
          success: false,
          error:
            "Invalid filename format. Expected: {JamaahName}-{DocumentType}.{ext}",
        };
      }

      // Find jamaah by name
      const jamaah = await this.jamaahRepository.findOne({
        where: {
          tenant_id: tenantId,
          full_name: parsed.jamaahName,
        },
      });

      if (!jamaah) {
        return {
          filename,
          success: false,
          error: `Jamaah not found: ${parsed.jamaahName}`,
        };
      }

      // Get file buffer
      const fileBuffer = entry.getData();

      // Determine MIME type from extension
      const mimeTypeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        pdf: "application/pdf",
      };
      const mimeType = mimeTypeMap[parsed.extension];

      // Generate unique filename and path
      const uniqueFilename =
        this.fileStorageService.generateUniqueFilename(filename);
      const filePath = `uploads/${tenantId}/${jamaah.id}/${parsed.documentType}/${uniqueFilename}`;

      // Upload file
      const fileUrl = await this.fileStorageService.upload(
        fileBuffer,
        filePath,
        mimeType,
      );

      // Create document entity
      const document = this.documentRepository.create({
        id: uuidv4(),
        tenant_id: tenantId,
        jamaah_id: jamaah.id,
        document_type: parsed.documentType as DocumentType,
        file_url: fileUrl,
        file_size: fileBuffer.length,
        file_mime_type: mimeType as FileMimeType,
        status: DocumentStatus.PENDING,
        uploader_type: UploaderType.AGENT,
        uploaded_by_id: uploaderId,
      });

      const savedDocument = await this.documentRepository.save(document);

      return {
        filename,
        success: true,
        documentId: savedDocument.id,
        jamaahId: jamaah.id,
        documentType: parsed.documentType,
      };
    } catch (error) {
      this.logger.error(`Failed to process file ${filename}: ${error.message}`);
      return {
        filename,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate progress percentage
   */
  private calculateProgress(processed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((processed / total) * 100);
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateEstimatedTime(job: BatchUploadJobEntity): number | null {
    if (!job.started_at || job.processed_files === 0) {
      return null;
    }

    const elapsedMs = Date.now() - job.started_at.getTime();
    const avgTimePerFile = elapsedMs / job.processed_files;
    const remainingFiles = job.total_files - job.processed_files;

    return Math.round((avgTimePerFile * remainingFiles) / 1000); // Convert to seconds
  }
}
