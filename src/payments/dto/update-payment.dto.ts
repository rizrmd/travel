/**
 * Epic 7, Story 7.1: Update Payment DTO
 */

import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentStatus } from "../domain/payment";

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: "Payment status",
    enum: PaymentStatus,
    example: PaymentStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: "Additional notes",
    example: "Confirmed by admin",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class CancelPaymentDto {
  @ApiPropertyOptional({
    description: "Cancellation reason",
    example: "Duplicate transaction",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class RefundPaymentDto {
  @ApiPropertyOptional({
    description: "Refund reason",
    example: "Jamaah cancelled trip",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
