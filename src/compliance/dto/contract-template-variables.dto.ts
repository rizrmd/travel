/**
 * Epic 12, Story 12.1: Contract Template Variables DTO
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PaymentScheduleItemDto {
  @ApiProperty({ example: 1 })
  installmentNumber: number;

  @ApiProperty({ example: "2024-02-15" })
  dueDate: string;

  @ApiProperty({ example: "Rp 10.000.000" })
  amount: string;
}

export class ContractTemplateVariablesDto {
  // Contract metadata
  @ApiProperty({ example: "TU-ABC-2024-000001" })
  contractNumber: string;

  @ApiProperty({ example: "15 Januari 2024" })
  contractDate: string;

  // Muwakkil (Jamaah) details
  @ApiProperty({ example: "Ahmad bin Abdullah" })
  jamaahName: string;

  @ApiProperty({ example: "3201234567890123" })
  jamaahKtp: string;

  @ApiProperty({ example: "Jl. Merdeka No. 123, Jakarta" })
  jamaahAddress: string;

  @ApiProperty({ example: "08123456789" })
  jamaahPhone: string;

  @ApiPropertyOptional({ example: "ahmad@example.com" })
  jamaahEmail?: string;

  // Wakil (Agency) details
  @ApiProperty({ example: "PT Travel Umroh ABC" })
  agencyName: string;

  @ApiProperty({ example: "01.234.567.8-901.000" })
  agencyNpwp: string;

  @ApiProperty({ example: "Jl. Sudirman No. 456, Jakarta" })
  agencyAddress: string;

  @ApiProperty({ example: "02187654321" })
  agencyPhone: string;

  @ApiProperty({ example: "Agent Ahmad" })
  agentName: string;

  // Package details
  @ApiProperty({ example: "Paket Umroh Reguler 12 Hari" })
  packageName: string;

  @ApiProperty({ example: "Standard" })
  packageType: string;

  @ApiProperty({ example: "1 Maret 2024" })
  departureDate: string;

  @ApiProperty({ example: "12 Maret 2024" })
  returnDate: string;

  @ApiProperty({ example: 12 })
  duration: number;

  // Financial details
  @ApiProperty({ example: "Rp 35.000.000" })
  totalAmount: string;

  @ApiProperty({ example: "Rp 3.500.000" })
  serviceFee: string;

  @ApiProperty({ example: "Rp 7.000.000" })
  depositAmount: string;

  @ApiProperty({ example: "Rp 28.000.000" })
  remainingAmount: string;

  // Payment schedule
  @ApiProperty({ type: [PaymentScheduleItemDto] })
  paymentSchedule: PaymentScheduleItemDto[];

  // Package inclusions/exclusions
  @ApiProperty({
    type: [String],
    example: ["Tiket pesawat PP", "Visa", "Hotel bintang 4"],
  })
  inclusions: string[];

  @ApiProperty({
    type: [String],
    example: ["Excess baggage", "Pengeluaran pribadi"],
  })
  exclusions: string[];

  // Hotel information
  @ApiProperty({ example: "Hotel Al-Shohada (Bintang 4)" })
  makkahHotel: string;

  @ApiProperty({ example: "Hotel Al-Iman (Bintang 4)" })
  madinahHotel: string;

  // Flight information
  @ApiProperty({ example: "Garuda Indonesia" })
  airline: string;

  @ApiProperty({ example: "Ekonomi" })
  flightClass: string;
}
