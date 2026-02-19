/**
 * Epic 13, Story 13.1: CSV Import Domain Model
 * Business logic for CSV import validation and processing
 */

export enum CsvImportType {
  JAMAAH = "jamaah",
  PAYMENT = "payment",
  PACKAGE = "package",
}

export enum CsvImportStatus {
  PENDING = "pending",
  VALIDATING = "validating",
  IMPORTING = "importing",
  COMPLETED = "completed",
  FAILED = "failed",
  ROLLED_BACK = "rolled_back",
}

export enum CsvErrorType {
  MISSING_REQUIRED = "missing_required",
  INVALID_FORMAT = "invalid_format",
  DUPLICATE = "duplicate",
  CONSTRAINT_VIOLATION = "constraint_violation",
}

export interface CsvValidationRule {
  field: string;
  required: boolean;
  type: "string" | "number" | "date" | "email" | "phone" | "uuid";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export interface CsvImportConfig {
  maxFileSize: number; // bytes
  maxRows: number;
  allowedEncodings: string[];
  supportedDelimiters: string[];
  batchSize: number;
  progressUpdateInterval: number; // rows
}

export interface CsvRowError {
  rowNumber: number;
  field: string;
  errorType: CsvErrorType;
  message: string;
  value: any;
}

export class CsvImportDomain {
  private static readonly DEFAULT_CONFIG: CsvImportConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxRows: 10000,
    allowedEncodings: ["utf-8", "utf-8-bom", "iso-8859-1"],
    supportedDelimiters: [",", ";", "\t"],
    batchSize: 100,
    progressUpdateInterval: 100,
  };

  static getConfig(): CsvImportConfig {
    return { ...this.DEFAULT_CONFIG };
  }

  static getValidationRules(type: CsvImportType): CsvValidationRule[] {
    switch (type) {
      case CsvImportType.JAMAAH:
        return this.getJamaahValidationRules();
      case CsvImportType.PAYMENT:
        return this.getPaymentValidationRules();
      case CsvImportType.PACKAGE:
        return this.getPackageValidationRules();
      default:
        throw new Error(`Unknown import type: ${type}`);
    }
  }

  private static getJamaahValidationRules(): CsvValidationRule[] {
    return [
      {
        field: "nama",
        required: true,
        type: "string",
        minLength: 2,
        maxLength: 255,
      },
      { field: "email", required: false, type: "email", maxLength: 255 },
      { field: "telepon", required: false, type: "phone", maxLength: 50 },
      { field: "alamat", required: false, type: "string", maxLength: 500 },
      {
        field: "ktp",
        required: false,
        type: "string",
        minLength: 16,
        maxLength: 16,
      },
      { field: "tanggal_lahir", required: false, type: "date" },
      {
        field: "jenis_kelamin",
        required: false,
        type: "string",
        pattern: /^[LlPp]$/,
      },
      { field: "paket_id", required: true, type: "uuid" },
      { field: "status", required: false, type: "string" },
      { field: "catatan", required: false, type: "string", maxLength: 1000 },
    ];
  }

  private static getPaymentValidationRules(): CsvValidationRule[] {
    return [
      { field: "jamaah_id", required: true, type: "uuid" },
      { field: "jumlah", required: true, type: "number" },
      { field: "tanggal_bayar", required: true, type: "date" },
      { field: "metode_pembayaran", required: true, type: "string" },
      {
        field: "nomor_referensi",
        required: false,
        type: "string",
        maxLength: 100,
      },
      { field: "catatan", required: false, type: "string", maxLength: 1000 },
    ];
  }

  private static getPackageValidationRules(): CsvValidationRule[] {
    return [
      {
        field: "nama",
        required: true,
        type: "string",
        minLength: 3,
        maxLength: 255,
      },
      { field: "deskripsi", required: false, type: "string", maxLength: 2000 },
      { field: "durasi_hari", required: true, type: "number" },
      { field: "harga_retail", required: true, type: "number" },
      { field: "harga_wholesale", required: true, type: "number" },
      { field: "tanggal_keberangkatan", required: true, type: "date" },
      { field: "kapasitas", required: true, type: "number" },
      { field: "status", required: false, type: "string" },
    ];
  }

  static validateFileSize(fileSize: number): boolean {
    return fileSize <= this.DEFAULT_CONFIG.maxFileSize;
  }

  static validateRowCount(rowCount: number): boolean {
    return rowCount <= this.DEFAULT_CONFIG.maxRows;
  }

  static calculateProgress(processed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((processed / total) * 100);
  }

  static shouldSendProgressUpdate(processedRows: number): boolean {
    return processedRows % this.DEFAULT_CONFIG.progressUpdateInterval === 0;
  }

  static getTemplateColumns(type: CsvImportType): string[] {
    const rules = this.getValidationRules(type);
    return rules.map((rule) => rule.field);
  }
}
