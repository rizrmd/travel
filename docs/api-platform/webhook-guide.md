# Webhook Guide

## Overview

Webhooks allow you to receive real-time notifications when events occur in your Travel Umroh account. Instead of polling the API, webhooks push event data to your server.

## How Webhooks Work

1. You register a webhook URL with the events you want to receive
2. When an event occurs, we send an HTTP POST request to your URL
3. Your server processes the event and returns a 200 OK response
4. If delivery fails, we automatically retry up to 3 times

## Setting Up Webhooks

### Step 1: Create an Endpoint

Create an HTTPS endpoint on your server to receive webhook events.

**Requirements:**
- Must use HTTPS (not HTTP)
- Must respond with 200-299 status code within 30 seconds
- Must be publicly accessible

**Example (Node.js/Express):**
```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.post('/webhooks/travelumroh', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];

  // Verify signature (see security section)
  if (!verifySignature(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process the event
  const { event, data } = req.body;

  switch(event) {
    case 'payment.confirmed':
      handlePaymentConfirmed(data);
      break;
    case 'jamaah.created':
      handleJamaahCreated(data);
      break;
    // Handle other events...
  }

  res.status(200).send('OK');
});

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}
```

### Step 2: Subscribe to Events

Subscribe your endpoint to specific events.

**Endpoint:** `POST /api-platform/webhooks`

**Headers:**
```
X-API-Key: pk_live_abc123...
```

**Request:**
```json
{
  "url": "https://example.com/webhooks/travelumroh",
  "events": [
    "payment.confirmed",
    "jamaah.created",
    "document.approved"
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com/webhooks/travelumroh",
  "events": ["payment.confirmed", "jamaah.created", "document.approved"],
  "secret": "whsec_abc123...",
  "is_active": true,
  "created_at": "2025-12-23T10:00:00Z"
}
```

**Important:** Save the `secret` - you'll need it to verify webhook signatures!

## Available Events

| Event | Description |
|-------|-------------|
| `payment.confirmed` | Payment confirmed successfully |
| `payment.failed` | Payment attempt failed |
| `jamaah.created` | New jamaah registered |
| `jamaah.updated` | Jamaah information updated |
| `jamaah.deleted` | Jamaah removed |
| `package.updated` | Package information changed |
| `document.approved` | Document approved by admin |
| `document.rejected` | Document rejected |
| `contract.signed` | Contract signed electronically |

## Event Payload Format

All webhook events follow this format:

```json
{
  "event": "payment.confirmed",
  "timestamp": "2025-12-23T10:30:00Z",
  "data": {
    "id": "uuid",
    "jamaah_id": "uuid",
    "amount": 5000000,
    "payment_method": "transfer_bank",
    "reference_number": "TRX001"
  }
}
```

### Event Payload Examples

**payment.confirmed:**
```json
{
  "event": "payment.confirmed",
  "timestamp": "2025-12-23T10:30:00Z",
  "data": {
    "id": "uuid",
    "jamaah_id": "uuid",
    "amount": 5000000,
    "payment_method": "transfer_bank",
    "reference_number": "TRX001",
    "confirmed_at": "2025-12-23T10:30:00Z"
  }
}
```

**jamaah.created:**
```json
{
  "event": "jamaah.created",
  "timestamp": "2025-12-23T10:30:00Z",
  "data": {
    "id": "uuid",
    "name": "Ahmad Rizki",
    "email": "ahmad@email.com",
    "phone": "081234567890",
    "status": "lead",
    "created_at": "2025-12-23T10:30:00Z"
  }
}
```

**document.approved:**
```json
{
  "event": "document.approved",
  "timestamp": "2025-12-23T10:30:00Z",
  "data": {
    "id": "uuid",
    "jamaah_id": "uuid",
    "type": "passport",
    "approved_by": "uuid",
    "approved_at": "2025-12-23T10:30:00Z"
  }
}
```

## Security: Signature Verification

Every webhook request includes an HMAC-SHA256 signature to verify authenticity.

**Headers:**
- `X-Webhook-Signature`: HMAC signature
- `X-Webhook-Timestamp`: Unix timestamp in milliseconds
- `X-Webhook-Event`: Event type

### Verification Steps

1. **Check Timestamp** - Reject requests older than 5 minutes to prevent replay attacks
2. **Compute Expected Signature** - Hash the raw request body with your webhook secret
3. **Compare Signatures** - Use constant-time comparison to prevent timing attacks

