import {
  IsString,
  IsEmail,
  IsUUID,
  IsOptional,
  MaxLength,
  Matches,
  IsIP,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Epic 10, Story 10.5: Create Lead DTO
 */
export class CreateLeadDto {
  @ApiPropertyOptional({
    description: "Landing page ID (if from landing page)",
  })
  @IsUUID()
  @IsOptional()
  landingPageId?: string;

  @ApiProperty({ description: "Full name", example: "Budi Santoso" })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ description: "Email address", example: "budi@example.com" })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: "Phone number (Indonesian format)",
    example: "081234567890",
  })
  @IsString()
  @MaxLength(20)
  @Matches(/^(\+?62|0)8\d{8,11}$/, {
    message: "Phone must be a valid Indonesian number",
  })
  phone: string;

  @ApiPropertyOptional({
    description: "Preferred departure month",
    example: "Maret 2025",
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  preferredDepartureMonth?: string;

  @ApiPropertyOptional({ description: "Additional message from prospect" })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({
    description: "UTM source parameter",
    example: "facebook",
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmSource?: string;

  @ApiPropertyOptional({
    description: "UTM medium parameter",
    example: "social",
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmMedium?: string;

  @ApiPropertyOptional({
    description: "UTM campaign parameter",
    example: "umroh-ekonomis",
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  utmCampaign?: string;

  @ApiPropertyOptional({
    description: "IP address (auto-captured if not provided)",
  })
  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: "User agent (auto-captured if not provided)",
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  userAgent?: string;
}
