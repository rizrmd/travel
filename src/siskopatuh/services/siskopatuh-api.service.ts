/**
 * Integration 6: SISKOPATUH API Service
 * Handles communication with SISKOPATUH government API
 *
 * STUB MODE: Returns mock responses when SISKOPATUH_ENABLED=false
 * PRODUCTION MODE: Makes actual API calls to government system
 */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import {
  JamaahRegistrationDto,
  DepartureManifestDto,
  ReturnManifestDto,
} from "../dto";

interface SiskopatuhApiResponse {
  success: boolean;
  referenceNumber: string;
  status: string;
  timestamp: string;
  message: string;
  data?: any;
}

@Injectable()
export class SiskopatuhApiService {
  private readonly logger = new Logger(SiskopatuhApiService.name);
  private readonly isProduction: boolean;
  private readonly apiClient: AxiosInstance;
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly agencyCode: string;

  constructor(private readonly configService: ConfigService) {
    this.isProduction =
      this.configService.get("SISKOPATUH_ENABLED", "false") === "true";
    this.apiUrl = this.configService.get("SISKOPATUH_API_URL", "");
    this.apiKey = this.configService.get("SISKOPATUH_API_KEY", "");
    this.agencyCode = this.configService.get("SISKOPATUH_AGENCY_CODE", "");

    if (this.isProduction && !this.apiUrl) {
      throw new Error("SISKOPATUH_API_URL is required in production mode");
    }

    // Initialize axios client
    this.apiClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (this.isProduction) {
      this.logger.log("SISKOPATUH API Service initialized in PRODUCTION mode");
    } else {
      this.logger.warn("SISKOPATUH API Service initialized in STUB mode");
    }
  }

  /**
   * Submit jamaah registration to SISKOPATUH
   */
  async submitJamaahRegistration(
    data: JamaahRegistrationDto,
  ): Promise<SiskopatuhApiResponse> {
    if (!this.isProduction) {
      return this.mockSubmissionResponse(
        "JMRH-" + Date.now(),
        "accepted",
        "STUB MODE - Jamaah registration diterima (simulasi)",
      );
    }

    try {
      const response = await this.apiClient.post("/jamaah/register", data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Agency-Code": this.agencyCode,
        },
      });

      this.logger.log(
        `Jamaah registration submitted successfully: ${response.data.referenceNumber}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to submit jamaah registration: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Submit departure manifest to SISKOPATUH
   */
  async submitDepartureManifest(
    data: DepartureManifestDto,
  ): Promise<SiskopatuhApiResponse> {
    if (!this.isProduction) {
      return this.mockSubmissionResponse(
        "DEPT-" + Date.now(),
        "accepted",
        "STUB MODE - Departure manifest diterima (simulasi)",
      );
    }

    try {
      const response = await this.apiClient.post("/manifest/departure", data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Agency-Code": this.agencyCode,
        },
      });

      this.logger.log(
        `Departure manifest submitted successfully: ${response.data.referenceNumber}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to submit departure manifest: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Submit return manifest to SISKOPATUH
   */
  async submitReturnManifest(
    data: ReturnManifestDto,
  ): Promise<SiskopatuhApiResponse> {
    if (!this.isProduction) {
      return this.mockSubmissionResponse(
        "RETN-" + Date.now(),
        "accepted",
        "STUB MODE - Return manifest diterima (simulasi)",
      );
    }

    try {
      const response = await this.apiClient.post("/manifest/return", data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Agency-Code": this.agencyCode,
        },
      });

      this.logger.log(
        `Return manifest submitted successfully: ${response.data.referenceNumber}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to submit return manifest: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Check submission status by reference number
   */
  async checkSubmissionStatus(
    referenceNumber: string,
  ): Promise<SiskopatuhApiResponse> {
    if (!this.isProduction) {
      return this.mockSubmissionResponse(
        referenceNumber,
        "accepted",
        "STUB MODE - Status check (simulasi)",
      );
    }

    try {
      const response = await this.apiClient.get(
        `/submission/${referenceNumber}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "X-Agency-Code": this.agencyCode,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to check submission status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.isProduction) {
      // In stub mode, accept all webhooks
      return true;
    }

    try {
      const crypto = require("crypto");
      const webhookSecret = this.configService.get(
        "SISKOPATUH_WEBHOOK_SECRET",
        "",
      );

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");

      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      this.logger.error(`Failed to verify webhook signature: ${error.message}`);
      return false;
    }
  }

  /**
   * Get integration status
   */
  getIntegrationStatus(): {
    enabled: boolean;
    mode: string;
    apiUrl: string;
    agencyCode: string;
  } {
    return {
      enabled: this.isProduction,
      mode: this.isProduction ? "PRODUCTION" : "STUB",
      apiUrl: this.apiUrl,
      agencyCode: this.agencyCode || "NOT_CONFIGURED",
    };
  }

  /**
   * Mock submission response for stub mode
   */
  private mockSubmissionResponse(
    referenceNumber: string,
    status: string,
    message: string,
  ): SiskopatuhApiResponse {
    this.logger.debug(`Mock response generated: ${referenceNumber}`);

    return {
      success: true,
      referenceNumber,
      status,
      timestamp: new Date().toISOString(),
      message,
      data: {
        stub_mode: true,
        note: "This is a simulated response. Activate SISKOPATUH_ENABLED for production mode.",
      },
    };
  }
}
