/**
 * Integration 5: E-Signature Integration
 * DTO: PrivyID Webhook Payload
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsObject,
  IsOptional,
  IsDateString,
  IsEnum,
} from "class-validator";
import { SignatureEventType } from "../domain";

export class SignatureWebhookDto {
  @ApiProperty({
    description: "Signature request ID from PrivyID",
    example: "SIG-1234567890",
  })
  @IsString()
  signature_request_id: string;

  @ApiProperty({
    description: "Event type",
    enum: SignatureEventType,
    example: SignatureEventType.SIGNED,
  })
  @IsEnum(SignatureEventType)
  event: SignatureEventType;

  @ApiProperty({
    description: "Timestamp when signature was completed",
    example: "2025-12-24T10:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  signed_at?: string;

  @ApiProperty({
    description: "Signer email address",
    example: "jamaah@example.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  signer_email?: string;

  @ApiProperty({
    description: "Signer name",
    required: false,
  })
  @IsOptional()
  @IsString()
  signer_name?: string;

  @ApiProperty({
    description: "IP address of signer",
    required: false,
  })
  @IsOptional()
  @IsString()
  ip_address?: string;

  @ApiProperty({
    description: "User agent of signer browser",
    required: false,
  })
  @IsOptional()
  @IsString()
  user_agent?: string;

  @ApiProperty({
    description: "Timestamp when event occurred",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  occurred_at?: string;

  @ApiProperty({
    description: "Additional metadata",
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
