import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { TenantMetricEntity } from "../infrastructure/persistence/relational/entities/tenant-metric.entity";
import { TenantMetrics, TenantMetricType } from "../domain/tenant-metrics";

/**
 * Tenant Metrics Service
 *
 * Collects and analyzes tenant-specific metrics
 */
@Injectable()
export class TenantMetricsService {
  constructor(
    @InjectRepository(TenantMetricEntity)
    private readonly tenantMetricRepository: Repository<TenantMetricEntity>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Get all metrics for a tenant
   */
  async getTenantMetrics(tenantId: string): Promise<TenantMetrics[]> {
    const cacheKey = `tenant_metrics:${tenantId}`;
    const cached = await this.cacheManager.get<TenantMetrics[]>(cacheKey);
    if (cached) return cached;

    const [
      userCount,
      jamaahCount,
      revenue,
      activityScore,
      errorCount,
      apiCalls,
      storageUsed,
      activeSessions,
    ] = await Promise.all([
      this.getUserCount(tenantId),
      this.getJamaahCount(tenantId),
      this.getRevenue(tenantId, "month"),
      this.getActivityScore(tenantId),
      this.getErrorCount(tenantId),
      this.getApiCalls(tenantId),
      this.getStorageUsed(tenantId),
      this.getActiveSessions(tenantId),
    ]);

    const metrics = [
      userCount,
      jamaahCount,
      revenue,
      activityScore,
      errorCount,
      apiCalls,
      storageUsed,
      activeSessions,
    ];

    await this.cacheManager.set(cacheKey, metrics, 300); // 5-minute cache
    return metrics;
  }

  /**
   * Get active user count for tenant
   */
  async getUserCount(tenantId: string): Promise<TenantMetrics> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM users WHERE tenant_id = $1 AND deleted_at IS NULL`,
      [tenantId],
    );

    const count = parseInt(result[0]?.count || 0);
    return new TenantMetrics(tenantId, TenantMetricType.USER_COUNT, count, {
      period: "day",
    });
  }

  /**
   * Get jamaah count for tenant
   */
  async getJamaahCount(tenantId: string): Promise<TenantMetrics> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM jamaah WHERE tenant_id = $1 AND deleted_at IS NULL`,
      [tenantId],
    );

