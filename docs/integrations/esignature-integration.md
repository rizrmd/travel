# E-Signature Integration (PrivyID)

**Integration 5: Digital Signature for Wakalah bil Ujrah Contracts**

## Overview

The E-Signature Integration enables digital signing of Islamic contracts (Wakalah bil Ujrah) between travel agencies and jamaah pilgrims. This eliminates paper-based contract signing and provides legally binding digital signatures compliant with Indonesian law.

### Provider: PrivyID

- **Website:** https://privy.id
- **Documentation:** https://docs.privy.id
- **Legal Compliance:** Indonesian Law No. 11/2008 (ITE Law)
- **Pricing:** $50-200/month (1,000-5,000 signatures)

## Features

1. **Digital Signature** - Legally binding electronic signatures
2. **Certificate Generation** - Digital certificates for each signed document
3. **Audit Trail** - Complete event history for compliance
4. **Webhook Events** - Real-time signature status updates
5. **Automatic Reminders** - Email reminders before expiry
6. **Dual-Mode Operation** - STUB mode for development, PRODUCTION for live

## Architecture

```
┌─────────────────┐
│  Frontend UI    │
│  (Contract Mgmt)│
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────────────────┐
│  ESignature Module                                   │
│  ┌────────────────┐  ┌──────────────────────┐      │
│  │ ESignature     │  │ SignatureWebhook     │      │
│  │ Controller     │  │ Controller           │      │
│  └───────┬────────┘  └──────────┬───────────┘      │
│          │                       │                   │
│          ↓                       ↓                   │
│  ┌────────────────────────────────────────┐         │
│  │  ESignatureService                     │         │
│  │  - Send for signature                  │         │
│  │  - Handle webhooks                     │         │
│  │  - Track events                        │         │
│  └───────┬──────────────────┬─────────────┘         │
│          │                  │                        │
│          ↓                  ↓                        │
│  ┌──────────────┐  ┌──────────────────┐            │
│  │ PrivyID      │  │ SignatureTracker │            │
│  │ Service      │  │ Service          │            │
│  └──────┬───────┘  └──────────────────┘            │
└─────────┼──────────────────────────────────────────┘
          │
          ↓
┌─────────────────┐
│  PrivyID API    │
│  (External)     │
└─────────────────┘
```

## Database Schema

### New Migration: `1767200000000-AddESignatureColumnsAndEventsTable.ts`

#### 1. Columns Added to `contracts` Table

| Column                      | Type         | Description                          |
|-----------------------------|--------------|--------------------------------------|
| `signature_request_id`      | VARCHAR(100) | PrivyID signature request identifier |
| `signature_status`          | VARCHAR(50)  | pending, sent, signed, expired, declined |
| `signer_email`              | VARCHAR(255) | Email address of signer              |
| `signer_phone`              | VARCHAR(50)  | Phone number of signer               |
| `signature_url`             | TEXT         | URL for jamaah to sign document      |
| `signed_document_url`       | TEXT         | URL to signed PDF                    |
| `signature_certificate_url` | TEXT         | URL to digital certificate           |

#### 2. New Table: `signature_events`

| Column                 | Type         | Description                     |
|------------------------|--------------|---------------------------------|
| `id`                   | UUID         | Primary key                     |
| `tenant_id`            | UUID         | Tenant identifier (RLS)         |
| `contract_id`          | UUID         | Foreign key to contracts        |
| `signature_request_id` | VARCHAR(100) | PrivyID request ID              |
| `event_type`           | VARCHAR(50)  | sent, viewed, signed, etc.      |
| `event_data`           | JSONB        | Additional event metadata       |
| `ip_address`           | VARCHAR(50)  | IP of event initiator           |
| `user_agent`           | TEXT         | Browser user agent              |
| `occurred_at`          | TIMESTAMP    | When event occurred             |
| `created_at`           | TIMESTAMP    | Record creation time            |

