import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserRole, UserStatus } from "../domain/user";
import { TenantEntity } from "../../tenants/entities/tenant.entity";

/**
 * User Entity - TypeORM
 * Represents a user in the database with multi-tenant isolation
 */
@Entity("users")
@Index(["tenantId", "email"], { unique: true })
@Index(["tenantId", "role"])
@Index(["status"])
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  @Index()
  tenantId: string;

  @ManyToOne(() => TenantEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  // Authentication
  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "boolean", default: false, name: "email_verified" })
  emailVerified: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
    name: "email_verified_at",
  })
  emailVerifiedAt?: Date;

  // Profile
  @Column({ type: "varchar", length: 255, name: "full_name" })
  fullName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  avatar?: string;

  // Authorization
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  // Security
  @Column({
    type: "timestamp",
    nullable: true,
    name: "last_login_at",
  })
  lastLoginAt?: Date;

  @Column({
    type: "varchar",
    length: 50,
    nullable: true,
    name: "last_login_ip",
  })
  lastLoginIp?: string;

  @Column({
    type: "timestamp",
    nullable: true,
    name: "password_changed_at",
  })
  passwordChangedAt?: Date;

  @Column({
    type: "int",
    default: 0,
    name: "failed_login_attempts",
  })
  failedLoginAttempts: number;

  @Column({
    type: "timestamp",
    nullable: true,
    name: "locked_until",
  })
  lockedUntil?: Date;

  // Metadata
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
