/**
 * Integration 4: Virtual Account Payment Gateway
 * Module Configuration
 *
 * This module provides virtual account integration with Midtrans
 * for automatic payment reconciliation.
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";

// Entities
import {
  VirtualAccountEntity,
  PaymentNotificationEntity,
} from "./infrastructure/persistence/relational/entities";
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentEntity } from "../payments/infrastructure/persistence/relational/entities/payment.entity";

// Services
import {
  MidtransService,
  VirtualAccountService,
  NotificationHandlerService,
} from "./services";

// Controllers
import { VirtualAccountController, VaWebhookController } from "./controllers";

// Processors
import { PaymentNotificationProcessor } from "./processors";

// Queue Module (already global)
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [
    ConfigModule,

    // TypeORM entities
    TypeOrmModule.forFeature([
      VirtualAccountEntity,
      PaymentNotificationEntity,
      JamaahEntity,
      PaymentEntity,
    ]),

    // BullMQ queue for payment notifications
    BullModule.registerQueue({
      name: "payment-notification",
    }),

    // Import QueueModule for QueueService
    QueueModule,
  ],
  providers: [
    // Services
    MidtransService,
    VirtualAccountService,
    NotificationHandlerService,

    // BullMQ Processors
    PaymentNotificationProcessor,
  ],
  controllers: [VirtualAccountController, VaWebhookController],
  exports: [VirtualAccountService, MidtransService, NotificationHandlerService],
})
export class VirtualAccountModule {}
