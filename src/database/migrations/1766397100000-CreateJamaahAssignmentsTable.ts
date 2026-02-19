import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

/**
 * Create Jamaah Assignments Table Migration
 *
 * This migration creates the jamaah_assignments table for granular data access control.
 * Agents can only access jamaah records that are explicitly assigned to them.
 *
 * Features:
 * - Tenant isolation via tenant_id and RLS policies
 * - Soft delete for audit trail
 * - Composite indexes for query performance
 * - Foreign key constraints for data integrity
 * - Row-Level Security (RLS) policies for database-level isolation
 */
export class CreateJamaahAssignmentsTable1766397100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create jamaah_assignments table
    await queryRunner.createTable(
      new Table({
        name: "jamaah_assignments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
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
            comment: "Reference to the jamaah user being assigned",
          },
          {
            name: "agent_id",
            type: "uuid",
            isNullable: false,
            comment: "Reference to the agent user who manages this jamaah",
          },
          {
            name: "assigned_by_id",
            type: "uuid",
            isNullable: false,
            comment: "Reference to the user who performed the assignment",
          },
          {
            name: "assigned_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
            comment: "Soft delete timestamp for audit trail",
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

    // Create indexes for performance
    await queryRunner.createIndex(
      "jamaah_assignments",
      new TableIndex({
        name: "idx_jamaah_assignments_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "jamaah_assignments",
      new TableIndex({
        name: "idx_jamaah_assignments_agent_id",
        columnNames: ["agent_id", "tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "jamaah_assignments",
      new TableIndex({
        name: "idx_jamaah_assignments_jamaah_id",
        columnNames: ["jamaah_id", "tenant_id"],
      }),
    );

    // Unique constraint to prevent duplicate assignments
    await queryRunner.createIndex(
      "jamaah_assignments",
      new TableIndex({
        name: "idx_jamaah_assignments_unique",
        columnNames: ["jamaah_id", "agent_id", "tenant_id"],
        isUnique: true,
        where: "deleted_at IS NULL",
      }),
    );

    // Add foreign key constraints (assuming these tables exist)
    // Note: Adjust table names based on actual schema
    await queryRunner.createForeignKey(
      "jamaah_assignments",
      new TableForeignKey({
        name: "fk_jamaah_assignments_tenant",
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "jamaah_assignments",
      new TableForeignKey({
        name: "fk_jamaah_assignments_jamaah",
        columnNames: ["jamaah_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "jamaah_assignments",
      new TableForeignKey({
        name: "fk_jamaah_assignments_agent",
        columnNames: ["agent_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "jamaah_assignments",
      new TableForeignKey({
        name: "fk_jamaah_assignments_assigned_by",
        columnNames: ["assigned_by_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    // Enable Row-Level Security (RLS)
    await queryRunner.query(`
      ALTER TABLE jamaah_assignments ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policy for tenant isolation
    // This policy ensures users can only see assignments within their tenant
    await queryRunner.query(`
      CREATE POLICY jamaah_assignments_tenant_isolation ON jamaah_assignments
        FOR ALL
        USING (
          tenant_id = current_setting('app.tenant_id', true)::uuid
        );
    `);

    // Create RLS policy for agent access control
    // Agents can only see their own assignments
    await queryRunner.query(`
      CREATE POLICY jamaah_assignments_agent_access ON jamaah_assignments
        FOR SELECT
        USING (
          -- Allow if user is the assigned agent
          agent_id = current_setting('app.user_id', true)::uuid
          OR
          -- Allow if user has admin/owner role
          current_setting('app.role', true) IN ('agency_owner', 'super_admin', 'admin')
        );
    `);

    // Create trigger to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_jamaah_assignments_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_update_jamaah_assignments_updated_at
        BEFORE UPDATE ON jamaah_assignments
        FOR EACH ROW
        EXECUTE FUNCTION update_jamaah_assignments_updated_at();
    `);

    // Create validation trigger to ensure tenant consistency
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION validate_jamaah_assignment_tenant()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Validate jamaah belongs to tenant
        IF NOT EXISTS (
          SELECT 1 FROM users WHERE id = NEW.jamaah_id AND tenant_id = NEW.tenant_id
        ) THEN
          RAISE EXCEPTION 'Jamaah % does not belong to tenant %', NEW.jamaah_id, NEW.tenant_id;
        END IF;

        -- Validate agent belongs to tenant
        IF NOT EXISTS (
          SELECT 1 FROM users WHERE id = NEW.agent_id AND tenant_id = NEW.tenant_id
        ) THEN
          RAISE EXCEPTION 'Agent % does not belong to tenant %', NEW.agent_id, NEW.tenant_id;
        END IF;

        -- Validate assigned_by user belongs to tenant
        IF NOT EXISTS (
          SELECT 1 FROM users WHERE id = NEW.assigned_by_id AND tenant_id = NEW.tenant_id
        ) THEN
          RAISE EXCEPTION 'Assigner % does not belong to tenant %', NEW.assigned_by_id, NEW.tenant_id;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_validate_jamaah_assignment_tenant
        BEFORE INSERT OR UPDATE ON jamaah_assignments
        FOR EACH ROW
        EXECUTE FUNCTION validate_jamaah_assignment_tenant();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_validate_jamaah_assignment_tenant ON jamaah_assignments;
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS validate_jamaah_assignment_tenant();
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_update_jamaah_assignments_updated_at ON jamaah_assignments;
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_jamaah_assignments_updated_at();
    `);

    // Drop RLS policies
    await queryRunner.query(`
      DROP POLICY IF EXISTS jamaah_assignments_agent_access ON jamaah_assignments;
    `);

    await queryRunner.query(`
      DROP POLICY IF EXISTS jamaah_assignments_tenant_isolation ON jamaah_assignments;
    `);

    // Drop foreign keys
    await queryRunner.dropForeignKey(
      "jamaah_assignments",
      "fk_jamaah_assignments_assigned_by",
    );
    await queryRunner.dropForeignKey(
      "jamaah_assignments",
      "fk_jamaah_assignments_agent",
    );
    await queryRunner.dropForeignKey(
      "jamaah_assignments",
      "fk_jamaah_assignments_jamaah",
    );
    await queryRunner.dropForeignKey(
      "jamaah_assignments",
      "fk_jamaah_assignments_tenant",
    );

    // Drop indexes
    await queryRunner.dropIndex(
      "jamaah_assignments",
      "idx_jamaah_assignments_unique",
    );
    await queryRunner.dropIndex(
      "jamaah_assignments",
      "idx_jamaah_assignments_jamaah_id",
    );
    await queryRunner.dropIndex(
      "jamaah_assignments",
      "idx_jamaah_assignments_agent_id",
    );
    await queryRunner.dropIndex(
      "jamaah_assignments",
      "idx_jamaah_assignments_tenant_id",
    );

    // Drop table
    await queryRunner.dropTable("jamaah_assignments");
  }
}
