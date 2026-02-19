import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID, IsEnum, IsInt, Min, Max } from "class-validator";
import {
  DiagnosticCheckType,
  DiagnosticStatus,
} from "../domain/diagnostic-result";
import { Type } from "class-transformer";

export class DiagnosticHistoryQueryDto {
  @ApiPropertyOptional({ description: "Filter by tenant ID" })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({
    description: "Filter by check type",
    enum: DiagnosticCheckType,
  })
  @IsOptional()
  @IsEnum(DiagnosticCheckType)
  checkType?: DiagnosticCheckType;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: DiagnosticStatus,
  })
  @IsOptional()
  @IsEnum(DiagnosticStatus)
  status?: DiagnosticStatus;

  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Items per page", default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
