/**
 * Epic 8, Story 8.4: Queue Job Types
 * Defines job types and payloads for BullMQ background processing
 */

/**
 * Job queue names
 */
export enum QueueName {
  EMAIL = "email",
  NOTIFICATIONS = "notifications",
  BATCH_PROCESSING = "batch-processing",
  REPORTS = "reports",
}

/**
 * Email job types
 */
export enum EmailJobType {
  SEND_WELCOME = "send-welcome",
  SEND_PAYMENT_CONFIRMATION = "send-payment-confirmation",
  SEND_PAYMENT_REMINDER = "send-payment-reminder",
  SEND_DOCUMENT_APPROVAL = "send-document-approval",
  SEND_COMMISSION_NOTIFICATION = "send-commission-notification",
  SEND_PAYOUT_NOTIFICATION = "send-payout-notification",
  SEND_LEAD_NOTIFICATION = "send-lead-notification",
  SEND_BULK_EMAIL = "send-bulk-email",
}

/**
 * Notification job types
 */
export enum NotificationJobType {
  SEND_WHATSAPP = "send-whatsapp",
  SEND_SMS = "send-sms",
  SEND_PUSH_NOTIFICATION = "send-push",
  SEND_IN_APP_NOTIFICATION = "send-in-app",
}

/**
 * Batch processing job types
 */
export enum BatchJobType {
  IMPORT_JAMAAH = "import-jamaah",
  IMPORT_PAYMENTS = "import-payments",
  EXPORT_DATA = "export-data",
  GENERATE_COMMISSION_BATCH = "generate-commission-batch",
  PROCESS_OVERDUE_PAYMENTS = "process-overdue-payments",
  SEND_PAYMENT_REMINDERS = "send-payment-reminders",
}

/**
 * Report job types
 */
export enum ReportJobType {
  GENERATE_FINANCIAL_REPORT = "generate-financial-report",
  GENERATE_AGENT_PERFORMANCE = "generate-agent-performance",
  GENERATE_JAMAAH_REPORT = "generate-jamaah-report",
  GENERATE_COMMISSION_REPORT = "generate-commission-report",
  GENERATE_ANALYTICS_EXPORT = "generate-analytics-export",
}

/**
 * Base job data interface
 */
export interface BaseJobData {
  tenantId: string;
  userId?: string; // User who initiated the job
  metadata?: Record<string, any>;
}

/**
 * Email job data
 */
export interface EmailJobData extends BaseJobData {
  type: EmailJobType;
  to: string | string[];
  subject: string;
  template?: string;
  data?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
}

/**
 * WhatsApp job data
 */
export interface WhatsAppJobData extends BaseJobData {
  type: NotificationJobType;
  to: string | string[];
  message: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

/**
 * Batch import job data
 */
export interface BatchImportJobData extends BaseJobData {
  type: BatchJobType;
  filePath: string;
  entityType: "jamaah" | "payment" | "package";
  mappings?: Record<string, string>; // CSV column to entity field mapping
}

/**
 * Report generation job data
 */
export interface ReportJobData extends BaseJobData {
  type: ReportJobType;
  format: "pdf" | "xlsx" | "csv";
  filters?: Record<string, any>;
  dateRange?: {
    from: Date;
    to: Date;
  };
  outputPath?: string; // Where to store the generated report
}

/**
 * Payment reminder batch job data
 */
export interface PaymentReminderJobData extends BaseJobData {
  type: BatchJobType.SEND_PAYMENT_REMINDERS;
  daysAhead: number; // Send reminders for payments due in N days
}

/**
 * Commission generation job data
 */
export interface CommissionGenerationJobData extends BaseJobData {
  type: BatchJobType.GENERATE_COMMISSION_BATCH;
  paymentIds?: string[]; // Specific payments to process
  dateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * Job result interface
 */
export interface JobResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  processedCount?: number;
  failedCount?: number;
  details?: Record<string, any>;
}

/**
 * Job options
 */
export interface QueueJobOptions {
  attempts?: number; // Number of retry attempts (default: 3)
  backoff?: {
    type: "exponential" | "fixed";
    delay: number; // Delay in ms
  };
  delay?: number; // Initial delay before processing (ms)
  priority?: number; // Job priority (higher = more important)
  removeOnComplete?: boolean | number; // Remove on complete or keep last N
  removeOnFail?: boolean | number; // Remove on fail or keep last N
}
