import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRole, UserStatus } from "./domain/user";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Create a new user within a tenant
   */
  async create(
    createUserDto: CreateUserDto,
    tenantId: string,
  ): Promise<UserEntity> {
    // Check if email already exists in this tenant
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        tenantId,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      tenantId,
      email: createUserDto.email,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      phone: createUserDto.phone,
      role: createUserDto.role || UserRole.AGENT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      failedLoginAttempts: 0,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Find user by ID within tenant
   */
  async findById(id: string, tenantId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException("User tidak ditemukan");
    }

    return user;
  }

  /**
   * Find user by email within tenant
   */
  async findByEmail(email: string, tenantId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email, tenantId },
    });

    if (!user) {
      throw new NotFoundException("User tidak ditemukan");
    }

    return user;
  }

  /**
   * Find all users within tenant
   */
  async findAll(
    tenantId: string,
    filters?: {
      role?: UserRole;
      status?: UserStatus;
      search?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: UserEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .where("user.tenantId = :tenantId", { tenantId });

    // Filter by role
    if (filters?.role) {
      queryBuilder.andWhere("user.role = :role", { role: filters.role });
    }

    // Filter by status
    if (filters?.status) {
      queryBuilder.andWhere("user.status = :status", {
        status: filters.status,
      });
    }

    // Search by name or email
    if (filters?.search) {
      queryBuilder.andWhere(
        "(user.fullName ILIKE :search OR user.email ILIKE :search)",
        { search: `%${filters.search}%` },
      );
    }

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Order by created date descending
    queryBuilder.orderBy("user.createdAt", "DESC");

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Update user
   */
  async update(
    id: string,
    tenantId: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.findById(id, tenantId);

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
      updateData.passwordChangedAt = new Date();
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  /**
   * Deactivate user
   */
  async deactivate(id: string, tenantId: string): Promise<UserEntity> {
    const user = await this.findById(id, tenantId);
    user.status = UserStatus.INACTIVE;
    return await this.userRepository.save(user);
  }

  /**
   * Activate user
   */
  async activate(id: string, tenantId: string): Promise<UserEntity> {
    const user = await this.findById(id, tenantId);
    user.status = UserStatus.ACTIVE;
    return await this.userRepository.save(user);
  }

  /**
   * Soft delete user
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const user = await this.findById(id, tenantId);
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  /**
   * Count users by tenant and role
   */
  async countByRole(tenantId: string, role: UserRole): Promise<number> {
    return await this.userRepository.count({
      where: { tenantId, role },
    });
  }

  /**
   * Get user statistics for tenant
   */
  async getStatistics(tenantId: string): Promise<{
    total: number;
    active: number;
    byRole: Record<UserRole, number>;
  }> {
    const total = await this.userRepository.count({
      where: { tenantId },
    });

    const active = await this.userRepository.count({
      where: { tenantId, status: UserStatus.ACTIVE },
    });

    const byRole = {} as Record<UserRole, number>;
    for (const role of Object.values(UserRole)) {
      byRole[role] = await this.countByRole(tenantId, role);
    }

    return {
      total,
      active,
      byRole,
    };
  }
}
