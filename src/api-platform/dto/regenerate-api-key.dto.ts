import { IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegenerateApiKeyDto {
  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  rateLimit?: number;

  @ApiProperty({ example: "2025-12-31T23:59:59Z", required: false })
  @IsOptional()
  expiresAt?: Date;
}