**Indexes:**
- `idx_signature_events_tenant`
- `idx_signature_events_contract`
- `idx_signature_events_request`
- `idx_signature_events_tenant_type`

**Row Level Security (RLS):** Enabled with tenant isolation

## API Endpoints

### 1. Send Contract for Signature

```http
POST /api/esignature/contracts/:id/send
Authorization: Bearer {jwt_token}
```

**Request:**
```json
{
  "signerEmail": "jamaah@example.com",  // Optional - uses jamaah.email if not provided
  "signerPhone": "+628123456789"        // Optional - uses jamaah.phone if not provided
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "signatureRequestId": "SIG-1234567890",
    "signatureUrl": "https://sign.privy.id/sign/abc123",
    "status": "sent",
    "expiresAt": "2025-12-31T23:59:59Z",
    "sentAt": "2025-12-24T10:00:00Z"
  }
}
```

### 2. Resend Signature Request

```http
POST /api/esignature/contracts/:id/resend
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Signature request resent successfully"
}
```

### 3. Get Signature Status

```http
GET /api/esignature/contracts/:id/status
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contractId": "123e4567-e89b-12d3-a456-426614174000",
    "signatureRequestId": "SIG-1234567890",
    "signatureUrl": "https://sign.privy.id/sign/abc123",
    "status": "signed",
    "expiresAt": "2025-12-31T23:59:59Z",
    "sentAt": "2025-12-24T10:00:00Z",
    "signedAt": "2025-12-25T14:30:00Z",
    "signedDocumentUrl": "https://s3.amazonaws.com/contracts/signed/...",
    "signatureCertificateUrl": "https://s3.amazonaws.com/contracts/certificates/..."
  }
}
```

### 4. Get Signature Events (Audit Trail)

```http
GET /api/esignature/contracts/:id/events
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "evt-001",
      "eventType": "sent",
      "occurredAt": "2025-12-24T10:00:00Z",
      "ipAddress": "103.28.14.5",
      "userAgent": "Mozilla/5.0...",
      "eventData": {
        "signerEmail": "jamaah@example.com",
        "expiresAt": "2025-12-31T23:59:59Z"
      }
    },
    {
      "id": "evt-002",
      "eventType": "viewed",
      "occurredAt": "2025-12-24T11:30:00Z",
      "ipAddress": "114.79.12.34",
      "userAgent": "Mobile Safari...",
      "eventData": {}
    },
    {
      "id": "evt-003",
      "eventType": "signed",
      "occurredAt": "2025-12-25T14:30:00Z",
      "ipAddress": "114.79.12.34",
      "userAgent": "Mobile Safari...",
      "eventData": {
        "certificateId": "CERT-789",
        "signerName": "Ahmad Rizki Maulana"
      }
    }
  ]
}
```

### 5. Get Integration Status

```http
GET /api/esignature/status
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": false,
    "mode": "STUB",
    "provider": "PrivyID",
    "features": [
      "digital_signature",
      "certificate",
      "audit_trail",
      "webhook_events"
    ]
  }
}
```

### 6. Webhook Endpoint (PrivyID Callbacks)

```http
POST /api/esignature/webhook
Content-Type: application/json
X-Privy-Signature: {hmac_sha256_signature}
```

**Webhook Payload:**
```json
{
  "signature_request_id": "SIG-1234567890",
  "event": "signed",
  "signed_at": "2025-12-25T14:30:00Z",
  "signer_email": "jamaah@example.com",
  "signer_name": "Ahmad Rizki Maulana",
  "ip_address": "114.79.12.34",
  "user_agent": "Mobile Safari/14.0",
  "occurred_at": "2025-12-25T14:30:00Z",
  "metadata": {
    "certificateId": "CERT-789"
  }
}
```

**Event Types:**
- `sent` - Signature request sent
- `delivered` - Email delivered
- `opened` - Email opened by recipient
- `viewed` - Document viewed by signer
- `signed` - Document successfully signed
- `declined` - Signer declined to sign
- `expired` - Signature request expired

## Setup Guide

