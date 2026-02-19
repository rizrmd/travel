import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { WebhookDeliveryService } from "../services/webhook-delivery.service";

@Processor("webhook-delivery")
export class WebhookDeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookDeliveryProcessor.name);

  constructor(
    private readonly webhookDeliveryService: WebhookDeliveryService,
  ) {
    super();
  }

  async process(job: Job<{ deliveryId: string }>): Promise<void> {
    if (job.name === "process-delivery") {
      this.logger.log(`Processing webhook delivery: ${job.data.deliveryId}`);

      try {
        await this.webhookDeliveryService.processDelivery(job.data.deliveryId);
        this.logger.log(`Webhook delivery completed: ${job.data.deliveryId}`);
      } catch (error) {
        this.logger.error(
          `Webhook delivery failed: ${job.data.deliveryId}`,
          error,
        );
        throw error;
      }
    }
  }
}
