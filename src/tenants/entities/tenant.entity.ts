import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from "typeorm";
import { TenantStatus, TenantTier, ResourceLimits } from "../domain/tenant";

/**
 * Tenant Entity - TypeORM
 * Represents a travel agency tenant in the database
 */
@Entity("tenants")
@Index(["slug"], { unique: true })
@Index(["ownerEmail"], { unique: true })
@Index(["customDomain"], { unique: true, where: "custom_domain IS NOT NULL" })
export class TenantEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({
    type: "enum",
    enum: TenantStatus,
    default: TenantStatus.PENDING,
  })
  status: TenantStatus;

  @Column({
    type: "enum",
    enum: TenantTier,
    default: TenantTier.STARTER,
  })
  tier: TenantTier;

  // Contact Information
  @Column({ type: "varchar", length: 255, name: "owner_email" })
  ownerEmail: string;

  @Column({ type: "varchar", length: 50, name: "owner_phone" })
  ownerPhone: string;

  @Column({ type: "text" })
  address: string;

  // Domain Configuration
  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "custom_domain",
  })
  customDomain?: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "domain_verification_token",
  })
  domainVerificationToken?: string;

  @Column({
    type: "timestamp",
    nullable: true,
    name: "domain_verified_at",
  })
  domainVerifiedAt?: Date;

  // Resource Limits (stored as JSONB)
  @Column({
    type: "jsonb",
    name: "resource_limits",
    default: {
      maxConcurrentUsers: 500,
      maxJamaahPerMonth: 3000,
      maxAgents: 25,
      maxPackages: 50,
    },
  })
  resourceLimits: ResourceLimits;

  // Provisioning Metadata
  @Column({
    type: "timestamp",
    nullable: true,
    name: "activated_at",
  })
  activatedAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date;
}
