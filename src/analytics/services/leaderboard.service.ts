/**
 * Epic 11, Story 11.5: Leaderboard Service
 * Calculate and manage agent leaderboards
 */

import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PaymentStatus } from "../../payments/domain/payment";
import { JamaahStatus } from "../../jamaah/domain/jamaah";
import {
  LeaderboardEntry,
  LeaderboardMetric,
  LeaderboardPeriod,
  AgentPerformanceCalculator,
} from "../domain/agent-performance";

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    tenantId: string,
    metric: LeaderboardMetric = LeaderboardMetric.REVENUE,
    period: LeaderboardPeriod = LeaderboardPeriod.MONTHLY,
  ): Promise<LeaderboardEntry[]> {
    const cacheKey = `tenant:${tenantId}:analytics:leaderboard:${metric}:${period}`;

    // Try cache (1 hour TTL)
    const cached = await this.cacheManager.get<LeaderboardEntry[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const { start, end } =
      AgentPerformanceCalculator.getPeriodDateRange(period);

    // Get all jamaah in period
    const jamaahList = await this.jamaahRepository.find({
      where: {
        tenant_id: tenantId,
        created_at: Between(start, end),
      },
      relations: ["agent"],
    });

    // Group by agent
    const agentMap = new Map<
      string,
      {
        name: string;
        email: string;
        jamaahCount: number;
        fullyPaidCount: number;
        jamaahIds: string[];
      }
    >();

    jamaahList.forEach((jamaah) => {
      const agentId = jamaah.agent_id;
      const agentName = jamaah.agent?.fullName || "Unknown";
      const agentEmail = jamaah.agent?.email || "";

      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          name: agentName,
          email: agentEmail,
          jamaahCount: 0,
          fullyPaidCount: 0,
          jamaahIds: [],
        });
      }

      const agent = agentMap.get(agentId)!;
      agent.jamaahCount++;
      agent.jamaahIds.push(jamaah.id);

      if (jamaah.status === JamaahStatus.FULLY_PAID) {
        agent.fullyPaidCount++;
      }
    });

    // Get revenue for each agent
    const entries: LeaderboardEntry[] = [];

    for (const [agentId, agentData] of agentMap.entries()) {
      const payments =
        agentData.jamaahIds.length > 0
          ? await this.paymentRepository.find({
            where: {
              tenant_id: tenantId,
              jamaah_id: In(agentData.jamaahIds),
              status: PaymentStatus.CONFIRMED,
            },
          })
          : [];

      const revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      const conversionRate = AgentPerformanceCalculator.calculateConversionRate(
        agentData.fullyPaidCount,
        agentData.jamaahCount,
      );

      // Determine score based on metric
      let score: number;
      switch (metric) {
        case LeaderboardMetric.REVENUE:
          score = revenue;
          break;
        case LeaderboardMetric.JAMAAH_COUNT:
          score = agentData.jamaahCount;
          break;
        case LeaderboardMetric.CONVERSION_RATE:
          score = conversionRate;
          break;
        default:
          score = revenue;
      }

      entries.push({
        rank: 0, // Will be set after sorting
        agentId,
        agentName: agentData.name,
        agentEmail: agentData.email,
        score,
        badge: null, // Will be set after sorting
        metrics: {
          revenue,
          jamaahCount: agentData.jamaahCount,
          conversionRate,
        },
        change: 0, // TODO: Calculate from previous period
      });
    }

    // Sort by metric
    const sortedEntries = AgentPerformanceCalculator.sortByMetric(
      entries,
      metric,
    );

    // Assign ranks and badges
    sortedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
      entry.badge = AgentPerformanceCalculator.assignBadge(entry.rank);
    });

    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, sortedEntries, 3600000);

    return sortedEntries;
  }

  /**
   * Get period label
   */
  getPeriodLabel(period: LeaderboardPeriod): string {
    const now = new Date();
    const { start, end } =
      AgentPerformanceCalculator.getPeriodDateRange(period);

    switch (period) {
      case LeaderboardPeriod.MONTHLY:
        return `${this.getMonthName(start.getMonth())} ${start.getFullYear()}`;
      case LeaderboardPeriod.QUARTERLY:
        const quarter = Math.floor(start.getMonth() / 3) + 1;
        return `Q${quarter} ${start.getFullYear()}`;
      case LeaderboardPeriod.YEARLY:
        return `${start.getFullYear()}`;
      default:
        return `${start.toISOString().split("T")[0]} - ${end.toISOString().split("T")[0]}`;
    }
  }

  private getMonthName(month: number): string {
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
    return monthNames[month];
  }

  /**
   * Invalidate leaderboard cache
   */
  async invalidateCache(tenantId: string): Promise<void> {
    const metrics = Object.values(LeaderboardMetric);
    const periods = Object.values(LeaderboardPeriod);

    const keys: string[] = [];
    metrics.forEach((metric) => {
      periods.forEach((period) => {
        keys.push(
          `tenant:${tenantId}:analytics:leaderboard:${metric}:${period}`,
        );
      });
    });

    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
