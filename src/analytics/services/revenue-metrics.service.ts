/**
 * Epic 11, Story 11.1: Revenue Metrics Service
 * Calculate real-time revenue metrics with caching
 */

import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PaymentStatus } from "../../payments/domain/payment";
import {
  RevenueMetrics,
  RevenuePeriod,
  RevenueCalculator,
  PackageRevenue,
  AgentRevenue,
  RevenueTrend,
  PeriodComparison,
} from "../domain/revenue-metrics";

@Injectable()
export class RevenueMetricsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  /**
   * Get revenue metrics for a period
   */
  async getRevenueMetrics(
    tenantId: string,
    period: RevenuePeriod = RevenuePeriod.MONTH,
    customRange?: { start: Date; end: Date },
  ): Promise<RevenueMetrics> {
    const cacheKey = `tenant:${tenantId}:analytics:revenue:${period}`;

    // Try cache first (5 minutes TTL)
    const cached = await this.cacheManager.get<RevenueMetrics>(cacheKey);
    if (cached) {
      return cached;
    }

    const { start, end } = customRange || this.getPeriodRange(period);
    const previousRange = this.getPreviousPeriodRange(start, end);

    // Get current period payments
    const currentPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(start, end),
      },
      relations: ["package"],
    });

    // Get previous period payments for comparison
    const previousPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(previousRange.start, previousRange.end),
      },
    });

    // Calculate totals
    const total = currentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const previousPeriodTotal = previousPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const percentageChange = RevenueCalculator.calculatePercentageChange(
      total,
      previousPeriodTotal,
    );

    // Calculate breakdowns
    const breakdownByPackage = await this.getRevenueBreakdownByPackage(
      currentPayments,
      total,
    );
    const breakdownByAgent = await this.getRevenueBreakdownByAgent(
      currentPayments,
      total,
    );

    const metrics: RevenueMetrics = {
      total,
      period,
      previousPeriodTotal,
      percentageChange,
      breakdownByPackage,
      breakdownByAgent,
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, metrics, 300000);

    return metrics;
  }

  /**
   * Get revenue for today
   */
  async getTodayRevenue(tenantId: string): Promise<number> {
    const cacheKey = `tenant:${tenantId}:analytics:revenue:today`;
    const cached = await this.cacheManager.get<number>(cacheKey);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.tenant_id = :tenantId", { tenantId })
      .andWhere("payment.status = :status", {
        status: PaymentStatus.CONFIRMED,
      })
      .andWhere("payment.payment_date >= :start", { start: today })
      .andWhere("payment.payment_date < :end", { end: tomorrow })
      .getRawOne();

    const total = Number(result?.total || 0);

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, total, 300000);

    return total;
  }

  /**
   * Get revenue trend over time
   */
  async getRevenueTrend(
    tenantId: string,
    days: number = 30,
  ): Promise<RevenueTrend[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const payments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(startDate, endDate),
      },
    });

    // Group by date
    const trendMap = new Map<string, RevenueTrend>();

    payments.forEach((payment) => {
      const dateKey = payment.payment_date.toISOString().split("T")[0];

      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, {
          date: new Date(dateKey),
          revenue: 0,
          jamaahCount: 0,
          packageBreakdown: {},
        });
      }

      const trend = trendMap.get(dateKey)!;
      trend.revenue += Number(payment.amount);
      trend.jamaahCount += 1;

      const packageId = payment.package_id;
      trend.packageBreakdown[packageId] =
        (trend.packageBreakdown[packageId] || 0) + Number(payment.amount);
    });

    // Fill in missing dates with zero revenue
    const trends: RevenueTrend[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];

      if (trendMap.has(dateKey)) {
        trends.push(trendMap.get(dateKey)!);
      } else {
        trends.push({
          date: new Date(dateKey),
          revenue: 0,
          jamaahCount: 0,
          packageBreakdown: {},
        });
      }
    }

    return trends;
  }

  /**
   * Compare with previous period
   */
  async compareWithPreviousPeriod(
    tenantId: string,
    start: Date,
    end: Date,
  ): Promise<PeriodComparison> {
    const currentPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(start, end),
      },
    });

    const previousRange = this.getPreviousPeriodRange(start, end);
    const previousPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(previousRange.start, previousRange.end),
      },
    });

    const currentPeriod = currentPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const previousPeriod = previousPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const difference = currentPeriod - previousPeriod;
    const percentageChange = RevenueCalculator.calculatePercentageChange(
      currentPeriod,
      previousPeriod,
    );
    const trend = RevenueCalculator.determineTrend(percentageChange);

    return {
      currentPeriod,
      previousPeriod,
      difference,
      percentageChange,
      trend,
    };
  }

  /**
   * Get revenue breakdown by package
   */
  private async getRevenueBreakdownByPackage(
    payments: any[],
    total: number,
  ): Promise<PackageRevenue[]> {
    const packageMap = new Map<
      string,
      { name: string; revenue: number; count: number }
    >();

    payments.forEach((payment) => {
      const packageId = payment.package_id;
      const packageName = payment.package?.name || "Unknown Package";

      if (!packageMap.has(packageId)) {
        packageMap.set(packageId, { name: packageName, revenue: 0, count: 0 });
      }

      const pkg = packageMap.get(packageId)!;
      pkg.revenue += Number(payment.amount);
      pkg.count += 1;
    });

    const breakdown: PackageRevenue[] = Array.from(packageMap.entries()).map(
      ([packageId, data]) => ({
        packageId,
        packageName: data.name,
        revenue: data.revenue,
        percentage: total > 0 ? (data.revenue / total) * 100 : 0,
        jamaahCount: data.count,
      }),
    );

    // Sort by revenue descending
    return breakdown.sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Get revenue breakdown by agent
   */
  private async getRevenueBreakdownByAgent(
    payments: any[],
    total: number,
  ): Promise<AgentRevenue[]> {
    // Get jamaah data for agent information
    const jamaahIds = [...new Set(payments.map((p) => p.jamaah_id))];

    // Get jamaah with agent info
    const { JamaahEntity } =
      await import("../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity");
    const { getRepository } = await import("typeorm");
    const jamaahRepo = getRepository(JamaahEntity);

    const jamaahList = await jamaahRepo.find({
      where: jamaahIds.map((id) => ({ id })),
      relations: ["agent"],
    });

    const jamaahAgentMap = new Map(
      jamaahList.map((j) => [
        j.id,
        { id: j.agent_id, name: j.agent?.fullName || "Unknown" },
      ]),
    );

    const agentMap = new Map<
      string,
      { name: string; revenue: number; count: number }
    >();

    payments.forEach((payment) => {
      const agentData = jamaahAgentMap.get(payment.jamaah_id);
      if (!agentData) return;

      const agentId = agentData.id;
      const agentName = agentData.name;

      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, { name: agentName, revenue: 0, count: 0 });
      }

      const agent = agentMap.get(agentId)!;
      agent.revenue += Number(payment.amount);
      agent.count += 1;
    });

    const breakdown: AgentRevenue[] = Array.from(agentMap.entries()).map(
      ([agentId, data]) => ({
        agentId,
        agentName: data.name,
        revenue: data.revenue,
        percentage: total > 0 ? (data.revenue / total) * 100 : 0,
        jamaahCount: data.count,
      }),
    );

    // Sort by revenue descending
    return breakdown.sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Get period date range
   */
  private getPeriodRange(period: RevenuePeriod): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
      case RevenuePeriod.TODAY:
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case RevenuePeriod.WEEK:
        const dayOfWeek = now.getDay();
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case RevenuePeriod.MONTH:
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case RevenuePeriod.YEAR:
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  /**
   * Get previous period range
   */
  private getPreviousPeriodRange(
    start: Date,
    end: Date,
  ): { start: Date; end: Date } {
    const duration = end.getTime() - start.getTime();
    const previousEnd = new Date(start.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - duration);

    return { start: previousStart, end: previousEnd };
  }

  /**
   * Invalidate revenue cache (called on payment confirmation)
   */
  async invalidateCache(tenantId: string): Promise<void> {
    const keys = [
      `tenant:${tenantId}:analytics:revenue:today`,
      `tenant:${tenantId}:analytics:revenue:week`,
      `tenant:${tenantId}:analytics:revenue:month`,
      `tenant:${tenantId}:analytics:revenue:year`,
    ];

    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
