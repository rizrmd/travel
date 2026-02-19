/**
 * Epic 5, Story 5.5: Action Log Response DTO
 * Response DTO for audit trail queries
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ActionType, PerformedByRole } from "../domain/jamaah-action-log";

export class ActionLogResponseDto {
  @ApiProperty({
    description: "Action log ID",
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

  @ApiPropertyOptional({
    description: "Jamaah name",
    example: "Ahmad Zainuddin",
  })
  jamaahName?: string;

  @ApiProperty({
    description: "Action type",
    enum: ActionType,
    example: ActionType.DOCUMENT_UPLOAD,
  })
  actionType: ActionType;

  @ApiProperty({
    description: "Human-readable action description",
    example: "Agent Budi uploaded KTP for Ahmad Zainuddin",
  })
  actionDescription: string;

  @ApiProperty({
    description: "User ID who performed the action",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  performedById: string;

  @ApiPropertyOptional({
    description: "User name who performed the action",
    example: "Budi Santoso",
  })
  performedByName?: string;

  @ApiProperty({
    description: "Role of the user who performed the action",
    enum: PerformedByRole,
    example: PerformedByRole.AGENT,
  })
  performedByRole: PerformedByRole;

  @ApiPropertyOptional({
    description: "Old value before action",
    example: { status: "lead" },
  })
  oldValue?: Record<string, any>;

  @ApiPropertyOptional({
    description: "New value after action",
    example: { status: "interested" },
  })
  newValue?: Record<string, any>;

  @ApiPropertyOptional({
    description: "Additional metadata",
    example: { documentType: "ktp", fileName: "ktp.jpg" },
  })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: "IP address of the user",
    example: "103.10.67.123",
  })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: "User agent string",
    example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  })
  userAgent?: string;

  @ApiProperty({
    description: "Timestamp when action was performed",
    example: "2024-12-22T10:30:00Z",
  })
  createdAt: Date;
}

/**
 * Action log query DTO
 */
export class ActionLogQueryDto {
  @ApiPropertyOptional({
    description: "Filter by agent ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  agentId?: string;

  @ApiPropertyOptional({
    description: "Filter by jamaah ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  jamaahId?: string;

  @ApiPropertyOptional({
    description: "Filter by action type",
    enum: ActionType,
    example: ActionType.PAYMENT_RECORD,
  })
  actionType?: ActionType;

  @ApiPropertyOptional({
    description: "Filter from date",
    example: "2024-12-01",
  })
  fromDate?: string;

  @ApiPropertyOptional({
    description: "Filter to date",
    example: "2024-12-31",
  })
  toDate?: string;

  @ApiPropertyOptional({
    description: "Page number",
    example: 1,
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 50,
    default: 50,
  })
  perPage?: number;
}
