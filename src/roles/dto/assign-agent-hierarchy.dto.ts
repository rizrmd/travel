import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";

/**
 * DTO for assigning an agent to a hierarchy
 */
export class AssignAgentHierarchyDto {
  @ApiProperty({
    description: "UUID of the upline agent",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: "string",
    format: "uuid",
  })
  @IsUUID("4")
  @IsNotEmpty()
  uplineId: string;
}
