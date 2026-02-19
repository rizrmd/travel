/**
 * Epic 12, Story 12.3: Compliance Metrics Domain Model
 * Business logic for compliance dashboard calculations
 */

/**
 * Compliance report type enum
 */
export enum ComplianceReportType {
  CONTRACTS_SUMMARY = "contracts_summary",
  FINANCIAL_AUDIT = "financial_audit",
  SISKOPATUH_SUBMISSION = "siskopatuh_submission",
  MONTHLY_COMPLIANCE = "monthly_compliance",
  ANNUAL_COMPLIANCE = "annual_compliance",
}

/**
 * Compliance report status enum
 */
export enum ComplianceReportStatus {
  GENERATING = "generating",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Contract compliance metrics
 */
export interface ContractMetrics {
  totalContracts: number;
  signedContracts: number;
  pendingSignatures: number;
  expiredContracts: number;
  cancelledContracts: number;
  complianceRate: number; // Percentage of signed contracts
  averageSigningTime: number; // In days
}

/**
 * Financial compliance metrics
 */
export interface FinancialMetrics {
  totalTransactions: number;
  totalAmount: number;
  averageTransactionAmount: number;
  transactionsWithContracts: number;
  transactionsWithoutContracts: number;
  financialComplianceRate: number;
}

/**
 * Audit trail metrics
 */
export interface AuditMetrics {
  totalLogs: number;
  criticalOperations: number;
  financialTransactions: number;
  contractOperations: number;
  dataExports: number;
  oldestLog: Date | null;
  newestLog: Date | null;
  retentionCompliance: boolean;
}

/**
 * Overall compliance status
 */
export interface ComplianceStatus {
  overall: "compliant" | "needs_attention" | "non_compliant";
  contractCompliance: boolean;
  financialCompliance: boolean;
  auditCompliance: boolean;
  issues: string[];
  recommendations: string[];
}

/**
 * Compliance dashboard data
 */
export interface ComplianceDashboard {
  contractMetrics: ContractMetrics;
  financialMetrics: FinancialMetrics;
  auditMetrics: AuditMetrics;
  complianceStatus: ComplianceStatus;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
}

/**
 * Compliance metrics domain model
 */
export class ComplianceMetrics {
  /**
   * Minimum compliance rate threshold (80%)
   */
  static readonly MIN_COMPLIANCE_RATE = 0.8;

  /**
   * Maximum acceptable signing time (14 days)
   */
  static readonly MAX_SIGNING_TIME_DAYS = 14;

  /**
   * Calculate contract compliance rate
   */
  static calculateContractComplianceRate(
    signedContracts: number,
    totalContracts: number,
  ): number {
    if (totalContracts === 0) return 100;
    return (signedContracts / totalContracts) * 100;
  }

  /**
   * Calculate financial compliance rate
   */
  static calculateFinancialComplianceRate(
    transactionsWithContracts: number,
    totalTransactions: number,
  ): number {
    if (totalTransactions === 0) return 100;
    return (transactionsWithContracts / totalTransactions) * 100;
  }

  /**
   * Calculate average signing time
   */
  static calculateAverageSigningTime(signingTimes: number[]): number {
    if (signingTimes.length === 0) return 0;
    const sum = signingTimes.reduce((acc, time) => acc + time, 0);
    return sum / signingTimes.length;
  }

  /**
   * Determine overall compliance status
   */
  static determineComplianceStatus(
    contractComplianceRate: number,
    financialComplianceRate: number,
    auditCompliance: boolean,
  ): ComplianceStatus {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check contract compliance
    const contractCompliance =
      contractComplianceRate >= this.MIN_COMPLIANCE_RATE * 100;
    if (!contractCompliance) {
      issues.push(
        `Tingkat penandatanganan kontrak rendah: ${contractComplianceRate.toFixed(1)}%`,
      );
      recommendations.push(
        "Kirim reminder kepada jamaah yang belum menandatangani kontrak",
      );
    }

    // Check financial compliance
    const financialCompliance =
      financialComplianceRate >= this.MIN_COMPLIANCE_RATE * 100;
    if (!financialCompliance) {
      issues.push(
        `Tingkat kontrak untuk transaksi rendah: ${financialComplianceRate.toFixed(1)}%`,
      );
      recommendations.push(
        "Pastikan setiap transaksi memiliki kontrak Wakalah bil Ujrah",
      );
    }

    // Check audit compliance
    if (!auditCompliance) {
      issues.push("Audit trail tidak lengkap atau ada gap dalam logging");
      recommendations.push(
        "Review sistem logging dan pastikan semua operasi kritis tercatat",
      );
    }

    // Determine overall status
    let overall: "compliant" | "needs_attention" | "non_compliant";

    if (contractCompliance && financialCompliance && auditCompliance) {
      overall = "compliant";
    } else if (issues.length <= 1) {
      overall = "needs_attention";
    } else {
      overall = "non_compliant";
    }

    return {
      overall,
      contractCompliance,
      financialCompliance,
      auditCompliance,
      issues,
      recommendations,
    };
  }

