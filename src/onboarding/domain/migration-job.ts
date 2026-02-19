/**
 * Epic 13, Story 13.3: Migration Job Domain Model
 * State machine and business logic for migration workflow
 */

import { CsvImportStatus } from "./csv-import";

export interface MigrationJobMetadata {
  fileName: string;
  fileSize: number;
  encoding: string;
  delimiter: string;
  columnMapping?: Record<string, string>;
  importType: string;
  errorSummary?: {
    missingRequired: number;
    invalidFormat: number;
    duplicate: number;
    constraintViolation: number;
  };
}

export class MigrationJobDomain {
  static readonly VALID_TRANSITIONS: Record<
    CsvImportStatus,
    CsvImportStatus[]
  > = {
      [CsvImportStatus.PENDING]: [
        CsvImportStatus.VALIDATING,
        CsvImportStatus.FAILED,
      ],
      [CsvImportStatus.VALIDATING]: [
        CsvImportStatus.IMPORTING,
        CsvImportStatus.FAILED,
        CsvImportStatus.PENDING,
      ],
      [CsvImportStatus.IMPORTING]: [
        CsvImportStatus.COMPLETED,
        CsvImportStatus.FAILED,
        CsvImportStatus.ROLLED_BACK,
      ],
      [CsvImportStatus.COMPLETED]: [CsvImportStatus.ROLLED_BACK],
      [CsvImportStatus.FAILED]: [
        CsvImportStatus.PENDING,
        CsvImportStatus.ROLLED_BACK,
      ],
      [CsvImportStatus.ROLLED_BACK]: [CsvImportStatus.PENDING],
    };

  static canTransition(from: CsvImportStatus, to: CsvImportStatus): boolean {
    const allowedTransitions = this.VALID_TRANSITIONS[from];
    return allowedTransitions?.includes(to) || false;
  }

  static validateTransition(from: CsvImportStatus, to: CsvImportStatus): void {
    if (!this.canTransition(from, to)) {
      throw new Error(
        `Invalid status transition from ${from} to ${to}. Allowed transitions: ${this.VALID_TRANSITIONS[from]?.join(", ")}`,
      );
    }
  }

  static canRollback(status: CsvImportStatus): boolean {
    return [
      CsvImportStatus.COMPLETED,
      CsvImportStatus.IMPORTING,
      CsvImportStatus.FAILED,
    ].includes(status);
  }

  static calculateSuccessRate(validRows: number, totalRows: number): number {
    if (totalRows === 0) return 0;
    return Math.round((validRows / totalRows) * 100);
  }

  static calculateProgress(processedRows: number, totalRows: number): number {
    if (totalRows === 0) return 0;
    return Math.round((processedRows / totalRows) * 100);
  }

  static shouldNotifyCompletion(status: CsvImportStatus): boolean {
    return [
      CsvImportStatus.COMPLETED,
      CsvImportStatus.FAILED,
      CsvImportStatus.ROLLED_BACK,
    ].includes(status);
  }

  static getStatusDisplayName(status: CsvImportStatus): string {
    const displayNames: Record<CsvImportStatus, string> = {
      [CsvImportStatus.PENDING]: "Menunggu",
      [CsvImportStatus.VALIDATING]: "Memvalidasi",
      [CsvImportStatus.IMPORTING]: "Mengimpor",
      [CsvImportStatus.COMPLETED]: "Selesai",
      [CsvImportStatus.FAILED]: "Gagal",
      [CsvImportStatus.ROLLED_BACK]: "Dibatalkan",
    };
    return displayNames[status];
  }

  static generateErrorSummary(
    errors: any[],
  ): MigrationJobMetadata["errorSummary"] {
    return {
      missingRequired: errors.filter((e) => e.errorType === "missing_required")
        .length,
      invalidFormat: errors.filter((e) => e.errorType === "invalid_format")
        .length,
      duplicate: errors.filter((e) => e.errorType === "duplicate").length,
      constraintViolation: errors.filter(
        (e) => e.errorType === "constraint_violation",
      ).length,
    };
  }

  static isTerminalStatus(status: CsvImportStatus): boolean {
    return [
      CsvImportStatus.COMPLETED,
      CsvImportStatus.FAILED,
      CsvImportStatus.ROLLED_BACK,
    ].includes(status);
  }
}
