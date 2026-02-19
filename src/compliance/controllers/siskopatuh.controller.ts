/**
 * Epic 12, Story 12.6: SISKOPATUH Controller (Stub)
 * 4 endpoints - all return 501 or Coming Soon info
 */

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SiskopathService } from "../services/siskopatuh.service";
import { SiskopathSubmissionDto, SiskopathStatusResponseDto } from "../dto";

@ApiTags("Compliance - SISKOPATUH")
@ApiBearerAuth()
@Controller("api/v1/compliance/siskopatuh")
export class SiskopathController {
  constructor(private siskopathService: SiskopathService) {}

  @Post("submit")
  @ApiOperation({
    summary: "Submit report to SISKOPATUH (Coming Soon)",
    description: "Returns 501 - Integration planned for Phase 2 (Q2 2025)",
  })
  @ApiResponse({ status: 501, description: "Not Implemented" })
  async submitReport(
    @Req() req: any,
    @Body() dto: SiskopathSubmissionDto,
  ): Promise<{ submissionId: string }> {
    const tenantId = req.user.tenantId;
    return await this.siskopathService.submitReport(tenantId, dto);
  }

  @Get("status")
  @ApiOperation({
    summary: "Check SISKOPATUH submission status",
    description: "Returns integration status and timeline",
  })
  @ApiResponse({ status: 200, type: SiskopathStatusResponseDto })
  async checkStatus(@Req() req: any): Promise<SiskopathStatusResponseDto> {
    const tenantId = req.user.tenantId;
    return await this.siskopathService.checkStatus(tenantId);
  }

  @Post("notify-me")
  @ApiOperation({
    summary: "Register for launch notification",
    description: "Get notified when SISKOPATUH integration is available",
  })
  @ApiResponse({ status: 200 })
  async notifyMe(
    @Req() req: any,
    @Body() body: { email: string },
  ): Promise<{ success: boolean; message: string }> {
    const tenantId = req.user.tenantId;
    const result = await this.siskopathService.notifyMe(tenantId, body.email);

    return {
      success: result.success,
      message:
        "Anda akan diberitahu saat integrasi SISKOPATUH tersedia (Q2 2025)",
    };
  }

  @Get("info")
  @ApiOperation({
    summary: "Get SISKOPATUH integration information",
    description: "Returns documentation and timeline for Phase 2 integration",
  })
  @ApiResponse({ status: 200 })
  async getInfo(): Promise<{
    status: string;
    estimatedLaunch: string;
    documentation: string;
    requiredFields: string[];
    badge: string;
  }> {
    const info = await this.siskopathService.getInfo();

    return {
      ...info,
      requiredFields: [
        "Agency registration data",
        "Jamaah personal data",
        "Package details and pricing",
        "Payment records",
        "Departure dates",
        "Compliance certifications",
      ],
      badge: "Coming Soon - Phase 2",
    };
  }
}
