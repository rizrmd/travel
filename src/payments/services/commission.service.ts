/**
 * Epic 7, Stories 7.4 & 7.5: Commission Service
 * Handles commission calculation and multi-level splits
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { CommissionEntity } from "../infrastructure/persistence/relational/entities/commission.entity";
import { CommissionRulesEntity } from "../infrastructure/persistence/relational/entities/commission-rules.entity";
import {
  CommissionResponseDto,
  CommissionSummaryDto,
} from "../dto/commission-response.dto";
import { UpdateCommissionDto } from "../dto/update-commission.dto";
import {
  Commission,
  CommissionStatus,
  CommissionLevel,
} from "../domain/commission";

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionEntity)
    private readonly commissionRepository: Repository<CommissionEntity>,
    @InjectRepository(CommissionRulesEntity)
    private readonly rulesRepository: Repository<CommissionRulesEntity>,
  ) { }

  /**
   * Create commission from confirmed payment
   * Story 7.4: Auto-calculate commission when payment confirmed
   */
  async createCommissionForPayment(
    paymentId: string,
    paymentAmount: number,
    jamaahId: string,
    agentId: string,
    tenantId: string,
  ): Promise<CommissionResponseDto[]> {
    // Get commission rules for tenant
    const rules = await this.getCommissionRules(tenantId);

    // For MVP: Create single commission for direct agent
    // Future: Implement multi-level if agent has hierarchy
    const commissionAmount = Commission.calculateCommissionAmount(
      paymentAmount,
      rules.direct_sale_percentage,
    );

    const commission = this.commissionRepository.create({
      tenant_id: tenantId,
      agent_id: agentId,
      jamaah_id: jamaahId,
      payment_id: paymentId,
      base_amount: paymentAmount,
      commission_percentage: rules.direct_sale_percentage,
      commission_amount: commissionAmount,
      status: CommissionStatus.PENDING,
      level: CommissionLevel.DIRECT,
      original_agent_id: null, // Same as agent_id for direct sale
    });

    const saved = await this.commissionRepository.save(commission);

    // TODO Story 7.5: Check if agent has parent/grandparent
    // and create additional commission records for them

    return [this.mapToResponseDto(saved)];
  }

  /**
   * Create multi-level commission splits
   * Story 7.5: Split commission across agent hierarchy
   */
  async createMultiLevelCommissions(
    paymentId: string,
    paymentAmount: number,
    jamaahId: string,
    agentId: string,
    parentAgentId: string | null,
    grandparentAgentId: string | null,
    tenantId: string,
  ): Promise<CommissionResponseDto[]> {
    const rules = await this.getCommissionRules(tenantId);
    const commissions: CommissionEntity[] = [];

    // Direct sale commission
    const directCommission = this.commissionRepository.create({
      tenant_id: tenantId,
      agent_id: agentId,
      jamaah_id: jamaahId,
      payment_id: paymentId,
      base_amount: paymentAmount,
      commission_percentage: rules.direct_sale_percentage,
      commission_amount: Commission.calculateCommissionAmount(
        paymentAmount,
        rules.direct_sale_percentage,
      ),
      status: CommissionStatus.PENDING,
      level: CommissionLevel.DIRECT,
      original_agent_id: agentId,
    });
    commissions.push(directCommission);

    // Parent commission
    if (parentAgentId) {
      const parentCommission = this.commissionRepository.create({
        tenant_id: tenantId,
        agent_id: parentAgentId,
        jamaah_id: jamaahId,
        payment_id: paymentId,
        base_amount: paymentAmount,
        commission_percentage: rules.parent_percentage,
        commission_amount: Commission.calculateCommissionAmount(
          paymentAmount,
          rules.parent_percentage,
        ),
        status: CommissionStatus.PENDING,
        level: CommissionLevel.PARENT,
        original_agent_id: agentId,
      });
      commissions.push(parentCommission);
    }

    // Grandparent commission
    if (grandparentAgentId) {
      const grandparentCommission = this.commissionRepository.create({
        tenant_id: tenantId,
        agent_id: grandparentAgentId,
        jamaah_id: jamaahId,
        payment_id: paymentId,
        base_amount: paymentAmount,
        commission_percentage: rules.grandparent_percentage,
        commission_amount: Commission.calculateCommissionAmount(
          paymentAmount,
          rules.grandparent_percentage,
        ),
        status: CommissionStatus.PENDING,
        level: CommissionLevel.GRANDPARENT,
        original_agent_id: agentId,
      });
      commissions.push(grandparentCommission);
    }

    const saved = await this.commissionRepository.save(commissions);

    return saved.map((c) => this.mapToResponseDto(c));
  }

  /**
   * Get commissions for an agent
   */
  async findByAgent(
    agentId: string,
    tenantId: string,
    status?: CommissionStatus,
  ): Promise<CommissionResponseDto[]> {
    const where: any = {
      agent_id: agentId,
      tenant_id: tenantId,
    };

    if (status) {
      where.status = status;
    }

    const commissions = await this.commissionRepository.find({
      where,
      order: {
        created_at: "DESC",
      },
    });

    return commissions.map((c) => this.mapToResponseDto(c));
  }

  /**
   * Get commission summary for agent dashboard
   */
  async getAgentSummary(
    agentId: string,
    tenantId: string,
  ): Promise<CommissionSummaryDto> {
    const commissions = await this.commissionRepository.find({
      where: {
        agent_id: agentId,
        tenant_id: tenantId,
      },
    });

    const totalEarned = commissions.reduce(
      (sum, c) => sum + parseFloat(c.commission_amount.toString()),
      0,
    );

    const totalPending = commissions
      .filter((c) => c.status === CommissionStatus.PENDING)
      .reduce((sum, c) => sum + parseFloat(c.commission_amount.toString()), 0);

    const totalApproved = commissions
      .filter((c) => c.status === CommissionStatus.APPROVED)
      .reduce((sum, c) => sum + parseFloat(c.commission_amount.toString()), 0);

    const totalPaid = commissions
      .filter((c) => c.status === CommissionStatus.PAID)
      .reduce((sum, c) => sum + parseFloat(c.commission_amount.toString()), 0);

    const directSalesCount = commissions.filter(
      (c) => c.level === CommissionLevel.DIRECT,
    ).length;
    const downlineCommissionCount = commissions.filter(
      (c) => c.level > CommissionLevel.DIRECT,
    ).length;

    // This month earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEarnings = commissions
      .filter((c) => new Date(c.created_at) >= startOfMonth)
      .reduce((sum, c) => sum + parseFloat(c.commission_amount.toString()), 0);

    // Last payout info (mock - would come from payout_items table)
    const lastPayoutDate = null;
    const lastPayoutAmount = 0;

    return {
      totalEarned,
      totalPending,
      totalApproved,
      totalPaid,
      directSalesCount,
      downlineCommissionCount,
      thisMonthEarnings,
      lastPayoutDate,
      lastPayoutAmount,
    };
  }

  /**
   * Approve commission
   */
  async approve(id: string, tenantId: string): Promise<CommissionResponseDto> {
    const commission = await this.commissionRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!commission) {
      throw new NotFoundException(`Commission with ID ${id} not found`);
    }

    const domain = this.mapToDomain(commission);

    if (!domain.canApprove()) {
      throw new BadRequestException(
        `Cannot approve commission with status: ${commission.status}`,
      );
    }

    domain.approve();
    commission.status = domain.status;
    commission.updated_at = domain.updatedAt;

    const updated = await this.commissionRepository.save(commission);

    return this.mapToResponseDto(updated);
  }

  /**
   * Bulk approve commissions
   */
  async bulkApprove(
    commissionIds: string[],
    tenantId: string,
  ): Promise<CommissionResponseDto[]> {
    const commissions = await this.commissionRepository.find({
      where: {
        id: In(commissionIds),
        tenant_id: tenantId,
        status: CommissionStatus.PENDING,
      },
    });

    for (const commission of commissions) {
      const domain = this.mapToDomain(commission);
      domain.approve();
      commission.status = domain.status;
      commission.updated_at = domain.updatedAt;
    }

    const updated = await this.commissionRepository.save(commissions);

    return updated.map((c) => this.mapToResponseDto(c));
  }

  /**
   * Mark commissions as paid (called from payout service)
   */
  async markAsPaid(commissionIds: string[], tenantId: string): Promise<void> {
    const commissions = await this.commissionRepository.find({
      where: {
        id: In(commissionIds),
        tenant_id: tenantId,
        status: CommissionStatus.APPROVED,
      },
    });

    for (const commission of commissions) {
      const domain = this.mapToDomain(commission);
      domain.markAsPaid();
      commission.status = domain.status;
      commission.updated_at = domain.updatedAt;
    }

    await this.commissionRepository.save(commissions);
  }

  /**
   * Get or create commission rules for tenant
   */
  private async getCommissionRules(
    tenantId: string,
  ): Promise<CommissionRulesEntity> {
    let rules = await this.rulesRepository.findOne({
      where: { tenant_id: tenantId },
    });

    if (!rules) {
      // Create default rules
      rules = this.rulesRepository.create({
        tenant_id: tenantId,
        total_commission_percentage: 16.0,
        direct_sale_percentage: 10.0,
        parent_percentage: 4.0,
        grandparent_percentage: 2.0,
        is_active: true,
      });
      rules = await this.rulesRepository.save(rules);
    }

    return rules;
  }

  /**
   * Map entity to domain model
   */
  private mapToDomain(entity: CommissionEntity): Commission {
    return new Commission({
      id: entity.id,
      tenantId: entity.tenant_id,
      agentId: entity.agent_id,
      jamaahId: entity.jamaah_id,
      paymentId: entity.payment_id,
      baseAmount: parseFloat(entity.base_amount.toString()),
      commissionPercentage: parseFloat(entity.commission_percentage.toString()),
      commissionAmount: parseFloat(entity.commission_amount.toString()),
      status: entity.status,
      level: entity.level,
      originalAgentId: entity.original_agent_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(entity: CommissionEntity): CommissionResponseDto {
    const domain = this.mapToDomain(entity);

    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      agentId: entity.agent_id,
      jamaahId: entity.jamaah_id,
      paymentId: entity.payment_id,
      baseAmount: parseFloat(entity.base_amount.toString()),
      commissionPercentage: parseFloat(entity.commission_percentage.toString()),
      commissionAmount: parseFloat(entity.commission_amount.toString()),
      status: entity.status,
      level: entity.level,
      originalAgentId: entity.original_agent_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      formattedAmount: domain.getFormattedAmount(),
      formattedBaseAmount: domain.getFormattedBaseAmount(),
      statusDisplay: domain.getStatusDisplay(),
      levelDisplay: domain.getLevelDisplay(),
      isDownlineCommission: domain.isDownlineCommission(),
    };
  }
}
