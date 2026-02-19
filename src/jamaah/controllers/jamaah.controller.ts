/**
 * Epic 5, Stories 5.1, 5.2, 5.3, 5.7: Jamaah Controller
 * Main CRUD and listing endpoints for jamaah
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JamaahService } from "../services/jamaah.service";
import { JamaahFilteringService } from "../services/jamaah-filtering.service";
import { ActionLogService } from "../services/action-log.service";
import {
  CreateJamaahDto,
  UpdateJamaahDto,
  JamaahResponseDto,
  JamaahListQueryDto,
  ChangeServiceModeDto,
  ActionLogQueryDto,
} from "../dto";

@ApiTags("Jamaah Management")
@ApiBearerAuth()
@Controller("api/v1/jamaah")
export class JamaahController {
  constructor(
    private readonly jamaahService: JamaahService,
    private readonly filteringService: JamaahFilteringService,
    private readonly actionLogService: ActionLogService,
  ) {}

  /**
   * Story 5.1: Create jamaah
   */
  @Post()
  @ApiOperation({ summary: "Create a new jamaah" })
  @ApiResponse({
    status: 201,
    description: "Jamaah created successfully",
    type: JamaahResponseDto,
  })
  async create(
    @Body() createDto: CreateJamaahDto,
    @Request() req,
  ): Promise<JamaahResponseDto> {
    return this.jamaahService.create(
      createDto,
      req.user.tenantId,
      req.user.sub,
      req.user.sub,
    );
  }

  /**
   * Story 5.1 & 5.3: Get my jamaah with filters
   */
  @Get("my-jamaah")
  @ApiOperation({ summary: "Get all jamaah assigned to me with filters" })
  @ApiResponse({
    status: 200,
    description: "Returns filtered jamaah list",
    schema: {
      properties: {
        data: {
          type: "array",
          items: { $ref: "#/components/schemas/JamaahResponseDto" },
        },
        meta: {
          type: "object",
          properties: {
            total: { type: "number" },
            page: { type: "number" },
            perPage: { type: "number" },
            totalPages: { type: "number" },
          },
        },
      },
    },
  })
  async getMyJamaah(@Query() query: JamaahListQueryDto, @Request() req) {
    return this.filteringService.getMyJamaah(
      query,
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.1: Get jamaah by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Get jamaah by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns jamaah details",
    type: JamaahResponseDto,
  })
  @ApiResponse({ status: 404, description: "Jamaah not found" })
  async findById(
    @Param("id") id: string,
    @Request() req,
  ): Promise<JamaahResponseDto> {
    return this.jamaahService.findById(id, req.user.tenantId);
  }

  /**
   * Story 5.1: Update jamaah
   */
  @Put(":id")
  @ApiOperation({ summary: "Update jamaah" })
  @ApiResponse({
    status: 200,
    description: "Jamaah updated successfully",
    type: JamaahResponseDto,
  })
  @ApiResponse({ status: 404, description: "Jamaah not found" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateJamaahDto,
    @Request() req,
  ): Promise<JamaahResponseDto> {
    return this.jamaahService.update(
      id,
      updateDto,
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.1: Delete jamaah
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete jamaah (soft delete)" })
  @ApiResponse({ status: 204, description: "Jamaah deleted successfully" })
  @ApiResponse({ status: 404, description: "Jamaah not found" })
  async remove(@Param("id") id: string, @Request() req): Promise<void> {
    return this.jamaahService.remove(id, req.user.tenantId);
  }

  /**
   * Story 5.7: Change service mode
   */
  @Put(":id/service-mode")
  @ApiOperation({ summary: "Change jamaah service mode" })
  @ApiResponse({
    status: 200,
    description: "Service mode updated successfully",
  })
  async changeServiceMode(
    @Param("id") id: string,
    @Body() dto: ChangeServiceModeDto,
    @Request() req,
  ): Promise<JamaahResponseDto> {
    return this.jamaahService.update(
      id,
      { serviceMode: dto.mode },
      req.user.tenantId,
      req.user.sub,
    );
  }

  /**
   * Story 5.5: Get jamaah audit trail
   */
  @Get(":id/audit-trail")
  @ApiOperation({ summary: "Get jamaah audit trail" })
  @ApiResponse({
    status: 200,
    description: "Returns jamaah action history",
    schema: {
      type: "array",
      items: { $ref: "#/components/schemas/ActionLogResponseDto" },
    },
  })
  async getAuditTrail(@Param("id") id: string, @Request() req) {
    return this.actionLogService.getJamaahAuditTrail(id, req.user.tenantId);
  }
}
