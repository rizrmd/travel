/**
 * Integration 4: Virtual Account Payment Gateway
 * Entity: Virtual Account
 *
 * Stores virtual account numbers generated for each jamaah.
 * Each VA is unique and linked to a specific bank.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { BankCode } from "../../../../domain/bank-code.enum";
import { VAStatus } from "../../../../domain/va-status.enum";
import { JamaahEntity } from "../../../../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentNotificationEntity } from "./payment-notification.entity";

@Entity({ name: "virtual_accounts" })
@Index(["tenant_id", "jamaah_id"])
@Index(["tenant_id", "status"])
@Index(["va_number"], { unique: true })
export class VirtualAccountEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @ManyToOne(() => JamaahEntity, { eager: false })
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity;

  @Column({ type: "varchar", length: 50, nullable: false, unique: true })
  va_number: string;

  @Column({
    type: "enum",
    enum: BankCode,
    nullable: false,
  })
  bank_code: BankCode;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  amount: number | null;

  @Column({
    type: "enum",
    enum: VAStatus,
    default: VAStatus.ACTIVE,
  })
  status: VAStatus;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date | null;

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

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PaymentNotificationEntity,
    (notification) => notification.virtual_account,
  )
  notifications: PaymentNotificationEntity[];
}
