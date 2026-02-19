/**
 * Epic 11: Dashboard Summary Response DTO
 * Complete dashboard data for operational intelligence
 */

import { ApiProperty } from "@nestjs/swagger";
import { RevenueMetricsResponseDto } from "./revenue-metrics-response.dto";
import { RevenueProjectionResponseDto } from "./revenue-projection-response.dto";
import { PipelineAnalyticsResponseDto } from "./pipeline-analytics-response.dto";
import { LeaderboardResponseDto } from "./leaderboard-response.dto";

export class DashboardSummaryResponseDto {
  @ApiProperty({ type: RevenueMetricsResponseDto })
  revenueMetrics: RevenueMetricsResponseDto;

  @ApiProperty({ type: RevenueProjectionResponseDto })
  revenueProjection: RevenueProjectionResponseDto;

  @ApiProperty({ type: PipelineAnalyticsResponseDto })
  pipelineAnalytics: PipelineAnalyticsResponseDto;

  @ApiProperty({ type: LeaderboardResponseDto })
  topPerformers: LeaderboardResponseDto;

  @ApiProperty({
    example: {
      totalJamaah: 150,
      totalRevenue: 4500000000,
      averageDealSize: 30000000,
      conversionRate: 65.5,
    },
  })
  overview: {
    totalJamaah: number;
    totalRevenue: number;
    averageDealSize: number;
    conversionRate: number;
  };

  @ApiProperty({ example: "2024-12-23T10:30:00.000Z" })
  lastUpdated: Date;
}
