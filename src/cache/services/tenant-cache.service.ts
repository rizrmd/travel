/**
 * Epic 8, Story 8.5: Tenant-Scoped Cache Service
 * Redis caching with tenant isolation
 */

import { Injectable, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { WebSocketEventEmitter } from "../../websocket/events/websocket-event.emitter";

/**
 * Cache TTL defaults (in seconds)
 */
export enum CacheTTL {
  PERMISSIONS = 5 * 60, // 5 minutes
  PACKAGES = 15 * 60, // 15 minutes
  TENANT_SETTINGS = 60 * 60, // 1 hour
  USER_PROFILE = 30 * 60, // 30 minutes
  COMMISSION_RULES = 60 * 60, // 1 hour
  SHORT = 2 * 60, // 2 minutes
  MEDIUM = 10 * 60, // 10 minutes
  LONG = 60 * 60, // 1 hour
}

/**
 * Tenant-scoped cache service
 * All cache keys are prefixed with tenant ID for isolation
 */
@Injectable()
export class TenantCacheService {
  private readonly logger = new Logger(TenantCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly websocketEmitter: WebSocketEventEmitter,
  ) {}

  /**
   * Generate tenant-scoped cache key
   * Format: tenant:{tenantId}:{resource}:{id}
   */
  private getTenantKey(
    tenantId: string,
    resource: string,
    id?: string,
  ): string {
    const parts = ["tenant", tenantId, resource];
    if (id) {
      parts.push(id);
    }
    return parts.join(":");
  }

  /**
   * Get cached value
   */
  async get<T>(
    tenantId: string,
    resource: string,
    id?: string,
  ): Promise<T | null> {
    const key = this.getTenantKey(tenantId, resource, id);

    try {
      const value = await this.cacheManager.get<T>(key);

      if (value) {
        this.logger.debug(`Cache HIT: ${key}`);
        return value;
      }

      this.logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Cache GET error for ${key}:`, error);
      return null;
    }
  }

  /**
   * Set cached value
   */
  async set<T>(
    tenantId: string,
    resource: string,
    value: T,
    ttl?: number,
    id?: string,
  ): Promise<void> {
    const key = this.getTenantKey(tenantId, resource, id);

    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} (TTL: ${ttl || "default"}s)`);
    } catch (error) {
      this.logger.error(`Cache SET error for ${key}:`, error);
    }
  }

  /**
   * Delete cached value
   */
  async delete(tenantId: string, resource: string, id?: string): Promise<void> {
    const key = this.getTenantKey(tenantId, resource, id);

    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DELETE: ${key}`);

      // Emit cache invalidation event
      await this.websocketEmitter.emitCacheInvalidation(tenantId, resource, id);
    } catch (error) {
      this.logger.error(`Cache DELETE error for ${key}:`, error);
    }
  }

  /**
   * Delete all cached values for a resource
   * Useful when invalidating all packages, all permissions, etc.
   */
  async deletePattern(tenantId: string, resource: string): Promise<void> {
    const pattern = this.getTenantKey(tenantId, resource, "*");

    try {
      // Note: This requires redis store with pattern matching support
      // For in-memory cache, this won't work - consider using Redis in production
      await this.cacheManager.store.reset();
      this.logger.debug(`Cache DELETE pattern: ${pattern}`);

      // Emit cache invalidation event
      await this.websocketEmitter.emitCacheInvalidation(tenantId, resource);
    } catch (error) {
      this.logger.error(`Cache DELETE pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Clear all cache for tenant
   */
  async clearTenantCache(tenantId: string): Promise<void> {
    const pattern = `tenant:${tenantId}:*`;

    try {
      // In production with Redis, use SCAN and DEL
      // For now, just log
      this.logger.warn(`Cache CLEAR requested for tenant ${tenantId}`);
      // TODO: Implement actual pattern-based deletion
    } catch (error) {
      this.logger.error(`Cache CLEAR error for tenant ${tenantId}:`, error);
    }
  }

  /**
   * Get or set pattern (cache-aside)
   * If value exists in cache, return it. Otherwise, fetch from callback and cache it.
   */
  async getOrSet<T>(
    tenantId: string,
    resource: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    id?: string,
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(tenantId, resource, id);
    if (cached !== null) {
      return cached;
    }

    // Not in cache, fetch from source
    this.logger.debug(
      `Fetching ${resource} from source for tenant ${tenantId}`,
    );
    const value = await fetchFn();

    // Store in cache
    await this.set(tenantId, resource, value, ttl, id);

    return value;
  }

  /**
   * Cache user permissions
   * Story 8.5: Cache permissions with 5-minute TTL
   */
  async cacheUserPermissions(
    tenantId: string,
    userId: string,
    permissions: string[],
  ): Promise<void> {
    await this.set(
      tenantId,
      "permissions",
      permissions,
      CacheTTL.PERMISSIONS,
      userId,
    );
  }

  /**
   * Get cached user permissions
   */
  async getUserPermissions(
    tenantId: string,
    userId: string,
  ): Promise<string[] | null> {
    return await this.get<string[]>(tenantId, "permissions", userId);
  }

  /**
   * Cache package data
   * Story 8.5: Cache packages with 15-minute TTL
   */
  async cachePackage(
    tenantId: string,
    packageId: string,
    packageData: any,
  ): Promise<void> {
    await this.set(
      tenantId,
      "package",
      packageData,
      CacheTTL.PACKAGES,
      packageId,
    );
  }

  /**
   * Get cached package
   */
  async getPackage(tenantId: string, packageId: string): Promise<any | null> {
    return await this.get(tenantId, "package", packageId);
  }

  /**
   * Invalidate package cache
   */
  async invalidatePackage(tenantId: string, packageId: string): Promise<void> {
    await this.delete(tenantId, "package", packageId);
  }

  /**
   * Cache tenant settings
   * Story 8.5: Cache tenant settings with 1-hour TTL
   */
  async cacheTenantSettings(tenantId: string, settings: any): Promise<void> {
    await this.set(tenantId, "settings", settings, CacheTTL.TENANT_SETTINGS);
  }

  /**
   * Get cached tenant settings
   */
  async getTenantSettings(tenantId: string): Promise<any | null> {
    return await this.get(tenantId, "settings");
  }

  /**
   * Invalidate tenant settings
   */
  async invalidateTenantSettings(tenantId: string): Promise<void> {
    await this.delete(tenantId, "settings");
  }

  /**
   * Cache user profile
   */
  async cacheUserProfile(
    tenantId: string,
    userId: string,
    profile: any,
  ): Promise<void> {
    await this.set(tenantId, "user", profile, CacheTTL.USER_PROFILE, userId);
  }

  /**
   * Get cached user profile
   */
  async getUserProfile(tenantId: string, userId: string): Promise<any | null> {
    return await this.get(tenantId, "user", userId);
  }

  /**
   * Cache commission rules
   * Story 7.5: Cache commission rules
   */
  async cacheCommissionRules(tenantId: string, rules: any): Promise<void> {
    await this.set(
      tenantId,
      "commission_rules",
      rules,
      CacheTTL.COMMISSION_RULES,
    );
  }

  /**
   * Get cached commission rules
   */
  async getCommissionRules(tenantId: string): Promise<any | null> {
    return await this.get(tenantId, "commission_rules");
  }

  /**
   * Warm up cache on tenant login
   * Story 8.5: Cache warm-up
   */
  async warmUpCache(tenantId: string, userId: string): Promise<void> {
    this.logger.log(
      `Warming up cache for user ${userId} in tenant ${tenantId}`,
    );

    // TODO: Pre-load commonly accessed data
    // - User permissions
    // - Tenant settings
    // - User profile
    // - Active packages
    // - Commission rules

    // For now, just log
    this.logger.debug("Cache warm-up completed");
  }

  /**
   * Get cache hit rate (monitoring)
   * Story 8.5: Cache hit rate monitoring
   */
  async getCacheStats(): Promise<{
    hits: number;
    misses: number;
    hitRate: number;
  }> {
    // TODO: Implement actual cache stats tracking
    // This requires tracking hits/misses in memory or Redis

    return {
      hits: 0,
      misses: 0,
      hitRate: 0,
    };
  }
}
