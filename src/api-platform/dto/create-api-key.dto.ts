import {
  IsString,
  IsEnum,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiKeyEnvironment } from "../domain/api-key";

export class CreateApiKeyDto {
  @ApiProperty({ example: "Production API Key" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    enum: ApiKeyEnvironment,
    example: ApiKeyEnvironment.PRODUCTION,
  })
  @IsEnum(ApiKeyEnvironment)
  @IsNotEmpty()
  environment: ApiKeyEnvironment;

  @ApiProperty({ example: ["jamaah:read", "payments:write"] })
  @IsArray()
  @IsNotEmpty()
  scopes: string[];

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  rateLimit?: number;

  @ApiProperty({ example: "2025-12-31T23:59:59Z", required: false })
  @IsOptional()
  expiresAt?: Date;
}
