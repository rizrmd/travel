import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsObject } from "class-validator";
import { TenantStatus, TenantTier, ResourceLimits } from "../domain/tenant";

export class UpdateTenantDto {
  @ApiProperty({ description: "Agency name", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Tenant status",
    enum: TenantStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiProperty({
    description: "Tenant tier",
    enum: TenantTier,
    required: false,
  })
  @IsOptional()
  @IsEnum(TenantTier)
  tier?: TenantTier;

  @ApiProperty({ description: "Resource limits", required: false })
  @IsOptional()
  @IsObject()
  resourceLimits?: ResourceLimits;
}

export class UpdateDomainDto {
  @ApiProperty({
    description: "Custom domain name",
    example: "www.berkahtravel.com",
  })
  @IsString()
  customDomain: string;
}

export class FilterTenantsDto {
  @ApiProperty({
    description: "Filter by status",
    enum: TenantStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiProperty({ description: "Search by name or slug", required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: "Page number", default: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: "Items per page", default: 20, required: false })
  @IsOptional()
  limit?: number;
}
