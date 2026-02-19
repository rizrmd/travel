/**
 * Epic 6: Documents List Query DTO
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { DocumentType, DocumentStatus } from "../domain/document";

export class DocumentsListQueryDto {
  @ApiPropertyOptional({
    description: "Filter by jamaah ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  jamaahId?: string;

  @ApiPropertyOptional({
    description: "Filter by document type",
    enum: DocumentType,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: DocumentStatus,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({
    description: "Page number (1-based)",
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
