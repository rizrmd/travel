import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Epic 10: Agent Landing Page Builder
 * Creates tables for landing pages, leads, and agent branding
 */
export class CreateLandingPagesTables1766500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(`
      CREATE TYPE landing_page_template AS ENUM ('modern', 'classic', 'minimal');
    `);

    await queryRunner.query(`
      CREATE TYPE landing_page_status AS ENUM ('draft', 'published', 'archived');
    `);

    await queryRunner.query(`
      CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
    `);

    await queryRunner.query(`
      CREATE TYPE lead_source AS ENUM ('landing_page', 'website', 'social_media', 'referral', 'chatbot', 'whatsapp', 'other');
    `);

    // Create landing_pages table
    await queryRunner.query(`
      CREATE TABLE landing_pages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL,
        agent_id UUID NOT NULL,
        package_id UUID NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        template_id landing_page_template NOT NULL DEFAULT 'modern',
        customizations JSONB NOT NULL DEFAULT '{}',
        status landing_page_status NOT NULL DEFAULT 'draft',
        views_count INT NOT NULL DEFAULT 0,
        leads_count INT NOT NULL DEFAULT 0,
        published_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);

    // Create indexes for landing_pages
    await queryRunner.query(`
      CREATE INDEX idx_landing_pages_tenant_agent ON landing_pages(tenant_id, agent_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_landing_pages_status_published ON landing_pages(status, published_at);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_landing_pages_package ON landing_pages(package_id);
    `);

    // Create leads table
    await queryRunner.query(`
      CREATE TABLE leads (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL,
        landing_page_id UUID REFERENCES landing_pages(id) ON DELETE SET NULL,
        agent_id UUID NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        preferred_departure_month VARCHAR(50),
        message TEXT,
        status lead_status NOT NULL DEFAULT 'new',
        source lead_source NOT NULL DEFAULT 'landing_page',
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        ip_address VARCHAR(45),
        user_agent VARCHAR(500),
        converted_to_jamaah_id UUID,
        assigned_to_agent_id UUID,
        last_contacted_at TIMESTAMP,
        converted_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);

    // Create indexes for leads
    await queryRunner.query(`
      CREATE INDEX idx_leads_tenant_agent ON leads(tenant_id, agent_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_leads_status_created ON leads(status, created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_leads_landing_page ON leads(landing_page_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_leads_email ON leads(email);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_leads_source ON leads(source);
    `);

    // Create agent_branding table
    await queryRunner.query(`
      CREATE TABLE agent_branding (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL,
        tenant_id UUID NOT NULL,
        profile_photo VARCHAR(500),
        logo VARCHAR(500),
        agent_name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL,
        color_scheme JSONB NOT NULL DEFAULT '{"primary":"#3B82F6","secondary":"#10B981","accent":"#F59E0B"}',
        social_media_links JSONB NOT NULL DEFAULT '{}',
        intro_text TEXT,
        intro_video_url VARCHAR(500),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for agent_branding
    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_agent_branding_user ON agent_branding(user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_agent_branding_tenant ON agent_branding(tenant_id);
    `);

    // Row-Level Security (RLS) Policies
    // Enable RLS
    await queryRunner.query(
      `ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;`,
    );
    await queryRunner.query(`ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`);
    await queryRunner.query(
      `ALTER TABLE agent_branding ENABLE ROW LEVEL SECURITY;`,
    );

    // Landing Pages RLS Policies
    await queryRunner.query(`
      CREATE POLICY landing_pages_tenant_isolation ON landing_pages
        USING (tenant_id = current_setting('app.tenant_id', true)::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY landing_pages_agent_access ON landing_pages
        FOR SELECT
        USING (
          agent_id = current_setting('app.user_id', true)::UUID
          OR current_setting('app.role', true) IN ('agency_owner', 'super_admin')
        );
    `);

    // Leads RLS Policies
    await queryRunner.query(`
      CREATE POLICY leads_tenant_isolation ON leads
        USING (tenant_id = current_setting('app.tenant_id', true)::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY leads_agent_access ON leads
        FOR SELECT
        USING (
          agent_id = current_setting('app.user_id', true)::UUID
          OR assigned_to_agent_id = current_setting('app.user_id', true)::UUID
          OR current_setting('app.role', true) IN ('agency_owner', 'super_admin')
        );
    `);

    // Agent Branding RLS Policies
    await queryRunner.query(`
      CREATE POLICY agent_branding_tenant_isolation ON agent_branding
        USING (tenant_id = current_setting('app.tenant_id', true)::UUID);
    `);

    await queryRunner.query(`
      CREATE POLICY agent_branding_user_access ON agent_branding
        FOR ALL
        USING (
          user_id = current_setting('app.user_id', true)::UUID
          OR current_setting('app.role', true) IN ('agency_owner', 'super_admin')
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS agent_branding_user_access ON agent_branding;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS agent_branding_tenant_isolation ON agent_branding;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS leads_agent_access ON leads;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS leads_tenant_isolation ON leads;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS landing_pages_agent_access ON landing_pages;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS landing_pages_tenant_isolation ON landing_pages;`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS agent_branding;`);
    await queryRunner.query(`DROP TABLE IF EXISTS leads;`);
    await queryRunner.query(`DROP TABLE IF EXISTS landing_pages;`);

    // Drop ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS lead_source;`);
    await queryRunner.query(`DROP TYPE IF EXISTS lead_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS landing_page_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS landing_page_template;`);
  }
}
