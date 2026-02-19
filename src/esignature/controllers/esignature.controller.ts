/**
 * Integration 5: E-Signature Integration
 * Controller: E-Signature Management
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { ESignatureService } from "../services/esignature.service";
import { SignatureTrackerService } from "../services/signature-tracker.service";
import { SignatureResponseDto, SignatureStatusResponseDto } from "../dto/signature-response.dto";
import { SignatureStatus } from "../../compliance/domain/contract";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../auth/guards/permissions.guard";
import { RequirePermissions } from "../../auth/decorators/permissions.decorator";

@ApiTags("E-Signature")
@Controller("esignature")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ESignatureController {
  constructor(
    private readonly esignatureService: ESignatureService,
    private readonly trackerService: SignatureTrackerService,
  ) { }

  @Post("contracts/:id/send")
  @HttpCode(HttpStatus.OK)
  @RequirePermissions("contracts:send-signature")
  @ApiOperation({
    summary: "Send contract for digital signature",
    description:
      "Send a contract to PrivyID for digital signature by jamaah. " +
      "Creates a signature request and sends email to signer.",
  })
  @ApiParam({
    name: "id",
    description: "Contract UUID",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Contract sent for signature successfully",
    type: SignatureResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Contract not found",
  })
  @ApiResponse({
    status: 400,
    description: "Contract already signed or invalid state",
  })
  async sendForSignature(
    @Param("id") contractId: string,
  ): Promise<{ success: boolean; data: SignatureResponseDto }> {
    const contract =
      await this.esignatureService.sendContractForSignature(contractId);

    return {
      success: true,
      data: {
        contractId: contract.id,
        signatureRequestId: contract.signatureRequestId,
        signatureUrl: contract.signatureUrl,
        status: contract.signatureStatus as any,
        expiresAt: contract.expiresAt,
        sentAt: contract.sentAt,
        signedAt: (contract as any).signedAt,
        signedDocumentUrl: (contract as any).signedDocumentUrl,
        signatureCertificateUrl: (contract as any).signatureCertificateUrl,
      },
    };
  }

  @Post("contracts/:id/resend")
  @HttpCode(HttpStatus.OK)
  @RequirePermissions("contracts:send-signature")
  @ApiOperation({
    summary: "Resend signature request",
    description:
      "Resend signature request email to jamaah. " +
      "Can be used as a reminder for pending signatures.",
  })
  @ApiParam({
    name: "id",
    description: "Contract UUID",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Signature request resent successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Contract not found",
  })
  @ApiResponse({
    status: 400,
    description: "Contract already signed",
  })
  async resendSignature(
    @Param("id") contractId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.esignatureService.resendSignatureRequest(contractId);

    return {
      success: true,
      message: "Signature request resent successfully",
    };
  }

  @Get("contracts/:id/status")
  @RequirePermissions("contracts:read")
  @ApiOperation({
    summary: "Get signature status for contract",
    description:
      "Fetch current signature status from PrivyID and return contract signature details.",
  })
  @ApiParam({
    name: "id",
    description: "Contract UUID",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Signature status retrieved successfully",
    type: SignatureResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Contract not found",
  })
  async getSignatureStatus(
    @Param("id") contractId: string,
  ): Promise<{ success: boolean; data: SignatureResponseDto }> {
    const contract =
      await this.esignatureService.getSignatureStatus(contractId);

    return {
      success: true,
      data: {
        contractId: contract.id,
        signatureRequestId: contract.signatureRequestId,
        signatureUrl: contract.signatureUrl,
        status: contract.signatureStatus as any,
        expiresAt: contract.expiresAt,
        sentAt: contract.sentAt,
        signedAt: (contract as any).signedAt,
        signedDocumentUrl: (contract as any).signedDocumentUrl,
        signatureCertificateUrl: (contract as any).signatureCertificateUrl,
      },
    };
  }

  @Get("contracts/:id/events")
  @RequirePermissions("contracts:read")
  @ApiOperation({
    summary: "Get signature events for contract",
    description:
      "Get audit trail of all signature events (sent, viewed, signed, etc.) for a contract.",
  })
  @ApiParam({
    name: "id",
    description: "Contract UUID",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Signature events retrieved successfully",
  })
  async getSignatureEvents(
    @Param("id") contractId: string,
  ): Promise<{ success: boolean; data: any[] }> {
    const events = await this.trackerService.getContractEvents(contractId);

    return {
      success: true,
      data: events.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        occurredAt: event.occurredAt,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        eventData: event.eventData,
      })),
    };
  }

  @Get("status")
  @ApiOperation({
    summary: "Get e-signature integration status",
    description:
      "Get current status of e-signature integration including mode (STUB/PRODUCTION) and features.",
  })
  @ApiResponse({
    status: 200,
    description: "Integration status retrieved successfully",
    type: SignatureStatusResponseDto,
  })
  async getIntegrationStatus(): Promise<{
    success: boolean;
    data: SignatureStatusResponseDto;
  }> {
    const enabled = this.esignatureService.isIntegrationEnabled();
    const mode = this.esignatureService.getIntegrationMode();

    return {
      success: true,
      data: {
        enabled,
        mode,
        provider: "PrivyID",
        features: [
          "digital_signature",
          "certificate",
          "audit_trail",
          "webhook_events",
        ],
      },
    };
  }
}
