/**
 * Epic 5, Story 5.1: Jamaah Service
 * Main CRUD operations for jamaah management
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahEntity } from "../infrastructure/persistence/relational/entities/jamaah.entity";
import { CreateJamaahDto, UpdateJamaahDto, JamaahResponseDto } from "../dto";
import { Jamaah, JamaahStatus } from "../domain/jamaah";
import { ActionLogService } from "./action-log.service";
import { StatusTransitionService } from "./status-transition.service";
import { ActionType } from "../domain/jamaah-action-log";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class JamaahService {
  constructor(
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    private readonly actionLogService: ActionLogService,
    private readonly statusTransitionService: StatusTransitionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Create a new jamaah
   */
  async create(
    createDto: CreateJamaahDto,
    tenantId: string,
    agentId: string,
    userId: string,
  ): Promise<JamaahResponseDto> {
    const jamaah = this.jamaahRepository.create({
      tenant_id: tenantId,
      agent_id: agentId,
      package_id: createDto.packageId,
      full_name: createDto.fullName,
      email: createDto.email,
      phone: createDto.phone,
      date_of_birth: createDto.dateOfBirth
        ? new Date(createDto.dateOfBirth)
        : null,
      gender: createDto.gender,
      service_mode: createDto.serviceMode,
      metadata: createDto.metadata,
      assigned_at: new Date(),
    });

    const saved = await this.jamaahRepository.save(jamaah);

    // Log action
    await this.actionLogService.log({
      tenantId,
      jamaahId: saved.id,
      actionType: ActionType.JAMAAH_CREATE,
      performedById: userId,
      agentName: "Agent",
      jamaahName: saved.full_name,
    });

    // Invalidate cache
    await this.invalidateAgentCache(tenantId, agentId);

    return this.toResponseDto(saved);
  }

  /**
   * Find jamaah by ID
   */
  async findById(id: string, tenantId: string): Promise<JamaahResponseDto> {
    const jamaah = await this.jamaahRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ["agent", "package"],
    });

    if (!jamaah) {
      throw new NotFoundException(`Jamaah with ID ${id} not found`);
    }

    return this.toResponseDto(jamaah);
  }

  /**
   * Update jamaah
   */
  async update(
    id: string,
    updateDto: UpdateJamaahDto,
    tenantId: string,
    userId: string,
  ): Promise<JamaahResponseDto> {
    const jamaah = await this.jamaahRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!jamaah) {
      throw new NotFoundException(`Jamaah with ID ${id} not found`);
    }

    const oldValue: any = {};
    const newValue: any = {};

    // Track status change
    if (updateDto.status && updateDto.status !== jamaah.status) {
      // Validate transition
      if (!Jamaah.canTransitionTo(jamaah.status, updateDto.status)) {
        throw new BadRequestException(
          `Cannot transition from ${jamaah.status} to ${updateDto.status}`,
        );
      }

      oldValue.status = jamaah.status;
      newValue.status = updateDto.status;

      // Record status history
      await this.statusTransitionService.recordTransition({
        tenantId,
        jamaahId: id,
        fromStatus: jamaah.status,
        toStatus: updateDto.status,
        changedById: userId,
      });
    }

    // Update fields
    if (updateDto.fullName) jamaah.full_name = updateDto.fullName;
    if (updateDto.email) jamaah.email = updateDto.email;
    if (updateDto.phone) jamaah.phone = updateDto.phone;
    if (updateDto.dateOfBirth)
      jamaah.date_of_birth = new Date(updateDto.dateOfBirth);
    if (updateDto.gender) jamaah.gender = updateDto.gender;
    if (updateDto.address) jamaah.address = updateDto.address;
    if (updateDto.status) jamaah.status = updateDto.status;
    if (updateDto.serviceMode) jamaah.service_mode = updateDto.serviceMode;
    if (updateDto.metadata)
      jamaah.metadata = { ...jamaah.metadata, ...updateDto.metadata };

    const saved = await this.jamaahRepository.save(jamaah);

    // Log action
    await this.actionLogService.log({
      tenantId,
      jamaahId: id,
      actionType: ActionType.JAMAAH_UPDATE,
      performedById: userId,
      oldValue,
      newValue,
      agentName: "Agent",
      jamaahName: saved.full_name,
    });

    // Invalidate cache
    await this.invalidateAgentCache(tenantId, jamaah.agent_id);

    return this.toResponseDto(saved);
  }

  /**
   * Soft delete jamaah
   */
  async remove(id: string, tenantId: string): Promise<void> {
    const result = await this.jamaahRepository.softDelete({
      id,
      tenant_id: tenantId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Jamaah with ID ${id} not found`);
    }

    const jamaah = await this.jamaahRepository.findOne({
      where: { id, tenant_id: tenantId },
      withDeleted: true,
    });

    if (jamaah) {
      await this.invalidateAgentCache(tenantId, jamaah.agent_id);
    }
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(entity: JamaahEntity): JamaahResponseDto {
    const daysUntilDeparture = entity.package?.departure_date
      ? Math.ceil(
          (new Date(entity.package.departure_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : 999;

    const overallStatus = Jamaah.computeOverallStatus(
      entity.document_status,
      entity.payment_status,
      entity.approval_status,
      daysUntilDeparture,
    );

    const statusIndicators = {
      documents: Jamaah.getDocumentIndicatorColor(entity.document_status),
      payments: Jamaah.getPaymentIndicatorColor(entity.payment_status),
      approval: Jamaah.getApprovalIndicatorColor(entity.approval_status),
    };

    const visualCue = Jamaah.getVisualCue(
      entity.status,
      entity.payment_status,
      entity.document_status,
    );

    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      agentId: entity.agent_id,
      agentName: entity.agent?.fullName,
      packageId: entity.package_id,
      packageName: entity.package?.name,
      departureDate: entity.package?.departure_date?.toISOString(),
      fullName: entity.full_name,
      email: entity.email || undefined,
      phone: entity.phone || undefined,
      dateOfBirth: entity.date_of_birth?.toISOString(),
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      status: entity.status,
      documentStatus: entity.document_status,
      paymentStatus: entity.payment_status,
      approvalStatus: entity.approval_status,
      overallStatus,
      statusIndicators,
      visualCue,
      serviceMode: entity.service_mode,
      userId: entity.user_id || undefined,
      assignedAt: entity.assigned_at,
      metadata: entity.metadata || undefined,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      deletedAt: entity.deleted_at || undefined,
    };
  }

  /**
   * Invalidate agent cache
   */
  private async invalidateAgentCache(
    tenantId: string,
    agentId: string,
  ): Promise<void> {
    const cacheKey = `jamaah:agent:${tenantId}:${agentId}`;
    await this.cacheManager.del(cacheKey);
  }
}
