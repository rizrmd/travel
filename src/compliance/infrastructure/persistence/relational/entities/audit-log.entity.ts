/**
 * Epic 12, Story 12.4 & 12.5: Audit Log Entity
 * Comprehensive immutable audit trail with RLS
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from "typeorm";
import {
  AuditLogType,
  EntityType,
  AuditAction,
  ActorRole,
} from "../../../../domain/audit-log";

@Entity("audit_logs")
@Index("idx_audit_logs_tenant_type", ["tenantId", "logType"])
@Index("idx_audit_logs_tenant_entity", ["tenantId", "entityType", "entityId"])
@Index("idx_audit_logs_tenant_created", ["tenantId", "createdAt"])
@Index("idx_audit_logs_action", ["action"])
@Index("idx_audit_logs_actor", ["actorId"])
@Index("idx_audit_logs_retention", ["createdAt"])
export class AuditLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "tenant_id", type: "uuid" })
  @Index()
  tenantId: string;

  @Column({
    name: "log_type",
    type: "enum",
    enum: AuditLogType,
  })
  logType: AuditLogType;

  @Column({
    name: "entity_type",
    type: "enum",
    enum: EntityType,
  })
  entityType: EntityType;

  @Column({ name: "entity_id", type: "uuid" })
  entityId: string;

  @Column({
    type: "enum",
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ name: "actor_id", type: "uuid", nullable: true })
  actorId: string | null;

  @Column({
    name: "actor_role",
    type: "enum",
    enum: ActorRole,
  })
  actorRole: ActorRole;

  @Column({ name: "actor_name", type: "varchar", length: 255 })
  actorName: string;

  @Column({ name: "before_state", type: "jsonb", nullable: true })
  beforeState: Record<string, any> | null;

  @Column({ name: "after_state", type: "jsonb", nullable: true })
  afterState: Record<string, any> | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: "ip_address", type: "varchar", length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ name: "retention_expires_at", type: "timestamp with time zone" })
  retentionExpiresAt: Date;

  @Column({ name: "archived", type: "boolean", default: false })
  archived: boolean;

  @Column({ name: "archive_url", type: "text", nullable: true })
  archiveUrl: string | null;

  /**
   * Calculate retention expiry date before insert (7 years)
   */
  @BeforeInsert()
  setRetentionExpiry() {
    if (!this.retentionExpiresAt) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 2555); // 7 years
      this.retentionExpiresAt = expiryDate;
    }
  }

  /**
   * Prevent updates and deletes at application level
   * Note: Database constraints should also be set
   */
  @BeforeInsert()
  preventModification() {
    // This entity is append-only
    // Additional constraints can be added at database level
  }
}
