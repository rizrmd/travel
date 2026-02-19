/**
 * Epic 7, Story 7.6: Commission Payout Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PayoutStatus } from "../infrastructure/persistence/relational/entities/commission-payout.entity";

export class PayoutItemResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  payoutId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  agentId: string;

  @ApiProperty({ example: 2500000 })
  amount: number;

  @ApiPropertyOptional({ example: "BCA" })
  bankName: string | null;

  @ApiPropertyOptional({ example: "1234567890" })
  bankAccountNumber: string | null;

  @ApiPropertyOptional({ example: "Ahmad Surya" })
  bankAccountName: string | null;

  @ApiProperty({ enum: PayoutStatus })
  status: PayoutStatus;

  @ApiPropertyOptional({ example: "Transferred successfully" })
  notes: string | null;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  createdAt: Date;

  @ApiPropertyOptional({ example: "Rp 2.500.000" })
  formattedAmount?: string;
}

export class PayoutResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({ example: "2025-01-31" })
  payoutDate: Date;

  @ApiProperty({ example: 50000000 })
  totalAmount: number;

  @ApiProperty({ enum: PayoutStatus })
  status: PayoutStatus;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  createdById: string;

  @ApiPropertyOptional({
    example: "uploads/bank-confirmations/payout-2025-01.pdf",
  })
  bankConfirmationFile: string | null;

  @ApiPropertyOptional({ example: "January 2025 commission payout" })
  notes: string | null;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:05:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({ type: [PayoutItemResponseDto] })
  items?: PayoutItemResponseDto[];

  @ApiPropertyOptional({ example: "Rp 50.000.000" })
  formattedTotalAmount?: string;

  @ApiPropertyOptional({ example: 200 })
  agentCount?: number;
}

export class PayoutCsvExportDto {
  @ApiProperty({ example: "Ahmad Surya" })
  agentName: string;

  @ApiProperty({ example: "BCA" })
  bankName: string;

  @ApiProperty({ example: "1234567890" })
  accountNumber: string;

  @ApiProperty({ example: 2500000 })
  amount: number;

  @ApiProperty({ example: "Rp 2.500.000" })
  formattedAmount: string;
}
