/**
 * Integration 6: SISKOPATUH Jamaah Registration DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
  Length,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class JamaahRegistrationDto {
  @ApiProperty({
    description: "NIK (Nomor Induk Kependudukan)",
    example: "3174012801900001",
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  @Matches(/^\d{16}$/, { message: "NIK must be 16 digits" })
  nik: string;

  @ApiProperty({
    description: "Full name as per KTP",
    example: "Ahmad Fauzi",
  })
  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @ApiProperty({
    description: "Date of birth",
    example: "1990-01-28",
  })
  @IsDateString()
  tanggal_lahir: string;

  @ApiProperty({
    description: "Gender",
    example: "L",
    enum: ["L", "P"],
  })
  @IsEnum(["L", "P"])
  jenis_kelamin: string;

  @ApiProperty({
    description: "Full address",
    example: "Jl. Sudirman No. 123, Jakarta Selatan",
  })
  @IsString()
  @IsNotEmpty()
  alamat: string;

  @ApiProperty({
    description: "Province",
    example: "DKI Jakarta",
  })
  @IsString()
  @IsNotEmpty()
  provinsi: string;

  @ApiProperty({
    description: "City/Regency",
    example: "Jakarta Selatan",
  })
  @IsString()
  @IsNotEmpty()
  kota_kabupaten: string;

  @ApiProperty({
    description: "Passport number",
    example: "A1234567",
  })
  @IsString()
  @IsNotEmpty()
  nomor_paspor: string;

  @ApiProperty({
    description: "Passport issue date",
    example: "2020-05-15",
  })
  @IsDateString()
  tanggal_terbit_paspor: string;

  @ApiProperty({
    description: "Passport expiry date",
    example: "2025-05-15",
  })
  @IsDateString()
  tanggal_berlaku_paspor: string;

  @ApiProperty({
    description: "Phone number",
    example: "081234567890",
  })
  @IsString()
  @IsNotEmpty()
  nomor_telepon: string;

  @ApiProperty({
    description: "Email address",
    example: "ahmad.fauzi@example.com",
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: "Emergency contact name",
    example: "Siti Fatimah",
  })
  @IsString()
  @IsNotEmpty()
  nama_kontak_darurat: string;

  @ApiProperty({
    description: "Emergency contact phone",
    example: "081298765432",
  })
  @IsString()
  @IsNotEmpty()
  telepon_kontak_darurat: string;

  @ApiProperty({
    description: "Relationship with emergency contact",
    example: "Istri",
  })
  @IsString()
  @IsNotEmpty()
  hubungan_kontak_darurat: string;

  @ApiProperty({
    description: "Package ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  paket_id: string;

  @ApiProperty({
    description: "Departure date",
    example: "2024-06-15",
  })
  @IsDateString()
  tanggal_keberangkatan: string;

  @ApiProperty({
    description: "Return date",
    example: "2024-06-28",
  })
  @IsDateString()
  tanggal_kepulangan: string;
}
