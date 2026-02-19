import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { AgentHierarchyEntity } from "./infrastructure/persistence/relational/entities/agent-hierarchy.entity";
import { AgentHierarchyService } from "./agent-hierarchy.service";
import { AgentHierarchyController } from "./agent-hierarchy.controller";

/**
 * Roles Module
 *
 * Provides role-based access control and agent hierarchy management.
 *
 * Features:
 * - Multi-level agent hierarchy (up to 3 levels)
 * - Redis caching for hierarchy data (1-hour TTL)
 * - Recursive CTE queries for efficient hierarchy traversal
 * - Tenant isolation enforcement
 * - Circular reference prevention
 *
 * Entities:
 * - AgentHierarchyEntity: Manages agent-upline relationships
 *
 * Services:
 * - AgentHierarchyService: Business logic for hierarchy management
 *
 * Controllers:
 * - AgentHierarchyController: REST API endpoints for hierarchy operations
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AgentHierarchyEntity]),
    CacheModule.register(),
  ],
  controllers: [AgentHierarchyController],
  providers: [AgentHierarchyService],
  exports: [AgentHierarchyService],
})
export class RolesModule {}
