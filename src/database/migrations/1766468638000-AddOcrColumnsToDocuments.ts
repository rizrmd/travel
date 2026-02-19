/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Migration: Add OCR-related columns to documents table
 * Provider: Verihubs (Indonesia-optimized OCR)
 */

import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from "typeorm";

export class AddOcrColumnsToDocuments1766468638000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add OCR-related columns to documents table
    await queryRunner.addColumns("documents", [
      new TableColumn({
        name: "ocr_extracted_data",
        type: "jsonb",
        isNullable: true,
        comment:
          "Extracted data from OCR processing (KTP, Passport, KK fields)",
      }),
      new TableColumn({
        name: "ocr_confidence_score",
        type: "decimal",
        precision: 5,
        scale: 2,
        isNullable: true,
        comment: "OCR confidence score (0-100)",
      }),
      new TableColumn({
        name: "ocr_processed_at",
        type: "timestamp",
        isNullable: true,
        comment: "Timestamp when OCR processing completed",
      }),
      new TableColumn({
        name: "quality_validation_result",
        type: "jsonb",
        isNullable: true,
        comment:
          "Document quality validation results (brightness, blur, resolution, orientation)",
      }),
      new TableColumn({
        name: "face_match_score",
        type: "decimal",
        precision: 5,
        scale: 2,
        isNullable: true,
        comment: "Face matching score for photo verification (if applicable)",
      }),
    ]);

    // Create index on ocr_confidence_score for filtering high-confidence documents
    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "idx_documents_ocr_confidence",
        columnNames: ["ocr_confidence_score"],
        where: "deleted_at IS NULL",
      }),
    );

    // Create composite index for OCR status tracking
    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "idx_documents_ocr_status",
        columnNames: ["tenant_id", "ocr_processed_at", "ocr_confidence_score"],
        where: "deleted_at IS NULL",
      }),
    );

    console.log("✅ Added OCR columns to documents table");
    console.log("✅ Created indexes for OCR performance optimization");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex("documents", "idx_documents_ocr_status");
    await queryRunner.dropIndex("documents", "idx_documents_ocr_confidence");

    // Drop columns
    await queryRunner.dropColumns("documents", [
      "face_match_score",
      "quality_validation_result",
      "ocr_processed_at",
      "ocr_confidence_score",
      "ocr_extracted_data",
    ]);

    console.log("✅ Reverted OCR columns from documents table");
  }
}
