/**
 * Epic 7, Story 7.2: Create Payment Schedule DTO
 */

import {
  IsUUID,
  IsNumber,
  IsInt,
  IsDateString,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentScheduleDto {
  @ApiProperty({
    description: "Jamaah ID for the schedule",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  jamaahId: string;

  @ApiProperty({
    description: "Total package price in IDR",
    example: 30000000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: "Package price must be positive" })
  packagePrice: number;

  @ApiProperty({
    description: "Down payment amount in IDR",
    example: 5000000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: "Down payment cannot be negative" })
  dpAmount: number;

  @ApiProperty({
    description: "Number of installments",
    example: 5,
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1, { message: "Must have at least 1 installment" })
  @Max(12, { message: "Maximum 12 installments" })
  installmentCount: number;

  @ApiProperty({
    description: "First installment due date (ISO 8601)",
    example: "2025-02-01",
  })
  @IsDateString()
  startDate: string;
}
