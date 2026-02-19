/**
 * Epic 4, Story 4.2: Itinerary Service
 * Manage day-by-day itinerary items for packages
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ItineraryItemEntity } from "../infrastructure/persistence/relational/entities/itinerary-item.entity";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { CreateItineraryItemDto } from "../dto/create-itinerary-item.dto";
import { UpdateItineraryItemDto } from "../dto/update-itinerary-item.dto";
import { ItineraryItem } from "../domain/itinerary";

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(
    @InjectRepository(ItineraryItemEntity)
    private readonly itineraryRepository: Repository<ItineraryItemEntity>,
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}

  /**
   * Create a new itinerary item for a package
   * Story 4.2: Create itinerary day
   */
  async create(
    tenantId: string,
    packageId: string,
    createItineraryDto: CreateItineraryItemDto,
  ): Promise<ItineraryItemEntity> {
    // Verify package exists
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId },
    });

    if (!packageEntity) {
      throw new NotFoundException(
        `Paket dengan ID ${packageId} tidak ditemukan`,
      );
    }

    // Validate day number
    if (!ItineraryItem.isValidDayNumber(createItineraryDto.day_number)) {
      throw new BadRequestException("Nomor hari harus bilangan bulat positif");
    }

    // Validate day number doesn't exceed package duration
    if (
      !ItineraryItem.isWithinDuration(
        createItineraryDto.day_number,
        packageEntity.duration_days,
      )
    ) {
      throw new BadRequestException(
        `Nomor hari (${createItineraryDto.day_number}) melebihi durasi paket (${packageEntity.duration_days} hari)`,
      );
    }

    // Check for duplicate day_number
    const existingDay = await this.itineraryRepository.findOne({
      where: {
        package_id: packageId,
        day_number: createItineraryDto.day_number,
      },
    });

    if (existingDay) {
      throw new ConflictException(
        `Hari ${createItineraryDto.day_number} sudah ada untuk paket ini`,
      );
    }

    // Validate activities
    if (!ItineraryItem.areValidActivities(createItineraryDto.activities)) {
      throw new BadRequestException("Format aktivitas tidak valid");
    }

    // Set sort_order to day_number if not provided
    const sortOrder =
      createItineraryDto.sort_order || createItineraryDto.day_number;

    // Create itinerary item
    const itineraryItem = this.itineraryRepository.create({
      ...createItineraryDto,
      tenant_id: tenantId,
      package_id: packageId,
      sort_order: sortOrder,
    });

    const savedItem = await this.itineraryRepository.save(itineraryItem);

    this.logger.log(
      `Itinerary item created for package ${packageId}, day ${createItineraryDto.day_number}`,
    );

    return savedItem;
  }

  /**
   * Get all itinerary items for a package
   * Story 4.2: Get package itinerary
   */
  async findAllByPackage(
    tenantId: string,
    packageId: string,
  ): Promise<ItineraryItemEntity[]> {
    // Verify package exists
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId },
    });

    if (!packageEntity) {
      throw new NotFoundException(
        `Paket dengan ID ${packageId} tidak ditemukan`,
      );
    }

    const items = await this.itineraryRepository.find({
      where: { package_id: packageId, tenant_id: tenantId },
      order: { day_number: "ASC" },
    });

    return items;
  }

  /**
   * Get a single itinerary item by ID
   */
  async findOne(
    tenantId: string,
    packageId: string,
    id: string,
  ): Promise<ItineraryItemEntity> {
    const item = await this.itineraryRepository.findOne({
      where: { id, package_id: packageId, tenant_id: tenantId },
    });

    if (!item) {
      throw new NotFoundException(
        `Itinerary item dengan ID ${id} tidak ditemukan`,
      );
    }

    return item;
  }

  /**
   * Update an itinerary item
   * Story 4.2: Update itinerary day
   */
  async update(
    tenantId: string,
    packageId: string,
    id: string,
    updateItineraryDto: UpdateItineraryItemDto,
  ): Promise<ItineraryItemEntity> {
    const item = await this.findOne(tenantId, packageId, id);

    // If day_number is being changed, validate it
    if (updateItineraryDto.day_number) {
      if (!ItineraryItem.isValidDayNumber(updateItineraryDto.day_number)) {
        throw new BadRequestException(
          "Nomor hari harus bilangan bulat positif",
        );
      }

      // Get package to validate duration
      const packageEntity = await this.packageRepository.findOne({
        where: { id: packageId, tenant_id: tenantId },
      });

      if (
        !ItineraryItem.isWithinDuration(
          updateItineraryDto.day_number,
          packageEntity.duration_days,
        )
      ) {
        throw new BadRequestException(
          `Nomor hari (${updateItineraryDto.day_number}) melebihi durasi paket (${packageEntity.duration_days} hari)`,
        );
      }

      // Check for duplicate day_number (excluding current item)
      const existingDay = await this.itineraryRepository.findOne({
        where: {
          package_id: packageId,
          day_number: updateItineraryDto.day_number,
        },
      });

      if (existingDay && existingDay.id !== id) {
        throw new ConflictException(
          `Hari ${updateItineraryDto.day_number} sudah ada untuk paket ini`,
        );
      }
    }

    // Validate activities if provided
    if (updateItineraryDto.activities) {
      if (!ItineraryItem.areValidActivities(updateItineraryDto.activities)) {
        throw new BadRequestException("Format aktivitas tidak valid");
      }
    }

    // Update item
    Object.assign(item, updateItineraryDto);
    const updatedItem = await this.itineraryRepository.save(item);

    this.logger.log(`Itinerary item updated: ${id}`);

    return updatedItem;
  }

  /**
   * Delete an itinerary item
   * Story 4.2: Delete itinerary day
   */
  async remove(tenantId: string, packageId: string, id: string): Promise<void> {
    const item = await this.findOne(tenantId, packageId, id);

    await this.itineraryRepository.remove(item);

    this.logger.log(`Itinerary item deleted: ${id}`);
  }

  /**
   * Get itinerary formatted for display
   */
  async getFormattedItinerary(
    tenantId: string,
    packageId: string,
  ): Promise<{
    package_id: string;
    itinerary: ItineraryItemEntity[];
  }> {
    const items = await this.findAllByPackage(tenantId, packageId);

    return {
      package_id: packageId,
      itinerary: items,
    };
  }
}
