/**
 * Domain Model: Feature Trial
 *
 * Business logic for managing feature trials and conversions
 */

export enum FeatureKey {
  AI_CHATBOT = "ai_chatbot",
  WHATSAPP_INTEGRATION = "whatsapp_integration",
  ADVANCED_ANALYTICS = "advanced_analytics",
  OCR = "ocr",
  E_SIGNATURE = "e_signature",
}

export enum TrialStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CONVERTED = "converted",
  CANCELLED = "cancelled",
}

export interface FeatureTrialConfig {
  durationDays: number;
  usageLimit: number | null;
  description: string;
}

export class FeatureTrial {
  constructor(
    public readonly tenantId: string,
    public readonly featureKey: FeatureKey,
    public status: TrialStatus,
    public readonly startedAt: Date,
    public readonly expiresAt: Date,
    public usageCount: number = 0,
    public readonly usageLimit: number | null = null,
    public trialFeedback?: string,
    public convertedAt?: Date,
  ) {}

  /**
   * Get feature trial configuration
   */
  static getFeatureConfig(featureKey: FeatureKey): FeatureTrialConfig {
    const configs: Record<FeatureKey, FeatureTrialConfig> = {
      [FeatureKey.AI_CHATBOT]: {
        durationDays: 14,
        usageLimit: null, // unlimited
        description: "AI Chatbot untuk customer service otomatis 24/7",
      },
      [FeatureKey.WHATSAPP_INTEGRATION]: {
        durationDays: 7,
        usageLimit: 100, // 100 messages
        description: "Integrasi WhatsApp untuk komunikasi dengan jamaah",
      },
      [FeatureKey.ADVANCED_ANALYTICS]: {
        durationDays: 30,
        usageLimit: null, // unlimited
        description: "Analytics dashboard dengan insights mendalam",
      },
      [FeatureKey.OCR]: {
        durationDays: 7,
        usageLimit: 50, // 50 documents
        description: "OCR untuk scan dokumen paspor dan KTP otomatis",
      },
      [FeatureKey.E_SIGNATURE]: {
        durationDays: 14,
        usageLimit: 20, // 20 signatures
        description: "Tanda tangan digital untuk kontrak dan persetujuan",
      },
    };

    return configs[featureKey];
  }

  /**
   * Create new trial
   */
  static createTrial(
    tenantId: string,
    featureKey: FeatureKey,
    durationDays?: number,
  ): FeatureTrial {
    const config = this.getFeatureConfig(featureKey);
    const days = durationDays || config.durationDays;

    const startedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    return new FeatureTrial(
      tenantId,
      featureKey,
      TrialStatus.ACTIVE,
      startedAt,
      expiresAt,
      0,
      config.usageLimit,
    );
  }

  /**
   * Check if trial is active
   */
  isActive(): boolean {
    if (this.status !== TrialStatus.ACTIVE) {
      return false;
    }

    // Check if expired by time
    if (new Date() > this.expiresAt) {
      return false;
    }

    // Check if expired by usage limit
    if (this.usageLimit !== null && this.usageCount >= this.usageLimit) {
      return false;
    }

    return true;
  }

  /**
   * Check if trial has expired
   */
  hasExpired(): boolean {
    return (
      new Date() > this.expiresAt ||
      (this.usageLimit !== null && this.usageCount >= this.usageLimit)
    );
  }

  /**
   * Track usage
   */
  trackUsage(): { success: boolean; reason?: string } {
    if (!this.isActive()) {
      return { success: false, reason: "Trial tidak aktif atau sudah expired" };
    }

    this.usageCount++;

    // Check if limit reached
    if (this.usageLimit !== null && this.usageCount >= this.usageLimit) {
      this.status = TrialStatus.EXPIRED;
      return { success: true, reason: "Batas penggunaan tercapai" };
    }

    return { success: true };
  }

  /**
   * Expire trial
   */
  expire(): void {
    if (this.status === TrialStatus.ACTIVE) {
      this.status = TrialStatus.EXPIRED;
    }
  }

  /**
   * Convert trial to paid
   */
  convert(feedback?: string): void {
    this.status = TrialStatus.CONVERTED;
    this.convertedAt = new Date();
    if (feedback) {
      this.trialFeedback = feedback;
    }
  }

  /**
   * Cancel trial
   */
  cancel(feedback?: string): void {
    this.status = TrialStatus.CANCELLED;
    if (feedback) {
      this.trialFeedback = feedback;
    }
  }

