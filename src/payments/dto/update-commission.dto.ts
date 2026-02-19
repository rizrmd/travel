/**
 * Epic 7, Story 7.4: Update Commission DTO
 */

import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CommissionStatus } from "../domain/commission";

export class UpdateCommissionDto {
  @ApiPropertyOptional({
    description: "Commission status",
    enum: CommissionStatus,
    example: CommissionStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;
}

export class ApproveCommissionDto {
  // Intentionally empty - approve action needs no params
  // But keeping DTO for future extensions
}

export class BulkApproveCommissionsDto {
  @ApiPropertyOptional({
    description: "Commission IDs to approve",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "123e4567-e89b-12d3-a456-426614174001",
    ],
    type: [String],
  })
  commissionIds: string[];
}
