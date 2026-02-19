# Sandbox Environment Guide

## Overview

The Travel Umroh Sandbox environment provides a safe testing space where you can build and test your integration without affecting production data or making real transactions.

## Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| **Base URL** | `https://sandbox-api.travelumroh.com` | `https://api.travelumroh.com` |
| **API Key Prefix** | `pk_test_...` | `pk_live_...` |
| **Data Persistence** | Resets on demand | Permanent |
| **Rate Limits** | Same as production | 1,000 requests/hour |
| **Webhooks** | Delivered to test URLs | Delivered to production URLs |
| **Real Transactions** | No | Yes |

## Getting Started

### Step 1: Register for Developer Account

```
POST /api-platform/developers/register
```

**Request:**
```json
{
  "email": "developer@example.com",
  "name": "John Doe",
  "companyName": "Tech Solutions Inc",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "developer@example.com",
    "name": "John Doe"
  },
  "apiKey": {
    "id": "uuid",
    "key": "pk_test_abc123...",
    "environment": "sandbox"
  }
}
```

You'll automatically receive a sandbox API key upon registration.

### Step 2: Generate Sample Data

Populate your sandbox with realistic test data:

```
POST /api-platform/sandbox/generate-data
Authorization: Bearer <your_jwt_token>
```

This creates:
- 3 sample jamaah (pilgrims)
- 1 sample package
- Sample documents and payments

### Step 3: Make Test API Calls

Use your sandbox API key to test API endpoints:

```bash
curl -X GET https://sandbox-api.travelumroh.com/public/v1/jamaah \
  -H "X-API-Key: pk_test_abc123..."
```

## Sandbox Features

### Sample Data

Pre-populated test data includes:

**Jamaah (Pilgrims):**
- Ahmad Rizki (Lead)
- Siti Aminah (Registered)
- Budi Santoso (Registered)

**Packages:**
- Paket Umroh Ekonomis 9 Hari (25,000,000 IDR)

**Payments:**
- Confirmed payments
- Pending payments
- Failed payment examples

### Reset Sandbox

Clear all data and start fresh:

```
POST /api-platform/sandbox/reset
Authorization: Bearer <your_jwt_token>
```

**With sample data generation:**
```json
{
  "generateSampleData": true
}
```

**Response:**
```json
{
  "message": "Sandbox reset successfully",
  "sampleDataGenerated": true
}
```

**Warning:** This permanently deletes all sandbox data!

## Testing Webhooks

### Local Development with ngrok

For local webhook testing, use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your local server
node server.js

# Expose port 3000
ngrok http 3000
```

Use the ngrok HTTPS URL for webhook subscriptions:

```json
{
  "url": "https://abc123.ngrok.io/webhooks",
  "events": ["payment.confirmed"]
}
```

### Testing Webhook Delivery

Send a test webhook event:

```
POST /api-platform/webhooks/:id/test
X-API-Key: pk_test_abc123...
```

**Request:**
```json
{
  "payload": {
    "id": "test_payment_123",
    "amount": 5000000,
    "status": "confirmed"
  }
}
```

Check delivery logs to verify webhook was received:

```
GET /api-platform/webhooks/:id/deliveries
```

## Test Data

### Test API Keys

Sandbox API keys are automatically prefixed with `pk_test_`:

```
pk_test_abc123def456ghi789...
```

### Test NIK (Indonesian ID Numbers)

Use these test NIK values:

```
3201234567890001  # Valid format
3201234567890002  # Valid format
3201234567890003  # Valid format
9999999999999999  # Invalid format (will fail validation)
```

### Test Phone Numbers

```
081234567890  # Valid Indonesian mobile
+6281234567890  # Valid with country code
08123456  # Invalid (too short)
```

### Test Email Addresses

```
test@example.com  # Valid
invalid.email  # Invalid format
```

## Common Test Scenarios

### Scenario 1: Create Jamaah and Make Payment

```javascript
// 1. Create jamaah
const jamaah = await api.post('/public/v1/jamaah', {
  name: 'Test User',
  email: 'test@example.com',
  phone: '081234567890',
  nik: '3201234567890001',
});

