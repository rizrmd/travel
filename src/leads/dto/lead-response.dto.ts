import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LeadStatus, LeadSource } from "../domain/lead";

/**
 * Epic 10, Story 10.5: Lead Response DTO
 */
export class LeadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiPropertyOptional()
  landingPageId: string | null;

  @ApiProperty()
  agentId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  preferredDepartureMonth: string | null;

  @ApiPropertyOptional()
  message: string | null;

  @ApiProperty({ enum: LeadStatus })
  status: LeadStatus;

  @ApiProperty({ enum: LeadSource })
  source: LeadSource;

  @ApiPropertyOptional()
  utmSource: string | null;

  @ApiPropertyOptional()
  utmMedium: string | null;

  @ApiPropertyOptional()
  utmCampaign: string | null;

  @ApiPropertyOptional()
  convertedToJamaahId: string | null;

  @ApiPropertyOptional()
  assignedToAgentId: string | null;

  @ApiPropertyOptional()
  lastContactedAt: Date | null;

  @ApiPropertyOptional()
  convertedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: "Days since lead was created" })
  daysSinceCreated: number;

  @ApiProperty({ description: "Whether this is a hot lead (< 24 hours)" })
  isHotLead: boolean;
}

export class LeadListResponseDto {
  @ApiProperty({ type: [LeadResponseDto] })
  data: LeadResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
