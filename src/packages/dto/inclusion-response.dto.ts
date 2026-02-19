/**
 * Epic 4, Story 4.4: Package Inclusion Response DTO
 * Response format for inclusion/exclusion data
 */

import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { InclusionCategory } from "../infrastructure/persistence/relational/entities/package-inclusion.entity";

export class InclusionResponseDto {
  @ApiProperty({ description: "Inclusion ID", example: "uuid" })
  @Expose()
  id: string;

  @ApiProperty({ description: "Package ID", example: "uuid" })
  @Expose()
  package_id: string;

  @ApiProperty({ description: "Category", enum: InclusionCategory })
  @Expose()
  category: InclusionCategory;

  @ApiProperty({
    description: "Description",
    example: "Round-trip flight Jakarta-Jeddah",
  })
  @Expose()
  description: string;

  @ApiProperty({ description: "Is included", example: true })
  @Expose()
  is_included: boolean;

  @ApiProperty({ description: "Sort order", example: 1 })
  @Expose()
  sort_order: number;

  @ApiProperty({ description: "Created at timestamp" })
  @Expose()
  created_at: Date;

  @ApiProperty({ description: "Updated at timestamp" })
  @Expose()
  updated_at: Date;
}

export class GroupedInclusionsResponseDto {
  @ApiProperty({
    description: "Inclusions grouped by category",
    type: "object",
  })
  @Expose()
  inclusions: Record<string, string[]>;

  @ApiProperty({
    description: "Exclusions grouped by category",
    type: "object",
  })
  @Expose()
  exclusions: Record<string, string[]>;
}
