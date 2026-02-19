/**
 * Epic 7, Story 7.6: Payout Service
 * Handles batch commission payouts for multiple agents
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import {
  CommissionPayoutEntity,
  CommissionPayoutItemEntity,
  PayoutStatus,
} from "../infrastructure/persistence/relational/entities/commission-payout.entity";
import { CommissionEntity } from "../infrastructure/persistence/relational/entities/commission.entity";
import {
  CreatePayoutDto,
  UploadPayoutConfirmationDto,
} from "../dto/create-payout.dto";
import {
  PayoutResponseDto,
  PayoutCsvExportDto,
} from "../dto/payout-response.dto";
import { CommissionStatus } from "../domain/commission";
import { CommissionService } from "./commission.service";

@Injectable()
export class PayoutService {
  constructor(
    @InjectRepository(CommissionPayoutEntity)
    private readonly payoutRepository: Repository<CommissionPayoutEntity>,
    @InjectRepository(CommissionPayoutItemEntity)
    private readonly payoutItemRepository: Repository<CommissionPayoutItemEntity>,
    @InjectRepository(CommissionEntity)
    private readonly commissionRepository: Repository<CommissionEntity>,
    private readonly commissionService: CommissionService,
  ) {}

  /**
   * Create payout batch for selected agents
   * Story 7.6: Batch commission payout system
   */
  async createPayout(
    dto: CreatePayoutDto,
    createdById: string,
    tenantId: string,
  ): Promise<PayoutResponseDto> {
    // Get approved commissions for selected agents
    const commissions = await this.commissionRepository.find({
      where: {
        agent_id: In(dto.agentIds),
        tenant_id: tenantId,
        status: CommissionStatus.APPROVED,
      },
      order: {
        agent_id: "ASC",
      },
    });

    if (commissions.length === 0) {
      throw new BadRequestException(
        "No approved commissions found for selected agents",
      );
    }

    // Group commissions by agent
    const commissionsByAgent = new Map<string, CommissionEntity[]>();
    for (const commission of commissions) {
      if (!commissionsByAgent.has(commission.agent_id)) {
        commissionsByAgent.set(commission.agent_id, []);
      }
      commissionsByAgent.get(commission.agent_id)!.push(commission);
    }

    // Calculate total payout amount
    const totalAmount = commissions.reduce(
      (sum, c) => sum + parseFloat(c.commission_amount.toString()),
      0,
    );

    // Create payout batch
    const payout = this.payoutRepository.create({
      tenant_id: tenantId,
      payout_date: new Date(dto.payoutDate),
      total_amount: totalAmount,
      status: PayoutStatus.PENDING,
      created_by_id: createdById,
      notes: dto.notes || null,
    });

    const savedPayout = await this.payoutRepository.save(payout);

    // Create payout items for each agent
    const items: CommissionPayoutItemEntity[] = [];
    for (const [agentId, agentCommissions] of commissionsByAgent.entries()) {
      const agentTotalAmount = agentCommissions.reduce(
        (sum, c) => sum + parseFloat(c.commission_amount.toString()),
        0,
      );

      // TODO: Get bank account info from user profile
      const item = this.payoutItemRepository.create({
        payout_id: savedPayout.id,
        agent_id: agentId,
        amount: agentTotalAmount,
        bank_name: null, // TODO: Load from user.bankInfo.bankName
        bank_account_number: null, // TODO: Load from user.bankInfo.accountNumber
        bank_account_name: null, // TODO: Load from user.bankInfo.accountName
        status: PayoutStatus.PENDING,
        notes: null,
      });

      items.push(item);
    }

    const savedItems = await this.payoutItemRepository.save(items);

    return this.mapToResponseDto(savedPayout, savedItems);
  }

  /**
   * Upload bank confirmation and mark payout as paid
   */
  async uploadConfirmation(
    id: string,
    dto: UploadPayoutConfirmationDto,
    tenantId: string,
  ): Promise<PayoutResponseDto> {
    const payout = await this.payoutRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!payout) {
      throw new NotFoundException(`Payout with ID ${id} not found`);
    }

    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException(
        `Cannot upload confirmation for payout with status: ${payout.status}`,
      );
    }

    // Update payout
    payout.bank_confirmation_file = dto.bankConfirmationFile;
    payout.status = PayoutStatus.PAID;
    if (dto.notes) {
      payout.notes = payout.notes
        ? `${payout.notes}\n\n${dto.notes}`
        : dto.notes;
    }
    payout.updated_at = new Date();

    await this.payoutRepository.save(payout);

    // Update all payout items to paid
    const items = await this.payoutItemRepository.find({
      where: { payout_id: id },
    });

    for (const item of items) {
      item.status = PayoutStatus.PAID;
      item.updated_at = new Date();
    }

    await this.payoutItemRepository.save(items);

    // Mark all related commissions as paid
    const commissionIds = await this.getCommissionIdsForPayout(id, tenantId);
    await this.commissionService.markAsPaid(commissionIds, tenantId);

    // TODO: Send email notifications to all agents

    const updatedItems = await this.payoutItemRepository.find({
      where: { payout_id: id },
    });

    return this.mapToResponseDto(payout, updatedItems);
  }

  /**
   * Get payout by ID
   */
  async findOne(id: string, tenantId: string): Promise<PayoutResponseDto> {
    const payout = await this.payoutRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!payout) {
      throw new NotFoundException(`Payout with ID ${id} not found`);
    }

    const items = await this.payoutItemRepository.find({
      where: { payout_id: id },
    });

    return this.mapToResponseDto(payout, items);
  }

  /**
   * List all payouts
   */
  async findAll(tenantId: string): Promise<PayoutResponseDto[]> {
    const payouts = await this.payoutRepository.find({
      where: { tenant_id: tenantId },
      order: {
        created_at: "DESC",
      },
    });

    const payoutsWithItems = await Promise.all(
      payouts.map(async (payout) => {
        const items = await this.payoutItemRepository.find({
          where: { payout_id: payout.id },
        });
        return this.mapToResponseDto(payout, items);
      }),
    );

    return payoutsWithItems;
  }

  /**
   * Export payout to CSV format for bank import
   */
  async exportToCsv(
    id: string,
    tenantId: string,
  ): Promise<PayoutCsvExportDto[]> {
    const items = await this.payoutItemRepository.find({
      where: { payout_id: id },
      order: { agent_id: "ASC" },
    });

    if (items.length === 0) {
      throw new NotFoundException(`No payout items found for payout ${id}`);
    }

    // TODO: Join with users table to get agent names
    const csvData: PayoutCsvExportDto[] = items.map((item) => ({
      agentName: "Agent Name", // TODO: Load from user.fullName
      bankName: item.bank_name || "N/A",
      accountNumber: item.bank_account_number || "N/A",
      amount: parseFloat(item.amount.toString()),
      formattedAmount: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(parseFloat(item.amount.toString())),
    }));

    return csvData;
  }

  /**
   * Get commission IDs for a payout (to mark as paid)
   */
  private async getCommissionIdsForPayout(
    payoutId: string,
    tenantId: string,
  ): Promise<string[]> {
    const items = await this.payoutItemRepository.find({
      where: { payout_id: payoutId },
    });

    const agentIds = items.map((item) => item.agent_id);

    const commissions = await this.commissionRepository.find({
      where: {
        agent_id: In(agentIds),
        tenant_id: tenantId,
        status: CommissionStatus.APPROVED,
      },
    });

    return commissions.map((c) => c.id);
  }

  /**
   * Map to response DTO
   */
  private mapToResponseDto(
    payout: CommissionPayoutEntity,
    items?: CommissionPayoutItemEntity[],
  ): PayoutResponseDto {
    const formattedTotalAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(payout.total_amount.toString()));

    const response: PayoutResponseDto = {
      id: payout.id,
      tenantId: payout.tenant_id,
      payoutDate: payout.payout_date,
      totalAmount: parseFloat(payout.total_amount.toString()),
      status: payout.status,
      createdById: payout.created_by_id,
      bankConfirmationFile: payout.bank_confirmation_file,
      notes: payout.notes,
      createdAt: payout.created_at,
      updatedAt: payout.updated_at,
      formattedTotalAmount,
      agentCount: items?.length,
    };

    if (items) {
      response.items = items.map((item) => ({
        id: item.id,
        payoutId: item.payout_id,
        agentId: item.agent_id,
        amount: parseFloat(item.amount.toString()),
        bankName: item.bank_name,
        bankAccountNumber: item.bank_account_number,
        bankAccountName: item.bank_account_name,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at,
        formattedAmount: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(parseFloat(item.amount.toString())),
      }));
    }

    return response;
  }
}
