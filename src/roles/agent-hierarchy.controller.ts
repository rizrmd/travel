import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AgentHierarchyService } from "./agent-hierarchy.service";
import { AssignAgentHierarchyDto } from "./dto/assign-agent-hierarchy.dto";
import { AgentHierarchyResponseDto } from "./dto/agent-hierarchy-response.dto";

/**
 * Agent Hierarchy Controller
 *
 * Manages agent hierarchy assignments and retrieval.
 *
 * Endpoints:
 * - POST /api/v1/agents/:id/hierarchy - Assign agent to upline
 * - GET /api/v1/agents/:id/hierarchy - Get agent's complete hierarchy
 * - DELETE /api/v1/agents/:id/hierarchy - Remove agent from hierarchy
 *
 * Authorization:
 * - Requires authentication via JWT
 * - Only agency_owner and super_admin can manage hierarchies
 * - All operations enforce tenant isolation
 */
@ApiTags("agent-hierarchy")
@ApiBearerAuth()
@Controller("agents")
export class AgentHierarchyController {
  constructor(private readonly agentHierarchyService: AgentHierarchyService) {}

  /**
   * Assign an agent to a hierarchy under an upline
   *
   * Business Rules:
   * - Agent and upline must belong to same tenant
   * - Maximum 3 levels of hierarchy
   * - No circular references allowed
   * - Agent cannot already have an upline
   *
   * @param agentId - The agent to assign
   * @param dto - Assignment details (uplineId)
   * @param req - Express request with user context
   * @returns Created hierarchy relationship
   */
  @Post(":id/hierarchy")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Assign agent to hierarchy",
    description:
      "Assign an agent under an upline in the agent hierarchy structure",
  })
  @ApiParam({
    name: "id",
    description: "Agent user ID",
    type: "string",
    format: "uuid",
  })
  @ApiResponse({
    status: 201,
    description: "Agent successfully assigned to hierarchy",
    type: AgentHierarchyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Invalid request - circular reference, max level exceeded, or agent already has upline",
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden - cross-tenant assignment or insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Agent or upline not found",
  })
  async assignToHierarchy(
    @Param("id") agentId: string,
    @Body() dto: AssignAgentHierarchyDto,
    @Request() req: any,
  ): Promise<AgentHierarchyResponseDto> {
    const tenantId = req.user.tenantId;
    const assignedById = req.user.id;

    const hierarchy = await this.agentHierarchyService.assignToHierarchy(
      agentId,
      dto.uplineId,
      tenantId,
      assignedById,
    );

    return this.mapToResponse(hierarchy);
  }

  /**
   * Get the complete hierarchy for an agent
   *
   * Returns both upline chain (ancestors) and downline tree (descendants).
   * Data is cached for 1 hour for performance.
   *
   * @param agentId - The agent ID
   * @param req - Express request with user context
   * @returns Complete hierarchy information
   */
  @Get(":id/hierarchy")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get agent hierarchy",
    description:
      "Retrieve complete hierarchy including upline chain and downline tree for an agent",
  })
  @ApiParam({
    name: "id",
    description: "Agent user ID",
    type: "string",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Hierarchy retrieved successfully",
    schema: {
      type: "object",
      properties: {
        agent: { type: "string", format: "uuid" },
        level: {
          type: "number",
          description: "Agent level (0=root, 1-3=downline)",
        },
        uplineChain: {
          type: "array",
          items: { $ref: "#/components/schemas/AgentHierarchyResponseDto" },
        },
        downlineTree: {
          type: "array",
          items: { $ref: "#/components/schemas/AgentHierarchyResponseDto" },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - cannot access hierarchy from different tenant",
  })
  @ApiResponse({
    status: 404,
    description: "Agent not found",
  })
  async getAgentHierarchy(
    @Param("id") agentId: string,
    @Request() req: any,
  ): Promise<{
    agent: string;
    level: number;
    uplineChain: AgentHierarchyResponseDto[];
    downlineTree: AgentHierarchyResponseDto[];
  }> {
    const tenantId = req.user.tenantId;

    const hierarchy = await this.agentHierarchyService.getAgentHierarchy(
      agentId,
      tenantId,
    );

    return {
      agent: hierarchy.agent,
      level: hierarchy.level,
      uplineChain: hierarchy.uplineChain.map((h) => this.mapToResponse(h)),
      downlineTree: hierarchy.downlineTree.map((h) => this.mapToResponse(h)),
    };
  }

  /**
   * Remove an agent from hierarchy
   *
   * Performs soft delete to maintain audit trail.
   * Downline agents are not automatically removed - they maintain their structure.
   *
   * @param agentId - The agent to remove
   * @param req - Express request with user context
   */
  @Delete(":id/hierarchy")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Remove agent from hierarchy",
    description: "Remove an agent from their upline hierarchy (soft delete)",
  })
  @ApiParam({
    name: "id",
    description: "Agent user ID",
    type: "string",
    format: "uuid",
  })
  @ApiResponse({
    status: 204,
    description: "Agent successfully removed from hierarchy",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Agent hierarchy not found",
  })
  async removeFromHierarchy(
    @Param("id") agentId: string,
    @Request() req: any,
  ): Promise<void> {
    const tenantId = req.user.tenantId;

    await this.agentHierarchyService.removeFromHierarchy(agentId, tenantId);
  }

  /**
   * Map domain model to API response DTO
   */
  private mapToResponse(hierarchy: any): AgentHierarchyResponseDto {
    return {
      id: hierarchy.id,
      agentId: hierarchy.agentId,
      uplineId: hierarchy.uplineId,
      level: hierarchy.level,
      assignedById: hierarchy.assignedById,
      assignedAt: hierarchy.assignedAt,
      createdAt: hierarchy.createdAt,
      updatedAt: hierarchy.updatedAt,
    };
  }
}
