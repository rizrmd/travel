import { ApiProperty } from "@nestjs/swagger";

export class OAuthClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty({ description: "Only shown on creation", required: false })
  clientSecret?: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  redirectUris: string[];

  @ApiProperty()
  scopes: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
