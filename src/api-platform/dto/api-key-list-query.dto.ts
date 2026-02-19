import { IsEnum, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ApiKeyEnvironment } from "../domain/api-key";

export class ApiKeyListQueryDto {
  @ApiProperty({ enum: ApiKeyEnvironment, required: false })
  @IsEnum(ApiKeyEnvironment)
  @IsOptional()
  environment?: ApiKeyEnvironment;

  @ApiProperty({ required: false })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}
