/**
 * Epic 11, Story 11.7: Filter Preset DTOs
 */

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFilterPresetDto {
  @ApiProperty({
    description: "Nama preset",
    example: "Prospek Bulan Ini",
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: "Deskripsi preset",
    example: "Filter untuk prospek yang dibuat bulan ini",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Konfigurasi filter",
    example: {
      statuses: ["lead", "interested"],
      dateRange: { start: "2024-12-01", end: "2024-12-31" },
    },
  })
  @IsObject()
  filters: {
    agents?: string[];
    packages?: string[];
    statuses?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    paymentMethods?: string[];
    searchTerm?: string;
    minRevenue?: number;
    maxRevenue?: number;
    [key: string]: any;
  };

  @ApiPropertyOptional({
    description: "Apakah preset dapat diakses user lain di tenant",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @ApiPropertyOptional({
    description: "Set sebagai default filter",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;
}

export class UpdateFilterPresetDto {
  @ApiPropertyOptional({
    description: "Nama preset",
    example: "Prospek Bulan Ini (Updated)",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: "Deskripsi preset",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Konfigurasi filter",
  })
  @IsOptional()
  @IsObject()
  filters?: {
    agents?: string[];
    packages?: string[];
    statuses?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    paymentMethods?: string[];
    searchTerm?: string;
    minRevenue?: number;
    maxRevenue?: number;
    [key: string]: any;
  };

  @ApiPropertyOptional({
    description: "Apakah preset dapat diakses user lain di tenant",
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: "Set sebagai default filter",
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class FilterPresetResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  userId: string;

  @ApiProperty({ example: "Prospek Bulan Ini" })
  name: string;

  @ApiProperty({ example: "Filter untuk prospek yang dibuat bulan ini" })
  description: string | null;

  @ApiProperty({
    example: {
      statuses: ["lead", "interested"],
      dateRange: { start: "2024-12-01", end: "2024-12-31" },
    },
  })
  filters: Record<string, any>;

  @ApiProperty({ example: false })
  isPublic: boolean;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: 5 })
  usageCount: number;

  @ApiProperty({ example: "2024-12-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-12-15T00:00:00.000Z" })
  updatedAt: Date;
}