### Step 1: Create PrivyID Account

1. Visit https://privy.id
2. Click "Sign Up for Business"
3. Complete registration form
4. Verify email address
5. Complete KYB (Know Your Business) verification
   - Upload company documents
   - Provide authorized signatory details
   - Wait 1-3 business days for approval

### Step 2: Get API Credentials

1. Login to PrivyID Dashboard
2. Navigate to **Settings** → **API Credentials**
3. Click **Generate API Key**
4. Copy the following:
   - API Key
   - Webhook Secret
5. Save credentials securely (password manager)

### Step 3: Configure Environment Variables

Copy `.env.example.esignature` to `.env`:

```bash
cp .env.example.esignature .env
```

Update the following variables:

```env
ESIGNATURE_ENABLED=false  # Keep false for testing

PRIVYID_API_KEY=pk_live_your_actual_api_key_here
PRIVYID_API_URL=https://api.privy.id/v1
PRIVYID_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

ESIGNATURE_EXPIRY_DAYS=7
ESIGNATURE_AUTO_SEND=false
ESIGNATURE_REMINDER_ENABLED=true

APP_URL=http://localhost:3000  # Change to production URL when deploying
```

### Step 4: Configure Webhook in PrivyID Dashboard

1. Login to PrivyID Dashboard
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook Endpoint**
4. Enter webhook URL:
   ```
   https://your-domain.com/api/esignature/webhook
   ```
   For local testing with ngrok:
   ```
   https://abc123.ngrok.io/api/esignature/webhook
   ```
5. Select events to receive:
   - ☑ signature.sent
   - ☑ signature.delivered
   - ☑ signature.opened
   - ☑ signature.viewed
   - ☑ signature.signed
   - ☑ signature.declined
   - ☑ signature.expired
6. Click **Save**

### Step 5: Run Database Migration

```bash
npm run migration:run
```

This creates:
- Signature columns in `contracts` table
- New `signature_events` table
- Indexes for performance
- RLS policies for tenant isolation

### Step 6: Test in STUB Mode

With `ESIGNATURE_ENABLED=false`:

```bash
# Start server
npm run start:dev

# Send test signature request
curl -X POST http://localhost:3000/api/esignature/contracts/{contract_id}/send \
  -H "Authorization: Bearer {jwt_token}"

# Check signature status
curl -X GET http://localhost:3000/api/esignature/contracts/{contract_id}/status \
  -H "Authorization: Bearer {jwt_token}"

# Test webhook (development only)
curl -X POST http://localhost:3000/api/esignature/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "signature_request_id": "SIG-TEST-123",
    "event": "signed",
    "signed_at": "2025-12-25T14:30:00Z",
    "signer_email": "test@example.com"
  }'
```

**STUB Mode Behavior:**
- No actual API calls to PrivyID
- Returns mock signature URLs
- Simulates successful signing
- Useful for development/testing

### Step 7: Enable Production Mode

After testing:

```env
ESIGNATURE_ENABLED=true
APP_URL=https://your-production-domain.com
```

Restart server:

```bash
npm run build
npm run start:prod
```

## Workflow Diagram

```
┌─────────────┐
│   Agency    │
│   Creates   │
│  Contract   │
└──────┬──────┘
       │
       ↓
┌──────────────────────┐
│ Generate Contract PDF │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────┐
│ Send for Signature       │
│ POST /esignature/send    │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  PrivyID Creates Request │
│  Returns signature_url   │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Email Sent to Jamaah     │
│ with signature_url       │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Jamaah Opens Email       │
│ (webhook: opened)        │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Jamaah Views Document    │
│ (webhook: viewed)        │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Jamaah Signs Document    │
│ (webhook: signed)        │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ System Downloads:        │
│ - Signed PDF             │
│ - Certificate            │
│ Updates contract status  │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│ Confirmation Email       │
│ Sent to Jamaah & Agency  │
└──────────────────────────┘
```

## Reminder System

The system automatically sends reminders for unsigned contracts:

