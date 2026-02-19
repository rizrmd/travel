/**
 * Epic 13, Story 13.2: Migration Error Response DTO
 */

import { CsvErrorType } from "../domain/csv-import";

export class MigrationErrorResponseDto {
  id: string;
  migration_job_id: string;
  row_number: number;
  error_type: CsvErrorType;
  field_name: string | null;
  error_message: string;
  expected_format: string | null;
  received_value: string | null;
  row_data: Record<string, any>;
  created_at: Date;

  constructor(data: Partial<MigrationErrorResponseDto>) {
    Object.assign(this, data);
  }
}
