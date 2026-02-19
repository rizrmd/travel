import { ApiProperty } from "@nestjs/swagger";
import { FeatureKey, TrialStatus } from "../domain/feature-trial";

export class FeatureTrialResponseDto {
  @ApiProperty({ description: "Trial ID" })
  id: string;

  @ApiProperty({ description: "Tenant ID" })
  tenantId: string;

  @ApiProperty({ description: "Tenant name" })
  tenantName?: string;

  @ApiProperty({ description: "Feature key", enum: FeatureKey })
  featureKey: FeatureKey;

  @ApiProperty({ description: "Feature name" })
  featureName: string;

  @ApiProperty({ description: "Status", enum: TrialStatus })
  status: TrialStatus;

  @ApiProperty({ description: "Status label" })
  statusLabel: string;

  @ApiProperty({
    description: "Status color",
    enum: ["green", "yellow", "red", "gray"],
  })
  statusColor: string;

  @ApiProperty({ description: "Started at" })
  startedAt: Date;

  @ApiProperty({ description: "Expires at" })
  expiresAt: Date;

  @ApiProperty({ description: "Days remaining" })
  daysRemaining: number;

  @ApiProperty({ description: "Usage count" })
  usageCount: number;

  @ApiProperty({ description: "Usage limit (null if unlimited)" })
  usageLimit: number | null;

  @ApiProperty({ description: "Usage percentage (null if unlimited)" })
  usagePercentage: number | null;

  @ApiProperty({ description: "Usage summary" })
  usageSummary: string;

  @ApiProperty({ description: "Trial progress percentage" })
  progressPercentage: number;

  @ApiProperty({ description: "Is active" })
  isActive: boolean;

  @ApiProperty({ description: "Is expiring soon (3 days)" })
  isExpiringSoon: boolean;

  @ApiProperty({ description: "Trial feedback" })
  trialFeedback?: string;

  @ApiProperty({ description: "Converted at" })
  convertedAt?: Date;
}
