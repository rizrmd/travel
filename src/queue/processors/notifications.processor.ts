/**
 * Epic 8, Story 8.4: Notifications Queue Processor
 * Processes WhatsApp, SMS, and push notification jobs
 */

import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import {
  QueueName,
  WhatsAppJobData,
  JobResult,
} from "../types/queue-jobs.type";
import { WebSocketEventEmitter } from "../../websocket/events/websocket-event.emitter";

/**
 * Notifications processor
 * Handles WhatsApp, SMS, and push notifications
 */
@Processor(QueueName.NOTIFICATIONS, {
  concurrency: 10, // Process 10 notifications concurrently
})
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly websocketEmitter: WebSocketEventEmitter) {
    super();
  }

  /**
   * Process notification job
   */
  async process(job: Job<WhatsAppJobData>): Promise<JobResult> {
    this.logger.debug(
      `Processing notification job ${job.id}: ${job.data.type} to ${job.data.to}`,
    );

    try {
      await job.updateProgress(10);

      // Send notification based on type
      switch (job.data.type) {
        case "send-whatsapp":
          await this.sendWhatsApp(job.data);
          break;
        case "send-sms":
          await this.sendSMS(job.data);
          break;
        case "send-push":
          await this.sendPushNotification(job.data);
          break;
        case "send-in-app":
          await this.sendInAppNotification(job.data);
          break;
        default:
          throw new Error(`Unknown notification type: ${job.data.type}`);
      }

      await job.updateProgress(80);

      // Emit success event
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
        message: `Notification sent successfully to ${job.data.to}`,
        data: {
          type: job.data.type,
          sentTo: job.data.to,
          sentAt: new Date(),
        },
      };

      this.logger.log(`Notification job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Notification job ${job.id} failed:`, error);

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
   * Send WhatsApp message (stub)
   */
  private async sendWhatsApp(data: WhatsAppJobData): Promise<void> {
    // TODO: Integrate with WhatsApp Business API
    // await this.whatsappService.sendMessage({
    //   to: data.to,
    //   message: data.message,
    //   template: data.templateName,
    //   params: data.templateParams,
    // });

    await new Promise((resolve) => setTimeout(resolve, 300));
    this.logger.debug(`WhatsApp sent to ${data.to} (simulated)`);
  }

  /**
   * Send SMS (stub)
   */
  private async sendSMS(data: WhatsAppJobData): Promise<void> {
    // TODO: Integrate with SMS provider (Twilio, etc.)
    // await this.smsService.send({
    //   to: data.to,
    //   message: data.message,
    // });

    await new Promise((resolve) => setTimeout(resolve, 200));
    this.logger.debug(`SMS sent to ${data.to} (simulated)`);
  }

  /**
   * Send push notification (stub)
   */
  private async sendPushNotification(data: WhatsAppJobData): Promise<void> {
    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    // await this.pushService.send({
    //   to: data.to,
    //   title: data.title,
    //   message: data.message,
    // });

    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.debug(`Push notification sent to ${data.to} (simulated)`);
  }

  /**
   * Send in-app notification via WebSocket
   */
  private async sendInAppNotification(data: WhatsAppJobData): Promise<void> {
    // Use WebSocket to send real-time in-app notification
    await this.websocketEmitter.emitNotification(
      data.tenantId,
      {
        title: "Notification",
        message: data.message,
        type: "info",
      },
      Array.isArray(data.to) ? undefined : data.to,
    );

    this.logger.debug(`In-app notification sent to ${data.to}`);
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<WhatsAppJobData>) {
    this.logger.log(
      `Notification job ${job.id} completed: ${job.data.type} to ${job.data.to}`,
    );
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<WhatsAppJobData>, error: Error) {
    this.logger.error(
      `Notification job ${job.id} failed: ${job.data.type} to ${job.data.to}`,
      error,
    );
  }
}
