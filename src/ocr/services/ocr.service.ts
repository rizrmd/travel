/**
 * Epic 6, Integration 1: OCR Document Intelligence
 * Main OCR Service with caching and queue integration
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { DocumentEntity } from "../../documents/infrastructure/persistence/relational/entities/document.entity";
import { VerihubsOcrService } from "./verihubs-ocr.service";
import { QualityValidationService } from "./quality-validation.service";
import { QueueService } from "../../queue/services/queue.service";
import { FileStorageService } from "../../documents/services/file-storage.service";
import { OcrDocumentType, isOcrSupported } from "../domain/document-type.enum";
import { KtpDataDto } from "../dto/ktp-data.dto";
import { PassportDataDto } from "../dto/passport-data.dto";
import { KkDataDto } from "../dto/kk-data.dto";
import { ExtractDataResponseDto } from "../dto/extract-data.dto";

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly autoApproveThreshold: number;
  private readonly qualityCheckEnabled: boolean;
  private readonly cacheTtl: number;

  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepository: Repository<DocumentEntity>,
    private readonly verihubsService: VerihubsOcrService,
    private readonly qualityService: QualityValidationService,
    private readonly queueService: QueueService,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.autoApproveThreshold = parseInt(
      this.configService.get<string>("OCR_AUTO_APPROVE_THRESHOLD", "80"),
      10,
    );
    this.qualityCheckEnabled =
      this.configService.get<string>("OCR_QUALITY_CHECK_ENABLED", "true") ===
      "true";
    this.cacheTtl = parseInt(
      this.configService.get<string>("OCR_CACHE_TTL", "3600"),
      10,
    );

    this.logger.log("🔧 OCR Service initialized");
    this.logger.log(`   Auto-approve threshold: ${this.autoApproveThreshold}%`);
    this.logger.log(`   Quality check enabled: ${this.qualityCheckEnabled}`);
    this.logger.log(`   Cache TTL: ${this.cacheTtl}s`);
  }

  /**
   * Extract data from document using OCR
   * Includes quality validation, caching, and database updates
   */
  async extractData(
    documentId: string,
    forceReprocess: boolean = false,
  ): Promise<ExtractDataResponseDto> {
    this.logger.log(`🚀 Starting OCR extraction for document: ${documentId}`);

    // 1. Fetch document from database
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // 2. Check if document type is supported
    if (!isOcrSupported(document.document_type)) {
      throw new BadRequestException(
        `OCR not supported for document type: ${document.document_type}`,
      );
    }

    // 3. Check cache first (unless force reprocess)
    if (!forceReprocess) {
      const cacheKey = this.getCacheKey(documentId);
      const cached =
        await this.cacheManager.get<ExtractDataResponseDto>(cacheKey);

      if (cached) {
        this.logger.log(
          `💾 Returning cached OCR result for document: ${documentId}`,
        );
        return cached;
      }
    }

    // 4. Download file from storage
    const fileBuffer = await this.downloadFile(document.file_url);

    // 5. Quality validation (if enabled)
    let qualityResult = null;

    if (this.qualityCheckEnabled) {
      this.logger.log("🔍 Validating document quality...");
      qualityResult = await this.qualityService.validateDocument(fileBuffer);

      if (!qualityResult.passed) {
        throw new BadRequestException({
          message: "Kualitas dokumen tidak memenuhi standar untuk OCR",
          recommendations: qualityResult.recommendations,
          checks: qualityResult.checks,
        });
      }
    }

    // 6. Extract data based on document type
    let extractedData: KtpDataDto | PassportDataDto | KkDataDto;
    let confidenceScore: number;

    switch (document.document_type as unknown as OcrDocumentType) {
      case OcrDocumentType.KTP:
        const ktpData = await this.verihubsService.extractKtpData(fileBuffer);
        extractedData = ktpData;
        confidenceScore = ktpData.confidenceScore;
        break;

      case OcrDocumentType.PASSPORT:
        const passportData =
          await this.verihubsService.extractPassportData(fileBuffer);
        extractedData = passportData;
        confidenceScore = passportData.confidenceScore;
        break;

      case OcrDocumentType.KK:
        const kkData = await this.verihubsService.extractKkData(fileBuffer);
        extractedData = kkData;
        confidenceScore = kkData.confidenceScore;
        break;

      default:
        throw new BadRequestException("Unsupported document type for OCR");
    }

    // 7. Update document with extracted data
    const now = new Date();
    await this.documentsRepository.update(documentId, {
      extracted_data: extractedData as any,
      ocr_confidence_score: confidenceScore,
      ocr_processed_at: now,
      quality_validation_result: qualityResult as any,
    });

    this.logger.log(
      `✅ OCR extraction completed (confidence: ${confidenceScore}%)`,
    );

    // 8. Prepare response
    const response: ExtractDataResponseDto = {
      extractedData,
      confidenceScore,
      qualityValidation: qualityResult,
      autoApproved: confidenceScore >= this.autoApproveThreshold,
      processedAt: now.toISOString(),
      documentType: document.document_type,
    };

    // 9. Cache result
    const cacheKey = this.getCacheKey(documentId);
    await this.cacheManager.set(cacheKey, response, this.cacheTtl * 1000);

    return response;
  }

  /**
   * Queue document for asynchronous OCR extraction
   */
  async queueExtraction(
    documentId: string,
    tenantId: string,
  ): Promise<{ jobId: string }> {
    this.logger.log(`📥 Queuing OCR extraction for document: ${documentId}`);

    const job = await this.queueService.addJob(
      "ocr-processing",
      "extract-data",
      {
        documentId,
        tenantId,
        timestamp: new Date().toISOString(),
      },
    );

    this.logger.log(`✅ OCR job queued with ID: ${job.id}`);

    return { jobId: job.id as string };
  }

  /**
   * Get OCR status for a document
   */
  async getOcrStatus(documentId: string): Promise<{
    processed: boolean;
    confidenceScore: number | null;
    processedAt: Date | null;
    extractedData: any;
  }> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
      select: [
        "id",
        "ocr_processed_at",
        "ocr_confidence_score",
        "extracted_data",
      ],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return {
      processed: document.ocr_processed_at !== null,
      confidenceScore: document.ocr_confidence_score,
      processedAt: document.ocr_processed_at,
      extractedData: document.extracted_data,
    };
  }

  /**
   * Get OCR statistics for tenant
   */
  async getOcrStatistics(tenantId: string): Promise<{
    totalProcessed: number;
    averageConfidence: number;
    autoApproved: number;
    manualReview: number;
    byDocumentType: Record<string, number>;
  }> {
    const documents = await this.documentsRepository.find({
      where: {
        tenant_id: tenantId,
        ocr_processed_at: Not(null) as any,
      },
      select: ["document_type", "ocr_confidence_score"],
    });

    const totalProcessed = documents.length;
    const averageConfidence =
      documents.reduce((sum, doc) => sum + (doc.ocr_confidence_score || 0), 0) /
      totalProcessed;
    const autoApproved = documents.filter(
      (doc) => doc.ocr_confidence_score >= this.autoApproveThreshold,
    ).length;
    const manualReview = totalProcessed - autoApproved;

    const byDocumentType: Record<string, number> = {};
    documents.forEach((doc) => {
      byDocumentType[doc.document_type] =
        (byDocumentType[doc.document_type] || 0) + 1;
    });

    return {
      totalProcessed,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      autoApproved,
      manualReview,
      byDocumentType,
    };
  }

  /**
   * Clear OCR cache for a document
   */
  async clearCache(documentId: string): Promise<void> {
    const cacheKey = this.getCacheKey(documentId);
    await this.cacheManager.del(cacheKey);
    this.logger.log(`🗑️  Cleared OCR cache for document: ${documentId}`);
  }

  /**
   * Get integration status
   */
  getIntegrationStatus(): {
    enabled: boolean;
    mode: string;
    provider: string;
    supportedDocuments: string[];
    autoApproveThreshold: number;
    qualityCheckEnabled: boolean;
  } {
    const verihubsStatus = this.verihubsService.getStatus();

    return {
      enabled: verihubsStatus.enabled,
      mode: verihubsStatus.mode,
      provider: verihubsStatus.provider,
      supportedDocuments: Object.values(OcrDocumentType),
      autoApproveThreshold: this.autoApproveThreshold,
      qualityCheckEnabled: this.qualityCheckEnabled,
    };
  }

  /**
   * Download file from storage
   */
  private async downloadFile(fileUrl: string): Promise<Buffer> {
    try {
      this.logger.debug(`📥 Downloading file: ${fileUrl}`);

      // Extract file path from URL
      // Assuming fileUrl is either full URL or relative path
      let filePath = fileUrl;

      if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
        // Extract path from full URL
        const url = new URL(fileUrl);
        filePath = url.pathname;
      }

      const buffer = await this.fileStorageService.download(filePath);
      this.logger.debug(`✅ File downloaded (${buffer.length} bytes)`);

      return buffer;
    } catch (error) {
      this.logger.error("❌ Failed to download file", error.stack);
      throw new BadRequestException("Failed to download document file");
    }
  }

  /**
   * Generate cache key for document
   */
  private getCacheKey(documentId: string): string {
    return `ocr:document:${documentId}`;
  }
}

// Helper to handle TypeORM Not operator
function Not(value: any): any {
  return { $ne: value };
}
