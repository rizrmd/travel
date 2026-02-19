---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/prd.md'
workflowType: 'architecture'
lastStep: 5
project_name: 'Travel Umroh'
user_name: 'Yopi'
date: '2025-12-21'
status: 'complete'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Travel Umroh requires a comprehensive SaaS B2B platform with 14 major capability areas spanning 100+ specific requirements:

- **Core Business Logic**: Multi-tenant agency management, RBAC with 6 roles, agent hierarchy (3 levels), "My Jamaah" dashboard for agent productivity, package management with dual pricing (retail/wholesale)
- **Automation & Intelligence**: AI chatbot with 3 modes (Public/Agent/Admin) and authentication-based pricing visibility, OCR document processing (Verihubs) with 98% accuracy requirement, automated commission calculation across multi-level hierarchy
- **Integration-Heavy Operations**: WhatsApp Business API (bidirectional messaging, chatbot, broadcast), Virtual Account integration (4 banks: BCA, BSI, BNI, Mandiri), SISKOPATUH regulatory reporting (Kemenag), payment auto-reconciliation
- **Agent Empowerment**: Landing page builder with agent branding, delegated access (agents act on behalf of jamaah), bulk operations for efficiency, lead capture and analytics
- **Operational Intelligence**: Real-time dashboard for agency owners (revenue, projections, agent performance, pipeline), super admin monitoring across all tenants, health metrics and anomaly detection
- **Enterprise Features**: RESTful API with OAuth 2.0, webhook support, migration tools, onboarding workflows, adoption tracking

**Non-Functional Requirements:**

Critical NFRs that will drive architectural decisions:

- **Performance**: 99.9% uptime, <200ms API response (95th percentile), <2s page load, <100ms WebSocket latency, 4.5s OCR processing per document, 500 concurrent users per agency
- **Scalability**: Support 1,036 agencies, 31,000+ agents, 3,000 jamaah/month per agency, 1M+ jamaah/year at scale, horizontal auto-scaling capability
- **Security**: AES-256 encryption at rest, TLS 1.3 in transit, Row-Level Security (RLS) with tenant_id enforcement, JWT with tenant scope, zero privilege escalation, PCI-DSS SAQ A compliance
- **Reliability**: Daily backups with 7-day retention, RPO <1 hour, RTO <4 hours, geographic redundancy (Jakarta primary, Singapore secondary), circuit breakers for third-party APIs
- **Compliance**: UU ITE, UU PDP (Indonesian data protection), SISKOPATUH 100% submission accuracy, DSN-MUI Sharia compliance, GDPR-style data portability and deletion rights
- **Operability**: Weekly release cadence, zero-downtime deployments (blue-green), automated CI/CD, <2hr MTTR for critical issues, >80% test coverage

**Scale & Complexity:**

- Primary domain: **Full-stack Multi-Tenant SaaS B2B Platform**
- Complexity level: **High/Enterprise**
- Estimated architectural components: **12-15 major components** (Auth/RBAC, Multi-tenant core, Agent management, Document/OCR service, AI chatbot service, WhatsApp integration, Payment/financial service, Package management, Landing page builder, Dashboard/analytics, Admin platform, API gateway, Background job processor)
- Timeline constraint: **3-month aggressive MVP** requiring pragmatic architectural decisions balanced with quality standards

### Technical Constraints & Dependencies

**Critical Third-Party Dependencies:**

1. **Verihubs OCR API** - 98% accuracy requirement, 4.5s processing time, batch support for 100+ documents
2. **WhatsApp Business API** - Official API (Twilio/MessageBird/Meta), 99.9% delivery rate, webhook-based bidirectional messaging
3. **Virtual Account APIs** - BCA, BSI, BNI, Mandiri (direct bank APIs), webhook callbacks for auto-reconciliation
4. **SISKOPATUH API** - Kemenag regulatory reporting, 100% submission accuracy (non-negotiable compliance requirement)

**Platform Constraints:**

- Must support Indonesian language (Bahasa Indonesia) as primary
- Must comply with Indonesian data regulations (UU ITE, UU PDP) - data residency considerations
- Must handle Sharia-compliant financial structures (Wakalah bil Ujrah)
- Must support modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile responsive web (MVP) - native apps deferred to Phase 2

**Timeline & Scope Constraints:**

- **3-month MVP timeline** - requires monolithic architecture for speed, microservices deferred
- **7 core features must ship** - Agent-assisted model, AI chatbot, OCR, WhatsApp, Payment, Sharia compliance, Landing page builder
- **Coming Soon strategy** - all menus visible day 1 with badges, prevents re-training later
- **Pilot with 10 agencies** - must support graceful onboarding, intensive support model
- **Acceptable technical debt** - manual deployment initially, basic monitoring, can automate in Month 4

### Cross-Cutting Concerns Identified

**1. Multi-Tenancy Isolation (CRITICAL)**
- Complete tenant data isolation with tenant_id RLS enforcement
- Subdomain routing (agency-slug.travelumroh.com) or custom domain (enterprise)
- Resource limits per tenant (500 concurrent users, 3,000 jamaah/month)
- Tenant-scoped JWT tokens for API authentication
- Zero cross-contamination tolerance

**2. Real-Time Synchronization**
- WebSocket infrastructure for inventory updates (prevent overbooking)
- Payment notification real-time updates
- Dashboard live refresh for operational intelligence
- <100ms latency requirement for real-time features

**3. Security & Compliance**
- Audit trails for ALL critical operations (tenant + user + timestamp + action)
- Encryption standards (AES-256 at rest, TLS 1.3 in transit)
- RBAC with 6 roles and granular permissions (wholesale pricing visibility control)
- PCI-DSS considerations (using payment gateway, no card storage)
- Indonesian data protection compliance

**4. Background Job Processing**
- OCR batch processing (100+ documents in ZIP uploads)
- Commission calculation across multi-level hierarchy
- Email/SMS notification queues
- Payment reconciliation jobs
- SISKOPATUH automated reporting
- 5-minute completion SLA for background jobs

**5. Third-Party API Resilience**
- Circuit breakers for Verihubs, WhatsApp, Payment Gateway, SISKOPATUH
- Retry logic with exponential backoff
- Graceful degradation when non-critical services fail
- Webhook reliability (auto-retry failed deliveries, 3 attempts)

