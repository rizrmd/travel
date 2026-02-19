/**
 * Epic 5, Story 5.1: Update Jamaah DTO
 * Request DTO for updating a jamaah
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  IsObject,
} from "class-validator";
import { JamaahStatus, ServiceMode } from "../domain/jamaah";

export class UpdateJamaahDto {
  @ApiPropertyOptional({
    description: "Full name of the jamaah",
    example: "Ahmad Zainuddin",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({
    description: "Email address of the jamaah",
    example: "ahmad@example.com",
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    description: "Phone number of the jamaah",
    example: "+628123456789",
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({
    description: "Date of birth",
    example: "1990-01-15",
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: "Gender",
    example: "male",
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  @ApiPropertyOptional({
    description: "Address",
    example: "Jl. Merdeka No. 123, Jakarta",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: "Status of the jamaah",
    example: JamaahStatus.INTERESTED,
    enum: JamaahStatus,
  })
  @IsOptional()
  @IsEnum(JamaahStatus)
  status?: JamaahStatus;

  @ApiPropertyOptional({
    description: "Service mode for this jamaah",
    example: ServiceMode.SELF_SERVICE,
    enum: ServiceMode,
  })
  @IsOptional()
  @IsEnum(ServiceMode)
  serviceMode?: ServiceMode;

  @ApiPropertyOptional({
    description: "Additional metadata",
    example: { notes: "Updated contact information" },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
