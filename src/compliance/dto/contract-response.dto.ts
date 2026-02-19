/**
 * Epic 12, Story 12.1: Contract Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContractStatus, ContractType } from "../domain/contract";

export class ContractResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  jamaahId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174003" })
  packageId: string;

  @ApiProperty({
    enum: ContractType,
    example: ContractType.WAKALAH_BIL_UJRAH_STANDARD,
  })
  contractType: ContractType;

  @ApiProperty({ example: "TU-ABC-2024-000001" })
  contractNumber: string;

  @ApiProperty({ example: "1.0" })
  templateVersion: string;

  @ApiProperty({ enum: ContractStatus, example: ContractStatus.DRAFT })
  status: ContractStatus;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  generatedAt: Date;

  @ApiPropertyOptional({ example: "2024-01-15T11:00:00Z" })
  sentAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T12:00:00Z" })
  viewedAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T13:00:00Z" })
  signedAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T14:00:00Z" })
  completedAt?: Date;

  @ApiPropertyOptional({ example: "2024-02-15T10:00:00Z" })
  expiresAt?: Date;

  @ApiPropertyOptional({
    example: "https://storage.example.com/contracts/contract.pdf",
  })
  contractUrl?: string;

  @ApiProperty({ example: {} })
  metadata: Record<string, any>;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  updatedAt: Date;
}
