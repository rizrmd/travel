/**
 * Epic 13, Story 13.6: Training Request Service
 * Handles training escalation and scheduling
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  TrainingRequestEntity,
  TrainingRequestStatus,
} from "../infrastructure/persistence/relational/entities/training-request.entity";
import { CreateTrainingRequestDto } from "../dto/create-training-request.dto";
import { TrainingRequestResponseDto } from "../dto/training-request-response.dto";

@Injectable()
export class TrainingRequestService {
  constructor(
    @InjectRepository(TrainingRequestEntity)
    private requestRepository: Repository<TrainingRequestEntity>,
  ) {}

  /**
   * Create training request
   */
  async createRequest(
    tenantId: string,
    userId: string,
    dto: CreateTrainingRequestDto,
  ): Promise<TrainingRequestResponseDto> {
    const request = this.requestRepository.create({
      tenant_id: tenantId,
      user_id: userId,
      topic: dto.topic,
      message: dto.message || null,
      preferred_date: dto.preferred_date ? new Date(dto.preferred_date) : null,
      preferred_time: dto.preferred_time || null,
      contact_method: dto.contact_method,
      status: TrainingRequestStatus.PENDING,
    });

    const saved = await this.requestRepository.save(request);
    const loaded = await this.findById(saved.id, tenantId);

    return this.toResponseDto(loaded);
  }

  /**
   * Assign trainer to request
   */
  async assignTrainer(
    requestId: string,
    tenantId: string,
    trainerId: string,
  ): Promise<TrainingRequestResponseDto> {
    const request = await this.findById(requestId, tenantId);

    if (request.status !== TrainingRequestStatus.PENDING) {
      throw new BadRequestException(
        "Request harus dalam status pending untuk dapat di-assign",
      );
    }

    request.assigned_to_id = trainerId;
    request.assigned_at = new Date();
    request.status = TrainingRequestStatus.ASSIGNED;

    const saved = await this.requestRepository.save(request);
    const loaded = await this.findById(saved.id, tenantId);

    return this.toResponseDto(loaded);
  }

  /**
   * Schedule training session
   */
  async scheduleSession(
    requestId: string,
    tenantId: string,
    scheduledAt: Date,
    durationMinutes: number = 60,
    meetingUrl?: string,
    meetingLocation?: string,
  ): Promise<TrainingRequestResponseDto> {
    const request = await this.findById(requestId, tenantId);

    if (request.status === TrainingRequestStatus.COMPLETED) {
      throw new BadRequestException(
        "Request sudah selesai, tidak dapat dijadwalkan",
      );
    }

    request.scheduled_at = scheduledAt;
    request.scheduled_duration_minutes = durationMinutes;
    request.meeting_url = meetingUrl || null;
    request.meeting_location = meetingLocation || null;
    request.status = TrainingRequestStatus.SCHEDULED;

    const saved = await this.requestRepository.save(request);
    const loaded = await this.findById(saved.id, tenantId);

    return this.toResponseDto(loaded);
  }

  /**
   * Mark request as completed
   */
  async completeSession(
    requestId: string,
    tenantId: string,
    completionNotes?: string,
    satisfactionRating?: number,
  ): Promise<TrainingRequestResponseDto> {
    const request = await this.findById(requestId, tenantId);

    if (request.status === TrainingRequestStatus.COMPLETED) {
      throw new BadRequestException("Request sudah ditandai sebagai selesai");
    }

    request.completed_at = new Date();
    request.completion_notes = completionNotes || null;
    request.satisfaction_rating = satisfactionRating || null;
    request.status = TrainingRequestStatus.COMPLETED;

    const saved = await this.requestRepository.save(request);
    const loaded = await this.findById(saved.id, tenantId);

    return this.toResponseDto(loaded);
  }

  /**
   * Cancel request
   */
  async cancelRequest(
    requestId: string,
    tenantId: string,
  ): Promise<TrainingRequestResponseDto> {
    const request = await this.findById(requestId, tenantId);

    if (request.status === TrainingRequestStatus.COMPLETED) {
      throw new BadRequestException(
        "Request yang sudah selesai tidak dapat dibatalkan",
      );
    }

    request.status = TrainingRequestStatus.CANCELLED;

    const saved = await this.requestRepository.save(request);
    const loaded = await this.findById(saved.id, tenantId);

    return this.toResponseDto(loaded);
  }

  /**
   * List requests with filters
   */
  async listRequests(
    tenantId: string,
    userId?: string,
    status?: TrainingRequestStatus,
    assignedToId?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ requests: TrainingRequestResponseDto[]; total: number }> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.assigned_to", "assigned_to")
      .where("request.tenant_id = :tenantId", { tenantId });

    if (userId) {
      queryBuilder.andWhere("request.user_id = :userId", { userId });
    }

    if (status) {
      queryBuilder.andWhere("request.status = :status", { status });
    }

    if (assignedToId) {
      queryBuilder.andWhere("request.assigned_to_id = :assignedToId", {
        assignedToId,
      });
    }

    const [requests, total] = await queryBuilder
      .orderBy("request.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const dtos = requests.map((r) => this.toResponseDto(r));

    return { requests: dtos, total };
  }

  /**
   * Find by ID
   */
  async findById(
    requestId: string,
    tenantId: string,
  ): Promise<TrainingRequestEntity> {
    const request = await this.requestRepository.findOne({
      where: { id: requestId, tenant_id: tenantId },
      relations: ["user", "assigned_to"],
    });

    if (!request) {
      throw new NotFoundException("Request training tidak ditemukan");
    }

    return request;
  }

  /**
   * Convert to response DTO
   */
  private toResponseDto(
    request: TrainingRequestEntity,
  ): TrainingRequestResponseDto {
    return new TrainingRequestResponseDto({
      id: request.id,
      tenant_id: request.tenant_id,
      user_id: request.user_id,
      user: request.user
        ? {
            id: request.user.id,
            full_name: request.user.fullName,
            email: request.user.email,
            phone: request.user.phone || null,
          }
        : null,
      topic: request.topic,
      message: request.message,
      preferred_date: request.preferred_date,
      preferred_time: request.preferred_time,
      contact_method: request.contact_method,
      status: request.status,
      status_display: this.getStatusDisplay(request.status),
      assigned_to_id: request.assigned_to_id,
      assigned_to: request.assigned_to
        ? {
            id: request.assigned_to.id,
            full_name: request.assigned_to.fullName,
            email: request.assigned_to.email,
          }
        : null,
      assigned_at: request.assigned_at,
      scheduled_at: request.scheduled_at,
      scheduled_duration_minutes: request.scheduled_duration_minutes,
      meeting_url: request.meeting_url,
      meeting_location: request.meeting_location,
      completed_at: request.completed_at,
      completion_notes: request.completion_notes,
      satisfaction_rating: request.satisfaction_rating,
      metadata: request.metadata,
      created_at: request.created_at,
      updated_at: request.updated_at,
    });
  }

  private getStatusDisplay(status: TrainingRequestStatus): string {
    const displayNames: Record<TrainingRequestStatus, string> = {
      [TrainingRequestStatus.PENDING]: "Menunggu",
      [TrainingRequestStatus.ASSIGNED]: "Ditugaskan",
      [TrainingRequestStatus.SCHEDULED]: "Terjadwal",
      [TrainingRequestStatus.COMPLETED]: "Selesai",
      [TrainingRequestStatus.CANCELLED]: "Dibatalkan",
    };
    return displayNames[status];
  }
}
