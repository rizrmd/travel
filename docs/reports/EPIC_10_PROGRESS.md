# Epic 10: Agent Landing Page Builder - Implementation Progress

**Date:** 2025-12-22
**Status:** 🚧 Core Infrastructure Complete - Controllers & Services Pending
**Phase:** 1 (MVP)

---

## Overview

Epic 10 enables agents to create custom landing pages for their Umroh packages with just a few clicks. Each landing page features responsive templates, agent branding, lead capture forms, and social media sharing capabilities.

---

## Implementation Progress

### ✅ Completed (Stories 10.1, 10.3, 10.5 - Core Infrastructure)

#### 1. Domain Models (3 files)

**Landing Page Domain:**
- File: `src/landing-pages/domain/landing-page.ts` (150+ lines)
- Enums: `TemplateType` (Modern, Classic, Minimal), `LandingPageStatus` (Draft, Published, Archived)
- Interface: `LandingPageCustomizations` (colors, branding, contact, social media, content, SEO)
- Methods:
  - `isPublished()` - Check publication status
  - `getFullUrl(baseUrl)` - Generate full URL
  - `incrementViews()` / `incrementLeads()` - Track metrics
  - `getConversionRate()` - Calculate lead conversion
  - `publish()` / `archive()` - Status management
  - `static generateSlug(agentSlug, packageSlug)` - Auto-generate URL slug
  - `static isValidSlug(slug)` - Validate slug format

**Lead Domain:**
- File: `src/leads/domain/lead.ts` (120+ lines)
- Enums: `LeadStatus` (New, Contacted, Qualified, Converted, Lost), `LeadSource` (Landing Page, Website, Social Media, Referral, Chatbot, WhatsApp, Other)
- Methods:
  - `markAsContacted()` / `markAsQualified()` / `markAsConverted()` / `markAsLost()` - Status transitions
  - `assignToAgent(agentId)` - Assign lead ownership
  - `isFromLandingPage()` - Check source
  - `getDaysSinceCreated()` / `isHotLead()` - Lead age tracking
  - `static isValidEmail(email)` / `static isValidPhone(phone)` - Validation

**Agent Branding Domain:**
- File: `src/users/domain/agent-branding.ts` (140+ lines)
- Interfaces: `ColorScheme` (primary, secondary, accent), `Social Media Links` (Facebook, Instagram, TikTok, LinkedIn, YouTube)
- Methods:
  - `static getDefaultColorScheme()` - Default colors
  - `static isValidHexColor(color)` / `static isValidUrl(url)` - Validation
  - `static isValidSocialMediaUrl(platform, url)` - Platform-specific URL validation
  - `static formatWhatsAppNumber(number)` - E.164 formatting
  - `getWhatsAppUrl(message?)` - Generate WhatsApp deep link
  - `isComplete()` / `getCompletionPercentage()` - Profile completeness

#### 2. TypeORM Entities (3 files)

**Landing Pages Entity:**
- File: `src/landing-pages/infrastructure/persistence/relational/entities/landing-page.entity.ts` (75+ lines)
- Table: `landing_pages`
- Indexes:
  - Composite: `[tenant_id, agent_id]`
  - Unique: `slug`
  - Composite: `[status, published_at]`
- Columns: id (UUID), tenant_id, agent_id, package_id, slug (unique), template_id (enum), customizations (JSONB), status (enum), views_count (int), leads_count (int), published_at (timestamp), timestamps, soft delete

**Leads Entity:**
- File: `src/leads/infrastructure/persistence/relational/entities/lead.entity.ts` (95+ lines)
- Table: `leads`
- Indexes:
  - Composite: `[tenant_id, agent_id]`
  - Composite: `[status, created_at]`
  - Single: `landing_page_id`, `email`
