import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { HealthMetricEntity } from "../infrastructure/persistence/relational/entities/health-metric.entity";
import {
  HealthMetrics,
  MetricType,
  HealthStatus,
} from "../domain/health-metrics";
import * as os from "os";

/**
 * Health Metrics Service
 *
 * Collects and monitors system-wide health metrics
 */
@Injectable()
export class HealthMetricsService {
  constructor(
    @InjectRepository(HealthMetricEntity)
    private readonly healthMetricRepository: Repository<HealthMetricEntity>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Collect all system metrics
   */
  async collectMetrics(): Promise<void> {
    const metrics = await Promise.all([
      this.collectApiLatencyP95(),
      this.collectDatabaseQueryTime(),
      this.collectRedisHitRate(),
      this.collectQueueLength(),
      this.collectCpuUsage(),
      this.collectMemoryUsage(),
      this.collectDiskUsage(),
      this.collectActiveConnections(),
    ]);

    // Save all metrics
    const entities = metrics.map((metric) => {
      const entity = new HealthMetricEntity();
      entity.metricType = metric.metricType;
      entity.value = metric.value;
      entity.metadata = metric.metadata;
      entity.recordedAt = metric.recordedAt;
      return entity;
    });

    await this.healthMetricRepository.save(entities);

    // Cache latest metrics (5-minute TTL)
    await this.cacheManager.set("health:latest_metrics", metrics, 300);
  }

  /**
   * Get API latency p95 (95th percentile)
   */
  private async collectApiLatencyP95(): Promise<HealthMetrics> {
    // Query recent API response times from request logs
    // For now, using mock data - integrate with actual API monitoring
    const mockLatency = Math.random() * 800 + 200; // 200-1000ms

    return new HealthMetrics(MetricType.API_LATENCY_P95, mockLatency, {
      source: "api_gateway",
      sampleSize: 1000,
    });
  }

  /**
   * Get average database query time
   */
  private async collectDatabaseQueryTime(): Promise<HealthMetrics> {
    const startTime = Date.now();

    try {
      // Execute sample queries
      await Promise.all([
        this.dataSource.query("SELECT 1"),
        this.dataSource.query("SELECT COUNT(*) FROM tenants"),
        this.dataSource.query(
          "SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '1 hour'",
        ),
      ]);

      const duration = (Date.now() - startTime) / 3; // Average of 3 queries

      return new HealthMetrics(MetricType.DB_QUERY_TIME_AVG, duration, {
        source: "postgresql",
        queriesExecuted: 3,
      });
    } catch (error) {
      return new HealthMetrics(MetricType.DB_QUERY_TIME_AVG, 9999, {
        source: "postgresql",
        error: error.message,
      });
    }
  }

  /**
   * Get Redis cache hit rate
   */
  private async collectRedisHitRate(): Promise<HealthMetrics> {
    try {
      // Get Redis stats (implement with actual Redis client)
      // For now, using mock data
      const hitRate = Math.random() * 30 + 70; // 70-100%

      return new HealthMetrics(MetricType.REDIS_HIT_RATE, hitRate, {
        source: "redis",
      });
    } catch (error) {
      return new HealthMetrics(MetricType.REDIS_HIT_RATE, 0, {
        source: "redis",
        error: error.message,
      });
    }
  }

  /**
   * Get BullMQ queue length
   */
  private async collectQueueLength(): Promise<HealthMetrics> {
    try {
      // Query queue lengths from all queues
      // Integrate with BullMQ - for now using mock data
      const queueLength = Math.floor(Math.random() * 200);

      return new HealthMetrics(MetricType.QUEUE_LENGTH, queueLength, {
        source: "bullmq",
        queues: ["email", "notifications", "analytics", "imports"],
      });
    } catch (error) {
      return new HealthMetrics(MetricType.QUEUE_LENGTH, 0, {
        source: "bullmq",
        error: error.message,
      });
    }
  }

  /**
   * Get CPU usage percentage
   */
  private async collectCpuUsage(): Promise<HealthMetrics> {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~((100 * idle) / total);

    return new HealthMetrics(MetricType.CPU_USAGE, usage, {
      source: "os",
      cores: cpus.length,
    });
  }

  /**
   * Get memory usage percentage
   */
  private async collectMemoryUsage(): Promise<HealthMetrics> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercentage = (usedMemory / totalMemory) * 100;

    return new HealthMetrics(MetricType.MEMORY_USAGE, usagePercentage, {
      source: "os",
      totalMB: Math.round(totalMemory / 1024 / 1024),
      usedMB: Math.round(usedMemory / 1024 / 1024),
      freeMB: Math.round(freeMemory / 1024 / 1024),
    });
  }

