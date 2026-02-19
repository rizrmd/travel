import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migration: Create Tenants, Users, and Sessions Tables
 * Epic 2: Multi-Tenant Agency Management
 *
 * Creates core tables for multi-tenancy with Row-Level Security (RLS)
 */
export class CreateTenantsAndUsers1700000000000 implements MigrationInterface {
  name = "CreateTenantsAndUsers1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(`
      CREATE TYPE tenant_status_enum AS ENUM (
        'pending',
        'active',
        'suspended',
        'inactive',
        'failed',
        'deleted'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE tenant_tier_enum AS ENUM (
        'starter',
        'professional',
        'enterprise'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM (
        'super_admin',
        'agency_owner',
        'agent',
        'affiliate',
        'admin',
        'jamaah',
        'family'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE user_status_enum AS ENUM (
        'active',
        'inactive',
        'suspended',
        'pending_verification'
      );
    `);

    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        status tenant_status_enum NOT NULL DEFAULT 'pending',
        tier tenant_tier_enum NOT NULL DEFAULT 'starter',
        owner_email VARCHAR(255) NOT NULL UNIQUE,
        owner_phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        custom_domain VARCHAR(255) UNIQUE,
        domain_verification_token VARCHAR(255),
        domain_verified_at TIMESTAMP,
        resource_limits JSONB NOT NULL DEFAULT '{"maxConcurrentUsers": 500, "maxJamaahPerMonth": 3000, "maxAgents": 25, "maxPackages": 50}',
        activated_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);

    // Create indexes for tenants
    await queryRunner.query(`
      CREATE INDEX idx_tenants_slug ON tenants(slug);
      CREATE INDEX idx_tenants_owner_email ON tenants(owner_email);
      CREATE INDEX idx_tenants_status ON tenants(status);
      CREATE INDEX idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        email_verified_at TIMESTAMP,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        avatar VARCHAR(500),
        role user_role_enum NOT NULL DEFAULT 'agent',
        status user_status_enum NOT NULL DEFAULT 'pending_verification',
        last_login_at TIMESTAMP,
        last_login_ip VARCHAR(50),
        password_changed_at TIMESTAMP,
        failed_login_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP,
        CONSTRAINT unique_tenant_email UNIQUE (tenant_id, email)
      );
    `);

    // Create indexes for users
    await queryRunner.query(`
      CREATE INDEX idx_users_tenant_id ON users(tenant_id);
      CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);
      CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);
      CREATE INDEX idx_users_status ON users(status);
    `);

    // Create sessions table
    await queryRunner.query(`
      CREATE TABLE sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        refresh_token VARCHAR(500) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(50),
        user_agent TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        revoked_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for sessions
    await queryRunner.query(`
      CREATE INDEX idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
      CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
      CREATE INDEX idx_sessions_tenant_id ON sessions(tenant_id);
    `);

    // Enable Row-Level Security (RLS) on users table
    await queryRunner.query(`
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policy for users - users can only access data from their tenant
    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON users
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::UUID);
    `);

    // Create RLS policy for sessions
    await queryRunner.query(`
      ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
    `);

    await queryRunner.query(`
      CREATE POLICY tenant_isolation_policy ON sessions
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::UUID);
    `);

    // Create trigger to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Grant permissions (adjust based on your database user)
    await queryRunner.query(`
      GRANT SELECT, INSERT, UPDATE, DELETE ON tenants TO PUBLIC;
      GRANT SELECT, INSERT, UPDATE, DELETE ON users TO PUBLIC;
      GRANT SELECT, INSERT, UPDATE, DELETE ON sessions TO PUBLIC;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_users_updated_at ON users;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_updated_at_column;`,
    );

    // Drop RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS tenant_isolation_policy ON sessions;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS tenant_isolation_policy ON users;`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS sessions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tenants;`);

    // Drop ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS tenant_tier_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS tenant_status_enum;`);
  }
}
