/**
 * Epic 11, Story 11.2: Revenue Projection Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  RevenueProjection,
  MonthlyProjection,
  ProjectionAssumptions,
} from "../domain/revenue-projection";

export class MonthlyProjectionDto implements MonthlyProjection {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: "Januari" })
  monthName: string;

  @ApiProperty({ example: 50000000 })
  projectedRevenue: number;

  @ApiProperty({
    example: { lower: 42500000, upper: 57500000 },
  })
  confidence: {
    lower: number;
    upper: number;
  };
}

export class ProjectionBreakdownDto {
  @ApiProperty({ example: 35000000 })
  historicalComponent: number;

  @ApiProperty({ example: 27000000 })
  pendingInstallmentsComponent: number;

  @ApiProperty({ example: 9000000 })
  pipelinePotentialComponent: number;
}

export class RevenueProjectionResponseDto implements RevenueProjection {
  @ApiProperty({ example: 3 })
  months: number;

  @ApiProperty({ example: 150000000 })
  projectedRevenue: number;

  @ApiProperty({
    example: { lower: 127500000, upper: 172500000 },
  })
  confidenceInterval: {
    lower: number;
    upper: number;
  };

  @ApiProperty({ type: ProjectionBreakdownDto })
  breakdown: ProjectionBreakdownDto;

  @ApiProperty({
    example: {
      conversionRate: 0.3,
      paymentCompletionRate: 0.9,
      historicalWeight: 0.7,
      pendingWeight: 0.9,
      pipelineWeight: 0.3,
    },
  })
  assumptions: Required<ProjectionAssumptions>;

  @ApiProperty({ type: [MonthlyProjectionDto] })
  monthlyProjections: MonthlyProjectionDto[];
}
