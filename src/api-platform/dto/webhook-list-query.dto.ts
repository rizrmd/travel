import { IsOptional, IsBoolean, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { WebhookEvent } from "../domain/webhook-subscription";

export class WebhookListQueryDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ enum: WebhookEvent, required: false })
  @IsEnum(WebhookEvent)
  @IsOptional()
  event?: WebhookEvent;
}
