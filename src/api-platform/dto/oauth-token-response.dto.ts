import { ApiProperty } from "@nestjs/swagger";

export class OAuthTokenResponseDto {
  @ApiProperty({ example: "tok_def456..." })
  access_token: string;

  @ApiProperty({ example: "Bearer" })
  token_type: string;

  @ApiProperty({ example: 3600, description: "Seconds until token expires" })
  expires_in: number;

  @ApiProperty({ example: "jamaah:read payments:write" })
  scope: string;
}
