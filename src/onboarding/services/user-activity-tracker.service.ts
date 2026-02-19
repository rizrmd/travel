/**
 * Epic 13, Story 13.5: User Activity Tracker Service
 * Logs user activities for analytics
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  UserActivityEntity,
  ActivityType,
} from "../infrastructure/persistence/relational/entities/user-activity.entity";

export interface ActivityContext {
  pageUrl?: string;
  featureName?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class UserActivityTrackerService {
  constructor(
    @InjectRepository(UserActivityEntity)
    private activityRepository: Repository<UserActivityEntity>,
  ) {}

  /**
   * Track user login
   */
  async trackLogin(
    tenantId: string,
    userId: string,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(
      tenantId,
      userId,
      ActivityType.LOGIN,
      "User logged in",
      context,
    );
  }

  /**
   * Track user logout
   */
  async trackLogout(
    tenantId: string,
    userId: string,
    sessionDurationSeconds: number,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(tenantId, userId, ActivityType.LOGOUT, "User logged out", {
      ...context,
      metadata: {
        ...context.metadata,
        sessionDurationSeconds,
      },
    });
  }

  /**
   * Track page view
   */
  async trackPageView(
    tenantId: string,
    userId: string,
    pageUrl: string,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(
      tenantId,
      userId,
      ActivityType.PAGE_VIEW,
      `Viewed page: ${pageUrl}`,
      {
        ...context,
        pageUrl,
      },
    );
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(
    tenantId: string,
    userId: string,
    featureName: string,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(
      tenantId,
      userId,
      ActivityType.FEATURE_USED,
      `Used feature: ${featureName}`,
      {
        ...context,
        featureName,
      },
    );
  }

  /**
   * Track training started
   */
  async trackTrainingStarted(
    tenantId: string,
    userId: string,
    materialId: string,
    materialTitle: string,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(
      tenantId,
      userId,
      ActivityType.TRAINING_STARTED,
      `Started training: ${materialTitle}`,
      {
        ...context,
        metadata: { materialId, materialTitle },
      },
    );
  }

  /**
   * Track training completed
   */
  async trackTrainingCompleted(
    tenantId: string,
    userId: string,
    materialId: string,
    materialTitle: string,
    context: ActivityContext,
  ): Promise<void> {
    await this.track(
      tenantId,
      userId,
      ActivityType.TRAINING_COMPLETED,
      `Completed training: ${materialTitle}`,
      {
        ...context,
        metadata: { materialId, materialTitle },
      },
    );
  }

  /**
   * Generic track method
   */
  private async track(
    tenantId: string,
    userId: string,
    activityType: ActivityType,
    description: string,
    context: ActivityContext,
  ): Promise<void> {
    try {
      const activity = this.activityRepository.create({
        tenant_id: tenantId,
        user_id: userId,
        activity_type: activityType,
        activity_description: description,
        page_url: context.pageUrl || null,
        feature_name: context.featureName || null,
        ip_address: context.ipAddress || null,
        user_agent: context.userAgent || null,
        session_id: context.sessionId || null,
        metadata: context.metadata || null,
      });

      await this.activityRepository.save(activity);
    } catch (error) {
      // Log error but don't throw - activity tracking should not break main flow
      console.error("Failed to track user activity:", error);
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivityLog(
    tenantId: string,
    userId: string,
    limit: number = 100,
  ): Promise<UserActivityEntity[]> {
    return await this.activityRepository.find({
      where: { tenant_id: tenantId, user_id: userId },
      order: { created_at: "DESC" },
      take: limit,
    });
  }

  /**
   * Clean up old activity logs (retention policy)
   */
  async cleanupOldLogs(days: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.activityRepository
      .createQueryBuilder()
      .delete()
      .where("created_at < :cutoffDate", { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}
