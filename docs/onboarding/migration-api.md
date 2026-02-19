# Migration API Documentation

## Overview
RESTful API untuk mengelola proses import CSV dan migrasi data.

**Base URL:** `/api/v1/onboarding/migration`

**Authentication:** JWT Bearer Token

**Rate Limit:** 100 requests per minute

## Endpoints

### 1. Upload CSV File

Upload file CSV untuk import data.

**Endpoint:** `POST /api/v1/onboarding/migration/upload`

**Authorization:** Admin, Owner

**Content-Type:** `multipart/form-data`

**Request Body:**
```typescript
{
  file: File,              // CSV file (max 10MB)
  import_type: 'jamaah' | 'payment' | 'package',
  column_mapping?: {       // Optional column mapping
    [csvColumn: string]: string
  }
}
```

**Response:** `200 OK`
```json
{
  "job_id": "uuid",
  "import_type": "jamaah",
  "file_name": "jamaah-import.csv",
  "total_rows": 150,
  "columns": ["nama", "email", "telepon", ...],
  "preview_rows": [
    {
      "nama": "Ahmad Rizki",
      "email": "ahmad@email.com",
      ...
    }
  ],
  "encoding": "utf-8",
  "delimiter": ","
}
```

**Error Responses:**
```json
// 400 Bad Request - File too large
{
  "statusCode": 400,
  "message": "Ukuran file terlalu besar (maksimal 10MB)",
  "error": "Bad Request"
}

// 400 Bad Request - Invalid file format
{
  "statusCode": 400,
  "message": "File CSV kosong atau tidak valid",
  "error": "Bad Request"
}

// 400 Bad Request - Missing required columns
{
  "statusCode": 400,
  "message": "Kolom yang diperlukan tidak ditemukan: nama, paket_id",
  "error": "Bad Request"
}
```

### 2. Validate CSV Data

Validasi seluruh data CSV sebelum import.

**Endpoint:** `POST /api/v1/onboarding/migration/:id/validate`

**Authorization:** Admin, Owner

**Response:** `200 OK`
```json
{
  "message": "Validasi dimulai. Anda akan menerima notifikasi saat selesai.",
  "job_id": "uuid"
}
```

**WebSocket Event (saat validasi selesai):**
```json
{
  "event": "migration:validated",
  "data": {
    "job_id": "uuid",
    "is_valid": true,
    "total_rows": 150,
    "valid_rows": 148,
    "invalid_rows": 2,
    "errors": [
      {
        "row_number": 5,
        "field_name": "email",
        "error_type": "invalid_format",
        "error_message": "Email tidak valid: ahmad@email",
        "received_value": "ahmad@email"
      }
    ],
    "error_summary": {
      "missing_required": 0,
      "invalid_format": 2,
      "duplicate": 0,
      "constraint_violation": 0
    },
    "can_proceed": true
  }
}
```

### 3. Start Import Process

Mulai proses import data yang sudah divalidasi.

**Endpoint:** `POST /api/v1/onboarding/migration/:id/start`

**Authorization:** Admin, Owner

**Response:** `200 OK`
```json
{
  "message": "Import dimulai. Progress akan diupdate secara real-time.",
  "job_id": "uuid"
}
```

**WebSocket Events:**

**Progress Update (setiap 100 baris):**
```json
{
  "event": "migration:progress",
  "data": {
    "job_id": "uuid",
    "processed": 100,
    "total": 150,
    "progress_percentage": 67
  }
}
```

**Completion:**
```json
{
  "event": "migration:completed",
  "data": {
    "job_id": "uuid",
    "status": "completed",
    "imported": 148,
    "failed": 2,
    "duration_seconds": 45
  }
}
```

### 4. Get Import Status

Cek status import job.

**Endpoint:** `GET /api/v1/onboarding/migration/:id/status`

