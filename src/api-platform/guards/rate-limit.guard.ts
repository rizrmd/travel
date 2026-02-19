import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { RateLimiterService } from "../services/rate-limiter.service";

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get API key from request (set by ApiKeyGuard or OAuthGuard)
    const apiKey = request.apiKey?.id || request.user?.clientId;

    if (!apiKey) {
      // No API key, skip rate limiting
      return true;
    }

    const rateLimit = await this.rateLimiterService.incrementCounter(apiKey);

    // Set rate limit headers
    const headers = rateLimit.getHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.setHeader(key, value);
    });

    if (rateLimit.isExceeded()) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: "Rate limit exceeded",
          error: "Too Many Requests",
          retryAfter: rateLimit.getRemainingSeconds(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
