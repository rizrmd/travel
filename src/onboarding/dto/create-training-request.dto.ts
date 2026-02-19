/**
 * Epic 13, Story 13.6: Create Training Request DTO
 */

import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { ContactMethod } from "../infrastructure/persistence/relational/entities/training-request.entity";

export class CreateTrainingRequestDto {
  @IsString({ message: "Topik harus berupa teks" })
  @MinLength(5, { message: "Topik minimal 5 karakter" })
  @MaxLength(500, { message: "Topik maksimal 500 karakter" })
  topic: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: "Pesan maksimal 2000 karakter" })
  message?: string;

  @IsOptional()
  @IsDateString({}, { message: "Format tanggal tidak valid (YYYY-MM-DD)" })
  preferred_date?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format waktu tidak valid (HH:MM)",
  })
  preferred_time?: string;

  @IsEnum(ContactMethod, {
    message:
      "Metode kontak harus salah satu dari: email, phone, whatsapp, zoom, in_person",
  })
  contact_method: ContactMethod;
}
