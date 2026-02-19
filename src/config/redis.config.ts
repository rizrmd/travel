/**
 * Epic 8, Story 8.5: Redis Configuration
 * Centralized configuration for Redis cache and queue
 */

import { ConfigService } from "@nestjs/config";

/**
 * Redis connection configuration
 */
export const getRedisConfig = (configService: ConfigService) => ({
  host: configService.get("REDIS_HOST", "localhost"),
  port: configService.get<number>("REDIS_PORT", 6379),
  password: configService.get("REDIS_PASSWORD"),
  db: configService.get<number>("REDIS_DB", 0),
  // Retry strategy
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Connection timeout
  connectTimeout: 10000,
  // Enable keepalive
  keepAlive: 30000,
  // Max retry attempts
  maxRetriesPerRequest: 3,
});

/**
 * Redis cache-specific configuration
 */
export const getRedisCacheConfig = (configService: ConfigService) => ({
  host: configService.get("REDIS_HOST", "localhost"),
  port: configService.get<number>("REDIS_PORT", 6379),
  password: configService.get("REDIS_PASSWORD"),
  db: configService.get<number>("REDIS_CACHE_DB", 1), // Separate DB for cache
  ttl: configService.get<number>("CACHE_TTL", 300), // 5 minutes default
  max: configService.get<number>("CACHE_MAX_ITEMS", 1000),
});

/**
 * Redis queue-specific configuration
 */
export const getRedisQueueConfig = (configService: ConfigService) => ({
  host: configService.get("REDIS_HOST", "localhost"),
  port: configService.get<number>("REDIS_PORT", 6379),
  password: configService.get("REDIS_PASSWORD"),
  db: configService.get<number>("REDIS_QUEUE_DB", 2), // Separate DB for queues
});

/**
 * Redis WebSocket session configuration
 */
export const getRedisWebSocketConfig = (configService: ConfigService) => ({
  host: configService.get("REDIS_HOST", "localhost"),
  port: configService.get<number>("REDIS_PORT", 6379),
  password: configService.get("REDIS_PASSWORD"),
  db: configService.get<number>("REDIS_WS_DB", 3), // Separate DB for WebSocket sessions
});

/**
 * Redis key prefixes for different uses
 */
export const RedisKeyPrefix = {
  CACHE: "cache:",
  SESSION: "session:",
  WEBSOCKET: "ws:",
  QUEUE: "queue:",
  LOCK: "lock:",
  RATE_LIMIT: "ratelimit:",
};

/**
 * Cache TTL presets (in seconds)
 */
export const CacheTTLPresets = {
  SHORT: 2 * 60, // 2 minutes
  MEDIUM: 10 * 60, // 10 minutes
  LONG: 60 * 60, // 1 hour
  PERMISSIONS: 5 * 60, // 5 minutes
  PACKAGES: 15 * 60, // 15 minutes
  SETTINGS: 60 * 60, // 1 hour
  USER_PROFILE: 30 * 60, // 30 minutes
};
