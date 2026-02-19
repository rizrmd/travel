/**
 * Epic 9, Story 9.1: Chatbot Placeholder Controller
 * Stub controller for Phase 2 AI chatbot feature
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
import { NotifyMeDto, NotifyMeResponseDto } from "./dto/notify-me.dto";

@ApiTags("AI Chatbot (Coming Soon)")
@Controller("chatbot")
export class ChatbotController {
  private readonly logger = new Logger(ChatbotController.name);

  /**
   * Collect email for Phase 2 launch notification
   * Story 9.1: "Notify Me" feature
   */
  @Post("notify-me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Subscribe to chatbot launch notification",
    description:
      "Collect user email to notify when AI chatbot feature is launched in Phase 2",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully registered for notification",
    type: NotifyMeResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid email address" })
  async notifyMe(@Body() dto: NotifyMeDto): Promise<NotifyMeResponseDto> {
    this.logger.log(`Chatbot launch notification requested: ${dto.email}`);

    // TODO: Store in database when Phase 2 implementation starts
    // await this.chatbotNotificationsRepository.save({
    //   email: dto.email,
    //   name: dto.name,
    //   featureRequest: dto.featureRequest,
    //   submittedAt: new Date(),
    // });

    // TODO: Add to email marketing list (e.g., Mailchimp, SendGrid)
    // await this.emailMarketingService.subscribe(dto.email, 'chatbot-launch');

    if (dto.featureRequest) {
      this.logger.debug(
        `Feature request from ${dto.email}: ${dto.featureRequest}`,
      );
    }

    return {
      message: "Thank you! We will notify you when the AI chatbot is launched.",
      email: dto.email,
      submittedAt: new Date(),
    };
  }

  /**
   * Chatbot stub endpoint - returns 501 Not Implemented
   * All chatbot functionality coming in Phase 2
   */
  @Post("chat")
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  @ApiOperation({
    summary: "Send message to AI chatbot (Coming Soon)",
    description:
      "AI chatbot with 3 modes (Public/Agent/Admin) coming in Phase 2",
  })
  @ApiResponse({
    status: 501,
    description: "Feature not yet implemented",
  })
  async sendMessage(): Promise<{
    error: {
      message: string;
      details: string;
      code: string;
      statusCode: number;
    };
  }> {
    this.logger.warn("Chatbot endpoint called - feature not yet implemented");

    return {
      error: {
        message: "AI Chatbot Coming Soon",
        details:
          "AI chatbot with 3 modes (Public/Agent/Admin) will be available in Phase 2. Features will include: Natural language queries, multi-lingual support, knowledge base integration, and context-aware responses.",
        code: "FEATURE_NOT_AVAILABLE",
        statusCode: 501,
      },
    };
  }

  /**
   * Get chatbot info - explains Phase 2 features
   */
  @Post("info")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get information about upcoming chatbot features",
  })
  @ApiResponse({
    status: 200,
    description: "Chatbot feature information",
  })
  async getChatbotInfo(): Promise<{
    name: string;
    status: string;
    phase: string;
    plannedFeatures: string[];
    modes: Array<{ name: string; description: string }>;
    providers: string[];
  }> {
    return {
      name: "Travel Umroh AI Chatbot",
      status: "Coming Soon",
      phase: "Phase 2",
      plannedFeatures: [
        "Natural language queries in Indonesian and English",
        "Search jamaah by name, status, package",
        "Get payment summaries and overdue notifications",
        "Generate reports via conversation",
        "Multi-modal responses (text, tables, charts)",
        "Context-aware follow-up questions",
        "Integration with WhatsApp Business API",
        "Voice input support",
      ],
      modes: [
        {
          name: "Public Mode",
          description:
            "For website visitors - answers questions about packages, pricing, registration process",
        },
        {
          name: "Agent Mode",
          description:
            "For agents - helps manage jamaah, track commissions, view analytics",
        },
        {
          name: "Admin Mode",
          description:
            "For admins - advanced queries, system configuration, bulk operations",
        },
      ],
      providers: [
        "OpenAI GPT-4 (primary)",
        "Google Dialogflow (fallback)",
        "Rasa (self-hosted option)",
      ],
    };
  }
}
