import { ApiProperty } from "@nestjs/swagger";

export class ErrorLogResponseDto {
  @ApiProperty({ description: "Log ID" })
  id: string;

  @ApiProperty({ description: "Log level" })
  level: string;

  @ApiProperty({ description: "Message" })
  message: string;

  @ApiProperty({ description: "Tenant ID" })
  tenantId?: string;

  @ApiProperty({ description: "User ID" })
  userId?: string;

  @ApiProperty({ description: "Error stack trace" })
  stack?: string;

  @ApiProperty({ description: "Metadata" })
  metadata: Record<string, any>;

  @ApiProperty({ description: "Timestamp" })
  timestamp: Date;

  @ApiProperty({ description: "Sentry event ID" })
  sentryEventId?: string;
}
