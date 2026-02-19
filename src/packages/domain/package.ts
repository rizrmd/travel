/**
 * Epic 4, Story 4.1: Package Domain Model
 *
 * Core business logic for package management including:
 * - Package creation and validation
 * - Capacity management
 * - Status transitions
 * - Pricing validation
 */

export enum PackageStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SOLD_OUT = "sold_out",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export class Package {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  durationDays: number;
  retailPrice: number;
  wholesalePrice: number;
  costPrice: number | null;
  capacity: number;
  availableSlots: number;
  departureDate: Date;
  returnDate: Date;
  status: PackageStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: Partial<Package>) {
    Object.assign(this, data);
  }

  /**
   * Validate package pricing hierarchy
   * Retail >= Wholesale >= Cost
   */
  static isValidPricing(
    retailPrice: number,
    wholesalePrice: number,
    costPrice?: number,
  ): boolean {
    if (retailPrice < wholesalePrice) {
      return false;
    }
    if (costPrice !== undefined && wholesalePrice < costPrice) {
      return false;
    }
    return true;
  }

  /**
   * Validate capacity is positive
   */
  static isValidCapacity(capacity: number): boolean {
    return capacity > 0;
  }

  /**
   * Validate departure date is not in the past
   */
  static isValidDepartureDate(departureDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return departureDate >= today;
  }

  /**
   * Calculate return date based on departure and duration
   */
  static calculateReturnDate(departureDate: Date, durationDays: number): Date {
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + durationDays);
    return returnDate;
  }

  /**
   * Calculate agent commission from retail and wholesale prices
   */
  static calculateAgentCommission(
    retailPrice: number,
    wholesalePrice: number,
  ): number {
    return retailPrice - wholesalePrice;
  }

  /**
   * Calculate agent commission percentage
   */
  static calculateAgentCommissionPercentage(
    retailPrice: number,
    wholesalePrice: number,
  ): number {
    if (retailPrice === 0) return 0;
    return ((retailPrice - wholesalePrice) / retailPrice) * 100;
  }

  /**
   * Calculate agency profit (wholesale - cost)
   */
  static calculateAgencyProfit(
    wholesalePrice: number,
    costPrice: number,
  ): number {
    return wholesalePrice - costPrice;
  }

  /**
   * Calculate total margin (retail - cost)
   */
  static calculateTotalMargin(retailPrice: number, costPrice: number): number {
    return retailPrice - costPrice;
  }

  /**
   * Check if package can be published
   */
  canPublish(): boolean {
    return (
      this.status === PackageStatus.DRAFT &&
      this.availableSlots > 0 &&
      Package.isValidDepartureDate(this.departureDate)
    );
  }

  /**
   * Publish package
   */
  publish(): void {
    if (!this.canPublish()) {
      throw new Error(`Cannot publish package with status: ${this.status}`);
    }
    this.status = PackageStatus.PUBLISHED;
    this.updatedAt = new Date();
  }

  /**
   * Check if package can be updated
   */
  canUpdate(): boolean {
    return (
      this.status !== PackageStatus.COMPLETED &&
      this.status !== PackageStatus.CANCELLED
    );
  }

  /**
   * Decrease available slots (when jamaah assigned)
   */
  decrementSlots(count: number = 1): void {
    if (!this.canUpdate()) {
      throw new Error(`Cannot modify package with status: ${this.status}`);
    }
    if (this.availableSlots < count) {
      throw new Error(
        `Not enough available slots. Available: ${this.availableSlots}, Requested: ${count}`,
      );
    }
    this.availableSlots -= count;
    if (this.availableSlots === 0 && this.status === PackageStatus.PUBLISHED) {
      this.status = PackageStatus.SOLD_OUT;
    }
    this.updatedAt = new Date();
  }

  /**
   * Increase available slots (when jamaah removed)
   */
  incrementSlots(count: number = 1): void {
    if (!this.canUpdate()) {
      throw new Error(`Cannot modify package with status: ${this.status}`);
    }
    this.availableSlots += count;
    if (this.availableSlots > this.capacity) {
      this.availableSlots = this.capacity;
    }
    // Auto-change from SOLD_OUT to PUBLISHED when slots become available
    if (this.availableSlots > 0 && this.status === PackageStatus.SOLD_OUT) {
      this.status = PackageStatus.PUBLISHED;
    }
    this.updatedAt = new Date();
  }

  /**
   * Cancel package
   */
  cancel(reason?: string): void {
    if (this.status === PackageStatus.COMPLETED) {
      throw new Error("Cannot cancel completed package");
    }
    if (this.status === PackageStatus.CANCELLED) {
      throw new Error("Package is already cancelled");
    }
    this.status = PackageStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  /**
   * Mark package as completed
   */
  complete(): void {
    if (
      this.status !== PackageStatus.PUBLISHED &&
      this.status !== PackageStatus.SOLD_OUT
    ) {
      throw new Error(`Cannot complete package with status: ${this.status}`);
    }
    const today = new Date();
    if (this.returnDate > today) {
      throw new Error("Cannot complete package before return date");
    }
    this.status = PackageStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  /**
   * Check if package is sold out
   */
  isSoldOut(): boolean {
    return this.availableSlots === 0 || this.status === PackageStatus.SOLD_OUT;
  }

  /**
   * Check if package is active (can accept bookings)
   */
  isActive(): boolean {
    return this.status === PackageStatus.PUBLISHED && this.availableSlots > 0;
  }

  /**
   * Get occupancy percentage
   */
  getOccupancyPercentage(): number {
    if (this.capacity === 0) return 0;
    const occupied = this.capacity - this.availableSlots;
    return (occupied / this.capacity) * 100;
  }

  /**
   * Format price to IDR currency
   */
  getFormattedRetailPrice(): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(this.retailPrice);
  }

  /**
   * Get status display name in Indonesian
   */
  getStatusDisplay(): string {
    const displays: Record<PackageStatus, string> = {
      [PackageStatus.DRAFT]: "Draf",
      [PackageStatus.PUBLISHED]: "Dipublikasikan",
      [PackageStatus.SOLD_OUT]: "Habis Terjual",
      [PackageStatus.COMPLETED]: "Selesai",
      [PackageStatus.CANCELLED]: "Dibatalkan",
    };
    return displays[this.status];
  }

  /**
   * Calculate days until departure
   */
  getDaysUntilDeparture(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departure = new Date(this.departureDate);
    departure.setHours(0, 0, 0, 0);
    const diff = departure.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if departure is soon (within 30 days)
   */
  isDepartureSoon(): boolean {
    return (
      this.getDaysUntilDeparture() <= 30 && this.getDaysUntilDeparture() >= 0
    );
  }
}
