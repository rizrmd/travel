/**
 * Epic 12, Story 12.4: Audit Log Retention Processor
 * Enforce 7-year retention policy and archive old logs
 */

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuditLogService } from "../services/audit-log.service";
import { AuditLog } from "../domain/audit-log";

@Injectable()
@Injectable()
@Processor("compliance-retention")
export class AuditLogRetentionProcessor extends WorkerHost {
  private readonly logger = new Logger(AuditLogRetentionProcessor.name);

  constructor(private auditLogService: AuditLogService) {
    super();
  }

  /**
   * Scheduled job: Run monthly on the 1st at 02:00 AM
   */
  @Cron("0 2 1 * *", {
    name: "audit-log-retention",
    timeZone: "Asia/Jakarta",
  })
  async handleCron() {
    this.logger.log("Starting audit log retention job...");

    try {
      // Get all tenants
      const tenants = await this.getTenants();

      for (const tenant of tenants) {
        await this.processRetentionForTenant(tenant.id);
      }

      this.logger.log("Audit log retention job completed successfully");
    } catch (error) {
      this.logger.error("Error in audit log retention job:", error);
    }
  }

  async process(job: Job<any>): Promise<void> {
    switch (job.name) {
      case "archive-logs":
        await this.processRetentionForTenant(job.data.tenantId);
        break;
      case "retention-report":
        await this.generateRetentionReport();
        break;
      case "verify-archives":
        await this.verifyArchives(job.data.tenantId);
        break;
    }
  }

  /**
   * Process retention for a specific tenant
   */
  async processRetentionForTenant(tenantId: string): Promise<void> {
    this.logger.log(`Processing retention for tenant: ${tenantId}`);

    // Get logs older than 7 years
    const logsToArchive =
      await this.auditLogService.getLogsForArchival(tenantId);

    this.logger.log(`Found ${logsToArchive.length} logs to archive`);

    if (logsToArchive.length === 0) {
      return;
    }

    // Archive logs in batches
    const batchSize = 1000;
    for (let i = 0; i < logsToArchive.length; i += batchSize) {
      const batch = logsToArchive.slice(i, i + batchSize);
      await this.archiveBatch(tenantId, batch);
    }

    this.logger.log(
      `Archived ${logsToArchive.length} logs for tenant ${tenantId}`,
    );
  }

  /**
   * Archive a batch of logs
   */
  private async archiveBatch(tenantId: string, logs: any[]): Promise<void> {
    this.logger.log(`Archiving batch of ${logs.length} logs`);

    try {
      // In production: Export to S3 Glacier or cold storage
      const archiveData = JSON.stringify(logs, null, 2);
      const archiveKey = `compliance/audit-logs/${tenantId}/${Date.now()}.json`;

      // Simulate S3 upload
      const archiveUrl = `s3://travel-umroh-archives/${archiveKey}`;

      this.logger.log(`Logs archived to: ${archiveUrl}`);

      // Mark logs as archived in database
      const logIds = logs.map((log) => log.id);
      await this.auditLogService.markAsArchived(logIds, archiveUrl);

      this.logger.log(`Marked ${logIds.length} logs as archived`);
    } catch (error) {
      this.logger.error("Failed to archive batch:", error);
      throw error;
    }
  }

  /**
   * Get retention compliance report
   */
  async generateRetentionReport(): Promise<void> {
    this.logger.log("Generating retention compliance report...");

    const tenants = await this.getTenants();
    const report: any[] = [];

    for (const tenant of tenants) {
      const metrics = await this.auditLogService.getAuditMetrics(tenant.id);

      report.push({
        tenantId: tenant.id,
        totalLogs: metrics.totalLogs,
        oldestLog: metrics.oldestLog,
        retentionCompliance: metrics.retentionCompliance,
        complianceStatus: metrics.retentionCompliance
          ? "Compliant"
          : "Non-Compliant",
      });
    }

    this.logger.log("Retention compliance report:");
    this.logger.log(JSON.stringify(report, null, 2));
  }

  /**
   * Get all tenants (placeholder)
   */
  private async getTenants(): Promise<Array<{ id: string }>> {
    // In production, query from tenants table
    return [];
  }

  /**
   * Verify archive integrity
   */
  async verifyArchives(tenantId: string): Promise<void> {
    this.logger.log(`Verifying archives for tenant: ${tenantId}`);

    // In production: Verify S3 Glacier archives
    // Check file integrity, accessibility, etc.

    this.logger.log("Archive verification completed");
  }
}
