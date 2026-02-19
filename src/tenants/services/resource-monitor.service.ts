import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { TenantEntity } from "../entities/tenant.entity";

export interface ResourceUsage {
  currentConcurrentUsers: number;
  maxConcurrentUsers: number;
  jamaahThisMonth: number;
  maxJamaahPerMonth: number;
  agentsCount: number;
  maxAgents: number;
  packagesCount: number;
  maxPackages: number;
}

/**
 * Resource Monitor Service
 * Tracks and enforces resource limits per tenant
 */
@Injectable()
export class ResourceMonitorService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Check if tenant can add a new concurrent user
   */
  async canAddConcurrentUser(tenantId: string): Promise<boolean> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      return false;
    }

    const currentCount = await this.getConcurrentUserCount(tenantId);
    return currentCount < tenant.resourceLimits.maxConcurrentUsers;
  }

  /**
   * Add concurrent user to Redis set
   */
  async addConcurrentUser(tenantId: string, userId: string): Promise<void> {
    const key = `tenant:${tenantId}:concurrent_users`;
    const users = (await this.cacheManager.get<string[]>(key)) || [];

    if (!users.includes(userId)) {
      users.push(userId);
      await this.cacheManager.set(key, users, 3600000); // 1 hour TTL
    }
  }

  /**
   * Remove concurrent user from Redis set
   */
  async removeConcurrentUser(tenantId: string, userId: string): Promise<void> {
    const key = `tenant:${tenantId}:concurrent_users`;
    const users = (await this.cacheManager.get<string[]>(key)) || [];

    const updatedUsers = users.filter((id) => id !== userId);
    await this.cacheManager.set(key, updatedUsers, 3600000);
  }

  /**
   * Get current concurrent user count
   */
  async getConcurrentUserCount(tenantId: string): Promise<number> {
    const key = `tenant:${tenantId}:concurrent_users`;
    const users = (await this.cacheManager.get<string[]>(key)) || [];
    return users.length;
  }

  /**
   * Check if tenant can create more jamaah this month
   */
  async canCreateJamaah(tenantId: string): Promise<boolean> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      return false;
    }

    const currentCount = await this.getJamaahCountThisMonth(tenantId);
    return currentCount < tenant.resourceLimits.maxJamaahPerMonth;
  }

  /**
   * Increment jamaah count for current month
   */
  async incrementJamaahCount(tenantId: string): Promise<void> {
    const key = this.getJamaahCountKey(tenantId);
    const currentCount = (await this.cacheManager.get<number>(key)) || 0;

    // Set TTL to end of month
    const ttl = this.getMillisecondsUntilEndOfMonth();
    await this.cacheManager.set(key, currentCount + 1, ttl);
  }

  /**
   * Get jamaah count for current month
   */
  async getJamaahCountThisMonth(tenantId: string): Promise<number> {
    const key = this.getJamaahCountKey(tenantId);
    return (await this.cacheManager.get<number>(key)) || 0;
  }

  /**
   * Get resource usage statistics for tenant
   */
  async getResourceUsage(tenantId: string): Promise<ResourceUsage> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const currentConcurrentUsers = await this.getConcurrentUserCount(tenantId);
    const jamaahThisMonth = await this.getJamaahCountThisMonth(tenantId);

    // TODO: Get actual counts from database
    const agentsCount = 0; // await this.getAgentCount(tenantId);
    const packagesCount = 0; // await this.getPackageCount(tenantId);

    return {
      currentConcurrentUsers,
      maxConcurrentUsers: tenant.resourceLimits.maxConcurrentUsers,
      jamaahThisMonth,
      maxJamaahPerMonth: tenant.resourceLimits.maxJamaahPerMonth,
      agentsCount,
      maxAgents: tenant.resourceLimits.maxAgents,
      packagesCount,
      maxPackages: tenant.resourceLimits.maxPackages,
    };
  }

  /**
   * Generate Redis key for jamaah count
   */
  private getJamaahCountKey(tenantId: string): string {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return `tenant:${tenantId}:jamaah_count:${yearMonth}`;
  }

  /**
   * Calculate milliseconds until end of current month
   */
  private getMillisecondsUntilEndOfMonth(): number {
    const now = new Date();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return endOfMonth.getTime() - now.getTime();
  }

  /**
   * Reset monthly counters (called by cron job on 1st of month)
   */
  async resetMonthlyCounters(tenantId: string): Promise<void> {
    const key = this.getJamaahCountKey(tenantId);
    await this.cacheManager.del(key);
  }
}
