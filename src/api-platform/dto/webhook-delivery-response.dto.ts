import { ApiProperty } from "@nestjs/swagger";

export class WebhookDeliveryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  httpStatus?: number;

  @ApiProperty({ required: false })
  responseBody?: string;

  @ApiProperty()
  attemptCount: number;

  @ApiProperty({ required: false })
  nextRetryAt?: Date;

  @ApiProperty({ required: false })
  deliveredAt?: Date;

  @ApiProperty()
  createdAt: Date;
}
