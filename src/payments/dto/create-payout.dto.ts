/**
 * Epic 7, Story 7.6: Create Commission Payout DTO
 */

import {
  IsDateString,
  IsArray,
  IsUUID,
  IsOptional,
  IsString,
  MaxLength,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePayoutDto {
  @ApiProperty({
    description: "Payout date",
    example: "2025-01-31",
  })
  @IsDateString()
  payoutDate: string;

  @ApiProperty({
    description: "Agent IDs to include in payout",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "123e4567-e89b-12d3-a456-426614174001",
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one agent must be selected" })
  @IsUUID("4", { each: true })
  agentIds: string[];

  @ApiPropertyOptional({
    description: "Additional notes",
    example: "January 2025 commission payout",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class UploadPayoutConfirmationDto {
  @ApiProperty({
    description: "Bank confirmation file path",
    example: "uploads/bank-confirmations/payout-2025-01.pdf",
  })
  @IsString()
  bankConfirmationFile: string;

  @ApiPropertyOptional({
    description: "Additional notes",
    example: "Confirmed by bank on 2025-01-31",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
