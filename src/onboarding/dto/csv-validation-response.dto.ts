/**
 * Epic 13, Story 13.2: CSV Validation Response DTO
 */

import { CsvErrorType } from "../domain/csv-import";

export class CsvValidationErrorDto {
  row_number: number;
  field_name: string | null;
  error_type: CsvErrorType;
  error_message: string;
  expected_format?: string;
  received_value?: any;
}

export class CsvValidationResponseDto {
  job_id: string;
  is_valid: boolean;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  errors: CsvValidationErrorDto[];
  error_summary: {
    missing_required: number;
    invalid_format: number;
    duplicate: number;
    constraint_violation: number;
  };
  can_proceed: boolean;

  constructor(data: Partial<CsvValidationResponseDto>) {
    Object.assign(this, data);
  }
}
