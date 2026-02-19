/**
 * Epic 8, Story 8.5: Cache Module
 * Configures Redis caching with tenant scoping
 */

import { Module, Global } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { TenantCacheService } from "./services/tenant-cache.service";
import { WebSocketModule } from "../websocket/websocket.module";

/**
 * Cache module - marked as Global to make cache service available everywhere
 */
@Global()
@Module({
  imports: [
    // Configure cache-manager with Redis
    NestCacheModule.register({
      isGlobal: true,
      // Redis store configuration
      // Note: Install cache-manager-redis-store for production
      // store: redisStore,
      // host: process.env.REDIS_HOST || 'localhost',
      // port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      // password: process.env.REDIS_PASSWORD,
      // db: parseInt(process.env.REDIS_CACHE_DB, 10) || 1,
      // ttl: 60 * 5, // Default TTL: 5 minutes

      // For development, use memory store
      // TODO: Switch to Redis in production
      ttl: 60 * 5, // 5 minutes default
      max: 1000, // Max items in cache
    }),

    // Import WebSocketModule for event emitter
    WebSocketModule,
  ],
  providers: [TenantCacheService],
  exports: [TenantCacheService, NestCacheModule],
})
export class CacheModule {}
