# E-Signature Module (PrivyID Integration)

This module provides digital signature capabilities for Wakalah bil Ujrah contracts using PrivyID as the signature provider.

## Quick Start

### 1. Environment Setup

Copy environment variables:
```bash
cp .env.example.esignature .env
```

Configure PrivyID credentials:
```env
ESIGNATURE_ENABLED=false  # STUB mode for development
PRIVYID_API_KEY=your_api_key
PRIVYID_WEBHOOK_SECRET=your_secret
```

### 2. Run Migration

```bash
npm run migration:run
```

### 3. Test in STUB Mode

```typescript
// Send contract for signature
const result = await esignatureService.sendContractForSignature(contractId);

// Check status
const status = await esignatureService.getSignatureStatus(contractId);

// Simulate webhook event
await esignatureService.handleSignatureWebhook({
  signature_request_id: result.signatureRequestId,
  event: 'signed',
  signed_at: new Date().toISOString(),
  signer_email: 'test@example.com',
});
```

## Module Structure

```
esignature/
├── domain/              # Domain models and enums
│   ├── signature-status.enum.ts
│   └── event-type.enum.ts
├── entities/            # TypeORM entities
│   └── signature-event.entity.ts
├── dto/                 # Data Transfer Objects
│   ├── send-for-signature.dto.ts
│   ├── signature-webhook.dto.ts
│   └── signature-response.dto.ts
├── services/            # Business logic
│   ├── privy-id.service.ts         # PrivyID API client
│   ├── signature-tracker.service.ts # Event tracking
│   └── esignature.service.ts       # Main service
├── controllers/         # HTTP endpoints
│   ├── esignature.controller.ts
│   └── signature-webhook.controller.ts
├── processors/          # BullMQ job processors
│   └── signature-reminder.processor.ts
└── esignature.module.ts
```

## Key Services

### ESignatureService

Main service for signature operations.

```typescript
// Send for signature
await esignatureService.sendContractForSignature(contractId);

// Resend reminder
await esignatureService.resendSignatureRequest(contractId);

// Get status
await esignatureService.getSignatureStatus(contractId);

// Handle webhook
await esignatureService.handleSignatureWebhook(webhookDto);
```

### PrivyIdService

Low-level PrivyID API integration with dual-mode support.

```typescript
// Send signature request
const response = await privyIdService.sendForSignature({
  documentUrl: 'https://...',
  signerName: 'Ahmad Rizki',
  signerEmail: 'ahmad@example.com',
  documentTitle: 'Akad Wakalah',
});

// Download signed document
const pdf = await privyIdService.downloadSignedDocument(requestId);

// Get certificate
const cert = await privyIdService.getCertificate(requestId);

// Verify webhook
const isValid = privyIdService.verifyWebhookSignature(payload, signature);
```

### SignatureTrackerService

Event logging and audit trail.

```typescript
// Log event
await trackerService.logEvent(
  tenantId,
  contractId,
  signatureRequestId,
  SignatureEventType.SIGNED,
  eventData,
);

// Get contract events
const events = await trackerService.getContractEvents(contractId);

// Get statistics
const stats = await trackerService.getEventStatistics(tenantId);
```

## API Endpoints

### POST /api/esignature/contracts/:id/send
Send contract for digital signature.

**Request:**
```json
{
  "signerEmail": "jamaah@example.com",
  "signerPhone": "+628123456789"
}
```

### POST /api/esignature/contracts/:id/resend
Resend signature request (reminder).

### GET /api/esignature/contracts/:id/status
Get current signature status.

### GET /api/esignature/contracts/:id/events
Get signature audit trail.

### GET /api/esignature/status
Get integration status (STUB/PRODUCTION mode).

### POST /api/esignature/webhook
PrivyID webhook endpoint (requires signature verification).

## Webhook Events

Events received from PrivyID:

- `sent` - Signature request sent
- `delivered` - Email delivered
- `opened` - Email opened
- `viewed` - Document viewed
- `signed` - Document signed ✓
- `declined` - Signature declined
- `expired` - Request expired

## Database Schema

### Columns Added to `contracts`

- `signature_request_id` - PrivyID request identifier
- `signature_status` - Current status (pending, sent, signed, etc.)
- `signer_email` - Email address of signer
- `signer_phone` - Phone number of signer
- `signature_url` - URL for signing
- `signed_document_url` - URL to signed PDF
- `signature_certificate_url` - URL to certificate

### New Table: `signature_events`

Audit trail of all signature events with RLS.

## Dual-Mode Operation

### STUB Mode (Development)

