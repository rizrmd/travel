/**
 * Epic 8, Story 8.3: WebSocket Event Types
 * Defines real-time event types and payloads
 */

/**
 * Event types for real-time broadcasting
 */
export enum WebSocketEventType {
  // Jamaah events
  JAMAAH_CREATED = "jamaah.created",
  JAMAAH_UPDATED = "jamaah.updated",
  JAMAAH_DELETED = "jamaah.deleted",
  JAMAAH_STATUS_CHANGED = "jamaah.status_changed",
  JAMAAH_DOCUMENT_UPDATED = "jamaah.document_updated",

  // Payment events
  PAYMENT_RECEIVED = "payment.received",
  PAYMENT_CONFIRMED = "payment.confirmed",
  PAYMENT_CANCELLED = "payment.cancelled",
  PAYMENT_REFUNDED = "payment.refunded",

  // Commission events
  COMMISSION_CREATED = "commission.created",
  COMMISSION_APPROVED = "commission.approved",
  COMMISSION_PAID = "commission.paid",

  // Document events
  DOCUMENT_UPLOADED = "document.uploaded",
  DOCUMENT_APPROVED = "document.approved",
  DOCUMENT_REJECTED = "document.rejected",

  // Package events
  PACKAGE_CREATED = "package.created",
  PACKAGE_UPDATED = "package.updated",
  PACKAGE_DELETED = "package.deleted",

  // Lead events
  LEAD_CREATED = "lead.created",
  LEAD_UPDATED = "lead.updated",
  LEAD_CONVERTED = "lead.converted",

  // System events
  NOTIFICATION = "notification",
  MIGRATION_STATUS = "migration.status",
  MIGRATION_PROGRESS = "migration.progress",
  OCR_COMPLETED = "ocr.completed",
  OCR_FAILED = "ocr.failed",
  JOB_COMPLETED = "job.completed",
  JOB_FAILED = "job.failed",
  CACHE_INVALIDATED = "cache.invalidated",

  // E-Signature events
  SIGNATURE_SENT = "signature.sent",
  SIGNATURE_DELIVERED = "signature.delivered",
  SIGNATURE_OPENED = "signature.opened",
  SIGNATURE_VIEWED = "signature.viewed",
  SIGNATURE_SIGNED = "signature.signed",
  SIGNATURE_DECLINED = "signature.declined",
  SIGNATURE_EXPIRED = "signature.expired",
  SIGNATURE_FAILED = "signature.failed",
  SIGNATURE_REMINDER_SENT = "signature.reminder_sent",
  SIGNATURE_CERTIFICATE_GENERATED = "signature.certificate_generated",
}

/**
 * Base event payload structure
 */
export interface WebSocketEventPayload<T = any> {
  type: WebSocketEventType;
  tenantId: string;
  entityId?: string;
  entityType?: string;
  data: T;
  timestamp: Date;
  actorId?: string; // User who triggered the event
  metadata?: Record<string, any>;
}

/**
 * Connection metadata stored in socket.data
 */
export interface SocketData {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
  connectedAt: Date;
}

/**
 * Jamaah event payloads
 */
export interface JamaahEventData {
  jamaahId: string;
  jamaahName: string;
  changes?: Partial<{
    status: string;
    payment_status: string;
    document_status: string;
  }>;
}

/**
 * Payment event payloads
 */
export interface PaymentEventData {
  paymentId: string;
  jamaahId: string;
  jamaahName: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
}

/**
 * Commission event payloads
 */
export interface CommissionEventData {
  commissionId: string;
  agentId: string;
  agentName: string;
  amount: number;
  status: string;
  level: number;
}

/**
 * Document event payloads
 */
export interface DocumentEventData {
  documentId: string;
  documentType: string;
  jamaahId: string;
  jamaahName: string;
  status: string;
  rejectionReason?: string;
}

/**
 * Package event payloads
 */
export interface PackageEventData {
  packageId: string;
  packageName: string;
  changes?: Record<string, any>;
  departureDate?: string;
  retailPrice?: number;
  wholesalePrice?: number;
  availableSlots?: number;
  status?: string;
  changeSummary?: string;
}

/**
 * Lead event payloads
 */
export interface LeadEventData {
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  agentId: string;
  status: string;
  convertedToJamaahId?: string;
}

/**
 * Notification event payload
 */
export interface NotificationEventData {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Job completion event payload
 */
export interface JobEventData {
  jobId: string;
  jobType: string;
  status: "completed" | "failed";
  result?: any;
  error?: string;
}

/**
 * Event history entry for reconnecting clients
 */
export interface EventHistoryEntry {
  id: string;
  event: WebSocketEventPayload;
  broadcastedAt: Date;
}
