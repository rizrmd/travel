/**
 * Epic 4, Story 4.6: Package Versioning Service
 * Audit trail and version history for packages
 */

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PackageVersionEntity } from "../infrastructure/persistence/relational/entities/package-version.entity";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { PackageVersion } from "../domain/package-version";

@Injectable()
export class PackageVersioningService {
  private readonly logger = new Logger(PackageVersioningService.name);

  constructor(
    @InjectRepository(PackageVersionEntity)
    private readonly versionRepository: Repository<PackageVersionEntity>,
  ) {}

  /**
   * Create initial version when package is created
   * Story 4.6: Version 1 on package creation
   */
  async createInitialVersion(
    packageEntity: PackageEntity,
    userId: string,
  ): Promise<PackageVersionEntity> {
    const snapshot = this.createSnapshot(packageEntity);

    const version = this.versionRepository.create({
      tenant_id: packageEntity.tenant_id,
      package_id: packageEntity.id,
      version_number: 1,
      snapshot,
      changed_fields: [],
      change_summary: "Paket dibuat",
      changed_by_id: userId,
      change_reason: null,
    });

    const savedVersion = await this.versionRepository.save(version);

    this.logger.log(`Initial version created for package ${packageEntity.id}`);

    return savedVersion;
  }

  /**
   * Create new version when package is updated
   * Story 4.6: Auto-version on update
   */
  async createVersion(
    newPackageEntity: PackageEntity,
    oldPackageEntity: Partial<PackageEntity>,
    userId: string,
    changeReason?: string,
  ): Promise<PackageVersionEntity> {
    // Get latest version number
    const latestVersion = await this.versionRepository.findOne({
      where: { package_id: newPackageEntity.id },
      order: { version_number: "DESC" },
    });

    const nextVersionNumber = latestVersion
      ? latestVersion.version_number + 1
      : 1;

    // Create snapshot
    const snapshot = this.createSnapshot(newPackageEntity);

    // Compare old and new to generate change summary
    const oldSnapshot = this.createSnapshot(oldPackageEntity);
    const { fields, summary } = PackageVersion.createChangeSummary(
      oldSnapshot,
      snapshot,
    );

    const version = this.versionRepository.create({
      tenant_id: newPackageEntity.tenant_id,
      package_id: newPackageEntity.id,
      version_number: nextVersionNumber,
      snapshot,
      changed_fields: fields,
      change_summary: summary,
      changed_by_id: userId,
      change_reason: changeReason || null,
    });

    const savedVersion = await this.versionRepository.save(version);

    this.logger.log(
      `Version ${nextVersionNumber} created for package ${newPackageEntity.id}`,
    );

    return savedVersion;
  }

  /**
   * Get all versions for a package
   * Story 4.6: Version history
   */
  async findAllVersions(
    tenantId: string,
    packageId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: PackageVersionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.versionRepository.findAndCount({
      where: { package_id: packageId, tenant_id: tenantId },
      order: { version_number: "DESC" },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  /**
   * Get a specific version
   * Story 4.6: Get version snapshot
   */
  async findVersion(
    tenantId: string,
    packageId: string,
    versionNumber: number,
  ): Promise<PackageVersionEntity> {
    const version = await this.versionRepository.findOne({
      where: {
        package_id: packageId,
        tenant_id: tenantId,
        version_number: versionNumber,
      },
    });

    if (!version) {
      throw new Error(
        `Version ${versionNumber} not found for package ${packageId}`,
      );
    }

    return version;
  }

  /**
   * Get recent versions (for package detail page)
   */
  async findRecentVersions(
    tenantId: string,
    packageId: string,
    count: number = 5,
  ): Promise<PackageVersionEntity[]> {
    const versions = await this.versionRepository.find({
      where: { package_id: packageId, tenant_id: tenantId },
      order: { version_number: "DESC" },
      take: count,
    });

    return versions;
  }

  /**
   * Create snapshot from package entity
   * Private helper method
   */
  private createSnapshot(
    packageEntity: Partial<PackageEntity>,
  ): Record<string, any> {
    return {
      id: packageEntity.id,
      name: packageEntity.name,
      description: packageEntity.description,
      duration_days: packageEntity.duration_days,
      retail_price: packageEntity.retail_price,
      wholesale_price: packageEntity.wholesale_price,
      cost_price: packageEntity.cost_price,
      capacity: packageEntity.capacity,
      available_slots: packageEntity.available_slots,
      departure_date: packageEntity.departure_date?.toISOString(),
      return_date: packageEntity.return_date?.toISOString(),
      status: packageEntity.status,
      created_by_id: packageEntity.created_by_id,
      created_at: packageEntity.created_at?.toISOString(),
      updated_at: packageEntity.updated_at?.toISOString(),
    };
  }
}
