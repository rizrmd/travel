/**
 * Epic 4, Story 4.4: Package Inclusion Entity
 * TypeORM entity for package_inclusions table
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
import { PackageEntity } from "./package.entity";

export enum InclusionCategory {
  FLIGHT = "flight",
  ACCOMMODATION = "accommodation",
  TRANSPORTATION = "transportation",
  MEALS = "meals",
  VISA = "visa",
  INSURANCE = "insurance",
  GUIDE = "guide",
  OTHER = "other",
}

@Entity({ name: "package_inclusions" })
@Index(["tenant_id", "package_id"])
@Index(["package_id", "is_included", "sort_order"])
export class PackageInclusionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  package_id: string;

  @Column({
    type: "enum",
    enum: InclusionCategory,
    nullable: false,
  })
  category: InclusionCategory;

  @Column({ type: "text", nullable: false })
  description: string;

  @Column({ type: "boolean", default: true })
  is_included: boolean;

  @Column({ type: "integer", nullable: false })
  sort_order: number;

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

  // Relations
  @ManyToOne(() => PackageEntity, (pkg) => pkg.inclusions)
  @JoinColumn({ name: "package_id" })
  package: PackageEntity;
}
