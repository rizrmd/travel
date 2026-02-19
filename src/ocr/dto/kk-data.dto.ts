/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * KK (Kartu Keluarga - Family Card) extracted data DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FamilyMemberDto {
  @ApiProperty({
    description: "NIK of family member",
    example: "3201234567890123",
  })
  @IsString()
  nik: string;

  @ApiProperty({
    description: "Full name",
    example: "Ahmad Rizki Maulana",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Relationship to head of family",
    example: "KEPALA KELUARGA",
  })
  @IsString()
  relationship: string;

  @ApiProperty({
    description: "Gender",
    example: "LAKI-LAKI",
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: "Date of birth",
    example: "1985-05-15",
  })
  @IsString()
  dateOfBirth: string;

  @ApiProperty({
    description: "Marital status",
    example: "KAWIN",
  })
  @IsString()
  @IsOptional()
  maritalStatus?: string;
}

export class KkDataDto {
  @ApiProperty({
    description: "Nomor KK (Family Card Number)",
    example: "3201234567890123",
  })
  @IsString()
  nomorKk: string;

  @ApiProperty({
    description: "Full address",
    example: "Jl. Sudirman No. 123",
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "RT/RW",
    example: "001/002",
  })
  @IsString()
  rtRw: string;

  @ApiProperty({
    description: "Kelurahan/Desa",
    example: "Menteng",
  })
  @IsString()
  kelurahan: string;

  @ApiProperty({
    description: "Kecamatan",
    example: "Menteng",
  })
  @IsString()
  kecamatan: string;

  @ApiProperty({
    description: "Kabupaten/Kota",
    example: "JAKARTA PUSAT",
  })
  @IsString()
  kabupatenKota: string;

  @ApiProperty({
    description: "Province",
    example: "DKI JAKARTA",
  })
  @IsString()
  province: string;

  @ApiProperty({
    description: "Postal code",
    example: "10310",
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: "Head of family name",
    example: "Ahmad Rizki Maulana",
  })
  @IsString()
  headOfFamilyName: string;

  @ApiProperty({
    description: "List of family members",
    type: [FamilyMemberDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  @IsOptional()
  members?: FamilyMemberDto[];

  @ApiProperty({
    description: "OCR confidence score (0-100)",
    example: 88.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceScore: number;
}
