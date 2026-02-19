/**
 * Epic 5, Story 5.5: Action Log Service
 * Audit trail management for jamaah actions
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahActionLogEntity } from "../infrastructure/persistence/relational/entities/jamaah-action-log.entity";
import {
  ActionType,
  PerformedByRole,
  JamaahActionLog,
} from "../domain/jamaah-action-log";
import {
  ActionLogResponseDto,
  ActionLogQueryDto,
} from "../dto/action-log-response.dto";

@Injectable()
export class ActionLogService {
  constructor(
    @InjectRepository(JamaahActionLogEntity)
    private readonly actionLogRepository: Repository<JamaahActionLogEntity>,
  ) {}

  /**
   * Log an action
   */
  async log(params: {
    tenantId: string;
    jamaahId: string;
    actionType: ActionType;
    performedById: string;
    performedByRole?: PerformedByRole;
    oldValue?: Record<string, any>;
    newValue?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    agentName?: string;
    jamaahName?: string;
  }): Promise<void> {
    const description = JamaahActionLog.generateDescription(params.actionType, {
      agentName: params.agentName,
      jamaahName: params.jamaahName,
      oldValue: params.oldValue?.status,
      newValue: params.newValue?.status,
      fieldChanged: params.metadata?.fieldChanged,
      documentType: params.metadata?.documentType,
      paymentAmount: params.metadata?.paymentAmount,
      messageType: params.metadata?.messageType,
    });

    const log = this.actionLogRepository.create({
      tenant_id: params.tenantId,
      jamaah_id: params.jamaahId,
      action_type: params.actionType,
      action_description: description,
      performed_by_id: params.performedById,
      performed_by_role: params.performedByRole || PerformedByRole.AGENT,
      old_value: params.oldValue,
      new_value: params.newValue,
      metadata: params.metadata,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
    });

    await this.actionLogRepository.save(log);
  }

  /**
   * Get action logs with filters
   */
  async getActionLogs(
    query: ActionLogQueryDto,
    tenantId: string,
  ): Promise<{ data: ActionLogResponseDto[]; meta: any }> {
    const page = query.page || 1;
    const perPage = query.perPage || 50;
    const skip = (page - 1) * perPage;

    let qb = this.actionLogRepository
      .createQueryBuilder("log")
      .leftJoinAndSelect("log.jamaah", "jamaah")
      .leftJoinAndSelect("log.performed_by", "user")
      .where("log.tenant_id = :tenantId", { tenantId });

    if (query.agentId) {
      qb = qb.andWhere("log.performed_by_id = :agentId", {
        agentId: query.agentId,
      });
    }

    if (query.jamaahId) {
      qb = qb.andWhere("log.jamaah_id = :jamaahId", {
        jamaahId: query.jamaahId,
      });
    }

    if (query.actionType) {
      qb = qb.andWhere("log.action_type = :actionType", {
        actionType: query.actionType,
      });
    }

    if (query.fromDate) {
      qb = qb.andWhere("log.created_at >= :fromDate", {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      qb = qb.andWhere("log.created_at <= :toDate", { toDate: query.toDate });
    }

    const total = await qb.getCount();
    const logs = await qb
      .orderBy("log.created_at", "DESC")
      .skip(skip)
      .take(perPage)
      .getMany();

    const data = logs.map((log) => this.toResponseDto(log));

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  /**
   * Get jamaah audit trail
   */
  async getJamaahAuditTrail(
    jamaahId: string,
    tenantId: string,
  ): Promise<ActionLogResponseDto[]> {
    const logs = await this.actionLogRepository.find({
      where: {
        jamaah_id: jamaahId,
        tenant_id: tenantId,
      },
      relations: ["jamaah", "performed_by"],
      order: {
        created_at: "DESC",
      },
      take: 100, // Last 100 actions
    });

    return logs.map((log) => this.toResponseDto(log));
  }

  /**
   * Convert to response DTO
   */
  private toResponseDto(log: JamaahActionLogEntity): ActionLogResponseDto {
    return {
      id: log.id,
      tenantId: log.tenant_id,
      jamaahId: log.jamaah_id,
      jamaahName: log.jamaah?.full_name,
      actionType: log.action_type,
      actionDescription: log.action_description,
      performedById: log.performed_by_id,
      performedByName: log.performed_by?.fullName,
      performedByRole: log.performed_by_role,
      oldValue: log.old_value || undefined,
      newValue: log.new_value || undefined,
      metadata: log.metadata || undefined,
      ipAddress: log.ip_address || undefined,
      userAgent: log.user_agent || undefined,
      createdAt: log.created_at,
    };
  }
}
