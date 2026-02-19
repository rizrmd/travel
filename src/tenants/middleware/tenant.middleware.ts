import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TenantEntity } from "../entities/tenant.entity";
import { TenantStatus } from "../domain/tenant";

// Extend Express Request to include tenant context
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenant?: TenantEntity;
    }
  }
}

/**
 * Tenant Middleware
 * Extracts tenant from subdomain and sets context for request
 *
 * Subdomain format: {slug}.travelumroh.com
 * Example: berkah-umroh.travelumroh.com -> slug: berkah-umroh
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get hostname from request
      const hostname = req.hostname;

      // Skip tenant resolution for certain paths (health checks, public endpoints)
      const publicPaths = ["/health", "/api/docs", "/api/v1/tenants/register"];
      if (publicPaths.some((path) => req.path.startsWith(path))) {
        return next();
      }

      // Extract tenant slug from hostname
      const slug = this.extractSlugFromHostname(hostname);

      if (!slug) {
        // If no slug found, check if it's admin/super-admin access
        // For super admin, allow access without tenant context
        return next();
      }

      // Find tenant by slug or custom domain
      let tenant = await this.tenantRepository.findOne({
        where: { slug },
      });

      // If not found by slug, try custom domain
      if (!tenant) {
        tenant = await this.tenantRepository.findOne({
          where: { customDomain: hostname },
        });
      }

      if (!tenant) {
        throw new NotFoundException(
          `Tenant tidak ditemukan untuk domain: ${hostname}`,
        );
      }

      // Check if tenant is active
      if (tenant.status !== TenantStatus.ACTIVE) {
        throw new UnauthorizedException(
          `Tenant tidak aktif. Status: ${tenant.status}`,
        );
      }

      // Set tenant context in request
      req.tenantId = tenant.id;
      req.tenant = tenant;

      // Set tenant context for database session (for RLS)
      // This will be picked up by RlsSessionMiddleware
      res.locals.tenantId = tenant.id;

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Extract tenant slug from hostname
   * Examples:
   * - berkah-umroh.travelumroh.com -> berkah-umroh
   * - localhost:3000 -> null (local development)
   * - travelumroh.com -> null (main domain)
   */
  private extractSlugFromHostname(hostname: string): string | null {
    // Remove port if present
    const host = hostname.split(":")[0];

    // Local development
    if (host === "localhost" || host === "127.0.0.1") {
      // For local development, you can set tenant via header or query param
      // Or use a default tenant for testing
      return null;
    }

    // Check if it's a subdomain
    const parts = host.split(".");

    // If it's the main domain (travelumroh.com), no tenant
    if (parts.length <= 2) {
      return null;
    }

    // Extract first part as slug
    const slug = parts[0];

    // Filter out common subdomains that are not tenants
    const systemSubdomains = ["www", "api", "admin", "app", "docs"];
    if (systemSubdomains.includes(slug)) {
      return null;
    }

    return slug;
  }
}
