/**
 * Epic 12: Compliance Module
 * Sharia Compliance & Regulatory Reporting
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";

// Entities
import {
  ContractEntity,
  SignatureEntity,
  AuditLogEntity,
  ComplianceReportEntity,
} from "./infrastructure/persistence/relational/entities";

// Services
import {
  ContractGeneratorService,
  ContractPdfService,
  EsignatureService,
  AuditLogService,
  ComplianceDashboardService,
  ComplianceReportService,
  CriticalOperationsLoggerService,
  SiskopathService,
} from "./services";

// Controllers
import {
  ContractsController,
  ComplianceDashboardController,
  SiskopathController,
} from "./controllers";

// Jobs
import { SignatureReminderProcessor, AuditLogRetentionProcessor } from "./jobs";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity,
      SignatureEntity,
      AuditLogEntity,
      ComplianceReportEntity,
    ]),
    BullModule.registerQueue(
      {
        name: "compliance-reminders",
      },
      {
        name: "compliance-retention",
      },
    ),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    ContractsController,
    ComplianceDashboardController,
    SiskopathController,
  ],
  providers: [
    // Services
    ContractGeneratorService,
    ContractPdfService,
    EsignatureService,
    AuditLogService,
    ComplianceDashboardService,
    ComplianceReportService,
    CriticalOperationsLoggerService,
    SiskopathService,
    // Jobs
    SignatureReminderProcessor,
    AuditLogRetentionProcessor,
  ],
  exports: [
    ContractGeneratorService,
    EsignatureService,
    AuditLogService,
    ComplianceDashboardService,
    CriticalOperationsLoggerService,
  ],
})
export class ComplianceModule { }
