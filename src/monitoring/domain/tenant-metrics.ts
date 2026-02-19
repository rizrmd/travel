/**
 * Domain Model: Tenant Metrics
 *
 * Business logic for tenant-specific metrics and analytics
 */

export enum TenantMetricType {
  USER_COUNT = "user_count",
  JAMAAH_COUNT = "jamaah_count",
  REVENUE = "revenue",
  ACTIVITY_SCORE = "activity_score",
  ERROR_COUNT = "error_count",
  API_CALLS = "api_calls",
  STORAGE_USED = "storage_used",
  ACTIVE_SESSIONS = "active_sessions",
}

export interface TenantMetricMetadata {
  period?: "hour" | "day" | "week" | "month";
  source?: string;
  breakdown?: Record<string, number>;
  [key: string]: any;
}

export class TenantMetrics {
  constructor(
    public readonly tenantId: string,
    public readonly metricType: TenantMetricType,
    public readonly value: number,
    public readonly metadata: TenantMetricMetadata = {},
    public readonly recordedAt: Date = new Date(),
  ) {}

  /**
   * Calculate activity score (0-100) based on multiple factors
   */
  static calculateActivityScore(
    userCount: number,
    jamaahCount: number,
    apiCalls: number,
    activeSessions: number,
  ): number {
    // Weighted scoring
    const userScore = Math.min((userCount / 10) * 25, 25); // Max 25 points
    const jamaahScore = Math.min((jamaahCount / 50) * 25, 25); // Max 25 points
    const apiScore = Math.min((apiCalls / 1000) * 25, 25); // Max 25 points
    const sessionScore = Math.min((activeSessions / 5) * 25, 25); // Max 25 points

    return Math.round(userScore + jamaahScore + apiScore + sessionScore);
  }

  /**
   * Determine tenant health based on activity score
   */
  getActivityLevel(): "high" | "medium" | "low" | "inactive" {
    if (this.metricType !== TenantMetricType.ACTIVITY_SCORE) {
      throw new Error(
        "Activity level can only be determined from ACTIVITY_SCORE metric",
      );
    }

    if (this.value >= 70) return "high";
    if (this.value >= 40) return "medium";
    if (this.value >= 10) return "low";
    return "inactive";
  }

  /**
   * Check if tenant is at risk (low activity or high errors)
   */
  isAtRisk(): boolean {
    if (
      this.metricType === TenantMetricType.ACTIVITY_SCORE &&
      this.value < 20
    ) {
      return true;
    }

    if (this.metricType === TenantMetricType.ERROR_COUNT && this.value > 100) {
      return true;
    }

    return false;
  }

  /**
   * Calculate growth rate compared to previous period
   */
  calculateGrowth(previousValue: number): {
    rate: number;
    status: "growth" | "decline" | "stable";
  } {
    if (previousValue === 0) {
      return { rate: 0, status: "stable" };
    }

    const rate = ((this.value - previousValue) / previousValue) * 100;

    if (Math.abs(rate) < 5) {
      return { rate, status: "stable" };
    }

    return {
      rate: Math.abs(rate),
      status: rate > 0 ? "growth" : "decline",
    };
  }

  /**
   * Format metric value with appropriate unit
   */
  getFormattedValue(): string {
    const units: Record<TenantMetricType, string> = {
      [TenantMetricType.USER_COUNT]: "users",
      [TenantMetricType.JAMAAH_COUNT]: "jamaah",
      [TenantMetricType.REVENUE]: "IDR",
      [TenantMetricType.ACTIVITY_SCORE]: "/100",
      [TenantMetricType.ERROR_COUNT]: "errors",
      [TenantMetricType.API_CALLS]: "calls",
      [TenantMetricType.STORAGE_USED]: "MB",
      [TenantMetricType.ACTIVE_SESSIONS]: "sessions",
    };

    const unit = units[this.metricType] || "";

    if (this.metricType === TenantMetricType.REVENUE) {
      return `Rp ${this.value.toLocaleString("id-ID")}`;
    }

    if (this.metricType === TenantMetricType.STORAGE_USED) {
      return `${(this.value / 1024).toFixed(2)} GB`;
    }

    return `${this.value.toFixed(0)} ${unit}`;
  }

  /**
   * Get metric color for UI display
   */
  getMetricColor(): "green" | "yellow" | "red" | "blue" {
    if (this.metricType === TenantMetricType.ERROR_COUNT) {
      if (this.value > 100) return "red";
      if (this.value > 50) return "yellow";
      return "green";
    }

    if (this.metricType === TenantMetricType.ACTIVITY_SCORE) {
      if (this.value >= 70) return "green";
      if (this.value >= 40) return "yellow";
      return "red";
    }

    return "blue";
  }

  /**
   * Check if metric exceeds warning threshold
   */
  exceedsThreshold(threshold: number): boolean {
    return this.value > threshold;
  }

  /**
   * Aggregate metrics by time period
   */
  static aggregateByPeriod(
    metrics: TenantMetrics[],
    period: "hour" | "day" | "week" | "month",
  ): Map<string, TenantMetrics> {
    const grouped = new Map<string, TenantMetrics[]>();

    metrics.forEach((metric) => {
      const key = this.getPeriodKey(metric.recordedAt, period);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    });

    const aggregated = new Map<string, TenantMetrics>();
    grouped.forEach((metricGroup, key) => {
      const sum = metricGroup.reduce((acc, m) => acc + m.value, 0);
      const avg = sum / metricGroup.length;

      aggregated.set(
        key,
        new TenantMetrics(
          metricGroup[0].tenantId,
          metricGroup[0].metricType,
          avg,
          { period, aggregated: true, count: metricGroup.length },
          metricGroup[0].recordedAt,
        ),
      );
    });

    return aggregated;
  }

  private static getPeriodKey(
    date: Date,
    period: "hour" | "day" | "week" | "month",
  ): string {
    const d = new Date(date);

    switch (period) {
      case "hour":
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;
      case "day":
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      case "week":
        const weekNum = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${weekNum}`;
      case "month":
        return `${d.getFullYear()}-${d.getMonth() + 1}`;
      default:
        return date.toISOString();
    }
  }
}
