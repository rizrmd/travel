/**
 * Epic 7, Stories 7.4 & 7.5: Commission Domain Model
 *
 * Core business logic for commission management:
 * - Commission calculation
 * - Multi-level commission splits
 * - Commission status tracking
 * - Payout management
 */

export enum CommissionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export enum CommissionLevel {
  DIRECT = 1, // Direct sale
  PARENT = 2, // Commission from direct downline
  GRANDPARENT = 3, // Commission from second-level downline
}

export class Commission {
  id: string;
  tenantId: string;
  agentId: string; // Who receives this commission
  jamaahId: string;
  paymentId: string;
  baseAmount: number; // Payment amount
  commissionPercentage: number; // e.g., 16.00
  commissionAmount: number; // Calculated amount
  status: CommissionStatus;
  level: CommissionLevel; // For multi-level tracking
  originalAgentId: string | null; // The agent who made the original sale
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Commission>) {
    Object.assign(this, data);
  }

  /**
   * Calculate commission amount from percentage
   */
  static calculateCommissionAmount(
    baseAmount: number,
    percentage: number,
  ): number {
    if (baseAmount < 0) {
      throw new Error("Base amount cannot be negative");
    }
    if (percentage < 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }

    return Math.round((baseAmount * percentage) / 100);
  }

  /**
   * Calculate commission from retail/wholesale pricing difference
   */
  static calculateFromPricing(
    paymentAmount: number,
    retailPrice: number,
    wholesalePrice: number,
  ): number {
    if (retailPrice <= wholesalePrice) {
      throw new Error("Retail price must be higher than wholesale price");
    }

    // Commission is proportional to payment
    const totalCommission = retailPrice - wholesalePrice;
    const commissionPercentage = (totalCommission / retailPrice) * 100;

    return this.calculateCommissionAmount(paymentAmount, commissionPercentage);
  }

  /**
   * Split commission across multiple levels
   * @param totalCommission Total commission available
   * @param splits Array of split percentages [direct%, parent%, grandparent%]
   * @returns Array of commission amounts per level
   */
  static splitCommission(totalCommission: number, splits: number[]): number[] {
    // Validate splits sum to <= 100%
    const totalSplit = splits.reduce((sum, split) => sum + split, 0);
    if (totalSplit > 100) {
      throw new Error("Total commission splits cannot exceed 100%");
    }

    return splits.map((split) =>
      this.calculateCommissionAmount(totalCommission, split),
    );
  }

  /**
   * Check if commission can be approved
   */
  canApprove(): boolean {
    return this.status === CommissionStatus.PENDING;
  }

  /**
   * Approve commission
   */
  approve(): void {
    if (!this.canApprove()) {
      throw new Error(`Cannot approve commission with status: ${this.status}`);
    }
    this.status = CommissionStatus.APPROVED;
    this.updatedAt = new Date();
  }

  /**
   * Check if commission can be marked as paid
   */
  canMarkAsPaid(): boolean {
    return this.status === CommissionStatus.APPROVED;
  }

  /**
   * Mark commission as paid
   */
  markAsPaid(): void {
    if (!this.canMarkAsPaid()) {
      throw new Error(
        `Cannot mark commission as paid with status: ${this.status}`,
      );
    }
    this.status = CommissionStatus.PAID;
    this.updatedAt = new Date();
  }

  /**
   * Cancel commission
   */
  cancel(reason?: string): void {
    if (this.status === CommissionStatus.PAID) {
      throw new Error("Cannot cancel already paid commission");
    }
    this.status = CommissionStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  /**
   * Check if this is a direct sale commission
   */
  isDirectSale(): boolean {
    return this.level === CommissionLevel.DIRECT;
  }

  /**
   * Check if this is a downline commission
   */
  isDownlineCommission(): boolean {
    return this.level > CommissionLevel.DIRECT;
  }

  /**
   * Get formatted commission amount in IDR
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(this.commissionAmount);
  }

  /**
   * Get formatted base amount in IDR
   */
  getFormattedBaseAmount(): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(this.baseAmount);
  }

  /**
   * Get status display in Indonesian
   */
  getStatusDisplay(): string {
    const displays: Record<CommissionStatus, string> = {
      [CommissionStatus.PENDING]: "Menunggu Persetujuan",
      [CommissionStatus.APPROVED]: "Disetujui",
      [CommissionStatus.PAID]: "Sudah Dibayar",
      [CommissionStatus.CANCELLED]: "Dibatalkan",
    };
    return displays[this.status];
  }

  /**
   * Get level display in Indonesian
   */
  getLevelDisplay(): string {
    const displays: Record<CommissionLevel, string> = {
      [CommissionLevel.DIRECT]: "Penjualan Langsung",
      [CommissionLevel.PARENT]: "Komisi Downline Lv1",
      [CommissionLevel.GRANDPARENT]: "Komisi Downline Lv2",
    };
    return displays[this.level];
  }

  /**
   * Calculate days since commission created
   */
  getDaysSinceCreated(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

/**
 * Commission Rules Configuration
 * Defines commission split percentages per tenant
 */
export interface CommissionRules {
  tenantId: string;
  totalCommissionPercentage: number; // e.g., 16% of retail price
  directSalePercentage: number; // e.g., 10% for direct seller
  parentPercentage: number; // e.g., 4% for parent agent
  grandparentPercentage: number; // e.g., 2% for grandparent agent
}

/**
 * Commission Summary for Agent Dashboard
 */
export interface CommissionSummary {
  totalEarned: number;
  totalPending: number;
  totalApproved: number;
  totalPaid: number;
  directSalesCount: number;
  downlineCommissionCount: number;
  thisMonthEarnings: number;
  lastPayoutDate: Date | null;
  lastPayoutAmount: number;
}
