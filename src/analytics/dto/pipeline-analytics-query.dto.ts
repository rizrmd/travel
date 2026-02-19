/**
 * Epic 11, Story 11.3: Pipeline Analytics Query DTO
 */

import { IsOptional, IsUUID, IsDateString, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PipelineAnalyticsQueryDto {
  @ApiPropertyOptional({
    description: "Filter by agent IDs",
    type: [String],
    example: ["123e4567-e89b-12d3-a456-426614174000"],
  })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  agentIds?: string[];

  @ApiPropertyOptional({
    description: "Filter by package IDs",
    type: [String],
    example: ["123e4567-e89b-12d3-a456-426614174000"],
  })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  packageIds?: string[];

  @ApiPropertyOptional({
    description: "Tanggal mulai (format: YYYY-MM-DD)",
    example: "2024-01-01",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Tanggal akhir (format: YYYY-MM-DD)",
    example: "2024-12-31",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Filter by statuses",
    type: [String],
    example: ["lead", "interested", "deposit_paid"],
  })
  @IsOptional()
  @IsArray()
  statuses?: string[];
}
