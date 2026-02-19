import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TenantMetricType } from "../../../../domain/tenant-metrics";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";

/**
 * Tenant Metric Entity
 *
 * Stores tenant-specific metrics (NO RLS - super admin only)
 * Retention: 365 days
 */
@Entity("tenant_metrics")
@Index(["tenantId", "metricType", "recordedAt"])
export class TenantMetricEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    name: "tenant_id",
  })
  tenantId: string;

  @ManyToOne(() => TenantEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @Column({
    type: "varchar",
    length: 50,
    name: "metric_type",
  })
  metricType: TenantMetricType;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 2,
  })
  value: number;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    name: "recorded_at",
  })
  recordedAt: Date;
}
