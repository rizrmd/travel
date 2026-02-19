/**
 * Epic 12, Story 12.6: SISKOPATUH Status Response DTO (Stub)
 */

import { ApiProperty } from "@nestjs/swagger";

export class SiskopathStatusResponseDto {
  @ApiProperty({ example: false })
  available: boolean;

  @ApiProperty({ example: "Integration coming in Phase 2" })
  message: string;

  @ApiProperty({ example: "Q2 2025" })
  estimatedLaunch: string;

  @ApiProperty({ example: null })
  submissionId: string | null;

  @ApiProperty({ example: null })
  status: string | null;
}
