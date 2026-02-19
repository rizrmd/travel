/**
 * Epic 11: Create Analytics Tables Migration
 * Creates tables for analytics events, revenue snapshots, and filter presets
 * All tables with Row-Level Security (RLS) enabled
 */

import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateAnalyticsTables1734950000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create analytics_events table
    await queryRunner.createTable(
      new Table({
        name: "analytics_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "tenant_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "event_type",
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
            name: "user_id",
            type: "uuid",
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
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add indexes for analytics_events
    await queryRunner.createIndex(
      "analytics_events",
      new TableIndex({
        name: "IDX_analytics_events_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "analytics_events",
      new TableIndex({
        name: "IDX_analytics_events_tenant_event_created",
        columnNames: ["tenant_id", "event_type", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "analytics_events",
      new TableIndex({
        name: "IDX_analytics_events_entity",
        columnNames: ["tenant_id", "entity_type", "entity_id"],
      }),
    );

    await queryRunner.createIndex(
      "analytics_events",
      new TableIndex({
        name: "IDX_analytics_events_created_at",
        columnNames: ["created_at"],
      }),
    );

    // Add foreign key to tenants
    await queryRunner.query(`
      ALTER TABLE analytics_events
      ADD CONSTRAINT FK_analytics_events_tenant
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      ON DELETE CASCADE;
    `);

    // 2. Create revenue_snapshots table
    await queryRunner.createTable(
      new Table({
        name: "revenue_snapshots",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "tenant_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "snapshot_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "total_revenue",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: "payment_count",
            type: "integer",
            isNullable: false,
            default: 0,
          },
          {
            name: "jamaah_count",
            type: "integer",
            isNullable: false,
            default: 0,
          },
          {
            name: "package_breakdown",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "agent_breakdown",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "payment_method_breakdown",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "month_to_date_revenue",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "year_to_date_revenue",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add unique constraint for tenant_id + snapshot_date
    await queryRunner.query(`
      ALTER TABLE revenue_snapshots
      ADD CONSTRAINT UQ_revenue_snapshots_tenant_date
      UNIQUE (tenant_id, snapshot_date);
    `);

    // Add indexes for revenue_snapshots
    await queryRunner.createIndex(
      "revenue_snapshots",
      new TableIndex({
        name: "IDX_revenue_snapshots_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "revenue_snapshots",
      new TableIndex({
        name: "IDX_revenue_snapshots_tenant_date",
        columnNames: ["tenant_id", "snapshot_date"],
      }),
    );

    // Add foreign key to tenants
    await queryRunner.query(`
      ALTER TABLE revenue_snapshots
      ADD CONSTRAINT FK_revenue_snapshots_tenant
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      ON DELETE CASCADE;
    `);

    // 3. Create filter_presets table
    await queryRunner.createTable(
      new Table({
        name: "filter_presets",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
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
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "filters",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "is_public",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "is_default",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "usage_count",
            type: "integer",
            default: 0,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add indexes for filter_presets
    await queryRunner.createIndex(
      "filter_presets",
      new TableIndex({
        name: "IDX_filter_presets_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "filter_presets",
      new TableIndex({
        name: "IDX_filter_presets_user_public",
        columnNames: ["tenant_id", "user_id", "is_public"],
      }),
    );

    await queryRunner.createIndex(
      "filter_presets",
      new TableIndex({
        name: "IDX_filter_presets_created_at",
        columnNames: ["tenant_id", "created_at"],
      }),
    );

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE filter_presets
      ADD CONSTRAINT FK_filter_presets_tenant
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE filter_presets
      ADD CONSTRAINT FK_filter_presets_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE;
    `);

    // Enable Row-Level Security (RLS) for all analytics tables
    await queryRunner.query(`
      -- Enable RLS on analytics_events
      ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

      CREATE POLICY analytics_events_tenant_isolation ON analytics_events
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

      -- Enable RLS on revenue_snapshots
      ALTER TABLE revenue_snapshots ENABLE ROW LEVEL SECURITY;

      CREATE POLICY revenue_snapshots_tenant_isolation ON revenue_snapshots
        USING (tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid);

      -- Enable RLS on filter_presets
      ALTER TABLE filter_presets ENABLE ROW LEVEL SECURITY;

      CREATE POLICY filter_presets_tenant_isolation ON filter_presets
        USING (
          tenant_id = current_setting('app.current_tenant_id', TRUE)::uuid
          AND (
            user_id = current_setting('app.current_user_id', TRUE)::uuid
            OR is_public = TRUE
          )
        );
    `);

    // Create indexes for JSONB columns
    await queryRunner.query(`
      CREATE INDEX IDX_analytics_events_metadata_gin ON analytics_events USING GIN (metadata);
      CREATE INDEX IDX_revenue_snapshots_package_breakdown_gin ON revenue_snapshots USING GIN (package_breakdown);
      CREATE INDEX IDX_revenue_snapshots_agent_breakdown_gin ON revenue_snapshots USING GIN (agent_breakdown);
      CREATE INDEX IDX_filter_presets_filters_gin ON filter_presets USING GIN (filters);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`
      DROP POLICY IF EXISTS analytics_events_tenant_isolation ON analytics_events;
      DROP POLICY IF EXISTS revenue_snapshots_tenant_isolation ON revenue_snapshots;
      DROP POLICY IF EXISTS filter_presets_tenant_isolation ON filter_presets;
    `);

    // Drop tables in reverse order
    await queryRunner.dropTable("filter_presets", true);
    await queryRunner.dropTable("revenue_snapshots", true);
    await queryRunner.dropTable("analytics_events", true);
  }
}
