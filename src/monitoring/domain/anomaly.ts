/**
 * Domain Model: Anomaly Detection
 *
 * Business logic for detecting and managing system anomalies
 */

export enum AnomalyType {
  ACTIVITY_DROP = "activity_drop",
  ERROR_SPIKE = "error_spike",
  API_USAGE_SPIKE = "api_usage_spike",
  REVENUE_DROP = "revenue_drop",
  USER_CHURN = "user_churn",
  SLOW_PERFORMANCE = "slow_performance",
  HIGH_MEMORY = "high_memory",
  DISK_SPACE_LOW = "disk_space_low",
}

export enum AnomalySeverity {
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical",
}

export enum AnomalyStatus {
  DETECTED = "detected",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
  FALSE_POSITIVE = "false_positive",
}

export interface AnomalyMetadata {
  currentValue?: number;
  previousValue?: number;
  changePercentage?: number;
  threshold?: number;
  affectedResources?: string[];
  [key: string]: any;
}

export class Anomaly {
  constructor(
    public readonly tenantId: string | null,
    public readonly anomalyType: AnomalyType,
    public readonly severity: AnomalySeverity,
    public readonly description: string,
    public readonly metadata: AnomalyMetadata = {},
    public status: AnomalyStatus = AnomalyStatus.DETECTED,
    public readonly detectedAt: Date = new Date(),
    public resolvedAt?: Date,
    public resolutionNotes?: string,
  ) {}

  /**
   * Determine anomaly severity based on type and metrics
   */
  static determineSeverity(
    anomalyType: AnomalyType,
    changePercentage: number,
    threshold: number,
  ): AnomalySeverity {
    const severityRules: Record<
      AnomalyType,
      { warning: number; critical: number }
    > = {
      [AnomalyType.ACTIVITY_DROP]: { warning: 30, critical: 50 },
      [AnomalyType.ERROR_SPIKE]: { warning: 100, critical: 200 },
      [AnomalyType.API_USAGE_SPIKE]: { warning: 150, critical: 300 },
      [AnomalyType.REVENUE_DROP]: { warning: 20, critical: 40 },
      [AnomalyType.USER_CHURN]: { warning: 15, critical: 30 },
      [AnomalyType.SLOW_PERFORMANCE]: { warning: 50, critical: 100 },
      [AnomalyType.HIGH_MEMORY]: { warning: 80, critical: 95 },
      [AnomalyType.DISK_SPACE_LOW]: { warning: 80, critical: 90 },
    };

    const rules = severityRules[anomalyType] || { warning: 50, critical: 80 };

    if (changePercentage >= rules.critical) {
      return AnomalySeverity.CRITICAL;
    } else if (changePercentage >= rules.warning) {
      return AnomalySeverity.WARNING;
    }

    return AnomalySeverity.INFO;
  }

  /**
   * Generate user-friendly description in Indonesian
   */
  static generateDescription(
    anomalyType: AnomalyType,
    tenantId: string | null,
    metadata: AnomalyMetadata,
  ): string {
    const descriptions: Record<AnomalyType, (m: AnomalyMetadata) => string> = {
      [AnomalyType.ACTIVITY_DROP]: (m) =>
        `Aktivitas turun ${m.changePercentage?.toFixed(1)}% dalam 24 jam terakhir (dari ${m.previousValue} ke ${m.currentValue})`,
      [AnomalyType.ERROR_SPIKE]: (m) =>
        `Tingkat error meningkat ${m.changePercentage?.toFixed(1)}% dalam 1 jam terakhir (${m.currentValue} errors)`,
      [AnomalyType.API_USAGE_SPIKE]: (m) =>
        `Penggunaan API melonjak ${m.changePercentage?.toFixed(1)}% (${m.currentValue} calls)`,
      [AnomalyType.REVENUE_DROP]: (m) =>
        `Pendapatan menurun ${m.changePercentage?.toFixed(1)}% dibanding periode sebelumnya`,
      [AnomalyType.USER_CHURN]: (m) =>
        `${m.currentValue} pengguna tidak aktif dalam 7 hari terakhir (${m.changePercentage?.toFixed(1)}% dari total)`,
      [AnomalyType.SLOW_PERFORMANCE]: (m) =>
        `Performa sistem melambat: ${m.currentValue}ms (threshold: ${m.threshold}ms)`,
      [AnomalyType.HIGH_MEMORY]: (m) =>
        `Penggunaan memori tinggi: ${m.currentValue?.toFixed(1)}%`,
      [AnomalyType.DISK_SPACE_LOW]: (m) =>
        `Ruang disk rendah: ${m.currentValue?.toFixed(1)}% terpakai`,
    };

    const descFn = descriptions[anomalyType];
    const desc = descFn ? descFn(metadata) : "Anomali terdeteksi";

    return tenantId ? `[Tenant: ${tenantId}] ${desc}` : desc;
  }

