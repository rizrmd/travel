/**
 * Epic 12, Story 12.4 & 12.5: Audit Log Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  AuditLogType,
  EntityType,
  AuditAction,
  ActorRole,
} from "../domain/audit-log";

export class AuditLogResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({
    enum: AuditLogType,
    example: AuditLogType.FINANCIAL_TRANSACTION,
  })
  logType: AuditLogType;

  @ApiProperty({ enum: EntityType, example: EntityType.PAYMENT })
  entityType: EntityType;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  entityId: string;

  @ApiProperty({ enum: AuditAction, example: AuditAction.PAYMENT_CONFIRMED })
  action: AuditAction;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174003" })
  actorId?: string;

  @ApiProperty({ enum: ActorRole, example: ActorRole.AGENT })
  actorRole: ActorRole;

  @ApiProperty({ example: "Ahmad Agent" })
  actorName: string;

  @ApiPropertyOptional({ example: { status: "pending", amount: 10000000 } })
  beforeState?: Record<string, any>;

  @ApiPropertyOptional({ example: { status: "confirmed", amount: 10000000 } })
  afterState?: Record<string, any>;

  @ApiPropertyOptional({ example: { paymentMethod: "bank_transfer" } })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ example: "192.168.1.1" })
  ipAddress?: string;

  @ApiPropertyOptional({ example: "Mozilla/5.0..." })
  userAgent?: string;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  createdAt: Date;
}

export class PaginatedAuditLogResponseDto {
  @ApiProperty({ type: [AuditLogResponseDto] })
  data: AuditLogResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 8 })
  totalPages: number;
}
