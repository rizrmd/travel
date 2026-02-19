/**
 * Integration 5: E-Signature Integration (PrivyID)
 * Migration: Add e-signature columns to contracts and create signature_events table
 */

import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableIndex,
} from "typeorm";

export class AddESignatureColumnsAndEventsTable1767200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add e-signature columns to contracts table
    await queryRunner.addColumns("contracts", [
      new TableColumn({
        name: "signature_request_id",
        type: "varchar",
        length: "100",
        isNullable: true,
      }),
      new TableColumn({
        name: "signature_status",
        type: "varchar",
        length: "50",
        default: "'pending'",
      }),
      new TableColumn({
        name: "signer_email",
        type: "varchar",
        length: "255",
        isNullable: true,
      }),
      new TableColumn({
        name: "signer_phone",
        type: "varchar",
        length: "50",
        isNullable: true,
      }),
      new TableColumn({
        name: "signature_url",
        type: "text",
        isNullable: true,
      }),
      new TableColumn({
        name: "signed_document_url",
        type: "text",
        isNullable: true,
      }),
      new TableColumn({
        name: "signature_certificate_url",
        type: "text",
        isNullable: true,
      }),
    ]);

    // Create indexes for new columns
    await queryRunner.createIndex(
      "contracts",
      new TableIndex({
        name: "idx_contracts_signature_status",
        columnNames: ["signature_status"],
      }),
    );

    await queryRunner.createIndex(
      "contracts",
      new TableIndex({
        name: "idx_contracts_signature_request",
        columnNames: ["signature_request_id"],
      }),
    );

    // 2. Create signature_events table
    await queryRunner.createTable(
      new Table({
        name: "signature_events",
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
            name: "signature_request_id",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "event_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "event_data",
            type: "jsonb",
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
            type: "text",
            isNullable: true,
          },
          {
            name: "occurred_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
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

    // Create indexes for signature_events
    await queryRunner.createIndex(
      "signature_events",
      new TableIndex({
        name: "idx_signature_events_tenant",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "signature_events",
      new TableIndex({
        name: "idx_signature_events_contract",
        columnNames: ["contract_id"],
      }),
    );

    await queryRunner.createIndex(
      "signature_events",
      new TableIndex({
        name: "idx_signature_events_request",
        columnNames: ["signature_request_id"],
      }),
    );

    await queryRunner.createIndex(
      "signature_events",
      new TableIndex({
        name: "idx_signature_events_tenant_type",
        columnNames: ["tenant_id", "event_type"],
      }),
    );

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE signature_events
      ADD CONSTRAINT fk_signature_events_tenant
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE signature_events
      ADD CONSTRAINT fk_signature_events_contract
      FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE;
    `);

    // Enable RLS for signature_events
    await queryRunner.query(`
      ALTER TABLE signature_events ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policy
    await queryRunner.query(`
      CREATE POLICY signature_events_tenant_isolation ON signature_events
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy
    await queryRunner.query(`
      DROP POLICY IF EXISTS signature_events_tenant_isolation ON signature_events;
    `);

    // Drop signature_events table
    await queryRunner.dropTable("signature_events", true);

    // Drop indexes from contracts
    await queryRunner.dropIndex("contracts", "idx_contracts_signature_request");
    await queryRunner.dropIndex("contracts", "idx_contracts_signature_status");

    // Drop columns from contracts
    await queryRunner.dropColumns("contracts", [
      "signature_request_id",
      "signature_status",
      "signer_email",
      "signer_phone",
      "signature_url",
      "signed_document_url",
      "signature_certificate_url",
    ]);
  }
}
