/**
 * Epic 11: Analytics Module
 * Operational Intelligence Dashboard with real-time metrics
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

// Entities
import { AnalyticsEventEntity } from "./infrastructure/persistence/relational/entities/analytics-event.entity";
import { RevenueSnapshotEntity } from "./infrastructure/persistence/relational/entities/revenue-snapshot.entity";
import { FilterPresetEntity } from "./infrastructure/persistence/relational/entities/filter-preset.entity";
import { PaymentEntity } from "../payments/infrastructure/persistence/relational/entities/payment.entity";
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../packages/infrastructure/persistence/relational/entities/package.entity";

// Services
import { RevenueMetricsService } from "./services/revenue-metrics.service";
import { RevenueProjectionService } from "./services/revenue-projection.service";
import { PipelineAnalyticsService } from "./services/pipeline-analytics.service";
import { AgentPerformanceService } from "./services/agent-performance.service";
import { LeaderboardService } from "./services/leaderboard.service";
import { AnalyticsEventService } from "./services/analytics-event.service";
import { FilterPresetService } from "./services/filter-preset.service";

// Controllers
import { AnalyticsController } from "./analytics.controller";
import { FilterPresetsController } from "./filter-presets.controller";

// Background Jobs
import { DailySnapshotProcessor } from "./jobs/daily-snapshot.processor";
import { LeaderboardUpdateProcessor } from "./jobs/leaderboard-update.processor";

@Module({
  imports: [
    // TypeORM for entities
    TypeOrmModule.forFeature([
      // Analytics entities
      AnalyticsEventEntity,
      RevenueSnapshotEntity,
      FilterPresetEntity,
      // Related entities from other modules
      PaymentEntity,
      JamaahEntity,
      PackageEntity,
    ]),
    // Schedule module for cron jobs
    ScheduleModule.forRoot(),
  ],
  controllers: [AnalyticsController, FilterPresetsController],
  providers: [
    // Services
    RevenueMetricsService,
    RevenueProjectionService,
    PipelineAnalyticsService,
    AgentPerformanceService,
    LeaderboardService,
    AnalyticsEventService,
    FilterPresetService,
    // Background jobs
    DailySnapshotProcessor,
    LeaderboardUpdateProcessor,
  ],
  exports: [
    // Export services for use in other modules
    RevenueMetricsService,
    RevenueProjectionService,
    PipelineAnalyticsService,
    AgentPerformanceService,
    LeaderboardService,
    AnalyticsEventService,
    FilterPresetService,
  ],
})
export class AnalyticsModule {}
