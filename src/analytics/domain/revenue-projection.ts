/**
 * Epic 11, Story 11.2: Revenue Projection Domain Model
 * Algorithm for revenue projection with confidence intervals
 */

export interface ProjectionAssumptions {
  conversionRate?: number; // Default: 0.3 (30%)
  paymentCompletionRate?: number; // Default: 0.9 (90%)
  historicalWeight?: number; // Default: 0.7 (70%)
  pendingWeight?: number; // Default: 0.9 (90%)
  pipelineWeight?: number; // Default: 0.3 (30%)
}

export interface RevenueProjection {
  months: number;
  projectedRevenue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  breakdown: {
    historicalComponent: number;
    pendingInstallmentsComponent: number;
    pipelinePotentialComponent: number;
  };
  assumptions: Required<ProjectionAssumptions>;
  monthlyProjections: MonthlyProjection[];
}

export interface MonthlyProjection {
  month: number;
  monthName: string;
  projectedRevenue: number;
  confidence: {
    lower: number;
    upper: number;
  };
}

export interface HistoricalData {
  totalRevenue: number;
  months: number;
  averageMonthlyRevenue: number;
  trend: number; // Growth rate
}

export class RevenueProjector {
  private static readonly DEFAULT_ASSUMPTIONS: Required<ProjectionAssumptions> =
    {
      conversionRate: 0.3,
      paymentCompletionRate: 0.9,
      historicalWeight: 0.7,
      pendingWeight: 0.9,
      pipelineWeight: 0.3,
    };

  /**
   * Main projection algorithm
   * Formula: (avg_monthly_revenue_last_3_months * 0.7) + (pending_installments * 0.9) + (pipeline_potential * 0.3)
   */
  static calculateProjection(
    historicalData: HistoricalData,
    pendingInstallments: number,
    pipelinePotential: number,
    months: number = 3,
    assumptions?: ProjectionAssumptions,
  ): RevenueProjection {
    const finalAssumptions = {
      ...this.DEFAULT_ASSUMPTIONS,
      ...assumptions,
    };

    // Calculate components
    const historicalComponent =
      historicalData.averageMonthlyRevenue * finalAssumptions.historicalWeight;
    const pendingComponent =
      pendingInstallments * finalAssumptions.pendingWeight;
    const pipelineComponent =
      pipelinePotential * finalAssumptions.pipelineWeight;

    // Calculate base monthly projection
    const baseMonthlyProjection =
      historicalComponent + pendingComponent + pipelineComponent;

    // Apply trend adjustment
    const trendAdjustedProjection = this.applyTrendAdjustment(
      baseMonthlyProjection,
      historicalData.trend,
      months,
    );

    // Calculate total projection
    const totalProjection = trendAdjustedProjection.reduce(
      (sum, p) => sum + p,
      0,
    );

    // Calculate confidence interval
    const confidenceInterval = this.calculateConfidenceInterval(
      totalProjection,
      historicalData,
    );

    // Generate monthly projections
    const monthlyProjections = this.generateMonthlyProjections(
      trendAdjustedProjection,
      confidenceInterval.lower,
      confidenceInterval.upper,
    );

    return {
      months,
      projectedRevenue: totalProjection,
      confidenceInterval,
      breakdown: {
        historicalComponent: historicalComponent * months,
        pendingInstallmentsComponent: pendingComponent * months,
        pipelinePotentialComponent: pipelineComponent * months,
      },
      assumptions: finalAssumptions,
      monthlyProjections,
    };
  }

  /**
   * Apply trend adjustment to projections
   */
  private static applyTrendAdjustment(
    baseProjection: number,
    trend: number,
    months: number,
  ): number[] {
    const projections: number[] = [];
    for (let i = 0; i < months; i++) {
      // Apply compound growth based on trend
      const adjusted = baseProjection * Math.pow(1 + trend, i);
      projections.push(adjusted);
    }
    return projections;
  }

  /**
   * Calculate confidence interval (85% - 115%)
   */
  private static calculateConfidenceInterval(
    projection: number,
    historicalData: HistoricalData,
  ): { lower: number; upper: number } {
    // Base interval
    let lowerMultiplier = 0.85;
    let upperMultiplier = 1.15;

    // Adjust based on data reliability
    if (historicalData.months < 3) {
      // Less historical data = wider interval
      lowerMultiplier = 0.75;
      upperMultiplier = 1.25;
    }

    return {
      lower: projection * lowerMultiplier,
      upper: projection * upperMultiplier,
    };
  }

  /**
   * Generate monthly projections with confidence intervals
   */
  private static generateMonthlyProjections(
    monthlyRevenues: number[],
    totalLower: number,
    totalUpper: number,
  ): MonthlyProjection[] {
    const totalProjected = monthlyRevenues.reduce((sum, r) => sum + r, 0);
    const monthNames = this.getNextMonthNames(monthlyRevenues.length);

    return monthlyRevenues.map((revenue, index) => {
      const proportion = revenue / totalProjected;
      return {
        month: index + 1,
        monthName: monthNames[index],
        projectedRevenue: revenue,
        confidence: {
          lower: totalLower * proportion,
          upper: totalUpper * proportion,
        },
      };
    });
  }

  /**
   * Get next N month names
   */
  private static getNextMonthNames(count: number): string[] {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const names: string[] = [];
    const currentMonth = new Date().getMonth();

    for (let i = 1; i <= count; i++) {
      const monthIndex = (currentMonth + i) % 12;
      names.push(monthNames[monthIndex]);
    }

    return names;
  }

  /**
   * Calculate historical average and trend
   */
  static analyzeHistoricalData(
    monthlyRevenues: Array<{ month: string; revenue: number }>,
  ): HistoricalData {
    const revenues = monthlyRevenues.map((m) => m.revenue);
    const total = revenues.reduce((sum, r) => sum + r, 0);
    const average = revenues.length > 0 ? total / revenues.length : 0;

    // Calculate trend using simple linear regression
    const trend = this.calculateTrend(revenues);

    return {
      totalRevenue: total,
      months: revenues.length,
      averageMonthlyRevenue: average,
      trend,
    };
  }

  /**
   * Calculate trend (growth rate) using linear regression
   */
  private static calculateTrend(revenues: number[]): number {
    if (revenues.length < 2) return 0;

    const n = revenues.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    const sumX = indices.reduce((sum, i) => sum + i, 0);
    const sumY = revenues.reduce((sum, r) => sum + r, 0);
    const sumXY = indices.reduce((sum, i) => sum + i * revenues[i], 0);
    const sumX2 = indices.reduce((sum, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgRevenue = sumY / n;

    // Convert slope to growth rate
    return avgRevenue > 0 ? slope / avgRevenue : 0;
  }
}
