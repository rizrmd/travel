/**
 * Epic 6, Story 6.4 & 6.5: Document Review Domain Model
 * Business logic for document review and bulk approval
 */

import { DocumentStatus } from "./document";

/**
 * Review Action Type
 */
export enum ReviewAction {
  APPROVE = "approve",
  REJECT = "reject",
}

/**
 * Bulk Approval Job Status
 */
export enum BulkApprovalStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Document Review Queue Item
 */
export class DocumentReviewQueueItem {
  documentId: string;
  jamaahId: string;
  jamaahName: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedByName: string;
  extractedData?: Record<string, any>;

  /**
   * Priority score for review queue ordering
   * Higher score = higher priority
   */
  getPriorityScore(): number {
    let score = 0;

    // Older documents get higher priority
    const ageInDays =
      (Date.now() - this.uploadedAt.getTime()) / (1000 * 60 * 60 * 24);
    score += ageInDays * 10;

    // Critical documents get priority boost
    const criticalTypes = ["passport", "visa", "vaccination"];
    if (criticalTypes.includes(this.documentType)) {
      score += 50;
    }

    return score;
  }
}

/**
 * Bulk Approval Job
 */
export class BulkApprovalJob {
  id: string;
  tenantId: string;
  reviewerId: string;
  action: ReviewAction;
  documentIds: string[];
  status: BulkApprovalStatus;
  totalDocuments: number;
  processedDocuments: number;
  successfulDocuments: number;
  failedDocuments: number;
  rejectionReason?: string; // For bulk rejection
  errorReport?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Maximum documents per bulk operation
   */
  static readonly MAX_BULK_SIZE = 50;

  /**
   * Validates bulk operation size
   */
  static isValidBulkSize(count: number): boolean {
    return count > 0 && count <= this.MAX_BULK_SIZE;
  }

  /**
   * Starts processing
   */
  startProcessing(): void {
    if (this.status !== BulkApprovalStatus.PENDING) {
      throw new Error(
        `Cannot start processing. Current status: ${this.status}`,
      );
    }
    if (!BulkApprovalJob.isValidBulkSize(this.documentIds.length)) {
      throw new Error(
        `Invalid bulk size. Maximum: ${BulkApprovalJob.MAX_BULK_SIZE}, Got: ${this.documentIds.length}`,
      );
    }

    this.status = BulkApprovalStatus.PROCESSING;
    this.totalDocuments = this.documentIds.length;
    this.processedDocuments = 0;
    this.successfulDocuments = 0;
    this.failedDocuments = 0;
    this.startedAt = new Date();
  }

  /**
   * Updates progress
   */
  updateProgress(success: boolean): void {
    if (this.status !== BulkApprovalStatus.PROCESSING) {
      throw new Error(`Cannot update progress. Current status: ${this.status}`);
    }
    this.processedDocuments += 1;
    if (success) {
      this.successfulDocuments += 1;
    } else {
      this.failedDocuments += 1;
    }
  }

  /**
   * Completes the job
   */
  complete(): void {
    if (this.status !== BulkApprovalStatus.PROCESSING) {
      throw new Error(`Cannot complete job. Current status: ${this.status}`);
    }
    this.status =
      this.failedDocuments === 0
        ? BulkApprovalStatus.COMPLETED
        : BulkApprovalStatus.FAILED;
    this.completedAt = new Date();
  }

  /**
   * Calculates progress percentage
   */
  getProgress(): number {
    if (this.totalDocuments === 0) {
      return 0;
    }
    return Math.round((this.processedDocuments / this.totalDocuments) * 100);
  }

  /**
   * Checks if job is finished
   */
  isFinished(): boolean {
    return [BulkApprovalStatus.COMPLETED, BulkApprovalStatus.FAILED].includes(
      this.status,
    );
  }
}

/**
 * Bulk Approval Result
 */
export interface BulkApprovalResult {
  documentId: string;
  success: boolean;
  error?: string;
}

/**
 * Review Statistics
 * Aggregate statistics for document review
 */
export class ReviewStatistics {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  avgReviewTimeMinutes: number;
  pendingByType: Record<string, number>;
  oldestPendingDays: number;

  /**
   * Calculates review efficiency score (0-100)
   */
  getEfficiencyScore(): number {
    const total = this.totalPending + this.totalApproved + this.totalRejected;

    if (total === 0) {
      return 100;
    }

    // Lower pending percentage = higher score
    const pendingPercentage = (this.totalPending / total) * 100;
    const baseScore = 100 - pendingPercentage;

    // Penalty for old pending documents
    const agePenalty = Math.min(this.oldestPendingDays * 2, 30);

    // Penalty for slow review time
    const timePenalty = Math.min(this.avgReviewTimeMinutes / 2, 20);

    const finalScore = Math.max(0, baseScore - agePenalty - timePenalty);

    return Math.round(finalScore);
  }

  /**
   * Gets recommended action
   */
  getRecommendedAction(): string {
    if (this.totalPending === 0) {
      return "All documents reviewed! Great job!";
    }

    if (this.oldestPendingDays > 7) {
      return "Urgent: Some documents pending for over 7 days";
    }

    if (this.totalPending > 50) {
      return "High volume: Consider bulk approval for verified documents";
    }

    return "Continue reviewing pending documents";
  }
}

/**
 * Review Filter
 */
export interface ReviewFilter {
  documentType?: string;
  status?: DocumentStatus;
  jamaahId?: string;
  uploadedAfter?: Date;
  uploadedBefore?: Date;
  sortBy?: "priority" | "date" | "type";
  sortOrder?: "asc" | "desc";
}
