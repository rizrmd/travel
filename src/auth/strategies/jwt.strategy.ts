import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService, JwtPayload } from "../auth.service";
import { UserEntity } from "../../users/entities/user.entity";

/**
 * JWT Strategy
 * Validates JWT tokens and attaches user to request
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  /**
   * Validate JWT payload and return user
   * This is called automatically by Passport after token verification
   */
  async validate(payload: JwtPayload): Promise<UserEntity> {
    try {
      const user = await this.authService.validateUser(payload);
      return user;
    } catch (error) {
      throw new UnauthorizedException("Token tidak valid");
    }
  }
}
