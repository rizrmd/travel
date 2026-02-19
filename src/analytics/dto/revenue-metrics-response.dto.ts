/**
 * Epic 11, Story 11.1: Revenue Metrics Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  RevenueMetrics,
  PackageRevenue,
  AgentRevenue,
  RevenueTrend,
  PeriodComparison,
  RevenuePeriod,
} from "../domain/revenue-metrics";

export class PackageRevenueDto implements PackageRevenue {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  packageId: string;

  @ApiProperty({ example: "Umroh Plus Turki 14 Hari" })
  packageName: string;

  @ApiProperty({ example: 50000000 })
  revenue: number;

  @ApiProperty({ example: 35.5 })
  percentage: number;

  @ApiProperty({ example: 5 })
  jamaahCount: number;
}

export class AgentRevenueDto implements AgentRevenue {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  agentId: string;

  @ApiProperty({ example: "Ahmad Zulkifli" })
  agentName: string;

  @ApiProperty({ example: 30000000 })
  revenue: number;

  @ApiProperty({ example: 21.3 })
  percentage: number;

  @ApiProperty({ example: 3 })
  jamaahCount: number;
}

export class RevenueTrendDto implements RevenueTrend {
  @ApiProperty({ example: "2024-12-01T00:00:00.000Z" })
  date: Date;

  @ApiProperty({ example: 15000000 })
  revenue: number;

  @ApiProperty({ example: 2 })
  jamaahCount: number;

  @ApiProperty({
    example: { "package-id-1": 10000000, "package-id-2": 5000000 },
  })
  packageBreakdown: Record<string, number>;
}

export class PeriodComparisonDto implements PeriodComparison {
  @ApiProperty({ example: 150000000 })
  currentPeriod: number;

  @ApiProperty({ example: 120000000 })
  previousPeriod: number;

  @ApiProperty({ example: 30000000 })
  difference: number;

  @ApiProperty({ example: 25.0 })
  percentageChange: number;

  @ApiProperty({ example: "up", enum: ["up", "down", "stable"] })
  trend: "up" | "down" | "stable";
}

export class RevenueMetricsResponseDto implements RevenueMetrics {
  @ApiProperty({ example: 150000000 })
  total: number;

  @ApiProperty({ enum: RevenuePeriod, example: "month" })
  period: RevenuePeriod;

  @ApiProperty({ example: 120000000 })
  previousPeriodTotal: number;

  @ApiProperty({ example: 25.0 })
  percentageChange: number;

  @ApiProperty({ type: [PackageRevenueDto] })
  breakdownByPackage: PackageRevenueDto[];

  @ApiProperty({ type: [AgentRevenueDto] })
  breakdownByAgent: AgentRevenueDto[];
}

export class RevenueTrendResponseDto {
  @ApiProperty({ example: 30 })
  days: number;

  @ApiProperty({ type: [RevenueTrendDto] })
  trends: RevenueTrendDto[];

  @ApiProperty({ type: PeriodComparisonDto })
  comparison: PeriodComparisonDto;
}