### Configuration

```env
ESIGNATURE_REMINDER_ENABLED=true
ESIGNATURE_EXPIRY_DAYS=7
```

### Reminder Schedule

- **Day 5**: First reminder (2 days after sending)
- **Day 2**: Final reminder (5 days after sending)

### BullMQ Processor

File: `src/esignature/processors/signature-reminder.processor.ts`

**Jobs:**
1. `send-reminder` - Send individual reminder
2. `check-pending-signatures` - Daily scan for pending signatures

**Cron Schedule** (configure in queue module):
```typescript
{
  name: 'check-pending-signatures',
  cron: '0 9 * * *', // Every day at 9 AM
}
```

## Legal Compliance

### Indonesian ITE Law (UU ITE No. 11/2008)

PrivyID digital signatures are legally binding in Indonesia under:
- Article 5: Electronic documents as valid evidence
- Article 11: Digital signatures have legal standing
- Article 12: Certificate authority recognition

### Requirements for Legal Validity

1. **Identity Verification** - PrivyID verifies signer identity
2. **Certificate Authority** - PrivyID is registered CA in Indonesia
3. **Audit Trail** - Complete event log maintained
4. **Certificate Generation** - Digital certificate for each signature
5. **Timestamp** - Certified timestamp for each signature

### Document Retention

Store the following for 5 years (regulatory requirement):
- Original contract PDF
- Signed contract PDF
- Digital certificate (JSON)
- Complete audit trail (signature_events table)
- Email confirmations

## Security Best Practices

### 1. Webhook Signature Verification

ALWAYS verify webhook signatures:

```typescript
const isValid = privyIdService.verifyWebhookSignature(
  JSON.stringify(payload),
  signature
);

if (!isValid) {
  throw new UnauthorizedException('Invalid webhook signature');
}
```

### 2. HTTPS Only

Production deployments MUST use HTTPS:
- SSL/TLS certificate required
- No HTTP webhooks allowed
- Secure cookie settings

### 3. API Key Security

- Store API keys in environment variables
- NEVER commit to version control
- Rotate keys quarterly
- Use different keys for staging/production

### 4. Rate Limiting

Implement rate limiting on webhook endpoint:

```typescript
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per minute
async handleWebhook() {
  // ...
}
```

### 5. File Storage Security

Store signed documents securely:
- Use S3 with server-side encryption
- Private bucket (no public access)
- Signed URLs for temporary access
- Backup to separate region

## Troubleshooting

### Issue: Webhook Not Received

**Symptoms:**
- Contract stuck in "sent" status
- No events in signature_events table

**Solutions:**
1. Check webhook URL in PrivyID dashboard
2. Verify webhook signature verification
3. Check server logs for errors
4. Test with ngrok for local development:
   ```bash
   ngrok http 3000
   # Use ngrok URL in PrivyID dashboard
   ```

### Issue: Invalid Signature Error

**Symptoms:**
- 401 Unauthorized on webhook
- "Invalid webhook signature" in logs

**Solutions:**
1. Verify PRIVYID_WEBHOOK_SECRET matches dashboard
2. Check raw body parsing in NestJS config:
   ```typescript
   app.use(rawBody({ exclude: ['/api/esignature/webhook'] }));
   ```
3. Ensure signature header name is correct: `x-privy-signature`

### Issue: Contract Already Signed Error

**Symptoms:**
- 400 Bad Request when sending
- "Contract already signed" message

**Solutions:**
1. Check contract.signature_status
2. Create new contract version if changes needed
3. Use GET /status to verify current state

### Issue: STUB Mode Not Working

**Symptoms:**
- Real API calls being made
- API key errors in development

**Solutions:**
1. Verify `ESIGNATURE_ENABLED=false` in .env
2. Restart server after changing .env
3. Check ConfigService is loading correct values

## Performance Optimization

### 1. Database Indexes

All necessary indexes created by migration:
- `idx_contracts_signature_status`
- `idx_contracts_signature_request`
- `idx_signature_events_contract`
- `idx_signature_events_request`

