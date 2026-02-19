/**
 * Epic 4, Story 4.2: Itinerary Item Entity
 * TypeORM entity for package_itineraries table
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
import { Activity, MealsIncluded } from "../../../../domain/itinerary";
import { PackageEntity } from "./package.entity";

@Entity({ name: "package_itineraries" })
@Index(["tenant_id", "package_id"])
@Index(["package_id", "day_number"], { unique: true })
@Index(["package_id", "sort_order"])
export class ItineraryItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  package_id: string;

  @Column({ type: "integer", nullable: false })
  day_number: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "jsonb", default: [] })
  activities: Activity[];

  @Column({ type: "varchar", length: 255, nullable: true })
  accommodation: string | null;

  @Column({
    type: "jsonb",
    default: { breakfast: false, lunch: false, dinner: false },
  })
  meals_included: MealsIncluded;

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
  @ManyToOne(() => PackageEntity, (pkg) => pkg.itinerary_items)
  @JoinColumn({ name: "package_id" })
  package: PackageEntity;
}
