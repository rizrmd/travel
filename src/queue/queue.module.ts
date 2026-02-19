/**
 * Epic 8, Story 8.4: Queue Module
 * Configures BullMQ queues and processors
 */

import { Module, Global } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { QueueName } from "./types/queue-jobs.type";
import { QueueService } from "./services/queue.service";
import { EmailProcessor } from "./processors/email.processor";
import { NotificationsProcessor } from "./processors/notifications.processor";
import { BatchProcessingProcessor } from "./processors/batch-processing.processor";
import { ReportsProcessor } from "./processors/reports.processor";
import { WebSocketModule } from "../websocket/websocket.module";

/**
 * Queue module - marked as Global to make queue service available everywhere
 */
@Global()
@Module({
  imports: [
    // Register BullMQ queues
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB, 10) || 0,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }),

    // Register individual queues
    BullModule.registerQueue(
      { name: QueueName.EMAIL },
      { name: QueueName.NOTIFICATIONS },
      { name: QueueName.BATCH_PROCESSING },
      { name: QueueName.REPORTS },
    ),

    // Import WebSocketModule for event emitter
    WebSocketModule,
  ],
  providers: [
    QueueService,
    EmailProcessor,
    NotificationsProcessor,
    BatchProcessingProcessor,
    ReportsProcessor,
  ],
  exports: [QueueService],
})
export class QueueModule {}
