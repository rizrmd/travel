import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../users/entities/user.entity";
import { SessionEntity } from "./entities/session.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserRole, UserStatus } from "../users/domain/user";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  tenantId: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    tenantId: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * User login with email and password
   */
  async login(
    loginDto: LoginDto,
    tenantId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    // Find user by email and tenant
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
        tenantId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Email atau password salah");
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Akun terkunci. Coba lagi dalam ${minutesLeft} menit.`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await this.userRepository.save(user);

      throw new UnauthorizedException("Email atau password salah");
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Akun tidak aktif");
    }

    // Reset failed login attempts
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;
    await this.userRepository.save(user);

    // Generate tokens
    return await this.generateTokens(user, ipAddress, userAgent);
  }

  /**
   * Register a new user (within existing tenant)
   */
  async register(
    registerDto: RegisterDto,
    tenantId: string,
  ): Promise<AuthResponse> {
    // Check if email already exists in this tenant
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
        tenantId,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      tenantId,
      email: registerDto.email,
      password: hashedPassword,
      fullName: registerDto.fullName,
      phone: registerDto.phone,
      role: registerDto.role || UserRole.AGENT,
      status: UserStatus.PENDING_VERIFICATION,
      emailVerified: false,
      failedLoginAttempts: 0,
    });

    const savedUser = await this.userRepository.save(user);

    // TODO: Send verification email
    // await this.emailService.sendVerificationEmail(savedUser);

    // Auto-activate for development (in production, require email verification)
    savedUser.status = UserStatus.ACTIVE;
    savedUser.emailVerified = true;
    savedUser.emailVerifiedAt = new Date();
    await this.userRepository.save(savedUser);

    // Generate tokens
    return await this.generateTokens(savedUser);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Find session by refresh token
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
      relations: ["user"],
    });

    if (!session) {
      throw new UnauthorizedException("Token tidak valid");
    }

    // Check if token expired
    if (new Date() > session.expiresAt) {
      throw new UnauthorizedException("Token sudah kadaluarsa");
    }

    // Revoke old session
    session.isActive = false;
    session.revokedAt = new Date();
    await this.sessionRepository.save(session);

    // Generate new tokens
    return await this.generateTokens(session.user);
  }

  /**
   * Logout user by revoking refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });

    if (session) {
      session.isActive = false;
      session.revokedAt = new Date();
      await this.sessionRepository.save(session);
    }
  }

  /**
   * Validate user from JWT payload
   */
  async validateUser(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
        tenantId: payload.tenantId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User tidak ditemukan");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Akun tidak aktif");
    }

    return user;
  }

  /**
   * Generate access token and refresh token
   */
  private async generateTokens(
    user: UserEntity,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    // Generate access token (15 minutes)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    });

    // Generate refresh token (7 days)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d",
    });

    // Save refresh token in session
    const session = this.sessionRepository.create({
      tenantId: user.tenantId,
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent,
      isActive: true,
    });

    await this.sessionRepository.save(session);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  /**
   * Verify email (for email verification flow)
   */
  async verifyEmail(userId: string, token: string): Promise<void> {
    // TODO: Implement email verification logic
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException("User tidak ditemukan");
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.status = UserStatus.ACTIVE;
    await this.userRepository.save(user);
  }
}
