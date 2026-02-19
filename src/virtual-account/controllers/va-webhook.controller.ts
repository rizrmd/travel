/**
 * Integration 4: Virtual Account Payment Gateway
 * Controller: Midtrans Webhook Handler
 *
 * This controller receives POST webhooks from Midtrans
 * when a payment is received.
 *
 * Webhook URL: https://your-domain.com/virtual-accounts/webhook
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { NotificationHandlerService } from "../services/notification-handler.service";
import { MidtransNotificationDto } from "../dto";

@ApiTags("Virtual Account Webhook")
@Controller("virtual-accounts/webhook")
export class VaWebhookController {
  private readonly logger = new Logger(VaWebhookController.name);

  constructor(
    private readonly notificationHandler: NotificationHandlerService,
  ) {}

  /**
   * Receive payment notification from Midtrans
   *
   * This endpoint is called by Midtrans when:
   * - Payment is received (transaction_status: settlement)
   * - Payment is pending (transaction_status: pending)
   * - Payment is denied/cancelled/expired
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Receive payment notification from Midtrans",
    description:
      "Webhook endpoint for Midtrans payment notifications. " +
      "Configure this URL in Midtrans dashboard: " +
      "Settings > Configuration > Notification URL",
  })
  @ApiResponse({
    status: 200,
    description: "Notification received and queued for processing",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid signature",
  })
  @ApiResponse({
    status: 404,
    description: "Virtual account not found",
  })
  async handleWebhook(@Body() notification: MidtransNotificationDto) {
    this.logger.log(
      `Webhook received: ${notification.transaction_id} - ${notification.transaction_status}`,
    );

    try {
      await this.notificationHandler.handleNotification(notification);

      return {
        success: true,
        message: "Notification received and queued for processing",
      };
    } catch (error) {
      this.logger.error(`Webhook processing error: ${error.message}`);

      // Return 200 even on error to prevent Midtrans retries
      // We'll handle retries internally via BullMQ
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Test webhook (for development/testing)
   */
  @Post("test")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Test webhook handler",
    description:
      "Development endpoint to test webhook processing with mock data",
  })
  async testWebhook(@Body() notification: any) {
    this.logger.log(`Test webhook received`);

    // In stub mode, create a mock signature
    if (!notification.signature_key) {
      notification.signature_key = "test_signature_" + Date.now();
    }

    await this.notificationHandler.handleNotification(notification);

    return {
      success: true,
      message: "Test notification processed",
    };
  }
}