  /**
   * Check if audit trail has gaps
   */
  static hasAuditGaps(
    totalTransactions: number,
    auditedTransactions: number,
  ): boolean {
    return auditedTransactions < totalTransactions;
  }

  /**
   * Calculate retention compliance
   */
  static isRetentionCompliant(
    oldestLogDate: Date | null,
    currentDate: Date = new Date(),
  ): boolean {
    if (!oldestLogDate) return true;

    const daysSinceOldest = Math.floor(
      (currentDate.getTime() - oldestLogDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Compliant if oldest log is within 7 years (2,555 days)
    return daysSinceOldest <= 2555;
  }

  /**
   * Generate compliance summary
   */
  static generateSummary(dashboard: ComplianceDashboard): string {
    const { complianceStatus, contractMetrics, financialMetrics } = dashboard;

    const summary: string[] = [];

    summary.push(
      `Status Kepatuhan: ${this.getStatusText(complianceStatus.overall)}`,
    );
    summary.push(
      `Tingkat Penandatanganan Kontrak: ${contractMetrics.complianceRate.toFixed(1)}%`,
    );
    summary.push(
      `Tingkat Kepatuhan Finansial: ${financialMetrics.financialComplianceRate.toFixed(1)}%`,
    );

    if (complianceStatus.issues.length > 0) {
      summary.push("\nIsu yang Perlu Perhatian:");
      complianceStatus.issues.forEach((issue, index) => {
        summary.push(`${index + 1}. ${issue}`);
      });
    }

    if (complianceStatus.recommendations.length > 0) {
      summary.push("\nRekomendasi:");
      complianceStatus.recommendations.forEach((rec, index) => {
        summary.push(`${index + 1}. ${rec}`);
      });
    }

    return summary.join("\n");
  }

  /**
   * Get status text in Indonesian
   */
  static getStatusText(
    status: "compliant" | "needs_attention" | "non_compliant",
  ): string {
    const statusMap = {
      compliant: "Patuh",
      needs_attention: "Perlu Perhatian",
      non_compliant: "Tidak Patuh",
    };

    return statusMap[status];
  }

  /**
   * Calculate days until submission deadline
   */
  static getDaysUntilDeadline(
    deadline: Date,
    currentDate: Date = new Date(),
  ): number {
    return Math.ceil(
      (deadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  /**
   * Check if report is overdue
   */
  static isReportOverdue(
    deadline: Date,
    currentDate: Date = new Date(),
  ): boolean {
    return currentDate > deadline;
  }

  /**
   * Get next SISKOPATUH submission deadline
   * Reports are due monthly on the 10th
   */
  static getNextSiskopathDeadline(currentDate: Date = new Date()): Date {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // If before 10th of current month, deadline is 10th of current month
    if (currentDate.getDate() < 10) {
      return new Date(year, month, 10);
    }

    // Otherwise, deadline is 10th of next month
    return new Date(year, month + 1, 10);
  }

  /**
   * Validate report data completeness
   */
  static validateReportData(data: Record<string, any>): {
    valid: boolean;
    missingFields: string[];
  } {
    const requiredFields = [
      "agencyName",
      "agencyNpwp",
      "periodStart",
      "periodEnd",
      "totalJamaah",
      "totalContracts",
      "totalRevenue",
    ];

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!data[field]) {
        missingFields.push(field);
      }
    }

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Calculate compliance score (0-100)
   */
  static calculateComplianceScore(
    contractComplianceRate: number,
    financialComplianceRate: number,
    auditCompliance: boolean,
  ): number {
    // Contract compliance: 40%
    // Financial compliance: 40%
    // Audit compliance: 20%

    const contractScore = contractComplianceRate * 0.4;
    const financialScore = financialComplianceRate * 0.4;
    const auditScore = auditCompliance ? 20 : 0;

    return Math.round(contractScore + financialScore + auditScore);
  }
}
