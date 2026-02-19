import { IsString, IsNotEmpty, IsIn, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OAuthTokenRequestDto {
  @ApiProperty({ example: "client_credentials" })
  @IsString()
  @IsNotEmpty()
  @IsIn(["client_credentials"])
  grant_type: string;

  @ApiProperty({ example: "cli_abc123..." })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ example: "sec_xyz789..." })
  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty({ example: "jamaah:read payments:write", required: false })
  @IsString()
  @IsOptional()
  scope?: string;
}
