/**
 * Epic 4, Story 4.1 & 4.3: Package Response DTO
 * Response format for package data with pricing based on role
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { PackageStatus } from "../domain/package";

export class PackagePricingDto {
  @ApiProperty({ description: "Agent commission amount", example: 3000000 })
  @Expose()
  agent_commission: number;

  @ApiProperty({ description: "Agent commission percentage", example: 12 })
  @Expose()
  agent_commission_percentage: number;

  @ApiPropertyOptional({
    description: "Agency profit (owner only)",
    example: 2000000,
  })
  @Expose()
  agency_profit?: number;

  @ApiPropertyOptional({
    description: "Total margin (owner only)",
    example: 5000000,
  })
  @Expose()
  total_margin?: number;
}

export class PackageResponseDto {
  @ApiProperty({ description: "Package ID", example: "uuid" })
  @Expose()
  id: string;

  @ApiProperty({ description: "Tenant ID", example: "uuid" })
  @Expose()
  tenant_id: string;

  @ApiProperty({ description: "Package name", example: "Umroh Ramadhan 2025" })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: "Package description" })
  @Expose()
  description: string | null;

  @ApiProperty({ description: "Duration in days", example: 12 })
  @Expose()
  duration_days: number;

  @ApiProperty({ description: "Retail price", example: 25000000 })
  @Expose()
  retail_price: number;

  @ApiPropertyOptional({
    description: "Wholesale price (agents only)",
    example: 22000000,
  })
  @Expose()
  wholesale_price?: number;

  @ApiPropertyOptional({
    description: "Cost price (owner only)",
    example: 20000000,
  })
  @Expose()
  cost_price?: number | null;

  @ApiProperty({ description: "Maximum capacity", example: 45 })
  @Expose()
  capacity: number;

  @ApiProperty({ description: "Available slots", example: 15 })
  @Expose()
  available_slots: number;

  @ApiProperty({ description: "Departure date", example: "2025-03-15" })
  @Expose()
  @Transform(({ value }) => value?.toISOString?.().split("T")[0])
  departure_date: Date;

  @ApiProperty({ description: "Return date", example: "2025-03-27" })
  @Expose()
  @Transform(({ value }) => value?.toISOString?.().split("T")[0])
  return_date: Date;

  @ApiProperty({ description: "Package status", enum: PackageStatus })
  @Expose()
  status: PackageStatus;

  @ApiProperty({ description: "Created by user ID", example: "uuid" })
  @Expose()
  created_by_id: string;

  @ApiPropertyOptional({ description: "Pricing breakdown" })
  @Expose()
  pricing?: PackagePricingDto;

  @ApiProperty({ description: "Created at timestamp" })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: "Updated at timestamp" })
  @Expose()
  updated_at: Date;

  @ApiPropertyOptional({ description: "Deleted at timestamp" })
  @Expose()
  deleted_at: Date | null;
}
