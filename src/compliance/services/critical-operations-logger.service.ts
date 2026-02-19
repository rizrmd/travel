/**
 * Epic 12, Story 12.5: Critical Operations Logger Service
 */

import { Injectable } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import { AuditAction, ActorRole } from "../domain/audit-log";

@Injectable()
export class CriticalOperationsLoggerService {
  constructor(private auditLogService: AuditLogService) {}

  async logOperation(params: {
    tenantId: string;
    action: AuditAction;
    entityId: string;
    actorId: string | null;
    actorRole: ActorRole;
    actorName: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.auditLogService.logCriticalOperation(params);
  }
}
