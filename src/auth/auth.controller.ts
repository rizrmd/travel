import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "./decorators/public.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login
   * Returns access token and refresh token
   */
  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "User login",
    description: "Authenticate user with email and password",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials or account locked",
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      // For development: allow login without tenant context
      // In production, this should be required
      // throw new UnauthorizedException('Tenant context not found');
    }

    return await this.authService.login(
      loginDto,
      tenantId || "default-tenant-id",
      ip,
      userAgent,
    );
  }

  /**
   * Register new user (within tenant)
   */
  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Register new user",
    description: "Create a new user account within the tenant",
  })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Email already exists",
  })
  async register(@Body() registerDto: RegisterDto, @Request() req) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      // For development
      // throw new UnauthorizedException('Tenant context not found');
    }

    return await this.authService.register(
      registerDto,
      tenantId || "default-tenant-id",
    );
  }

  /**
   * Refresh access token
   */
  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh access token",
    description: "Get new access token using refresh token",
  })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired refresh token",
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  /**
   * Logout user
   */
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Logout user",
    description: "Revoke refresh token and end session",
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return {
      message: "Logout berhasil",
    };
  }

  /**
   * Get current user profile
   */
  @UseGuards(JwtAuthGuard)
  @Post("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user",
    description: "Returns currently authenticated user information",
  })
  async getCurrentUser(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      tenantId: req.user.tenantId,
      status: req.user.status,
      emailVerified: req.user.emailVerified,
    };
  }
}
