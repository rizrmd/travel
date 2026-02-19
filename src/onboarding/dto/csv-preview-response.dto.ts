/**
 * Epic 13, Story 13.1: CSV Preview Response DTO
 */

export class CsvPreviewResponseDto {
  job_id: string;
  import_type: string;
  file_name: string;
  total_rows: number;
  columns: string[];
  preview_rows: Record<string, any>[];
  encoding: string;
  delimiter: string;

  constructor(data: Partial<CsvPreviewResponseDto>) {
    Object.assign(this, data);
  }
}
