/**
 * Integration 4: Virtual Account Payment Gateway
 * Processor: Payment Notification Processing
 *
 * BullMQ processor that handles payment notifications from Midtrans
 * in the background. Processes notifications asynchronously with retry logic.
 */

import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { NotificationHandlerService } from "../services/notification-handler.service";

interface PaymentNotificationJobData {
  notificationId: string;
  tenantId: string;
}

@Processor("payment-notification", {
  concurrency: 5, // Process up to 5 notifications concurrently
})
export class PaymentNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentNotificationProcessor.name);

  constructor(
    private readonly notificationHandler: NotificationHandlerService,
  ) {
    super();
  }

  /**
   * Process payment notification job
   */
  async process(
    job: Job<PaymentNotificationJobData, any, string>,
  ): Promise<any> {
    const { notificationId, tenantId } = job.data;

    this.logger.log(
      `Processing payment notification: ${notificationId} (Job ${job.id})`,
    );

    try {
      // Set tenant context (if using RLS)
      // await this.dataSource.query(
      //   `SET LOCAL app.current_tenant_id = '${tenantId}'`
      // );

      // Process the notification
      await this.notificationHandler.processNotification(notificationId);

      // Update job progress
      await job.updateProgress(100);

      this.logger.log(
        `Payment notification processed successfully: ${notificationId}`,
      );

      return {
        success: true,
        notificationId,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to process payment notification ${notificationId}: ${error.message}`,
        error.stack,
      );

      // Re-throw to trigger BullMQ retry mechanism
      throw error;
    }
  }

  /**
   * Handle job completion
   */
  @OnWorkerEvent("completed")
  onCompleted(job: Job<PaymentNotificationJobData>) {
    this.logger.log(
      `Job ${job.id} completed for notification ${job.data.notificationId}`,
    );
  }

  /**
   * Handle job failure (after all retries)
   */
  @OnWorkerEvent("failed")
  onFailed(job: Job<PaymentNotificationJobData>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed permanently for notification ${job.data.notificationId}: ${error.message}`,
    );

    // TODO: Send alert to admin about failed payment processing
    // This is critical - a payment was received but couldn't be processed
  }

  /**
   * Handle job retry
   */
  @OnWorkerEvent("error")
  onError(error: Error) {
    this.logger.error(`Worker error: ${error.message}`, error.stack);
  }

  /**
   * Handle job progress
   */
  @OnWorkerEvent("progress")
  onProgress(job: Job<PaymentNotificationJobData>, progress: number) {
    this.logger.debug(
      `Job ${job.id} progress: ${progress}% for notification ${job.data.notificationId}`,
    );
  }

  /**
   * Handle job stalled (stuck/timeout)
   */
  @OnWorkerEvent("stalled")
  onStalled(jobId: string) {
    this.logger.warn(`Job ${jobId} has stalled - will be retried`);
  }

  /**
   * Handle job active
   */
  @OnWorkerEvent("active")
  onActive(job: Job<PaymentNotificationJobData>) {
    this.logger.debug(
      `Job ${job.id} is now active for notification ${job.data.notificationId}`,
    );
  }
}
