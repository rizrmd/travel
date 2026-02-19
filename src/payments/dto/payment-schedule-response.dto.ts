/**
 * Epic 7, Story 7.2: Payment Schedule Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ScheduleStatus } from "../domain/payment-schedule";

export class PaymentScheduleResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  jamaahId: string;

  @ApiProperty({ example: 1 })
  installmentNumber: number;

  @ApiProperty({ example: "2025-02-01" })
  dueDate: Date;

  @ApiProperty({ example: 5000000 })
  amount: number;

  @ApiProperty({ enum: ScheduleStatus })
  status: ScheduleStatus;

  @ApiPropertyOptional({ example: "2025-01-25T10:00:00Z" })
  paidAt: Date | null;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174003" })
  paymentId: string | null;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:05:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({ example: "Rp 5.000.000" })
  formattedAmount?: string;

  @ApiPropertyOptional({ example: "1 Februari 2025" })
  formattedDueDate?: string;

  @ApiPropertyOptional({ example: "Menunggu Pembayaran" })
  statusDisplay?: string;

  @ApiPropertyOptional({ example: "yellow" })
  statusColor?: "green" | "yellow" | "red" | "gray";

  @ApiPropertyOptional({ example: 3 })
  daysUntilDue?: number;

  @ApiPropertyOptional({ example: true })
  isDueSoon?: boolean;

  @ApiPropertyOptional({ example: false })
  isOverdue?: boolean;
}
