import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../users/domain/user";

/**
 * Roles Decorator
 * Marks a route as requiring specific roles
 */
export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
