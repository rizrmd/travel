import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnomalyDetectionEntity } from "../infrastructure/persistence/relational/entities/anomaly-detection.entity";
import {
  Anomaly,
  AnomalyType,
  AnomalySeverity,
  AnomalyStatus,
} from "../domain/anomaly";
import { TenantMetricsService } from "./tenant-metrics.service";
import { AlertService } from "./alert.service";
import { Logger } from "../../config/winston.config";

@Injectable()
export class AnomalyDetectorService {
  private readonly logger = new Logger("AnomalyDetectorService");

  constructor(
    @InjectRepository(AnomalyDetectionEntity)
    private readonly anomalyRepository: Repository<AnomalyDetectionEntity>,
    private readonly tenantMetricsService: TenantMetricsService,
    private readonly alertService: AlertService,
  ) {}

  async runDetection(): Promise<void> {
    this.logger.info("Starting anomaly detection");

    const tenants = await this.getAllActiveTenants();

    for (const tenantId of tenants) {
      await this.detectActivityDrop(tenantId);
      await this.detectErrorSpike(tenantId);
      await this.detectApiUsageSpike(tenantId);
      await this.detectRevenueDrop(tenantId);
      await this.detectUserChurn(tenantId);
    }

    this.logger.info("Anomaly detection completed");
  }

  async detectActivityDrop(tenantId: string): Promise<Anomaly | null> {
    const today = await this.tenantMetricsService.getActivityScore(tenantId);
    const yesterday = await this.getYesterdayActivityScore(tenantId);

    if (yesterday.value === 0) return null;

    const dropPercentage =
      ((yesterday.value - today.value) / yesterday.value) * 100;

    if (dropPercentage > 50) {
      const severity = Anomaly.determineSeverity(
        AnomalyType.ACTIVITY_DROP,
        dropPercentage,
        50,
      );
      const metadata = {
        currentValue: today.value,
        previousValue: yesterday.value,
        changePercentage: dropPercentage,
      };

      const anomaly = new Anomaly(
        tenantId,
        AnomalyType.ACTIVITY_DROP,
        severity,
        Anomaly.generateDescription(
          AnomalyType.ACTIVITY_DROP,
          tenantId,
          metadata,
        ),
        metadata,
      );

      await this.saveAnomaly(anomaly);
      return anomaly;
    }

    return null;
  }

  async detectErrorSpike(tenantId: string): Promise<Anomaly | null> {
    const current = await this.tenantMetricsService.getErrorCount(tenantId);
    const previous = await this.getPreviousHourErrorCount(tenantId);

    if (previous.value === 0 || current.value < 10) return null;

    const spikePercentage =
      ((current.value - previous.value) / previous.value) * 100;

    if (spikePercentage > 100) {
      const severity = Anomaly.determineSeverity(
        AnomalyType.ERROR_SPIKE,
        spikePercentage,
        100,
      );
      const metadata = {
        currentValue: current.value,
        previousValue: previous.value,
        changePercentage: spikePercentage,
      };

      const anomaly = new Anomaly(
        tenantId,
        AnomalyType.ERROR_SPIKE,
        severity,
        Anomaly.generateDescription(
          AnomalyType.ERROR_SPIKE,
          tenantId,
          metadata,
        ),
        metadata,
      );

      await this.saveAnomaly(anomaly);
      return anomaly;
    }

    return null;
  }

