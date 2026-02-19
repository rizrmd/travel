/**
 * Epic 6, Story 6.3: Batch Upload Domain Model
 * Business logic for ZIP batch upload processing
 */

/**
 * Batch Upload Job Status
 */
export enum BatchUploadStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  PARTIAL_SUCCESS = "partial_success",
}

/**
 * Batch Upload Job Domain Model
 */
export class BatchUploadJob {
  id: string;
  tenantId: string;
  uploadedById: string;
  zipFileUrl: string;
  zipFileSize: number;
  status: BatchUploadStatus;
  totalFiles: number;
  processedFiles: number;
  successfulFiles: number;
  failedFiles: number;
  errorReport?: string; // CSV or JSON with errors
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Maximum ZIP file size (100MB)
   */
  static readonly MAX_ZIP_SIZE = 100 * 1024 * 1024; // 100MB

  /**
   * Maximum files per batch
   */
  static readonly MAX_FILES_PER_BATCH = 500;

  /**
   * Validates ZIP file size
   */
  static isValidZipSize(size: number): boolean {
    return size > 0 && size <= this.MAX_ZIP_SIZE;
  }

  /**
   * Calculates progress percentage
   */
  getProgress(): number {
    if (this.totalFiles === 0) {
      return 0;
    }
    return Math.round((this.processedFiles / this.totalFiles) * 100);
  }

  /**
   * Starts processing
   */
  startProcessing(totalFiles: number): void {
    if (this.status !== BatchUploadStatus.PENDING) {
      throw new Error(
        `Cannot start processing. Current status: ${this.status}`,
      );
    }
    if (totalFiles > BatchUploadJob.MAX_FILES_PER_BATCH) {
      throw new Error(
        `Batch contains too many files. Maximum: ${BatchUploadJob.MAX_FILES_PER_BATCH}`,
      );
    }
    this.status = BatchUploadStatus.PROCESSING;
    this.totalFiles = totalFiles;
    this.processedFiles = 0;
    this.successfulFiles = 0;
    this.failedFiles = 0;
    this.startedAt = new Date();
  }

  /**
   * Updates progress
   */
  updateProgress(success: boolean): void {
    if (this.status !== BatchUploadStatus.PROCESSING) {
      throw new Error(`Cannot update progress. Current status: ${this.status}`);
    }
    this.processedFiles += 1;
    if (success) {
      this.successfulFiles += 1;
    } else {
      this.failedFiles += 1;
    }
  }

  /**
   * Completes the job
   */
  complete(): void {
    if (this.status !== BatchUploadStatus.PROCESSING) {
      throw new Error(`Cannot complete job. Current status: ${this.status}`);
    }
    this.completedAt = new Date();

    // Determine final status
    if (this.failedFiles === 0) {
      this.status = BatchUploadStatus.COMPLETED;
    } else if (this.successfulFiles > 0) {
      this.status = BatchUploadStatus.PARTIAL_SUCCESS;
    } else {
      this.status = BatchUploadStatus.FAILED;
    }
  }

  /**
   * Marks job as failed
   */
  markAsFailed(errorReport: string): void {
    this.status = BatchUploadStatus.FAILED;
    this.errorReport = errorReport;
    this.completedAt = new Date();
  }

  /**
   * Checks if job is in final state
   */
  isFinished(): boolean {
    return [
      BatchUploadStatus.COMPLETED,
      BatchUploadStatus.FAILED,
      BatchUploadStatus.PARTIAL_SUCCESS,
    ].includes(this.status);
  }

  /**
   * Gets estimated time remaining in seconds
   */
  getEstimatedTimeRemaining(): number | null {
    if (!this.startedAt || this.processedFiles === 0) {
      return null;
    }

    const elapsedMs = Date.now() - this.startedAt.getTime();
    const avgTimePerFile = elapsedMs / this.processedFiles;
    const remainingFiles = this.totalFiles - this.processedFiles;

    return Math.round((avgTimePerFile * remainingFiles) / 1000); // Convert to seconds
  }
}

/**
 * Batch File Processing Result
 */
export interface BatchFileResult {
  filename: string;
  success: boolean;
  documentId?: string;
  jamaahId?: string;
  documentType?: string;
  error?: string;
}

/**
 * Batch Upload Parser
 * Parses filenames to extract jamaah name and document type
 */
export class BatchUploadParser {
  /**
   * Filename pattern: {JamaahName}-{DocumentType}.{ext}
   * Example: "Ahmad Rizki-KTP.jpg"
   */
  private static readonly FILENAME_PATTERN =
    /^(.+)-(KTP|Passport|KK|Vaksin|Photo|Visa|FlightTicket|HotelVoucher|Insurance)\.(jpg|jpeg|png|pdf)$/i;

  /**
   * Document type mapping
   */
  private static readonly DOCUMENT_TYPE_MAP: Record<string, string> = {
    ktp: "ktp",
    passport: "passport",
    kk: "kk",
    vaksin: "vaccination",
    photo: "photo",
    visa: "visa",
    flightticket: "flight_ticket",
    hotelvoucher: "hotel_voucher",
    insurance: "insurance",
  };

  /**
   * Parses filename and extracts jamaah name and document type
   */
  static parseFilename(filename: string): {
    jamaahName: string;
    documentType: string;
    extension: string;
  } | null {
    const match = filename.match(this.FILENAME_PATTERN);

    if (!match) {
      return null;
    }

    const [, jamaahName, docType, extension] = match;
    const documentType = this.DOCUMENT_TYPE_MAP[docType.toLowerCase()];

    if (!documentType) {
      return null;
    }

    return {
      jamaahName: jamaahName.trim(),
      documentType,
      extension: extension.toLowerCase(),
    };
  }

  /**
   * Generates error report CSV
   */
  static generateErrorReport(results: BatchFileResult[]): string {
    const failedResults = results.filter((r) => !r.success);

    if (failedResults.length === 0) {
      return "";
    }

    const header = "Filename,Error Reason\n";
    const rows = failedResults
      .map((r) => `"${r.filename}","${r.error?.replace(/"/g, '""')}"`)
      .join("\n");

    return header + rows;
  }

  /**
   * Generates success summary
   */
  static generateSummary(results: BatchFileResult[]): string {
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const total = results.length;

    return `Batch Upload Summary:
Total files: ${total}
Successful: ${successful}
Failed: ${failed}
Success rate: ${Math.round((successful / total) * 100)}%`;
  }
}
