/**
 * Epic 6, Story 6.4: Review Document DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { DocumentStatus } from "../domain/document";

export class ReviewDocumentDto {
  @ApiProperty({
    description: "Review status",
    enum: [DocumentStatus.APPROVED, DocumentStatus.REJECTED],
    example: DocumentStatus.APPROVED,
  })
  @IsEnum([DocumentStatus.APPROVED, DocumentStatus.REJECTED])
  status: DocumentStatus.APPROVED | DocumentStatus.REJECTED;

  @ApiProperty({
    description: "Review notes (required for rejection)",
    example: "Passport expired, please upload new one",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Review notes must be at least 5 characters" })
  reviewNotes?: string;

  @ApiProperty({
    description: "Updated extracted data from OCR (optional)",
    required: false,
  })
  @IsOptional()
  extractedData?: Record<string, any>;
}