**6. Observability & Monitoring**
- Error tracking (Sentry or similar)
- Performance monitoring (DataDog or similar APM)
- Health checks for auto-recovery (Kubernetes liveness probes)
- Alert on threshold breach (>1% error rate, disk >80%, CPU >85%)
- Multi-tenant monitoring for customer success interventions

**7. Scalability & Performance**
- Horizontal auto-scaling for web servers (Kubernetes)
- Database read replicas for reporting queries
- Caching layer (Redis) for packages, pricing, frequently accessed data
- CDN for static assets and document delivery
- Queue workers for heavy operations (prevent blocking)

**8. Data Management**
- Daily automated backups per tenant
- 7-day retention for point-in-time recovery
- Data portability (export all jamaah data)
- Data retention policies (7 years financial, 3 years operational)
- GDPR-style deletion capabilities

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack Multi-Tenant SaaS B2B Platform** based on project requirements analysis

### Technical Preferences Confirmed

**Backend Stack:**
- **Language**: TypeScript with Node.js (NestJS framework)
- **Database**: PostgreSQL with TypeORM
- **Deployment**: Docker + Docker Compose
- **Timeline Strategy**: 3-month aggressive MVP - prioritize core functionality first

**MVP Scope Adjustment:**
- All 3rd party integrations marked as "Coming Soon" (WhatsApp, OCR, Payment Gateway, SISKOPATUH)
- Focus on core platform: Multi-tenancy, RBAC, Agent management, Dashboard, Package management
- Integration stubs/mocks for MVP, real implementations in Phase 2

### Starter Options Considered

**Option 1: Brocoders NestJS Boilerplate** ✅ SELECTED
- Production-ready with Auth, TypeORM, PostgreSQL, Docker
- Active maintenance (2025)
- Comprehensive documentation
- I18N support for Indonesian language
- Modular architecture suitable for enterprise

**Option 2: Official NestJS CLI + Manual Setup**
- More control but slower initial setup
- Would delay MVP timeline
- Not suitable for 3-month deadline

**Option 3: Ultimate Backend (Multi-tenant CQRS)**
- Too complex for MVP (microservices, event sourcing)
- Over-engineered for current requirements
- Would significantly extend development time

### Selected Starter: Brocoders NestJS Boilerplate

**Rationale for Selection:**

1. **Speed to MVP**: Pre-configured authentication, database, Docker setup saves 2-3 weeks of foundation work
2. **Production-Ready**: Battle-tested structure with security best practices, suitable for enterprise SaaS
3. **Docker-Native**: Complete Docker Compose configuration with PostgreSQL, Adminer (DB management), MailDev (email testing)
4. **Extensibility**: Modular architecture allows easy addition of multi-tenancy, RBAC, WebSocket, Redis
5. **I18N Built-in**: Native support for Indonesian language (Bahasa Indonesia) required by project
6. **Documentation**: Comprehensive docs for quick team onboarding

**Initialization Commands:**

```bash
# Clone boilerplate
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh

# Navigate to project
cd travel-umroh/

# Copy environment configuration
cp env-example-relational .env

# Start Docker services (PostgreSQL + Adminer + MailDev)
docker compose up -d postgres adminer maildev

# Install dependencies
npm install

# Configure app (first time only)
npm run app:config

# Run database migrations
npm run migration:run

# Run database seeds
npm run seed:run:relational

# Start development server
npm run start:dev
```

**Application will be available at:**
- API: http://localhost:3000
- API Documentation (Swagger): http://localhost:3000/docs
- Adminer (DB Management): http://localhost:8080
- MailDev (Email Testing): http://localhost:1080

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- **TypeScript** with strict type checking for enterprise reliability
- **Node.js 18+** LTS version
- **NestJS 10+** framework with modular architecture
- **ESLint + Prettier** for code quality and consistency

**Database & ORM:**
- **PostgreSQL** as primary database (multi-tenant ready with RLS)
- **TypeORM** for database abstraction and migrations
- **Migration system** for version-controlled schema changes
- **Seeding support** for initial data and testing

**Authentication & Authorization:**
- **JWT-based authentication** with access and refresh tokens
- **Session management** supporting multiple devices per user
- **Password hashing** with bcrypt
- **Email verification** flow ready
- **Password reset** flow ready
- **Social login** stubs (Apple, Facebook, Google) - can be activated later
- **Role-based access** foundation (Admin, User) - will extend to 6 roles per PRD

**API Design:**
- **RESTful API** architecture
- **Swagger/OpenAPI** documentation auto-generated
- **Versioning support** for API evolution
- **Request validation** with class-validator
- **Error handling** middleware with consistent responses
- **CORS configuration** for web clients

**File Management:**
- **File upload** system with local storage (can add S3 later)
- **File entity** abstraction for attaching files to any entity
- **Multi-part form data** handling

**Internationalization:**
- **I18N (nestjs-i18n)** configured for multi-language support
- **Translation files** structure ready for Bahasa Indonesia
- **Language detection** from headers/query params

**Email System:**
- **Nodemailer** integration for transactional emails
- **Email templates** with Handlebars
- **MailDev** for local email testing (Docker)
- **Queue-ready** structure for async email sending

**Testing Infrastructure:**
- **Jest** configured for unit and E2E tests
- **Test database** separate from development
- **E2E test examples** for API endpoints
- **CI/CD** ready with GitHub Actions examples

**Development Experience:**
- **Hot reload** in development mode
- **Docker Compose** for local development environment
- **Environment variables** management (.env files)
- **Database GUI** (Adminer) included in Docker
- **API documentation** auto-updated on code changes

**Project Structure:**
```
src/
├── auth/              # Authentication module
├── database/          # Database config, migrations, seeds
├── files/             # File upload module
├── home/              # Example home module
├── mail/              # Email sending module
├── session/           # Session management
├── users/             # User management module
├── utils/             # Utility functions
└── main.ts            # Application entry point
```

**Security:**
- **Helmet** for HTTP header security
- **CSRF protection** ready
- **Rate limiting** structure ready
- **SQL injection** protection via TypeORM parameterized queries
- **XSS protection** via input validation

**Monitoring & Logging:**
- **Winston logger** integration ready
- **Request logging** middleware
- **Error tracking** structure ready for Sentry integration

### MVP Implementation Plan with Starter

