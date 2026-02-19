import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { TenantsService } from "../tenants.service";

export interface TenantProvisioningJobData {
  tenantId: string;
  ownerFullName: string;
  ownerPassword: string;
  ownerEmail: string;
}

/**
 * Tenant Provisioning Job Processor
 * Handles automated provisioning of new tenants
 * Story 2.1: Tenant Registration and Automated Provisioning
 */
@Processor("tenant-provisioning")
@Injectable()
export class TenantProvisioningProcessor extends WorkerHost {
  private readonly logger = new Logger(TenantProvisioningProcessor.name);

  constructor(private readonly tenantsService: TenantsService) {
    super();
  }

  async process(job: Job<TenantProvisioningJobData>) {
    // Only handle 'provision-tenant' jobs
    if (job.name !== 'provision-tenant') {
      return;
    }

    const { tenantId, ownerFullName, ownerPassword, ownerEmail } = job.data;

    this.logger.log(`Starting provisioning for tenant ${tenantId}`);

    try {
      await this.tenantsService.provision(
        tenantId,
        ownerFullName,
        ownerPassword,
        ownerEmail,
      );

      this.logger.log(`Provisioning completed for tenant ${tenantId}`);

      return {
        success: true,
        tenantId,
      };
    } catch (error) {
      this.logger.error(
        `Provisioning failed for tenant ${tenantId}: ${error.message}`,
        error.stack,
      );

      // TODO: Notify support team
      throw error;
    }
  }
}
