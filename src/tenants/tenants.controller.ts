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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { ResourceMonitorService } from "./services/resource-monitor.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import {
  UpdateTenantDto,
  UpdateDomainDto,
  FilterTenantsDto,
} from "./dto/update-tenant.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { UserRole } from "../users/domain/user";

@ApiTags("Tenants")
@Controller("tenants")
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly resourceMonitor: ResourceMonitorService,
  ) {}

  /**
   * Register a new tenant (public endpoint)
   * Story 2.1: Tenant Registration and Automated Provisioning
   */
  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Register new travel agency",
    description:
      "Creates a new tenant record and triggers automated provisioning workflow",
  })
  @ApiResponse({
    status: 201,
    description: "Tenant registration initiated successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Email or agency name already exists",
  })
  async register(@Body() createTenantDto: CreateTenantDto) {
    const tenant = await this.tenantsService.register(createTenantDto);

    return {
      message:
        "Pendaftaran berhasil! Tim kami akan mengaktifkan akun Anda dalam 24 jam.",
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        subdomain: `${tenant.slug}.travelumroh.com`,
      },
    };
  }

  /**
   * Get all tenants (admin only)
   * Story 2.5: Tenant Management Dashboard
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get("admin/all")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all tenants (admin only)",
    description: "Returns paginated list of all tenants with filtering",
  })
  async getAllTenants(@Query() filters: FilterTenantsDto) {
    return await this.tenantsService.findAll(filters);
  }

  /**
   * Get current tenant details
   */
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current tenant information" })
  async getCurrentTenant(@Request() req) {
    const tenant = await this.tenantsService.findById(req.tenantId);

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      tier: tenant.tier,
      status: tenant.status,
      subdomain: `${tenant.slug}.travelumroh.com`,
      customDomain: tenant.customDomain,
      resourceLimits: tenant.resourceLimits,
    };
  }

  /**
   * Get tenant by ID (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get("admin/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get tenant by ID (admin only)" })
  async getTenantById(@Param("id") id: string) {
    return await this.tenantsService.findById(id);
  }

  /**
   * Update tenant (agency owner or admin)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.SUPER_ADMIN)
  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update tenant information" })
  async updateTenant(
    @Param("id") id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return await this.tenantsService.update(id, updateTenantDto);
  }

  /**
   * Update custom domain (enterprise only)
   * Story 2.3: Custom Domain Mapping for Enterprise Tier
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENCY_OWNER, UserRole.SUPER_ADMIN)
  @Put(":id/domain")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Configure custom domain (enterprise tier only)",
    description: "Initiates DNS verification process for custom domain mapping",
  })
  async updateDomain(
    @Param("id") id: string,
    @Body() updateDomainDto: UpdateDomainDto,
  ) {
    const tenant = await this.tenantsService.updateDomain(
      id,
      updateDomainDto.customDomain,
    );

    return {
      message: "Verifikasi domain dimulai",
      domain: tenant.customDomain,
      verificationToken: tenant.domainVerificationToken,
      instructions: {
        step1: `Tambahkan TXT record ke DNS domain Anda:`,
        txtRecord: {
          name: "@",
          value: tenant.domainVerificationToken,
        },
        step2: `Tambahkan CNAME record:`,
        cnameRecord: {
          name: "www",
          value: "travelumroh.com",
        },
        step3: "Verifikasi akan berjalan otomatis setiap 5 menit",
      },
    };
  }

  /**
   * Get resource usage statistics
   * Story 2.4: Resource Limits Enforcement
   */
  @UseGuards(JwtAuthGuard)
  @Get(":id/usage")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get resource usage statistics",
    description: "Returns current resource usage vs limits for tenant",
  })
  async getResourceUsage(@Param("id") id: string) {
    const usage = await this.resourceMonitor.getResourceUsage(id);

    return {
      concurrentUsers: {
        current: usage.currentConcurrentUsers,
        limit: usage.maxConcurrentUsers,
        percentage: Math.round(
          (usage.currentConcurrentUsers / usage.maxConcurrentUsers) * 100,
        ),
      },
      jamaahThisMonth: {
        current: usage.jamaahThisMonth,
        limit: usage.maxJamaahPerMonth,
        percentage: Math.round(
          (usage.jamaahThisMonth / usage.maxJamaahPerMonth) * 100,
        ),
      },
      agents: {
        current: usage.agentsCount,
        limit: usage.maxAgents,
      },
      packages: {
        current: usage.packagesCount,
        limit: usage.maxPackages,
      },
    };
  }

  /**
   * Suspend tenant (admin only)
   * Story 2.5: Tenant Management Dashboard
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Put("admin/:id/suspend")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Suspend tenant (admin only)" })
  async suspendTenant(@Param("id") id: string) {
    const tenant = await this.tenantsService.suspend(id);
    return {
      message: "Tenant berhasil disuspend",
      tenant,
    };
  }

  /**
   * Activate tenant (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Put("admin/:id/activate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Activate tenant (admin only)" })
  async activateTenant(@Param("id") id: string) {
    const tenant = await this.tenantsService.activate(id);
    return {
      message: "Tenant berhasil diaktifkan",
      tenant,
    };
  }

  /**
   * Delete tenant (admin only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete("admin/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Soft delete tenant (admin only)" })
  async deleteTenant(@Param("id") id: string) {
    await this.tenantsService.delete(id);
    return {
      message: "Tenant berhasil dihapus",
    };
  }
}
