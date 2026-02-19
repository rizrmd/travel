import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsArray, IsEnum } from "class-validator";
import { DiagnosticCheckType } from "../domain/diagnostic-result";

export class AutoFixRequestDto {
  @ApiProperty({ description: "Tenant ID" })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: "Check types to auto-fix", type: [String] })
  @IsArray()
  @IsEnum(DiagnosticCheckType, { each: true })
  checkTypes: DiagnosticCheckType[];
}

export class AutoFixResultDto {
  @ApiProperty({ description: "Check type" })
  checkType: DiagnosticCheckType;

  @ApiProperty({ description: "Fix successful" })
  success: boolean;

  @ApiProperty({ description: "Message" })
  message: string;

  @ApiProperty({ description: "Actions taken", type: [String] })
  actionsTaken: string[];
}
