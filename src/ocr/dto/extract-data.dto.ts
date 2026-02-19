/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Extract data request and response DTOs
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNumber, IsOptional } from "class-validator";
import { KtpDataDto } from "./ktp-data.dto";
import { PassportDataDto } from "./passport-data.dto";
import { KkDataDto } from "./kk-data.dto";
import { QualityValidationDto } from "./quality-validation.dto";

export class ExtractDataRequestDto {
  @ApiProperty({
    description: "Document ID to extract data from",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: "Force re-processing even if cached result exists",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  forceReprocess?: boolean;
}

export class ExtractDataResponseDto {
  @ApiProperty({
    description: "Extracted data based on document type",
    oneOf: [
      { $ref: "#/components/schemas/KtpDataDto" },
      { $ref: "#/components/schemas/PassportDataDto" },
      { $ref: "#/components/schemas/KkDataDto" },
    ],
  })
  extractedData: KtpDataDto | PassportDataDto | KkDataDto;

  @ApiProperty({
    description: "OCR confidence score (0-100)",
    example: 95.5,
  })
  @IsNumber()
  confidenceScore: number;

  @ApiProperty({
    description: "Quality validation results",
    type: QualityValidationDto,
  })
  qualityValidation: QualityValidationDto;

  @ApiProperty({
    description: "Whether document was auto-approved (confidence >= 80%)",
    example: true,
  })
  @IsBoolean()
  autoApproved: boolean;

  @ApiProperty({
    description: "Document type (KTP, PASSPORT, KK)",
    example: "KTP",
  })
  @IsString()
  documentType: string;

  @ApiProperty({
    description: "Timestamp when OCR processing completed",
    example: "2025-12-23T10:30:00Z",
  })
  @IsString()
  processedAt: string;
}

export class QueueExtractionResponseDto {
  @ApiProperty({
    description: "Success status",
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: "Message",
    example: "Document queued for OCR processing",
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: "Job ID for tracking",
    example: "ocr-job-123456",
  })
  @IsString()
  jobId: string;

  @ApiProperty({
    description: "Document ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  documentId: string;
}
