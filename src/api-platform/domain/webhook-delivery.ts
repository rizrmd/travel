export enum WebhookDeliveryStatus {
  PENDING = "pending",
  DELIVERED = "delivered",
  FAILED = "failed",
  MAX_RETRIES_EXCEEDED = "max_retries_exceeded",
}

export class WebhookDelivery {
  id: string;
  tenantId: string;
  subscriptionId: string;
  eventType: string;
  payload: any;
  status: WebhookDeliveryStatus;
  httpStatus?: number;
  responseBody?: string;
  attemptCount: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;

  constructor(partial: Partial<WebhookDelivery>) {
    Object.assign(this, partial);
    this.attemptCount = this.attemptCount || 0;
    this.status = this.status || WebhookDeliveryStatus.PENDING;
  }

  static readonly MAX_RETRY_ATTEMPTS = 3;
  static readonly RETRY_DELAYS = [60000, 300000, 1800000]; // 1min, 5min, 30min in milliseconds

  canRetry(): boolean {
    return (
      this.status !== WebhookDeliveryStatus.DELIVERED &&
      this.status !== WebhookDeliveryStatus.MAX_RETRIES_EXCEEDED &&
      this.attemptCount < WebhookDelivery.MAX_RETRY_ATTEMPTS
    );
  }

  markAsDelivered(httpStatus: number, responseBody: string): void {
    this.status = WebhookDeliveryStatus.DELIVERED;
    this.httpStatus = httpStatus;
    this.responseBody = responseBody;
    this.deliveredAt = new Date();
    this.nextRetryAt = undefined;
  }

  markAsFailed(httpStatus?: number, responseBody?: string): void {
    this.attemptCount += 1;
    this.httpStatus = httpStatus;
    this.responseBody = responseBody;

    if (this.attemptCount >= WebhookDelivery.MAX_RETRY_ATTEMPTS) {
      this.status = WebhookDeliveryStatus.MAX_RETRIES_EXCEEDED;
      this.nextRetryAt = undefined;
    } else {
      this.status = WebhookDeliveryStatus.FAILED;
      this.calculateNextRetry();
    }
  }

  private calculateNextRetry(): void {
    const delay = WebhookDelivery.RETRY_DELAYS[this.attemptCount - 1];
    this.nextRetryAt = new Date(Date.now() + delay);
  }

  isReadyForRetry(): boolean {
    if (!this.canRetry() || !this.nextRetryAt) {
      return false;
    }
    return new Date() >= this.nextRetryAt;
  }

  getRetryDelayMs(): number {
    if (this.attemptCount >= WebhookDelivery.RETRY_DELAYS.length) {
      return WebhookDelivery.RETRY_DELAYS[
        WebhookDelivery.RETRY_DELAYS.length - 1
      ];
    }
    return WebhookDelivery.RETRY_DELAYS[this.attemptCount];
  }
}
