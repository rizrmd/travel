/**
 * Epic 12, Story 12.1: Generate Contract DTO
 */

import { IsUUID, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContractType } from "../domain/contract";

export class GenerateContractDto {
  @ApiProperty({
    description: "Jamaah ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  jamaahId: string;

  @ApiProperty({
    description: "Package ID",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  packageId: string;

  @ApiPropertyOptional({
    description: "Contract type (auto-determined from package if not provided)",
    enum: ContractType,
    example: ContractType.WAKALAH_BIL_UJRAH_STANDARD,
  })
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @ApiPropertyOptional({
    description: "Template version",
    example: "1.0",
    default: "1.0",
  })
  @IsOptional()
  @IsString()
  templateVersion?: string;
}
