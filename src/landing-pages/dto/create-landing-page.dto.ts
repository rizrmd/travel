import {
  IsUUID,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  TemplateType,
  LandingPageCustomizations,
} from "../domain/landing-page";

/**
 * Epic 10, Story 10.2: Create Landing Page DTO
 */

export class LandingPageCustomizationsDto
  implements Partial<LandingPageCustomizations>
{
  @ApiPropertyOptional({ example: "#3B82F6" })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color",
  })
  primaryColor?: string;

  @ApiPropertyOptional({ example: "#10B981" })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  secondaryColor?: string;

  @ApiPropertyOptional({ example: "#F59E0B" })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  accentColor?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  profilePhoto?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  agentName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  tagline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  whatsappNumber?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  tiktokUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  introText?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  introVideoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  ogImageUrl?: string;
}

export class CreateLandingPageDto {
  @ApiProperty({ description: "Package ID to create landing page for" })
  @IsUUID()
  packageId: string;

  @ApiProperty({
    enum: TemplateType,
    description: "Template type",
    default: TemplateType.MODERN,
  })
  @IsEnum(TemplateType)
  @IsOptional()
  templateId?: TemplateType;

  @ApiPropertyOptional({
    description: "Custom slug (auto-generated if not provided)",
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with hyphens only",
  })
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({ description: "Customization options" })
  @IsOptional()
  @ValidateNested()
  @Type(() => LandingPageCustomizationsDto)
  customizations?: LandingPageCustomizationsDto;
}
