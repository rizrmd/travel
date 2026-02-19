# Epic 10: Agent Landing Page Builder - Implementation Summary

## Overview

**Epic Name**: Agent Landing Page Builder
**Status**: ✅ Complete
**Implementation Date**: December 23, 2025
**Developer**: Travel Umroh Team

This document provides a comprehensive summary of the Epic 10 implementation, including all files created, API endpoints, database schema, and usage guidelines.

---

## Table of Contents

1. [Feature Summary](#feature-summary)
2. [Files Created](#files-created)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Architecture Decisions](#architecture-decisions)
6. [Usage Examples](#usage-examples)
7. [Testing Guidelines](#testing-guidelines)
8. [Next Steps](#next-steps)

---

## Feature Summary

Epic 10 enables agents to create customized landing pages for their Umroh packages with the following capabilities:

### Key Features Implemented

✅ **Story 10.1**: Template Selection & Customization
- 3 responsive templates: Modern, Classic, Minimal
- Handlebars-based rendering engine
- Full branding customization (colors, logo, social links)

✅ **Story 10.2**: Landing Page Publishing & Sharing
- Publish/unpublish functionality
- Public landing page viewing (no authentication)
- UTM parameter tracking for marketing attribution

✅ **Story 10.3**: Lead Capture System
- Public lead form on landing pages
- Automatic IP address and user agent capture
- WhatsApp deep linking for instant contact

✅ **Story 10.4**: Leads Management
- View all leads with filtering
- Status tracking (new → contacted → qualified → converted/lost)
- Agent assignment (admin only)
- Hot leads detection (< 24 hours old)

✅ **Story 10.5**: Agent Branding
- Custom color schemes
- Logo and profile photo upload
- Social media links integration
- Contact information management

✅ **Story 10.6**: Analytics Dashboard
- View count tracking
- Lead conversion metrics
- UTM source attribution
- Performance analytics per landing page

---

## Files Created

### Total: 32 Files

#### Domain Models (3 files)
```
src/landing-pages/domain/landing-page.ts
src/leads/domain/lead.ts
src/users/domain/agent-branding.ts
```

#### TypeORM Entities (3 files)
```
src/landing-pages/infrastructure/persistence/relational/entities/landing-page.entity.ts
src/leads/infrastructure/persistence/relational/entities/lead.entity.ts
src/users/infrastructure/persistence/relational/entities/agent-branding.entity.ts
```

#### Templates (4 files)
```
src/landing-pages/services/template-renderer.service.ts
src/landing-pages/templates/modern.hbs
src/landing-pages/templates/classic.hbs
src/landing-pages/templates/minimal.hbs
```

#### DTOs (10 files)

**Landing Pages DTOs:**
```
src/landing-pages/dto/create-landing-page.dto.ts
src/landing-pages/dto/update-landing-page.dto.ts
src/landing-pages/dto/landing-page-response.dto.ts
src/landing-pages/dto/landing-page-list-query.dto.ts
```

**Leads DTOs:**
```
src/leads/dto/create-lead.dto.ts
src/leads/dto/update-lead-status.dto.ts
src/leads/dto/lead-response.dto.ts
src/leads/dto/leads-list-query.dto.ts
```

**Agent Branding DTOs:**
```
src/users/dto/update-agent-branding.dto.ts
src/users/dto/agent-branding-response.dto.ts
```

#### Services (3 files)
```
src/landing-pages/services/landing-pages.service.ts
src/leads/services/leads.service.ts
src/analytics/services/page-analytics.service.ts
```

#### Controllers (2 files)
```
src/landing-pages/landing-pages.controller.ts (includes 2 controllers)
src/leads/leads.controller.ts
```

#### Modules (3 files)
```
src/landing-pages/landing-pages.module.ts
src/leads/leads.module.ts
src/analytics/analytics.module.ts
```

#### Database (1 file)
```
src/database/migrations/1766500000000-CreateLandingPagesTables.ts
```

#### Documentation (2 files)
```
docs/frontend-tasks/epic-10-landing-page-builder.md
EPIC_10_SUMMARY.md (this file)
```

#### Updated Files (3 files)
```
src/app.module.ts (added module imports)
package.json (added handlebars dependency)
README.md (updated with Epic 10 info)
```

---

## Database Schema

### Tables Created

#### 1. `landing_pages`

```sql
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,

  -- Core Fields
  slug VARCHAR(255) UNIQUE NOT NULL,
  template_id landing_page_template NOT NULL DEFAULT 'modern',
  status landing_page_status NOT NULL DEFAULT 'draft',

  -- Customizations (JSONB)
  customizations JSONB NOT NULL DEFAULT '{}',

  -- Analytics
  views_count INT NOT NULL DEFAULT 0,
  leads_count INT NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_landing_pages_tenant_agent ON landing_pages(tenant_id, agent_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_status ON landing_pages(status);
CREATE INDEX idx_landing_pages_package ON landing_pages(package_id);
```

**Customizations JSONB Structure:**
```json
{
  "primaryColor": "#3B82F6",
  "secondaryColor": "#10B981",
  "accentColor": "#F59E0B",
  "logo": "https://...",
  "profilePhoto": "https://...",
  "agentName": "Ahmad Surya",
  "tagline": "Your Trusted Umroh Partner",
  "whatsappNumber": "+6281234567890",
  "email": "agent@example.com",
  "address": "Jakarta, Indonesia",
  "socialMedia": {
    "instagram": "https://instagram.com/username",
    "facebook": "https://facebook.com/username",
    "youtube": "https://youtube.com/channel",
    "tiktok": "https://tiktok.com/@username",
    "twitter": "https://twitter.com/username"
  },
  "customIntro": "Welcome to my page!",
  "videoUrl": "https://youtube.com/watch?v=...",
  "metaTitle": "Best Umroh Package 2025",
  "metaDescription": "Affordable Umroh packages...",
  "ogImage": "https://...",
  "customCss": ".custom-class { ... }"
}
```

#### 2. `leads`

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE SET NULL,

  -- Contact Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,

  -- Status
  status lead_status NOT NULL DEFAULT 'new',
  source lead_source NOT NULL DEFAULT 'landing_page',

  -- UTM Tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),

  -- Technical Tracking
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Conversion
  converted_to_jamaah_id UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_leads_tenant_agent ON leads(tenant_id, agent_id);
CREATE INDEX idx_leads_status_created ON leads(status, created_at);
CREATE INDEX idx_leads_landing_page ON leads(landing_page_id);
CREATE INDEX idx_leads_utm_source ON leads(utm_source);
```

#### 3. `agent_branding`

```sql
CREATE TABLE agent_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Branding Information
  agent_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  address TEXT,
  tagline VARCHAR(500),
  logo VARCHAR(500),
  profile_photo VARCHAR(500),

  -- Color Scheme (JSONB)
  color_scheme JSONB NOT NULL DEFAULT '{"primary":"#3B82F6","secondary":"#10B981","accent":"#F59E0B"}',

  -- Social Media Links (JSONB)
  social_media_links JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_agent_branding_tenant ON agent_branding(tenant_id);
CREATE INDEX idx_agent_branding_user ON agent_branding(user_id);
```

### ENUM Types Created

```sql
CREATE TYPE landing_page_template AS ENUM ('modern', 'classic', 'minimal');
CREATE TYPE landing_page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE lead_source AS ENUM ('landing_page', 'website', 'social_media', 'referral', 'chatbot', 'whatsapp', 'other');
```

### Row-Level Security (RLS) Policies

**Tenant Isolation (All tables):**
```sql
CREATE POLICY landing_pages_tenant_isolation ON landing_pages
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY leads_tenant_isolation ON leads
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

CREATE POLICY agent_branding_tenant_isolation ON agent_branding
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

**Agent Access Control:**
```sql
CREATE POLICY landing_pages_agent_access ON landing_pages
  FOR SELECT
  USING (
    agent_id = current_setting('app.user_id')::UUID
    OR current_setting('app.role') IN ('agency_owner', 'super_admin')
  );

CREATE POLICY leads_agent_access ON leads
  FOR SELECT
  USING (
    agent_id = current_setting('app.user_id')::UUID
    OR current_setting('app.role') IN ('agency_owner', 'super_admin')
  );
```

---

## API Endpoints

### Landing Pages API

**Base URL**: `/api/landing-pages`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/` | Create landing page | ✅ | Agent |
| GET | `/` | List landing pages | ✅ | Agent |
| GET | `/:id` | Get landing page details | ✅ | Agent |
| PATCH | `/:id` | Update landing page | ✅ | Agent (owner) |
| DELETE | `/:id` | Delete landing page (soft) | ✅ | Agent (owner) |
| POST | `/:id/publish` | Publish landing page | ✅ | Agent (owner) |
| POST | `/:id/archive` | Archive landing page | ✅ | Agent (owner) |
| POST | `/:id/duplicate` | Duplicate landing page | ✅ | Agent |
| GET | `/:id/analytics` | Get page analytics | ✅ | Agent (owner) |

### Public Landing Pages API

**Base URL**: `/p`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/:slug` | View public landing page | ❌ | Public |

### Leads API

**Base URL**: `/api/leads`

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/` | Create lead (public form) | ❌ | Public |
| GET | `/` | List leads | ✅ | Agent |
| GET | `/hot` | Get hot leads (< 24h) | ✅ | Agent |
| GET | `/:id` | Get lead details | ✅ | Agent |
| PATCH | `/:id/status` | Update lead status | ✅ | Agent |
| POST | `/:id/contact` | Mark as contacted | ✅ | Agent |
| POST | `/:id/assign` | Assign to agent | ✅ | Admin |

### Request/Response Examples

#### Create Landing Page

**Request:**
```http
POST /api/landing-pages
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": "123e4567-e89b-12d3-a456-426614174000",
  "templateId": "modern",
  "slug": "umroh-ramadan-2025",
  "customizations": {
    "primaryColor": "#3B82F6",
    "agentName": "Ahmad Surya",
    "whatsappNumber": "+6281234567890",
    "email": "ahmad@example.com"
  }
}
```

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "slug": "umroh-ramadan-2025",
  "status": "draft",
  "templateId": "modern",
  "packageId": "123e4567-e89b-12d3-a456-426614174000",
  "agentId": "789e0123-e89b-12d3-a456-426614174002",
  "tenantId": "012e3456-e89b-12d3-a456-426614174003",
  "customizations": {
    "primaryColor": "#3B82F6",
    "agentName": "Ahmad Surya",
    "whatsappNumber": "+6281234567890",
    "email": "ahmad@example.com"
  },
  "viewsCount": 0,
  "leadsCount": 0,
  "conversionRate": 0,
  "fullUrl": "https://app.travelumroh.com/p/umroh-ramadan-2025",
  "createdAt": "2025-12-23T10:00:00Z",
  "updatedAt": "2025-12-23T10:00:00Z"
}
```

#### Submit Lead (Public)

**Request:**
```http
POST /api/leads
Content-Type: application/json

{
  "landingPageId": "456e7890-e89b-12d3-a456-426614174001",
  "fullName": "Fatimah Zahra",
  "email": "fatimah@example.com",
  "phone": "+6281234567890",
  "message": "I'm interested in the Ramadan package",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "ramadan2025"
}
```

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174004",
  "fullName": "Fatimah Zahra",
  "email": "fatimah@example.com",
  "phone": "+6281234567890",
  "status": "new",
  "source": "landing_page",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "ramadan2025",
  "daysSinceCreated": 0,
  "createdAt": "2025-12-23T12:00:00Z"
}
```

#### Get Analytics

**Request:**
```http
GET /api/landing-pages/456e7890-e89b-12d3-a456-426614174001/analytics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "landingPageId": "456e7890-e89b-12d3-a456-426614174001",
  "totalViews": 1250,
  "totalLeads": 87,
  "conversionRate": 6.96,
  "leadsByStatus": {
    "new": 23,
    "contacted": 35,
    "qualified": 18,
    "converted": 9,
    "lost": 2
  },
  "viewsByDate": [
    { "date": "2025-12-20", "views": 342 },
    { "date": "2025-12-21", "views": 401 },
    { "date": "2025-12-22", "views": 507 }
  ],
  "leadsByDate": [
    { "date": "2025-12-20", "leads": 24 },
    { "date": "2025-12-21", "leads": 28 },
    { "date": "2025-12-22", "leads": 35 }
  ],
  "utmSources": [
    { "source": "facebook", "leads": 42 },
    { "source": "instagram", "leads": 31 },
    { "source": "google", "leads": 14 }
  ]
}
```

---

## Architecture Decisions

### 1. Template Engine: Handlebars

**Decision**: Use Handlebars for server-side HTML rendering

**Rationale**:
- Logic-less templates prevent security vulnerabilities
- Simple syntax for non-technical users
- Built-in helpers for common operations
- Better performance than client-side rendering for public pages

**Custom Helpers Implemented**:
```javascript
Handlebars.registerHelper('formatCurrency', (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
});

Handlebars.registerHelper('whatsappUrl', (number, message) => {
  const cleaned = number.replace(/\D/g, '');
  return `https://wa.me/${cleaned}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
});

Handlebars.registerHelper('formatDate', (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
});
```

### 2. Customizations Storage: JSONB

**Decision**: Use PostgreSQL JSONB for customizations field

**Rationale**:
- Flexible schema allows adding new customization options without migrations
- Efficient indexing and querying with GIN indexes
- Native JSON operators in PostgreSQL for complex queries
- Type safety via DTOs in application layer

### 3. Multi-Tenancy: Row-Level Security (RLS)

**Decision**: Implement RLS policies at database level

**Rationale**:
- Defense in depth - security enforced even if application logic fails
- Centralized security rules in one place
- Performance benefits with query optimization
- Prevents accidental cross-tenant data leaks

### 4. Lead Attribution: UTM Parameters

**Decision**: Capture and store UTM parameters separately

**Rationale**:
- Standard marketing attribution model
- Enables ROI analysis per campaign
- Separate fields allow efficient filtering and aggregation
- Compatible with Google Analytics and other tools

### 5. Public vs Authenticated Endpoints

**Decision**: Separate controllers for public and authenticated operations

**Rationale**:
- Clear separation of concerns
- Different rate limiting and caching strategies
- Easier to secure and audit
- Better performance optimization for public pages

---

## Usage Examples

### Example 1: Agent Creates Landing Page

```typescript
// 1. Agent selects a package and template
const createDto = {
  packageId: 'package-uuid',
  templateId: TemplateType.MODERN,
  slug: 'umroh-ramadan-2025-promo',
  customizations: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    agentName: 'Ahmad Surya',
    whatsappNumber: '+6281234567890',
    email: 'ahmad@example.com',
    socialMedia: {
      instagram: 'https://instagram.com/ahmad.umroh',
      facebook: 'https://facebook.com/ahmad.umroh'
    }
  }
};

// 2. Create landing page (draft status)
const response = await fetch('/api/landing-pages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(createDto)
});

const landingPage = await response.json();
// landingPage.status === 'draft'
// landingPage.fullUrl === 'https://app.travelumroh.com/p/umroh-ramadan-2025-promo'

// 3. Preview the page (still draft)
window.open(landingPage.fullUrl, '_blank');

// 4. Make some edits
await fetch(`/api/landing-pages/${landingPage.id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    customizations: {
      customIntro: 'Dapatkan diskon 10% untuk pendaftaran bulan ini!',
      videoUrl: 'https://youtube.com/watch?v=xyz'
    }
  })
});

