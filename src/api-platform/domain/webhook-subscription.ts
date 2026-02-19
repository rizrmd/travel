import * as crypto from "crypto";

export enum WebhookEvent {
  PAYMENT_CONFIRMED = "payment.confirmed",
  PAYMENT_FAILED = "payment.failed",
  JAMAAH_CREATED = "jamaah.created",
  JAMAAH_UPDATED = "jamaah.updated",
  JAMAAH_DELETED = "jamaah.deleted",
  PACKAGE_UPDATED = "package.updated",
  DOCUMENT_APPROVED = "document.approved",
  DOCUMENT_REJECTED = "document.rejected",
  CONTRACT_SIGNED = "contract.signed",
}

export class WebhookSubscription {
  id: string;
  tenantId: string;
  apiKeyId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<WebhookSubscription>) {
    Object.assign(this, partial);
  }

  static generateSecret(): string {
    return `whsec_${crypto.randomBytes(32).toString("hex")}`;
  }

  isSubscribedTo(event: WebhookEvent): boolean {
    return this.events.includes(event);
  }

  addEvent(event: WebhookEvent): void {
    if (!this.events.includes(event)) {
      this.events.push(event);
      this.updatedAt = new Date();
    }
  }

  removeEvent(event: WebhookEvent): void {
    this.events = this.events.filter((e) => e !== event);
    this.updatedAt = new Date();
  }

  updateEvents(newEvents: WebhookEvent[]): void {
    this.events = newEvents;
    this.updatedAt = new Date();
  }

  updateUrl(newUrl: string): void {
    this.url = newUrl;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  regenerateSecret(): void {
    this.secret = WebhookSubscription.generateSecret();
    this.updatedAt = new Date();
  }

  isValidUrl(): boolean {
    try {
      const url = new URL(this.url);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  }
}
