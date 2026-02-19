/**
 * Integration 4: Virtual Account Payment Gateway
 * Controller: Virtual Account Management
 *
 * Endpoints:
 * - POST /virtual-accounts/jamaah/:id/create - Create VA for jamaah
 * - GET /virtual-accounts/jamaah/:id - Get VAs for jamaah
 * - POST /virtual-accounts/:id/close - Close VA
 * - GET /virtual-accounts/status - Get integration status
 * - GET /virtual-accounts/:id - Get VA by ID
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { VirtualAccountService } from "../services/virtual-account.service";
import { MidtransService } from "../services/midtrans.service";
import { CreateVaDto, VaResponseDto, VaListResponseDto } from "../dto";
import { BankCode, getBankName } from "../domain/bank-code.enum";

@ApiTags("Virtual Account")
@Controller("virtual-accounts")
// @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
@ApiBearerAuth()
export class VirtualAccountController {
  constructor(
    private readonly vaService: VirtualAccountService,
    private readonly midtransService: MidtransService,
  ) {}

  /**
   * Create virtual account for jamaah
   */
  @Post("jamaah/:id/create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create virtual account for jamaah" })
  @ApiParam({ name: "id", description: "Jamaah ID" })
  @ApiResponse({
    status: 201,
    description: "Virtual account created successfully",
    type: VaResponseDto,
  })
  @ApiResponse({ status: 404, description: "Jamaah not found" })
  @ApiResponse({ status: 409, description: "Active VA already exists" })
  async createVirtualAccount(
    @Param("id") jamaahId: string,
    @Body() dto: CreateVaDto,
  ) {
    const va = await this.vaService.createVirtualAccount(
      jamaahId,
      dto.bankCode,
      dto.amount,
    );

    return {
      success: true,
      message: "Virtual account created successfully",
      data: VaResponseDto.fromEntity(va),
    };
  }

  /**
   * Get all virtual accounts for a jamaah
   */
  @Get("jamaah/:id")
  @ApiOperation({ summary: "Get virtual accounts for jamaah" })
  @ApiParam({ name: "id", description: "Jamaah ID" })
  @ApiResponse({
    status: 200,
    description: "List of virtual accounts",
    type: VaListResponseDto,
  })
  async getJamaahVirtualAccounts(@Param("id") jamaahId: string) {
    const vas = await this.vaService.findByJamaahId(jamaahId);

    return {
      success: true,
      data: VaListResponseDto.fromEntities(vas),
    };
  }

  /**
   * Get active virtual accounts for a jamaah
   */
  @Get("jamaah/:id/active")
  @ApiOperation({ summary: "Get active virtual accounts for jamaah" })
  @ApiParam({ name: "id", description: "Jamaah ID" })
  @ApiResponse({
    status: 200,
    description: "List of active virtual accounts",
    type: VaListResponseDto,
  })
  async getActiveVirtualAccounts(@Param("id") jamaahId: string) {
    const vas = await this.vaService.findActiveByJamaahId(jamaahId);

    return {
      success: true,
      data: VaListResponseDto.fromEntities(vas),
    };
  }

  /**
   * Get virtual account by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Get virtual account by ID" })
  @ApiParam({ name: "id", description: "Virtual Account ID" })
  @ApiResponse({
    status: 200,
    description: "Virtual account details",
    type: VaResponseDto,
  })
  @ApiResponse({ status: 404, description: "Virtual account not found" })
  async getVirtualAccount(@Param("id") id: string) {
    const va = await this.vaService.findById(id);

    if (!va) {
      return {
        success: false,
        message: "Virtual account not found",
      };
    }

    return {
      success: true,
      data: VaResponseDto.fromEntity(va),
    };
  }

  /**
   * Close virtual account
   */
  @Post(":id/close")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Close virtual account" })
  @ApiParam({ name: "id", description: "Virtual Account ID" })
  @ApiResponse({
    status: 200,
    description: "Virtual account closed successfully",
  })
  @ApiResponse({ status: 404, description: "Virtual account not found" })
  @ApiResponse({ status: 400, description: "Cannot close used VA" })
  async closeVirtualAccount(@Param("id") id: string) {
    await this.vaService.closeVirtualAccount(id);

    return {
      success: true,
      message: "Virtual account closed successfully",
    };
  }

  /**
   * Get VA integration status
   */
  @Get("system/status")
  @ApiOperation({ summary: "Get virtual account integration status" })
  @ApiResponse({
    status: 200,
    description: "Integration status",
  })
  async getIntegrationStatus() {
    const midtransStatus = this.midtransService.getStatus();

    return {
      success: true,
      data: {
        enabled: midtransStatus.enabled,
        mode: midtransStatus.mode,
        provider: "Midtrans",
        apiUrl: midtransStatus.apiUrl,
        hasCredentials: midtransStatus.hasCredentials,
        supportedBanks: Object.values(BankCode).map((code) => ({
          code,
          name: getBankName(code),
        })),
      },
    };
  }

  /**
   * Get VA statistics (admin)
   */
  @Get("system/statistics")
  @ApiOperation({ summary: "Get VA statistics for tenant" })
  @ApiResponse({
    status: 200,
    description: "VA statistics",
  })
  async getStatistics() {
    // @CurrentTenant() tenantId: string, // Uncomment when tenant context is ready
    // Temporary: use hardcoded tenant for testing
    const tenantId = "00000000-0000-0000-0000-000000000000";

    const stats = await this.vaService.getStatistics(tenantId);

    return {
      success: true,
      data: stats,
    };
  }
}
