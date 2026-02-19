/**
 * Epic 4, Story 4.2: Itinerary Item Response DTO
 * Response format for itinerary data
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Activity, MealsIncluded } from "../domain/itinerary";

export class ItineraryItemResponseDto {
  @ApiProperty({ description: "Itinerary item ID", example: "uuid" })
  @Expose()
  id: string;

  @ApiProperty({ description: "Package ID", example: "uuid" })
  @Expose()
  package_id: string;

  @ApiProperty({ description: "Day number", example: 1 })
  @Expose()
  day_number: number;

  @ApiProperty({
    description: "Day title",
    example: "Day 1: Arrival in Jeddah",
  })
  @Expose()
  title: string;

  @ApiPropertyOptional({ description: "Day description" })
  @Expose()
  description: string | null;

  @ApiProperty({ description: "Activities list", type: "array" })
  @Expose()
  activities: Activity[];

  @ApiPropertyOptional({
    description: "Accommodation name",
    example: "Hotel Pullman Zamzam",
  })
  @Expose()
  accommodation: string | null;

  @ApiProperty({ description: "Meals included", type: "object" })
  @Expose()
  meals_included: MealsIncluded;

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
