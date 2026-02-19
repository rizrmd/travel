/**
 * Epic 13, Story 13.5: User Activity Entity
 * Logs user activity for adoption analytics
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
import { UserEntity } from "../../../../../users/entities/user.entity";

export enum ActivityType {
  LOGIN = "login",
  LOGOUT = "logout",
  PAGE_VIEW = "page_view",
  FEATURE_USED = "feature_used",
  TRAINING_STARTED = "training_started",
  TRAINING_COMPLETED = "training_completed",
  DOCUMENT_UPLOADED = "document_uploaded",
  PAYMENT_CREATED = "payment_created",
  JAMAAH_CREATED = "jamaah_created",
  REPORT_GENERATED = "report_generated",
}

@Entity({ name: "user_activities" })
@Index(["tenant_id", "user_id", "activity_type", "created_at"])
@Index(["tenant_id", "created_at"])
@Index(["user_id", "created_at"])
export class UserActivityEntity extends EntityRelationalHelper {
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

  // Activity Details
  @Column({
    type: "enum",
    enum: ActivityType,
    nullable: false,
  })
  @Index()
  activity_type: ActivityType;

  @Column({ type: "varchar", length: 500, nullable: true })
  activity_description: string | null;

  // Request Context
  @Column({ type: "varchar", length: 255, nullable: true })
  page_url: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  feature_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  ip_address: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  user_agent: string | null;

  // Session Tracking
  @Column({ type: "uuid", nullable: true })
  session_id: string | null;

  @Column({ type: "int", nullable: true })
  session_duration_seconds: number | null;

  // Additional Data
  @Column({ type: "jsonb", nullable: true })
  metadata: {
    browser?: string;
    os?: string;
    device?: string;
    referrer?: string;
    actionDetails?: Record<string, any>;
  } | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Index()
  created_at: Date;
}
