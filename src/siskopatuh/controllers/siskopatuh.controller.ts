/**
 * Integration 6: SISKOPATUH Main Controller
 * Handles all SISKOPATUH submission endpoints
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SiskopatuhService } from "../services/siskopatuh.service";
import { QuerySubmissionsDto, ComplianceReportQueryDto } from "../dto";

@ApiTags("SISKOPATUH Integration")
@ApiBearerAuth()
@Controller("api/v1/siskopatuh")
export class SiskopatuhController {
  constructor(private readonly siskopatuhService: SiskopatuhService) {}

  /**
   * Submit jamaah registration to SISKOPATUH
   */
  @Post("jamaah/:id/submit")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Submit jamaah registration to SISKOPATUH",
    description:
      "Creates and queues a jamaah registration submission to SISKOPATUH government system",
  })
  @ApiResponse({
    status: 202,
    description: "Submission queued successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Jamaah not found",
  })
  async submitJamaahRegistration(
    @Param("id") jamaahId: string,
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const submission = await this.siskopatuhService.submitJamaahRegistration(
      jamaahId,
      tenantId,
    );

    return {
      success: true,
      message: "Jamaah registration queued for submission",
      data: {
        submissionId: submission.id,
        jamaahId: submission.jamaah_id,
        status: submission.status,
        queuedAt: submission.created_at,
      },
    };
  }

  /**
   * Generate and submit departure manifest
   */
  @Post("packages/:id/departure-manifest")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Generate and submit departure manifest",
    description:
      "Creates departure manifest for all ready jamaah in the package and submits to SISKOPATUH",
  })
  @ApiResponse({
    status: 202,
    description: "Departure manifest queued successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Package not found or no ready jamaah",
  })
  async submitDepartureManifest(
    @Param("id") packageId: string,
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const submission = await this.siskopatuhService.submitDepartureManifest(
      packageId,
      tenantId,
    );

    return {
      success: true,
      message: "Departure manifest queued for submission",
      data: {
        submissionId: submission.id,
        packageId: submission.package_id,
        status: submission.status,
        queuedAt: submission.created_at,
      },
    };
  }

  /**
   * Generate and submit return manifest
   */
  @Post("packages/:id/return-manifest")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Generate and submit return manifest",
    description:
      "Creates return manifest for all jamaah in the package and submits to SISKOPATUH",
  })
  @ApiResponse({
    status: 202,
    description: "Return manifest queued successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Package not found or no departure manifest",
  })
  async submitReturnManifest(@Param("id") packageId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const submission = await this.siskopatuhService.submitReturnManifest(
      packageId,
      tenantId,
    );

    return {
      success: true,
      message: "Return manifest queued for submission",
      data: {
        submissionId: submission.id,
        packageId: submission.package_id,
        status: submission.status,
        queuedAt: submission.created_at,
      },
    };
  }

  /**
   * Get all submissions with filters
   */
  @Get("submissions")
  @ApiOperation({
    summary: "List all SISKOPATUH submissions",
    description:
      "Retrieve submissions with optional filters for type, status, jamaah, or package",
  })
  @ApiResponse({
    status: 200,
    description: "Submissions retrieved successfully",
  })
  async getSubmissions(@Query() query: QuerySubmissionsDto, @Req() req: any) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const result = await this.siskopatuhService.querySubmissions(
      tenantId,
      query,
    );

    return {
      success: true,
      data: result.data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: result.total,
        totalPages: Math.ceil(result.total / (query.limit || 20)),
      },
    };
  }

  /**
   * Get submission details
   */
  @Get("submissions/:id")
  @ApiOperation({
    summary: "Get submission details",
    description: "Retrieve detailed information about a specific submission",
  })
  @ApiResponse({
    status: 200,
    description: "Submission details retrieved",
  })
  @ApiResponse({
    status: 404,
    description: "Submission not found",
  })
  async getSubmission(@Param("id") submissionId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const submission = await this.siskopatuhService.getSubmission(
      submissionId,
      tenantId,
    );

    return {
      success: true,
      data: submission,
    };
  }

  /**
   * Retry failed submission
   */
  @Post("submissions/:id/retry")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Retry failed submission",
    description: "Manually retry a failed SISKOPATUH submission",
  })
  @ApiResponse({
    status: 202,
    description: "Submission queued for retry",
  })
  @ApiResponse({
    status: 400,
    description: "Submission cannot be retried",
  })
  @ApiResponse({
    status: 404,
    description: "Submission not found",
  })
  async retrySubmission(@Param("id") submissionId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const submission = await this.siskopatuhService.retrySubmission(
      submissionId,
      tenantId,
    );

    return {
      success: true,
      message: "Submission queued for retry",
      data: {
        submissionId: submission.id,
        status: submission.status,
        retryCount: submission.retry_count,
      },
    };
  }

  /**
   * Generate compliance report
   */
  @Get("compliance-report")
  @ApiOperation({
    summary: "Generate SISKOPATUH compliance report",
    description:
      "Generate comprehensive compliance report for SISKOPATUH submissions within date range",
  })
  @ApiResponse({
    status: 200,
    description: "Compliance report generated",
  })
  async getComplianceReport(
    @Query() query: ComplianceReportQueryDto,
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

    const startDate = query.start_date ? new Date(query.start_date) : undefined;
    const endDate = query.end_date ? new Date(query.end_date) : undefined;

    const report = await this.siskopatuhService.generateComplianceReport(
      tenantId,
      startDate,
      endDate,
    );

    return {
      success: true,
      data: report,
    };
  }

  /**
   * Get integration status
   */
  @Get("status")
  @ApiOperation({
    summary: "Get SISKOPATUH integration status",
    description:
      "Check whether SISKOPATUH integration is enabled and configured",
  })
  @ApiResponse({
    status: 200,
    description: "Integration status retrieved",
  })
  async getIntegrationStatus() {
    const status = this.siskopatuhService.getIntegrationStatus();

    return {
      success: true,
      data: status,
    };
  }
}
