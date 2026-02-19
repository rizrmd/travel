/**
 * Epic 12, Story 12.3: Compliance Report Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ComplianceReportType,
  ComplianceReportStatus,
} from "../domain/compliance-metrics";

export class ComplianceReportResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({
    enum: ComplianceReportType,
    example: ComplianceReportType.CONTRACTS_SUMMARY,
  })
  reportType: ComplianceReportType;

  @ApiProperty({ example: "2024-01-01T00:00:00Z" })
  periodStart: Date;

  @ApiProperty({ example: "2024-12-31T23:59:59Z" })
  periodEnd: Date;

  @ApiProperty({
    enum: ComplianceReportStatus,
    example: ComplianceReportStatus.COMPLETED,
  })
  status: ComplianceReportStatus;

  @ApiPropertyOptional({
    example: "https://storage.example.com/reports/report.pdf",
  })
  fileUrl?: string;

  @ApiProperty({ example: {} })
  metadata: Record<string, any>;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  generatedById: string;

  @ApiPropertyOptional({ example: "2024-12-31T23:59:59Z" })
  generatedAt?: Date;

  @ApiProperty({ example: "2024-12-31T23:00:00Z" })
  createdAt: Date;
}
