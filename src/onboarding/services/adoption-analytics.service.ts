/**
 * Epic 13, Story 13.5: Adoption Analytics Service
 * Calculates user adoption and training metrics
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import {
  UserActivityEntity,
  ActivityType,
} from "../infrastructure/persistence/relational/entities/user-activity.entity";
import { TrainingProgressEntity } from "../infrastructure/persistence/relational/entities/training-progress.entity";
import { TrainingMaterialEntity } from "../infrastructure/persistence/relational/entities/training-material.entity";
import { TrainingProgressStatus } from "../domain/training-progress";
import {
  AdoptionMetricsResponseDto,
  InactiveUserDto,
} from "../dto/adoption-metrics-response.dto";

@Injectable()
export class AdoptionAnalyticsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserActivityEntity)
    private activityRepository: Repository<UserActivityEntity>,
    @InjectRepository(TrainingProgressEntity)
    private progressRepository: Repository<TrainingProgressEntity>,
    @InjectRepository(TrainingMaterialEntity)
    private materialRepository: Repository<TrainingMaterialEntity>,
  ) {}

  /**
   * Get comprehensive adoption metrics
   */
  async getAdoptionMetrics(
    tenantId: string,
    days: number = 7,
    inactiveThresholdDays: number = 14,
  ): Promise<AdoptionMetricsResponseDto> {
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);

    const [
      totalUsers,
      activeUsersLast7Days,
      trainingMetrics,
      sessionMetrics,
      activityBreakdown,
      topFeatures,
      dailyActiveUsers,
    ] = await Promise.all([
      this.getTotalUsers(tenantId),
      this.getActiveUsersLast7Days(tenantId, periodStart),
      this.getTrainingMetrics(tenantId),
      this.getSessionMetrics(tenantId, periodStart),
      this.getActivityBreakdown(tenantId, periodStart),
      this.getTopFeaturesUsed(tenantId, periodStart),
      this.getDailyActiveUsers(tenantId, periodStart),
    ]);

    const inactiveUsers = totalUsers - activeUsersLast7Days;

    return new AdoptionMetricsResponseDto({
      total_users: totalUsers,
      active_users_last_7_days: activeUsersLast7Days,
      active_users_percentage: Math.round(
        (activeUsersLast7Days / totalUsers) * 100,
      ),
      inactive_users: inactiveUsers,
      inactive_users_percentage: Math.round((inactiveUsers / totalUsers) * 100),
      training_completion_rate: trainingMetrics.completionRate,
      users_completed_mandatory_training: trainingMetrics.completedMandatory,
      users_with_training_progress: trainingMetrics.usersWithProgress,
      average_session_duration_minutes: sessionMetrics.avgDuration,
      total_sessions_last_7_days: sessionMetrics.totalSessions,
      activity_by_type: activityBreakdown,
      top_features_used: topFeatures,
      daily_active_users: dailyActiveUsers,
      period_start: periodStart,
      period_end: new Date(),
      generated_at: new Date(),
    });
  }

  /**
   * Get inactive users list
   */
  async getInactiveUsers(
    tenantId: string,
    inactiveDays: number = 14,
  ): Promise<InactiveUserDto[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - inactiveDays);

    const users = await this.userRepository.find({
      where: { tenantId },
      select: ["id", "fullName", "email", "role", "lastLoginAt", "createdAt"],
    });

    const inactiveUsers: InactiveUserDto[] = [];

    for (const user of users) {
      if (!user.lastLoginAt || user.lastLoginAt < thresholdDate) {
        const daysSinceLogin = user.lastLoginAt
          ? Math.floor(
              (new Date().getTime() - user.lastLoginAt.getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : 999;

        const totalLogins = await this.activityRepository.count({
          where: {
            tenant_id: tenantId,
            user_id: user.id,
            activity_type: ActivityType.LOGIN,
          },
        });

        // Calculate training completion
        const [totalMandatory, completed] = await Promise.all([
          this.materialRepository.count({
            where: { tenant_id: tenantId, is_mandatory: true },
          }),
          this.progressRepository.count({
            where: {
              tenant_id: tenantId,
              user_id: user.id,
              status: TrainingProgressStatus.COMPLETED,
            },
          }),
        ]);

        const completionPercentage =
          totalMandatory > 0
            ? Math.round((completed / totalMandatory) * 100)
            : 0;

        inactiveUsers.push(
          new InactiveUserDto({
            id: user.id,
            full_name: user.fullName,
            email: user.email,
            role: user.role,
            last_login_at: user.lastLoginAt,
            days_since_last_login: daysSinceLogin,
            total_logins: totalLogins,
            training_completion_percentage: completionPercentage,
            created_at: user.createdAt,
          }),
        );
      }
    }

    return inactiveUsers.sort(
      (a, b) => b.days_since_last_login - a.days_since_last_login,
    );
  }

  private async getTotalUsers(tenantId: string): Promise<number> {
    return await this.userRepository.count({ where: { tenantId } });
  }

  private async getActiveUsersLast7Days(
    tenantId: string,
    since: Date,
  ): Promise<number> {
    const result = await this.activityRepository
      .createQueryBuilder("activity")
      .select("COUNT(DISTINCT activity.user_id)", "count")
      .where("activity.tenant_id = :tenantId", { tenantId })
      .andWhere("activity.created_at >= :since", { since })
      .getRawOne();

    return parseInt(result.count) || 0;
  }

  private async getTrainingMetrics(tenantId: string): Promise<{
    completionRate: number;
    completedMandatory: number;
    usersWithProgress: number;
  }> {
    const totalUsers = await this.getTotalUsers(tenantId);
    const totalMandatory = await this.materialRepository.count({
      where: { tenant_id: tenantId, is_mandatory: true },
    });

    const usersWithProgress = await this.progressRepository
      .createQueryBuilder("progress")
      .select("COUNT(DISTINCT progress.user_id)", "count")
      .where("progress.tenant_id = :tenantId", { tenantId })
      .getRawOne();

    // Count users who completed all mandatory training
    const completedMandatory = 0; // Complex calculation needed

    const completionRate =
      totalUsers > 0
        ? Math.round((parseInt(usersWithProgress.count) / totalUsers) * 100)
        : 0;

    return {
      completionRate,
      completedMandatory,
      usersWithProgress: parseInt(usersWithProgress.count) || 0,
    };
  }

  private async getSessionMetrics(
    tenantId: string,
    since: Date,
  ): Promise<{ avgDuration: number; totalSessions: number }> {
    const sessions = await this.activityRepository.find({
      where: {
        tenant_id: tenantId,
        activity_type: ActivityType.LOGOUT,
        created_at: MoreThan(since),
      },
      select: ["session_duration_seconds"],
    });

    const totalDuration = sessions.reduce(
      (sum, s) => sum + (s.session_duration_seconds || 0),
      0,
    );

    return {
      avgDuration:
        sessions.length > 0
          ? Math.round(totalDuration / sessions.length / 60)
          : 0,
      totalSessions: sessions.length,
    };
  }

  private async getActivityBreakdown(
    tenantId: string,
    since: Date,
  ): Promise<{ activity_type: string; count: number; percentage: number }[]> {
    const activities = await this.activityRepository.find({
      where: { tenant_id: tenantId, created_at: MoreThan(since) },
      select: ["activity_type"],
    });

    const totalCount = activities.length;
    const breakdown = new Map<string, number>();

    activities.forEach((a) => {
      breakdown.set(a.activity_type, (breakdown.get(a.activity_type) || 0) + 1);
    });

    return Array.from(breakdown.entries())
      .map(([activity_type, count]) => ({
        activity_type,
        count,
        percentage: Math.round((count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }

  private async getTopFeaturesUsed(
    tenantId: string,
    since: Date,
  ): Promise<{ feature_name: string; usage_count: number }[]> {
    const features = await this.activityRepository
      .createQueryBuilder("activity")
      .select("activity.feature_name", "feature_name")
      .addSelect("COUNT(*)", "usage_count")
      .where("activity.tenant_id = :tenantId", { tenantId })
      .andWhere("activity.created_at >= :since", { since })
      .andWhere("activity.feature_name IS NOT NULL")
      .groupBy("activity.feature_name")
      .orderBy("COUNT(*)", "DESC")
      .limit(10)
      .getRawMany();

    return features.map((f) => ({
      feature_name: f.feature_name,
      usage_count: parseInt(f.usage_count),
    }));
  }

  private async getDailyActiveUsers(
    tenantId: string,
    since: Date,
  ): Promise<{ date: string; active_users: number }[]> {
    const dailyData = await this.activityRepository
      .createQueryBuilder("activity")
      .select("DATE(activity.created_at)", "date")
      .addSelect("COUNT(DISTINCT activity.user_id)", "active_users")
      .where("activity.tenant_id = :tenantId", { tenantId })
      .andWhere("activity.created_at >= :since", { since })
      .groupBy("DATE(activity.created_at)")
      .orderBy("DATE(activity.created_at)", "ASC")
      .getRawMany();

    return dailyData.map((d) => ({
      date: d.date,
      active_users: parseInt(d.active_users),
    }));
  }
}
