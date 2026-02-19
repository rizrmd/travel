import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { CacheModule } from "@nestjs/cache-manager";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { ResourceMonitorService } from "./services/resource-monitor.service";
import { TenantProvisioningProcessor } from "./jobs/tenant-provisioning.processor";
import { TenantEntity } from "./entities/tenant.entity";
import { UserEntity } from "../users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantEntity, UserEntity]),
    BullModule.registerQueue({
      name: "tenant-provisioning",
    }),
    CacheModule.register(),
  ],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    ResourceMonitorService,
    TenantProvisioningProcessor,
  ],
  exports: [TenantsService, ResourceMonitorService],
})
export class TenantsModule { }
