/**
 * Epic 4: Packages Controller
 * RESTful API endpoints for package management
 * Implements Stories 4.1, 4.2, 4.3, 4.4, 4.6, 4.7
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { PackagesService } from "./services/packages.service";
import { ItineraryService } from "./services/itinerary.service";
import { PricingService, UserRole } from "./services/pricing.service";
import { PackageVersioningService } from "./services/package-versioning.service";
import { InclusionsService } from "./services/inclusions.service";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { PackagesListQueryDto } from "./dto/packages-list-query.dto";
import { CreateItineraryItemDto } from "./dto/create-itinerary-item.dto";
import { UpdateItineraryItemDto } from "./dto/update-itinerary-item.dto";
import { CreateInclusionDto } from "./dto/create-inclusion.dto";
import { PackageResponseDto } from "./dto/package-response.dto";
import { ItineraryItemResponseDto } from "./dto/itinerary-item-response.dto";
import {
  InclusionResponseDto,
  GroupedInclusionsResponseDto,
} from "./dto/inclusion-response.dto";
import {
  PackageVersionResponseDto,
  PackageVersionListResponseDto,
} from "./dto/package-version-response.dto";

@ApiTags("Packages")
@ApiBearerAuth()
@Controller("packages")
export class PackagesController {
  constructor(
    private readonly packagesService: PackagesService,
    private readonly itineraryService: ItineraryService,
    private readonly pricingService: PricingService,
    private readonly versioningService: PackageVersioningService,
    private readonly inclusionsService: InclusionsService,
  ) {}

  /**
   * Story 4.1: Create new package
   */
  @Post()
  @ApiOperation({ summary: "Create a new package (Agency Owner only)" })
  @ApiResponse({
    status: 201,
    description: "Package created successfully",
    type: PackageResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  @ApiResponse({
    status: 422,
    description: "Unprocessable entity - invalid pricing",
  })
  async create(
    @Req() req: any,
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userId = req.user.id;
    const userRole = req.user.role || UserRole.OWNER;

    const packageEntity = await this.packagesService.create(
      tenantId,
      userId,
      createPackageDto,
    );

    return this.pricingService.filterPackageByRole(
      packageEntity,
      userRole,
    ) as PackageResponseDto;
  }

  /**
   * Story 4.1 & 4.7: List all packages
   */
  @Get()
  @ApiOperation({ summary: "List all packages with filters and pagination" })
  @ApiResponse({
    status: 200,
    description: "Packages retrieved successfully",
    type: [PackageResponseDto],
  })
  async findAll(
    @Req() req: any,
    @Query() query: PackagesListQueryDto,
  ): Promise<{
    data: Partial<PackageResponseDto>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userRole = req.user?.role || UserRole.PUBLIC;

    const result = await this.packagesService.findAll(tenantId, query);

    return {
      ...result,
      data: this.pricingService.filterPackagesByRole(result.data, userRole),
    };
  }

  /**
   * Story 4.1 & 4.7: Get package details
   */
  @Get(":id")
  @ApiOperation({ summary: "Get package details by ID" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({
    status: 200,
    description: "Package retrieved successfully",
    type: PackageResponseDto,
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  async findOne(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<Partial<PackageResponseDto>> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userRole = req.user?.role || UserRole.PUBLIC;

    const packageEntity = await this.packagesService.findOne(tenantId, id);

    return this.pricingService.filterPackageByRole(packageEntity, userRole);
  }

  /**
   * Story 4.1: Update package
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update package (Agency Owner only)" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({
    status: 200,
    description: "Package updated successfully",
    type: PackageResponseDto,
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  @ApiResponse({ status: 422, description: "Invalid pricing" })
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ): Promise<Partial<PackageResponseDto>> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userId = req.user.id;
    const userRole = req.user.role || UserRole.OWNER;

    const packageEntity = await this.packagesService.update(
      tenantId,
      id,
      userId,
      updatePackageDto,
    );

    return this.pricingService.filterPackageByRole(packageEntity, userRole);
  }

  /**
   * Story 4.1: Delete package (soft delete)
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Soft delete package (Agency Owner only)" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({ status: 204, description: "Package deleted successfully" })
  @ApiResponse({ status: 404, description: "Package not found" })
  async remove(@Req() req: any, @Param("id") id: string): Promise<void> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userId = req.user.id;

    await this.packagesService.remove(tenantId, id, userId);
  }

  /**
   * Publish package
   */
  @Post(":id/publish")
  @ApiOperation({ summary: "Publish package (change status to PUBLISHED)" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiResponse({
    status: 200,
    description: "Package published successfully",
    type: PackageResponseDto,
  })
  async publish(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<Partial<PackageResponseDto>> {
    const tenantId = req.tenantId || req.user.tenantId;
    const userId = req.user.id;
    const userRole = req.user.role || UserRole.OWNER;

    const packageEntity = await this.packagesService.publish(
      tenantId,
      id,
      userId,
    );

    return this.pricingService.filterPackageByRole(packageEntity, userRole);
  }

  // ========== ITINERARY ENDPOINTS (Story 4.2) ==========

  /**
   * Story 4.2: Create itinerary item
   */
  @Post(":packageId/itinerary")
  @ApiOperation({ summary: "Create itinerary item for package" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiResponse({
    status: 201,
    description: "Itinerary item created successfully",
    type: ItineraryItemResponseDto,
  })
  async createItinerary(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Body() createItineraryDto: CreateItineraryItemDto,
  ): Promise<ItineraryItemResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.itineraryService.create(
      tenantId,
      packageId,
      createItineraryDto,
    );
  }

  /**
   * Story 4.2: Get all itinerary items for package
   */
  @Get(":packageId/itinerary")
  @ApiOperation({ summary: "Get all itinerary items for package" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiResponse({
    status: 200,
    description: "Itinerary items retrieved successfully",
    type: [ItineraryItemResponseDto],
  })
  async getItinerary(
    @Req() req: any,
    @Param("packageId") packageId: string,
  ): Promise<{ package_id: string; itinerary: ItineraryItemResponseDto[] }> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.itineraryService.getFormattedItinerary(
      tenantId,
      packageId,
    );
  }

  /**
   * Story 4.2: Update itinerary item
   */
  @Patch(":packageId/itinerary/:dayId")
  @ApiOperation({ summary: "Update itinerary item" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiParam({ name: "dayId", description: "Itinerary item ID" })
  @ApiResponse({
    status: 200,
    description: "Itinerary item updated successfully",
    type: ItineraryItemResponseDto,
  })
  async updateItinerary(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Param("dayId") dayId: string,
    @Body() updateItineraryDto: UpdateItineraryItemDto,
  ): Promise<ItineraryItemResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.itineraryService.update(
      tenantId,
      packageId,
      dayId,
      updateItineraryDto,
    );
  }

  /**
   * Story 4.2: Delete itinerary item
   */
  @Delete(":packageId/itinerary/:dayId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete itinerary item" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiParam({ name: "dayId", description: "Itinerary item ID" })
  @ApiResponse({
    status: 204,
    description: "Itinerary item deleted successfully",
  })
  async deleteItinerary(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Param("dayId") dayId: string,
  ): Promise<void> {
    const tenantId = req.tenantId || req.user.tenantId;

    await this.itineraryService.remove(tenantId, packageId, dayId);
  }

  // ========== INCLUSIONS ENDPOINTS (Story 4.4) ==========

  /**
   * Story 4.4: Create inclusion/exclusion
   */
  @Post(":packageId/inclusions")
  @ApiOperation({ summary: "Create inclusion or exclusion for package" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiResponse({
    status: 201,
    description: "Inclusion created successfully",
    type: InclusionResponseDto,
  })
  async createInclusion(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Body() createInclusionDto: CreateInclusionDto,
  ): Promise<InclusionResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.inclusionsService.create(
      tenantId,
      packageId,
      createInclusionDto,
    );
  }

  /**
   * Story 4.4: Get all inclusions/exclusions for package
   */
  @Get(":packageId/inclusions")
  @ApiOperation({ summary: "Get all inclusions and exclusions for package" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiQuery({
    name: "grouped",
    required: false,
    description: "Return grouped by category",
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: "Inclusions retrieved successfully",
  })
  async getInclusions(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Query("grouped") grouped?: boolean,
  ): Promise<InclusionResponseDto[] | GroupedInclusionsResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    if (grouped === true || grouped === ("true" as any)) {
      return await this.inclusionsService.findGroupedByPackage(
        tenantId,
        packageId,
      );
    }

    return await this.inclusionsService.findAllByPackage(tenantId, packageId);
  }

  /**
   * Story 4.4: Update inclusion/exclusion
   */
  @Patch(":packageId/inclusions/:id")
  @ApiOperation({ summary: "Update inclusion or exclusion" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiParam({ name: "id", description: "Inclusion ID" })
  @ApiResponse({
    status: 200,
    description: "Inclusion updated successfully",
    type: InclusionResponseDto,
  })
  async updateInclusion(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Param("id") id: string,
    @Body() updateInclusionDto: Partial<CreateInclusionDto>,
  ): Promise<InclusionResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.inclusionsService.update(
      tenantId,
      packageId,
      id,
      updateInclusionDto,
    );
  }

  /**
   * Story 4.4: Delete inclusion/exclusion
   */
  @Delete(":packageId/inclusions/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete inclusion or exclusion" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiParam({ name: "id", description: "Inclusion ID" })
  @ApiResponse({ status: 204, description: "Inclusion deleted successfully" })
  async deleteInclusion(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Param("id") id: string,
  ): Promise<void> {
    const tenantId = req.tenantId || req.user.tenantId;

    await this.inclusionsService.remove(tenantId, packageId, id);
  }

  /**
   * Story 4.4: Add inclusions from template
   */
  @Post(":packageId/inclusions/from-template")
  @ApiOperation({ summary: "Add inclusions from predefined template" })
  @ApiParam({ name: "packageId", description: "Package ID" })
  @ApiQuery({
    name: "template",
    enum: ["economy", "standard", "premium"],
    description: "Template type",
  })
  @ApiResponse({
    status: 201,
    description: "Inclusions added from template successfully",
    type: [InclusionResponseDto],
  })
  async addFromTemplate(
    @Req() req: any,
    @Param("packageId") packageId: string,
    @Query("template") template: "economy" | "standard" | "premium",
  ): Promise<InclusionResponseDto[]> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.inclusionsService.createFromTemplate(
      tenantId,
      packageId,
      template,
    );
  }

  // ========== VERSION HISTORY ENDPOINTS (Story 4.6) ==========

  /**
   * Story 4.6: Get package version history
   */
  @Get(":id/versions")
  @ApiOperation({ summary: "Get package version history (audit trail)" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Version history retrieved successfully",
    type: PackageVersionListResponseDto,
  })
  async getVersions(
    @Req() req: any,
    @Param("id") id: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<PackageVersionListResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.versioningService.findAllVersions(
      tenantId,
      id,
      page || 1,
      limit || 10,
    );
  }

  /**
   * Story 4.6: Get specific version snapshot
   */
  @Get(":id/versions/:versionNumber")
  @ApiOperation({ summary: "Get specific version snapshot" })
  @ApiParam({ name: "id", description: "Package ID" })
  @ApiParam({
    name: "versionNumber",
    description: "Version number",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Version snapshot retrieved successfully",
    type: PackageVersionResponseDto,
  })
  async getVersion(
    @Req() req: any,
    @Param("id") id: string,
    @Param("versionNumber") versionNumber: number,
  ): Promise<PackageVersionResponseDto> {
    const tenantId = req.tenantId || req.user.tenantId;

    return await this.versioningService.findVersion(
      tenantId,
      id,
      Number(versionNumber),
    );
  }
}
