/**
 * Epic 13, Story 13.4: Training Materials Controller
 * Manages training content and progress (9 endpoints)
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/domain/user";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { TrainingMaterialService } from "./services/training-material.service";
import { TrainingProgressService } from "./services/training-progress.service";
import { CreateTrainingMaterialDto } from "./dto/create-training-material.dto";
import { UpdateTrainingMaterialDto } from "./dto/update-training-material.dto";
import { TrainingMaterialsListQueryDto } from "./dto/training-materials-list-query.dto";
import { SearchMaterialsQueryDto } from "./dto/search-materials-query.dto";
import { MarkCompleteDto } from "./dto/mark-complete.dto";

@Controller("onboarding/training")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingMaterialsController {
  constructor(
    private materialService: TrainingMaterialService,
    private progressService: TrainingProgressService,
  ) { }

  // 1. Create material
  @Post("materials")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async createMaterial(
    @Body() dto: CreateTrainingMaterialDto,
    @GetUser() user: any,
  ) {
    return await this.materialService.create(user.tenantId, dto);
  }

  // 2. List materials
  @Get("materials")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async listMaterials(
    @Query() query: TrainingMaterialsListQueryDto,
    @GetUser() user: any,
  ) {
    const result = await this.materialService.list(user.tenantId, query);
    return {
      data: result.materials,
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 50,
    };
  }

  // 3. Get material details
  @Get("materials/:id")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async getMaterial(@Param("id") id: string, @GetUser() user: any) {
    const material = await this.materialService.findById(id, user.tenantId);
    const progress = await this.progressService.getUserProgress(
      user.tenantId,
      user.id,
      id,
    );

    return {
      ...material,
      user_progress: progress,
    };
  }

  // 4. Update material
  @Patch("materials/:id")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async updateMaterial(
    @Param("id") id: string,
    @Body() dto: UpdateTrainingMaterialDto,
    @GetUser() user: any,
  ) {
    return await this.materialService.update(id, user.tenantId, dto);
  }

  // 5. Delete material
  @Delete("materials/:id")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER)
  async deleteMaterial(@Param("id") id: string, @GetUser() user: any) {
    await this.materialService.delete(id, user.tenantId);
    return { message: "Materi training berhasil dihapus" };
  }

  // 6. Mark material as completed
  @Post("materials/:id/complete")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async markComplete(
    @Param("id") materialId: string,
    @Body() dto: MarkCompleteDto,
    @GetUser() user: any,
  ) {
    return await this.progressService.markAsCompleted(
      user.tenantId,
      user.id,
      materialId,
      dto.quiz_score,
      dto.metadata,
    );
  }

  // 7. Get user training progress
  @Get("progress")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async getUserProgress(@GetUser() user: any) {
    return await this.progressService.getUserProgressSummary(
      user.tenantId,
      user.id,
    );
  }

  // 8. Get training categories
  @Get("categories")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async getCategories(@GetUser() user: any) {
    const categories = await this.materialService.getCategories(user.tenantId);
    return {
      categories,
      total: categories.length,
    };
  }

  // 9. Search materials
  @Get("search")
  @Roles(UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENT)
  async searchMaterials(
    @Query() query: SearchMaterialsQueryDto,
    @GetUser() user: any,
  ) {
    const result = await this.materialService.search(
      user.tenantId,
      query.query,
      query.category,
      query.page,
      query.limit,
    );

    return {
      data: result.materials,
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }
}
