import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
} from "typeorm";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

/**
 * Jamaah Assignment Entity
 *
 * Maps jamaah (pilgrims) to agents for granular access control.
 * Agents can only access jamaah records that are explicitly assigned to them.
 *
 * Business Rules:
 * - One jamaah can have multiple agent assignments (team collaboration)
 * - All assignments are tenant-scoped
 * - Soft delete preserves audit trail
 * - Unique constraint prevents duplicate active assignments
 *
 * RLS Policies:
 * - Tenant isolation: Users can only see assignments within their tenant
 * - Agent access: Agents can only see their own assignments
 * - Admin override: agency_owner, super_admin, admin can see all assignments
 */
@Entity("jamaah_assignments")
@Index(["tenantId"])
@Index(["agentId", "tenantId"])
@Index(["jamaahId", "tenantId"])
@Unique("idx_jamaah_assignments_unique", ["jamaahId", "agentId", "tenantId"])
export class JamaahAssignmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  tenantId: string;

  @Column({ type: "uuid", name: "jamaah_id" })
  jamaahId: string;

  @Column({ type: "uuid", name: "agent_id" })
  agentId: string;

  @Column({ type: "uuid", name: "assigned_by_id" })
  assignedById: string;

  @Column({
    type: "timestamp",
    name: "assigned_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  assignedAt: Date;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TenantEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "jamaah_id" })
  jamaah: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "agent_id" })
  agent: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "assigned_by_id" })
  assignedBy: UserEntity;
}
