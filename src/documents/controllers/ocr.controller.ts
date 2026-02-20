/**
 * Epic 6, Story 6.6: OCR Controller (Stub)
 * All endpoints return HTTP 501 (Not Implemented)
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { OcrStubService, OcrFeatureInfo } from "../services/ocr-stub.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/domain/user";

@ApiTags("OCR (Coming Soon)")
@ApiBearerAuth()
@Controller("ocr")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OcrController {
  constructor(private readonly ocrService: OcrStubService) { }

  /**
   * Extract passport data (stub)
   */
  @Post("extract-passport/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Extract passport data",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "OCR integration coming soon",
    schema: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
            code: { type: "string" },
            statusCode: { type: "number" },
          },
        },
      },
    },
  })
  async extractPassportData(
    @Param("documentId") documentId: string,
  ): Promise<never> {
    return this.ocrService.extractPassportData(documentId);
  }

  /**
   * Extract KTP data (stub)
   */
  @Post("extract-ktp/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Extract KTP data",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "OCR integration coming soon",
  })
  async extractKtpData(
    @Param("documentId") documentId: string,
  ): Promise<never> {
    return this.ocrService.extractKtpData(documentId);
  }

  /**
   * Extract Kartu Keluarga data (stub)
   */
  @Post("extract-kk/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Extract Kartu Keluarga data",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "OCR integration coming soon",
  })
  async extractKkData(@Param("documentId") documentId: string): Promise<never> {
    return this.ocrService.extractKkData(documentId);
  }

  /**
   * Extract vaccination certificate data (stub)
   */
  @Post("extract-vaccination/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Extract vaccination certificate data",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "OCR integration coming soon",
  })
  async extractVaccinationData(
    @Param("documentId") documentId: string,
  ): Promise<never> {
    return this.ocrService.extractVaccinationData(documentId);
  }

  /**
   * Validate document quality (stub)
   */
  @Post("validate-quality/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Validate document quality",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "Document quality validation coming soon",
  })
  async validateQuality(
    @Param("documentId") documentId: string,
  ): Promise<never> {
    return this.ocrService.validateDocumentQuality(documentId);
  }

  /**
   * Get OCR confidence score (stub)
   */
  @Get("confidence/:documentId")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Get OCR confidence score",
    description: "NOT IMPLEMENTED - Coming Soon in Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.NOT_IMPLEMENTED,
    description: "OCR confidence scoring coming soon",
  })
  async getConfidenceScore(
    @Param("documentId") documentId: string,
  ): Promise<never> {
    return this.ocrService.getOcrConfidenceScore(documentId);
  }

  /**
   * Get OCR feature information
   */
  @Get("info")
  @ApiOperation({
    summary: "Get OCR feature information",
    description: "Get information about OCR features planned for Phase 2",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "OCR feature information",
    type: Object,
  })
  getOcrInfo(): OcrFeatureInfo {
    return this.ocrService.getOcrInfo();
  }

  /**
   * Notify me when OCR is ready
   */
  @Post("notify-me")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Notify me when OCR is ready",
    description: "Register your email to be notified when OCR features launch",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Email registered for notification",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  })
  async notifyMe(@Body("email") email: string): Promise<{ message: string }> {
    return this.ocrService.notifyMeWhenReady(email);
  }
}
