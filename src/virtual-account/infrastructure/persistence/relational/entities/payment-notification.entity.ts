/**
 * Integration 4: Virtual Account Payment Gateway
 * Entity: Payment Notification
 *
 * Stores webhook notifications from Midtrans when payment is received.
 * Each notification is processed asynchronously via BullMQ.
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
import { BankCode } from "../../../../domain/bank-code.enum";
import { NotificationStatus } from "../../../../domain/va-status.enum";
import { VirtualAccountEntity } from "./virtual-account.entity";
import { PaymentEntity } from "../../../../../payments/infrastructure/persistence/relational/entities/payment.entity";

@Entity({ name: "payment_notifications" })
@Index(["tenant_id"])
@Index(["va_number"])
@Index(["transaction_id"], { unique: true })
@Index(["status"])
export class PaymentNotificationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: true })
  virtual_account_id: string | null;

  @ManyToOne(() => VirtualAccountEntity, { eager: false })
  @JoinColumn({ name: "virtual_account_id" })
  virtual_account: VirtualAccountEntity | null;

  @Column({ type: "uuid", nullable: true })
  payment_id: string | null;

  @ManyToOne(() => PaymentEntity, { eager: false })
  @JoinColumn({ name: "payment_id" })
  payment: PaymentEntity | null;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  transaction_id: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  va_number: string;

  @Column({
    type: "enum",
    enum: BankCode,
    nullable: false,
  })
  bank_code: BankCode;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: false })
  amount: number;

  @Column({ type: "timestamp", nullable: false })
  paid_at: Date;

  @Column({ type: "jsonb", nullable: false })
  raw_notification: Record<string, any>;

  @Column({ type: "varchar", length: 255, nullable: true })
  signature_key: string | null;

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: "timestamp", nullable: true })
  processed_at: Date | null;

  @Column({ type: "text", nullable: true })
  error_message: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
