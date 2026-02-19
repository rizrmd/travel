/**
 * Epic 8, Story 8.4: Queue Service
 * Service for adding jobs to BullMQ queues
 */

import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue, Job } from "bullmq";
import {
  QueueName,
  EmailJobData,
  WhatsAppJobData,
  BatchImportJobData,
  ReportJobData,
  PaymentReminderJobData,
  CommissionGenerationJobData,
  QueueJobOptions,
  JobResult,
} from "../types/queue-jobs.type";

/**
 * Service to add jobs to queues
 * Usage: Inject this service and call addJob methods
 */
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QueueName.EMAIL) private emailQueue: Queue,
    @InjectQueue(QueueName.NOTIFICATIONS)
    private notificationsQueue: Queue,
    @InjectQueue(QueueName.BATCH_PROCESSING)
    private batchQueue: Queue,
    @InjectQueue(QueueName.REPORTS) private reportsQueue: Queue,
  ) { }

  /**
   * Default job options
   */
  private readonly defaultOptions: QueueJobOptions = {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // Start with 5 seconds
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500, // Keep last 500 failed jobs for debugging
  };

  /**
   * Add email job to queue
   */
  async addEmailJob(
    data: EmailJobData,
    options?: QueueJobOptions,
  ): Promise<Job<EmailJobData>> {
    this.logger.debug(
      `Adding email job: ${data.type} to ${data.to} for tenant ${data.tenantId}`,
    );

    const job = await this.emailQueue.add(
      data.type,
      data,
      this.mergeOptions(options),
    );

    this.logger.log(`Email job added: ${job.id}`);
    return job;
  }

  /**
   * Add notification job to queue
   */
  async addNotificationJob(
    data: WhatsAppJobData,
    options?: QueueJobOptions,
  ): Promise<Job<WhatsAppJobData>> {
    this.logger.debug(
      `Adding notification job: ${data.type} to ${data.to} for tenant ${data.tenantId}`,
    );

    const job = await this.notificationsQueue.add(
      data.type,
      data,
      this.mergeOptions(options),
    );

    this.logger.log(`Notification job added: ${job.id}`);
    return job;
  }

  /**
   * Add batch processing job to queue
   */
  async addBatchJob(
    data:
      | BatchImportJobData
      | PaymentReminderJobData
      | CommissionGenerationJobData,
    options?: QueueJobOptions,
  ): Promise<Job> {
    this.logger.debug(
      `Adding batch job: ${data.type} for tenant ${data.tenantId}`,
    );

    const job = await this.batchQueue.add(
      data.type,
      data,
      this.mergeOptions(options),
    );

    this.logger.log(`Batch job added: ${job.id}`);
    return job;
  }

  /**
   * Add report generation job to queue
   */
  async addReportJob(
    data: ReportJobData,
    options?: QueueJobOptions,
  ): Promise<Job<ReportJobData>> {
    this.logger.debug(
      `Adding report job: ${data.type} (${data.format}) for tenant ${data.tenantId}`,
    );

    // Reports may take longer, so increase attempts
    const reportOptions = this.mergeOptions({
      ...options,
      attempts: options?.attempts || 5,
    });

    const job = await this.reportsQueue.add(data.type, data, reportOptions);

    this.logger.log(`Report job added: ${job.id}`);
    return job;
  }

  /**
   * Get job by ID from any queue
   */
  async getJob(queueName: QueueName, jobId: string): Promise<Job | null> {
    const queue = this.getQueueByName(queueName);
    return await queue.getJob(jobId);
  }

  /**
   * Get job status and result
   */
  async getJobStatus(
    queueName: QueueName,
    jobId: string,
  ): Promise<{
    state: string;
    progress: number;
    result?: JobResult;
    error?: string;
  } | null> {
    const job = await this.getJob(queueName, jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress as number;

    return {
      state,
      progress,
      result: job.returnvalue as JobResult,
      error: job.failedReason,
    };
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(queueName: QueueName): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.getQueueByName(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Get all queue metrics
   */
  async getAllQueueMetrics(): Promise<
    Record<
      QueueName,
      {
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
      }
    >
  > {
    const metrics = {} as any;

    for (const queueName of Object.values(QueueName)) {
      metrics[queueName] = await this.getQueueMetrics(queueName);
    }

    return metrics;
  }

  /**
   * Cancel/remove job
   */
  async cancelJob(queueName: QueueName, jobId: string): Promise<void> {
    const job = await this.getJob(queueName, jobId);

    if (job) {
      await job.remove();
      this.logger.log(`Job ${jobId} cancelled from queue ${queueName}`);
    }
  }

  /**
   * Retry failed job
   */
  async retryJob(queueName: QueueName, jobId: string): Promise<void> {
    const job = await this.getJob(queueName, jobId);

    if (job) {
      await job.retry();
      this.logger.log(`Job ${jobId} retried in queue ${queueName}`);
    }
  }

  /**
   * Clean old jobs from queue
   */
  async cleanQueue(
    queueName: QueueName,
    grace: number = 24 * 3600 * 1000, // 24 hours
    status: "completed" | "failed" = "completed",
  ): Promise<string[]> {
    const queue = this.getQueueByName(queueName);
    const cleaned = await queue.clean(grace, 1000, status);

    this.logger.log(
      `Cleaned ${cleaned.length} ${status} jobs from queue ${queueName}`,
    );

    return cleaned;
  }

  /**
   * Add generic job (compatibility)
   */
  async addJob(queueName: string, jobName: string, data: any): Promise<Job> {
    let queue: Queue;

    switch (queueName) {
      case QueueName.EMAIL:
        queue = this.emailQueue;
        break;
      case QueueName.NOTIFICATIONS:
        queue = this.notificationsQueue;
        break;
      case QueueName.BATCH_PROCESSING:
        queue = this.batchQueue;
        break;
      case QueueName.REPORTS:
        queue = this.reportsQueue;
        break;
      case "payment-notification":
        queue = this.batchQueue;
        break;
      default:
        this.logger.warn(`Unknown queue: ${queueName}, using batch queue`);
        queue = this.batchQueue;
    }

    return await queue.add(jobName, data, this.defaultOptions);
  }

  /**
   * Helper: Get queue instance by name
   */
  private getQueueByName(queueName: QueueName): Queue {
    switch (queueName) {
      case QueueName.EMAIL:
        return this.emailQueue;
      case QueueName.NOTIFICATIONS:
        return this.notificationsQueue;
      case QueueName.BATCH_PROCESSING:
        return this.batchQueue;
      case QueueName.REPORTS:
        return this.reportsQueue;
      default:
        throw new Error(`Unknown queue name: ${queueName}`);
    }
  }

  /**
   * Helper: Merge job options with defaults
   */
  private mergeOptions(options?: QueueJobOptions): QueueJobOptions {
    return {
      ...this.defaultOptions,
      ...options,
      backoff: {
        ...this.defaultOptions.backoff,
        ...options?.backoff,
      },
    };
  }
}
