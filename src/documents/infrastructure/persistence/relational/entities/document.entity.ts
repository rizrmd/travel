/**
 * Epic 6, Story 6.1: Document Entity
 * TypeORM entity for documents table with RLS support
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { EntityRelationalHelper } from "../../../../../utils/relational-entity-helper";
import {
  DocumentType,
  DocumentStatus,
  UploaderType,
  FileMimeType,
} from "../../../../domain/document";
import { JamaahEntity } from "../../../../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { UserEntity } from "../../../../../users/entities/user.entity";

@Entity({ name: "documents" })
@Index(["tenant_id", "jamaah_id", "document_type"])
@Index(["tenant_id", "status", "created_at"])
@Index(["jamaah_id", "document_type", "status"])
@Index(["uploaded_by_id"])
@Index(["reviewed_by_id"])
export class DocumentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Multi-tenant support with RLS
  @Column({ type: "uuid", nullable: false })
  @Index()
  tenant_id: string;

  // Jamaah reference
  @Column({ type: "uuid", nullable: false })
  @Index()
  jamaah_id: string;

  @ManyToOne(() => JamaahEntity, { eager: false })
  @JoinColumn({ name: "jamaah_id" })
  jamaah: JamaahEntity;

  // Document information
  @Column({
    type: "enum",
    enum: DocumentType,
    nullable: false,
  })
  document_type: DocumentType;

  @Column({ type: "varchar", length: 500, nullable: false })
  file_url: string;

  @Column({ type: "integer", nullable: false })
  file_size: number;

  @Column({
    type: "enum",
    enum: FileMimeType,
    nullable: false,
  })
  file_mime_type: FileMimeType;

  // Status tracking
  @Column({
    type: "enum",
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  // Uploader information
  @Column({
    type: "enum",
    enum: UploaderType,
    nullable: false,
  })
  uploader_type: UploaderType;

  @Column({ type: "uuid", nullable: false })
  @Index()
  uploaded_by_id: string;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "uploaded_by_id" })
  uploaded_by: UserEntity;

  // Review information
  @Column({ type: "uuid", nullable: true })
  @Index()
  reviewed_by_id: string | null;

  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: "reviewed_by_id" })
  reviewed_by: UserEntity | null;

  @Column({ type: "timestamp", nullable: true })
  reviewed_at: Date | null;

  @Column({ type: "text", nullable: true })
  rejection_reason: string | null;

  // OCR extracted data (Integration 1: Verihubs OCR)
  @Column({ type: "jsonb", nullable: true })
  extracted_data: Record<string, any> | null;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  ocr_confidence_score: number | null;

  @Column({ type: "timestamp", nullable: true })
  ocr_processed_at: Date | null;

  @Column({ type: "jsonb", nullable: true })
  quality_validation_result: Record<string, any> | null;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  face_match_score: number | null;

  // Expiration tracking (for passport, visa, etc.)
  @Column({ type: "date", nullable: true })
  expires_at: Date | null;

  // Metadata
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
}
