# SISKOPATUH Integration Documentation

## Overview

SISKOPATUH (Sistem Komputerisasi Penyelenggara Perjalanan Ibadah Umrah Terpadu) is the Indonesian government's system for monitoring and regulating Umrah travel agencies. All licensed Umrah operators must submit periodic reports.

**Status:** Coming in Phase 2 (Q2 2025)

## Regulatory Background

### Legal Basis

1. **UU No. 13 Tahun 2008** - Penyelenggaraan Ibadah Haji
2. **Peraturan Menteri Agama** - Penyelenggaraan Umrah
3. **Keputusan Direktur Jenderal PHU** - Sistem Pelaporan

### Reporting Requirements

Travel agencies must report:
- Monthly departure statistics
- Financial transactions
- Jamaah data
- Package offerings
- Compliance certifications

### Penalties for Non-Compliance

- Warning letter
- Temporary suspension
- License revocation
- Legal prosecution

## Required Data Fields

### Agency Information

```typescript
interface AgencyInfo {
  // Registration
  agencyName: string;
  npwp: string;
  registrationNumber: string;
  licenseNumber: string;
  expiryDate: Date;

  // Contact
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;

  // Bank Account
  bankName: string;
  accountNumber: string;
  accountName: string;
}
```

### Monthly Report Data

```typescript
interface MonthlyReport {
  // Period
  reportMonth: string; // YYYY-MM
  submissionDate: Date;

  // Statistics
  totalJamaah: number;
  totalDepartures: number;
  totalRevenue: number; // In IDR

  // Packages
  packages: PackageReport[];

  // Contracts
  totalContracts: number;
  signedContracts: number;

  // Financial
  deposits: number;
  fullPayments: number;
  refunds: number;

  // Compliance
  complaintResolved: number;
  complaintPending: number;
}
```

### Jamaah Data

```typescript
interface JamaahReport {
  // Personal
  fullName: string;
  ktpNumber: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';

  // Contact
  address: string;
  phone: string;
  email?: string;

  // Travel
  packageId: string;
  departureDate: Date;
  returnDate: Date;

  // Financial
  totalPaid: number;
  paymentStatus: string;

  // Contract
  contractNumber: string;
  contractDate: Date;
  signedDate: Date;
}
```

### Package Details

```typescript
interface PackageReport {
  packageId: string;
  packageName: string;
  packageType: string; // economy, standard, premium
  price: number;
  duration: number; // days

  // Hotels
  makkahHotel: string;
  makkahHotelRating: number;
  madinahHotel: string;
  madinahHotelRating: number;

  // Flight
  airline: string;
  flightClass: string;

  // Statistics
  totalSold: number;
  totalRevenue: number;
}
```

## API Specification (Phase 2)

### Base URL

```
Production: https://siskopatuh.kemenag.go.id/api/v1
Sandbox: https://sandbox-siskopatuh.kemenag.go.id/api/v1
```

### Authentication

```http
POST /auth/token
Content-Type: application/json

{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Submit Monthly Report

```http
POST /reports/monthly
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "agency": {...},
  "report_month": "2025-01",
  "statistics": {...},
  "jamaah_data": [...],
  "packages": [...]
}
```

Response:
```json
{
  "submission_id": "SUB-2025-01-12345",
  "status": "pending_verification",
  "submitted_at": "2025-01-10T14:30:00Z",
  "verification_deadline": "2025-01-15T23:59:59Z"
}
```

### Check Submission Status

```http
GET /reports/monthly/{submission_id}
Authorization: Bearer {access_token}
```

Response:
```json
{
  "submission_id": "SUB-2025-01-12345",
  "status": "verified",
  "submitted_at": "2025-01-10T14:30:00Z",
  "verified_at": "2025-01-12T10:00:00Z",
  "verified_by": "Petugas SISKOPATUH",
  "notes": null
}
```

### Download Receipt

```http
GET /reports/monthly/{submission_id}/receipt
Authorization: Bearer {access_token}
```

Returns PDF receipt with official stamp.

## Current Implementation (Phase 1)

### Stub Endpoints

All SISKOPATUH endpoints return HTTP 501:

```typescript
POST /api/v1/compliance/siskopatuh/submit     // 501
GET  /api/v1/compliance/siskopatuh/status     // 501
POST /api/v1/compliance/siskopatuh/notify-me  // 200 OK
GET  /api/v1/compliance/siskopatuh/info       // 200 OK
```

### Info Response

```json
{
  "status": "Coming Soon",
  "estimatedLaunch": "Q2 2025",
  "documentation": "/docs/compliance/siskopatuh-integration.md",
  "requiredFields": [
    "Agency registration data",
    "Jamaah personal data",
    "Package details and pricing",
    "Payment records",
    "Departure dates",
    "Compliance certifications"
  ],
  "badge": "Coming Soon - Phase 2"
}
```

## Phase 2 Implementation Plan

### Month 1: Registration & Setup

**Week 1-2:**
- Register with Kemenag for SISKOPATUH access
- Obtain API credentials
- Setup sandbox environment
- Review complete API documentation

**Week 3-4:**
- Implement authentication flow
- Build data mapping layer
- Create submission service

### Month 2: Core Implementation

**Week 1:**
- Implement monthly report generation
- Build jamaah data aggregation
- Create package statistics calculator

**Week 2:**
- Implement submission API calls
- Build retry logic
- Add error handling

**Week 3:**
- Implement status checking
- Build receipt download
- Create notification system

**Week 4:**
- Integration testing with sandbox
- Performance optimization
- Security audit

### Month 3: Testing & Launch

**Week 1-2:**
- End-to-end testing
- Compliance verification
- User acceptance testing

**Week 3:**
- Production deployment
- Monitor first submissions
- Collect feedback

**Week 4:**
- Optimization based on feedback
- Documentation updates
- Training for users

## Data Mapping

### From Platform to SISKOPATUH

```typescript
class SiskopathDataMapper {
  mapMonthlyReport(platformData: PlatformData): SiskopathReport {
    return {
      agency: this.mapAgency(platformData.tenant),
      report_month: platformData.period,
      statistics: {
        total_jamaah: platformData.jamaah.length,
        total_departures: this.countDepartures(platformData.jamaah),
        total_revenue: this.sumRevenue(platformData.payments),
      },
      jamaah_data: platformData.jamaah.map(this.mapJamaah),
      packages: platformData.packages.map(this.mapPackage),
    };
  }

