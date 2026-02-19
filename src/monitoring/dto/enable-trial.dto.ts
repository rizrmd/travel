import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsEnum, IsInt, Min, IsOptional } from "class-validator";
import { FeatureKey } from "../domain/feature-trial";

export class EnableTrialDto {
  @ApiProperty({ description: "Tenant ID" })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: "Feature key", enum: FeatureKey })
  @IsEnum(FeatureKey)
  featureKey: FeatureKey;

  @ApiPropertyOptional({
    description: "Trial duration in days (uses default if not specified)",
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;
}
