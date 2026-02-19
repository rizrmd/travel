import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { TenantTier } from "../domain/tenant";

/**
 * DTO for tenant registration
 */
export class CreateTenantDto {
  @ApiProperty({
    description: "Travel agency name",
    example: "PT Berkah Umroh Jaya",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: "Owner email address (must be unique)",
    example: "owner@berkahtravel.com",
  })
  @IsNotEmpty()
  @IsEmail()
  ownerEmail: string;

  @ApiProperty({
    description: "Owner phone number",
    example: "+628123456789",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be in valid format",
  })
  ownerPhone: string;

  @ApiProperty({
    description: "Agency address",
    example: "Jl. Sudirman No. 123, Jakarta",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "Agency owner full name",
    example: "Ahmad Santoso",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  ownerFullName: string;

  @ApiProperty({
    description: "Initial password for agency owner",
    example: "SecurePassword123!",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain uppercase, lowercase, number and special character",
  })
  ownerPassword: string;

  @ApiProperty({
    description: "Subscription tier",
    enum: TenantTier,
    default: TenantTier.STARTER,
  })
  @IsOptional()
  @IsEnum(TenantTier)
  tier?: TenantTier;
}