```env
ESIGNATURE_ENABLED=false
```

**Behavior:**
- No actual API calls to PrivyID
- Returns mock responses
- Simulates successful signing
- All events logged locally

**Use Cases:**
- Development
- Testing
- CI/CD pipelines

### PRODUCTION Mode

```env
ESIGNATURE_ENABLED=true
PRIVYID_API_KEY=pk_live_...
```

**Behavior:**
- Real API calls to PrivyID
- Actual signature requests sent
- Email notifications sent
- Webhooks verified

## Signature Workflow

```
1. Agency generates contract PDF
   ↓
2. POST /esignature/contracts/:id/send
   ↓
3. PrivyID creates signature request
   ↓
4. Email sent to jamaah with signature URL
   ↓
5. Jamaah clicks link → Views document
   ↓ (webhook: viewed)
6. Jamaah signs document
   ↓ (webhook: signed)
7. System downloads:
   - Signed PDF
   - Digital certificate
   ↓
8. Contract status updated to "signed"
   ↓
9. Confirmation emails sent
```

## Reminder System

Automatic reminders sent via BullMQ processor.

### Configuration

```env
ESIGNATURE_REMINDER_ENABLED=true
ESIGNATURE_EXPIRY_DAYS=7
```

### Schedule

- **Day 5** (2 days after sending): First reminder
- **Day 2** (5 days after sending): Final reminder

### Processor

File: `processors/signature-reminder.processor.ts`

**Jobs:**
- `send-reminder` - Individual reminder
- `check-pending-signatures` - Daily scan

## Security

### Webhook Signature Verification

ALWAYS verify PrivyID webhook signatures:

```typescript
const isValid = privyIdService.verifyWebhookSignature(
  JSON.stringify(payload),
  req.headers['x-privy-signature']
);

if (!isValid) {
  throw new UnauthorizedException('Invalid signature');
}
```

### Best Practices

1. Use HTTPS in production
2. Verify all webhook signatures
3. Store signed documents in encrypted S3
4. Rotate API keys quarterly
5. Implement rate limiting on webhook endpoint

## Testing

### Unit Tests

```bash
npm run test src/esignature
```

### E2E Tests

```bash
npm run test:e2e -- esignature
```

### Manual Testing (STUB Mode)

```bash
# 1. Send for signature
curl -X POST http://localhost:3000/api/esignature/contracts/{id}/send \
  -H "Authorization: Bearer {token}"

# 2. Simulate signed webhook
curl -X POST http://localhost:3000/api/esignature/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "signature_request_id": "SIG-123",
    "event": "signed",
    "signed_at": "2025-12-25T10:00:00Z",
    "signer_email": "test@example.com"
  }'

# 3. Check status
curl -X GET http://localhost:3000/api/esignature/contracts/{id}/status \
  -H "Authorization: Bearer {token}"
```

## Troubleshooting

### Webhook Not Received

1. Check PrivyID dashboard webhook configuration
2. Verify webhook URL is publicly accessible
3. Use ngrok for local testing:
   ```bash
   ngrok http 3000
   ```

### Invalid Signature Error

1. Verify `PRIVYID_WEBHOOK_SECRET` matches dashboard
2. Check raw body parsing in main.ts
3. Ensure correct header name: `x-privy-signature`

### Contract Stuck in "Sent" Status

1. Check signature_events table for errors
2. Verify PrivyID dashboard shows request
3. Manually trigger webhook from dashboard

## Monitoring

### Key Metrics

```sql
-- Signature conversion rate
SELECT
  COUNT(CASE WHEN signature_status = 'signed' THEN 1 END) * 100.0 /
  COUNT(*) as conversion_rate
FROM contracts
WHERE signature_request_id IS NOT NULL;

-- Average time to sign
SELECT AVG(signed_at - sent_at) as avg_time_to_sign
FROM contracts
WHERE signature_status = 'signed';

-- Event distribution
SELECT event_type, COUNT(*)
FROM signature_events
GROUP BY event_type;
```

### Logs

All actions logged with context:

```typescript
logger.log(`Contract ${contractNumber} sent for signature`);
logger.error(`Failed to process webhook: ${error.message}`);
logger.debug(`[STUB] Mock signature created`);
```

## Documentation

- **Integration Guide:** `/docs/integrations/esignature-integration.md`
- **API Docs:** Swagger UI at `/api/docs#esignature`
- **PrivyID Docs:** https://docs.privy.id

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review integration documentation
3. Contact PrivyID support: support@privy.id
4. Check server logs for detailed errors

## License

Copyright 2025 Travel Umroh Platform. All rights reserved.
