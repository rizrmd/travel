# Audit Trail Retention Policy

## Overview

Platform ini menerapkan kebijakan retensi audit trail selama 7 tahun sesuai dengan best practices kepatuhan dan regulasi industri keuangan.

## Legal & Regulatory Basis

### Indonesian Regulations

1. **UU No. 8 Tahun 1997** - Dokumen Perusahaan
   - Minimum retention: 5 years
   - Financial records: 10 years

2. **Peraturan Bank Indonesia** - Transaksi Elektronik
   - E-commerce transaction logs: 5 years
   - Payment records: 7 years

3. **UU ITE No. 19 Tahun 2016** - Informasi dan Transaksi Elektronik
   - Electronic transaction records: 5 years minimum

### Industry Standards

1. **ISO 27001** - Information Security Management
   - Recommends 7 years for financial audit logs

2. **PCI DSS** - Payment Card Industry Data Security Standard
   - Minimum 1 year, recommended 3 years

3. **SOC 2** - System and Organization Controls
   - Typically 7 years for Type II compliance

## Retention Period

**Primary Retention:** 7 years (2,555 days)

### Rationale

- Complies with Indonesian financial regulations
- Exceeds minimum requirements
- Supports legal proceedings (statute of limitations)
- Enables historical analysis and audits

## What Gets Logged

### Financial Transactions (Critical)

```typescript
{
  logType: 'financial_transaction',
  actions: [
    'payment_created',
    'payment_confirmed',
    'payment_cancelled',
    'payment_refunded',
    'commission_calculated',
    'commission_paid'
  ],
  retention: '7 years (immutable)'
}
```

### Contract Operations

```typescript
{
  logType: 'contract_operation',
  actions: [
    'contract_generated',
    'contract_sent',
    'contract_viewed',
    'contract_signed',
    'contract_cancelled'
  ],
  retention: '7 years (immutable)'
}
```

### Critical Operations

```typescript
{
  logType: 'critical_operation',
  actions: [
    'user_role_changed',
    'user_suspended',
    'tenant_suspended',
    'config_changed',
    'data_exported'
  ],
  retention: '7 years (immutable)'
}
```

### Data Exports

```typescript
{
  logType: 'data_export',
  actions: [
    'data_exported',
    'report_generated'
  ],
  metadata: {
    exportType: string,
    recordCount: number,
    fileFormat: string
  },
  retention: '7 years (immutable)'
}
```

## Log Data Structure

### Audit Log Entry

```typescript
interface AuditLogEntry {
  // Identity
  id: string;
  tenantId: string;

  // Classification
  logType: AuditLogType;
  entityType: EntityType;
  entityId: string;
  action: AuditAction;

  // Actor Information
  actorId: string | null;
  actorRole: ActorRole;
  actorName: string;

  // State Changes
  beforeState: Record<string, any>;
  afterState: Record<string, any>;

  // Additional Context
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;

  // Timestamps
  createdAt: Date;
  retentionExpiresAt: Date; // createdAt + 7 years

  // Archival
  archived: boolean;
  archiveUrl: string | null;
}
```

## Immutability

### Database Constraints

```sql
-- Prevent updates
CREATE TRIGGER prevent_audit_log_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- Prevent deletes
CREATE TRIGGER prevent_audit_log_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
```

### Application-Level Protection

```typescript
// No update methods exposed
class AuditLogService {
  // Only append operations allowed
  async create(entry: AuditLogEntry): Promise<void>
  async read(id: string): Promise<AuditLogEntry>
  async search(filters: Filters): Promise<AuditLogEntry[]>

  // NO update or delete methods
}
```

## Archival Process

### Timeline

```
Age 0-6 years:    Hot Storage (PostgreSQL)
Age 6-7 years:    Warm Storage (PostgreSQL + S3)
Age 7+ years:     Cold Storage (S3 Glacier)
Age 10+ years:    Permanent Deletion
```

### Monthly Archival Job

Runs on 1st of each month at 02:00 AM (Asia/Jakarta):

```typescript
@Cron('0 2 1 * *')
async archiveOldLogs() {
  // 1. Find logs older than 7 years
  const logsToArchive = await this.findLogsOlderThan(2555);

  // 2. Export to JSON
  const archiveData = JSON.stringify(logsToArchive);

  // 3. Upload to S3 Glacier
  const s3Key = `archives/${tenantId}/${year}/${month}.json.gz`;
  await this.s3.upload(s3Key, gzip(archiveData), {
    storageClass: 'GLACIER'
  });

  // 4. Mark as archived in database
  await this.markAsArchived(logIds, s3Key);

  // 5. Verify archive integrity
  await this.verifyArchive(s3Key);
}
```

### Archive Format

