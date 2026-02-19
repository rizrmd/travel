import { ApiProperty } from "@nestjs/swagger";

export class LogStatsResponseDto {
  @ApiProperty({ description: "Total logs" })
  totalLogs: number;

  @ApiProperty({ description: "Error count" })
  errorCount: number;

  @ApiProperty({ description: "Warning count" })
  warningCount: number;

  @ApiProperty({ description: "Info count" })
  infoCount: number;

  @ApiProperty({ description: "Debug count" })
  debugCount: number;

  @ApiProperty({ description: "Error rate (errors/hour)" })
  errorRate: number;

  @ApiProperty({ description: "Top error messages", type: "object" })
  topErrors: Record<string, number>;

  @ApiProperty({ description: "Errors by tenant", type: "object" })
  errorsByTenant: Record<string, number>;

  @ApiProperty({ description: "Time period" })
  period: string;
}
