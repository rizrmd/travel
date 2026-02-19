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
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole, UserStatus } from "./domain/user";

@ApiTags("Users")
@Controller("api/v1/users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create new user (agency owner or admin only)
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new user" })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return await this.usersService.create(createUserDto, req.tenantId);
  }

  /**
   * Get all users in tenant
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users in tenant" })
  async findAll(
    @Request() req,
    @Query("role") role?: UserRole,
    @Query("status") status?: UserStatus,
    @Query("search") search?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return await this.usersService.findAll(req.tenantId, {
      role,
      status,
      search,
      page,
      limit,
    });
  }

  /**
   * Get user by ID
   */
  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID" })
  async findById(@Param("id") id: string, @Request() req) {
    return await this.usersService.findById(id, req.tenantId);
  }

  /**
   * Update user
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user" })
  async update(
    @Param("id") id: string,
    @Body() updateData: Partial<CreateUserDto>,
    @Request() req,
  ) {
    return await this.usersService.update(id, req.tenantId, updateData);
  }

  /**
   * Deactivate user
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(":id/deactivate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Deactivate user" })
  async deactivate(@Param("id") id: string, @Request() req) {
    return await this.usersService.deactivate(id, req.tenantId);
  }

  /**
   * Activate user
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(":id/activate")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Activate user" })
  async activate(@Param("id") id: string, @Request() req) {
    return await this.usersService.activate(id, req.tenantId);
  }

  /**
   * Delete user
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.SUPER_ADMIN)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user" })
  async delete(@Param("id") id: string, @Request() req) {
    await this.usersService.delete(id, req.tenantId);
    return { message: "User berhasil dihapus" };
  }

  /**
   * Get user statistics
   */
  @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get("stats/overview")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user statistics for tenant" })
  async getStatistics(@Request() req) {
    return await this.usersService.getStatistics(req.tenantId);
  }
}
