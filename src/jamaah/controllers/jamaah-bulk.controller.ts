/**
 * Epic 5, Story 5.4: Jamaah Bulk Operations Controller
 * Bulk actions on multiple jamaah
 */

import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BulkOperationsService } from "../services/bulk-operations.service";
import {
  BulkOperationDto,
  BulkOperationResultDto,
  TransferJamaahDto,
  SendCustomMessageDto,
} from "../dto/bulk-operation.dto";

@ApiTags("Jamaah Bulk Operations")
@ApiBearerAuth()
@Controller("api/v1/jamaah/bulk")
export class JamaahBulkController {
  constructor(private readonly bulkOperationsService: BulkOperationsService) {}

  /**
   * Story 5.4: Execute bulk operation
   */
  @Post("operation")
  @ApiOperation({ summary: "Execute bulk operation on multiple jamaah" })
  @ApiResponse({
    status: 200,
    description: "Bulk operation queued successfully",
    type: BulkOperationResultDto,
  })
  async executeBulkOperation(
    @Body() dto: BulkOperationDto,
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      dto,
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.4: Send payment reminders
   */
  @Post("send-payment-reminder")
  @ApiOperation({ summary: "Send payment reminders to multiple jamaah" })
  @ApiResponse({
    status: 200,
    description: "Payment reminders queued successfully",
    type: BulkOperationResultDto,
  })
  async sendPaymentReminder(
    @Body() dto: { jamaahIds: string[] },
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      {
        actionType: "send_payment_reminder" as any,
        jamaahIds: dto.jamaahIds,
      },
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.4: Request documents
   */
  @Post("request-documents")
  @ApiOperation({ summary: "Request missing documents from multiple jamaah" })
  @ApiResponse({
    status: 200,
    description: "Document requests queued successfully",
    type: BulkOperationResultDto,
  })
  async requestDocuments(
    @Body() dto: { jamaahIds: string[] },
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      {
        actionType: "request_documents" as any,
        jamaahIds: dto.jamaahIds,
      },
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.4: Export to CSV
   */
  @Post("export-csv")
  @ApiOperation({ summary: "Export jamaah data to CSV" })
  @ApiResponse({
    status: 200,
    description: "CSV export queued successfully",
    type: BulkOperationResultDto,
  })
  async exportCsv(
    @Body() dto: { jamaahIds: string[] },
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      {
        actionType: "export_csv" as any,
        jamaahIds: dto.jamaahIds,
      },
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.4: Transfer jamaah to another agent
   */
  @Post("transfer")
  @ApiOperation({ summary: "Transfer jamaah to another agent" })
  @ApiResponse({
    status: 200,
    description: "Jamaah transferred successfully",
    type: BulkOperationResultDto,
  })
  async transferJamaah(
    @Body() dto: TransferJamaahDto,
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      {
        actionType: "transfer_jamaah" as any,
        jamaahIds: dto.jamaahIds,
        params: { newAgentId: dto.newAgentId, reason: dto.reason },
      },
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.4: Send custom message
   */
  @Post("send-message")
  @ApiOperation({ summary: "Send custom message to multiple jamaah" })
  @ApiResponse({
    status: 200,
    description: "Messages queued successfully",
    type: BulkOperationResultDto,
  })
  async sendCustomMessage(
    @Body() dto: SendCustomMessageDto,
    @Request() req,
  ): Promise<BulkOperationResultDto> {
    return this.bulkOperationsService.executeBulkOperation(
      {
        actionType: "send_custom_message" as any,
        jamaahIds: dto.jamaahIds,
        params: { message: dto.message, messageType: dto.messageType },
      },
      req.user.tenantId,
      req.user.sub,
    );
  }
}
