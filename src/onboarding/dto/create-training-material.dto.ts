/**
 * Epic 13, Story 13.4: Create Training Material DTO
 */

import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  IsObject,
} from "class-validator";
import { TrainingCategory, ContentType } from "../domain/training-material";

export class CreateTrainingMaterialDto {
  @IsEnum(TrainingCategory, {
    message:
      "Kategori harus salah satu dari: video_tutorial, pdf_guide, faq, article",
  })
  category: TrainingCategory;

  @IsString({ message: "Judul harus berupa teks" })
  @MinLength(3, { message: "Judul minimal 3 karakter" })
  @MaxLength(500, { message: "Judul maksimal 500 karakter" })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: "Deskripsi maksimal 2000 karakter" })
  description?: string;

  @IsEnum(ContentType, {
    message: "Tipe konten harus salah satu dari: youtube, vimeo, pdf, link",
  })
  content_type: ContentType;

  @IsUrl({}, { message: "URL konten tidak valid" })
  content_url: string;

  @IsInt({ message: "Durasi harus berupa angka" })
  @Min(0, { message: "Durasi tidak boleh negatif" })
  duration_minutes: number;

  @IsOptional()
  @IsInt()
  sort_order?: number = 0;

  @IsOptional()
  @IsBoolean()
  is_mandatory?: boolean = false;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean = true;

  @IsOptional()
  @IsObject()
  metadata?: {
    tags?: string[];
    difficulty?: "beginner" | "intermediate" | "advanced";
    prerequisites?: string[];
    relatedMaterials?: string[];
    thumbnailUrl?: string;
    transcript?: string;
  };
}
