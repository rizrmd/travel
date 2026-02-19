/**
 * Epic 12, Story 12.3: Compliance Report Entity
 * Generated compliance reports with RLS
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import {
  ComplianceReportType,
  ComplianceReportStatus,
} from "../../../../domain/compliance-metrics";

@Entity("compliance_reports")
@Index("idx_compliance_reports_tenant_type", ["tenantId", "reportType"])
@Index("idx_compliance_reports_tenant_period", [
  "tenantId",
  "periodStart",
  "periodEnd",
])
@Index("idx_compliance_reports_status", ["status"])
@Index("idx_compliance_reports_generated_at", ["generatedAt"])
export class ComplianceReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @Column({
    name: "report_type",
    type: "enum",
    enum: ComplianceReportType,
  })
  reportType: ComplianceReportType;

  @Column({ name: "period_start", type: "timestamp with time zone" })
  periodStart: Date;

  @Column({ name: "period_end", type: "timestamp with time zone" })
  periodEnd: Date;

  @Column({
    type: "enum",
    enum: ComplianceReportStatus,
    default: ComplianceReportStatus.GENERATING,
  })
  status: ComplianceReportStatus;

  @Column({ name: "file_url", type: "text", nullable: true })
  fileUrl: string | null;

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>;

  @Column({ name: "generated_by_id", type: "uuid" })
  generatedById: string;

  @Column({
    name: "generated_at",
    type: "timestamp with time zone",
    nullable: true,
  })
  generatedAt: Date | null;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  // Relations
  @ManyToOne("TenantEntity", { nullable: false })
  @JoinColumn({ name: "tenant_id" })
  tenant?: any;

  @ManyToOne("UserEntity", { nullable: false })
  @JoinColumn({ name: "generated_by_id" })
  generatedBy?: any;
}
