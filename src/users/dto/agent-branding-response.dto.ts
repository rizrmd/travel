import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ColorScheme, SocialMediaLinks } from "../domain/agent-branding";

/**
 * Epic 10, Story 10.3: Agent Branding Response DTO
 */
export class AgentBrandingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  tenantId: string;

  @ApiPropertyOptional()
  profilePhoto: string | null;

  @ApiPropertyOptional()
  logo: string | null;

  @ApiProperty()
  agentName: string;

  @ApiPropertyOptional()
  tagline: string | null;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  whatsappNumber: string;

  @ApiProperty()
  colorScheme: ColorScheme;

  @ApiProperty()
  socialMediaLinks: SocialMediaLinks;

  @ApiPropertyOptional()
  introText: string | null;

  @ApiPropertyOptional()
  introVideoUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: "Profile completion percentage" })
  completionPercentage: number;

  @ApiProperty({ description: "WhatsApp URL" })
  whatsappUrl: string;
}