  /**
   * Get disk usage percentage
   */
  private async collectDiskUsage(): Promise<HealthMetrics> {
    // Use actual disk usage check in production
    // For now, using mock data
    const diskUsage = Math.random() * 30 + 40; // 40-70%

    return new HealthMetrics(MetricType.DISK_USAGE, diskUsage, {
      source: "filesystem",
    });
  }

  /**
   * Get active database connections
   */
  private async collectActiveConnections(): Promise<HealthMetrics> {
    try {
      const result = await this.dataSource.query(`
        SELECT count(*) as active_connections
        FROM pg_stat_activity
        WHERE state = 'active'
      `);

      const count = parseInt(result[0]?.active_connections || 0);

      return new HealthMetrics(MetricType.ACTIVE_CONNECTIONS, count, {
        source: "postgresql",
      });
    } catch (error) {
      return new HealthMetrics(MetricType.ACTIVE_CONNECTIONS, 0, {
        source: "postgresql",
        error: error.message,
      });
    }
  }

  /**
   * Get latest metrics from cache
   */
  async getLatestMetrics(): Promise<HealthMetrics[]> {
    const cached = await this.cacheManager.get<HealthMetrics[]>(
      "health:latest_metrics",
    );
    if (cached) {
      return cached;
    }

    // Fetch from database
    const entities = await this.healthMetricRepository.find({
      where: {},
      order: { recordedAt: "DESC" },
      take: Object.keys(MetricType).length,
    });

    return entities.map(
      (entity) =>
        new HealthMetrics(
          entity.metricType,
          Number(entity.value),
          entity.metadata,
          entity.recordedAt,
        ),
    );
  }

  /**
   * Get metric history
   */
  async getMetricHistory(
    metricType: MetricType,
    startDate: Date,
    endDate: Date,
  ): Promise<HealthMetrics[]> {
    const entities = await this.healthMetricRepository.find({
      where: {
        metricType,
      },
      order: { recordedAt: "ASC" },
    });

    const filtered = entities.filter(
      (e) => e.recordedAt >= startDate && e.recordedAt <= endDate,
    );

    return filtered.map(
      (entity) =>
        new HealthMetrics(
          entity.metricType,
          Number(entity.value),
          entity.metadata,
          entity.recordedAt,
        ),
    );
  }

  /**
   * Get overall system status
   */
  async getSystemStatus(): Promise<HealthStatus> {
    const metrics = await this.getLatestMetrics();

    const criticalCount = metrics.filter(
      (m) => m.getHealthStatus() === HealthStatus.CRITICAL,
    ).length;
    const degradedCount = metrics.filter(
      (m) => m.getHealthStatus() === HealthStatus.DEGRADED,
    ).length;

    if (criticalCount > 0) {
      return HealthStatus.CRITICAL;
    } else if (degradedCount > 0) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }

  /**
   * Cleanup old metrics (retention: 90 days)
   */
  async cleanupOldMetrics(): Promise<number> {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - 90);

    const result = await this.healthMetricRepository
      .createQueryBuilder()
      .delete()
      .where("recorded_at < :retentionDate", { retentionDate })
      .execute();

    return result.affected || 0;
  }
}
