/**
 * Epic 11, Story 11.5: Leaderboard Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  LeaderboardEntry,
  LeaderboardBadge,
  LeaderboardMetric,
  LeaderboardPeriod,
} from "../domain/agent-performance";

export class LeaderboardEntryDto implements LeaderboardEntry {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  agentId: string;

  @ApiProperty({ example: "Ahmad Zulkifli" })
  agentName: string;

  @ApiProperty({ example: "ahmad@example.com" })
  agentEmail: string;

  @ApiProperty({ example: 120000000 })
  score: number;

  @ApiProperty({ enum: LeaderboardBadge, example: "gold", nullable: true })
  badge: LeaderboardBadge | null;

  @ApiProperty({
    example: {
      revenue: 120000000,
      jamaahCount: 15,
      conversionRate: 75.5,
    },
  })
  metrics: {
    revenue: number;
    jamaahCount: number;
    conversionRate: number;
  };

  @ApiProperty({ example: 2 })
  change: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({ enum: LeaderboardMetric, example: "revenue" })
  metric: LeaderboardMetric;

  @ApiProperty({ enum: LeaderboardPeriod, example: "monthly" })
  period: LeaderboardPeriod;

  @ApiProperty({ example: "2024-12" })
  periodLabel: string;

  @ApiProperty({ type: [LeaderboardEntryDto] })
  entries: LeaderboardEntryDto[];

  @ApiProperty({ example: 25 })
  totalAgents: number;
}
