/**
 * Epic 12, Story 12.3: Compliance Dashboard Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ContractMetricsDto {
  @ApiProperty({ example: 150 })
  totalContracts: number;

  @ApiProperty({ example: 120 })
  signedContracts: number;

  @ApiProperty({ example: 25 })
  pendingSignatures: number;

  @ApiProperty({ example: 3 })
  expiredContracts: number;

  @ApiProperty({ example: 2 })
  cancelledContracts: number;

  @ApiProperty({ example: 80.0 })
  complianceRate: number;

  @ApiProperty({ example: 5.5 })
  averageSigningTime: number;
}

export class FinancialMetricsDto {
  @ApiProperty({ example: 200 })
  totalTransactions: number;

  @ApiProperty({ example: 5000000000 })
  totalAmount: number;

  @ApiProperty({ example: 25000000 })
  averageTransactionAmount: number;

  @ApiProperty({ example: 180 })
  transactionsWithContracts: number;

  @ApiProperty({ example: 20 })
  transactionsWithoutContracts: number;

  @ApiProperty({ example: 90.0 })
  financialComplianceRate: number;
}

export class AuditMetricsDto {
  @ApiProperty({ example: 1500 })
  totalLogs: number;

  @ApiProperty({ example: 250 })
  criticalOperations: number;

  @ApiProperty({ example: 600 })
  financialTransactions: number;

  @ApiProperty({ example: 400 })
  contractOperations: number;

  @ApiProperty({ example: 50 })
  dataExports: number;

  @ApiPropertyOptional({ example: "2024-01-01T00:00:00Z" })
  oldestLog?: Date;

  @ApiPropertyOptional({ example: "2024-12-31T23:59:59Z" })
  newestLog?: Date;

  @ApiProperty({ example: true })
  retentionCompliance: boolean;
}

export class ComplianceStatusDto {
  @ApiProperty({
    example: "compliant",
    enum: ["compliant", "needs_attention", "non_compliant"],
  })
  overall: "compliant" | "needs_attention" | "non_compliant";

  @ApiProperty({ example: true })
  contractCompliance: boolean;

  @ApiProperty({ example: true })
  financialCompliance: boolean;

  @ApiProperty({ example: true })
  auditCompliance: boolean;

  @ApiProperty({ type: [String], example: [] })
  issues: string[];

  @ApiProperty({ type: [String], example: [] })
  recommendations: string[];
}

export class ComplianceDashboardResponseDto {
  @ApiProperty({ type: ContractMetricsDto })
  contractMetrics: ContractMetricsDto;

  @ApiProperty({ type: FinancialMetricsDto })
  financialMetrics: FinancialMetricsDto;

  @ApiProperty({ type: AuditMetricsDto })
  auditMetrics: AuditMetricsDto;

  @ApiProperty({ type: ComplianceStatusDto })
  complianceStatus: ComplianceStatusDto;

  @ApiProperty({ example: "2024-01-01T00:00:00Z" })
  periodStart: Date;

  @ApiProperty({ example: "2024-12-31T23:59:59Z" })
  periodEnd: Date;

  @ApiProperty({ example: "2024-12-31T23:59:59Z" })
  generatedAt: Date;
}
