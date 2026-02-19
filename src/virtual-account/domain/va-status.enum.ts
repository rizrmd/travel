/**
 * Integration 4: Virtual Account Payment Gateway
 * Domain: Virtual Account Status Enumeration
 *
 * Status lifecycle:
 * ACTIVE -> USED (when payment received)
 * ACTIVE -> EXPIRED (when expiry time passed)
 * ACTIVE -> CLOSED (manual closure)
 */

export enum VAStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  USED = "used",
  CLOSED = "closed",
}

/**
 * VA Status display names in Indonesian
 */
export const VAStatusNames: Record<VAStatus, string> = {
  [VAStatus.ACTIVE]: "Aktif",
  [VAStatus.EXPIRED]: "Kadaluarsa",
  [VAStatus.USED]: "Telah Digunakan",
  [VAStatus.CLOSED]: "Ditutup",
};

/**
 * Payment Notification Status
 */
export enum NotificationStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

/**
 * Notification Status display names
 */
export const NotificationStatusNames: Record<NotificationStatus, string> = {
  [NotificationStatus.PENDING]: "Menunggu Proses",
  [NotificationStatus.PROCESSED]: "Berhasil Diproses",
  [NotificationStatus.FAILED]: "Gagal Diproses",
};

/**
 * Check if VA can receive payment
 */
export function canReceivePayment(status: VAStatus): boolean {
  return status === VAStatus.ACTIVE;
}

/**
 * Check if VA is terminal status (cannot change)
 */
export function isTerminalStatus(status: VAStatus): boolean {
  return status === VAStatus.USED || status === VAStatus.CLOSED;
}
