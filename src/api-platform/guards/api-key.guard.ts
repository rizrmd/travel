import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiKeyService } from "../services/api-key.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("API key missing");
    }

    try {
      const keyEntity = await this.apiKeyService.validateKey(apiKey);

      if (!keyEntity) {
        throw new UnauthorizedException("Invalid API key");
      }

      // Track usage
      await this.apiKeyService.trackUsage(keyEntity.id);

      // Attach API key info to request
      request.apiKey = {
        id: keyEntity.id,
        tenantId: keyEntity.tenantId,
        userId: keyEntity.userId,
        environment: keyEntity.environment,
        scopes: keyEntity.scopes,
        rateLimit: keyEntity.rateLimit,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired API key");
    }
  }
}
