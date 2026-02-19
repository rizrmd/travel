/**
 * Epic 12, Story 12.3: Compliance Report Query DTO
 */

import { IsEnum, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ComplianceReportType } from "../domain/compliance-metrics";

export class ComplianceReportQueryDto {
  @ApiProperty({
    enum: ComplianceReportType,
    example: ComplianceReportType.CONTRACTS_SUMMARY,
  })
  @IsEnum(ComplianceReportType)
  reportType: ComplianceReportType;

  @ApiProperty({
    description: "Period start date (ISO 8601)",
    example: "2024-01-01T00:00:00Z",
  })
  @IsDateString()
  periodStart: string;

  @ApiProperty({
    description: "Period end date (ISO 8601)",
    example: "2024-12-31T23:59:59Z",
  })
  @IsDateString()
  periodEnd: string;
}
