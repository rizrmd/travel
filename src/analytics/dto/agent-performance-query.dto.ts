/**
 * Epic 11, Story 11.4: Agent Performance Query DTO
 */

import { IsOptional, IsUUID, IsDateString } from "class-validator";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export class AgentPerformanceQueryDto {
  @ApiProperty({
    description: "Agent ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID("4")
  agentId: string;

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
}