// 2. Create payment
const payment = await api.post('/public/v1/payments', {
  jamaah_id: jamaah.data.id,
  amount: 5000000,
  payment_method: 'transfer_bank',
  reference_number: 'TEST001',
});

// 3. Confirm payment (simulates bank confirmation)
await api.patch(`/public/v1/payments/${payment.data.id}`, {
  status: 'confirmed',
});
```

### Scenario 2: Test Webhook Flow

```javascript
// 1. Subscribe to webhook
const subscription = await api.post('/api-platform/webhooks', {
  url: 'https://your-test-server.com/webhooks',
  events: ['payment.confirmed'],
});

// 2. Trigger event (create and confirm payment)
const payment = await api.post('/public/v1/payments', {
  jamaah_id: 'uuid',
  amount: 5000000,
  payment_method: 'transfer_bank',
});

// 3. Check webhook delivery
const deliveries = await api.get(
  `/api-platform/webhooks/${subscription.id}/deliveries`
);
```

### Scenario 3: Test Rate Limiting

```javascript
// Make rapid requests to test rate limiting
const requests = [];
for (let i = 0; i < 1100; i++) {
  requests.push(api.get('/public/v1/packages'));
}

try {
  await Promise.all(requests);
} catch (error) {
  if (error.response.status === 429) {
    console.log('Rate limit works!');
    console.log('Retry after:', error.response.headers['retry-after']);
  }
}
```

## Transitioning to Production

### Step 1: Generate Production API Key

In the Developer Portal:
1. Go to API Keys
2. Click "Create API Key"
3. Select "Production" environment
4. Save the key securely

### Step 2: Update Configuration

```javascript
const config = {
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.travelumroh.com'
    : 'https://sandbox-api.travelumroh.com',
  apiKey: process.env.NODE_ENV === 'production'
    ? process.env.PROD_API_KEY
    : process.env.TEST_API_KEY,
};
```

### Step 3: Update Webhook URLs

Production webhooks must point to production servers:

```json
{
  "url": "https://production.example.com/webhooks",
  "events": ["payment.confirmed", "jamaah.created"]
}
```

### Step 4: Test in Production

Start with low-stakes operations:
1. Read operations (GET requests)
2. Create test data with obvious names
3. Verify webhooks are working
4. Delete test data
5. Begin normal operations

## Sandbox Limitations

### What's Different in Sandbox

- **No real payments** - All payments are simulated
- **Emails not sent** - Email notifications are logged but not sent
- **SMS not sent** - SMS notifications are logged but not sent
- **Data resets** - Sandbox can be reset at any time
- **Shared environment** - Multiple developers may access the same sandbox

### What's the Same

- **API behavior** - Same endpoints, same responses
- **Rate limits** - Same rate limiting rules
- **Webhooks** - Real HTTP requests to your servers
- **Authentication** - Same OAuth/API key flows
- **Validation** - Same data validation rules

## Best Practices

1. **Use Sandbox First** - Always test in sandbox before production
2. **Automated Tests** - Run integration tests against sandbox
3. **CI/CD Integration** - Include sandbox API tests in CI pipeline
4. **Isolate Test Data** - Use obvious names like "TEST_" prefix
5. **Clean Up** - Delete test data regularly or use reset endpoint
6. **Monitor Webhooks** - Test webhook reliability and error handling
7. **Document Assumptions** - Note any sandbox-specific behavior

## Sandbox Monitoring

View sandbox activity in the Developer Portal:

```
GET /api-platform/developers/dashboard
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "apiKeys": [...],
  "usage": {
    "totalRequests": 1523,
    "avgResponseTime": 145,
    "errorCount": 12,
    "errorRate": "0.79"
  }
}
```

## Support

For sandbox environment issues:
- Email: api-support@travelumroh.com
- Developer Portal: https://developers.travelumroh.com
- Documentation: https://docs.travelumroh.com
