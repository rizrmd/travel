import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  AnomalyType,
  AnomalySeverity,
  AnomalyStatus,
} from "../../../../domain/anomaly";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";

/**
 * Anomaly Detection Entity
 *
 * Stores detected anomalies (NO RLS - super admin only)
 */
@Entity("anomaly_detections")
@Index(["tenantId", "severity", "detectedAt"])
@Index(["status", "detectedAt"])
export class AnomalyDetectionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "uuid",
    name: "tenant_id",
    nullable: true,
  })
  tenantId: string | null;

  @ManyToOne(() => TenantEntity, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity | null;

  @Column({
    type: "varchar",
    length: 50,
    name: "anomaly_type",
  })
  anomalyType: AnomalyType;

  @Column({
    type: "varchar",
    length: 20,
  })
  severity: AnomalySeverity;

  @Column({
    type: "text",
  })
  description: string;

  @Column({
    type: "varchar",
    length: 20,
    default: AnomalyStatus.DETECTED,
  })
  status: AnomalyStatus;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    name: "detected_at",
  })
  detectedAt: Date;

  @Column({
    type: "timestamp",
    name: "resolved_at",
    nullable: true,
  })
  resolvedAt: Date | null;

  @Column({
    type: "text",
    name: "resolution_notes",
    nullable: true,
  })
  resolutionNotes: string | null;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
  })
  updatedAt: Date;
}
