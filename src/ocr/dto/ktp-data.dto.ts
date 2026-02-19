/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * KTP (Indonesian ID Card) extracted data DTO
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class KtpDataDto {
  @ApiProperty({
    description: "NIK (Nomor Induk Kependudukan) - 16 digits",
    example: "3201234567890123",
  })
  @IsString()
  nik: string;

  @ApiProperty({
    description: "Full name as shown on KTP",
    example: "Ahmad Rizki Maulana",
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: "Place of birth",
    example: "Jakarta",
  })
  @IsString()
  placeOfBirth: string;

  @ApiProperty({
    description: "Date of birth (YYYY-MM-DD)",
    example: "1985-05-15",
  })
  @IsString()
  dateOfBirth: string;

  @ApiProperty({
    description: "Gender",
    example: "LAKI-LAKI",
    enum: ["LAKI-LAKI", "PEREMPUAN"],
  })
  @IsString()
  gender: string;

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
    description: "Religion",
    example: "ISLAM",
  })
  @IsString()
  religion: string;

  @ApiProperty({
    description: "Marital status",
    example: "KAWIN",
    enum: ["BELUM KAWIN", "KAWIN", "CERAI HIDUP", "CERAI MATI"],
  })
  @IsString()
  maritalStatus: string;

  @ApiProperty({
    description: "Occupation",
    example: "WIRASWASTA",
  })
  @IsString()
  occupation: string;

  @ApiProperty({
    description: "Nationality",
    example: "WNI",
  })
  @IsString()
  nationality: string;

  @ApiProperty({
    description: "Valid until",
    example: "SEUMUR HIDUP",
  })
  @IsString()
  validUntil: string;

  @ApiProperty({
    description: "OCR confidence score (0-100)",
    example: 95.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  confidenceScore: number;

  @ApiProperty({
    description: "Province",
    example: "DKI JAKARTA",
    required: false,
  })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({
    description: "City/Kabupaten",
    example: "JAKARTA PUSAT",
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;
}
