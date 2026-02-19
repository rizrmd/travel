/**
 * Epic 13, Story 13.5: Adoption Analytics Controller
 * Provides adoption metrics and user activity data (4 endpoints)
 */

import { Controller, Get, Param, Query, UseGuards, Res } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/domain/user";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { AdoptionAnalyticsService } from "./services/adoption-analytics.service";
import { UserActivityTrackerService } from "./services/user-activity-tracker.service";
import { AdoptionMetricsQueryDto } from "./dto/adoption-metrics-query.dto";

@Controller("api/v1/onboarding/analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdoptionAnalyticsController {
  constructor(
    private analyticsService: AdoptionAnalyticsService,
    private activityTrackerService: UserActivityTrackerService,
  ) { }

  /**
   * 1. Get adoption metrics
   * GET /api/v1/onboarding/analytics/adoption
   */
  @Get("adoption")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async getAdoptionMetrics(
    @Query() query: AdoptionMetricsQueryDto,
    @GetUser() user: any,
  ) {
    return await this.analyticsService.getAdoptionMetrics(
      user.tenantId,
      query.days,
      query.inactive_threshold_days,
    );
  }

  /**
   * 2. Get user activity log
   * GET /api/v1/onboarding/analytics/users/:id/activity
   */
  @Get("users/:id/activity")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async getUserActivity(
    @Param("id") userId: string,
    @GetUser() user: any,
    @Query("limit") limit?: number,
  ) {
    const activities = await this.activityTrackerService.getUserActivityLog(
      user.tenantId,
      userId,
      limit || 100,
    );

    return {
      user_id: userId,
      activities,
      total: activities.length,
    };
  }

  /**
   * 3. Get inactive users list
   * GET /api/v1/onboarding/analytics/inactive-users
   */
  @Get("inactive-users")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async getInactiveUsers(
    @Query("days") days: number = 14,
    @GetUser() user: any,
  ) {
    const inactiveUsers = await this.analyticsService.getInactiveUsers(
      user.tenantId,
      days,
    );

    return {
      inactive_users: inactiveUsers,
      total: inactiveUsers.length,
      threshold_days: days,
    };
  }

  /**
   * 4. Export analytics to CSV
   * GET /api/v1/onboarding/analytics/export
   */
  @Get("export")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async exportAnalytics(@GetUser() user: any, @Res() res: Response) {
    const metrics = await this.analyticsService.getAdoptionMetrics(
      user.tenantId,
      30,
      14,
    );

    // Simple CSV export
    const csv = `Metric,Value
Total Users,${metrics.total_users}
Active Users (7 days),${metrics.active_users_last_7_days}
Active Users %,${metrics.active_users_percentage}%
Training Completion Rate,${metrics.training_completion_rate}%
Avg Session Duration,${metrics.average_session_duration_minutes} minutes
`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="adoption-metrics.csv"',
    );
    res.send(csv);
  }
}
