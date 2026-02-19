import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeadEntity } from "./infrastructure/persistence/relational/entities/lead.entity";
import { LeadsService } from "./services/leads.service";
import { LeadsController } from "./leads.controller";
import { LandingPagesModule } from "../landing-pages/landing-pages.module";

/**
 * Epic 10, Story 10.5: Leads Module
 */
@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity]), LandingPagesModule],
  providers: [LeadsService],
  controllers: [LeadsController],
  exports: [LeadsService],
})
export class LeadsModule {}
