import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WebhookSubscriptionEntity } from "../infrastructure/persistence/relational/entities/webhook-subscription.entity";
import {
  WebhookSubscription,
  WebhookEvent,
} from "../domain/webhook-subscription";
import { CreateWebhookSubscriptionDto } from "../dto/create-webhook-subscription.dto";
import { WebhookSubscriptionResponseDto } from "../dto/webhook-subscription-response.dto";

@Injectable()
export class WebhookSubscriptionService {
  constructor(
    @InjectRepository(WebhookSubscriptionEntity)
    private readonly webhookSubscriptionRepository: Repository<WebhookSubscriptionEntity>,
  ) { }

  async subscribe(
    apiKeyId: string,
    tenantId: string,
    dto: CreateWebhookSubscriptionDto,
  ): Promise<WebhookSubscriptionResponseDto> {
    // Validate URL
    try {
      const url = new URL(dto.url);
      if (url.protocol !== "https:") {
        throw new BadRequestException("Webhook URL must use HTTPS");
      }
    } catch (error) {
      throw new BadRequestException("Invalid webhook URL");
    }

    const secret = WebhookSubscription.generateSecret();

    const subscription = this.webhookSubscriptionRepository.create({
      tenantId,
      apiKeyId,
      url: dto.url,
      events: dto.events as any,
      secret,
      isActive: true,
    } as any);

    const savedSubscription =
      (await this.webhookSubscriptionRepository.save(subscription)) as any;

    return {
      id: savedSubscription.id,
      url: savedSubscription.url,
      events: savedSubscription.events as any,
      secret: savedSubscription.secret,
      isActive: savedSubscription.isActive,
      createdAt: savedSubscription.createdAt,
      updatedAt: savedSubscription.updatedAt,
    };
  }

  async unsubscribe(subscriptionId: string, tenantId: string): Promise<void> {
    const subscription = await this.webhookSubscriptionRepository.findOne({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) {
      throw new BadRequestException("Webhook subscription not found");
    }

    await this.webhookSubscriptionRepository.remove(subscription);
  }

  async updateSubscription(
    subscriptionId: string,
    tenantId: string,
    updates: Partial<CreateWebhookSubscriptionDto>,
  ): Promise<WebhookSubscriptionResponseDto> {
    const subscription = await this.webhookSubscriptionRepository.findOne({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) {
      throw new BadRequestException("Webhook subscription not found");
    }

    if (updates.url) {
      try {
        const url = new URL(updates.url);
        if (url.protocol !== "https:") {
          throw new BadRequestException("Webhook URL must use HTTPS");
        }
        subscription.url = updates.url;
      } catch (error) {
        throw new BadRequestException("Invalid webhook URL");
      }
    }

    if (updates.events) {
      subscription.events = updates.events as any;
    }

    subscription.updatedAt = new Date();
    const savedSubscription =
      (await this.webhookSubscriptionRepository.save(subscription)) as any;

    return {
      id: savedSubscription.id,
      url: savedSubscription.url,
      events: savedSubscription.events as any,
      secret: savedSubscription.secret,
      isActive: savedSubscription.isActive,
      createdAt: savedSubscription.createdAt,
      updatedAt: savedSubscription.updatedAt,
    };
  }

  async listSubscriptions(
    apiKeyId: string,
    tenantId: string,
  ): Promise<WebhookSubscriptionResponseDto[]> {
    const subscriptions = await this.webhookSubscriptionRepository.find({
      where: { apiKeyId, tenantId },
      order: { createdAt: "DESC" },
    });

    return subscriptions.map((sub) => ({
      id: sub.id,
      url: sub.url,
      events: sub.events as any,
      secret: sub.secret,
      isActive: sub.isActive,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }));
  }

  async getSubscription(
    subscriptionId: string,
    tenantId: string,
  ): Promise<WebhookSubscriptionResponseDto> {
    const subscription = await this.webhookSubscriptionRepository.findOne({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) {
      throw new BadRequestException("Webhook subscription not found");
    }

    return {
      id: subscription.id,
      url: subscription.url,
      events: subscription.events as any,
      secret: subscription.secret,
      isActive: subscription.isActive,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  async getActiveSubscriptionsForEvent(
    tenantId: string,
    event: WebhookEvent,
  ): Promise<WebhookSubscriptionEntity[]> {
    const subscriptions = await this.webhookSubscriptionRepository
      .createQueryBuilder("subscription")
      .where("subscription.tenant_id = :tenantId", { tenantId })
      .andWhere("subscription.is_active = :isActive", { isActive: true })
      .andWhere(":event = ANY(subscription.events)", { event })
      .getMany();

    return subscriptions;
  }
}
