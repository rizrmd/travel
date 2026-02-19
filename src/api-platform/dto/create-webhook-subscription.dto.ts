import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsUrl,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { WebhookEvent } from "../domain/webhook-subscription";

export class CreateWebhookSubscriptionDto {
  @ApiProperty({ example: "https://example.com/webhooks" })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url: string;

  @ApiProperty({
    example: ["payment.confirmed", "jamaah.created"],
    enum: WebhookEvent,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  events: WebhookEvent[];
}
