/**
 * Epic 5, Story 5.6: Delegation Service
 * Manages delegation of permissions to jamaah
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahDelegationEntity } from "../infrastructure/persistence/relational/entities/jamaah-delegation.entity";
import {
  CreateDelegationDto,
  DelegationResponseDto,
  UpdateDelegationDto,
} from "../dto/delegation-token.dto";
import { JamaahDelegation, PermissionType } from "../domain/jamaah-delegation";
import { ActionLogService } from "./action-log.service";
import { ActionType } from "../domain/jamaah-action-log";

@Injectable()
export class DelegationService {
  constructor(
    @InjectRepository(JamaahDelegationEntity)
    private readonly delegationRepository: Repository<JamaahDelegationEntity>,
    private readonly actionLogService: ActionLogService,
  ) {}

  /**
   * Create delegation
   */
  async createDelegation(
    jamaahId: string,
    userId: string, // jamaah user ID
    dto: CreateDelegationDto,
    tenantId: string,
    agentId: string,
  ): Promise<DelegationResponseDto> {
    // Check if active delegation already exists
    const existing = await this.delegationRepository.findOne({
      where: {
        tenant_id: tenantId,
        jamaah_id: jamaahId,
        permission_type: dto.permissionType,
        is_active: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Active delegation already exists for this permission",
      );
    }

    const delegation = this.delegationRepository.create({
      tenant_id: tenantId,
      jamaah_id: jamaahId,
      delegated_to_user_id: userId,
      delegated_by_agent_id: agentId,
      permission_type: dto.permissionType,
      is_active: true,
      expires_at: dto.expiresAt
        ? new Date(dto.expiresAt)
        : JamaahDelegation.getDefaultExpiration(),
    });

    const saved = await this.delegationRepository.save(delegation);

    // Log action
    await this.actionLogService.log({
      tenantId,
      jamaahId,
      actionType: ActionType.DELEGATION_GRANT,
      performedById: agentId,
      metadata: { permissionType: dto.permissionType },
    });

    return this.toResponseDto(saved);
  }

  /**
   * Revoke delegation
   */
  async revokeDelegation(
    delegationId: string,
    tenantId: string,
    agentId: string,
  ): Promise<void> {
    const delegation = await this.delegationRepository.findOne({
      where: { id: delegationId, tenant_id: tenantId },
    });

    if (!delegation) {
      throw new NotFoundException("Delegation not found");
    }

    delegation.is_active = false;
    delegation.revoked_at = new Date();

    await this.delegationRepository.save(delegation);

    // Log action
    await this.actionLogService.log({
      tenantId,
      jamaahId: delegation.jamaah_id,
      actionType: ActionType.DELEGATION_REVOKE,
      performedById: agentId,
      metadata: { delegationId },
    });
  }

  /**
   * Get active delegations for jamaah
   */
  async getJamaahDelegations(
    jamaahId: string,
    tenantId: string,
  ): Promise<DelegationResponseDto[]> {
    const delegations = await this.delegationRepository.find({
      where: {
        tenant_id: tenantId,
        jamaah_id: jamaahId,
        is_active: true,
      },
      relations: ["delegated_by_agent"],
      order: { created_at: "DESC" },
    });

    return delegations.map((d) => this.toResponseDto(d));
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    jamaahId: string,
    userId: string,
    permissionType: PermissionType,
    tenantId: string,
  ): Promise<boolean> {
    const delegation = await this.delegationRepository.findOne({
      where: {
        tenant_id: tenantId,
        jamaah_id: jamaahId,
        delegated_to_user_id: userId,
        permission_type: permissionType,
        is_active: true,
      },
    });

    if (!delegation) {
      return false;
    }

    return JamaahDelegation.isValid({
      isActive: delegation.is_active,
      expiresAt: delegation.expires_at,
      revokedAt: delegation.revoked_at,
    });
  }

  /**
   * Convert to response DTO
   */
  private toResponseDto(entity: JamaahDelegationEntity): DelegationResponseDto {
    const isExpiringSoon = JamaahDelegation.isExpiringSoon(entity.expires_at);
    const allowedActions = JamaahDelegation.getAllowedActions(
      entity.permission_type,
    );
    const permissionDescription = JamaahDelegation.getPermissionDescription(
      entity.permission_type,
    );

    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      delegatedToUserId: entity.delegated_to_user_id,
      delegatedByAgentId: entity.delegated_by_agent_id,
      agentName: entity.delegated_by_agent?.fullName,
      permissionType: entity.permission_type,
      permissionDescription,
      isActive: entity.is_active,
      expiresAt: entity.expires_at,
      isExpiringSoon,
      allowedActions,
      createdAt: entity.created_at,
      revokedAt: entity.revoked_at || undefined,
    };
  }
}
