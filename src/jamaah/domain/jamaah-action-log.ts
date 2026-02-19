/**
 * Epic 5, Story 5.5: Jamaah Action Log Domain Model
 * Audit trail for agent actions on behalf of jamaah
 */

/**
 * Action type enum
 */
export enum ActionType {
  DOCUMENT_UPLOAD = "document_upload",
  PAYMENT_RECORD = "payment_record",
  MESSAGE_SENT = "message_sent",
  STATUS_CHANGE = "status_change",
  BULK_ACTION = "bulk_action",
  JAMAAH_ASSIGN = "jamaah_assign",
  JAMAAH_CREATE = "jamaah_create",
  JAMAAH_UPDATE = "jamaah_update",
  DELEGATION_GRANT = "delegation_grant",
  DELEGATION_REVOKE = "delegation_revoke",
  SERVICE_MODE_CHANGE = "service_mode_change",
}

/**
 * Performed by role enum
 */
export enum PerformedByRole {
  AGENT = "agent",
  AGENCY_OWNER = "agency_owner",
  ADMIN = "admin",
  JAMAAH = "jamaah",
  SYSTEM = "system",
}

/**
 * Jamaah action log domain model
 */
export class JamaahActionLog {
  id: string;
  tenantId: string;
  jamaahId: string;
  actionType: ActionType;
  actionDescription: string;
  performedById: string;
  performedByRole: PerformedByRole;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;

  /**
   * Create action description from type and data
   */
  static generateDescription(
    actionType: ActionType,
    data: {
      agentName?: string;
      jamaahName?: string;
      fieldChanged?: string;
      oldValue?: string;
      newValue?: string;
      documentType?: string;
      paymentAmount?: number;
      messageType?: string;
    },
  ): string {
    switch (actionType) {
      case ActionType.DOCUMENT_UPLOAD:
        return `${data.agentName || "Agent"} uploaded ${data.documentType || "document"} for ${data.jamaahName}`;

      case ActionType.PAYMENT_RECORD:
        return `${data.agentName || "Agent"} recorded payment of Rp ${data.paymentAmount?.toLocaleString("id-ID") || "0"} for ${data.jamaahName}`;

      case ActionType.MESSAGE_SENT:
        return `${data.agentName || "Agent"} sent ${data.messageType || "message"} to ${data.jamaahName}`;

      case ActionType.STATUS_CHANGE:
        return `${data.agentName || "Agent"} changed status from ${data.oldValue || "unknown"} to ${data.newValue || "unknown"} for ${data.jamaahName}`;

      case ActionType.BULK_ACTION:
        return `${data.agentName || "Agent"} performed bulk action on ${data.jamaahName}`;

      case ActionType.JAMAAH_ASSIGN:
        return `${data.jamaahName} assigned to ${data.agentName || "agent"}`;

      case ActionType.JAMAAH_CREATE:
        return `${data.agentName || "Agent"} created jamaah ${data.jamaahName}`;

      case ActionType.JAMAAH_UPDATE:
        return `${data.agentName || "Agent"} updated ${data.fieldChanged || "field"} for ${data.jamaahName}`;

      case ActionType.DELEGATION_GRANT:
        return `${data.agentName || "Agent"} granted document upload access to ${data.jamaahName}`;

      case ActionType.DELEGATION_REVOKE:
        return `${data.agentName || "Agent"} revoked document upload access from ${data.jamaahName}`;

      case ActionType.SERVICE_MODE_CHANGE:
        return `${data.agentName || "Agent"} changed service mode from ${data.oldValue || "unknown"} to ${data.newValue || "unknown"} for ${data.jamaahName}`;

      default:
        return `Action performed on ${data.jamaahName}`;
    }
  }

  /**
   * Determine if action is critical (should be retained indefinitely)
   */
  static isCriticalAction(actionType: ActionType): boolean {
    const criticalActions = [
      ActionType.PAYMENT_RECORD,
      ActionType.STATUS_CHANGE,
      ActionType.JAMAAH_CREATE,
    ];
    return criticalActions.includes(actionType);
  }

  /**
   * Get retention period in months
   */
  static getRetentionPeriod(actionType: ActionType): number | null {
    if (this.isCriticalAction(actionType)) {
      return null; // Indefinite retention
    }
    return 24; // 2 years for non-critical actions
  }
}
