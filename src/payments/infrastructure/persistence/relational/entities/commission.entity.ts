/**
 * Epic 7, Stories 7.4 & 7.5: Commission Entity
 * TypeORM entity for commission tracking and multi-level splits
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
  CommissionStatus,
  CommissionLevel,
} from "../../../../domain/commission";

@Entity({ name: "commissions" })
@Index(["tenant_id", "agent_id"])
@Index(["tenant_id", "status", "created_at"])
@Index(["jamaah_id"])
@Index(["payment_id"])
export class CommissionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  agent_id: string;

  @Column({ type: "uuid", nullable: false })
  jamaah_id: string;

  @Column({ type: "uuid", nullable: false })
  payment_id: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  base_amount: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
  commission_percentage: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  commission_amount: number;

  @Column({
    type: "enum",
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @Column({ type: "int", default: CommissionLevel.DIRECT })
  level: CommissionLevel;

  @Column({ type: "uuid", nullable: true })
  original_agent_id: string | null;

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
