import { Injectable, BadRequestException } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm";
import { PublicApiQueryDto } from "../dto/public-api-query.dto";
import {
  PublicApiResponseDto,
  PaginationMetaDto,
  PaginationLinksDto,
} from "../dto/public-api-response.dto";

@Injectable()
export class PublicApiService {
  buildQuery<T>(
    query: SelectQueryBuilder<T>,
    dto: PublicApiQueryDto,
    allowedSortFields: string[],
  ): SelectQueryBuilder<T> {
    // Apply sorting
    if (dto.sort) {
      const [field, order] = dto.sort.split(":");

      if (!allowedSortFields.includes(field)) {
        throw new BadRequestException(`Invalid sort field: ${field}`);
      }

      const sortOrder = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      query.orderBy(`entity.${field}`, sortOrder);
    }

    // Apply field selection
    if (dto.fields) {
      const fields = dto.fields.split(",").map((f) => f.trim());
      query.select(fields.map((f) => `entity.${f}`));
    }

    // Apply pagination
    const page = dto.page || 1;
    const perPage = dto.per_page || 20;
    const skip = (page - 1) * perPage;

    query.skip(skip).take(perPage);

    return query;
  }

  async formatResponse<T>(
    data: T[],
    total: number,
    dto: PublicApiQueryDto,
    baseUrl: string,
  ): Promise<PublicApiResponseDto<T>> {
    const page = dto.page || 1;
    const perPage = dto.per_page || 20;
    const totalPages = Math.ceil(total / perPage);

    const meta: PaginationMetaDto = {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
    };

    const links: PaginationLinksDto = {
      first: `${baseUrl}?page=1&per_page=${perPage}`,
      prev:
        page > 1
          ? `${baseUrl}?page=${page - 1}&per_page=${perPage}`
          : undefined,
      next:
        page < totalPages
          ? `${baseUrl}?page=${page + 1}&per_page=${perPage}`
          : undefined,
      last: `${baseUrl}?page=${totalPages}&per_page=${perPage}`,
    };

    return {
      data,
      meta,
      links,
    };
  }

  handleError(error: any, requestId: string): any {
    return {
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message || "An unexpected error occurred",
        details: error.details || {},
        request_id: requestId,
      },
    };
  }

  async validatePermissions(
    scopes: string[],
    resource: string,
    action: string,
  ): Promise<boolean> {
    const requiredScope = `${resource}:${action}`;
    const wildcardScope = `${resource}:*`;

    return (
      scopes.includes(requiredScope) ||
      scopes.includes(wildcardScope) ||
      scopes.includes("*")
    );
  }
}
