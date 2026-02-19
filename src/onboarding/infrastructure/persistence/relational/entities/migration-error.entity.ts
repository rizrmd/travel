/**
 * Epic 13, Story 13.2: Migration Error Entity
 * Stores detailed error information for failed import rows
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { CsvErrorType } from "../../../../domain/csv-import";
import { MigrationJobEntity } from "./migration-job.entity";

@Entity({ name: "migration_errors" })
@Index(["tenant_id", "migration_job_id"])
@Index(["migration_job_id", "error_type"])
@Index(["tenant_id", "created_at"])
export class MigrationErrorEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  migration_job_id: string;

  @ManyToOne(() => MigrationJobEntity, (job) => job.errors, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "migration_job_id" })
  migration_job: MigrationJobEntity;

  // Error Details
  @Column({ type: "int", nullable: false })
  row_number: number;

  @Column({
    type: "enum",
    enum: CsvErrorType,
    nullable: false,
  })
  @Index()
  error_type: CsvErrorType;

  @Column({ type: "varchar", length: 255, nullable: true })
  field_name: string | null;

  @Column({ type: "text", nullable: false })
  error_message: string;

  @Column({ type: "text", nullable: true })
  expected_format: string | null;

  @Column({ type: "text", nullable: true })
  received_value: string | null;

  // Original Row Data
  @Column({ type: "jsonb", nullable: false })
  row_data: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
