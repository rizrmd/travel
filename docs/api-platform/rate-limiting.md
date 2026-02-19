# Rate Limiting

## Overview

The Travel Umroh API implements rate limiting to ensure fair usage and maintain service quality for all users. Rate limits are applied per API key.

## Current Limits

| Tier | Requests per Hour | Burst Allowance |
|------|-------------------|-----------------|
| **Default** | 1,000 | 50 |
| **Premium** | 5,000 | 200 |
| **Enterprise** | Custom | Custom |

## How Rate Limiting Works

Rate limits use a **sliding window** algorithm that tracks requests over the past hour. This provides a smooth, predictable experience without sudden resets.

**Example:**
- At 10:00 AM, you make 100 requests
- At 10:30 AM, you make 900 requests (total: 1,000)
- At 10:31 AM, you're rate limited
- At 11:00 AM, the 100 requests from 10:00 expire
- You can now make 100 more requests

## Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1703347200
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Total requests allowed per hour |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

## Handling Rate Limits

### 429 Response

When you exceed the rate limit, the API returns a 429 status:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 1800 seconds.",
    "request_id": "req_abc123"
  }
}
```

The response also includes a `Retry-After` header indicating seconds to wait.

### Best Practices

1. **Monitor Headers** - Check `X-RateLimit-Remaining` before making requests
2. **Implement Exponential Backoff** - Wait progressively longer between retries
3. **Use Webhooks** - Receive real-time updates instead of polling
4. **Cache Responses** - Cache API responses to reduce request count
5. **Batch Operations** - Combine multiple operations into single requests when possible

## Implementation Examples

### Node.js with Retry Logic

```javascript
const axios = require('axios');

class RateLimitedClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.maxRetries = 3;
  }

  async request(method, endpoint, data = null, retryCount = 0) {
    try {
      const response = await axios({
        method,
        url: `https://api.travelumroh.com${endpoint}`,
        headers: {
          'X-API-Key': this.apiKey,
        },
        data,
      });

      // Log rate limit info
      console.log('Rate Limit:', {
        limit: response.headers['x-ratelimit-limit'],
        remaining: response.headers['x-ratelimit-remaining'],
        reset: new Date(response.headers['x-ratelimit-reset'] * 1000),
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && retryCount < this.maxRetries) {
        const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
        console.log(`Rate limited. Retrying in ${retryAfter} seconds...`);

        await this.sleep(retryAfter * 1000);
        return this.request(method, endpoint, data, retryCount + 1);
      }

      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const client = new RateLimitedClient(process.env.API_KEY);
const jamaah = await client.request('GET', '/public/v1/jamaah');
```

### Python with Rate Limit Tracking

```python
import requests
import time
from datetime import datetime

class RateLimitedClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.travelumroh.com'
        self.rate_limit = None
        self.remaining = None
        self.reset = None

    def request(self, method, endpoint, data=None):
        # Check if we're approaching the limit
        if self.remaining and self.remaining < 10:
            print(f"Warning: Only {self.remaining} requests remaining")

            if self.remaining == 0:
                wait_time = self.reset - time.time()
                if wait_time > 0:
                    print(f"Rate limit reached. Waiting {wait_time:.0f} seconds...")
                    time.sleep(wait_time)

        headers = {'X-API-Key': self.api_key}
        url = f"{self.base_url}{endpoint}"

        response = requests.request(method, url, headers=headers, json=data)

        # Update rate limit tracking
        self.rate_limit = int(response.headers.get('X-RateLimit-Limit', 0))
        self.remaining = int(response.headers.get('X-RateLimit-Remaining', 0))
        self.reset = int(response.headers.get('X-RateLimit-Reset', 0))

        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            print(f"Rate limited. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            return self.request(method, endpoint, data)

        response.raise_for_status()
        return response.json()

# Usage
client = RateLimitedClient(os.getenv('API_KEY'))
jamaah = client.request('GET', '/public/v1/jamaah')
```

### PHP with Backoff

```php
<?php

class RateLimitedClient {
    private $apiKey;
    private $baseUrl = 'https://api.travelumroh.com';
    private $maxRetries = 3;

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    public function request($method, $endpoint, $data = null, $retryCount = 0) {
        $ch = curl_init($this->baseUrl . $endpoint);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "X-API-Key: {$this->apiKey}",
            'Content-Type: application/json',
        ]);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);

        curl_close($ch);

        // Parse rate limit headers
        preg_match('/X-RateLimit-Remaining: (\d+)/i', $headers, $matches);
        $remaining = isset($matches[1]) ? intval($matches[1]) : null;

        if ($statusCode === 429 && $retryCount < $this->maxRetries) {
            preg_match('/Retry-After: (\d+)/i', $headers, $matches);
            $retryAfter = isset($matches[1]) ? intval($matches[1]) : 60;

            echo "Rate limited. Retrying in {$retryAfter} seconds...\n";
            sleep($retryAfter);

            return $this->request($method, $endpoint, $data, $retryCount + 1);
        }

        return json_decode($body, true);
    }
}

// Usage
$client = new RateLimitedClient(getenv('API_KEY'));
$jamaah = $client->request('GET', '/public/v1/jamaah');
?>
```

## Avoiding Rate Limits

### 1. Use Webhooks Instead of Polling

**Bad Practice (Polling):**
```javascript
// Check for new payments every 5 seconds
setInterval(async () => {
  const payments = await api.get('/public/v1/payments');
  // Process new payments...
}, 5000); // Uses 720 requests/hour!
```

**Good Practice (Webhooks):**
```javascript
// Subscribe to payment.confirmed webhook
await api.post('/api-platform/webhooks', {
  url: 'https://myapp.com/webhooks',
  events: ['payment.confirmed'],
});

// Receive real-time notifications
app.post('/webhooks', (req, res) => {
  const { event, data } = req.body;
  if (event === 'payment.confirmed') {
    processPayment(data);
  }
  res.sendStatus(200);
});
```

### 2. Implement Local Caching

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

async function getPackages() {
  // Check cache first
  const cached = cache.get('packages');
  if (cached) {
    return cached;
  }

  // Fetch from API
  const packages = await api.get('/public/v1/packages');

  // Store in cache
  cache.set('packages', packages);

  return packages;
}
```

### 3. Batch Requests

Instead of making multiple single requests, batch operations when possible:

```javascript
// Bad: Multiple requests
for (const jamaah of jamaahList) {
  await api.get(`/public/v1/jamaah/${jamaah.id}`);
}

// Good: Single request with filters
const jamaah = await api.get('/public/v1/jamaah', {
  params: {
    ids: jamaahList.map(j => j.id).join(','),
  },
});
```

## Upgrading Rate Limits

Need higher limits? Contact us to upgrade:

- **Email:** sales@travelumroh.com
- **Subject:** Rate Limit Increase Request
- **Include:** Your use case and expected request volume

## Monitoring Rate Limit Usage

### Developer Dashboard

View your rate limit usage in real-time:

1. Log in to the Developer Portal
2. Go to Dashboard > API Usage
3. View hourly request counts and rate limit status

### Programmatic Monitoring

```javascript
async function checkRateLimitStatus() {
  const response = await api.get('/public/v1/packages');

  const limit = parseInt(response.headers['x-ratelimit-limit']);
  const remaining = parseInt(response.headers['x-ratelimit-remaining']);
  const usagePercent = ((limit - remaining) / limit) * 100;

  console.log(`API Usage: ${usagePercent.toFixed(1)}%`);

  if (usagePercent > 90) {
    console.warn('WARNING: Approaching rate limit!');
  }
}
```

## Rate Limit by Endpoint

Some endpoints have stricter limits:

| Endpoint | Limit | Reason |
|----------|-------|--------|
| `/oauth/token` | 10/minute | Prevent brute force |
| `/api-platform/webhooks` | 100/hour | Prevent abuse |
| `/public/v1/*` | 1,000/hour | Standard limit |

## Support

For rate limit questions:
- Email: api-support@travelumroh.com
- Documentation: https://docs.travelumroh.com
- Status Page: https://status.travelumroh.com
