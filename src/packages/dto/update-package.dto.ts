/**
 * Epic 4, Story 4.1: Update Package DTO
 * Validation for updating packages
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  IsDate,
  IsEnum,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { PackageStatus } from "../domain/package";

export class UpdatePackageDto {
  @ApiPropertyOptional({
    description: "Package name",
    example: "Umroh Ramadhan 2025",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: "Package description",
    example: "Paket umroh special Ramadhan dengan fasilitas bintang 5",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "Package duration in days",
    example: 12,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  duration_days?: number;

  @ApiPropertyOptional({
    description: "Retail price (public-facing price) in IDR",
    example: 25000000,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  retail_price?: number;

  @ApiPropertyOptional({
    description: "Wholesale price (agent price) in IDR",
    example: 22000000,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  wholesale_price?: number;

  @ApiPropertyOptional({
    description: "Cost price (agency cost, owner-only visibility) in IDR",
    example: 20000000,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cost_price?: number;

  @ApiPropertyOptional({
    description: "Maximum jamaah capacity",
    example: 45,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({
    description: "Departure date (YYYY-MM-DD)",
    example: "2025-03-15",
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  departure_date?: Date;

  @ApiPropertyOptional({
    description: "Package status",
    enum: PackageStatus,
  })
  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus;

  @ApiPropertyOptional({
    description: "Reason for change (for audit trail)",
    example: "Harga disesuaikan dengan kondisi pasar",
  })
  @IsString()
  @IsOptional()
  change_reason?: string;
}
