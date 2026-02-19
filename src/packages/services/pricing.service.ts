/**
 * Epic 4, Story 4.3: Pricing Service
 * Dual pricing system with role-based visibility
 */

import { Injectable } from "@nestjs/common";
import { PackageEntity } from "../infrastructure/persistence/relational/entities/package.entity";
import { Package } from "../domain/package";
import {
  PackageResponseDto,
  PackagePricingDto,
} from "../dto/package-response.dto";

export enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  AGENT = "agent",
  AFFILIATE = "affiliate",
  SUB_AFFILIATE = "sub_affiliate",
  JAMAAH = "jamaah",
  PUBLIC = "public",
}

@Injectable()
export class PricingService {
  /**
   * Calculate pricing breakdown
   * Story 4.3: Compute commission and margins
   */
  calculatePricing(
    packageEntity: PackageEntity,
    userRole: UserRole,
  ): PackagePricingDto {
    const pricing: PackagePricingDto = {
      agent_commission: Package.calculateAgentCommission(
        packageEntity.retail_price,
        packageEntity.wholesale_price,
      ),
      agent_commission_percentage: Package.calculateAgentCommissionPercentage(
        packageEntity.retail_price,
        packageEntity.wholesale_price,
      ),
    };

    // Only show agency profit and total margin to owners/admins
    if (userRole === UserRole.OWNER || userRole === UserRole.ADMIN) {
      if (packageEntity.cost_price) {
        pricing.agency_profit = Package.calculateAgencyProfit(
          packageEntity.wholesale_price,
          packageEntity.cost_price,
        );
        pricing.total_margin = Package.calculateTotalMargin(
          packageEntity.retail_price,
          packageEntity.cost_price,
        );
      }
    }

    return pricing;
  }

  /**
   * Filter package data based on user role
   * Story 4.3: Role-based pricing visibility
   */
  filterPackageByRole(
    packageEntity: PackageEntity,
    userRole: UserRole,
  ): Partial<PackageResponseDto> {
    const response: any = {
      id: packageEntity.id,
      tenant_id: packageEntity.tenant_id,
      name: packageEntity.name,
      description: packageEntity.description,
      duration_days: packageEntity.duration_days,
      retail_price: packageEntity.retail_price,
      capacity: packageEntity.capacity,
      available_slots: packageEntity.available_slots,
      departure_date: packageEntity.departure_date,
      return_date: packageEntity.return_date,
      status: packageEntity.status,
      created_by_id: packageEntity.created_by_id,
      created_at: packageEntity.created_at,
      updated_at: packageEntity.updated_at,
      deleted_at: packageEntity.deleted_at,
    };

    // Agents, Affiliates, Sub-Affiliates can see wholesale price
    if (
      userRole === UserRole.AGENT ||
      userRole === UserRole.AFFILIATE ||
      userRole === UserRole.SUB_AFFILIATE ||
      userRole === UserRole.OWNER ||
      userRole === UserRole.ADMIN
    ) {
      response.wholesale_price = packageEntity.wholesale_price;
      response.pricing = this.calculatePricing(packageEntity, userRole);
    }

    // Only Owner/Admin can see cost price
    if (userRole === UserRole.OWNER || userRole === UserRole.ADMIN) {
      response.cost_price = packageEntity.cost_price;
    }

    return response;
  }

  /**
   * Filter multiple packages by role
   */
  filterPackagesByRole(
    packages: PackageEntity[],
    userRole: UserRole,
  ): Partial<PackageResponseDto>[] {
    return packages.map((pkg) => this.filterPackageByRole(pkg, userRole));
  }

  /**
   * Validate pricing update
   * Story 4.3: Ensure retail >= wholesale >= cost
   */
  validatePricingUpdate(
    retailPrice?: number,
    wholesalePrice?: number,
    costPrice?: number,
  ): { valid: boolean; error?: string } {
    if (
      retailPrice !== undefined &&
      wholesalePrice !== undefined &&
      costPrice !== undefined
    ) {
      if (!Package.isValidPricing(retailPrice, wholesalePrice, costPrice)) {
        return {
          valid: false,
          error: "Harga tidak valid. Retail >= Wholesale >= Cost",
        };
      }
    } else if (retailPrice !== undefined && wholesalePrice !== undefined) {
      if (retailPrice < wholesalePrice) {
        return {
          valid: false,
          error: "Harga retail harus lebih besar atau sama dengan wholesale",
        };
      }
    } else if (wholesalePrice !== undefined && costPrice !== undefined) {
      if (wholesalePrice < costPrice) {
        return {
          valid: false,
          error: "Harga wholesale harus lebih besar atau sama dengan cost",
        };
      }
    }

    return { valid: true };
  }
}
