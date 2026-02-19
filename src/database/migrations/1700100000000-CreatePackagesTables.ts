/**
 * Epic 4: Create Packages Tables Migration
 * Creates 4 tables with Row-Level Security (RLS):
 * - packages
 * - package_itineraries
 * - package_inclusions
 * - package_versions
 */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreatePackagesTables1700100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== CREATE PACKAGES TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: "packages",
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
            name: "duration_days",
            type: "integer",
            isNullable: false,
          },
          {
            name: "retail_price",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: "wholesale_price",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: "cost_price",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: "capacity",
            type: "integer",
            isNullable: false,
          },
          {
            name: "available_slots",
            type: "integer",
            isNullable: false,
          },
          {
            name: "departure_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "return_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'draft'",
          },
          {
            name: "created_by_id",
            type: "uuid",
            isNullable: false,
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
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for packages
    await queryRunner.createIndex(
      "packages",
      new TableIndex({
        name: "IDX_PACKAGES_TENANT_ID",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "packages",
      new TableIndex({
        name: "IDX_PACKAGES_TENANT_STATUS_DEPARTURE",
        columnNames: ["tenant_id", "status", "departure_date"],
      }),
    );

    await queryRunner.createIndex(
      "packages",
      new TableIndex({
        name: "IDX_PACKAGES_DEPARTURE_DATE",
        columnNames: ["departure_date"],
      }),
    );

    // Enable RLS on packages table
    await queryRunner.query(`
      ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policy for packages
    await queryRunner.query(`
      CREATE POLICY packages_tenant_isolation ON packages
        USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
    `);

    // ========== CREATE PACKAGE_ITINERARIES TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: "package_itineraries",
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
            name: "package_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "day_number",
            type: "integer",
            isNullable: false,
          },
          {
            name: "title",
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
            name: "activities",
            type: "jsonb",
            default: "'[]'",
          },
          {
            name: "accommodation",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "meals_included",
            type: "jsonb",
            default:
              '\'{"breakfast": false, "lunch": false, "dinner": false}\'',
          },
          {
            name: "sort_order",
            type: "integer",
            isNullable: false,
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
      true,
    );

    // Create indexes for package_itineraries
    await queryRunner.createIndex(
      "package_itineraries",
      new TableIndex({
        name: "IDX_ITINERARIES_TENANT_PACKAGE",
        columnNames: ["tenant_id", "package_id"],
      }),
    );

    await queryRunner.createIndex(
      "package_itineraries",
      new TableIndex({
        name: "IDX_ITINERARIES_PACKAGE_DAY",
        columnNames: ["package_id", "day_number"],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      "package_itineraries",
      new TableIndex({
        name: "IDX_ITINERARIES_SORT_ORDER",
        columnNames: ["package_id", "sort_order"],
      }),
    );

    // Foreign key
    await queryRunner.createForeignKey(
      "package_itineraries",
      new TableForeignKey({
        columnNames: ["package_id"],
        referencedTableName: "packages",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Enable RLS
    await queryRunner.query(`
      ALTER TABLE package_itineraries ENABLE ROW LEVEL SECURITY;
    `);

    await queryRunner.query(`
      CREATE POLICY itineraries_tenant_isolation ON package_itineraries
        USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
    `);

    // ========== CREATE PACKAGE_INCLUSIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: "package_inclusions",
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
            name: "package_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "category",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "is_included",
            type: "boolean",
            default: true,
          },
          {
            name: "sort_order",
            type: "integer",
            isNullable: false,
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
      true,
    );

    // Create indexes for package_inclusions
    await queryRunner.createIndex(
      "package_inclusions",
      new TableIndex({
        name: "IDX_INCLUSIONS_TENANT_PACKAGE",
        columnNames: ["tenant_id", "package_id"],
      }),
    );

    await queryRunner.createIndex(
      "package_inclusions",
      new TableIndex({
        name: "IDX_INCLUSIONS_PACKAGE_SORT",
        columnNames: ["package_id", "is_included", "sort_order"],
      }),
    );

    // Foreign key
    await queryRunner.createForeignKey(
      "package_inclusions",
      new TableForeignKey({
        columnNames: ["package_id"],
        referencedTableName: "packages",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Enable RLS
    await queryRunner.query(`
      ALTER TABLE package_inclusions ENABLE ROW LEVEL SECURITY;
    `);

    await queryRunner.query(`
      CREATE POLICY inclusions_tenant_isolation ON package_inclusions
        USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
    `);

    // ========== CREATE PACKAGE_VERSIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: "package_versions",
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
            name: "package_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "version_number",
            type: "integer",
            isNullable: false,
          },
          {
            name: "snapshot",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "changed_fields",
            type: "jsonb",
            default: "'[]'",
          },
          {
            name: "change_summary",
            type: "text",
            isNullable: false,
          },
          {
            name: "changed_by_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "change_reason",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Create indexes for package_versions
    await queryRunner.createIndex(
      "package_versions",
      new TableIndex({
        name: "IDX_VERSIONS_TENANT_PACKAGE",
        columnNames: ["tenant_id", "package_id"],
      }),
    );

    await queryRunner.createIndex(
      "package_versions",
      new TableIndex({
        name: "IDX_VERSIONS_PACKAGE_NUMBER",
        columnNames: ["package_id", "version_number"],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      "package_versions",
      new TableIndex({
        name: "IDX_VERSIONS_CREATED_AT",
        columnNames: ["package_id", "created_at"],
      }),
    );

    // Foreign key
    await queryRunner.createForeignKey(
      "package_versions",
      new TableForeignKey({
        columnNames: ["package_id"],
        referencedTableName: "packages",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Enable RLS
    await queryRunner.query(`
      ALTER TABLE package_versions ENABLE ROW LEVEL SECURITY;
    `);

    await queryRunner.query(`
      CREATE POLICY versions_tenant_isolation ON package_versions
        USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(
      `DROP POLICY IF EXISTS versions_tenant_isolation ON package_versions;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS inclusions_tenant_isolation ON package_inclusions;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS itineraries_tenant_isolation ON package_itineraries;`,
    );
    await queryRunner.query(
      `DROP POLICY IF EXISTS packages_tenant_isolation ON packages;`,
    );

    // Drop tables (foreign keys will be dropped automatically)
    await queryRunner.dropTable("package_versions", true);
    await queryRunner.dropTable("package_inclusions", true);
    await queryRunner.dropTable("package_itineraries", true);
    await queryRunner.dropTable("packages", true);
  }
}
