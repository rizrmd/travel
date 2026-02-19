/**
 * Epic 13, Story 13.5: Adoption Metrics Query DTO
 */

import { IsOptional, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class AdoptionMetricsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  days?: number = 7;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  inactive_threshold_days?: number = 14;
}
