/**
 * Epic 12, Story 12.2: Signature Status Response DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  SignatureStatus,
  SignerType,
  SignatureProvider,
  SignatureEvent,
} from "../domain/signature";

export class SignatureStatusResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174001" })
  contractId: string;

  @ApiProperty({ enum: SignerType, example: SignerType.JAMAAH })
  signerType: SignerType;

  @ApiProperty({ example: "Ahmad bin Abdullah" })
  signerName: string;

  @ApiProperty({ example: "ahmad@example.com" })
  signerEmail: string;

  @ApiProperty({ enum: SignatureProvider, example: SignatureProvider.PRIVYID })
  signatureProvider: SignatureProvider;

  @ApiProperty({ enum: SignatureStatus, example: SignatureStatus.SENT })
  status: SignatureStatus;

  @ApiPropertyOptional({ example: "2024-01-15T10:00:00Z" })
  sentAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T11:00:00Z" })
  viewedAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T12:00:00Z" })
  signedAt?: Date;

  @ApiPropertyOptional({ example: "2024-02-15T10:00:00Z" })
  expiresAt?: Date;

  @ApiProperty({ type: [Object], example: [] })
  events: SignatureEvent[];

  @ApiProperty({ example: 0 })
  reminderCount: number;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  updatedAt: Date;
}