**What Brocoders Provides (Week 0):**
✅ Docker environment setup
✅ PostgreSQL database with migrations
✅ Basic authentication (JWT, sessions)
✅ User management foundation
✅ API documentation (Swagger)
✅ Email system foundation
✅ Testing framework

**What We Need to Add for Travel Umroh MVP:**

**Week 1-2: Multi-Tenancy Foundation**
- Add `tenant_id` to all entities
- Implement Row-Level Security (RLS) via TypeORM
- Subdomain routing middleware (agency-slug.travelumroh.com)
- Tenant-scoped JWT tokens
- Agency onboarding module

**Week 3-4: RBAC System (6 Roles)**
- Extend auth to support 6 roles (Agency Owner, Agent, Affiliate, Admin, Jamaah, Family)
- Permission matrix implementation
- Multi-level agent hierarchy (Agent → Affiliate → Sub-Affiliate)
- Role-based data access control

**Week 5-6: Core Business Modules**
- Agent management module
- "My Jamaah" dashboard module
- Package management module (dual pricing: retail/wholesale)
- Document management module (stub for OCR - "Coming Soon")

**Week 7-8: Real-Time & Background Jobs**
- WebSocket integration (Socket.io) for real-time dashboard
- Redis integration via Docker Compose
- Bull queue for background jobs
- Commission calculation module

**Week 9-10: Dashboard & Analytics**
- Operational Intelligence dashboard for agency owners
- Agent performance analytics
- Revenue tracking and projections
- Super Admin monitoring dashboard

**Week 11-12: Polish & Pilot Launch**
- Landing page builder module (basic version)
- Migration tools for onboarding
- Integration stubs marked "Coming Soon" (WhatsApp, OCR, Payment, SISKOPATUH)
- Load testing and security audit
- 10 pilot agencies onboarding

**3rd Party Integrations (Marked "Coming Soon" in MVP):**
- 🔜 WhatsApp Business API
- 🔜 Verihubs OCR
- 🔜 Virtual Account (BCA, BSI, BNI, Mandiri)
- 🔜 SISKOPATUH (Kemenag)

These will show in UI with "Coming Soon" badges, preventing re-training when features launch in Phase 2 (Month 4-6).

### Note

**Project initialization using Brocoders NestJS Boilerplate should be the first implementation story.** The commands above establish the foundation for all subsequent development work, providing authentication, database, Docker environment, and API documentation from day one.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Multi-tenancy strategy (Shared DB with RLS)
- Frontend framework (Next.js)
- Real-time communication (Socket.IO)
- Background job processing (BullMQ with Redis)
- State management (Zustand + TanStack Query)

**Important Decisions (Shape Architecture):**
- Caching strategy (Redis with cache-manager)
- API type safety (OpenAPI → TypeScript generation)
- UI styling (Tailwind CSS + shadcn/ui)
- File storage (Local → S3 migration)
- Monitoring (Sentry + Winston)

**Deferred Decisions (Post-MVP):**
- Kubernetes deployment (Phase 2: Month 4-6)
- S3 file storage (Phase 2: Month 4-6)
- Advanced monitoring (DataDog/New Relic - Phase 2+)

### Data Architecture

**Database: PostgreSQL with TypeORM**
- **Provided by**: Brocoders NestJS Boilerplate
- **Version**: PostgreSQL 15+, TypeORM 0.3+
- **Multi-Tenancy**: Shared database with Row-Level Security (RLS)
- **Implementation**: `tenant_id` column on all entities, PostgreSQL RLS policies enforce isolation
- **Rationale**: Cost-efficient for 1,036 agencies, simpler operations, aligns with PRD requirements
- **Affects**: All data entities, authentication tokens (tenant-scoped JWT)

**Migration Strategy:**
- **Tool**: TypeORM migrations (version-controlled schema changes)
- **Workflow**: Create migration → Run migration → Commit to Git
- **Tenant Safety**: Migrations apply to shared database, RLS policies prevent cross-tenant access

**Caching Strategy: Redis with cache-manager**
- **Library**: @nestjs/cache-manager + cache-manager-redis-store
- **Shared Infrastructure**: Same Redis instance as BullMQ job queue
- **Cache Keys by Tenant**: All cache keys prefixed with `tenant:{tenantId}:`
- **TTL Strategy**:
  - Packages: 1-hour TTL, invalidate on admin update
  - Pricing (wholesale/retail): 5-minute TTL per tenant
  - Agent lists per tenant: 10-minute TTL
  - Dashboard metrics: 1-minute TTL
- **Rationale**: Meets <200ms API requirement, shared across Kubernetes pods, reduces DB load by 60-80%
- **Affects**: Package module, pricing module, agent module, dashboard module

### Authentication & Security

**Authentication: JWT with Sessions**
- **Provided by**: Brocoders NestJS Boilerplate
- **Method**: JWT access tokens + refresh tokens
- **Session Management**: Multi-device support via database sessions
- **Password Hashing**: bcrypt
- **Enhancement for Multi-Tenancy**: JWT payload includes `tenantId` for tenant-scoped authentication
- **Token Expiry**: Access token 15min, refresh token 7 days
- **Rationale**: Industry standard, supports multiple devices, session-based refresh

