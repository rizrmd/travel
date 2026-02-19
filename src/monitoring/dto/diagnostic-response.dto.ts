import { ApiProperty } from "@nestjs/swagger";
import {
  DiagnosticCheckType,
  DiagnosticStatus,
} from "../domain/diagnostic-result";

export class DiagnosticCheckResult {
  @ApiProperty({ description: "Check type", enum: DiagnosticCheckType })
  checkType: DiagnosticCheckType;

  @ApiProperty({ description: "Check type label" })
  checkTypeLabel: string;

  @ApiProperty({ description: "Status", enum: DiagnosticStatus })
  status: DiagnosticStatus;

  @ApiProperty({
    description: "Status color",
    enum: ["green", "yellow", "red"],
  })
  statusColor: string;

  @ApiProperty({ description: "Message" })
  message: string;

  @ApiProperty({ description: "Details" })
  details: Record<string, any>;

  @ApiProperty({ description: "Recommendation" })
  recommendation?: string;

  @ApiProperty({ description: "Auto-fix available" })
  autoFixAvailable: boolean;

  @ApiProperty({ description: "Duration in milliseconds" })
  durationMs: number;
}

export class DiagnosticResponseDto {
  @ApiProperty({ description: "Tenant ID" })
  tenantId: string | null;

  @ApiProperty({ description: "Overall status", enum: DiagnosticStatus })
  overallStatus: DiagnosticStatus;

  @ApiProperty({
    description: "Individual check results",
    type: [DiagnosticCheckResult],
  })
  checks: DiagnosticCheckResult[];

  @ApiProperty({ description: "Number of passed checks" })
  passedCount: number;

  @ApiProperty({ description: "Number of warnings" })
  warningCount: number;

  @ApiProperty({ description: "Number of failed checks" })
  failedCount: number;

  @ApiProperty({ description: "Total duration in milliseconds" })
  totalDurationMs: number;

  @ApiProperty({ description: "Run by user ID" })
  ranById: string;

  @ApiProperty({ description: "Run at" })
  ranAt: Date;
}
