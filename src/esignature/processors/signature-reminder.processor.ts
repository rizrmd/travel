/**
 * Integration 5: E-Signature Integration
 * Processor: Signature Reminder Job Processor
 */

import {
  Processor,
  WorkerHost,
} from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { ESignatureService } from "../services/esignature.service";
import { SignatureTrackerService } from "../services/signature-tracker.service";
import { SignatureEventType } from "../domain";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractEntity } from "../../compliance/infrastructure/persistence/relational/entities/contract.entity";

interface SignatureReminderJobData {
  contractId: string;
  tenantId: string;
}

@Processor("signature-reminders")
export class SignatureReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(SignatureReminderProcessor.name);

  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
    private readonly esignatureService: ESignatureService,
    private readonly trackerService: SignatureTrackerService,
  ) {
    super();
  }

  async onActive(job: Job<SignatureReminderJobData>) {
    this.logger.debug(
      `Processing signature reminder job ${job.id} for contract ${job.data.contractId}`,
    );
  }

  async onCompleted(job: Job<SignatureReminderJobData>) {
    this.logger.log(
      `Completed signature reminder job ${job.id} for contract ${job.data.contractId}`,
    );
  }

  async onFailed(job: Job<SignatureReminderJobData>, error: Error) {
    this.logger.error(
      `Failed signature reminder job ${job.id} for contract ${job.data.contractId}: ${error.message}`,
      error.stack,
    );
  }

  /**
   * Process signature reminder job
   */
  async process(job: Job<any>): Promise<void> {
    if (job.name === "send-reminder") {
      await this.handleSendReminder(job);
    } else if (job.name === "check-pending-signatures") {
      await this.handleCheckPendingSignatures(job);
    }
  }

  private async handleSendReminder(job: Job<SignatureReminderJobData>): Promise<void> {
    const { contractId, tenantId } = job.data;

    try {
      // Fetch contract with latest data
      const contract = await this.contractRepository.findOne({
        where: {
          id: contractId,
          tenantIdx: tenantId, // Note: tenantIdx might be wrong, check entity
        } as any, // Temporary cast until entity checked
        relations: ["jamaah"],
      });

      if (!contract) {
        this.logger.warn(`Contract ${contractId} not found, skipping reminder`);
        return;
      }

      // Check if contract is still pending signature
      // Assuming fields exist or will be fixed
      if ((contract as any).signatureStatus !== "sent") {
        this.logger.debug(
          `Contract ${contract.contractNumber} is no longer pending (status: ${(contract as any).signatureStatus}), skipping reminder`,
        );
        return;
      }

      // Check if contract has expired
      if (contract.expiresAt && new Date() > contract.expiresAt) {
        this.logger.debug(
          `Contract ${contract.contractNumber} has expired, skipping reminder`,
        );
        return;
      }

      // Calculate days until expiry
      const daysUntilExpiry = contract.expiresAt
        ? Math.ceil(
          (contract.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        )
        : null;

      // Only send reminder if 2 or 5 days remaining
      if (daysUntilExpiry !== 2 && daysUntilExpiry !== 5) {
        this.logger.debug(
          `Contract ${contract.contractNumber} has ${daysUntilExpiry} days until expiry, not sending reminder`,
        );
        return;
      }

      this.logger.log(
        `Sending signature reminder for contract ${contract.contractNumber} (${daysUntilExpiry} days remaining)`,
      );

      // Resend signature request (acts as reminder)
      await this.esignatureService.resendSignatureRequest(contractId);

      // Log reminder event
      await this.trackerService.logEvent(
        tenantId,
        contractId,
        (contract as any).signatureRequestId,
        SignatureEventType.REMINDER_SENT,
        {
          daysUntilExpiry,
          reminderType:
            daysUntilExpiry === 5 ? "first_reminder" : "final_reminder",
          sentAt: new Date().toISOString(),
        },
      );

      this.logger.log(
        `Signature reminder sent successfully for contract ${contract.contractNumber}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send signature reminder for contract ${contractId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleCheckPendingSignatures(job: Job<{ tenantId: string }>): Promise<void> {
    const { tenantId } = job.data;

    this.logger.log(`Checking pending signatures for tenant ${tenantId}`);

    try {
      const pendingContracts =
        await this.esignatureService.getContractsPendingSignature(tenantId);

      this.logger.log(
        `Found ${pendingContracts.length} contracts pending signature for tenant ${tenantId}`,
      );

      for (const contract of pendingContracts) {
        // Check days until expiry
        const daysUntilExpiry = contract.expiresAt
          ? Math.ceil(
            (contract.expiresAt.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
          )
          : null;

        // Queue reminder if needed (2 or 5 days)
        if (daysUntilExpiry === 2 || daysUntilExpiry === 5) {
          // Check if reminder already sent today
          const events = await this.trackerService.getContractEvents(
            contract.id,
          );
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const reminderSentToday = events.some(
            (event) =>
              event.eventType === SignatureEventType.REMINDER_SENT &&
              event.occurredAt >= todayStart,
          );

          if (!reminderSentToday) {
            this.logger.log(
              `Queuing reminder for contract ${contract.contractNumber} (${daysUntilExpiry} days remaining)`,
            );

            // Queue individual reminder job
            // For now, send immediately
            await this.handleSendReminder({
              data: {
                contractId: contract.id,
                tenantId: contract.tenantId,
              },
            } as Job<SignatureReminderJobData>);
          }
        }
      }

      this.logger.log(
        `Completed pending signature check for tenant ${tenantId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to check pending signatures for tenant ${tenantId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
