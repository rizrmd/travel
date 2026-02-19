/**
 * Epic 13: Create Onboarding & Migration Tables Migration
 * Creates all 6 tables for onboarding functionality
 */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateOnboardingTables1703520000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create migration_jobs table
    await queryRunner.createTable(
      new Table({
        name: "migration_jobs",
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
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "import_type",
            type: "enum",
            enum: ["jamaah", "payment", "package"],
            isNullable: false,
          },
          {
            name: "file_name",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "file_url",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "bigint",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "pending",
              "validating",
              "importing",
              "completed",
              "failed",
              "rolled_back",
            ],
            default: "'pending'",
          },
          {
            name: "total_rows",
            type: "int",
            default: 0,
          },
          {
            name: "processed_rows",
            type: "int",
            default: 0,
          },
          {
            name: "valid_rows",
            type: "int",
            default: 0,
          },
          {
            name: "invalid_rows",
            type: "int",
            default: 0,
          },
          {
            name: "error_report_url",
            type: "varchar",
            length: "1000",
            isNullable: true,
          },
          {
            name: "error_message",
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
            name: "metadata",
            type: "jsonb",
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
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "migration_jobs",
      new TableIndex({
        name: "IDX_migration_jobs_tenant_user_status",
        columnNames: ["tenant_id", "user_id", "status"],
      }),
    );

    // 2. Create migration_errors table
    await queryRunner.createTable(
      new Table({
        name: "migration_errors",
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
            name: "migration_job_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "row_number",
            type: "int",
            isNullable: false,
          },
          {
            name: "error_type",
            type: "enum",
            enum: [
              "missing_required",
              "invalid_format",
              "duplicate",
              "constraint_violation",
            ],
            isNullable: false,
          },
          {
            name: "field_name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "error_message",
            type: "text",
            isNullable: false,
          },
          {
            name: "expected_format",
            type: "text",
            isNullable: true,
          },
          {
            name: "received_value",
            type: "text",
            isNullable: true,
          },
          {
            name: "row_data",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "migration_errors",
      new TableForeignKey({
        columnNames: ["migration_job_id"],
        referencedTableName: "migration_jobs",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createIndex(
      "migration_errors",
      new TableIndex({
        name: "IDX_migration_errors_job_type",
        columnNames: ["migration_job_id", "error_type"],
      }),
    );

    // 3. Create training_materials table
    await queryRunner.createTable(
      new Table({
        name: "training_materials",
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
            name: "category",
            type: "enum",
            enum: ["video_tutorial", "pdf_guide", "faq", "article"],
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "content_type",
            type: "enum",
            enum: ["youtube", "vimeo", "pdf", "link"],
            isNullable: false,
          },
          {
            name: "content_url",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "duration_minutes",
            type: "int",
            default: 0,
          },
          {
            name: "sort_order",
            type: "int",
            default: 0,
          },
          {
            name: "is_mandatory",
            type: "boolean",
            default: false,
          },
          {
            name: "is_published",
            type: "boolean",
            default: true,
          },
          {
            name: "metadata",
            type: "jsonb",
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
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "training_materials",
      new TableIndex({
        name: "IDX_training_materials_tenant_category",
        columnNames: ["tenant_id", "category", "sort_order"],
      }),
    );

    // 4. Create training_progress table
    await queryRunner.createTable(
      new Table({
        name: "training_progress",
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
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "material_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["not_started", "in_progress", "completed"],
            default: "'not_started'",
          },
          {
            name: "progress_percentage",
            type: "int",
            default: 0,
          },
          {
            name: "current_position_seconds",
            type: "int",
            isNullable: true,
          },
          {
            name: "quiz_score",
            type: "int",
            isNullable: true,
          },
          {
            name: "attempts_count",
            type: "int",
            default: 0,
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
            name: "last_accessed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
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
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "training_progress",
      new TableIndex({
        name: "IDX_training_progress_user_material",
        columnNames: ["user_id", "material_id"],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      "training_progress",
      new TableForeignKey({
        columnNames: ["material_id"],
        referencedTableName: "training_materials",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 5. Create user_activities table
    await queryRunner.createTable(
      new Table({
        name: "user_activities",
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
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "activity_type",
            type: "enum",
            enum: [
              "login",
              "logout",
              "page_view",
              "feature_used",
              "training_started",
              "training_completed",
              "document_uploaded",
              "payment_created",
              "jamaah_created",
              "report_generated",
            ],
            isNullable: false,
          },
          {
            name: "activity_description",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "page_url",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "feature_name",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "session_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "session_duration_seconds",
            type: "int",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "user_activities",
      new TableIndex({
        name: "IDX_user_activities_tenant_user_type_date",
        columnNames: ["tenant_id", "user_id", "activity_type", "created_at"],
      }),
    );

    // 6. Create training_requests table
    await queryRunner.createTable(
      new Table({
        name: "training_requests",
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
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "topic",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "message",
            type: "text",
            isNullable: true,
          },
          {
            name: "preferred_date",
            type: "date",
            isNullable: true,
          },
          {
            name: "preferred_time",
            type: "time",
            isNullable: true,
          },
          {
            name: "contact_method",
            type: "enum",
            enum: ["email", "phone", "whatsapp", "zoom", "in_person"],
            default: "'email'",
          },
          {
            name: "status",
            type: "enum",
            enum: [
              "pending",
              "assigned",
              "scheduled",
              "completed",
              "cancelled",
            ],
            default: "'pending'",
          },
          {
            name: "assigned_to_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "assigned_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "scheduled_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "scheduled_duration_minutes",
            type: "int",
            isNullable: true,
          },
          {
            name: "meeting_url",
            type: "varchar",
            length: "1000",
            isNullable: true,
          },
          {
            name: "meeting_location",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "completed_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "completion_notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "satisfaction_rating",
            type: "int",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
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
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "training_requests",
      new TableIndex({
        name: "IDX_training_requests_tenant_status",
        columnNames: ["tenant_id", "status", "created_at"],
      }),
    );

    // Enable RLS on all tables
    await queryRunner.query(
      "ALTER TABLE migration_jobs ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE migration_errors ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE training_materials ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE training_requests ENABLE ROW LEVEL SECURITY",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("training_requests");
    await queryRunner.dropTable("user_activities");
    await queryRunner.dropTable("training_progress");
    await queryRunner.dropTable("training_materials");
    await queryRunner.dropTable("migration_errors");
    await queryRunner.dropTable("migration_jobs");
  }
}
