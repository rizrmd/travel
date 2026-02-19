/**
 * Epic 6, Story 6.5: Bulk Approval DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMaxSize,
  ArrayMinSize,
  MinLength,
} from "class-validator";
import { ReviewAction } from "../domain/document-review";

export class BulkApprovalDto {
  @ApiProperty({
    description: "Array of document IDs to process",
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174000",
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one document ID is required" })
  @ArrayMaxSize(50, {
    message: "Maximum 50 documents can be processed at once",
  })
  @IsUUID("4", { each: true })
  documentIds: string[];

  @ApiProperty({
    description: "Action to perform",
    enum: ReviewAction,
    example: ReviewAction.APPROVE,
  })
  @IsEnum(ReviewAction)
  action: ReviewAction;

  @ApiProperty({
    description: "Rejection reason (required for reject action)",
    example: "Documents do not meet quality standards",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Rejection reason must be at least 5 characters" })
  rejectionReason?: string;
}
