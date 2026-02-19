/**
 * Epic 7, Stories 7.4 & 7.5: Commission Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommissionStatus, CommissionLevel } from "../domain/commission";

export class CommissionResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  agentId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174003" })
  jamaahId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174004" })
  paymentId: string;

  @ApiProperty({ example: 5000000 })
  baseAmount: number;

  @ApiProperty({ example: 10.0 })
  commissionPercentage: number;

  @ApiProperty({ example: 500000 })
  commissionAmount: number;

  @ApiProperty({ enum: CommissionStatus })
  status: CommissionStatus;

  @ApiProperty({ enum: CommissionLevel })
  level: CommissionLevel;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174005" })
  originalAgentId: string | null;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:05:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({ example: "Rp 500.000" })
  formattedAmount?: string;

  @ApiPropertyOptional({ example: "Rp 5.000.000" })
  formattedBaseAmount?: string;

  @ApiPropertyOptional({ example: "Menunggu Persetujuan" })
  statusDisplay?: string;

  @ApiPropertyOptional({ example: "Penjualan Langsung" })
  levelDisplay?: string;

  @ApiPropertyOptional({ example: false })
  isDownlineCommission?: boolean;
}

export class CommissionSummaryDto {
  @ApiProperty({ example: 12500000 })
  totalEarned: number;

  @ApiProperty({ example: 500000 })
  totalPending: number;

  @ApiProperty({ example: 2000000 })
  totalApproved: number;

  @ApiProperty({ example: 10000000 })
  totalPaid: number;

  @ApiProperty({ example: 15 })
  directSalesCount: number;

  @ApiProperty({ example: 8 })
  downlineCommissionCount: number;

  @ApiProperty({ example: 3500000 })
  thisMonthEarnings: number;

  @ApiPropertyOptional({ example: "2025-11-30T10:00:00Z" })
  lastPayoutDate: Date | null;

  @ApiProperty({ example: 2000000 })
  lastPayoutAmount: number;
}
