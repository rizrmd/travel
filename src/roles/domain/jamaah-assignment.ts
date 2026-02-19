/**
 * Jamaah Assignment Domain Entity
 *
 * Represents the assignment of a jamaah (pilgrim) to an agent for management.
 * This enables granular data access control where agents can only access
 * jamaah records that are explicitly assigned to them.
 *
 * Business Rules:
 * - One jamaah can be assigned to multiple agents (for team collaboration)
 * - Assignments are tenant-scoped (no cross-tenant access)
 * - Soft delete maintains audit trail
 * - Assignment requires authorization (only agency_owner/admin can assign)
 */

export class JamaahAssignment {
  /**
   * Unique identifier for the assignment
   */
  id: string;

  /**
   * Tenant ID for multi-tenant isolation
   */
  tenantId: string;

  /**
   * Jamaah user ID (the pilgrim being assigned)
   */
  jamaahId: string;

  /**
   * Agent user ID (who will manage this jamaah)
   */
  agentId: string;

  /**
   * User ID of the person who created this assignment
   */
  assignedById: string;

  /**
   * Timestamp when the assignment was created
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

  constructor(partial: Partial<JamaahAssignment>) {
    Object.assign(this, partial);
  }

  /**
   * Check if this assignment is active (not soft deleted)
   */
  isActive(): boolean {
    return !this.deletedAt;
  }

  /**
   * Check if this assignment was made by a specific user
   */
  wasAssignedBy(userId: string): boolean {
    return this.assignedById === userId;
  }

  /**
   * Check if the assignment belongs to a specific agent
   */
  belongsToAgent(agentId: string): boolean {
    return this.agentId === agentId;
  }

  /**
   * Check if the assignment is for a specific jamaah
   */
  isForJamaah(jamaahId: string): boolean {
    return this.jamaahId === jamaahId;
  }
}
