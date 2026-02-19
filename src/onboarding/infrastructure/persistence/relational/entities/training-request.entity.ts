/**
 * Epic 13, Story 13.6: Training Request Entity
 * Handles training escalation and scheduling
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { UserEntity } from "../../../../../users/entities/user.entity";

export enum TrainingRequestStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ContactMethod {
  EMAIL = "email",
  PHONE = "phone",
  WHATSAPP = "whatsapp",
  ZOOM = "zoom",
  IN_PERSON = "in_person",
}

@Entity({ name: "training_requests" })
@Index(["tenant_id", "status", "created_at"])
@Index(["tenant_id", "user_id"])
@Index(["tenant_id", "assigned_to_id"])
@Index(["status", "scheduled_at"])
export class TrainingRequestEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  // Requester
  @Column({ type: "uuid", nullable: false })
  @Index()
  user_id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  // Request Details
  @Column({ type: "varchar", length: 500, nullable: false })
  topic: string;

  @Column({ type: "text", nullable: true })
  message: string | null;

  @Column({ type: "date", nullable: true })
  preferred_date: Date | null;

  @Column({ type: "time", nullable: true })
  preferred_time: string | null;

  @Column({
    type: "enum",
    enum: ContactMethod,
    default: ContactMethod.EMAIL,
  })
  contact_method: ContactMethod;

  // Assignment
  @Column({
    type: "enum",
    enum: TrainingRequestStatus,
    default: TrainingRequestStatus.PENDING,
  })
  @Index()
  status: TrainingRequestStatus;

  @Column({ type: "uuid", nullable: true })
  assigned_to_id: string | null;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "assigned_to_id" })
  assigned_to: UserEntity | null;

  @Column({ type: "timestamp", nullable: true })
  assigned_at: Date | null;

  // Scheduling
  @Column({ type: "timestamp", nullable: true })
  scheduled_at: Date | null;

  @Column({ type: "int", nullable: true })
  scheduled_duration_minutes: number | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  meeting_url: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  meeting_location: string | null;

  // Completion
  @Column({ type: "timestamp", nullable: true })
  completed_at: Date | null;

  @Column({ type: "text", nullable: true })
  completion_notes: string | null;

  @Column({ type: "int", nullable: true })
  satisfaction_rating: number | null;

  // Metadata
  @Column({ type: "jsonb", nullable: true })
  metadata: {
    materials?: string[];
    attendees?: string[];
    recordingUrl?: string;
    followUpRequired?: boolean;
    calendarEventId?: string;
  } | null;

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
}
