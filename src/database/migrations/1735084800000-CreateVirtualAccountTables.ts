/**
 * Integration 4: Virtual Account Payment Gateway
 * Migration: Create virtual_accounts and payment_notifications tables
 *
 * This migration creates tables for:
 * 1. Virtual Account management (VA numbers per jamaah)
 * 2. Payment notification tracking (webhook from Midtrans)
 */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVirtualAccountTables1735084800000 implements MigrationInterface {
  name = "CreateVirtualAccountTables1735084800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create virtual_accounts table
    await queryRunner.query(`
      CREATE TABLE virtual_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        jamaah_id UUID NOT NULL,
        va_number VARCHAR(50) NOT NULL UNIQUE,
        bank_code VARCHAR(20) NOT NULL,
        amount DECIMAL(15,2),
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        expires_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_virtual_accounts_tenant
          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        CONSTRAINT fk_virtual_accounts_jamaah
          FOREIGN KEY (jamaah_id) REFERENCES jamaah(id) ON DELETE CASCADE,
        CONSTRAINT chk_virtual_accounts_status
          CHECK (status IN ('active', 'expired', 'used', 'closed')),
        CONSTRAINT chk_virtual_accounts_bank
          CHECK (bank_code IN ('bca', 'mandiri', 'bni', 'bri', 'permata'))
      )
    `);

    // Create payment_notifications table
    await queryRunner.query(`
      CREATE TABLE payment_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        virtual_account_id UUID,
        payment_id UUID,
        transaction_id VARCHAR(100) NOT NULL UNIQUE,
        va_number VARCHAR(50) NOT NULL,
        bank_code VARCHAR(20) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        paid_at TIMESTAMP NOT NULL,
        raw_notification JSONB NOT NULL,
        signature_key VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        processed_at TIMESTAMP,
        error_message TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_payment_notifications_tenant
          FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
        CONSTRAINT fk_payment_notifications_va
          FOREIGN KEY (virtual_account_id) REFERENCES virtual_accounts(id) ON DELETE SET NULL,
        CONSTRAINT fk_payment_notifications_payment
          FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
        CONSTRAINT chk_payment_notifications_status
          CHECK (status IN ('pending', 'processed', 'failed'))
      )
    `);

    // Create indexes for virtual_accounts
    await queryRunner.query(`
      CREATE INDEX idx_virtual_accounts_tenant
        ON virtual_accounts(tenant_id)
        WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX idx_virtual_accounts_jamaah
        ON virtual_accounts(jamaah_id)
        WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX idx_virtual_accounts_number
        ON virtual_accounts(va_number)
        WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX idx_virtual_accounts_status
        ON virtual_accounts(status)
        WHERE deleted_at IS NULL
    `);

    // Create indexes for payment_notifications
    await queryRunner.query(`
      CREATE INDEX idx_payment_notifications_va
        ON payment_notifications(va_number)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_payment_notifications_transaction
        ON payment_notifications(transaction_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_payment_notifications_status
        ON payment_notifications(status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_payment_notifications_tenant
        ON payment_notifications(tenant_id)
    `);

    // Enable Row Level Security
    await queryRunner.query(`
      ALTER TABLE virtual_accounts ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      ALTER TABLE payment_notifications ENABLE ROW LEVEL SECURITY
    `);

    // Create RLS policies for virtual_accounts
    await queryRunner.query(`
      CREATE POLICY virtual_accounts_tenant_isolation ON virtual_accounts
        USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
    `);

    // Create RLS policies for payment_notifications
    await queryRunner.query(`
      CREATE POLICY payment_notifications_tenant_isolation ON payment_notifications
        USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
    `);

    // Add trigger for updated_at on virtual_accounts
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_virtual_accounts_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER trigger_update_virtual_accounts_timestamp
        BEFORE UPDATE ON virtual_accounts
        FOR EACH ROW
        EXECUTE FUNCTION update_virtual_accounts_timestamp()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers and functions
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_virtual_accounts_timestamp ON virtual_accounts`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_virtual_accounts_timestamp()`,
    );

    // Drop RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS payment_notifications_tenant_isolation ON payment_notifications`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS virtual_accounts_tenant_isolation ON virtual_accounts`,
    );

    // Disable RLS
    await queryRunner.query(
      `ALTER TABLE payment_notifications DISABLE ROW LEVEL SECURITY`,
    );
    await queryRunner.query(
      `ALTER TABLE virtual_accounts DISABLE ROW LEVEL SECURITY`,
    );

    // Drop indexes for payment_notifications
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_payment_notifications_tenant`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_payment_notifications_status`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_payment_notifications_transaction`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_payment_notifications_va`,
    );

    // Drop indexes for virtual_accounts
    await queryRunner.query(`DROP INDEX IF EXISTS idx_virtual_accounts_status`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_virtual_accounts_number`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_virtual_accounts_jamaah`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_virtual_accounts_tenant`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS payment_notifications`);
    await queryRunner.query(`DROP TABLE IF EXISTS virtual_accounts`);
  }
}
