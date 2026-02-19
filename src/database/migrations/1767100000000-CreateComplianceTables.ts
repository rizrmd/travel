/**
 * Epic 12: Create Compliance Tables Migration
 * Creates 4 tables: contracts, signatures, audit_logs, compliance_reports
 */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateComplianceTables1767100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable RLS
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1. Create contracts table
    await queryRunner.createTable(
      new Table({
        name: "contracts",
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
            name: "package_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "contract_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "contract_number",
            type: "varchar",
            length: "50",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "template_version",
            type: "varchar",
            length: "20",
            default: "'1.0'",
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'draft'",
          },
          {
            name: "generated_at",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "sent_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "viewed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "signed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "completed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "expires_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "contract_url",
            type: "text",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            default: "'{}'",
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for contracts
    await queryRunner.createIndex(
      "contracts",
      new TableIndex({
        name: "idx_contracts_tenant_jamaah",
        columnNames: ["tenant_id", "jamaah_id"],
      }),
    );

    await queryRunner.createIndex(
      "contracts",
      new TableIndex({
        name: "idx_contracts_tenant_status",
        columnNames: ["tenant_id", "status"],
      }),
    );

    await queryRunner.createIndex(
      "contracts",
      new TableIndex({
        name: "idx_contracts_sent_at",
        columnNames: ["sent_at"],
      }),
    );

    // 2. Create signatures table
    await queryRunner.createTable(
      new Table({
        name: "signatures",
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
            name: "contract_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "signer_type",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "signer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "signer_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "signer_email",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "signature_provider",
            type: "varchar",
            length: "50",
            default: "'manual'",
          },
          {
            name: "provider_envelope_id",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'pending'",
          },
          {
            name: "sent_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "delivered_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "viewed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "signed_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "declined_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "expires_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "text",
            isNullable: true,
          },
          {
            name: "signature_image_url",
            type: "text",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            default: "'{}'",
          },
          {
            name: "events",
            type: "jsonb",
            default: "'[]'",
          },
          {
            name: "reminder_count",
            type: "int",
            default: 0,
          },
          {
            name: "last_reminder_sent_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for signatures
    await queryRunner.createIndex(
      "signatures",
      new TableIndex({
        name: "idx_signatures_tenant_contract",
        columnNames: ["tenant_id", "contract_id"],
      }),
    );

    await queryRunner.createIndex(
      "signatures",
      new TableIndex({
        name: "idx_signatures_tenant_status",
        columnNames: ["tenant_id", "status"],
      }),
    );

    // 3. Create audit_logs table (immutable)
    await queryRunner.createTable(
      new Table({
        name: "audit_logs",
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
            name: "log_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "entity_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "entity_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "action",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "actor_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "actor_role",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "actor_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "before_state",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "after_state",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "retention_expires_at",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "archived",
            type: "boolean",
            default: false,
          },
          {
            name: "archive_url",
            type: "text",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for audit_logs
    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "idx_audit_logs_tenant_type",
        columnNames: ["tenant_id", "log_type"],
      }),
    );

    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "idx_audit_logs_tenant_entity",
        columnNames: ["tenant_id", "entity_type", "entity_id"],
      }),
    );

    await queryRunner.createIndex(
      "audit_logs",
      new TableIndex({
        name: "idx_audit_logs_tenant_created",
        columnNames: ["tenant_id", "created_at"],
      }),
    );

    // Prevent updates/deletes on audit_logs (immutable)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
      RETURNS TRIGGER AS $$
      BEGIN
        RAISE EXCEPTION 'Audit logs are immutable and cannot be modified or deleted';
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER prevent_audit_log_update
        BEFORE UPDATE ON audit_logs
        FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

      CREATE TRIGGER prevent_audit_log_delete
        BEFORE DELETE ON audit_logs
        FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
    `);

    // 4. Create compliance_reports table
    await queryRunner.createTable(
      new Table({
        name: "compliance_reports",
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
            name: "report_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "period_start",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "period_end",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'generating'",
          },
          {
            name: "file_url",
            type: "text",
            isNullable: true,
          },
          {
            name: "metadata",
            type: "jsonb",
            default: "'{}'",
          },
          {
            name: "generated_by_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "generated_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "error_message",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for compliance_reports
    await queryRunner.createIndex(
      "compliance_reports",
      new TableIndex({
        name: "idx_compliance_reports_tenant_type",
        columnNames: ["tenant_id", "report_type"],
      }),
    );

    await queryRunner.createIndex(
      "compliance_reports",
      new TableIndex({
        name: "idx_compliance_reports_tenant_period",
        columnNames: ["tenant_id", "period_start", "period_end"],
      }),
    );

    // Enable Row Level Security
    await queryRunner.query(`
      ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
      ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policies (basic policies - customize based on requirements)
    await queryRunner.query(`
      -- Contracts policies
      CREATE POLICY contracts_tenant_isolation ON contracts
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

      -- Signatures policies
      CREATE POLICY signatures_tenant_isolation ON signatures
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

      -- Audit logs policies (read-only for tenants)
      CREATE POLICY audit_logs_tenant_isolation ON audit_logs
        FOR SELECT
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

      -- Compliance reports policies
      CREATE POLICY compliance_reports_tenant_isolation ON compliance_reports
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`
      DROP POLICY IF EXISTS contracts_tenant_isolation ON contracts;
      DROP POLICY IF EXISTS signatures_tenant_isolation ON signatures;
      DROP POLICY IF EXISTS audit_logs_tenant_isolation ON audit_logs;
      DROP POLICY IF EXISTS compliance_reports_tenant_isolation ON compliance_reports;
    `);

    // Drop triggers and functions
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS prevent_audit_log_update ON audit_logs;
      DROP TRIGGER IF EXISTS prevent_audit_log_delete ON audit_logs;
      DROP FUNCTION IF EXISTS prevent_audit_log_modification();
    `);

    // Drop tables
    await queryRunner.dropTable("compliance_reports", true);
    await queryRunner.dropTable("audit_logs", true);
    await queryRunner.dropTable("signatures", true);
    await queryRunner.dropTable("contracts", true);
  }
}
