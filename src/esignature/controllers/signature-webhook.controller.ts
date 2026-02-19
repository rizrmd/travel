/**
 * Integration 5: E-Signature Integration
 * Controller: Signature Webhook Handler (PrivyID Callbacks)
 */

import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Logger,
  RawBodyRequest,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";
import { Request } from "express";
import { ESignatureService } from "../services/esignature.service";
import { PrivyIdService } from "../services/privy-id.service";
import { SignatureWebhookDto } from "../dto";

@ApiTags("E-Signature Webhook")
@Controller("esignature/webhook")
export class SignatureWebhookController {
  private readonly logger = new Logger(SignatureWebhookController.name);

  constructor(
    private readonly esignatureService: ESignatureService,
    private readonly privyIdService: PrivyIdService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Receive signature events from PrivyID",
    description:
      "Webhook endpoint for PrivyID to send signature events. " +
      "Events include: sent, opened, viewed, signed, declined, expired. " +
      "Webhook signature is verified for security.",
  })
  @ApiHeader({
    name: "x-privy-signature",
    description: "HMAC SHA256 signature for webhook verification",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Webhook processed successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: { type: "string", example: "Webhook processed successfully" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid webhook signature",
  })
  @ApiResponse({
    status: 404,
    description: "Contract not found for signature request",
  })
  async handleWebhook(
    @Body() payload: SignatureWebhookDto,
    @Headers("x-privy-signature") signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `Received webhook: ${payload.event} for signature request ${payload.signature_request_id}`,
    );

    // Get raw body for signature verification
    const rawBody = req.rawBody?.toString("utf8") || JSON.stringify(payload);

    // Verify webhook signature
    const isValid = this.privyIdService.verifyWebhookSignature(
      rawBody,
      signature,
    );

    if (!isValid) {
      this.logger.warn(
        `Invalid webhook signature for signature request ${payload.signature_request_id}`,
      );
      throw new UnauthorizedException("Invalid webhook signature");
    }

    // Process webhook
    try {
      await this.esignatureService.handleSignatureWebhook(payload);

      this.logger.log(
        `Webhook processed successfully: ${payload.event} for ${payload.signature_request_id}`,
      );

      return {
        success: true,
        message: "Webhook processed successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to process webhook for ${payload.signature_request_id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post("test")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Test webhook endpoint (development only)",
    description:
      "Test endpoint to simulate PrivyID webhooks. " +
      "Should be disabled in production.",
  })
  @ApiResponse({
    status: 200,
    description: "Test webhook processed",
  })
  async handleTestWebhook(
    @Body() payload: SignatureWebhookDto,
  ): Promise<{ success: boolean; message: string }> {
    if (this.esignatureService.isIntegrationEnabled()) {
      throw new UnauthorizedException(
        "Test endpoint disabled in production mode",
      );
    }

    this.logger.log(`[TEST] Processing test webhook: ${payload.event}`);

    await this.esignatureService.handleSignatureWebhook(payload);

    return {
      success: true,
      message: "Test webhook processed successfully",
    };
  }
}
