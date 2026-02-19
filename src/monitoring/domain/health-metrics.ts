/**
 * Domain Model: Health Metrics
 *
 * Business logic for system health calculation and monitoring
 */

export enum MetricType {
  API_LATENCY_P95 = "api_latency_p95",
  DB_QUERY_TIME_AVG = "db_query_time_avg",
  REDIS_HIT_RATE = "redis_hit_rate",
  QUEUE_LENGTH = "queue_length",
  CPU_USAGE = "cpu_usage",
  MEMORY_USAGE = "memory_usage",
  DISK_USAGE = "disk_usage",
  ACTIVE_CONNECTIONS = "active_connections",
}

export enum HealthStatus {
  HEALTHY = "green",
  DEGRADED = "yellow",
  CRITICAL = "red",
}

export interface MetricMetadata {
  source?: string;
  threshold?: number;
  tags?: Record<string, string>;
  [key: string]: any;
}

export class HealthMetrics {
  constructor(
    public readonly metricType: MetricType,
    public readonly value: number,
    public readonly metadata: MetricMetadata = {},
    public readonly recordedAt: Date = new Date(),
  ) {}

  /**
   * Determine health status based on metric value and thresholds
   */
  getHealthStatus(): HealthStatus {
    const thresholds = this.getThresholds();

    if (this.value >= thresholds.critical) {
      return HealthStatus.CRITICAL;
    } else if (this.value >= thresholds.warning) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }

  /**
   * Get threshold values for each metric type
   */
  private getThresholds() {
    const thresholdMap: Record<
      MetricType,
      { warning: number; critical: number }
    > = {
      [MetricType.API_LATENCY_P95]: { warning: 500, critical: 1000 }, // ms
      [MetricType.DB_QUERY_TIME_AVG]: { warning: 100, critical: 300 }, // ms
      [MetricType.REDIS_HIT_RATE]: { warning: 70, critical: 50 }, // % (lower is worse)
      [MetricType.QUEUE_LENGTH]: { warning: 100, critical: 500 }, // jobs
      [MetricType.CPU_USAGE]: { warning: 70, critical: 90 }, // %
      [MetricType.MEMORY_USAGE]: { warning: 80, critical: 95 }, // %
      [MetricType.DISK_USAGE]: { warning: 80, critical: 90 }, // %
      [MetricType.ACTIVE_CONNECTIONS]: { warning: 800, critical: 950 }, // connections
    };

    return thresholdMap[this.metricType] || { warning: 80, critical: 95 };
  }

  /**
   * Calculate trend compared to previous value
   */
  calculateTrend(previousValue: number): {
    direction: "up" | "down" | "stable";
    percentage: number;
  } {
    if (previousValue === 0) {
      return { direction: "stable", percentage: 0 };
    }

    const change = ((this.value - previousValue) / previousValue) * 100;

    if (Math.abs(change) < 5) {
      return { direction: "stable", percentage: change };
    }

    return {
      direction: change > 0 ? "up" : "down",
      percentage: Math.abs(change),
    };
  }

  /**
   * Check if metric is within acceptable range
   */
  isHealthy(): boolean {
    return this.getHealthStatus() === HealthStatus.HEALTHY;
  }

  /**
   * Format value with appropriate unit
   */
  getFormattedValue(): string {
    const units: Record<MetricType, string> = {
      [MetricType.API_LATENCY_P95]: "ms",
      [MetricType.DB_QUERY_TIME_AVG]: "ms",
      [MetricType.REDIS_HIT_RATE]: "%",
      [MetricType.QUEUE_LENGTH]: "jobs",
      [MetricType.CPU_USAGE]: "%",
      [MetricType.MEMORY_USAGE]: "%",
      [MetricType.DISK_USAGE]: "%",
      [MetricType.ACTIVE_CONNECTIONS]: "connections",
    };

    const unit = units[this.metricType] || "";
    const formattedValue = this.value.toFixed(2);

    return `${formattedValue}${unit}`;
  }

  /**
   * Aggregate multiple metrics of same type
   */
  static aggregate(metrics: HealthMetrics[]): HealthMetrics | null {
    if (metrics.length === 0) return null;

    const metricType = metrics[0].metricType;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    const average = sum / metrics.length;

    return new HealthMetrics(
      metricType,
      average,
      { aggregated: true, count: metrics.length },
      new Date(),
    );
  }
}
