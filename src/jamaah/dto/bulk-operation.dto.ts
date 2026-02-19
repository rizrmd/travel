/**
 * Epic 5, Story 5.4: Bulk Operation DTO
 * Request and response DTOs for bulk operations
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsString,
  IsObject,
} from "class-validator";

/**
 * Bulk action types
 */
export enum BulkActionType {
  SEND_PAYMENT_REMINDER = "send_payment_reminder",
  REQUEST_DOCUMENTS = "request_documents",
  EXPORT_CSV = "export_csv",
  TRANSFER_JAMAAH = "transfer_jamaah",
  UPDATE_STATUS = "update_status",
  SEND_CUSTOM_MESSAGE = "send_custom_message",
}

/**
 * Bulk operation request DTO
 */
export class BulkOperationDto {
  @ApiProperty({
    description: "Bulk action type",
    enum: BulkActionType,
    example: BulkActionType.SEND_PAYMENT_REMINDER,
  })
  @IsEnum(BulkActionType)
  actionType: BulkActionType;

  @ApiProperty({
    description: "Array of jamaah IDs to perform action on (max 50)",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001",
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  jamaahIds: string[];

  @ApiPropertyOptional({
    description: "Additional parameters for the bulk action",
    example: { newAgentId: "323e4567-e89b-12d3-a456-426614174002" },
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}

/**
 * Transfer jamaah request DTO
 */
export class TransferJamaahDto {
  @ApiProperty({
    description: "Array of jamaah IDs to transfer (max 50)",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001",
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  jamaahIds: string[];

  @ApiProperty({
    description: "New agent ID to transfer jamaah to",
    example: "323e4567-e89b-12d3-a456-426614174002",
  })
  @IsUUID()
  newAgentId: string;

  @ApiPropertyOptional({
    description: "Reason for transfer",
    example: "Agent vacation leave",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * Send custom message request DTO
 */
export class SendCustomMessageDto {
  @ApiProperty({
    description: "Array of jamaah IDs to send message to (max 50)",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001",
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  jamaahIds: string[];

  @ApiProperty({
    description: "Message content",
    example: "Reminder: Please complete your document upload",
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: "Message type",
    enum: ["email", "whatsapp", "both"],
    default: "both",
  })
  @IsOptional()
  @IsEnum(["email", "whatsapp", "both"])
  messageType?: "email" | "whatsapp" | "both";
}

/**
 * Bulk operation result DTO
 */
export class BulkOperationResultDto {
  @ApiProperty({
    description: "Total number of jamaah selected",
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: "Number of successful operations",
    example: 9,
  })
  succeeded: number;

  @ApiProperty({
    description: "Number of failed operations",
    example: 1,
  })
  failed: number;

  @ApiPropertyOptional({
    description: "Job ID for tracking async operations",
    example: "423e4567-e89b-12d3-a456-426614174003",
  })
  jobId?: string;

  @ApiPropertyOptional({
    description: "Details of failed operations",
    example: [
      {
        jamaahId: "123e4567-e89b-12d3-a456-426614174000",
        reason: "No email address on file",
      },
    ],
  })
  errors?: Array<{
    jamaahId: string;
    reason: string;
  }>;

  @ApiPropertyOptional({
    description: "Download URL for export operations",
    example: "https://example.com/exports/jamaah-export-2025-12-22.csv",
  })
  downloadUrl?: string;
}
