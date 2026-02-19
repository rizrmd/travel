/**
 * Domain Model: Diagnostic Result
 *
 * Business logic for system diagnostic checks and health validation
 */

export enum DiagnosticCheckType {
  DATABASE_CONNECTIVITY = "database_connectivity",
  REDIS_CONNECTIVITY = "redis_connectivity",
  API_HEALTH = "api_health",
  DATA_INTEGRITY = "data_integrity",
  DISK_SPACE = "disk_space",
  MEMORY = "memory",
  QUEUE_HEALTH = "queue_health",
  EXTERNAL_SERVICES = "external_services",
}

export enum DiagnosticStatus {
  PASS = "pass",
  WARNING = "warning",
  FAIL = "fail",
}

export interface DiagnosticDetails {
  message: string;
  details?: Record<string, any>;
  recommendation?: string;
  autoFixAvailable?: boolean;
  errorCode?: string;
}

export class DiagnosticResult {
  constructor(
    public readonly tenantId: string | null,
    public readonly checkType: DiagnosticCheckType,
    public readonly status: DiagnosticStatus,
    public readonly details: DiagnosticDetails,
    public readonly durationMs: number,
    public readonly ranById: string,
    public readonly ranAt: Date = new Date(),
  ) {}

  /**
   * Check if result indicates a critical issue
   */
  isCritical(): boolean {
    return this.status === DiagnosticStatus.FAIL;
  }

  /**
   * Check if auto-fix is available
   */
  canAutoFix(): boolean {
    return (
      this.details.autoFixAvailable === true &&
      this.status !== DiagnosticStatus.PASS
    );
  }

  /**
   * Get status color for UI
   */
  getStatusColor(): "green" | "yellow" | "red" {
    const colorMap: Record<DiagnosticStatus, "green" | "yellow" | "red"> = {
      [DiagnosticStatus.PASS]: "green",
      [DiagnosticStatus.WARNING]: "yellow",
      [DiagnosticStatus.FAIL]: "red",
    };

    return colorMap[this.status];
  }

  /**
   * Get status icon for UI
   */
  getStatusIcon(): "check" | "warning" | "error" {
    const iconMap: Record<DiagnosticStatus, "check" | "warning" | "error"> = {
      [DiagnosticStatus.PASS]: "check",
      [DiagnosticStatus.WARNING]: "warning",
      [DiagnosticStatus.FAIL]: "error",
    };

    return iconMap[this.status];
  }

  /**
   * Format duration for display
   */
  getFormattedDuration(): string {
    if (this.durationMs < 1000) {
      return `${this.durationMs}ms`;
    }

    return `${(this.durationMs / 1000).toFixed(2)}s`;
  }

  /**
   * Get check type display name in Indonesian
   */
  getCheckTypeLabel(): string {
    const labels: Record<DiagnosticCheckType, string> = {
      [DiagnosticCheckType.DATABASE_CONNECTIVITY]: "Konektivitas Database",
      [DiagnosticCheckType.REDIS_CONNECTIVITY]: "Konektivitas Redis",
      [DiagnosticCheckType.API_HEALTH]: "Kesehatan API",
      [DiagnosticCheckType.DATA_INTEGRITY]: "Integritas Data",
      [DiagnosticCheckType.DISK_SPACE]: "Ruang Disk",
      [DiagnosticCheckType.MEMORY]: "Penggunaan Memori",
      [DiagnosticCheckType.QUEUE_HEALTH]: "Kesehatan Queue",
      [DiagnosticCheckType.EXTERNAL_SERVICES]: "Layanan Eksternal",
    };

    return labels[this.checkType] || this.checkType;
  }

  /**
   * Generate summary report
   */
  generateSummary(): string {
    const statusText = {
      [DiagnosticStatus.PASS]: "Lulus",
      [DiagnosticStatus.WARNING]: "Peringatan",
      [DiagnosticStatus.FAIL]: "Gagal",
    };

    return `${this.getCheckTypeLabel()}: ${statusText[this.status]} - ${this.details.message}`;
  }

  /**
   * Create database connectivity check result
   */
  static createDatabaseCheck(
    tenantId: string | null,
    success: boolean,
    durationMs: number,
    ranById: string,
    error?: string,
  ): DiagnosticResult {
    if (success) {
      return new DiagnosticResult(
        tenantId,
        DiagnosticCheckType.DATABASE_CONNECTIVITY,
        DiagnosticStatus.PASS,
        {
          message: "Koneksi database berhasil",
          details: { responseTime: `${durationMs}ms` },
        },
        durationMs,
        ranById,
      );
    }

    return new DiagnosticResult(
      tenantId,
      DiagnosticCheckType.DATABASE_CONNECTIVITY,
      DiagnosticStatus.FAIL,
      {
        message: "Koneksi database gagal",
        details: { error },
        recommendation: "Periksa konfigurasi database dan kredensial",
        autoFixAvailable: true,
        errorCode: "DB_CONN_001",
      },
      durationMs,
      ranById,
    );
  }

