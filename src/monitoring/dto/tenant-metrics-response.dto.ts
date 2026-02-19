import { ApiProperty } from "@nestjs/swagger";

export class TenantMetricsResponseDto {
  @ApiProperty({ description: "Tenant ID" })
  tenantId: string;

  @ApiProperty({ description: "Tenant name" })
  tenantName: string;

  @ApiProperty({ description: "Number of users" })
  userCount: number;

  @ApiProperty({ description: "Number of jamaah" })
  jamaahCount: number;

  @ApiProperty({ description: "Revenue in IDR" })
  revenue: number;

  @ApiProperty({ description: "Activity score (0-100)" })
  activityScore: number;

  @ApiProperty({ description: "Error count" })
  errorCount: number;

  @ApiProperty({ description: "API calls" })
  apiCalls: number;

  @ApiProperty({ description: "Storage used in MB" })
  storageUsed: number;

  @ApiProperty({ description: "Active sessions" })
  activeSessions: number;

  @ApiProperty({
    description: "Activity level",
    enum: ["high", "medium", "low", "inactive"],
  })
  activityLevel: string;

  @ApiProperty({
    description: "Health color",
    enum: ["green", "yellow", "red"],
  })
  healthColor: string;

  @ApiProperty({ description: "Last updated" })
  lastUpdated: Date;
}
