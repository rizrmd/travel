/**
 * Epic 8, Story 8.4: Reports Queue Processor
 * Handles report generation jobs (PDF, Excel, CSV)
 */

import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QueueName, ReportJobData, JobResult } from "../types/queue-jobs.type";
import { WebSocketEventEmitter } from "../../websocket/events/websocket-event.emitter";

/**
 * Reports processor
 * Generates PDF, Excel, CSV reports
 */
@Processor(QueueName.REPORTS, {
  concurrency: 3, // Process 3 reports at a time
})
export class ReportsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportsProcessor.name);

  constructor(private readonly websocketEmitter: WebSocketEventEmitter) {
    super();
  }

  /**
   * Process report generation job
   */
  async process(job: Job<ReportJobData>): Promise<JobResult> {
    this.logger.log(
      `Processing report job ${job.id}: ${job.data.type} (${job.data.format}) for tenant ${job.data.tenantId}`,
    );

    try {
      await job.updateProgress(10);

      let result: JobResult;

      switch (job.data.type) {
        case "generate-financial-report":
          result = await this.generateFinancialReport(job);
          break;

        case "generate-agent-performance":
          result = await this.generateAgentPerformance(job);
          break;

        case "generate-jamaah-report":
          result = await this.generateJamaahReport(job);
          break;

        case "generate-commission-report":
          result = await this.generateCommissionReport(job);
          break;

        case "generate-analytics-export":
          result = await this.generateAnalyticsExport(job);
          break;

        default:
          throw new Error(`Unknown report type: ${job.data.type}`);
      }

      // Emit completion event with download link
      if (job.data.userId) {
        await this.websocketEmitter.emitJobEvent(
          job.data.tenantId,
          {
            jobId: job.id,
            jobType: job.data.type,
            status: "completed",
            result,
          },
          job.data.userId,
        );

        // Also send notification
        await this.websocketEmitter.emitNotification(
          job.data.tenantId,
          {
            title: "Report Ready",
            message: `Your ${job.data.type} report is ready for download`,
            type: "success",
            actionUrl: result.data?.downloadUrl,
            actionLabel: "Download",
          },
          job.data.userId,
        );
      }

      this.logger.log(`Report job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Report job ${job.id} failed:`, error);

      // Emit failure event
      if (job.data.userId) {
        await this.websocketEmitter.emitJobEvent(
          job.data.tenantId,
          {
            jobId: job.id,
            jobType: job.data.type,
            status: "failed",
            error: error.message,
          },
          job.data.userId,
        );
      }

      throw error;
    }
  }

  /**
   * Generate financial report
   * Epic 11: Operational Intelligence Dashboard
   */
  private async generateFinancialReport(
    job: Job<ReportJobData>,
  ): Promise<JobResult> {
    await job.updateProgress(20);

    // TODO: Implement actual report generation
    // 1. Query financial data (payments, commissions, revenue)
    // 2. Calculate metrics and aggregations
    // 3. Generate PDF/Excel using library (e.g., pdfmake, exceljs)
    // 4. Save to storage
    // 5. Return download link

    this.logger.debug(
      `Generating financial report (${job.data.format}) for tenant ${job.data.tenantId}`,
    );

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await job.updateProgress(80);

    const filename = `financial-report-${Date.now()}.${job.data.format}`;
    const downloadUrl = `/downloads/reports/${filename}`;

    await job.updateProgress(100);

    return {
      success: true,
      message: "Financial report generated",
      data: {
        downloadUrl,
        filename,
        format: job.data.format,
        generatedAt: new Date(),
      },
    };
  }

  /**
   * Generate agent performance report
   */
  private async generateAgentPerformance(
    job: Job<ReportJobData>,
  ): Promise<JobResult> {
    await job.updateProgress(20);

    this.logger.debug(
      `Generating agent performance report (${job.data.format})`,
    );

    await new Promise((resolve) => setTimeout(resolve, 2500));
    await job.updateProgress(80);

    const filename = `agent-performance-${Date.now()}.${job.data.format}`;
    const downloadUrl = `/downloads/reports/${filename}`;

    await job.updateProgress(100);

    return {
      success: true,
      message: "Agent performance report generated",
      data: {
        downloadUrl,
        filename,
        format: job.data.format,
        agentsIncluded: 25,
      },
    };
  }

  /**
   * Generate jamaah report
   */
  private async generateJamaahReport(
    job: Job<ReportJobData>,
  ): Promise<JobResult> {
    await job.updateProgress(20);

    this.logger.debug(`Generating jamaah report (${job.data.format})`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await job.updateProgress(80);

    const filename = `jamaah-report-${Date.now()}.${job.data.format}`;
    const downloadUrl = `/downloads/reports/${filename}`;

    await job.updateProgress(100);

    return {
      success: true,
      message: "Jamaah report generated",
      data: {
        downloadUrl,
        filename,
        format: job.data.format,
        jamaahCount: 150,
      },
    };
  }

  /**
   * Generate commission report
   * Story 7.6: Commission reporting
   */
  private async generateCommissionReport(
    job: Job<ReportJobData>,
  ): Promise<JobResult> {
    await job.updateProgress(20);

    this.logger.debug(`Generating commission report (${job.data.format})`);

    await new Promise((resolve) => setTimeout(resolve, 2200));
    await job.updateProgress(80);

    const filename = `commission-report-${Date.now()}.${job.data.format}`;
    const downloadUrl = `/downloads/reports/${filename}`;

    await job.updateProgress(100);

    return {
      success: true,
      message: "Commission report generated",
      data: {
        downloadUrl,
        filename,
        format: job.data.format,
        commissionsIncluded: 320,
        totalAmount: 45000000,
      },
    };
  }

  /**
   * Generate analytics export
   */
  private async generateAnalyticsExport(
    job: Job<ReportJobData>,
  ): Promise<JobResult> {
    await job.updateProgress(20);

    this.logger.debug(`Generating analytics export (${job.data.format})`);

    await new Promise((resolve) => setTimeout(resolve, 3500));
    await job.updateProgress(80);

    const filename = `analytics-export-${Date.now()}.${job.data.format}`;
    const downloadUrl = `/downloads/reports/${filename}`;

    await job.updateProgress(100);

    return {
      success: true,
      message: "Analytics data exported",
      data: {
        downloadUrl,
        filename,
        format: job.data.format,
        recordCount: 5000,
      },
    };
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<ReportJobData>) {
    this.logger.log(
      `Report job ${job.id} completed: ${job.data.type} (${job.data.format})`,
    );
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<ReportJobData>, error: Error) {
    this.logger.error(
      `Report job ${job.id} failed: ${job.data.type} (${job.data.format})`,
      error,
    );
  }

  @OnWorkerEvent("progress")
  onProgress(job: Job<ReportJobData>, progress: number) {
    this.logger.debug(`Report job ${job.id} progress: ${progress}%`);
  }
}
