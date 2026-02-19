/**
 * Epic 5, Story 5.1: Jamaah Entity
 * TypeORM entity for jamaah table with RLS support
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
  OneToMany,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  JamaahStatus,
  ServiceMode,
  DocumentStatus,
  PaymentStatus,
  ApprovalStatus,
} from "../../../../domain/jamaah";
import { PackageEntity } from "../../../../../packages/infrastructure/persistence/relational/entities/package.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";
import { JamaahActionLogEntity } from "./jamaah-action-log.entity";
import { JamaahDelegationEntity } from "./jamaah-delegation.entity";
import { JamaahStatusHistoryEntity } from "./jamaah-status-history.entity";

@Entity({ name: "jamaah" })
@Index(["tenant_id", "agent_id"])
@Index(["tenant_id", "status", "created_at"])
@Index(["package_id"])
@Index(["email"])
@Index(["phone"])
export class JamaahEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  agent_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "agent_id" })
  agent: UserEntity;

  @Column({ type: "uuid", nullable: false })
  @Index()
  package_id: string;

  @ManyToOne(() => PackageEntity, { eager: false })
  @JoinColumn({ name: "package_id" })
  package: PackageEntity;

  // Personal Information
  @Column({ type: "varchar", length: 255, nullable: false })
  full_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string | null;

  @Column({ type: "date", nullable: true })
  date_of_birth: Date | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  gender: string | null;

  @Column({ type: "text", nullable: true })
  address: string | null;

  // Status Management
  @Column({
    type: "enum",
    enum: JamaahStatus,
    default: JamaahStatus.LEAD,
  })
  status: JamaahStatus;

  @Column({
    type: "enum",
    enum: DocumentStatus,
    default: DocumentStatus.INCOMPLETE,
  })
  document_status: DocumentStatus;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.NOT_STARTED,
  })
  payment_status: PaymentStatus;

  @Column({
    type: "enum",
    enum: ApprovalStatus,
    default: ApprovalStatus.NOT_SUBMITTED,
  })
  approval_status: ApprovalStatus;

  // Service Mode - Story 5.7
  @Column({
    type: "enum",
    enum: ServiceMode,
    default: ServiceMode.AGENT_ASSISTED,
  })
  service_mode: ServiceMode;

  // User Reference (for self-service jamaah)
  @Column({ type: "uuid", nullable: true })
  user_id: string | null;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity | null;

  // Assignment
  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  assigned_at: Date;

  // Metadata
  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any> | null;

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

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date | null;

  // Relations
  @OneToMany(() => JamaahActionLogEntity, (log) => log.jamaah)
  action_logs: JamaahActionLogEntity[];

  @OneToMany(() => JamaahDelegationEntity, (delegation) => delegation.jamaah)
  delegations: JamaahDelegationEntity[];

  @OneToMany(() => JamaahStatusHistoryEntity, (history) => history.jamaah)
  status_history: JamaahStatusHistoryEntity[];
}
