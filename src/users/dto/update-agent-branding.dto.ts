import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  Matches,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ColorScheme, SocialMediaLinks } from "../domain/agent-branding";

/**
 * Epic 10, Story 10.3: Update Agent Branding DTO
 */

export class ColorSchemeDto implements ColorScheme {
  @ApiProperty({ example: "#3B82F6" })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color",
  })
  primary: string;

  @ApiProperty({ example: "#10B981" })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  secondary: string;

  @ApiProperty({ example: "#F59E0B" })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  accent: string;
}

export class SocialMediaLinksDto implements Partial<SocialMediaLinks> {
  @ApiPropertyOptional({ example: "https://facebook.com/agent" })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: "https://instagram.com/agent" })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({ example: "https://tiktok.com/@agent" })
  @IsUrl()
  @IsOptional()
  tiktok?: string;

  @ApiPropertyOptional({ example: "https://linkedin.com/in/agent" })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({ example: "https://youtube.com/@agent" })
  @IsUrl()
  @IsOptional()
  youtube?: string;
}

export class UpdateAgentBrandingDto {
  @ApiPropertyOptional({ description: "Profile photo URL" })
  @IsUrl()
  @IsOptional()
  profilePhoto?: string;

  @ApiPropertyOptional({ description: "Logo URL" })
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiProperty({ description: "Agent display name", example: "Ahmad Fauzi" })
  @IsString()
  @MaxLength(255)
  agentName: string;

  @ApiPropertyOptional({
    description: "Agent tagline",
    example: "Travel Umroh Terpercaya",
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  tagline?: string;

  @ApiProperty({ description: "Phone number", example: "081234567890" })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: "Email address", example: "agent@example.com" })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: "WhatsApp number (E.164 format)",
    example: "+628123456789",
  })
  @IsString()
  @MaxLength(20)
  whatsappNumber: string;

  @ApiProperty({ description: "Color scheme" })
  @ValidateNested()
  @Type(() => ColorSchemeDto)
  colorScheme: ColorSchemeDto;

  @ApiPropertyOptional({ description: "Social media links" })
  @ValidateNested()
  @Type(() => SocialMediaLinksDto)
  @IsOptional()
  socialMediaLinks?: SocialMediaLinksDto;

  @ApiPropertyOptional({ description: "Introduction text" })
  @IsString()
  @IsOptional()
  introText?: string;

  @ApiPropertyOptional({ description: "Introduction video URL" })
  @IsUrl()
  @IsOptional()
  introVideoUrl?: string;
}
