import { ApiProperty } from "@nestjs/swagger";
import {
  AlertChannel,
  AlertStatus,
} from "../infrastructure/persistence/relational/entities/alert.entity";

export class AlertResponseDto {
  @ApiProperty({ description: "Alert ID" })
  id: string;

  @ApiProperty({ description: "Anomaly ID" })
  anomalyId: string;

  @ApiProperty({ description: "Alert channel", enum: AlertChannel })
  channel: AlertChannel;

  @ApiProperty({ description: "Recipient" })
  recipient: string;

  @ApiProperty({ description: "Status", enum: AlertStatus })
  status: AlertStatus;

  @ApiProperty({ description: "Metadata" })
  metadata: Record<string, any>;

  @ApiProperty({ description: "Sent at" })
  sentAt: Date | null;

  @ApiProperty({ description: "Acknowledged at" })
  acknowledgedAt: Date | null;

  @ApiProperty({ description: "Created at" })
  createdAt: Date;
}
