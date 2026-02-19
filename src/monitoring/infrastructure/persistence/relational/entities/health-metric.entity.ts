import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { MetricType } from "../../../../domain/health-metrics";

/**
 * Health Metric Entity
 *
 * Stores system-wide health metrics (NO RLS - platform-wide monitoring)
 * Retention: 90 days
 */
@Entity("health_metrics")
@Index(["metricType", "recordedAt"])
export class HealthMetricEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 50,
    name: "metric_type",
  })
  metricType: MetricType;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  value: number;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  metadata: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    name: "recorded_at",
  })
  recordedAt: Date;
}
