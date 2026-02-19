/**
 * Epic 6, Story 6.2: Upload Document DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID, IsDateString } from "class-validator";
import { DocumentType } from "../domain/document";

export class UploadDocumentDto {
  @ApiProperty({
    description: "Jamaah ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  jamaahId: string;

  @ApiProperty({
    description: "Type of document",
    enum: DocumentType,
    example: DocumentType.KTP,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    description: "Expiration date (for passport, visa, vaccination)",
    example: "2025-12-31",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    description: "The file to upload",
    type: "string",
    format: "binary",
  })
  file: any;
}
