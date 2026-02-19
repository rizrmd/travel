/**
 * Epic 6, Story 6.1 & 6.2: Documents Controller
 * Handles single document upload and management
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
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
import { DocumentsService } from "../services/documents.service";
import { UploadDocumentDto } from "../dto/upload-document.dto";
import {
  DocumentResponseDto,
  DocumentListResponseDto,
} from "../dto/document-response.dto";
import { DocumentsListQueryDto } from "../dto/documents-list-query.dto";
import { Document, UploaderType } from "../domain/document";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/domain/user";

@ApiTags("Documents")
@ApiBearerAuth()
@Controller("api/v1/documents")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  /**
   * Upload a single document
   */
  @Post("upload")
  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.JAMAAH)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload a single document",
    description:
      "Upload KTP, Passport, KK, Photo, Vaccination, or other documents",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file", "jamaahId", "documentType"],
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Document file (PDF, JPG, JPEG, PNG)",
        },
        jamaahId: {
          type: "string",
          format: "uuid",
          description: "Jamaah ID",
        },
        documentType: {
          type: "string",
          enum: [
            "ktp",
            "passport",
            "kk",
            "photo",
            "vaccination",
            "visa",
            "flight_ticket",
            "hotel_voucher",
            "insurance",
            "other",
          ],
        },
        expiresAt: {
          type: "string",
          format: "date",
          description: "Expiration date (for passport, visa, vaccination)",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Document uploaded successfully",
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid file or validation error",
  })
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: Document.MAX_FILE_SIZE }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    const tenantId = req.user.tenantId;
    const uploaderId = req.user.userId;
    const uploaderType =
      req.user.role === "jamaah" ? UploaderType.JAMAAH : UploaderType.AGENT;

    return this.documentsService.uploadDocument(
      file,
      dto,
      tenantId,
      uploaderId,
      uploaderType,
    );
  }

  /**
   * List documents with filtering
   */
  @Get()
  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.JAMAAH)
  @ApiOperation({
    summary: "List documents",
    description: "Get list of documents with filtering and pagination",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Documents retrieved successfully",
    type: DocumentListResponseDto,
  })
  async listDocuments(
    @Query() query: DocumentsListQueryDto,
    @Request() req: any,
  ): Promise<DocumentListResponseDto> {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    const userRole = req.user.role;

    return this.documentsService.listDocuments(
      query,
      tenantId,
      userId,
      userRole,
    );
  }

  /**
   * Get document by ID
   */
  @Get(":id")
  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.JAMAAH)
  @ApiOperation({
    summary: "Get document by ID",
    description: "Retrieve a single document by its ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Document retrieved successfully",
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Document not found",
  })
  async getDocument(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<DocumentResponseDto> {
    const tenantId = req.user.tenantId;
    return this.documentsService.getDocumentById(id, tenantId);
  }

  /**
   * Get document download URL
   */
  @Get(":id/download")
  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.JAMAAH)
  @ApiOperation({
    summary: "Get document download URL",
    description:
      "Get pre-signed URL for downloading document (15-minute expiry)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Download URL generated successfully",
    schema: {
      type: "object",
      properties: {
        url: { type: "string" },
        expiresIn: { type: "number", example: 900 },
      },
    },
  })
  async getDownloadUrl(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<{ url: string; expiresIn: number }> {
    const tenantId = req.user.tenantId;
    const url = await this.documentsService.getDownloadUrl(id, tenantId);

    return {
      url,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Delete document
   */
  @Delete(":id")
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({
    summary: "Delete document",
    description: "Soft delete a document (admin or uploader only)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Document deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "No permission to delete this document",
  })
  async deleteDocument(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    const userRole = req.user.role;

    await this.documentsService.deleteDocument(id, tenantId, userId, userRole);

    return { message: "Document deleted successfully" };
  }

  /**
   * Check for duplicate document
   */
  @Get("check-duplicate/:jamaahId/:documentType")
  @Roles(UserRole.AGENT, UserRole.ADMIN, UserRole.JAMAAH)
  @ApiOperation({
    summary: "Check for duplicate document",
    description:
      "Check if a document of this type already exists for the jamaah",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Duplicate check completed",
    schema: {
      type: "object",
      properties: {
        exists: { type: "boolean" },
        message: { type: "string" },
      },
    },
  })
  async checkDuplicate(
    @Param("jamaahId") jamaahId: string,
    @Param("documentType") documentType: string,
    @Request() req: any,
  ): Promise<{ exists: boolean; message: string }> {
    const tenantId = req.user.tenantId;
    const exists = await this.documentsService.checkDuplicate(
      jamaahId,
      documentType as any,
      tenantId,
    );

    return {
      exists,
      message: exists
        ? "Document already exists. Upload will replace the existing document."
        : "No duplicate found. Safe to upload.",
    };
  }
}
