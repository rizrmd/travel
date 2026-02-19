import { ApiProperty } from "@nestjs/swagger";
import { AnomalyType, AnomalySeverity, AnomalyStatus } from "../domain/anomaly";

export class AnomalyResponseDto {
  @ApiProperty({ description: "Anomaly ID" })
  id: string;

  @ApiProperty({ description: "Tenant ID (null for system-wide)" })
  tenantId: string | null;

  @ApiProperty({ description: "Anomaly type", enum: AnomalyType })
  anomalyType: AnomalyType;

  @ApiProperty({ description: "Severity", enum: AnomalySeverity })
  severity: AnomalySeverity;

  @ApiProperty({ description: "Description" })
  description: string;

  @ApiProperty({ description: "Status", enum: AnomalyStatus })
  status: AnomalyStatus;

  @ApiProperty({ description: "Metadata" })
  metadata: Record<string, any>;

  @ApiProperty({ description: "Detected at" })
  detectedAt: Date;

  @ApiProperty({ description: "Resolved at" })
  resolvedAt?: Date;

  @ApiProperty({ description: "Resolution notes" })
  resolutionNotes?: string;

  @ApiProperty({ description: "Recommended actions", type: [String] })
  recommendedActions: string[];

  @ApiProperty({ description: "Requires immediate action" })
  requiresImmediateAction: boolean;
}
