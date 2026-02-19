/**
 * Epic 7, Story 7.1: Payment Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentMethod, PaymentType, PaymentStatus } from "../domain/payment";

export class PaymentResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  tenantId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174002" })
  jamaahId: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174003" })
  packageId: string;

  @ApiProperty({ example: 5000000 })
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentType })
  paymentType: PaymentType;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiPropertyOptional({ example: "TRX123456789" })
  referenceNumber: string | null;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  paymentDate: Date;

  @ApiPropertyOptional({ example: "Payment confirmed" })
  notes: string | null;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174004" })
  recordedById: string;

  @ApiProperty({ example: "2025-12-23T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:05:00Z" })
  updatedAt: Date;

  @ApiPropertyOptional({ example: "Rp 5.000.000" })
  formattedAmount?: string;

  @ApiPropertyOptional({ example: "Transfer Bank" })
  paymentMethodDisplay?: string;

  @ApiPropertyOptional({ example: "Cicilan" })
  paymentTypeDisplay?: string;
}
