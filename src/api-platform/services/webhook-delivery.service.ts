import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import * as crypto from "crypto";
import axios from "axios";
import {
  WebhookDeliveryEntity,
  WebhookDeliveryStatusEnum,
} from "../infrastructure/persistence/relational/entities/webhook-delivery.entity";
import { WebhookSubscriptionEntity } from "../infrastructure/persistence/relational/entities/webhook-subscription.entity";
import { WebhookEvent } from "../domain/webhook-subscription";
import { WebhookDeliveryResponseDto } from "../dto/webhook-delivery-response.dto";

@Injectable()
export class WebhookDeliveryService {
  private readonly logger = new Logger(WebhookDeliveryService.name);

  constructor(
    @InjectRepository(WebhookDeliveryEntity)
    private readonly webhookDeliveryRepository: Repository<WebhookDeliveryEntity>,
    @InjectRepository(WebhookSubscriptionEntity)
    private readonly webhookSubscriptionRepository: Repository<WebhookSubscriptionEntity>,
    @InjectQueue("webhook-delivery")
    private readonly webhookQueue: Queue,
  ) { }

  async deliverWebhook(
    subscriptionId: string,
    tenantId: string,
    eventType: WebhookEvent,
    payload: any,
  ): Promise<string> {
    const delivery = this.webhookDeliveryRepository.create({
      tenantId,
      subscriptionId,
      eventType,
      payload,
      status: WebhookDeliveryStatusEnum.PENDING,
      attemptCount: 0,
    });

    const savedDelivery = await this.webhookDeliveryRepository.save(delivery);

    // Queue for immediate delivery
    await this.webhookQueue.add("process-delivery", {
      deliveryId: savedDelivery.id,
    });

    return savedDelivery.id;
  }

  async processDelivery(deliveryId: string): Promise<void> {
    const delivery = await this.webhookDeliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ["subscription"],
    });

    if (!delivery || !delivery.subscription) {
      this.logger.error(`Delivery ${deliveryId} not found`);
      return;
    }

    try {
      const signature = this.generateSignature(
        delivery.payload,
        delivery.subscription.secret,
      );

      const timestamp = Date.now();

      const response = await axios.post(
        delivery.subscription.url,
        {
          event: delivery.eventType,
          timestamp: new Date().toISOString(),
          data: delivery.payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Timestamp": timestamp.toString(),
            "X-Webhook-Event": delivery.eventType,
          },
          timeout: 30000, // 30 seconds
        },
      );

      // Mark as delivered
      delivery.status = WebhookDeliveryStatusEnum.DELIVERED;
      delivery.httpStatus = response.status;
      delivery.responseBody = JSON.stringify(response.data);
      delivery.deliveredAt = new Date();
      delivery.nextRetryAt = null;

      await this.webhookDeliveryRepository.save(delivery);

      this.logger.log(`Webhook delivered successfully: ${deliveryId}`);
    } catch (error) {
      this.logger.error(`Webhook delivery failed: ${deliveryId}`, error);

      delivery.attemptCount += 1;
      delivery.httpStatus = error.response?.status;
      delivery.responseBody = error.message;

      if (delivery.attemptCount >= 3) {
        delivery.status = WebhookDeliveryStatusEnum.MAX_RETRIES_EXCEEDED;
        delivery.nextRetryAt = null;
      } else {
        delivery.status = WebhookDeliveryStatusEnum.FAILED;
        // Calculate next retry
        const delays = [60000, 300000, 1800000]; // 1min, 5min, 30min
        const delay = delays[delivery.attemptCount - 1];
        delivery.nextRetryAt = new Date(Date.now() + delay);

        // Schedule retry
        await this.webhookQueue.add(
          "process-delivery",
          { deliveryId: delivery.id },
          { delay },
        );
      }

      await this.webhookDeliveryRepository.save(delivery);
    }
  }

  async retryDelivery(deliveryId: string, tenantId: string): Promise<void> {
    const delivery = await this.webhookDeliveryRepository.findOne({
      where: { id: deliveryId, tenantId },
    });

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (delivery.status === WebhookDeliveryStatusEnum.DELIVERED) {
      throw new Error("Delivery already succeeded");
    }

    // Reset and queue
    delivery.status = WebhookDeliveryStatusEnum.PENDING;
    delivery.attemptCount = 0;
    delivery.nextRetryAt = null;
    await this.webhookDeliveryRepository.save(delivery);

    await this.webhookQueue.add("process-delivery", {
      deliveryId: delivery.id,
    });
  }

  generateSignature(payload: any, secret: string): string {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac("sha256", secret)
      .update(payloadString)
      .digest("hex");
  }

  verifySignature(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return signature === expectedSignature;
  }

  async getDeliveryLogs(
    subscriptionId: string,
    tenantId: string,
  ): Promise<WebhookDeliveryResponseDto[]> {
    const deliveries = await this.webhookDeliveryRepository.find({
      where: { subscriptionId, tenantId },
      order: { createdAt: "DESC" },
      take: 100,
    });

    return deliveries.map((d) => ({
      id: d.id,
      subscriptionId: d.subscriptionId,
      eventType: d.eventType,
      status: d.status,
      httpStatus: d.httpStatus,
      responseBody: d.responseBody,
      attemptCount: d.attemptCount,
      nextRetryAt: d.nextRetryAt,
      deliveredAt: d.deliveredAt,
      createdAt: d.createdAt,
    }));
  }

  async getPendingRetries(): Promise<WebhookDeliveryEntity[]> {
    return this.webhookDeliveryRepository.find({
      where: {
        status: WebhookDeliveryStatusEnum.FAILED,
        nextRetryAt: LessThanOrEqual(new Date()),
      },
    });
  }
}
