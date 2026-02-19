import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

/**
 * Epic 9, Story 9.2: WhatsApp Integration Stub
 * All endpoints return 501 Not Implemented with "Coming Soon" message
 * Full WhatsApp Business API integration planned for Phase 2
 */

export class NotifyMeDto {
  email: string;
  name?: string;
  feature: "whatsapp" | "chatbot";
}

@ApiTags("WhatsApp Integration (Coming Soon)")
@Controller("whatsapp")
export class WhatsAppController {
  /**
   * Get WhatsApp integration status
   */
  @Get("status")
  @ApiOperation({ summary: "Check WhatsApp integration status" })
  @ApiResponse({
    status: 501,
    description: "Feature not yet implemented",
  })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  getStatus() {
    return {
      feature: "WhatsApp Business API Integration",
      status: "coming_soon",
      phase: 2,
      capabilities: [
        "Bidirectional messaging",
        "Payment reminders via WhatsApp",
        "Broadcast messages to jamaah groups",
        "Template message approval workflow",
        "Chatbot integration for automated responses",
        "Message sync with CRM",
      ],
      documentation: "/docs/integrations/whatsapp.md",
      message:
        "WhatsApp Business API integration is planned for Phase 2. All endpoints currently return 501 Not Implemented.",
    };
  }

  /**
   * Stub: Send WhatsApp message
   */
  @Post("send")
  @ApiOperation({ summary: "Send WhatsApp message (stub)" })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  sendMessage(@Body() body: any) {
    throw new HttpException(
      {
        error: {
          message:
            "WhatsApp messaging not yet implemented. Phase 2 will include full WhatsApp Business API integration.",
          code: "FEATURE_NOT_AVAILABLE",
          statusCode: 501,
          plannedFeatures: [
            "Send individual messages",
            "Send template messages",
            "Media attachments (images, documents)",
            "Message status tracking",
          ],
        },
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Stub: Send payment reminder via WhatsApp
   */
  @Post("reminders/payment")
  @ApiOperation({ summary: "Send payment reminder via WhatsApp (stub)" })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  sendPaymentReminder(@Body() body: any) {
    throw new HttpException(
      {
        error: {
          message:
            "WhatsApp payment reminders coming in Phase 2. Currently using email notifications.",
          code: "FEATURE_NOT_AVAILABLE",
          statusCode: 501,
          alternative: "Use POST /notifications/payment-reminder for email",
        },
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Stub: Broadcast message to jamaah group
   */
  @Post("broadcast")
  @ApiOperation({ summary: "Broadcast WhatsApp message (stub)" })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  broadcastMessage(@Body() body: any) {
    throw new HttpException(
      {
        error: {
          message:
            "WhatsApp broadcast messaging coming in Phase 2. Will support group messaging with template approval.",
          code: "FEATURE_NOT_AVAILABLE",
          statusCode: 501,
        },
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Stub: Webhook for receiving WhatsApp messages
   */
  @Post("webhook")
  @ApiOperation({
    summary: "WhatsApp webhook endpoint (stub)",
  })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  handleWebhook(@Body() body: any) {
    return {
      message: "Webhook endpoint reserved for Phase 2 implementation",
      received: false,
    };
  }

  /**
   * Stub: Get WhatsApp conversation history
   */
  @Get("conversations/:jamaahId")
  @ApiOperation({ summary: "Get WhatsApp conversation history (stub)" })
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  getConversations() {
    throw new HttpException(
      {
        error: {
          message:
            "WhatsApp conversation tracking coming in Phase 2. Full bidirectional sync planned.",
          code: "FEATURE_NOT_AVAILABLE",
          statusCode: 501,
        },
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Collect email for launch notification
   */
  @Post("notify-me")
  @ApiOperation({
    summary: "Register for WhatsApp integration launch notification",
  })
  @HttpCode(HttpStatus.OK)
  notifyMe(@Body() dto: NotifyMeDto) {
    // TODO: Store in database for future notification
    // For now, just acknowledge the request

    return {
      success: true,
      message: `Thank you! We'll notify ${dto.email} when ${dto.feature === "whatsapp" ? "WhatsApp integration" : "AI Chatbot"} launches.`,
      feature: dto.feature,
      estimatedLaunch: "Phase 2 (Q2 2025)",
    };
  }
}
