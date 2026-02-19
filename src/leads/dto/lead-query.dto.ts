import {
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { LeadStatus, LeadSource } from "../domain/lead";

/**
 * Epic 10, Story 10.5: Lead Query DTO
 */
export class LeadQueryDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ enum: LeadSource })
  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  agentId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  landingPageId?: string;

  @ApiPropertyOptional({ description: "Filter by hot leads (< 24 hours old)" })
  @Type(() => Boolean)
  @IsOptional()
  hotLeadsOnly?: boolean;

  @ApiPropertyOptional({ description: "Start date for filtering (ISO 8601)" })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: "End date for filtering (ISO 8601)" })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