**Node.js Example:**
```javascript
const crypto = require('crypto');

function verifyWebhook(req, secret) {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];

  // 1. Check timestamp (5 minute tolerance)
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 300000) {
    throw new Error('Webhook timestamp too old');
  }

  // 2. Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  // 3. Compare signatures (constant-time)
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    throw new Error('Invalid webhook signature');
  }

  return true;
}
```

**PHP Example:**
```php
<?php
function verifyWebhook($body, $signature, $timestamp, $secret) {
    // 1. Check timestamp
    $now = time() * 1000;
    if (abs($now - $timestamp) > 300000) {
        throw new Exception('Webhook timestamp too old');
    }

    // 2. Compute expected signature
    $expectedSignature = hash_hmac('sha256', $body, $secret);

    // 3. Compare signatures
    if (!hash_equals($expectedSignature, $signature)) {
        throw new Exception('Invalid webhook signature');
    }

    return true;
}
?>
```

## Retry Logic

If your endpoint doesn't respond with a 2xx status code, we automatically retry:

| Attempt | Delay |
|---------|-------|
| 1st retry | 1 minute |
| 2nd retry | 5 minutes |
| 3rd retry | 30 minutes |

After 3 failed attempts, the delivery status is marked as `max_retries_exceeded`.

## Managing Webhooks

### List Subscriptions

```
GET /api-platform/webhooks
```

### Update Subscription

```
PATCH /api-platform/webhooks/:id
```

**Request:**
```json
{
  "events": ["payment.confirmed", "payment.failed"]
}
```

### Delete Subscription

```
DELETE /api-platform/webhooks/:id
```

### Test Webhook

Send a test event to verify your endpoint.

```
POST /api-platform/webhooks/:id/test
```

**Request:**
```json
{
  "payload": {
    "test": true,
    "message": "Test webhook delivery"
  }
}
```

### View Delivery Logs

```
GET /api-platform/webhooks/:id/deliveries
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "event_type": "payment.confirmed",
      "status": "delivered",
      "http_status": 200,
      "attempt_count": 1,
      "delivered_at": "2025-12-23T10:30:00Z",
      "created_at": "2025-12-23T10:30:00Z"
    }
  ]
}
```

### Retry Failed Delivery

```
POST /api-platform/webhooks/:id/retry/:deliveryId
```

## Best Practices

1. **Respond Quickly** - Return 200 OK immediately and process events asynchronously
2. **Verify Signatures** - Always verify the webhook signature before processing
3. **Handle Duplicates** - Use event IDs to detect and skip duplicate events
4. **Log Everything** - Log all webhook events for debugging and auditing
5. **Use HTTPS** - Only HTTPS endpoints are allowed for security
6. **Monitor Failures** - Set up alerts for failed webhook deliveries
7. **Test Thoroughly** - Use the test endpoint to verify your integration

## Idempotency

Webhooks may be delivered multiple times. Make your endpoint idempotent by:

1. Using the event `data.id` as an idempotency key
2. Storing processed event IDs in your database
3. Skipping events you've already processed

**Example:**
```javascript
async function handleWebhook(event) {
  const eventId = event.data.id;

  // Check if already processed
  const exists = await db.webhookEvents.findOne({ eventId });
  if (exists) {
    console.log('Event already processed:', eventId);
    return;
  }

  // Process event
  await processEvent(event);

  // Mark as processed
  await db.webhookEvents.create({ eventId, processedAt: new Date() });
}
```

## Troubleshooting

### Webhook Not Received

1. Check that your endpoint is publicly accessible
2. Verify HTTPS is enabled (HTTP not supported)
3. Check firewall rules allow incoming traffic
4. Review delivery logs for error messages

### Signature Verification Fails

1. Ensure you're using the correct webhook secret
2. Verify you're hashing the raw request body (not parsed JSON)
3. Check timestamp is being validated correctly
4. Use constant-time comparison to prevent timing attacks

### Timeout Errors

1. Respond with 200 OK immediately
2. Process events asynchronously (use job queue)
3. Ensure your endpoint responds within 30 seconds

## Support

For webhook issues:
- Email: api-support@travelumroh.com
- Check delivery logs in the Developer Portal
- Review webhook status in real-time dashboard
