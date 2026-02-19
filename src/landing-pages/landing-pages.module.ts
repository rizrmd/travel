import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LandingPageEntity } from "./infrastructure/persistence/relational/entities/landing-page.entity";
import { LandingPagesService } from "./services/landing-pages.service";
import { TemplateRendererService } from "./services/template-renderer.service";
import {
  LandingPagesController,
  PublicLandingPagesController,
} from "./landing-pages.controller";
import { AnalyticsModule } from "../analytics/analytics.module";

/**
 * Epic 10, Story 10.2: Landing Pages Module
 */
@Module({
  imports: [TypeOrmModule.forFeature([LandingPageEntity]), AnalyticsModule],
  providers: [LandingPagesService, TemplateRendererService],
  controllers: [LandingPagesController, PublicLandingPagesController],
  exports: [LandingPagesService, TemplateRendererService],
})
export class LandingPagesModule {}
