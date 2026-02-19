/**
 * Integration 4: Virtual Account Payment Gateway
 * DTO: Virtual Account Response
 */

import { ApiProperty } from "@nestjs/swagger";
import { BankCode, getBankName } from "../domain/bank-code.enum";
import { VAStatus, VAStatusNames } from "../domain/va-status.enum";

export class VaResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
  jamaahId: string;

  @ApiProperty({
    example: "12345678901",
    description: "Virtual account number",
  })
  vaNumber: string;

  @ApiProperty({
    enum: BankCode,
    example: BankCode.BCA,
    description: "Bank code",
  })
  bankCode: BankCode;

  @ApiProperty({ example: "Bank Central Asia (BCA)" })
  bankName: string;

  @ApiProperty({ example: 30000000, description: "Amount in IDR" })
  amount: number | null;

  @ApiProperty({
    enum: VAStatus,
    example: VAStatus.ACTIVE,
    description: "VA status",
  })
  status: VAStatus;

  @ApiProperty({ example: "Aktif" })
  statusDisplay: string;

  @ApiProperty({
    example: "2024-12-24T10:30:00Z",
    nullable: true,
    description: "Expiry time",
  })
  expiresAt: Date | null;

  @ApiProperty({ example: "2024-12-23T10:30:00Z" })
  createdAt: Date;

  static fromEntity(entity: any): VaResponseDto {
    const dto = new VaResponseDto();
    dto.id = entity.id;
    dto.jamaahId = entity.jamaah_id;
    dto.vaNumber = entity.va_number;
    dto.bankCode = entity.bank_code;
    dto.bankName = getBankName(entity.bank_code);
    dto.amount = entity.amount;
    dto.status = entity.status;
    dto.statusDisplay = VAStatusNames[entity.status];
    dto.expiresAt = entity.expires_at;
    dto.createdAt = entity.created_at;
    return dto;
  }
}

export class VaListResponseDto {
  @ApiProperty({ type: [VaResponseDto] })
  virtualAccounts: VaResponseDto[];

  @ApiProperty({ example: 3 })
  total: number;

  static fromEntities(entities: any[]): VaListResponseDto {
    const dto = new VaListResponseDto();
    dto.virtualAccounts = entities.map((e) => VaResponseDto.fromEntity(e));
    dto.total = entities.length;
    return dto;
  }
}
