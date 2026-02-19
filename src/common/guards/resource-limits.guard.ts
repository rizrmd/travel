import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ResourceMonitorService } from "../../tenants/services/resource-monitor.service";

export enum ResourceType {
  CONCURRENT_USERS = "concurrent_users",
  JAMAAH = "jamaah",
  AGENTS = "agents",
  PACKAGES = "packages",
}

/**
 * Resource Limits Guard
 * Enforces resource limits per tenant
 *
 * Usage:
 * @CheckResourceLimits(ResourceType.JAMAAH)
 * @Post('jamaah')
 * createJamaah() {
 *   // ...
 * }
 */
@Injectable()
export class ResourceLimitsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private resourceMonitor: ResourceMonitorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.get<ResourceType>(
      "resourceType",
      context.getHandler(),
    );

    if (!resourceType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    if (!tenantId) {
      throw new ForbiddenException("Tenant context not found");
    }

    switch (resourceType) {
      case ResourceType.CONCURRENT_USERS:
        const canAddUser =
          await this.resourceMonitor.canAddConcurrentUser(tenantId);
        if (!canAddUser) {
          throw new ForbiddenException(
            "Batas maksimum pengguna aktif tercapai. Upgrade paket untuk menambah kapasitas.",
          );
        }
        break;

      case ResourceType.JAMAAH:
        const canCreateJamaah =
          await this.resourceMonitor.canCreateJamaah(tenantId);
        if (!canCreateJamaah) {
          throw new ForbiddenException(
            "Kuota jamaah bulan ini sudah tercapai. Upgrade paket untuk menambah kuota.",
          );
        }
        break;

      // TODO: Add other resource type checks
      default:
        break;
    }

    return true;
  }
}
