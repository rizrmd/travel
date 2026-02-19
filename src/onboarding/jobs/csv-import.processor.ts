/**
 * Epic 13, Story 13.1-13.2: CSV Import Background Job Processor
 * Processes CSV imports asynchronously with progress updates
 */

import {
  Processor,
  WorkerHost,
} from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { CsvParserService } from "../services/csv-parser.service";
import { CsvValidatorService } from "../services/csv-validator.service";
import { MigrationJobService } from "../services/migration-job.service";
import { DataImporterService } from "../services/data-importer.service";
import { CsvImportStatus, CsvImportType } from "../domain/csv-import";
import { CsvImportDomain } from "../domain/csv-import";

export interface CsvImportJobData {
  jobId: string;
  tenantId: string;
  userId: string;
  importType: CsvImportType;
  fileBuffer: Buffer;
}

@Processor("csv-import")
@Injectable()
export class CsvImportProcessor extends WorkerHost {
  private readonly logger = new Logger(CsvImportProcessor.name);

  constructor(
    private csvParserService: CsvParserService,
    private csvValidatorService: CsvValidatorService,
    private migrationJobService: MigrationJobService,
    private dataImporterService: DataImporterService,
  ) {
    super();
  }

  async process(job: Job<CsvImportJobData>): Promise<any> {
    if (job.name === "import") {
      return this.handleImport(job);
    }
  }

  async handleImport(job: Job<CsvImportJobData>) {
    const { jobId, tenantId, userId, importType, fileBuffer } = job.data;

    try {
      // Phase 1: Parse CSV
      await this.migrationJobService.updateStatus(
        jobId,
        CsvImportStatus.VALIDATING,
        tenantId,
      );

      const parsedData = await this.csvParserService.parseCSV(
        fileBuffer,
        importType,
      );

      await this.migrationJobService.setTotalRows(
        jobId,
        parsedData.totalRows,
        tenantId,
      );

      // Phase 2: Validate all rows
      const errors = await this.csvValidatorService.validateRows(
        parsedData.rows,
        importType,
        tenantId,
      );

      // Also validate references (e.g., package IDs)
      const referenceErrors = await this.csvValidatorService.validateReferences(
        parsedData.rows,
        importType,
        tenantId,
      );

      const allErrors = [...errors, ...referenceErrors];

      if (allErrors.length > 0) {
        await this.migrationJobService.addErrors(jobId, tenantId, allErrors);
      }

      // Phase 3: Import valid rows
      await this.migrationJobService.updateStatus(
        jobId,
        CsvImportStatus.IMPORTING,
        tenantId,
      );

      const validRows = parsedData.rows.filter((row, index) => {
        const rowNumber = index + 2;
        return !allErrors.some((e) => e.rowNumber === rowNumber);
      });

      // Import in batches
      const batchSize = CsvImportDomain.getConfig().batchSize;
      let imported = 0;

      for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize);

        const result = await this.dataImporterService.importData(
          importType,
          batch,
          tenantId,
          userId,
        );

        imported += result.imported;

        // Update progress
        await this.migrationJobService.updateProgress(
          jobId,
          i + batch.length,
          imported,
          allErrors.length,
          tenantId,
        );

        // Report progress
        await job.updateProgress(
          CsvImportDomain.calculateProgress(
            i + batch.length,
            parsedData.totalRows,
          ),
        );
      }

      // Phase 4: Complete
      await this.migrationJobService.updateStatus(
        jobId,
        CsvImportStatus.COMPLETED,
        tenantId,
      );

      return {
        jobId,
        imported,
        errors: allErrors.length,
        total: parsedData.totalRows,
      };
    } catch (error) {
      await this.migrationJobService.markFailed(jobId, error.message, tenantId);
      throw error;
    }
  }

  async onCompleted(job: Job, result: any) {
    this.logger.log(`CSV import job ${job.id} completed:`, result);
    // Could send email notification here
  }

  async onFailed(job: Job, error: Error) {
    this.logger.error(`CSV import job ${job.id} failed:`, error.stack);
    // Could send error notification here
  }
}
