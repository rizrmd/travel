/**
 * Epic 5, Story 5.3: Jamaah Filtering Service
 * Advanced filtering and search for jamaah
 */

import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { JamaahEntity } from "../infrastructure/persistence/relational/entities/jamaah.entity";
import {
  JamaahListQueryDto,
  QuickFilter,
  SortBy,
} from "../dto/jamaah-list-query.dto";
import { JamaahResponseDto } from "../dto";
import { JamaahService } from "./jamaah.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import {
  DocumentStatus,
  PaymentStatus,
  ApprovalStatus,
  OverallStatus,
} from "../domain/jamaah";

@Injectable()
export class JamaahFilteringService {
  constructor(
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Get filtered jamaah list for agent
   */
  async getMyJamaah(
    query: JamaahListQueryDto,
    tenantId: string,
    agentId: string,
  ): Promise<{ data: any[]; meta: any }> {
    const page = query.page || 1;
    const perPage = query.perPage || 20;
    const skip = (page - 1) * perPage;

    // Try cache first
    const cacheKey = `jamaah:agent:${tenantId}:${agentId}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as any;
    }

    let qb = this.jamaahRepository
      .createQueryBuilder("jamaah")
      .leftJoinAndSelect("jamaah.agent", "agent")
      .leftJoinAndSelect("jamaah.package", "package")
      .where("jamaah.tenant_id = :tenantId", { tenantId })
      .andWhere("jamaah.agent_id = :agentId", { agentId })
      .andWhere("jamaah.deleted_at IS NULL");

    // Apply quick filter
    if (query.filter) {
      qb = this.applyQuickFilter(qb, query.filter);
    }

    // Apply advanced filters
    if (query.status && query.status.length > 0) {
      qb = qb.andWhere("jamaah.status IN (:...status)", {
        status: query.status,
      });
    }

    if (query.documentStatus) {
      qb = qb.andWhere("jamaah.document_status = :documentStatus", {
        documentStatus: query.documentStatus,
      });
    }

    if (query.paymentStatus) {
      qb = qb.andWhere("jamaah.payment_status = :paymentStatus", {
        paymentStatus: query.paymentStatus,
      });
    }

    if (query.approvalStatus) {
      qb = qb.andWhere("jamaah.approval_status = :approvalStatus", {
        approvalStatus: query.approvalStatus,
      });
    }

    if (query.serviceMode) {
      qb = qb.andWhere("jamaah.service_mode = :serviceMode", {
        serviceMode: query.serviceMode,
      });
    }

    if (query.packageId) {
      qb = qb.andWhere("jamaah.package_id = :packageId", {
        packageId: query.packageId,
      });
    }

    // Date range filter
    if (query.departureDateFrom) {
      qb = qb.andWhere("package.departure_date >= :departureDateFrom", {
        departureDateFrom: query.departureDateFrom,
      });
    }

    if (query.departureDateTo) {
      qb = qb.andWhere("package.departure_date <= :departureDateTo", {
        departureDateTo: query.departureDateTo,
      });
    }

    // Search
    if (query.search) {
      qb = qb.andWhere("LOWER(jamaah.full_name) LIKE LOWER(:search)", {
        search: `%${query.search}%`,
      });
    }

    // Sorting
    qb = this.applySorting(qb, query.sortBy, query.sortOrder);

    // Get total count
    const total = await qb.getCount();

    // Get paginated results
    const jamaahList = await qb.skip(skip).take(perPage).getMany();

    const data = jamaahList.map((j) => this.toSimpleDto(j));

    const result = {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  /**
   * Apply quick filter presets - Story 5.3
   */
  private applyQuickFilter(
    qb: SelectQueryBuilder<JamaahEntity>,
    filter: QuickFilter,
  ): SelectQueryBuilder<JamaahEntity> {
    switch (filter) {
      case QuickFilter.MISSING_DOCUMENTS:
        return qb.andWhere("jamaah.document_status IN (:...statuses)", {
          statuses: [DocumentStatus.INCOMPLETE],
        });

      case QuickFilter.OVERDUE_PAYMENTS:
        return qb.andWhere("jamaah.payment_status = :status", {
          status: PaymentStatus.OVERDUE,
        });

      case QuickFilter.READY_TO_DEPART:
        return qb
          .andWhere("jamaah.approval_status = :approvalStatus", {
            approvalStatus: ApprovalStatus.APPROVED,
          })
          .andWhere("jamaah.payment_status = :paymentStatus", {
            paymentStatus: PaymentStatus.PAID_FULL,
          });

      case QuickFilter.NEEDS_ATTENTION:
        return qb.andWhere(
          "(jamaah.payment_status = :overdue OR jamaah.approval_status = :rejected OR jamaah.document_status = :incomplete)",
          {
            overdue: PaymentStatus.OVERDUE,
            rejected: ApprovalStatus.REJECTED,
            incomplete: DocumentStatus.INCOMPLETE,
          },
        );

      case QuickFilter.PENDING_REVIEW:
        return qb.andWhere("jamaah.approval_status = :status", {
          status: ApprovalStatus.PENDING,
        });

      case QuickFilter.ALL_GOOD:
        return qb
          .andWhere("jamaah.document_status = :docStatus", {
            docStatus: DocumentStatus.COMPLETE,
          })
          .andWhere("jamaah.payment_status IN (:...payStatuses)", {
            payStatuses: [PaymentStatus.PAID_FULL, PaymentStatus.PARTIAL],
          });

      default:
        return qb;
    }
  }

  /**
   * Apply sorting
   */
  private applySorting(
    qb: SelectQueryBuilder<JamaahEntity>,
    sortBy?: SortBy,
    sortOrder: "ASC" | "DESC" = "DESC",
  ): SelectQueryBuilder<JamaahEntity> {
    switch (sortBy) {
      case SortBy.NAME:
        return qb.orderBy("jamaah.full_name", sortOrder);
      case SortBy.DEPARTURE_DATE:
        return qb.orderBy("package.departure_date", sortOrder);
      case SortBy.CREATED_AT:
        return qb.orderBy("jamaah.created_at", sortOrder);
      case SortBy.UPDATED_AT:
        return qb.orderBy("jamaah.updated_at", sortOrder);
      case SortBy.URGENCY:
      default:
        // Sort by urgency: red > yellow > green
        return qb
          .addSelect(
            `CASE
              WHEN jamaah.payment_status = '${PaymentStatus.OVERDUE}' THEN 1
              WHEN jamaah.document_status = '${DocumentStatus.INCOMPLETE}' THEN 2
              WHEN jamaah.approval_status = '${ApprovalStatus.REJECTED}' THEN 3
              WHEN jamaah.approval_status = '${ApprovalStatus.PENDING}' THEN 4
              WHEN jamaah.payment_status = '${PaymentStatus.PARTIAL}' THEN 5
              ELSE 6
            END`,
            "urgency_priority",
          )
          .orderBy("urgency_priority", "ASC")
          .addOrderBy("package.departure_date", "ASC");
    }
  }

  /**
   * Convert to simple DTO
   */
  private toSimpleDto(entity: JamaahEntity): any {
    return {
      id: entity.id,
      fullName: entity.full_name,
      packageName: entity.package?.name,
      departureDate: entity.package?.departure_date,
      status: entity.status,
      documentStatus: entity.document_status,
      paymentStatus: entity.payment_status,
      approvalStatus: entity.approval_status,
      serviceMode: entity.service_mode,
      assignedAt: entity.assigned_at,
    };
  }
}
