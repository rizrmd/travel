/**
 * Epic 11, Story 11.2: Revenue Projection Query DTO
 */

import { IsInt, IsOptional, Min, Max, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class RevenueProjectionQueryDto {
  @ApiPropertyOptional({
    description: "Jumlah bulan untuk proyeksi (default: 3)",
    example: 3,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  months?: number = 3;

  @ApiPropertyOptional({
    description: "Conversion rate assumption (0-1, default: 0.3)",
    example: 0.3,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  conversionRate?: number;

  @ApiPropertyOptional({
    description: "Payment completion rate assumption (0-1, default: 0.9)",
    example: 0.9,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  paymentCompletionRate?: number;

  @ApiPropertyOptional({
    description: "Historical weight (0-1, default: 0.7)",
    example: 0.7,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  historicalWeight?: number;

  @ApiPropertyOptional({
    description: "Pending installments weight (0-1, default: 0.9)",
    example: 0.9,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  pendingWeight?: number;

  @ApiPropertyOptional({
    description: "Pipeline potential weight (0-1, default: 0.3)",
    example: 0.3,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  pipelineWeight?: number;
}
