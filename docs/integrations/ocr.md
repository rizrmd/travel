# OCR Integration Guide - Phase 2

## Overview

This document outlines the implementation roadmap for OCR (Optical Character Recognition) integration in the Travel Umroh platform. OCR functionality is currently stubbed in Epic 6 and planned for Phase 2 implementation.

## Current Status (MVP - Phase 1)

### What's Implemented

- **OCR Stub Service** (`src/documents/services/ocr-stub.service.ts`)
  - All OCR endpoints return HTTP 501 (Not Implemented)
  - "Coming Soon" badge in UI
  - Information endpoint for planned features
  - Email collection for launch notification

- **OCR Controller** (`src/documents/controllers/ocr.controller.ts`)
  - Stub endpoints for all OCR operations
  - Swagger documentation with "Coming Soon" tags
  - Feature information API

### What's NOT Implemented

- Actual OCR data extraction
- Document quality validation
- Confidence scoring
- Face matching
- Document authenticity verification

## Phase 2 Implementation Plan

### 1. Provider Selection

#### Recommended Primary Provider: Verihubs

**Pros:**
- Indonesia-focused OCR optimized for KTP, Passport, KK
- Local support and compliance
- Face recognition and liveness detection
- Established in Indonesian fintech/travel industry

**Pricing:**
- KTP OCR: ~IDR 2,000 per request
- Passport OCR: ~IDR 3,000 per request
- Face Recognition: ~IDR 1,500 per request
- Volume discounts available for >10,000 requests/month

**Integration Endpoint:**
```
https://api.verihubs.com/v1/ocr/ktp
https://api.verihubs.com/v1/ocr/passport
https://api.verihubs.com/v1/face/match
```

#### Fallback Provider: Google Cloud Vision AI

**Use Case:** Generic document OCR, handwriting recognition

**Pricing:**
- $1.50 per 1,000 documents (first 1,000 free per month)

**Integration:**
```typescript
import vision from '@google-cloud/vision';
const client = new vision.ImageAnnotatorClient();
```

### 2. Database Schema Updates

Add confidence scores and validation results:

```sql
ALTER TABLE documents
ADD COLUMN ocr_confidence_score DECIMAL(5,2),
ADD COLUMN quality_validation_result JSONB,
ADD COLUMN face_match_score DECIMAL(5,2);
```

### 3. Implementation Steps

#### Step 1: Setup Verihubs SDK

```bash
npm install @verihubs/ocr-sdk
```

```typescript
// src/documents/services/ocr-verihubs.service.ts
import { VerihubsOCR } from '@verihubs/ocr-sdk';

@Injectable()
export class VerihubsOcrService {
  private client: VerihubsOCR;

  constructor(private configService: ConfigService) {
    this.client = new VerihubsOCR({
      apiKey: this.configService.get('VERIHUBS_API_KEY'),
      apiSecret: this.configService.get('VERIHUBS_API_SECRET'),
    });
  }

  async extractKtpData(imageBuffer: Buffer): Promise<KtpData> {
    const result = await this.client.ocr.ktp(imageBuffer);
    return this.mapKtpResponse(result);
  }

  async extractPassportData(imageBuffer: Buffer): Promise<PassportData> {
    const result = await this.client.ocr.passport(imageBuffer);
    return this.mapPassportResponse(result);
  }

  private mapKtpResponse(response: any): KtpData {
    return {
      nik: response.nik,
      fullName: response.nama,
      placeOfBirth: response.tempat_lahir,
      dateOfBirth: response.tanggal_lahir,
      gender: response.jenis_kelamin,
      address: response.alamat,
      rtRw: response.rt_rw,
      kelurahan: response.kel_desa,
      kecamatan: response.kecamatan,
      religion: response.agama,
      maritalStatus: response.status_perkawinan,
      occupation: response.pekerjaan,
      nationality: response.kewarganegaraan,
      validUntil: response.berlaku_hingga,
      confidenceScore: response.confidence_score,
    };
  }
}
```

#### Step 2: Update Documents Service

```typescript
// src/documents/services/documents.service.ts

async uploadDocument(file: Express.Multer.File, dto: UploadDocumentDto): Promise<DocumentResponseDto> {
  // ... existing upload logic ...

  // Trigger OCR extraction if enabled
  if (this.configService.get('FEATURE_OCR_ENABLED') === 'true') {
    await this.queueService.addJob(QueueName.OCR_PROCESSING, {
      documentId: savedDocument.id,
      documentType: dto.documentType,
      fileUrl: fileUrl,
    });
  }

  return this.mapToResponseDto(savedDocument);
}
```

#### Step 3: Create OCR Processing Queue

