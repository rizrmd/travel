import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsDateString } from "class-validator";
import { MetricType } from "../domain/health-metrics";

export class SystemMetricsQueryDto {
  @ApiPropertyOptional({
    description: "Metric type to filter",
    enum: MetricType,
  })
  @IsOptional()
  @IsEnum(MetricType)
  metricType?: MetricType;

  @ApiPropertyOptional({
    description: "Start date for metrics",
    example: "2025-12-20T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "End date for metrics",
    example: "2025-12-23T23:59:59Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
