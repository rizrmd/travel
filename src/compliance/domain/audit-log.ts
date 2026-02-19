/**
 * Epic 12, Story 12.4 & 12.5: Audit Log Domain Model
 * Comprehensive audit trail for compliance
 */

/**
 * Audit log type enum
 */
export enum AuditLogType {
  FINANCIAL_TRANSACTION = "financial_transaction",
  CONTRACT_OPERATION = "contract_operation",
  CRITICAL_OPERATION = "critical_operation",
  DATA_EXPORT = "data_export",
  USER_MANAGEMENT = "user_management",
  TENANT_MANAGEMENT = "tenant_management",
  CONFIGURATION_CHANGE = "configuration_change",
}

/**
 * Entity type enum
 */
export enum EntityType {
  PAYMENT = "payment",
  CONTRACT = "contract",
  SIGNATURE = "signature",
  USER = "user",
  ROLE = "role",
  TENANT = "tenant",
  JAMAAH = "jamaah",
  PACKAGE = "package",
  COMMISSION = "commission",
  DOCUMENT = "document",
  CONFIGURATION = "configuration",
}

/**
 * Audit action enum
 */
export enum AuditAction {
  // Payment actions
  PAYMENT_CREATED = "payment_created",
  PAYMENT_CONFIRMED = "payment_confirmed",
  PAYMENT_CANCELLED = "payment_cancelled",
  PAYMENT_REFUNDED = "payment_refunded",

  // Contract actions
  CONTRACT_GENERATED = "contract_generated",
  CONTRACT_SENT = "contract_sent",
  CONTRACT_VIEWED = "contract_viewed",
  CONTRACT_SIGNED = "contract_signed",
  CONTRACT_CANCELLED = "contract_cancelled",
  CONTRACT_EXPIRED = "contract_expired",

  // Signature actions
  SIGNATURE_SENT = "signature_sent",
  SIGNATURE_SIGNED = "signature_signed",
  SIGNATURE_DECLINED = "signature_declined",

  // User management actions
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DELETED = "user_deleted",
  USER_ROLE_CHANGED = "user_role_changed",
  USER_SUSPENDED = "user_suspended",
  USER_ACTIVATED = "user_activated",
  USER_PASSWORD_CHANGED = "user_password_changed",

  // Tenant management actions
  TENANT_CREATED = "tenant_created",
  TENANT_UPDATED = "tenant_updated",
  TENANT_SUSPENDED = "tenant_suspended",
  TENANT_ACTIVATED = "tenant_activated",

  // Commission actions
  COMMISSION_CALCULATED = "commission_calculated",
  COMMISSION_PAID = "commission_paid",
  COMMISSION_ADJUSTED = "commission_adjusted",

  // Data export actions
  DATA_EXPORTED = "data_exported",
  DATA_IMPORTED = "data_imported",
  REPORT_GENERATED = "report_generated",

  // Configuration actions
  CONFIG_CHANGED = "config_changed",
  INTEGRATION_CONFIGURED = "integration_configured",
}

/**
 * Actor role enum
 */
export enum ActorRole {
  SUPER_ADMIN = "super_admin",
  OWNER = "owner",
  AGENT = "agent",
  JAMAAH = "jamaah",
  SYSTEM = "system",
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  tenantId: string;
  logType: AuditLogType;
  entityType: EntityType;
  entityId: string;
  action: AuditAction;
  actorId: string | null;
  actorRole: ActorRole;
  actorName: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * Audit log domain model
 */
export class AuditLog {
  /**
   * Retention period in days (7 years = 2,555 days)
   */
  static readonly RETENTION_PERIOD_DAYS = 2555;

  /**
   * Critical operations that must be logged
   */
  static readonly CRITICAL_OPERATIONS: AuditAction[] = [
    AuditAction.PAYMENT_CONFIRMED,
    AuditAction.PAYMENT_CANCELLED,
    AuditAction.PAYMENT_REFUNDED,
    AuditAction.CONTRACT_SIGNED,
    AuditAction.USER_ROLE_CHANGED,
    AuditAction.USER_SUSPENDED,
    AuditAction.TENANT_SUSPENDED,
    AuditAction.DATA_EXPORTED,
    AuditAction.CONFIG_CHANGED,
  ];

  /**
   * Check if an action is a critical operation
   */
  static isCriticalOperation(action: AuditAction): boolean {
    return this.CRITICAL_OPERATIONS.includes(action);
  }

  /**
   * Calculate retention expiry date
   */
  static calculateRetentionExpiryDate(createdAt: Date): Date {
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + this.RETENTION_PERIOD_DAYS);
    return expiryDate;
  }

