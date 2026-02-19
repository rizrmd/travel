/**
 * Tenant Domain Model
 * Represents a travel agency in the multi-tenant system
 */

export enum TenantStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
  FAILED = "failed",
  DELETED = "deleted",
}

export enum TenantTier {
  STARTER = "starter",
  PROFESSIONAL = "professional",
  ENTERPRISE = "enterprise",
}

export interface ResourceLimits {
  maxConcurrentUsers: number;
  maxJamaahPerMonth: number;
  maxAgents: number;
  maxPackages: number;
}

export class Tenant {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  tier: TenantTier;

  // Contact Information
  ownerEmail: string;
  ownerPhone: string;
  address: string;

  // Domain Configuration
  customDomain?: string;
  domainVerificationToken?: string;
  domainVerifiedAt?: Date;

  // Resource Limits
  resourceLimits: ResourceLimits;

  // Provisioning Metadata
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Tenant>) {
    Object.assign(this, partial);
  }

  /**
   * Check if tenant is active and operational
   */
  isActive(): boolean {
    return this.status === TenantStatus.ACTIVE;
  }

  /**
   * Check if tenant can access the platform
   */
  canAccess(): boolean {
    return [TenantStatus.ACTIVE].includes(this.status);
  }

  /**
   * Check if tenant is enterprise tier
   */
  isEnterprise(): boolean {
    return this.tier === TenantTier.ENTERPRISE;
  }

  /**
   * Get default resource limits based on tier
   */
  static getDefaultResourceLimits(tier: TenantTier): ResourceLimits {
    switch (tier) {
      case TenantTier.STARTER:
        return {
          maxConcurrentUsers: 100,
          maxJamaahPerMonth: 500,
          maxAgents: 5,
          maxPackages: 10,
        };
      case TenantTier.PROFESSIONAL:
        return {
          maxConcurrentUsers: 500,
          maxJamaahPerMonth: 3000,
          maxAgents: 25,
          maxPackages: 50,
        };
      case TenantTier.ENTERPRISE:
        return {
          maxConcurrentUsers: 2000,
          maxJamaahPerMonth: 15000,
          maxAgents: 100,
          maxPackages: 200,
        };
      default:
        return {
          maxConcurrentUsers: 100,
          maxJamaahPerMonth: 500,
          maxAgents: 5,
          maxPackages: 10,
        };
    }
  }

  /**
   * Generate subdomain slug from agency name
   * Example: "PT Berkah Umroh" -> "berkah-umroh"
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/^(pt|cv)\s+/i, "") // Remove PT/CV prefix
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
  }
}
