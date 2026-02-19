/**
 * Epic 4, Story 4.2: Update Itinerary Item DTO
 * Validation for updating itinerary days
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ActivityDto, MealsIncludedDto } from "./create-itinerary-item.dto";

export class UpdateItineraryItemDto {
  @ApiPropertyOptional({
    description: "Day number (1-based)",
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  day_number?: number;

  @ApiPropertyOptional({
    description: "Day title",
    example: "Day 1: Arrival in Jeddah",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: "Day description",
    example: "Arrive at King Abdulaziz Airport and transfer to hotel",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "List of activities for the day",
    type: [ActivityDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  @IsOptional()
  activities?: ActivityDto[];

  @ApiPropertyOptional({
    description: "Hotel/accommodation name",
    example: "Hotel Pullman Zamzam",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  accommodation?: string;

  @ApiPropertyOptional({
    description: "Meals included for the day",
    type: MealsIncludedDto,
  })
  @ValidateNested()
  @Type(() => MealsIncludedDto)
  @IsOptional()
  meals_included?: MealsIncludedDto;

  @ApiPropertyOptional({
    description: "Sort order (for custom ordering)",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
