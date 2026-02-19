import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOAuthClientDto {
  @ApiProperty({ example: "My ERP Integration" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: "Integration with company ERP system",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ["https://example.com/callback"], required: false })
  @IsArray()
  @IsOptional()
  redirectUris?: string[];

  @ApiProperty({ example: ["jamaah:read", "payments:write"] })
  @IsArray()
  @IsNotEmpty()
  scopes: string[];
}