  async detectApiUsageSpike(tenantId: string): Promise<Anomaly | null> {
    const current = await this.tenantMetricsService.getApiCalls(tenantId);
    const previous = await this.getPreviousHourApiCalls(tenantId);

    if (previous.value === 0) return null;

    const spikePercentage =
      ((current.value - previous.value) / previous.value) * 100;

    if (spikePercentage > 200) {
      const severity = Anomaly.determineSeverity(
        AnomalyType.API_USAGE_SPIKE,
        spikePercentage,
        200,
      );
      const metadata = {
        currentValue: current.value,
        previousValue: previous.value,
        changePercentage: spikePercentage,
      };

      const anomaly = new Anomaly(
        tenantId,
        AnomalyType.API_USAGE_SPIKE,
        severity,
        Anomaly.generateDescription(
          AnomalyType.API_USAGE_SPIKE,
          tenantId,
          metadata,
        ),
        metadata,
      );

      await this.saveAnomaly(anomaly);
      return anomaly;
    }

    return null;
  }

  async detectRevenueDrop(tenantId: string): Promise<Anomaly | null> {
    const thisMonth = await this.tenantMetricsService.getRevenue(
      tenantId,
      "month",
    );
    const lastMonth = await this.getLastMonthRevenue(tenantId);

    if (lastMonth.value === 0) return null;

    const dropPercentage =
      ((lastMonth.value - thisMonth.value) / lastMonth.value) * 100;

    if (dropPercentage > 20) {
      const severity = Anomaly.determineSeverity(
        AnomalyType.REVENUE_DROP,
        dropPercentage,
        20,
      );
      const metadata = {
        currentValue: thisMonth.value,
        previousValue: lastMonth.value,
        changePercentage: dropPercentage,
      };

      const anomaly = new Anomaly(
        tenantId,
        AnomalyType.REVENUE_DROP,
        severity,
        Anomaly.generateDescription(
          AnomalyType.REVENUE_DROP,
          tenantId,
          metadata,
        ),
        metadata,
      );

      await this.saveAnomaly(anomaly);
      return anomaly;
    }

    return null;
  }

  async detectUserChurn(tenantId: string): Promise<Anomaly | null> {
    // Check users inactive for 7 days
    const inactiveCount = Math.floor(Math.random() * 10); // Mock
    const totalUsers = await this.tenantMetricsService.getUserCount(tenantId);

    if (totalUsers.value === 0) return null;

    const churnPercentage = (inactiveCount / totalUsers.value) * 100;

    if (churnPercentage > 15) {
      const severity = Anomaly.determineSeverity(
        AnomalyType.USER_CHURN,
        churnPercentage,
        15,
      );
      const metadata = {
        currentValue: inactiveCount,
        previousValue: totalUsers.value,
        changePercentage: churnPercentage,
      };

      const anomaly = new Anomaly(
        tenantId,
        AnomalyType.USER_CHURN,
        severity,
        Anomaly.generateDescription(AnomalyType.USER_CHURN, tenantId, metadata),
        metadata,
      );

      await this.saveAnomaly(anomaly);
      return anomaly;
    }

    return null;
  }

  private async saveAnomaly(anomaly: Anomaly): Promise<void> {
    const entity = new AnomalyDetectionEntity();
    entity.tenantId = anomaly.tenantId;
    entity.anomalyType = anomaly.anomalyType;
    entity.severity = anomaly.severity;
    entity.description = anomaly.description;
    entity.status = anomaly.status;
    entity.metadata = anomaly.metadata;
    entity.detectedAt = anomaly.detectedAt;

    await this.anomalyRepository.save(entity);

    if (anomaly.shouldTriggerAlert()) {
      await this.alertService.sendAlertsForAnomaly(anomaly);
    }
  }

  private async getAllActiveTenants(): Promise<string[]> {
    return ["tenant-1", "tenant-2"]; // Mock
  }

  private async getYesterdayActivityScore(tenantId: string): Promise<any> {
    return { value: 75 }; // Mock
  }

  private async getPreviousHourErrorCount(tenantId: string): Promise<any> {
    return { value: 10 }; // Mock
  }

  private async getPreviousHourApiCalls(tenantId: string): Promise<any> {
    return { value: 1000 }; // Mock
  }

  private async getLastMonthRevenue(tenantId: string): Promise<any> {
    return { value: 50000000 }; // Mock
  }
}
