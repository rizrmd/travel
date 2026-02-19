# E-Signature Integration Guide

## Overview

Epic 12 includes e-signature functionality for digital contract signing. Phase 1 includes the complete architecture and API endpoints, but actual provider integration is planned for Phase 2 (Q2 2025).

## Supported Providers (Phase 2)

### 1. PrivyID (Recommended for Indonesia)

**Why PrivyID?**
- Indonesian company with local support
- Recognized by Indonesian government
- Affordable pricing (~Rp 5,000 per signature)
- Compliant with Indonesian e-signature law (UU ITE)

**Features:**
- Digital certificate integration
- Biometric authentication
- Video verification
- Audit trail
- Legal validity

**API Flow:**
```
1. Create envelope with contract PDF
2. Add signers (jamaah, agent, owner)
3. Send signing invitation via email/WhatsApp
4. Track signing progress via webhook
5. Download signed document
```

### 2. DocuSign

**Features:**
- Global leader in e-signature
- Advanced authentication
- Multi-language support
- Price: ~$0.50 per signature

### 3. Adobe Sign

**Features:**
- Part of Adobe Document Cloud
- Enterprise-grade security
- Integration with Adobe products
- Price: ~$0.40 per signature

## Current Implementation (Phase 1)

### Stub Endpoints

All e-signature endpoints currently return HTTP 501 (Not Implemented):

```typescript
POST /api/v1/compliance/contracts/:id/send
GET  /api/v1/compliance/contracts/:id/status
POST /api/v1/compliance/contracts/:id/resend
POST /api/v1/compliance/esignature/webhook
```

### Response Example

```json
{
  "statusCode": 501,
  "message": "E-signature integration coming in Phase 2",
  "details": {
    "providers": ["PrivyID", "DocuSign", "Adobe Sign"],
    "estimatedLaunch": "Q2 2025",
    "documentationUrl": "/docs/compliance/esignature-integration.md"
  }
}
```

## Database Schema (Ready)

### Signature Entity

```sql
CREATE TABLE signatures (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  contract_id UUID NOT NULL,
  signer_type VARCHAR(20), -- jamaah, agent, owner
  signer_id UUID NOT NULL,
  signer_name VARCHAR(255),
  signer_email VARCHAR(255),
  signature_provider VARCHAR(50), -- privyid, docusign, adobe_sign
  provider_envelope_id VARCHAR(255),
  status VARCHAR(20), -- pending, sent, viewed, signed, declined
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  signed_at TIMESTAMP,
  expires_at TIMESTAMP,
  events JSONB, -- Audit trail of all events
  reminder_count INT DEFAULT 0,
  last_reminder_sent_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Phase 2 Implementation Plan

### Step 1: PrivyID Integration (Month 1)

**Tasks:**
1. Register for PrivyID Enterprise account
2. Obtain API credentials
3. Implement authentication flow
4. Create envelope creation logic
5. Implement webhook handler
6. Test with sandbox environment

**Estimated Effort:** 2 weeks

### Step 2: Email Notifications (Month 1)

**Tasks:**
1. Design email templates
2. Integrate with email service (SendGrid/AWS SES)
3. Implement reminder scheduler
4. Track email delivery

**Estimated Effort:** 1 week

### Step 3: Webhook Processing (Month 2)

**Tasks:**
1. Implement webhook endpoint
2. Validate webhook signatures
3. Process signature events
4. Update database
5. Notify users via WebSocket

**Estimated Effort:** 1 week

### Step 4: Testing & Go-Live (Month 2)

**Tasks:**
1. End-to-end testing
2. Load testing
3. Security audit
4. User acceptance testing
5. Production deployment

**Estimated Effort:** 2 weeks

## Email Templates

### Invitation Email

```
Subject: Tandatangan Kontrak Umroh - {{contractNumber}}

Assalamu'alaikum Wr. Wb.

Yth. {{jamaahName}},