```typescript
// src/documents/processors/ocr.processor.ts

@Processor(QueueName.OCR_PROCESSING)
export class OcrProcessor {
  constructor(
    private readonly ocrService: VerihubsOcrService,
    private readonly documentsService: DocumentsService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Process('extract-data')
  async processOcr(job: Job<{ documentId: string; documentType: string; fileUrl: string }>) {
    const { documentId, documentType, fileUrl } = job.data;

    try {
      // Download file
      const filePath = this.extractFilePathFromUrl(fileUrl);
      const fileBuffer = await this.fileStorageService.download(filePath);

      let extractedData: any;

      // Extract data based on document type
      switch (documentType) {
        case DocumentType.KTP:
          extractedData = await this.ocrService.extractKtpData(fileBuffer);
          break;
        case DocumentType.PASSPORT:
          extractedData = await this.ocrService.extractPassportData(fileBuffer);
          break;
        // ... other types
        default:
          throw new Error(`OCR not supported for document type: ${documentType}`);
      }

      // Update document with extracted data
      await this.documentsService.updateExtractedData(documentId, {
        data: extractedData,
        confidenceScore: extractedData.confidenceScore,
        extractedAt: new Date(),
      });

      // Emit WebSocket event
      this.webSocketGateway.emitToTenant(tenantId, 'ocr.completed', {
        documentId,
        success: true,
      });
    } catch (error) {
      this.logger.error(`OCR processing failed for document ${documentId}: ${error.message}`);

      // Emit failure event
      this.webSocketGateway.emitToTenant(tenantId, 'ocr.failed', {
        documentId,
        error: error.message,
      });

      throw error;
    }
  }
}
```

#### Step 4: Document Quality Validation

```typescript
// src/documents/services/quality-validation.service.ts

@Injectable()
export class QualityValidationService {
  async validateDocument(fileBuffer: Buffer, documentType: DocumentType): Promise<QualityValidationResult> {
    const results = {
      brightness: await this.checkBrightness(fileBuffer),
      blur: await this.checkBlur(fileBuffer),
      resolution: await this.checkResolution(fileBuffer),
      orientation: await this.checkOrientation(fileBuffer),
    };

    const passed = Object.values(results).every(r => r.passed);

    return {
      passed,
      results,
      recommendations: this.generateRecommendations(results),
    };
  }

  private async checkBrightness(fileBuffer: Buffer): Promise<ValidationCheck> {
    // Use sharp library to analyze brightness
    const { stats } = await sharp(fileBuffer).stats();
    const avgBrightness = stats.channels[0].mean;

    return {
      passed: avgBrightness >= 50 && avgBrightness <= 200,
      value: avgBrightness,
      threshold: '50-200',
      message: avgBrightness < 50 ? 'Image too dark' : avgBrightness > 200 ? 'Image too bright' : 'OK',
    };
  }

  private async checkBlur(fileBuffer: Buffer): Promise<ValidationCheck> {
    // Implement Laplacian variance blur detection
    // Sharp library can help with edge detection
    // Threshold: > 100 is acceptable
    return {
      passed: true, // placeholder
      value: 0,
      threshold: '>100',
      message: 'OK',
    };
  }
}
```

### 4. Frontend Integration

#### Auto-Extract Button

```tsx
// frontend/src/components/DocumentUpload.tsx

const DocumentUpload: React.FC = () => {
  const [isOcrEnabled, setIsOcrEnabled] = useState(false);

  useEffect(() => {
    // Check if OCR is enabled
    api.get('/api/v1/ocr/info').then(({ data }) => {
      setIsOcrEnabled(data.available);
    });
  }, []);

  return (
    <div>
      {isOcrEnabled ? (
        <Button onClick={handleAutoExtract}>
          Auto-Extract Data
        </Button>
      ) : (
        <Tooltip title="Coming Soon - Phase 2 with Verihubs OCR">
          <Button disabled>
            Auto-Extract Data
            <Badge>Coming Soon</Badge>
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
```

#### OCR Review Interface

```tsx
// frontend/src/components/OcrReviewPanel.tsx

const OcrReviewPanel: React.FC<{ document: Document }> = ({ document }) => {
  const { extractedData } = document;

  if (!extractedData) {
    return <div>No OCR data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <Title>Extracted Data</Title>
        <ConfidenceScore score={extractedData.confidenceScore} />
      </CardHeader>
      <CardBody>
        {Object.entries(extractedData.data).map(([key, value]) => (
          <FormField key={key}>
            <Label>{formatFieldName(key)}</Label>
            <Input
              value={value}
              onChange={(e) => handleFieldUpdate(key, e.target.value)}
            />
            <CheckIcon onClick={() => markAsVerified(key)} />
          </FormField>
        ))}
      </CardBody>
    </Card>
  );
};
```

### 5. Cost Optimization Strategies

#### Caching

```typescript
// Cache OCR results to avoid re-processing
const cacheKey = `ocr:${documentId}`;
const cached = await this.cacheService.get(cacheKey);

if (cached) {
  return cached;
}

const result = await this.ocrService.extractKtpData(fileBuffer);
await this.cacheService.set(cacheKey, result, 3600); // 1 hour TTL
```

#### Quality Pre-Check

```typescript
// Only process high-quality images
const qualityCheck = await this.qualityService.validateDocument(fileBuffer, documentType);

if (!qualityCheck.passed) {
  throw new BadRequestException({
    message: 'Document quality too low for OCR',
    recommendations: qualityCheck.recommendations,
  });
}
```

