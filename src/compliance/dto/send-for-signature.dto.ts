/**
 * Epic 12, Story 12.2: Send for Signature DTO
 */

import { IsArray, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SignerType, SignatureProvider } from "../domain/signature";

export class SignerDto {
  @ApiProperty({ enum: SignerType, example: SignerType.JAMAAH })
  @IsEnum(SignerType)
  signerType: SignerType;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  signerId: string;

  @ApiProperty({ example: "Ahmad bin Abdullah" })
  signerName: string;

  @ApiProperty({ example: "ahmad@example.com" })
  signerEmail: string;
}

export class SendForSignatureDto {
  @ApiProperty({ type: [SignerDto], description: "List of signers" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignerDto)
  signers: SignerDto[];

  @ApiPropertyOptional({
    enum: SignatureProvider,
    example: SignatureProvider.PRIVYID,
    default: SignatureProvider.MANUAL,
  })
  @IsOptional()
  @IsEnum(SignatureProvider)
  signatureProvider?: SignatureProvider;
}
