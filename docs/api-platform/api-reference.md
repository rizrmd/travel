# API Reference

## Base URLs

- **Production:** `https://api.travelumroh.com`
- **Sandbox:** `https://sandbox-api.travelumroh.com`

## Authentication

All API requests require authentication using OAuth 2.0 Bearer tokens or API Keys.

**OAuth Token:**
```
Authorization: Bearer tok_abc123...
```

**API Key:**
```
X-API-Key: pk_live_abc123...
```

## Common Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | OAuth Bearer token |
| `Content-Type` | Yes | Must be `application/json` |
| `X-API-Key` | Alternative | API key (alternative to OAuth) |

## Pagination

All list endpoints support pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  },
  "links": {
    "first": "/public/v1/jamaah?page=1",
    "prev": null,
    "next": "/public/v1/jamaah?page=2",
    "last": "/public/v1/jamaah?page=8"
  }
}
```

## Filtering & Sorting

**Sorting:**
```
?sort=created_at:desc
?sort=name:asc
```

**Field Selection:**
```
?fields=id,name,email
```

## Rate Limiting

- **Default Limit:** 1,000 requests per hour per API key
- **Headers Returned:**
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

**Rate Limit Exceeded (429):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 1800 seconds.",
    "request_id": "req_abc123"
  }
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "request_id": "req_abc123"
  }
}
```

**Common Error Codes:**

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Jamaah Endpoints

### List Jamaah

```
GET /public/v1/jamaah
```

**Query Parameters:**
- `page` - Page number
- `per_page` - Items per page
- `sort` - Sort field and order
- `fields` - Fields to return

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ahmad Rizki",
      "email": "ahmad@email.com",
      "phone": "081234567890",
      "status": "registered",
      "created_at": "2025-12-23T10:00:00Z"
    }
  ],
  "meta": {...},
  "links": {...}
}
```

### Get Jamaah

```
GET /public/v1/jamaah/:id
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Ahmad Rizki",
    "email": "ahmad@email.com",
    "phone": "081234567890",
    "nik": "3201234567890001",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "address": "Jl. Contoh No. 123",
    "status": "registered",
    "created_at": "2025-12-23T10:00:00Z"
  }
}
```

### Create Jamaah

```
POST /public/v1/jamaah
```

**Request:**
```json
{
  "name": "Ahmad Rizki",
  "email": "ahmad@email.com",
  "phone": "081234567890",
  "nik": "3201234567890001",
  "date_of_birth": "1990-01-15",
  "gender": "male",
  "address": "Jl. Contoh No. 123"
}
```

**Response:** `201 Created`

### Update Jamaah

```
PATCH /public/v1/jamaah/:id
```

**Request:**
```json
{
  "phone": "081234567899",
  "address": "Jl. New Address 456"
}
```

---

## Payment Endpoints

### List Payments

```
GET /public/v1/payments
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "jamaah_id": "uuid",
      "amount": 5000000,
      "status": "confirmed",
      "payment_method": "transfer_bank",
      "reference_number": "TRX001",
      "created_at": "2025-12-23T10:00:00Z"
    }
  ]
}
```

### Get Payment

```
GET /public/v1/payments/:id
```

### Create Payment

```
POST /public/v1/payments
```

**Request:**
```json
{
  "jamaah_id": "uuid",
  "amount": 5000000,
  "payment_method": "transfer_bank",
  "reference_number": "TRX001"
}
```

---

## Package Endpoints

### List Packages

```
GET /public/v1/packages
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Paket Umroh Ekonomis 9 Hari",
      "price": 25000000,
      "duration": 9,
      "departure_date": "2025-03-01",
      "available_seats": 45,
      "created_at": "2025-12-23T10:00:00Z"
    }
  ]
}
```

### Get Package

```
GET /public/v1/packages/:id
```

---

## Document Endpoints

### List Documents

```
GET /public/v1/documents
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "jamaah_id": "uuid",
      "type": "passport",
      "status": "approved",
      "uploaded_at": "2025-12-23T10:00:00Z"
    }
  ]
}
```

### Get Document

```
GET /public/v1/documents/:id
```

---

## Webhook Events

### List Available Events

```
GET /public/v1/events
```

**Response:**
```json
{
  "data": [
    {
      "event": "payment.confirmed",
      "description": "Triggered when a payment is confirmed"
    },
    {
      "event": "jamaah.created",
      "description": "Triggered when a new jamaah is created"
    }
  ]
}
```

---

## Versioning

The API uses URL path versioning. The current version is `v1`.

**Example:**
```
https://api.travelumroh.com/public/v1/jamaah
```

When a new version is released, the old version will be supported for at least 12 months.
