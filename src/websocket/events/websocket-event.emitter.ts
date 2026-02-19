/**
 * Epic 8, Story 8.3: WebSocket Event Emitter Service
 * Helper service for emitting real-time events from business logic
 */

import { Injectable, Logger } from "@nestjs/common";
import { AppWebSocketGateway } from "../websocket.gateway";
import {
  WebSocketEventType,
  WebSocketEventPayload,
  JamaahEventData,
  PaymentEventData,
  CommissionEventData,
  DocumentEventData,
  PackageEventData,
  LeadEventData,
  NotificationEventData,
  JobEventData,
} from "../types/websocket-events.type";

/**
 * Service to emit WebSocket events from business logic
 * Usage: Inject this service into domain services and call emit methods
 */
@Injectable()
export class WebSocketEventEmitter {
  private readonly logger = new Logger(WebSocketEventEmitter.name);

  constructor(private readonly websocketGateway: AppWebSocketGateway) { }

  /**
   * Emit jamaah-related events
   */
  async emitJamaahEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: JamaahEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<JamaahEventData> = {
      type,
      tenantId,
      entityId: data.jamaahId,
      data,
      timestamp: new Date(),
      actorId,
    };

    await this.websocketGateway.broadcastToTenant(tenantId, payload);
    this.logger.debug(`Emitted ${type} for jamaah ${data.jamaahId}`);
  }

  /**
   * Emit payment-related events
   */
  async emitPaymentEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: PaymentEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<PaymentEventData> = {
      type,
      tenantId,
      entityId: data.paymentId,
      data,
      timestamp: new Date(),
      actorId,
    };

    await this.websocketGateway.broadcastToTenant(tenantId, payload);
    this.logger.debug(`Emitted ${type} for payment ${data.paymentId}`);
  }

  /**
   * Emit commission-related events
   */
  async emitCommissionEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: CommissionEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<CommissionEventData> = {
      type,
      tenantId,
      entityId: data.commissionId,
      data,
      timestamp: new Date(),
      actorId,
    };

    // Broadcast to tenant
    await this.websocketGateway.broadcastToTenant(tenantId, payload);

    // Also send to specific agent
    await this.websocketGateway.broadcastToUser(
      data.agentId,
      tenantId,
      payload,
    );

    this.logger.debug(
      `Emitted ${type} for commission ${data.commissionId} to agent ${data.agentId}`,
    );
  }

  /**
   * Emit document-related events
   */
  async emitDocumentEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: DocumentEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<DocumentEventData> = {
      type,
      tenantId,
      entityId: data.documentId,
      data,
      timestamp: new Date(),
      actorId,
    };

    await this.websocketGateway.broadcastToTenant(tenantId, payload);
    this.logger.debug(`Emitted ${type} for document ${data.documentId}`);
  }

  /**
   * Emit package-related events
   */
  async emitPackageEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: PackageEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<PackageEventData> = {
      type,
      tenantId,
      entityId: data.packageId,
      data,
      timestamp: new Date(),
      actorId,
    };

    await this.websocketGateway.broadcastToTenant(tenantId, payload);
    this.logger.debug(`Emitted ${type} for package ${data.packageId}`);
  }

  /**
   * Emit lead-related events
   */
  async emitLeadEvent(
    type: WebSocketEventType,
    tenantId: string,
    data: LeadEventData,
    actorId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<LeadEventData> = {
      type,
      tenantId,
      entityId: data.leadId,
      data,
      timestamp: new Date(),
      actorId,
    };

    // Broadcast to tenant
    await this.websocketGateway.broadcastToTenant(tenantId, payload);

    // Also send to assigned agent
    await this.websocketGateway.broadcastToUser(
      data.agentId,
      tenantId,
      payload,
    );

    this.logger.debug(
      `Emitted ${type} for lead ${data.leadId} to agent ${data.agentId}`,
    );
  }

  /**
   * Emit notification to specific user or tenant
   */
  async emitNotification(
    tenantId: string,
    data: NotificationEventData,
    userId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload<NotificationEventData> = {
      type: WebSocketEventType.NOTIFICATION,
      tenantId,
      data,
      timestamp: new Date(),
    };

    if (userId) {
      // Send to specific user
      await this.websocketGateway.broadcastToUser(userId, tenantId, payload);
      this.logger.debug(`Emitted notification to user ${userId}`);
    } else {
      // Send to entire tenant
      await this.websocketGateway.broadcastToTenant(tenantId, payload);
      this.logger.debug(`Emitted notification to tenant ${tenantId}`);
    }
  }

  /**
   * Emit job completion/failure events
   * Story 8.4: Background job events
   */
  async emitJobEvent(
    tenantId: string,
    data: JobEventData,
    userId?: string,
  ): Promise<void> {
    const type =
      data.status === "completed"
        ? WebSocketEventType.JOB_COMPLETED
        : WebSocketEventType.JOB_FAILED;

    const payload: WebSocketEventPayload<JobEventData> = {
      type,
      tenantId,
      entityId: data.jobId,
      data,
      timestamp: new Date(),
    };

    if (userId) {
      // Send to user who initiated the job
      await this.websocketGateway.broadcastToUser(userId, tenantId, payload);
      this.logger.debug(
        `Emitted job ${data.status} event for job ${data.jobId} to user ${userId}`,
      );
    } else {
      // Send to entire tenant (for system jobs)
      await this.websocketGateway.broadcastToTenant(tenantId, payload);
      this.logger.debug(
        `Emitted job ${data.status} event for job ${data.jobId}`,
      );
    }
  }

  /**
   * Emit cache invalidation event
   * Story 8.5: Cache invalidation notification
   */
  async emitCacheInvalidation(
    tenantId: string,
    resource: string,
    entityId?: string,
  ): Promise<void> {
    const payload: WebSocketEventPayload = {
      type: WebSocketEventType.CACHE_INVALIDATED,
      tenantId,
      entityId,
      data: { resource },
      timestamp: new Date(),
    };

    await this.websocketGateway.broadcastToTenant(tenantId, payload);
    this.logger.debug(`Emitted cache invalidation for ${resource}`);
  }

  /**
   * Generic event emitter for custom events
   */
  async emitCustomEvent<T = any>(
    type: WebSocketEventType,
    tenantId: string,
    data: T,
    options?: {
      entityId?: string;
      actorId?: string;
      userId?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<void> {
    const payload: WebSocketEventPayload<T> = {
      type,
      tenantId,
      entityId: options?.entityId,
      data,
      timestamp: new Date(),
      actorId: options?.actorId,
      metadata: options?.metadata,
    };

    if (options?.userId) {
      await this.websocketGateway.broadcastToUser(
        options.userId,
        tenantId,
        payload,
      );
    } else {
      await this.websocketGateway.broadcastToTenant(tenantId, payload);
    }

    this.logger.debug(`Emitted custom event ${type}`);
  }
}
