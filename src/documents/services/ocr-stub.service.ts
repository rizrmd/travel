/**
 * Epic 6, Story 6.6: OCR Integration Stub Service
 * Placeholder service for OCR functionality (Phase 2)
 */

import { Injectable, NotImplementedException, Logger } from "@nestjs/common";

/**
 * OCR Feature Information
 */
export interface OcrFeatureInfo {
  available: boolean;
  status: string;
  plannedFeatures: string[];
  providers: Array<{
    name: string;
    features: string[];
    estimatedCost: string;
  }>;
  implementationPhase: string;
  eta: string;
}

/**
 * OCR Stub Service
 * All methods return HTTP 501 (Not Implemented)
 */
@Injectable()
export class OcrStubService {
  private readonly logger = new Logger(OcrStubService.name);

  /**
   * Extract data from passport document (stub)
   */
  async extractPassportData(documentId: string): Promise<never> {
    this.logger.warn(
      `OCR extract passport called for document ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "OCR integration coming soon. Currently in development for Phase 2.",
    );
  }

  /**
   * Extract data from KTP document (stub)
   */
  async extractKtpData(documentId: string): Promise<never> {
    this.logger.warn(
      `OCR extract KTP called for document ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "OCR integration coming soon. Currently in development for Phase 2.",
    );
  }

  /**
   * Extract data from Kartu Keluarga document (stub)
   */
  async extractKkData(documentId: string): Promise<never> {
    this.logger.warn(
      `OCR extract KK called for document ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "OCR integration coming soon. Currently in development for Phase 2.",
    );
  }

  /**
   * Extract data from vaccination certificate (stub)
   */
  async extractVaccinationData(documentId: string): Promise<never> {
    this.logger.warn(
      `OCR extract vaccination called for document ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "OCR integration coming soon. Currently in development for Phase 2.",
    );
  }

  /**
   * Collect email for OCR launch notification
   */
  async notifyMeWhenReady(email: string): Promise<{ message: string }> {
    this.logger.log(`OCR launch notification requested for: ${email}`);

    // TODO: Store email in a waiting list for Phase 2 launch
    // For now, just log it

    return {
      message:
        "Thank you for your interest! We will notify you when OCR features are available.",
    };
  }

  /**
   * Get OCR feature information
   */
  getOcrInfo(): OcrFeatureInfo {
    return {
      available: false,
      status: "Coming Soon - Phase 2",
      plannedFeatures: [
        "Automatic KTP data extraction",
        "Passport data extraction",
        "Kartu Keluarga (KK) data extraction",
        "Vaccination certificate verification",
        "Visa data extraction",
        "Document quality validation",
        "Automatic expiry date detection",
        "Face matching for photo verification",
        "Document authenticity check",
      ],
      providers: [
        {
          name: "Verihubs",
          features: [
            "KTP OCR",
            "Passport OCR",
            "Face Recognition",
            "Liveness Detection",
          ],
          estimatedCost: "IDR 1,000 - 5,000 per document",
        },
        {
          name: "Google Cloud Vision AI",
          features: [
            "Generic document OCR",
            "Text detection",
            "Handwriting recognition",
          ],
          estimatedCost: "$1.50 per 1,000 documents",
        },
        {
          name: "AWS Textract",
          features: [
            "Document text extraction",
            "Form data extraction",
            "Table detection",
          ],
          estimatedCost: "$1.50 per 1,000 pages",
        },
      ],
      implementationPhase: "Phase 2",
      eta: "Q2 2026",
    };
  }

  /**
   * Validate document quality (stub)
   */
  async validateDocumentQuality(documentId: string): Promise<never> {
    this.logger.warn(
      `Document quality validation called for ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "Document quality validation coming soon. Currently in development for Phase 2.",
    );
  }

  /**
   * Get OCR confidence score (stub)
   */
  async getOcrConfidenceScore(documentId: string): Promise<never> {
    this.logger.warn(
      `OCR confidence score requested for ${documentId} - Not implemented`,
    );
    throw new NotImplementedException(
      "OCR confidence scoring coming soon. Currently in development for Phase 2.",
    );
  }
}
