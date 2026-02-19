/**
 * Integration 5: E-Signature Integration
 * DTO: Signature Response
 */

import { ApiProperty } from "@nestjs/swagger";
import { SignatureStatus } from "../../compliance/domain/contract";

export class SignatureResponseDto {
  @ApiProperty({
    description: "Contract ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  contractId: string;

  @ApiProperty({
    description: "Signature request ID from PrivyID",
    example: "SIG-1234567890",
  })
  signatureRequestId: string;

  @ApiProperty({
    description: "Signature URL for jamaah to sign",
    example: "https://sign.privy.id/sign/abc123",
  })
  signatureUrl: string;

  @ApiProperty({
    description: "Current signature status",
    enum: SignatureStatus,
    example: SignatureStatus.SENT,
  })
  status: SignatureStatus;

  @ApiProperty({
    description: "Expiration date of signature request",
    example: "2025-12-31T23:59:59Z",
  })
  expiresAt: Date;

  @ApiProperty({
    description: "Date when sent for signature",
    example: "2025-12-24T10:00:00Z",
  })
  sentAt: Date;

  @ApiProperty({
    description: "Date when signed (if completed)",
    example: "2025-12-25T14:30:00Z",
    required: false,
  })
  signedAt?: Date;

  @ApiProperty({
    description: "URL to signed document (if completed)",
    required: false,
  })
  signedDocumentUrl?: string;

  @ApiProperty({
    description: "URL to signature certificate (if completed)",
    required: false,
  })
  signatureCertificateUrl?: string;
}

export class SignatureStatusResponseDto {
  @ApiProperty({
    description: "E-signature integration enabled status",
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: "Current operation mode",
    enum: ["STUB", "PRODUCTION"],
    example: "STUB",
  })
  mode: "STUB" | "PRODUCTION";

  @ApiProperty({
    description: "E-signature provider name",
    example: "PrivyID",
  })
  provider: string;

  @ApiProperty({
    description: "Available features",
    example: ["digital_signature", "certificate", "audit_trail"],
  })
  features: string[];
}
