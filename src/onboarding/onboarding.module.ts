/**
 * Epic 13: Onboarding & Migration Tools Module
 * Comprehensive module for CSV imports, training, and analytics
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";

// Entities
import { MigrationJobEntity } from "./infrastructure/persistence/relational/entities/migration-job.entity";
import { MigrationErrorEntity } from "./infrastructure/persistence/relational/entities/migration-error.entity";
import { TrainingMaterialEntity } from "./infrastructure/persistence/relational/entities/training-material.entity";
import { TrainingProgressEntity } from "./infrastructure/persistence/relational/entities/training-progress.entity";
import { UserActivityEntity } from "./infrastructure/persistence/relational/entities/user-activity.entity";
import { TrainingRequestEntity } from "./infrastructure/persistence/relational/entities/training-request.entity";

// External entities
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../packages/infrastructure/persistence/relational/entities/package.entity";
import { UserEntity } from "../users/entities/user.entity";

// Services
import { CsvParserService } from "./services/csv-parser.service";
import { CsvValidatorService } from "./services/csv-validator.service";
import { MigrationJobService } from "./services/migration-job.service";
import { DataImporterService } from "./services/data-importer.service";
import { TrainingMaterialService } from "./services/training-material.service";
import { TrainingProgressService } from "./services/training-progress.service";
import { AdoptionAnalyticsService } from "./services/adoption-analytics.service";
import { UserActivityTrackerService } from "./services/user-activity-tracker.service";
import { TrainingRequestService } from "./services/training-request.service";

// Controllers
import { MigrationController } from "./migration.controller";
import { TrainingMaterialsController } from "./training-materials.controller";
import { AdoptionAnalyticsController } from "./adoption-analytics.controller";
import { TrainingRequestsController } from "./training-requests.controller";

// Job Processors
import { CsvImportProcessor } from "./jobs/csv-import.processor";
import { TrainingReminderProcessor } from "./jobs/training-reminder.processor";
import { ActivityAggregationProcessor } from "./jobs/activity-aggregation.processor";

// External modules
import { WebSocketModule } from "../websocket/websocket.module";

@Module({
  imports: [
    // TypeORM entities
    TypeOrmModule.forFeature([
      // Onboarding entities
      MigrationJobEntity,
      MigrationErrorEntity,
      TrainingMaterialEntity,
      TrainingProgressEntity,
      UserActivityEntity,
      TrainingRequestEntity,
      // External entities
      JamaahEntity,
      PackageEntity,
      UserEntity,
    ]),

    // BullMQ for background jobs
    BullModule.registerQueue(
      {
        name: "csv-import",
      },
      {
        name: "training-reminders",
      },
    ),

    // Schedule module for cron jobs
    ScheduleModule.forRoot(),

    // WebSocket for real-time updates
    WebSocketModule,
  ],

  providers: [
    // CSV Import Services
    CsvParserService,
    CsvValidatorService,
    MigrationJobService,
    DataImporterService,

    // Training Services
    TrainingMaterialService,
    TrainingProgressService,
    TrainingRequestService,

    // Analytics Services
    AdoptionAnalyticsService,
    UserActivityTrackerService,

    // Job Processors
    CsvImportProcessor,
    TrainingReminderProcessor,
    ActivityAggregationProcessor,
  ],

  controllers: [
    MigrationController,
    TrainingMaterialsController,
    AdoptionAnalyticsController,
    TrainingRequestsController,
  ],

  exports: [
    // Export services for use in other modules
    CsvParserService,
    CsvValidatorService,
    MigrationJobService,
    TrainingMaterialService,
    TrainingProgressService,
    AdoptionAnalyticsService,
    UserActivityTrackerService,
    TrainingRequestService,
  ],
})
export class OnboardingModule { }
