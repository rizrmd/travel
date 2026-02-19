/**
 * Epic 6, Story 6.3: Batch Upload Job Entity
 * TypeORM entity for batch upload jobs with RLS support
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
import { BatchUploadStatus } from "../../../../domain/batch-upload";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "batch_upload_jobs" })
@Index(["tenant_id", "status", "created_at"])
@Index(["uploaded_by_id"])
export class BatchUploadJobEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Multi-tenant support with RLS
  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  // Uploader reference
  @Column({ type: "uuid", nullable: false })
  @Index()
  uploaded_by_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "uploaded_by_id" })
  uploaded_by: UserEntity;

  // ZIP file information
  @Column({ type: "varchar", length: 500, nullable: false })
  zip_file_url: string;

  @Column({ type: "integer", nullable: false })
  zip_file_size: number;

  // Processing status
  @Column({
    type: "enum",
    enum: BatchUploadStatus,
    default: BatchUploadStatus.PENDING,
  })
  status: BatchUploadStatus;

  // Progress tracking
  @Column({ type: "integer", default: 0 })
  total_files: number;

  @Column({ type: "integer", default: 0 })
  processed_files: number;

  @Column({ type: "integer", default: 0 })
  successful_files: number;

  @Column({ type: "integer", default: 0 })
  failed_files: number;

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
