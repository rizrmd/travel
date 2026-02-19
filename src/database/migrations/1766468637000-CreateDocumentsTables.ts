/**
 * Epic 6: Create Documents Tables Migration
 * Creates documents, batch_upload_jobs, and bulk_approval_jobs tables with RLS
 */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateDocumentsTables1766468637000 implements MigrationInterface {
  name = "CreateDocumentsTables1766468637000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create documents table
    await queryRunner.createTable(
      new Table({
        name: "documents",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "tenant_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "jamaah_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "document_type",
            type: "enum",
            enum: [
              "passport",
              "ktp",
              "kk",
              "photo",
              "vaccination",
              "visa",
              "flight_ticket",
              "hotel_voucher",
              "insurance",
              "other",
            ],
            isNullable: false,
          },
          {
            name: "file_url",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "integer",
            isNullable: false,
          },
          {
            name: "file_mime_type",
            type: "enum",
            enum: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "approved", "rejected", "expired"],
            default: "'pending'",
          },
          {
            name: "uploader_type",
            type: "enum",
            enum: ["agent", "jamaah", "admin"],
            isNullable: false,
          },
          {
            name: "uploaded_by_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "reviewed_by_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "rejection_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "extracted_data",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "expires_at",
            type: "date",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for documents table
    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_jamaah_id",
        columnNames: ["jamaah_id"],
      }),
    );

    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_tenant_jamaah_type",
        columnNames: ["tenant_id", "jamaah_id", "document_type"],
      }),
    );

    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_tenant_status_created",
        columnNames: ["tenant_id", "status", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_uploaded_by_id",
        columnNames: ["uploaded_by_id"],
      }),
    );

    await queryRunner.createIndex(
      "documents",
      new TableIndex({
        name: "IDX_documents_reviewed_by_id",
        columnNames: ["reviewed_by_id"],
      }),
    );

    // Create foreign keys for documents table
    await queryRunner.createForeignKey(
      "documents",
      new TableForeignKey({
        columnNames: ["jamaah_id"],
        referencedTableName: "jamaah",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "documents",
      new TableForeignKey({
        columnNames: ["uploaded_by_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    await queryRunner.createForeignKey(
      "documents",
      new TableForeignKey({
        columnNames: ["reviewed_by_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    // Create batch_upload_jobs table
    await queryRunner.createTable(
      new Table({
        name: "batch_upload_jobs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "tenant_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "uploaded_by_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "zip_file_url",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "zip_file_size",
            type: "integer",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "pending",
              "processing",
              "completed",
              "failed",
              "partial_success",
            ],
            default: "'pending'",
          },
          {
            name: "total_files",
            type: "integer",
            default: 0,
          },
          {
            name: "processed_files",
            type: "integer",
            default: 0,
          },
          {
            name: "successful_files",
            type: "integer",
            default: 0,
          },
          {
            name: "failed_files",
            type: "integer",
            default: 0,
          },
          {
            name: "error_report",
            type: "text",
            isNullable: true,
          },
          {
            name: "started_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "completed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for batch_upload_jobs table
    await queryRunner.createIndex(
      "batch_upload_jobs",
      new TableIndex({
        name: "IDX_batch_upload_jobs_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "batch_upload_jobs",
      new TableIndex({
        name: "IDX_batch_upload_jobs_tenant_status_created",
        columnNames: ["tenant_id", "status", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "batch_upload_jobs",
      new TableIndex({
        name: "IDX_batch_upload_jobs_uploaded_by_id",
        columnNames: ["uploaded_by_id"],
      }),
    );

    // Create foreign key for batch_upload_jobs table
    await queryRunner.createForeignKey(
      "batch_upload_jobs",
      new TableForeignKey({
        columnNames: ["uploaded_by_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    // Create bulk_approval_jobs table
    await queryRunner.createTable(
      new Table({
        name: "bulk_approval_jobs",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "tenant_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "reviewer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "action",
            type: "enum",
            enum: ["approve", "reject"],
            isNullable: false,
          },
          {
            name: "document_ids",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "processing", "completed", "failed"],
            default: "'pending'",
          },
          {
            name: "total_documents",
            type: "integer",
            default: 0,
          },
          {
            name: "processed_documents",
            type: "integer",
            default: 0,
          },
          {
            name: "successful_documents",
            type: "integer",
            default: 0,
          },
          {
            name: "failed_documents",
            type: "integer",
            default: 0,
          },
          {
            name: "rejection_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "error_report",
            type: "text",
            isNullable: true,
          },
          {
            name: "started_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "completed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for bulk_approval_jobs table
    await queryRunner.createIndex(
      "bulk_approval_jobs",
      new TableIndex({
        name: "IDX_bulk_approval_jobs_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "bulk_approval_jobs",
      new TableIndex({
        name: "IDX_bulk_approval_jobs_tenant_status_created",
        columnNames: ["tenant_id", "status", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "bulk_approval_jobs",
      new TableIndex({
        name: "IDX_bulk_approval_jobs_reviewer_id",
        columnNames: ["reviewer_id"],
      }),
    );

    // Create foreign key for bulk_approval_jobs table
    await queryRunner.createForeignKey(
      "bulk_approval_jobs",
      new TableForeignKey({
        columnNames: ["reviewer_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    // Enable Row-Level Security on all tables
    await queryRunner.query(`ALTER TABLE documents ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE batch_upload_jobs ENABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(
      `ALTER TABLE bulk_approval_jobs ENABLE ROW LEVEL SECURITY`,
    );

    // Create RLS policies for documents table
    await queryRunner.query(`
      CREATE POLICY documents_tenant_isolation ON documents
      FOR ALL
      USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
    `);

    // Additional policy: Agents can only see documents for their jamaah
    await queryRunner.query(`
      CREATE POLICY documents_agent_access ON documents
      FOR SELECT
      USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
        AND (
          current_setting('app.current_user_role', true) = 'admin'
          OR jamaah_id IN (
            SELECT id FROM jamaah
            WHERE agent_id = current_setting('app.current_user_id', true)::uuid
          )
        )
      )
    `);

    // Create RLS policies for batch_upload_jobs table
    await queryRunner.query(`
      CREATE POLICY batch_upload_jobs_tenant_isolation ON batch_upload_jobs
      FOR ALL
      USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
    `);

    // Create RLS policies for bulk_approval_jobs table
    await queryRunner.query(`
      CREATE POLICY bulk_approval_jobs_tenant_isolation ON bulk_approval_jobs
      FOR ALL
      USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS documents_agent_access ON documents`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS documents_tenant_isolation ON documents`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS batch_upload_jobs_tenant_isolation ON batch_upload_jobs`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS bulk_approval_jobs_tenant_isolation ON bulk_approval_jobs`,
    );

    // Disable RLS
    await queryRunner.query(`ALTER TABLE documents DISABLE ROW LEVEL SECURITY`);
    await queryRunner.query(
      `ALTER TABLE batch_upload_jobs DISABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(
      `ALTER TABLE bulk_approval_jobs DISABLE ROW LEVEL SECURITY`,
    );

    // Drop tables
    await queryRunner.dropTable("bulk_approval_jobs");
    await queryRunner.dropTable("batch_upload_jobs");
    await queryRunner.dropTable("documents");
  }
}
