/**
 * Epic 6, Story 6.3: Batch Upload Response DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { BatchUploadStatus } from "../domain/batch-upload";

export class BatchUploadResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  jobId: string;

  @ApiProperty({ enum: BatchUploadStatus, example: BatchUploadStatus.PENDING })
  status: BatchUploadStatus;

  @ApiProperty({ example: "Batch upload job created successfully" })
  message: string;
}

export class BatchUploadStatusDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  jobId: string;

  @ApiProperty({
    enum: BatchUploadStatus,
    example: BatchUploadStatus.PROCESSING,
  })
  status: BatchUploadStatus;

  @ApiProperty({ example: 100 })
  totalFiles: number;

  @ApiProperty({ example: 50 })
  processedFiles: number;

  @ApiProperty({ example: 45 })
  successfulFiles: number;

  @ApiProperty({ example: 5 })
  failedFiles: number;

  @ApiProperty({ example: 50 })
  progress: number;

  @ApiProperty({ example: 120, description: "Estimated seconds remaining" })
  estimatedTimeRemaining: number | null;

  @ApiProperty({ required: false })
  errorReport?: string;

  @ApiProperty({ example: "2025-12-23T10:30:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-23T10:35:00Z", required: false })
  completedAt?: Date;
}