**Authorization: RBAC with 6 Roles**
- **Roles**: Agency Owner, Agent, Affiliate, Admin, Jamaah, Family
- **Implementation**: Custom NestJS guards extending boilerplate's role system
- **Permission Matrix**: As defined in PRD Section "SaaS B2B Requirements"
- **Multi-Level Hierarchy**: Agent → Affiliate → Sub-Affiliate with granular permissions
- **Wholesale Pricing Visibility**: Controlled by role level (Agents see, Affiliates don't)
- **Rationale**: Matches PRD requirements, extends boilerplate foundation
- **Affects**: All protected endpoints, data access patterns

**Security Middleware:**
- **Provided by Boilerplate**: Helmet (HTTP headers), CORS, rate limiting structure
- **Data Encryption**: AES-256 at rest (PostgreSQL), TLS 1.3 in transit
- **SQL Injection Protection**: TypeORM parameterized queries
- **XSS Protection**: class-validator input validation
- **Audit Trail**: All critical operations logged (tenant + user + timestamp + action)

### API & Communication Patterns

**API Design: RESTful with OpenAPI**
- **Provided by**: Brocoders NestJS Boilerplate
- **Style**: RESTful API following REST conventions
- **Documentation**: Swagger/OpenAPI auto-generated from NestJS decorators
- **Versioning**: URL-based versioning `/api/v1/`
- **Response Format**: Consistent JSON structure with `{ data, meta, error }` pattern
- **Validation**: class-validator decorators on DTOs
- **Error Handling**: Global exception filter with standardized error responses
- **Rationale**: Industry standard, supports external integrations (Phase 2+)

**API Type Safety: OpenAPI → TypeScript Generation**
- **Tool**: @hey-api/openapi-ts or openapi-typescript
- **Workflow**:
  1. Backend changes generate OpenAPI spec (automatic via Swagger)
  2. Run `npm run generate:api-types`
  3. Frontend Next.js receives updated TypeScript types
- **Compile-Time Safety**: TypeScript catches API contract breaking changes
- **Single Source of Truth**: Backend OpenAPI spec
- **Rationale**: Leverages existing Swagger, prevents frontend-backend type drift
- **Affects**: All API endpoints, frontend API clients

**Real-Time Communication: Socket.IO**
- **Library**: @nestjs/platform-socket.io + @nestjs/websockets
- **Version**: Socket.IO 4.7+
- **Tenant Isolation**: Room-based broadcasting (`socket.join(tenantId)`)
- **Use Cases**:
  - Dashboard real-time updates (inventory, payments)
  - Payment notification real-time push
  - WebSocket latency target: <100ms
- **Fallback**: Automatic fallback to long-polling if WebSocket unavailable
- **Authentication**: JWT validation on WebSocket handshake
- **Rationale**: NestJS first-class support, room-based broadcasting perfect for multi-tenancy
- **Affects**: Dashboard module, payment module, inventory module

**Background Job Processing: BullMQ with Redis**
- **Library**: @nestjs/bull + BullMQ 5.0+
- **Infrastructure**: Redis (shared with caching)
- **Monitoring**: bull-board dashboard for job visibility
- **Use Cases**:
  - OCR batch processing (queue 100+ documents from ZIP upload)
  - Commission calculation across multi-level hierarchy
  - Email/SMS notification queues
  - Payment reconciliation jobs
  - SISKOPATUH automated reporting (Phase 2)
- **Job Priorities**: High (payments), Normal (emails), Low (analytics)
- **Retry Strategy**: Exponential backoff, max 3 retries
- **SLA**: 5-minute completion for background jobs
- **Rationale**: Persistent jobs, high throughput, built-in monitoring, scales horizontally
- **Affects**: Document module, payment module, notification module

### Frontend Architecture

**Framework: Next.js 14+ with React**
- **Architecture**: Separate frontend application, communicates with NestJS via REST API
- **Rendering**: Server-Side Rendering (SSR) for initial load, Client-Side Rendering (CSR) for interactions
- **TypeScript**: End-to-end type safety with OpenAPI-generated types
- **Routing**: Next.js App Router (React Server Components ready)
- **Deployment**: Separate Docker container from backend
- **Rationale**: Complex dashboard requirements, real-time updates, PWA capability, React Native path for Phase 2
- **Affects**: All frontend modules

**State Management: Zustand + TanStack Query**
- **TanStack Query 5.0+**: Server state management
  - API data fetching, caching, background synchronization
  - Use cases: Jamaah lists, packages, agent data, analytics
  - Automatic cache invalidation and refetching
- **Zustand 4.5+**: UI state and WebSocket state
  - Real-time dashboard updates from Socket.IO
  - UI state (filters, modals, selected items)
  - Simple hooks-based API
- **TypeScript Integration**: Full type safety with OpenAPI-generated types
- **Rationale**: Best fit for API-driven app with real-time features, lightweight, TypeScript-first
- **Affects**: All dashboard components, data fetching patterns

**UI Styling: Tailwind CSS + shadcn/ui**
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **shadcn/ui**: Copy-paste accessible React components built on Radix UI
- **Component Library**: Data tables, forms, modals, charts, cards, badges
- **Customization**: Fully customizable via Tailwind config
- **Dark Mode**: Ready (can implement later)
- **Responsive**: Mobile-first approach for responsive web app
- **Rationale**: Fastest development, modern aesthetic, lightweight, perfect for SaaS dashboards
- **Affects**: All UI components, "My Jamaah" dashboard, Operational Intelligence dashboard

**Key Frontend Modules:**
- Authentication (login, signup, password reset)
- Agency Owner Dashboard (Operational Intelligence)
- Agent Dashboard ("My Jamaah" with real-time updates)
- Package Management
- Document Upload & Review
- Commission Tracking
- Landing Page Builder (basic version for MVP)

### Infrastructure & Deployment

**MVP Deployment: Docker Compose on VPS**
- **Provider**: IDCloudHost (Indonesian), Hetzner, or DigitalOcean
- **VPS Specs**: 4 vCPU, 8GB RAM, 160GB SSD (~$40/month)
- **Services via docker-compose.yaml**:
  - NestJS backend (Node.js 18+)
  - Next.js frontend
  - PostgreSQL 15+
  - Redis (for BullMQ + caching)
  - Adminer (database management UI)
  - MailDev (email testing for MVP)
- **Domain**: travelumroh.com with subdomain routing (agency-slug.travelumroh.com)
- **SSL**: Let's Encrypt (free, auto-renewal)
- **Deployment**: Manual Git pull + docker-compose restart (MVP acceptable)
- **Rationale**: Simplest, cheapest, good enough for 10 pilot agencies, existing docker-compose works
- **Phase 2 Migration**: Kubernetes when scaling to 50+ agencies (Month 4-6)

**File Storage Strategy:**
- **MVP**: Local file system with Docker volume (`/app/uploads`)
- **Phase 2**: Amazon S3 or compatible (AWS Singapore region or Indonesian cloud providers)
- **Migration Path**: File entity abstraction ready (FileEntity.path switches from local to S3 URL)
- **Backup**: Docker volume backup included in VPS backup strategy
- **Rationale**: Zero cloud costs for MVP, low volume with 10 agencies, easy S3 migration later
- **Affects**: Document upload module, file management

**Monitoring & Error Tracking:**
- **Error Tracking**: Sentry (free tier: 5K errors/month)
  - Backend: @sentry/node integration
  - Frontend: @sentry/nextjs integration
  - Source maps enabled for production debugging
  - Email alerts on critical errors
- **Logging**: Winston file-based logs
  - Structured JSON logging
  - Log rotation (daily, keep 7 days)
  - Log levels: error, warn, info, debug
- **Phase 2 Upgrade**: DataDog or New Relic APM when scaling
- **Rationale**: Free for MVP, proactive error catching, easy setup (1-2 hours)
- **Affects**: All modules (global error tracking)

**CI/CD Strategy (MVP):**
- **Acceptable Technical Debt**: Manual deployment for MVP
- **Phase 2**: GitHub Actions for automated testing + deployment
- **Testing**: Jest (provided by boilerplate) - E2E tests for critical paths
- **Code Quality**: ESLint + Prettier (provided by boilerplate)

### Decision Impact Analysis

**Implementation Sequence:**

1. **Week 0**: Project initialization with Brocoders boilerplate
2. **Week 1-2**: Multi-tenancy foundation (tenant_id RLS, subdomain routing)
3. **Week 3-4**: RBAC extension (6 roles, permission matrix)
4. **Week 5-6**: Core modules (Agent management, Package management, Document module stubs)
5. **Week 7-8**: Real-time features (Socket.IO integration, Redis + BullMQ)
6. **Week 9-10**: Frontend dashboards (Next.js with Zustand + TanStack Query + shadcn/ui)
7. **Week 11-12**: Integration stubs ("Coming Soon" badges), testing, pilot deployment

**Cross-Component Dependencies:**

- **Multi-Tenancy (tenant_id RLS)** affects: All entities, authentication (JWT), caching (cache keys), WebSocket (rooms)
- **RBAC (6 roles)** affects: All protected endpoints, data access, dashboard visibility, pricing visibility
- **Redis** shared by: BullMQ job queue, cache-manager caching
- **Socket.IO** integrates with: Zustand state management (frontend), inventory module, payment module
- **OpenAPI types** shared between: NestJS backend DTOs, Next.js frontend API clients
- **Docker Compose** orchestrates: All services (backend, frontend, PostgreSQL, Redis, Adminer, MailDev)

**Technology Stack Summary:**

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Backend Framework** | NestJS | 10+ | REST API, business logic |
| **Frontend Framework** | Next.js | 14+ | React-based web app |
| **Language** | TypeScript | 5+ | End-to-end type safety |
| **Database** | PostgreSQL | 15+ | Primary data store |
| **ORM** | TypeORM | 0.3+ | Database abstraction |
| **Caching** | Redis | 7+ | Cache + job queue |
| **Job Queue** | BullMQ | 5.0+ | Background processing |
| **Real-Time** | Socket.IO | 4.7+ | WebSocket communication |
| **State Management** | Zustand + TanStack Query | 4.5+ / 5.0+ | Frontend state |
| **UI Framework** | Tailwind CSS + shadcn/ui | 3.4+ | Styling + components |
| **Authentication** | JWT + Sessions | - | User authentication |
| **Error Tracking** | Sentry | Latest | Production monitoring |
| **Container** | Docker + Docker Compose | Latest | Containerization |
| **Deployment (MVP)** | VPS (Docker Compose) | - | Hosting |
| **Deployment (Phase 2)** | Kubernetes | 1.28+ | Auto-scaling platform |

## Implementation Patterns & Consistency Rules

### Purpose

These patterns ensure all AI agents implementing Travel Umroh write compatible, consistent code. Without these rules, different agents might make conflicting choices that break the system.

### Critical Conflict Points Identified

**8 major areas** where AI agents could make different implementation choices have been standardized below.

### Naming Patterns

**Database Naming Conventions (TypeORM Entities):**

- **Table Names**: `snake_case` plural (e.g., `travel_agencies`, `jamaah_documents`)
- **Column Names**: `camelCase` in TypeORM entities, auto-converts to `snake_case` in database
- **Primary Keys**: Always `id` (UUID v4)
- **Foreign Keys**: `{relation}Id` in entity (e.g., `agencyId`, `packageId`)
- **Tenant Column**: `tenantId` (UUID) on ALL entities (except system tables)
- **Timestamps**: `createdAt`, `updatedAt`, `deletedAt` (soft delete)
- **Junction Tables**: `{entity1}_{entity2}` (e.g., `agent_packages`)

**Example Entity:**
```typescript
@Entity('travel_agencies')
export class TravelAgency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string; // Multi-tenancy isolation

  @Column()
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string; // For subdomain routing

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**API Naming Conventions (REST):**

- **Endpoints**: `/api/v1/{resource}` (plural resources, e.g., `/api/v1/packages`)
- **Resource Names**: `kebab-case` for multi-word (e.g., `/api/v1/jamaah-documents`)
- **Route Parameters**: `:id` format (e.g., `/api/v1/packages/:id`)
- **Query Parameters**: `camelCase` (e.g., `?agencyId=123&status=active`)
- **Nested Resources**: `/api/v1/agencies/:agencyId/agents` (max 2 levels deep)
- **Actions**: Use HTTP verbs, not action names in URL
  - ✅ `PATCH /api/v1/packages/:id/publish`
  - ❌ `POST /api/v1/packages/:id/do-publish`

**Code Naming Conventions (TypeScript):**

- **Files**: `PascalCase` for classes/components (e.g., `UserService.ts`, `AgentCard.tsx`)
- **Folders**: `kebab-case` (e.g., `agent-management/`, `my-jamaah-dashboard/`)
- **Functions**: `camelCase` (e.g., `calculateCommission()`, `sendPaymentReminder()`)
- **Variables**: `camelCase` (e.g., `totalRevenue`, `agentList`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`, `DEFAULT_TTL`)
- **Interfaces**: `I` prefix (e.g., `IAgentRepository`, `IJamaahDocument`)
- **Types**: `T` prefix or descriptive (e.g., `TenantContext`, `AgentRole`)
- **Enums**: `PascalCase` (e.g., `DocumentStatus`, `PaymentStatus`)