```json
{
  "archive_metadata": {
    "tenant_id": "uuid",
    "archive_date": "2025-01-01T02:00:00Z",
    "period_start": "2018-01-01",
    "period_end": "2018-01-31",
    "total_logs": 15234,
    "checksum": "sha256:abc123..."
  },
  "logs": [
    {
      "id": "uuid",
      "created_at": "2018-01-15T10:30:00Z",
      "action": "payment_confirmed",
      "actor": "Ahmad Agent",
      "entity_id": "uuid",
      "before_state": {...},
      "after_state": {...}
    }
  ]
}
```

## Storage Costs

### Hot Storage (PostgreSQL)

- Estimated: 1KB per log entry
- 100K logs/year = 100MB
- 6 years = 600MB
- Cost: Minimal (included in DB hosting)

### Cold Storage (S3 Glacier)

- Years 7-10: $0.004/GB/month
- Compressed: 50% reduction
- 100K logs = 50MB compressed
- Cost: $0.0002/month (~Rp 3/month)

### Retrieval Costs

- Standard: 3-5 hours, $0.01/GB
- Expedited: 1-5 minutes, $0.03/GB
- Bulk: 5-12 hours, $0.0025/GB

**Recommendation:** Use Standard retrieval for compliance audits.

## Access Control

### Who Can Access Audit Logs?

```typescript
{
  super_admin: {
    read: 'all_tenants',
    export: 'all_tenants'
  },
  owner: {
    read: 'own_tenant',
    export: 'own_tenant'
  },
  agent: {
    read: 'own_actions_only',
    export: 'none'
  },
  jamaah: {
    read: 'own_records_only',
    export: 'none'
  }
}
```

### Row Level Security

```sql
-- Tenants can only see their own logs
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

## Search & Retrieval

### Search Capabilities

```typescript
interface AuditLogQuery {
  // Time-based
  startDate?: Date;
  endDate?: Date;

  // Classification
  logType?: AuditLogType;
  entityType?: EntityType;
  action?: AuditAction;

  // Actor
  actorId?: string;
  actorRole?: ActorRole;

  // Entity
  entityId?: string;

  // Pagination
  page: number;
  limit: number; // max 100
}
```

### Performance

- Indexed queries: <200ms (NFR-1.2)
- Non-indexed: <2s
- Export: <30s for 10K records

### Indexes

```sql
CREATE INDEX idx_audit_logs_tenant_created
  ON audit_logs (tenant_id, created_at DESC);

CREATE INDEX idx_audit_logs_tenant_type
  ON audit_logs (tenant_id, log_type);

CREATE INDEX idx_audit_logs_tenant_entity
  ON audit_logs (tenant_id, entity_type, entity_id);

CREATE INDEX idx_audit_logs_actor
  ON audit_logs (actor_id);
```

## Compliance Reports

### Monthly Compliance Report

Generated automatically, includes:
- Total logs created
- Breakdown by type
- Critical operations count
- Data export activities
- Retention compliance status

### Annual Audit Report

For external auditors:
- Complete audit trail
- Verification of immutability
- Archive integrity checks
- Access log review

## Sensitive Data Handling

### Data Sanitization

```typescript
const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'apiKey',
  'apiSecret',
  'accessToken',
  'refreshToken',
  'creditCard',
  'cvv',
  'pin'
];

function sanitize(data: any): any {
  const sanitized = {...data};
  for (const field of SENSITIVE_FIELDS) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
}
```

### GDPR Considerations

While Indonesia doesn't have GDPR, we follow similar principles:

1. **Right to be Informed:** Users know they're being logged
2. **Data Minimization:** Only log necessary data
3. **Storage Limitation:** 7-year retention, then deletion
4. **Security:** Encryption at rest and in transit

## Disaster Recovery

### Backup Strategy

- **Real-time:** Continuous database replication
- **Daily:** Full database backup
- **Monthly:** Archive to S3 Glacier
- **Geographic:** Multi-region S3 replication

### Recovery Time Objectives

- **Hot logs (0-6 years):** RTO 1 hour, RPO 5 minutes
- **Cold logs (7+ years):** RTO 24 hours, RPO 30 days

## Monitoring

### Alerts

```typescript
{
  "AuditLogWriteFailure": {
    severity: "critical",
    notification: ["ops-team", "security-team"],
    action: "Investigate immediately"
  },
  "AuditLogModificationAttempt": {
    severity: "critical",
    notification: ["security-team", "ciso"],
    action: "Security incident"
  },
  "RetentionComplianceViolation": {
    severity: "high",
    notification: ["compliance-team"],
    action: "Archive old logs"
  },
  "ArchivalJobFailure": {
    severity: "medium",
    notification: ["ops-team"],
    action: "Re-run archival job"
  }
}
```

### Metrics

- Logs created per day
- Average log size
- Storage growth rate
- Archive success rate
- Query performance

## Questions?

For audit and compliance questions:
- Compliance Team: compliance@travelumroh.com
- Security Team: security@travelumroh.com
- Legal Team: legal@travelumroh.com
