/**
 * Epic 5, Story 5.3: Jamaah List Query DTO
 * Request DTO for filtering and paginating jamaah list
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsEnum,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsArray,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import {
  JamaahStatus,
  DocumentStatus,
  PaymentStatus,
  ApprovalStatus,
  OverallStatus,
  ServiceMode,
} from "../domain/jamaah";

/**
 * Predefined quick filters - Story 5.3
 */
export enum QuickFilter {
  MISSING_DOCUMENTS = "missing_documents",
  OVERDUE_PAYMENTS = "overdue_payments",
  READY_TO_DEPART = "ready_to_depart",
  NEEDS_ATTENTION = "needs_attention",
  PENDING_REVIEW = "pending_review",
  ALL_GOOD = "all_good",
}

/**
 * Sort options
 */
export enum SortBy {
  URGENCY = "urgency",
  NAME = "name",
  DEPARTURE_DATE = "departure_date",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

/**
 * Sort order
 */
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class JamaahListQueryDto {
  @ApiPropertyOptional({
    description: "Quick filter preset",
    enum: QuickFilter,
    example: QuickFilter.OVERDUE_PAYMENTS,
  })
  @IsOptional()
  @IsEnum(QuickFilter)
  filter?: QuickFilter;

  @ApiPropertyOptional({
    description: "Filter by jamaah status (multiple)",
    enum: JamaahStatus,
    isArray: true,
    example: [JamaahStatus.INTERESTED, JamaahStatus.DEPOSIT_PAID],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(JamaahStatus, { each: true })
  status?: JamaahStatus[];

  @ApiPropertyOptional({
    description: "Filter by document status",
    enum: DocumentStatus,
    example: DocumentStatus.INCOMPLETE,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  documentStatus?: DocumentStatus;

  @ApiPropertyOptional({
    description: "Filter by payment status",
    enum: PaymentStatus,
    example: PaymentStatus.PARTIAL,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: "Filter by approval status",
    enum: ApprovalStatus,
    example: ApprovalStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({
    description: "Filter by overall status",
    enum: OverallStatus,
    example: OverallStatus.AT_RISK,
  })
  @IsOptional()
  @IsEnum(OverallStatus)
  overallStatus?: OverallStatus;

  @ApiPropertyOptional({
    description: "Filter by service mode",
    enum: ServiceMode,
    example: ServiceMode.SELF_SERVICE,
  })
  @IsOptional()
  @IsEnum(ServiceMode)
  serviceMode?: ServiceMode;

  @ApiPropertyOptional({
    description: "Filter by package ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  packageId?: string;

  @ApiPropertyOptional({
    description: "Filter by departure date from",
    example: "2025-01-01",
  })
  @IsOptional()
  @IsDateString()
  departureDateFrom?: string;

  @ApiPropertyOptional({
    description: "Filter by departure date to",
    example: "2025-03-31",
  })
  @IsOptional()
  @IsDateString()
  departureDateTo?: string;

  @ApiPropertyOptional({
    description: "Search by jamaah name (case-insensitive partial match)",
    example: "ahmad",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Sort by field",
    enum: SortBy,
    default: SortBy.URGENCY,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @ApiPropertyOptional({
    description: "Sort order",
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiPropertyOptional({
    description: "Page number (1-indexed)",
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "Number of items per page",
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage?: number;
}
