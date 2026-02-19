import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { WebhookDeliveryService } from "../services/webhook-delivery.service";

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  constructor(
    private readonly webhookDeliveryService: WebhookDeliveryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const signature = request.headers["x-webhook-signature"];
    const timestamp = request.headers["x-webhook-timestamp"];
    const secret = request.webhookSecret; // Should be set by caller

    if (!signature || !timestamp || !secret) {
      throw new UnauthorizedException("Invalid webhook signature headers");
    }

    // Check timestamp (prevent replay attacks - allow 5 minutes)
    const now = Date.now();
    const requestTime = parseInt(timestamp);

    if (Math.abs(now - requestTime) > 300000) {
      throw new UnauthorizedException("Webhook timestamp too old");
    }

    // Verify signature
    const isValid = this.webhookDeliveryService.verifySignature(
      request.body,
      signature,
      secret,
    );

    if (!isValid) {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    return true;
  }
}
