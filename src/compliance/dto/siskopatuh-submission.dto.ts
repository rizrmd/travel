/**
 * Epic 12, Story 12.6: SISKOPATUH Submission DTO (Stub)
 */

import { IsString, IsDateString, IsInt, IsDecimal } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SiskopathSubmissionDto {
  @ApiProperty({
    description: "Reporting period start",
    example: "2024-01-01T00:00:00Z",
  })
  @IsDateString()
  periodStart: string;

  @ApiProperty({
    description: "Reporting period end",
    example: "2024-01-31T23:59:59Z",
  })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({ description: "Total jamaah in period", example: 150 })
  @IsInt()
  totalJamaah: number;

  @ApiProperty({ description: "Total contracts signed", example: 145 })
  @IsInt()
  totalContracts: number;

  @ApiProperty({ description: "Total revenue", example: "3500000000" })
  @IsString()
  totalRevenue: string;

  @ApiProperty({ description: "Agency name", example: "PT Travel Umroh ABC" })
  @IsString()
  agencyName: string;

  @ApiProperty({ description: "Agency NPWP", example: "01.234.567.8-901.000" })
  @IsString()
  agencyNpwp: string;
}
