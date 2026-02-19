import { Controller, Post, Get, Body, UseGuards, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DeveloperPortalService } from "../services/developer-portal.service";
import { SandboxService } from "../services/sandbox.service";
import { DeveloperRegistrationDto } from "../dto/developer-registration.dto";
import { SandboxResetDto } from "../dto/sandbox-reset.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@ApiTags("Developer Portal")
@Controller("api-platform/developers")
export class DeveloperPortalController {
  constructor(
    private readonly developerPortalService: DeveloperPortalService,
    private readonly sandboxService: SandboxService,
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register as developer" })
  @ApiResponse({
    status: 201,
    description: "Developer registered successfully",
  })
  async registerDeveloper(
    @Body() dto: DeveloperRegistrationDto,
    @Req() req: any,
  ): Promise<any> {
    // Get tenant from request or use default
    const tenantId = req.headers["x-tenant-id"] || "default";

    return this.developerPortalService.registerDeveloper(dto, tenantId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get developer profile" })
  @ApiResponse({ status: 200 })
  async getProfile(@Req() req: any): Promise<any> {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.firstName,
      tenantId: req.user.tenantId,
    };
  }

  @Get("dashboard")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get developer dashboard with usage statistics" })
  @ApiResponse({ status: 200 })
  async getDashboard(@Req() req: any): Promise<any> {
    return this.developerPortalService.getDashboard(
      req.user.id,
      req.user.tenantId,
    );
  }

  @Get("docs")
  @ApiOperation({ summary: "Get API documentation" })
  @ApiResponse({ status: 200 })
  async getApiDocs(): Promise<any> {
    return this.developerPortalService.getApiDocs();
  }

  @Post("sandbox/reset")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reset sandbox environment" })
  @ApiResponse({ status: 200, description: "Sandbox reset successfully" })
  async resetSandbox(
    @Body() dto: SandboxResetDto,
    @Req() req: any,
  ): Promise<any> {
    await this.sandboxService.resetSandbox(req.user.tenantId);

    if (dto.generateSampleData) {
      await this.sandboxService.generateSampleData(req.user.tenantId);
    }

    return {
      message: "Sandbox reset successfully",
      sampleDataGenerated: dto.generateSampleData || false,
    };
  }

  @Post("sandbox/generate-data")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Generate sample data in sandbox" })
  @ApiResponse({
    status: 200,
    description: "Sample data generated successfully",
  })
  async generateSampleData(@Req() req: any): Promise<any> {
    await this.sandboxService.generateSampleData(req.user.tenantId);

    return {
      message: "Sample data generated successfully",
    };
  }
}
