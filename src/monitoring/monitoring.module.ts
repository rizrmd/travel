import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

// Entities
import { HealthMetricEntity } from "./infrastructure/persistence/relational/entities/health-metric.entity";
import { TenantMetricEntity } from "./infrastructure/persistence/relational/entities/tenant-metric.entity";
import { AnomalyDetectionEntity } from "./infrastructure/persistence/relational/entities/anomaly-detection.entity";
import { AlertEntity } from "./infrastructure/persistence/relational/entities/alert.entity";
import { DiagnosticResultEntity } from "./infrastructure/persistence/relational/entities/diagnostic-result.entity";
import { FeatureTrialEntity } from "./infrastructure/persistence/relational/entities/feature-trial.entity";

// Services
import { HealthMetricsService } from "./services/health-metrics.service";
import { TenantMetricsService } from "./services/tenant-metrics.service";
import { AnomalyDetectorService } from "./services/anomaly-detector.service";
import { AlertService } from "./services/alert.service";
import { FeatureTrialService } from "./services/feature-trial.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HealthMetricEntity,
      TenantMetricEntity,
      AnomalyDetectionEntity,
      AlertEntity,
      DiagnosticResultEntity,
      FeatureTrialEntity,
    ]),
    CacheModule.register({
      ttl: 300, // 5 minutes default
      max: 100,
    }),
  ],
  providers: [
    HealthMetricsService,
    TenantMetricsService,
    AnomalyDetectorService,
    AlertService,
    FeatureTrialService,
  ],
  exports: [
    HealthMetricsService,
    TenantMetricsService,
    AnomalyDetectorService,
    AlertService,
    FeatureTrialService,
  ],
})
export class MonitoringModule {}
