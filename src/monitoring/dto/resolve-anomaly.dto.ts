import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional } from "class-validator";
import { AnomalyStatus } from "../domain/anomaly";

export class ResolveAnomalyDto {
  @ApiProperty({ description: "Resolution notes" })
  @IsString()
  notes: string;

  @ApiPropertyOptional({
    description: "Mark as false positive",
    default: false,
  })
  @IsOptional()
  falsePositive?: boolean;
}
