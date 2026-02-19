/**
 * User Domain Model
 * Represents a user in the multi-tenant system
 */

export enum UserRole {
  SUPER_ADMIN = "super_admin", // Platform administrator
  AGENCY_OWNER = "agency_owner", // Tenant owner
  AGENT = "agent", // Travel agent
  AFFILIATE = "affiliate", // Affiliate partner
  ADMIN = "admin", // Administrative staff
  JAMAAH = "jamaah", // Pilgrim/customer
  FAMILY = "family", // Family member of jamaah
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export class User {
  id: string;
  tenantId: string;

  // Authentication
  email: string;
  password: string; // bcrypt hashed
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Profile
  fullName: string;
  phone?: string;
  avatar?: string;

  // Authorization
  role: UserRole;
  status: UserStatus;

  // Security
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  /**
   * Check if user is agency owner
   */
  isAgencyOwner(): boolean {
    return this.role === UserRole.AGENCY_OWNER;
  }

  /**
   * Check if user can access admin features
   */
  canAccessAdmin(): boolean {
    return [
      UserRole.SUPER_ADMIN,
      UserRole.AGENCY_OWNER,
      UserRole.ADMIN,
    ].includes(this.role);
  }

  /**
   * Check if user account is locked
   */
  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  /**
   * Check if user needs to verify email
   */
  needsEmailVerification(): boolean {
    return this.status === UserStatus.PENDING_VERIFICATION;
  }

  /**
   * Increment failed login attempts
   */
  incrementFailedAttempts(): void {
    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
  }

  /**
   * Reset failed login attempts
   */
  resetFailedAttempts(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  /**
   * Update last login information
   */
  updateLastLogin(ip: string): void {
    this.lastLoginAt = new Date();
    this.lastLoginIp = ip;
    this.resetFailedAttempts();
  }
}
