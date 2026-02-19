import {
  Controller,
  Post,
  Get,
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
import { OAuthService } from "../services/oauth.service";
import { CreateOAuthClientDto } from "../dto/create-oauth-client.dto";
import { OAuthClientResponseDto } from "../dto/oauth-client-response.dto";
import { OAuthTokenRequestDto } from "../dto/oauth-token-request.dto";
import { OAuthTokenResponseDto } from "../dto/oauth-token-response.dto";
import { RevokeTokenDto } from "../dto/revoke-token.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("OAuth 2.0")
@Controller("oauth")
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post("clients")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Register new OAuth client" })
  @ApiResponse({ status: 201, type: OAuthClientResponseDto })
  async registerClient(
    @Body() dto: CreateOAuthClientDto,
    @Req() req: any,
  ): Promise<OAuthClientResponseDto> {
    return this.oauthService.registerClient(req.user.tenantId, dto);
  }

  @Get("clients")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List OAuth clients" })
  @ApiResponse({ status: 200, type: [OAuthClientResponseDto] })
  async listClients(@Req() req: any): Promise<OAuthClientResponseDto[]> {
    return this.oauthService.listClients(req.user.tenantId);
  }

  @Get("clients/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get OAuth client details" })
  @ApiResponse({ status: 200, type: OAuthClientResponseDto })
  async getClient(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<OAuthClientResponseDto> {
    return this.oauthService.getClient(req.user.tenantId, id);
  }

  @Post("token")
  @ApiOperation({ summary: "Get access token (OAuth 2.0 client credentials)" })
  @ApiResponse({ status: 200, type: OAuthTokenResponseDto })
  async getToken(
    @Body() dto: OAuthTokenRequestDto,
  ): Promise<OAuthTokenResponseDto> {
    return this.oauthService.generateToken(dto);
  }

  @Post("revoke")
  @ApiOperation({ summary: "Revoke access token" })
  @ApiResponse({ status: 200, description: "Token revoked successfully" })
  async revokeToken(@Body() dto: RevokeTokenDto): Promise<{ message: string }> {
    await this.oauthService.revokeToken(
      dto.token,
      dto.client_id,
      dto.client_secret,
    );
    return { message: "Token revoked successfully" };
  }
}
