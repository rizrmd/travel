/**
 * Epic 8, Story 8.4: Email Queue Processor
 * Processes email jobs from the queue
 */

import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { QueueName, EmailJobData, JobResult } from "../types/queue-jobs.type";
import { WebSocketEventEmitter } from "../../websocket/events/websocket-event.emitter";

/**
 * Email processor
 * Handles all email sending jobs
 */
@Processor(QueueName.EMAIL, {
  concurrency: 5, // Process 5 emails concurrently
})
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly websocketEmitter: WebSocketEventEmitter) {
    super();
  }

  /**
   * Process email job
   */
  async process(job: Job<EmailJobData>): Promise<JobResult> {
    this.logger.debug(
      `Processing email job ${job.id}: ${job.data.type} to ${job.data.to}`,
    );

    try {
      // Update progress
      await job.updateProgress(10);

      // TODO: Integrate with email service (NodeMailer, SendGrid, etc.)
      // For now, simulate email sending
      await this.sendEmail(job.data);

      await job.updateProgress(80);

      // Emit success notification
      if (job.data.userId) {
        await this.websocketEmitter.emitJobEvent(
          job.data.tenantId,
          {
            jobId: job.id,
            jobType: job.data.type,
            status: "completed",
            result: { sentTo: job.data.to },
          },
          job.data.userId,
        );
      }

      await job.updateProgress(100);

      const result: JobResult = {
        success: true,
        message: `Email sent successfully to ${job.data.to}`,
        data: {
          type: job.data.type,
          sentTo: job.data.to,
          sentAt: new Date(),
        },
      };

      this.logger.log(`Email job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed:`, error);

      // Emit failure notification
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

      const result: JobResult = {
        success: false,
        message: "Email sending failed",
        error: error.message,
      };

      // TODO: Log to Sentry
      // await this.sentryService.captureException(error);

      throw error; // Re-throw to trigger retry
    }
  }

  /**
   * Send email (stub - replace with actual email service)
   */
  private async sendEmail(data: EmailJobData): Promise<void> {
    // TODO: Replace with actual email sending logic
    // Example with NodeMailer:
    // await this.mailerService.sendMail({
    //   to: data.to,
    //   subject: data.subject,
    //   template: data.template,
    //   context: data.data,
    //   attachments: data.attachments,
    // });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.logger.debug(`Email sent: ${data.type} to ${data.to} (simulated)`);
  }

  /**
   * Handle job completion
   */
  @OnWorkerEvent("completed")
  onCompleted(job: Job<EmailJobData>) {
    this.logger.log(
      `Email job ${job.id} completed: ${job.data.type} to ${job.data.to}`,
    );
  }

  /**
   * Handle job failure
   */
  @OnWorkerEvent("failed")
  onFailed(job: Job<EmailJobData>, error: Error) {
    this.logger.error(
      `Email job ${job.id} failed: ${job.data.type} to ${job.data.to}`,
      error,
    );
  }

  /**
   * Handle job progress
   */
  @OnWorkerEvent("progress")
  onProgress(job: Job<EmailJobData>, progress: number) {
    this.logger.debug(`Email job ${job.id} progress: ${progress}%`);
  }
}
