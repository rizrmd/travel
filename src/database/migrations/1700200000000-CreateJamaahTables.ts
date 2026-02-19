/**
 * Epic 5: Create Jamaah Tables Migration
 * Creates jamaah, jamaah_action_logs, jamaah_delegations, and jamaah_status_history tables
 * with Row-Level Security (RLS) policies
 */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJamaahTables1700200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create jamaah_status enum
    await queryRunner.query(`
      CREATE TYPE jamaah_status AS ENUM (
        'lead',
        'interested',
        'deposit_paid',
        'partially_paid',
        'fully_paid',
        'documents_pending',
        'documents_complete',
        'ready',
        'departed',
        'completed',
        'cancelled'
      );
    `);

    // Create document_status enum
    await queryRunner.query(`
      CREATE TYPE document_status AS ENUM (
        'complete',
        'incomplete',
        'pending_review'
      );
    `);

    // Create payment_status_enum (different from payment status)
    await queryRunner.query(`
      CREATE TYPE payment_status_enum AS ENUM (
        'paid_full',
        'partial',
        'overdue',
        'not_started'
      );
    `);

    // Create approval_status enum
    await queryRunner.query(`
      CREATE TYPE approval_status AS ENUM (
        'approved',
        'pending',
        'rejected',
        'not_submitted'
      );
    `);

    // Create service_mode enum
    await queryRunner.query(`
      CREATE TYPE service_mode AS ENUM (
        'agent_assisted',
        'self_service',
        'hybrid'
      );
    `);

    // Create action_type enum
    await queryRunner.query(`
      CREATE TYPE action_type AS ENUM (
        'document_upload',
        'payment_record',
        'message_sent',
        'status_change',
        'bulk_action',
        'jamaah_assign',
        'jamaah_create',
        'jamaah_update',
        'delegation_grant',
        'delegation_revoke',
        'service_mode_change'
      );
    `);

    // Create performed_by_role enum
    await queryRunner.query(`
      CREATE TYPE performed_by_role AS ENUM (
        'agent',
        'agency_owner',
        'admin',
        'jamaah',
        'system'
      );
    `);

    // Create permission_type enum
    await queryRunner.query(`
      CREATE TYPE permission_type AS ENUM (
        'upload_documents',
        'view_payments',
        'update_profile'
      );
    `);

    // Table 1: jamaah
    await queryRunner.query(`
      CREATE TABLE jamaah (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,

        -- Personal Information
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        date_of_birth DATE,
        gender VARCHAR(20),
        address TEXT,

        -- Status Management
        status jamaah_status NOT NULL DEFAULT 'lead',
        document_status document_status NOT NULL DEFAULT 'incomplete',
        payment_status payment_status_enum NOT NULL DEFAULT 'not_started',
        approval_status approval_status NOT NULL DEFAULT 'not_submitted',

        -- Service Mode (Story 5.7)
        service_mode service_mode NOT NULL DEFAULT 'agent_assisted',

        -- User Reference (for self-service jamaah)
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,

        -- Assignment
        assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        -- Metadata
        metadata JSONB,

        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_jamaah_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
        CONSTRAINT fk_jamaah_agent FOREIGN KEY (agent_id) REFERENCES users(id),
        CONSTRAINT fk_jamaah_package FOREIGN KEY (package_id) REFERENCES packages(id),
        CONSTRAINT fk_jamaah_user FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Table 2: jamaah_action_logs (Story 5.5)
    await queryRunner.query(`
      CREATE TABLE jamaah_action_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        jamaah_id UUID NOT NULL REFERENCES jamaah(id) ON DELETE CASCADE,

        action_type action_type NOT NULL,
        action_description TEXT NOT NULL,

        performed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        performed_by_role performed_by_role NOT NULL,

        old_value JSONB,
        new_value JSONB,
        metadata JSONB,

        ip_address VARCHAR(45),
        user_agent VARCHAR(500),

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_action_log_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
        CONSTRAINT fk_action_log_jamaah FOREIGN KEY (jamaah_id) REFERENCES jamaah(id),
        CONSTRAINT fk_action_log_user FOREIGN KEY (performed_by_id) REFERENCES users(id)
      );
    `);

    // Table 3: jamaah_delegations (Story 5.6)
    await queryRunner.query(`
      CREATE TABLE jamaah_delegations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        jamaah_id UUID NOT NULL REFERENCES jamaah(id) ON DELETE CASCADE,

        delegated_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        delegated_by_agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        permission_type permission_type NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        expires_at TIMESTAMP,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        revoked_at TIMESTAMP,

        CONSTRAINT fk_delegation_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
        CONSTRAINT fk_delegation_jamaah FOREIGN KEY (jamaah_id) REFERENCES jamaah(id),
        CONSTRAINT fk_delegation_user FOREIGN KEY (delegated_to_user_id) REFERENCES users(id),
        CONSTRAINT fk_delegation_agent FOREIGN KEY (delegated_by_agent_id) REFERENCES users(id)
      );
    `);

    // Table 4: jamaah_status_history
    await queryRunner.query(`
      CREATE TABLE jamaah_status_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        jamaah_id UUID NOT NULL REFERENCES jamaah(id) ON DELETE CASCADE,

        from_status jamaah_status NOT NULL,
        to_status jamaah_status NOT NULL,

        changed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason TEXT,
        metadata JSONB,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_status_history_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
        CONSTRAINT fk_status_history_jamaah FOREIGN KEY (jamaah_id) REFERENCES jamaah(id),
        CONSTRAINT fk_status_history_user FOREIGN KEY (changed_by_id) REFERENCES users(id)
      );
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX idx_jamaah_tenant_agent ON jamaah(tenant_id, agent_id);
      CREATE INDEX idx_jamaah_tenant_status ON jamaah(tenant_id, status, created_at);
      CREATE INDEX idx_jamaah_package ON jamaah(package_id);
      CREATE INDEX idx_jamaah_email ON jamaah(email);
      CREATE INDEX idx_jamaah_phone ON jamaah(phone);
      CREATE INDEX idx_jamaah_document_status ON jamaah(document_status);
      CREATE INDEX idx_jamaah_payment_status ON jamaah(payment_status);
      CREATE INDEX idx_jamaah_approval_status ON jamaah(approval_status);

      CREATE INDEX idx_action_log_tenant_created ON jamaah_action_logs(tenant_id, created_at DESC);
      CREATE INDEX idx_action_log_jamaah ON jamaah_action_logs(tenant_id, jamaah_id, created_at DESC);
      CREATE INDEX idx_action_log_user ON jamaah_action_logs(tenant_id, performed_by_id, created_at DESC);
      CREATE INDEX idx_action_log_type ON jamaah_action_logs(action_type);

      CREATE INDEX idx_delegation_jamaah ON jamaah_delegations(tenant_id, jamaah_id, is_active);
      CREATE INDEX idx_delegation_user ON jamaah_delegations(tenant_id, delegated_to_user_id);
      CREATE INDEX idx_delegation_active ON jamaah_delegations(is_active, expires_at);

      CREATE INDEX idx_status_history_jamaah ON jamaah_status_history(tenant_id, jamaah_id, created_at DESC);
      CREATE INDEX idx_status_history_tenant ON jamaah_status_history(tenant_id, created_at DESC);
    `);

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE jamaah ENABLE ROW LEVEL SECURITY;`);
    await queryRunner.query(
      `ALTER TABLE jamaah_action_logs ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE jamaah_delegations ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(
      `ALTER TABLE jamaah_status_history ENABLE ROW LEVEL SECURITY;`,
    );

    // RLS Policies for jamaah
    await queryRunner.query(`
      CREATE POLICY jamaah_tenant_isolation ON jamaah
        USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));
    `);

    // RLS Policies for jamaah_action_logs
    await queryRunner.query(`
      CREATE POLICY action_logs_tenant_isolation ON jamaah_action_logs
        USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));
    `);

    // RLS Policies for jamaah_delegations
    await queryRunner.query(`
      CREATE POLICY delegations_tenant_isolation ON jamaah_delegations
        USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));
    `);

    // RLS Policies for jamaah_status_history
    await queryRunner.query(`
      CREATE POLICY status_history_tenant_isolation ON jamaah_status_history
        USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));
    `);

    // Create updated_at trigger for jamaah
    await queryRunner.query(`
      CREATE TRIGGER update_jamaah_updated_at
        BEFORE UPDATE ON jamaah
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_jamaah_updated_at ON jamaah;`,
    );

    // Drop tables (in reverse order due to foreign keys)
    await queryRunner.query(
      `DROP TABLE IF EXISTS jamaah_status_history CASCADE;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS jamaah_delegations CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jamaah_action_logs CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jamaah CASCADE;`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS permission_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS performed_by_role;`);
    await queryRunner.query(`DROP TYPE IF EXISTS action_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS service_mode;`);
    await queryRunner.query(`DROP TYPE IF EXISTS approval_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS document_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jamaah_status;`);
  }
}