### Structure Patterns

**NestJS Backend Module Structure:**

```
src/
├── auth/                    # Authentication module
│   ├── guards/             # Auth guards (JWT, roles)
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── modules/                 # Business modules
│   ├── agencies/
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entities/       # TypeORM entities
│   │   ├── agencies.controller.ts
│   │   ├── agencies.service.ts
│   │   ├── agencies.repository.ts
│   │   └── agencies.module.ts
│   ├── agents/
│   ├── packages/
│   └── jamaah/
├── common/                  # Shared code
│   ├── decorators/         # Custom decorators (@TenantId, @Roles)
│   ├── filters/            # Exception filters
│   ├── guards/             # Common guards (tenant isolation)
│   ├── interceptors/       # Response interceptors
│   ├── pipes/              # Validation pipes
│   └── utils/              # Utility functions
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── app.config.ts
└── main.ts
```

**Next.js Frontend Structure:**

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── my-jamaah/
│   │   ├── packages/
│   │   └── analytics/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   ├── layouts/            # Layout components
│   └── dashboards/         # Dashboard-specific
├── lib/                     # Libraries & utilities
│   ├── api/                # API client (OpenAPI-generated types)
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   ├── utils/              # Utility functions
│   └── websocket/          # Socket.IO client
├── types/                   # TypeScript types (OpenAPI-generated)
└── styles/                  # Global styles
```

**Test File Locations:**

- **Backend (NestJS)**: Co-located `*.spec.ts` files next to source
  - Example: `agencies.service.spec.ts` next to `agencies.service.ts`
- **Frontend (Next.js)**: Co-located `*.test.tsx` files next to components
  - Example: `AgentCard.test.tsx` next to `AgentCard.tsx`
- **E2E Tests**: `test/e2e/` folder at project root

### Format Patterns

**API Response Format (Standardized):**

**Success Response:**
```typescript
{
  "data": any,           // Response payload
  "meta": {
    "timestamp": string, // ISO 8601
    "requestId": string, // For tracing
    "pagination": {      // If paginated
      "page": number,
      "pageSize": number,
      "totalPages": number,
      "totalItems": number
    }
  }
}
```

**Error Response:**
```typescript
{
  "error": {
    "code": string,           // Machine-readable (e.g., "TENANT_NOT_FOUND")
    "message": string,        // Human-readable
    "details": any,           // Additional context (optional)
    "timestamp": string,      // ISO 8601
    "requestId": string,      // For tracing
    "path": string            // Request path
  }
}
```

**HTTP Status Codes (Consistent Usage):**
- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST (resource created)
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing/invalid authentication
- `403 Forbidden`: Insufficient permissions (RBAC)
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Business rule violation (e.g., duplicate email)
- `422 Unprocessable Entity`: Semantic validation errors
- `500 Internal Server Error`: Server-side errors

**Data Exchange Formats:**

- **JSON Field Naming**: `camelCase` in API (TypeScript convention)
- **Date/Time Format**: ISO 8601 strings (`2025-12-21T10:30:00Z`)
- **Currency**: Numbers in smallest unit (e.g., cents for IDR, no decimals: `12500000` = Rp 125,000.00)
- **Boolean**: `true/false` (not `1/0` or `"true"/"false"`)
- **Null Handling**: Use `null` for missing values, not empty strings
- **Arrays**: Always return arrays, even for single items (unless explicitly single resource endpoint)

### Multi-Tenancy Patterns

**Tenant Isolation (CRITICAL - Zero Cross-Contamination Tolerance):**

1. **Request Flow with Tenant Context:**
   ```typescript
   // Middleware extracts tenantId from JWT or subdomain
   // Sets in request context for all downstream code

   @Injectable()
   export class TenantMiddleware implements NestMiddleware {
     use(req: Request, res: Response, next: NextFunction) {
       const tenantId = extractTenantId(req); // From JWT or subdomain
       req['tenantId'] = tenantId;
       next();
     }
   }
   ```

2. **Repository Pattern (All Queries Tenant-Scoped):**
   ```typescript
   @Injectable()
   export class AgenciesRepository {
     async findAll(tenantId: string): Promise<Agency[]> {
       // ALWAYS filter by tenantId
       return this.agencyRepo.find({ where: { tenantId } });
     }
   }
   ```

3. **Custom Decorator for Automatic Tenant Filtering:**
   ```typescript
   // Use @TenantId() decorator to auto-inject tenantId
   @Get()
   async findAll(@TenantId() tenantId: string) {
     return this.service.findAll(tenantId);
   }
   ```

4. **PostgreSQL RLS (Row-Level Security) - Safety Net:**
   ```sql
   -- RLS policy ensures even SQL errors can't leak data
   CREATE POLICY tenant_isolation_policy ON agencies
   USING (tenant_id = current_setting('app.current_tenant')::uuid);
   ```

5. **Cache Keys Must Include Tenant:**
   ```typescript
   const cacheKey = `tenant:${tenantId}:packages:${packageId}`;
   ```

6. **WebSocket Rooms by Tenant:**
   ```typescript
   // Join tenant-specific room on connection
   socket.join(`tenant:${tenantId}`);

   // Broadcast to tenant room only
   this.server.to(`tenant:${tenantId}`).emit('payment:received', data);
   ```

### Communication Patterns

**WebSocket Event Naming (Socket.IO):**

- **Format**: `{resource}:{action}` (e.g., `payment:received`, `jamaah:document-uploaded`)
- **Tenant Isolation**: Events emitted to room `tenant:{tenantId}`
- **Event Payload Structure**:
  ```typescript
  {
    "event": string,        // Event name
    "data": any,            // Event payload
    "timestamp": string,    // ISO 8601
    "tenantId": string      // For debugging
  }
  ```

**State Management Patterns (Frontend):**

- **Zustand Store Naming**: `use{Resource}Store` (e.g., `useJamaahStore`, `useAgentStore`)
- **TanStack Query Keys**: Array format `['{resource}', params]` (e.g., `['packages', { agencyId }]`)
- **State Updates**: Immutable updates (spread operator, not direct mutation)

**Example Zustand Store:**
```typescript
export const useJamaahStore = create<JamaahStore>((set) => ({
  selectedJamaah: null,
  filters: { status: 'all' },
  setSelectedJamaah: (jamaah) => set({ selectedJamaah: jamaah }),
  updateFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
}));
```

### Error Handling Patterns

**Backend Error Handling (NestJS):**

1. **Custom Exception Filter (Global):**
   ```typescript
   @Catch()
   export class AllExceptionsFilter implements ExceptionFilter {
     catch(exception: any, host: ArgumentsHost) {
       const ctx = host.switchToHttp();
       const response = ctx.getResponse();
       const request = ctx.getRequest();

       const status = exception.getStatus?.() || 500;

       response.status(status).json({
         error: {
           code: exception.code || 'INTERNAL_ERROR',
           message: exception.message,
           timestamp: new Date().toISOString(),
           requestId: request.id,
           path: request.url,
         },
       });
     }
   }
   ```

2. **Business Logic Exceptions:**
   ```typescript
   // Use custom exceptions for business rules
   throw new BusinessRuleException('INSUFFICIENT_BALANCE', 'Insufficient balance for commission payout');
   ```

**Frontend Error Handling (Next.js):**

1. **TanStack Query Error Handling:**
   ```typescript
   const { data, error, isError } = useQuery({
     queryKey: ['packages'],
     queryFn: fetchPackages,
     onError: (error) => {
       toast.error(error.message); // User-facing toast
       logger.error(error);        // Sentry logging
     },
   });
   ```

2. **Error Boundary for React Components:**
   ```typescript
   // Use React Error Boundary for component errors
   <ErrorBoundary fallback={<ErrorFallback />}>
     <DashboardContent />
   </ErrorBoundary>
   ```

### Validation Patterns

**Backend Validation (NestJS with class-validator):**

```typescript
// DTO with validation decorators
export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  priceRetail: number;

  @IsNumber()
  @Min(0)
  @Max(function(o) { return o.priceRetail; }) // Wholesale < Retail
  priceWholesale: number;

  @IsUUID()
  tenantId: string; // Auto-injected via decorator, not from client
}
```

**Frontend Validation (React Hook Form + Zod):**

```typescript
const packageSchema = z.object({
  name: z.string().min(1, 'Name required'),
  priceRetail: z.number().min(0),
  priceWholesale: z.number().min(0),
}).refine((data) => data.priceWholesale < data.priceRetail, {
  message: 'Wholesale price must be less than retail',
  path: ['priceWholesale'],
});
```

### Loading State Patterns

**Frontend Loading States:**

- **Global Loading**: Use for full-page transitions
- **Local Loading**: Use for component-level operations
- **Skeleton Loading**: Use shadcn/ui Skeleton for data fetching
- **Button Loading States**: Disable button + show spinner during async operations

**Example:**
```typescript
const { mutate, isPending } = useMutation({
  mutationFn: createPackage,
});

