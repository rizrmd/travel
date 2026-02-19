/**
 * Epic 13, Story 13.4: Training Materials List Query DTO
 */

import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { TrainingCategory } from "../domain/training-material";

export class TrainingMaterialsListQueryDto {
  @IsOptional()
  @IsEnum(TrainingCategory)
  category?: TrainingCategory;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  is_mandatory?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  is_published?: boolean = true;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  include_progress?: boolean = false;
}
