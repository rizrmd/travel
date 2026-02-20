/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * OCR Controller - API endpoints for OCR operations
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { OcrService } from "../services/ocr.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/domain/user";
import {
  ExtractDataResponseDto,
  QueueExtractionResponseDto,
} from "../dto/extract-data.dto";

@ApiTags("OCR Integration")
@ApiBearerAuth()
@Controller("ocr")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OcrController {
  constructor(private readonly ocrService: OcrService) { }

  /**
   * Extract data from document (synchronous)
   */
  @Post("documents/:id/extract")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Extract data from document using OCR (synchronous)",
    description:
      "Synchronously extract data from uploaded document. Supports KTP, Passport, and KK. " +
      "Performs quality validation before OCR processing. Returns cached result if available.",
  })
  @ApiParam({
    name: "id",
    description: "Document ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        forceReprocess: {
          type: "boolean",
          description: "Force re-processing even if cached result exists",
          example: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "OCR extraction successful",
    type: ExtractDataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "Document quality validation failed or unsupported document type",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        recommendations: { type: "array", items: { type: "string" } },
        checks: { type: "object" },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Document not found",
  })
  async extractData(
    @Param("id") documentId: string,
    @Body("forceReprocess") forceReprocess: boolean = false,
  ) {
    const result = await this.ocrService.extractData(
      documentId,
      forceReprocess,
    );

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Queue document for OCR extraction (asynchronous)
   */
  @Post("documents/:id/extract-async")
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @ApiOperation({
    summary: "Queue document for OCR extraction (asynchronous)",
    description:
      "Add document to OCR processing queue for background processing. " +
      "Client will receive WebSocket event when processing completes.",
  })
  @ApiParam({
    name: "id",
    description: "Document ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: "Document queued for OCR processing",
    type: QueueExtractionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Document not found",
  })
  async extractDataAsync(@Param("id") documentId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || req.user?.tenant_id;

    const { jobId } = await this.ocrService.queueExtraction(
      documentId,
      tenantId,
    );

    return {
      success: true,
      message: "Document queued for OCR processing",
      jobId,
      documentId,
    };
  }

  /**
   * Get OCR status for a document
   */
  @Get("documents/:id/status")
  @Roles(UserRole.ADMIN, UserRole.AGENT, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get OCR processing status for a document",
    description:
      "Check if document has been processed and retrieve extraction results",
  })
  @ApiParam({
    name: "id",
    description: "Document ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "OCR status retrieved",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            processed: { type: "boolean", example: true },
            confidenceScore: { type: "number", example: 95.5 },
            processedAt: { type: "string", example: "2025-12-23T10:30:00Z" },
            extractedData: { type: "object" },
          },
        },
      },
    },
  })
  async getOcrStatus(@Param("id") documentId: string) {
    const status = await this.ocrService.getOcrStatus(documentId);

    return {
      success: true,
      data: status,
    };
  }

  /**
   * Get OCR statistics for tenant
   */
  @Get("statistics")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get OCR statistics for current tenant",
    description:
      "Retrieve OCR processing statistics including total processed, average confidence, auto-approvals, etc.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "OCR statistics retrieved",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            totalProcessed: { type: "number", example: 1500 },
            averageConfidence: { type: "number", example: 92.5 },
            autoApproved: { type: "number", example: 1350 },
            manualReview: { type: "number", example: 150 },
            byDocumentType: {
              type: "object",
              properties: {
                ktp: { type: "number", example: 800 },
                passport: { type: "number", example: 500 },
                kk: { type: "number", example: 200 },
              },
            },
          },
        },
      },
    },
  })
  async getStatistics(@Req() req: any) {
    const tenantId = req.user?.tenantId || req.user?.tenant_id;
    const stats = await this.ocrService.getOcrStatistics(tenantId);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Clear OCR cache for a document
   */
  @Post("documents/:id/clear-cache")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Clear OCR cache for a document",
    description: "Force clear cached OCR result for re-processing",
  })
  @ApiParam({
    name: "id",
    description: "Document ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cache cleared successfully",
  })
  async clearCache(@Param("id") documentId: string) {
    await this.ocrService.clearCache(documentId);

    return {
      success: true,
      message: "OCR cache cleared successfully",
    };
  }

  /**
   * Get OCR integration status
   */
  @Get("status")
  @ApiOperation({
    summary: "Get OCR integration status",
    description:
      "Retrieve current OCR integration configuration and status (STUB vs PRODUCTION mode)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "OCR integration status",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: {
            enabled: { type: "boolean", example: false },
            mode: { type: "string", example: "STUB" },
            provider: { type: "string", example: "Verihubs" },
            supportedDocuments: {
              type: "array",
              items: { type: "string" },
              example: ["ktp", "passport", "kk"],
            },
            autoApproveThreshold: { type: "number", example: 80 },
            qualityCheckEnabled: { type: "boolean", example: true },
          },
        },
      },
    },
  })
  getStatus() {
    const status = this.ocrService.getIntegrationStatus();

    return {
      success: true,
      data: status,
    };
  }
}
