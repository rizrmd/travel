/**
 * Epic 5, Story 5.7: Service Mode DTO
 * Request DTO for changing service mode
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ServiceMode } from "../domain/jamaah";

export class ChangeServiceModeDto {
  @ApiProperty({
    description: "New service mode",
    enum: ServiceMode,
    example: ServiceMode.SELF_SERVICE,
  })
  @IsEnum(ServiceMode)
  mode: ServiceMode;

  @ApiPropertyOptional({
    description: "Reason for changing service mode",
    example: "Jamaah requested self-service access",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * Service mode analytics response DTO
 */
export class ServiceModeAnalyticsDto {
  @ApiProperty({
    description: "Total jamaah count",
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: "Agent-assisted count",
    example: 60,
  })
  agentAssisted: number;

  @ApiProperty({
    description: "Self-service count",
    example: 25,
  })
  selfService: number;

  @ApiProperty({
    description: "Hybrid count",
    example: 15,
  })
  hybrid: number;

  @ApiProperty({
    description: "Agent-assisted percentage",
    example: 60,
  })
  agentAssistedPercentage: number;

  @ApiProperty({
    description: "Self-service percentage",
    example: 25,
  })
  selfServicePercentage: number;

  @ApiProperty({
    description: "Hybrid percentage",
    example: 15,
  })
  hybridPercentage: number;

  @ApiProperty({
    description: "Average completion time by mode (in days)",
    example: {
      agent_assisted: 14,
      self_service: 10,
      hybrid: 12,
    },
  })
  averageCompletionTime: {
    agent_assisted: number;
    self_service: number;
    hybrid: number;
  };
}