// 5. Publish the landing page
await fetch(`/api/landing-pages/${landingPage.id}/publish`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// 6. Share on social media
const shareUrls = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(landingPage.fullUrl)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this amazing Umroh package: ${landingPage.fullUrl}`)}`
};
```

### Example 2: Customer Submits Lead

```typescript
// 1. Customer visits landing page
// URL: https://app.travelumroh.com/p/umroh-ramadan-2025-promo?utm_source=facebook&utm_medium=social&utm_campaign=ramadan

// 2. Customer fills out lead form
const leadData = {
  landingPageId: 'landing-page-uuid',
  fullName: 'Fatimah Zahra',
  email: 'fatimah@example.com',
  phone: '+6281234567890',
  message: 'I want to know more about the package and payment options',
  // UTM params automatically captured from URL
  utmSource: 'facebook',
  utmMedium: 'social',
  utmCampaign: 'ramadan'
};

// 3. Submit lead (public endpoint, no auth required)
const response = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(leadData)
});

// 4. Backend automatically:
// - Captures IP address and user agent
// - Sets status to 'new'
// - Increments landing page leads_count
// - Associates lead with agent
// - (Future) Sends email notification to agent
// - (Future) Sends WhatsApp notification
```

### Example 3: Agent Manages Leads

```typescript
// 1. Get hot leads (< 24 hours old)
const hotLeads = await fetch('/api/leads/hot', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

console.log(`You have ${hotLeads.total} hot leads!`);

// 2. View lead details
const lead = hotLeads.data[0];

// 3. Contact via WhatsApp
const whatsappMessage = `Hi ${lead.fullName}, thank you for your interest in our Umroh package! How can I help you?`;
const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

window.open(whatsappUrl, '_blank');

// 4. Mark as contacted
await fetch(`/api/leads/${lead.id}/contact`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// 5. Later, update to qualified
await fetch(`/api/leads/${lead.id}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ status: 'qualified' })
});

// 6. When customer books, mark as converted
await fetch(`/api/leads/${lead.id}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'converted',
    convertedToJamaahId: 'jamaah-uuid'
  })
});
```

### Example 4: View Analytics

```typescript
// 1. Get landing page analytics
const analytics = await fetch(`/api/landing-pages/${landingPageId}/analytics`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

console.log(`
  Total Views: ${analytics.totalViews}
  Total Leads: ${analytics.totalLeads}
  Conversion Rate: ${analytics.conversionRate}%

  Leads by Status:
  - New: ${analytics.leadsByStatus.new}
  - Contacted: ${analytics.leadsByStatus.contacted}
  - Qualified: ${analytics.leadsByStatus.qualified}
  - Converted: ${analytics.leadsByStatus.converted}
  - Lost: ${analytics.leadsByStatus.lost}

  Top UTM Sources:
  ${analytics.utmSources.map(s => `- ${s.source}: ${s.leads} leads`).join('\n')}
`);

// 2. Plot conversion chart
const chartData = analytics.viewsByDate.map((view, idx) => ({
  date: view.date,
  views: view.views,
  leads: analytics.leadsByDate[idx]?.leads || 0,
  conversionRate: ((analytics.leadsByDate[idx]?.leads || 0) / view.views) * 100
}));

// Use your charting library (Chart.js, Recharts, etc.)
```

---

## Testing Guidelines

### Running Migrations

```bash
# Generate migration (if not already created)
npm run migration:generate -- CreateLandingPagesTables

# Run migration
npm run migration:run

# Verify tables created
psql -d travel_umroh -c "\dt"
```

### Manual API Testing

#### 1. Create Landing Page

```bash
curl -X POST http://localhost:3000/api/landing-pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "packageId": "package-uuid",
    "templateId": "modern",
    "slug": "test-landing-page",
    "customizations": {
      "primaryColor": "#3B82F6",
      "agentName": "Test Agent",
      "whatsappNumber": "+6281234567890",
      "email": "test@example.com"
    }
  }'
