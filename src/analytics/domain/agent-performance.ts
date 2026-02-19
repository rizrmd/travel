/**
 * Epic 11, Story 11.4 & 11.5: Agent Performance Domain Model
 * Business logic for agent performance analytics and leaderboards
 */

export interface AgentPerformanceMetrics {
  agentId: string;
  agentName: string;
  period: string;
  conversionRate: number;
  averageDealSize: number;
  jamaahCount: number;
  revenueGenerated: number;
  trend: PerformanceTrend[];
  achievements: Achievement[];
  ranking: number | null;
}

export interface PerformanceTrend {
  date: Date;
  conversionRate: number;
  revenue: number;
  jamaahCount: number;
}

export enum AchievementType {
  FIRST_SALE = "first_sale",
  MILESTONE_10 = "milestone_10",
  MILESTONE_50 = "milestone_50",
  MILESTONE_100 = "milestone_100",
  TOP_PERFORMER = "top_performer",
  MONTHLY_WINNER = "monthly_winner",
  QUARTERLY_WINNER = "quarterly_winner",
  YEARLY_WINNER = "yearly_winner",
  CONVERSION_MASTER = "conversion_master", // >80% conversion
  REVENUE_CHAMPION = "revenue_champion", // Top revenue
}

export interface Achievement {
  type: AchievementType;
  title: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  agentId: string;
  agentName: string;
  agentEmail: string;
  score: number;
  badge: LeaderboardBadge | null;
  metrics: {
    revenue: number;
    jamaahCount: number;
    conversionRate: number;
  };
  change: number; // Rank change from previous period
}

export enum LeaderboardBadge {
  GOLD = "gold",
  SILVER = "silver",
  BRONZE = "bronze",
}

export enum LeaderboardMetric {
  REVENUE = "revenue",
  JAMAAH_COUNT = "jamaah_count",
  CONVERSION_RATE = "conversion_rate",
}

export enum LeaderboardPeriod {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

export class AgentPerformanceCalculator {
  /**
   * Calculate conversion rate
   * Formula: (fully_paid_count / total_jamaah_count) * 100
   */
  static calculateConversionRate(
    fullyPaidCount: number,
    totalJamaahCount: number,
  ): number {
    if (totalJamaahCount === 0) return 0;
    return (fullyPaidCount / totalJamaahCount) * 100;
  }

  /**
   * Calculate average deal size
   * Formula: total_revenue / fully_paid_count
   */
  static calculateAverageDealSize(
    totalRevenue: number,
    fullyPaidCount: number,
  ): number {
    if (fullyPaidCount === 0) return 0;
    return totalRevenue / fullyPaidCount;
  }

  /**
   * Determine achievements based on performance
   */
  static determineAchievements(
    metrics: AgentPerformanceMetrics,
    previousAchievements: Achievement[],
  ): Achievement[] {
    const newAchievements: Achievement[] = [...previousAchievements];
    const existingTypes = new Set(previousAchievements.map((a) => a.type));

    // First sale
    if (
      metrics.jamaahCount >= 1 &&
      !existingTypes.has(AchievementType.FIRST_SALE)
    ) {
      newAchievements.push({
        type: AchievementType.FIRST_SALE,
        title: "Penjualan Pertama",
        description: "Berhasil mendapatkan jamaah pertama",
        earnedAt: new Date(),
        icon: "🎯",
      });
    }

    // Milestones
    const milestones = [
      {
        count: 10,
        type: AchievementType.MILESTONE_10,
        title: "10 Jamaah",
        icon: "🌟",
      },
      {
        count: 50,
        type: AchievementType.MILESTONE_50,
        title: "50 Jamaah",
        icon: "⭐",
      },
      {
        count: 100,
        type: AchievementType.MILESTONE_100,
        title: "100 Jamaah",
        icon: "💫",
      },
    ];

    milestones.forEach((milestone) => {
      if (
        metrics.jamaahCount >= milestone.count &&
        !existingTypes.has(milestone.type)
      ) {
        newAchievements.push({
          type: milestone.type,
          title: milestone.title,
          description: `Mencapai ${milestone.count} jamaah`,
          earnedAt: new Date(),
          icon: milestone.icon,
        });
      }
    });

    // Conversion master
    if (
      metrics.conversionRate >= 80 &&
      !existingTypes.has(AchievementType.CONVERSION_MASTER)
    ) {
      newAchievements.push({
        type: AchievementType.CONVERSION_MASTER,
        title: "Master Konversi",
        description: "Tingkat konversi di atas 80%",
        earnedAt: new Date(),
        icon: "🏆",
      });
    }

    return newAchievements;
  }

  /**
   * Assign badges based on ranking
   */
  static assignBadge(rank: number): LeaderboardBadge | null {
    if (rank === 1) return LeaderboardBadge.GOLD;
    if (rank === 2) return LeaderboardBadge.SILVER;
    if (rank === 3) return LeaderboardBadge.BRONZE;
    return null;
  }

  /**
   * Calculate rank change
   */
  static calculateRankChange(
    currentRank: number,
    previousRank: number | null,
  ): number {
    if (previousRank === null) return 0;
    // Positive means improvement (moved up)
    return previousRank - currentRank;
  }

  /**
   * Sort leaderboard entries by metric
   */
  static sortByMetric(
    entries: LeaderboardEntry[],
    metric: LeaderboardMetric,
  ): LeaderboardEntry[] {
    return entries.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (metric) {
        case LeaderboardMetric.REVENUE:
          aValue = a.metrics.revenue;
          bValue = b.metrics.revenue;
          break;
        case LeaderboardMetric.JAMAAH_COUNT:
          aValue = a.metrics.jamaahCount;
          bValue = b.metrics.jamaahCount;
          break;
        case LeaderboardMetric.CONVERSION_RATE:
          aValue = a.metrics.conversionRate;
          bValue = b.metrics.conversionRate;
          break;
        default:
          return 0;
      }

      return bValue - aValue; // Descending order
    });
  }

  /**
   * Get period date range
   */
  static getPeriodDateRange(period: LeaderboardPeriod): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case LeaderboardPeriod.MONTHLY:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;

      case LeaderboardPeriod.QUARTERLY:
        const quarter = Math.floor(now.getMonth() / 3);
        start.setMonth(quarter * 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(quarter * 3 + 3);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;

      case LeaderboardPeriod.YEARLY:
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }
}
