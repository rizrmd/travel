/**
 * Epic 11: Analytics Controller
 * Main analytics endpoints for operational intelligence dashboard
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { RevenueMetricsService } from "./services/revenue-metrics.service";
import { RevenueProjectionService } from "./services/revenue-projection.service";
import { PipelineAnalyticsService } from "./services/pipeline-analytics.service";
import { AgentPerformanceService } from "./services/agent-performance.service";
import { LeaderboardService } from "./services/leaderboard.service";
import { AnalyticsEventService } from "./services/analytics-event.service";
import { RevenueMetricsQueryDto } from "./dto/revenue-metrics-query.dto";
import {
  RevenueMetricsResponseDto,
  RevenueTrendResponseDto,
} from "./dto/revenue-metrics-response.dto";
import { RevenueProjectionQueryDto } from "./dto/revenue-projection-query.dto";
import { RevenueProjectionResponseDto } from "./dto/revenue-projection-response.dto";
import { PipelineAnalyticsQueryDto } from "./dto/pipeline-analytics-query.dto";
import {
  PipelineAnalyticsResponseDto,
  KanbanBoardResponseDto,
} from "./dto/pipeline-analytics-response.dto";
import { AgentPerformanceQueryDto } from "./dto/agent-performance-query.dto";
import { AgentPerformanceResponseDto } from "./dto/agent-performance-response.dto";
import { LeaderboardQueryDto } from "./dto/leaderboard-query.dto";
import { LeaderboardResponseDto } from "./dto/leaderboard-response.dto";
import { DashboardSummaryResponseDto } from "./dto/dashboard-summary-response.dto";

@ApiTags("Analytics")
@Controller("analytics")
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class AnalyticsController {
  constructor(
    private readonly revenueMetricsService: RevenueMetricsService,
    private readonly revenueProjectionService: RevenueProjectionService,
    private readonly pipelineAnalyticsService: PipelineAnalyticsService,
    private readonly agentPerformanceService: AgentPerformanceService,
    private readonly leaderboardService: LeaderboardService,
    private readonly analyticsEventService: AnalyticsEventService,
  ) { }

  /**
   * Story 11.1: Get real-time revenue metrics
   */
  @Get("revenue/metrics")
  @ApiOperation({ summary: "Get revenue metrics untuk periode tertentu" })
  @ApiResponse({
    status: 200,
    description: "Revenue metrics berhasil diambil",
    type: RevenueMetricsResponseDto,
  })
  async getRevenueMetrics(
    @Query() query: RevenueMetricsQueryDto,
    @Req() req: any,
  ): Promise<RevenueMetricsResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    let customRange;
    if (query.startDate && query.endDate) {
      customRange = {
        start: new Date(query.startDate),
        end: new Date(query.endDate),
      };
    }

    const metrics = await this.revenueMetricsService.getRevenueMetrics(
      tenantId,
      query.period,
      customRange,
    );

    return metrics as RevenueMetricsResponseDto;
  }

  /**
   * Story 11.2: Get revenue projection
   */
  @Get("revenue/projection")
  @ApiOperation({ summary: "Get proyeksi revenue berdasarkan data historis" })
  @ApiResponse({
    status: 200,
    description: "Revenue projection berhasil dihitung",
    type: RevenueProjectionResponseDto,
  })
  async getRevenueProjection(
    @Query() query: RevenueProjectionQueryDto,
    @Req() req: any,
  ): Promise<RevenueProjectionResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const assumptions = {
      conversionRate: query.conversionRate,
      paymentCompletionRate: query.paymentCompletionRate,
      historicalWeight: query.historicalWeight,
      pendingWeight: query.pendingWeight,
      pipelineWeight: query.pipelineWeight,
    };

    const projection = await this.revenueProjectionService.calculateProjection(
      tenantId,
      query.months,
      assumptions,
    );

    return projection as RevenueProjectionResponseDto;
  }

  /**
   * Story 11.1: Get revenue trend
   */
  @Get("revenue/trend")
  @ApiOperation({ summary: "Get trend revenue dalam N hari terakhir" })
  @ApiResponse({
    status: 200,
    description: "Revenue trend berhasil diambil",
    type: RevenueTrendResponseDto,
  })
  async getRevenueTrend(
    @Query("days") days: number = 30,
    @Req() req: any,
  ): Promise<RevenueTrendResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const trends = await this.revenueMetricsService.getRevenueTrend(
      tenantId,
      days,
    );

    // Calculate comparison for the period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const comparison =
      await this.revenueMetricsService.compareWithPreviousPeriod(
        tenantId,
        startDate,
        endDate,
      );

    return {
      days,
      trends,
      comparison,
    };
  }

  /**
   * Story 11.3: Get pipeline analytics
   */
  @Get("pipeline")
  @ApiOperation({ summary: "Get analitik pipeline jamaah" })
  @ApiResponse({
    status: 200,
    description: "Pipeline analytics berhasil dihitung",
    type: PipelineAnalyticsResponseDto,
  })
  async getPipelineAnalytics(
    @Query() query: PipelineAnalyticsQueryDto,
    @Req() req: any,
  ): Promise<PipelineAnalyticsResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const analytics =
      await this.pipelineAnalyticsService.calculatePipelineAnalytics(
        tenantId,
        query,
      );

    return analytics as PipelineAnalyticsResponseDto;
  }

  /**
   * Story 11.6: Get pipeline funnel visualization
   */
  @Get("pipeline/funnel")
  @ApiOperation({ summary: "Get visualisasi funnel pipeline" })
  @ApiResponse({
    status: 200,
    description: "Pipeline funnel berhasil diambil",
    type: PipelineAnalyticsResponseDto,
  })
  async getPipelineFunnel(
    @Query() query: PipelineAnalyticsQueryDto,
    @Req() req: any,
  ): Promise<PipelineAnalyticsResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    return this.pipelineAnalyticsService.calculatePipelineAnalytics(
      tenantId,
      query,
    ) as Promise<PipelineAnalyticsResponseDto>;
  }

  /**
   * Story 11.6: Get kanban board data
   */
  @Get("pipeline/kanban")
  @ApiOperation({ summary: "Get data kanban board untuk pipeline jamaah" })
  @ApiResponse({
    status: 200,
    description: "Kanban board data berhasil diambil",
    type: KanbanBoardResponseDto,
  })
  async getKanbanBoard(
    @Query() query: PipelineAnalyticsQueryDto,
    @Req() req: any,
  ): Promise<KanbanBoardResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const columns = await this.pipelineAnalyticsService.getKanbanBoard(
      tenantId,
      query,
    );

    const totalJamaah = columns.reduce((sum, col) => sum + col.count, 0);
    const totalValue = columns.reduce((sum, col) => sum + col.totalValue, 0);

    return {
      columns,
      totalJamaah,
      totalValue,
    };
  }

  /**
   * Story 11.4: Get agent performance
   */
  @Get("agents/:agentId/performance")
  @ApiOperation({ summary: "Get performance metrics untuk agent tertentu" })
  @ApiResponse({
    status: 200,
    description: "Agent performance berhasil dihitung",
    type: AgentPerformanceResponseDto,
  })
  async getAgentPerformance(
    @Param("agentId") agentId: string,
    @Query() query: AgentPerformanceQueryDto,
    @Req() req: any,
  ): Promise<AgentPerformanceResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const performance = await this.agentPerformanceService.getAgentPerformance(
      tenantId,
      agentId,
      startDate,
      endDate,
    );

    return performance as AgentPerformanceResponseDto;
  }

  /**
   * Story 11.5: Get leaderboard
   */
  @Get("leaderboard")
  @ApiOperation({ summary: "Get leaderboard agent performance" })
  @ApiResponse({
    status: 200,
    description: "Leaderboard berhasil diambil",
    type: LeaderboardResponseDto,
  })
  async getLeaderboard(
    @Query() query: LeaderboardQueryDto,
    @Req() req: any,
  ): Promise<LeaderboardResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    const entries = await this.leaderboardService.getLeaderboard(
      tenantId,
      query.metric,
      query.period,
    );

    const periodLabel = this.leaderboardService.getPeriodLabel(query.period);

    return {
      metric: query.metric,
      period: query.period,
      periodLabel,
      entries,
      totalAgents: entries.length,
    };
  }

  /**
   * Get complete dashboard summary
   */
  @Get("dashboard")
  @ApiOperation({
    summary: "Get complete dashboard data (all metrics combined)",
  })
  @ApiResponse({
    status: 200,
    description: "Dashboard summary berhasil diambil",
    type: DashboardSummaryResponseDto,
  })
  async getDashboardSummary(
    @Req() req: any,
  ): Promise<DashboardSummaryResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    // Get all metrics in parallel
    const [
      revenueMetrics,
      revenueProjection,
      pipelineAnalytics,
      topPerformers,
    ] = await Promise.all([
      this.revenueMetricsService.getRevenueMetrics(tenantId),
      this.revenueProjectionService.calculateProjection(tenantId),
      this.pipelineAnalyticsService.calculatePipelineAnalytics(tenantId),
      this.leaderboardService.getLeaderboard(tenantId),
    ]);

    // Calculate overview
    const overview = {
      totalJamaah: pipelineAnalytics.jamaahCount,
      totalRevenue: revenueMetrics.total,
      averageDealSize:
        pipelineAnalytics.jamaahCount > 0
          ? revenueMetrics.total / pipelineAnalytics.jamaahCount
          : 0,
      conversionRate:
        topPerformers.length > 0
          ? topPerformers.reduce(
            (sum, e) => sum + e.metrics.conversionRate,
            0,
          ) / topPerformers.length
          : 0,
    };

    return {
      revenueMetrics: revenueMetrics as RevenueMetricsResponseDto,
      revenueProjection: revenueProjection as RevenueProjectionResponseDto,
      pipelineAnalytics: pipelineAnalytics as PipelineAnalyticsResponseDto,
      topPerformers: {
        metric: "revenue" as any,
        period: "monthly" as any,
        periodLabel: this.leaderboardService.getPeriodLabel("monthly" as any),
        entries: topPerformers.slice(0, 10), // Top 10
        totalAgents: topPerformers.length,
      },
      overview,
      lastUpdated: new Date(),
    };
  }

  /**
   * Track custom analytics event
   */
  @Post("events")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Track custom analytics event" })
  @ApiResponse({ status: 204, description: "Event tracked successfully" })
  async trackEvent(
    @Body()
    body: {
      eventType: string;
      entityType: string;
      entityId: string;
      metadata?: any;
    },
    @Req() req: any,
  ): Promise<void> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || null;

    await (this.analyticsEventService as any).trackEvent(
      tenantId,
      body.eventType,
      body.entityType,
      body.entityId,
      userId,
      body.metadata,
    );
  }

  /**
   * Story 11.4: Export analytics to PDF
   */
  @Get("export/:type")
  @ApiOperation({ summary: "Export analytics ke PDF/CSV" })
  @ApiResponse({ status: 200, description: "Export berhasil" })
  async exportAnalytics(
    @Param("type") type: "pdf" | "csv",
    @Query("agentId") agentId: string,
    @Req() req: any,
  ): Promise<any> {
    const tenantId = req.user?.tenantId || "demo-tenant";

    if (type === "pdf" && agentId) {
      const buffer = await this.agentPerformanceService.exportToPDF(
        tenantId,
        agentId,
      );

      return {
        contentType: "application/pdf",
        data: buffer.toString("base64"),
        filename: `agent-performance-${agentId}.pdf`,
      };
    }

    // TODO: Implement CSV export
    return { message: "Export type not implemented yet" };
  }
}
