import { IsEnum, IsOptional, IsUUID, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { LandingPageStatus, TemplateType } from "../domain/landing-page";

/**
 * Epic 10, Story 10.2: Landing Page Query DTO
 */
export class LandingPageQueryDto {
  @ApiPropertyOptional({ enum: LandingPageStatus })
  @IsEnum(LandingPageStatus)
  @IsOptional()
  status?: LandingPageStatus;

  @ApiPropertyOptional({ enum: TemplateType })
  @IsEnum(TemplateType)
  @IsOptional()
  templateId?: TemplateType;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  agentId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  packageId?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}
