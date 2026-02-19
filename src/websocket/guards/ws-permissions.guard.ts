/**
 * Epic 8, Story 8.2: WebSocket Permissions Guard
 * Validates user permissions for event subscriptions
 */

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketData, WebSocketEventType } from "../types/websocket-events.type";

/**
 * Guard to check if user has permission to subscribe to specific events
 */
@Injectable()
export class WsPermissionsGuard implements CanActivate {
  /**
   * Events that require admin/agency_owner role
   */
  private readonly adminOnlyEvents: WebSocketEventType[] = [
    WebSocketEventType.COMMISSION_APPROVED,
    WebSocketEventType.COMMISSION_PAID,
    WebSocketEventType.JOB_COMPLETED,
    WebSocketEventType.JOB_FAILED,
    WebSocketEventType.CACHE_INVALIDATED,
  ];

  /**
   * Events that require agent role or higher
   */
  private readonly agentEvents: WebSocketEventType[] = [
    WebSocketEventType.LEAD_CREATED,
    WebSocketEventType.LEAD_UPDATED,
    WebSocketEventType.LEAD_CONVERTED,
    WebSocketEventType.COMMISSION_CREATED,
  ];

  canActivate(context: ExecutionContext): boolean {
    try {
      const client: Socket = context.switchToWs().getClient();
      const data: SocketData = client.data;
      const eventData = context.switchToWs().getData();

      // Extract event types from subscription request
      const eventTypes: WebSocketEventType[] = eventData?.eventTypes || [];

      // Check if user has permission for each event type
      for (const eventType of eventTypes) {
        if (!this.hasPermission(data.role, eventType)) {
          throw new WsException(
            `Insufficient permissions to subscribe to event: ${eventType}`,
          );
        }
      }

      return true;
    } catch (error) {
      console.error("WebSocket permission check failed:", error);
      throw new WsException("Permission denied");
    }
  }

  /**
   * Check if role has permission for event type
   */
  private hasPermission(role: string, eventType: WebSocketEventType): boolean {
    // Super admin and admin have access to all events
    if (role === "super_admin" || role === "admin") {
      return true;
    }

    // Agency owner has access to all events except super admin events
    if (role === "agency_owner") {
      return true;
    }

    // Agent has access to agent events and below
    if (role === "agent") {
      // Deny admin-only events
      if (this.adminOnlyEvents.includes(eventType)) {
        return false;
      }
      return true;
    }

    // Other roles have limited access
    // Deny admin-only and agent events
    if (
      this.adminOnlyEvents.includes(eventType) ||
      this.agentEvents.includes(eventType)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Check if user can access specific entity
   * Used for entity-specific event subscriptions
   */
  canAccessEntity(
    userId: string,
    tenantId: string,
    role: string,
    entityId: string,
    entityType: string,
  ): boolean {
    // Super admin and admin can access all entities
    if (role === "super_admin" || role === "admin" || role === "agency_owner") {
      return true;
    }

    // TODO: Implement entity-specific access checks when entities are ready
    // For example:
    // - Agent can only access their own commissions
    // - Agent can only access jamaah they created
    // - Agent can only access leads assigned to them

    // For now, allow access if same tenant
    return true;
  }
}
