/**
 * Epic 7, Stories 7.4-7.6: Commissions Controller
 * REST API endpoints for commission and payout management
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CommissionService } from "./services/commission.service";
import { PayoutService } from "./services/payout.service";
import {
  CommissionResponseDto,
  CommissionSummaryDto,
} from "./dto/commission-response.dto";
import { BulkApproveCommissionsDto } from "./dto/update-commission.dto";
import {
  CreatePayoutDto,
  UploadPayoutConfirmationDto,
} from "./dto/create-payout.dto";
import {
  PayoutResponseDto,
  PayoutCsvExportDto,
} from "./dto/payout-response.dto";
import { CommissionStatus } from "./domain/commission";

@ApiTags("Commissions")
@Controller("commissions")
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Uncomment when auth is ready
export class CommissionsController {
  constructor(
    private readonly commissionService: CommissionService,
    private readonly payoutService: PayoutService,
  ) {}

  /**
   * Get commissions for current agent
   * Story 7.4: Agent commission dashboard
   */
  @Get("my")
  @ApiOperation({ summary: "Get my commissions" })
  @ApiResponse({
    status: 200,
    description: "Agent commissions",
    type: [CommissionResponseDto],
  })
  async getMyCommissions(@Req() req: any): Promise<CommissionResponseDto[]> {
    const agentId = req.user?.id || "mock-agent-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.commissionService.findByAgent(agentId, tenantId);
  }

  /**
   * Get commission summary for current agent
   */
  @Get("my/summary")
  @ApiOperation({ summary: "Get my commission summary" })
  @ApiResponse({
    status: 200,
    description: "Commission summary",
    type: CommissionSummaryDto,
  })
  async getMySummary(@Req() req: any): Promise<CommissionSummaryDto> {
    const agentId = req.user?.id || "mock-agent-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.commissionService.getAgentSummary(agentId, tenantId);
  }

  /**
   * Get pending commissions for current agent
   */
  @Get("my/pending")
  @ApiOperation({ summary: "Get my pending commissions" })
  @ApiResponse({
    status: 200,
    description: "Pending commissions",
    type: [CommissionResponseDto],
  })
  async getMyPendingCommissions(
    @Req() req: any,
  ): Promise<CommissionResponseDto[]> {
    const agentId = req.user?.id || "mock-agent-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.commissionService.findByAgent(
      agentId,
      tenantId,
      CommissionStatus.PENDING,
    );
  }

  /**
   * Get approved commissions for current agent
   */
  @Get("my/approved")
  @ApiOperation({ summary: "Get my approved commissions" })
  @ApiResponse({
    status: 200,
    description: "Approved commissions",
    type: [CommissionResponseDto],
  })
  async getMyApprovedCommissions(
    @Req() req: any,
  ): Promise<CommissionResponseDto[]> {
    const agentId = req.user?.id || "mock-agent-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.commissionService.findByAgent(
      agentId,
      tenantId,
      CommissionStatus.APPROVED,
    );
  }

  /**
   * Get commissions for specific agent (admin only)
   */
  @Get("agent/:agentId")
  @ApiOperation({ summary: "Get commissions for specific agent (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Agent commissions",
    type: [CommissionResponseDto],
  })
  // @Roles('admin', 'agency_owner') // TODO: Add role guard
  async getAgentCommissions(
    @Param("agentId") agentId: string,
    @Req() req: any,
  ): Promise<CommissionResponseDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.commissionService.findByAgent(agentId, tenantId);
  }

  /**
   * Approve commission (admin only)
   * Story 7.4: Admin approves commissions
   */
  @Post(":id/approve")
  @ApiOperation({ summary: "Approve commission (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Commission approved",
    type: CommissionResponseDto,
  })
  @ApiResponse({ status: 400, description: "Cannot approve commission" })
  @ApiResponse({ status: 404, description: "Commission not found" })
  // @Roles('admin', 'agency_owner') // TODO: Add role guard
  async approve(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<CommissionResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.commissionService.approve(id, tenantId);
  }

  /**
   * Bulk approve commissions (admin only)
   */
  @Post("bulk-approve")
  @ApiOperation({ summary: "Bulk approve commissions (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Commissions approved",
    type: [CommissionResponseDto],
  })
  // @Roles('admin', 'agency_owner') // TODO: Add role guard
  async bulkApprove(
    @Body() dto: BulkApproveCommissionsDto,
    @Req() req: any,
  ): Promise<CommissionResponseDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.commissionService.bulkApprove(dto.commissionIds, tenantId);
  }

  /**
   * Create commission payout batch (admin only)
   * Story 7.6: Batch commission payout
   */
  @Post("payouts")
  @ApiOperation({ summary: "Create commission payout batch (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Payout created",
    type: PayoutResponseDto,
  })
  @ApiResponse({ status: 400, description: "No approved commissions found" })
  // @Roles('admin', 'agency_owner') // TODO: Add role guard
  async createPayout(
    @Body() dto: CreatePayoutDto,
    @Req() req: any,
  ): Promise<PayoutResponseDto> {
    const createdById = req.user?.id || "mock-admin-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.payoutService.createPayout(dto, createdById, tenantId);
  }

  /**
   * Get all payouts
   */
  @Get("payouts")
  @ApiOperation({ summary: "List all payouts" })
  @ApiResponse({
    status: 200,
    description: "Payouts list",
    type: [PayoutResponseDto],
  })
  async listPayouts(@Req() req: any): Promise<PayoutResponseDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.payoutService.findAll(tenantId);
  }

  /**
   * Get payout by ID
   */
  @Get("payouts/:id")
  @ApiOperation({ summary: "Get payout by ID" })
  @ApiResponse({
    status: 200,
    description: "Payout details",
    type: PayoutResponseDto,
  })
  @ApiResponse({ status: 404, description: "Payout not found" })
  async getPayout(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<PayoutResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.payoutService.findOne(id, tenantId);
  }

  /**
   * Upload bank confirmation for payout
   */
  @Post("payouts/:id/confirm")
  @ApiOperation({ summary: "Upload bank confirmation for payout" })
  @ApiResponse({
    status: 200,
    description: "Payout confirmed and commissions marked as paid",
    type: PayoutResponseDto,
  })
  @ApiResponse({ status: 400, description: "Cannot confirm payout" })
  @ApiResponse({ status: 404, description: "Payout not found" })
  // @Roles('admin', 'agency_owner') // TODO: Add role guard
  async uploadConfirmation(
    @Param("id") id: string,
    @Body() dto: UploadPayoutConfirmationDto,
    @Req() req: any,
  ): Promise<PayoutResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.payoutService.uploadConfirmation(id, dto, tenantId);
  }

  /**
   * Export payout to CSV for bank import
   */
  @Get("payouts/:id/export-csv")
  @ApiOperation({ summary: "Export payout to CSV for bank import" })
  @ApiResponse({
    status: 200,
    description: "CSV data",
    type: [PayoutCsvExportDto],
  })
  @ApiResponse({ status: 404, description: "Payout not found" })
  async exportCsv(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<PayoutCsvExportDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.payoutService.exportToCsv(id, tenantId);
  }
}
