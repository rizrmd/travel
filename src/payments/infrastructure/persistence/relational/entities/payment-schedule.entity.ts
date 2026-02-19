/**
 * Epic 7, Story 7.2: Payment Schedule Entity
 * TypeORM entity for installment tracking
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
import { ScheduleStatus } from "../../../../domain/payment-schedule";

@Entity({ name: "payment_schedules" })
@Index(["tenant_id", "jamaah_id"])
@Index(["status", "due_date"])
@Index(["due_date"])
export class PaymentScheduleEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @Column({ type: "int", nullable: false })
  installment_number: number;

  @Column({ type: "date", nullable: false })
  due_date: Date;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: "enum",
    enum: ScheduleStatus,
    default: ScheduleStatus.PENDING,
  })
  status: ScheduleStatus;

  @Column({ type: "timestamp", nullable: true })
  paid_at: Date | null;

  @Column({ type: "uuid", nullable: true })
  payment_id: string | null;

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
