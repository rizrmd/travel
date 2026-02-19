/**
 * Integration 6: SISKOPATUH Webhook Payload DTO
 */

import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SubmissionStatus } from "../domain";

export class WebhookPayloadDto {
  @ApiProperty({
    description: "SISKOPATUH reference number",
    example: "JMRH-1703350000000",
  })
  @IsString()
  @IsNotEmpty()
  reference_number: string;

  @ApiProperty({
    description: "Submission status",
    enum: SubmissionStatus,
    example: SubmissionStatus.ACCEPTED,
  })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiProperty({
    description: "Status message from SISKOPATUH",
    example: "Data jamaah telah diverifikasi dan diterima",
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: "Error details if status is rejected or failed",
    required: false,
  })
  @IsString()
  @IsOptional()
  error_details?: string;

  @ApiProperty({
    description: "Webhook signature for verification",
    example: "sha256=1234567890abcdef...",
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: "Timestamp of the webhook event",
    example: "2024-01-15T10:30:00Z",
  })
  @IsString()
  @IsNotEmpty()
  timestamp: string;
}
