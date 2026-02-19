/**
 * Epic 8, Stories 8.1-8.3: WebSocket Gateway
 * Handles WebSocket connections, authentication, and real-time event broadcasting
 */

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger, UseGuards } from "@nestjs/common";
import { wsAuthMiddleware } from "./middleware/ws-auth.middleware";
import { WsPermissionsGuard } from "./guards/ws-permissions.guard";
import {
  SocketData,
  WebSocketEventPayload,
  EventHistoryEntry,
} from "./types/websocket-events.type";
import {
  SubscribeEventDto,
  UnsubscribeEventDto,
  GetEventHistoryDto,
} from "./dto/websocket-event.dto";

/**
 * WebSocket Gateway with tenant isolation and authentication
 * Story 8.1: Socket.IO setup with tenant-isolated rooms
 * Story 8.2: JWT authentication
 * Story 8.3: Real-time event broadcasting
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: "/ws",
})
@Injectable()
export class AppWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppWebSocketGateway.name);

  /**
   * In-memory event history (last 100 events per tenant)
   * In production, store in Redis for scalability
   */
  private eventHistory: Map<string, EventHistoryEntry[]> = new Map();
  private readonly MAX_HISTORY_SIZE = 100;

  /**
   * Track connected clients per tenant
   * Format: tenant:{tenantId} -> Set<socketId>
   */
  private tenantConnections: Map<string, Set<string>> = new Map();

  /**
   * Initialize WebSocket server
   * Story 8.1: Setup authentication middleware
   */
  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway initialized");

    // Apply authentication middleware to all connections
    server.use(wsAuthMiddleware);

    this.logger.log("WebSocket authentication middleware applied");
  }

  /**
   * Handle new client connection
   * Story 8.1: Auto-join tenant room on connection
   */
  async handleConnection(client: Socket) {
    try {
      const socketData: SocketData = client.data;

      this.logger.log(
        `Client connected: ${client.id} | User: ${socketData.userId} | Tenant: ${socketData.tenantId}`,
      );

      // Join tenant-specific room for isolation
      const tenantRoom = `tenant:${socketData.tenantId}`;
      await client.join(tenantRoom);

      // Track connection
      this.trackConnection(socketData.tenantId, client.id);

      // TODO: Store connection in Redis for multi-server support
      // await this.redisService.set(
      //   `ws:connection:${client.id}`,
      //   JSON.stringify(socketData),
      //   'EX',
      //   3600, // 1 hour TTL
      // );

      // Send connection success event
      client.emit("connected", {
        message: "Successfully connected to WebSocket server",
        tenantRoom,
        connectedAt: socketData.connectedAt,
      });

      // Send event history to reconnecting client
      const history = this.getEventHistory(socketData.tenantId);
      if (history.length > 0) {
        client.emit("event:history", { events: history });
      }
    } catch (error) {
      this.logger.error(`Connection failed for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    const socketData: SocketData = client.data;

    this.logger.log(
      `Client disconnected: ${client.id} | User: ${socketData?.userId}`,
    );

    if (socketData?.tenantId) {
      this.untrackConnection(socketData.tenantId, client.id);
    }

    // TODO: Remove connection from Redis
    // await this.redisService.del(`ws:connection:${client.id}`);
  }

  /**
   * Subscribe to specific event types
   * Story 8.3: Event subscription with permissions
   */
  @SubscribeMessage("subscribe")
  @UseGuards(WsPermissionsGuard)
  handleSubscribe(
    @MessageBody() dto: SubscribeEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    const socketData: SocketData = client.data;

    this.logger.debug(
      `Client ${client.id} subscribing to events: ${dto.eventTypes.join(", ")}`,
    );

    // Join event-specific rooms
    dto.eventTypes.forEach((eventType) => {
      const eventRoom = `tenant:${socketData.tenantId}:event:${eventType}`;
      client.join(eventRoom);
    });

    // If entity-specific subscription, join entity room
    if (dto.entityId) {
      const entityRoom = `tenant:${socketData.tenantId}:entity:${dto.entityId}`;
      client.join(entityRoom);
    }

    return {
      success: true,
      subscribedTo: dto.eventTypes,
      entityId: dto.entityId,
    };
  }

  /**
   * Unsubscribe from event types
   */
  @SubscribeMessage("unsubscribe")
  handleUnsubscribe(
    @MessageBody() dto: UnsubscribeEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    const socketData: SocketData = client.data;

    this.logger.debug(
      `Client ${client.id} unsubscribing from events: ${dto.eventTypes.join(", ")}`,
    );

    // Leave event-specific rooms
    dto.eventTypes.forEach((eventType) => {
      const eventRoom = `tenant:${socketData.tenantId}:event:${eventType}`;
      client.leave(eventRoom);
    });

    return {
      success: true,
      unsubscribedFrom: dto.eventTypes,
    };
  }

  /**
   * Get event history for reconnecting clients
   * Story 8.3: Event history (last 100 events)
   */
  @SubscribeMessage("get:history")
  handleGetHistory(
    @MessageBody() dto: GetEventHistoryDto,
    @ConnectedSocket() client: Socket,
  ) {
    const socketData: SocketData = client.data;
    let history = this.getEventHistory(socketData.tenantId);

    // Filter by timestamp if provided
    if (dto.since) {
      const sinceDate = new Date(dto.since);
      history = history.filter((entry) => entry.broadcastedAt > sinceDate);
    }

    // Filter by event types if provided
    if (dto.eventTypes && dto.eventTypes.length > 0) {
      history = history.filter((entry) =>
        dto.eventTypes.includes(entry.event.type),
      );
    }

    return {
      events: history.map((entry) => entry.event),
      count: history.length,
    };
  }

  /**
   * Broadcast event to tenant room
   * Story 8.3: Tenant-isolated event broadcasting
   *
   * This is the main method used by services to emit events
   */
  async broadcastToTenant<T = any>(
    tenantId: string,
    event: WebSocketEventPayload<T>,
  ): Promise<void> {
    const tenantRoom = `tenant:${tenantId}`;

    this.logger.debug(`Broadcasting event ${event.type} to tenant ${tenantId}`);

    // Broadcast to all clients in tenant room
    this.server.to(tenantRoom).emit("event", event);

    // Also broadcast to event-specific room
    const eventRoom = `${tenantRoom}:event:${event.type}`;
    this.server.to(eventRoom).emit("event", event);

    // If entity-specific event, also broadcast to entity room
    if (event.entityId) {
      const entityRoom = `${tenantRoom}:entity:${event.entityId}`;
      this.server.to(entityRoom).emit("event", event);
    }

    // Store in event history
    this.addToEventHistory(tenantId, event);
  }

  /**
   * Broadcast event to specific user
   */
  async broadcastToUser<T = any>(
    userId: string,
    tenantId: string,
    event: WebSocketEventPayload<T>,
  ): Promise<void> {
    const userRoom = `tenant:${tenantId}:user:${userId}`;

    this.logger.debug(`Broadcasting event ${event.type} to user ${userId}`);

    this.server.to(userRoom).emit("event", event);
  }

  /**
   * Emit event to tenant (alias for broadcastToTenant with simplified signature)
   * Used by BatchUploadService
   */
  async emitToTenant(
    tenantId: string,
    eventName: string,
    payload: any,
  ): Promise<void> {
    return this.broadcastToTenant(tenantId, {
      type: eventName as any,
      tenantId,
      data: payload,
      timestamp: new Date(),
    });
  }

  /**
   * Get connection count for tenant
   */
  getConnectionCount(tenantId: string): number {
    return this.tenantConnections.get(`tenant:${tenantId}`)?.size || 0;
  }

  /**
   * Get all connected clients for tenant
   */
  getConnectedClients(tenantId: string): string[] {
    return Array.from(this.tenantConnections.get(`tenant:${tenantId}`) || []);
  }

  /**
   * Track client connection
   */
  private trackConnection(tenantId: string, socketId: string): void {
    const tenantKey = `tenant:${tenantId}`;
    if (!this.tenantConnections.has(tenantKey)) {
      this.tenantConnections.set(tenantKey, new Set());
    }
    this.tenantConnections.get(tenantKey).add(socketId);
  }

  /**
   * Untrack client connection
   */
  private untrackConnection(tenantId: string, socketId: string): void {
    const tenantKey = `tenant:${tenantId}`;
    this.tenantConnections.get(tenantKey)?.delete(socketId);
  }

  /**
   * Add event to history
   */
  private addToEventHistory<T = any>(
    tenantId: string,
    event: WebSocketEventPayload<T>,
  ): void {
    const tenantKey = `tenant:${tenantId}`;
    if (!this.eventHistory.has(tenantKey)) {
      this.eventHistory.set(tenantKey, []);
    }

    const history = this.eventHistory.get(tenantKey);
    const entry: EventHistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      event,
      broadcastedAt: new Date(),
    };

    history.push(entry);

    // Keep only last N events
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.shift();
    }

    // TODO: In production, store in Redis with TTL
    // await this.redisService.lpush(
    //   `ws:history:${tenantId}`,
    //   JSON.stringify(entry),
    // );
    // await this.redisService.ltrim(`ws:history:${tenantId}`, 0, MAX_HISTORY_SIZE - 1);
    // await this.redisService.expire(`ws:history:${tenantId}`, 3600); // 1 hour
  }

  /**
   * Get event history for tenant
   */
  private getEventHistory(tenantId: string): EventHistoryEntry[] {
    const tenantKey = `tenant:${tenantId}`;
    return this.eventHistory.get(tenantKey) || [];
  }
}
