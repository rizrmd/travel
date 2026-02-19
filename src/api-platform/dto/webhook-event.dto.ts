import { ApiProperty } from "@nestjs/swagger";

export class WebhookEventDto {
  @ApiProperty({ example: "payment.confirmed" })
  event: string;

  @ApiProperty({ example: "2025-12-23T10:30:00Z" })
  timestamp: string;

  @ApiProperty({
    example: {
      id: "uuid",
      amount: 5000000,
      payment_method: "transfer_bank",
    },
  })
  data: any;
}
