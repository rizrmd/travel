/**
 * Epic 5, Story 5.1: Status Transition Service
 * Manages jamaah status transitions and history
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahStatusHistoryEntity } from "../infrastructure/persistence/relational/entities/jamaah-status-history.entity";
import { JamaahStatus } from "../domain/jamaah";

@Injectable()
export class StatusTransitionService {
  constructor(
    @InjectRepository(JamaahStatusHistoryEntity)
    private readonly statusHistoryRepository: Repository<JamaahStatusHistoryEntity>,
  ) {}

  /**
   * Record status transition
   */
  async recordTransition(params: {
    tenantId: string;
    jamaahId: string;
    fromStatus: JamaahStatus;
    toStatus: JamaahStatus;
    changedById: string;
    reason?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const history = this.statusHistoryRepository.create({
      tenant_id: params.tenantId,
      jamaah_id: params.jamaahId,
      from_status: params.fromStatus,
      to_status: params.toStatus,
      changed_by_id: params.changedById,
      reason: params.reason,
      metadata: params.metadata,
    });

    await this.statusHistoryRepository.save(history);
  }

  /**
   * Get status history for jamaah
   */
  async getStatusHistory(
    jamaahId: string,
    tenantId: string,
  ): Promise<JamaahStatusHistoryEntity[]> {
    return this.statusHistoryRepository.find({
      where: {
        tenant_id: tenantId,
        jamaah_id: jamaahId,
      },
      relations: ["changed_by"],
      order: {
        created_at: "DESC",
      },
    });
  }
}
