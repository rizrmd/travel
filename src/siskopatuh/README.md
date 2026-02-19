# SISKOPATUH Module - Quick Reference

## Overview

SISKOPATUH (Sistem Komputerisasi Penyelenggaraan Perjalanan Ibadah Umrah dan Haji) integration module for government reporting to Indonesian Ministry of Religious Affairs.

**Status:** STUB MODE (Production-Ready Infrastructure)

## Quick Start

### 1. Environment Setup

Add to `.env`:

```env
SISKOPATUH_ENABLED=false
SISKOPATUH_API_URL=https://siskopatuh.kemenag.go.id/api/v1
SISKOPATUH_API_KEY=your_api_key
SISKOPATUH_AGENCY_CODE=your_agency_code
SISKOPATUH_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Run Migration

```bash
npm run migration:run
```

### 3. Test Integration

```bash
# Check status
curl http://localhost:3000/api/v1/siskopatuh/status

# Expected: { "enabled": false, "mode": "STUB" }
```

## API Endpoints

### Submit Jamaah Registration
```typescript
POST /api/v1/siskopatuh/jamaah/:id/submit
```

### Submit Departure Manifest
```typescript
POST /api/v1/siskopatuh/packages/:id/departure-manifest
```

### Submit Return Manifest
```typescript
POST /api/v1/siskopatuh/packages/:id/return-manifest
```

### List Submissions
```typescript
GET /api/v1/siskopatuh/submissions?status=pending&page=1
```

### Get Submission Details
```typescript
GET /api/v1/siskopatuh/submissions/:id
```

### Retry Failed Submission
```typescript
POST /api/v1/siskopatuh/submissions/:id/retry
```

### Compliance Report
```typescript
GET /api/v1/siskopatuh/compliance-report?start_date=2024-01-01
```

### Integration Status
```typescript
GET /api/v1/siskopatuh/status
```

## Usage Examples

### From Another Service

```typescript
import { SiskopatuhService } from '../siskopatuh/services';

@Injectable()
export class JamaahService {
  constructor(
    private readonly siskopatuhService: SiskopatuhService
  ) {}

  async updateJamaahStatus(jamaahId: string, status: JamaahStatus) {
    // Update jamaah status
    await this.jamaahRepository.update(jamaahId, { status });

    // Auto-submit to SISKOPATUH when status becomes 'ready'
    if (status === JamaahStatus.READY) {
      await this.siskopatuhService.submitJamaahRegistration(
        jamaahId,
        jamaah.tenant_id
      );
    }
  }
}
```

### Scheduled Jobs

```typescript
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PackageScheduler {
  constructor(
    private readonly siskopatuhService: SiskopatuhService
  ) {}

  // Auto-generate departure manifests 3 days before departure
  @Cron('0 9 * * *') // Daily at 9 AM
  async scheduleDepartureManifests() {
    const threeDaysFromNow = addDays(new Date(), 3);

    const packages = await this.packageRepository.find({
      where: { departure_date: threeDaysFromNow }
    });

    for (const pkg of packages) {
      await this.siskopatuhService.submitDepartureManifest(
        pkg.id,
        pkg.tenant_id
      );
    }
  }
}
```

## Module Structure

```
src/siskopatuh/
├── siskopatuh.module.ts              # Main module
├── domain/                            # Domain enums
│   ├── submission-type.enum.ts
│   └── submission-status.enum.ts
├── entities/                          # TypeORM entities
│   └── siskopatuh-submission.entity.ts
├── dto/                               # Data Transfer Objects
│   ├── jamaah-registration.dto.ts
│   ├── departure-manifest.dto.ts
│   ├── return-manifest.dto.ts
│   └── ...
├── services/                          # Business logic
│   ├── siskopatuh.service.ts         # Core service
│   ├── siskopatuh-api.service.ts     # API client (STUB/PROD)
│   └── manifest-builder.service.ts   # Manifest generation
├── controllers/                       # REST endpoints
│   ├── siskopatuh.controller.ts
│   └── siskopatuh-webhook.controller.ts
└── processors/                        # Background jobs
    └── siskopatuh-submission.processor.ts
```

## Submission Lifecycle

```
1. CREATE
   ↓
2. PENDING (queued in BullMQ)
   ↓
3. SUBMITTED (sent to SISKOPATUH API)
   ↓
4a. ACCEPTED (webhook confirms)
   OR
4b. REJECTED (webhook rejects)
   OR
4c. FAILED (retry up to 3 times)
```

## Retry Logic

- **Max Attempts:** 3
- **Backoff:** Exponential (2min, 4min, 8min)
- **After 3 Failures:** Manual retry required

## STUB Mode vs Production Mode

### STUB Mode (Default)
- Returns mock responses immediately
- No actual API calls to government
- Perfect for development/testing
- Reference numbers: `JMRH-{timestamp}`, `DEPT-{timestamp}`, `RETN-{timestamp}`

### Production Mode
- Actual API calls to SISKOPATUH
- Requires valid credentials
- Webhook signature verification
- Legal compliance required

**Toggle:** Set `SISKOPATUH_ENABLED=true` in `.env`

## Common Tasks

### Check Submission Status
```typescript
const submission = await this.siskopatuhService.getSubmission(
  submissionId,
  tenantId
);

console.log(submission.status); // pending, submitted, accepted, rejected, failed
console.log(submission.reference_number); // JMRH-1703350000000
```

### Generate Compliance Report
```typescript
const report = await this.siskopatuhService.generateComplianceReport(
  tenantId,
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

console.log(report.complianceRate); // 98.67
```

### Manual Retry
```typescript
await this.siskopatuhService.retrySubmission(
  submissionId,
  tenantId
);
```

## Validation Requirements

### Jamaah Registration
- NIK: Must be 16 digits
- Passport: Required
- Date of Birth: ISO 8601 format
- Address: Must include province and city
- Emergency Contact: Name, phone, relationship required

### Departure Manifest
- All jamaah must have status 'ready'
- Flight details required
- Hotel details (Makkah & Madinah) required
- Muthawif information required

### Return Manifest
- Must have accepted departure manifest
- Return status per jamaah (returned/extended/not_returned)
- Return flight details required

## Troubleshooting

### Submissions Stuck in Pending
**Cause:** BullMQ not processing
**Fix:** Check Redis connection, restart queue

### All Submissions Failing
**Cause:** Invalid credentials
**Fix:** Verify `SISKOPATUH_API_KEY` and `SISKOPATUH_AGENCY_CODE`

### Webhook Not Working
**Cause:** Signature mismatch
**Fix:** Verify `SISKOPATUH_WEBHOOK_SECRET`

## Documentation

- **Full Guide:** `/docs/integrations/siskopatuh-integration.md`
- **Implementation Summary:** `/SISKOPATUH_IMPLEMENTATION_SUMMARY.md`
- **Swagger API Docs:** `http://localhost:3000/api/docs`

## Support

- **Code Issues:** Check logs in `logs/siskopatuh.log`
- **Government API:** support-siskopatuh@kemenag.go.id
- **Internal:** Refer to documentation files

---

**Version:** 1.0.0
**Last Updated:** 2024-12-23
