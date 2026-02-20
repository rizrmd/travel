/**
 * Epic 12, Story 12.3, 12.4, 12.5: Compliance Dashboard Controller
 * 6 endpoints for dashboard, audit logs, and reports
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { ComplianceDashboardService } from "../services/compliance-dashboard.service";
import { AuditLogService } from "../services/audit-log.service";
import { ComplianceReportService } from "../services/compliance-report.service";
import { CriticalOperationsLoggerService } from "../services/critical-operations-logger.service";
import {
  ComplianceDashboardQueryDto,
  ComplianceDashboardResponseDto,
  AuditLogQueryDto,
  PaginatedAuditLogResponseDto,
  AuditLogResponseDto,
  LogCriticalOperationDto,
  ComplianceReportQueryDto,
  ComplianceReportResponseDto,
} from "../dto";

@ApiTags("Compliance - Dashboard & Reports")
@ApiBearerAuth()
@Controller("compliance")
export class ComplianceDashboardController {
  constructor(
    private dashboardService: ComplianceDashboardService,
    private auditLogService: AuditLogService,
    private reportService: ComplianceReportService,
    private criticalOpsLogger: CriticalOperationsLoggerService,
  ) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get compliance dashboard metrics" })
  @ApiResponse({ status: 200, type: ComplianceDashboardResponseDto })
  async getComplianceDashboard(
    @Req() req: any,
    @Query() query: ComplianceDashboardQueryDto,
  ): Promise<ComplianceDashboardResponseDto> {
    const tenantId = req.user.tenantId;
    return await this.dashboardService.getComplianceMetrics(tenantId, query);
  }

  @Get("audit-logs")
  @ApiOperation({ summary: "Search audit trail" })
  @ApiResponse({ status: 200, type: PaginatedAuditLogResponseDto })
  async searchAuditLogs(
    @Req() req: any,
    @Query() query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogResponseDto> {
    const tenantId = req.user.tenantId;
    return await this.auditLogService.searchAuditLogs(tenantId, query);
  }

  @Get("audit-logs/:id")
  @ApiOperation({ summary: "Get audit log details" })
  @ApiResponse({ status: 200, type: AuditLogResponseDto })
  async getAuditLogDetails(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<AuditLogResponseDto> {
    const tenantId = req.user.tenantId;
    const log = await this.auditLogService.getAuditLogById(tenantId, id);
    return log as any;
  }

  @Post("reports/generate")
  @ApiOperation({ summary: "Generate compliance report" })
  @ApiResponse({ status: 201, type: ComplianceReportResponseDto })
  async generateReport(
    @Req() req: any,
    @Body() dto: ComplianceReportQueryDto,
  ): Promise<ComplianceReportResponseDto> {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    const report = await this.reportService.generateReport(
      tenantId,
      dto.reportType,
      new Date(dto.periodStart),
      new Date(dto.periodEnd),
      userId,
    );

    return report as any;
  }

  @Get("reports")
  @ApiOperation({ summary: "List generated reports" })
  @ApiResponse({ status: 200, type: [ComplianceReportResponseDto] })
  async listReports(@Req() req: any): Promise<ComplianceReportResponseDto[]> {
    const tenantId = req.user.tenantId;
    const reports = await this.reportService.listReports(tenantId);
    return reports as any;
  }

  @Get("reports/:id/download")
  @ApiOperation({ summary: "Download compliance report" })
  @ApiResponse({ status: 200, description: "PDF file" })
  async downloadReport(
    @Req() req: any,
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<void> {
    const tenantId = req.user.tenantId;

    // In production, fetch from storage
    const pdfBuffer = await this.dashboardService.exportToPDF(tenantId, {});

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${id}.pdf`,
    );
    res.send(pdfBuffer);
  }
}