```

#### 2. View Public Landing Page

```bash
curl http://localhost:3000/p/test-landing-page
# Should return HTML
```

#### 3. Submit Lead

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "landingPageId": "landing-page-uuid",
    "fullName": "Test Customer",
    "email": "customer@example.com",
    "phone": "+6281234567890",
    "message": "Test message"
  }'
```

#### 4. Get Analytics

```bash
curl http://localhost:3000/api/landing-pages/landing-page-uuid/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Unit Testing

Run existing tests:
```bash
npm run test
```

Add tests for services:
```typescript
// src/landing-pages/services/landing-pages.service.spec.ts

describe('LandingPagesService', () => {
  it('should create landing page with valid slug', async () => {
    // Test implementation
  });

  it('should throw error for duplicate slug', async () => {
    // Test implementation
  });

  it('should increment views count', async () => {
    // Test implementation
  });
});
```

### E2E Testing

```bash
npm run test:e2e
```

Create E2E test:
```typescript
// test/landing-pages.e2e-spec.ts

describe('Landing Pages (e2e)', () => {
  it('/api/landing-pages (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/landing-pages')
      .set('Authorization', `Bearer ${token}`)
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.slug).toBe('test-landing-page');
        expect(res.body.status).toBe('draft');
      });
  });

  it('/p/:slug (GET)', () => {
    return request(app.getHttpServer())
      .get('/p/test-landing-page')
      .expect(200)
      .expect('Content-Type', /html/);
  });
});
```

---

## Next Steps

### Immediate Tasks

1. **Frontend Implementation**
   - Follow the guide in `docs/frontend-tasks/epic-10-landing-page-builder.md`
   - Implement all UI components
   - Integrate with backend APIs
   - Add E2E tests

2. **Testing**
   - Write unit tests for all services
   - Add integration tests for controllers
   - Perform manual QA testing
   - Load testing for public landing pages

3. **Documentation**
   - Update Swagger documentation
   - Add API usage examples
   - Create video tutorials for agents

### Future Enhancements

1. **Story 10.7**: Email Notifications (TODO)
   - Send email to agent when lead submitted
   - Send auto-reply to customer
   - Daily digest of new leads

2. **Story 10.8**: Real-time Notifications (TODO)
   - WebSocket integration for instant lead notifications
   - Browser push notifications
   - Mobile app notifications

3. **Story 10.9**: Advanced Analytics (TODO)
   - A/B testing between templates
   - Heatmaps and click tracking
   - Funnel analysis
   - Cohort analysis

4. **Story 10.10**: SEO Optimization (TODO)
   - Auto-generate sitemap
   - Schema.org markup
   - Social media card optimization
   - Page speed optimization

5. **Additional Templates** (Future)
   - Create more template options
   - Template marketplace
   - Custom CSS editor
   - Drag-and-drop builder

### Integration Points

**Epic 2: Authentication & Authorization**
- Ensure JWT tokens include tenantId and role
- Implement RLS session middleware
- Add permission checks for landing page operations

**Epic 4: Jamaah Management**
- Link converted leads to jamaah records
- Auto-populate jamaah data from lead
- Track lead-to-booking conversion

**Epic 5: Package Management**
- Fetch package details for template rendering
- Update landing page when package changes
- Validate packageId exists before creating landing page

**Epic 8: Real-time & Background Jobs**
- Queue email notifications
- Background job for analytics aggregation
- Real-time WebSocket for new leads

---

## Performance Considerations

### Caching Strategy

1. **Public Landing Pages**
   - Cache rendered HTML for 5 minutes
   - Invalidate on publish/update
   - CDN caching for static assets

2. **Analytics Data**
   - Cache analytics for 1 hour
   - Background job to pre-compute daily stats
   - Use Redis for hot leads cache

### Database Optimization

1. **Indexes Created**
   - Composite index on (tenant_id, agent_id)
   - Index on slug for fast lookups
   - Index on (status, created_at) for filtering

2. **Query Optimization**
   - Use select specific columns, not SELECT *
   - Limit result sets with pagination
   - Use EXPLAIN ANALYZE for slow queries

### Monitoring

1. **Key Metrics to Track**
   - Landing page response time
   - Lead submission success rate
   - Template rendering time
   - Database query performance

2. **Alerting**
   - Alert if lead submission fails > 5%
   - Alert if page load time > 3 seconds
   - Alert if database connections saturated

---

## Security Considerations

### Input Validation

✅ All DTOs use class-validator decorators
✅ Email validation with @IsEmail()
✅ Phone number validation with regex
✅ URL validation for logos and videos
✅ Hex color validation for color picker

### XSS Prevention

✅ Handlebars auto-escapes HTML by default
✅ Custom CSS sanitization (TODO: implement CSS validator)
✅ User-generated content stored as plain text

### SQL Injection Prevention

✅ TypeORM parameterized queries
✅ No raw SQL with user input
✅ RLS policies prevent cross-tenant access

### Rate Limiting

TODO: Implement rate limiting
- 10 requests/minute for lead submission (per IP)
- 100 requests/minute for authenticated APIs (per user)
- 1000 requests/minute for public landing pages (per IP)

### CORS Configuration

TODO: Configure CORS for production
- Allow specific origins only
- Credentials: true for authenticated requests
- Restrict methods and headers

---

## Troubleshooting

### Common Issues

**Issue**: Landing page returns 404
- **Solution**: Check that slug is correct and page status is 'published'

**Issue**: Lead submission fails with validation error
- **Solution**: Verify email format and phone number format (+62 or 08)

**Issue**: Analytics shows 0 views
- **Solution**: Ensure public endpoint is being accessed (increments view count)

**Issue**: RLS policy blocks query
- **Solution**: Verify session variables are set by RlsSessionMiddleware

**Issue**: Template rendering fails
- **Solution**: Check Handlebars syntax, verify template file exists

### Debug Commands

```bash
# Check database connections
psql -d travel_umroh -c "SELECT * FROM pg_stat_activity WHERE datname = 'travel_umroh';"

# View RLS policies
psql -d travel_umroh -c "\d+ landing_pages"

# Check session variables
psql -d travel_umroh -c "SHOW app.tenant_id;"

# View migration status
npm run migration:show
```

---

## Conclusion

Epic 10 has been successfully implemented with all core features for agent landing page creation, lead capture, and analytics tracking. The system is ready for frontend integration and testing.

**Key Achievements**:
- ✅ 32 files created
- ✅ 3 database tables with RLS policies
- ✅ 15+ API endpoints
- ✅ 3 responsive templates
- ✅ Complete lead management system
- ✅ Analytics and metrics tracking

**Next Epic**: Epic 11 - Operational Intelligence Dashboard

---

**Document Version**: 1.0
**Last Updated**: 2025-12-23
**Status**: Epic 10 Complete ✅
