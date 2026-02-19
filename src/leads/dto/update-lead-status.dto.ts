import { IsEnum, IsUUID, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LeadStatus } from "../domain/lead";

/**
 * Epic 10, Story 10.5: Update Lead Status DTO
 */
export class UpdateLeadStatusDto {
  @ApiProperty({ enum: LeadStatus, description: "New status for the lead" })
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @ApiPropertyOptional({
    description: "Jamaah ID if converting lead to jamaah",
  })
  @IsUUID()
  @IsOptional()
  convertedToJamaahId?: string;
}

export class AssignLeadDto {
  @ApiProperty({ description: "Agent ID to assign lead to" })
  @IsUUID()
  agentId: string;
}