Kontrak Umroh Anda telah siap untuk ditandatangani.

Nomor Kontrak: {{contractNumber}}
Paket: {{packageName}}
Keberangkatan: {{departureDate}}

Silakan klik tautan berikut untuk menandatangani:
{{signingUrl}}

Tautan berlaku hingga: {{expiryDate}}

Jika ada pertanyaan, hubungi kami di {{agentPhone}}.

Wassalamu'alaikum Wr. Wb.

{{agencyName}}
```

### Reminder Email

```
Subject: Reminder: Tandatangan Kontrak Umroh - {{contractNumber}}

Assalamu'alaikum Wr. Wb.

Yth. {{jamaahName}},

Ini adalah pengingat bahwa kontrak Umroh Anda masih menunggu tanda tangan.

Nomor Kontrak: {{contractNumber}}
Tautan berlaku hingga: {{expiryDate}}

Tandatangan sekarang:
{{signingUrl}}

Wassalamu'alaikum Wr. Wb.
```

## Webhook Handler

### Expected Payload (PrivyID)

```json
{
  "event": "document.signed",
  "envelope_id": "ENV-12345",
  "signer": {
    "name": "Ahmad Abdullah",
    "email": "ahmad@example.com",
    "signed_at": "2025-01-15T10:30:00Z",
    "ip_address": "192.168.1.1"
  },
  "document_url": "https://privyid.com/signed/doc.pdf"
}
```

### Processing Logic

```typescript
async handleWebhook(payload: any) {
  // 1. Validate webhook signature
  const isValid = await this.validateWebhookSignature(payload);
  if (!isValid) throw new UnauthorizedException();

  // 2. Find signature record
  const signature = await this.findByEnvelopeId(payload.envelope_id);

  // 3. Update status
  signature.status = this.mapStatus(payload.event);
  signature.signedAt = new Date(payload.signer.signed_at);
  signature.ipAddress = payload.signer.ip_address;

  // 4. Add event to audit trail
  signature.events.push({
    eventType: 'signed',
    timestamp: new Date(),
    metadata: payload,
  });

  await this.signatureRepository.save(signature);

  // 5. Update contract status
  await this.updateContractStatus(signature.contractId);

  // 6. Notify via WebSocket
  await this.websocketGateway.emit('contract:signed', {
    contractId: signature.contractId,
    signerId: signature.signerId,
  });
}
```

## Security Considerations

1. **Webhook Signature Validation**
   - Verify all webhooks using HMAC signature
   - Reject unsigned or invalid webhooks

2. **Data Encryption**
   - Store sensitive data encrypted
   - Use HTTPS for all communications

3. **Access Control**
   - Only contract parties can sign
   - Verify email ownership before sending

4. **Audit Trail**
   - Log all signature events
   - Include IP address and user agent
   - Immutable audit logs

## Cost Estimation

### PrivyID (Recommended)

- Setup fee: Rp 5,000,000 (one-time)
- Per signature: Rp 5,000
- Monthly minimum: Rp 500,000

**Example:**
- 100 contracts/month = Rp 500,000
- 500 contracts/month = Rp 2,500,000

### DocuSign

- Setup: Free
- Per signature: $0.50 (~Rp 8,000)
- Monthly subscription: $25-$40/user

## Testing

### Sandbox Testing (Phase 2)

```bash
# Create test envelope
curl -X POST https://sandbox.privyid.com/v1/envelopes \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "document": "base64_encoded_pdf",
    "signers": [
      {
        "name": "Test User",
        "email": "test@example.com"
      }
    ]
  }'
```

## Migration Path

Phase 1 → Phase 2 migration is seamless:

1. Database schema already in place
2. API endpoints already documented
3. Just need to implement provider integration
4. No breaking changes for existing code

## Questions?

For Phase 2 integration questions:
- Email: dev@travelumroh.com
- Slack: #epic-12-esignature
