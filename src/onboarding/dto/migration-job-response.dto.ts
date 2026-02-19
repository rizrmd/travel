/**
 * Epic 13, Story 13.3: Migration Job Response DTO
 */

import { CsvImportStatus } from "../domain/csv-import";

export class MigrationJobResponseDto {
  id: string;
  tenant_id: string;
  user_id: string;
  import_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  status: CsvImportStatus;
  status_display: string;
  total_rows: number;
  processed_rows: number;
  valid_rows: number;
  invalid_rows: number;
  progress_percentage: number;
  error_report_url: string | null;
  error_message: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  metadata: any;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<MigrationJobResponseDto>) {
    Object.assign(this, data);
  }
}
