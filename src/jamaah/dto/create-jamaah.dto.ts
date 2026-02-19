/**
 * Epic 5, Story 5.1: Create Jamaah DTO
 * Request DTO for creating a new jamaah
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  MaxLength,
  IsPhoneNumber,
  IsObject,
} from "class-validator";
import { ServiceMode } from "../domain/jamaah";

export class CreateJamaahDto {
  @ApiProperty({
    description: "Package ID to assign jamaah to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  packageId: string;

  @ApiProperty({
    description: "Full name of the jamaah",
    example: "Ahmad Zainuddin",
  })
  @IsString()
  @MaxLength(255)
  fullName: string;

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
    enum: ["male", "female"],
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
    description: "Service mode for this jamaah",
    example: ServiceMode.AGENT_ASSISTED,
    enum: ServiceMode,
    default: ServiceMode.AGENT_ASSISTED,
  })
  @IsOptional()
  @IsEnum(ServiceMode)
  serviceMode?: ServiceMode;

  @ApiPropertyOptional({
    description: "Additional metadata",
    example: { referralSource: "WhatsApp", notes: "VIP customer" },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
