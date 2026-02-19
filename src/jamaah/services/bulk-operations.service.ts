/**
 * Epic 5, Story 5.4: Bulk Operations Service
 * Handles bulk actions on multiple jamaah
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { JamaahEntity } from "../infrastructure/persistence/relational/entities/jamaah.entity";
import {
  BulkOperationDto,
  BulkOperationResultDto,
  BulkActionType,
} from "../dto/bulk-operation.dto";
import { QueueService } from "../../queue/services/queue.service";
import {
  QueueName,
  EmailJobType,
  BatchJobType,
} from "../../queue/types/queue-jobs.type";

@Injectable()
export class BulkOperationsService {
  constructor(
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    private readonly queueService: QueueService,
  ) {}

  /**
   * Execute bulk operation
   */
  async executeBulkOperation(
    dto: BulkOperationDto,
    tenantId: string,
    userId: string,
  ): Promise<BulkOperationResultDto> {
    // Validate jamaah IDs belong to tenant
    const jamaahList = await this.jamaahRepository.find({
      where: {
        id: In(dto.jamaahIds),
        tenant_id: tenantId,
      },
      relations: ["package"],
    });

    if (jamaahList.length === 0) {
      return {
        total: dto.jamaahIds.length,
        succeeded: 0,
        failed: dto.jamaahIds.length,
        errors: dto.jamaahIds.map((id) => ({
          jamaahId: id,
          reason: "Jamaah not found or not accessible",
        })),
      };
    }

    switch (dto.actionType) {
      case BulkActionType.SEND_PAYMENT_REMINDER:
        return this.sendPaymentReminders(jamaahList, tenantId, userId);

      case BulkActionType.REQUEST_DOCUMENTS:
        return this.requestDocuments(jamaahList, tenantId, userId);

      case BulkActionType.EXPORT_CSV:
        return this.exportToCsv(jamaahList, tenantId, userId);

      case BulkActionType.TRANSFER_JAMAAH:
        return this.transferJamaah(jamaahList, dto.params, tenantId, userId);

      default:
        throw new Error(`Unsupported bulk action: ${dto.actionType}`);
    }
  }

  /**
   * Send payment reminders
   */
  private async sendPaymentReminders(
    jamaahList: JamaahEntity[],
    tenantId: string,
    userId: string,
  ): Promise<BulkOperationResultDto> {
    const job = await this.queueService.addEmailJob({
      tenantId,
      userId,
      type: EmailJobType.SEND_PAYMENT_REMINDER,
      to: jamaahList.filter((j) => j.email).map((j) => j.email),
      subject: "Pengingat Pembayaran Umroh",
      template: "payment-reminder",
      data: {
        jamaahList: jamaahList.map((j) => ({
          name: j.full_name,
          packageName: j.package?.name,
        })),
      },
    });

    return {
      total: jamaahList.length,
      succeeded: jamaahList.filter((j) => j.email).length,
      failed: jamaahList.filter((j) => !j.email).length,
      jobId: job.id as string,
      errors: jamaahList
        .filter((j) => !j.email)
        .map((j) => ({
          jamaahId: j.id,
          reason: "No email address",
        })),
    };
  }

  /**
   * Request missing documents
   */
  private async requestDocuments(
    jamaahList: JamaahEntity[],
    tenantId: string,
    userId: string,
  ): Promise<BulkOperationResultDto> {
    const job = await this.queueService.addEmailJob({
      tenantId,
      userId,
      type: EmailJobType.SEND_BULK_EMAIL,
      to: jamaahList.filter((j) => j.email).map((j) => j.email),
      subject: "Permintaan Dokumen Umroh",
      template: "document-request",
      data: {
        message: "Mohon segera lengkapi dokumen persyaratan umroh Anda",
      },
    });

    return {
      total: jamaahList.length,
      succeeded: jamaahList.filter((j) => j.email).length,
      failed: jamaahList.filter((j) => !j.email).length,
      jobId: job.id as string,
    };
  }

  /**
   * Export to CSV
   */
  private async exportToCsv(
    jamaahList: JamaahEntity[],
    tenantId: string,
    userId: string,
  ): Promise<BulkOperationResultDto> {
    const job = await this.queueService.addBatchJob({
      tenantId,
      userId,
      type: BatchJobType.EXPORT_DATA,
      filePath: `/exports/jamaah-${Date.now()}.csv`,
      entityType: "jamaah",
      metadata: {
        jamaahIds: jamaahList.map((j) => j.id),
      },
    });

    return {
      total: jamaahList.length,
      succeeded: jamaahList.length,
      failed: 0,
      jobId: job.id as string,
      downloadUrl: `/api/v1/exports/${job.id}`,
    };
  }

  /**
   * Transfer jamaah to another agent
   */
  private async transferJamaah(
    jamaahList: JamaahEntity[],
    params: any,
    tenantId: string,
    userId: string,
  ): Promise<BulkOperationResultDto> {
    const newAgentId = params?.newAgentId;
    if (!newAgentId) {
      throw new Error("newAgentId is required for transfer operation");
    }

    await this.jamaahRepository.update(
      { id: In(jamaahList.map((j) => j.id)) },
      { agent_id: newAgentId },
    );

    return {
      total: jamaahList.length,
      succeeded: jamaahList.length,
      failed: 0,
    };
  }
}
