import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ApiKeyService } from "../services/api-key.service";
import { ApiAnalyticsService } from "../services/api-analytics.service";
import { CreateApiKeyDto } from "../dto/create-api-key.dto";
import { ApiKeyResponseDto } from "../dto/api-key-response.dto";
import { ApiKeyListQueryDto } from "../dto/api-key-list-query.dto";
import { RegenerateApiKeyDto } from "../dto/regenerate-api-key.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("API Keys")
@Controller("api-platform/keys")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApiKeysController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly analyticsService: ApiAnalyticsService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create new API key" })
  @ApiResponse({ status: 201, type: ApiKeyResponseDto })
  async createKey(
    @Body() dto: CreateApiKeyDto,
    @Req() req: any,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.createKey(req.user.id, req.user.tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List API keys" })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDto] })
  async listKeys(
    @Query() query: ApiKeyListQueryDto,
    @Req() req: any,
  ): Promise<ApiKeyResponseDto[]> {
    return this.apiKeyService.listKeys(req.user.tenantId, req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get API key details" })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async getKey(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.getKey(id, req.user.tenantId);
  }

  @Post(":id/regenerate")
  @ApiOperation({ summary: "Regenerate API key" })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async regenerateKey(
    @Param("id") id: string,
    @Body() dto: RegenerateApiKeyDto,
    @Req() req: any,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.regenerateKey(id, req.user.tenantId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deactivate API key" })
  @ApiResponse({ status: 200, description: "API key deactivated successfully" })
  async deactivateKey(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.apiKeyService.deactivateKey(id, req.user.tenantId);
    return { message: "API key deactivated successfully" };
  }

  @Get(":id/usage")
  @ApiOperation({ summary: "Get API key usage statistics" })
  @ApiResponse({ status: 200 })
  async getUsage(@Param("id") id: string, @Req() req: any): Promise<any> {
    const stats = await this.analyticsService.getUsageStats(
      id,
      req.user.tenantId,
      "month",
    );
    const popularEndpoints = await this.analyticsService.getPopularEndpoints(
      id,
      req.user.tenantId,
    );

    return {
      stats,
      popularEndpoints,
    };
  }

  @Post(":id/rotate")
  @ApiOperation({ summary: "Rotate API key" })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async rotateKey(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.regenerateKey(id, req.user.tenantId);
  }
}
