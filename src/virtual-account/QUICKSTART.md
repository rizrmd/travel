# Virtual Account Integration - Quick Start Guide

Get up and running with Virtual Account integration in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Redis running (for BullMQ)
- Travel Umroh platform installed

## Installation (5 minutes)

### Step 1: Run Migration (1 minute)

```bash
npm run migration:run
```

This creates the `virtual_accounts` and `payment_notifications` tables.

### Step 2: Add Environment Variables (1 minute)

Add to your `.env` file:

```env
# Virtual Account Configuration (STUB Mode)
VA_ENABLED=false
VA_EXPIRY_HOURS=24
VA_AUTO_CREATE=false
VA_DEFAULT_BANK=bca

# Midtrans (leave as default for STUB mode)
MIDTRANS_SERVER_KEY=sandbox_key
MIDTRANS_API_URL=https://api.sandbox.midtrans.com/v2
```

### Step 3: Register Module (1 minute)

Already done! The module is ready to use.

### Step 4: Start Application (1 minute)

```bash
npm run start:dev
```

### Step 5: Test Integration (1 minute)

```bash
# Check status
curl http://localhost:3000/virtual-accounts/system/status

# Expected: {"success": true, "data": {"mode": "STUB", ...}}
```

## Basic Usage

### 1. Create Virtual Account

```bash
curl -X POST http://localhost:3000/virtual-accounts/jamaah/YOUR_JAMAAH_ID/create \
  -H "Content-Type: application/json" \
  -d '{
    "bankCode": "bca",
    "amount": 30000000
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vaNumber": "12345678901",
    "bankCode": "bca",
    "amount": 30000000,
    "status": "active"
  }
}
```

### 2. Simulate Payment

```bash
curl -X POST http://localhost:3000/virtual-accounts/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TRX-TEST-123",
    "order_id": "VA-abc123-1234567890",
    "transaction_status": "settlement",
    "status_code": "200",
    "gross_amount": "30000000",
    "va_numbers": [{"bank": "bca", "va_number": "12345678901"}]
  }'
```

### 3. Verify Payment Created

```sql
SELECT * FROM payments
WHERE payment_method = 'virtual_account'
ORDER BY created_at DESC
LIMIT 1;
```

## STUB Mode vs Production

### STUB Mode (Default)
- **Purpose:** Local development and testing
- **API Calls:** None (mocked)
- **VA Numbers:** Realistic but fake
- **Cost:** Free
- **Setup Time:** 5 minutes

### Production Mode
- **Purpose:** Live payment processing
- **API Calls:** Real Midtrans API
- **VA Numbers:** Real bank VAs
- **Cost:** 2-3% per transaction
- **Setup Time:** 1-2 days (includes Midtrans approval)

## Switching to Production

When ready to go live:

1. **Get Midtrans Credentials**
   - Register at https://dashboard.midtrans.com
   - Complete KYB verification (1-3 days)
   - Get production server key

2. **Update Environment**
   ```env
   VA_ENABLED=true
   MIDTRANS_SERVER_KEY=Mid-server-YOUR_PRODUCTION_KEY
   MIDTRANS_API_URL=https://api.midtrans.com/v2
   ```

3. **Configure Webhook**
   - In Midtrans dashboard: Settings > Configuration
   - Set Notification URL: `https://your-domain.com/virtual-accounts/webhook`

4. **Test**
   - Create test VA
   - Make small payment (Rp 10,000)
   - Verify webhook received
   - Verify payment created

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/virtual-accounts/jamaah/:id/create` | Create VA for jamaah |
| GET | `/virtual-accounts/jamaah/:id` | Get VAs for jamaah |
| GET | `/virtual-accounts/:id` | Get VA by ID |
| POST | `/virtual-accounts/:id/close` | Close VA |
| GET | `/virtual-accounts/system/status` | Get integration status |
| POST | `/virtual-accounts/webhook` | Midtrans webhook (automated) |

## Supported Banks

| Bank | Code | VA Length |
|------|------|-----------|
| BCA | `bca` | 11 digits |
| Mandiri | `mandiri` | 14 digits |
| BNI | `bni` | 10 digits |
| BRI | `bri` | 14 digits |
| Permata | `permata` | 13 digits |

## Troubleshooting

### VA Creation Fails

**Error:** "Jamaah not found"
**Solution:** Ensure jamaah ID exists in database

**Error:** "Active VA already exists"
**Solution:** Use existing VA or close it first

### Webhook Not Processing

**Check:** BullMQ queue status
```bash
curl http://localhost:3000/admin/queues/payment-notification/metrics
```

**Solution:** Check Redis is running, review processor logs

### Payment Not Created

**Check:** Notification status
```sql
SELECT * FROM payment_notifications
WHERE status = 'failed';
```

**Solution:** Review error_message column, retry if needed

## Next Steps

1. **Read Full Documentation**
   - Module README: `src/virtual-account/README.md`
   - Integration Guide: `docs/integrations/virtual-account-integration.md`

2. **Explore Advanced Features**
   - Auto-create VAs on jamaah registration
   - Email notifications
   - WebSocket real-time updates
   - VA expiry automation

3. **Monitor & Optimize**
   - Set up monitoring dashboards
   - Configure alerts
   - Track transaction fees
   - Optimize bank selection

## Support

- **Technical Issues:** Check logs in `logs/application.log`
- **Midtrans Issues:** https://docs.midtrans.com
- **Platform Issues:** Contact development team

---

**Quick Start Complete!** You now have a working Virtual Account integration in STUB mode.

For production deployment, see the full integration guide at `docs/integrations/virtual-account-integration.md`.
