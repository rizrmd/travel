/**
 * Epic 7, Story 7.1: Payment Domain Model
 *
 * Core business logic for payment management including:
 * - Manual payment entry
 * - Payment status tracking
 * - Payment method validation
 * - Jamaah payment status calculation
 */

export enum PaymentMethod {
  BANK_TRANSFER = "bank_transfer",
  VIRTUAL_ACCOUNT = "virtual_account",
  CASH = "cash",
  OTHER = "other",
}

export enum PaymentType {
  DP = "dp",
  INSTALLMENT = "installment",
  FULL_PAYMENT = "full_payment",
}

export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export class Payment {
  id: string;
  tenantId: string;
  jamaahId: string;
  packageId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  status: PaymentStatus;
  referenceNumber: string | null;
  paymentDate: Date;
  notes: string | null;
  recordedById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: Partial<Payment>) {
    Object.assign(this, data);
  }

  /**
   * Validate payment amount is positive
   */
  static isValidAmount(amount: number): boolean {
    return amount > 0;
  }

  /**
   * Validate payment date is not in the future
   */
  static isValidPaymentDate(paymentDate: Date): boolean {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return paymentDate <= today;
  }

  /**
   * Validate reference number format (basic validation)
   * Real implementation would check bank-specific formats
   */
  static isValidReferenceNumber(referenceNumber: string): boolean {
    if (!referenceNumber) return true; // nullable
    // Basic validation: alphanumeric, 6-50 chars
    return /^[A-Za-z0-9]{6,50}$/.test(referenceNumber);
  }

  /**
   * Check if payment can be confirmed
   */
  canConfirm(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  /**
   * Confirm payment
   */
  confirm(): void {
    if (!this.canConfirm()) {
      throw new Error(`Cannot confirm payment with status: ${this.status}`);
    }
    this.status = PaymentStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  /**
   * Check if payment can be cancelled
   */
  canCancel(): boolean {
    return (
      this.status === PaymentStatus.PENDING ||
      this.status === PaymentStatus.CONFIRMED
    );
  }

  /**
   * Cancel payment with reason
   */
  cancel(reason?: string): void {
    if (!this.canCancel()) {
      throw new Error(`Cannot cancel payment with status: ${this.status}`);
    }
    this.status = PaymentStatus.CANCELLED;
    if (reason) {
      this.notes = this.notes
        ? `${this.notes}\n\nCancellation reason: ${reason}`
        : `Cancellation reason: ${reason}`;
    }
    this.updatedAt = new Date();
  }

  /**
   * Refund payment
   */
  refund(reason?: string): void {
    if (this.status !== PaymentStatus.CONFIRMED) {
      throw new Error("Can only refund confirmed payments");
    }
    this.status = PaymentStatus.REFUNDED;
    if (reason) {
      this.notes = this.notes
        ? `${this.notes}\n\nRefund reason: ${reason}`
        : `Refund reason: ${reason}`;
    }
    this.updatedAt = new Date();
  }

  /**
   * Check if this is a down payment
   */
  isDownPayment(): boolean {
    return this.paymentType === PaymentType.DP;
  }

  /**
   * Check if this is an installment payment
   */
  isInstallment(): boolean {
    return this.paymentType === PaymentType.INSTALLMENT;
  }

  /**
   * Check if this is a full payment
   */
  isFullPayment(): boolean {
    return this.paymentType === PaymentType.FULL_PAYMENT;
  }

  /**
   * Format amount to IDR currency
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(this.amount);
  }

  /**
   * Get payment method display name in Indonesian
   */
  getPaymentMethodDisplay(): string {
    const displays: Record<PaymentMethod, string> = {
      [PaymentMethod.BANK_TRANSFER]: "Transfer Bank",
      [PaymentMethod.VIRTUAL_ACCOUNT]: "Virtual Account",
      [PaymentMethod.CASH]: "Tunai",
      [PaymentMethod.OTHER]: "Lainnya",
    };
    return displays[this.paymentMethod];
  }

  /**
   * Get payment type display name in Indonesian
   */
  getPaymentTypeDisplay(): string {
    const displays: Record<PaymentType, string> = {
      [PaymentType.DP]: "Uang Muka (DP)",
      [PaymentType.INSTALLMENT]: "Cicilan",
      [PaymentType.FULL_PAYMENT]: "Pembayaran Penuh",
    };
    return displays[this.paymentType];
  }

  /**
   * Calculate days since payment
   */
  getDaysSincePayment(): number {
    const now = new Date();
    const diff = now.getTime() - this.paymentDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if payment was made today
   */
  isToday(): boolean {
    const today = new Date();
    return (
      this.paymentDate.getDate() === today.getDate() &&
      this.paymentDate.getMonth() === today.getMonth() &&
      this.paymentDate.getFullYear() === today.getFullYear()
    );
  }
}
