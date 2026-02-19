import { IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TestWebhookDto {
  @ApiProperty({
    example: { test: true, message: "Test webhook" },
    required: false,
  })
  @IsOptional()
  payload?: any;
}
