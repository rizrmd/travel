import { ApiProperty } from "@nestjs/swagger";
import { WebhookEvent } from "../domain/webhook-subscription";

export class WebhookSubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ enum: WebhookEvent, isArray: true })
  events: WebhookEvent[];

  @ApiProperty({ description: "Secret for signature verification" })
  secret: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
