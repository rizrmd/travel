/**
 * Epic 13, Story 13.4: Training Progress Entity
 * Tracks user completion of training materials
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
import { UserEntity } from "../../../../../users/entities/user.entity";
import { TrainingMaterialEntity } from "./training-material.entity";
import { TrainingProgressStatus } from "../../../../domain/training-progress";

@Entity({ name: "training_progress" })
@Index(["tenant_id", "user_id", "status"])
@Index(["tenant_id", "material_id"])
@Index(["user_id", "material_id"], { unique: true })
export class TrainingProgressEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  @Column({ type: "uuid", nullable: false })
  @Index()
  user_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ type: "uuid", nullable: false })
  @Index()
  material_id: string;

  @ManyToOne(() => TrainingMaterialEntity, { eager: true })
  @JoinColumn({ name: "material_id" })
  material: TrainingMaterialEntity;

  // Progress Tracking
  @Column({
    type: "enum",
    enum: TrainingProgressStatus,
    default: TrainingProgressStatus.NOT_STARTED,
  })
  @Index()
  status: TrainingProgressStatus;

  @Column({ type: "int", default: 0 })
  progress_percentage: number;

  @Column({ type: "int", nullable: true })
  current_position_seconds: number | null;

  // Quiz/Assessment
  @Column({ type: "int", nullable: true })
  quiz_score: number | null;

  @Column({ type: "int", default: 0 })
  attempts_count: number;

  // Timestamps
  @Column({ type: "timestamp", nullable: true })
  started_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date | null;

  @Column({ type: "timestamp", nullable: true })
  last_accessed_at: Date | null;

  // Metadata
  @Column({ type: "jsonb", nullable: true })
  metadata: {
    notes?: string;
    bookmarks?: number[];
    quizAnswers?: Record<string, any>;
    certificateUrl?: string;
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
