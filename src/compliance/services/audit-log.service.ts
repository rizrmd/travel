/**
 * Epic 12, Story 12.4 & 12.5: Audit Log Service
 * Comprehensive immutable audit trail management
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLogEntity } from "../infrastructure/persistence/relational/entities/audit-log.entity";
import {
  AuditLog,
  AuditAction,
  AuditLogType,
  ActorRole,
  EntityType,
} from "../domain/audit-log";
import { AuditLogQueryDto, PaginatedAuditLogResponseDto } from "../dto";

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  /**
   * Log financial transaction
   */
  async logFinancialTransaction(params: {
    tenantId: string;
    entityId: string;
    action: AuditAction;
    actorId: string | null;
    actorRole: ActorRole;
    actorName: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogEntity> {
    const logEntry = AuditLog.createLogEntry({
      ...params,
    });

    // Sanitize sensitive data
    if (logEntry.beforeState) {
      logEntry.beforeState = AuditLog.sanitizeSensitiveData(
        logEntry.beforeState,
      );
    }
    if (logEntry.afterState) {
      logEntry.afterState = AuditLog.sanitizeSensitiveData(logEntry.afterState);
    }

    const auditLog = this.auditLogRepository.create(logEntry);
    return await this.auditLogRepository.save(auditLog);
  }

  /**
   * Log contract operation
   */
  async logContractOperation(params: {
    tenantId: string;
    contractId: string;
    action: AuditAction;
    actorId: string | null;
    actorRole: ActorRole;
    actorName: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogEntity> {
    return await this.logFinancialTransaction({
      ...params,
      entityId: params.contractId,
    });
  }

  /**
   * Log critical operation
   */
  async logCriticalOperation(params: {
    tenantId: string;
    entityId: string;
    action: AuditAction;
    actorId: string | null;
    actorRole: ActorRole;
    actorName: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogEntity> {
    return await this.logFinancialTransaction(params);
  }

  /**
   * Log data export
   */
  async logDataExport(params: {
    tenantId: string;
    entityId: string;
    actorId: string;
    actorRole: ActorRole;
    actorName: string;
    metadata: {
      exportType: string;
      recordCount: number;
      fileFormat: string;
    };
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLogEntity> {
    return await this.logFinancialTransaction({
      ...params,
      action: AuditAction.DATA_EXPORTED,
    });
  }

  /**
   * Search audit logs with filters
   */
  async searchAuditLogs(
    tenantId: string,
    query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder("audit_log")
      .where("audit_log.tenant_id = :tenantId", { tenantId });

    if (query.logType) {
      queryBuilder.andWhere("audit_log.log_type = :logType", {
        logType: query.logType,
      });
    }

    if (query.entityType) {
      queryBuilder.andWhere("audit_log.entity_type = :entityType", {
        entityType: query.entityType,
      });
    }

    if (query.entityId) {
      queryBuilder.andWhere("audit_log.entity_id = :entityId", {
        entityId: query.entityId,
      });
    }

    if (query.action) {
      queryBuilder.andWhere("audit_log.action = :action", {
        action: query.action,
      });
    }

    if (query.actorId) {
      queryBuilder.andWhere("audit_log.actor_id = :actorId", {
        actorId: query.actorId,
      });
    }

    if (query.startDate) {
      queryBuilder.andWhere("audit_log.created_at >= :startDate", {
        startDate: new Date(query.startDate),
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere("audit_log.created_at <= :endDate", {
        endDate: new Date(query.endDate),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy("audit_log.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data as any,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get audit log by ID
   */
  async getAuditLogById(
    tenantId: string,
    logId: string,
  ): Promise<AuditLogEntity | null> {
    return await this.auditLogRepository.findOne({
      where: { id: logId, tenantId },
    });
  }

  /**
   * Get logs requiring archival (older than 7 years)
   */
  async getLogsForArchival(tenantId: string): Promise<AuditLogEntity[]> {
    const retentionDate = new Date();
    retentionDate.setDate(
      retentionDate.getDate() - AuditLog.RETENTION_PERIOD_DAYS,
    );

    return await this.auditLogRepository
      .createQueryBuilder("audit_log")
      .where("audit_log.tenant_id = :tenantId", { tenantId })
      .andWhere("audit_log.created_at <= :retentionDate", { retentionDate })
      .andWhere("audit_log.archived = :archived", { archived: false })
      .getMany();
  }

  /**
   * Mark logs as archived
   */
  async markAsArchived(logIds: string[], archiveUrl: string): Promise<void> {
    await this.auditLogRepository
      .createQueryBuilder()
      .update()
      .set({ archived: true, archiveUrl })
      .where("id IN (:...logIds)", { logIds })
      .execute();
  }

  /**
   * Get audit metrics
   */
  async getAuditMetrics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalLogs: number;
    criticalOperations: number;
    financialTransactions: number;
    contractOperations: number;
    dataExports: number;
    oldestLog: Date | null;
    newestLog: Date | null;
    retentionCompliance: boolean;
  }> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder("audit_log")
      .where("audit_log.tenant_id = :tenantId", { tenantId });

    if (startDate) {
      queryBuilder.andWhere("audit_log.created_at >= :startDate", {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere("audit_log.created_at <= :endDate", { endDate });
    }

    const [
      totalLogs,
      criticalOps,
      financialTxns,
      contractOps,
      dataExports,
      oldestLog,
    ] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder
        .clone()
        .andWhere("audit_log.log_type = :logType", {
          logType: AuditLogType.CRITICAL_OPERATION,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("audit_log.log_type = :logType", {
          logType: AuditLogType.FINANCIAL_TRANSACTION,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("audit_log.log_type = :logType", {
          logType: AuditLogType.CONTRACT_OPERATION,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("audit_log.log_type = :logType", {
          logType: AuditLogType.DATA_EXPORT,
        })
        .getCount(),
      queryBuilder.clone().orderBy("audit_log.created_at", "ASC").getOne(),
    ]);

    const newestLog = await queryBuilder
      .clone()
      .orderBy("audit_log.created_at", "DESC")
      .getOne();

    return {
      totalLogs,
      criticalOperations: criticalOps,
      financialTransactions: financialTxns,
      contractOperations: contractOps,
      dataExports,
      oldestLog: oldestLog?.createdAt || null,
      newestLog: newestLog?.createdAt || null,
      retentionCompliance: AuditLog.isRetentionCompliant(
        oldestLog?.createdAt || null,
      ),
    };
  }
}
