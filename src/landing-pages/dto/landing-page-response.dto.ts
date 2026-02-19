import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  TemplateType,
  LandingPageStatus,
  LandingPageCustomizations,
} from "../domain/landing-page";

/**
 * Epic 10, Story 10.2: Landing Page Response DTO
 */
export class LandingPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  agentId: string;

  @ApiProperty()
  packageId: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: TemplateType })
  templateId: TemplateType;

  @ApiProperty()
  customizations: LandingPageCustomizations;

  @ApiProperty({ enum: LandingPageStatus })
  status: LandingPageStatus;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  leadsCount: number;

  @ApiProperty({ description: "Conversion rate (percentage)" })
  conversionRate: number;

  @ApiPropertyOptional()
  publishedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: "Full public URL" })
  url: string;
}

export class LandingPageListResponseDto {
  @ApiProperty({ type: [LandingPageResponseDto] })
  data: LandingPageResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
