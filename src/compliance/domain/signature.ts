/**
 * Epic 12, Story 12.2: Signature Domain Model
 * E-signature workflow logic
 */

/**
 * Signature status enum
 */
export enum SignatureStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  VIEWED = "viewed",
  SIGNED = "signed",
  DECLINED = "declined",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

/**
 * Signer type enum
 */
export enum SignerType {
  JAMAAH = "jamaah",
  AGENT = "agent",
  OWNER = "owner",
}

/**
 * E-signature provider enum
 */
export enum SignatureProvider {
  PRIVYID = "privyid",
  DOCUSIGN = "docusign",
  ADOBE_SIGN = "adobe_sign",
  MANUAL = "manual", // For offline/scanned signatures
}

/**
 * Signature event types
 */
export enum SignatureEventType {
  SENT = "sent",
  DELIVERED = "delivered",
  VIEWED = "viewed",
  SIGNED = "signed",
  DECLINED = "declined",
  REMINDER_SENT = "reminder_sent",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

/**
 * Signature event
 */
export interface SignatureEvent {
  eventType: SignatureEventType;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Signature domain model
 */
export class Signature {
  id: string;
  tenantId: string;
  contractId: string;
  signerType: SignerType;
  signerId: string;
  signerName: string;
  signerEmail: string;
  signatureProvider: SignatureProvider;
  providerEnvelopeId?: string;
  status: SignatureStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  declinedAt?: Date;
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  signatureImageUrl?: string;
  metadata: Record<string, any>;
  events: SignatureEvent[];
  reminderCount: number;
  lastReminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Allowed status transitions for signatures
   */
  private static readonly ALLOWED_TRANSITIONS: Record<
    SignatureStatus,
    SignatureStatus[]
  > = {
    [SignatureStatus.PENDING]: [
      SignatureStatus.SENT,
      SignatureStatus.CANCELLED,
    ],
    [SignatureStatus.SENT]: [
      SignatureStatus.DELIVERED,
      SignatureStatus.VIEWED,
      SignatureStatus.EXPIRED,
      SignatureStatus.CANCELLED,
    ],
    [SignatureStatus.DELIVERED]: [
      SignatureStatus.VIEWED,
      SignatureStatus.EXPIRED,
      SignatureStatus.CANCELLED,
    ],
    [SignatureStatus.VIEWED]: [
      SignatureStatus.SIGNED,
      SignatureStatus.DECLINED,
      SignatureStatus.EXPIRED,
      SignatureStatus.CANCELLED,
    ],
    [SignatureStatus.SIGNED]: [],
    [SignatureStatus.DECLINED]: [],
    [SignatureStatus.EXPIRED]: [],
    [SignatureStatus.CANCELLED]: [],
  };

  /**
   * Validate if status transition is allowed
   */
  static canTransitionTo(
    currentStatus: SignatureStatus,
    newStatus: SignatureStatus,
  ): boolean {
    const allowedTransitions = this.ALLOWED_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get allowed transitions for current status
   */
  static getAllowedTransitions(
    currentStatus: SignatureStatus,
  ): SignatureStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if reminder should be sent (7 days after sent, not signed)
   */
  static shouldSendReminder(
    sentAt: Date | null,
    status: SignatureStatus,
    reminderCount: number,
    lastReminderSentAt: Date | null,
    currentDate: Date = new Date(),
  ): boolean {
    // Don't send reminders if already signed, declined, expired, or cancelled
    if (
      status === SignatureStatus.SIGNED ||
      status === SignatureStatus.DECLINED ||
      status === SignatureStatus.EXPIRED ||
      status === SignatureStatus.CANCELLED
    ) {
      return false;
    }

    // Must be sent first
    if (!sentAt) return false;

    // Max 3 reminders
    if (reminderCount >= 3) return false;

    // If never sent reminder, check if 7 days have passed since sent
    if (!lastReminderSentAt) {
      const daysSinceSent = Math.floor(
        (currentDate.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysSinceSent >= 7;
    }

    // If reminder was sent before, check if 7 days have passed since last reminder
    const daysSinceLastReminder = Math.floor(
      (currentDate.getTime() - lastReminderSentAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysSinceLastReminder >= 7;
  }

  /**
   * Check if signature is expired
   */
  static isExpired(
    expiresAt: Date | null,
    currentDate: Date = new Date(),
  ): boolean {
    if (!expiresAt) return false;
    return currentDate > expiresAt;
  }

  /**
   * Calculate expiration date (30 days from sent date)
   */
  static calculateExpirationDate(sentDate: Date): Date {
    const expirationDate = new Date(sentDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    return expirationDate;
  }

  /**
   * Add event to signature audit trail
   */
  static addEvent(
    events: SignatureEvent[],
    eventType: SignatureEventType,
    metadata?: Record<string, any>,
  ): SignatureEvent[] {
    const newEvent: SignatureEvent = {
      eventType,
      timestamp: new Date(),
      metadata,
    };

    return [...events, newEvent];
  }

  /**
   * Get signature provider display name
   */
  static getProviderDisplayName(provider: SignatureProvider): string {
    const displayNames: Record<SignatureProvider, string> = {
      [SignatureProvider.PRIVYID]: "PrivyID",
      [SignatureProvider.DOCUSIGN]: "DocuSign",
      [SignatureProvider.ADOBE_SIGN]: "Adobe Sign",
      [SignatureProvider.MANUAL]: "Manual",
    };

    return displayNames[provider];
  }

  /**
   * Validate signer information
   */
  static validateSigner(
    signerName: string,
    signerEmail: string,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!signerName || signerName.trim().length === 0) {
      errors.push("Signer name is required");
    }

    if (!signerEmail || signerEmail.trim().length === 0) {
      errors.push("Signer email is required");
    } else {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signerEmail)) {
        errors.push("Invalid email format");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Determine if signature can be resent
   */
  static canResend(status: SignatureStatus, reminderCount: number): boolean {
    // Can resend if sent/viewed but not signed, and reminder count < 3
    return (
      (status === SignatureStatus.SENT ||
        status === SignatureStatus.DELIVERED ||
        status === SignatureStatus.VIEWED) &&
      reminderCount < 3
    );
  }
}
