/**
 * Integration 6: SISKOPATUH Compliance Report Query DTO
 */

import { IsDateString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ComplianceReportQueryDto {
  @ApiPropertyOptional({
    description: "Start date for report period",
    example: "2024-01-01",
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({
    description: "End date for report period",
    example: "2024-12-31",
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}
