/**
 * Epic 5, Story 5.1: Jamaah Domain Model
 * Business logic for jamaah status management and transitions
 */

/**
 * Jamaah status enum
 * Tracks the overall lifecycle of a jamaah from lead to completion
 */
export enum JamaahStatus {
  LEAD = "lead",
  INTERESTED = "interested",
  DEPOSIT_PAID = "deposit_paid",
  PARTIALLY_PAID = "partially_paid",
  FULLY_PAID = "fully_paid",
  DOCUMENTS_PENDING = "documents_pending",
  DOCUMENTS_COMPLETE = "documents_complete",
  READY = "ready",
  DEPARTED = "departed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Document status enum
 */
export enum DocumentStatus {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete",
  PENDING_REVIEW = "pending_review",
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PAID_FULL = "paid_full",
  PARTIAL = "partial",
  OVERDUE = "overdue",
  NOT_STARTED = "not_started",
}

/**
 * Approval status enum
 */
export enum ApprovalStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
  NOT_SUBMITTED = "not_submitted",
}

/**
 * Overall status enum
 */
export enum OverallStatus {
  READY_TO_DEPART = "ready_to_depart",
  IN_PROGRESS = "in_progress",
  AT_RISK = "at_risk",
}

/**
 * Service mode enum - Story 5.7
 */
export enum ServiceMode {
  AGENT_ASSISTED = "agent_assisted",
  SELF_SERVICE = "self_service",
  HYBRID = "hybrid",
}

/**
 * Status indicator colors - Story 5.2
 */
export type StatusIndicatorColor = "red" | "yellow" | "green";

/**
 * Status indicators - Story 5.2
 */
export interface StatusIndicators {
  documents: StatusIndicatorColor;
  payments: StatusIndicatorColor;
  approval: StatusIndicatorColor;
}

/**
 * Visual cue - Story 5.2
 */
export interface VisualCue {
  color: StatusIndicatorColor;
  icon: string;
  priority: "low" | "medium" | "high" | "critical";
  urgentAction?: string;
}

/**
 * Jamaah domain model
 */
export class Jamaah {
  id: string;
  tenantId: string;
  agentId: string;
  packageId: string;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  status: JamaahStatus;
  serviceMode: ServiceMode;
  assignedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  /**
   * Allowed status transitions
   * Validates business rules for status changes
   */
  private static readonly ALLOWED_TRANSITIONS: Record<
    JamaahStatus,
    JamaahStatus[]
  > = {
    [JamaahStatus.LEAD]: [JamaahStatus.INTERESTED, JamaahStatus.CANCELLED],
    [JamaahStatus.INTERESTED]: [
      JamaahStatus.DEPOSIT_PAID,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.DEPOSIT_PAID]: [
      JamaahStatus.PARTIALLY_PAID,
      JamaahStatus.FULLY_PAID,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.PARTIALLY_PAID]: [
      JamaahStatus.FULLY_PAID,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.FULLY_PAID]: [
      JamaahStatus.DOCUMENTS_PENDING,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.DOCUMENTS_PENDING]: [
      JamaahStatus.DOCUMENTS_COMPLETE,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.DOCUMENTS_COMPLETE]: [
      JamaahStatus.READY,
      JamaahStatus.CANCELLED,
    ],
    [JamaahStatus.READY]: [JamaahStatus.DEPARTED, JamaahStatus.CANCELLED],
    [JamaahStatus.DEPARTED]: [JamaahStatus.COMPLETED],
    [JamaahStatus.COMPLETED]: [],
    [JamaahStatus.CANCELLED]: [],
  };

