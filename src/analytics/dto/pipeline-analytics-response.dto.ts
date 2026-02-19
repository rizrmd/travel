/**
 * Epic 11, Story 11.3 & 11.6: Pipeline Analytics Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  PipelineAnalytics,
  PipelineBreakdown,
  PipelineFunnel,
  FunnelStage,
  AgentPipeline,
  PackagePipeline,
  KanbanColumn,
  KanbanCard,
} from "../domain/pipeline-analytics";

export class PipelineBreakdownDto implements PipelineBreakdown {
  @ApiProperty({ example: "lead" })
  status: string;

  @ApiProperty({ example: "Prospek" })
  statusLabel: string;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 450000000 })
  totalValue: number;

  @ApiProperty({ example: 45000000 })
  weightedValue: number;

  @ApiProperty({ example: 10 })
  likelihood: number;

  @ApiProperty({ example: 30000000 })
  averageDealSize: number;
}

export class FunnelStageDto implements FunnelStage {
  @ApiProperty({ example: "lead" })
  stage: string;

  @ApiProperty({ example: "Prospek" })
  label: string;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 450000000 })
  value: number;

  @ApiProperty({ example: 66.7, nullable: true })
  conversionFromPrevious: number | null;
}

export class PipelineFunnelDto implements PipelineFunnel {
  @ApiProperty({ type: [FunnelStageDto] })
  stages: FunnelStageDto[];

  @ApiProperty({
    example: {
      leadToInterested: 66.7,
      interestedToDeposit: 50.0,
      depositToPartial: 80.0,
      partialToFull: 90.0,
      overallConversion: 24.0,
    },
  })
  conversionRates: {
    leadToInterested: number;
    interestedToDeposit: number;
    depositToPartial: number;
    partialToFull: number;
    overallConversion: number;
  };
}

export class AgentPipelineDto implements AgentPipeline {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  agentId: string;

  @ApiProperty({ example: "Ahmad Zulkifli" })
  agentName: string;

  @ApiProperty({ example: 150000000 })
  totalPotential: number;

  @ApiProperty({ example: 45000000 })
  weightedPotential: number;

  @ApiProperty({ example: 5 })
  jamaahCount: number;

  @ApiProperty({ example: { lead: 2, interested: 1, deposit_paid: 2 } })
  statusBreakdown: Record<string, number>;
}

export class PackagePipelineDto implements PackagePipeline {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  packageId: string;

  @ApiProperty({ example: "Umroh Plus Turki 14 Hari" })
  packageName: string;

  @ApiProperty({ example: 200000000 })
  totalPotential: number;

  @ApiProperty({ example: 80000000 })
  weightedPotential: number;

  @ApiProperty({ example: 8 })
  jamaahCount: number;

  @ApiProperty({ example: { lead: 3, interested: 2, deposit_paid: 3 } })
  statusBreakdown: Record<string, number>;
}

export class PipelineAnalyticsResponseDto implements PipelineAnalytics {
  @ApiProperty({ example: 600000000 })
  totalPotential: number;

  @ApiProperty({ example: 180000000 })
  weightedPotential: number;

  @ApiProperty({ example: 25 })
  jamaahCount: number;

  @ApiProperty({ type: [PipelineBreakdownDto] })
  breakdown: PipelineBreakdownDto[];

  @ApiProperty({ type: PipelineFunnelDto })
  funnel: PipelineFunnelDto;

  @ApiProperty({ type: [AgentPipelineDto] })
  byAgent: AgentPipelineDto[];

  @ApiProperty({ type: [PackagePipelineDto] })
  byPackage: PackagePipelineDto[];
}

export class KanbanCardDto implements KanbanCard {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  jamaahId: string;

  @ApiProperty({ example: "Siti Aminah" })
  jamaahName: string;

  @ApiProperty({ example: "Umroh Plus Turki 14 Hari" })
  packageName: string;

  @ApiProperty({ example: 30000000 })
  packagePrice: number;

  @ApiProperty({ example: "Ahmad Zulkifli" })
  agentName: string;

  @ApiProperty({ example: "lead" })
  status: string;

  @ApiProperty({ example: "2024-12-01T00:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-12-15T00:00:00.000Z" })
  lastUpdated: Date;

  @ApiProperty({ example: 22 })
  daysSinceCreated: number;

  @ApiProperty({
    example: {
      email: "siti@example.com",
      phone: "08123456789",
      paymentProgress: 0,
    },
  })
  metadata: {
    email: string | null;
    phone: string | null;
    paymentProgress: number;
  };
}

export class KanbanColumnDto implements KanbanColumn {
  @ApiProperty({ example: "lead" })
  status: string;

  @ApiProperty({ example: "Prospek" })
  label: string;

  @ApiProperty({ type: [KanbanCardDto] })
  jamaahCards: KanbanCardDto[];

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 450000000 })
  totalValue: number;

  @ApiProperty({ example: "#94A3B8" })
  color: string;
}

export class KanbanBoardResponseDto {
  @ApiProperty({ type: [KanbanColumnDto] })
  columns: KanbanColumnDto[];

  @ApiProperty({ example: 50 })
  totalJamaah: number;

  @ApiProperty({ example: 1500000000 })
  totalValue: number;
}
