/**
 * Epic 11, Story 11.3 & 11.6: Pipeline Analytics Service
 * Calculate pipeline potential and funnel visualization
 */

import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, Between } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import {
  PipelineAnalytics,
  PipelineCalculator,
  PIPELINE_STATUSES,
  KANBAN_COLUMNS,
  KanbanColumn,
  KanbanCard,
} from "../domain/pipeline-analytics";
import { PipelineAnalyticsQueryDto } from "../dto/pipeline-analytics-query.dto";

@Injectable()
export class PipelineAnalyticsService {
  constructor(
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  /**
   * Calculate pipeline analytics
   */
  async calculatePipelineAnalytics(
    tenantId: string,
    filters?: PipelineAnalyticsQueryDto,
  ): Promise<PipelineAnalytics> {
    const cacheKey = `tenant:${tenantId}:analytics:pipeline:${JSON.stringify(filters)}`;

    // Try cache (15 minutes TTL)
    const cached = await this.cacheManager.get<PipelineAnalytics>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build query
    const whereConditions: any = {
      tenant_id: tenantId,
    };

    if (filters?.agentIds?.length) {
      whereConditions.agent_id = In(filters.agentIds);
    }

    if (filters?.packageIds?.length) {
      whereConditions.package_id = In(filters.packageIds);
    }

    if (filters?.statuses?.length) {
      whereConditions.status = In(filters.statuses);
    } else {
      // Default to pipeline statuses only
      whereConditions.status = In(PIPELINE_STATUSES);
    }

    if (filters?.startDate && filters?.endDate) {
      whereConditions.created_at = Between(
        new Date(filters.startDate),
        new Date(filters.endDate),
      );
    }

    // Get jamaah data
    const jamaahList = await this.jamaahRepository.find({
      where: whereConditions,
      relations: ["package", "agent"],
    });

    // Calculate metrics
    const jamaahData = jamaahList.map((j) => ({
      status: j.status,
      packagePrice: Number(j.package?.retail_price || 0),
      agentId: j.agent_id,
      agentName: j.agent?.fullName || "Unknown",
      packageId: j.package_id,
      packageName: j.package?.name || "Unknown",
    }));

    const totalPotential =
      PipelineCalculator.calculateTotalPotential(jamaahData);
    const weightedPotential =
      PipelineCalculator.calculateWeightedPotential(jamaahData);
    const breakdown = PipelineCalculator.calculateBreakdown(jamaahData);
    const funnel = PipelineCalculator.calculateFunnelConversions(breakdown);
    const byAgent = PipelineCalculator.groupByAgent(jamaahData);
    const byPackage = PipelineCalculator.groupByPackage(jamaahData);

    const analytics: PipelineAnalytics = {
      totalPotential,
      weightedPotential,
      jamaahCount: jamaahList.length,
      breakdown,
      funnel,
      byAgent,
      byPackage,
    };

    // Cache for 15 minutes
    await this.cacheManager.set(cacheKey, analytics, 900000);

    return analytics;
  }

  /**
   * Get kanban board data
   */
  async getKanbanBoard(
    tenantId: string,
    filters?: PipelineAnalyticsQueryDto,
  ): Promise<KanbanColumn[]> {
    // Build query
    const whereConditions: any = {
      tenant_id: tenantId,
    };

    if (filters?.agentIds?.length) {
      whereConditions.agent_id = In(filters.agentIds);
    }

    if (filters?.packageIds?.length) {
      whereConditions.package_id = In(filters.packageIds);
    }

    if (filters?.startDate && filters?.endDate) {
      whereConditions.created_at = Between(
        new Date(filters.startDate),
        new Date(filters.endDate),
      );
    }

    // Get all jamaah (including fully_paid)
    const jamaahList = await this.jamaahRepository.find({
      where: whereConditions,
      relations: ["package", "agent"],
      order: { created_at: "DESC" },
    });

    // Group by status
    const columns: KanbanColumn[] = KANBAN_COLUMNS.map((columnDef) => {
      const jamaahInStatus = jamaahList.filter(
        (j) => j.status === columnDef.status,
      );

      const jamaahCards: KanbanCard[] = jamaahInStatus.map((jamaah) => {
        const packagePrice = Number(jamaah.package?.retail_price || 0);

        return {
          jamaahId: jamaah.id,
          jamaahName: jamaah.full_name,
          packageName: jamaah.package?.name || "Unknown Package",
          packagePrice,
          agentName: jamaah.agent?.fullName || "Unknown Agent",
          status: jamaah.status,
          createdAt: jamaah.created_at,
          lastUpdated: jamaah.updated_at,
          daysSinceCreated: PipelineCalculator.calculateDaysSince(
            jamaah.created_at,
          ),
          metadata: {
            email: jamaah.email,
            phone: jamaah.phone,
            paymentProgress: 0, // TODO: Calculate from payments
          },
        };
      });

      const totalValue = jamaahCards.reduce(
        (sum, card) => sum + card.packagePrice,
        0,
      );

      return {
        status: columnDef.status,
        label: columnDef.label,
        jamaahCards,
        count: jamaahCards.length,
        totalValue,
        color: columnDef.color,
      };
    });

    return columns;
  }

  /**
   * Invalidate pipeline cache (called on jamaah status change)
   */
  async invalidateCache(tenantId: string): Promise<void> {
    // Delete all pipeline cache keys for this tenant
    const pattern = `tenant:${tenantId}:analytics:pipeline:*`;
    // Note: In production, use Redis SCAN for pattern matching
    await this.cacheManager.del(pattern);
  }
}
