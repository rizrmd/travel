import { ApiProperty } from "@nestjs/swagger";

export class TrialUsageResponseDto {
  @ApiProperty({ description: "Trial ID" })
  trialId: string;

  @ApiProperty({ description: "Feature key" })
  featureKey: string;

  @ApiProperty({ description: "Current usage count" })
  currentUsage: number;

  @ApiProperty({ description: "Usage limit" })
  usageLimit: number | null;

  @ApiProperty({ description: "Usage percentage" })
  usagePercentage: number | null;

  @ApiProperty({ description: "Days remaining" })
  daysRemaining: number;

  @ApiProperty({ description: "Usage by day", type: "object" })
  usageByDay: Record<string, number>;

  @ApiProperty({ description: "Average daily usage" })
  averageDailyUsage: number;

  @ApiProperty({ description: "Projected usage at trial end" })
  projectedUsageAtEnd: number;

  @ApiProperty({ description: "Will exceed limit" })
  willExceedLimit: boolean;
}
