# E-Signature Integration - Quick Start Guide

## 1. Run Migration

```bash
npm run migration:run
```

## 2. Configure Environment

```bash
# Copy environment template
cp .env.example.esignature .env

# Edit .env and set:
ESIGNATURE_ENABLED=false  # STUB mode for development
```

## 3. Test Endpoints (STUB Mode)

### Send for Signature
```bash
curl -X POST http://localhost:3000/api/esignature/contracts/{contract_id}/send \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json"
```

### Simulate Webhook (Test Only)
```bash
curl -X POST http://localhost:3000/api/esignature/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "signature_request_id": "SIG-TEST-123",
    "event": "signed",
    "signed_at": "2025-12-25T10:00:00Z",
    "signer_email": "test@example.com"
  }'
```

### Check Status
```bash
curl -X GET http://localhost:3000/api/esignature/contracts/{contract_id}/status \
  -H "Authorization: Bearer {jwt_token}"
```

### Get Audit Trail
```bash
curl -X GET http://localhost:3000/api/esignature/contracts/{contract_id}/events \
  -H "Authorization: Bearer {jwt_token}"
```

### Get Integration Status
```bash
curl -X GET http://localhost:3000/api/esignature/status \
  -H "Authorization: Bearer {jwt_token}"
```

## 4. Enable Production Mode

### Setup PrivyID Account
1. Visit https://privy.id
2. Create business account
3. Complete KYB verification (1-3 days)
4. Get API credentials from dashboard

### Update Environment
```env
ESIGNATURE_ENABLED=true
PRIVYID_API_KEY=pk_live_your_actual_key
PRIVYID_WEBHOOK_SECRET=whsec_your_actual_secret
APP_URL=https://your-production-domain.com
```

### Configure Webhook in PrivyID
Set webhook URL to:
```
https://your-domain.com/api/esignature/webhook
```

Enable events:
- signature.sent
- signature.delivered
- signature.opened
- signature.viewed
- signature.signed
- signature.declined
- signature.expired

## 5. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/esignature/contracts/:id/send` | Send contract for signature |
| POST | `/api/esignature/contracts/:id/resend` | Resend signature request |
| GET | `/api/esignature/contracts/:id/status` | Get signature status |
| GET | `/api/esignature/contracts/:id/events` | Get audit trail |
| GET | `/api/esignature/status` | Get integration status |
| POST | `/api/esignature/webhook` | PrivyID webhook (internal) |

## 6. Signature Workflow

```
1. Generate Contract PDF
   ↓
2. Send for Signature (POST /send)
   ↓
3. Jamaah receives email
   ↓
4. Jamaah signs document
   ↓ (webhook: signed)
5. System downloads signed PDF + certificate
   ↓
6. Contract status updated to "signed"
```

## 7. Database Schema

### Columns in `contracts` table:
- `signature_request_id` - PrivyID request ID
- `signature_status` - pending, sent, signed, expired, declined
- `signer_email` - Email of signer
- `signer_phone` - Phone of signer
- `signature_url` - URL for signing
- `signed_document_url` - URL to signed PDF
- `signature_certificate_url` - URL to certificate

### New `signature_events` table:
- Complete audit trail
- All signature events logged
- IP addresses tracked
- Row Level Security enabled

## 8. Documentation

- **Full Guide:** `/docs/integrations/esignature-integration.md`
- **Module README:** `/src/esignature/README.md`
- **Summary:** `/INTEGRATION-5-SUMMARY.md`
- **API Docs:** Swagger UI at `/api/docs#esignature`

## 9. Support

**PrivyID:**
- Email: support@privy.id
- Phone: +62 21 5091 9560

**Documentation:**
- See full integration guide
- Check module README
- Review code examples

## 10. Troubleshooting

**Webhook not received?**
- Check PrivyID dashboard webhook config
- Verify webhook URL is publicly accessible
- Use ngrok for local testing

**Invalid signature error?**
- Verify PRIVYID_WEBHOOK_SECRET matches dashboard
- Check x-privy-signature header

**Contract stuck in "sent"?**
- Check signature_events table
- Verify PrivyID dashboard shows request
- Manually trigger webhook from dashboard

---

**Status:** STUB MODE ACTIVE
**Version:** 1.0.0
**Last Updated:** 2025-12-24
