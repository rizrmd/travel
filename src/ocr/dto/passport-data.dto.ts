/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Passport extracted data DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class PassportDataDto {
  @ApiProperty({
    description: "Passport number",
    example: "A1234567",
  })
  @IsString()
  passportNumber: string;

  @ApiProperty({
    description: "Full name as shown on passport",
    example: "AHMAD RIZKI MAULANA",
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: "Nationality",
    example: "INDONESIA",
  })
  @IsString()
  nationality: string;

  @ApiProperty({
    description: "Date of birth (YYYY-MM-DD)",
    example: "1985-05-15",
  })
  @IsString()
  dateOfBirth: string;

  @ApiProperty({
    description: "Place of birth",
    example: "JAKARTA",
  })
  @IsString()
  placeOfBirth: string;

  @ApiProperty({
    description: "Gender",
    example: "M",
    enum: ["M", "F"],
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: "Date of issue (YYYY-MM-DD)",
    example: "2020-01-15",
  })
  @IsString()
  dateOfIssue: string;

  @ApiProperty({
    description: "Date of expiry (YYYY-MM-DD)",
    example: "2025-01-15",
  })
  @IsString()
  dateOfExpiry: string;

  @ApiProperty({
    description: "Place of issue",
    example: "JAKARTA",
  })
  @IsString()
  @IsOptional()
  placeOfIssue?: string;

  @ApiProperty({
    description: "MRZ (Machine Readable Zone) line 1",
    example: "P<IDNMAULANA<<AHMAD<RIZKI<<<<<<<<<<<<<<<<<<",
  })
  @IsString()
  @IsOptional()
  mrzLine1?: string;

  @ApiProperty({
    description: "MRZ (Machine Readable Zone) line 2",
    example: "A12345678IDN8505155M2501154<<<<<<<<<<<<<<04",
  })
  @IsString()
  @IsOptional()
  mrzLine2?: string;

  @ApiProperty({
    description: "OCR confidence score (0-100)",
    example: 92.8,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceScore: number;

  @ApiProperty({
    description: "Passport type",
    example: "P",
    required: false,
  })
  @IsString()
  @IsOptional()
  passportType?: string;
}
