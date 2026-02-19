/**
 * Epic 7, Story 7.6: Commission Payout Entities
 * TypeORM entities for batch commission payouts
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";

export enum PayoutStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

/**
 * Commission Payout Batch
 * Represents a single payout batch for multiple agents
 */
@Entity({ name: "commission_payouts" })
@Index(["tenant_id", "payout_date"])
@Index(["status"])
export class CommissionPayoutEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "date", nullable: false })
  payout_date: Date;

  @Column({ type: "decimal", precision: 14, scale: 2, nullable: false })
  total_amount: number;

  @Column({
    type: "enum",
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  @Column({ type: "uuid", nullable: false })
  created_by_id: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  bank_confirmation_file: string | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

/**
 * Commission Payout Item
 * Individual agent payout within a batch
 */
@Entity({ name: "commission_payout_items" })
@Index(["payout_id", "agent_id"])
@Index(["agent_id"])
export class CommissionPayoutItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  payout_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  agent_id: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  bank_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  bank_account_number: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  bank_account_name: string | null;

  @Column({
    type: "enum",
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
