/**
 * Epic 7, Stories 7.1-7.3: Payments Controller
 * REST API endpoints for payment management
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
import { PaymentsService } from "./services/payments.service";
import { InstallmentService } from "./services/installment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import {
  UpdatePaymentDto,
  CancelPaymentDto,
  RefundPaymentDto,
} from "./dto/update-payment.dto";
import { CreatePaymentScheduleDto } from "./dto/create-payment-schedule.dto";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { PaymentsListQueryDto } from "./dto/payments-list-query.dto";
import { PaymentScheduleResponseDto } from "./dto/payment-schedule-response.dto";

@ApiTags("Payments")
@Controller("payments")
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard) // TODO: Uncomment when auth is ready
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly installmentService: InstallmentService,
  ) {}

  /**
   * Create manual payment record
   * Story 7.1: Manual payment entry
   */
  @Post()
  @ApiOperation({ summary: "Create manual payment record" })
  @ApiResponse({
    status: 201,
    description: "Payment created",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid payment data" })
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    // TODO: Extract from JWT
    const recordedById = req.user?.id || "mock-user-id";
    const tenantId = req.user?.tenantId || "mock-tenant-id";

    return this.paymentsService.create(
      createPaymentDto,
      recordedById,
      tenantId,
    );
  }

  /**
   * List all payments with filtering
   */
  @Get()
  @ApiOperation({ summary: "List all payments" })
  @ApiResponse({ status: 200, description: "Payments list" })
  async findAll(
    @Query() query: PaymentsListQueryDto,
    @Req() req: any,
  ): Promise<{
    data: PaymentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.findAll(query, tenantId);
  }

  /**
   * Get payment by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Get payment by ID" })
  @ApiResponse({
    status: 200,
    description: "Payment details",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async findOne(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.findOne(id, tenantId);
  }

  /**
   * Update payment
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update payment" })
  @ApiResponse({
    status: 200,
    description: "Payment updated",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async update(
    @Param("id") id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.update(id, updatePaymentDto, tenantId);
  }

  /**
   * Confirm payment
   */
  @Post(":id/confirm")
  @ApiOperation({ summary: "Confirm payment" })
  @ApiResponse({
    status: 200,
    description: "Payment confirmed",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Cannot confirm payment" })
  async confirm(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.confirm(id, tenantId);
  }

  /**
   * Cancel payment
   */
  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel payment" })
  @ApiResponse({
    status: 200,
    description: "Payment cancelled",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Cannot cancel payment" })
  async cancel(
    @Param("id") id: string,
    @Body() cancelDto: CancelPaymentDto,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.cancel(id, cancelDto, tenantId);
  }

  /**
   * Refund payment
   */
  @Post(":id/refund")
  @ApiOperation({ summary: "Refund payment" })
  @ApiResponse({
    status: 200,
    description: "Payment refunded",
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Cannot refund payment" })
  async refund(
    @Param("id") id: string,
    @Body() refundDto: RefundPaymentDto,
    @Req() req: any,
  ): Promise<PaymentResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.refund(id, refundDto, tenantId);
  }

  /**
   * Delete payment (soft delete)
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete payment" })
  @ApiResponse({ status: 204, description: "Payment deleted" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  async delete(@Param("id") id: string, @Req() req: any): Promise<void> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    await this.paymentsService.delete(id, tenantId);
  }

  /**
   * Get payment statistics for jamaah
   */
  @Get("jamaah/:jamaahId/stats")
  @ApiOperation({ summary: "Get payment statistics for jamaah" })
  @ApiResponse({ status: 200, description: "Payment statistics" })
  async getJamaahStats(
    @Param("jamaahId") jamaahId: string,
    @Req() req: any,
  ): Promise<{
    totalPaid: number;
    paymentCount: number;
    lastPaymentDate: Date | null;
  }> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.paymentsService.getJamaahPaymentStats(jamaahId, tenantId);
  }

  /**
   * Create payment schedule for jamaah
   * Story 7.2: Installment tracking system
   */
  @Post("schedules")
  @ApiOperation({ summary: "Create payment schedule (installments)" })
  @ApiResponse({
    status: 201,
    description: "Schedule created",
    type: [PaymentScheduleResponseDto],
  })
  @ApiResponse({ status: 400, description: "Invalid schedule data" })
  async createSchedule(
    @Body() createScheduleDto: CreatePaymentScheduleDto,
    @Req() req: any,
  ): Promise<PaymentScheduleResponseDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.installmentService.createSchedule(createScheduleDto, tenantId);
  }

  /**
   * Get payment schedules for jamaah
   */
  @Get("schedules/jamaah/:jamaahId")
  @ApiOperation({ summary: "Get payment schedules for jamaah" })
  @ApiResponse({
    status: 200,
    description: "Payment schedules",
    type: [PaymentScheduleResponseDto],
  })
  async getJamaahSchedules(
    @Param("jamaahId") jamaahId: string,
    @Req() req: any,
  ): Promise<PaymentScheduleResponseDto[]> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.installmentService.findByJamaah(jamaahId, tenantId);
  }

  /**
   * Get payment schedule by ID
   */
  @Get("schedules/:id")
  @ApiOperation({ summary: "Get payment schedule by ID" })
  @ApiResponse({
    status: 200,
    description: "Schedule details",
    type: PaymentScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: "Schedule not found" })
  async getSchedule(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<PaymentScheduleResponseDto> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.installmentService.findOne(id, tenantId);
  }

  /**
   * Get payment progress for jamaah
   */
  @Get("schedules/jamaah/:jamaahId/progress")
  @ApiOperation({ summary: "Get payment progress summary" })
  @ApiResponse({ status: 200, description: "Payment progress" })
  async getPaymentProgress(
    @Param("jamaahId") jamaahId: string,
    @Req() req: any,
  ): Promise<{
    totalSchedules: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    completionPercentage: number;
  }> {
    const tenantId = req.user?.tenantId || "mock-tenant-id";
    return this.installmentService.getPaymentProgress(jamaahId, tenantId);
  }

  /**
   * Virtual Account stub endpoint
   * Story 7.8: VA integration marked as "Coming Soon"
   */
  @Post("virtual-account")
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  @ApiOperation({ summary: "Create Virtual Account (Coming Soon)" })
  @ApiResponse({ status: 501, description: "Feature not available" })
  async createVirtualAccount(): Promise<{
    error: {
      message: string;
      code: string;
      statusCode: number;
    };
  }> {
    return {
      error: {
        message:
          "Virtual Account integration coming soon. Phase 2 will include BCA, BSI, BNI, Mandiri.",
        code: "FEATURE_NOT_AVAILABLE",
        statusCode: 501,
      },
    };
  }
}
