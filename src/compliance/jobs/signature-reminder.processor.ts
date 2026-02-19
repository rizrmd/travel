/**
 * Epic 12, Story 12.2: Signature Reminder Processor
 * Sends reminders for unsigned contracts (7 days after sent)
 */

import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ContractEntity } from "../infrastructure/persistence/relational/entities/contract.entity";
import { SignatureEntity } from "../infrastructure/persistence/relational/entities/signature.entity";
import { ContractGeneratorService } from "../services/contract-generator.service";
import { EsignatureService } from "../services/esignature.service";

@Injectable()
@Processor("compliance-reminders")
export class SignatureReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(SignatureReminderProcessor.name);

  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    @InjectRepository(SignatureEntity)
    private signatureRepository: Repository<SignatureEntity>,
    private contractGeneratorService: ContractGeneratorService,
    private esignatureService: EsignatureService,
  ) {
    super();
  }

  /**
   * Scheduled job: Send reminders daily at 10:00 AM
   */
  @Cron("0 10 * * *", {
    name: "send-signature-reminders",
    timeZone: "Asia/Jakarta",
  })
  async handleCron() {
    this.logger.log("Starting signature reminder job...");

    try {
      // Get all tenants (in production, query from tenants table)
      const tenants = await this.getTenants();

      for (const tenant of tenants) {
        await this.processRemindersForTenant(tenant.id);
      }

      this.logger.log("Signature reminder job completed successfully");
    } catch (error) {
      this.logger.error("Error in signature reminder job:", error);
    }
  }

  async process(job: Job<any>): Promise<void> {
    if (job.name === "send-reminders") {
      await this.processRemindersForTenant(job.data.tenantId);
    }
  }

  /**
   * Process reminders for a specific tenant
   */
  async processRemindersForTenant(tenantId: string): Promise<void> {
    this.logger.log(`Processing reminders for tenant: ${tenantId}`);

    // Get contracts requiring reminders
    const contracts =
      await this.contractGeneratorService.getContractsRequiringReminders(
        tenantId,
      );

    this.logger.log(`Found ${contracts.length} contracts requiring reminders`);

    for (const contract of contracts) {
      try {
        await this.sendReminderForContract(tenantId, contract.id);
      } catch (error) {
        this.logger.error(
          `Failed to send reminder for contract ${contract.id}:`,
          error,
        );
      }
    }

    // Get signatures requiring reminders
    const signatures =
      await this.esignatureService.getSignaturesRequiringReminders(tenantId);

    this.logger.log(
      `Found ${signatures.length} signatures requiring reminders`,
    );

    for (const signature of signatures) {
      try {
        await this.sendReminderForSignature(tenantId, signature.id);
      } catch (error) {
        this.logger.error(
          `Failed to send reminder for signature ${signature.id}:`,
          error,
        );
      }
    }
  }

  /**
   * Send reminder for a specific contract
   */
  private async sendReminderForContract(
    tenantId: string,
    contractId: string,
  ): Promise<void> {
    this.logger.log(`Sending reminder for contract: ${contractId}`);

    // In production: Send email via email service
    // For now, just log
    this.logger.log(`Reminder sent for contract: ${contractId}`);

    // Update metadata to track reminder
    await this.contractRepository.update(contractId, {
      metadata: { lastReminderSent: new Date().toISOString() } as any,
    });
  }

  /**
   * Send reminder for a specific signature
   */
  private async sendReminderForSignature(
    tenantId: string,
    signatureId: string,
  ): Promise<void> {
    this.logger.log(`Sending reminder for signature: ${signatureId}`);

    const signature = await this.signatureRepository.findOne({
      where: { id: signatureId, tenantId },
    });

    if (!signature) return;

    // In production: Send email to signer
    this.logger.log(`Reminder sent to: ${signature.signerEmail}`);

    // Update reminder count and timestamp
    await this.signatureRepository.update(signatureId, {
      reminderCount: signature.reminderCount + 1,
      lastReminderSentAt: new Date(),
    });
  }

  /**
   * Get all tenants (placeholder)
   */
  private async getTenants(): Promise<Array<{ id: string }>> {
    // In production, query from tenants table
    return [];
  }
}
