/**
 * Epic 4, Story 4.2: Create Itinerary Item DTO
 * Validation for creating itinerary days
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
  MaxLength,
  Min,
  Matches,
} from "class-validator";
import { Type } from "class-transformer";

export class ActivityDto {
  @ApiProperty({
    description: "Activity time (HH:mm format)",
    example: "08:00",
    pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "time must be in HH:mm format (e.g., 08:00)",
  })
  time: string;

  @ApiProperty({
    description: "Activity description",
    example: "Depart from Jakarta",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  activity: string;

  @ApiProperty({
    description: "Activity location",
    example: "Soekarno-Hatta Airport",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;
}

export class MealsIncludedDto {
  @ApiProperty({
    description: "Is breakfast included",
    example: false,
  })
  @IsBoolean()
  breakfast: boolean;

  @ApiProperty({
    description: "Is lunch included",
    example: true,
  })
  @IsBoolean()
  lunch: boolean;

  @ApiProperty({
    description: "Is dinner included",
    example: true,
  })
  @IsBoolean()
  dinner: boolean;
}

export class CreateItineraryItemDto {
  @ApiProperty({
    description: "Day number (1-based)",
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  day_number: number;

  @ApiProperty({
    description: "Day title",
    example: "Day 1: Arrival in Jeddah",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: "Day description",
    example: "Arrive at King Abdulaziz Airport and transfer to hotel",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "List of activities for the day",
    type: [ActivityDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  activities: ActivityDto[];

  @ApiPropertyOptional({
    description: "Hotel/accommodation name",
    example: "Hotel Pullman Zamzam",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  accommodation?: string;

  @ApiProperty({
    description: "Meals included for the day",
    type: MealsIncludedDto,
  })
  @ValidateNested()
  @Type(() => MealsIncludedDto)
  meals_included: MealsIncludedDto;

  @ApiPropertyOptional({
    description: "Sort order (for custom ordering)",
    example: 1,
  })
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
