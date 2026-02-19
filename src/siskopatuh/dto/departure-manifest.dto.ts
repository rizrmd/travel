/**
 * Integration 6: SISKOPATUH Departure Manifest DTO
 */

import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class FlightDetailsDto {
  @ApiProperty({
    description: "Airline name",
    example: "Garuda Indonesia",
  })
  @IsString()
  @IsNotEmpty()
  maskapai: string;

  @ApiProperty({
    description: "Flight number",
    example: "GA850",
  })
  @IsString()
  @IsNotEmpty()
  nomor_penerbangan: string;

  @ApiProperty({
    description: "Departure airport",
    example: "CGK - Soekarno-Hatta International Airport",
  })
  @IsString()
  @IsNotEmpty()
  bandara_keberangkatan: string;

  @ApiProperty({
    description: "Arrival airport",
    example: "JED - King Abdulaziz International Airport",
  })
  @IsString()
  @IsNotEmpty()
  bandara_tujuan: string;

  @ApiProperty({
    description: "Departure date and time",
    example: "2024-06-15T08:00:00Z",
  })
  @IsDateString()
  waktu_keberangkatan: string;

  @ApiProperty({
    description: "Arrival date and time",
    example: "2024-06-15T17:30:00Z",
  })
  @IsDateString()
  waktu_tiba: string;
}

class HotelDetailsDto {
  @ApiProperty({
    description: "Hotel name in Makkah",
    example: "Hilton Makkah Convention Hotel",
  })
  @IsString()
  @IsNotEmpty()
  nama_hotel_makkah: string;

  @ApiProperty({
    description: "Hotel address in Makkah",
    example: "Al Hujun, Makkah 24231, Saudi Arabia",
  })
  @IsString()
  @IsNotEmpty()
  alamat_hotel_makkah: string;

  @ApiProperty({
    description: "Distance from Masjidil Haram (meters)",
    example: 500,
  })
  @IsNumber()
  jarak_masjidil_haram: number;

  @ApiProperty({
    description: "Hotel name in Madinah",
    example: "Oberoi Madinah",
  })
  @IsString()
  @IsNotEmpty()
  nama_hotel_madinah: string;

  @ApiProperty({
    description: "Hotel address in Madinah",
    example: "King Fahd Road, Madinah 42311, Saudi Arabia",
  })
  @IsString()
  @IsNotEmpty()
  alamat_hotel_madinah: string;

  @ApiProperty({
    description: "Distance from Masjid Nabawi (meters)",
    example: 300,
  })
  @IsNumber()
  jarak_masjid_nabawi: number;
}

class MuthawifDetailsDto {
  @ApiProperty({
    description: "Muthawif name",
    example: "Abdullah Al-Saud",
  })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({
    description: "Muthawif license number",
    example: "MTH-2024-001234",
  })
  @IsString()
  @IsNotEmpty()
  nomor_lisensi: string;

  @ApiProperty({
    description: "Muthawif phone number",
    example: "+966501234567",
  })
  @IsString()
  @IsNotEmpty()
  nomor_telepon: string;

  @ApiProperty({
    description: "Muthawif company",
    example: "Al-Rahmah Tours & Travel",
  })
  @IsString()
  @IsNotEmpty()
  perusahaan: string;
}

class JamaahManifestItemDto {
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
    description: "Seat number",
    example: "12A",
    required: false,
  })
  @IsString()
  @IsOptional()
  nomor_kursi?: string;
}

export class DepartureManifestDto {
  @ApiProperty({
    description: "Package ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  paket_id: string;

  @ApiProperty({
    description: "Package name",
    example: "Umroh Premium Ramadan 2024",
  })
  @IsString()
  @IsNotEmpty()
  nama_paket: string;

  @ApiProperty({
    description: "Departure date",
    example: "2024-06-15",
  })
  @IsDateString()
  tanggal_keberangkatan: string;

  @ApiProperty({
    description: "Expected return date",
    example: "2024-06-28",
  })
  @IsDateString()
  tanggal_kepulangan_rencana: string;

  @ApiProperty({
    description: "Total jamaah count",
    example: 45,
  })
  @IsNumber()
  jumlah_jamaah: number;

  @ApiProperty({
    description: "Flight details",
    type: FlightDetailsDto,
  })
  @ValidateNested()
  @Type(() => FlightDetailsDto)
  detail_penerbangan: FlightDetailsDto;

  @ApiProperty({
    description: "Hotel details",
    type: HotelDetailsDto,
  })
  @ValidateNested()
  @Type(() => HotelDetailsDto)
  detail_hotel: HotelDetailsDto;

  @ApiProperty({
    description: "Muthawif details",
    type: MuthawifDetailsDto,
  })
  @ValidateNested()
  @Type(() => MuthawifDetailsDto)
  detail_muthawif: MuthawifDetailsDto;

  @ApiProperty({
    description: "List of jamaah in manifest",
    type: [JamaahManifestItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JamaahManifestItemDto)
  daftar_jamaah: JamaahManifestItemDto[];
}