  /**
   * Validate if status transition is allowed
   */
  static canTransitionTo(
    currentStatus: JamaahStatus,
    newStatus: JamaahStatus,
  ): boolean {
    const allowedTransitions = this.ALLOWED_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get allowed transitions for current status
   */
  static getAllowedTransitions(currentStatus: JamaahStatus): JamaahStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Compute document status indicator color - Story 5.2
   */
  static getDocumentIndicatorColor(
    documentStatus: DocumentStatus,
  ): StatusIndicatorColor {
    switch (documentStatus) {
      case DocumentStatus.COMPLETE:
        return "green";
      case DocumentStatus.PENDING_REVIEW:
        return "yellow";
      case DocumentStatus.INCOMPLETE:
        return "red";
      default:
        return "red";
    }
  }

  /**
   * Compute payment status indicator color - Story 5.2
   */
  static getPaymentIndicatorColor(
    paymentStatus: PaymentStatus,
  ): StatusIndicatorColor {
    switch (paymentStatus) {
      case PaymentStatus.PAID_FULL:
        return "green";
      case PaymentStatus.PARTIAL:
        return "yellow";
      case PaymentStatus.OVERDUE:
      case PaymentStatus.NOT_STARTED:
        return "red";
      default:
        return "red";
    }
  }

  /**
   * Compute approval status indicator color - Story 5.2
   */
  static getApprovalIndicatorColor(
    approvalStatus: ApprovalStatus,
  ): StatusIndicatorColor {
    switch (approvalStatus) {
      case ApprovalStatus.APPROVED:
        return "green";
      case ApprovalStatus.PENDING:
        return "yellow";
      case ApprovalStatus.REJECTED:
      case ApprovalStatus.NOT_SUBMITTED:
        return "red";
      default:
        return "red";
    }
  }

  /**
   * Compute visual cue for jamaah - Story 5.2
   */
  static getVisualCue(
    status: JamaahStatus,
    paymentStatus: PaymentStatus,
    documentStatus: DocumentStatus,
  ): VisualCue {
    // Critical: Overdue payment
    if (paymentStatus === PaymentStatus.OVERDUE) {
      return {
        color: "red",
        icon: "alert-circle",
        priority: "critical",
        urgentAction: "Cicilan telat - hubungi segera",
      };
    }

    // Critical: Missing documents close to departure
    if (
      documentStatus === DocumentStatus.INCOMPLETE &&
      (status === JamaahStatus.FULLY_PAID || status === JamaahStatus.READY)
    ) {
      return {
        color: "red",
        icon: "file-text",
        priority: "critical",
        urgentAction: "Dokumen kurang - keberangkatan mendekat",
      };
    }

    // Medium: Documents pending review
    if (documentStatus === DocumentStatus.PENDING_REVIEW) {
      return {
        color: "yellow",
        icon: "clock",
        priority: "medium",
        urgentAction: "Menunggu review dokumen",
      };
    }

    // Medium: Partial payment
    if (paymentStatus === PaymentStatus.PARTIAL) {
      return {
        color: "yellow",
        icon: "dollar-sign",
        priority: "medium",
      };
    }

    // Low: All good
    if (
      paymentStatus === PaymentStatus.PAID_FULL &&
      documentStatus === DocumentStatus.COMPLETE
    ) {
      return {
        color: "green",
        icon: "check-circle",
        priority: "low",
      };
    }

    // Default
    return {
      color: "yellow",
      icon: "info",
      priority: "medium",
    };
  }

  /**
   * Determine overall status based on document, payment, and time to departure
   */
  static computeOverallStatus(
    documentStatus: DocumentStatus,
    paymentStatus: PaymentStatus,
    approvalStatus: ApprovalStatus,
    daysUntilDeparture: number,
  ): OverallStatus {
    // Ready to depart
    if (
      approvalStatus === ApprovalStatus.APPROVED &&
      paymentStatus === PaymentStatus.PAID_FULL &&
      daysUntilDeparture < 7
    ) {
      return OverallStatus.READY_TO_DEPART;
    }

    // At risk
    if (
      paymentStatus === PaymentStatus.OVERDUE ||
      approvalStatus === ApprovalStatus.REJECTED ||
      (documentStatus === DocumentStatus.INCOMPLETE && daysUntilDeparture < 14)
    ) {
      return OverallStatus.AT_RISK;
    }

    // In progress
    return OverallStatus.IN_PROGRESS;
  }
}
