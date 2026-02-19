/**
 * Integration 6: SISKOPATUH Create Submission DTO
 */

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { SubmissionType } from "../domain";
import { JamaahRegistrationDto } from "./jamaah-registration.dto";
import { DepartureManifestDto } from "./departure-manifest.dto";
import { ReturnManifestDto } from "./return-manifest.dto";

export class CreateSubmissionDto {
  @ApiProperty({
    description: "Type of submission",
    enum: SubmissionType,
    example: SubmissionType.JAMAAH_REGISTRATION,
  })
  @IsEnum(SubmissionType)
  @IsNotEmpty()
  submission_type: SubmissionType;

  @ApiProperty({
    description: "Jamaah ID (required for jamaah_registration)",
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  jamaah_id?: string;

  @ApiProperty({
    description: "Package ID (required for manifests)",
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  package_id?: string;

  @ApiProperty({
    description: "Jamaah registration data",
    type: JamaahRegistrationDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => JamaahRegistrationDto)
  @IsOptional()
  jamaah_data?: JamaahRegistrationDto;

  @ApiProperty({
    description: "Departure manifest data",
    type: DepartureManifestDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => DepartureManifestDto)
  @IsOptional()
  departure_data?: DepartureManifestDto;

  @ApiProperty({
    description: "Return manifest data",
    type: ReturnManifestDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ReturnManifestDto)
  @IsOptional()
  return_data?: ReturnManifestDto;
}
