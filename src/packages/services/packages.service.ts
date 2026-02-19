/**
 * Epic 4, Story 4.1: Packages Service
 * CRUD operations for packages with business logic
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { CreatePackageDto } from "../dto/create-package.dto";
import { UpdatePackageDto } from "../dto/update-package.dto";
import { PackagesListQueryDto } from "../dto/packages-list-query.dto";
import { Package, PackageStatus } from "../domain/package";
import { PackageVersioningService } from "./package-versioning.service";
import { PackageBroadcastService } from "./package-broadcast.service";

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
    private readonly versioningService: PackageVersioningService,
    private readonly broadcastService: PackageBroadcastService,
  ) {}

  /**
   * Create a new package
   * Story 4.1: Package creation with validation
   */
  async create(
    tenantId: string,
    userId: string,
    createPackageDto: CreatePackageDto,
  ): Promise<PackageEntity> {
    // Validate pricing hierarchy
    const { retail_price, wholesale_price, cost_price } = createPackageDto;

    if (!Package.isValidPricing(retail_price, wholesale_price, cost_price)) {
      throw new UnprocessableEntityException(
        "Harga tidak valid. Retail >= Wholesale >= Cost",
      );
    }

    // Validate departure date
    if (!Package.isValidDepartureDate(createPackageDto.departure_date)) {
      throw new BadRequestException(
        "Tanggal keberangkatan tidak boleh di masa lalu",
      );
    }

    // Validate capacity
    if (!Package.isValidCapacity(createPackageDto.capacity)) {
      throw new BadRequestException("Kapasitas harus lebih dari 0");
    }

    // Calculate return date
    const returnDate = Package.calculateReturnDate(
      createPackageDto.departure_date,
      createPackageDto.duration_days,
    );

    // Create package entity
    const packageEntity = this.packageRepository.create({
      ...createPackageDto,
      tenant_id: tenantId,
      created_by_id: userId,
      return_date: returnDate,
      available_slots: createPackageDto.capacity,
      status: createPackageDto.status || PackageStatus.DRAFT,
    });

    const savedPackage = await this.packageRepository.save(packageEntity);

    // Create initial version (Story 4.6)
    await this.versioningService.createInitialVersion(savedPackage, userId);

    // Broadcast package created event (Story 4.5)
    await this.broadcastService.broadcastPackageCreated(savedPackage);

    this.logger.log(`Package created: ${savedPackage.id} by user ${userId}`);

    return savedPackage;
  }

  /**
   * Find all packages with filtering and pagination
   * Story 4.1: Package listing with filters
   */
  async findAll(
    tenantId: string,
    query: PackagesListQueryDto,
  ): Promise<{
    data: PackageEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, search, sort_by, sort_order, page, limit } = query;

    const queryBuilder = this.packageRepository
      .createQueryBuilder("package")
      .where("package.tenant_id = :tenantId", { tenantId })
      .andWhere("package.deleted_at IS NULL");

    // Filter by status
    if (status) {
      queryBuilder.andWhere("package.status = :status", { status });
    }

    // Search by name
    if (search) {
      queryBuilder.andWhere("package.name ILIKE :search", {
        search: `%${search}%`,
      });
    }

    // Sorting
    const sortField = sort_by || "departure_date";
    const sortDirection = sort_order || "ASC";
    queryBuilder.orderBy(`package.${sortField}`, sortDirection);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Find one package by ID
   * Story 4.1: Get package details
   */
  async findOne(tenantId: string, id: string): Promise<PackageEntity> {
    const packageEntity = await this.packageRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ["itinerary_items", "inclusions"],
    });

    if (!packageEntity) {
      throw new NotFoundException(`Paket dengan ID ${id} tidak ditemukan`);
    }

    return packageEntity;
  }

  /**
   * Update a package
   * Story 4.1: Package update with versioning
   */
  async update(
    tenantId: string,
    id: string,
    userId: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<PackageEntity> {
    const packageEntity = await this.findOne(tenantId, id);

    // Check if package can be updated
    const packageDomain = new Package(packageEntity);
    if (!packageDomain.canUpdate()) {
      throw new BadRequestException(
        `Paket dengan status ${packageEntity.status} tidak dapat diubah`,
      );
    }

    // Validate pricing if changed
    const newRetailPrice =
      updatePackageDto.retail_price || packageEntity.retail_price;
    const newWholesalePrice =
      updatePackageDto.wholesale_price || packageEntity.wholesale_price;
    const newCostPrice =
      updatePackageDto.cost_price !== undefined
        ? updatePackageDto.cost_price
        : packageEntity.cost_price;

    if (
      !Package.isValidPricing(newRetailPrice, newWholesalePrice, newCostPrice)
    ) {
      throw new UnprocessableEntityException(
        "Harga tidak valid. Retail >= Wholesale >= Cost",
      );
    }

    // Validate departure date if changed
    if (updatePackageDto.departure_date) {
      if (!Package.isValidDepartureDate(updatePackageDto.departure_date)) {
        throw new BadRequestException(
          "Tanggal keberangkatan tidak boleh di masa lalu",
        );
      }

      // Recalculate return date
      const durationDays =
        updatePackageDto.duration_days || packageEntity.duration_days;
      updatePackageDto["return_date"] = Package.calculateReturnDate(
        updatePackageDto.departure_date,
        durationDays,
      );
    }

    // Validate capacity changes
    if (updatePackageDto.capacity) {
      if (!Package.isValidCapacity(updatePackageDto.capacity)) {
        throw new BadRequestException("Kapasitas harus lebih dari 0");
      }

      const occupied = packageEntity.capacity - packageEntity.available_slots;
      if (updatePackageDto.capacity < occupied) {
        throw new BadRequestException(
          `Kapasitas tidak dapat dikurangi di bawah jumlah jamaah yang sudah terdaftar (${occupied})`,
        );
      }

      // Adjust available_slots
      const newAvailableSlots = updatePackageDto.capacity - occupied;
      updatePackageDto["available_slots"] = newAvailableSlots;
    }

    // Store old snapshot for versioning
    const oldSnapshot = { ...packageEntity };

    // Update package
    Object.assign(packageEntity, updatePackageDto);
    const updatedPackage = await this.packageRepository.save(packageEntity);

    // Create version (Story 4.6)
    await this.versioningService.createVersion(
      updatedPackage,
      oldSnapshot,
      userId,
      updatePackageDto.change_reason,
    );

    // Broadcast package updated event (Story 4.5)
    await this.broadcastService.broadcastPackageUpdated(
      updatedPackage,
      oldSnapshot,
    );

    this.logger.log(`Package updated: ${id} by user ${userId}`);

    return updatedPackage;
  }

  /**
   * Soft delete a package
   * Story 4.1: Package deletion (soft delete)
   */
  async remove(tenantId: string, id: string, userId: string): Promise<void> {
    const packageEntity = await this.findOne(tenantId, id);

    // Soft delete
    await this.packageRepository.softDelete(id);

    // Broadcast package deleted event (Story 4.5)
    await this.broadcastService.broadcastPackageDeleted(packageEntity);

    this.logger.log(`Package soft-deleted: ${id} by user ${userId}`);
  }

  /**
   * Publish a package (change status from DRAFT to PUBLISHED)
   */
  async publish(
    tenantId: string,
    id: string,
    userId: string,
  ): Promise<PackageEntity> {
    const packageEntity = await this.findOne(tenantId, id);

    const packageDomain = new Package(packageEntity);
    if (!packageDomain.canPublish()) {
      throw new BadRequestException(
        `Paket tidak dapat dipublikasikan. Status: ${packageEntity.status}`,
      );
    }

    packageEntity.status = PackageStatus.PUBLISHED;
    const updatedPackage = await this.packageRepository.save(packageEntity);

    // Create version
    await this.versioningService.createVersion(
      updatedPackage,
      { ...packageEntity, status: PackageStatus.DRAFT },
      userId,
      "Paket dipublikasikan",
    );

    // Broadcast
    await this.broadcastService.broadcastPackageUpdated(updatedPackage, {
      ...packageEntity,
      status: PackageStatus.DRAFT,
    });

    this.logger.log(`Package published: ${id} by user ${userId}`);

    return updatedPackage;
  }

  /**
   * Decrement available slots (when jamaah assigned)
   */
  async decrementSlots(
    tenantId: string,
    id: string,
    count: number = 1,
  ): Promise<PackageEntity> {
    const packageEntity = await this.findOne(tenantId, id);

    const packageDomain = new Package(packageEntity);
    packageDomain.decrementSlots(count);

    packageEntity.available_slots = packageDomain.availableSlots;
    packageEntity.status = packageDomain.status;

    const updatedPackage = await this.packageRepository.save(packageEntity);

    this.logger.log(`Package slots decremented: ${id}, count: ${count}`);

    return updatedPackage;
  }

  /**
   * Increment available slots (when jamaah removed)
   */
  async incrementSlots(
    tenantId: string,
    id: string,
    count: number = 1,
  ): Promise<PackageEntity> {
    const packageEntity = await this.findOne(tenantId, id);

    const packageDomain = new Package(packageEntity);
    packageDomain.incrementSlots(count);

    packageEntity.available_slots = packageDomain.availableSlots;
    packageEntity.status = packageDomain.status;

    const updatedPackage = await this.packageRepository.save(packageEntity);

    this.logger.log(`Package slots incremented: ${id}, count: ${count}`);

    return updatedPackage;
  }
}
