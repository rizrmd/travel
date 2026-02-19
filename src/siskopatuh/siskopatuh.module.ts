/**
 * Integration 6: SISKOPATUH Module
 * Government Reporting Integration for Indonesian Ministry of Religious Affairs
 *
 * This module handles:
 * - Jamaah registration submissions
 * - Departure manifest generation and submission
 * - Return manifest generation and submission
 * - Webhook handling for status updates
 * - Compliance reporting
 *
 * STUB MODE by default - set SISKOPATUH_ENABLED=true for production
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";

// Entities
import { SiskopatuhSubmissionEntity } from "./entities/siskopatuh-submission.entity";
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../packages/infrastructure/persistence/relational/entities/package.entity";

// Services
import {
  SiskopatuhService,
  SiskopatuhApiService,
  ManifestBuilderService,
} from "./services";

// Controllers
import {
  SiskopatuhController,
  SiskopatuhWebhookController,
} from "./controllers";

// Processors
import { SiskopatuhSubmissionProcessor } from "./processors/siskopatuh-submission.processor";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      SiskopatuhSubmissionEntity,
      JamaahEntity,
      PackageEntity,
    ]),
    BullModule.registerQueue({
      name: "siskopatuh-submission",
    }),
  ],
  controllers: [SiskopatuhController, SiskopatuhWebhookController],
  providers: [
    SiskopatuhService,
    SiskopatuhApiService,
    ManifestBuilderService,
    SiskopatuhSubmissionProcessor,
  ],
  exports: [SiskopatuhService, SiskopatuhApiService, ManifestBuilderService],
})
export class SiskopatuhModule { }
