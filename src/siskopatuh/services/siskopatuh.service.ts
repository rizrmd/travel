/**
 * Integration 6: SISKOPATUH Core Service
 * Manages all SISKOPATUH submissions and compliance reporting
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, Between } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { SiskopatuhSubmissionEntity } from "../entities/siskopatuh-submission.entity";
import { SiskopatuhApiService } from "./siskopatuh-api.service";
import { ManifestBuilderService } from "./manifest-builder.service";
import {
  CreateSubmissionDto,
  QuerySubmissionsDto,
  JamaahRegistrationDto,
} from "../dto";
import { SubmissionType, SubmissionStatus } from "../domain";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";

@Injectable()
export class SiskopatuhService {
  private readonly logger = new Logger(SiskopatuhService.name);

  constructor(
    @InjectRepository(SiskopatuhSubmissionEntity)
    private readonly submissionRepository: Repository<SiskopatuhSubmissionEntity>,
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    private readonly apiService: SiskopatuhApiService,
    private readonly manifestBuilder: ManifestBuilderService,
    @InjectQueue("siskopatuh-submission")
    private readonly submissionQueue: Queue,
  ) { }

  /**
   * Create and submit jamaah registration
   */
  async submitJamaahRegistration(
    jamaahId: string,
    tenantId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    // Fetch jamaah data
    const jamaah = await this.jamaahRepository.findOne({
      where: { id: jamaahId, tenant_id: tenantId, deleted_at: null },
      relations: ["package"],
    });

    if (!jamaah) {
      throw new NotFoundException(`Jamaah ${jamaahId} not found`);
    }

    // Build registration data
    const registrationData: JamaahRegistrationDto = {
      nik: jamaah.metadata?.nik || "",
      nama_lengkap: jamaah.full_name,
      tanggal_lahir: jamaah.date_of_birth
        ? this.formatDate(jamaah.date_of_birth)
        : "",
      jenis_kelamin: jamaah.gender === "male" ? "L" : "P",
      alamat: jamaah.address || "",
      provinsi: jamaah.metadata?.province || "",
      kota_kabupaten: jamaah.metadata?.city || "",
      nomor_paspor: jamaah.metadata?.passport_number || "",
      tanggal_terbit_paspor: jamaah.metadata?.passport_issue_date || "",
      tanggal_berlaku_paspor: jamaah.metadata?.passport_expiry_date || "",
      nomor_telepon: jamaah.phone || "",
      email: jamaah.email,
      nama_kontak_darurat: jamaah.metadata?.emergency_contact_name || "",
      telepon_kontak_darurat: jamaah.metadata?.emergency_contact_phone || "",
      hubungan_kontak_darurat:
        jamaah.metadata?.emergency_contact_relation || "",
      paket_id: jamaah.package_id,
      tanggal_keberangkatan: this.formatDate(jamaah.package.departure_date),
      tanggal_kepulangan: this.formatDate(jamaah.package.return_date),
    };

    // Create submission record
    const submission = this.submissionRepository.create({
      tenant_id: tenantId,
      submission_type: SubmissionType.JAMAAH_REGISTRATION,
      jamaah_id: jamaahId,
      package_id: jamaah.package_id,
      submission_data: registrationData,
      status: SubmissionStatus.PENDING,
    });

    await this.submissionRepository.save(submission);

    // Queue for processing
    await this.submissionQueue.add("submit-jamaah-registration", {
      submissionId: submission.id,
      tenantId,
    });

    this.logger.log(
      `Queued jamaah registration submission for jamaah ${jamaahId}`,
    );

    return submission;
  }

  /**
   * Create and submit departure manifest
   */
  async submitDepartureManifest(
    packageId: string,
    tenantId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    // Build manifest
    const manifestData = await this.manifestBuilder.buildDepartureManifest(
      packageId,
      tenantId,
    );

    // Create submission record
    const submission = this.submissionRepository.create({
      tenant_id: tenantId,
      submission_type: SubmissionType.DEPARTURE_MANIFEST,
      package_id: packageId,
      submission_data: manifestData,
      status: SubmissionStatus.PENDING,
    });

    await this.submissionRepository.save(submission);

    // Queue for processing
    await this.submissionQueue.add("submit-departure-manifest", {
      submissionId: submission.id,
      tenantId,
    });

    this.logger.log(
      `Queued departure manifest submission for package ${packageId}`,
    );

    return submission;
  }

  /**
   * Create and submit return manifest
   */
  async submitReturnManifest(
    packageId: string,
    tenantId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    // Find departure manifest reference
    const departureSubmission = await this.submissionRepository.findOne({
      where: {
        package_id: packageId,
        tenant_id: tenantId,
        submission_type: SubmissionType.DEPARTURE_MANIFEST,
        status: SubmissionStatus.ACCEPTED,
        deleted_at: null,
      },
      order: { created_at: "DESC" },
    });

    if (!departureSubmission || !departureSubmission.reference_number) {
      throw new BadRequestException(
        "No accepted departure manifest found for this package",
      );
    }

    // Build manifest
    const manifestData = await this.manifestBuilder.buildReturnManifest(
      packageId,
      tenantId,
      departureSubmission.reference_number,
    );

    // Create submission record
    const submission = this.submissionRepository.create({
      tenant_id: tenantId,
      submission_type: SubmissionType.RETURN_MANIFEST,
      package_id: packageId,
      submission_data: manifestData,
      status: SubmissionStatus.PENDING,
    });

    await this.submissionRepository.save(submission);

    // Queue for processing
    await this.submissionQueue.add("submit-return-manifest", {
      submissionId: submission.id,
      tenantId,
    });

    this.logger.log(
      `Queued return manifest submission for package ${packageId}`,
    );

    return submission;
  }

  /**
   * Process a submission (called by queue processor)
   */
  async processSubmission(
    submissionId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${submissionId} not found`);
    }

    try {
      let apiResponse;

      // Submit to SISKOPATUH API based on type
      switch (submission.submission_type) {
        case SubmissionType.JAMAAH_REGISTRATION:
          apiResponse = await this.apiService.submitJamaahRegistration(
            submission.submission_data as JamaahRegistrationDto,
          );
          break;

        case SubmissionType.DEPARTURE_MANIFEST:
          apiResponse = await this.apiService.submitDepartureManifest(
            submission.submission_data as any,
          );
          break;

        case SubmissionType.RETURN_MANIFEST:
          apiResponse = await this.apiService.submitReturnManifest(
            submission.submission_data as any,
          );
          break;

        default:
          throw new BadRequestException(
            `Unknown submission type: ${submission.submission_type}`,
          );
      }

      // Update submission with response
      submission.status = SubmissionStatus.SUBMITTED;
      submission.reference_number = apiResponse.referenceNumber;
      submission.response_data = apiResponse;
      submission.submitted_at = new Date();

      // If API immediately returns accepted status
      if (apiResponse.status === "accepted") {
        submission.status = SubmissionStatus.ACCEPTED;
        submission.accepted_at = new Date();
      }

      await this.submissionRepository.save(submission);

      this.logger.log(
        `Submission ${submissionId} processed successfully: ${apiResponse.referenceNumber}`,
      );

      return submission;
    } catch (error) {
      // Handle submission failure
      submission.status = SubmissionStatus.FAILED;
      submission.error_message = error.message;
      submission.retry_count += 1;

      await this.submissionRepository.save(submission);

      // Retry if under max attempts
      if (submission.retry_count < 3) {
        await this.submissionQueue.add(
          "retry-failed-submission",
          {
            submissionId: submission.id,
          },
          {
            delay: Math.pow(2, submission.retry_count) * 60000, // Exponential backoff
          },
        );

        this.logger.warn(
          `Submission ${submissionId} failed, queued for retry ${submission.retry_count}/3`,
        );
      } else {
        this.logger.error(
          `Submission ${submissionId} failed permanently after 3 attempts`,
        );
      }

      throw error;
    }
  }

  /**
   * Query submissions with filters
   */
  async querySubmissions(
    tenantId: string,
    query: QuerySubmissionsDto,
  ): Promise<{ data: SiskopatuhSubmissionEntity[]; total: number }> {
    const where: FindOptionsWhere<SiskopatuhSubmissionEntity> = {
      tenant_id: tenantId,
      deleted_at: null,
    };

    if (query.submission_type) {
      where.submission_type = query.submission_type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.jamaah_id) {
      where.jamaah_id = query.jamaah_id;
    }

    if (query.package_id) {
      where.package_id = query.package_id;
    }

    const [data, total] = await this.submissionRepository.findAndCount({
      where,
      order: { created_at: "DESC" },
      take: query.limit || 20,
      skip: ((query.page || 1) - 1) * (query.limit || 20),
    });

    return { data, total };
  }

  /**
   * Get submission by ID
   */
  async getSubmission(
    submissionId: string,
    tenantId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId, tenant_id: tenantId, deleted_at: null },
      relations: ["jamaah", "package"],
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${submissionId} not found`);
    }

    return submission;
  }

  /**
   * Retry failed submission
   */
  async retrySubmission(
    submissionId: string,
    tenantId: string,
  ): Promise<SiskopatuhSubmissionEntity> {
    const submission = await this.getSubmission(submissionId, tenantId);

    if (submission.status !== SubmissionStatus.FAILED) {
      throw new BadRequestException("Only failed submissions can be retried");
    }

    // Reset retry count and queue
    submission.retry_count = 0;
    submission.status = SubmissionStatus.PENDING;
    submission.error_message = null;

    await this.submissionRepository.save(submission);

    await this.submissionQueue.add("retry-failed-submission", {
      submissionId: submission.id,
    });

    this.logger.log(`Manual retry queued for submission ${submissionId}`);

    return submission;
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const start = startDate || new Date(new Date().getFullYear(), 0, 1);
    const end = endDate || new Date();

    const submissions = await this.submissionRepository.find({
      where: {
        tenant_id: tenantId,
        created_at: Between(start, end),
        deleted_at: null,
      },
      order: { created_at: "DESC" },
    });

    const totalJamaah = await this.jamaahRepository.count({
      where: {
        tenant_id: tenantId,
        created_at: Between(start, end),
        deleted_at: null,
      },
    });

    const jamaahSubmissions = submissions.filter(
      (s) => s.submission_type === SubmissionType.JAMAAH_REGISTRATION,
    );

    const stats = {
      totalSubmissions: submissions.length,
      pending: submissions.filter((s) => s.status === SubmissionStatus.PENDING)
        .length,
      submitted: submissions.filter(
        (s) => s.status === SubmissionStatus.SUBMITTED,
      ).length,
      accepted: submissions.filter(
        (s) => s.status === SubmissionStatus.ACCEPTED,
      ).length,
      rejected: submissions.filter(
        (s) => s.status === SubmissionStatus.REJECTED,
      ).length,
      failed: submissions.filter((s) => s.status === SubmissionStatus.FAILED)
        .length,
    };

    const complianceRate =
      totalJamaah > 0
        ? (jamaahSubmissions.filter(
          (s) => s.status === SubmissionStatus.ACCEPTED,
        ).length /
          totalJamaah) *
        100
        : 0;

    return {
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      totalJamaah,
      statistics: stats,
      complianceRate: parseFloat(complianceRate.toFixed(2)),
      submissions: submissions.map((s) => ({
        id: s.id,
        type: s.submission_type,
        status: s.status,
        referenceNumber: s.reference_number,
        submittedAt: s.submitted_at,
        acceptedAt: s.accepted_at,
      })),
    };
  }

  /**
   * Get integration status
   */
  getIntegrationStatus() {
    return this.apiService.getIntegrationStatus();
  }

  /**
   * Format date helper
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
