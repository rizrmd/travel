/**
 * Epic 13, Story 13.5: Activity Aggregation Background Job
 * Aggregates user activity for analytics
 */

import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { UserActivityEntity } from "../infrastructure/persistence/relational/entities/user-activity.entity";

@Injectable()
export class ActivityAggregationProcessor {
  private readonly logger = new Logger(ActivityAggregationProcessor.name);

  constructor(
    @InjectRepository(UserActivityEntity)
    private activityRepository: Repository<UserActivityEntity>,
  ) { }

  @Cron(CronExpression.EVERY_HOUR)
  async aggregateHourlyActivity() {
    this.logger.log("Aggregating hourly activity data...");
    // Cache aggregated data in Redis for fast analytics
    // Implementation would calculate metrics and store in cache
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyActivity() {
    this.logger.log("Aggregating daily activity data...");
    // More comprehensive daily aggregation
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldActivity() {
    const retentionDays = 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.activityRepository.delete({
      created_at: LessThan(cutoffDate),
    });

    this.logger.log(`Cleaned up ${result.affected || 0} old activity records`);
  }
}
