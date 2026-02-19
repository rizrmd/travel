/**
 * Epic 12, Story 12.3: Compliance Dashboard Query DTO
 */

import { IsOptional, IsDateString, IsUUID } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ComplianceDashboardQueryDto {
  @ApiPropertyOptional({
    description: "Start date for filtering (ISO 8601)",
    example: "2024-01-01T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "End date for filtering (ISO 8601)",
    example: "2024-12-31T23:59:59Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Filter by specific agent ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  agentId?: string;
}
