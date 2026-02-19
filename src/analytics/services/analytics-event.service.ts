/**
 * Epic 11: Analytics Event Service
 * Track and manage analytics events
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AnalyticsEventEntity,
  AnalyticsEventType,
  AnalyticsEntityType,
} from "../infrastructure/persistence/relational/entities/analytics-event.entity";
import { RevenueMetricsService } from "./revenue-metrics.service";
import { PipelineAnalyticsService } from "./pipeline-analytics.service";
import { LeaderboardService } from "./leaderboard.service";

@Injectable()
export class AnalyticsEventService {
  constructor(
    @InjectRepository(AnalyticsEventEntity)
    private analyticsEventRepository: Repository<AnalyticsEventEntity>,
    private revenueMetricsService: RevenueMetricsService,
    private pipelineAnalyticsService: PipelineAnalyticsService,
    private leaderboardService: LeaderboardService,
  ) {}

  /**
   * Track analytics event
   */
  async trackEvent(
    tenantId: string,
    eventType: AnalyticsEventType,
    entityType: AnalyticsEntityType,
    entityId: string,
    userId: string | null = null,
    metadata: Record<string, any> | null = null,
  ): Promise<void> {
    // Create event
    const event = this.analyticsEventRepository.create({
      tenant_id: tenantId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId,
      metadata,
    });

    await this.analyticsEventRepository.save(event);

    // Invalidate relevant caches
    await this.invalidateCaches(tenantId, eventType);
  }

  /**
   * Track payment confirmed event
   */
  async trackPaymentConfirmed(
    tenantId: string,
    paymentId: string,
    amount: number,
    jamaahId: string,
    packageId: string,
    userId: string,
  ): Promise<void> {
    await this.trackEvent(
      tenantId,
      AnalyticsEventType.PAYMENT_CONFIRMED,
      AnalyticsEntityType.PAYMENT,
      paymentId,
      userId,
      {
        amount,
        jamaahId,
        packageId,
      },
    );
  }

  /**
   * Track jamaah created event
   */
  async trackJamaahCreated(
    tenantId: string,
    jamaahId: string,
    agentId: string,
    packageId: string,
    userId: string,
  ): Promise<void> {
    await this.trackEvent(
      tenantId,
      AnalyticsEventType.JAMAAH_CREATED,
      AnalyticsEntityType.JAMAAH,
      jamaahId,
      userId,
      {
        agentId,
        packageId,
      },
    );
  }

  /**
   * Track jamaah status changed event
   */
  async trackStatusChanged(
    tenantId: string,
    jamaahId: string,
    previousStatus: string,
    newStatus: string,
    userId: string,
  ): Promise<void> {
    await this.trackEvent(
      tenantId,
      AnalyticsEventType.JAMAAH_STATUS_CHANGED,
      AnalyticsEntityType.JAMAAH,
      jamaahId,
      userId,
      {
        previousStatus,
        newStatus,
      },
    );
  }

  /**
   * Get recent events
   */
  async getRecentEvents(
    tenantId: string,
    limit: number = 50,
  ): Promise<AnalyticsEventEntity[]> {
    return this.analyticsEventRepository.find({
      where: { tenant_id: tenantId },
      order: { created_at: "DESC" },
      take: limit,
    });
  }

  /**
   * Invalidate caches based on event type
   */
  private async invalidateCaches(
    tenantId: string,
    eventType: AnalyticsEventType,
  ): Promise<void> {
    switch (eventType) {
      case AnalyticsEventType.PAYMENT_CONFIRMED:
        await this.revenueMetricsService.invalidateCache(tenantId);
        await this.leaderboardService.invalidateCache(tenantId);
        break;

      case AnalyticsEventType.JAMAAH_CREATED:
      case AnalyticsEventType.JAMAAH_STATUS_CHANGED:
        await this.pipelineAnalyticsService.invalidateCache(tenantId);
        await this.leaderboardService.invalidateCache(tenantId);
        break;

      default:
        // No cache invalidation needed
        break;
    }
  }
}
