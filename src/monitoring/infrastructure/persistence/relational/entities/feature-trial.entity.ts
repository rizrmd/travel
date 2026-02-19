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
import { FeatureKey, TrialStatus } from "../../../../domain/feature-trial";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";

/**
 * Feature Trial Entity
 *
 * Stores feature trials per tenant (NO RLS - super admin only)
 */
@Entity("feature_trials")
@Index(["tenantId", "featureKey", "status"])
@Index(["status", "expiresAt"])
export class FeatureTrialEntity {
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
    name: "feature_key",
  })
  featureKey: FeatureKey;

  @Column({
    type: "varchar",
    length: 20,
  })
  status: TrialStatus;

  @CreateDateColumn({
    type: "timestamp",
    name: "started_at",
  })
  startedAt: Date;

  @Column({
    type: "timestamp",
    name: "expires_at",
  })
  expiresAt: Date;

  @Column({
    type: "int",
    name: "usage_count",
    default: 0,
  })
  usageCount: number;

  @Column({
    type: "int",
    name: "usage_limit",
    nullable: true,
  })
  usageLimit: number | null;

  @Column({
    type: "text",
    name: "trial_feedback",
    nullable: true,
  })
  trialFeedback: string | null;

  @Column({
    type: "timestamp",
    name: "converted_at",
    nullable: true,
  })
  convertedAt: Date | null;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
  })
  updatedAt: Date;
}
