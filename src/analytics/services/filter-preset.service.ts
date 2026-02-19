/**
 * Epic 11, Story 11.7: Filter Preset Service
 * Manage saved filter presets
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Or } from "typeorm";
import { FilterPresetEntity } from "../infrastructure/persistence/relational/entities/filter-preset.entity";
import {
  CreateFilterPresetDto,
  UpdateFilterPresetDto,
  FilterPresetResponseDto,
} from "../dto/filter-preset.dto";

@Injectable()
export class FilterPresetService {
  constructor(
    @InjectRepository(FilterPresetEntity)
    private filterPresetRepository: Repository<FilterPresetEntity>,
  ) {}

  /**
   * Create filter preset
   */
  async createPreset(
    tenantId: string,
    userId: string,
    dto: CreateFilterPresetDto,
  ): Promise<FilterPresetResponseDto> {
    // If setting as default, unset other defaults
    if (dto.isDefault) {
      await this.filterPresetRepository.update(
        { tenant_id: tenantId, user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    const preset = this.filterPresetRepository.create({
      tenant_id: tenantId,
      user_id: userId,
      name: dto.name,
      description: dto.description || null,
      filters: dto.filters,
      is_public: dto.isPublic || false,
      is_default: dto.isDefault || false,
    });

    const saved = await this.filterPresetRepository.save(preset);

    return this.mapToResponse(saved);
  }

  /**
   * Get preset by ID
   */
  async getPreset(
    tenantId: string,
    userId: string,
    presetId: string,
  ): Promise<FilterPresetResponseDto> {
    const preset = await this.filterPresetRepository.findOne({
      where: [
        { id: presetId, tenant_id: tenantId, user_id: userId },
        { id: presetId, tenant_id: tenantId, is_public: true },
      ],
    });

    if (!preset) {
      throw new NotFoundException(
        `Filter preset dengan ID ${presetId} tidak ditemukan`,
      );
    }

    // Increment usage count
    await this.filterPresetRepository.increment(
      { id: presetId },
      "usage_count",
      1,
    );

    return this.mapToResponse(preset);
  }

  /**
   * List user's presets
   */
  async listPresets(
    tenantId: string,
    userId: string,
  ): Promise<FilterPresetResponseDto[]> {
    const presets = await this.filterPresetRepository.find({
      where: [
        { tenant_id: tenantId, user_id: userId },
        { tenant_id: tenantId, is_public: true },
      ],
      order: { is_default: "DESC", usage_count: "DESC", created_at: "DESC" },
    });

    return presets.map((p) => this.mapToResponse(p));
  }

  /**
   * Update preset
   */
  async updatePreset(
    tenantId: string,
    userId: string,
    presetId: string,
    dto: UpdateFilterPresetDto,
  ): Promise<FilterPresetResponseDto> {
    const preset = await this.filterPresetRepository.findOne({
      where: { id: presetId, tenant_id: tenantId, user_id: userId },
    });

    if (!preset) {
      throw new NotFoundException(
        `Filter preset dengan ID ${presetId} tidak ditemukan`,
      );
    }

    // If setting as default, unset other defaults
    if (dto.isDefault === true) {
      await this.filterPresetRepository.update(
        { tenant_id: tenantId, user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    // Update fields
    if (dto.name !== undefined) preset.name = dto.name;
    if (dto.description !== undefined) preset.description = dto.description;
    if (dto.filters !== undefined) preset.filters = dto.filters;
    if (dto.isPublic !== undefined) preset.is_public = dto.isPublic;
    if (dto.isDefault !== undefined) preset.is_default = dto.isDefault;

    const updated = await this.filterPresetRepository.save(preset);

    return this.mapToResponse(updated);
  }

  /**
   * Delete preset
   */
  async deletePreset(
    tenantId: string,
    userId: string,
    presetId: string,
  ): Promise<void> {
    const preset = await this.filterPresetRepository.findOne({
      where: { id: presetId, tenant_id: tenantId, user_id: userId },
    });

    if (!preset) {
      throw new NotFoundException(
        `Filter preset dengan ID ${presetId} tidak ditemukan`,
      );
    }

    await this.filterPresetRepository.remove(preset);
  }

  /**
   * Get default preset
   */
  async getDefaultPreset(
    tenantId: string,
    userId: string,
  ): Promise<FilterPresetResponseDto | null> {
    const preset = await this.filterPresetRepository.findOne({
      where: { tenant_id: tenantId, user_id: userId, is_default: true },
    });

    return preset ? this.mapToResponse(preset) : null;
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(entity: FilterPresetEntity): FilterPresetResponseDto {
    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      userId: entity.user_id,
      name: entity.name,
      description: entity.description,
      filters: entity.filters,
      isPublic: entity.is_public,
      isDefault: entity.is_default,
      usageCount: entity.usage_count,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    };
  }
}