  mapJamaah(jamaah: JamaahEntity): SiskopathJamaah {
    return {
      full_name: jamaah.fullName,
      ktp_number: jamaah.ktpNumber,
      date_of_birth: jamaah.dateOfBirth,
      gender: jamaah.gender,
      address: jamaah.address,
      phone: jamaah.phone,
      email: jamaah.email,
      package_id: jamaah.packageId,
      departure_date: jamaah.departureDate,
      return_date: jamaah.returnDate,
      total_paid: jamaah.totalPaid,
      payment_status: jamaah.paymentStatus,
      contract_number: jamaah.contractNumber,
      contract_date: jamaah.contractDate,
      signed_date: jamaah.signedDate,
    };
  }
}
```

## Compliance Dashboard Integration

Phase 2 will add SISKOPATUH section to compliance dashboard:

### Dashboard Widget

```typescript
{
  title: "SISKOPATUH Reporting",
  status: "up_to_date", // or "overdue", "pending"
  lastSubmission: "2025-01-10",
  nextDeadline: "2025-02-10",
  pendingReports: 0,
  actions: [
    {
      label: "Submit Monthly Report",
      onClick: () => this.submitReport()
    },
    {
      label: "View History",
      onClick: () => this.viewHistory()
    }
  ]
}
```

## Notification System

### Deadlines

- Monthly reports due: 10th of following month
- Reminder: 5 days before deadline
- Warning: 1 day before deadline
- Alert: After deadline (overdue)

### Email Notifications

```
Subject: Reminder: SISKOPATUH Monthly Report Due Soon

Assalamu'alaikum Wr. Wb.

Laporan bulanan SISKOPATUH untuk periode {{month}} akan jatuh tempo pada {{deadline}}.

Status:
- Jamaah terdaftar: {{totalJamaah}}
- Keberangkatan: {{totalDepartures}}
- Kontrak ditandatangani: {{signedContracts}}

Silakan submit laporan melalui:
{{dashboardUrl}}

Wassalamu'alaikum Wr. Wb.
```

## Error Handling

### Common Errors

```typescript
{
  "INVALID_CREDENTIALS": "API credentials invalid or expired",
  "DUPLICATE_SUBMISSION": "Report already submitted for this period",
  "INVALID_DATA": "Data validation failed",
  "QUOTA_EXCEEDED": "Monthly submission quota exceeded",
  "SERVER_ERROR": "SISKOPATUH server error"
}
```

### Retry Logic

```typescript
const retryStrategy = {
  maxRetries: 3,
  backoffMs: [1000, 5000, 15000],
  retryableErrors: [
    'NETWORK_ERROR',
    'SERVER_ERROR',
    'TIMEOUT'
  ]
};
```

## Testing Strategy

### Unit Tests
- Data mapping functions
- Validation logic
- Report generation

### Integration Tests
- API authentication
- Submission flow
- Status checking
- Receipt download

### End-to-End Tests
- Complete monthly report cycle
- Error scenarios
- Retry logic
- Notifications

## Monitoring & Logging

### Metrics to Track

- Submission success rate
- Average submission time
- API response times
- Error rates by type
- Overdue reports count

### Alerts

- Submission failure
- API authentication failure
- Approaching deadline
- Overdue report

## Questions?

For Phase 2 SISKOPATUH integration:
- Email: compliance@travelumroh.com
- Kemenag Contact: siskopatuh@kemenag.go.id
- Hotline: 0800-UMROH (0800-86764)
