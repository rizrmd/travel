/**
 * Epic 13, Story 13.1: Migration List Query DTO
 */

import { IsOptional, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { CsvImportStatus, CsvImportType } from "../domain/csv-import";

export class MigrationListQueryDto {
  @IsOptional()
  @IsEnum(CsvImportType)
  import_type?: CsvImportType;

  @IsOptional()
  @IsEnum(CsvImportStatus)
  status?: CsvImportStatus;

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

  @IsOptional()
  sort_by?: string = "created_at";

  @IsOptional()
  sort_order?: "ASC" | "DESC" = "DESC";
}
