/**
 * Epic 11, Story 11.1: Revenue Metrics Domain Model
 * Business logic for revenue calculations
 */

export enum RevenuePeriod {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export interface RevenueMetrics {
  total: number;
  period: RevenuePeriod;
  previousPeriodTotal: number;
  percentageChange: number;
  breakdownByPackage: PackageRevenue[];
  breakdownByAgent: AgentRevenue[];
}

export interface PackageRevenue {
  packageId: string;
  packageName: string;
  revenue: number;
  percentage: number;
  jamaahCount: number;
}

export interface AgentRevenue {
  agentId: string;
  agentName: string;
  revenue: number;
  percentage: number;
  jamaahCount: number;
}

export interface RevenueTrend {
  date: Date;
  revenue: number;
  jamaahCount: number;
  packageBreakdown: Record<string, number>;
}

export interface PeriodComparison {
  currentPeriod: number;
  previousPeriod: number;
  difference: number;
  percentageChange: number;
  trend: "up" | "down" | "stable";
}

export class RevenueCalculator {
  /**
   * Calculate percentage change between two periods
   */
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }

  /**
   * Determine trend direction
   */
  static determineTrend(percentageChange: number): "up" | "down" | "stable" {
    if (percentageChange > 5) return "up";
    if (percentageChange < -5) return "down";
    return "stable";
  }

  /**
   * Calculate breakdown percentages
   */
  static calculateBreakdownPercentages<T extends { revenue: number }>(
    items: T[],
    totalRevenue: number,
  ): (T & { percentage: number })[] {
    return items.map((item) => ({
      ...item,
      percentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
    }));
  }

  /**
   * Aggregate revenue by period
   */
  static aggregateByPeriod(
    payments: Array<{ amount: number; payment_date: Date }>,
    period: RevenuePeriod,
  ): Map<string, number> {
    const aggregated = new Map<string, number>();

    payments.forEach((payment) => {
      const key = this.getPeriodKey(payment.payment_date, period);
      const current = aggregated.get(key) || 0;
      aggregated.set(key, current + Number(payment.amount));
    });

    return aggregated;
  }

  /**
   * Get period key for aggregation
   */
  private static getPeriodKey(date: Date, period: RevenuePeriod): string {
    const d = new Date(date);
    switch (period) {
      case RevenuePeriod.TODAY:
        return d.toISOString().split("T")[0];
      case RevenuePeriod.WEEK:
        const weekNum = this.getWeekNumber(d);
        return `${d.getFullYear()}-W${weekNum}`;
      case RevenuePeriod.MONTH:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      case RevenuePeriod.YEAR:
        return `${d.getFullYear()}`;
      default:
        return d.toISOString().split("T")[0];
    }
  }

  /**
   * Get ISO week number
   */
  private static getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return weekNo;
  }
}