- Columns: id (UUID), tenant_id, landing_page_id (nullable), agent_id, full_name, email, phone, preferred_departure_month (nullable), message (nullable), status (enum), source (enum), UTM parameters (utm_source, utm_medium, utm_campaign), tracking (ip_address, user_agent), conversion tracking (converted_to_jamaah_id, assigned_to_agent_id), timestamps (last_contacted_at, converted_at, created_at, updated_at), soft delete

**Agent Branding Entity:**
- File: `src/users/infrastructure/persistence/relational/entities/agent-branding.entity.ts` (70+ lines)
- Table: `agent_branding`
- Indexes:
  - Unique: `user_id`
  - Single: `tenant_id`
- Columns: id (UUID), user_id (unique), tenant_id, profile_photo (nullable), logo (nullable), agent_name, tagline (nullable), phone, email, whatsapp_number, color_scheme (JSONB with defaults), social_media_links (JSONB), intro_text (nullable), intro_video_url (nullable), timestamps

####3. Template Renderer Service (Story 10.1)

**Template Renderer:**
- File: `src/landing-pages/services/template-renderer.service.ts` (220+ lines)
- Template Engine: Handlebars
- Helpers Registered:
  - `formatCurrency(amount)` - IDR currency formatting
  - `formatDate(date)` - Indonesian date format
  - `pluralize(count, singular, plural)` - Text pluralization
  - `eq(a, b)` / `gt(a, b)` / `lt(a, b)` - Conditional comparisons
  - `urlEncode(str)` - URL encoding
  - `whatsappUrl(number, message?)` - WhatsApp deep link generator
- Methods:
  - `render(templateType, data)` - Render template with data
  - `getDefaultMetaTags(packageName, agentName, url)` - Generate SEO meta tags
  - `generateWhatsAppMessage(data)` - Pre-filled WhatsApp message
  - `generateShareUrls(url, title, packageSlug)` - Social media share URLs (Facebook, Twitter, LinkedIn, Telegram)
  - `reloadTemplates()` - Hot reload for development
  - `hasTemplate(templateType)` / `getAvailableTemplates()` - Template management

**Template Data Interface:**
```typescript
{
  package: { name, description, price, duration, departure_date, hotels, airline, inclusions, itinerary },
  agent: { name, photo, tagline, contact, logo, intro, social_media },
  colors: { primary, secondary, accent },
  meta: { title, description, og_image, url },
  utm: { source, medium, campaign }
}
```

#### 4. Landing Page Templates (3 files)