  /**
   * Check if log should be archived (older than 7 years)
   */
  static shouldArchive(
    createdAt: Date,
    currentDate: Date = new Date(),
  ): boolean {
    const daysSinceCreation = Math.floor(
      (currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysSinceCreation > this.RETENTION_PERIOD_DAYS;
  }

  /**
   * Check if the oldest log is within the retention period
   */
  static isRetentionCompliant(oldestLogDate: Date | null): boolean {
    if (!oldestLogDate) return true;
    return !this.shouldArchive(oldestLogDate);
  }

  /**
   * Get log type from action
   */
  static getLogTypeFromAction(action: AuditAction): AuditLogType {
    // Financial transactions
    if (
      [
        AuditAction.PAYMENT_CREATED,
        AuditAction.PAYMENT_CONFIRMED,
        AuditAction.PAYMENT_CANCELLED,
        AuditAction.PAYMENT_REFUNDED,
        AuditAction.COMMISSION_CALCULATED,
        AuditAction.COMMISSION_PAID,
        AuditAction.COMMISSION_ADJUSTED,
      ].includes(action)
    ) {
      return AuditLogType.FINANCIAL_TRANSACTION;
    }

    // Contract operations
    if (
      [
        AuditAction.CONTRACT_GENERATED,
        AuditAction.CONTRACT_SENT,
        AuditAction.CONTRACT_VIEWED,
        AuditAction.CONTRACT_SIGNED,
        AuditAction.CONTRACT_CANCELLED,
        AuditAction.CONTRACT_EXPIRED,
        AuditAction.SIGNATURE_SENT,
        AuditAction.SIGNATURE_SIGNED,
        AuditAction.SIGNATURE_DECLINED,
      ].includes(action)
    ) {
      return AuditLogType.CONTRACT_OPERATION;
    }

    // Data export
    if (
      [
        AuditAction.DATA_EXPORTED,
        AuditAction.DATA_IMPORTED,
        AuditAction.REPORT_GENERATED,
      ].includes(action)
    ) {
      return AuditLogType.DATA_EXPORT;
    }

    // User management
    if (
      [
        AuditAction.USER_CREATED,
        AuditAction.USER_UPDATED,
        AuditAction.USER_DELETED,
        AuditAction.USER_ROLE_CHANGED,
        AuditAction.USER_SUSPENDED,
        AuditAction.USER_ACTIVATED,
        AuditAction.USER_PASSWORD_CHANGED,
      ].includes(action)
    ) {
      return AuditLogType.USER_MANAGEMENT;
    }

    // Tenant management
    if (
      [
        AuditAction.TENANT_CREATED,
        AuditAction.TENANT_UPDATED,
        AuditAction.TENANT_SUSPENDED,
        AuditAction.TENANT_ACTIVATED,
      ].includes(action)
    ) {
      return AuditLogType.TENANT_MANAGEMENT;
    }

    // Configuration
    if (
      [AuditAction.CONFIG_CHANGED, AuditAction.INTEGRATION_CONFIGURED].includes(
        action,
      )
    ) {
      return AuditLogType.CONFIGURATION_CHANGE;
    }

    // Critical operations
    if (this.isCriticalOperation(action)) {
      return AuditLogType.CRITICAL_OPERATION;
    }

    return AuditLogType.CRITICAL_OPERATION;
  }

  /**
   * Get entity type from action
   */
  static getEntityTypeFromAction(action: AuditAction): EntityType {
    if (action.toString().startsWith("payment_")) {
      return EntityType.PAYMENT;
    }
    if (action.toString().startsWith("contract_")) {
      return EntityType.CONTRACT;
    }
    if (action.toString().startsWith("signature_")) {
      return EntityType.SIGNATURE;
    }
    if (action.toString().startsWith("user_")) {
      return EntityType.USER;
    }
    if (action.toString().startsWith("tenant_")) {
      return EntityType.TENANT;
    }
    if (action.toString().startsWith("commission_")) {
      return EntityType.COMMISSION;
    }
    if (action.toString().startsWith("config_")) {
      return EntityType.CONFIGURATION;
    }

    return EntityType.USER;
  }

  /**
   * Create audit log entry
   */
  static createLogEntry(params: {
    tenantId: string;
    action: AuditAction;
    entityId: string;
    actorId: string | null;
    actorRole: ActorRole;
    actorName: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Omit<AuditLogEntry, "id" | "createdAt"> {
    return {
      tenantId: params.tenantId,
      logType: this.getLogTypeFromAction(params.action),
      entityType: this.getEntityTypeFromAction(params.action),
      entityId: params.entityId,
      action: params.action,
      actorId: params.actorId,
      actorRole: params.actorRole,
      actorName: params.actorName,
      beforeState: params.beforeState,
      afterState: params.afterState,
      metadata: params.metadata,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    };
  }

  /**
   * Calculate state changes
   */
  static calculateChanges(
    beforeState: Record<string, any> | undefined,
    afterState: Record<string, any> | undefined,
  ): Record<string, { before: any; after: any }> {
    if (!beforeState || !afterState) {
      return {};
    }

    const changes: Record<string, { before: any; after: any }> = {};

    // Check all keys in afterState
    for (const key in afterState) {
      if (beforeState[key] !== afterState[key]) {
        changes[key] = {
          before: beforeState[key],
          after: afterState[key],
        };
      }
    }

    // Check for removed keys
    for (const key in beforeState) {
      if (!(key in afterState)) {
        changes[key] = {
          before: beforeState[key],
          after: null,
        };
      }
    }

    return changes;
  }

  /**
   * Sanitize sensitive data before logging
   */
  static sanitizeSensitiveData(data: Record<string, any>): Record<string, any> {
    const sensitiveFields = [
      "password",
      "passwordHash",
      "apiKey",
      "apiSecret",
      "accessToken",
      "refreshToken",
      "creditCard",
      "cvv",
      "pin",
    ];

    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}