**Authorization:** Admin, Owner, Agent (own jobs only)

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "import_type": "jamaah",
  "file_name": "jamaah-import.csv",
  "file_size": 102400,
  "status": "importing",
  "status_display": "Mengimpor",
  "total_rows": 150,
  "processed_rows": 100,
  "valid_rows": 98,
  "invalid_rows": 2,
  "progress_percentage": 67,
  "error_report_url": null,
  "started_at": "2025-01-15T10:30:00Z",
  "completed_at": null,
  "created_at": "2025-01-15T10:25:00Z",
  "updated_at": "2025-01-15T10:35:00Z"
}
```

### 5. Download Error Report

Download CSV berisi baris yang gagal dengan detail error.

**Endpoint:** `GET /api/v1/onboarding/migration/:id/errors`

**Authorization:** Admin, Owner

**Response:** `200 OK` (CSV file)
```csv
row_number,error_type,field_name,error_message,received_value
5,invalid_format,email,Email tidak valid: ahmad@email,ahmad@email
12,missing_required,paket_id,Field 'paket_id' wajib diisi,
```

**Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="errors-{jobId}.csv"
```

### 6. Rollback Migration

Batalkan import yang sudah selesai (dalam 24 jam).

**Endpoint:** `POST /api/v1/onboarding/migration/:id/rollback`

**Authorization:** Admin, Owner

**Response:** `200 OK`
```json
{
  "message": "Rollback berhasil dilakukan",
  "job": {
    "id": "uuid",
    "status": "rolled_back",
    "rollback_at": "2025-01-15T12:00:00Z"
  }
}
```

**Error Response:**
```json
// 400 Bad Request - Cannot rollback
{
  "statusCode": 400,
  "message": "Tidak dapat melakukan rollback untuk status: pending",
  "error": "Bad Request"
}
```

### 7. List Migration Jobs

Dapatkan daftar semua import jobs dengan filter.

**Endpoint:** `GET /api/v1/onboarding/migration`

**Authorization:** Admin, Owner, Agent (own jobs only)

**Query Parameters:**
```typescript
{
  import_type?: 'jamaah' | 'payment' | 'package',
  status?: 'pending' | 'validating' | 'importing' | 'completed' | 'failed' | 'rolled_back',
  page?: number,        // default: 1
  limit?: number,       // default: 20, max: 100
  sort_by?: string,     // default: 'created_at'
  sort_order?: 'ASC' | 'DESC'  // default: 'DESC'
}
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "import_type": "jamaah",
      "file_name": "jamaah-import.csv",
      "status": "completed",
      "total_rows": 150,
      "valid_rows": 148,
      "invalid_rows": 2,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

### 8. Download CSV Template

Download template CSV untuk tipe import tertentu.

**Endpoint:** `GET /api/v1/onboarding/migration/templates/:type`

**Authorization:** Admin, Owner, Agent

**Parameters:**
- `type`: 'jamaah' | 'payment' | 'package'

**Response:** `200 OK` (CSV file)

**Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="template-{type}.csv"
```

### 9. Delete Migration Job

Hapus import job yang sudah selesai.

**Endpoint:** `DELETE /api/v1/onboarding/migration/:id`

**Authorization:** Admin, Owner

**Response:** `200 OK`
```json
{
  "message": "Job migrasi berhasil dihapus"
}
```

**Error Response:**
```json
// 400 Bad Request - Job not completed
{
  "statusCode": 400,
  "message": "Hanya job yang sudah selesai yang dapat dihapus",
  "error": "Bad Request"
}
```

## Data Models

### Migration Job

```typescript
interface MigrationJob {
  id: string;
  tenant_id: string;
  user_id: string;
  import_type: 'jamaah' | 'payment' | 'package';
  file_name: string;
  file_url: string;
  file_size: number;
  status: 'pending' | 'validating' | 'importing' | 'completed' | 'failed' | 'rolled_back';
  status_display: string;
  total_rows: number;
  processed_rows: number;
  valid_rows: number;
  invalid_rows: number;
  progress_percentage: number;
  error_report_url: string | null;
  error_message: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  metadata: {
    fileName: string;
    fileSize: number;
    encoding: string;
    delimiter: string;
    columnMapping?: Record<string, string>;
    importType: string;
    errorSummary?: {
      missingRequired: number;
      invalidFormat: number;
      duplicate: number;
      constraintViolation: number;
    };
  };
  created_at: Date;
  updated_at: Date;
}
```

### Migration Error

```typescript
interface MigrationError {
  id: string;
  migration_job_id: string;
  row_number: number;
  error_type: 'missing_required' | 'invalid_format' | 'duplicate' | 'constraint_violation';
  field_name: string | null;
  error_message: string;
  expected_format: string | null;
  received_value: string | null;
  row_data: Record<string, any>;
  created_at: Date;
}
```

