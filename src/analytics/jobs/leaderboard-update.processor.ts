/**
 * Epic 11, Story 11.5: Leaderboard Update Background Job
 * Updates leaderboard cache every hour for performance
 */

import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { LeaderboardService } from "../services/leaderboard.service";
import {
  LeaderboardMetric,
  LeaderboardPeriod,
} from "../domain/agent-performance";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";

@Injectable()
export class LeaderboardUpdateProcessor {
  private readonly logger = new Logger(LeaderboardUpdateProcessor.name);

  constructor(
    private readonly leaderboardService: LeaderboardService,
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
  ) {}

  /**
   * Update leaderboard cache every hour
   * Cron: 0 * * * * (every hour at minute 0)
   */
  @Cron("0 * * * *", {
    name: "leaderboard-update",
    timeZone: "Asia/Jakarta",
  })
  async handleLeaderboardUpdate(): Promise<void> {
    this.logger.log("Starting leaderboard cache update...");

    try {
      // Get all unique tenants
      const tenantIds = await this.getActiveTenants();

      this.logger.log(
        `Updating leaderboards for ${tenantIds.length} tenant(s)`,
      );

      // Update leaderboards for each tenant
      for (const tenantId of tenantIds) {
        await this.updateLeaderboardsForTenant(tenantId);
      }

      this.logger.log("Leaderboard cache update completed");
    } catch (error) {
      this.logger.error("Failed to update leaderboard cache", error.stack);
    }
  }

  /**
   * Update all leaderboard combinations for a tenant
   */
  private async updateLeaderboardsForTenant(tenantId: string): Promise<void> {
    const metrics = Object.values(LeaderboardMetric);
    const periods = Object.values(LeaderboardPeriod);

    const promises: Promise<any>[] = [];

    // Pre-warm cache for all metric/period combinations
    metrics.forEach((metric) => {
      periods.forEach((period) => {
        promises.push(
          this.leaderboardService
            .getLeaderboard(tenantId, metric, period)
            .catch((error) => {
              this.logger.error(
                `Failed to update leaderboard for ${tenantId} - ${metric} - ${period}`,
                error.stack,
              );
            }),
        );
      });
    });

    await Promise.all(promises);

    this.logger.log(`Leaderboard cache warmed for tenant ${tenantId}`);
  }

  /**
   * Get all active tenants (tenants with jamaah data)
   */
  private async getActiveTenants(): Promise<string[]> {
    const results = await this.jamaahRepository
      .createQueryBuilder("jamaah")
      .select("DISTINCT jamaah.tenant_id", "tenant_id")
      .getRawMany();

    return results.map((r) => r.tenant_id);
  }

  /**
   * Manual trigger for specific tenant and metric
   */
  async triggerManualUpdate(
    tenantId: string,
    metric?: LeaderboardMetric,
    period?: LeaderboardPeriod,
  ): Promise<void> {
    this.logger.log(`Manual leaderboard update for tenant ${tenantId}`);

    if (metric && period) {
      // Update specific combination
      await this.leaderboardService.getLeaderboard(tenantId, metric, period);
    } else {
      // Update all combinations
      await this.updateLeaderboardsForTenant(tenantId);
    }

    this.logger.log("Manual leaderboard update completed");
  }

  /**
   * Invalidate and refresh leaderboard cache for a tenant
   */
  async refreshLeaderboard(tenantId: string): Promise<void> {
    this.logger.log(`Refreshing leaderboard cache for tenant ${tenantId}`);

    // Invalidate existing cache
    await this.leaderboardService.invalidateCache(tenantId);

    // Rebuild cache
    await this.updateLeaderboardsForTenant(tenantId);

    this.logger.log("Leaderboard cache refreshed");
  }
}
