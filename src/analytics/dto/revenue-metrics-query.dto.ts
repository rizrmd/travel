/**
 * Epic 11, Story 11.1: Revenue Metrics Query DTO
 */

import { IsEnum, IsOptional, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { RevenuePeriod } from "../domain/revenue-metrics";

export class RevenueMetricsQueryDto {
  @ApiPropertyOptional({
    enum: RevenuePeriod,
    description: "Periode revenue (today, week, month, year)",
    example: "month",
  })
  @IsOptional()
  @IsEnum(RevenuePeriod)
  period?: RevenuePeriod = RevenuePeriod.MONTH;

  @ApiPropertyOptional({
    description: "Tanggal mulai untuk custom range (format: YYYY-MM-DD)",
    example: "2024-01-01",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Tanggal akhir untuk custom range (format: YYYY-MM-DD)",
    example: "2024-12-31",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
