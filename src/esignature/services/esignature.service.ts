/**
 * Integration 5: E-Signature Integration
 * Service: Main E-Signature Service with Contract Signing Workflow
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ContractEntity } from "../../compliance/infrastructure/persistence/relational/entities/contract.entity";
import { SignatureEventEntity } from "../entities/signature-event.entity";
import { PrivyIdService } from "./privy-id.service";
import { SignatureTrackerService } from "./signature-tracker.service";
import { AppWebSocketGateway as WsGateway } from "../../websocket/websocket.gateway";
import { WebSocketEventType } from "../../websocket/types/websocket-events.type";
import { SignatureEventType } from "../domain";
import { SignatureStatus } from "../../compliance/domain/contract";
import { SignatureWebhookDto } from "../dto";

@Injectable()
export class ESignatureService {
  private readonly logger = new Logger(ESignatureService.name);

  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    @InjectRepository(SignatureEventEntity)
    private readonly eventRepository: Repository<SignatureEventEntity>,
    private readonly privyIdService: PrivyIdService,
    private readonly trackerService: SignatureTrackerService,
    private readonly wsGateway: WsGateway,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Send contract for digital signature
   */
  async sendContractForSignature(contractId: string): Promise<ContractEntity> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ["jamaah", "package"],
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    // Validate contract is ready for signature
    if (contract.signatureStatus === SignatureStatus.SIGNED) {
      throw new BadRequestException("Contract already signed");
    }

    if (!contract.contractUrl) {
      throw new BadRequestException(
        "Contract PDF must be generated before sending for signature",
      );
    }

    if (!contract.jamaah) {
      throw new BadRequestException("Contract must have associated jamaah");
    }

    // Prepare signature request data
    const signerEmail = contract.signerEmail || contract.jamaah.email;
    const signerPhone = contract.signerPhone || contract.jamaah.phone;
    const signerName = contract.jamaah.name;
    const documentTitle = `Akad Wakalah bil Ujrah - ${contract.contractNumber}`;

    this.logger.log(
      `Sending contract ${contract.contractNumber} for signature to ${signerEmail}`,
    );

    try {
      // Send to PrivyID
      const response = await this.privyIdService.sendForSignature({
        documentUrl: contract.contractUrl,
        signerName,
        signerEmail,
        signerPhone,
        documentTitle,
      });

      // Calculate expiry date
      const expiryDays = parseInt(
        this.configService.get<string>("ESIGNATURE_EXPIRY_DAYS", "7"),
        10,
      );
      const expiresAt = new Date(response.expires_at);

      // Update contract with signature information
      const updatedContract = await this.contractRepository.save({
        ...contract,
        signatureRequestId: response.signature_request_id,
        signatureStatus: SignatureStatus.SENT,
        signerEmail,
        signerPhone,
        signatureUrl: response.signature_url,
        sentAt: new Date(),
        expiresAt,
      });

      // Log signature event
      await this.trackerService.logEvent(
        contract.tenantId,
        contract.id,
        response.signature_request_id,
        SignatureEventType.SENT,
        {
          signerEmail,
          signerName,
          expiresAt: expiresAt.toISOString(),
          provider: "PrivyID",
        },
      );

      // Emit WebSocket event
      await this.wsGateway.broadcastToTenant(contract.tenantId, {
        type: WebSocketEventType.SIGNATURE_SENT,
        tenantId: contract.tenantId,
        timestamp: new Date(),
        entityType: "contract",
        entityId: contract.id,
        data: {
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          signatureRequestId: response.signature_request_id,
          jamaahId: contract.jamaahId,
          signerEmail,
          expiresAt: expiresAt.toISOString(),
        },
      });

      // TODO: Send email to jamaah with signature link
      // await this.emailService.sendSignatureRequest(signerEmail, {
      //   jamaahName: signerName,
      //   contractNumber: contract.contractNumber,
      //   signatureUrl: response.signature_url,
      //   expiresAt,
      // });

      this.logger.log(
        `Contract ${contract.contractNumber} sent for signature. Request ID: ${response.signature_request_id}`,
      );

      return updatedContract as unknown as ContractEntity;
    } catch (error) {
      this.logger.error(
        `Failed to send contract ${contract.contractNumber} for signature: ${error.message}`,
        error.stack,
      );

      // Update contract status to failed
      await this.contractRepository.update(contract.id, {
        signatureStatus: SignatureStatus.FAILED,
      });

      throw error;
    }
  }

  /**
   * Handle signature webhook from PrivyID
   */
  async handleSignatureWebhook(webhook: SignatureWebhookDto): Promise<void> {
    const { signature_request_id, event, signed_at, signer_email } = webhook;

    this.logger.log(
      `Processing webhook: ${event} for signature request ${signature_request_id}`,
    );

    // Find contract by signature request ID
    const contract = await this.contractRepository.findOne({
      where: { signatureRequestId: signature_request_id },
      relations: ["jamaah"],
    });

    if (!contract) {
      throw new NotFoundException(
        `Contract not found for signature request: ${signature_request_id}`,
      );
    }

    // Log the event
    await this.trackerService.logEvent(
      contract.tenantId,
      contract.id,
      signature_request_id,
      event,
      webhook.metadata || {},
      webhook.ip_address,
      webhook.user_agent,
    );

    // Process event based on type
    switch (event) {
      case SignatureEventType.SIGNED:
        await this.handleSignedEvent(contract, webhook);
        break;

      case SignatureEventType.DECLINED:
        await this.handleDeclinedEvent(contract, webhook);
        break;

      case SignatureEventType.EXPIRED:
        await this.handleExpiredEvent(contract, webhook);
        break;

      case SignatureEventType.VIEWED:
      case SignatureEventType.OPENED:
        // Just log these events, no contract update needed
        this.logger.debug(
          `Contract ${contract.contractNumber} ${event} by ${signer_email}`,
        );
        break;

      default:
        this.logger.warn(`Unknown event type: ${event}`);
    }

    // Emit WebSocket event for all event types
    await this.wsGateway.broadcastToTenant(contract.tenantId, {
      type: `signature.${event}` as any,
      tenantId: contract.tenantId,
      timestamp: new Date(),
      entityType: "contract",
      entityId: contract.id,
      data: {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        signatureRequestId: signature_request_id,
        jamaahId: contract.jamaahId,
        eventType: event,
        occurredAt: webhook.occurred_at || new Date().toISOString(),
      },
    });
  }

  /**
   * Handle signed event - download signed document and certificate
   */
  private async handleSignedEvent(
    contract: ContractEntity,
    webhook: SignatureWebhookDto,
  ): Promise<void> {
    this.logger.log(
      `Processing signed event for contract ${contract.contractNumber}`,
    );

    try {
      // Download signed document
      const signedPdf = await this.privyIdService.downloadSignedDocument(
        webhook.signature_request_id,
      );

      // TODO: Upload to S3/file storage
      // const signedUrl = await this.fileStorageService.upload(
      //   signedPdf,
      //   `contracts/signed/${contract.contractNumber}_signed.pdf`,
      //   'application/pdf',
      // );
      const signedUrl = `[STUB] /uploads/contracts/signed/${contract.contractNumber}_signed.pdf`;

      // Get certificate
      const certificate = await this.privyIdService.getCertificate(
        webhook.signature_request_id,
      );

      // TODO: Upload certificate to S3/file storage
      // const certUrl = await this.fileStorageService.upload(
      //   Buffer.from(JSON.stringify(certificate)),
      //   `contracts/certificates/${contract.contractNumber}_cert.json`,
      //   'application/json',
      // );
      const certUrl = `[STUB] /uploads/contracts/certificates/${contract.contractNumber}_cert.json`;

      // Update contract
      await this.contractRepository.update(contract.id, {
        signatureStatus: SignatureStatus.SIGNED,
        signedDocumentUrl: signedUrl,
        signatureCertificateUrl: certUrl,
        signedAt: new Date(webhook.signed_at || Date.now()),
      });

      // Log certificate generation event
      await this.trackerService.logEvent(
        contract.tenantId,
        contract.id,
        webhook.signature_request_id,
        SignatureEventType.CERTIFICATE_GENERATED,
        {
          certificateId: certificate.certificate_id,
          certificateUrl: certUrl,
        },
      );

      // TODO: Send confirmation email
      // await this.emailService.sendSignatureConfirmation(
      //   contract.jamaah.email,
      //   {
      //     jamaahName: contract.jamaah.name,
      //     contractNumber: contract.contractNumber,
      //     signedAt: new Date(webhook.signed_at),
      //     downloadUrl: signedUrl,
      //   },
      // );

      this.logger.log(
        `Contract ${contract.contractNumber} successfully signed and processed`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process signed event for contract ${contract.contractNumber}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Handle declined event
   */
  private async handleDeclinedEvent(
    contract: ContractEntity,
    webhook: SignatureWebhookDto,
  ): Promise<void> {
    this.logger.log(`Contract ${contract.contractNumber} declined by signer`);

    await this.contractRepository.update(contract.id, {
      signatureStatus: SignatureStatus.DECLINED,
    });

    // TODO: Send notification to agency
    // await this.emailService.sendSignatureDeclinedNotification(
    //   contract.tenantId,
    //   {
    //     contractNumber: contract.contractNumber,
    //     jamaahName: contract.jamaah.name,
    //     declinedAt: new Date(),
    //   },
    // );
  }

  /**
   * Handle expired event
   */
  private async handleExpiredEvent(
    contract: ContractEntity,
    webhook: SignatureWebhookDto,
  ): Promise<void> {
    this.logger.log(
      `Contract ${contract.contractNumber} signature request expired`,
    );

    await this.contractRepository.update(contract.id, {
      signatureStatus: SignatureStatus.EXPIRED,
    });

    // TODO: Send notification to agency
    // await this.emailService.sendSignatureExpiredNotification(
    //   contract.tenantId,
    //   {
    //     contractNumber: contract.contractNumber,
    //     jamaahName: contract.jamaah.name,
    //     expiredAt: new Date(),
    //   },
    // );
  }

  /**
   * Resend signature request
   */
  async resendSignatureRequest(contractId: string): Promise<ContractEntity> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ["jamaah"],
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    if (contract.signatureStatus === SignatureStatus.SIGNED) {
      throw new BadRequestException("Contract already signed, cannot resend");
    }

    if (!contract.signatureRequestId) {
      // No previous request, send new one
      return await this.sendContractForSignature(contractId);
    }

    // Resend existing request
    try {
      const response = await this.privyIdService.resendSignatureRequest(
        contract.signatureRequestId,
      );

      // Update sent timestamp
      await this.contractRepository.update(contract.id, {
        signatureStatus: SignatureStatus.SENT,
        sentAt: new Date(),
      });

      // Log reminder event
      await this.trackerService.logEvent(
        contract.tenantId,
        contract.id,
        contract.signatureRequestId,
        SignatureEventType.REMINDER_SENT,
        {
          resentAt: new Date().toISOString(),
        },
      );

      this.logger.log(
        `Signature request resent for contract ${contract.contractNumber}`,
      );

      return contract;
    } catch (error) {
      this.logger.error(
        `Failed to resend signature request for contract ${contract.contractNumber}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get signature status for a contract
   */
  async getSignatureStatus(contractId: string): Promise<ContractEntity> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: ["jamaah"],
    });

    if (!contract) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    // If we have a signature request, fetch latest status from PrivyID
    if (
      contract.signatureRequestId &&
      contract.signatureStatus !== SignatureStatus.SIGNED
    ) {
      try {
        const status = await this.privyIdService.getSignatureStatus(
          contract.signatureRequestId,
        );

        // Update local status if changed
        if (status.status !== contract.signatureStatus) {
          await this.contractRepository.update(contract.id, {
            signatureStatus: status.status as any,
          });
          contract.signatureStatus = status.status as any;
        }
      } catch (error) {
        this.logger.warn(
          `Failed to fetch signature status from PrivyID: ${error.message}`,
        );
        // Return local status if remote fetch fails
      }
    }

    return contract;
  }

  /**
   * Get contracts pending signature (for reminder processing)
   */
  async getContractsPendingSignature(
    tenantId: string,
  ): Promise<ContractEntity[]> {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return await this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("contract.signature_status = :status", {
        status: SignatureStatus.SENT,
      })
      .andWhere("contract.expires_at > :now", { now: new Date() })
      .andWhere("contract.sent_at <= :twoDaysAgo", { twoDaysAgo })
      .getMany();
  }

  /**
   * Check if integration is enabled
   */
  isIntegrationEnabled(): boolean {
    return this.configService.get<string>("ESIGNATURE_ENABLED") === "true";
  }

  /**
   * Get integration mode (STUB or PRODUCTION)
   */
  getIntegrationMode(): "STUB" | "PRODUCTION" {
    return this.isIntegrationEnabled() ? "PRODUCTION" : "STUB";
  }
}