#### Batch Processing

```typescript
// Process multiple documents in a single API call
const results = await this.ocrService.batchExtract([
  { id: 'doc1', buffer: buffer1, type: 'ktp' },
  { id: 'doc2', buffer: buffer2, type: 'passport' },
]);
```

## Testing Strategy

### 1. Unit Tests

```typescript
describe('VerihubsOcrService', () => {
  it('should extract KTP data correctly', async () => {
    const mockBuffer = Buffer.from('...');
    const result = await service.extractKtpData(mockBuffer);

    expect(result.nik).toBeDefined();
    expect(result.fullName).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
describe('OCR E2E', () => {
  it('should upload document and trigger OCR extraction', async () => {
    const response = await request(app)
      .post('/api/v1/documents/upload')
      .attach('file', 'test-ktp.jpg')
      .field('documentType', 'ktp');

    expect(response.status).toBe(201);

    // Wait for OCR processing
    await new Promise(resolve => setTimeout(resolve, 5000));

    const document = await request(app)
      .get(`/api/v1/documents/${response.body.id}`);

    expect(document.body.extractedData).toBeDefined();
  });
});
```

### 3. Test Data

Prepare test documents:
- `test-ktp-valid.jpg` - High quality KTP
- `test-ktp-blurry.jpg` - Blurry image
- `test-passport-valid.pdf` - Valid passport scan
- `test-kk-valid.jpg` - Valid Kartu Keluarga

## Monitoring & Analytics

### Metrics to Track

```typescript
// Track OCR success rate
await this.metricsService.increment('ocr.extraction.success', {
  documentType,
  provider: 'verihubs',
});

// Track confidence scores
await this.metricsService.gauge('ocr.confidence.score', confidenceScore, {
  documentType,
});

// Track processing time
await this.metricsService.timing('ocr.processing.duration', duration, {
  documentType,
});
```

### Dashboard Queries

```sql
-- OCR success rate by document type
SELECT
  document_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE extracted_data IS NOT NULL) as successful,
  ROUND(COUNT(*) FILTER (WHERE extracted_data IS NOT NULL)::numeric / COUNT(*) * 100, 2) as success_rate
FROM documents
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY document_type;

-- Average confidence score
SELECT
  document_type,
  AVG((extracted_data->>'confidenceScore')::numeric) as avg_confidence
FROM documents
WHERE extracted_data IS NOT NULL
GROUP BY document_type;
```

## Security Considerations

### 1. Data Privacy

- OCR data transmitted over HTTPS
- Sensitive data encrypted at rest
- PII redacted from logs

### 2. API Key Management

```typescript
// Store API keys in environment variables
VERIHUBS_API_KEY=your_api_key
VERIHUBS_API_SECRET=your_api_secret

// Use AWS Secrets Manager or similar in production
const apiKey = await this.secretsManager.getSecret('verihubs/api-key');
```

### 3. Rate Limiting

```typescript
// Prevent abuse of OCR endpoints
@Throttle(10, 60) // 10 requests per minute
async extractKtpData() {
  // ...
}
```

## Rollout Plan

### Phase 2.1 - KTP OCR (MVP)

- Implement KTP extraction only
- Beta test with 100 users
- Monitor accuracy and costs

### Phase 2.2 - Passport & KK

- Add Passport and Kartu Keluarga OCR
- Implement quality validation
- Optimize batch processing

### Phase 2.3 - Advanced Features

- Face matching
- Document authenticity check
- Auto-expiry detection

## Cost Estimation

### Scenario: 1,000 jamaah/month

| Document Type | Count/Jamaah | Price/Request | Monthly Cost |
|---------------|--------------|---------------|--------------|
| KTP           | 1            | IDR 2,000     | IDR 2,000,000 |
| Passport      | 1            | IDR 3,000     | IDR 3,000,000 |
| KK            | 1            | IDR 2,000     | IDR 2,000,000 |
| **Total**     | **3**        |               | **IDR 7,000,000** |

**USD Equivalent:** ~$450/month (at IDR 15,500/$1)

## Migration Path

### Enabling OCR in Production

1. Set feature flag: `FEATURE_OCR_ENABLED=true`
2. Configure Verihubs credentials
3. Monitor initial batch for accuracy
4. Gradually increase rollout percentage

```typescript
// Feature flag with gradual rollout
const ocrEnabled = this.featureFlags.isEnabled('ocr', {
  userId: uploaderId,
  rolloutPercentage: 10, // Start with 10%
});
```

## Support & Resources

- **Verihubs Documentation:** https://docs.verihubs.com
- **Google Cloud Vision:** https://cloud.google.com/vision/docs
- **Support Contact:** support@verihubs.com

## Conclusion

OCR integration is a high-value feature for Phase 2 that will significantly reduce manual data entry and improve accuracy. The stub implementation in Phase 1 ensures the architecture is ready for seamless integration when resources are available.

**Estimated Implementation Time:** 4-6 weeks

**Recommended Start Date:** Q2 2026
