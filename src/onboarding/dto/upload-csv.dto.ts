/**
 * Epic 13, Story 13.1: Upload CSV DTO
 */

import { IsEnum, IsOptional, IsObject } from "class-validator";
import { CsvImportType } from "../domain/csv-import";

export class UploadCsvDto {
  @IsEnum(CsvImportType, {
    message: "Tipe import harus salah satu dari: jamaah, payment, package",
  })
  import_type: CsvImportType;

  @IsOptional()
  @IsObject()
  column_mapping?: Record<string, string>;

  // File will be handled by Multer middleware
  // Express.Multer.File will be available in request
}
