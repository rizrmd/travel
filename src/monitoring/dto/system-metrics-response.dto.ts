import { ApiProperty } from "@nestjs/swagger";
import { MetricType, HealthStatus } from "../domain/health-metrics";

export class MetricDataPointDto {
  @ApiProperty({ description: "Metric value" })
  value: number;

  @ApiProperty({ description: "Timestamp" })
  timestamp: Date;

  @ApiProperty({ description: "Health status", enum: HealthStatus })
  status: HealthStatus;
}

export class SystemMetricsResponseDto {
  @ApiProperty({ description: "Metric type", enum: MetricType })
  metricType: MetricType;

  @ApiProperty({ description: "Current value" })
  currentValue: number;

  @ApiProperty({ description: "Health status", enum: HealthStatus })
  status: HealthStatus;

  @ApiProperty({ description: "Historical data", type: [MetricDataPointDto] })
  history: MetricDataPointDto[];

  @ApiProperty({
    description: "Trend direction",
    enum: ["up", "down", "stable"],
  })
  trend: "up" | "down" | "stable";

  @ApiProperty({ description: "Percentage change" })
  changePercentage: number;
}