    const count = parseInt(result[0]?.count || 0);
    return new TenantMetrics(tenantId, TenantMetricType.JAMAAH_COUNT, count, {
      period: "day",
    });
  }

  /**
   * Get revenue for tenant
   */
  async getRevenue(
    tenantId: string,
    period: "day" | "week" | "month",
  ): Promise<TenantMetrics> {
    const intervals = { day: "1 day", week: "7 days", month: "30 days" };

    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM payments 
       WHERE tenant_id = $1 
       AND status = 'completed' 
       AND created_at > NOW() - INTERVAL '${intervals[period]}'`,
      [tenantId],
    );

    const total = parseFloat(result[0]?.total || 0);
    return new TenantMetrics(tenantId, TenantMetricType.REVENUE, total, {
      period,
    });
  }

  /**
   * Calculate activity score (0-100)
   */
  async getActivityScore(tenantId: string): Promise<TenantMetrics> {
    const [userCount, jamaahCount, apiCalls, activeSessions] =
      await Promise.all([
        this.getUserCount(tenantId).then((m) => m.value),
        this.getJamaahCount(tenantId).then((m) => m.value),
        this.getApiCalls(tenantId).then((m) => m.value),
        this.getActiveSessions(tenantId).then((m) => m.value),
      ]);

    const score = TenantMetrics.calculateActivityScore(
      userCount,
      jamaahCount,
      apiCalls,
      activeSessions,
    );

    return new TenantMetrics(tenantId, TenantMetricType.ACTIVITY_SCORE, score, {
      period: "day",
      breakdown: { userCount, jamaahCount, apiCalls, activeSessions },
    });
  }

  /**
   * Get error count for tenant
   */
  async getErrorCount(tenantId: string): Promise<TenantMetrics> {
    // Would query from error logs/Sentry
    // Mock implementation
    const count = Math.floor(Math.random() * 50);
    return new TenantMetrics(tenantId, TenantMetricType.ERROR_COUNT, count, {
      period: "hour",
    });
  }

  /**
   * Get API calls count
   */
  async getApiCalls(tenantId: string): Promise<TenantMetrics> {
    // Would query from API gateway logs
    // Mock implementation
    const count = Math.floor(Math.random() * 5000);
    return new TenantMetrics(tenantId, TenantMetricType.API_CALLS, count, {
      period: "hour",
    });
  }

  /**
   * Get storage used by tenant (in MB)
   */
  async getStorageUsed(tenantId: string): Promise<TenantMetrics> {
    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(pg_column_size(documents.*)), 0) as total_size 
       FROM documents WHERE tenant_id = $1`,
      [tenantId],
    );

    const sizeBytes = parseFloat(result[0]?.total_size || 0);
    const sizeMB = sizeBytes / (1024 * 1024);

    return new TenantMetrics(tenantId, TenantMetricType.STORAGE_USED, sizeMB);
  }

  /**
   * Get active sessions count
   */
  async getActiveSessions(tenantId: string): Promise<TenantMetrics> {
    // Would query from Redis session store
    // Mock implementation
    const count = Math.floor(Math.random() * 20);
    return new TenantMetrics(tenantId, TenantMetricType.ACTIVE_SESSIONS, count);
  }

  /**
   * Aggregate metrics for all tenants
   */
  async aggregateAllTenants(): Promise<void> {
    const tenants = await this.dataSource.query(
      "SELECT id FROM tenants WHERE status = $1",
      ["active"],
    );

    for (const tenant of tenants) {
      const metrics = await this.getTenantMetrics(tenant.id);

      const entities = metrics.map((metric) => {
        const entity = new TenantMetricEntity();
        entity.tenantId = metric.tenantId;
        entity.metricType = metric.metricType;
        entity.value = metric.value;
        entity.metadata = metric.metadata;
        entity.recordedAt = metric.recordedAt;
        return entity;
      });

      await this.tenantMetricRepository.save(entities);
    }
  }

  /**
   * Get metric history for tenant
   */
  async getMetricHistory(
    tenantId: string,
    metricType: TenantMetricType,
    startDate: Date,
    endDate: Date,
  ): Promise<TenantMetrics[]> {
    const entities = await this.tenantMetricRepository.find({
      where: { tenantId, metricType },
      order: { recordedAt: "ASC" },
    });

    const filtered = entities.filter(
      (e) => e.recordedAt >= startDate && e.recordedAt <= endDate,
    );

    return filtered.map(
      (entity) =>
        new TenantMetrics(
          entity.tenantId,
          entity.metricType,
          Number(entity.value),
          entity.metadata,
          entity.recordedAt,
        ),
    );
  }

  /**
   * Get tenants at risk (low activity or high errors)
   */
  async getTenantsAtRisk(): Promise<string[]> {
    const activityScores = await this.tenantMetricRepository.find({
      where: { metricType: TenantMetricType.ACTIVITY_SCORE },
      order: { recordedAt: "DESC" },
    });

    const grouped = new Map<string, TenantMetricEntity>();
    activityScores.forEach((score) => {
      if (!grouped.has(score.tenantId)) {
        grouped.set(score.tenantId, score);
      }
    });

    const atRisk: string[] = [];
    grouped.forEach((score, tenantId) => {
      const metric = new TenantMetrics(
        score.tenantId,
        score.metricType,
        Number(score.value),
        score.metadata,
        score.recordedAt,
      );
      if (metric.isAtRisk()) {
        atRisk.push(tenantId);
      }
    });

    return atRisk;
  }

  /**
   * Cleanup old metrics (retention: 365 days)
   */
  async cleanupOldMetrics(): Promise<number> {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - 365);

    const result = await this.tenantMetricRepository
      .createQueryBuilder()
      .delete()
      .where("recorded_at < :retentionDate", { retentionDate })
      .execute();

    return result.affected || 0;
  }
}
