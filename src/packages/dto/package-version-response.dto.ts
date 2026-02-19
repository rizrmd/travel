/**
 * Epic 4, Story 4.6: Package Version Response DTO
 * Response format for package version/audit trail data
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PackageVersionResponseDto {
  @ApiProperty({ description: "Version ID", example: "uuid" })
  @Expose()
  id: string;

  @ApiProperty({ description: "Package ID", example: "uuid" })
  @Expose()
  package_id: string;

  @ApiProperty({ description: "Version number", example: 1 })
  @Expose()
  version_number: number;

  @ApiProperty({ description: "Complete package snapshot", type: "object" })
  @Expose()
  snapshot: Record<string, any>;

  @ApiProperty({ description: "List of changed fields", type: [String] })
  @Expose()
  changed_fields: string[];

  @ApiProperty({
    description: "Change summary in Indonesian",
    example: "Harga retail diubah dari Rp 25.000.000 menjadi Rp 24.000.000",
  })
  @Expose()
  change_summary: string;

  @ApiProperty({ description: "User ID who made the change", example: "uuid" })
  @Expose()
  changed_by_id: string;

  @ApiPropertyOptional({
    description: "Reason for change",
    example: "Harga disesuaikan dengan kondisi pasar",
  })
  @Expose()
  change_reason: string | null;

  @ApiProperty({ description: "Created at timestamp" })
  @Expose()
  created_at: Date;
}

export class PackageVersionListResponseDto {
  @ApiProperty({
    description: "Package versions",
    type: [PackageVersionResponseDto],
  })
  @Expose()
  data: PackageVersionResponseDto[];

  @ApiProperty({ description: "Total count", example: 15 })
  @Expose()
  total: number;

  @ApiProperty({ description: "Current page", example: 1 })
  @Expose()
  page: number;

  @ApiProperty({ description: "Items per page", example: 10 })
  @Expose()
  limit: number;
}
