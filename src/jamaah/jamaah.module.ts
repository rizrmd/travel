/**
 * Epic 5: Jamaah Module
 * Agent Management & "My Jamaah" Dashboard
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";

// Entities
import { JamaahEntity } from "./infrastructure/persistence/relational/entities/jamaah.entity";
import { JamaahActionLogEntity } from "./infrastructure/persistence/relational/entities/jamaah-action-log.entity";
import { JamaahDelegationEntity } from "./infrastructure/persistence/relational/entities/jamaah-delegation.entity";
import { JamaahStatusHistoryEntity } from "./infrastructure/persistence/relational/entities/jamaah-status-history.entity";

// Services
import { JamaahService } from "./services/jamaah.service";
import { JamaahFilteringService } from "./services/jamaah-filtering.service";
import { BulkOperationsService } from "./services/bulk-operations.service";
import { ActionLogService } from "./services/action-log.service";
import { DelegationService } from "./services/delegation.service";
import { StatusTransitionService } from "./services/status-transition.service";

// Controllers
import { JamaahController } from "./controllers/jamaah.controller";
import { JamaahBulkController } from "./controllers/jamaah-bulk.controller";
import { JamaahDelegationController } from "./controllers/jamaah-delegation.controller";

// Import QueueModule for bulk operations
import { QueueModule as QueueModuleImport } from "../queue/queue.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JamaahEntity,
      JamaahActionLogEntity,
      JamaahDelegationEntity,
      JamaahStatusHistoryEntity,
    ]),
    CacheModule.register({
      ttl: 300000, // 5 minutes
    }),
    QueueModuleImport,
  ],
  controllers: [
    JamaahController,
    JamaahBulkController,
    JamaahDelegationController,
  ],
  providers: [
    JamaahService,
    JamaahFilteringService,
    BulkOperationsService,
    ActionLogService,
    DelegationService,
    StatusTransitionService,
  ],
  exports: [JamaahService, ActionLogService, DelegationService],
})
export class JamaahModule {}
