import { ApiProperty } from "@nestjs/swagger";
import { HealthStatus } from "../domain/health-metrics";

export class HealthDashboardResponseDto {
  @ApiProperty({
    description: "Overall system status",
    enum: HealthStatus,
    example: HealthStatus.HEALTHY,
  })
  overallStatus: HealthStatus;

  @ApiProperty({ description: "Total number of tenants", example: 50 })
  totalTenants: number;

  @ApiProperty({
    description: "Total active users across all tenants",
    example: 1250,
  })
  totalActiveUsers: number;

  @ApiProperty({
    description: "Total revenue across all tenants",
    example: 500000000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: "System-wide error rate (errors/hour)",
    example: 15,
  })
  errorRate: number;

  @ApiProperty({ description: "API latency p95 in milliseconds", example: 450 })
  apiLatencyP95: number;

  @ApiProperty({
    description: "Average database query time in milliseconds",
    example: 25,
  })
  dbQueryTimeAvg: number;

  @ApiProperty({
    description: "Redis cache hit rate percentage",
    example: 85.5,
  })
  redisHitRate: number;

  @ApiProperty({ description: "Current queue length (jobs)", example: 42 })
  queueLength: number;

  @ApiProperty({ description: "CPU usage percentage", example: 45.2 })
  cpuUsage: number;

  @ApiProperty({ description: "Memory usage percentage", example: 62.8 })
  memoryUsage: number;

  @ApiProperty({ description: "Number of active anomalies", example: 3 })
  activeAnomalies: number;

  @ApiProperty({ description: "Number of active trials", example: 12 })
  activeTrials: number;

  @ApiProperty({
    description: "Timestamp of data",
    example: "2025-12-23T10:00:00Z",
  })
  timestamp: Date;
}
