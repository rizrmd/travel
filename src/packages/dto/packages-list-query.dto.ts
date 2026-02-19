/**
 * Epic 4, Story 4.1: Packages List Query DTO
 * Query parameters for filtering and paginating packages
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { PackageStatus } from "../domain/package";

export class PackagesListQueryDto {
  @ApiPropertyOptional({
    description: "Filter by status",
    enum: PackageStatus,
    example: PackageStatus.PUBLISHED,
  })
  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus;

  @ApiPropertyOptional({
    description: "Search by package name (case-insensitive, partial match)",
    example: "ramadhan",
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "Sort by field",
    enum: ["departure_date", "created_at", "retail_price", "name"],
    default: "departure_date",
  })
  @IsString()
  @IsIn(["departure_date", "created_at", "retail_price", "name"])
  @IsOptional()
  sort_by?: string = "departure_date";

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "ASC",
  })
  @IsString()
  @IsIn(["ASC", "DESC"])
  @IsOptional()
  sort_order?: "ASC" | "DESC" = "ASC";

  @ApiPropertyOptional({
    description: "Page number (1-based)",
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
