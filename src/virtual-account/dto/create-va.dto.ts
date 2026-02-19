/**
 * Integration 4: Virtual Account Payment Gateway
 * DTO: Create Virtual Account Request
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNumber, IsPositive, Min } from "class-validator";
import { BankCode } from "../domain/bank-code.enum";

export class CreateVaDto {
  @ApiProperty({
    description: "Bank code for virtual account",
    enum: BankCode,
    example: BankCode.BCA,
  })
  @IsEnum(BankCode, { message: "Bank code must be valid" })
  bankCode: BankCode;

  @ApiPropertyOptional({
    description:
      "Amount for the virtual account (optional, defaults to package price)",
    example: 30000000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: "Amount must be a number" })
  @IsPositive({ message: "Amount must be positive" })
  @Min(10000, { message: "Minimum amount is Rp 10,000" })
  amount?: number;
}
