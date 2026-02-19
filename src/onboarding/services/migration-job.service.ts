/**
 * Epic 13, Story 13.3: Migration Job Service
 * Manages migration workflow and job state
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MigrationJobEntity } from "../infrastructure/persistence/relational/entities/migration-job.entity";
import { MigrationErrorEntity } from "../infrastructure/persistence/relational/entities/migration-error.entity";
import {
  CsvImportStatus,
  CsvImportType,
  CsvRowError,
} from "../domain/csv-import";
import { WebSocketEventType } from "../../websocket/types/websocket-events.type";
import { MigrationJobDomain } from "../domain/migration-job";
import { MigrationJobResponseDto } from "../dto/migration-job-response.dto";
import { AppWebSocketGateway } from "../../websocket/websocket.gateway";

@Injectable()
export class MigrationJobService {
  constructor(
    @InjectRepository(MigrationJobEntity)
    private jobRepository: Repository<MigrationJobEntity>,
    @InjectRepository(MigrationErrorEntity)
    private errorRepository: Repository<MigrationErrorEntity>,
    private websocketGateway: AppWebSocketGateway,
  ) { }

  /**
   * Create new migration job
   */
  async createJob(
    tenantId: string,
    userId: string,
    importType: CsvImportType,
    fileName: string,
    fileUrl: string,
    fileSize: number,
    metadata: any,
  ): Promise<MigrationJobEntity> {
    const job = this.jobRepository.create({
      tenant_id: tenantId,
      user_id: userId,
      import_type: importType,
      file_name: fileName,
      file_url: fileUrl,
      file_size: fileSize,
      status: CsvImportStatus.PENDING,
      total_rows: 0,
      processed_rows: 0,
      valid_rows: 0,
      invalid_rows: 0,
      metadata,
    });

    return await this.jobRepository.save(job);
  }

  /**
   * Update job status with transition validation
   */
  async updateStatus(
    jobId: string,
    newStatus: CsvImportStatus,
    tenantId: string,
  ): Promise<MigrationJobEntity> {
    const job = await this.findById(jobId, tenantId);

    // Validate transition
    MigrationJobDomain.validateTransition(job.status, newStatus);

    job.status = newStatus;

    // Set timestamps based on status
    if (newStatus === CsvImportStatus.VALIDATING && !job.started_at) {
      job.started_at = new Date();
    }

    if (MigrationJobDomain.isTerminalStatus(newStatus)) {
      job.completed_at = new Date();
    }

    const updated = await this.jobRepository.save(job);

    // Send WebSocket notification
    this.notifyStatusChange(updated);

    return updated;
  }

  /**
   * Update job progress
   */
  async updateProgress(
    jobId: string,
    processed: number,
    valid: number,
    invalid: number,
    tenantId: string,
  ): Promise<void> {
    const job = await this.findById(jobId, tenantId);

    job.processed_rows = processed;
    job.valid_rows = valid;
    job.invalid_rows = invalid;

    await this.jobRepository.save(job);

    // Send progress update via WebSocket
    if (
      MigrationJobDomain.calculateProgress(processed, job.total_rows) % 10 ===
      0
    ) {
      this.notifyProgress(job);
    }
  }

  /**
   * Set total rows for job
   */
  async setTotalRows(
    jobId: string,
    totalRows: number,
    tenantId: string,
  ): Promise<void> {
    const job = await this.findById(jobId, tenantId);
    job.total_rows = totalRows;
    await this.jobRepository.save(job);
  }

  /**
   * Add errors to job
   */
  async addErrors(
    jobId: string,
    tenantId: string,
    errors: CsvRowError[],
  ): Promise<void> {
    const errorEntities = errors.map((error) =>
      this.errorRepository.create({
        tenant_id: tenantId,
        migration_job_id: jobId,
        row_number: error.rowNumber,
        error_type: error.errorType,
        field_name: error.field,
        error_message: error.message,
        received_value: error.value?.toString() || null,
        row_data: {}, // Will be populated by caller if needed
      }),
    );

    await this.errorRepository.save(errorEntities);

    // Update job metadata with error summary
    const job = await this.findById(jobId, tenantId);
    job.metadata = {
      ...job.metadata,
      errorSummary: MigrationJobDomain.generateErrorSummary(errors),
    };
    await this.jobRepository.save(job);
  }

  /**
   * Set error report URL
   */
  async setErrorReportUrl(
    jobId: string,
    url: string,
    tenantId: string,
  ): Promise<void> {
    const job = await this.findById(jobId, tenantId);
    job.error_report_url = url;
    await this.jobRepository.save(job);
  }

  /**
   * Mark job as failed with error message
   */
  async markFailed(
    jobId: string,
    errorMessage: string,
    tenantId: string,
  ): Promise<void> {
    const job = await this.findById(jobId, tenantId);

    MigrationJobDomain.validateTransition(job.status, CsvImportStatus.FAILED);

    job.status = CsvImportStatus.FAILED;
    job.error_message = errorMessage;
    job.completed_at = new Date();

    await this.jobRepository.save(job);
    this.notifyStatusChange(job);
  }

  /**
   * Rollback migration
   */
  async rollback(jobId: string, tenantId: string): Promise<MigrationJobEntity> {
    const job = await this.findById(jobId, tenantId);

    if (!MigrationJobDomain.canRollback(job.status)) {
      throw new BadRequestException(
        `Tidak dapat melakukan rollback untuk status: ${job.status}`,
      );
    }

    job.status = CsvImportStatus.ROLLED_BACK;
    job.completed_at = new Date();

    const updated = await this.jobRepository.save(job);
    this.notifyStatusChange(updated);

    return updated;
  }

  /**
   * Find job by ID
   */
  async findById(jobId: string, tenantId: string): Promise<MigrationJobEntity> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId, tenant_id: tenantId },
    });

    if (!job) {
      throw new NotFoundException(`Job migrasi tidak ditemukan`);
    }

    return job;
  }

  /**
   * List jobs with filters
   */
  async listJobs(
    tenantId: string,
    userId: string | null,
    filters: {
      import_type?: CsvImportType;
      status?: CsvImportStatus;
      page?: number;
      limit?: number;
    },
  ): Promise<{ jobs: MigrationJobResponseDto[]; total: number }> {
    const { import_type, status, page = 1, limit = 20 } = filters;

    const queryBuilder = this.jobRepository
      .createQueryBuilder("job")
      .where("job.tenant_id = :tenantId", { tenantId });

    if (userId) {
      queryBuilder.andWhere("job.user_id = :userId", { userId });
    }

    if (import_type) {
      queryBuilder.andWhere("job.import_type = :import_type", { import_type });
    }

    if (status) {
      queryBuilder.andWhere("job.status = :status", { status });
    }

    const [jobs, total] = await queryBuilder
      .orderBy("job.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const jobDtos = jobs.map((job) => this.toResponseDto(job));

    return { jobs: jobDtos, total };
  }

  /**
   * Get job errors
   */
  async getErrors(
    jobId: string,
    tenantId: string,
    page: number = 1,
    limit: number = 100,
  ): Promise<{ errors: MigrationErrorEntity[]; total: number }> {
    const [errors, total] = await this.errorRepository.findAndCount({
      where: { migration_job_id: jobId, tenant_id: tenantId },
      order: { row_number: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { errors, total };
  }

  /**
   * Delete job and related errors
   */
  async deleteJob(jobId: string, tenantId: string): Promise<void> {
    const job = await this.findById(jobId, tenantId);

    // Only allow deletion of completed/failed/rolled back jobs
    if (!MigrationJobDomain.isTerminalStatus(job.status)) {
      throw new BadRequestException(
        "Hanya job yang sudah selesai yang dapat dihapus",
      );
    }

    await this.jobRepository.remove(job);
  }

  /**
   * Convert entity to DTO
   */
  private toResponseDto(job: MigrationJobEntity): MigrationJobResponseDto {
    const progressPercentage = MigrationJobDomain.calculateSuccessRate(
      job.processed_rows,
      job.total_rows,
    );

    return new MigrationJobResponseDto({
      id: job.id,
      tenant_id: job.tenant_id,
      user_id: job.user_id,
      import_type: job.import_type,
      file_name: job.file_name,
      file_url: job.file_url,
      file_size: job.file_size,
      status: job.status,
      status_display: MigrationJobDomain.getStatusDisplayName(job.status),
      total_rows: job.total_rows,
      processed_rows: job.processed_rows,
      valid_rows: job.valid_rows,
      invalid_rows: job.invalid_rows,
      progress_percentage: progressPercentage,
      error_report_url: job.error_report_url,
      error_message: job.error_message,
      started_at: job.started_at,
      completed_at: job.completed_at,
      metadata: job.metadata,
      created_at: job.created_at,
      updated_at: job.updated_at,
    });
  }

  /**
   * Send WebSocket notification for status change
   */
  private notifyStatusChange(job: MigrationJobEntity): void {
    this.websocketGateway.broadcastToUser(job.user_id, job.tenant_id, {
      type: WebSocketEventType.MIGRATION_STATUS,
      data: {
        job_id: job.id,
        status: job.status,
        status_display: MigrationJobDomain.getStatusDisplayName(job.status),
      },
      tenantId: job.tenant_id,
      timestamp: new Date(),
    });
  }

  /**
   * Send WebSocket notification for progress update
   */
  private notifyProgress(job: MigrationJobEntity): void {
    const progress = MigrationJobDomain.calculateSuccessRate(
      job.processed_rows,
      job.total_rows,
    );

    this.websocketGateway.broadcastToUser(job.user_id, job.tenant_id, {
      type: WebSocketEventType.MIGRATION_PROGRESS,
      data: {
        job_id: job.id,
        processed: job.processed_rows,
        total: job.total_rows,
        progress_percentage: progress,
      },
      tenantId: job.tenant_id,
      timestamp: new Date(),
    });
  }
}
