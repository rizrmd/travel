/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Quality validation DTOs
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class QualityCheckResultDto {
  @ApiProperty({
    description: "Whether the check passed",
    example: true,
  })
  @IsBoolean()
  passed: boolean;

  @ApiProperty({
    description: "Actual value measured",
    example: 150,
  })
  value: number | string;

  @ApiProperty({
    description: "Threshold or expected value",
    example: "50-200",
  })
  @IsString()
  threshold: string;

  @ApiProperty({
    description: "Descriptive message about the result",
    example: "OK",
  })
  @IsString()
  message: string;
}

export class QualityValidationDto {
  @ApiProperty({
    description: "Overall validation result - all checks must pass",
    example: true,
  })
  @IsBoolean()
  passed: boolean;

  @ApiProperty({
    description: "Individual quality checks",
    type: "object",
    properties: {
      brightness: { type: "object" },
      blur: { type: "object" },
      resolution: { type: "object" },
      orientation: { type: "object" },
    },
  })
  @IsObject()
  checks: {
    brightness: QualityCheckResultDto;
    blur: QualityCheckResultDto;
    resolution: QualityCheckResultDto;
    orientation: QualityCheckResultDto;
  };

  @ApiProperty({
    description: "Recommendations for improving document quality",
    type: [String],
    example: ["Foto ulang dengan pencahayaan yang lebih baik"],
  })
  @IsArray()
  recommendations: string[];
}
