import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsEnum, IsString, IsEmail, IsOptional } from "class-validator";
import { AlertChannel } from "../infrastructure/persistence/relational/entities/alert.entity";

export class CreateAlertDto {
  @ApiProperty({ description: "Anomaly ID" })
  @IsUUID()
  anomalyId: string;

  @ApiProperty({ description: "Alert channel", enum: AlertChannel })
  @IsEnum(AlertChannel)
  channel: AlertChannel;

  @ApiProperty({ description: "Recipient (email, phone, or webhook URL)" })
  @IsString()
  recipient: string;

  @ApiProperty({ description: "Additional metadata", required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}
