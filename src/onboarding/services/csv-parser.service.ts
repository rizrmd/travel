/**
 * Epic 13, Story 13.1: CSV Parser Service
 * Handles CSV parsing, encoding detection, and basic validation
 */

import { Injectable, BadRequestException } from "@nestjs/common";
import { parse } from "csv-parse/sync";
import jschardet from "jschardet";
import { CsvImportDomain, CsvImportType } from "../domain/csv-import";

export interface ParsedCsvData {
  rows: Record<string, any>[];
  columns: string[];
  encoding: string;
  delimiter: string;
  totalRows: number;
}

@Injectable()
export class CsvParserService {
  /**
   * Parse CSV file from buffer
   */
  async parseCSV(
    fileBuffer: Buffer,
    importType: CsvImportType,
  ): Promise<ParsedCsvData> {
    try {
      // Detect encoding
      const encoding = this.detectEncoding(fileBuffer);

      // Convert buffer to string with detected encoding
      const csvString = fileBuffer.toString(encoding as BufferEncoding);

      // Detect delimiter
      const delimiter = this.detectDelimiter(csvString);

      // Parse CSV
      const records = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        encoding: encoding as BufferEncoding,
        delimiter: delimiter,
        relax_quotes: true,
        bom: true, // Handle UTF-8 BOM
      });

      if (records.length === 0) {
        throw new BadRequestException("File CSV kosong atau tidak valid");
      }

      // Validate file size constraints
      const config = CsvImportDomain.getConfig();
      if (!CsvImportDomain.validateRowCount(records.length)) {
        throw new BadRequestException(
          `File terlalu besar. Maksimal ${config.maxRows} baris`,
        );
      }

      const columns = Object.keys(records[0]);

      // Validate required columns based on import type
      this.validateRequiredColumns(columns, importType);

      return {
        rows: records,
        columns,
        encoding,
        delimiter,
        totalRows: records.length,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Gagal memproses file CSV: ${error.message}`,
      );
    }
  }

  /**
   * Parse CSV and return preview (first N rows)
   */
  async parsePreview(
    fileBuffer: Buffer,
    importType: CsvImportType,
    previewRows: number = 10,
  ): Promise<ParsedCsvData> {
    const fullData = await this.parseCSV(fileBuffer, importType);

    return {
      ...fullData,
      rows: fullData.rows.slice(0, previewRows),
    };
  }

  /**
   * Detect file encoding (UTF-8, UTF-8 BOM, ISO-8859-1)
   */
  private detectEncoding(buffer: Buffer): string {
    const result = jschardet.detect(buffer);
    const encoding = (result.encoding || "utf-8").toLowerCase();

    // Map common encodings
    if (encoding.includes("utf-8")) {
      return "utf-8";
    }
    if (encoding.includes("iso-8859")) {
      return "latin1";
    }
    if (encoding.includes("windows-1252")) {
      return "latin1";
    }

    // Default to UTF-8
    return "utf-8";
  }

  /**
   * Detect CSV delimiter (, ; or tab)
   */
  private detectDelimiter(csvString: string): string {
    // Get first few lines
    const lines = csvString.split("\n").slice(0, 5);

    // Count occurrences of common delimiters
    const delimiters = [",", ";", "\t"];
    const counts = delimiters.map((delimiter) => {
      return {
        delimiter,
        count: lines.reduce(
          (sum, line) => sum + (line.split(delimiter).length - 1),
          0,
        ),
      };
    });

    // Return delimiter with highest count
    const detected = counts.reduce((max, current) =>
      current.count > max.count ? current : max,
    );

    return detected.count > 0 ? detected.delimiter : ",";
  }

  /**
   * Validate that CSV has required columns for import type
   */
  private validateRequiredColumns(
    columns: string[],
    importType: CsvImportType,
  ): void {
    const rules = CsvImportDomain.getValidationRules(importType);
    const requiredFields = rules.filter((r) => r.required).map((r) => r.field);

    const missingFields = requiredFields.filter(
      (field) => !columns.includes(field),
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Kolom yang diperlukan tidak ditemukan: ${missingFields.join(", ")}`,
      );
    }
  }

  /**
   * Convert parsed rows to CSV string for error report
   */
  rowsToCSV(rows: Record<string, any>[], columns?: string[]): string {
    if (rows.length === 0) {
      return "";
    }

    const cols = columns || Object.keys(rows[0]);

    // Header
    const header = cols.join(",");

    // Rows
    const dataRows = rows.map((row) => {
      return cols
        .map((col) => {
          const value = row[col] ?? "";
          // Escape values with commas or quotes
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
    });

    return [header, ...dataRows].join("\n");
  }

  /**
   * Normalize column names (trim, lowercase)
   */
  normalizeColumns(row: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = key.trim().toLowerCase();
      normalized[normalizedKey] = value;
    }
    return normalized;
  }
}