### 2. Caching

Cache signature status to reduce API calls:

```typescript
@Cacheable('signature-status', { ttl: 300 }) // 5 minutes
async getSignatureStatus(contractId: string) {
  // ...
}
```

### 3. Async Processing

Webhook processing is async - returns 200 immediately:

```typescript
async handleWebhook(payload) {
  // Quick validation
  const isValid = this.verifySignature(payload);

  // Return success immediately
  return { success: true };

  // Process in background (BullMQ)
  await this.queue.add('process-webhook', payload);
}
```

## Monitoring & Logging

### Key Metrics to Track

1. **Signature Request Volume**
   - Total requests sent
   - Success rate
   - Average time to sign

2. **Event Distribution**
   ```sql
   SELECT event_type, COUNT(*)
   FROM signature_events
   GROUP BY event_type;
   ```

3. **Conversion Rate**
   ```sql
   SELECT
     COUNT(CASE WHEN signature_status = 'signed' THEN 1 END) * 100.0 /
     COUNT(CASE WHEN signature_status IN ('sent', 'signed') THEN 1 END) as conversion_rate
   FROM contracts;
   ```

4. **Expired Requests**
   ```sql
   SELECT COUNT(*)
   FROM contracts
   WHERE signature_status = 'expired';
   ```

### Logging

All actions logged with structured logging:

```typescript
this.logger.log(`Contract ${contractNumber} sent for signature. Request ID: ${requestId}`);
this.logger.error(`Failed to process webhook: ${error.message}`, error.stack);
this.logger.debug(`[STUB] Mock signature request created`);
```

### Alerts

Set up alerts for:
- High webhook failure rate (>5%)
- Expired signature rate (>20%)
- API errors from PrivyID
- Webhook signature verification failures

## Cost Estimation

### PrivyID Pricing (2025)

| Plan         | Price/Month | Signatures | Cost Per Signature |
|--------------|-------------|------------|---------------------|
| Basic        | $50         | 1,000      | $0.05               |
| Professional | $100        | 2,500      | $0.04               |
| Enterprise   | $200        | 5,000      | $0.04               |
| Additional   | -           | -          | $0.10               |

### Example Calculation

For agency with 500 jamaah/month:
- Basic Plan: $50/month
- Well within 1,000 signatures limit
- Total cost: $50/month ($600/year)

For large agency with 3,000 jamaah/month:
- Enterprise Plan: $200/month
- Additional 3,000 - 5,000 = -2,000 (within limit)
- Total cost: $200/month ($2,400/year)

## Support

### PrivyID Support

- **Email:** support@privy.id
- **Phone:** +62 21 5091 9560
- **Hours:** Mon-Fri, 9 AM - 6 PM WIB
- **SLA:** 24 hours response time

### Internal Documentation

- API Reference: `/docs/api#esignature`
- Code Examples: `src/esignature/README.md`
- Postman Collection: `postman/esignature.json`

## Changelog

### Version 1.0.0 (2025-12-24)

- Initial implementation
- PrivyID integration
- Dual-mode operation (STUB/PRODUCTION)
- Webhook event handling
- Automatic reminder system
- Complete audit trail
- Legal compliance documentation

## Future Enhancements

### Planned Features

1. **Multi-Signer Support**
   - Support for contracts requiring multiple signatures
   - Agency + Jamaah both sign

2. **Template Management**
   - Pre-approved contract templates
   - Variable substitution

3. **Bulk Sending**
   - Send multiple contracts at once
   - Batch processing

4. **Analytics Dashboard**
   - Signature conversion metrics
   - Time-to-sign analytics
   - Signer behavior insights

5. **Email Customization**
   - Branded email templates
   - Multi-language support
   - Custom reminder messages

6. **Mobile App Integration**
   - Deep links for mobile app
   - In-app signature flow

## License

Copyright 2025 Travel Umroh Platform. All rights reserved.
