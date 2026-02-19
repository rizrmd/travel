import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { ApiRequestLogEntity } from "../infrastructure/persistence/relational/entities/api-request-log.entity";

export interface UsageStats {
  totalRequests: number;
  avgResponseTime: number;
  errorCount: number;
  errorRate: number;
  requestsByDay: { date: string; count: number }[];
}

export interface EndpointStats {
  endpoint: string;
  method: string;
  count: number;
  avgResponseTime: number;
}

@Injectable()
export class ApiAnalyticsService {
  constructor(
    @InjectRepository(ApiRequestLogEntity)
    private readonly apiRequestLogRepository: Repository<ApiRequestLogEntity>,
  ) {}

  async getUsageStats(
    apiKeyId: string,
    tenantId: string,
    period: "day" | "week" | "month" = "month",
  ): Promise<UsageStats> {
    const since = this.calculateSinceDate(period);

    const stats = await this.apiRequestLogRepository
      .createQueryBuilder("log")
      .select("COUNT(*)", "total_requests")
      .addSelect("AVG(log.response_time_ms)", "avg_response_time")
      .addSelect(
        "COUNT(CASE WHEN log.status_code >= 400 THEN 1 END)",
        "error_count",
      )
      .where("log.api_key_id = :apiKeyId", { apiKeyId })
      .andWhere("log.tenant_id = :tenantId", { tenantId })
      .andWhere("log.created_at >= :since", { since })
      .getRawOne();

    const totalRequests = parseInt(stats.total_requests) || 0;
    const errorCount = parseInt(stats.error_count) || 0;

    // Get requests by day
    const requestsByDay = await this.apiRequestLogRepository
      .createQueryBuilder("log")
      .select("DATE(log.created_at)", "date")
      .addSelect("COUNT(*)", "count")
      .where("log.api_key_id = :apiKeyId", { apiKeyId })
      .andWhere("log.tenant_id = :tenantId", { tenantId })
      .andWhere("log.created_at >= :since", { since })
      .groupBy("DATE(log.created_at)")
      .orderBy("DATE(log.created_at)", "ASC")
      .getRawMany();

    return {
      totalRequests,
      avgResponseTime: parseFloat(stats.avg_response_time) || 0,
      errorCount,
      errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
      requestsByDay: requestsByDay.map((r) => ({
        date: r.date,
        count: parseInt(r.count),
      })),
    };
  }

  async getPopularEndpoints(
    apiKeyId: string,
    tenantId: string,
    limit: number = 10,
  ): Promise<EndpointStats[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await this.apiRequestLogRepository
      .createQueryBuilder("log")
      .select("log.endpoint", "endpoint")
      .addSelect("log.method", "method")
      .addSelect("COUNT(*)", "count")
      .addSelect("AVG(log.response_time_ms)", "avg_response_time")
      .where("log.api_key_id = :apiKeyId", { apiKeyId })
      .andWhere("log.tenant_id = :tenantId", { tenantId })
      .andWhere("log.created_at >= :since", { since: thirtyDaysAgo })
      .groupBy("log.endpoint, log.method")
      .orderBy("COUNT(*)", "DESC")
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      endpoint: r.endpoint,
      method: r.method,
      count: parseInt(r.count),
      avgResponseTime: parseFloat(r.avg_response_time),
    }));
  }

  async getErrorRate(
    apiKeyId: string,
    tenantId: string,
    period: "day" | "week" | "month" = "month",
  ): Promise<number> {
    const since = this.calculateSinceDate(period);

    const stats = await this.apiRequestLogRepository
      .createQueryBuilder("log")
      .select("COUNT(*)", "total")
      .addSelect("COUNT(CASE WHEN log.status_code >= 400 THEN 1 END)", "errors")
      .where("log.api_key_id = :apiKeyId", { apiKeyId })
      .andWhere("log.tenant_id = :tenantId", { tenantId })
      .andWhere("log.created_at >= :since", { since })
      .getRawOne();

    const total = parseInt(stats.total) || 0;
    const errors = parseInt(stats.errors) || 0;

    return total > 0 ? (errors / total) * 100 : 0;
  }

  async exportUsageLogs(
    apiKeyId: string,
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    const logs = await this.apiRequestLogRepository.find({
      where: {
        apiKeyId,
        tenantId,
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: "DESC" },
    });

    return logs.map((log) => ({
      timestamp: log.createdAt,
      endpoint: log.endpoint,
      method: log.method,
      statusCode: log.statusCode,
      responseTime: log.responseTimeMs,
      ipAddress: log.ipAddress,
    }));
  }

  private calculateSinceDate(period: "day" | "week" | "month"): Date {
    const date = new Date();

    switch (period) {
      case "day":
        date.setDate(date.getDate() - 1);
        break;
      case "week":
        date.setDate(date.getDate() - 7);
        break;
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
    }

    return date;
  }
}
