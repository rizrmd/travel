/**
 * Integration 6: SISKOPATUH Submission Entity
 * TypeORM entity for siskopatuh_submissions table with RLS support
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { EntityRelationalHelper } from "../../utils/relational-entity-helper";
import { SubmissionType, SubmissionStatus } from "../domain";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";

@Entity({ name: "siskopatuh_submissions" })
@Index(["tenant_id"])
@Index(["jamaah_id"])
@Index(["package_id"])
@Index(["status"])
@Index(["submission_type"])
@Index(["reference_number"])
@Index(["created_at"])
export class SiskopatuhSubmissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({
    type: "enum",
    enum: SubmissionType,
    nullable: false,
  })
  submission_type: SubmissionType;

  @Column({ type: "uuid", nullable: true })
  @Index()
  jamaah_id: string | null;

  @ManyToOne(() => JamaahEntity, { eager: false })
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity | null;

  @Column({ type: "uuid", nullable: true })
  @Index()
  package_id: string | null;

  @ManyToOne(() => PackageEntity, { eager: false })
  @JoinColumn({ name: "package_id" })
  package: PackageEntity | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  reference_number: string | null;

  @Column({ type: "jsonb", nullable: false })
  submission_data: Record<string, any>;

  @Column({ type: "jsonb", nullable: true })
  response_data: Record<string, any> | null;

  @Column({
    type: "enum",
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column({ type: "text", nullable: true })
  error_message: string | null;

  @Column({ type: "timestamp", nullable: true })
  submitted_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  accepted_at: Date | null;

  @Column({ type: "integer", default: 0 })
  retry_count: number;

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

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date | null;
}
