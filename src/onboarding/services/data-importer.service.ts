/**
 * Epic 13, Story 13.1 & 13.2: Data Importer Service
 * Handles actual data import with transaction support
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PackageEntity } from "../../packages/infrastructure/persistence/relational/entities/package.entity";
import { CsvImportType } from "../domain/csv-import";

@Injectable()
export class DataImporterService {
  constructor(
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(PackageEntity)
    private packageRepository: Repository<PackageEntity>,
    private dataSource: DataSource,
  ) {}

  /**
   * Import valid rows with transaction support
   */
  async importData(
    importType: CsvImportType,
    rows: Record<string, any>[],
    tenantId: string,
    userId: string,
  ): Promise<{ imported: number; failed: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let imported = 0;

      switch (importType) {
        case CsvImportType.JAMAAH:
          imported = await this.importJamaah(
            rows,
            tenantId,
            userId,
            queryRunner,
          );
          break;
        case CsvImportType.PAYMENT:
          imported = await this.importPayments(
            rows,
            tenantId,
            userId,
            queryRunner,
          );
          break;
        case CsvImportType.PACKAGE:
          imported = await this.importPackages(
            rows,
            tenantId,
            userId,
            queryRunner,
          );
          break;
      }

      await queryRunner.commitTransaction();

      return { imported, failed: rows.length - imported };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Import jamaah records
   */
  private async importJamaah(
    rows: Record<string, any>[],
    tenantId: string,
    agentId: string,
    queryRunner: any,
  ): Promise<number> {
    let imported = 0;

    for (const row of rows) {
      try {
        const jamaah = queryRunner.manager.create(JamaahEntity, {
          tenant_id: tenantId,
          agent_id: agentId,
          package_id: row.paket_id,
          full_name: row.nama,
          email: row.email || null,
          phone: row.telepon || null,
          date_of_birth: row.tanggal_lahir ? new Date(row.tanggal_lahir) : null,
          gender: row.jenis_kelamin || null,
          address: row.alamat || null,
          status: row.status || "lead",
          metadata: {
            ktp: row.ktp || null,
            catatan: row.catatan || null,
            imported_from_csv: true,
          },
        });

        await queryRunner.manager.save(jamaah);
        imported++;
      } catch (error) {
        // Log error but continue with other rows
        console.error(`Error importing jamaah row:`, error);
      }
    }

    return imported;
  }

  /**
   * Import payment records
   */
  private async importPayments(
    rows: Record<string, any>[],
    tenantId: string,
    userId: string,
    queryRunner: any,
  ): Promise<number> {
    // Implementation would integrate with payments module
    // Placeholder for now
    return 0;
  }

  /**
   * Import package records
   */
  private async importPackages(
    rows: Record<string, any>[],
    tenantId: string,
    userId: string,
    queryRunner: any,
  ): Promise<number> {
    // Implementation would create packages
    // Placeholder for now
    return 0;
  }

  /**
   * Rollback imported data
   */
  async rollbackImport(
    importType: CsvImportType,
    jobId: string,
    tenantId: string,
  ): Promise<void> {
    // Implementation would delete records imported by this job
    // Could use metadata.imported_from_csv_job_id to track
  }
}
