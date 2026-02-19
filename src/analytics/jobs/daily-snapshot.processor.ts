/**
 * Epic 11: Daily Revenue Snapshot Background Job
 * Aggregates daily revenue data for performance optimization
 * Runs at midnight (00:00) Jakarta time every day
 */

import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { PaymentEntity } from "../../payments/infrastructure/persistence/relational/entities/payment.entity";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { RevenueSnapshotEntity } from "../infrastructure/persistence/relational/entities/revenue-snapshot.entity";
import { PaymentStatus } from "../../payments/domain/payment";

@Injectable()
export class DailySnapshotProcessor {
  private readonly logger = new Logger(DailySnapshotProcessor.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(JamaahEntity)
    private jamaahRepository: Repository<JamaahEntity>,
    @InjectRepository(RevenueSnapshotEntity)
    private snapshotRepository: Repository<RevenueSnapshotEntity>,
  ) { }

  /**
   * Run daily snapshot aggregation at midnight
   * Cron: 0 0 * * * (every day at 00:00)
   */
  @Cron("0 0 * * *", {
    name: "daily-revenue-snapshot",
    timeZone: "Asia/Jakarta",
  })
  async handleDailySnapshot(): Promise<void> {
    this.logger.log("Starting daily revenue snapshot aggregation...");

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const today = new Date(yesterday);
      today.setDate(today.getDate() + 1);

      // Get all tenants (in real scenario, query from tenants table)
      const allPayments = await this.paymentRepository.find({
        where: {
          status: PaymentStatus.CONFIRMED,
          payment_date: Between(yesterday, today),
        },
        relations: ["package"],
      });

      // Group by tenant
      const tenantMap = new Map<string, typeof allPayments>();
      allPayments.forEach((payment) => {
        if (!tenantMap.has(payment.tenant_id)) {
          tenantMap.set(payment.tenant_id, []);
        }
        tenantMap.get(payment.tenant_id)!.push(payment);
      });

      // Process each tenant
      for (const [tenantId, payments] of tenantMap.entries()) {
        await this.createSnapshotForTenant(tenantId, yesterday, payments);
      }

      this.logger.log(
        `Daily snapshot completed for ${tenantMap.size} tenant(s)`,
      );
    } catch (error) {
      this.logger.error("Failed to create daily snapshot", error.stack);
    }
  }

  /**
   * Create snapshot for a specific tenant
   */
  private async createSnapshotForTenant(
    tenantId: string,
    snapshotDate: Date,
    payments: any[],
  ): Promise<void> {
    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Package breakdown
    const packageBreakdown: Record<string, any> = {};
    payments.forEach((payment) => {
      const packageId = payment.package_id;
      const packageName = payment.package?.name || "Unknown Package";

      if (!packageBreakdown[packageId]) {
        packageBreakdown[packageId] = {
          packageName,
          revenue: 0,
          count: 0,
        };
      }

      packageBreakdown[packageId].revenue += Number(payment.amount);
      packageBreakdown[packageId].count += 1;
    });

    // Agent breakdown (get jamaah data)
    const jamaahIds = [...new Set(payments.map((p) => p.jamaah_id))];
    const jamaahList = await this.jamaahRepository.find({
      where: jamaahIds.map((id) => ({ id })),
      relations: ["agent"],
    });

    const jamaahAgentMap = new Map(
      jamaahList.map((j) => [
        j.id,
        { agentId: j.agent_id, agentName: j.agent?.fullName || "Unknown" },
      ]),
    );

    const agentBreakdown: Record<string, any> = {};
    payments.forEach((payment) => {
      const agentData = jamaahAgentMap.get(payment.jamaah_id);
      if (!agentData) return;

      const agentId = agentData.agentId;
      const agentName = agentData.agentName;

      if (!agentBreakdown[agentId]) {
        agentBreakdown[agentId] = {
          agentName,
          revenue: 0,
          jamaahCount: 0,
          paymentCount: 0,
        };
      }

      agentBreakdown[agentId].revenue += Number(payment.amount);
      agentBreakdown[agentId].paymentCount += 1;
    });

    // Count unique jamaah per agent
    const jamaahByAgent = new Map<string, Set<string>>();
    jamaahList.forEach((jamaah) => {
      if (!jamaahByAgent.has(jamaah.agent_id)) {
        jamaahByAgent.set(jamaah.agent_id, new Set());
      }
      jamaahByAgent.get(jamaah.agent_id)!.add(jamaah.id);
    });

    Object.keys(agentBreakdown).forEach((agentId) => {
      const uniqueJamaah = jamaahByAgent.get(agentId) || new Set();
      agentBreakdown[agentId].jamaahCount = uniqueJamaah.size;
    });

    // Payment method breakdown
    const paymentMethodBreakdown: Record<string, number> = {};
    payments.forEach((payment) => {
      const method = payment.payment_method;
      paymentMethodBreakdown[method] =
        (paymentMethodBreakdown[method] || 0) + Number(payment.amount);
    });

    // Calculate MTD and YTD
    const monthStart = new Date(snapshotDate);
    monthStart.setDate(1);
    const yearStart = new Date(snapshotDate);
    yearStart.setMonth(0);
    yearStart.setDate(1);

    const mtdPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(monthStart, snapshotDate),
      },
    });

    const ytdPayments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(yearStart, snapshotDate),
      },
    });

    const monthToDateRevenue = mtdPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const yearToDateRevenue = ytdPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    // Create or update snapshot
    const existingSnapshot = await this.snapshotRepository.findOne({
      where: {
        tenant_id: tenantId,
        snapshot_date: snapshotDate,
      },
    });

    if (existingSnapshot) {
      // Update existing
      existingSnapshot.total_revenue = totalRevenue;
      existingSnapshot.payment_count = payments.length;
      existingSnapshot.jamaah_count = jamaahIds.length;
      existingSnapshot.package_breakdown = packageBreakdown;
      existingSnapshot.agent_breakdown = agentBreakdown;
      existingSnapshot.payment_method_breakdown = paymentMethodBreakdown;
      existingSnapshot.month_to_date_revenue = monthToDateRevenue;
      existingSnapshot.year_to_date_revenue = yearToDateRevenue;

      await this.snapshotRepository.save(existingSnapshot);
      this.logger.log(
        `Updated snapshot for tenant ${tenantId} on ${snapshotDate.toISOString().split("T")[0]}`,
      );
    } else {
      // Create new
      const snapshot = this.snapshotRepository.create({
        tenant_id: tenantId,
        snapshot_date: snapshotDate,
        total_revenue: totalRevenue,
        payment_count: payments.length,
        jamaah_count: jamaahIds.length,
        package_breakdown: packageBreakdown,
        agent_breakdown: agentBreakdown,
        payment_method_breakdown: paymentMethodBreakdown,
        month_to_date_revenue: monthToDateRevenue,
        year_to_date_revenue: yearToDateRevenue,
      });

      await this.snapshotRepository.save(snapshot);
      this.logger.log(
        `Created snapshot for tenant ${tenantId} on ${snapshotDate.toISOString().split("T")[0]}`,
      );
    }
  }

  /**
   * Manual trigger for testing
   */
  async triggerManualSnapshot(tenantId: string, date: Date): Promise<void> {
    this.logger.log(`Manual snapshot trigger for tenant ${tenantId}`);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const payments = await this.paymentRepository.find({
      where: {
        tenant_id: tenantId,
        status: PaymentStatus.CONFIRMED,
        payment_date: Between(startOfDay, endOfDay),
      },
      relations: ["package"],
    });

    await this.createSnapshotForTenant(tenantId, startOfDay, payments);
  }
}
