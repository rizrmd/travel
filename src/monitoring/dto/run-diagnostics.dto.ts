import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsArray, IsEnum, IsOptional } from "class-validator";
import { DiagnosticCheckType } from "../domain/diagnostic-result";

export class RunDiagnosticsDto {
  @ApiProperty({ description: "Tenant ID (null for system-wide)" })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: "Specific checks to run (empty for all)",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DiagnosticCheckType, { each: true })
  checkTypes?: DiagnosticCheckType[];
}
