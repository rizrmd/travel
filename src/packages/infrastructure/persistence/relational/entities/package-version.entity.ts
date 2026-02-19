/**
 * Epic 4, Story 4.6: Package Version Entity
 * TypeORM entity for package_versions table (audit trail)
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
import { PackageEntity } from "./package.entity";

@Entity({ name: "package_versions" })
@Index(["tenant_id", "package_id"])
@Index(["package_id", "version_number"], { unique: true })
@Index(["package_id", "created_at"])
export class PackageVersionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  package_id: string;

  @Column({ type: "integer", nullable: false })
  version_number: number;

  @Column({ type: "jsonb", nullable: false })
  snapshot: Record<string, any>;

  @Column({ type: "jsonb", default: [] })
  changed_fields: string[];

  @Column({ type: "text", nullable: false })
  change_summary: string;

  @Column({ type: "uuid", nullable: false })
  changed_by_id: string;

  @Column({ type: "text", nullable: true })
  change_reason: string | null;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  // Relations
  @ManyToOne(() => PackageEntity, (pkg) => pkg.versions)
  @JoinColumn({ name: "package_id" })
  package: PackageEntity;
}
