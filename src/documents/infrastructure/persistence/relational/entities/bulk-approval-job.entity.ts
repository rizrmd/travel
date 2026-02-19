/**
 * Epic 6, Story 6.5: Bulk Approval Job Entity
 * TypeORM entity for bulk approval jobs with RLS support
 */

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
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  BulkApprovalStatus,
  ReviewAction,
} from "../../../../domain/document-review";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "bulk_approval_jobs" })
@Index(["tenant_id", "status", "created_at"])
@Index(["reviewer_id"])
export class BulkApprovalJobEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Multi-tenant support with RLS
  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  // Reviewer reference
  @Column({ type: "uuid", nullable: false })
  @Index()
  reviewer_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "reviewer_id" })
  reviewer: UserEntity;

  // Approval action
  @Column({
    type: "enum",
    enum: ReviewAction,
    nullable: false,
  })
  action: ReviewAction;

  // Document IDs (stored as JSON array)
  @Column({ type: "jsonb", nullable: false })
  document_ids: string[];

  // Processing status
  @Column({
    type: "enum",
    enum: BulkApprovalStatus,
    default: BulkApprovalStatus.PENDING,
  })
  status: BulkApprovalStatus;

  // Progress tracking
  @Column({ type: "integer", default: 0 })
  total_documents: number;

  @Column({ type: "integer", default: 0 })
  processed_documents: number;

  @Column({ type: "integer", default: 0 })
  successful_documents: number;

  @Column({ type: "integer", default: 0 })
  failed_documents: number;

  // Rejection reason (for bulk rejection)
  @Column({ type: "text", nullable: true })
  rejection_reason: string | null;

  // Error reporting
  @Column({ type: "text", nullable: true })
  error_report: string | null;

  // Timing
  @Column({ type: "timestamp", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date | null;

  // Metadata
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
