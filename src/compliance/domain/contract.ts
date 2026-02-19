/**
 * Epic 12, Story 12.1: Contract Domain Model
 * Business logic for Wakalah bil Ujrah contracts
 */

/**
 * Contract status enum
 */
export enum ContractStatus {
  DRAFT = "draft",
  SENT = "sent",
  VIEWED = "viewed",
  SIGNED = "signed",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

/**
 * Contract type enum
 */
export enum ContractType {
  WAKALAH_BIL_UJRAH_ECONOMY = "wakalah_bil_ujrah_economy",
  WAKALAH_BIL_UJRAH_STANDARD = "wakalah_bil_ujrah_standard",
  WAKALAH_BIL_UJRAH_PREMIUM = "wakalah_bil_ujrah_premium",
}

/**
 * Signature status enum
 */
export enum SignatureStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  VIEWED = "viewed",
  SIGNED = "signed",
  DECLINED = "declined",
  EXPIRED = "expired",
  FAILED = "failed",
}

/**
 * Contract template variables
 */
export interface ContractVariables {
  // Contract metadata
  contractNumber: string;
  contractDate: string;

  // Muwakkil (Jamaah) details
  jamaahName: string;
  jamaahKtp: string;
  jamaahAddress: string;
  jamaahPhone: string;
  jamaahEmail?: string;

  // Wakil (Agency) details
  agencyName: string;
  agencyNpwp: string;
  agencyAddress: string;
  agencyPhone: string;
  agentName: string;

  // Package details
  packageName: string;
  packageType: string;
  departureDate: string;
  returnDate: string;
  duration: number;

  // Financial details
  totalAmount: string;
  serviceFee: string;
  depositAmount: string;
  remainingAmount: string;

  // Payment schedule
  paymentSchedule: Array<{
    installmentNumber: number;
    dueDate: string;
    amount: string;
  }>;

  // Additional inclusions
  inclusions: string[];
  exclusions: string[];

  // Hotel information
  makkahHotel: string;
  madinahHotel: string;

  // Flight information
  airline: string;
  flightClass: string;
}

/**
 * Contract domain model
 */
export class Contract {
  id: string;
  tenantId: string;
  jamaahId: string;
  packageId: string;
  contractType: ContractType;
  contractNumber: string;
  templateVersion: string;
  status: ContractStatus;
  generatedAt: Date;
  sentAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  contractUrl?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Allowed status transitions for contracts
   */
  private static readonly ALLOWED_TRANSITIONS: Record<
    ContractStatus,
    ContractStatus[]
  > = {
      [ContractStatus.DRAFT]: [ContractStatus.SENT, ContractStatus.CANCELLED],
      [ContractStatus.SENT]: [
        ContractStatus.VIEWED,
        ContractStatus.EXPIRED,
        ContractStatus.CANCELLED,
      ],
      [ContractStatus.VIEWED]: [
        ContractStatus.SIGNED,
        ContractStatus.EXPIRED,
        ContractStatus.CANCELLED,
      ],
      [ContractStatus.SIGNED]: [ContractStatus.COMPLETED],
      [ContractStatus.COMPLETED]: [],
      [ContractStatus.EXPIRED]: [],
      [ContractStatus.CANCELLED]: [],
    };

  /**
   * Validate if status transition is allowed
   */
  static canTransitionTo(
    currentStatus: ContractStatus,
    newStatus: ContractStatus,
  ): boolean {
    const allowedTransitions = this.ALLOWED_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get allowed transitions for current status
   */
  static getAllowedTransitions(
    currentStatus: ContractStatus,
  ): ContractStatus[] {
    return this.ALLOWED_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Generate contract number
   * Format: TU-{TENANT_CODE}-{YEAR}-{SEQUENCE}
   */
  static generateContractNumber(
    tenantCode: string,
    year: number,
    sequence: number,
  ): string {
    const paddedSequence = sequence.toString().padStart(6, "0");
    return `TU-${tenantCode}-${year}-${paddedSequence}`;
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
   * Check if contract is expired
   */
  static isExpired(
    expiresAt: Date | null,
    currentDate: Date = new Date(),
  ): boolean {
    if (!expiresAt) return false;
    return currentDate > expiresAt;
  }

  /**
   * Check if contract requires reminder (7 days after sent, not signed)
   */
  static requiresReminder(
    sentAt: Date | null,
    status: ContractStatus,
    currentDate: Date = new Date(),
  ): boolean {
    if (!sentAt || status !== ContractStatus.SENT) return false;

    const daysSinceSent = Math.floor(
      (currentDate.getTime() - sentAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysSinceSent >= 7;
  }

  /**
   * Get template name from contract type
   */
  static getTemplateName(contractType: ContractType): string {
    const templateMap: Record<ContractType, string> = {
      [ContractType.WAKALAH_BIL_UJRAH_ECONOMY]: "wakalah-bil-ujrah-economy",
      [ContractType.WAKALAH_BIL_UJRAH_STANDARD]: "wakalah-bil-ujrah-standard",
      [ContractType.WAKALAH_BIL_UJRAH_PREMIUM]: "wakalah-bil-ujrah-premium",
    };

    return templateMap[contractType];
  }

  /**
   * Determine contract type from package type
   */
  static determineContractType(packageType: string): ContractType {
    const normalizedType = packageType.toLowerCase();

    if (normalizedType.includes("premium") || normalizedType.includes("vip")) {
      return ContractType.WAKALAH_BIL_UJRAH_PREMIUM;
    }

    if (
      normalizedType.includes("standard") ||
      normalizedType.includes("reguler")
    ) {
      return ContractType.WAKALAH_BIL_UJRAH_STANDARD;
    }

    return ContractType.WAKALAH_BIL_UJRAH_ECONOMY;
  }

  /**
   * Validate contract variables completeness
   */
  static validateVariables(variables: Partial<ContractVariables>): {
    valid: boolean;
    missingFields: string[];
  } {
    const requiredFields: (keyof ContractVariables)[] = [
      "contractNumber",
      "contractDate",
      "jamaahName",
      "jamaahKtp",
      "jamaahAddress",
      "agencyName",
      "agencyNpwp",
      "packageName",
      "departureDate",
      "duration",
      "totalAmount",
    ];

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!variables[field]) {
        missingFields.push(field);
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }
}
