/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * BullMQ Processor for background OCR jobs
 */

import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { OcrService } from "../services/ocr.service";
import { WebSocketEventType } from "../../websocket/types/websocket-events.type";
import { AppWebSocketGateway } from "../../websocket/websocket.gateway";

interface OcrJobData {
  documentId: string;
  tenantId: string;
  timestamp: string;
  forceReprocess?: boolean;
}

@Processor("ocr-processing")
export class OcrProcessor extends WorkerHost {
  private readonly logger = new Logger(OcrProcessor.name);

  constructor(
    private readonly ocrService: OcrService,
    private readonly websocketGateway: AppWebSocketGateway,
  ) {
    super();
    this.logger.log("🔧 OCR Processor initialized");
  }

  /**
   * Process OCR extraction job
   */
  async process(job: Job<OcrJobData>): Promise<any> {
    const { documentId, tenantId, forceReprocess } = job.data;

    this.logger.log(
      `🔄 Processing OCR job ${job.id} for document: ${documentId}`,
    );

    try {
      // Update job progress
      await job.updateProgress(10);

      // Perform OCR extraction
      const result = await this.ocrService.extractData(
        documentId,
        forceReprocess,
      );

      await job.updateProgress(90);

      // Emit success event via WebSocket
      await this.websocketGateway.broadcastToTenant(tenantId, {
        type: WebSocketEventType.OCR_COMPLETED,
        data: {
          jobId: job.id,
          documentId: documentId,
          success: true,
          documentType: result.documentType,
          confidence: result.confidenceScore,
          autoApproved: result.autoApproved,
          processedAt: result.processedAt,
          extractedData: result.extractedData,
        },
        tenantId,
        timestamp: new Date(),
      });

      await job.updateProgress(100);

      this.logger.log(
        `✅ OCR job ${job.id} completed successfully (confidence: ${result.confidenceScore}%)`,
      );

      return {
        success: true,
        documentId,
        result,
      };
    } catch (error) {
      this.logger.error(`❌ OCR job ${job.id} failed:`, error.stack);

      // Emit failure event via WebSocket
      await this.websocketGateway.broadcastToTenant(tenantId, {
        type: WebSocketEventType.OCR_FAILED,
        data: {
          jobId: job.id,
          error: error.message,
        },
        tenantId,
        timestamp: new Date(),
      });

      // Re-throw error to mark job as failed
      throw error;
    }
  }

  /**
   * Handle job completion
   */
  @OnWorkerEvent("completed")
  onCompleted(job: Job<OcrJobData>) {
    const { documentId } = job.data;
    this.logger.log(`✅ Job ${job.id} completed for document: ${documentId}`);
  }

  /**
   * Handle job failure
   */
  @OnWorkerEvent("failed")
  onFailed(job: Job<OcrJobData>, error: Error) {
    const { documentId } = job.data;
    this.logger.error(
      `❌ Job ${job.id} failed for document: ${documentId}`,
      error.stack,
    );

    // Log detailed error information
    this.logger.error(`   Error: ${error.message}`);
    this.logger.error(
      `   Attempts: ${job.attemptsMade}/${job.opts.attempts || 3}`,
    );
  }

  /**
   * Handle job progress
   */
  @OnWorkerEvent("progress")
  onProgress(job: Job<OcrJobData>, progress: number) {
    const { documentId } = job.data;
    this.logger.debug(
      `📊 Job ${job.id} progress: ${progress}% (document: ${documentId})`,
    );
  }

  /**
   * Handle job active state
   */
  @OnWorkerEvent("active")
  onActive(job: Job<OcrJobData>) {
    const { documentId } = job.data;
    this.logger.log(
      `🏃 Job ${job.id} started processing document: ${documentId}`,
    );
  }

  /**
   * Handle job stalled
   */
  @OnWorkerEvent("stalled")
  onStalled(jobId: string) {
    this.logger.warn(`⏸️  Job ${jobId} stalled`);
  }
}
