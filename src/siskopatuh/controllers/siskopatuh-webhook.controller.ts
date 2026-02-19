/**
 * Integration 6: SISKOPATUH Webhook Controller
 * Receives status updates from SISKOPATUH government system
 */

import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SiskopatuhApiService } from "../services/siskopatuh-api.service";
import { SiskopatuhSubmissionEntity } from "../entities/siskopatuh-submission.entity";
import { WebhookPayloadDto } from "../dto";
import { SubmissionStatus } from "../domain";

@ApiTags("SISKOPATUH Webhook")
@Controller("api/v1/siskopatuh/webhook")
export class SiskopatuhWebhookController {
  private readonly logger = new Logger(SiskopatuhWebhookController.name);

  constructor(
    private readonly apiService: SiskopatuhApiService,
    @InjectRepository(SiskopatuhSubmissionEntity)
    private readonly submissionRepository: Repository<SiskopatuhSubmissionEntity>,
  ) {}

  /**
   * Receive webhook from SISKOPATUH
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "SISKOPATUH webhook endpoint",
    description:
      "Receives status updates from SISKOPATUH government system (called by SISKOPATUH, not by clients)",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook processed successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid signature or payload",
  })
  async handleWebhook(
    @Body() payload: WebhookPayloadDto,
    @Headers("x-siskopatuh-signature") signature: string,
  ) {
    this.logger.log(
      `Received webhook for reference: ${payload.reference_number}`,
    );

    // Verify webhook signature
    const isValid = this.apiService.verifyWebhookSignature(
      JSON.stringify(payload),
      signature || payload.signature,
    );

    if (!isValid) {
      this.logger.warn(
        `Invalid webhook signature for ${payload.reference_number}`,
      );
      throw new BadRequestException("Invalid webhook signature");
    }

    // Find submission by reference number
    const submission = await this.submissionRepository.findOne({
      where: {
        reference_number: payload.reference_number,
        deleted_at: null,
      },
    });

    if (!submission) {
      this.logger.warn(
        `Submission not found for reference: ${payload.reference_number}`,
      );
      throw new BadRequestException("Submission not found");
    }

    // Update submission status based on webhook
    const previousStatus = submission.status;
    submission.status = payload.status;

    if (payload.status === SubmissionStatus.ACCEPTED) {
      submission.accepted_at = new Date();
    }

    if (
      payload.status === SubmissionStatus.REJECTED ||
      payload.status === SubmissionStatus.FAILED
    ) {
      submission.error_message = payload.error_details || payload.message;
    }

    // Store webhook response
    submission.response_data = {
      ...(submission.response_data || {}),
      webhook_update: {
        status: payload.status,
        message: payload.message,
        timestamp: payload.timestamp,
        previous_status: previousStatus,
      },
    };

    await this.submissionRepository.save(submission);

    this.logger.log(
      `Updated submission ${submission.id}: ${previousStatus} -> ${payload.status}`,
    );

    // TODO: Emit WebSocket event for real-time notification
    // this.websocketGateway.emitToTenant(submission.tenant_id, 'siskopatuh:status_update', {
    //   submissionId: submission.id,
    //   referenceNumber: payload.reference_number,
    //   status: payload.status,
    //   message: payload.message,
    // });

    return {
      success: true,
      message: "Webhook processed successfully",
      data: {
        submissionId: submission.id,
        referenceNumber: payload.reference_number,
        previousStatus,
        newStatus: payload.status,
      },
    };
  }
}
