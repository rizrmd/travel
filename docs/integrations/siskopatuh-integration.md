# SISKOPATUH Government Reporting Integration

## Overview

SISKOPATUH (Sistem Komputerisasi Penyelenggaraan Perjalanan Ibadah Umrah dan Haji) is the Indonesian Ministry of Religious Affairs (Kementerian Agama RI) official system for tracking and monitoring Umroh pilgrims.

All registered travel agencies operating Umroh packages in Indonesia are **legally required** to submit:

1. **Jamaah Registration** - Individual pilgrim data when jamaah status becomes 'ready'
2. **Departure Manifest** - Complete group manifest 3 days before departure
3. **Return Manifest** - Return confirmation on actual return date

## Current Status

**Integration Status:** STUB MODE (Development)

This integration is currently implemented in **stub/mock mode** because formal partnership with Kementerian Agama RI requires:

- Official travel agency registration (PPIU/PIHK license)
- Government API credentials from Kementerian Agama
- Signed MoU for data submission
- Compliance audit and approval

When `SISKOPATUH_ENABLED=false` (default), all submissions return simulated responses without actually contacting the government API.

## Architecture

### Database Schema

**Table: `siskopatuh_submissions`**

```sql
- id: UUID (primary key)
- tenant_id: UUID (tenant isolation)
- submission_type: ENUM ('jamaah_registration', 'departure_manifest', 'return_manifest')
- jamaah_id: UUID (nullable, references jamaah table)
- package_id: UUID (nullable, references packages table)
- reference_number: VARCHAR(100) - SISKOPATUH reference returned from API
- submission_data: JSONB - Full payload sent to SISKOPATUH
- response_data: JSONB - Response from SISKOPATUH API
- status: ENUM ('pending', 'submitted', 'accepted', 'rejected', 'failed')
- error_message: TEXT
- submitted_at: TIMESTAMP
- accepted_at: TIMESTAMP
- retry_count: INTEGER (max 3)
- created_at, updated_at, deleted_at: TIMESTAMP
```

**Indexes:**
- `tenant_id`, `jamaah_id`, `package_id`, `status`, `submission_type`, `reference_number`
- RLS enabled for tenant isolation

### Module Structure

```
src/siskopatuh/
├── siskopatuh.module.ts          # NestJS module
├── domain/
│   ├── submission-type.enum.ts    # Submission types
│   └── submission-status.enum.ts  # Submission statuses
├── entities/
│   └── siskopatuh-submission.entity.ts  # TypeORM entity
├── dto/
│   ├── jamaah-registration.dto.ts       # Jamaah registration payload
│   ├── departure-manifest.dto.ts        # Departure manifest payload
│   ├── return-manifest.dto.ts           # Return manifest payload
│   ├── create-submission.dto.ts
│   ├── query-submissions.dto.ts
│   ├── compliance-report-query.dto.ts
│   └── webhook-payload.dto.ts
├── services/
│   ├── siskopatuh.service.ts            # Core business logic
│   ├── siskopatuh-api.service.ts        # API client (stub/production)
│   └── manifest-builder.service.ts      # Manifest generation
├── controllers/
│   ├── siskopatuh.controller.ts         # Main API endpoints
│   └── siskopatuh-webhook.controller.ts # Webhook handler
└── processors/
    └── siskopatuh-submission.processor.ts  # BullMQ job processor
```

## API Endpoints

### Main Endpoints

#### 1. Submit Jamaah Registration
```http
POST /api/v1/siskopatuh/jamaah/:id/submit
```

**Description:** Submit individual jamaah registration to SISKOPATUH.

**When to use:** Automatically triggered when jamaah status changes to `ready`, or manually via dashboard.

