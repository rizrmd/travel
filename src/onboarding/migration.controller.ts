/**
 * Epic 13, Story 13.1-13.3: Migration Controller
 * Handles CSV import and migration workflows (10 endpoints)
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/domain/user";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { CsvParserService } from "./services/csv-parser.service";
import { CsvValidatorService } from "./services/csv-validator.service";
import { MigrationJobService } from "./services/migration-job.service";
import { UploadCsvDto } from "./dto/upload-csv.dto";
import { MigrationListQueryDto } from "./dto/migration-list-query.dto";
import { CsvImportDomain, CsvImportType } from "./domain/csv-import";

@Controller("api/v1/onboarding/migration")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MigrationController {
  constructor(
    private csvParserService: CsvParserService,
    private csvValidatorService: CsvValidatorService,
    private migrationJobService: MigrationJobService,
  ) { }

  /**
   * 1. Upload CSV file
   * POST /api/v1/onboarding/migration/upload
   */
  @Post("upload")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  @UseInterceptors(FileInterceptor("file"))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadCsvDto,
    @GetUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException("File CSV wajib diunggah");
    }

    // Validate file size
    if (!CsvImportDomain.validateFileSize(file.size)) {
      throw new BadRequestException(
        "Ukuran file terlalu besar (maksimal 10MB)",
      );
    }

    // Parse CSV for preview
    const previewData = await this.csvParserService.parsePreview(
      file.buffer,
      dto.import_type,
      10,
    );

    // Create migration job
    const job = await this.migrationJobService.createJob(
      user.tenantId,
      user.id,
      dto.import_type,
      file.originalname,
      "", // File URL would be set after S3 upload
      file.size,
      {
        fileName: file.originalname,
        fileSize: file.size,
        encoding: previewData.encoding,
        delimiter: previewData.delimiter,
        columnMapping: dto.column_mapping,
        importType: dto.import_type,
      },
    );

    await this.migrationJobService.setTotalRows(
      job.id,
      previewData.totalRows,
      user.tenantId,
    );

    return {
      job_id: job.id,
      import_type: dto.import_type,
      file_name: file.originalname,
      total_rows: previewData.totalRows,
      columns: previewData.columns,
      preview_rows: previewData.rows,
      encoding: previewData.encoding,
      delimiter: previewData.delimiter,
    };
  }

  /**
   * 2. Preview uploaded data
   * POST /api/v1/onboarding/migration/:id/preview
   */
  @Post(":id/preview")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async previewData(@Param("id") jobId: string, @GetUser() user: any) {
    const job = await this.migrationJobService.findById(jobId, user.tenantId);
    // Return preview data from job metadata
    return {
      job_id: job.id,
      preview: job.metadata,
    };
  }

  /**
   * 3. Validate CSV data
   * POST /api/v1/onboarding/migration/:id/validate
   */
  @Post(":id/validate")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async validateData(@Param("id") jobId: string, @GetUser() user: any) {
    // Implementation would trigger validation job
    return {
      message: "Validasi dimulai. Anda akan menerima notifikasi saat selesai.",
      job_id: jobId,
    };
  }

  /**
   * 4. Start import process
   * POST /api/v1/onboarding/migration/:id/start
   */
  @Post(":id/start")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async startImport(@Param("id") jobId: string, @GetUser() user: any) {
    // Implementation would queue import job
    return {
      message: "Import dimulai. Progress akan diupdate secara real-time.",
      job_id: jobId,
    };
  }

  /**
   * 5. Check import status
   * GET /api/v1/onboarding/migration/:id/status
   */
  @Get(":id/status")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async getStatus(@Param("id") jobId: string, @GetUser() user: any) {
    const job = await this.migrationJobService.findById(jobId, user.tenantId);
    return job;
  }

  /**
   * 6. Download errors CSV
   * GET /api/v1/onboarding/migration/:id/errors
   */
  @Get(":id/errors")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async downloadErrors(
    @Param("id") jobId: string,
    @GetUser() user: any,
    @Res() res: Response,
  ) {
    const { errors } = await this.migrationJobService.getErrors(
      jobId,
      user.tenantId,
    );

    const csvData = errors.map((e) => ({
      row_number: e.row_number,
      error_type: e.error_type,
      field_name: e.field_name,
      error_message: e.error_message,
      received_value: e.received_value,
    }));

    const csv = this.csvParserService.rowsToCSV(csvData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="errors-${jobId}.csv"`,
    );
    res.send(csv);
  }

  /**
   * 7. Rollback migration
   * POST /api/v1/onboarding/migration/:id/rollback
   */
  @Post(":id/rollback")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async rollback(@Param("id") jobId: string, @GetUser() user: any) {
    const job = await this.migrationJobService.rollback(jobId, user.tenantId);
    return {
      message: "Rollback berhasil dilakukan",
      job,
    };
  }

  /**
   * 8. List migration jobs
   * GET /api/v1/onboarding/migration
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async listJobs(@Query() query: MigrationListQueryDto, @GetUser() user: any) {
    const userId = user.role === "agent" ? user.id : null;

    const result = await this.migrationJobService.listJobs(
      user.tenantId,
      userId,
      query,
    );

    return {
      data: result.jobs,
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  /**
   * 9. Download CSV template
   * GET /api/v1/onboarding/migration/templates/:type
   */
  @Get("templates/:type")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async downloadTemplate(
    @Param("type") type: CsvImportType,
    @Res() res: Response,
  ) {
    const columns = CsvImportDomain.getTemplateColumns(type);

    // Create sample row
    const sampleData: Record<string, string> = {};
    columns.forEach((col) => {
      sampleData[col] = `sample_${col}`;
    });

    const csv = this.csvParserService.rowsToCSV([sampleData], columns);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="template-${type}.csv"`,
    );
    res.send(csv);
  }

  /**
   * 10. Delete migration job
   * DELETE /api/v1/onboarding/migration/:id
   */
  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async deleteJob(@Param("id") jobId: string, @GetUser() user: any) {
    await this.migrationJobService.deleteJob(jobId, user.tenantId);
    return {
      message: "Job migrasi berhasil dihapus",
    };
  }
}
