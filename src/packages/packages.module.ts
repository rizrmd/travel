/**
 * Epic 4: Packages Module
 * Configures all package management dependencies
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackagesController } from "./packages.controller";
import { PackagesService } from "./services/packages.service";
import { ItineraryService } from "./services/itinerary.service";
import { PricingService } from "./services/pricing.service";
import { PackageVersioningService } from "./services/package-versioning.service";
import { PackageBroadcastService } from "./services/package-broadcast.service";
import { InclusionsService } from "./services/inclusions.service";
import { PackageEntity } from "./infrastructure/persistence/relational/entities/package.entity";
import { ItineraryItemEntity } from "./infrastructure/persistence/relational/entities/itinerary-item.entity";
import { PackageInclusionEntity } from "./infrastructure/persistence/relational/entities/package-inclusion.entity";
import { PackageVersionEntity } from "./infrastructure/persistence/relational/entities/package-version.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PackageEntity,
      ItineraryItemEntity,
      PackageInclusionEntity,
      PackageVersionEntity,
    ]),
  ],
  controllers: [PackagesController],
  providers: [
    PackagesService,
    ItineraryService,
    PricingService,
    PackageVersioningService,
    PackageBroadcastService,
    InclusionsService,
  ],
  exports: [
    PackagesService,
    ItineraryService,
    PricingService,
    PackageVersioningService,
    InclusionsService,
  ],
})
export class PackagesModule {}