**Response:**
```json
{
  "success": true,
  "message": "Jamaah registration queued for submission",
  "data": {
    "submissionId": "uuid",
    "jamaahId": "uuid",
    "status": "pending",
    "queuedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Submit Departure Manifest
```http
POST /api/v1/siskopatuh/packages/:id/departure-manifest
```

**Description:** Generate and submit departure manifest for all ready jamaah in package.

**When to use:** 3 days before departure date (auto-scheduled) or manually triggered.

**Response:**
```json
{
  "success": true,
  "message": "Departure manifest queued for submission",
  "data": {
    "submissionId": "uuid",
    "packageId": "uuid",
    "status": "pending",
    "queuedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 3. Submit Return Manifest
```http
POST /api/v1/siskopatuh/packages/:id/return-manifest
```

**Description:** Generate and submit return manifest with actual return status.

**When to use:** On package return date (auto-scheduled) or manually triggered.

**Response:**
```json
{
  "success": true,
  "message": "Return manifest queued for submission",
  "data": {
    "submissionId": "uuid",
    "packageId": "uuid",
    "status": "pending",
    "queuedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. List Submissions
```http
GET /api/v1/siskopatuh/submissions?status=pending&page=1&limit=20
```

**Query Parameters:**
- `submission_type`: Filter by type (jamaah_registration, departure_manifest, return_manifest)
- `status`: Filter by status (pending, submitted, accepted, rejected, failed)
- `jamaah_id`: Filter by jamaah ID
- `package_id`: Filter by package ID
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

#### 5. Get Submission Details
```http
GET /api/v1/siskopatuh/submissions/:id
```

**Response includes:**
- Full submission data sent to SISKOPATUH
- API response data
- Current status and timestamps
- Retry count and error messages (if any)

#### 6. Retry Failed Submission
```http
POST /api/v1/siskopatuh/submissions/:id/retry
```

**Description:** Manually retry a failed submission.

**Requirements:** Submission status must be `failed`.

#### 7. Compliance Report
```http
GET /api/v1/siskopatuh/compliance-report?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z"
    },
    "totalJamaah": 150,
    "statistics": {
      "totalSubmissions": 150,
      "pending": 2,
      "submitted": 5,
      "accepted": 140,
      "rejected": 2,
      "failed": 1
    },
    "complianceRate": 93.33,
    "submissions": [...]
  }
}
```

#### 8. Integration Status
```http
GET /api/v1/siskopatuh/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": false,
    "mode": "STUB",
    "apiUrl": "https://siskopatuh.kemenag.go.id/api/v1",
    "agencyCode": "NOT_CONFIGURED"
  }
}
```

### Webhook Endpoint

#### Receive Status Updates
```http
POST /api/v1/siskopatuh/webhook
```

**Description:** Receives asynchronous status updates from SISKOPATUH system.

**Headers:**
- `x-siskopatuh-signature`: SHA-256 HMAC signature for verification

**Payload:**
```json
{
  "reference_number": "JMRH-1703350000000",
  "status": "accepted",
  "message": "Data jamaah telah diverifikasi dan diterima",
  "signature": "sha256=...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Security:** Webhook signature is verified using `SISKOPATUH_WEBHOOK_SECRET`.

## Data Flow

### 1. Jamaah Registration Flow

```
Jamaah status → ready
    ↓
Auto-trigger OR Manual submit
    ↓
Create submission record (pending)
    ↓
Queue BullMQ job
    ↓
Process submission → Call SISKOPATUH API
    ↓
Update status → submitted
    ↓
SISKOPATUH processes (async)
    ↓
Webhook callback → Update to accepted/rejected
    ↓
WebSocket notification to dashboard
```

### 2. Departure Manifest Flow

```
Package departure date - 3 days
    ↓
Cron job triggers auto-generation
    ↓
Fetch all ready jamaah for package
    ↓
Build manifest with flight/hotel/muthawif details
    ↓
Create submission record (pending)
    ↓
Queue BullMQ job
    ↓
Submit to SISKOPATUH API
    ↓
Webhook confirmation → accepted
```

### 3. Return Manifest Flow

```
Package return date
    ↓
Auto-trigger return manifest generation
    ↓
Fetch departure manifest reference
    ↓
Build return manifest with status per jamaah
    ↓
Submit to SISKOPATUH
    ↓
Update jamaah status to completed
```

## Environment Variables

Add to `.env`:

```env
# SISKOPATUH Integration
SISKOPATUH_ENABLED=false                                      # Set to true after government approval
SISKOPATUH_API_URL=https://siskopatuh.kemenag.go.id/api/v1   # Government API URL
SISKOPATUH_API_KEY=your_api_key_here                          # Provided by Kementerian Agama
SISKOPATUH_AGENCY_CODE=your_agency_code                       # Your PPIU/PIHK code
SISKOPATUH_WEBHOOK_SECRET=your_webhook_secret                 # For webhook signature verification
```

## Automated Workflows

### Auto-Submission on Jamaah Status Change

When jamaah status changes to `ready`, automatically submit registration:

```typescript
// In JamaahService or status change handler
if (newStatus === JamaahStatus.READY) {
  await this.siskopatuhService.submitJamaahRegistration(
    jamaah.id,
    jamaah.tenant_id
  );
}
```

### Scheduled Departure Manifest (3 days before)

```typescript
// In cron job or scheduler
@Cron('0 9 * * *') // Daily at 9 AM
async scheduleDepartureManifests() {
  const threeDaysFromNow = addDays(new Date(), 3);

  const packages = await this.packageRepository.find({
    where: {
      departure_date: threeDaysFromNow,
      status: PackageStatus.CONFIRMED,
    },
  });

  for (const pkg of packages) {
    await this.siskopatuhService.submitDepartureManifest(
      pkg.id,
      pkg.tenant_id
    );
  }
}
```

### Scheduled Return Manifest (on return date)

```typescript
@Cron('0 18 * * *') // Daily at 6 PM
async scheduleReturnManifests() {
  const today = new Date();

  const packages = await this.packageRepository.find({
    where: {
      return_date: today,
      status: PackageStatus.IN_PROGRESS,
    },
  });

  for (const pkg of packages) {
    await this.siskopatuhService.submitReturnManifest(
      pkg.id,
      pkg.tenant_id
    );
  }
}
```

## Retry Logic

**Max Retry Attempts:** 3

**Backoff Strategy:** Exponential
- Retry 1: 2 minutes (2^1 * 60s)
- Retry 2: 4 minutes (2^2 * 60s)
- Retry 3: 8 minutes (2^3 * 60s)

After 3 failed attempts, submission status is set to `failed` and requires manual intervention.

## Error Handling

### Common Errors

1. **Missing Required Data**
   - Status: `failed`
   - Message: "Missing required field: nomor_paspor"
   - Action: Update jamaah data and retry

2. **Duplicate Submission**
   - Status: `rejected`
   - Message: "Jamaah already registered with reference JMRH-xxx"
   - Action: No action needed, already registered

3. **API Timeout**
   - Status: `failed`
   - Retry: Automatic (up to 3 times)

4. **Invalid Credentials**
   - Status: `failed`
   - Message: "Invalid API key or agency code"
   - Action: Check `SISKOPATUH_API_KEY` and `SISKOPATUH_AGENCY_CODE`

## Production Activation Checklist

Before enabling production mode (`SISKOPATUH_ENABLED=true`):

### 1. Legal Requirements
- [ ] Valid PPIU/PIHK license from Kementerian Agama
- [ ] Signed MoU with Kementerian Agama RI
- [ ] Completed data sharing agreement

### 2. Technical Setup
- [ ] Obtain API credentials from Kementerian Agama
- [ ] Configure `SISKOPATUH_API_KEY`
- [ ] Configure `SISKOPATUH_AGENCY_CODE`
- [ ] Configure `SISKOPATUH_WEBHOOK_SECRET`
- [ ] Test API connectivity in staging environment

### 3. Data Validation
- [ ] Ensure all jamaah have valid NIK (16 digits)
- [ ] Ensure all jamaah have valid passport data
- [ ] Verify address data includes province and city
- [ ] Validate emergency contact information

### 4. Infrastructure
- [ ] Set up webhook endpoint with SSL certificate
- [ ] Configure firewall to allow SISKOPATUH IP addresses
- [ ] Set up monitoring and alerting for failed submissions
- [ ] Configure BullMQ for high availability

### 5. Testing
- [ ] Test jamaah registration in staging
- [ ] Test departure manifest generation
- [ ] Test return manifest generation
- [ ] Test webhook signature verification
- [ ] Perform end-to-end test with sample data

### 6. Compliance
- [ ] Document all API calls for audit trail
- [ ] Set up compliance dashboard monitoring
- [ ] Train staff on SISKOPATUH requirements
- [ ] Establish SOP for handling submission failures

## Integration with Epic 5 (Jamaah Management)

### Display SISKOPATUH Status in Jamaah Details

```typescript
// In JamaahDetailsComponent or API response
{
  "jamaah": {
    "id": "uuid",
    "full_name": "Ahmad Fauzi",
    "status": "ready",
    // ... other jamaah fields
    "siskopatuh_status": {
      "submitted": true,
      "reference_number": "JMRH-1703350000000",
      "status": "accepted",
      "submitted_at": "2024-01-15T10:30:00Z",
      "accepted_at": "2024-01-15T14:20:00Z"
    }
  }
}
```

## Integration with Epic 12 (Compliance)

### Compliance Dashboard Integration

SISKOPATUH submissions are automatically tracked in the compliance dashboard:

```typescript
// Compliance metrics include
{
  "siskopatuh_compliance": {
    "total_jamaah": 150,
    "registered_siskopatuh": 148,
    "pending_submission": 2,
    "compliance_rate": 98.67,
    "last_submission": "2024-01-15T10:30:00Z"
  }
}
```

### Audit Trail

All SISKOPATUH submissions are logged to audit trail (Epic 12):

```typescript
await this.auditLogService.log({
  event: 'siskopatuh_submission_created',
  entity: 'siskopatuh_submission',
  entityId: submission.id,
  tenantId: submission.tenant_id,
  data: {
    submission_type: submission.submission_type,
    jamaah_id: submission.jamaah_id,
    package_id: submission.package_id,
  },
});
```

## Troubleshooting

### Issue: Submissions stuck in "pending"

**Cause:** BullMQ queue not processing jobs

**Solution:**
1. Check Redis connection
2. Restart queue processor: `pm2 restart siskopatuh-queue`
3. Check queue health: `GET /api/v1/queue/health`

### Issue: All submissions failing in production

**Cause:** Invalid API credentials

**Solution:**
1. Verify `SISKOPATUH_API_KEY` is correct
2. Verify `SISKOPATUH_AGENCY_CODE` matches your license
3. Contact Kementerian Agama support for credential reset

### Issue: Webhook not updating status

**Cause:** Signature verification failing

**Solution:**
1. Verify `SISKOPATUH_WEBHOOK_SECRET` is correct
2. Check webhook logs for signature mismatch errors
3. Test webhook with sample payload

## Support and Resources

### Government Resources
- **Kementerian Agama RI:** https://kemenag.go.id
- **SISKOPATUH Portal:** https://siskopatuh.kemenag.go.id
- **Support Email:** support-siskopatuh@kemenag.go.id
- **Hotline:** 021-xxxx-xxxx (available after partnership)

### Internal Resources
- **Technical Docs:** `/docs/integrations/siskopatuh-integration.md`
- **API Reference:** Swagger at `/api/docs#/SISKOPATUH%20Integration`
- **Code Location:** `/src/siskopatuh/`

## Roadmap

### Phase 1: Foundation (Current - STUB MODE)
- [x] Database schema and migrations
- [x] Core services and API client (stub mode)
- [x] Controllers and endpoints
- [x] BullMQ job processor
- [x] Webhook handler
- [x] Documentation

### Phase 2: Government Partnership (Q2 2025)
- [ ] Obtain PPIU/PIHK license
- [ ] Sign MoU with Kementerian Agama
- [ ] Receive API credentials
- [ ] Staging environment testing
- [ ] Production activation

### Phase 3: Automation (Q3 2025)
- [ ] Auto-submission on jamaah status change
- [ ] Scheduled manifest generation
- [ ] Real-time WebSocket notifications
- [ ] Compliance dashboard widgets
- [ ] Automated retry with smarter backoff

### Phase 4: Enhancements (Q4 2025)
- [ ] Bulk submission for historical data
- [ ] Advanced analytics and reporting
- [ ] Integration with MoRA's extended services
- [ ] Mobile app support for field officers

---

**Last Updated:** 2024-12-23
**Version:** 1.0.0
**Status:** STUB MODE - Awaiting Government Partnership
