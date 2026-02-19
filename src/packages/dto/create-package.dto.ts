/**
 * Epic 4, Story 4.1: Create Package DTO
 * Validation for creating new packages
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  IsDate,
  IsEnum,
  IsOptional,
  Min,
  MaxLength,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { PackageStatus } from "../domain/package";

export class CreatePackageDto {
  @ApiProperty({
    description: "Package name",
    example: "Umroh Ramadhan 2025",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: "Package description",
    example: "Paket umroh special Ramadhan dengan fasilitas bintang 5",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Package duration in days",
    example: 12,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  duration_days: number;

  @ApiProperty({
    description: "Retail price (public-facing price) in IDR",
    example: 25000000,
  })
  @IsNumber()
  @IsPositive()
  retail_price: number;

  @ApiProperty({
    description: "Wholesale price (agent price) in IDR",
    example: 22000000,
  })
  @IsNumber()
  @IsPositive()
  wholesale_price: number;

  @ApiPropertyOptional({
    description: "Cost price (agency cost, owner-only visibility) in IDR",
    example: 20000000,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cost_price?: number;

  @ApiProperty({
    description: "Maximum jamaah capacity",
    example: 45,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: "Departure date (YYYY-MM-DD)",
    example: "2025-03-15",
    type: String,
  })
  @Type(() => Date)
  @IsDate()
  departure_date: Date;

  @ApiPropertyOptional({
    description: "Package status",
    enum: PackageStatus,
    default: PackageStatus.DRAFT,
  })
  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus;
}