  /**
   * Create Redis connectivity check result
   */
  static createRedisCheck(
    success: boolean,
    durationMs: number,
    ranById: string,
    error?: string,
  ): DiagnosticResult {
    if (success) {
      return new DiagnosticResult(
        null,
        DiagnosticCheckType.REDIS_CONNECTIVITY,
        DiagnosticStatus.PASS,
        {
          message: "Koneksi Redis berhasil",
          details: { responseTime: `${durationMs}ms` },
        },
        durationMs,
        ranById,
      );
    }

    return new DiagnosticResult(
      null,
      DiagnosticCheckType.REDIS_CONNECTIVITY,
      DiagnosticStatus.FAIL,
      {
        message: "Koneksi Redis gagal",
        details: { error },
        recommendation: "Periksa service Redis dan konfigurasi",
        autoFixAvailable: true,
        errorCode: "REDIS_CONN_001",
      },
      durationMs,
      ranById,
    );
  }

  /**
   * Create data integrity check result
   */
  static createDataIntegrityCheck(
    tenantId: string,
    issues: string[],
    durationMs: number,
    ranById: string,
  ): DiagnosticResult {
    if (issues.length === 0) {
      return new DiagnosticResult(
        tenantId,
        DiagnosticCheckType.DATA_INTEGRITY,
        DiagnosticStatus.PASS,
        {
          message: "Data integrity check passed",
          details: {
            checksPerformed: [
              "orphaned_records",
              "foreign_keys",
              "null_constraints",
            ],
          },
        },
        durationMs,
        ranById,
      );
    }

    const status =
      issues.length > 5 ? DiagnosticStatus.FAIL : DiagnosticStatus.WARNING;

    return new DiagnosticResult(
      tenantId,
      DiagnosticCheckType.DATA_INTEGRITY,
      status,
      {
        message: `Ditemukan ${issues.length} masalah integritas data`,
        details: { issues },
        recommendation: "Review dan perbaiki masalah integritas data",
        autoFixAvailable: false,
        errorCode: "DATA_INTEGRITY_001",
      },
      durationMs,
      ranById,
    );
  }

  /**
   * Create disk space check result
   */
  static createDiskSpaceCheck(
    usedPercentage: number,
    durationMs: number,
    ranById: string,
  ): DiagnosticResult {
    let status = DiagnosticStatus.PASS;
    let message = "Ruang disk mencukupi";

    if (usedPercentage >= 90) {
      status = DiagnosticStatus.FAIL;
      message = "Ruang disk kritis";
    } else if (usedPercentage >= 80) {
      status = DiagnosticStatus.WARNING;
      message = "Ruang disk rendah";
    }

    return new DiagnosticResult(
      null,
      DiagnosticCheckType.DISK_SPACE,
      status,
      {
        message,
        details: { usedPercentage: `${usedPercentage.toFixed(1)}%` },
        recommendation:
          status !== DiagnosticStatus.PASS
            ? "Hapus file tidak terpakai atau tambah storage"
            : undefined,
        autoFixAvailable: status === DiagnosticStatus.WARNING,
      },
      durationMs,
      ranById,
    );
  }

  /**
   * Create memory check result
   */
  static createMemoryCheck(
    usedPercentage: number,
    durationMs: number,
    ranById: string,
  ): DiagnosticResult {
    let status = DiagnosticStatus.PASS;
    let message = "Penggunaan memori normal";

    if (usedPercentage >= 95) {
      status = DiagnosticStatus.FAIL;
      message = "Penggunaan memori kritis";
    } else if (usedPercentage >= 80) {
      status = DiagnosticStatus.WARNING;
      message = "Penggunaan memori tinggi";
    }

    return new DiagnosticResult(
      null,
      DiagnosticCheckType.MEMORY,
      status,
      {
        message,
        details: { usedPercentage: `${usedPercentage.toFixed(1)}%` },
        recommendation:
          status !== DiagnosticStatus.PASS
            ? "Restart service atau optimize memory usage"
            : undefined,
        autoFixAvailable: status === DiagnosticStatus.WARNING,
      },
      durationMs,
      ranById,
    );
  }

  /**
   * Aggregate diagnostic results to overall health
   */
  static aggregateResults(results: DiagnosticResult[]): {
    overallStatus: DiagnosticStatus;
    passedCount: number;
    warningCount: number;
    failedCount: number;
  } {
    const passedCount = results.filter(
      (r) => r.status === DiagnosticStatus.PASS,
    ).length;
    const warningCount = results.filter(
      (r) => r.status === DiagnosticStatus.WARNING,
    ).length;
    const failedCount = results.filter(
      (r) => r.status === DiagnosticStatus.FAIL,
    ).length;

    let overallStatus = DiagnosticStatus.PASS;
    if (failedCount > 0) {
      overallStatus = DiagnosticStatus.FAIL;
    } else if (warningCount > 0) {
      overallStatus = DiagnosticStatus.WARNING;
    }

    return { overallStatus, passedCount, warningCount, failedCount };
  }
}
