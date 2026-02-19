/**
 * Epic 6, Story 6.3: Documents Batch Controller
 * Handles ZIP batch upload
 */

import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BatchUploadService } from "../services/batch-upload.service";
import {
  BatchUploadResponseDto,
  BatchUploadStatusDto,
} from "../dto/batch-upload-response.dto";
import { BatchUploadJob } from "../domain/batch-upload";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/domain/user";

@ApiTags("Documents - Batch Upload")
@ApiBearerAuth()
@Controller("api/v1/documents/batch")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsBatchController {
  constructor(private readonly batchUploadService: BatchUploadService) { }

  /**
   * Upload ZIP batch
   */
  @Post("upload")
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload ZIP batch",
    description:
      "Upload a ZIP file containing multiple documents. Filename format: {JamaahName}-{DocumentType}.{ext}",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "ZIP file (max 100MB)",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: "Batch upload job created and queued",
    type: BatchUploadResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid file or validation error",
  })
  async uploadBatch(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: BatchUploadJob.MAX_ZIP_SIZE }),
          new FileTypeValidator({
            fileType: /(zip|x-zip-compressed)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ): Promise<BatchUploadResponseDto> {
    const tenantId = req.user.tenantId;
    const uploaderId = req.user.userId;

    return this.batchUploadService.uploadBatch(file, tenantId, uploaderId);
  }

  /**
   * Get batch upload status
   */
  @Get(":jobId/status")
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({
    summary: "Get batch upload status",
    description: "Get the status and progress of a batch upload job",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Batch upload status retrieved",
    type: BatchUploadStatusDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Batch job not found",
  })
  async getBatchStatus(
    @Param("jobId") jobId: string,
    @Request() req: any,
  ): Promise<BatchUploadStatusDto> {
    const tenantId = req.user.tenantId;
    return this.batchUploadService.getBatchStatus(jobId, tenantId);
  }

  /**
   * Get batch upload error report
   */
  @Get(":jobId/error-report")
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({
    summary: "Get batch upload error report",
    description: "Download CSV error report for failed files in batch upload",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Error report retrieved",
    schema: {
      type: "object",
      properties: {
        jobId: { type: "string" },
        errorReport: {
          type: "string",
          description: "CSV formatted error report",
        },
      },
    },
  })
  async getErrorReport(
    @Param("jobId") jobId: string,
    @Request() req: any,
  ): Promise<{ jobId: string; errorReport: string }> {
    const tenantId = req.user.tenantId;
    const status = await this.batchUploadService.getBatchStatus(
      jobId,
      tenantId,
    );

    return {
      jobId,
      errorReport: status.errorReport || "No errors",
    };
  }
}
