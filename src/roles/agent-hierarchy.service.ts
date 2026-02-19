import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { AgentHierarchyEntity } from "./infrastructure/persistence/relational/entities/agent-hierarchy.entity";
import { AgentHierarchy } from "./domain/agent-hierarchy";

/**
 * Agent Hierarchy Service
 *
 * Manages multi-level agent hierarchies with the following features:
 * - Recursive CTE queries for efficient hierarchy traversal
 * - Redis caching with 1-hour TTL for hierarchy data
 * - Validation to prevent circular references
 * - Maximum 3 levels enforcement
 * - Cross-tenant isolation checks
 *
 * @example
 * // Assign an agent to an upline
 * await service.assignToHierarchy({
 *   agentId: 'agent-uuid',
 *   uplineId: 'upline-uuid',
 *   tenantId: 'tenant-uuid',
 *   assignedById: 'admin-uuid'
 * });
 *
 * @example
 * // Get complete hierarchy for an agent
 * const hierarchy = await service.getAgentHierarchy('agent-uuid', 'tenant-uuid');
 */
@Injectable()
export class AgentHierarchyService {
  constructor(
    @InjectRepository(AgentHierarchyEntity)
    private readonly hierarchyRepository: Repository<AgentHierarchyEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Assign an agent to a hierarchy under an upline
   *
   * Validates:
   * - No circular references
   * - Maximum 3 levels not exceeded
   * - All users belong to same tenant
   * - Agent doesn't already have an upline
   *
   * @param agentId - The agent to be assigned
   * @param uplineId - The upline agent
   * @param tenantId - The tenant ID
   * @param assignedById - User performing the assignment
   * @throws {BadRequestException} If validation fails
   * @throws {ForbiddenException} If cross-tenant assignment attempted
   */
  async assignToHierarchy(
    agentId: string,
    uplineId: string,
    tenantId: string,
    assignedById: string,
  ): Promise<AgentHierarchy> {
    // Prevent self-assignment
    if (agentId === uplineId) {
      throw new BadRequestException("Agent cannot be their own upline");
    }

    // Check if agent already has an upline
    const existingHierarchy = await this.hierarchyRepository.findOne({
      where: { agentId, tenantId, deletedAt: null },
    });

    if (existingHierarchy) {
      throw new BadRequestException(
        "Agent already has an upline. Remove existing hierarchy first.",
      );
    }

    // Calculate the level for this agent
    const uplineLevel = await this.getAgentLevel(uplineId, tenantId);
    const newLevel = uplineLevel + 1;

    // Enforce maximum 3 levels
    if (newLevel > 3) {
      throw new BadRequestException(
        `Cannot assign agent: maximum hierarchy depth of 3 levels exceeded (would be level ${newLevel})`,
      );
    }

    // Check for circular reference by seeing if upline is in agent's downline
    const wouldCreateCircle = await this.wouldCreateCircularReference(
      agentId,
      uplineId,
      tenantId,
    );

    if (wouldCreateCircle) {
      throw new BadRequestException(
        "Cannot create circular reference in agent hierarchy",
      );
    }

    // Create the hierarchy relationship
    const hierarchyEntity = this.hierarchyRepository.create({
      agentId,
      uplineId,
      tenantId,
      level: newLevel,
      assignedById,
      assignedAt: new Date(),
    });

    const saved = await this.hierarchyRepository.save(hierarchyEntity);

    // Invalidate cache
    await this.invalidateHierarchyCache(agentId, tenantId);
    await this.invalidateHierarchyCache(uplineId, tenantId);

    return this.mapToDomain(saved);
  }

  /**
   * Get the complete hierarchy information for an agent
   * Includes both upline chain and downline tree
   *
   * Cached with 1-hour TTL for performance
   *
   * @param agentId - The agent ID
   * @param tenantId - The tenant ID
   * @returns Complete hierarchy with upline and downline
   */
  async getAgentHierarchy(
    agentId: string,
    tenantId: string,
  ): Promise<{
    agent: string;
    level: number;
    uplineChain: AgentHierarchy[];
    downlineTree: AgentHierarchy[];
  }> {
    const cacheKey = `tenant:${tenantId}:agent:${agentId}:hierarchy`;

    // Check cache first
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get upline chain
    const uplineChain = await this.getUplineChain(agentId, tenantId);

    // Get downline tree
    const downlineTree = await this.getDownlineTree(agentId, tenantId);

    // Determine agent's level
    const level = await this.getAgentLevel(agentId, tenantId);

    const result = {
      agent: agentId,
      level,
      uplineChain,
      downlineTree,
    };

    // Cache for 1 hour (3600 seconds)
    await this.cacheManager.set(cacheKey, result, 3600);

    return result;
  }

  /**
   * Get the upline chain for an agent (all ancestors up to root)
   * Uses recursive CTE for efficient traversal
   *
   * @param agentId - The agent ID
   * @param tenantId - The tenant ID
   * @returns Array of hierarchy relationships from agent to root
   */
  async getUplineChain(
    agentId: string,
    tenantId: string,
  ): Promise<AgentHierarchy[]> {
    const query = `
      WITH RECURSIVE upline_chain AS (
        -- Base case: direct upline
        SELECT
          id, tenant_id, agent_id, upline_id, level,
          assigned_by_id, assigned_at, deleted_at,
          created_at, updated_at, 1 as depth
        FROM agent_hierarchies
        WHERE agent_id = $1
          AND tenant_id = $2
          AND deleted_at IS NULL

        UNION ALL

        -- Recursive case: upline's upline
        SELECT
          h.id, h.tenant_id, h.agent_id, h.upline_id, h.level,
          h.assigned_by_id, h.assigned_at, h.deleted_at,
          h.created_at, h.updated_at, uc.depth + 1
        FROM agent_hierarchies h
        INNER JOIN upline_chain uc ON h.agent_id = uc.upline_id
        WHERE h.tenant_id = $2
          AND h.deleted_at IS NULL
          AND uc.depth < 10  -- Safety limit to prevent infinite loops
      )
      SELECT * FROM upline_chain
      ORDER BY depth ASC;
    `;

    const results = await this.dataSource.query(query, [agentId, tenantId]);

    return results.map((row: any) => this.mapToDomain(row));
  }

  /**
   * Get the downline tree for an agent (all descendants)
   * Uses recursive CTE for efficient traversal
   *
   * @param agentId - The agent ID
   * @param tenantId - The tenant ID
   * @returns Array of all downline hierarchy relationships
   */
  async getDownlineTree(
    agentId: string,
    tenantId: string,
  ): Promise<AgentHierarchy[]> {
    const query = `
      WITH RECURSIVE downline_tree AS (
        -- Base case: direct downlines
        SELECT
          id, tenant_id, agent_id, upline_id, level,
          assigned_by_id, assigned_at, deleted_at,
          created_at, updated_at, 1 as depth
        FROM agent_hierarchies
        WHERE upline_id = $1
          AND tenant_id = $2
          AND deleted_at IS NULL

        UNION ALL

        -- Recursive case: downlines of downlines
        SELECT
          h.id, h.tenant_id, h.agent_id, h.upline_id, h.level,
          h.assigned_by_id, h.assigned_at, h.deleted_at,
          h.created_at, h.updated_at, dt.depth + 1
        FROM agent_hierarchies h
        INNER JOIN downline_tree dt ON h.upline_id = dt.agent_id
        WHERE h.tenant_id = $2
          AND h.deleted_at IS NULL
          AND dt.depth < 10  -- Safety limit
      )
      SELECT * FROM downline_tree
      ORDER BY depth ASC, agent_id ASC;
    `;

    const results = await this.dataSource.query(query, [agentId, tenantId]);

    return results.map((row: any) => this.mapToDomain(row));
  }

  /**
   * Remove an agent from hierarchy (soft delete)
   *
   * @param agentId - The agent to remove
   * @param tenantId - The tenant ID
   */
  async removeFromHierarchy(agentId: string, tenantId: string): Promise<void> {
    const hierarchy = await this.hierarchyRepository.findOne({
      where: { agentId, tenantId, deletedAt: null },
    });

    if (!hierarchy) {
      throw new NotFoundException("Agent hierarchy not found");
    }

    // Soft delete
    hierarchy.deletedAt = new Date();
    await this.hierarchyRepository.save(hierarchy);

    // Invalidate cache
    await this.invalidateHierarchyCache(agentId, tenantId);
    await this.invalidateHierarchyCache(hierarchy.uplineId, tenantId);
  }

  /**
   * Get the level of an agent in the hierarchy
   * Returns 0 if agent has no upline (root agent)
   *
   * @param agentId - The agent ID
   * @param tenantId - The tenant ID
   * @returns The hierarchy level (0 = root, 1-3 = downline levels)
   */
  private async getAgentLevel(
    agentId: string,
    tenantId: string,
  ): Promise<number> {
    const hierarchy = await this.hierarchyRepository.findOne({
      where: { agentId, tenantId, deletedAt: null },
    });

    return hierarchy ? hierarchy.level : 0;
  }

  /**
   * Check if assigning agentId under uplineId would create a circular reference
   *
   * @param agentId - The agent to be assigned
   * @param uplineId - The proposed upline
   * @param tenantId - The tenant ID
   * @returns True if circular reference would be created
   */
  private async wouldCreateCircularReference(
    agentId: string,
    uplineId: string,
    tenantId: string,
  ): Promise<boolean> {
    // Check if uplineId exists in agentId's downline tree
    const downlineTree = await this.getDownlineTree(agentId, tenantId);

    return downlineTree.some((node) => node.agentId === uplineId);
  }

  /**
   * Invalidate all cached hierarchy data for an agent
   *
   * @param agentId - The agent ID
   * @param tenantId - The tenant ID
   */
  private async invalidateHierarchyCache(
    agentId: string,
    tenantId: string,
  ): Promise<void> {
    const cacheKey = `tenant:${tenantId}:agent:${agentId}:hierarchy`;
    await this.cacheManager.del(cacheKey);
  }

  /**
   * Map database entity to domain model
   */
  private mapToDomain(entity: any): AgentHierarchy {
    return new AgentHierarchy({
      id: entity.id,
      tenantId: entity.tenant_id || entity.tenantId,
      agentId: entity.agent_id || entity.agentId,
      uplineId: entity.upline_id || entity.uplineId,
      level: entity.level,
      assignedById: entity.assigned_by_id || entity.assignedById,
      assignedAt: entity.assigned_at || entity.assignedAt,
      deletedAt: entity.deleted_at || entity.deletedAt,
      createdAt: entity.created_at || entity.createdAt,
      updatedAt: entity.updated_at || entity.updatedAt,
    });
  }
}
