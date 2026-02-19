import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from "typeorm";

export class CreateApiPlatformTables1734973200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create oauth_clients table
    await queryRunner.createTable(
      new Table({
        name: "oauth_clients",
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
            name: "client_id",
            type: "varchar",
            length: "100",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "client_secret_hash",
            type: "varchar",
            length: "255",
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
            name: "redirect_uris",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          {
            name: "scopes",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "oauth_clients",
      new TableIndex({
        name: "idx_oauth_clients_tenant_id",
        columnNames: ["tenant_id"],
      }),
    );

    await queryRunner.createIndex(
      "oauth_clients",
      new TableIndex({
        name: "idx_oauth_clients_tenant_client_active",
        columnNames: ["tenant_id", "client_id", "is_active"],
      }),
    );

    await queryRunner.createForeignKey(
      "oauth_clients",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 2. Create access_tokens table
    await queryRunner.createTable(
      new Table({
        name: "access_tokens",
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
            name: "client_id",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "token_hash",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "scopes",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          {
            name: "expires_at",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "access_tokens",
      new TableIndex({
        name: "idx_access_tokens_tenant_hash_expires",
        columnNames: ["tenant_id", "token_hash", "expires_at"],
      }),
    );

    await queryRunner.createForeignKey(
      "access_tokens",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 3. Create api_keys table
    await queryRunner.createTable(
      new Table({
        name: "api_keys",
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
            name: "key_hash",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "environment",
            type: "enum",
            enum: ["production", "sandbox"],
            default: "'production'",
          },
          {
            name: "scopes",
            type: "text",
            isArray: true,
            default: "'{}'",
          },
          {
            name: "rate_limit",
            type: "integer",
            default: 1000,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "last_used_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "expires_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "api_keys",
      new TableIndex({
        name: "idx_api_keys_tenant_hash_env",
        columnNames: ["tenant_id", "key_hash", "environment"],
      }),
    );

    await queryRunner.createForeignKey(
      "api_keys",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "api_keys",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 4. Create webhook_subscriptions table
    await queryRunner.createTable(
      new Table({
        name: "webhook_subscriptions",
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
            name: "api_key_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "url",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "events",
            type: "enum",
            enum: [
              "payment.confirmed",
              "payment.failed",
              "jamaah.created",
              "jamaah.updated",
              "jamaah.deleted",
              "package.updated",
              "document.approved",
              "document.rejected",
              "contract.signed",
            ],
            isArray: true,
          },
          {
            name: "secret",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "webhook_subscriptions",
      new TableIndex({
        name: "idx_webhook_subscriptions_tenant_active",
        columnNames: ["tenant_id", "is_active"],
      }),
    );

    await queryRunner.createForeignKey(
      "webhook_subscriptions",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "webhook_subscriptions",
      new TableForeignKey({
        columnNames: ["api_key_id"],
        referencedTableName: "api_keys",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 5. Create webhook_deliveries table
    await queryRunner.createTable(
      new Table({
        name: "webhook_deliveries",
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
            name: "subscription_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "event_type",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "payload",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "delivered", "failed", "max_retries_exceeded"],
            default: "'pending'",
          },
          {
            name: "http_status",
            type: "integer",
            isNullable: true,
          },
          {
            name: "response_body",
            type: "text",
            isNullable: true,
          },
          {
            name: "attempt_count",
            type: "integer",
            default: 0,
          },
          {
            name: "next_retry_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "delivered_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "webhook_deliveries",
      new TableIndex({
        name: "idx_webhook_deliveries_tenant_sub_status",
        columnNames: ["tenant_id", "subscription_id", "status", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "webhook_deliveries",
      new TableIndex({
        name: "idx_webhook_deliveries_status_retry",
        columnNames: ["status", "next_retry_at"],
      }),
    );

    await queryRunner.createForeignKey(
      "webhook_deliveries",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "webhook_deliveries",
      new TableForeignKey({
        columnNames: ["subscription_id"],
        referencedTableName: "webhook_subscriptions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // 6. Create api_request_logs table
    await queryRunner.createTable(
      new Table({
        name: "api_request_logs",
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
            name: "api_key_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "endpoint",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "method",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
          {
            name: "status_code",
            type: "integer",
            isNullable: false,
          },
          {
            name: "response_time_ms",
            type: "integer",
            isNullable: false,
          },
          {
            name: "ip_address",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_agent",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "api_request_logs",
      new TableIndex({
        name: "idx_api_request_logs_tenant_key_created",
        columnNames: ["tenant_id", "api_key_id", "created_at"],
      }),
    );

    await queryRunner.createIndex(
      "api_request_logs",
      new TableIndex({
        name: "idx_api_request_logs_created",
        columnNames: ["created_at"],
      }),
    );

    await queryRunner.createForeignKey(
      "api_request_logs",
      new TableForeignKey({
        columnNames: ["tenant_id"],
        referencedTableName: "tenants",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "api_request_logs",
      new TableForeignKey({
        columnNames: ["api_key_id"],
        referencedTableName: "api_keys",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Enable RLS on all tables
    await queryRunner.query(
      "ALTER TABLE oauth_clients ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE access_tokens ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query("ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY");
    await queryRunner.query(
      "ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY",
    );
    await queryRunner.query(
      "ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("api_request_logs", true);
    await queryRunner.dropTable("webhook_deliveries", true);
    await queryRunner.dropTable("webhook_subscriptions", true);
    await queryRunner.dropTable("api_keys", true);
    await queryRunner.dropTable("access_tokens", true);
    await queryRunner.dropTable("oauth_clients", true);
  }
}
