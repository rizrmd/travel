/**
 * Epic 11, Story 11.1-11.2: Revenue Snapshot Entity
 * Daily revenue snapshots for performance optimization
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";

@Entity({ name: "revenue_snapshots" })
@Index(["tenant_id", "snapshot_date"])
@Unique(["tenant_id", "snapshot_date"])
export class RevenueSnapshotEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "date", nullable: false })
  snapshot_date: Date;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  total_revenue: number;

  @Column({ type: "integer", nullable: false, default: 0 })
  payment_count: number;

  @Column({ type: "integer", nullable: false, default: 0 })
  jamaah_count: number;

  /**
   * Package breakdown structure:
   * {
   *   "packageId1": {
   *     "packageName": "Umroh Plus Turki",
   *     "revenue": 50000000,
   *     "count": 5
   *   },
   *   "packageId2": {...}
   * }
   */
  @Column({ type: "jsonb", nullable: true })
  package_breakdown: Record<
    string,
    {
      packageName: string;
      revenue: number;
      count: number;
    }
  > | null;

  /**
   * Agent breakdown structure:
   * {
   *   "agentId1": {
   *     "agentName": "Ahmad",
   *     "revenue": 30000000,
   *     "jamaahCount": 3,
   *     "paymentCount": 8
   *   },
   *   "agentId2": {...}
   * }
   */
  @Column({ type: "jsonb", nullable: true })
  agent_breakdown: Record<
    string,
    {
      agentName: string;
      revenue: number;
      jamaahCount: number;
      paymentCount: number;
    }
  > | null;

  /**
   * Revenue by payment method
   */
  @Column({ type: "jsonb", nullable: true })
  payment_method_breakdown: Record<string, number> | null;

  /**
   * Cumulative metrics for the month
   */
  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  month_to_date_revenue: number | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  year_to_date_revenue: number | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;
}
