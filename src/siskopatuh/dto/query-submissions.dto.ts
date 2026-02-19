/**
 * Integration 6: SISKOPATUH Query Submissions DTO
 */

import { IsEnum, IsOptional, IsUUID, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SubmissionType, SubmissionStatus } from "../domain";

export class QuerySubmissionsDto {
  @ApiPropertyOptional({
    description: "Filter by submission type",
    enum: SubmissionType,
  })
  @IsEnum(SubmissionType)
  @IsOptional()
  submission_type?: SubmissionType;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: SubmissionStatus,
  })
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;

  @ApiPropertyOptional({
    description: "Filter by jamaah ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  @IsOptional()
  jamaah_id?: string;

  @ApiPropertyOptional({
    description: "Filter by package ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  @IsOptional()
  package_id?: string;

  @ApiPropertyOptional({
    description: "Page number",
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page",
    example: 20,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
