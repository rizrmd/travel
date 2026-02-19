import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID, IsEnum, IsBoolean } from "class-validator";
import { FeatureKey, TrialStatus } from "../domain/feature-trial";
import { Type } from "class-transformer";

export class TrialListQueryDto {
  @ApiPropertyOptional({ description: "Filter by tenant ID" })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({
    description: "Filter by feature key",
    enum: FeatureKey,
  })
  @IsOptional()
  @IsEnum(FeatureKey)
  featureKey?: FeatureKey;

  @ApiPropertyOptional({ description: "Filter by status", enum: TrialStatus })
  @IsOptional()
  @IsEnum(TrialStatus)
  status?: TrialStatus;

  @ApiPropertyOptional({
    description: "Only expiring soon (3 days)",
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  expiringSoon?: boolean;
}
