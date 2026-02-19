import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsUUID, IsDateString } from "class-validator";
import { AnomalyType, AnomalySeverity, AnomalyStatus } from "../domain/anomaly";

export class AnomalyListQueryDto {
  @ApiPropertyOptional({ description: "Filter by tenant ID" })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({
    description: "Filter by anomaly type",
    enum: AnomalyType,
  })
  @IsOptional()
  @IsEnum(AnomalyType)
  anomalyType?: AnomalyType;

  @ApiPropertyOptional({
    description: "Filter by severity",
    enum: AnomalySeverity,
  })
  @IsOptional()
  @IsEnum(AnomalySeverity)
  severity?: AnomalySeverity;

  @ApiPropertyOptional({ description: "Filter by status", enum: AnomalyStatus })
  @IsOptional()
  @IsEnum(AnomalyStatus)
  status?: AnomalyStatus;

  @ApiPropertyOptional({ description: "Start date" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: "End date" })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
