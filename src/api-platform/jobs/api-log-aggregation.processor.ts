import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ApiRequestLogEntity } from "../infrastructure/persistence/relational/entities/api-request-log.entity";

interface AggregatedStats {
  totalRequests: number;
  avgResponseTime: number;
  errorCount: number;
  requestsByEndpoint: Record<string, number>;
}

@Injectable()
export class ApiLogAggregationProcessor {
  private readonly logger = new Logger(ApiLogAggregationProcessor.name);

  constructor(
    @InjectRepository(ApiRequestLogEntity)
    private readonly apiRequestLogRepository: Repository<ApiRequestLogEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async aggregateApiLogs(): Promise<void> {
    this.logger.log("Starting API log aggregation");

    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      // Aggregate by API key
      const results = await this.apiRequestLogRepository
        .createQueryBuilder("log")
        .select("log.api_key_id", "apiKeyId")
        .addSelect("log.tenant_id", "tenantId")
        .addSelect("COUNT(*)", "totalRequests")
        .addSelect("AVG(log.response_time_ms)", "avgResponseTime")
        .addSelect(
          "COUNT(CASE WHEN log.status_code >= 400 THEN 1 END)",
          "errorCount",
        )
        .where("log.created_at >= :since", { since: oneHourAgo })
        .groupBy("log.api_key_id, log.tenant_id")
        .getRawMany();

      // Cache aggregated stats
      for (const result of results) {
        const cacheKey = `api_stats:${result.tenantId}:${result.apiKeyId}:hourly`;

        const stats: AggregatedStats = {
          totalRequests: parseInt(result.totalRequests),
          avgResponseTime: parseFloat(result.avgResponseTime),
          errorCount: parseInt(result.errorCount),
          requestsByEndpoint: {},
        };

        await this.cacheManager.set(cacheKey, stats, 86400); // Cache for 24 hours
      }

      this.logger.log(`Aggregated API logs for ${results.length} API keys`);

      // Clean up old logs (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleteResult = await this.apiRequestLogRepository.delete({
        createdAt: LessThan(thirtyDaysAgo) as any,
      });

      this.logger.log(`Deleted ${deleteResult.affected} old API request logs`);
    } catch (error) {
      this.logger.error("Error aggregating API logs", error);
    }
  }
}

function LessThan(thirtyDaysAgo: Date): any {
  return { _type: "lessThan", _value: thirtyDaysAgo };
}
