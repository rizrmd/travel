/**
 * Epic 6: Document Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { DocumentType, DocumentStatus, UploaderType } from "../domain/document";

export class DocumentResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  jamaahId: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.KTP })
  documentType: DocumentType;

  @ApiProperty({
    example: "https://storage.example.com/documents/ktp-123.jpg",
  })
  fileUrl: string;

  @ApiProperty({ example: 2048576 })
  fileSize: number;

  @ApiProperty({ example: "image/jpeg" })
  fileMimeType: string;

  @ApiProperty({ enum: DocumentStatus, example: DocumentStatus.PENDING })
  status: DocumentStatus;

  @ApiProperty({ enum: UploaderType, example: UploaderType.AGENT })
  uploaderType: UploaderType;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  uploadedById: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  reviewedById?: string;

  @ApiProperty({ example: "2025-12-23T10:30:00Z", required: false })
  reviewedAt?: Date;

  @ApiProperty({
    example: "Passport expired, please upload new one",
    required: false,
  })
  rejectionReason?: string;

  @ApiProperty({ required: false, nullable: true })
  extractedData?: Record<string, any>;

  @ApiProperty({ example: "2025-12-31", required: false })
  expiresAt?: Date;

  @ApiProperty({ example: "2025-12-23T10:30:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:30:00Z" })
  updatedAt: Date;
}

export class DocumentListResponseDto {
  @ApiProperty({ type: [DocumentResponseDto] })
  data: DocumentResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