  /**
   * Check if anomaly requires immediate action
   */
  requiresImmediateAction(): boolean {
    return (
      this.severity === AnomalySeverity.CRITICAL &&
      this.status === AnomalyStatus.DETECTED
    );
  }

  /**
   * Resolve anomaly with notes
   */
  resolve(notes: string): void {
    this.status = AnomalyStatus.RESOLVED;
    this.resolvedAt = new Date();
    this.resolutionNotes = notes;
  }

  /**
   * Mark as false positive
   */
  markFalsePositive(reason: string): void {
    this.status = AnomalyStatus.FALSE_POSITIVE;
    this.resolvedAt = new Date();
    this.resolutionNotes = `False Positive: ${reason}`;
  }

  /**
   * Acknowledge anomaly (mark as seen)
   */
  acknowledge(): void {
    if (this.status === AnomalyStatus.DETECTED) {
      this.status = AnomalyStatus.ACKNOWLEDGED;
    }
  }

  /**
   * Check if anomaly is still active
   */
  isActive(): boolean {
    return (
      this.status === AnomalyStatus.DETECTED ||
      this.status === AnomalyStatus.ACKNOWLEDGED
    );
  }

  /**
   * Get time since detection
   */
  getTimeSinceDetection(): number {
    return Date.now() - this.detectedAt.getTime();
  }

  /**
   * Get time to resolution (if resolved)
   */
  getTimeToResolution(): number | null {
    if (!this.resolvedAt) return null;
    return this.resolvedAt.getTime() - this.detectedAt.getTime();
  }

  /**
   * Get severity color for UI
   */
  getSeverityColor(): "blue" | "yellow" | "red" {
    const colorMap: Record<AnomalySeverity, "blue" | "yellow" | "red"> = {
      [AnomalySeverity.INFO]: "blue",
      [AnomalySeverity.WARNING]: "yellow",
      [AnomalySeverity.CRITICAL]: "red",
    };

    return colorMap[this.severity];
  }

  /**
   * Get alert channels based on severity
   */
  getAlertChannels(): ("email" | "slack" | "sms")[] {
    if (this.severity === AnomalySeverity.CRITICAL) {
      return ["email", "slack", "sms"];
    } else if (this.severity === AnomalySeverity.WARNING) {
      return ["email", "slack"];
    }

    return ["email"];
  }

  /**
   * Validate if anomaly should trigger alert
   */
  shouldTriggerAlert(): boolean {
    // Don't alert for info severity
    if (this.severity === AnomalySeverity.INFO) {
      return false;
    }

    // Don't alert if already acknowledged or resolved
    if (this.status !== AnomalyStatus.DETECTED) {
      return false;
    }

    return true;
  }

  /**
   * Get recommended actions based on anomaly type
   */
  getRecommendedActions(): string[] {
    const actionMap: Record<AnomalyType, string[]> = {
      [AnomalyType.ACTIVITY_DROP]: [
        "Periksa koneksi database",
        "Cek apakah ada maintenance terjadwal",
        "Verifikasi status API eksternal",
        "Hubungi tenant untuk konfirmasi",
      ],
      [AnomalyType.ERROR_SPIKE]: [
        "Periksa log error untuk pola",
        "Cek perubahan kode terbaru",
        "Verifikasi integrasi eksternal",
        "Rollback jika diperlukan",
      ],
      [AnomalyType.API_USAGE_SPIKE]: [
        "Periksa apakah ada bot/scraper",
        "Verifikasi rate limiting berfungsi",
        "Cek pola penggunaan abnormal",
        "Hubungi tenant untuk konfirmasi",
      ],
      [AnomalyType.REVENUE_DROP]: [
        "Periksa payment gateway",
        "Verifikasi tidak ada error pembayaran",
        "Cek aktivitas penjualan",
        "Review perubahan pricing",
      ],
      [AnomalyType.USER_CHURN]: [
        "Analisis feedback pengguna",
        "Periksa performa aplikasi",
        "Review fitur yang digunakan",
        "Hubungi tenant untuk follow-up",
      ],
      [AnomalyType.SLOW_PERFORMANCE]: [
        "Periksa query database lambat",
        "Review CPU dan memory usage",
        "Cek cache hit rate",
        "Analisis API bottlenecks",
      ],
      [AnomalyType.HIGH_MEMORY]: [
        "Restart service jika diperlukan",
        "Periksa memory leaks",
        "Review query yang inefficient",
        "Clear cache jika perlu",
      ],
      [AnomalyType.DISK_SPACE_LOW]: [
        "Hapus log lama",
        "Cleanup temporary files",
        "Archive data lama",
        "Tingkatkan kapasitas disk",
      ],
    };

    return actionMap[this.anomalyType] || ["Periksa sistem secara menyeluruh"];
  }
}
