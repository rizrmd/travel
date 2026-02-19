/**
 * Epic 12, Story 12.3: Compliance Dashboard Service
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractEntity } from "../infrastructure/persistence/relational/entities/contract.entity";
import { AuditLogService } from "./audit-log.service";
import { ComplianceMetrics } from "../domain/compliance-metrics";
import {
  ComplianceDashboardQueryDto,
  ComplianceDashboardResponseDto,
} from "../dto";
import { ContractStatus } from "../domain/contract";

@Injectable()
export class ComplianceDashboardService {
  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    private auditLogService: AuditLogService,
  ) { }

  async getComplianceMetrics(
    tenantId: string,
    query: ComplianceDashboardQueryDto,
  ): Promise<ComplianceDashboardResponseDto> {
    const periodStart = query.startDate
      ? new Date(query.startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const periodEnd = query.endDate ? new Date(query.endDate) : new Date();

    // Get contract metrics
    const contractMetrics = await this.getContractMetrics(
      tenantId,
      periodStart,
      periodEnd,
      query.agentId,
    );

    // Get financial metrics (placeholder - would integrate with payments module)
    const financialMetrics = {
      totalTransactions: 0,
      totalAmount: 0,
      averageTransactionAmount: 0,
      transactionsWithContracts: 0,
      transactionsWithoutContracts: 0,
      financialComplianceRate: 100,
    };

    // Get audit metrics
    const auditMetrics = await this.auditLogService.getAuditMetrics(
      tenantId,
      periodStart,
      periodEnd,
    );

    // Determine compliance status
    const complianceStatus = ComplianceMetrics.determineComplianceStatus(
      contractMetrics.complianceRate,
      financialMetrics.financialComplianceRate,
      auditMetrics.retentionCompliance,
    );

    return {
      contractMetrics,
      financialMetrics,
      auditMetrics,
      complianceStatus,
      periodStart,
      periodEnd,
      generatedAt: new Date(),
    };
  }

  private async getContractMetrics(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    agentId?: string,
  ) {
    const queryBuilder = this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("contract.generated_at BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });

    if (agentId) {
      queryBuilder
        .innerJoin("contract.jamaah", "jamaah")
        .andWhere("jamaah.agent_id = :agentId", { agentId });
    }

    const [total, signed, pending, expired, cancelled] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder
        .clone()
        .andWhere("contract.status = :status", {
          status: ContractStatus.SIGNED,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("contract.status = :status", { status: ContractStatus.SENT })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("contract.status = :status", {
          status: ContractStatus.EXPIRED,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere("contract.status = :status", {
          status: ContractStatus.CANCELLED,
        })
        .getCount(),
    ]);

    const signingTimes = await this.calculateSigningTimes(
      tenantId,
      startDate,
      endDate,
    );
    const averageSigningTime =
      ComplianceMetrics.calculateAverageSigningTime(signingTimes);
    const complianceRate = ComplianceMetrics.calculateContractComplianceRate(
      signed,
      total,
    );

    return {
      totalContracts: total,
      signedContracts: signed,
      pendingSignatures: pending,
      expiredContracts: expired,
      cancelledContracts: cancelled,
      complianceRate,
      averageSigningTime,
    };
  }

  private async calculateSigningTimes(
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number[]> {
    const contracts = await this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("contract.status = :status", { status: ContractStatus.SIGNED })
      .andWhere("contract.signed_at BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getMany();

    return contracts
      .filter((c) => c.sentAt && c.signedAt)
      .map((c) => {
        const days = Math.floor(
          (c.signedAt!.getTime() - c.sentAt!.getTime()) / (1000 * 60 * 60 * 24),
        );
        return days;
      });
  }

  async exportToPDF(
    tenantId: string,
    query: ComplianceDashboardQueryDto,
  ): Promise<Buffer> {
    // Placeholder for PDF export
    const metrics = await this.getComplianceMetrics(tenantId, query);
    const summary = (ComplianceMetrics as any).generateSummary(metrics);
    return Buffer.from(summary, "utf-8");
  }
}
