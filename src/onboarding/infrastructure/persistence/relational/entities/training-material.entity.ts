/**
 * Epic 13, Story 13.4: Training Material Entity
 * Stores training content (videos, PDFs, FAQs, articles)
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
  TrainingCategory,
  ContentType,
} from "../../../../domain/training-material";

@Entity({ name: "training_materials" })
@Index(["tenant_id", "category", "sort_order"])
@Index(["tenant_id", "is_mandatory"])
@Index(["tenant_id", "created_at"])
export class TrainingMaterialEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  // Content Classification
  @Column({
    type: "enum",
    enum: TrainingCategory,
    nullable: false,
  })
  @Index()
  category: TrainingCategory;

  @Column({ type: "varchar", length: 500, nullable: false })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  // Content Details
  @Column({
    type: "enum",
    enum: ContentType,
    nullable: false,
  })
  content_type: ContentType;

  @Column({ type: "varchar", length: 1000, nullable: false })
  content_url: string;

  @Column({ type: "int", default: 0 })
  duration_minutes: number;

  // Organization
  @Column({ type: "int", default: 0 })
  sort_order: number;

  @Column({ type: "boolean", default: false })
  is_mandatory: boolean;

  @Column({ type: "boolean", default: true })
  is_published: boolean;

  // Additional Metadata
  @Column({ type: "jsonb", nullable: true })
  metadata: {
    tags?: string[];
    difficulty?: "beginner" | "intermediate" | "advanced";
    prerequisites?: string[];
    relatedMaterials?: string[];
    thumbnailUrl?: string;
    transcript?: string;
    videoId?: string;
    embedUrl?: string;
  } | null;

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
}
