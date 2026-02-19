/**
 * Epic 11, Story 11.4: Agent Performance Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  AgentPerformanceMetrics,
  PerformanceTrend,
  Achievement,
  AchievementType,
} from "../domain/agent-performance";

export class PerformanceTrendDto implements PerformanceTrend {
  @ApiProperty({ example: "2024-12-01T00:00:00.000Z" })
  date: Date;

  @ApiProperty({ example: 75.5 })
  conversionRate: number;

  @ApiProperty({ example: 25000000 })
  revenue: number;

  @ApiProperty({ example: 3 })
  jamaahCount: number;
}

export class AchievementDto implements Achievement {
  @ApiProperty({ enum: AchievementType, example: "first_sale" })
  type: AchievementType;

  @ApiProperty({ example: "Penjualan Pertama" })
  title: string;

  @ApiProperty({ example: "Berhasil mendapatkan jamaah pertama" })
  description: string;

  @ApiProperty({ example: "2024-12-01T00:00:00.000Z" })
  earnedAt: Date;

  @ApiProperty({ example: "🎯" })
  icon: string;
}

export class AgentPerformanceResponseDto implements AgentPerformanceMetrics {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  agentId: string;

  @ApiProperty({ example: "Ahmad Zulkifli" })
  agentName: string;

  @ApiProperty({ example: "2024-12" })
  period: string;

  @ApiProperty({ example: 75.5 })
  conversionRate: number;

  @ApiProperty({ example: 28500000 })
  averageDealSize: number;

  @ApiProperty({ example: 15 })
  jamaahCount: number;

  @ApiProperty({ example: 120000000 })
  revenueGenerated: number;

  @ApiProperty({ type: [PerformanceTrendDto] })
  trend: PerformanceTrendDto[];

  @ApiProperty({ type: [AchievementDto] })
  achievements: AchievementDto[];

  @ApiProperty({ example: 3, nullable: true })
  ranking: number | null;
}
