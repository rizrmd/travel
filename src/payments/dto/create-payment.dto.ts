/**
 * Epic 7, Story 7.1: Create Payment DTO
 */

import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  MaxLength,
  Matches,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentMethod, PaymentType } from "../domain/payment";

export class CreatePaymentDto {
  @ApiProperty({
    description: "Jamaah ID who made the payment",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  jamaahId: string;

  @ApiProperty({
    description: "Package ID for the payment",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  packageId: string;

  @ApiProperty({
    description: "Payment amount in IDR",
    example: 5000000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: "Payment amount must be positive" })
  amount: number;

  @ApiProperty({
    description: "Payment method",
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: "Payment type",
    enum: PaymentType,
    example: PaymentType.INSTALLMENT,
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiPropertyOptional({
    description: "Bank transaction reference number",
    example: "TRX123456789",
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[A-Za-z0-9-_]+$/, {
    message:
      "Reference number can only contain letters, numbers, hyphens, and underscores",
  })
  referenceNumber?: string;

  @ApiProperty({
    description: "Payment date (ISO 8601 format)",
    example: "2025-12-23T10:00:00Z",
  })
  @IsDateString()
  paymentDate: string;

  @ApiPropertyOptional({
    description: "Additional notes",
    example: "Pembayaran cicilan bulan Januari",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