  /**
   * Extend trial period
   */
  extend(additionalDays: number): void {
    if (
      this.status !== TrialStatus.ACTIVE &&
      this.status !== TrialStatus.EXPIRED
    ) {
      throw new Error("Cannot extend trial that is converted or cancelled");
    }

    const newExpiresAt = new Date(this.expiresAt);
    newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);
    (this as any).expiresAt = newExpiresAt;

    // Reactivate if was expired
    if (this.status === TrialStatus.EXPIRED) {
      this.status = TrialStatus.ACTIVE;
    }
  }

  /**
   * Get days remaining
   */
  getDaysRemaining(): number {
    const now = new Date();
    const remaining = Math.ceil(
      (this.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, remaining);
  }

  /**
   * Get usage percentage
   */
  getUsagePercentage(): number | null {
    if (this.usageLimit === null) {
      return null; // unlimited
    }

    return Math.round((this.usageCount / this.usageLimit) * 100);
  }

  /**
   * Check if trial is expiring soon (3 days)
   */
  isExpiringSoon(): boolean {
    return this.getDaysRemaining() <= 3 && this.isActive();
  }

  /**
   * Get trial duration in days
   */
  getTrialDuration(): number {
    const duration = this.expiresAt.getTime() - this.startedAt.getTime();
    return Math.ceil(duration / (1000 * 60 * 60 * 24));
  }

  /**
   * Get elapsed days
   */
  getElapsedDays(): number {
    const elapsed = new Date().getTime() - this.startedAt.getTime();
    return Math.floor(elapsed / (1000 * 60 * 60 * 24));
  }

  /**
   * Get trial progress percentage
   */
  getProgressPercentage(): number {
    const totalDays = this.getTrialDuration();
    const elapsed = this.getElapsedDays();
    return Math.min(100, Math.round((elapsed / totalDays) * 100));
  }

  /**
   * Get feature display name
   */
  getFeatureName(): string {
    const names: Record<FeatureKey, string> = {
      [FeatureKey.AI_CHATBOT]: "AI Chatbot",
      [FeatureKey.WHATSAPP_INTEGRATION]: "Integrasi WhatsApp",
      [FeatureKey.ADVANCED_ANALYTICS]: "Advanced Analytics",
      [FeatureKey.OCR]: "OCR Scanner",
      [FeatureKey.E_SIGNATURE]: "Tanda Tangan Digital",
    };

    return names[this.featureKey];
  }

  /**
   * Get status color for UI
   */
  getStatusColor(): "green" | "yellow" | "red" | "gray" {
    const colorMap: Record<TrialStatus, "green" | "yellow" | "red" | "gray"> = {
      [TrialStatus.ACTIVE]: "green",
      [TrialStatus.EXPIRED]: "red",
      [TrialStatus.CONVERTED]: "yellow",
      [TrialStatus.CANCELLED]: "gray",
    };

    return colorMap[this.status];
  }

  /**
   * Get status label in Indonesian
   */
  getStatusLabel(): string {
    const labels: Record<TrialStatus, string> = {
      [TrialStatus.ACTIVE]: "Aktif",
      [TrialStatus.EXPIRED]: "Kedaluwarsa",
      [TrialStatus.CONVERTED]: "Dikonversi ke Berbayar",
      [TrialStatus.CANCELLED]: "Dibatalkan",
    };

    return labels[this.status];
  }

  /**
   * Get usage summary
   */
  getUsageSummary(): string {
    if (this.usageLimit === null) {
      return `${this.usageCount} penggunaan (unlimited)`;
    }

    return `${this.usageCount}/${this.usageLimit} penggunaan (${this.getUsagePercentage()}%)`;
  }

  /**
   * Calculate conversion rate for multiple trials
   */
  static calculateConversionRate(trials: FeatureTrial[]): number {
    if (trials.length === 0) return 0;

    const convertedCount = trials.filter(
      (t) => t.status === TrialStatus.CONVERTED,
    ).length;
    return Math.round((convertedCount / trials.length) * 100);
  }

  /**
   * Get trial statistics
   */
  static getStatistics(trials: FeatureTrial[]): {
    total: number;
    active: number;
    expired: number;
    converted: number;
    cancelled: number;
    conversionRate: number;
  } {
    const total = trials.length;
    const active = trials.filter((t) => t.status === TrialStatus.ACTIVE).length;
    const expired = trials.filter(
      (t) => t.status === TrialStatus.EXPIRED,
    ).length;
    const converted = trials.filter(
      (t) => t.status === TrialStatus.CONVERTED,
    ).length;
    const cancelled = trials.filter(
      (t) => t.status === TrialStatus.CANCELLED,
    ).length;
    const conversionRate = this.calculateConversionRate(trials);

    return { total, active, expired, converted, cancelled, conversionRate };
  }
}
