/**
 * Epic 12, Story 12.6: SISKOPATUH Service (Stub for Phase 2)
 */

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { SiskopathSubmissionDto, SiskopathStatusResponseDto } from "../dto";

@Injectable()
export class SiskopathService {
  /**
   * Submit report to SISKOPATUH (STUB - returns 501)
   */
  async submitReport(
    tenantId: string,
    submission: SiskopathSubmissionDto,
  ): Promise<{ submissionId: string }> {
    throw new HttpException(
      {
        statusCode: 501,
        message: "SISKOPATUH integration coming in Phase 2",
        details: {
          estimatedLaunch: "Q2 2025",
          requiredFields: [
            "periodStart",
            "periodEnd",
            "totalJamaah",
            "totalContracts",
            "totalRevenue",
            "agencyName",
            "agencyNpwp",
          ],
          documentationUrl: "/docs/compliance/siskopatuh-integration.md",
        },
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  /**
   * Check submission status (STUB - returns 501)
   */
  async checkStatus(tenantId: string): Promise<SiskopathStatusResponseDto> {
    return {
      available: false,
      message: "Integration coming in Phase 2",
      estimatedLaunch: "Q2 2025",
      submissionId: null,
      status: null,
    };
  }

  /**
   * Register for launch notification
   */
  async notifyMe(
    tenantId: string,
    email: string,
  ): Promise<{ success: boolean }> {
    // Store email for notification (placeholder)
    return { success: true };
  }

  /**
   * Get integration information
   */
  async getInfo(): Promise<{
    status: string;
    estimatedLaunch: string;
    documentation: string;
  }> {
    return {
      status: "Coming Soon",
      estimatedLaunch: "Q2 2025",
      documentation: "/docs/compliance/siskopatuh-integration.md",
    };
  }
}
