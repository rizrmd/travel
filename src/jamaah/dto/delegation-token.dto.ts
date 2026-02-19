/**
 * Epic 5, Story 5.6: Delegation Token DTOs
 * Request and response DTOs for delegation management
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsUUID,
} from "class-validator";
import { PermissionType } from "../domain/jamaah-delegation";

/**
 * Create delegation request DTO
 */
export class CreateDelegationDto {
  @ApiProperty({
    description: "Permission type to delegate",
    enum: PermissionType,
    example: PermissionType.UPLOAD_DOCUMENTS,
  })
  @IsEnum(PermissionType)
  permissionType: PermissionType;

  @ApiPropertyOptional({
    description: "Expiration date for delegation (default: 30 days)",
    example: "2025-01-22T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

/**
 * Delegation response DTO
 */
export class DelegationResponseDto {
  @ApiProperty({
    description: "Delegation ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Tenant ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  tenantId: string;

  @ApiProperty({
    description: "Jamaah ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  jamaahId: string;

  @ApiProperty({
    description: "Delegated to user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  delegatedToUserId: string;

  @ApiProperty({
    description: "Delegated by agent ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  delegatedByAgentId: string;

  @ApiPropertyOptional({
    description: "Agent name",
    example: "Budi Santoso",
  })
  agentName?: string;

  @ApiProperty({
    description: "Permission type",
    enum: PermissionType,
    example: PermissionType.UPLOAD_DOCUMENTS,
  })
  permissionType: PermissionType;

  @ApiProperty({
    description: "Permission description in Indonesian",
    example: "Unggah dokumen persyaratan umroh",
  })
  permissionDescription: string;

  @ApiProperty({
    description: "Is delegation currently active",
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: "Expiration date",
    example: "2025-01-22T00:00:00Z",
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: "Is expiring soon (within 3 days)",
    example: false,
  })
  isExpiringSoon?: boolean;

  @ApiProperty({
    description: "Allowed actions for this permission",
    example: ["upload_passport", "upload_ktp", "upload_kk", "upload_vaksin"],
  })
  allowedActions: string[];

  @ApiProperty({
    description: "Created timestamp",
    example: "2024-12-22T10:00:00Z",
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: "Revoked timestamp",
    example: null,
  })
  revokedAt?: Date;
}

/**
 * Update delegation DTO
 */
export class UpdateDelegationDto {
  @ApiPropertyOptional({
    description: "Set delegation active/inactive",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: "Update expiration date",
    example: "2025-02-22T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
