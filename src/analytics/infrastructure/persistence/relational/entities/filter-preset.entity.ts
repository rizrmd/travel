/**
 * Epic 11, Story 11.7: Filter Preset Entity
 * Saved filter configurations for quick access
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

@Entity({ name: "filter_presets" })
@Index(["tenant_id", "user_id", "is_public"])
@Index(["tenant_id", "created_at"])
export class FilterPresetEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  user_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  /**
   * Filter configuration structure:
   * {
   *   "agents": ["agentId1", "agentId2"],
   *   "packages": ["packageId1"],
   *   "statuses": ["lead", "interested"],
   *   "dateRange": {
   *     "start": "2024-01-01",
   *     "end": "2024-12-31"
   *   },
   *   "paymentMethods": ["bank_transfer"],
   *   "searchTerm": "ahmad",
   *   "minRevenue": 10000000,
   *   "maxRevenue": 50000000
   * }
   */
  @Column({ type: "jsonb", nullable: false })
  filters: {
    agents?: string[];
    packages?: string[];
    statuses?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    paymentMethods?: string[];
    searchTerm?: string;
    minRevenue?: number;
    maxRevenue?: number;
    [key: string]: any;
  };

  @Column({ type: "boolean", default: false })
  is_public: boolean;

  @Column({ type: "boolean", default: false })
  is_default: boolean;

  @Column({ type: "integer", default: 0 })
  usage_count: number;

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
