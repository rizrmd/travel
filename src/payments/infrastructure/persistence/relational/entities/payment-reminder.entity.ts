/**
 * Epic 7, Story 7.3: Payment Reminder Entity
 * TypeORM entity for payment reminder tracking
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  ReminderChannel,
  ReminderStatus,
} from "../../../../domain/payment-reminder";

@Entity({ name: "payment_reminders" })
@Index(["tenant_id", "payment_schedule_id"])
@Index(["status", "scheduled_for"])
@Index(["scheduled_for"])
export class PaymentReminderEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  payment_schedule_id: string;

  @Column({ type: "uuid", nullable: false })
  jamaah_id: string;

  @Column({
    type: "enum",
    enum: ReminderChannel,
    default: ReminderChannel.EMAIL,
  })
  channel: ReminderChannel;

  @Column({
    type: "enum",
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

  @Column({ type: "timestamp", nullable: true })
  sent_at: Date | null;

  @Column({ type: "timestamp", nullable: false })
  scheduled_for: Date;

  @Column({ type: "text", nullable: true })
  error_message: string | null;

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>;

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
}
