/**
 * Epic 12, Story 12.5: Log Critical Operation DTO
 */

import {
  IsEnum,
  IsUUID,
  IsString,
  IsOptional,
  IsObject,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AuditAction, ActorRole } from "../domain/audit-log";

export class LogCriticalOperationDto {
  @ApiProperty({ enum: AuditAction, example: AuditAction.USER_ROLE_CHANGED })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  entityId: string;

  @ApiProperty({ enum: ActorRole, example: ActorRole.OWNER })
  @IsEnum(ActorRole)
  actorRole: ActorRole;

  @ApiProperty({ example: "Owner Admin" })
  @IsString()
  actorName: string;

  @ApiPropertyOptional({ example: { role: "agent" } })
  @IsOptional()
  @IsObject()
  beforeState?: Record<string, any>;

  @ApiPropertyOptional({ example: { role: "owner" } })
  @IsOptional()
  @IsObject()
  afterState?: Record<string, any>;

  @ApiPropertyOptional({ example: { reason: "Promotion" } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
