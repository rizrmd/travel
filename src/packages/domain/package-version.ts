/**
 * Epic 4, Story 4.6: Package Version Domain Model
 *
 * Core business logic for package versioning and audit trail including:
 * - Version snapshots
 * - Change tracking
 * - Audit history
 */

export class PackageVersion {
  id: string;
  tenantId: string;
  packageId: string;
  versionNumber: number;
  snapshot: Record<string, any>;
  changedFields: string[];
  changeSummary: string;
  changedById: string;
  changeReason: string | null;
  createdAt: Date;

  constructor(data: Partial<PackageVersion>) {
    Object.assign(this, data);
  }

  /**
   * Create initial version snapshot
   */
  static createInitialVersion(
    packageId: string,
    tenantId: string,
    snapshot: Record<string, any>,
    changedById: string,
  ): PackageVersion {
    return new PackageVersion({
      packageId,
      tenantId,
      versionNumber: 1,
      snapshot,
      changedFields: [],
      changeSummary: "Paket dibuat",
      changedById,
      changeReason: null,
      createdAt: new Date(),
    });
  }

  /**
   * Compare snapshots and create change summary
   */
  static createChangeSummary(
    oldSnapshot: Record<string, any>,
    newSnapshot: Record<string, any>,
  ): { fields: string[]; summary: string } {
    const changedFields: string[] = [];
    const changes: string[] = [];

    // Field display names in Indonesian
    const fieldNames: Record<string, string> = {
      name: "Nama paket",
      description: "Deskripsi",
      durationDays: "Durasi",
      retailPrice: "Harga retail",
      wholesalePrice: "Harga grosir",
      costPrice: "Harga cost",
      capacity: "Kapasitas",
      availableSlots: "Slot tersedia",
      departureDate: "Tanggal keberangkatan",
      returnDate: "Tanggal kembali",
      status: "Status",
    };

    // Status display in Indonesian
    const statusNames: Record<string, string> = {
      draft: "Draf",
      published: "Dipublikasikan",
      sold_out: "Habis Terjual",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };

    // Compare each field
    for (const key in fieldNames) {
      if (oldSnapshot[key] !== newSnapshot[key]) {
        changedFields.push(key);

        const fieldName = fieldNames[key];
        const oldValue = oldSnapshot[key];
        const newValue = newSnapshot[key];

        // Format change based on field type
        if (
          key === "retailPrice" ||
          key === "wholesalePrice" ||
          key === "costPrice"
        ) {
          const oldFormatted = this.formatCurrency(oldValue);
          const newFormatted = this.formatCurrency(newValue);
          changes.push(
            `${fieldName} diubah dari ${oldFormatted} menjadi ${newFormatted}`,
          );
        } else if (key === "departureDate" || key === "returnDate") {
          const oldFormatted = this.formatDate(oldValue);
          const newFormatted = this.formatDate(newValue);
          changes.push(
            `${fieldName} diubah dari ${oldFormatted} menjadi ${newFormatted}`,
          );
        } else if (key === "status") {
          const oldStatus = statusNames[oldValue] || oldValue;
          const newStatus = statusNames[newValue] || newValue;
          changes.push(
            `${fieldName} diubah dari ${oldStatus} menjadi ${newStatus}`,
          );
        } else if (key === "durationDays") {
          changes.push(
            `${fieldName} diubah dari ${oldValue} hari menjadi ${newValue} hari`,
          );
        } else {
          changes.push(
            `${fieldName} diubah dari "${oldValue}" menjadi "${newValue}"`,
          );
        }
      }
    }

    const summary =
      changes.length > 0 ? changes.join(", ") : "Tidak ada perubahan";

    return { fields: changedFields, summary };
  }

  /**
   * Format currency to IDR
   */
  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format date to Indonesian format
   */
  private static formatDate(value: string | Date): string {
    const date = typeof value === "string" ? new Date(value) : value;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  /**
   * Get formatted version number (e.g., "v1", "v2")
   */
  getFormattedVersionNumber(): string {
    return `v${this.versionNumber}`;
  }

  /**
   * Get formatted created date
   */
  getFormattedCreatedAt(): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(this.createdAt);
  }

  /**
   * Check if this is the initial version
   */
  isInitialVersion(): boolean {
    return this.versionNumber === 1;
  }

  /**
   * Check if there is a change reason
   */
  hasChangeReason(): boolean {
    return this.changeReason !== null && this.changeReason.trim() !== "";
  }
}
