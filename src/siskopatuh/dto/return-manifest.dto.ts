/**
 * Integration 6: SISKOPATUH Return Manifest DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class ReturnFlightDetailsDto {
  @ApiProperty({
    description: "Airline name",
    example: "Garuda Indonesia",
  })
  @IsString()
  @IsNotEmpty()
  maskapai: string;

  @ApiProperty({
    description: "Flight number",
    example: "GA851",
  })
  @IsString()
  @IsNotEmpty()
  nomor_penerbangan: string;

  @ApiProperty({
    description: "Departure airport",
    example: "JED - King Abdulaziz International Airport",
  })
  @IsString()
  @IsNotEmpty()
  bandara_keberangkatan: string;

  @ApiProperty({
    description: "Arrival airport",
    example: "CGK - Soekarno-Hatta International Airport",
  })
  @IsString()
  @IsNotEmpty()
  bandara_tujuan: string;

  @ApiProperty({
    description: "Departure date and time",
    example: "2024-06-28T20:00:00Z",
  })
  @IsDateString()
  waktu_keberangkatan: string;

  @ApiProperty({
    description: "Arrival date and time",
    example: "2024-06-29T11:30:00Z",
  })
  @IsDateString()
  waktu_tiba: string;
}

class JamaahReturnStatusDto {
  @ApiProperty({
    description: "Jamaah ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  jamaah_id: string;

  @ApiProperty({
    description: "NIK",
    example: "3174012801900001",
  })
  @IsString()
  @IsNotEmpty()
  nik: string;

  @ApiProperty({
    description: "Full name",
    example: "Ahmad Fauzi",
  })
  @IsString()
  @IsNotEmpty()
  nama_lengkap: string;

  @ApiProperty({
    description: "Passport number",
    example: "A1234567",
  })
  @IsString()
  @IsNotEmpty()
  nomor_paspor: string;

  @ApiProperty({
    description: "Return status",
    example: "returned",
    enum: ["returned", "extended", "not_returned"],
  })
  @IsEnum(["returned", "extended", "not_returned"])
  status_kepulangan: string;

  @ApiProperty({
    description: "Seat number",
    example: "12A",
    required: false,
  })
  @IsString()
  @IsOptional()
  nomor_kursi?: string;

  @ApiProperty({
    description: "Notes (required if status is extended or not_returned)",
    example: "Extended stay for 7 days due to family visit",
    required: false,
  })
  @IsString()
  @IsOptional()
  catatan?: string;
}

export class ReturnManifestDto {
  @ApiProperty({
    description: "Package ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  paket_id: string;

  @ApiProperty({
    description: "Original departure manifest reference",
    example: "DEPT-1703350000000",
  })
  @IsString()
  @IsNotEmpty()
  referensi_manifest_keberangkatan: string;

  @ApiProperty({
    description: "Actual return date",
    example: "2024-06-28",
  })
  @IsDateString()
  tanggal_kepulangan_aktual: string;

  @ApiProperty({
    description: "Return flight details",
    type: ReturnFlightDetailsDto,
  })
  @ValidateNested()
  @Type(() => ReturnFlightDetailsDto)
  detail_penerbangan: ReturnFlightDetailsDto;

  @ApiProperty({
    description: "List of jamaah with return status",
    type: [JamaahReturnStatusDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JamaahReturnStatusDto)
  daftar_jamaah: JamaahReturnStatusDto[];
}
