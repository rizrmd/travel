import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { OAuthService } from "../services/oauth.service";

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(private readonly oauthService: OAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer") {
      throw new UnauthorizedException("Invalid authorization type");
    }

    if (!token) {
      throw new UnauthorizedException("Token missing");
    }

    try {
      const tokenEntity = await this.oauthService.validateToken(token);

      if (!tokenEntity) {
        throw new UnauthorizedException("Invalid token");
      }

      // Attach token info to request
      request.user = {
        tenantId: tokenEntity.tenantId,
        clientId: tokenEntity.clientId,
        scopes: tokenEntity.scopes,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