**Modern Template:**
- File: `src/landing-pages/templates/modern.hbs` (250+ lines)
- Design: Gradient hero, card-based layout, bold CTAs
- Features:
  - Full-width gradient hero section
  - Floating WhatsApp button (green #25D366)
  - Grid layout for package details
  - Agent profile card with social links
  - Inline lead capture form with styling
  - Responsive (mobile-first)
  - SEO: Open Graph + Twitter Card meta tags
  - Analytics tracking hooks (gtag)

**Classic Template:**
- File: `src/landing-pages/templates/classic.hbs` (180+ lines)
- Design: Traditional serif fonts, table layout, formal styling
- Features:
  - Bordered header with ornamental elements
  - Price box with border frame
  - Table-based detail presentation
  - Formal typography (Georgia, Times New Roman)
  - Structured form with labels
  - Background: Cream/beige (#f4f1ea)
  - Conservative color palette

**Minimal Template:**
- File: `src/landing-pages/templates/minimal.hbs` (140+ lines)
- Design: Clean, whitespace-heavy, Helvetica Neue
- Features:
  - Large light-weight typography
  - Minimal color usage (accent color only)
  - Two-column grid on desktop
  - Border-line separators
  - Compact form (no labels, placeholders only)
  - Ultra-clean aesthetic
  - Fast loading (minimal CSS)

All templates include:
- Responsive design (mobile breakpoints)
- WhatsApp deep linking
- Lead capture forms (POST /api/v1/leads)
- UTM parameter tracking
- Meta tags for social sharing
- Accessibility considerations

#### 5. Utility Files

**Entity Helper:**
- File: `src/utils/relational-entity-helper.ts` (5 lines)
- Base class for all TypeORM entities

---

## 🚧 Pending Implementation

### 1. DTOs (Data Transfer Objects)

**Landing Pages DTOs (Needed):**
- `create-landing-page.dto.ts` - Validation for creating pages
- `update-landing-page.dto.ts` - Validation for updates
- `customize-landing-page.dto.ts` - Branding customizations
- `landing-page-response.dto.ts` - API response formatting
- `landing-page-query.dto.ts` - Query filters (status, agent_id, etc.)

**Leads DTOs (Needed):**
- `create-lead.dto.ts` - Form submission validation
- `update-lead-status.dto.ts` - Status transitions
- `lead-response.dto.ts` - API response
- `lead-query.dto.ts` - Query filters (status, source, date range)

**Agent Branding DTOs (Needed):**
- `update-agent-branding.dto.ts` - Branding settings
- `agent-branding-response.dto.ts` - API response

### 2. Services

**Landing Pages Service (Needed):**
- File: `src/landing-pages/services/landing-pages.service.ts`
- Methods:
  - `create(dto, agentId, tenantId)` - Create new landing page
  - `findAll(query, tenantId)` - List pages with filters
  - `findOne(id, tenantId)` - Get single page
  - `findBySlug(slug)` - Public page access
  - `update(id, dto, tenantId)` - Update page
  - `publish(id, tenantId)` - Publish page
  - `archive(id, tenantId)` - Archive page
  - `delete(id, tenantId)` - Soft delete
  - `duplicate(id, tenantId)` - Duplicate page for new package
  - `incrementViews(id)` - Track page view
  - `getAnalytics(id, tenantId)` - Get page analytics

**Leads Service (Needed):**
- File: `src/leads/services/leads.service.ts`
- Methods:
  - `create(dto, landingPageId?)` - Create lead from form
  - `findAll(query, tenantId)` - List leads with filters
  - `findOne(id, tenantId)` - Get single lead
  - `updateStatus(id, status, tenantId)` - Change lead status
  - `assignToAgent(id, agentId, tenantId)` - Assign lead
  - `markAsContacted(id, tenantId)` - Update last contact
  - `convertToJamaah(id, jamaahId, tenantId)` - Mark converted
  - `getLeadsByAgent(agentId, tenantId)` - Agent's leads
  - `getHotLeads(tenantId)` - Leads < 24 hours old

**Agent Branding Service (Needed):**
- File: `src/users/services/agent-branding.service.ts`
- Methods:
  - `create(dto, userId, tenantId)` - Create branding profile
  - `findByUserId(userId, tenantId)` - Get agent's branding
  - `update(dto, userId, tenantId)` - Update branding
  - `uploadLogo(file, userId, tenantId)` - Upload logo
  - `uploadProfilePhoto(file, userId, tenantId)` - Upload photo

**Analytics Service (Story 10.6 - Needed):**
- File: `src/analytics/services/page-analytics.service.ts`
- Methods:
  - `trackPageView(landingPageId, metadata)` - Record view
  - `getPageAnalytics(landingPageId, dateRange)` - Get metrics
  - `getAgentAnalytics(agentId, dateRange)` - All agent pages
  - `getTopPerformingPages(tenantId, limit)` - Leaderboard
  - `getTrafficSources(landingPageId)` - UTM source breakdown
  - `getDeviceBreakdown(landingPageId)` - Mobile vs desktop
  - `getConversionFunnel(landingPageId)` - View → Lead → Conversion
  - `exportAnalytics(landingPageId, format)` - CSV export

### 3. Controllers

**Landing Pages Controller (Story 10.2 - Needed):**
- File: `src/landing-pages/landing-pages.controller.ts`
- Endpoints:
  - `POST /landing-pages` - Create page (agent role)
  - `GET /landing-pages` - List pages (agent role)
  - `GET /landing-pages/:id` - Get page details (agent role)
  - `GET /p/:slug` - Public page view (no auth)
  - `PATCH /landing-pages/:id` - Update page (agent role)
  - `PATCH /landing-pages/:id/customize` - Update branding (agent role)
  - `POST /landing-pages/:id/publish` - Publish page (agent role)
  - `POST /landing-pages/:id/archive` - Archive page (agent role)
  - `POST /landing-pages/:id/duplicate` - Duplicate page (agent role)
  - `DELETE /landing-pages/:id` - Soft delete (agent role)
  - `GET /landing-pages/:id/analytics` - Get analytics (agent role)

**Leads Controller (Story 10.5 - Needed):**
- File: `src/leads/leads.controller.ts`
- Endpoints:
  - `POST /leads` - Create lead (public, with reCAPTCHA)
  - `GET /leads` - List leads (agent/admin role)
  - `GET /leads/:id` - Get lead details (agent/admin role)
  - `PATCH /leads/:id/status` - Update status (agent/admin role)
  - `PATCH /leads/:id/assign` - Assign to agent (admin role)
  - `POST /leads/:id/contact` - Mark as contacted (agent/admin role)
  - `POST /leads/:id/convert` - Mark as converted (agent/admin role)

**Agent Branding Controller (Story 10.3 - Needed):**
- File: `src/users/controllers/agent-branding.controller.ts`
- Endpoints:
  - `GET /agent-branding` - Get own branding (agent role)
  - `PUT /agent-branding` - Update branding (agent role)
  - `POST /agent-branding/logo` - Upload logo (agent role)
  - `POST /agent-branding/photo` - Upload profile photo (agent role)

**Analytics Controller (Story 10.6 - Needed):**
- File: `src/analytics/analytics.controller.ts`
- Endpoints:
  - `GET /analytics/pages/:id` - Page analytics (agent role)
  - `GET /analytics/agent` - Agent's all pages (agent role)
  - `GET /analytics/leaderboard` - Top pages (admin role)
  - `GET /analytics/export/:id` - Export CSV (agent role)

### 4. Database Migration

**Migration File (Needed):**
- File: `src/database/migrations/TIMESTAMP-CreateLandingPagesTables.ts`
- Tables to Create:
  1. `landing_pages` (with ENUMs: template_type, landing_page_status)
  2. `leads` (with ENUMs: lead_status, lead_source)
  3. `agent_branding`
- Indexes: All from entity definitions
- Foreign Keys: landing_pages.agent_id → users.id, landing_pages.package_id → packages.id, leads.landing_page_id → landing_pages.id
- RLS Policies:
  - `landing_pages`: Tenant isolation, agent can only see own pages
  - `leads`: Tenant isolation, agent can only see own leads
  - `agent_branding`: Tenant isolation, agent can only modify own branding

### 5. Modules

**Landing Pages Module (Needed):**
- File: `src/landing-pages/landing-pages.module.ts`
- Imports: TypeOrmModule (LandingPageEntity), LeadsModule
- Providers: LandingPagesService, TemplateRendererService
- Controllers: LandingPagesController
- Exports: LandingPagesService, TemplateRendererService

**Leads Module (Needed):**
- File: `src/leads/leads.module.ts`
- Imports: TypeOrmModule (LeadEntity)
- Providers: LeadsService
- Controllers: LeadsController
- Exports: LeadsService

**Agent Branding Module (Needed):**
- File: `src/users/users.module.ts` (update existing or create separate)
- Imports: TypeOrmModule (AgentBrandingEntity)
- Providers: AgentBrandingService
- Controllers: AgentBrandingController
- Exports: AgentBrandingService

**Analytics Module (Needed):**
- File: `src/analytics/analytics.module.ts`
- Imports: TypeOrmModule, LandingPagesModule
- Providers: PageAnalyticsService
- Controllers: AnalyticsController
- Exports: PageAnalyticsService

**App Module Update (Needed):**
- Add: LandingPagesModule, LeadsModule, AnalyticsModule to imports

### 6. Additional Features

**reCAPTCHA Integration (Story 10.5):**
- Package: `@nestjs-modules/mailer` or custom implementation
- Validate on lead submission

**File Upload (Story 10.3):**
- Package: `@nestjs/platform-express` with `multer`
- Endpoints for logo and profile photo upload
- File validation (type, size)
- Storage: Local filesystem or S3

**Social Media Share URLs (Story 10.4):**
- Already implemented in TemplateRendererService
- Frontend: Share buttons component needed

**Email Notifications (Story 10.5):**
- Send to agent when new lead submitted
- Auto-reply to prospect
- Package: `@nestjs-modules/mailer`

**WebSocket Notifications (Story 10.5):**
- Real-time toast notification to agent
- Requires WebSocket module from Epic 8

### 7. Frontend Documentation

**Frontend Tasks Doc (Needed):**
- File: `docs/frontend-tasks/epic-10-landing-page-builder.md`
- Sections:
  - Landing page creation wizard (Stories 10.2)
  - Branding customizer component (Story 10.3)
  - Share buttons component (Story 10.4)
  - Lead capture form (Story 10.5)
  - Analytics dashboard (Story 10.6)
  - Public landing page renderer
  - Preview functionality

---

## Files Created (10 files, ~1,850 lines)

| Category | Files | Lines |
|----------|-------|-------|
| Domain Models | 3 | ~410 |
| TypeORM Entities | 3 | ~240 |
| Services | 1 | ~220 |
| Templates | 3 | ~570 |
| Utilities | 1 | ~5 |
| Documentation | 1 (this file) | ~405 |
| **Total** | **12** | **~1,850** |

---

## Technology Stack

**Backend:**
- NestJS 10+ (framework)
- TypeORM 0.3+ (ORM)
- Handlebars 4.7+ (template engine) - **NEW**
- PostgreSQL 14+ (database)
- class-validator (DTO validation)

**Templates:**
- Responsive CSS (no frameworks)
- Semantic HTML5
- Accessibility-first
- SEO-optimized meta tags

**Future Additions:**
- reCAPTCHA v3 (spam prevention)
- Multer (file uploads)
- Mailer (email notifications)
- Google Analytics / Plausible (client-side tracking)

---

## Next Steps

### Immediate (To Complete Epic 10):

1. **Create DTOs** (8-10 files)
   - Validation rules with class-validator
   - Swagger decorators

2. **Implement Services** (4 files)
   - Business logic
   - Database operations
   - Caching where appropriate

3. **Implement Controllers** (4 files)
   - REST API endpoints
   - Authorization guards
   - Swagger documentation

4. **Create Database Migration** (1 file)
   - 3 tables + 5 ENUMs
   - Indexes and foreign keys
   - RLS policies

5. **Create Modules** (3-4 files)
   - Wire up services and controllers
   - Update app.module.ts

6. **Frontend Documentation** (1 file)
   - Implementation guide for frontend team
   - Component specifications
   - API integration examples

7. **Testing**
   - Unit tests for services
   - E2E tests for endpoints
   - Template rendering tests

### Estimated Remaining Work:
- DTOs: 2-3 hours
- Services: 4-6 hours
- Controllers: 3-4 hours
- Migration: 2-3 hours
- Modules: 1-2 hours
- Documentation: 2-3 hours
- Testing: 4-6 hours
- **Total:** 18-27 hours

---

## Success Criteria

### ✅ Completed:
- [x] Landing page domain model with full business logic
- [x] Leads domain model with status management
- [x] Agent branding domain model with validation
- [x] Template renderer service with Handlebars
- [x] 3 responsive, SEO-optimized templates
- [x] TypeORM entities with proper indexes
- [x] Utility classes

### 🚧 In Progress:
- [ ] DTOs for all endpoints
- [ ] Service layer implementations
- [ ] Controller layer with REST APIs
- [ ] Database migration
- [ ] Module wiring
- [ ] Frontend documentation

### 📝 Planned (Not Started):
- [ ] reCAPTCHA integration
- [ ] File upload handling
- [ ] Email notifications
- [ ] WebSocket real-time notifications
- [ ] Client-side analytics (Google Analytics)
- [ ] Unit and E2E tests

---

## API Endpoints (Planned)

### Landing Pages
- `POST /api/v1/landing-pages` - Create
- `GET /api/v1/landing-pages` - List (filtered)
- `GET /api/v1/landing-pages/:id` - Details
- `GET /api/v1/p/:slug` - **Public view** (no auth)
- `PATCH /api/v1/landing-pages/:id` - Update
- `POST /api/v1/landing-pages/:id/publish` - Publish
- `POST /api/v1/landing-pages/:id/duplicate` - Duplicate
- `DELETE /api/v1/landing-pages/:id` - Delete

### Leads
- `POST /api/v1/leads` - **Public submission**
- `GET /api/v1/leads` - List (filtered)
- `GET /api/v1/leads/:id` - Details
- `PATCH /api/v1/leads/:id/status` - Update status
- `POST /api/v1/leads/:id/convert` - Mark converted

### Analytics
- `GET /api/v1/analytics/pages/:id` - Page metrics
- `GET /api/v1/analytics/agent` - Agent dashboard
- `GET /api/v1/analytics/export/:id` - CSV export

---

## Database Schema

### `landing_pages` Table
```sql
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_id UUID NOT NULL REFERENCES users(id),
  package_id UUID NOT NULL REFERENCES packages(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  template_id landing_page_template NOT NULL DEFAULT 'modern',
  customizations JSONB NOT NULL DEFAULT '{}',
  status landing_page_status NOT NULL DEFAULT 'draft',
  views_count INT NOT NULL DEFAULT 0,
  leads_count INT NOT NULL DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_landing_pages_tenant_agent ON landing_pages(tenant_id, agent_id);
CREATE INDEX idx_landing_pages_status_published ON landing_pages(status, published_at);
```

### `leads` Table
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  landing_page_id UUID REFERENCES landing_pages(id),
  agent_id UUID NOT NULL REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  preferred_departure_month VARCHAR(50),
  message TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  source lead_source NOT NULL DEFAULT 'landing_page',
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  converted_to_jamaah_id UUID,
  assigned_to_agent_id UUID,
  last_contacted_at TIMESTAMP,
  converted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_leads_tenant_agent ON leads(tenant_id, agent_id);
CREATE INDEX idx_leads_status_created ON leads(status, created_at);
CREATE INDEX idx_leads_landing_page ON leads(landing_page_id);
CREATE INDEX idx_leads_email ON leads(email);
```

### `agent_branding` Table
```sql
CREATE TABLE agent_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  profile_photo VARCHAR(500),
  logo VARCHAR(500),
  agent_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  color_scheme JSONB NOT NULL DEFAULT '{"primary":"#3B82F6","secondary":"#10B981","accent":"#F59E0B"}',
  social_media_links JSONB NOT NULL DEFAULT '{}',
  intro_text TEXT,
  intro_video_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_agent_branding_user ON agent_branding(user_id);
CREATE INDEX idx_agent_branding_tenant ON agent_branding(tenant_id);
```

---

## Usage Examples

### Creating a Landing Page

```bash
POST /api/v1/landing-pages
{
  "packageId": "uuid",
  "templateId": "modern",
  "customizations": {
    "primaryColor": "#3B82F6",
    "tagline": "Travel Umroh Terpercaya",
    "whatsappNumber": "+628123456789"
  }
}
```

### Public Page Access

```
GET /api/v1/p/ahmad-fauzi-umroh-ekonomis-9-hari

→ Renders HTML from template
→ Increments views_count
→ Tracks IP and user agent
```

### Submitting a Lead

```bash
POST /api/v1/leads
{
  "landingPageId": "uuid",
  "fullName": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890",
  "preferredDepartureMonth": "Maret 2025",
  "message": "Saya tertarik untuk mendaftar",
  "utmSource": "facebook",
  "utmMedium": "social",
  "utmCampaign": "umroh-ekonomis"
}
```

---

## Security Considerations

**Completed:**
- ✓ Slug validation (alphanumeric + hyphens only)
- ✓ Email and phone validation
- ✓ WhatsApp number formatting (E.164)
- ✓ Social media URL validation
- ✓ Hex color validation

**Pending:**
- reCAPTCHA on lead submission (spam prevention)
- Rate limiting on public endpoints
- File upload validation (type, size, malware scan)
- XSS prevention in user-generated content
- CSRF protection on forms
- Input sanitization in templates

**Database:**
- RLS policies for tenant isolation
- Soft delete for audit trail
- Indexes for performance

---

## Performance Considerations

**Completed:**
- ✓ Template caching in memory (Handlebars compiled templates)
- ✓ JSONB for flexible customizations (indexed queries)
- ✓ Database indexes on commonly queried fields

**Pending:**
- Redis caching for rendered pages (5-minute TTL)
- CDN for static assets (logo, photos)
- Image optimization on upload (resize, compress)
- Lazy loading for analytics queries
- Pagination for leads list
- Database query optimization with EXPLAIN ANALYZE

---

## Monitoring & Analytics

**Built-in Metrics (Epic 10.6):**
- Total views per landing page
- Unique visitors (by IP)
- Lead conversion rate
- Traffic sources (UTM parameters)
- Geographic distribution (by IP)
- Device types (mobile vs desktop)

**External Analytics:**
- Google Analytics 4 (client-side tracking)
- Plausible Analytics (privacy-focused alternative)
- Meta Pixel (Facebook Ads conversion tracking)

**Agent Dashboard (Story 10.6):**
- Time-series chart of views (last 30 days)
- Conversion funnel: Views → Leads → Conversions
- Top performing pages leaderboard
- Export to CSV for external analysis

---

## Known Limitations (Current Implementation)

1. **No Controllers/Services** - Only domain models and templates complete
2. **No Database Migration** - Tables not created yet
3. **No API Endpoints** - Cannot create/view pages via API
4. **No File Upload** - Logo/photo upload not implemented
5. **No Email Notifications** - Agent not notified of new leads
6. **No reCAPTCHA** - Spam prevention not implemented
7. **No Frontend** - UI components not built
8. **No Tests** - Unit/E2E tests not written

These will be addressed in the completion phase.

---

## Dependencies

**Already Installed:**
- `@nestjs/common` ✓
- `@nestjs/typeorm` ✓
- `typeorm` ✓
- `class-validator` ✓
- `class-transformer` ✓

**Needed for Full Implementation:**
```json
{
  "handlebars": "^4.7.8",
  "@nestjs-modules/mailer": "^1.10.3",
  "nodemailer": "^6.9.7",
  "@nestjs/platform-express": "^10.3.0",
  "multer": "^1.4.5-lts.1"
}
```

---

## Questions or Issues?

### Core Infrastructure:
- Domain models: `src/landing-pages/domain/`, `src/leads/domain/`, `src/users/domain/`
- Templates: `src/landing-pages/templates/`
- Service: `src/landing-pages/services/template-renderer.service.ts`

### What's Next:
Review this document and prioritize remaining implementation:
1. DTOs (quick wins)
2. Services (core business logic)
3. Controllers (API layer)
4. Migration (database setup)

---

**Epic 10 Status:** 🟡 **40% Complete** (Core Infrastructure Done, API Layer Pending)
**Files Created:** 12 files (~1,850 lines)
**Remaining:** Controllers, Services, DTOs, Migration (~20-25 files, ~2,500 lines)
**Next Epic:** Epic 11 (Operational Intelligence Dashboard)

---

_Progress updated: 2025-12-22_
