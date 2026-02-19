/**
 * Epic 12, Story 12.3: Compliance Report Service
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ComplianceReportEntity } from "../infrastructure/persistence/relational/entities/compliance-report.entity";
import {
  ComplianceReportType,
  ComplianceReportStatus,
} from "../domain/compliance-metrics";

@Injectable()
export class ComplianceReportService {
  constructor(
    @InjectRepository(ComplianceReportEntity)
    private reportRepository: Repository<ComplianceReportEntity>,
  ) {}

  async generateReport(
    tenantId: string,
    reportType: ComplianceReportType,
    periodStart: Date,
    periodEnd: Date,
    generatedById: string,
  ): Promise<ComplianceReportEntity> {
    const report = this.reportRepository.create({
      tenantId,
      reportType,
      periodStart,
      periodEnd,
      status: ComplianceReportStatus.GENERATING,
      generatedById,
      metadata: {},
    });

    const saved = await this.reportRepository.save(report);

    // Background job would process this
    // For now, mark as completed immediately
    setTimeout(async () => {
      await this.completeReport(
        saved.id,
        "https://storage.example.com/reports/report.pdf",
      );
    }, 1000);

    return saved;
  }

  async completeReport(reportId: string, fileUrl: string): Promise<void> {
    await this.reportRepository.update(reportId, {
      status: ComplianceReportStatus.COMPLETED,
      fileUrl,
      generatedAt: new Date(),
    });
  }

  async listReports(tenantId: string): Promise<ComplianceReportEntity[]> {
    return await this.reportRepository.find({
      where: { tenantId },
      order: { createdAt: "DESC" },
    });
  }
}
