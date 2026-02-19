/**
 * Epic 13, Story 13.4: Training Progress Service
 * Tracks user completion of training materials
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TrainingProgressEntity } from "../infrastructure/persistence/relational/entities/training-progress.entity";
import { TrainingMaterialEntity } from "../infrastructure/persistence/relational/entities/training-material.entity";
import {
  TrainingProgressDomain,
  TrainingProgressStatus,
} from "../domain/training-progress";
import {
  TrainingProgressResponseDto,
  UserTrainingProgressSummaryDto,
} from "../dto/training-progress-response.dto";

@Injectable()
export class TrainingProgressService {
  constructor(
    @InjectRepository(TrainingProgressEntity)
    private progressRepository: Repository<TrainingProgressEntity>,
    @InjectRepository(TrainingMaterialEntity)
    private materialRepository: Repository<TrainingMaterialEntity>,
  ) {}

  /**
   * Mark material as started
   */
  async markAsStarted(
    tenantId: string,
    userId: string,
    materialId: string,
  ): Promise<TrainingProgressResponseDto> {
    // Check if progress already exists
    let progress = await this.progressRepository.findOne({
      where: { tenant_id: tenantId, user_id: userId, material_id: materialId },
      relations: ["material"],
    });

    if (!progress) {
      // Verify material exists
      const material = await this.materialRepository.findOne({
        where: { id: materialId, tenant_id: tenantId },
      });

      if (!material) {
        throw new NotFoundException("Materi training tidak ditemukan");
      }

      progress = this.progressRepository.create({
        tenant_id: tenantId,
        user_id: userId,
        material_id: materialId,
        status: TrainingProgressStatus.IN_PROGRESS,
        progress_percentage: 0,
        started_at: new Date(),
        last_accessed_at: new Date(),
      });
    } else {
      progress.last_accessed_at = new Date();
      if (progress.status === TrainingProgressStatus.NOT_STARTED) {
        progress.status = TrainingProgressStatus.IN_PROGRESS;
        progress.started_at = new Date();
      }
    }

    const saved = await this.progressRepository.save(progress);
    return this.toResponseDto(saved);
  }

  /**
   * Update progress percentage
   */
  async updateProgress(
    tenantId: string,
    userId: string,
    materialId: string,
    progressPercentage: number,
    currentPositionSeconds?: number,
  ): Promise<TrainingProgressResponseDto> {
    const progress = await this.findOrCreate(tenantId, userId, materialId);

    progress.progress_percentage = Math.min(progressPercentage, 100);
    progress.current_position_seconds = currentPositionSeconds || null;
    progress.last_accessed_at = new Date();
    progress.status =
      TrainingProgressDomain.determineStatus(progressPercentage);

    const saved = await this.progressRepository.save(progress);
    return this.toResponseDto(saved);
  }

  /**
   * Mark material as completed
   */
  async markAsCompleted(
    tenantId: string,
    userId: string,
    materialId: string,
    quizScore?: number,
    metadata?: any,
  ): Promise<TrainingProgressResponseDto> {
    const progress = await this.findOrCreate(tenantId, userId, materialId);

    // Validate completion criteria
    if (
      !TrainingProgressDomain.canMarkAsCompleted(
        progress.progress_percentage,
        quizScore,
      )
    ) {
      throw new BadRequestException(
        "Tidak dapat menandai sebagai selesai. Progress belum mencukupi atau skor quiz terlalu rendah",
      );
    }

    progress.status = TrainingProgressStatus.COMPLETED;
    progress.progress_percentage = 100;
    progress.completed_at = new Date();
    progress.last_accessed_at = new Date();

    if (quizScore !== undefined) {
      progress.quiz_score = quizScore;
    }

    if (metadata) {
      progress.metadata = { ...progress.metadata, ...metadata };
    }

    const saved = await this.progressRepository.save(progress);
    return this.toResponseDto(saved);
  }

  /**
   * Get user's training progress summary
   */
  async getUserProgressSummary(
    tenantId: string,
    userId: string,
  ): Promise<UserTrainingProgressSummaryDto> {
    const [allMaterials, progressRecords] = await Promise.all([
      this.materialRepository.find({
        where: { tenant_id: tenantId, is_published: true },
      }),
      this.progressRepository.find({
        where: { tenant_id: tenantId, user_id: userId },
        relations: ["material"],
      }),
    ]);

    const completedMaterials = progressRecords.filter(
      (p) => p.status === TrainingProgressStatus.COMPLETED,
    ).length;

    const inProgressMaterials = progressRecords.filter(
      (p) => p.status === TrainingProgressStatus.IN_PROGRESS,
    ).length;

    const mandatoryMaterials = allMaterials.filter((m) => m.is_mandatory);
    const completedMandatory = progressRecords.filter(
      (p) =>
        p.status === TrainingProgressStatus.COMPLETED &&
        p.material.is_mandatory,
    ).length;

    const totalDuration = allMaterials.reduce(
      (sum, m) => sum + m.duration_minutes,
      0,
    );

    const completedDuration = progressRecords
      .filter((p) => p.status === TrainingProgressStatus.COMPLETED)
      .reduce((sum, p) => sum + (p.material?.duration_minutes || 0), 0);

    const learningStreak =
      TrainingProgressDomain.calculateLearningStreak(progressRecords);

    const completedIds = progressRecords
      .filter((p) => p.status === TrainingProgressStatus.COMPLETED)
      .map((p) => p.material_id);

    const nextMaterial = TrainingProgressDomain.getNextRecommendedMaterial(
      allMaterials as any,
      completedIds,
    );

    return new UserTrainingProgressSummaryDto({
      user_id: userId,
      total_materials: allMaterials.length,
      completed_materials: completedMaterials,
      in_progress_materials: inProgressMaterials,
      not_started_materials:
        allMaterials.length - completedMaterials - inProgressMaterials,
      mandatory_completed: completedMandatory,
      mandatory_total: mandatoryMaterials.length,
      completion_percentage: TrainingProgressDomain.calculateCompletionRate(
        completedMaterials,
        allMaterials.length,
      ),
      total_duration_minutes: totalDuration,
      completed_duration_minutes: completedDuration,
      learning_streak_days: learningStreak,
      next_recommended_material: nextMaterial
        ? {
            id: (nextMaterial as any).id,
            title: (nextMaterial as any).title,
            category: (nextMaterial as any).category,
          }
        : null,
    });
  }

  /**
   * Get user progress for specific material
   */
  async getUserProgress(
    tenantId: string,
    userId: string,
    materialId: string,
  ): Promise<TrainingProgressResponseDto | null> {
    const progress = await this.progressRepository.findOne({
      where: { tenant_id: tenantId, user_id: userId, material_id: materialId },
      relations: ["material"],
    });

    return progress ? this.toResponseDto(progress) : null;
  }

  /**
   * Find or create progress record
   */
  private async findOrCreate(
    tenantId: string,
    userId: string,
    materialId: string,
  ): Promise<TrainingProgressEntity> {
    let progress = await this.progressRepository.findOne({
      where: { tenant_id: tenantId, user_id: userId, material_id: materialId },
      relations: ["material"],
    });

    if (!progress) {
      const material = await this.materialRepository.findOne({
        where: { id: materialId, tenant_id: tenantId },
      });

      if (!material) {
        throw new NotFoundException("Materi training tidak ditemukan");
      }

      progress = this.progressRepository.create({
        tenant_id: tenantId,
        user_id: userId,
        material_id: materialId,
        status: TrainingProgressStatus.NOT_STARTED,
        progress_percentage: 0,
      });
    }

    return progress;
  }

  /**
   * Convert to response DTO
   */
  private toResponseDto(
    progress: TrainingProgressEntity,
  ): TrainingProgressResponseDto {
    return new TrainingProgressResponseDto({
      id: progress.id,
      user_id: progress.user_id,
      material_id: progress.material_id,
      material: progress.material
        ? {
            id: progress.material.id,
            title: progress.material.title,
            category: progress.material.category,
            duration_minutes: progress.material.duration_minutes,
            is_mandatory: progress.material.is_mandatory,
          }
        : null,
      status: progress.status,
      status_display: TrainingProgressDomain.getStatusDisplayName(
        progress.status,
      ),
      progress_percentage: progress.progress_percentage,
      current_position_seconds: progress.current_position_seconds,
      quiz_score: progress.quiz_score,
      attempts_count: progress.attempts_count,
      started_at: progress.started_at,
      completed_at: progress.completed_at,
      last_accessed_at: progress.last_accessed_at,
      metadata: progress.metadata,
      created_at: progress.created_at,
      updated_at: progress.updated_at,
    });
  }
}
