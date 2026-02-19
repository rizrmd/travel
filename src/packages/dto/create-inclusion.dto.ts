/**
 * Epic 4, Story 4.4: Create Package Inclusion DTO
 * Validation for creating inclusions/exclusions
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsInt,
  IsOptional,
  MaxLength,
} from "class-validator";
import { InclusionCategory } from "../infrastructure/persistence/relational/entities/package-inclusion.entity";

export class CreateInclusionDto {
  @ApiProperty({
    description: "Inclusion category",
    enum: InclusionCategory,
    example: InclusionCategory.FLIGHT,
  })
  @IsEnum(InclusionCategory)
  @IsNotEmpty()
  category: InclusionCategory;

  @ApiProperty({
    description: "Inclusion description",
    example: "Round-trip flight Jakarta-Jeddah with Garuda Indonesia",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Is this included or excluded",
    example: true,
    default: true,
  })
  @IsBoolean()
  is_included: boolean;

  @ApiPropertyOptional({
    description: "Sort order",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
