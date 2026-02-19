/**
 * Integration 4: Virtual Account Payment Gateway
 * DTO: Midtrans Webhook Notification
 *
 * This DTO represents the webhook payload from Midtrans
 * when a payment is received.
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class VaNumberDto {
  @ApiProperty({ example: "bca" })
  @IsString()
  @IsNotEmpty()
  bank: string;

  @ApiProperty({ example: "12345678901" })
  @IsString()
  @IsNotEmpty()
  va_number: string;
}

export class MidtransNotificationDto {
  @ApiProperty({
    description: "Transaction ID from Midtrans",
    example: "TRX-1234567890",
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: "Order ID sent during VA creation",
    example: "VA-abc123-1234567890",
  })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({
    description: "Transaction status",
    example: "settlement",
  })
  @IsString()
  @IsNotEmpty()
  transaction_status: string;

  @ApiProperty({
    description: "Status code",
    example: "200",
  })
  @IsString()
  @IsNotEmpty()
  status_code: string;

  @ApiProperty({
    description: "Gross amount",
    example: "30000000.00",
  })
  @IsString()
  @IsNotEmpty()
  gross_amount: string;

  @ApiProperty({
    description: "Payment type",
    example: "bank_transfer",
  })
  @IsString()
  @IsNotEmpty()
  payment_type: string;

  @ApiPropertyOptional({
    description: "Transaction time",
    example: "2024-12-23 10:30:00",
  })
  @IsOptional()
  @IsString()
  transaction_time?: string;

  @ApiPropertyOptional({
    description: "Settlement time",
    example: "2024-12-23 10:30:05",
  })
  @IsOptional()
  @IsString()
  settlement_time?: string;

  @ApiPropertyOptional({
    description: "VA numbers array",
    type: [VaNumberDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaNumberDto)
  va_numbers?: VaNumberDto[];

  @ApiPropertyOptional({
    description: "Permata VA number (alternative format)",
    example: "1234567890123",
  })
  @IsOptional()
  @IsString()
  permata_va_number?: string;

  @ApiProperty({
    description: "Signature key for verification",
    example: "abc123...",
  })
  @IsString()
  @IsNotEmpty()
  signature_key: string;

  @ApiPropertyOptional({
    description: "Fraud status",
    example: "accept",
  })
  @IsOptional()
  @IsString()
  fraud_status?: string;

  @ApiPropertyOptional({
    description: "Currency",
    example: "IDR",
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
