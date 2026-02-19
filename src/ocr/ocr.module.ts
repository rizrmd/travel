/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * OCR Module - Verihubs integration
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";

// Entities
import { DocumentEntity } from "../documents/infrastructure/persistence/relational/entities/document.entity";

// Services
import {
  VerihubsOcrService,
  QualityValidationService,
  OcrService,
} from "./services";

// Controllers
import { OcrController } from "./controllers/ocr.controller";

// Processors
import { OcrProcessor } from "./processors/ocr.processor";

// External modules
import { WebSocketModule } from "../websocket/websocket.module";
import { QueueModule } from "../queue/queue.module";
import { CacheModule } from "../cache/cache.module";
import { DocumentsModule } from "../documents/documents.module";

@Module({
  imports: [
    // Configuration
    ConfigModule,

    // TypeORM entities
    TypeOrmModule.forFeature([DocumentEntity]),

    // BullMQ queue for OCR processing
    BullModule.registerQueue({
      name: "ocr-processing",
    }),

    // External modules
    WebSocketModule,
    QueueModule,
    CacheModule,
    DocumentsModule, // Import to access FileStorageService
  ],
  controllers: [OcrController],
  providers: [
    // Core services
    VerihubsOcrService,
    QualityValidationService,
    OcrService,

    // Processors
    OcrProcessor,
  ],
  exports: [OcrService, VerihubsOcrService, QualityValidationService],
})
export class OcrModule {}
