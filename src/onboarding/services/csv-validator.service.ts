/**
 * Epic 13, Story 13.2: CSV Validator Service
 * Validates CSV data against business rules
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CsvImportDomain,
  CsvImportType,
  CsvErrorType,
  CsvRowError,
  CsvValidationRule,
} from "../domain/csv-import";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";

@Injectable()
export class CsvValidatorService {
  constructor(
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PackageEntity)
    private packageRepository: Repository<PackageEntity>,
  ) {}

  /**
   * Validate all rows in CSV
   */
  async validateRows(
    rows: Record<string, any>[],
    importType: CsvImportType,
    tenantId: string,
  ): Promise<CsvRowError[]> {
    const errors: CsvRowError[] = [];
    const rules = CsvImportDomain.getValidationRules(importType);

    // Track unique values for duplicate detection
    const uniqueFields = this.getUniqueFields(importType);
    const seenValues: Record<string, Set<any>> = {};
    uniqueFields.forEach((field) => {
      seenValues[field] = new Set();
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and we're 0-indexed

      // Validate each field
      for (const rule of rules) {
        const fieldErrors = await this.validateField(
          row,
          rule,
          rowNumber,
          tenantId,
        );
        errors.push(...fieldErrors);
      }

      // Check for duplicates within CSV
      for (const field of uniqueFields) {
        const value = row[field];
        if (value && seenValues[field].has(value)) {
          errors.push({
            rowNumber,
            field,
            errorType: CsvErrorType.DUPLICATE,
            message: `Nilai ${field} sudah ada di baris sebelumnya: ${value}`,
            value,
          });
        } else if (value) {
          seenValues[field].add(value);
        }
      }
    }

    return errors;
  }

  /**
   * Validate single field against rules
   */
  private async validateField(
    row: Record<string, any>,
    rule: CsvValidationRule,
    rowNumber: number,
    tenantId: string,
  ): Promise<CsvRowError[]> {
    const errors: CsvRowError[] = [];
    const value = row[rule.field];

    // Check required
    if (rule.required && !value) {
      errors.push({
        rowNumber,
        field: rule.field,
        errorType: CsvErrorType.MISSING_REQUIRED,
        message: `Field ${rule.field} wajib diisi`,
        value: null,
      });
      return errors; // Skip other validations if value is missing
    }

    // Skip validation if optional and empty
    if (!value && !rule.required) {
      return errors;
    }

    // Type validation
    const typeError = this.validateType(value, rule, rowNumber);
    if (typeError) {
      errors.push(typeError);
      return errors;
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push({
        rowNumber,
        field: rule.field,
        errorType: CsvErrorType.INVALID_FORMAT,
        message: `${rule.field} minimal ${rule.minLength} karakter`,
        value,
      });
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push({
        rowNumber,
        field: rule.field,
        errorType: CsvErrorType.INVALID_FORMAT,
        message: `${rule.field} maksimal ${rule.maxLength} karakter`,
        value,
      });
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push({
        rowNumber,
        field: rule.field,
        errorType: CsvErrorType.INVALID_FORMAT,
        message: `Format ${rule.field} tidak valid`,
        value,
      });
    }

    // Custom validator
    if (rule.customValidator && !rule.customValidator(value)) {
      errors.push({
        rowNumber,
        field: rule.field,
        errorType: CsvErrorType.INVALID_FORMAT,
        message: `Validasi khusus gagal untuk ${rule.field}`,
        value,
      });
    }

    return errors;
  }

  /**
   * Validate data type
   */
  private validateType(
    value: any,
    rule: CsvValidationRule,
    rowNumber: number,
  ): CsvRowError | null {
    switch (rule.type) {
      case "email":
        if (!this.isValidEmail(value)) {
          return {
            rowNumber,
            field: rule.field,
            errorType: CsvErrorType.INVALID_FORMAT,
            message: `Email tidak valid: ${value}`,
            value,
          };
        }
        break;

      case "phone":
        if (!this.isValidPhone(value)) {
          return {
            rowNumber,
            field: rule.field,
            errorType: CsvErrorType.INVALID_FORMAT,
            message: `Nomor telepon tidak valid: ${value}`,
            value,
          };
        }
        break;

      case "date":
        if (!this.isValidDate(value)) {
          return {
            rowNumber,
            field: rule.field,
            errorType: CsvErrorType.INVALID_FORMAT,
            message: `Format tanggal tidak valid (gunakan YYYY-MM-DD): ${value}`,
            value,
          };
        }
        break;

      case "number":
        if (isNaN(Number(value))) {
          return {
            rowNumber,
            field: rule.field,
            errorType: CsvErrorType.INVALID_FORMAT,
            message: `Harus berupa angka: ${value}`,
            value,
          };
        }
        break;

      case "uuid":
        if (!this.isValidUUID(value)) {
          return {
            rowNumber,
            field: rule.field,
            errorType: CsvErrorType.INVALID_FORMAT,
            message: `UUID tidak valid: ${value}`,
            value,
          };
        }
        break;
    }

    return null;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (Indonesian)
   */
  private isValidPhone(phone: string): boolean {
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    // Must be 10-15 digits
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Validate UUID format
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Get fields that must be unique
   */
  private getUniqueFields(importType: CsvImportType): string[] {
    switch (importType) {
      case CsvImportType.JAMAAH:
        return ["email", "ktp"];
      case CsvImportType.PAYMENT:
        return ["nomor_referensi"];
      case CsvImportType.PACKAGE:
        return ["nama"];
      default:
        return [];
    }
  }

  /**
   * Check if entity references exist (packages, etc)
   */
  async validateReferences(
    rows: Record<string, any>[],
    importType: CsvImportType,
    tenantId: string,
  ): Promise<CsvRowError[]> {
    const errors: CsvRowError[] = [];

    if (importType === CsvImportType.JAMAAH) {
      // Validate package_id references
      const packageIds = [
        ...new Set(rows.map((r) => r.paket_id).filter(Boolean)),
      ];

      for (const packageId of packageIds) {
        const exists = await this.packageRepository.findOne({
          where: { id: packageId, tenant_id: tenantId },
        });

        if (!exists) {
          const affectedRows = rows
            .map((r, i) => (r.paket_id === packageId ? i + 2 : null))
            .filter(Boolean);

          affectedRows.forEach((rowNumber) => {
            errors.push({
              rowNumber: rowNumber as number,
              field: "paket_id",
              errorType: CsvErrorType.CONSTRAINT_VIOLATION,
              message: `Paket dengan ID ${packageId} tidak ditemukan`,
              value: packageId,
            });
          });
        }
      }
    }

    return errors;
  }
}
