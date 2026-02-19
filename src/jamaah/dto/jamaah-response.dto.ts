/**
 * Epic 5, Story 5.1 & 5.2: Jamaah Response DTO
 * Response DTO for jamaah with status indicators
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  JamaahStatus,
  ServiceMode,
  DocumentStatus,
  PaymentStatus,
  ApprovalStatus,
  OverallStatus,
  StatusIndicators,
  VisualCue,
} from "../domain/jamaah";

export class JamaahResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Tenant ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  tenantId: string;

  @ApiProperty({
    description: "Agent ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  agentId: string;

  @ApiPropertyOptional({
    description: "Agent name",
    example: "Budi Santoso",
  })
  agentName?: string;

  @ApiProperty({
    description: "Package ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  packageId: string;

  @ApiPropertyOptional({
    description: "Package name",
    example: "Umroh Ramadhan 2025",
  })
  packageName?: string;

  @ApiPropertyOptional({
    description: "Departure date from package",
    example: "2025-03-15",
  })
  departureDate?: string;

  @ApiProperty({
    description: "Full name",
    example: "Ahmad Zainuddin",
  })
  fullName: string;

  @ApiPropertyOptional({
    description: "Email address",
    example: "ahmad@example.com",
  })
  email?: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+628123456789",
  })
  phone?: string;

  @ApiPropertyOptional({
    description: "Date of birth",
    example: "1990-01-15",
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: "Gender",
    example: "male",
  })
  gender?: string;

  @ApiPropertyOptional({
    description: "Address",
    example: "Jl. Merdeka No. 123, Jakarta",
  })
  address?: string;

  @ApiProperty({
    description: "Jamaah status",
    example: JamaahStatus.INTERESTED,
    enum: JamaahStatus,
  })
  status: JamaahStatus;

  @ApiProperty({
    description: "Document status",
    example: DocumentStatus.INCOMPLETE,
    enum: DocumentStatus,
  })
  documentStatus: DocumentStatus;

  @ApiProperty({
    description: "Payment status",
    example: PaymentStatus.PARTIAL,
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: "Approval status",
    example: ApprovalStatus.PENDING,
    enum: ApprovalStatus,
  })
  approvalStatus: ApprovalStatus;

  @ApiProperty({
    description: "Overall status",
    example: OverallStatus.IN_PROGRESS,
    enum: OverallStatus,
  })
  overallStatus: OverallStatus;

  @ApiProperty({
    description: "Status indicators (Story 5.2)",
    example: {
      documents: "yellow",
      payments: "yellow",
      approval: "yellow",
    },
  })
  statusIndicators: StatusIndicators;

  @ApiPropertyOptional({
    description: "Visual cue for urgent actions (Story 5.2)",
    example: {
      color: "yellow",
      icon: "clock",
      priority: "medium",
    },
  })
  visualCue?: VisualCue;

  @ApiProperty({
    description: "Service mode",
    example: ServiceMode.AGENT_ASSISTED,
    enum: ServiceMode,
  })
  serviceMode: ServiceMode;

  @ApiPropertyOptional({
    description: "User ID for self-service jamaah",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  userId?: string;

  @ApiProperty({
    description: "Assignment timestamp",
    example: "2024-12-01T10:00:00Z",
  })
  assignedAt: Date;

  @ApiPropertyOptional({
    description: "Additional metadata",
    example: { referralSource: "WhatsApp" },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: "Created timestamp",
    example: "2024-12-01T10:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Updated timestamp",
    example: "2024-12-22T15:30:00Z",
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "Deleted timestamp",
    example: null,
  })
  deletedAt?: Date;
}
