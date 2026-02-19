import { ApiProperty } from "@nestjs/swagger";
import { ApiKeyEnvironment } from "../domain/api-key";

export class ApiKeyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: "Only shown on creation", required: false })
  key?: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ApiKeyEnvironment })
  environment: ApiKeyEnvironment;

  @ApiProperty()
  scopes: string[];

  @ApiProperty()
  rateLimit: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  lastUsedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  expiresAt?: Date;
}
