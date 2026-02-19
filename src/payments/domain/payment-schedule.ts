/**
 * Epic 7, Story 7.2: Payment Schedule Domain Model
 *
 * Core business logic for installment tracking:
 * - Installment schedule management
 * - Due date tracking
 * - Overdue detection
 * - Payment matching
 */

export enum ScheduleStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
  WAIVED = "waived",
}

export class PaymentSchedule {
  id: string;
  tenantId: string;
  jamaahId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: ScheduleStatus;
  paidAt: Date | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<PaymentSchedule>) {
    Object.assign(this, data);
  }

  /**
   * Generate installment schedule for a package
   * @param packagePrice Total package price
   * @param dpAmount Down payment amount
   * @param installmentCount Number of installments
   * @param startDate First installment due date
   * @returns Array of installment schedules
   */
  static generateSchedule(
    packagePrice: number,
    dpAmount: number,
    installmentCount: number,
    startDate: Date,
  ): PaymentSchedule[] {
    if (packagePrice <= 0) {
      throw new Error("Package price must be positive");
    }
    if (dpAmount < 0) {
      throw new Error("Down payment cannot be negative");
    }
    if (dpAmount >= packagePrice) {
      throw new Error("Down payment cannot exceed package price");
    }
    if (installmentCount < 1 || installmentCount > 12) {
      throw new Error("Installment count must be between 1 and 12");
    }

    const remainingAmount = packagePrice - dpAmount;
    const installmentAmount = Math.ceil(remainingAmount / installmentCount);

    const schedules: PaymentSchedule[] = [];
    const currentDueDate = new Date(startDate);

    for (let i = 0; i < installmentCount; i++) {
      // Calculate amount for this installment
      // Last installment might be different due to rounding
      let amount = installmentAmount;
      if (i === installmentCount - 1) {
        // Last installment gets the remainder
        const totalSoFar = installmentAmount * (installmentCount - 1);
        amount = remainingAmount - totalSoFar;
      }

      schedules.push(
        new PaymentSchedule({
          installmentNumber: i + 1,
          dueDate: new Date(currentDueDate),
          amount,
          status: ScheduleStatus.PENDING,
          paidAt: null,
          paymentId: null,
        }),
      );

      // Move to next month (same day)
      currentDueDate.setMonth(currentDueDate.getMonth() + 1);
    }

    return schedules;
  }

  /**
   * Check if installment is overdue
   */
  isOverdue(): boolean {
    if (
      this.status === ScheduleStatus.PAID ||
      this.status === ScheduleStatus.WAIVED
    ) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const dueDate = new Date(this.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  /**
   * Mark installment as overdue
   */
  markAsOverdue(): void {
    if (!this.isOverdue()) {
      throw new Error("Cannot mark as overdue: not yet past due date");
    }
    if (this.status === ScheduleStatus.PAID) {
      throw new Error("Cannot mark paid installment as overdue");
    }
    this.status = ScheduleStatus.OVERDUE;
    this.updatedAt = new Date();
  }

  /**
   * Check if payment can be recorded for this installment
   */
  canRecordPayment(): boolean {
    return (
      this.status === ScheduleStatus.PENDING ||
      this.status === ScheduleStatus.OVERDUE
    );
  }

  /**
   * Record payment for this installment
   */
  recordPayment(paymentId: string): void {
    if (!this.canRecordPayment()) {
      throw new Error(
        `Cannot record payment for installment with status: ${this.status}`,
      );
    }
    this.status = ScheduleStatus.PAID;
    this.paymentId = paymentId;
    this.paidAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Waive installment (forgive payment)
   */
  waive(reason?: string): void {
    if (this.status === ScheduleStatus.PAID) {
      throw new Error("Cannot waive already paid installment");
    }
    this.status = ScheduleStatus.WAIVED;
    this.updatedAt = new Date();
  }

  /**
   * Get days until due date (negative if overdue)
   */
  getDaysUntilDue(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diff = dueDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if due soon (within 3 days)
   */
  isDueSoon(): boolean {
    const days = this.getDaysUntilDue();
    return days >= 0 && days <= 3;
  }

  /**
   * Get formatted amount in IDR
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(this.amount);
  }

  /**
   * Get status display in Indonesian
   */
  getStatusDisplay(): string {
    const displays: Record<ScheduleStatus, string> = {
      [ScheduleStatus.PENDING]: "Menunggu Pembayaran",
      [ScheduleStatus.PAID]: "Lunas",
      [ScheduleStatus.OVERDUE]: "Terlambat",
      [ScheduleStatus.WAIVED]: "Dibebaskan",
    };
    return displays[this.status];
  }

  /**
   * Get color code for status (for UI)
   */
  getStatusColor(): "green" | "yellow" | "red" | "gray" {
    if (this.status === ScheduleStatus.PAID) return "green";
    if (this.status === ScheduleStatus.WAIVED) return "gray";
    if (this.status === ScheduleStatus.OVERDUE) return "red";
    if (this.isDueSoon()) return "yellow";
    return "gray";
  }

  /**
   * Format due date in Indonesian
   */
  getFormattedDueDate(): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(this.dueDate);
  }

  /**
   * Calculate total of all schedules
   */
  static calculateTotal(schedules: PaymentSchedule[]): number {
    return schedules.reduce((sum, schedule) => sum + schedule.amount, 0);
  }

  /**
   * Get paid schedules
   */
  static getPaidSchedules(schedules: PaymentSchedule[]): PaymentSchedule[] {
    return schedules.filter((s) => s.status === ScheduleStatus.PAID);
  }

  /**
   * Get pending schedules
   */
  static getPendingSchedules(schedules: PaymentSchedule[]): PaymentSchedule[] {
    return schedules.filter(
      (s) =>
        s.status === ScheduleStatus.PENDING ||
        s.status === ScheduleStatus.OVERDUE,
    );
  }

  /**
   * Get next unpaid schedule
   */
  static getNextUnpaid(schedules: PaymentSchedule[]): PaymentSchedule | null {
    const pending = this.getPendingSchedules(schedules);
    if (pending.length === 0) return null;

    // Sort by installment number
    pending.sort((a, b) => a.installmentNumber - b.installmentNumber);
    return pending[0];
  }
}
