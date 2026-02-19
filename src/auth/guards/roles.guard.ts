import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../users/domain/user";

/**
 * Roles Guard
 * Enforces role-based access control
 *
 * Usage:
 * @Roles(UserRole.AGENCY_OWNER, UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin')
 * adminOnly() {
 *   return 'Admin content';
 * }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Super admin has access to everything
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}
