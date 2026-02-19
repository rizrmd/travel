/**
 * Epic 13, Story 13.4: Mark Training Complete DTO
 */

import { IsInt, IsOptional, Min, Max, IsObject } from "class-validator";

export class MarkCompleteDto {
  @IsOptional()
  @IsInt({ message: "Progress harus berupa angka" })
  @Min(0, { message: "Progress minimal 0" })
  @Max(100, { message: "Progress maksimal 100" })
  progress_percentage?: number = 100;

  @IsOptional()
  @IsInt({ message: "Skor quiz harus berupa angka" })
  @Min(0, { message: "Skor minimal 0" })
  @Max(100, { message: "Skor maksimal 100" })
  quiz_score?: number;

  @IsOptional()
  @IsObject()
  metadata?: {
    notes?: string;
    quizAnswers?: Record<string, any>;
  };
}
