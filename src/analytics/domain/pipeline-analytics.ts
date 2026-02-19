/**
 * Epic 11, Story 11.3 & 11.6: Pipeline Analytics Domain Model
 * Business logic for pipeline potential and funnel visualization
 */

export interface PipelineAnalytics {
  totalPotential: number;
  weightedPotential: number;
  jamaahCount: number;
  breakdown: PipelineBreakdown[];
  funnel: PipelineFunnel;
  byAgent: AgentPipeline[];
  byPackage: PackagePipeline[];
}

export interface PipelineBreakdown {
  status: string;
  statusLabel: string;
  count: number;
  totalValue: number;
  weightedValue: number;
  likelihood: number;
  averageDealSize: number;
}

export interface PipelineFunnel {
  stages: FunnelStage[];
  conversionRates: {
    leadToInterested: number;
    interestedToDeposit: number;
    depositToPartial: number;
    partialToFull: number;
    overallConversion: number;
  };
}

export interface FunnelStage {
  stage: string;
  label: string;
  count: number;
  value: number;
  conversionFromPrevious: number | null;
}

export interface AgentPipeline {
  agentId: string;
  agentName: string;
  totalPotential: number;
  weightedPotential: number;
  jamaahCount: number;
  statusBreakdown: Record<string, number>;
}

export interface PackagePipeline {
  packageId: string;
  packageName: string;
  totalPotential: number;
  weightedPotential: number;
  jamaahCount: number;
  statusBreakdown: Record<string, number>;
}

export interface KanbanColumn {
  status: string;
  label: string;
  jamaahCards: KanbanCard[];
  count: number;
  totalValue: number;
  color: string;
}

export interface KanbanCard {
  jamaahId: string;
  jamaahName: string;
  packageName: string;
  packagePrice: number;
  agentName: string;
  status: string;
  createdAt: Date;
  lastUpdated: Date;
  daysSinceCreated: number;
  metadata: {
    email: string | null;
    phone: string | null;
    paymentProgress: number;
  };
}

/**
 * Pipeline status weights based on likelihood of conversion
 */
export const PIPELINE_WEIGHTS = {
  lead: 0.1,
  interested: 0.2,
  deposit_paid: 0.7,
  partially_paid: 0.9,
  fully_paid: 1.0, // Not in pipeline, but for reference
};

export const PIPELINE_STATUSES = [
  "lead",
  "interested",
  "deposit_paid",
  "partially_paid",
];

export const KANBAN_COLUMNS = [
  {
    status: "lead",
    label: "Prospek",
    color: "#94A3B8",
  },
  {
    status: "interested",
    label: "Berminat",
    color: "#60A5FA",
  },
  {
    status: "deposit_paid",
    label: "DP Dibayar",
    color: "#FBBF24",
  },
  {
    status: "partially_paid",
    label: "Cicilan",
    color: "#34D399",
  },
  {
    status: "fully_paid",
    label: "Lunas",
    color: "#10B981",
  },
];

export class PipelineCalculator {
  /**
   * Calculate weighted pipeline potential
   */
  static calculateWeightedPotential(
    jamaahList: Array<{ status: string; packagePrice: number }>,
  ): number {
    return jamaahList.reduce((total, jamaah) => {
      const weight = PIPELINE_WEIGHTS[jamaah.status] || 0;
      return total + jamaah.packagePrice * weight;
    }, 0);
  }

  /**
   * Calculate total (unweighted) pipeline potential
   */
  static calculateTotalPotential(
    jamaahList: Array<{ packagePrice: number }>,
  ): number {
    return jamaahList.reduce((total, jamaah) => total + jamaah.packagePrice, 0);
  }

  /**
   * Group jamaah by status
   */
  static groupByStatus(
    jamaahList: Array<{ status: string; packagePrice: number }>,
  ): Map<string, Array<{ status: string; packagePrice: number }>> {
    const grouped = new Map();

    jamaahList.forEach((jamaah) => {
      if (!grouped.has(jamaah.status)) {
        grouped.set(jamaah.status, []);
      }
      grouped.get(jamaah.status).push(jamaah);
    });

    return grouped;
  }

