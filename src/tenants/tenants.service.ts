import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import * as bcrypt from "bcrypt";
import { TenantEntity } from "./entities/tenant.entity";
import { UserEntity } from "../users/entities/user.entity";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto, FilterTenantsDto } from "./dto/update-tenant.dto";
import { Tenant, TenantStatus, TenantTier } from "./domain/tenant";
import { UserRole, UserStatus } from "../users/domain/user";

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectQueue("tenant-provisioning")
    private readonly provisioningQueue: Queue,
  ) { }

  /**
   * Register a new tenant (agency)
   * Creates tenant record and queues provisioning job
   */
  async register(createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    // Check if email already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { ownerEmail: createTenantDto.ownerEmail },
    });

    if (existingTenant) {
      throw new ConflictException("Email sudah terdaftar. Gunakan email lain.");
    }

    // Generate slug from agency name
    const slug = Tenant.generateSlug(createTenantDto.name);

    // Check if slug already exists
    const existingSlug = await this.tenantRepository.findOne({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        "Nama agency sudah digunakan. Gunakan nama lain.",
      );
    }

    // Get default resource limits based on tier
    const tier = createTenantDto.tier || TenantTier.STARTER;
    const resourceLimits = Tenant.getDefaultResourceLimits(tier);

    // Create tenant record with PENDING status
    const tenant = this.tenantRepository.create({
      name: createTenantDto.name,
      slug,
      status: TenantStatus.PENDING,
      tier,
      ownerEmail: createTenantDto.ownerEmail,
      ownerPhone: createTenantDto.ownerPhone,
      address: createTenantDto.address,
      resourceLimits,
    });

    const savedTenant = await this.tenantRepository.save(tenant);

    // Queue provisioning job
    await this.provisioningQueue.add("provision-tenant", {
      tenantId: savedTenant.id,
      ownerFullName: createTenantDto.ownerFullName,
      ownerPassword: createTenantDto.ownerPassword,
      ownerEmail: createTenantDto.ownerEmail,
    });

    return savedTenant;
  }

  /**
   * Provision tenant (called by BullMQ job)
   * Creates default admin user and activates tenant
   */
  async provision(
    tenantId: string,
    ownerFullName: string,
    ownerPassword: string,
    ownerEmail: string,
  ): Promise<void> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant tidak ditemukan");
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);

      // Create default admin user (agency owner)
      const user = this.userRepository.create({
        tenantId: tenant.id,
        email: ownerEmail,
        password: hashedPassword,
        fullName: ownerFullName,
        role: UserRole.AGENCY_OWNER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      });

      await this.userRepository.save(user);

      // Update tenant status to ACTIVE
      tenant.status = TenantStatus.ACTIVE;
      tenant.activatedAt = new Date();
      await this.tenantRepository.save(tenant);

      // TODO: Send confirmation email with credentials
      // EmailService.sendWelcomeEmail(...)
    } catch (error) {
      // If provisioning fails, set status to FAILED
      tenant.status = TenantStatus.FAILED;
      await this.tenantRepository.save(tenant);

      // TODO: Notify support team
      throw error;
    }
  }

  /**
   * Find tenant by ID
   */
  async findById(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant tidak ditemukan");
    }

    return tenant;
  }

  /**
   * Find tenant by slug
   */
  async findBySlug(slug: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findOne({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant tidak ditemukan");
    }

    return tenant;
  }

  /**
   * Find all tenants with filtering and pagination
   */
  async findAll(filters: FilterTenantsDto): Promise<{
    data: TenantEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

    // Filter by status
    if (filters.status) {
      queryBuilder.andWhere("tenant.status = :status", {
        status: filters.status,
      });
    }

    // Search by name or slug
    if (filters.search) {
      queryBuilder.andWhere(
        "(tenant.name ILIKE :search OR tenant.slug ILIKE :search)",
        { search: `%${filters.search}%` },
      );
    }

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Order by created date descending
    queryBuilder.orderBy("tenant.createdAt", "DESC");

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Update tenant
   */
  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantEntity> {
    const tenant = await this.findById(id);

    // Update resource limits if tier changes
    if (updateTenantDto.tier && updateTenantDto.tier !== tenant.tier) {
      tenant.resourceLimits = Tenant.getDefaultResourceLimits(
        updateTenantDto.tier,
      );
    }

    Object.assign(tenant, updateTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  /**
   * Suspend tenant
   */
  async suspend(id: string): Promise<TenantEntity> {
    const tenant = await this.findById(id);
    tenant.status = TenantStatus.SUSPENDED;
    return await this.tenantRepository.save(tenant);
  }

  /**
   * Activate tenant
   */
  async activate(id: string): Promise<TenantEntity> {
    const tenant = await this.findById(id);
    tenant.status = TenantStatus.ACTIVE;
    if (!tenant.activatedAt) {
      tenant.activatedAt = new Date();
    }
    return await this.tenantRepository.save(tenant);
  }

  /**
   * Soft delete tenant
   */
  async delete(id: string): Promise<void> {
    const tenant = await this.findById(id);
    tenant.status = TenantStatus.DELETED;
    tenant.deletedAt = new Date();
    await this.tenantRepository.save(tenant);
  }

  /**
   * Update custom domain
   */
  async updateDomain(id: string, domain: string): Promise<TenantEntity> {
    const tenant = await this.findById(id);

    if (!tenant.tier || tenant.tier !== TenantTier.ENTERPRISE) {
      throw new BadRequestException(
        "Custom domain hanya tersedia untuk tier Enterprise",
      );
    }

    // Generate verification token
    const verificationToken = this.generateVerificationToken();

    tenant.customDomain = domain;
    tenant.domainVerificationToken = verificationToken;
    tenant.domainVerifiedAt = null;

    await this.tenantRepository.save(tenant);

    // TODO: Queue domain verification job
    // await this.domainVerificationQueue.add('verify-domain', { tenantId: id });

    return tenant;
  }

  /**
   * Generate domain verification token
   */
  private generateVerificationToken(): string {
    return `travel-umroh-verify=${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }
}
