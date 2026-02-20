/**
 * Epic 6: Documents Module
 * Handles document management with OCR integration stub
 */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";

// Entities
import {
  DocumentEntity,
  BatchUploadJobEntity,
  BulkApprovalJobEntity,
} from "./infrastructure/persistence/relational/entities";
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";

// Services
import {
  FileStorageService,
  LocalFileStorageService,
  S3FileStorageService,
  DocumentsService,
  BatchUploadService,
  DocumentReviewService,
  BulkApprovalService,
  OcrStubService,
} from "./services";

// Controllers
import {
  DocumentsController,
  DocumentsBatchController,
  DocumentsReviewController,
  OcrController,
} from "./controllers";

// External modules
import { WebSocketModule } from "../websocket/websocket.module";
import { QueueModule } from "../queue/queue.module";
import { QueueName } from "../queue/types/queue-jobs.type";

@Module({
  imports: [
    // TypeORM entities
    TypeOrmModule.forFeature([
      DocumentEntity,
      BatchUploadJobEntity,
      BulkApprovalJobEntity,
      JamaahEntity,
    ]),

    // BullMQ queue for batch processing
    BullModule.registerQueue({
      name: QueueName.BATCH_PROCESSING,
    }),

    // External modules
    WebSocketModule,
    QueueModule,
  ],
  controllers: [
    DocumentsController,
    DocumentsBatchController,
    DocumentsReviewController,
    OcrController,
  ],
  providers: [
    // File storage services
    LocalFileStorageService,
    S3FileStorageService,
    FileStorageService,

    // Core services
    DocumentsService,
    BatchUploadService,
    DocumentReviewService,
    BulkApprovalService,
    OcrStubService,
  ],
  exports: [
    FileStorageService,
    DocumentsService,
    BatchUploadService,
    DocumentReviewService,
    BulkApprovalService,
    OcrStubService,
  ],
})
export class DocumentsModule {}
