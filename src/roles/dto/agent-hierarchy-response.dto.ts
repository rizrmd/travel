import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for agent hierarchy relationships
 */
export class AgentHierarchyResponseDto {
  @ApiProperty({
    description: "Hierarchy relationship ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: "string",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Agent user ID (downline)",
    example: "550e8400-e29b-41d4-a716-446655440001",
    type: "string",
    format: "uuid",
  })
  agentId: string;

  @ApiProperty({
    description: "Upline agent user ID",
    example: "550e8400-e29b-41d4-a716-446655440002",
    type: "string",
    format: "uuid",
  })
  uplineId: string;

  @ApiProperty({
    description: "Hierarchy level (1=direct, 2=second level, 3=third level)",
    example: 1,
    minimum: 1,
    maximum: 3,
  })
  level: number;

  @ApiProperty({
    description: "User ID who assigned this hierarchy",
    example: "550e8400-e29b-41d4-a716-446655440003",
    type: "string",
    format: "uuid",
  })
  assignedById: string;

  @ApiProperty({
    description: "Timestamp when hierarchy was assigned",
    example: "2025-12-22T10:00:00Z",
    type: "string",
    format: "date-time",
  })
  assignedAt: Date;

  @ApiProperty({
    description: "Timestamp when record was created",
    example: "2025-12-22T10:00:00Z",
    type: "string",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp when record was last updated",
    example: "2025-12-22T10:00:00Z",
    type: "string",
    format: "date-time",
  })
  updatedAt: Date;
}
