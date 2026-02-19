/**
 * Epic 4, Story 4.4: Inclusions Service
 * Manage package inclusions and exclusions
 */

import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  PackageInclusionEntity,
  InclusionCategory,
} from "../infrastructure/persistence/relational/entities/package-inclusion.entity";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { CreateInclusionDto } from "../dto/create-inclusion.dto";

@Injectable()
export class InclusionsService {
  private readonly logger = new Logger(InclusionsService.name);

  constructor(
    @InjectRepository(PackageInclusionEntity)
    private readonly inclusionRepository: Repository<PackageInclusionEntity>,
    @InjectRepository(PackageEntity)
    private readonly packageRepository: Repository<PackageEntity>,
  ) {}

  /**
   * Create a new inclusion/exclusion
   * Story 4.4: Add inclusion or exclusion
   */
  async create(
    tenantId: string,
    packageId: string,
    createInclusionDto: CreateInclusionDto,
  ): Promise<PackageInclusionEntity> {
    // Verify package exists
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId },
    });

    if (!packageEntity) {
      throw new NotFoundException(
        `Paket dengan ID ${packageId} tidak ditemukan`,
      );
    }

    // Get next sort order if not provided
    let sortOrder = createInclusionDto.sort_order;
    if (sortOrder === undefined) {
      const lastInclusion = await this.inclusionRepository.findOne({
        where: { package_id: packageId, category: createInclusionDto.category },
        order: { sort_order: "DESC" },
      });
      sortOrder = lastInclusion ? lastInclusion.sort_order + 1 : 1;
    }

    // Create inclusion
    const inclusion = this.inclusionRepository.create({
      ...createInclusionDto,
      tenant_id: tenantId,
      package_id: packageId,
      sort_order: sortOrder,
    });

    const savedInclusion = await this.inclusionRepository.save(inclusion);

    this.logger.log(
      `Inclusion created for package ${packageId}: ${createInclusionDto.category}`,
    );

    return savedInclusion;
  }

  /**
   * Get all inclusions/exclusions for a package
   * Story 4.4: Get package inclusions
   */
  async findAllByPackage(
    tenantId: string,
    packageId: string,
  ): Promise<PackageInclusionEntity[]> {
    // Verify package exists
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId },
    });

    if (!packageEntity) {
      throw new NotFoundException(
        `Paket dengan ID ${packageId} tidak ditemukan`,
      );
    }

    const inclusions = await this.inclusionRepository.find({
      where: { package_id: packageId, tenant_id: tenantId },
      order: { is_included: "DESC", category: "ASC", sort_order: "ASC" },
    });

    return inclusions;
  }

  /**
   * Get inclusions grouped by category
   * Story 4.4: Grouped inclusions and exclusions
   */
  async findGroupedByPackage(
    tenantId: string,
    packageId: string,
  ): Promise<{
    inclusions: Record<string, string[]>;
    exclusions: Record<string, string[]>;
  }> {
    const allInclusions = await this.findAllByPackage(tenantId, packageId);

    const inclusions: Record<string, string[]> = {};
    const exclusions: Record<string, string[]> = {};

    for (const item of allInclusions) {
      const category = item.category;
      const description = item.description;

      if (item.is_included) {
        if (!inclusions[category]) {
          inclusions[category] = [];
        }
        inclusions[category].push(description);
      } else {
        if (!exclusions[category]) {
          exclusions[category] = [];
        }
        exclusions[category].push(description);
      }
    }

    return { inclusions, exclusions };
  }

  /**
   * Update an inclusion/exclusion
   */
  async update(
    tenantId: string,
    packageId: string,
    id: string,
    updateInclusionDto: Partial<CreateInclusionDto>,
  ): Promise<PackageInclusionEntity> {
    const inclusion = await this.inclusionRepository.findOne({
      where: { id, package_id: packageId, tenant_id: tenantId },
    });

    if (!inclusion) {
      throw new NotFoundException(`Inclusion dengan ID ${id} tidak ditemukan`);
    }

    Object.assign(inclusion, updateInclusionDto);
    const updatedInclusion = await this.inclusionRepository.save(inclusion);

    this.logger.log(`Inclusion updated: ${id}`);

    return updatedInclusion;
  }

  /**
   * Delete an inclusion/exclusion
   */
  async remove(tenantId: string, packageId: string, id: string): Promise<void> {
    const inclusion = await this.inclusionRepository.findOne({
      where: { id, package_id: packageId, tenant_id: tenantId },
    });

    if (!inclusion) {
      throw new NotFoundException(`Inclusion dengan ID ${id} tidak ditemukan`);
    }

    await this.inclusionRepository.remove(inclusion);

    this.logger.log(`Inclusion deleted: ${id}`);
  }

  /**
   * Bulk create inclusions from template
   * Story 4.4: Add from template
   */
  async createFromTemplate(
    tenantId: string,
    packageId: string,
    templateType: "economy" | "standard" | "premium",
  ): Promise<PackageInclusionEntity[]> {
    // Verify package exists
    const packageEntity = await this.packageRepository.findOne({
      where: { id: packageId, tenant_id: tenantId },
    });

    if (!packageEntity) {
      throw new NotFoundException(
        `Paket dengan ID ${packageId} tidak ditemukan`,
      );
    }

    const templates = this.getTemplate(templateType);
    const createdInclusions: PackageInclusionEntity[] = [];

    for (const template of templates) {
      const inclusion = await this.create(tenantId, packageId, template);
      createdInclusions.push(inclusion);
    }

    this.logger.log(
      `Created ${createdInclusions.length} inclusions from ${templateType} template for package ${packageId}`,
    );

    return createdInclusions;
  }

  /**
   * Get template data
   * Private helper method
   */
  private getTemplate(
    templateType: "economy" | "standard" | "premium",
  ): CreateInclusionDto[] {
    const baseInclusions: CreateInclusionDto[] = [
      {
        category: InclusionCategory.FLIGHT,
        description: "Tiket pesawat pulang-pergi Jakarta-Jeddah",
        is_included: true,
      },
      {
        category: InclusionCategory.ACCOMMODATION,
        description: `Hotel bintang ${templateType === "economy" ? "3" : templateType === "standard" ? "4" : "5"} di Makkah`,
        is_included: true,
      },
      {
        category: InclusionCategory.ACCOMMODATION,
        description: `Hotel bintang ${templateType === "economy" ? "3" : templateType === "standard" ? "4" : "5"} di Madinah`,
        is_included: true,
      },
      {
        category: InclusionCategory.TRANSPORTATION,
        description: "Bus AC selama di Arab Saudi",
        is_included: true,
      },
      {
        category: InclusionCategory.MEALS,
        description: "Makan 3x sehari (halal)",
        is_included: true,
      },
      {
        category: InclusionCategory.VISA,
        description: "Pengurusan visa umroh",
        is_included: true,
      },
      {
        category: InclusionCategory.INSURANCE,
        description: `Asuransi perjalanan ${templateType === "premium" ? "hingga $100,000" : "hingga $50,000"}`,
        is_included: true,
      },
      {
        category: InclusionCategory.GUIDE,
        description: "Pembimbing umroh berbahasa Indonesia",
        is_included: true,
      },
      {
        category: InclusionCategory.OTHER,
        description: "Ziarah ke tempat-tempat bersejarah",
        is_included: true,
      },
      {
        category: InclusionCategory.OTHER,
        description: "Pengeluaran pribadi",
        is_included: false,
      },
      {
        category: InclusionCategory.OTHER,
        description: "Tips untuk driver dan guide",
        is_included: false,
      },
      {
        category: InclusionCategory.OTHER,
        description: "Biaya bagasi tambahan",
        is_included: false,
      },
    ];

    return baseInclusions;
  }
}
