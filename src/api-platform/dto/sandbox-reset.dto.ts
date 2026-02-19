import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SandboxResetDto {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  generateSampleData?: boolean;
}
