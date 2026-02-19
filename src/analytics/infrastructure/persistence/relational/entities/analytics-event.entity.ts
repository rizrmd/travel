/**
 * Epic 11, Story 11.1-11.7: Analytics Event Entity
 * Tracks all analytics events for audit trail and real-time processing
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../../src/utils/relational-entity-helper";

export enum AnalyticsEventType {
  PAYMENT_CONFIRMED = "payment_confirmed",
  JAMAAH_CREATED = "jamaah_created",
  JAMAAH_STATUS_CHANGED = "status_changed",
  PACKAGE_PURCHASED = "package_purchased",
  AGENT_ASSIGNED = "agent_assigned",
  DOCUMENT_UPLOADED = "document_uploaded",
  REVENUE_MILESTONE = "revenue_milestone",
}

export enum AnalyticsEntityType {
  PAYMENT = "payment",
  JAMAAH = "jamaah",
  PACKAGE = "package",
  AGENT = "agent",
  DOCUMENT = "document",
}

@Entity({ name: "analytics_events" })
@Index(["tenant_id", "event_type", "created_at"])
@Index(["tenant_id", "entity_type", "entity_id"])
@Index(["created_at"])
export class AnalyticsEventEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({
    type: "enum",
    enum: AnalyticsEventType,
    nullable: false,
  })
  event_type: AnalyticsEventType;

  @Column({
    type: "enum",
    enum: AnalyticsEntityType,
    nullable: false,
  })
  entity_type: AnalyticsEntityType;

  @Column({ type: "uuid", nullable: false })
  entity_id: string;

  @Column({ type: "uuid", nullable: true })
  user_id: string | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    amount?: number;
    packageId?: string;
    packageName?: string;
    agentId?: string;
    agentName?: string;
    previousStatus?: string;
    newStatus?: string;
    paymentMethod?: string;
    referenceNumber?: string;
    [key: string]: any;
  } | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
