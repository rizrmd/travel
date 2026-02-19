/**
 * Integration 4: Virtual Account Payment Gateway
 * Service: Midtrans API Integration
 *
 * Dual-mode operation:
 * - STUB MODE (VA_ENABLED=false): Returns mock VA numbers for testing
 * - PRODUCTION MODE (VA_ENABLED=true): Calls real Midtrans API
 */

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import * as crypto from "crypto";
import { BankCode } from "../domain/bank-code.enum";

interface CreateVaParams {
  orderId: string;
  amount: number;
  bankCode: BankCode;
  customerName: string;
  customerEmail?: string;
}

interface MidtransVaResponse {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  permata_va_number?: string;
  fraud_status?: string;
}

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private readonly serverKey: string;
  private readonly apiUrl: string;
  private readonly isProduction: boolean;
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.serverKey = this.configService.get<string>(
      "MIDTRANS_SERVER_KEY",
      "sandbox_key",
    );
    this.apiUrl = this.configService.get<string>(
      "MIDTRANS_API_URL",
      "https://api.sandbox.midtrans.com/v2",
    );
    this.isProduction =
      this.configService.get<string>("VA_ENABLED", "false") === "true";

    // Create axios instance with auth
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${this.getAuthToken()}`,
      },
      timeout: 30000, // 30 seconds
    });

    this.logger.log(
      `MidtransService initialized in ${this.isProduction ? "PRODUCTION" : "STUB"} mode`,
    );
  }

  /**
   * Create virtual account via Midtrans
   */
  async createVirtualAccount(
    params: CreateVaParams,
  ): Promise<MidtransVaResponse> {
    if (!this.isProduction) {
      this.logger.debug(`STUB MODE: Creating mock VA for ${params.bankCode}`);
      return this.mockVaResponse(params);
    }

    try {
      this.logger.debug(
        `Creating VA for order ${params.orderId}, bank: ${params.bankCode}`,
      );

      const payload = this.buildVaPayload(params);

      const response = await this.axiosInstance.post<MidtransVaResponse>(
        "/charge",
        payload,
      );

      this.logger.log(
        `VA created successfully: ${response.data.transaction_id}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to create VA: ${error.response?.data?.status_message || error.message}`,
      );
      throw new Error(
        `Midtrans API error: ${error.response?.data?.status_message || error.message}`,
      );
    }
  }

  /**
   * Get transaction status from Midtrans
   */
  async getTransactionStatus(orderId: string): Promise<MidtransVaResponse> {
    if (!this.isProduction) {
      this.logger.debug(`STUB MODE: Getting mock transaction status`);
      return this.mockTransactionStatus(orderId);
    }

    try {
      const response = await this.axiosInstance.get<MidtransVaResponse>(
        `/${orderId}/status`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get transaction status: ${error.response?.data?.status_message || error.message}`,
      );
      throw new Error(
        `Midtrans API error: ${error.response?.data?.status_message || error.message}`,
      );
    }
  }

  /**
   * Cancel transaction (expire VA)
   */
  async cancelTransaction(orderId: string): Promise<void> {
    if (!this.isProduction) {
      this.logger.debug(`STUB MODE: Cancelling transaction ${orderId}`);
      return;
    }

    try {
      await this.axiosInstance.post(`/${orderId}/cancel`);
      this.logger.log(`Transaction cancelled: ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Failed to cancel transaction: ${error.response?.data?.status_message || error.message}`,
      );
      throw new Error(
        `Midtrans API error: ${error.response?.data?.status_message || error.message}`,
      );
    }
  }

  /**
   * Verify webhook signature from Midtrans
   */
  verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    serverKey?: string,
  ): string {
    const key = serverKey || this.serverKey;
    const signatureString = `${orderId}${statusCode}${grossAmount}${key}`;
    return crypto.createHash("sha512").update(signatureString).digest("hex");
  }

  /**
   * Validate webhook notification signature
   */
  isSignatureValid(notification: any): boolean {
    const { order_id, status_code, gross_amount, signature_key } = notification;

    if (!signature_key) {
      this.logger.warn("No signature key provided in notification");
      return false;
    }

    const expectedSignature = this.verifySignature(
      order_id,
      status_code,
      gross_amount,
    );

    const isValid = signature_key === expectedSignature;

    if (!isValid) {
      this.logger.warn(
        `Invalid signature for order ${order_id}. Expected: ${expectedSignature}, Got: ${signature_key}`,
      );
    }

    return isValid;
  }

  /**
   * Build VA creation payload for Midtrans
   */
  private buildVaPayload(params: CreateVaParams): any {
    const basePayload = {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      customer_details: {
        first_name: params.customerName,
        email: params.customerEmail || "",
      },
    };

    // Bank-specific configuration
    if (params.bankCode === BankCode.PERMATA) {
      return {
        ...basePayload,
        bank_transfer: {
          bank: "permata",
        },
      };
    }

    // BCA, Mandiri, BNI, BRI
    return {
      ...basePayload,
      bank_transfer: {
        bank: params.bankCode,
      },
    };
  }

  /**
   * Get base64 encoded auth token
   */
  private getAuthToken(): string {
    return Buffer.from(`${this.serverKey}:`).toString("base64");
  }

  /**
   * STUB MODE: Generate mock VA response
   */
  private mockVaResponse(params: CreateVaParams): MidtransVaResponse {
    // Generate realistic VA numbers for each bank
    const vaNumbers: Record<BankCode, string> = {
      [BankCode.BCA]: this.generateMockVaNumber("BCA"),
      [BankCode.MANDIRI]: this.generateMockVaNumber("MANDIRI"),
      [BankCode.BNI]: this.generateMockVaNumber("BNI"),
      [BankCode.BRI]: this.generateMockVaNumber("BRI"),
      [BankCode.PERMATA]: this.generateMockVaNumber("PERMATA"),
    };

    const response: MidtransVaResponse = {
      transaction_id: `TRX-STUB-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      order_id: params.orderId,
      gross_amount: params.amount.toString(),
      payment_type: "bank_transfer",
      transaction_time: new Date().toISOString(),
      transaction_status: "pending",
      fraud_status: "accept",
    };

    if (params.bankCode === BankCode.PERMATA) {
      response.permata_va_number = vaNumbers[params.bankCode];
    } else {
      response.va_numbers = [
        {
          bank: params.bankCode,
          va_number: vaNumbers[params.bankCode],
        },
      ];
    }

    return response;
  }

  /**
   * STUB MODE: Generate mock transaction status
   */
  private mockTransactionStatus(orderId: string): MidtransVaResponse {
    return {
      transaction_id: `TRX-STUB-${Date.now()}`,
      order_id: orderId,
      gross_amount: "30000000",
      payment_type: "bank_transfer",
      transaction_time: new Date().toISOString(),
      transaction_status: "settlement",
      fraud_status: "accept",
    };
  }

  /**
   * Generate realistic mock VA numbers based on bank format
   */
  private generateMockVaNumber(bank: string): string {
    const timestamp = Date.now().toString().slice(-10);
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");

    switch (bank) {
      case "BCA":
        // BCA VA: 11 digits
        return `${timestamp}${random.slice(0, 1)}`;

      case "MANDIRI":
        // Mandiri VA: 14 digits (company code + unique number)
        return `88001${timestamp}${random}`.slice(0, 14);

      case "BNI":
        // BNI VA: 10 digits
        return `${timestamp}`;

      case "BRI":
        // BRI VA: 14 digits
        return `${timestamp}${random}`;

      case "PERMATA":
        // Permata VA: 13 digits
        return `${timestamp}${random.slice(0, 3)}`;

      default:
        return timestamp;
    }
  }

  /**
   * Get integration status
   */
  getStatus(): {
    mode: string;
    enabled: boolean;
    apiUrl: string;
    hasCredentials: boolean;
  } {
    return {
      mode: this.isProduction ? "PRODUCTION" : "STUB",
      enabled: this.isProduction,
      apiUrl: this.apiUrl,
      hasCredentials: this.serverKey !== "sandbox_key",
    };
  }
}
