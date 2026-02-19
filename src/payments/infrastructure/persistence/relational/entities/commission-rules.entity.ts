/**
 * Epic 7, Story 7.5: Commission Rules Entity
 * TypeORM entity for tenant-specific commission configuration
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

@Entity({ name: "commission_rules" })
@Index(["tenant_id"], { unique: true })
export class CommissionRulesEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false, unique: true })
  @Index()
  tenant_id: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: false,
    default: 16.0,
  })
  total_commission_percentage: number;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: false,
    default: 10.0,
  })
  direct_sale_percentage: number;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: false,
    default: 4.0,
  })
  parent_percentage: number;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: false,
    default: 2.0,
  })
  grandparent_percentage: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

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
