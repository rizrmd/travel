/**
 * Epic 8, Stories 8.1-8.3: WebSocket Module
 * Configures WebSocket gateway and event emitters
 */

import { Module, Global } from "@nestjs/common";
import { AppWebSocketGateway } from "./websocket.gateway";
import { WebSocketEventEmitter } from "./events/websocket-event.emitter";
import { WsPermissionsGuard } from "./guards/ws-permissions.guard";

/**
 * WebSocket module - marked as Global to make event emitter available everywhere
 */
@Global()
@Module({
  providers: [AppWebSocketGateway, WebSocketEventEmitter, WsPermissionsGuard],
  exports: [AppWebSocketGateway, WebSocketEventEmitter],
})
export class WebSocketModule { }
