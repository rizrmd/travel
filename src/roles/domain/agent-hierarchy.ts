/**
 * Agent Hierarchy Domain Entity
 *
 * Represents the hierarchical relationship between agents in the travel umroh system.
 * Supports multi-level agent structures (Agent → Affiliate → Sub-Affiliate) with
 * a maximum depth of 3 levels to maintain manageable commission calculations.
 */

export class AgentHierarchy {
  /**
   * Unique identifier for the hierarchy relationship
   */
  id: string;

  /**
   * Tenant ID for multi-tenant isolation
   */
  tenantId: string;

  /**
   * Agent user ID (downline agent)
   */
  agentId: string;

  /**
   * Upline agent user ID (parent in hierarchy)
   */
  uplineId: string;

  /**
   * Hierarchy level (1 = direct, 2 = second level, 3 = third level)
   */
  level: number;

  /**
   * User ID of the person who assigned this hierarchy relationship
   */
  assignedById: string;

  /**
   * Timestamp when the hierarchy relationship was created
   */
  assignedAt: Date;

  /**
   * Timestamp for soft delete (audit trail compliance)
   */
  deletedAt?: Date | null;

  /**
   * Timestamp when the record was created
   */
  createdAt: Date;

  /**
   * Timestamp when the record was last updated
   */
  updatedAt: Date;

  constructor(partial: Partial<AgentHierarchy>) {
    Object.assign(this, partial);
  }

  /**
   * Check if this hierarchy relationship is active (not soft deleted)
   */
  isActive(): boolean {
    return !this.deletedAt;
  }

  /**
   * Check if the agent is at maximum allowed level
   */
  isMaxLevel(): boolean {
    return this.level >= 3;
  }

  /**
   * Get the next level number for a child agent
   */
  getNextLevel(): number {
    return this.level + 1;
  }
}
