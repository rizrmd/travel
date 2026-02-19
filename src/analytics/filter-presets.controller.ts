/**
 * Epic 11, Story 11.7: Filter Presets Controller
 * Manage saved filter configurations
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FilterPresetService } from "./services/filter-preset.service";
import {
  CreateFilterPresetDto,
  UpdateFilterPresetDto,
  FilterPresetResponseDto,
} from "./dto/filter-preset.dto";

@ApiTags("Analytics - Filter Presets")
@Controller("analytics/filters/presets")
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, TenantGuard)
export class FilterPresetsController {
  constructor(private readonly filterPresetService: FilterPresetService) {}

  /**
   * Story 11.7: Create filter preset
   */
  @Post()
  @ApiOperation({ summary: "Simpan konfigurasi filter sebagai preset" })
  @ApiResponse({
    status: 201,
    description: "Filter preset berhasil dibuat",
    type: FilterPresetResponseDto,
  })
  @ApiResponse({ status: 400, description: "Data filter tidak valid" })
  async createPreset(
    @Body() dto: CreateFilterPresetDto,
    @Req() req: any,
  ): Promise<FilterPresetResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || "demo-user";

    return this.filterPresetService.createPreset(tenantId, userId, dto);
  }

  /**
   * Story 11.7: List filter presets
   */
  @Get()
  @ApiOperation({
    summary: "Get daftar filter presets (milik user dan public)",
  })
  @ApiResponse({
    status: 200,
    description: "Daftar filter presets berhasil diambil",
    type: [FilterPresetResponseDto],
  })
  async listPresets(@Req() req: any): Promise<FilterPresetResponseDto[]> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || "demo-user";

    return this.filterPresetService.listPresets(tenantId, userId);
  }

  /**
   * Story 11.7: Get filter preset by ID
   */
  @Get(":id")
  @ApiOperation({ summary: "Get filter preset berdasarkan ID" })
  @ApiResponse({
    status: 200,
    description: "Filter preset berhasil diambil",
    type: FilterPresetResponseDto,
  })
  @ApiResponse({ status: 404, description: "Filter preset tidak ditemukan" })
  async getPreset(
    @Param("id") id: string,
    @Req() req: any,
  ): Promise<FilterPresetResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || "demo-user";

    return this.filterPresetService.getPreset(tenantId, userId, id);
  }

  /**
   * Story 11.7: Update filter preset
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update filter preset" })
  @ApiResponse({
    status: 200,
    description: "Filter preset berhasil diupdate",
    type: FilterPresetResponseDto,
  })
  @ApiResponse({ status: 404, description: "Filter preset tidak ditemukan" })
  async updatePreset(
    @Param("id") id: string,
    @Body() dto: UpdateFilterPresetDto,
    @Req() req: any,
  ): Promise<FilterPresetResponseDto> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || "demo-user";

    return this.filterPresetService.updatePreset(tenantId, userId, id, dto);
  }

  /**
   * Story 11.7: Delete filter preset
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Hapus filter preset" })
  @ApiResponse({ status: 204, description: "Filter preset berhasil dihapus" })
  @ApiResponse({ status: 404, description: "Filter preset tidak ditemukan" })
  async deletePreset(@Param("id") id: string, @Req() req: any): Promise<void> {
    const tenantId = req.user?.tenantId || "demo-tenant";
    const userId = req.user?.id || "demo-user";

    await this.filterPresetService.deletePreset(tenantId, userId, id);
  }
}
