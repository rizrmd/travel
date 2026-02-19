# OAuth 2.0 Authentication Guide

## Overview

The Travel Umroh API Platform uses OAuth 2.0 with the Client Credentials grant type for server-to-server authentication. This is ideal for integrations where there is no user interaction required.

## Prerequisites

- An active Travel Umroh account
- Access to the API Platform dashboard

## Authentication Flow

### Step 1: Register an OAuth Client

First, register your application to receive a Client ID and Client Secret.

**Endpoint:** `POST /oauth/clients`

**Request:**
```json
{
  "name": "My ERP Integration",
  "description": "Integration with company ERP system",
  "scopes": ["jamaah:read", "jamaah:write", "payments:read", "payments:write"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "client_id": "cli_abc123...",
  "client_secret": "sec_xyz789...",
  "name": "My ERP Integration",
  "scopes": ["jamaah:read", "jamaah:write", "payments:read", "payments:write"],
  "is_active": true,
  "created_at": "2025-12-23T10:00:00Z"
}
```

**Important:** The `client_secret` is only shown once during creation. Store it securely!

### Step 2: Request an Access Token

Use your Client ID and Client Secret to obtain an access token.

**Endpoint:** `POST /oauth/token`

**Request:**
```json
{
  "grant_type": "client_credentials",
  "client_id": "cli_abc123...",
  "client_secret": "sec_xyz789...",
  "scope": "jamaah:read payments:write"
}
```

**Response:**
```json
{
  "access_token": "tok_def456...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "jamaah:read payments:write"
}
```

### Step 3: Make API Requests

Include the access token in the Authorization header for all API requests.

**Request:**
```bash
curl -X GET https://api.travelumroh.com/public/v1/jamaah \
  -H "Authorization: Bearer tok_def456..."
```

## Available Scopes

| Scope | Description |
|-------|-------------|
| `jamaah:read` | Read jamaah data |
| `jamaah:write` | Create and update jamaah |
| `payments:read` | Read payment data |
| `payments:write` | Create payments |
| `packages:read` | Read package information |
| `documents:read` | Read document data |
| `webhooks:manage` | Manage webhook subscriptions |
| `*` | Full access (use with caution) |

## Token Management

### Token Expiration

Access tokens expire after 1 hour (3600 seconds). When a token expires, request a new one using the same Client ID and Client Secret.

### Revoke Token

To revoke an access token before expiration:

**Endpoint:** `POST /oauth/revoke`

**Request:**
```json
{
  "token": "tok_def456...",
  "client_id": "cli_abc123...",
  "client_secret": "sec_xyz789..."
}
```

## Best Practices

1. **Store Credentials Securely**: Never commit Client ID and Client Secret to version control.
2. **Use Environment Variables**: Store credentials in environment variables or secure vault.
3. **Rotate Secrets Regularly**: Rotate Client Secrets periodically for security.
4. **Request Minimal Scopes**: Only request the scopes your application needs.
5. **Cache Tokens**: Cache access tokens and reuse them until they expire.
6. **Handle Token Expiration**: Implement automatic token refresh when receiving 401 responses.

## Error Handling

### Common Errors

**Invalid Client Credentials (401):**
```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

**Invalid Scope (400):**
```json
{
  "error": "invalid_scope",
  "error_description": "Requested scope is invalid: jamaah:delete"
}
```

**Expired Token (401):**
```json
{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

## Code Examples

### Node.js

```javascript
const axios = require('axios');

class TravelUmrohClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const response = await axios.post('https://api.travelumroh.com/oauth/token', {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'jamaah:read payments:write',
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

    return this.accessToken;
  }

  async request(method, endpoint, data = null) {
    const token = await this.getAccessToken();

    return axios({
      method,
      url: `https://api.travelumroh.com${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  }
}

// Usage
const client = new TravelUmrohClient(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

const jamaah = await client.request('GET', '/public/v1/jamaah');
```

### PHP

```php
<?php

class TravelUmrohClient {
    private $clientId;
    private $clientSecret;
    private $accessToken;
    private $tokenExpiry;

    public function __construct($clientId, $clientSecret) {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    private function getAccessToken() {
        if ($this->accessToken && $this->tokenExpiry > time()) {
            return $this->accessToken;
        }

        $ch = curl_init('https://api.travelumroh.com/oauth/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'grant_type' => 'client_credentials',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'scope' => 'jamaah:read payments:write',
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $this->accessToken = $response['access_token'];
        $this->tokenExpiry = time() + $response['expires_in'];

        return $this->accessToken;
    }

    public function request($method, $endpoint, $data = null) {
        $token = $this->getAccessToken();

        $ch = curl_init("https://api.travelumroh.com{$endpoint}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer {$token}",
            'Content-Type: application/json',
        ]);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Usage
$client = new TravelUmrohClient(
    getenv('CLIENT_ID'),
    getenv('CLIENT_SECRET')
);

$jamaah = $client->request('GET', '/public/v1/jamaah');
?>
```

### Python

```python
import requests
import time

class TravelUmrohClient:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = None
        self.token_expiry = 0

    def get_access_token(self):
        if self.access_token and self.token_expiry > time.time():
            return self.access_token

        response = requests.post(
            'https://api.travelumroh.com/oauth/token',
            json={
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': 'jamaah:read payments:write',
            }
        )

        data = response.json()
        self.access_token = data['access_token']
        self.token_expiry = time.time() + data['expires_in']

        return self.access_token

    def request(self, method, endpoint, data=None):
        token = self.get_access_token()

        headers = {
            'Authorization': f'Bearer {token}',
        }

        response = requests.request(
            method,
            f'https://api.travelumroh.com{endpoint}',
            headers=headers,
            json=data
        )

        return response.json()

# Usage
import os

client = TravelUmrohClient(
    os.getenv('CLIENT_ID'),
    os.getenv('CLIENT_SECRET')
)

jamaah = client.request('GET', '/public/v1/jamaah')
```

## Support

For questions or issues with OAuth authentication:
- Email: api-support@travelumroh.com
- Documentation: https://docs.travelumroh.com
- Status Page: https://status.travelumroh.com
