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
  Check,
} from "typeorm";
import { TenantEntity } from "../../../../../tenants/entities/tenant.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

/**
 * Agent Hierarchy Entity
 *
 * Represents the hierarchical relationship between agents within a tenant.
 * Supports multi-level structures with a maximum depth of 3 levels.
 *
 * Business Rules:
 * - Maximum 3 levels of hierarchy
 * - No circular references allowed
 * - All agents must belong to the same tenant
 * - Level must be between 1 and 3
 */
@Entity("agent_hierarchies")
@Index(["tenantId", "agentId"])
@Index(["tenantId", "uplineId"])
@Index(["tenantId", "agentId", "uplineId"], { unique: true })
@Check('"level" >= 1 AND "level" <= 3')
export class AgentHierarchyEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "tenant_id" })
  tenantId: string;

  @Column({ type: "uuid", name: "agent_id" })
  agentId: string;

  @Column({ type: "uuid", name: "upline_id" })
  uplineId: string;

  @Column({ type: "int", default: 1 })
  level: number;

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
  @JoinColumn({ name: "agent_id" })
  agent: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "upline_id" })
  upline: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "assigned_by_id" })
  assignedBy: UserEntity;
}
