/**
 * Epic 6, Story 6.4 & 6.5: Documents Review Controller
 * Handles document review and bulk approval
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DocumentReviewService } from "../services/document-review.service";
import { BulkApprovalService } from "../services/bulk-approval.service";
import { ReviewDocumentDto } from "../dto/review-document.dto";
import { BulkApprovalDto } from "../dto/bulk-approval.dto";
import { DocumentResponseDto } from "../dto/document-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/domain/user";

@ApiTags("Documents - Review")
@ApiBearerAuth()
@Controller("api/v1/documents/review")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsReviewController {
  constructor(
    private readonly reviewService: DocumentReviewService,
    private readonly bulkApprovalService: BulkApprovalService,
  ) { }

  /**
   * Review a document (approve or reject)
   */
  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Review document",
    description: "Approve or reject a document",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Document reviewed successfully",
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid review data or document status",
  })
  async reviewDocument(
    @Param("id") id: string,
    @Body() dto: ReviewDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    const reviewerId = req.user.userId;
    const tenantId = req.user.tenantId;

    return this.reviewService.reviewDocument(id, dto, reviewerId, tenantId);
  }

  /**
   * Get pending review queue
   */
  @Get("queue")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get pending review queue",
    description: "Get list of documents pending review",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Review queue retrieved successfully",
  })
  async getReviewQueue(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Request() req: any,
  ): Promise<any> {
    const tenantId = req.user.tenantId;
    return this.reviewService.getPendingReviewQueue(tenantId, page, limit);
  }

  /**
   * Get review statistics
   */
  @Get("statistics")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get review statistics",
    description: "Get aggregate statistics for document review",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statistics retrieved successfully",
    schema: {
      type: "object",
      properties: {
        totalPending: { type: "number" },
        totalApproved: { type: "number" },
        totalRejected: { type: "number" },
        oldestPendingDays: { type: "number" },
        pendingByType: { type: "object" },
        avgReviewTimeMinutes: { type: "number" },
      },
    },
  })
  async getStatistics(@Request() req: any): Promise<any> {
    const tenantId = req.user.tenantId;
    return this.reviewService.getReviewStatistics(tenantId);
  }

  /**
   * Bulk approval/rejection
   */
  @Post("bulk")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Bulk approve or reject documents",
    description: "Process multiple documents at once (max 50)",
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: "Bulk approval job created and queued",
    schema: {
      type: "object",
      properties: {
        jobId: { type: "string" },
        status: { type: "string" },
        message: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid request or document status",
  })
  async bulkApproval(
    @Body() dto: BulkApprovalDto,
    @Request() req: any,
  ): Promise<any> {
    const reviewerId = req.user.userId;
    const tenantId = req.user.tenantId;

    return this.bulkApprovalService.submitBulkApproval(
      dto,
      reviewerId,
      tenantId,
    );
  }

  /**
   * Get bulk approval job status
   */
  @Get("bulk/:jobId/status")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get bulk approval job status",
    description: "Get the status and progress of a bulk approval job",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bulk approval status retrieved",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Bulk job not found",
  })
  async getBulkJobStatus(
    @Param("jobId") jobId: string,
    @Request() req: any,
  ): Promise<any> {
    const tenantId = req.user.tenantId;
    return this.bulkApprovalService.getBulkJobStatus(jobId, tenantId);
  }
}
