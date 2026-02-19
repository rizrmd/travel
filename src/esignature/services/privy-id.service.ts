/**
 * Integration 5: E-Signature Integration
 * Service: PrivyID Provider with Dual-Mode (STUB/PRODUCTION)
 */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import * as crypto from "crypto";
import FormData from "form-data";

interface SendSignatureRequest {
  documentUrl: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string;
  documentTitle: string;
}

interface SignatureResponse {
  signature_request_id: string;
  signature_url: string;
  status: string;
  expires_at: string;
}

interface SignatureStatusResponse {
  signature_request_id: string;
  status: string;
  signed_at?: string;
  signer_email?: string;
  signer_name?: string;
}

interface CertificateResponse {
  certificate_id: string;
  issued_at: string;
  signer_name: string;
  signer_email: string;
  valid: boolean;
  certificate_url?: string;
}

@Injectable()
export class PrivyIdService {
  private readonly logger = new Logger(PrivyIdService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly webhookSecret: string;
  private readonly isProduction: boolean;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("PRIVYID_API_KEY", "");
    this.apiUrl = this.configService.get<string>(
      "PRIVYID_API_URL",
      "https://api.privy.id/v1",
    );
    this.webhookSecret = this.configService.get<string>(
      "PRIVYID_WEBHOOK_SECRET",
      "",
    );
    this.isProduction =
      this.configService.get<string>("ESIGNATURE_ENABLED") === "true";

    // Configure axios instance for production mode
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    this.logger.log(
      `PrivyID Service initialized in ${this.isProduction ? "PRODUCTION" : "STUB"} mode`,
    );
  }

  /**
   * Send document for signature
   */
  async sendForSignature(
    data: SendSignatureRequest,
  ): Promise<SignatureResponse> {
    if (!this.isProduction) {
      return this.mockSignatureRequest(data);
    }

    try {
      const formData = new FormData();
      formData.append("document_url", data.documentUrl);
      formData.append("signer_name", data.signerName);
      formData.append("signer_email", data.signerEmail);
      if (data.signerPhone) {
        formData.append("signer_phone", data.signerPhone);
      }
      formData.append("document_title", data.documentTitle);
      formData.append(
        "callback_url",
        `${this.configService.get("APP_URL")}/api/esignature/webhook`,
      );

      const response = await this.axiosInstance.post(
        "/signature/send",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      this.logger.log(
        `Signature request sent: ${response.data.signature_request_id}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send signature request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get signature status
   */
  async getSignatureStatus(
    requestId: string,
  ): Promise<SignatureStatusResponse> {
    if (!this.isProduction) {
      return this.mockSignatureStatus(requestId);
    }

    try {
      const response = await this.axiosInstance.get(`/signature/${requestId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get signature status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Download signed document
   */
  async downloadSignedDocument(requestId: string): Promise<Buffer> {
    if (!this.isProduction) {
      return this.mockSignedDocument();
    }

    try {
      const response = await this.axiosInstance.get(
        `/signature/${requestId}/download`,
        {
          responseType: "arraybuffer",
        },
      );

      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error(`Failed to download signed document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get signature certificate
   */
  async getCertificate(requestId: string): Promise<CertificateResponse> {
    if (!this.isProduction) {
      return this.mockCertificate(requestId);
    }

    try {
      const response = await this.axiosInstance.get(
        `/signature/${requestId}/certificate`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get certificate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resend signature request
   */
  async resendSignatureRequest(requestId: string): Promise<SignatureResponse> {
    if (!this.isProduction) {
      return this.mockSignatureRequest({
        documentUrl: "mock-url",
        signerName: "Mock Signer",
        signerEmail: "mock@example.com",
        documentTitle: "Mock Document",
      });
    }

    try {
      const response = await this.axiosInstance.post(
        `/signature/${requestId}/resend`,
      );
      this.logger.log(`Signature request resent: ${requestId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to resend signature request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.isProduction) {
      // In stub mode, always return true
      return true;
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(payload)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      this.logger.error(`Failed to verify webhook signature: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if service is in production mode
   */
  isProductionMode(): boolean {
    return this.isProduction;
  }

  // ==================== STUB/MOCK METHODS ====================

  private mockSignatureRequest(data: SendSignatureRequest): SignatureResponse {
    const requestId = `SIG-STUB-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    this.logger.debug(`[STUB] Mock signature request created: ${requestId}`);
    this.logger.debug(`[STUB] Document: ${data.documentTitle}`);
    this.logger.debug(
      `[STUB] Signer: ${data.signerName} (${data.signerEmail})`,
    );

    return {
      signature_request_id: requestId,
      signature_url: `https://sign.privy.id/mock/${requestId}`,
      status: "sent",
      expires_at: expiresAt.toISOString(),
    };
  }

  private mockSignatureStatus(requestId: string): SignatureStatusResponse {
    this.logger.debug(`[STUB] Mock signature status for: ${requestId}`);

    // Simulate random status for testing
    const statuses = ["sent", "viewed", "signed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      signature_request_id: requestId,
      status: randomStatus,
      signed_at:
        randomStatus === "signed" ? new Date().toISOString() : undefined,
      signer_email: "mock-signer@example.com",
      signer_name: "Mock Signer",
    };
  }

  private mockSignedDocument(): Buffer {
    this.logger.debug(`[STUB] Mock signed document generated`);

    // Return a simple PDF header to simulate a real PDF
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Mock Signed Document - STUB MODE) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
411
%%EOF`;

    return Buffer.from(pdfContent);
  }

  private mockCertificate(requestId: string): CertificateResponse {
    const certificateId = `CERT-STUB-${Date.now()}`;

    this.logger.debug(`[STUB] Mock certificate generated: ${certificateId}`);

    return {
      certificate_id: certificateId,
      issued_at: new Date().toISOString(),
      signer_name: "Ahmad Rizki Maulana",
      signer_email: "ahmad.rizki@example.com",
      valid: true,
      certificate_url: `https://privy.id/certificates/mock/${certificateId}`,
    };
  }
}