## WebSocket Integration

### Connect to WebSocket

**Endpoint:** `wss://api.travelumroh.com/ws`

**Authentication:** Include JWT token in connection query:
```
wss://api.travelumroh.com/ws?token=YOUR_JWT_TOKEN
```

### Subscribe to Migration Events

```javascript
// Client-side example
socket.on('migration:progress', (data) => {
  console.log(`Progress: ${data.progress_percentage}%`);
  updateProgressBar(data.progress_percentage);
});

socket.on('migration:completed', (data) => {
  console.log(`Import completed: ${data.imported} rows imported`);
  showSuccessNotification(data);
});

socket.on('migration:status', (data) => {
  console.log(`Status changed to: ${data.status_display}`);
  updateStatusBadge(data.status);
});
```

## Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | File CSV wajib diunggah | No file in request |
| 400 | Ukuran file terlalu besar | File > 10MB |
| 400 | File CSV kosong atau tidak valid | Empty or malformed CSV |
| 400 | Kolom yang diperlukan tidak ditemukan | Missing required columns |
| 400 | Tidak dapat melakukan rollback | Invalid status for rollback |
| 400 | Hanya job yang sudah selesai yang dapat dihapus | Trying to delete active job |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Job migrasi tidak ditemukan | Job ID not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

**Limits:**
- 100 requests per minute per user
- 10 concurrent imports per tenant

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345200
```

## Best Practices

### 1. File Upload
```javascript
// Use FormData for file upload
const formData = new FormData();
formData.append('file', file);
formData.append('import_type', 'jamaah');

fetch('/api/v1/onboarding/migration/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 2. Progress Tracking
```javascript
// Combine HTTP polling and WebSocket
function trackImport(jobId) {
  // Initial status via HTTP
  getJobStatus(jobId);

  // Real-time updates via WebSocket
  socket.on('migration:progress', updateProgress);

  // Fallback polling every 5 seconds
  const interval = setInterval(() => {
    getJobStatus(jobId);
  }, 5000);

  // Clear on completion
  socket.on('migration:completed', () => {
    clearInterval(interval);
  });
}
```

### 3. Error Handling
```javascript
try {
  const response = await uploadCSV(file);
  await validateData(response.job_id);
  await startImport(response.job_id);
} catch (error) {
  if (error.status === 400) {
    // Handle validation errors
    showErrorReport(error.data);
  } else if (error.status === 413) {
    // File too large
    showFileSizeError();
  } else {
    // Generic error
    showErrorNotification(error.message);
  }
}
```

## Code Examples

### Complete Import Flow

```typescript
import axios from 'axios';
import io from 'socket.io-client';

class MigrationClient {
  private api: AxiosInstance;
  private socket: Socket;

  constructor(baseURL: string, token: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    this.socket = io(baseURL, {
      query: { token }
    });
  }

  async uploadCSV(file: File, importType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', importType);

    const response = await this.api.post('/migration/upload', formData);
    return response.data;
  }

  async startImport(jobId: string) {
    const response = await this.api.post(`/migration/${jobId}/start`);
    return response.data;
  }

  trackProgress(jobId: string, onProgress: (data: any) => void) {
    this.socket.on('migration:progress', (data) => {
      if (data.job_id === jobId) {
        onProgress(data);
      }
    });
  }

  async getStatus(jobId: string) {
    const response = await this.api.get(`/migration/${jobId}/status`);
    return response.data;
  }

  async downloadErrors(jobId: string) {
    const response = await this.api.get(`/migration/${jobId}/errors`, {
      responseType: 'blob'
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `errors-${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
  }
}

// Usage
const client = new MigrationClient(
  'https://api.travelumroh.com/api/v1/onboarding',
  'your-jwt-token'
);

// Upload and import
const result = await client.uploadCSV(file, 'jamaah');

client.trackProgress(result.job_id, (progress) => {
  console.log(`${progress.progress_percentage}% complete`);
});

await client.startImport(result.job_id);
```

## Support

**API Questions:**
- Email: api@travelumroh.com
- Documentation: https://docs.travelumroh.com/api
- Changelog: https://docs.travelumroh.com/changelog
