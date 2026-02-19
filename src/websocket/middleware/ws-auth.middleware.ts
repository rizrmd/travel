/**
 * Epic 8, Story 8.2: WebSocket Authentication Middleware
 * Validates JWT tokens on WebSocket handshake
 */

import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { SocketData } from "../types/websocket-events.type";

/**
 * Middleware to authenticate WebSocket connections
 * Extracts JWT from headers or query params and validates it
 */
export const wsAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    // Extract token from auth header or query param
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
      socket.handshake.query?.token;

    if (!token) {
      throw new WsException("Authentication token not provided");
    }

    // TODO: Validate JWT token when auth module is ready
    // For now, mock the validation
    const isValidToken = validateToken(token as string);

    if (!isValidToken) {
      throw new WsException("Invalid authentication token");
    }

    // TODO: Decode JWT to extract user info
    // For now, use mock data
    const user = decodeToken(token as string);

    // Store user context in socket.data for later use
    const socketData: SocketData = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      connectedAt: new Date(),
    };

    socket.data = socketData;

    next();
  } catch (error) {
    console.error("WebSocket authentication failed:", error);
    next(new Error("Authentication failed"));
  }
};

/**
 * Mock token validation (replace with actual JWT validation)
 * TODO: Replace with JwtService when auth module is ready
 */
function validateToken(token: string): boolean {
  // Mock validation - accept any non-empty token for now
  if (!token || token.trim() === "") {
    return false;
  }

  // In production, validate JWT signature and expiration
  // return this.jwtService.verify(token);
  return true;
}

/**
 * Mock token decoding (replace with actual JWT decoding)
 * TODO: Replace with JwtService when auth module is ready
 */
function decodeToken(token: string): {
  id: string;
  tenantId: string;
  role: string;
  email: string;
} {
  // Mock decoded user data
  // In production, decode JWT payload
  // const payload = this.jwtService.decode(token);

  return {
    id: "mock-user-id",
    tenantId: "mock-tenant-id",
    role: "agency_owner",
    email: "mock@example.com",
  };
}
