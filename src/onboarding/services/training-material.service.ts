/**
 * Epic 13, Story 13.4: Training Material Service
 * Manages training content CRUD operations
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";
import { TrainingMaterialEntity } from "../infrastructure/persistence/relational/entities/training-material.entity";
import {
  TrainingMaterialDomain,
  TrainingCategory,
} from "../domain/training-material";
import { CreateTrainingMaterialDto } from "../dto/create-training-material.dto";
import { UpdateTrainingMaterialDto } from "../dto/update-training-material.dto";
import { TrainingMaterialResponseDto } from "../dto/training-material-response.dto";

@Injectable()
export class TrainingMaterialService {
  constructor(
    @InjectRepository(TrainingMaterialEntity)
    private materialRepository: Repository<TrainingMaterialEntity>,
  ) {}

  /**
   * Create training material
   */
  async create(
    tenantId: string,
    dto: CreateTrainingMaterialDto,
  ): Promise<TrainingMaterialResponseDto> {
    // Validate content URL
    if (
      !TrainingMaterialDomain.validateContentUrl(
        dto.content_type,
        dto.content_url,
      )
    ) {
      throw new BadRequestException(
        "URL konten tidak valid untuk tipe yang dipilih",
      );
    }

    // Extract video ID and generate embed URL if applicable
    const videoId = TrainingMaterialDomain.extractVideoId(
      dto.content_type,
      dto.content_url,
    );
    const embedUrl = TrainingMaterialDomain.getEmbedUrl(
      dto.content_type,
      dto.content_url,
    );

    const material = this.materialRepository.create({
      tenant_id: tenantId,
      ...dto,
      metadata: {
        ...dto.metadata,
        videoId,
        embedUrl,
      },
    });

    const saved = await this.materialRepository.save(material);
    return this.toResponseDto(saved);
  }

  /**
   * Update training material
   */
  async update(
    id: string,
    tenantId: string,
    dto: UpdateTrainingMaterialDto,
  ): Promise<TrainingMaterialResponseDto> {
    const material = await this.findById(id, tenantId);

    // If content URL or type changed, revalidate
    if (dto.content_url || dto.content_type) {
      const contentType = dto.content_type || material.content_type;
      const contentUrl = dto.content_url || material.content_url;

      if (!TrainingMaterialDomain.validateContentUrl(contentType, contentUrl)) {
        throw new BadRequestException("URL konten tidak valid");
      }

      const videoId = TrainingMaterialDomain.extractVideoId(
        contentType,
        contentUrl,
      );
      const embedUrl = TrainingMaterialDomain.getEmbedUrl(
        contentType,
        contentUrl,
      );

      material.metadata = {
        ...material.metadata,
        ...dto.metadata,
        videoId,
        embedUrl,
      };
    }

    Object.assign(material, dto);
    const saved = await this.materialRepository.save(material);

    return this.toResponseDto(saved);
  }

  /**
   * Find by ID
   */
  async findById(
    id: string,
    tenantId: string,
  ): Promise<TrainingMaterialEntity> {
    const material = await this.materialRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!material) {
      throw new NotFoundException("Materi training tidak ditemukan");
    }

    return material;
  }

  /**
   * List materials with filters
   */
  async list(
    tenantId: string,
    filters: {
      category?: TrainingCategory;
      is_mandatory?: boolean;
      is_published?: boolean;
      page?: number;
      limit?: number;
    },
  ): Promise<{ materials: TrainingMaterialResponseDto[]; total: number }> {
    const {
      category,
      is_mandatory,
      is_published = true,
      page = 1,
      limit = 50,
    } = filters;

    const queryBuilder = this.materialRepository
      .createQueryBuilder("material")
      .where("material.tenant_id = :tenantId", { tenantId });

    if (category) {
      queryBuilder.andWhere("material.category = :category", { category });
    }

    if (is_mandatory !== undefined) {
      queryBuilder.andWhere("material.is_mandatory = :is_mandatory", {
        is_mandatory,
      });
    }

    if (is_published !== undefined) {
      queryBuilder.andWhere("material.is_published = :is_published", {
        is_published,
      });
    }

    const [materials, total] = await queryBuilder
      .orderBy("material.sort_order", "ASC")
      .addOrderBy("material.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const dtos = materials.map((m) => this.toResponseDto(m));

    return { materials: dtos, total };
  }

  /**
   * Search materials
   */
  async search(
    tenantId: string,
    query: string,
    category?: TrainingCategory,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ materials: TrainingMaterialResponseDto[]; total: number }> {
    const queryBuilder = this.materialRepository
      .createQueryBuilder("material")
      .where("material.tenant_id = :tenantId", { tenantId })
      .andWhere("material.is_published = :is_published", { is_published: true })
      .andWhere(
        "(material.title ILIKE :query OR material.description ILIKE :query)",
        { query: `%${query}%` },
      );

    if (category) {
      queryBuilder.andWhere("material.category = :category", { category });
    }

    const [materials, total] = await queryBuilder
      .orderBy("material.sort_order", "ASC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const dtos = materials.map((m) => this.toResponseDto(m));

    return { materials: dtos, total };
  }

  /**
   * Get categories with counts
   */
  async getCategories(tenantId: string): Promise<any[]> {
    const materials = await this.materialRepository.find({
      where: { tenant_id: tenantId, is_published: true },
    });

    const categoriesMap = new Map();

    for (const category of Object.values(TrainingCategory)) {
      const categoryMaterials = materials.filter(
        (m) => m.category === category,
      );

      categoriesMap.set(category, {
        category,
        display_name: TrainingMaterialDomain.getCategoryDisplayName(category),
        material_count: categoryMaterials.length,
        total_duration_minutes:
          TrainingMaterialDomain.calculateTotalDuration(categoryMaterials),
        mandatory_count: categoryMaterials.filter((m) => m.is_mandatory).length,
      });
    }

    return Array.from(categoriesMap.values());
  }

  /**
   * Delete material
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const material = await this.findById(id, tenantId);
    await this.materialRepository.remove(material);
  }

  /**
   * Convert to response DTO
   */
  private toResponseDto(
    material: TrainingMaterialEntity,
  ): TrainingMaterialResponseDto {
    return new TrainingMaterialResponseDto({
      id: material.id,
      tenant_id: material.tenant_id,
      category: material.category,
      category_display: TrainingMaterialDomain.getCategoryDisplayName(
        material.category,
      ),
      title: material.title,
      description: material.description,
      content_type: material.content_type,
      content_url: material.content_url,
      embed_url: material.metadata?.embedUrl || null,
      duration_minutes: material.duration_minutes,
      sort_order: material.sort_order,
      is_mandatory: material.is_mandatory,
      is_published: material.is_published,
      metadata: material.metadata,
      created_at: material.created_at,
      updated_at: material.updated_at,
    });
  }
}
