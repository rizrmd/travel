/**
 * Epic 8, Story 8.3: WebSocket Event DTOs
 * DTOs for WebSocket event subscriptions and emissions
 */

import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsObject,
} from "class-validator";
import { WebSocketEventType } from "../types/websocket-events.type";

/**
 * DTO for subscribing to specific event types
 */
export class SubscribeEventDto {
  @IsEnum(WebSocketEventType, { each: true })
  eventTypes: WebSocketEventType[];

  @IsOptional()
  @IsUUID()
  entityId?: string; // Subscribe to events for specific entity only
}

/**
 * DTO for unsubscribing from event types
 */
export class UnsubscribeEventDto {
  @IsEnum(WebSocketEventType, { each: true })
  eventTypes: WebSocketEventType[];
}

/**
 * DTO for requesting event history
 */
export class GetEventHistoryDto {
  @IsOptional()
  @IsString()
  since?: string; // ISO timestamp - get events since this time

  @IsOptional()
  @IsEnum(WebSocketEventType, { each: true })
  eventTypes?: WebSocketEventType[]; // Filter by event types
}

/**
 * DTO for broadcasting custom events (admin only)
 */
export class BroadcastEventDto {
  @IsEnum(WebSocketEventType)
  type: WebSocketEventType;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  message?: string;
}
