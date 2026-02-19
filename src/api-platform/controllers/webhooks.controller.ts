import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { WebhookSubscriptionService } from "../services/webhook-subscription.service";
import { WebhookDeliveryService } from "../services/webhook-delivery.service";
import { CreateWebhookSubscriptionDto } from "../dto/create-webhook-subscription.dto";
import { WebhookSubscriptionResponseDto } from "../dto/webhook-subscription-response.dto";
import { WebhookDeliveryResponseDto } from "../dto/webhook-delivery-response.dto";
import { TestWebhookDto } from "../dto/test-webhook.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ApiKeyGuard } from "../guards/api-key.guard";

@ApiTags("Webhooks")
@Controller("api-platform/webhooks")
export class WebhooksController {
  constructor(
    private readonly webhookSubscriptionService: WebhookSubscriptionService,
    private readonly webhookDeliveryService: WebhookDeliveryService,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Create webhook subscription" })
  @ApiResponse({ status: 201, type: WebhookSubscriptionResponseDto })
  async createSubscription(
    @Body() dto: CreateWebhookSubscriptionDto,
    @Req() req: any,
  ): Promise<WebhookSubscriptionResponseDto> {
    return this.webhookSubscriptionService.subscribe(
      req.apiKey.id,
      req.apiKey.tenantId,
      dto,
    );
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "List webhook subscriptions" })
  @ApiResponse({ status: 200, type: [WebhookSubscriptionResponseDto] })
  async listSubscriptions(
    @Req() req: any,
  ): Promise<WebhookSubscriptionResponseDto[]> {
    return this.webhookSubscriptionService.listSubscriptions(
      req.apiKey.id,
      req.apiKey.tenantId,
    );
  }

  @Get(":id")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Get webhook subscription details" })
  @ApiResponse({ status: 200, type: WebhookSubscriptionResponseDto })
  async getSubscription(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<WebhookSubscriptionResponseDto> {
    return this.webhookSubscriptionService.getSubscription(
      id,
      req.apiKey.tenantId,
    );
  }

  @Patch(":id")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Update webhook subscription" })
  @ApiResponse({ status: 200, type: WebhookSubscriptionResponseDto })
  async updateSubscription(
    @Param("id") id: string,
    @Body() dto: Partial<CreateWebhookSubscriptionDto>,
    @Req() req: any,
  ): Promise<WebhookSubscriptionResponseDto> {
    return this.webhookSubscriptionService.updateSubscription(
      id,
      req.apiKey.tenantId,
      dto,
    );
  }

  @Delete(":id")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Delete webhook subscription" })
  @ApiResponse({
    status: 200,
    description: "Webhook subscription deleted successfully",
  })
  async deleteSubscription(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.webhookSubscriptionService.unsubscribe(id, req.apiKey.tenantId);
    return { message: "Webhook subscription deleted successfully" };
  }

  @Post(":id/test")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Test webhook subscription" })
  @ApiResponse({ status: 200, description: "Test webhook sent" })
  async testWebhook(
    @Param("id") id: string,
    @Body() dto: TestWebhookDto,
    @Req() req: any,
  ): Promise<{ message: string; deliveryId: string }> {
    const deliveryId = await this.webhookDeliveryService.deliverWebhook(
      id,
      req.apiKey.tenantId,
      "test.webhook" as any,
      dto.payload || { test: true },
    );

    return {
      message: "Test webhook queued for delivery",
      deliveryId,
    };
  }

  @Get(":id/deliveries")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Get webhook delivery logs" })
  @ApiResponse({ status: 200, type: [WebhookDeliveryResponseDto] })
  async getDeliveries(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<WebhookDeliveryResponseDto[]> {
    return this.webhookDeliveryService.getDeliveryLogs(id, req.apiKey.tenantId);
  }

  @Post(":id/retry/:deliveryId")
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: "Retry failed webhook delivery" })
  @ApiResponse({ status: 200, description: "Webhook delivery retry queued" })
  async retryDelivery(
    @Param("id") id: string,
    @Param("deliveryId") deliveryId: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.webhookDeliveryService.retryDelivery(
      deliveryId,
      req.apiKey.tenantId,
    );
    return { message: "Webhook delivery retry queued" };
  }
}
