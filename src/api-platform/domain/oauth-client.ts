import * as crypto from "crypto";

export class OAuthClient {
  id: string;
  tenantId: string;
  clientId: string;
  clientSecretHash: string;
  name: string;
  description?: string;
  redirectUris: string[];
  scopes: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<OAuthClient>) {
    Object.assign(this, partial);
  }

  static generateClientId(): string {
    return `cli_${crypto.randomBytes(16).toString("hex")}`;
  }

  static generateClientSecret(): string {
    return `sec_${crypto.randomBytes(32).toString("hex")}`;
  }

  hasScope(scope: string): boolean {
    return this.scopes.includes(scope);
  }

  hasAllScopes(requiredScopes: string[]): boolean {
    return requiredScopes.every((scope) => this.scopes.includes(scope));
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateScopes(newScopes: string[]): void {
    this.scopes = newScopes;
    this.updatedAt = new Date();
  }

  addRedirectUri(uri: string): void {
    if (!this.redirectUris.includes(uri)) {
      this.redirectUris.push(uri);
      this.updatedAt = new Date();
    }
  }

  removeRedirectUri(uri: string): void {
    this.redirectUris = this.redirectUris.filter((u) => u !== uri);
    this.updatedAt = new Date();
  }

  isValidRedirectUri(uri: string): boolean {
    return this.redirectUris.includes(uri);
  }
}
