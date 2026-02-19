/**
 * Epic 13, Story 13.1 & 13.3: Migration Job Entity
 * Tracks CSV import jobs with progress and status
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
  OneToMany,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { UserEntity } from "../../../../../users/entities/user.entity";
import { CsvImportStatus, CsvImportType } from "../../../../domain/csv-import";
import { MigrationErrorEntity } from "./migration-error.entity";

@Entity({ name: "migration_jobs" })
@Index(["tenant_id", "user_id", "status"])
@Index(["tenant_id", "created_at"])
@Index(["status", "created_at"])
export class MigrationJobEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  user_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  // Import Details
  @Column({
    type: "enum",
    enum: CsvImportType,
    nullable: false,
  })
  import_type: CsvImportType;

  @Column({ type: "varchar", length: 500, nullable: false })
  file_name: string;

  @Column({ type: "varchar", length: 1000, nullable: false })
  file_url: string;

  @Column({ type: "bigint", nullable: false })
  file_size: number;

  // Status Tracking
  @Column({
    type: "enum",
    enum: CsvImportStatus,
    default: CsvImportStatus.PENDING,
  })
  @Index()
  status: CsvImportStatus;

  @Column({ type: "int", default: 0 })
  total_rows: number;

  @Column({ type: "int", default: 0 })
  processed_rows: number;

  @Column({ type: "int", default: 0 })
  valid_rows: number;

  @Column({ type: "int", default: 0 })
  invalid_rows: number;

  // Error Reporting
  @Column({ type: "varchar", length: 1000, nullable: true })
  error_report_url: string | null;

  @Column({ type: "text", nullable: true })
  error_message: string | null;

  // Timestamps
  @Column({ type: "timestamp", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date | null;

  // Metadata
  @Column({ type: "jsonb", nullable: true })
  metadata: {
    fileName: string;
    fileSize: number;
    encoding?: string;
    delimiter?: string;
    columnMapping?: Record<string, string>;
    importType: string;
    errorSummary?: {
      missingRequired: number;
      invalidFormat: number;
      duplicate: number;
      constraintViolation: number;
    };
  } | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  // Relations
  @OneToMany(() => MigrationErrorEntity, (error) => error.migration_job)
  errors: MigrationErrorEntity[];
}
