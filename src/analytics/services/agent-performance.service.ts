/**
 * Epic 11, Story 11.4: Agent Performance Service
 * Calculate agent performance metrics and trends
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PaymentStatus } from "../../payments/domain/payment";
import { JamaahStatus } from "../../jamaah/domain/jamaah";
import {
  AgentPerformanceMetrics,
  AgentPerformanceCalculator,
  PerformanceTrend,
  Achievement,
} from "../domain/agent-performance";

@Injectable()
export class AgentPerformanceService {
  constructor(
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) { }

  /**
   * Get agent performance metrics
   */
  async getAgentPerformance(
    tenantId: string,
    agentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AgentPerformanceMetrics> {
    const start = startDate || this.getDefaultStartDate();
    const end = endDate || new Date();

    // Get all jamaah for this agent
    const whereConditions: any = {
      tenant_id: tenantId,
      agent_id: agentId,
      created_at: Between(start, end),
    };

    const allJamaah = await this.jamaahRepository.find({
      where: whereConditions,
      relations: ["agent"],
    });

    const totalJamaahCount = allJamaah.length;
    const fullyPaidCount = allJamaah.filter(
      (j) => j.status === JamaahStatus.FULLY_PAID,
    ).length;

    // Get payments for revenue calculation
    const jamaahIds = allJamaah.map((j) => j.id);
    const payments =
      jamaahIds.length > 0
        ? await this.paymentRepository.find({
          where: {
            tenant_id: tenantId,
            jamaah_id: In(jamaahIds),
            status: PaymentStatus.CONFIRMED,
          },
        })
        : [];

    const revenueGenerated = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    // Calculate metrics
    const conversionRate = AgentPerformanceCalculator.calculateConversionRate(
      fullyPaidCount,
      totalJamaahCount,
    );

    const averageDealSize = AgentPerformanceCalculator.calculateAverageDealSize(
      revenueGenerated,
      fullyPaidCount,
    );

    // Get performance trend
    const trend = await this.getPerformanceTrend(tenantId, agentId, start, end);

    // Get achievements (placeholder - would be stored in DB)
    const achievements: Achievement[] = [];

    // Get agent name
    const agentName = allJamaah[0]?.agent?.fullName || "Unknown Agent";

    // Get ranking (placeholder)
    const ranking = null;

    const periodLabel = this.formatPeriodLabel(start, end);

    return {
      agentId,
      agentName,
      period: periodLabel,
      conversionRate,
      averageDealSize,
      jamaahCount: totalJamaahCount,
      revenueGenerated,
      trend,
      achievements,
      ranking,
    };
  }

  /**
   * Get performance trend over time
   */
  private async getPerformanceTrend(
    tenantId: string,
    agentId: string,
    start: Date,
    end: Date,
  ): Promise<PerformanceTrend[]> {
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Group by week
    const weekCount = Math.ceil(days / 7);
    const trends: PerformanceTrend[] = [];

    for (let i = 0; i < weekCount; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (weekEnd > end) {
        weekEnd.setTime(end.getTime());
      }

      const jamaahInWeek = await this.jamaahRepository.find({
        where: {
          tenant_id: tenantId,
          agent_id: agentId,
          created_at: Between(weekStart, weekEnd),
        },
      });

      const totalCount = jamaahInWeek.length;
      const fullyPaidCount = jamaahInWeek.filter(
        (j) => j.status === JamaahStatus.FULLY_PAID,
      ).length;

      const jamaahIds = jamaahInWeek.map((j) => j.id);
      const payments =
        jamaahIds.length > 0
          ? await this.paymentRepository.find({
            where: {
              tenant_id: tenantId,
              jamaah_id: In(jamaahIds),
              status: PaymentStatus.CONFIRMED,
            },
          })
          : [];

      const revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

      const conversionRate = AgentPerformanceCalculator.calculateConversionRate(
        fullyPaidCount,
        totalCount,
      );

      trends.push({
        date: weekStart,
        conversionRate,
        revenue,
        jamaahCount: totalCount,
      });
    }

    return trends;
  }

  /**
   * Export performance to PDF (placeholder)
   */
  async exportToPDF(
    tenantId: string,
    agentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Buffer> {
    // TODO: Implement PDF generation with Puppeteer or PDFKit
    const metrics = await this.getAgentPerformance(
      tenantId,
      agentId,
      startDate,
      endDate,
    );

    // Placeholder: return empty buffer
    return Buffer.from(JSON.stringify(metrics, null, 2));
  }

  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  private formatPeriodLabel(start: Date, end: Date): string {
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    return `${startStr} - ${endStr}`;
  }
}

// Import fix for In operator
import { In } from "typeorm";