return (
  <Button onClick={() => mutate(data)} disabled={isPending}>
    {isPending ? <Spinner /> : 'Create Package'}
  </Button>
);
```

### Logging Patterns

**Backend Logging (Winston):**

```typescript
logger.info('Commission calculated', {
  tenantId,
  agencyId,
  agentId,
  amount,
  timestamp: new Date().toISOString(),
});

logger.error('Payment reconciliation failed', {
  tenantId,
  paymentId,
  error: error.message,
  stack: error.stack,
});
```

**Log Levels:**
- `error`: Errors requiring attention
- `warn`: Warnings (e.g., retry attempts)
- `info`: Important business events (e.g., payments, commissions)
- `debug`: Debugging information (not in production)

### Authentication Flow Patterns

**JWT Token Structure:**

```typescript
{
  "sub": "user-uuid",           // User ID
  "tenantId": "agency-uuid",    // Tenant isolation
  "role": "agent",              // RBAC role
  "permissions": ["read:jamaah", "write:jamaah"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Frontend Auth Flow:**

1. Login → Store access token + refresh token (httpOnly cookie)
2. API calls → Include access token in `Authorization: Bearer {token}` header
3. Token expiry → Auto-refresh using refresh token
4. Logout → Clear tokens + redirect to login

### Pattern Enforcement

**Automated Enforcement:**

- **ESLint Rules**: Enforce naming conventions, import patterns
- **Prettier**: Auto-format code (2-space indent, single quotes, trailing commas)
- **Husky Git Hooks**: Pre-commit validation (lint + format)
- **TypeScript Strict Mode**: Enabled for compile-time safety

**Code Review Checklist:**

- ✅ All queries include `tenantId` filtering
- ✅ API responses use standardized format
- ✅ Error handling follows patterns
- ✅ Naming conventions followed
- ✅ Tests co-located with source
- ✅ No hardcoded values (use environment variables)

### Critical Rules Summary (AI Agent Compliance)

1. **ALWAYS filter by `tenantId`** - Zero exceptions
2. **ALWAYS use standardized API response format** - `{data, meta}` or `{error}`
3. **ALWAYS use `camelCase` for JSON fields** - Frontend/backend consistency
4. **ALWAYS use ISO 8601 for dates** - No timestamps, no custom formats
5. **ALWAYS validate tenant isolation** - Check RLS policies, cache keys, WebSocket rooms
6. **ALWAYS use TypeScript strict mode** - No `any` types without justification
7. **ALWAYS log with tenant context** - Include `tenantId` in all logs
8. **ALWAYS handle errors gracefully** - User-facing messages + Sentry logging

---

## Architecture Document Complete

This architecture document provides comprehensive guidance for implementing Travel Umroh's multi-tenant SaaS B2B platform. All AI agents working on this project must follow these decisions and patterns to ensure consistent, compatible code.

### Next Steps

**Recommended workflow progression:**

1. **Update workflow status** - Mark architecture as complete in `bmm-workflow-status.yaml`
2. **Create Epics & Stories** - Use `/bmad:bmm:workflows:create-epics-and-stories` to break down PRD into implementation tasks
3. **Sprint Planning** - Use `/bmad:bmm:workflows:sprint-planning` after epics are complete
4. **Implementation** - Begin development following this architecture

### Document Summary

- **Project Context**: Multi-tenant SaaS B2B platform for 1,036 travel agencies
- **Technology Stack**: NestJS + Next.js + PostgreSQL + Redis + Docker
- **Starter Template**: Brocoders NestJS Boilerplate (Docker-ready)
- **Timeline**: 3-month aggressive MVP for 10 pilot agencies
- **Core Decisions**: 11 architectural decisions documented
- **Implementation Patterns**: 8 consistency rule categories defined
- **Phase 2 Migration**: Kubernetes + S3 + Advanced monitoring (Month 4-6)

---

## Epic 16: Customizable Production Pipeline - Database Schema

### Pipeline Management Tables

```sql
-- Global pipeline stage library (platform-level)
CREATE TABLE global_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,  -- e.g., 'document-ktp', 'visa-application'
  category VARCHAR(50) NOT NULL,      -- document, government, travel, logistics, custom
  name VARCHAR(200) NOT NULL,
  description TEXT,
  default_sla_hours INT NOT NULL,
  default_responsible_role VARCHAR(100),
  icon VARCHAR(50),                   -- Icon name for UI
  color VARCHAR(50),                  -- Color for UI
  is_core BOOLEAN DEFAULT FALSE,      -- Cannot be deleted if true
  is_optional BOOLEAN DEFAULT TRUE,   -- Can agencies skip this stage?
  config_fields JSONB,                -- Custom configuration schema
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,               -- Soft delete
  
  INDEX idx_stage_category (category),
  INDEX idx_stage_deleted (deleted_at)
);

-- Tenant-specific pipeline configuration
CREATE TABLE tenant_pipeline_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Configured stages as JSONB array
  stages JSONB NOT NULL,              -- [{stageId, order, enabled, customSLA, role, config, conditions}]
  
  -- Stage dependencies
  dependencies JSONB,                 -- [{stageId, dependsOn: [stageIds]}]
  
  -- Automation rules
  automations JSONB,                  -- [{stageId, trigger, action, config}]
  
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tenant_id, version),
  INDEX idx_tenant_pipeline_active (tenant_id, is_active)
);

-- Pipeline configuration version history
CREATE TABLE tenant_pipeline_config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  config_id UUID REFERENCES tenant_pipeline_configs(id) ON DELETE CASCADE,
  version INT NOT NULL,
  config_snapshot JSONB NOT NULL,     -- Full config at this version
  change_summary TEXT,                -- What changed
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_history_tenant (tenant_id, version)
);

-- Runtime: Jamaah pipeline tracking
CREATE TABLE jamaah_pipeline_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jamaah_id UUID REFERENCES jamaah(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  pipeline_config_id UUID REFERENCES tenant_pipeline_configs(id),
  pipeline_version INT NOT NULL,      -- Lock to config version
  
  current_stage_id VARCHAR(100),      -- Current stage code
  current_stage_status VARCHAR(50),   -- on-track, at-risk, delayed, blocked, completed
  overall_progress DECIMAL(5,2),      -- 0-100%
  
  -- Stage instances as JSONB array
  stage_instances JSONB NOT NULL,     -- [{stageId, status, assignedTo, startedAt, completedAt, slaDeadline, data, blockers, notes}]
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_jamaah_pipeline (jamaah_id),
  INDEX idx_pipeline_stage_status (tenant_id, current_stage_id, current_stage_status),
  INDEX idx_pipeline_departure (tenant_id, created_at)
);

-- Pipeline stage history (audit trail)
CREATE TABLE pipeline_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jamaah_pipeline_id UUID REFERENCES jamaah_pipeline_status(id) ON DELETE CASCADE,
  jamaah_id UUID REFERENCES jamaah(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  stage_id VARCHAR(100) NOT NULL,
  stage_name VARCHAR(200),
  status VARCHAR(50),                 -- pending, in-progress, completed, skipped, failed
  assigned_to UUID REFERENCES users(id),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  sla_deadline TIMESTAMP,
  is_overdue BOOLEAN,
  days_overdue INT,
  
  -- Stage-specific data
  data JSONB,                         -- Data collected during this stage
  
  -- Blockers
  blockers JSONB,                     -- [{reason, createdAt, createdBy, resolved, resolvedAt}]
  
  -- Notes and comments
  notes JSONB,                        -- [{text, createdAt, createdBy}]
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_stage_history_jamaah (jamaah_id, stage_id),
  INDEX idx_stage_history_tenant_stage (tenant_id, stage_id)
);

-- Reminder logs (track sent reminders)
CREATE TABLE reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  jamaah_id UUID REFERENCES jamaah(id) ON DELETE CASCADE,
  stage_id VARCHAR(100),
  
  reminder_type VARCHAR(50),          -- admin-urgent, agent-missing-doc, jamaah-reminder
  recipient_type VARCHAR(50),         -- admin, agent, jamaah
  recipient_id UUID REFERENCES users(id),
  
  channel VARCHAR(50),                -- email, whatsapp, in-app
  message_template VARCHAR(100),
  message_content TEXT,
  
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered BOOLEAN,
  delivered_at TIMESTAMP,
  
  INDEX idx_reminder_jamaah (jamaah_id),
  INDEX idx_reminder_sent (sent_at)
);

-- Pipeline analytics cache (for performance)
CREATE TABLE pipeline_analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  cache_key VARCHAR(200) UNIQUE NOT NULL,  -- e.g., 'bottlenecks-2024-12-25', 'stage-metrics-visa'
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_analytics_cache_key (cache_key),
  INDEX idx_analytics_cache_expires (expires_at)
);

-- Pipeline templates library
CREATE TABLE pipeline_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),               -- budget, standard, premium, corporate
  config JSONB NOT NULL,              -- Template configuration
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_template_category (category)
);
```

### Key Architectural Decisions for Pipeline System

**1. JSONB for Stage Configuration:**
- **Decision:** Store stages, dependencies, and automations as JSONB in `tenant_pipeline_configs`
- **Rationale:** Each agency has different pipeline needs. JSONB allows flexible schema without table alterations
- **Trade-off:** Harder to query specific stage configs, but acceptable given low query frequency (config read on jamaah creation)

**2. Version Locking:**
- **Decision:** Lock jamaah to pipeline config version at creation time
- **Rationale:** Prevents retroactive changes to in-progress jamaah when admin modifies pipeline
- **Trade-off:** Multiple versions active simultaneously, but ensures data consistency

**3. Three-Layer Architecture:**
- **Decision:** Global library (platform) → Tenant config → Runtime tracking
- **Rationale:** Reusability (global stages), flexibility (tenant custom), isolation (runtime per jamaah)
- **Trade-off:** More complex, but highly scalable and maintainable

**4. Bottleneck Detection Algorithm:**
- **Decision:** Calculate SLA variance and jamaah count per stage, cache results
- **Rationale:** Real-time bottleneck detection enables proactive management
- **Implementation:** Daily cron job + on-demand refresh, Redis cache for 1-hour TTL

**5. Reminder Throttling:**
- **Decision:** Track sent reminders, max 1 per task per day
- **Rationale:** Prevent spam, maintain professional communication
- **Implementation:** Check `reminder_logs` before sending, enforce quiet hours (10 PM - 8 AM)

