/**
 * Epic 5, Story 5.6: Jamaah Delegation Domain Model
 * Manages delegation of permissions to jamaah for self-service
 */

/**
 * Permission type enum
 */
export enum PermissionType {
  UPLOAD_DOCUMENTS = "upload_documents",
  VIEW_PAYMENTS = "view_payments",
  UPDATE_PROFILE = "update_profile",
}

/**
 * Delegation token type enum
 */
export enum DelegationTokenType {
  DOCUMENT_UPLOAD = "document_upload",
  PROFILE_UPDATE = "profile_update",
  PAYMENT_VIEW = "payment_view",
}

/**
 * Jamaah delegation domain model
 */
export class JamaahDelegation {
  id: string;
  tenantId: string;
  jamaahId: string;
  delegatedToUserId: string;
  delegatedByAgentId: string;
  permissionType: PermissionType;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  revokedAt?: Date;

  /**
   * Check if delegation is currently valid
   */
  static isValid(delegation: {
    isActive: boolean;
    expiresAt?: Date;
    revokedAt?: Date;
  }): boolean {
    if (!delegation.isActive) {
      return false;
    }

    if (delegation.revokedAt) {
      return false;
    }

    if (delegation.expiresAt && new Date() > new Date(delegation.expiresAt)) {
      return false;
    }

    return true;
  }

  /**
   * Check if delegation is expiring soon
   */
  static isExpiringSoon(
    expiresAt: Date | undefined,
    daysThreshold: number = 3,
  ): boolean {
    if (!expiresAt) {
      return false;
    }

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 && diffDays <= daysThreshold;
  }

  /**
   * Get default expiration date (30 days from now)
   */
  static getDefaultExpiration(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  /**
   * Map permission type to allowed actions
   */
  static getAllowedActions(permissionType: PermissionType): string[] {
    switch (permissionType) {
      case PermissionType.UPLOAD_DOCUMENTS:
        return [
          "upload_passport",
          "upload_ktp",
          "upload_kk",
          "upload_vaksin",
          "upload_foto",
        ];
      case PermissionType.VIEW_PAYMENTS:
        return ["view_payment_history", "view_payment_schedule"];
      case PermissionType.UPDATE_PROFILE:
        return ["update_phone", "update_email", "update_address"];
      default:
        return [];
    }
  }

  /**
   * Get permission description in Indonesian
   */
  static getPermissionDescription(permissionType: PermissionType): string {
    switch (permissionType) {
      case PermissionType.UPLOAD_DOCUMENTS:
        return "Unggah dokumen persyaratan umroh";
      case PermissionType.VIEW_PAYMENTS:
        return "Lihat riwayat dan jadwal pembayaran";
      case PermissionType.UPDATE_PROFILE:
        return "Perbarui data profil pribadi";
      default:
        return "Akses tidak diketahui";
    }
  }
}
