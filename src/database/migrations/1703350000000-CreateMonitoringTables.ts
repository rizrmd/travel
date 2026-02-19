import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateMonitoringTables1703350000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create health_metrics table (NO RLS - platform-wide)
    await queryRunner.createTable(
      new Table({
        name: "health_metrics",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "metric_type",
            type: "varchar",
            length: "50",
          },
          {
            name: "value",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "recorded_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "health_metrics",
      new TableIndex({
        name: "IDX_health_metrics_type_recorded",
        columnNames: ["metric_type", "recorded_at"],
      }),
    );

    // 2. Create tenant_metrics table (NO RLS - super admin only)
    await queryRunner.createTable(
      new Table({
        name: "tenant_metrics",
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
          },
          {
            name: "metric_type",
            type: "varchar",
            length: "50",
          },
          {
            name: "value",
            type: "decimal",
            precision: 15,
            scale: 2,
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "recorded_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "tenant_metrics",
      new TableIndex({
        name: "IDX_tenant_metrics_tenant_type_recorded",
        columnNames: ["tenant_id", "metric_type", "recorded_at"],
      }),
    );

    await queryRunner.createForeignKey(
      "tenant_metrics",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tenants",
        onDelete: "CASCADE",
      }),
    );

    // 3. Create anomaly_detections table (NO RLS)
    await queryRunner.createTable(
      new Table({
        name: "anomaly_detections",
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
            isNullable: true,
          },
          {
            name: "anomaly_type",
            type: "varchar",
            length: "50",
          },
          {
            name: "severity",
            type: "varchar",
            length: "20",
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'detected'",
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "detected_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "resolved_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "resolution_notes",
            type: "text",
            isNullable: true,
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

    await queryRunner.createIndices("anomaly_detections", [
      new TableIndex({
        name: "IDX_anomaly_tenant_severity_detected",
        columnNames: ["tenant_id", "severity", "detected_at"],
      }),
      new TableIndex({
        name: "IDX_anomaly_status_detected",
        columnNames: ["status", "detected_at"],
      }),
    ]);

    await queryRunner.createForeignKey(
      "anomaly_detections",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tenants",
        onDelete: "CASCADE",
      }),
    );

    // 4. Create alerts table (NO RLS)
    await queryRunner.createTable(
      new Table({
        name: "alerts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "anomaly_id",
            type: "uuid",
          },
          {
            name: "channel",
            type: "varchar",
            length: "20",
          },
          {
            name: "recipient",
            type: "varchar",
            length: "255",
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'pending'",
          },
          {
            name: "metadata",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "sent_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "acknowledged_at",
            type: "timestamp",
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

    await queryRunner.createIndices("alerts", [
      new TableIndex({
        name: "IDX_alerts_anomaly_status_sent",
        columnNames: ["anomaly_id", "status", "sent_at"],
      }),
      new TableIndex({
        name: "IDX_alerts_status_sent",
        columnNames: ["status", "sent_at"],
      }),
    ]);

    await queryRunner.createForeignKey(
      "alerts",
      new TableForeignKey({
        columnNames: ["anomaly_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "anomaly_detections",
        onDelete: "CASCADE",
      }),
    );

    // 5. Create diagnostic_results table (NO RLS)
    await queryRunner.createTable(
      new Table({
        name: "diagnostic_results",
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
            isNullable: true,
          },
          {
            name: "check_type",
            type: "varchar",
            length: "50",
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
          },
          {
            name: "details",
            type: "jsonb",
          },
          {
            name: "duration_ms",
            type: "int",
          },
          {
            name: "ran_by_id",
            type: "uuid",
          },
          {
            name: "ran_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndices("diagnostic_results", [
      new TableIndex({
        name: "IDX_diagnostic_tenant_check_ran",
        columnNames: ["tenant_id", "check_type", "ran_at"],
      }),
      new TableIndex({
        name: "IDX_diagnostic_status_ran",
        columnNames: ["status", "ran_at"],
      }),
    ]);

    await queryRunner.createForeignKeys("diagnostic_results", [
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tenants",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["ran_by_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "NO ACTION",
      }),
    ]);

    // 6. Create feature_trials table (NO RLS)
    await queryRunner.createTable(
      new Table({
        name: "feature_trials",
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
          },
          {
            name: "feature_key",
            type: "varchar",
            length: "50",
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
          },
          {
            name: "started_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "expires_at",
            type: "timestamp",
          },
          {
            name: "usage_count",
            type: "int",
            default: 0,
          },
          {
            name: "usage_limit",
            type: "int",
            isNullable: true,
          },
          {
            name: "trial_feedback",
            type: "text",
            isNullable: true,
          },
          {
            name: "converted_at",
            type: "timestamp",
            isNullable: true,
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

    await queryRunner.createIndices("feature_trials", [
      new TableIndex({
        name: "IDX_feature_trials_tenant_feature_status",
        columnNames: ["tenant_id", "feature_key", "status"],
      }),
      new TableIndex({
        name: "IDX_feature_trials_status_expires",
        columnNames: ["status", "expires_at"],
      }),
    ]);

    await queryRunner.createForeignKey(
      "feature_trials",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "tenants",
        onDelete: "CASCADE",
      }),
    );

    // Comment: NO RLS policies on any monitoring tables (super admin access only)
    await queryRunner.query(`
      COMMENT ON TABLE health_metrics IS 'System-wide health metrics (NO RLS - platform monitoring)';
      COMMENT ON TABLE tenant_metrics IS 'Tenant-specific metrics (NO RLS - super admin only)';
      COMMENT ON TABLE anomaly_detections IS 'Detected anomalies (NO RLS - super admin only)';
      COMMENT ON TABLE alerts IS 'Alert notifications (NO RLS - super admin only)';
      COMMENT ON TABLE diagnostic_results IS 'Diagnostic check results (NO RLS - super admin only)';
      COMMENT ON TABLE feature_trials IS 'Feature trials per tenant (NO RLS - super admin only)';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("feature_trials");
    await queryRunner.dropTable("diagnostic_results");
    await queryRunner.dropTable("alerts");
    await queryRunner.dropTable("anomaly_detections");
    await queryRunner.dropTable("tenant_metrics");
    await queryRunner.dropTable("health_metrics");
  }
}
