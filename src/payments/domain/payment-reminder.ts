/**
 * Epic 7, Story 7.3: Payment Reminder Domain Model
 *
 * Core business logic for payment reminders:
 * - Reminder scheduling
 * - Multi-channel delivery (email, WhatsApp)
 * - Deduplication
 * - Manual trigger support
 */

export enum ReminderChannel {
  EMAIL = "email",
  WHATSAPP = "whatsapp",
  BOTH = "both",
}

export enum ReminderStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
  SKIPPED = "skipped",
}

export class PaymentReminder {
  id: string;
  tenantId: string;
  paymentScheduleId: string;
  jamaahId: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  sentAt: Date | null;
  scheduledFor: Date;
  errorMessage: string | null;
  metadata: ReminderMetadata;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<PaymentReminder>) {
    Object.assign(this, data);
  }

  /**
   * Calculate reminder date (3 days before due date)
   */
  static calculateReminderDate(dueDate: Date): Date {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 3);
    reminderDate.setHours(9, 0, 0, 0); // 09:00 WIB
    return reminderDate;
  }

  /**
   * Check if reminder should be sent today
   */
  shouldSendToday(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduled = new Date(this.scheduledFor);
    scheduled.setHours(0, 0, 0, 0);

    return (
      scheduled.getTime() === today.getTime() &&
      this.status === ReminderStatus.PENDING
    );
  }

  /**
   * Check if reminder was recently sent (within 24 hours)
   */
  wasRecentlySent(): boolean {
    if (!this.sentAt) return false;

    const now = new Date();
    const hoursSinceSent =
      (now.getTime() - this.sentAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceSent < 24;
  }

  /**
   * Check if reminder can be sent
   */
  canSend(): boolean {
    if (this.status !== ReminderStatus.PENDING) return false;
    if (this.wasRecentlySent()) return false;
    return true;
  }

  /**
   * Mark reminder as sent
   */
  markAsSent(): void {
    if (!this.canSend()) {
      throw new Error("Cannot send reminder: invalid state or recently sent");
    }
    this.status = ReminderStatus.SENT;
    this.sentAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Mark reminder as failed with error message
   */
  markAsFailed(errorMessage: string): void {
    this.status = ReminderStatus.FAILED;
    this.errorMessage = errorMessage;
    this.updatedAt = new Date();
  }

  /**
   * Skip reminder (e.g., already paid)
   */
  skip(reason: string): void {
    this.status = ReminderStatus.SKIPPED;
    this.errorMessage = reason;
    this.updatedAt = new Date();
  }

  /**
   * Check if reminder should be sent via email
   */
  shouldSendEmail(): boolean {
    return (
      this.channel === ReminderChannel.EMAIL ||
      this.channel === ReminderChannel.BOTH
    );
  }

  /**
   * Check if reminder should be sent via WhatsApp
   */
  shouldSendWhatsApp(): boolean {
    return (
      this.channel === ReminderChannel.WHATSAPP ||
      this.channel === ReminderChannel.BOTH
    );
  }

  /**
   * Get formatted scheduled date in Indonesian
   */
  getFormattedScheduledDate(): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(this.scheduledFor);
  }

  /**
   * Get status display in Indonesian
   */
  getStatusDisplay(): string {
    const displays: Record<ReminderStatus, string> = {
      [ReminderStatus.PENDING]: "Menunggu Pengiriman",
      [ReminderStatus.SENT]: "Terkirim",
      [ReminderStatus.FAILED]: "Gagal",
      [ReminderStatus.SKIPPED]: "Dilewati",
    };
    return displays[this.status];
  }

  /**
   * Get channel display in Indonesian
   */
  getChannelDisplay(): string {
    const displays: Record<ReminderChannel, string> = {
      [ReminderChannel.EMAIL]: "Email",
      [ReminderChannel.WHATSAPP]: "WhatsApp",
      [ReminderChannel.BOTH]: "Email & WhatsApp",
    };
    return displays[this.channel];
  }
}

/**
 * Payment Reminder Metadata
 * Additional information for reminder templating
 */
export interface ReminderMetadata {
  jamaahName: string;
  jamaahEmail: string;
  jamaahPhone: string | null;
  installmentNumber: number;
  installmentAmount: number;
  dueDate: Date;
  packageName: string;
  agentName: string | null;
  agentEmail: string | null;
  bankAccountInfo: BankAccountInfo | null;
}

/**
 * Bank Account Information for Payment Instructions
 */
export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode: string | null;
}

/**
 * Reminder Template Data
 * Data used for email/WhatsApp template rendering
 */
export interface ReminderTemplateData {
  jamaahName: string;
  installmentNumber: number;
  installmentAmount: string; // Formatted IDR
  dueDate: string; // Formatted date
  daysUntilDue: number;
  packageName: string;
  bankAccountInfo: BankAccountInfo | null;
  paymentPortalUrl: string;
}
