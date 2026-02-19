/**
 * Epic 11, Story 11.2: Revenue Projection Service
 * Calculate revenue projections with confidence intervals
 */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PaymentStatus } from "../../payments/domain/payment";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { JamaahStatus } from "../../jamaah/domain/jamaah";
import {
  RevenueProjection,
  ProjectionAssumptions,
  RevenueProjector,
  HistoricalData,
} from "../domain/revenue-projection";
import {
  PipelineCalculator,
  PIPELINE_WEIGHTS,
} from "../domain/pipeline-analytics";

@Injectable()
export class RevenueProjectionService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
  ) {}

  /**
   * Calculate revenue projection
   */
  async calculateProjection(
    tenantId: string,
    months: number = 3,
    assumptions?: ProjectionAssumptions,
  ): Promise<RevenueProjection> {
    // Get historical data (last 3 months)
    const historicalData = await this.getHistoricalData(tenantId, 3);

    // Get pending installments
    const pendingInstallments =
      await this.calculatePendingInstallments(tenantId);

    // Get pipeline potential
    const pipelinePotential = await this.calculatePipelinePotential(tenantId);

    // Calculate projection
    const projection = RevenueProjector.calculateProjection(
      historicalData,
      pendingInstallments,
      pipelinePotential,
      months,
      assumptions,
    );

    return projection;
  }

  /**
   * Get historical revenue data
   */
  private async getHistoricalData(
    tenantId: string,
    months: number,
  ): Promise<HistoricalData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const payments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(startDate, endDate),
      },
    });

    // Group by month
    const monthlyRevenues = new Map<string, number>();

    payments.forEach((payment) => {
      const date = new Date(payment.payment_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const current = monthlyRevenues.get(monthKey) || 0;
      monthlyRevenues.set(monthKey, current + Number(payment.amount));
    });

    // Convert to array
    const revenueArray = Array.from(monthlyRevenues.entries()).map(
      ([month, revenue]) => ({ month, revenue }),
    );

    // Analyze historical data
    return RevenueProjector.analyzeHistoricalData(revenueArray);
  }

  /**
   * Calculate pending installments
   */
  private async calculatePendingInstallments(
    tenantId: string,
  ): Promise<number> {
    // Get all jamaah with partial payments
    const jamaahList = await this.jamaahRepository.find({
      where: {
        tenant_id: tenantId,
        status: In([JamaahStatus.DEPOSIT_PAID, JamaahStatus.PARTIALLY_PAID]),
      },
      relations: ["package"],
    });

    // Get payments for these jamaah
    const jamaahIds = jamaahList.map((j) => j.id);
    if (jamaahIds.length === 0) return 0;

    const payments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        jamaah_id: In(jamaahIds),
        status: PaymentStatus.CONFIRMED,
      },
    });

    // Calculate remaining amounts
    const paymentsByJamaah = new Map<string, number>();
    payments.forEach((payment) => {
      const current = paymentsByJamaah.get(payment.jamaah_id) || 0;
      paymentsByJamaah.set(payment.jamaah_id, current + Number(payment.amount));
    });

    let totalPending = 0;
    jamaahList.forEach((jamaah) => {
      const paid = paymentsByJamaah.get(jamaah.id) || 0;
      const packagePrice = Number(jamaah.package?.retail_price || 0);
      const remaining = packagePrice - paid;
      if (remaining > 0) {
        totalPending += remaining;
      }
    });

    return totalPending;
  }

  /**
   * Calculate pipeline potential
   */
  private async calculatePipelinePotential(tenantId: string): Promise<number> {
    const jamaahList = await this.jamaahRepository.find({
      where: {
        tenant_id: tenantId,
        status: In([JamaahStatus.LEAD, JamaahStatus.INTERESTED]),
      },
      relations: ["package"],
    });

    // Calculate weighted potential
    return jamaahList.reduce((total, jamaah) => {
      const packagePrice = Number(jamaah.package?.retail_price || 0);
      const weight = PIPELINE_WEIGHTS[jamaah.status] || 0;
      return total + packagePrice * weight;
    }, 0);
  }
}
