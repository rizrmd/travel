import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";

/**
 * RLS Session Middleware
 *
 * Sets PostgreSQL session variables from JWT token for Row-Level Security (RLS) policies.
 * This middleware extracts tenant, user, and role information from the authenticated
 * request and sets them as PostgreSQL session variables that RLS policies can use.
 *
 * Session Variables Set:
 * - app.tenant_id: Current user's tenant ID
 * - app.user_id: Current authenticated user ID
 * - app.role: Current user's primary role
 *
 * These variables are then used by RLS policies to enforce:
 * - Tenant isolation (users only see data from their tenant)
 * - Role-based access (agents only see assigned jamaah)
 * - Audit trail (track who performs operations)
 *
 * @example
 * // In AppModule, apply this middleware to all routes
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer
 *       .apply(RlsSessionMiddleware)
 *       .forRoutes('*');
 *   }
 * }
 *
 * @example
 * // RLS policy using these session variables
 * CREATE POLICY tenant_isolation ON jamaah_assignments
 *   FOR ALL
 *   USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
 */
@Injectable()
export class RlsSessionMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Execute the middleware
   *
   * Sets PostgreSQL session variables for the current request.
   * If user is not authenticated, sets empty/null values.
   *
   * @param req - Express request object (expects req.user from JWT auth)
   * @param res - Express response object
   * @param next - Next middleware function
   */
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Extract user information from JWT (set by AuthGuard)
    const user = (req as any).user;

    if (user) {
      try {
        // Get a query runner from the data source
        const queryRunner = this.dataSource.createQueryRunner();

        try {
          // Set session variables for RLS policies
          await queryRunner.query(
            `SELECT set_config('app.tenant_id', $1, false)`,
            [user.tenantId || ""],
          );

          await queryRunner.query(
            `SELECT set_config('app.user_id', $1, false)`,
            [user.id || ""],
          );

          await queryRunner.query(`SELECT set_config('app.role', $1, false)`, [
            this.getPrimaryRole(user.roles) || "jamaah",
          ]);

          // Also set email for audit purposes (optional)
          await queryRunner.query(
            `SELECT set_config('app.user_email', $1, false)`,
            [user.email || ""],
          );
        } finally {
          // Release the query runner
          await queryRunner.release();
        }
      } catch (error) {
        // Log error but don't block the request
        console.error("Failed to set RLS session variables:", error);
      }
    } else {
      // For unauthenticated requests, set empty session variables
      try {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
          await queryRunner.query(
            `SELECT set_config('app.tenant_id', '', false)`,
          );
          await queryRunner.query(
            `SELECT set_config('app.user_id', '', false)`,
          );
          await queryRunner.query(
            `SELECT set_config('app.role', 'anonymous', false)`,
          );
          await queryRunner.query(
            `SELECT set_config('app.user_email', '', false)`,
          );
        } finally {
          await queryRunner.release();
        }
      } catch (error) {
        console.error("Failed to clear RLS session variables:", error);
      }
    }

    next();
  }

  /**
   * Get the primary role from user's roles array
   *
   * Priority order:
   * 1. super_admin
   * 2. agency_owner
   * 3. admin
   * 4. agent
   * 5. affiliate
   * 6. jamaah
   * 7. family
   *
   * @param roles - Array of role names
   * @returns Primary role name
   */
  private getPrimaryRole(roles: string[] | undefined): string {
    if (!roles || roles.length === 0) {
      return "jamaah"; // Default role
    }

    const rolePriority = [
      "super_admin",
      "agency_owner",
      "admin",
      "agent",
      "affiliate",
      "jamaah",
      "family",
    ];

    for (const role of rolePriority) {
      if (roles.includes(role)) {
        return role;
      }
    }

    return roles[0] || "jamaah";
  }
}

/**
 * Extended Request interface to include user information
 * Use this in controllers that need to access authenticated user data
 */
export interface RequestWithUser extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    roles: string[];
  };
}
