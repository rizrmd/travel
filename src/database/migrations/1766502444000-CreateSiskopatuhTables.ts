/**
 * Integration 6: SISKOPATUH Government Reporting
 * Migration: Create siskopatuh_submissions table
 *
 * SISKOPATUH is the Indonesian Ministry of Religious Affairs (Kementerian Agama)
 * system for tracking Umroh pilgrims. All registered travel agencies must submit
 * jamaah data, departure manifests, and return manifests for regulatory compliance.
 */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSiskopatuhTables1766502444000 implements MigrationInterface {
  name = "CreateSiskopatuhTables1766502444000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create submission_type enum
    await queryRunner.query(`
      CREATE TYPE siskopatuh_submission_type AS ENUM (
        'jamaah_registration',
        'departure_manifest',
        'return_manifest'
      );
    `);

    // Create submission_status enum
    await queryRunner.query(`
      CREATE TYPE siskopatuh_submission_status AS ENUM (
        'pending',
        'submitted',
        'accepted',
        'rejected',
        'failed'
      );
    `);

    // Create siskopatuh_submissions table
    await queryRunner.query(`
      CREATE TABLE siskopatuh_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        submission_type siskopatuh_submission_type NOT NULL,
        jamaah_id UUID REFERENCES jamaah(id) ON DELETE SET NULL,
        package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
        reference_number VARCHAR(100),
        submission_data JSONB NOT NULL,
        response_data JSONB,
        status siskopatuh_submission_status NOT NULL DEFAULT 'pending',
        error_message TEXT,
        submitted_at TIMESTAMP,
        accepted_at TIMESTAMP,
        retry_count INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_tenant
      ON siskopatuh_submissions(tenant_id)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_jamaah
      ON siskopatuh_submissions(jamaah_id)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_package
      ON siskopatuh_submissions(package_id)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_status
      ON siskopatuh_submissions(status)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_type
      ON siskopatuh_submissions(submission_type)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_reference
      ON siskopatuh_submissions(reference_number)
      WHERE deleted_at IS NULL AND reference_number IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_siskopatuh_submissions_created_at
      ON siskopatuh_submissions(created_at DESC)
      WHERE deleted_at IS NULL;
    `);

    // Enable Row Level Security
    await queryRunner.query(`
      ALTER TABLE siskopatuh_submissions ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policy for tenant isolation
    await queryRunner.query(`
      CREATE POLICY siskopatuh_submissions_tenant_isolation
      ON siskopatuh_submissions
      USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
    `);

    // Create updated_at trigger
    await queryRunner.query(`
      CREATE TRIGGER update_siskopatuh_submissions_updated_at
      BEFORE UPDATE ON siskopatuh_submissions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Add comments for documentation
    await queryRunner.query(`
      COMMENT ON TABLE siskopatuh_submissions IS
      'SISKOPATUH government reporting submissions for jamaah tracking and compliance';
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN siskopatuh_submissions.submission_type IS
      'Type of submission: jamaah_registration, departure_manifest, or return_manifest';
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN siskopatuh_submissions.reference_number IS
      'SISKOPATUH reference number returned from government API';
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN siskopatuh_submissions.submission_data IS
      'Full payload submitted to SISKOPATUH API';
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN siskopatuh_submissions.response_data IS
      'Complete response received from SISKOPATUH API';
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN siskopatuh_submissions.retry_count IS
      'Number of retry attempts (max 3)';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy
    await queryRunner.query(`
      DROP POLICY IF EXISTS siskopatuh_submissions_tenant_isolation
      ON siskopatuh_submissions;
    `);

    // Disable RLS
    await queryRunner.query(`
      ALTER TABLE siskopatuh_submissions DISABLE ROW LEVEL SECURITY;
    `);

    // Drop trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_siskopatuh_submissions_updated_at
      ON siskopatuh_submissions;
    `);

    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_reference;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_type;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_status;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_package;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_jamaah;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_siskopatuh_submissions_tenant;
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE IF EXISTS siskopatuh_submissions;
    `);

    // Drop enums
    await queryRunner.query(`
      DROP TYPE IF EXISTS siskopatuh_submission_status;
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS siskopatuh_submission_type;
    `);
  }
}
