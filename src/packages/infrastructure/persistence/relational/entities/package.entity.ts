/**
 * Epic 4, Story 4.1: Package Entity
 * TypeORM entity for packages table with RLS support
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import { PackageStatus } from "../../../../domain/package";
import { ItineraryItemEntity } from "./itinerary-item.entity";
import { PackageInclusionEntity } from "./package-inclusion.entity";
import { PackageVersionEntity } from "./package-version.entity";

@Entity({ name: "packages" })
@Index(["tenant_id", "status", "departure_date"])
@Index(["tenant_id", "created_at"])
@Index(["departure_date"])
export class PackageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: "integer", nullable: false })
  duration_days: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  retail_price: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  wholesale_price: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  cost_price: number | null;

  @Column({ type: "integer", nullable: false })
  capacity: number;

  @Column({ type: "integer", nullable: false })
  available_slots: number;

  @Column({ type: "date", nullable: false })
  departure_date: Date;

  @Column({ type: "date", nullable: false })
  return_date: Date;

  @Column({
    type: "enum",
    enum: PackageStatus,
    default: PackageStatus.DRAFT,
  })
  status: PackageStatus;

  @Column({ type: "uuid", nullable: false })
  created_by_id: string;

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

  // Relations
  @OneToMany(() => ItineraryItemEntity, (itinerary) => itinerary.package)
  itinerary_items: ItineraryItemEntity[];

  @OneToMany(() => PackageInclusionEntity, (inclusion) => inclusion.package)
  inclusions: PackageInclusionEntity[];

  @OneToMany(() => PackageVersionEntity, (version) => version.package)
  versions: PackageVersionEntity[];

  /**
   * Auto-calculate return date before insert
   */
  @BeforeInsert()
  calculateReturnDate() {
    if (this.departure_date && this.duration_days && !this.return_date) {
      const returnDate = new Date(this.departure_date);
      returnDate.setDate(returnDate.getDate() + this.duration_days);
      this.return_date = returnDate;
    }

    // Initialize available_slots to capacity if not set
    if (this.capacity && !this.available_slots) {
      this.available_slots = this.capacity;
    }
  }
}
