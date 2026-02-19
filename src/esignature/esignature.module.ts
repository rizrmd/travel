/**
 * Integration 5: E-Signature Integration (PrivyID)
 * Module: E-Signature Module with PrivyID Integration
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";

// Entities
import { ContractEntity } from "../compliance/infrastructure/persistence/relational/entities/contract.entity";
import { SignatureEventEntity } from "./entities/signature-event.entity";

// Services
import {
  PrivyIdService,
  SignatureTrackerService,
  ESignatureService,
} from "./services";

// Controllers
import {
  ESignatureController,
  SignatureWebhookController,
} from "./controllers";

// Processors
import { SignatureReminderProcessor } from "./processors/signature-reminder.processor";

// Import WebSocket module for real-time events
import { WebSocketModule } from "../websocket/websocket.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ContractEntity, SignatureEventEntity]),
    BullModule.registerQueue({
      name: "signature-reminders",
    }),
    WebSocketModule,
  ],
  controllers: [ESignatureController, SignatureWebhookController],
  providers: [
    // Services
    PrivyIdService,
    SignatureTrackerService,
    ESignatureService,
    // Processors
    SignatureReminderProcessor,
  ],
  exports: [ESignatureService, SignatureTrackerService, PrivyIdService],
})
export class ESignatureModule { }
