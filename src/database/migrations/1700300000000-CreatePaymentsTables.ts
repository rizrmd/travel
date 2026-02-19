/**
 * Epic 7: Payment Gateway & Financial Operations
 * Database migration for payments, schedules, commissions, reminders, and payouts
 */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentsTables1700300000000 implements MigrationInterface {
  name = "CreatePaymentsTables1700300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // ENUM Types
    // ============================================

    await queryRunner.query(`
      CREATE TYPE payment_method AS ENUM (
        'bank_transfer',
        'virtual_account',
        'cash',
        'other'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE payment_type AS ENUM (
        'dp',
        'installment',
        'full_payment'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE payment_status AS ENUM (
        'pending',
        'confirmed',
        'cancelled',
        'refunded'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE schedule_status AS ENUM (
        'pending',
        'paid',
        'overdue',
        'waived'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE commission_status AS ENUM (
        'pending',
        'approved',
        'paid',
        'cancelled'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE reminder_channel AS ENUM (
        'email',
        'whatsapp',
        'both'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE reminder_status AS ENUM (
        'pending',
        'sent',
        'failed',
        'skipped'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE payout_status AS ENUM (
        'pending',
        'processing',
        'paid',
        'failed',
        'cancelled'
      );
    `);

    // ============================================
    // Table 1: payments (Story 7.1)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationships
        tenant_id UUID NOT NULL,
        jamaah_id UUID NOT NULL,
        package_id UUID NOT NULL,

        -- Payment Details
        amount DECIMAL(12,2) NOT NULL,
        payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
        payment_type payment_type NOT NULL DEFAULT 'installment',
        status payment_status NOT NULL DEFAULT 'pending',
        reference_number VARCHAR(100),
        payment_date TIMESTAMP NOT NULL,
        notes TEXT,
        recorded_by_id UUID NOT NULL,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      );
    `);

    // Indexes for payments
    await queryRunner.query(
      `CREATE INDEX idx_payments_tenant_jamaah ON payments(tenant_id, jamaah_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_tenant_status_created ON payments(tenant_id, status, created_at);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_payment_date ON payments(payment_date);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_reference ON payments(reference_number);`,
    );

    // ============================================
    // Table 2: payment_schedules (Story 7.2)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE payment_schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationships
        tenant_id UUID NOT NULL,
        jamaah_id UUID NOT NULL,

        -- Schedule Details
        installment_number INTEGER NOT NULL,
        due_date DATE NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        status schedule_status NOT NULL DEFAULT 'pending',
        paid_at TIMESTAMP,
        payment_id UUID,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Indexes for payment_schedules
    await queryRunner.query(
      `CREATE INDEX idx_schedules_tenant_jamaah ON payment_schedules(tenant_id, jamaah_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_schedules_status_due ON payment_schedules(status, due_date);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_schedules_due_date ON payment_schedules(due_date);`,
    );

    // ============================================
    // Table 3: commissions (Stories 7.4 & 7.5)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE commissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationships
        tenant_id UUID NOT NULL,
        agent_id UUID NOT NULL,
        jamaah_id UUID NOT NULL,
        payment_id UUID NOT NULL,

        -- Commission Details
        base_amount DECIMAL(12,2) NOT NULL,
        commission_percentage DECIMAL(5,2) NOT NULL,
        commission_amount DECIMAL(12,2) NOT NULL,
        status commission_status NOT NULL DEFAULT 'pending',
        level INTEGER NOT NULL DEFAULT 1,
        original_agent_id UUID,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Indexes for commissions
    await queryRunner.query(
      `CREATE INDEX idx_commissions_tenant_agent ON commissions(tenant_id, agent_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_commissions_tenant_status_created ON commissions(tenant_id, status, created_at);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_commissions_jamaah ON commissions(jamaah_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_commissions_payment ON commissions(payment_id);`,
    );

    // ============================================
    // Table 4: commission_rules (Story 7.5)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE commission_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Tenant Configuration
        tenant_id UUID UNIQUE NOT NULL,

        -- Commission Percentages
        total_commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 16.00,
        direct_sale_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
        parent_percentage DECIMAL(5,2) NOT NULL DEFAULT 4.00,
        grandparent_percentage DECIMAL(5,2) NOT NULL DEFAULT 2.00,

        -- Status
        is_active BOOLEAN NOT NULL DEFAULT true,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_commission_rules_tenant ON commission_rules(tenant_id);`,
    );

    // ============================================
    // Table 5: payment_reminders (Story 7.3)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE payment_reminders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationships
        tenant_id UUID NOT NULL,
        payment_schedule_id UUID NOT NULL,
        jamaah_id UUID NOT NULL,

        -- Reminder Details
        channel reminder_channel NOT NULL DEFAULT 'email',
        status reminder_status NOT NULL DEFAULT 'pending',
        sent_at TIMESTAMP,
        scheduled_for TIMESTAMP NOT NULL,
        error_message TEXT,
        metadata JSONB DEFAULT '{}',

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Indexes for payment_reminders
    await queryRunner.query(
      `CREATE INDEX idx_reminders_tenant_schedule ON payment_reminders(tenant_id, payment_schedule_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_reminders_status_scheduled ON payment_reminders(status, scheduled_for);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_reminders_scheduled ON payment_reminders(scheduled_for);`,
    );

    // ============================================
    // Table 6: commission_payouts (Story 7.6)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE commission_payouts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Tenant
        tenant_id UUID NOT NULL,

        -- Payout Details
        payout_date DATE NOT NULL,
        total_amount DECIMAL(14,2) NOT NULL,
        status payout_status NOT NULL DEFAULT 'pending',
        created_by_id UUID NOT NULL,
        bank_confirmation_file VARCHAR(500),
        notes TEXT,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Indexes for commission_payouts
    await queryRunner.query(
      `CREATE INDEX idx_payouts_tenant_date ON commission_payouts(tenant_id, payout_date);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payouts_status ON commission_payouts(status);`,
    );

    // ============================================
    // Table 7: commission_payout_items (Story 7.6)
    // ============================================

    await queryRunner.query(`
      CREATE TABLE commission_payout_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Relationships
        payout_id UUID NOT NULL,
        agent_id UUID NOT NULL,

        -- Item Details
        amount DECIMAL(12,2) NOT NULL,
        bank_name VARCHAR(50),
        bank_account_number VARCHAR(50),
        bank_account_name VARCHAR(255),
        status payout_status NOT NULL DEFAULT 'pending',
        notes TEXT,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Indexes for commission_payout_items
    await queryRunner.query(
      `CREATE INDEX idx_payout_items_payout_agent ON commission_payout_items(payout_id, agent_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payout_items_agent ON commission_payout_items(agent_id);`,
    );

    // ============================================
    // Row-Level Security (RLS) Policies
    // ============================================

    // Enable RLS on all tables
    await queryRunner.query(`ALTER TABLE payments ENABLE ROW LEVEL SECURITY;`);
    await queryRunner.query(
      `ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE commission_payout_items ENABLE ROW LEVEL SECURITY;`,
    );

    // Tenant isolation policies
    await queryRunner.query(`
      CREATE POLICY payments_tenant_isolation ON payments
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY schedules_tenant_isolation ON payment_schedules
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY commissions_tenant_isolation ON commissions
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY rules_tenant_isolation ON commission_rules
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY reminders_tenant_isolation ON payment_reminders
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY payouts_tenant_isolation ON commission_payouts
      USING (tenant_id = current_setting('app.tenant_id')::UUID);
    `);

    // Agent access policies
    await queryRunner.query(`
      CREATE POLICY commissions_agent_access ON commissions
      FOR SELECT
      USING (
        agent_id = current_setting('app.user_id')::UUID
        OR current_setting('app.role') IN ('agency_owner', 'admin', 'super_admin')
      );
    `);

    await queryRunner.query(`
      CREATE POLICY payout_items_agent_access ON commission_payout_items
      FOR SELECT
      USING (
        agent_id = current_setting('app.user_id')::UUID
        OR current_setting('app.role') IN ('agency_owner', 'admin', 'super_admin')
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(
      `DROP TABLE IF EXISTS commission_payout_items CASCADE;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS commission_payouts CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS payment_reminders CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS commission_rules CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS commissions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS payment_schedules CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments CASCADE;`);

    // Drop ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS payout_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS reminder_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS reminder_channel;`);
    await queryRunner.query(`DROP TYPE IF EXISTS commission_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS schedule_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_method;`);
  }
}
