import * as crypto from "crypto";

export enum ApiKeyEnvironment {
  PRODUCTION = "production",
  SANDBOX = "sandbox",
}

export class ApiKey {
  id: string;
  tenantId: string;
  userId: string;
  keyHash: string;
  name: string;
  environment: ApiKeyEnvironment;
  scopes: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;

  constructor(partial: Partial<ApiKey>) {
    Object.assign(this, partial);
  }

  static generateKey(environment: ApiKeyEnvironment): string {
    const prefix =
      environment === ApiKeyEnvironment.PRODUCTION ? "pk_live" : "pk_test";
    const random = crypto.randomBytes(32).toString("hex");
    return `${prefix}_${random}`;
  }

  static parseEnvironment(key: string): ApiKeyEnvironment {
    if (key.startsWith("pk_live_")) {
      return ApiKeyEnvironment.PRODUCTION;
    } else if (key.startsWith("pk_test_")) {
      return ApiKeyEnvironment.SANDBOX;
    }
    throw new Error("Invalid API key format");
  }

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }

  hasScope(scope: string): boolean {
    return this.scopes.includes(scope);
  }

  hasAllScopes(requiredScopes: string[]): boolean {
    return requiredScopes.every((scope) => this.scopes.includes(scope));
  }

  updateLastUsed(): void {
    this.lastUsedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  updateScopes(newScopes: string[]): void {
    this.scopes = newScopes;
  }

  setExpiry(expiresAt: Date): void {
    this.expiresAt = expiresAt;
  }

  removeExpiry(): void {
    this.expiresAt = undefined;
  }
}
