/**
 * Epic 12, Story 12.1 & 12.2: Contracts Controller
 * 9 endpoints for contract management
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { ContractGeneratorService } from "../services/contract-generator.service";
import { ContractPdfService } from "../services/contract-pdf.service";
import { EsignatureService } from "../services/esignature.service";
import { AuditLogService } from "../services/audit-log.service";
import {
  GenerateContractDto,
  ContractResponseDto,
  SendForSignatureDto,
  SignatureStatusResponseDto,
  ContractTemplateVariablesDto,
} from "../dto";
import { ContractStatus, Contract } from "../domain/contract";
import { AuditAction, ActorRole } from "../domain/audit-log";

@ApiTags("Compliance - Contracts")
@ApiBearerAuth()
@Controller("api/v1/compliance/contracts")
export class ContractsController {
  constructor(
    private contractGeneratorService: ContractGeneratorService,
    private contractPdfService: ContractPdfService,
    private esignatureService: EsignatureService,
    private auditLogService: AuditLogService,
  ) {}

  @Post("generate")
  @ApiOperation({ summary: "Generate contract from template" })
  @ApiResponse({ status: 201, type: ContractResponseDto })
  async generateContract(
    @Req() req: any,
    @Body() dto: GenerateContractDto,
  ): Promise<ContractResponseDto> {
    const tenantId = req.user.tenantId;
    const contractType =
      dto.contractType || Contract.determineContractType("standard");

    const contract = await this.contractGeneratorService.generateContract(
      tenantId,
      dto.jamaahId,
      dto.packageId,
      contractType,
      dto.templateVersion || "1.0",
    );

    // Log contract generation
    await this.auditLogService.logContractOperation({
      tenantId,
      contractId: contract.id,
      action: AuditAction.CONTRACT_GENERATED,
      actorId: req.user.id,
      actorRole: req.user.role as ActorRole,
      actorName: req.user.name,
      afterState: {
        contractNumber: contract.contractNumber,
        status: contract.status,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return contract as any;
  }

  @Get()
  @ApiOperation({ summary: "List contracts" })
  @ApiResponse({ status: 200, type: [ContractResponseDto] })
  async listContracts(
    @Req() req: any,
    @Query("jamaahId") jamaahId?: string,
    @Query("status") status?: ContractStatus,
  ): Promise<ContractResponseDto[]> {
    const tenantId = req.user.tenantId;

    const contracts = await this.contractGeneratorService.listContracts(
      tenantId,
      {
        jamaahId,
        status,
      },
    );

    return contracts as any;
  }

  @Get(":id")
  @ApiOperation({ summary: "Get contract details" })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async getContract(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<ContractResponseDto> {
    const tenantId = req.user.tenantId;
    const contract = await this.contractGeneratorService.getContractById(
      tenantId,
      id,
    );
    return contract as any;
  }

  @Get(":id/pdf")
  @ApiOperation({ summary: "Download contract PDF" })
  @ApiResponse({ status: 200, description: "PDF file" })
  async downloadPDF(
    @Req() req: any,
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<void> {
    const tenantId = req.user.tenantId;
    const contract = await this.contractGeneratorService.getContractById(
      tenantId,
      id,
    );

    if (!contract.contractUrl) {
      throw new NotFoundException("Contract PDF not yet generated");
    }

    // In production, fetch from S3 or storage
    // For now, generate on-the-fly
    const pdfBuffer = await this.contractPdfService.generateIslamicDesignPDF(
      "Contract content",
      contract.contractNumber,
      contract.status === ContractStatus.DRAFT,
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contract-${contract.contractNumber}.pdf`,
    );
    res.send(pdfBuffer);
  }

  @Post(":id/send")
  @ApiOperation({ summary: "Send contract for signature" })
  @ApiResponse({ status: 200, type: [SignatureStatusResponseDto] })
  async sendForSignature(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: SendForSignatureDto,
  ): Promise<SignatureStatusResponseDto[]> {
    const tenantId = req.user.tenantId;

    // Update contract status to SENT
    await this.contractGeneratorService.updateContractStatus(
      tenantId,
      id,
      ContractStatus.SENT,
    );

    // Send for signature (stub - returns 501)
    const signatures = await this.esignatureService.sendForSignature(
      tenantId,
      id,
      dto.signers,
      dto.signatureProvider,
    );

    // Log contract sent
    await this.auditLogService.logContractOperation({
      tenantId,
      contractId: id,
      action: AuditAction.CONTRACT_SENT,
      actorId: req.user.id,
      actorRole: req.user.role as ActorRole,
      actorName: req.user.name,
      metadata: { signersCount: dto.signers.length },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return signatures as any;
  }

  @Get(":id/status")
  @ApiOperation({ summary: "Check contract signature status" })
  @ApiResponse({ status: 200, type: [SignatureStatusResponseDto] })
  async checkSignatureStatus(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<SignatureStatusResponseDto[]> {
    const tenantId = req.user.tenantId;

    // In production, fetch signatures from database
    return [] as any;
  }

  @Post(":id/resend")
  @ApiOperation({ summary: "Resend signature request" })
  @ApiResponse({ status: 200 })
  async resendSignatureRequest(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<{ message: string }> {
    const tenantId = req.user.tenantId;

    // Stub - returns 501
    await this.esignatureService.resendSignatureRequest(tenantId, id);

    return { message: "Signature request resent successfully" };
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel contract" })
  @ApiResponse({ status: 200, type: ContractResponseDto })
  async cancelContract(
    @Req() req: any,
    @Param("id") id: string,
  ): Promise<ContractResponseDto> {
    const tenantId = req.user.tenantId;

    const contract = await this.contractGeneratorService.cancelContract(
      tenantId,
      id,
    );

    // Log cancellation
    await this.auditLogService.logContractOperation({
      tenantId,
      contractId: id,
      action: AuditAction.CONTRACT_CANCELLED,
      actorId: req.user.id,
      actorRole: req.user.role as ActorRole,
      actorName: req.user.name,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return contract as any;
  }

  @Get("templates/list")
  @ApiOperation({ summary: "List available contract templates" })
  @ApiResponse({ status: 200 })
  async listTemplates(): Promise<{ templates: string[] }> {
    return {
      templates: [
        "wakalah-bil-ujrah-economy",
        "wakalah-bil-ujrah-standard",
        "wakalah-bil-ujrah-premium",
      ],
    };
  }
}
