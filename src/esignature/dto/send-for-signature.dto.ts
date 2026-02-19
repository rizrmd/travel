/**
 * Integration 5: E-Signature Integration
 * DTO: Send Contract for Signature Request
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class SendForSignatureDto {
  @ApiProperty({
    description: "Contract ID to send for signature",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  contractId: string;

  @ApiProperty({
    description: "Signer email address",
    example: "jamaah@example.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  signerEmail?: string;

  @ApiProperty({
    description: "Signer phone number (Indonesian format)",
    example: "+628123456789",
    required: false,
  })
  @IsOptional()
  @IsString()
  signerPhone?: string;
}
