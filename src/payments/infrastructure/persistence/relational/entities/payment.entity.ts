/**
 * Epic 7, Story 7.1: Payment Entity
 * TypeORM entity for payment records
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
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  PaymentMethod,
  PaymentType,
  PaymentStatus,
} from "../../../../domain/payment";

@Entity({ name: "payments" })
@Index(["tenant_id", "jamaah_id"])
@Index(["tenant_id", "status", "created_at"])
@Index(["payment_date"])
@Index(["reference_number"])
export class PaymentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @Column({ type: "uuid", nullable: false })
  package_id: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.BANK_TRANSFER,
  })
  payment_method: PaymentMethod;

  @Column({
    type: "enum",
    enum: PaymentType,
    default: PaymentType.INSTALLMENT,
  })
  payment_type: PaymentType;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: "varchar", length: 100, nullable: true })
  reference_number: string | null;

  @Column({ type: "timestamp", nullable: false })
  payment_date: Date;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @Column({ type: "uuid", nullable: false })
  recorded_by_id: string;

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

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date | null;
}
