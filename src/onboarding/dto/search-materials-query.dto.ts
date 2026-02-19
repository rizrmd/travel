/**
 * Epic 13, Story 13.4: Search Training Materials Query DTO
 */

import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { TrainingCategory } from "../domain/training-material";

export class SearchMaterialsQueryDto {
  @IsString({ message: "Kata kunci pencarian harus berupa teks" })
  query: string;

  @IsOptional()
  @IsEnum(TrainingCategory)
  category?: TrainingCategory;

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
  limit?: number = 20;
}