  /**
   * Calculate pipeline breakdown
   */
  static calculateBreakdown(
    jamaahList: Array<{ status: string; packagePrice: number }>,
  ): PipelineBreakdown[] {
    const grouped = this.groupByStatus(jamaahList);
    const breakdown: PipelineBreakdown[] = [];

    KANBAN_COLUMNS.forEach((column) => {
      const jamaahInStatus = grouped.get(column.status) || [];
      const totalValue = jamaahInStatus.reduce(
        (sum, j) => sum + j.packagePrice,
        0,
      );
      const weight = PIPELINE_WEIGHTS[column.status] || 0;
      const weightedValue = totalValue * weight;

      breakdown.push({
        status: column.status,
        statusLabel: column.label,
        count: jamaahInStatus.length,
        totalValue,
        weightedValue,
        likelihood: weight * 100,
        averageDealSize:
          jamaahInStatus.length > 0 ? totalValue / jamaahInStatus.length : 0,
      });
    });

    return breakdown;
  }

  /**
   * Calculate funnel conversion rates
   */
  static calculateFunnelConversions(
    breakdown: PipelineBreakdown[],
  ): PipelineFunnel {
    const stages: FunnelStage[] = breakdown.map((item, index) => {
      let conversionFromPrevious: number | null = null;

      if (index > 0) {
        const previousCount = breakdown[index - 1].count;
        conversionFromPrevious =
          previousCount > 0 ? (item.count / previousCount) * 100 : 0;
      }

      return {
        stage: item.status,
        label: item.statusLabel,
        count: item.count,
        value: item.totalValue,
        conversionFromPrevious,
      };
    });

    // Calculate overall conversion rates
    const leadCount = breakdown.find((b) => b.status === "lead")?.count || 0;
    const interestedCount =
      breakdown.find((b) => b.status === "interested")?.count || 0;
    const depositCount =
      breakdown.find((b) => b.status === "deposit_paid")?.count || 0;
    const partialCount =
      breakdown.find((b) => b.status === "partially_paid")?.count || 0;
    const fullCount =
      breakdown.find((b) => b.status === "fully_paid")?.count || 0;

    return {
      stages,
      conversionRates: {
        leadToInterested:
          leadCount > 0 ? (interestedCount / leadCount) * 100 : 0,
        interestedToDeposit:
          interestedCount > 0 ? (depositCount / interestedCount) * 100 : 0,
        depositToPartial:
          depositCount > 0 ? (partialCount / depositCount) * 100 : 0,
        partialToFull: partialCount > 0 ? (fullCount / partialCount) * 100 : 0,
        overallConversion: leadCount > 0 ? (fullCount / leadCount) * 100 : 0,
      },
    };
  }

  /**
   * Calculate days since created
   */
  static calculateDaysSince(date: Date): number {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Group pipeline by agent
   */
  static groupByAgent(
    jamaahList: Array<{
      agentId: string;
      agentName: string;
      status: string;
      packagePrice: number;
    }>,
  ): AgentPipeline[] {
    const agentMap = new Map<string, AgentPipeline>();

    jamaahList.forEach((jamaah) => {
      if (!agentMap.has(jamaah.agentId)) {
        agentMap.set(jamaah.agentId, {
          agentId: jamaah.agentId,
          agentName: jamaah.agentName,
          totalPotential: 0,
          weightedPotential: 0,
          jamaahCount: 0,
          statusBreakdown: {},
        });
      }

      const agent = agentMap.get(jamaah.agentId)!;
      const weight = PIPELINE_WEIGHTS[jamaah.status] || 0;

      agent.totalPotential += jamaah.packagePrice;
      agent.weightedPotential += jamaah.packagePrice * weight;
      agent.jamaahCount++;
      agent.statusBreakdown[jamaah.status] =
        (agent.statusBreakdown[jamaah.status] || 0) + 1;
    });

    return Array.from(agentMap.values());
  }

  /**
   * Group pipeline by package
   */
  static groupByPackage(
    jamaahList: Array<{
      packageId: string;
      packageName: string;
      status: string;
      packagePrice: number;
    }>,
  ): PackagePipeline[] {
    const packageMap = new Map<string, PackagePipeline>();

    jamaahList.forEach((jamaah) => {
      if (!packageMap.has(jamaah.packageId)) {
        packageMap.set(jamaah.packageId, {
          packageId: jamaah.packageId,
          packageName: jamaah.packageName,
          totalPotential: 0,
          weightedPotential: 0,
          jamaahCount: 0,
          statusBreakdown: {},
        });
      }

      const pkg = packageMap.get(jamaah.packageId)!;
      const weight = PIPELINE_WEIGHTS[jamaah.status] || 0;

      pkg.totalPotential += jamaah.packagePrice;
      pkg.weightedPotential += jamaah.packagePrice * weight;
      pkg.jamaahCount++;
      pkg.statusBreakdown[jamaah.status] =
        (pkg.statusBreakdown[jamaah.status] || 0) + 1;
    });

    return Array.from(packageMap.values());
  }
}
