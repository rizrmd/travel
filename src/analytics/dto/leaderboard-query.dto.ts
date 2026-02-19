/**
 * Epic 11, Story 11.5: Leaderboard Query DTO
 */

import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  LeaderboardMetric,
  LeaderboardPeriod,
} from "../domain/agent-performance";

export class LeaderboardQueryDto {
  @ApiPropertyOptional({
    enum: LeaderboardMetric,
    description: "Metrik untuk ranking",
    example: "revenue",
  })
  @IsOptional()
  @IsEnum(LeaderboardMetric)
  metric?: LeaderboardMetric = LeaderboardMetric.REVENUE;

  @ApiPropertyOptional({
    enum: LeaderboardPeriod,
    description: "Period leaderboard",
    example: "monthly",
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriod)
  period?: LeaderboardPeriod = LeaderboardPeriod.MONTHLY;
}
