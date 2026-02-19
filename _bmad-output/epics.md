---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/prd.md'
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md'
totalEpics: 15
totalStories: 89
---

# Travel Umroh - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Travel Umroh, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. Multi-Tenant Agency Management**
- FR-1.1: System SHALL support complete tenant isolation per travel agency
- FR-1.2: System SHALL provision new agencies within 24 hours with automated onboarding
- FR-1.3: System SHALL support agency-specific subdomain (agency-slug.travelumroh.com)
- FR-1.4: System SHALL support custom domain mapping for Enterprise tier
- FR-1.5: System SHALL enforce tenant resource limits (500 concurrent users, 3,000 jamaah/month)

**2. Role-Based Access Control**
- FR-2.1: System SHALL implement 6 distinct roles (Agency Owner, Agent, Affiliate, Admin, Jamaah, Family)
- FR-2.2: System SHALL enforce role-based permissions per RBAC matrix
- FR-2.3: System SHALL support multi-level agent hierarchy (Agent → Affiliate → Sub-Affiliate)
- FR-2.4: System SHALL restrict wholesale pricing visibility based on role level
- FR-2.5: System SHALL provide granular data access control (agents see only assigned jamaah)

**3. Agent Management & "My Jamaah" Dashboard**
- FR-3.1: Agents SHALL view all assigned jamaah in single dashboard view
- FR-3.2: System SHALL display status indicators (red/yellow/green) for documents, payments, approvals
- FR-3.3: Agents SHALL filter jamaah by status ("Dokumen kurang", "Cicilan telat", "Ready to depart")
- FR-3.4: Agents SHALL perform bulk operations (select multiple → send reminders in one action)
- FR-3.5: System SHALL provide audit trail showing "Document uploaded by Agent X on behalf of Jamaah Y"
- FR-3.6: Agents SHALL delegate access to upload/manage documents for assigned jamaah
- FR-3.7: System SHALL support hybrid mode (both agent-assisted and self-service)

**4. Document Management & OCR**
- FR-4.1: System SHALL integrate Verihubs OCR API for document processing
- FR-4.2: System SHALL support KTP, Passport, Kartu Keluarga, Vaksin certificate extraction
- FR-4.3: System SHALL achieve 98% OCR accuracy or notify for manual review
- FR-4.4: System SHALL process single document in <4.5 seconds average
- FR-4.5: System SHALL support ZIP batch upload of 100+ documents
- FR-4.6: System SHALL queue batch processing jobs and notify upon completion
- FR-4.7: Admin SHALL review OCR-extracted data before approval
- FR-4.8: Admin SHALL correct OCR errors and save corrected data
- FR-4.9: System SHALL provide bulk approval (select 50 documents → approve all)
- FR-4.10: System SHALL auto-organize documents by jamaah with search/filter

**5. AI Chatbot Multi-Mode**
- FR-5.1: System SHALL implement NLP-powered chatbot with multi-mode (Public/Agent/Admin)
- FR-5.2: Chatbot SHALL respond to Public mode with retail pricing only
- FR-5.3: Chatbot SHALL respond to Agent mode with wholesale pricing + commission info
- FR-5.4: Chatbot SHALL respond to Admin mode with internal operations support
- FR-5.5: Chatbot SHALL achieve 80% query deflection rate
- FR-5.6: Chatbot SHALL respond within <2 seconds average
- FR-5.7: Chatbot SHALL auto-sync knowledge when admin updates packages
- FR-5.8: Chatbot SHALL auto-broadcast updates to authenticated agents via WhatsApp
- FR-5.9: Chatbot SHALL escalate complex queries with full context
- FR-5.10: Chatbot SHALL maintain 90% accuracy rate

**6. WhatsApp Business Integration**
- FR-6.1: System SHALL integrate WhatsApp Business API
- FR-6.2: System SHALL enable bidirectional messaging
- FR-6.3: Chatbot SHALL respond to WhatsApp messages directly
- FR-6.4: System SHALL support broadcast messaging to agent groups
- FR-6.5: System SHALL send rich media (images, PDFs, itineraries)
- FR-6.6: System SHALL use template messages for payment reminders
- FR-6.7: System SHALL sync WhatsApp messages to platform history
- FR-6.8: System SHALL achieve 99.9% message delivery rate

**7. Payment Gateway & Financial Operations**
- FR-7.1: System SHALL integrate Virtual Account for BCA, BSI, BNI, Mandiri
- FR-7.2: System SHALL auto-reconcile payments when received
- FR-7.3: System SHALL track installments with due dates
- FR-7.4: System SHALL send payment reminders 3 days before due date
- FR-7.5: System SHALL calculate agent commission based on payments
- FR-7.6: System SHALL calculate multi-level commission splits
- FR-7.7: System SHALL support batch payment to 200+ agents
- FR-7.8: System SHALL maintain payment history with full audit trail
- FR-7.9: System SHALL achieve 99.5%+ auto-reconciliation accuracy

**8. Package Management**
- FR-8.1: Agency owners SHALL create, edit, delete umroh packages
- FR-8.2: System SHALL support itinerary builder for package details
- FR-8.3: System SHALL support dual pricing (retail/wholesale)
- FR-8.4: System SHALL support inclusions/exclusions documentation
- FR-8.5: System SHALL auto-broadcast package updates to agents
- FR-8.6: System SHALL version package changes for audit trail
- FR-8.7: Agents SHALL view assigned packages (view-only)

**9. Landing Page Builder**
- FR-9.1: Agents SHALL select package and auto-generate landing page
- FR-9.2: System SHALL support agent branding (name, photo, contact)
- FR-9.3: Landing page SHALL include prominent WhatsApp CTA button
- FR-9.4: Landing page SHALL display package details
- FR-9.5: Agents SHALL share to Facebook, Instagram, WhatsApp Status
- FR-9.6: Landing page SHALL capture leads via inquiry form
- FR-9.7: System SHALL auto-notify agent when lead submits inquiry
- FR-9.8: System SHALL track analytics (views, clicks, conversions)
- FR-9.9: Agent SHALL customize landing page design

**10. Operational Intelligence Dashboard**
- FR-10.1: Agency owners SHALL view real-time total revenue
- FR-10.2: Agency owners SHALL view 3-month revenue projection
- FR-10.3: Agency owners SHALL view pipeline potential
- FR-10.4: Agency owners SHALL view agent performance analytics
- FR-10.5: Agency owners SHALL view top performer leaderboard
- FR-10.6: Agency owners SHALL view jamaah pipeline by status
- FR-10.7: Agency owners SHALL filter/search all data
- FR-10.8: Dashboard SHALL refresh in real-time via WebSocket

**11. Sharia Compliance & Regulatory**
- FR-11.1: System SHALL implement Wakalah bil Ujrah contract structure
- FR-11.2: System SHALL support digital akad with e-signature
- FR-11.3: System SHALL integrate SISKOPATUH API for regulatory reporting
- FR-11.4: System SHALL automate jamaah data submission
- FR-11.5: System SHALL achieve 100% submission accuracy
- FR-11.6: System SHALL display compliance dashboard
- FR-11.7: System SHALL maintain full transaction audit trail
- FR-11.8: System SHALL log all critical operations

**12. Onboarding & Migration**
- FR-12.1: System SHALL support CSV import for batch migration
- FR-12.2: System SHALL provide migration workflows with progress tracking
- FR-12.3: System SHALL complete agency migration within 7 days
- FR-12.4: System SHALL provide training materials
- FR-12.5: System SHALL track adoption analytics
- FR-12.6: System SHALL support one-on-one training escalation

**13. Super Admin Platform**
- FR-13.1: Super Admin SHALL monitor health metrics per agency
- FR-13.2: System SHALL alert on anomaly detection
- FR-13.3: Super Admin SHALL run account diagnostics
- FR-13.4: Super Admin SHALL unlock feature trials
- FR-13.5: Super Admin SHALL track customer success interventions

**14. API & Webhook Support**
- FR-14.1: System SHALL provide RESTful API with OAuth 2.0
- FR-14.2: System SHALL expose endpoints for jamaah, payments, packages
- FR-14.3: System SHALL support webhook events
- FR-14.4: System SHALL enforce rate limiting (1,000 requests/hour)
- FR-14.5: System SHALL provide API documentation
- FR-14.6: System SHALL provide developer portal
- FR-14.7: System SHALL provide sandbox environment

### Non-Functional Requirements

**Performance Requirements**
- NFR-1.1: System SHALL achieve 99.9% uptime
- NFR-1.2: API responses SHALL complete in <200ms for 95% of requests
- NFR-1.3: Page load time SHALL be <2 seconds
- NFR-1.4: WebSocket latency SHALL be <100ms
- NFR-1.5: System SHALL support 500 concurrent users per agency
- NFR-1.6: OCR processing SHALL complete in 4.5 seconds average
- NFR-1.7: AI Chatbot SHALL respond in <2 seconds
- NFR-1.8: Background jobs SHALL complete within 5 minutes

**Scalability Requirements**
- NFR-2.1: System SHALL support 1,036 travel agencies
- NFR-2.2: System SHALL handle 3,000 jamaah/month per agency
- NFR-2.3: System SHALL support 31,000+ total agents
- NFR-2.4: System SHALL process 1M+ jamaah/year at scale
- NFR-2.5: Database SHALL perform with <200ms query time for 1M+ records
- NFR-2.6: System SHALL support horizontal scaling
- NFR-2.7: System SHALL support database read replicas
- NFR-2.8: System SHALL cache frequently accessed data with Redis
- NFR-2.9: System SHALL handle batch operations

**Security Requirements**
- NFR-3.1: System SHALL encrypt data at rest using AES-256
- NFR-3.2: System SHALL encrypt data in transit using TLS 1.3
- NFR-3.3: System SHALL enforce Row-Level Security with tenant_id
- NFR-3.4: System SHALL use JWT tokens with tenant scope
- NFR-3.5: System SHALL implement rate limiting per tenant
- NFR-3.6: System SHALL log all critical operations
- NFR-3.7: System SHALL enforce zero privilege escalation
- NFR-3.8: System SHALL achieve PCI-DSS SAQ A compliance
- NFR-3.9: System SHALL pass penetration testing
- NFR-3.10: System SHALL enforce password complexity

**Reliability Requirements**
- NFR-4.1: System SHALL maintain daily automated backups per tenant
- NFR-4.2: System SHALL retain 7-day backup history
- NFR-4.3: System SHALL achieve RPO <1 hour
- NFR-4.4: System SHALL achieve RTO <4 hours
- NFR-4.5: System SHALL implement geographic redundancy
- NFR-4.6: System SHALL auto-retry failed webhook deliveries
- NFR-4.7: System SHALL implement circuit breakers for third-party APIs
- NFR-4.8: System SHALL gracefully degrade when non-critical services fail

**Availability Requirements**
- NFR-5.1: System SHALL achieve 99.9% uptime SLA
- NFR-5.2: System SHALL complete deployments with zero downtime
- NFR-5.3: System SHALL support rolling updates
- NFR-5.4: System SHALL implement health checks for auto-recovery
- NFR-5.5: System SHALL monitor error rates and auto-alert

**Compliance Requirements**
- NFR-6.1: System SHALL comply with UU ITE
- NFR-6.2: System SHALL comply with UU PDP
- NFR-6.3: System SHALL support data portability
- NFR-6.4: System SHALL support right to deletion
- NFR-6.5: System SHALL maintain data retention policies
- NFR-6.6: System SHALL achieve 100% SISKOPATUH submission accuracy
- NFR-6.7: System SHALL implement consent management

**Usability Requirements**
- NFR-7.1: System SHALL support Indonesian language as primary
- NFR-7.2: System SHALL be responsive across desktop, tablet, mobile
- NFR-7.3: System SHALL support modern browsers
- NFR-7.4: Agent training completion rate SHALL be >95% within 7 days
- NFR-7.5: System SHALL provide contextual help/tooltips
- NFR-7.6: Error messages SHALL be clear, actionable, in Indonesian
- NFR-7.7: System SHALL support keyboard shortcuts

**Maintainability Requirements**
- NFR-8.1: System SHALL implement automated testing with >80% coverage
- NFR-8.2: System SHALL support automated database migrations
- NFR-8.3: System SHALL implement feature flags
- NFR-8.4: System SHALL maintain API versioning
- NFR-8.5: System SHALL implement structured logging
- NFR-8.6: System SHALL monitor error tracking with Sentry
- NFR-8.7: System SHALL monitor performance with DataDog
- NFR-8.8: Bug density SHALL be <1 critical bug per 1,000 LOC

**Operability Requirements**
- NFR-9.1: System SHALL support weekly release cadence
- NFR-9.2: System SHALL implement automated CI/CD pipelines
- NFR-9.3: System SHALL provide admin dashboard for monitoring
- NFR-9.4: System SHALL alert on critical threshold breaches
- NFR-9.5: System SHALL provide metrics dashboard
- NFR-9.6: Mean Time to Recovery SHALL be <2 hours

### Additional Requirements

**From Architecture Document:**

1. **Starter Template (CRITICAL - Must be Epic 1, Story 1):**
   - Project initialization using **Brocoders NestJS Boilerplate**
   - Clone repository: `git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh`
   - Provides foundation: PostgreSQL, TypeORM, JWT authentication, Docker Compose, Swagger, I18N
   - Commands documented in Architecture document

2. **Infrastructure Setup:**
   - Docker Compose with services: NestJS backend, PostgreSQL, Redis, Adminer, MailDev
   - VPS deployment (IDCloudHost/Hetzner/DigitalOcean): 4 vCPU, 8GB RAM
   - Domain: travelumroh.com with subdomain routing
   - SSL via Let's Encrypt

3. **Technology Stack Implementation:**
   - Frontend: Next.js 14+ with React (separate Docker container)
   - State Management: Zustand + TanStack Query
   - UI Styling: Tailwind CSS + shadcn/ui
   - Real-Time: Socket.IO 4.7+ with room-based tenant isolation
   - Background Jobs: BullMQ 5.0+ with Redis
   - Caching: Redis with cache-manager (tenant-scoped keys)
   - Monitoring: Sentry + Winston logs

4. **Multi-Tenancy Implementation:**
   - tenant_id column on ALL entities
   - PostgreSQL Row-Level Security (RLS) policies
   - Tenant-scoped JWT tokens
   - Cache keys prefixed with `tenant:{tenantId}:`
   - WebSocket rooms: `tenant:{tenantId}`

5. **Implementation Patterns:**
   - API Response Format: `{ data, meta }` or `{ error }`
   - Naming: camelCase for JSON fields, snake_case for DB tables
   - Date Format: ISO 8601 strings only
   - Testing: Jest with co-located test files
   - TypeScript strict mode enabled

6. **3rd Party Integrations (Marked "Coming Soon" for MVP):**
   - WhatsApp Business API → Show "Coming Soon" badge
   - Verihubs OCR → Show "Coming Soon" badge
   - Virtual Account (4 banks) → Show "Coming Soon" badge
   - SISKOPATUH → Show "Coming Soon" badge

7. **12-Week Implementation Timeline:**
   - Week 0: Brocoders boilerplate initialization
   - Week 1-2: Multi-tenancy foundation
   - Week 3-4: RBAC system (6 roles)
   - Week 5-6: Core modules (Agent, Package, Document stubs)
   - Week 7-8: Real-time features (Socket.IO, Redis, BullMQ)
   - Week 9-10: Frontend dashboards (Next.js)
   - Week 11-12: Integration stubs + testing + pilot deployment

### FR Coverage Map

**Multi-Tenant Agency Management:**
- FR-1.1: Epic 2 - Complete tenant isolation per travel agency
- FR-1.2: Epic 2 - Provision new agencies within 24 hours with automated onboarding
- FR-1.3: Epic 2 - Agency-specific subdomain (agency-slug.travelumroh.com)
- FR-1.4: Epic 2 - Custom domain mapping for Enterprise tier
- FR-1.5: Epic 2 - Enforce tenant resource limits

**Role-Based Access Control:**
- FR-2.1: Epic 3 - Implement 6 distinct roles
- FR-2.2: Epic 3 - Enforce role-based permissions per RBAC matrix
- FR-2.3: Epic 3 - Support multi-level agent hierarchy
- FR-2.4: Epic 3 - Restrict wholesale pricing visibility based on role level
- FR-2.5: Epic 3 - Provide granular data access control

**Agent Management & "My Jamaah" Dashboard:**
- FR-3.1: Epic 5 - Agents view all assigned jamaah in single dashboard view
- FR-3.2: Epic 5 - Display status indicators (red/yellow/green) for documents, payments, approvals
- FR-3.3: Epic 5 - Filter jamaah by status
- FR-3.4: Epic 5 - Perform bulk operations
- FR-3.5: Epic 5 - Provide audit trail showing agent actions
- FR-3.6: Epic 5 - Delegate access to upload/manage documents
- FR-3.7: Epic 5 - Support hybrid mode (agent-assisted and self-service)

**Document Management & OCR:**
- FR-4.1: Epic 6 - Integrate Verihubs OCR API (Coming Soon for MVP)
- FR-4.2: Epic 6 - Support KTP, Passport, KK, Vaksin certificate extraction
- FR-4.3: Epic 6 - Achieve 98% OCR accuracy or notify for manual review
- FR-4.4: Epic 6 - Process single document in <4.5 seconds average
- FR-4.5: Epic 6 - Support ZIP batch upload of 100+ documents
- FR-4.6: Epic 6 - Queue batch processing jobs
- FR-4.7: Epic 6 - Admin review OCR-extracted data before approval
- FR-4.8: Epic 6 - Admin correct OCR errors
- FR-4.9: Epic 6 - Provide bulk approval
- FR-4.10: Epic 6 - Auto-organize documents by jamaah with search/filter

**AI Chatbot Multi-Mode:**
- FR-5.1: Epic 9 - Implement NLP-powered chatbot (Coming Soon for MVP)
- FR-5.2: Epic 9 - Respond to Public mode with retail pricing only
- FR-5.3: Epic 9 - Respond to Agent mode with wholesale pricing + commission info
- FR-5.4: Epic 9 - Respond to Admin mode with internal operations support
- FR-5.5: Epic 9 - Achieve 80% query deflection rate
- FR-5.6: Epic 9 - Respond within <2 seconds average
- FR-5.7: Epic 9 - Auto-sync knowledge when admin updates packages
- FR-5.8: Epic 9 - Auto-broadcast updates to agents via WhatsApp
- FR-5.9: Epic 9 - Escalate complex queries with full context
- FR-5.10: Epic 9 - Maintain 90% accuracy rate

**WhatsApp Business Integration:**
- FR-6.1: Epic 9 - Integrate WhatsApp Business API (Coming Soon for MVP)
- FR-6.2: Epic 9 - Enable bidirectional messaging
- FR-6.3: Epic 9 - Chatbot respond to WhatsApp messages directly
- FR-6.4: Epic 9 - Support broadcast messaging to agent groups
- FR-6.5: Epic 9 - Send rich media (images, PDFs, itineraries)
- FR-6.6: Epic 9 - Use template messages for payment reminders
- FR-6.7: Epic 9 - Sync WhatsApp messages to platform history
- FR-6.8: Epic 9 - Achieve 99.9% message delivery rate

**Payment Gateway & Financial Operations:**
- FR-7.1: Epic 7 - Integrate Virtual Account for 4 banks (Coming Soon for MVP)
- FR-7.2: Epic 7 - Auto-reconcile payments when received
- FR-7.3: Epic 7 - Track installments with due dates
- FR-7.4: Epic 7 - Send payment reminders 3 days before due date
- FR-7.5: Epic 7 - Calculate agent commission based on payments
- FR-7.6: Epic 7 - Calculate multi-level commission splits
- FR-7.7: Epic 7 - Support batch payment to 200+ agents
- FR-7.8: Epic 7 - Maintain payment history with full audit trail
- FR-7.9: Epic 7 - Achieve 99.5%+ auto-reconciliation accuracy

**Package Management:**
- FR-8.1: Epic 4 - Create, edit, delete umroh packages
- FR-8.2: Epic 4 - Support itinerary builder for package details
- FR-8.3: Epic 4 - Support dual pricing (retail/wholesale)
- FR-8.4: Epic 4 - Support inclusions/exclusions documentation
- FR-8.5: Epic 4 - Auto-broadcast package updates to agents
- FR-8.6: Epic 4 - Version package changes for audit trail
- FR-8.7: Epic 4 - Agents view assigned packages (view-only)

**Landing Page Builder:**
- FR-9.1: Epic 10 - Select package and auto-generate landing page
- FR-9.2: Epic 10 - Support agent branding (name, photo, contact)
- FR-9.3: Epic 10 - Include prominent WhatsApp CTA button
- FR-9.4: Epic 10 - Display package details
- FR-9.5: Epic 10 - Share to Facebook, Instagram, WhatsApp Status
- FR-9.6: Epic 10 - Capture leads via inquiry form
- FR-9.7: Epic 10 - Auto-notify agent when lead submits inquiry
- FR-9.8: Epic 10 - Track analytics (views, clicks, conversions)
- FR-9.9: Epic 10 - Customize landing page design

**Operational Intelligence Dashboard:**
- FR-10.1: Epic 11 - View real-time total revenue
- FR-10.2: Epic 11 - View 3-month revenue projection
- FR-10.3: Epic 11 - View pipeline potential
- FR-10.4: Epic 11 - View agent performance analytics
- FR-10.5: Epic 11 - View top performer leaderboard
- FR-10.6: Epic 11 - View jamaah pipeline by status
- FR-10.7: Epic 11 - Filter/search all data
- FR-10.8: Epic 11 - Dashboard refresh in real-time via WebSocket

**Sharia Compliance & Regulatory:**
- FR-11.1: Epic 12 - Implement Wakalah bil Ujrah contract structure
- FR-11.2: Epic 12 - Support digital akad with e-signature
- FR-11.3: Epic 12 - Integrate SISKOPATUH API (Coming Soon for MVP)
- FR-11.4: Epic 12 - Automate jamaah data submission
- FR-11.5: Epic 12 - Achieve 100% submission accuracy
- FR-11.6: Epic 12 - Display compliance dashboard
- FR-11.7: Epic 12 - Maintain full transaction audit trail
- FR-11.8: Epic 12 - Log all critical operations

**Onboarding & Migration:**
- FR-12.1: Epic 13 - Support CSV import for batch migration
- FR-12.2: Epic 13 - Provide migration workflows with progress tracking
- FR-12.3: Epic 13 - Complete agency migration within 7 days
- FR-12.4: Epic 13 - Provide training materials
- FR-12.5: Epic 13 - Track adoption analytics
- FR-12.6: Epic 13 - Support one-on-one training escalation

**Super Admin Platform:**
- FR-13.1: Epic 14 - Monitor health metrics per agency
- FR-13.2: Epic 14 - Alert on anomaly detection
- FR-13.3: Epic 14 - Run account diagnostics
- FR-13.4: Epic 14 - Unlock feature trials
- FR-13.5: Epic 14 - Track customer success interventions

**API & Webhook Support:**
- FR-14.1: Epic 15 - Provide RESTful API with OAuth 2.0
- FR-14.2: Epic 15 - Expose endpoints for jamaah, payments, packages
- FR-14.3: Epic 15 - Support webhook events
- FR-14.4: Epic 15 - Enforce rate limiting (1,000 requests/hour)
- FR-14.5: Epic 15 - Provide API documentation
- FR-14.6: Epic 15 - Provide developer portal
- FR-14.7: Epic 15 - Provide sandbox environment

**Additional Requirements Coverage:**
- Additional Req #1: Epic 1 - Brocoders NestJS Boilerplate initialization
- Additional Req #2: Epic 1 - Infrastructure Setup (Docker Compose)
- Additional Req #3: Epic 8 - Technology Stack (Socket.IO, BullMQ, Redis, Sentry)
- Additional Req #4: Epic 2 - Multi-Tenancy Implementation (tenant_id, RLS, JWT)
- Additional Req #5: Epic 1 - Implementation Patterns (API response format, naming)
- Additional Req #6: Epics 6, 7, 9, 12 - "Coming Soon" badges for 3rd party integrations
- Additional Req #7: All Epics - 12-Week Implementation Timeline

**Non-Functional Requirements:**
All NFRs (Performance, Scalability, Security, Reliability, Availability, Compliance, Usability, Maintainability, Operability) are cross-cutting concerns that apply to all epics.

## Epic List

### Epic 1: Project Foundation & Development Environment

**User Outcome:** Development team has a production-ready NestJS foundation with authentication, database, Docker infrastructure, and development tools configured.

**What Users Can Accomplish:**
- Developers can clone and initialize the project using Brocoders NestJS Boilerplate
- Developers can run the application locally with PostgreSQL, Redis, and supporting services via Docker Compose
- Developers have pre-configured JWT authentication, Swagger API documentation, and I18N support
- Development environment follows consistent patterns for API responses, naming conventions, and TypeScript strict mode

**FRs Covered:** Additional Requirements #1 (Brocoders NestJS Boilerplate), #2 (Infrastructure Setup), #5 (Implementation Patterns)

**NFRs Addressed:**
- NFR-8.2: Automated database migrations (TypeORM)
- NFR-8.5: Structured logging foundation
- NFR-9.2: CI/CD pipeline foundation

**Implementation Notes:**
- **CRITICAL:** Must be Epic 1, Story 1 per Architecture requirement
- Initializes: `git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh`
- Provides foundation: PostgreSQL 15+, TypeORM 0.3+, JWT authentication, Docker Compose, Swagger, I18N
- Week 0 of 12-week timeline
- All subsequent epics build upon this foundation

**Dependencies:** None (foundational epic)

---

### Epic 2: Multi-Tenant Agency Management

**User Outcome:** Agency owners can provision their travel agency, configure subdomain/custom domain, manage tenant settings, and operate within resource limits with complete data isolation.

**What Users Can Accomplish:**
- Agency owners can create a new agency account with automated provisioning within 24 hours
- Each agency operates on isolated subdomain: `agency-slug.travelumroh.com`
- Enterprise tier agencies can configure custom domain mapping
- System enforces resource limits: 500 concurrent users, 3,000 jamaah/month per agency
- Complete tenant data isolation ensures no cross-agency data access

**FRs Covered:** FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5 (Multi-Tenant Agency Management), Additional Requirement #4 (Multi-Tenancy Implementation)

**NFRs Addressed:**
- NFR-2.1: Support 1,036 travel agencies
- NFR-2.2: Handle 3,000 jamaah/month per agency
- NFR-3.3: Row-Level Security with tenant_id
- NFR-3.4: JWT tokens with tenant scope
- NFR-3.5: Rate limiting per tenant

**Implementation Notes:**
- Implements `tenant_id` column on ALL entities
- PostgreSQL Row-Level Security (RLS) policies for complete isolation
- Tenant-scoped JWT tokens with tenant claim
- Cache keys prefixed: `tenant:{tenantId}:`
- Subdomain routing with Nginx/Traefik
- Week 1-2 of 12-week timeline

**Dependencies:** Epic 1 (requires foundation)

---

### Epic 3: Role-Based Access Control System

**User Outcome:** Users can access features based on their assigned role (Agency Owner, Agent, Affiliate, Admin, Jamaah, Family) with proper permission enforcement and support for multi-level agent hierarchy.

**What Users Can Accomplish:**
- System administrators can assign users to 6 distinct roles with specific permissions
- Agency owners have full access to all agency features and data
- Agents can access assigned jamaah with view/edit permissions per RBAC matrix
- Affiliates operate within multi-level hierarchy (Agent → Affiliate → Sub-Affiliate)
- Wholesale pricing visibility restricted based on role level
- Jamaah and Family users have limited self-service access to their own data

**FRs Covered:** FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-2.5 (RBAC)

**NFRs Addressed:**
- NFR-3.7: Zero privilege escalation enforcement
- NFR-3.6: Log all critical operations (role assignments, permission changes)

**Implementation Notes:**
- 6 roles: Agency Owner, Agent, Affiliate, Admin, Jamaah, Family
- Permission matrix with granular feature access control
- Multi-level agent hierarchy support with commission waterfall
- Guards/decorators for route-level permission enforcement
- Week 3-4 of 12-week timeline

**Dependencies:** Epic 1, Epic 2 (requires multi-tenancy)

---

### Epic 4: Package Management

**User Outcome:** Agency owners can create, edit, delete umroh packages with itinerary details, dual pricing (retail/wholesale), inclusions/exclusions, and automatic agent notifications.

**What Users Can Accomplish:**
- Agency owners can create new umroh packages with complete itinerary details
- Package builder supports day-by-day itinerary with activities, hotels, meals
- Dual pricing configuration: retail (public-facing) and wholesale (agent-only)
- Document inclusions (flight, hotel, visa, meals) and exclusions (personal expenses, tips)
- System auto-broadcasts package updates to all agents in the agency
- Package versioning maintains audit trail of all changes
- Agents have view-only access to assigned packages

**FRs Covered:** FR-8.1, FR-8.2, FR-8.3, FR-8.4, FR-8.5, FR-8.6, FR-8.7 (Package Management)

**NFRs Addressed:**
- NFR-1.2: API responses <200ms for package listing
- NFR-2.8: Cache frequently accessed package data with Redis

**Implementation Notes:**
- Rich itinerary builder UI with drag-and-drop timeline
- Package versioning with audit trail (who changed what when)
- Real-time broadcast to agents when packages updated
- Week 5 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3 (requires RBAC for owner/agent access control)

---

### Epic 5: Agent Management & "My Jamaah" Dashboard

**User Outcome:** Agents can view all assigned jamaah in a dashboard, track document/payment status with visual indicators, filter by status, perform bulk operations, and delegate document access with full audit trail.

**What Users Can Accomplish:**
- Agents view all assigned jamaah in single unified dashboard
- Visual status indicators (red/yellow/green) show document, payment, approval status at-a-glance
- Filter jamaah by actionable status: "Dokumen kurang", "Cicilan telat", "Ready to depart"
- Bulk operations: select multiple jamaah → send payment reminders in one click
- Delegate document upload access to assigned jamaah
- Hybrid mode supports both agent-assisted and self-service workflows
- Full audit trail: "Document uploaded by Agent X on behalf of Jamaah Y" with timestamp

**FRs Covered:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-3.5, FR-3.6, FR-3.7 (Agent Management & "My Jamaah" Dashboard)

**NFRs Addressed:**
- NFR-1.3: Page load <2 seconds for dashboard
- NFR-7.1: Indonesian language as primary
- NFR-7.5: Contextual help/tooltips for agent actions

**Implementation Notes:**
- Dashboard with status indicators using color coding
- Advanced filtering with saved filter presets
- Bulk action queuing with BullMQ for background processing
- Comprehensive audit logging for compliance
- Week 5-6 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3 (requires RBAC), Epic 4 (jamaah are assigned to packages)

---

### Epic 6: Document Management with OCR Integration Stub

**User Outcome:** Agents and jamaah can upload documents (KTP, Passport, KK, Vaksin), admins can review extracted data, correct errors, and bulk approve documents. OCR integration marked "Coming Soon" for MVP.

**What Users Can Accomplish:**
- Jamaah and agents can upload required documents: KTP, Passport, Kartu Keluarga, Vaksin certificates
- Support for single document upload and ZIP batch upload (100+ documents)
- **MVP:** Manual document upload with "Coming Soon" badge for OCR auto-extraction
- Admins can review uploaded documents and manually enter data
- Admins can correct document data and approve in bulk (select 50 → approve all)
- System auto-organizes documents by jamaah with search/filter capabilities
- **Phase 2:** Verihubs OCR API integration for automatic data extraction with 98% accuracy

**FRs Covered:** FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-4.5, FR-4.6, FR-4.7, FR-4.8, FR-4.9, FR-4.10 (Document Management & OCR), Additional Requirement #6 (Verihubs OCR "Coming Soon")

**NFRs Addressed:**
- NFR-1.6: OCR processing <4.5 seconds average (Phase 2)
- NFR-4.7: Circuit breakers for third-party OCR API (Phase 2)
- NFR-7.6: Clear, actionable error messages in Indonesian

**Implementation Notes:**
- MVP: Manual upload with "Coming Soon" badge displayed prominently
- Document storage with cloud provider (S3/equivalent)
- ZIP batch upload queued with BullMQ, email notification on completion
- Phase 2: Integrate Verihubs OCR API for KTP, Passport, KK, Vaksin extraction
- Week 6 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 5 (agents need jamaah context)

---

### Epic 7: Payment Gateway & Financial Operations

**User Outcome:** Jamaah can pay via Virtual Account (4 banks), system auto-reconciles payments, tracks installments, sends reminders, calculates agent commissions, supports batch payouts. Virtual Account integration marked "Coming Soon" for MVP.

**What Users Can Accomplish:**
- **MVP:** Manual payment tracking with "Coming Soon" badge for auto-reconciliation
- Admins can manually record payments received from jamaah
- System tracks installments with due dates and payment schedules
- Automated payment reminders sent 3 days before due date
- Multi-level commission calculation: Agent → Affiliate → Sub-Affiliate splits
- Batch commission payout support for 200+ agents monthly
- Full payment history with audit trail for financial compliance
- **Phase 2:** Virtual Account integration (BCA, BSI, BNI, Mandiri) with 99.5%+ auto-reconciliation

**FRs Covered:** FR-7.1, FR-7.2, FR-7.3, FR-7.4, FR-7.5, FR-7.6, FR-7.7, FR-7.8, FR-7.9 (Payment Gateway & Financial Operations), Additional Requirement #6 (Virtual Account "Coming Soon")

**NFRs Addressed:**
- NFR-3.8: PCI-DSS SAQ A compliance (Phase 2)
- NFR-4.6: Auto-retry failed payment webhook deliveries (Phase 2)
- NFR-4.7: Circuit breakers for payment gateway API (Phase 2)

**Implementation Notes:**
- MVP: Manual payment entry with "Coming Soon" badge
- Installment schedule calculator with configurable terms
- Commission calculation engine with multi-level waterfall logic
- Payment reminder jobs scheduled via BullMQ
- Phase 2: Integrate Virtual Account APIs for BCA, BSI, BNI, Mandiri
- Week 7 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 5 (payment tied to agent-jamaah relationships)

---

### Epic 8: Real-Time Communication Infrastructure

**User Outcome:** Users receive real-time dashboard updates, notifications, and system events via WebSocket with tenant isolation and background job processing for async operations.

**What Users Can Accomplish:**
- Dashboard data updates in real-time without page refresh (revenue, jamaah status, notifications)
- Users receive instant notifications for critical events (payment received, document uploaded, etc.)
- System processes background jobs asynchronously (batch imports, email sending, report generation)
- Tenant-isolated WebSocket rooms ensure cross-tenant data never leaks
- Redis caching reduces database load with tenant-scoped cache keys

**FRs Covered:** NFR-1.4 (WebSocket <100ms latency), FR-10.8 (Dashboard real-time refresh), Additional Requirement #3 (Socket.IO 4.7+, BullMQ 5.0+, Redis)

**NFRs Addressed:**
- NFR-1.4: WebSocket latency <100ms
- NFR-1.8: Background jobs complete within 5 minutes
- NFR-2.8: Cache frequently accessed data with Redis
- NFR-4.8: Gracefully degrade when non-critical services fail

**Implementation Notes:**
- Socket.IO 4.7+ with room-based tenant isolation: `tenant:{tenantId}`
- BullMQ 5.0+ for background job processing (CSV imports, bulk notifications)
- Redis 7+ for caching with tenant-scoped keys: `tenant:{tenantId}:cache-key`
- WebSocket authentication with JWT token verification
- Job monitoring dashboard for admins
- Week 7-8 of 12-week timeline

**Dependencies:** Epic 1, Epic 2 (requires tenant infrastructure for isolation)

---

### Epic 9: AI Chatbot & WhatsApp Integration Stubs

**User Outcome:** Public users, agents, and admins can query an AI chatbot for package info, pricing, operations support. Chatbot and WhatsApp integration marked "Coming Soon" for MVP.

**What Users Can Accomplish:**
- **MVP:** "Coming Soon" badges displayed for AI Chatbot and WhatsApp features
- UI placeholders show future chatbot interface in 3 modes (Public/Agent/Admin)
- **Phase 2 - Public Mode:** Retail pricing queries, package availability, general FAQs
- **Phase 2 - Agent Mode:** Wholesale pricing, commission info, agent operations support
- **Phase 2 - Admin Mode:** Internal operations support, system queries, analytics
- **Phase 2 - WhatsApp:** Bidirectional messaging, template messages for reminders, rich media support
- **Phase 2:** Chatbot auto-syncs knowledge when packages updated, broadcasts to agents via WhatsApp

**FRs Covered:** FR-5.1 to FR-5.10 (AI Chatbot Multi-Mode), FR-6.1 to FR-6.8 (WhatsApp Business Integration), Additional Requirement #6 (WhatsApp "Coming Soon")

**NFRs Addressed:**
- NFR-1.7: AI Chatbot response <2 seconds (Phase 2)
- NFR-4.7: Circuit breakers for WhatsApp API (Phase 2)

**Implementation Notes:**
- MVP: Show "Coming Soon" badge in UI where chatbot/WhatsApp features will appear
- UI mockups/wireframes embedded to set user expectations
- Phase 2: Integrate NLP chatbot (DialogFlow/Rasa) with multi-mode context switching
- Phase 2: WhatsApp Business API integration with template messages
- Phase 2: Message sync to platform history for compliance
- Week 8 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 4 (chatbot needs package data)

---

### Epic 10: Agent Landing Page Builder

**User Outcome:** Agents can select packages, auto-generate personalized landing pages with branding, share to social media, capture leads, and track analytics.

**What Users Can Accomplish:**
- Agents select umroh package and click "Generate Landing Page" for instant page creation
- Customize agent branding: profile photo, name, contact info, personal message
- Landing page displays package details with itinerary, pricing, inclusions/exclusions
- Prominent WhatsApp CTA button for direct agent contact
- One-click sharing to Facebook, Instagram, WhatsApp Status
- Lead capture form collects prospect info (name, email, phone, travel dates)
- Auto-notification to agent when lead submits inquiry
- Analytics dashboard shows views, clicks, conversions per landing page

**FRs Covered:** FR-9.1, FR-9.2, FR-9.3, FR-9.4, FR-9.5, FR-9.6, FR-9.7, FR-9.8, FR-9.9 (Landing Page Builder)

**NFRs Addressed:**
- NFR-1.3: Page load <2 seconds for landing pages
- NFR-7.2: Responsive across desktop, tablet, mobile
- NFR-7.3: Support modern browsers

**Implementation Notes:**
- Template-based page generation with customizable themes
- SEO-optimized landing pages with meta tags
- Lead tracking with UTM parameters for attribution
- Integration with Epic 9 WhatsApp CTA (Phase 2)
- Week 9 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 4 (requires packages to create landing pages), Epic 5 (agents create pages)

---

### Epic 11: Operational Intelligence Dashboard

**User Outcome:** Agency owners can view real-time revenue, 3-month projections, pipeline potential, agent performance leaderboard, and jamaah pipeline status with filtering.

**What Users Can Accomplish:**
- Agency owners view real-time total revenue across all packages and agents
- 3-month revenue projection based on pipeline and payment schedules
- Pipeline potential shows total value of jamaah in progress
- Agent performance analytics: conversion rates, revenue generated, jamaah count
- Top performer leaderboard motivates agents with gamification
- Jamaah pipeline visualization by status: "Prospek", "DP Paid", "Pelunasan", "Ready to Depart"
- Advanced filtering by date range, package, agent, status
- Dashboard refreshes in real-time via WebSocket (depends on Epic 8)

**FRs Covered:** FR-10.1, FR-10.2, FR-10.3, FR-10.4, FR-10.5, FR-10.6, FR-10.7, FR-10.8 (Operational Intelligence Dashboard)

**NFRs Addressed:**
- NFR-1.3: Page load <2 seconds for dashboard
- NFR-2.5: Database query time <200ms for 1M+ records
- NFR-7.7: Keyboard shortcuts for power users

**Implementation Notes:**
- Real-time updates via WebSocket from Epic 8
- Pre-aggregated metrics with Redis caching
- Revenue projection algorithm based on historical payment patterns
- Chart visualizations with Recharts/Chart.js
- Week 9-10 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 4, Epic 5, Epic 7, Epic 8 (requires payment data and real-time infrastructure)

---

### Epic 12: Sharia Compliance & Regulatory Reporting

**User Outcome:** System supports Wakalah bil Ujrah contracts with digital akad/e-signature, automates SISKOPATUH reporting, displays compliance dashboard. SISKOPATUH integration marked "Coming Soon" for MVP.

**What Users Can Accomplish:**
- System implements Wakalah bil Ujrah contract structure for sharia compliance
- Digital akad (contract agreement) with e-signature capability for jamaah
- **MVP:** Manual compliance dashboard with "Coming Soon" badge for SISKOPATUH auto-reporting
- Compliance dashboard shows regulatory submission status per jamaah
- Full transaction audit trail for financial transparency
- All critical operations logged for regulatory audits
- **Phase 2:** Automated jamaah data submission to SISKOPATUH API with 100% accuracy

**FRs Covered:** FR-11.1, FR-11.2, FR-11.3, FR-11.4, FR-11.5, FR-11.6, FR-11.7, FR-11.8 (Sharia Compliance & Regulatory), Additional Requirement #6 (SISKOPATUH "Coming Soon")

**NFRs Addressed:**
- NFR-3.6: Log all critical operations
- NFR-6.1: Comply with UU ITE
- NFR-6.6: 100% SISKOPATUH submission accuracy (Phase 2)

**Implementation Notes:**
- MVP: Digital contract templates with e-signature integration (DocuSign/equivalent)
- Compliance dashboard with manual data entry
- "Coming Soon" badge for SISKOPATUH auto-submission
- Comprehensive audit logging for all financial transactions
- Phase 2: SISKOPATUH API integration for automated regulatory reporting
- Week 10 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 5, Epic 7 (requires jamaah and payment data)

---

### Epic 13: Onboarding & Migration Tools

**User Outcome:** Agencies can migrate existing jamaah data via CSV import, track migration progress, access training materials, and view adoption analytics.

**What Users Can Accomplish:**
- Agencies can upload CSV file with existing jamaah data (name, contact, package, payment status)
- CSV import validation with error reporting for data quality
- Migration workflow shows progress: "Validating", "Processing", "Completed"
- Background job processes large imports (1,000+ jamaah) asynchronously
- Email notification when migration completes with summary (success count, errors)
- Access to training materials: video tutorials, PDF guides, knowledge base
- Adoption analytics dashboard shows agency team training completion rate
- One-on-one training escalation request for agencies needing extra support

**FRs Covered:** FR-12.1, FR-12.2, FR-12.3, FR-12.4, FR-12.5, FR-12.6 (Onboarding & Migration)

**NFRs Addressed:**
- NFR-7.4: Agent training completion rate >95% within 7 days
- NFR-1.8: Background jobs complete within 5 minutes

**Implementation Notes:**
- CSV template download with field documentation
- BullMQ background job for batch import processing
- Migration workflow with rollback capability on errors
- Training materials CMS with embedded videos
- Adoption tracking with milestone notifications
- Week 11 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 4, Epic 5 (requires full data model for migration)

---

### Epic 14: Super Admin Platform & Monitoring

**User Outcome:** Super admins can monitor agency health metrics, receive anomaly alerts, run diagnostics, unlock feature trials, and track customer success interventions.

**What Users Can Accomplish:**
- Super admins view cross-tenant health metrics dashboard (uptime, error rates, user activity)
- Monitor per-agency metrics: jamaah count, revenue, agent activity, system usage
- Anomaly detection alerts for unusual patterns (sudden drop in activity, error spikes)
- Account diagnostics tool runs health checks on specific agency (DB connectivity, API performance)
- Unlock feature trials for agencies (e.g., enable AI Chatbot for 30-day trial)
- Track customer success interventions with notes and follow-up reminders
- Sentry integration for error tracking with stack traces
- Winston structured logging for debugging and audit

**FRs Covered:** FR-13.1, FR-13.2, FR-13.3, FR-13.4, FR-13.5 (Super Admin Platform), Additional Requirement #3 (Sentry + Winston monitoring)

**NFRs Addressed:**
- NFR-5.5: Monitor error rates and auto-alert
- NFR-8.6: Error tracking with Sentry
- NFR-8.5: Structured logging with Winston
- NFR-9.4: Alert on critical threshold breaches

**Implementation Notes:**
- Cross-tenant dashboard with agency selection dropdown
- Sentry integration for error tracking and alerts
- Winston structured logging with log levels and context
- Feature flag system for trial unlocking
- Customer success CRM integration (optional)
- Week 11-12 of 12-week timeline

**Dependencies:** Epic 1, Epic 2 (requires multi-tenant infrastructure for cross-tenant monitoring)

---

### Epic 15: API & Developer Platform

**User Outcome:** Third-party developers can integrate with Travel Umroh via RESTful API, receive webhook events, access API documentation, use sandbox environment.

**What Users Can Accomplish:**
- Developers register for API access with OAuth 2.0 authentication
- RESTful API endpoints expose jamaah, payments, packages resources
- Webhook subscriptions for events: `payment.received`, `jamaah.created`, `package.updated`
- Rate limiting enforced: 1,000 requests/hour per API key
- Interactive API documentation with Swagger UI (try-it-now functionality)
- Developer portal with API key management, usage analytics, webhook logs
- Sandbox environment with test data for integration development

**FRs Covered:** FR-14.1, FR-14.2, FR-14.3, FR-14.4, FR-14.5, FR-14.6, FR-14.7 (API & Webhook Support)

**NFRs Addressed:**
- NFR-3.5: Rate limiting per tenant (extended to per API key)
- NFR-8.4: API versioning (v1, v2 endpoints)
- NFR-4.6: Auto-retry failed webhook deliveries

**Implementation Notes:**
- OAuth 2.0 with client credentials flow for server-to-server
- API versioning with `/api/v1/` prefix
- Webhook delivery with retry logic (exponential backoff)
- Swagger/OpenAPI specification auto-generated from NestJS decorators
- Developer portal with API key CRUD, usage charts
- Sandbox tenant with seeded test data
- Week 12 of 12-week timeline

**Dependencies:** Epic 1, Epic 2, Epic 3, Epic 4, Epic 5, Epic 7 (requires all core resources to expose via API)

---

# Epic Implementation Stories

## Epic 1: Project Foundation & Development Environment

### Story 1.1: Initialize Brocoders NestJS Boilerplate

As a **developer**,
I want to clone and initialize the Brocoders NestJS Boilerplate with all required services,
So that I have a production-ready foundation with PostgreSQL, authentication, Docker, and API documentation.

**Acceptance Criteria:**

**Given** I have access to the project repository
**When** I execute the boilerplate initialization commands
**Then** the project is cloned from `https://github.com/brocoders/nestjs-boilerplate.git`
**And** the project is renamed to `travel-umroh`
**And** environment configuration is copied from `env-example-relational` to `.env`
**And** Docker Compose services are started (PostgreSQL, Adminer, MailDev)
**And** npm dependencies are installed successfully
**And** database migrations are executed via `npm run migration:run`
**And** database seeds are loaded via `npm run seed:run:relational`
**And** the development server starts successfully on `http://localhost:3000`
**And** Swagger API documentation is accessible at `http://localhost:3000/docs`
**And** PostgreSQL database is accessible at `localhost:5432`
**And** Adminer database UI is accessible at `http://localhost:8080`
**And** MailDev email testing UI is accessible at `http://localhost:1080`

**Technical Requirements:**
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed
- Minimum 4GB RAM available for Docker services

**Commands Executed:**
```bash
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh
cd travel-umroh/
cp env-example-relational .env
docker compose up -d postgres adminer maildev
npm install
npm run app:config
npm run migration:run
npm run seed:run:relational
npm run start:dev
```

**Validation:**
- `curl http://localhost:3000/api/v1/auth/me` returns 401 Unauthorized (auth working)
- Swagger docs display all default endpoints
- Database contains seeded users from boilerplate

---

### Story 1.2: Configure Multi-Tenancy Database Foundation

As a **backend developer**,
I want to establish the multi-tenancy foundation with tenant_id pattern and base entity configuration,
So that all future entities automatically support tenant isolation.

**Acceptance Criteria:**

**Given** the Brocoders boilerplate is initialized
**When** I create the tenant infrastructure
**Then** a new `tenants` table is created with fields:
  - `id` (UUID, primary key)
  - `name` (VARCHAR, required, agency name)
  - `slug` (VARCHAR, unique, required, for subdomain)
  - `domain` (VARCHAR, nullable, for custom domain)
  - `status` (ENUM: active, suspended, inactive)
  - `resource_limits` (JSONB: max_users, max_jamaah_per_month)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
**And** a `TenantBaseEntity` abstract class is created extending TypeORM BaseEntity
**And** `TenantBaseEntity` includes `tenant_id` (UUID, required, indexed)
**And** a TypeORM migration is created for the tenants table
**And** the migration is executed successfully
**And** TypeORM global query filter is configured to auto-inject tenant_id for all queries
**And** a seed file creates 3 test tenants:
  - Tenant 1: "PT Umroh Berkah", slug: "berkah", status: active
  - Tenant 2: "Almadinah Travel", slug: "almadinah", status: active
  - Tenant 3: "Haji Plus Indonesia", slug: "hajiplus", status: suspended

**Technical Requirements:**
- TypeORM decorators properly configured
- Migration naming convention: `YYYYMMDDHHMMSS-CreateTenantsTable.ts`
- Index on tenant_id for performance
- Composite index on (tenant_id, id) for common queries

**Files Created/Modified:**
- `src/database/entities/tenant.entity.ts` (new)
- `src/database/entities/tenant-base.entity.ts` (new)
- `src/database/migrations/XXXXXX-CreateTenantsTable.ts` (new)
- `src/database/seeds/tenant.seed.ts` (new)

**Validation:**
- Query `SELECT * FROM tenants` returns 3 seeded tenants
- `TenantBaseEntity` can be extended by other entities
- tenant_id index exists: `SELECT indexname FROM pg_indexes WHERE tablename = 'tenants'`

---

### Story 1.3: Configure API Standards and Patterns

As a **backend developer**,
I want to implement consistent API response format and naming conventions,
So that all endpoints follow standardized patterns for client consumption.

**Acceptance Criteria:**

**Given** the boilerplate is initialized
**When** I implement API standards
**Then** a global `ResponseInterceptor` is created that wraps all responses in format:
```json
{
  "data": { ...actual response },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "path": "/api/v1/resource"
  }
}
```
**And** error responses follow format:
```json
{
  "error": {
    "message": "Error message in Indonesian",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```
**And** TypeScript strict mode is enabled in `tsconfig.json`:
  - `"strict": true`
  - `"strictNullChecks": true`
  - `"strictFunctionTypes": true`
  - `"noImplicitAny": true`
**And** naming conventions are documented in `CONVENTIONS.md`:
  - JSON fields: camelCase (e.g., `firstName`, `createdAt`)
  - Database columns: snake_case (e.g., `first_name`, `created_at`)
  - Class names: PascalCase (e.g., `UserEntity`, `AuthService`)
  - File names: kebab-case (e.g., `user.entity.ts`, `auth.service.ts`)
**And** date serialization is configured to ISO 8601 format
**And** a global validation pipe is configured with `class-validator` and `class-transformer`

**Technical Requirements:**
- Interceptor registered globally in `main.ts`
- Exception filter for error formatting
- DTOs use class-validator decorators
- All dates return as ISO 8601 strings (e.g., "2025-12-22T10:30:00.000Z")

**Files Created/Modified:**
- `src/common/interceptors/response.interceptor.ts` (new)
- `src/common/filters/http-exception.filter.ts` (new)
- `tsconfig.json` (modified - strict mode)
- `CONVENTIONS.md` (new)
- `src/main.ts` (modified - register interceptor and filter)

**Validation:**
- Test endpoint returns response with `data` and `meta` wrapper
- Invalid request returns error with proper format
- TypeScript compiles with no type errors in strict mode
- All existing endpoints follow response format

---

### Story 1.4: Set Up Development Tools and Documentation

As a **developer**,
I want comprehensive API documentation, logging infrastructure, and setup instructions,
So that developers can easily onboard and debug the application.

**Acceptance Criteria:**

**Given** the boilerplate is initialized with API standards
**When** I configure development tools
**Then** Swagger documentation is enhanced with:
  - API title: "Travel Umroh API"
  - Version: "1.0.0"
  - Description: "Multi-tenant SaaS platform for Indonesian travel agencies"
  - Bearer token authentication configured
  - All endpoints organized by tags (Auth, Users, Tenants, etc.)
  - Example request/response bodies for all endpoints
**And** Winston logging is configured with:
  - Log levels: error, warn, info, debug
  - Console transport for development
  - File transport: `logs/error.log` (errors only), `logs/combined.log` (all)
  - JSON format for structured logging
  - Timestamp in ISO 8601 format
  - Context fields: `tenantId`, `userId`, `requestId`
**And** `README.md` is updated with:
  - Project overview and architecture
  - Prerequisites (Node.js 18+, Docker, etc.)
  - Installation instructions (all commands from Story 1.1)
  - Environment variables documentation
  - API documentation link
  - Troubleshooting section
**And** `.env.example` is created with all required variables documented:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `REDIS_HOST`, `REDIS_PORT`
  - `API_PORT`
  - `SWAGGER_ENABLED`
**And** a `CONTRIBUTING.md` file is created with:
  - Git workflow (feature branches, PR process)
  - Code style guidelines
  - Testing requirements
  - Commit message conventions

**Technical Requirements:**
- Swagger accessible at `/docs` in development
- Winston integrated with NestJS Logger
- Log rotation configured (max 14 days retention)
- README includes sample API requests with curl

**Files Created/Modified:**
- `src/config/swagger.config.ts` (modified - enhanced configuration)
- `src/config/logger.config.ts` (new)
- `src/main.ts` (modified - integrate Winston logger)
- `README.md` (modified - comprehensive documentation)
- `.env.example` (new)
- `CONTRIBUTING.md` (new)
- `package.json` (modified - add scripts: `npm run logs:clear`, `npm run docs:generate`)

**Validation:**
- Swagger UI displays enhanced documentation with examples
- Application logs are written to console and files
- Log files contain structured JSON entries
- README instructions successfully onboard a new developer
- All environment variables are documented

---

## Epic 2: Multi-Tenant Agency Management

### Story 2.1: Tenant Registration and Automated Provisioning

As an **agency owner**,
I want to register my travel agency and have it automatically provisioned within 24 hours,
So that I can start using the platform without manual setup delays.

**Acceptance Criteria:**

**Given** I am a new agency owner
**When** I submit the agency registration form
**Then** a new tenant record is created in the `tenants` table with status "pending"
**And** an automated provisioning workflow is triggered via BullMQ
**And** the workflow creates:
  - Default admin user for the agency
  - Agency-specific database records with tenant_id
  - Initial configuration (resource limits: 500 concurrent users, 3,000 jamaah/month)
  - Subdomain slug based on agency name (e.g., "pt-berkah-umroh" → "berkah-umroh")
**And** tenant status changes to "active" upon successful provisioning
**And** confirmation email is sent to agency owner with login credentials and subdomain URL
**And** provisioning completes within 24 hours (tracked by created_at vs activated_at)
**And** if provisioning fails, tenant status is set to "failed" and support is notified

**Technical Requirements:**
- Registration form validates: agency name (required), owner email (unique), phone, address
- BullMQ job: `tenant-provisioning` with retry logic (3 attempts)
- Email template in Indonesian with onboarding instructions
- Transaction wrapper ensures rollback on failure

**Files Created/Modified:**
- `src/modules/tenants/tenants.controller.ts` (new)
- `src/modules/tenants/tenants.service.ts` (new)
- `src/modules/tenants/dto/create-tenant.dto.ts` (new)
- `src/modules/tenants/jobs/tenant-provisioning.job.ts` (new)
- `src/modules/tenants/entities/tenant.entity.ts` (modified - add status field)

**Validation:**
- POST `/api/v1/tenants/register` creates tenant with status "pending"
- BullMQ dashboard shows job queued and completed
- Database query shows tenant status "active" after provisioning
- Email is sent to owner

---

### Story 2.2: Subdomain Routing Configuration

As an **agency owner**,
I want my agency to be accessible via a unique subdomain like `berkah.travelumroh.com`,
So that my agents and customers have a branded URL.

**Acceptance Criteria:**

**Given** a tenant has been provisioned with slug "berkah-umroh"
**When** subdomain routing is configured
**Then** Nginx/Traefik is configured to route `berkah-umroh.travelumroh.com` to the application
**And** the application extracts tenant slug from subdomain in middleware
**And** tenant context is set globally for all requests from that subdomain
**And** all database queries automatically filter by tenant_id
**And** accessing `https://berkah-umroh.travelumroh.com` displays agency-specific login page
**And** accessing `https://almadinah.travelumroh.com` displays different tenant data
**And** cross-tenant data access is blocked (404 if wrong tenant_id)
**And** SSL certificates are auto-provisioned for subdomains via Let's Encrypt

**Technical Requirements:**
- Nginx wildcard subdomain configuration: `*.travelumroh.com`
- NestJS middleware: `TenantMiddleware` extracts slug from hostname
- Request context stores tenant_id for entire request lifecycle
- TypeORM subscriber auto-injects tenant_id on INSERT/UPDATE

**Files Created/Modified:**
- `nginx.conf` or `traefik.yml` (new - wildcard subdomain routing)
- `src/common/middleware/tenant.middleware.ts` (new)
- `src/common/interceptors/tenant.interceptor.ts` (new)
- `src/database/subscribers/tenant.subscriber.ts` (new)
- `src/main.ts` (modified - register tenant middleware globally)

**Validation:**
- `curl -H "Host: berkah-umroh.travelumroh.com" http://localhost:3000/api/v1/auth/me` returns Berkah tenant data
- `curl -H "Host: almadinah.travelumroh.com" http://localhost:3000/api/v1/auth/me` returns Almadinah tenant data
- Cross-tenant query returns 404

---

### Story 2.3: Custom Domain Mapping for Enterprise Tier

As an **enterprise tier agency owner**,
I want to map my own custom domain (e.g., `www.berkahtravel.com`) to my tenant,
So that I can use my branded domain instead of a subdomain.

**Acceptance Criteria:**

**Given** I am an enterprise tier agency owner
**When** I configure a custom domain in tenant settings
**Then** I can enter my custom domain (e.g., "www.berkahtravel.com")
**And** the system validates domain ownership via DNS TXT record verification
**And** I receive instructions to add CNAME record pointing to `travelumroh.com`
**And** the system polls DNS records every 5 minutes to verify CNAME is configured
**And** once verified, the custom domain is activated and stored in `tenants.domain` field
**And** Nginx/Traefik routing includes custom domain mapping
**And** SSL certificate is auto-provisioned for custom domain via Let's Encrypt
**And** both subdomain and custom domain work simultaneously
**And** custom domain displays in tenant dashboard with "Active" status

**Technical Requirements:**
- DNS TXT record format: `travel-umroh-verify=<verification_token>`
- DNS lookup library: `dns.promises.resolve()`
- BullMQ job: `domain-verification` runs every 5 minutes until verified
- Certbot/Let's Encrypt integration for SSL provisioning

**Files Created/Modified:**
- `src/modules/tenants/dto/update-domain.dto.ts` (new)
- `src/modules/tenants/jobs/domain-verification.job.ts` (new)
- `src/modules/tenants/services/dns-verification.service.ts` (new)
- `nginx.conf` or `traefik.yml` (modified - add custom domain routing)

**Validation:**
- POST `/api/v1/tenants/{id}/domain` with domain "www.berkahtravel.com" returns verification token
- After DNS configured, job verifies and activates domain
- `curl https://www.berkahtravel.com` routes to Berkah tenant

---

### Story 2.4: Resource Limits Enforcement

As a **platform administrator**,
I want to enforce resource limits per tenant (500 concurrent users, 3,000 jamaah/month),
So that platform resources are fairly distributed and no single tenant overloads the system.

**Acceptance Criteria:**

**Given** a tenant has resource limits configured
**When** resource usage is checked
**Then** concurrent user limit is enforced:
  - Track active WebSocket connections per tenant
  - Reject new connections if limit (500) exceeded
  - Display "Maximum concurrent users reached" error in Indonesian
**And** monthly jamaah limit is enforced:
  - Count jamaah created in current month per tenant
  - Block new jamaah creation if limit (3,000) exceeded
  - Display "Monthly quota exceeded. Upgrade to create more jamaah" message
**And** resource usage is displayed in tenant dashboard:
  - Current concurrent users: 234/500
  - Jamaah this month: 1,245/3,000
**And** limits can be adjusted by super admin for tenant upgrades
**And** usage metrics are cached in Redis for performance

**Technical Requirements:**
- Redis keys: `tenant:{tenantId}:concurrent_users` (Set)
- Redis keys: `tenant:{tenantId}:jamaah_count:{YYYY-MM}` (Counter)
- Guard decorator: `@CheckResourceLimits()` for protected routes
- Monthly counter resets on 1st of each month via cron job

**Files Created/Modified:**
- `src/common/guards/resource-limits.guard.ts` (new)
- `src/modules/tenants/services/resource-monitor.service.ts` (new)
- `src/modules/tenants/services/usage-tracker.service.ts` (new)
- `src/modules/tenants/dto/resource-usage.dto.ts` (new)

**Validation:**
- Create 501 concurrent connections for tenant → 501st connection rejected
- Create 3,001 jamaah in one month → 3,001st creation fails with quota error
- GET `/api/v1/tenants/{id}/usage` returns current usage stats

---

### Story 2.5: Tenant Management Dashboard

As a **super admin**,
I want a tenant management dashboard to view all agencies, their status, and perform admin actions,
So that I can monitor platform health and manage tenants effectively.

**Acceptance Criteria:**

**Given** I am logged in as super admin
**When** I access the tenant management dashboard
**Then** I see a table listing all tenants with columns:
  - Agency Name
  - Slug
  - Status (Active/Suspended/Inactive badge)
  - Resource Usage (users/jamaah this month)
  - Created Date
  - Actions (View, Edit, Suspend, Delete)
**And** I can filter tenants by status
**And** I can search tenants by name or slug
**And** I can sort by any column
**And** clicking "View" shows tenant details with full analytics
**And** clicking "Edit" allows updating resource limits
**And** clicking "Suspend" changes status to "suspended" and blocks all tenant access
**And** clicking "Delete" soft-deletes tenant (status: "deleted")
**And** pagination supports 20 tenants per page
**And** dashboard updates in real-time via WebSocket when tenant status changes

**Technical Requirements:**
- Table component with sorting, filtering, pagination
- Super admin role required (enforced by role guard)
- Soft delete: sets `deleted_at` timestamp instead of hard delete
- WebSocket event: `tenant.status.changed`

**Files Created/Modified:**
- `src/modules/tenants/tenants.controller.ts` (modified - add admin endpoints)
- `src/modules/tenants/dto/filter-tenants.dto.ts` (new)
- `frontend/src/pages/admin/tenants/index.tsx` (new - Next.js page)
- `frontend/src/components/TenantTable.tsx` (new)

**Validation:**
- GET `/api/v1/admin/tenants?status=active` returns only active tenants
- PUT `/api/v1/admin/tenants/{id}/suspend` changes status to suspended
- Frontend table displays all tenants with correct badges

---
## Epic 3: Role-Based Access Control System

### Story 3.1: Create Role Entity and Permission Matrix

As a **developer**,
I want to create the role entity with permission matrix infrastructure,
So that the system can enforce role-based access control across all features.

**Acceptance Criteria:**

**Given** the tenant and user entities exist
**When** I implement RBAC foundation
**Then** a `roles` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `name` (ENUM: agency_owner, agent, affiliate, admin, jamaah, family)
  - `display_name` (VARCHAR: localized role name in Indonesian)
  - `description` (TEXT: role purpose and permissions)
  - `created_at`, `updated_at`
**And** a `user_roles` junction table links users to roles:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID)
  - `user_id` (UUID, foreign key to users)
  - `role_id` (UUID, foreign key to roles)
  - `assigned_by_id` (UUID, foreign key to users)
  - `assigned_at` (TIMESTAMP)
**And** a `permissions` table defines granular permissions:
  - `id` (UUID, primary key)
  - `resource` (VARCHAR: jamaah, payment, package, document, etc.)
  - `action` (ENUM: create, read, update, delete, export, approve)
  - `role_id` (UUID, foreign key to roles)
**And** the 6 roles are seeded with default permissions per RBAC matrix:
  - Agency Owner: Full access to all tenant resources
  - Agent: Read/write assigned jamaah, read-only packages
  - Affiliate: Limited access within hierarchy
  - Admin: Review/approve documents and payments
  - Jamaah: Read-only own data, upload own documents
  - Family: Read-only for linked family member data
**And** database migration includes PostgreSQL RLS policies for role-based filtering
**And** unit tests verify role creation and permission assignment

**Technical Details:**
- Use TypeORM entities with `@Entity()` decorators
- Implement soft deletes for role assignments (audit trail)
- Permission matrix stored in configuration file for easy updates
- Role names use ENUM to prevent typos

**NFRs Addressed:**
- NFR-3.7: Zero privilege escalation enforcement
- NFR-3.6: Log all role assignments as critical operations

---

### Story 3.2: Implement Role-Based Guards and Decorators

As a **developer**,
I want to create NestJS guards and decorators for route-level permission enforcement,
So that API endpoints automatically enforce role-based access control.

**Acceptance Criteria:**

**Given** roles and permissions are defined in the database
**When** I implement authorization infrastructure
**Then** a `@RequireRole()` decorator is created that:
  - Accepts role names as parameters: `@RequireRole('agency_owner', 'agent')`
  - Throws 403 Forbidden if user lacks required role
  - Works with JWT tokens containing role claims
**And** a `@RequirePermission()` decorator is created that:
  - Accepts resource and action: `@RequirePermission('jamaah', 'update')`
  - Checks user's role permissions against the request
  - Throws 403 Forbidden if permission denied
**And** a `RolesGuard` implements role checking logic:
  - Extracts user and tenant_id from JWT token
  - Queries user_roles table for current user's roles
  - Validates role against route decorator requirements
**And** guard is applied globally to all protected routes
**And** public routes use `@Public()` decorator to bypass guard
**And** integration tests verify:
  - Agency Owner can access all endpoints
  - Agent can access only assigned jamaah endpoints
  - Jamaah can only access own data endpoints
  - Unauthorized access returns 403 with clear error message

**Technical Details:**
- Implement `CanActivate` interface for custom guards
- Cache user roles in request context to avoid repeated DB queries
- Use NestJS `Reflector` to read decorator metadata
- Return structured error: `{ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }`

**NFRs Addressed:**
- NFR-1.2: Guard execution <10ms overhead per request
- NFR-3.7: Zero privilege escalation (tested in integration tests)

---

### Story 3.3: Multi-Level Agent Hierarchy Support

As an **Agency Owner**,
I want to create multi-level agent hierarchies (Agent → Affiliate → Sub-Affiliate),
So that commission structures can cascade through the organization.

**Acceptance Criteria:**

**Given** the role entity supports Agent and Affiliate roles
**When** I implement hierarchy support
**Then** an `agent_hierarchy` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `agent_id` (UUID, foreign key to users with Agent role)
  - `parent_agent_id` (UUID, nullable, foreign key to users - immediate upline)
  - `level` (INTEGER: 1=Agent, 2=Affiliate, 3=Sub-Affiliate)
  - `commission_split_percentage` (DECIMAL: % of commission this level receives)
  - `created_at`, `updated_at`
**And** API endpoint `POST /api/v1/agents/:id/hierarchy` allows:
  - Agency Owner to assign an agent as affiliate under another agent
  - Parent agent assignment validates parent has Agent or Affiliate role
  - Maximum 3 levels deep hierarchy enforcement
**And** API endpoint `GET /api/v1/agents/:id/hierarchy` returns:
  - Agent's upline chain: Agent → Parent → Grandparent
  - Agent's downline tree: All affiliates and sub-affiliates
  - Commission split percentages at each level
**And** hierarchy validation prevents:
  - Circular references (agent cannot be own parent)
  - Level violations (Sub-Affiliate cannot have children)
  - Cross-tenant hierarchy (all hierarchy members must share tenant_id)
**And** unit tests verify hierarchy traversal and validation rules

**Technical Details:**
- Use recursive CTE for hierarchy queries: `WITH RECURSIVE agent_tree AS...`
- Cache hierarchy in Redis with TTL 1 hour: `tenant:{tenantId}:hierarchy:{agentId}`
- Invalidate cache on hierarchy changes
- Maximum 3 levels enforced in API validation

**NFRs Addressed:**
- NFR-2.3: Support 31,000+ total agents across all levels
- NFR-2.8: Cache hierarchy data with Redis

---

### Story 3.4: Wholesale Pricing Visibility Control

As an **Agency Owner**,
I want to restrict wholesale pricing visibility based on user role and hierarchy level,
So that commission structures remain confidential and pricing is role-appropriate.

**Acceptance Criteria:**

**Given** packages have dual pricing (retail and wholesale)
**When** users query package details
**Then** API endpoint `GET /api/v1/packages/:id` returns pricing based on role:
  - **Public/Jamaah**: Only `retail_price` field visible
  - **Agent/Affiliate/Sub-Affiliate**: Both `retail_price` and `wholesale_price` visible
  - **Agency Owner/Admin**: Both prices + cost breakdown visible
**And** database view `package_pricing_view` filters columns by role:
  - Uses PostgreSQL RLS with role-based policies
  - Null values returned for restricted pricing fields
**And** frontend receives role-appropriate data:
  - Jamaah dashboard shows only retail pricing
  - Agent dashboard shows both retail and wholesale
  - Owner dashboard shows complete pricing breakdown
**And** API response includes `pricing_visibility` metadata:
  ```json
  {
    "retail_price": 25000000,
    "wholesale_price": 22000000,  // null if not authorized
    "pricing_visibility": {
      "can_view_wholesale": true,
      "can_view_cost": false,
      "role": "agent"
    }
  }
  ```
**And** attempting to access restricted pricing via direct query returns 403 Forbidden
**And** integration tests verify pricing visibility for all 6 roles

**Technical Details:**
- Implement serializer/transformer that filters fields based on role
- Use NestJS `@Exclude()` decorator with groups: `@SerializeOptions({ groups: ['agent'] })`
- PostgreSQL RLS policy: `CREATE POLICY wholesale_pricing ON packages FOR SELECT USING (check_role_permission(...))`
- No pricing data leaked in error messages or logs

**NFRs Addressed:**
- NFR-3.7: Zero privilege escalation (pricing data isolation)
- NFR-3.6: Log all attempts to access restricted pricing

---

### Story 3.5: Granular Data Access Control for Agents

As an **Agent**,
I want to see only the jamaah assigned to me,
So that I maintain focused workflow and data privacy is enforced.

**Acceptance Criteria:**

**Given** agents are assigned to specific jamaah
**When** an agent queries jamaah data
**Then** a `jamaah_assignments` table exists with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `agent_id` (UUID, foreign key to users with Agent role)
  - `assigned_by_id` (UUID, foreign key to users)
  - `assigned_at` (TIMESTAMP)
**And** API endpoint `GET /api/v1/jamaah` filters results by role:
  - **Agency Owner/Admin**: Returns all jamaah in tenant
  - **Agent/Affiliate**: Returns only assigned jamaah
  - **Jamaah**: Returns only own record
  - **Family**: Returns only linked family member records
**And** PostgreSQL RLS policy enforces data filtering:
  ```sql
  CREATE POLICY jamaah_agent_access ON jamaah
    FOR SELECT
    USING (
      tenant_id = current_setting('app.tenant_id')::uuid
      AND (
        current_setting('app.role') = 'agency_owner'
        OR current_setting('app.role') = 'admin'
        OR id IN (SELECT jamaah_id FROM jamaah_assignments WHERE agent_id = current_setting('app.user_id')::uuid)
      )
    );
  ```
**And** attempting to access unassigned jamaah returns 404 Not Found (not 403, to prevent data leakage)
**And** agent assignment API endpoint `POST /api/v1/jamaah/:id/assign-agent` allows:
  - Agency Owner to assign/reassign agents
  - Validation that agent belongs to same tenant
  - Audit log of all assignment changes
**And** integration tests verify:
  - Agent A cannot see Agent B's jamaah
  - Reassignment updates access immediately
  - Unassigned jamaah invisible to all agents

**Technical Details:**
- Set PostgreSQL session variables: `SET app.tenant_id = '...'; SET app.role = '...';`
- Use connection middleware to set session variables from JWT token
- Index on `jamaah_assignments(agent_id, tenant_id)` for performance
- Cache agent's assigned jamaah IDs in Redis: `tenant:{tenantId}:agent:{agentId}:jamaah`

**NFRs Addressed:**
- NFR-3.5: Granular data access control enforced at database level
- NFR-1.2: Query time <200ms even with 3,000 jamaah per agency

---

### Story 3.6: Role Assignment and Management UI

As an **Agency Owner**,
I want to assign and manage user roles through an admin interface,
So that I can control team access and permissions efficiently.

**Acceptance Criteria:**

**Given** I am logged in as Agency Owner
**When** I access the role management interface
**Then** a "Team Management" page displays:
  - List of all users in my agency with current roles
  - Filter by role: All, Agency Owner, Agent, Affiliate, Admin, Jamaah, Family
  - Search by name or email
**And** clicking "Edit Role" on a user shows modal with:
  - Current role highlighted
  - Radio button selection for new role (6 options)
  - Warning message if changing from Agency Owner role
  - Confirmation button "Update Role"
**And** changing a user's role:
  - Triggers API `PATCH /api/v1/users/:id/role` with new role
  - Shows confirmation dialog: "Change [User Name] from [Old Role] to [New Role]?"
  - Updates role in database with `assigned_by_id` and `assigned_at`
  - Logs change in audit trail
  - Invalidates user's JWT token (forces re-login)
  - Shows success toast: "Role updated successfully. User must log in again."
**And** role assignment validations prevent:
  - Removing last Agency Owner from tenant
  - Non-Owner users from assigning Agency Owner role
  - Assigning roles across different tenants
**And** audit trail shows:
  - Who changed the role
  - Old role → New role
  - Timestamp of change
  - Reason for change (optional text field)
**And** Agency Owner can bulk assign roles:
  - Select multiple users (checkbox selection)
  - Bulk action menu: "Assign Role"
  - Dropdown to select role for all selected users
  - Confirmation shows list of affected users

**Technical Details:**
- Frontend: Next.js page with Tanstack Table for user list
- Role badge component with color coding:
  - Agency Owner: purple
  - Agent: blue
  - Affiliate: green
  - Admin: orange
  - Jamaah: gray
  - Family: light gray
- Optimistic UI updates with rollback on error
- Real-time updates via WebSocket when roles change

**NFRs Addressed:**
- NFR-7.1: All UI text in Indonesian
- NFR-7.5: Contextual tooltips explaining each role's permissions
- NFR-3.6: Full audit trail for all role changes

---

## Epic 4: Package Management

### Story 4.1: Package Entity and CRUD API

As an **Agency Owner**,
I want to create, read, update, and delete umroh packages,
So that I can manage my travel offerings.

**Acceptance Criteria:**

**Given** I am logged in as Agency Owner
**When** I implement package management
**Then** a `packages` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `name` (VARCHAR: e.g., "Umroh Ramadhan 2025")
  - `description` (TEXT: package overview)
  - `duration_days` (INTEGER: e.g., 12)
  - `retail_price` (DECIMAL: public-facing price)
  - `wholesale_price` (DECIMAL: agent price)
  - `cost_price` (DECIMAL: agency's cost, owner-only visibility)
  - `capacity` (INTEGER: maximum jamaah count)
  - `available_slots` (INTEGER: remaining capacity)
  - `departure_date` (DATE)
  - `return_date` (DATE)
  - `status` (ENUM: draft, published, sold_out, completed, cancelled)
  - `created_by_id` (UUID, foreign key to users)
  - `created_at`, `updated_at`, `deleted_at` (soft delete)
**And** API endpoints are created:
  - `POST /api/v1/packages` - Create new package (Agency Owner only)
  - `GET /api/v1/packages` - List packages (filtered by role)
  - `GET /api/v1/packages/:id` - Get package details (pricing filtered by role)
  - `PATCH /api/v1/packages/:id` - Update package (Agency Owner only)
  - `DELETE /api/v1/packages/:id` - Soft delete package (Agency Owner only)
**And** package creation validation enforces:
  - Required fields: name, duration_days, retail_price, wholesale_price, departure_date
  - Retail price >= Wholesale price >= Cost price
  - Departure date >= Today
  - Return date = Departure date + duration_days
  - Capacity > 0
**And** package listing supports:
  - Filter by status: published, draft, sold_out
  - Sort by departure_date ASC/DESC, created_at, price
  - Pagination: 20 packages per page
  - Search by package name (case-insensitive, partial match)
**And** updating available_slots:
  - Decrements when jamaah assigned to package
  - Auto-updates status to "sold_out" when available_slots = 0
  - Prevents updates when status is "completed" or "cancelled"
**And** soft delete preserves:
  - Historical package data for reporting
  - Associated jamaah assignments intact
  - Package marked as deleted in listings

**Technical Details:**
- Use TypeORM entity with `@Entity('packages')` decorator
- Implement `@BeforeInsert()` hook to calculate return_date
- Index on `(tenant_id, status, departure_date)` for listing queries
- DTO validation with class-validator: `@Min()`, `@IsDate()`, `@IsEnum()`

**NFRs Addressed:**
- NFR-1.2: API response <200ms for package listing
- NFR-2.8: Cache published packages in Redis (TTL 15 minutes)

---

### Story 4.2: Itinerary Builder Backend

As an **Agency Owner**,
I want to create day-by-day itineraries for packages,
So that jamaah can see detailed schedules and agents can explain the package.

**Acceptance Criteria:**

**Given** a package exists
**When** I implement itinerary builder
**Then** a `package_itineraries` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `package_id` (UUID, foreign key to packages)
  - `day_number` (INTEGER: 1 to duration_days)
  - `title` (VARCHAR: "Day 1: Arrival in Jeddah")
  - `description` (TEXT: detailed activities)
  - `activities` (JSONB array: [{time, activity, location}])
  - `accommodation` (VARCHAR: hotel name)
  - `meals_included` (JSONB: {breakfast: true, lunch: true, dinner: true})
  - `sort_order` (INTEGER: for custom ordering)
  - `created_at`, `updated_at`
**And** API endpoint `POST /api/v1/packages/:packageId/itinerary` creates itinerary day:
  - Accepts: day_number, title, description, activities, accommodation, meals_included
  - Validates day_number <= package.duration_days
  - Prevents duplicate day_number for same package
  - Returns created itinerary with ID
**And** API endpoint `GET /api/v1/packages/:packageId/itinerary` returns:
  - All itinerary days sorted by day_number ASC
  - Grouped by day with complete details
  - Formatted response:
  ```json
  {
    "package_id": "uuid",
    "itinerary": [
      {
        "day_number": 1,
        "title": "Day 1: Arrival in Jeddah",
        "description": "...",
        "activities": [
          {"time": "08:00", "activity": "Depart from Jakarta", "location": "Soekarno-Hatta Airport"},
          {"time": "14:00", "activity": "Arrive in Jeddah", "location": "King Abdulaziz Airport"}
        ],
        "accommodation": "Hotel Pullman Zamzam",
        "meals_included": {"breakfast": false, "lunch": true, "dinner": true}
      }
    ]
  }
  ```
**And** API endpoint `PATCH /api/v1/packages/:packageId/itinerary/:dayId` updates:
  - Any itinerary field except package_id
  - Validates day_number uniqueness
  - Returns updated itinerary
**And** API endpoint `DELETE /api/v1/packages/:packageId/itinerary/:dayId` removes itinerary day
**And** when package duration_days changes:
  - System warns if duration reduced and itinerary days exist beyond new duration
  - Owner can choose to delete excess days or cancel duration change

**Technical Details:**
- JSONB activities field for flexible structure
- Index on `(package_id, day_number)` for fast queries
- Validate JSONB structure with JSON schema in DTO
- Return itinerary automatically when fetching package details (eager loading)

**NFRs Addressed:**
- NFR-1.2: Itinerary fetch <200ms even with 30-day packages
- NFR-7.6: Clear error messages in Indonesian for validation failures

---

### Story 4.3: Dual Pricing System

As an **Agency Owner**,
I want to set retail and wholesale pricing for packages,
So that public sees retail price while agents see their commission potential.

**Acceptance Criteria:**

**Given** a package exists with retail_price and wholesale_price
**When** different user roles view the package
**Then** pricing visibility is enforced per role (reusing RBAC from Epic 3):
  - **Public/Jamaah**: Only retail_price visible
  - **Agent/Affiliate/Sub-Affiliate**: Both retail_price and wholesale_price visible
  - **Agency Owner/Admin**: All three prices visible (retail, wholesale, cost)
**And** API response includes computed commission for agents:
  ```json
  {
    "id": "uuid",
    "name": "Umroh Ramadhan 2025",
    "retail_price": 25000000,
    "wholesale_price": 22000000,  // only if role allows
    "cost_price": 20000000,       // owner only
    "pricing": {
      "agent_commission": 3000000,        // retail - wholesale
      "agent_commission_percentage": 12,   // (retail - wholesale) / retail * 100
      "agency_profit": 2000000,           // wholesale - cost (owner only)
      "total_margin": 5000000             // retail - cost (owner only)
    }
  }
  ```
**And** commission calculation updates dynamically:
  - When retail or wholesale price changes
  - Stored as computed field for quick access
  - Validates retail >= wholesale >= cost
**And** package listing shows pricing preview:
  - Agent sees wholesale price + commission in card
  - Jamaah sees only retail price
  - Owner sees full margin breakdown
**And** price update API `PATCH /api/v1/packages/:id/pricing` allows:
  - Agency Owner to update all three prices
  - Validation: retail >= wholesale >= cost
  - Optional: reason for price change (audit trail)
  - Triggers version increment (see Story 4.6)
**And** integration tests verify:
  - Agent cannot access cost_price field
  - Commission calculation is accurate
  - Price validation prevents wholesale > retail

**Technical Details:**
- Use database computed columns for commission fields
- Implement pricing serializer per role using NestJS class-transformer groups
- Cache pricing calculations in Redis when listing packages
- Return 422 Unprocessable Entity for invalid pricing (wholesale > retail)

**NFRs Addressed:**
- NFR-3.7: Zero privilege escalation for cost_price access
- NFR-1.2: Pricing calculation <10ms overhead

---

### Story 4.4: Inclusions and Exclusions Management

As an **Agency Owner**,
I want to document what's included and excluded in each package,
So that jamaah have clear expectations and agents can answer questions.

**Acceptance Criteria:**

**Given** a package exists
**When** I add inclusions and exclusions
**Then** a `package_inclusions` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `package_id` (UUID, foreign key to packages)
  - `category` (ENUM: flight, accommodation, transportation, meals, visa, insurance, guide, other)
  - `description` (TEXT: "Round-trip flight Jakarta-Jeddah with Garuda Indonesia")
  - `is_included` (BOOLEAN: true for inclusion, false for exclusion)
  - `sort_order` (INTEGER: display order)
  - `created_at`, `updated_at`
**And** API endpoint `POST /api/v1/packages/:packageId/inclusions` creates inclusion/exclusion:
  - Accepts: category, description, is_included, sort_order
  - Validates category is from ENUM
  - Returns created record
**And** API endpoint `GET /api/v1/packages/:packageId/inclusions` returns:
  - All inclusions grouped by category
  - Separated into two lists: included and excluded
  - Sorted by sort_order within each category
  - Response structure:
  ```json
  {
    "inclusions": {
      "flight": ["Round-trip Jakarta-Jeddah", "Domestic flight Jeddah-Madinah"],
      "accommodation": ["4-star hotel in Makkah (5 nights)", "4-star hotel in Madinah (4 nights)"],
      "meals": ["Breakfast, Lunch, Dinner (halal)"],
      "visa": ["Umroh visa processing"],
      "insurance": ["Travel insurance up to $50,000"],
      "guide": ["Indonesian-speaking mutawif"],
      "other": ["Ziarah to holy sites"]
    },
    "exclusions": {
      "other": ["Personal expenses", "Tips for drivers and guides", "Additional luggage fees", "PCR test (if required)"]
    }
  }
  ```
**And** API endpoint `PATCH /api/v1/packages/:packageId/inclusions/:id` updates inclusion/exclusion
**And** API endpoint `DELETE /api/v1/packages/:packageId/inclusions/:id` removes item
**And** common inclusions can be bulk-added from template:
  - API endpoint `POST /api/v1/packages/:packageId/inclusions/from-template`
  - Accepts template_id (predefined templates: economy, standard, premium)
  - Copies all inclusions from template to package
**And** inclusion/exclusion list is:
  - Displayed on package detail page for all roles
  - Included in landing page generation (Epic 10)
  - Exported to PDF itinerary

**Technical Details:**
- Index on `(package_id, is_included, sort_order)` for efficient querying
- Use JSONB for flexible category expansion in future
- Frontend drag-and-drop to reorder inclusions (updates sort_order)
- Template system uses seeded data in database

**NFRs Addressed:**
- NFR-7.1: All categories and descriptions in Indonesian
- NFR-1.2: Inclusions fetch <100ms

---

### Story 4.5: Package Update Broadcasting to Agents

As an **Agency Owner**,
I want agents to be notified automatically when I update a package,
So that they always have the latest information to share with jamaah.

**Acceptance Criteria:**

**Given** a package is updated by Agency Owner
**When** changes are saved
**Then** a notification is broadcast to all agents in the tenant:
  - Notification sent via WebSocket (real-time if agent is online)
  - Notification saved to database for offline agents
  - Notification includes: package name, change summary, timestamp
**And** a `notifications` table stores broadcast messages:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `user_id` (UUID, nullable, foreign key - null = broadcast to all)
  - `role_filter` (VARCHAR array: ['agent', 'affiliate'] - target roles)
  - `title` (VARCHAR: "Package Update: Umroh Ramadhan 2025")
  - `message` (TEXT: "Retail price updated from Rp 25M to Rp 24M")
  - `action_url` (VARCHAR: `/packages/{id}` - deep link)
  - `notification_type` (ENUM: package_update, payment_reminder, document_alert, system_announcement)
  - `is_read` (BOOLEAN: default false)
  - `sent_via` (JSONB: {websocket: true, email: false, whatsapp: false})
  - `created_at`, `read_at`
**And** notification triggers are configured for package changes:
  - Price change (retail or wholesale)
  - Availability change (slots, status)
  - Itinerary updates
  - Inclusions/exclusions modified
  - Departure date change
**And** change detection compares old vs new values:
  - Uses TypeORM `@AfterUpdate()` hook on Package entity
  - Computes diff of changed fields
  - Generates human-readable change summary in Indonesian
**And** WebSocket broadcast:
  - Uses Socket.IO room: `tenant:{tenantId}:role:agent`
  - Emits event: `package.updated` with payload
  - Agents receive notification toast in real-time
**And** API endpoint `GET /api/v1/notifications` for agents:
  - Lists unread notifications (is_read = false)
  - Supports pagination
  - Marks as read: `PATCH /api/v1/notifications/:id/read`
**And** notification badge shows count of unread notifications in agent dashboard

**Technical Details:**
- Queue notification sending via BullMQ (non-blocking)
- Batch notifications if multiple changes in <5 seconds
- WebSocket room scoped by tenant + role for security
- Notification retention: 30 days (auto-deleted after)

**NFRs Addressed:**
- NFR-1.4: WebSocket notification latency <100ms
- NFR-4.8: Graceful degradation if WebSocket unavailable (DB fallback)

---

### Story 4.6: Package Versioning and Audit Trail

As an **Agency Owner**,
I want to track all changes made to packages,
So that I can audit package history and understand why changes were made.

**Acceptance Criteria:**

**Given** a package is created or updated
**When** changes occur
**Then** a `package_versions` table stores historical snapshots:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `package_id` (UUID, foreign key to packages)
  - `version_number` (INTEGER: auto-increment per package, starts at 1)
  - `snapshot` (JSONB: complete package data including itinerary, inclusions, pricing)
  - `changed_fields` (JSONB array: ["retail_price", "departure_date"])
  - `change_summary` (TEXT: "Updated retail price from Rp 25M to Rp 24M, Changed departure date from 2025-03-15 to 2025-03-20")
  - `changed_by_id` (UUID, foreign key to users)
  - `change_reason` (TEXT, nullable: optional reason provided by user)
  - `created_at` (TIMESTAMP: when version was created)
**And** version creation is automatic:
  - Triggered by `@AfterInsert()` and `@AfterUpdate()` hooks on Package entity
  - Version 1 created on package creation
  - New version created on any UPDATE operation
  - Snapshot includes full package JSON + related data (itinerary, inclusions)
**And** change detection identifies modified fields:
  - Compares previous version snapshot with current state
  - Stores array of changed field names
  - Generates human-readable change summary in Indonesian
**And** API endpoint `GET /api/v1/packages/:id/versions` returns version history:
  - All versions sorted by version_number DESC (newest first)
  - Each version shows: version number, change summary, changed by, timestamp
  - Pagination: 10 versions per page
**And** API endpoint `GET /api/v1/packages/:id/versions/:versionNumber` returns full snapshot:
  - Complete package state at that version
  - Allows comparison between versions
  - Read-only (cannot restore old versions in MVP)
**And** package update UI allows optional change reason:
  - Text field: "Reason for change" (optional)
  - Saved to package_versions.change_reason
  - Displayed in version history
**And** version history is displayed in package detail page:
  - "Version History" tab showing recent 5 changes
  - "View All" link to full version history page
  - Each version shows: who, when, what changed

**Technical Details:**
- Use PostgreSQL triggers for version snapshot creation (alternative to ORM hooks)
- JSONB snapshot allows point-in-time reconstruction
- Index on `(package_id, version_number DESC)` for history queries
- Compress old snapshots >90 days to save storage

**NFRs Addressed:**
- NFR-3.6: Full audit trail for all package changes
- NFR-8.1: Version history aids debugging and compliance

---

### Story 4.7: Agent View-Only Package Access

As an **Agent**,
I want to view packages assigned to my agency,
So that I can browse offerings to promote to prospective jamaah.

**Acceptance Criteria:**

**Given** I am logged in as Agent
**When** I access the package listing
**Then** API endpoint `GET /api/v1/packages` returns:
  - All published packages for my tenant (tenant_id match)
  - Filtered by status = "published" (draft packages hidden)
  - Includes wholesale_price and commission (per Story 4.3)
  - Sorted by departure_date ASC (soonest first)
**And** package cards display:
  - Package name and destination
  - Duration (e.g., "12 Days / 11 Nights")
  - Departure date
  - Retail price and wholesale price
  - Commission amount and percentage
  - Available slots (e.g., "15 slots remaining")
  - Status badge (Published, Sold Out)
**And** clicking a package opens detail view:
  - Full itinerary (day-by-day from Story 4.2)
  - Inclusions and exclusions (from Story 4.4)
  - Pricing breakdown (retail, wholesale, commission)
  - "Share Package" button (links to Epic 10 landing page generation)
  - No edit or delete buttons (view-only)
**And** agent filtering options:
  - Filter by month of departure
  - Filter by duration (7 days, 9 days, 12 days, etc.)
  - Filter by price range
  - Search by package name
**And** agents receive real-time updates:
  - WebSocket notification when package details change (Story 4.5)
  - Available slots auto-update when jamaah assigned
  - Status changes (Published → Sold Out) reflected immediately
**And** attempting to edit package shows message:
  - "Only Agency Owners can edit packages. Contact your admin to request changes."
**And** agents can export package details:
  - API endpoint `GET /api/v1/packages/:id/export?format=pdf`
  - Generates PDF with itinerary, inclusions, pricing
  - Used for sharing with prospective jamaah offline

**Technical Details:**
- Frontend: Next.js page with Tanstack Table for package listing
- Filter UI with shadcn/ui Select and DatePicker components
- PDF generation using puppeteer or similar library
- Cache package listing in Redis per agent (invalidate on updates)

**NFRs Addressed:**
- NFR-1.3: Package listing page load <2 seconds
- NFR-7.1: All UI labels and content in Indonesian
- NFR-7.2: Responsive design for mobile, tablet, desktop

---

## Epic 5: Agent Management & "My Jamaah" Dashboard

### Story 5.1: "My Jamaah" Dashboard Backend

As an **Agent**,
I want to view all jamaah assigned to me in a single dashboard,
So that I can track their progress and take necessary actions.

**Acceptance Criteria:**

**Given** jamaah are assigned to agents via Epic 3 (Story 3.5)
**When** I implement the dashboard backend
**Then** API endpoint `GET /api/v1/agents/my-jamaah` returns:
  - All jamaah assigned to the authenticated agent
  - Filtered by tenant_id and agent_id (from JWT token)
  - Includes computed status fields for each jamaah:
    - `document_status` (ENUM: complete, incomplete, pending_review)
    - `payment_status` (ENUM: paid_full, partial, overdue, not_started)
    - `approval_status` (ENUM: approved, pending, rejected, not_submitted)
    - `overall_status` (ENUM: ready_to_depart, in_progress, at_risk)
  - Response structure:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "full_name": "Ahmad Zainuddin",
        "package_name": "Umroh Ramadhan 2025",
        "departure_date": "2025-03-15",
        "document_status": "incomplete",
        "payment_status": "partial",
        "approval_status": "pending",
        "overall_status": "in_progress",
        "status_indicators": {
          "documents": "yellow",  // red/yellow/green
          "payments": "yellow",
          "approval": "yellow"
        },
        "assigned_at": "2024-12-01T10:00:00Z"
      }
    ],
    "meta": {
      "total": 45,
      "page": 1,
      "per_page": 20
    }
  }
  ```
**And** status computation logic:
  - **document_status**:
    - complete: All required documents uploaded and approved
    - incomplete: Missing one or more required documents
    - pending_review: All uploaded but awaiting admin review
  - **payment_status**:
    - paid_full: Total paid = package retail_price
    - partial: 0 < Total paid < retail_price AND no overdue installments
    - overdue: At least one installment past due date
    - not_started: No payments received
  - **approval_status**:
    - approved: Documents reviewed and approved by admin
    - pending: Documents uploaded awaiting review
    - rejected: One or more documents rejected
    - not_submitted: No documents uploaded yet
  - **overall_status**:
    - ready_to_depart: All documents approved + paid full + <7 days to departure
    - in_progress: Normal progress, no blockers
    - at_risk: Overdue payments OR rejected documents OR missing documents with <14 days to departure
**And** status_indicators color coding:
  - green: Complete/on-track
  - yellow: In progress/attention needed
  - red: Critical issue/overdue
**And** dashboard supports pagination:
  - Default 20 jamaah per page
  - Page, per_page query parameters
  - Total count returned in meta

**Technical Details:**
- Use PostgreSQL views or CTEs for status computation
- Cache computed statuses in Redis (TTL 5 minutes)
- Invalidate cache on document upload, payment receipt, approval change
- Index on `(agent_id, tenant_id, departure_date)` for fast queries

**NFRs Addressed:**
- NFR-1.3: Dashboard load <2 seconds even with 100+ assigned jamaah
- NFR-2.8: Redis caching for status computations

---

### Story 5.2: Status Indicators and Visual Cues

As an **Agent**,
I want to see red/yellow/green indicators for document, payment, and approval status,
So that I can quickly identify which jamaah need attention.

**Acceptance Criteria:**

**Given** the dashboard backend returns status_indicators (Story 5.1)
**When** I render the dashboard frontend
**Then** each jamaah card displays three status badges:
  - **Documents**: Icon with color (red/yellow/green)
  - **Payments**: Icon with color (red/yellow/green)
  - **Approval**: Icon with color (red/yellow/green)
**And** badge color rules:
  - **Documents**:
    - 🟢 Green: All required documents uploaded and approved
    - 🟡 Yellow: Documents uploaded but pending review
    - 🔴 Red: Missing documents or rejected
  - **Payments**:
    - 🟢 Green: Paid in full
    - 🟡 Yellow: Partial payment, on schedule
    - 🔴 Red: Overdue installment or no payment
  - **Approval**:
    - 🟢 Green: All documents approved
    - 🟡 Yellow: Awaiting admin review
    - 🔴 Red: One or more documents rejected
**And** hovering over badge shows tooltip:
  - Documents: "3/5 documents uploaded, 1 pending review"
  - Payments: "Rp 12M / Rp 25M paid, next due: 2025-01-15"
  - Approval: "Awaiting admin review for 2 documents"
**And** dashboard summary shows counts:
  - Total jamaah assigned
  - Ready to depart (green across all indicators)
  - Needs attention (any yellow or red indicator)
  - Critical issues (any red indicator)
**And** visual priority sorting:
  - Red indicators at top (most urgent)
  - Yellow indicators in middle
  - Green indicators at bottom
  - Within same color, sort by departure_date ASC
**And** clicking a status badge:
  - Navigates to relevant detail page
  - E.g., clicking Documents badge opens jamaah documents tab
  - Clicking Payments badge opens payment history
**And** status badges update in real-time:
  - WebSocket event when status changes
  - Badge color transitions with animation
  - Toast notification: "Ahmad's payment status updated to Paid Full"

**Technical Details:**
- Use shadcn/ui Badge component with custom color variants
- Icons: FileText (documents), DollarSign (payments), CheckCircle (approval)
- Framer Motion for smooth color transitions
- WebSocket subscription: `tenant:{tenantId}:agent:{agentId}:jamaah-status`

**NFRs Addressed:**
- NFR-7.5: Contextual tooltips for all status indicators
- NFR-1.3: Page render <2 seconds with smooth animations
- NFR-7.2: Responsive design - badges stack vertically on mobile

---

### Story 5.3: Jamaah Filtering System

As an **Agent**,
I want to filter my jamaah by actionable statuses like "Dokumen kurang", "Cicilan telat", "Ready to depart",
So that I can focus on tasks that need immediate attention.

**Acceptance Criteria:**

**Given** the dashboard displays all assigned jamaah
**When** I apply filters
**Then** filter UI shows predefined quick filters:
  - 🔴 **Dokumen Kurang** (Missing Documents): document_status = incomplete OR rejected
  - 🔴 **Cicilan Telat** (Overdue Payments): payment_status = overdue
  - 🟢 **Ready to Depart**: overall_status = ready_to_depart
  - 🟡 **Perlu Perhatian** (Needs Attention): overall_status = at_risk
  - ⏳ **Pending Review**: approval_status = pending
  - ✅ **Semua Lancar** (All Good): overall_status = in_progress AND all green indicators
**And** API endpoint `GET /api/v1/agents/my-jamaah?filter={filterName}` supports:
  - Query parameter: `filter` with values: missing_documents, overdue_payments, ready_to_depart, needs_attention, pending_review, all_good
  - Backend translates filter to database query:
    - `missing_documents` → WHERE document_status IN ('incomplete', 'rejected')
    - `overdue_payments` → WHERE payment_status = 'overdue'
    - `ready_to_depart` → WHERE overall_status = 'ready_to_depart'
    - `needs_attention` → WHERE overall_status = 'at_risk'
    - `pending_review` → WHERE approval_status = 'pending'
    - `all_good` → WHERE overall_status = 'in_progress' AND document_status = 'complete' AND payment_status IN ('paid_full', 'partial')
  - Returns filtered results with same structure as Story 5.1
**And** advanced filtering options:
  - Filter by package (dropdown: select package from assigned packages)
  - Filter by departure month (dropdown: January 2025, February 2025, etc.)
  - Filter by payment status (dropdown: paid full, partial, overdue, not started)
  - Filter by document status (dropdown: complete, incomplete, pending review)
  - Search by jamaah name (text input, case-insensitive partial match)
**And** multiple filters can be combined:
  - E.g., Package = "Umroh Ramadhan 2025" AND Status = "Cicilan Telat"
  - URL: `/api/v1/agents/my-jamaah?package_id=uuid&filter=overdue_payments`
  - Filters applied with AND logic
**And** filter state persisted:
  - Selected filters saved to localStorage
  - Restored on dashboard reload
  - "Clear All Filters" button resets to default view
**And** filter result count displayed:
  - "Showing 12 jamaah with overdue payments out of 45 total"
  - Badge on filter button shows count: "Cicilan Telat (12)"
**And** quick filter buttons show counts:
  - Dokumen Kurang (8)
  - Cicilan Telat (4)
  - Ready to Depart (15)
  - Counts update in real-time via WebSocket

**Technical Details:**
- Frontend: Shadcn/ui Tabs for quick filters, Command palette for advanced search
- Backend: Use query builder with dynamic WHERE clauses
- Cache filter counts in Redis (invalidate on status changes)
- URL state management with TanStack Router for shareable filtered views

**NFRs Addressed:**
- NFR-1.2: Filter query execution <200ms
- NFR-7.1: All filter labels in Indonesian
- NFR-7.7: Keyboard shortcut "Ctrl+F" to focus search

---

### Story 5.4: Bulk Operations Engine

As an **Agent**,
I want to select multiple jamaah and perform bulk actions like sending payment reminders,
So that I can efficiently manage many jamaah at once.

**Acceptance Criteria:**

**Given** the dashboard displays jamaah list
**When** I select multiple jamaah
**Then** bulk selection UI allows:
  - Checkbox on each jamaah card for individual selection
  - "Select All" checkbox in table header (selects all on current page)
  - "Select All Matching Filter" option (selects all results across pages)
  - Selected count displayed: "3 jamaah selected"
  - "Clear Selection" button
**And** bulk action menu appears when >0 jamaah selected:
  - Dropdown button "Bulk Actions" with options:
    - 📧 Send Payment Reminder
    - 📄 Request Missing Documents
    - 📊 Export to CSV
    - 🗑️ Unassign from Me (transfer to another agent)
**And** bulk action: **Send Payment Reminder**:
  - API endpoint `POST /api/v1/bulk-actions/send-payment-reminder`
  - Request body: `{ jamaah_ids: ["uuid1", "uuid2", "uuid3"] }`
  - Backend queues BullMQ job for each jamaah
  - Job sends notification via:
    - Email (if email exists)
    - WhatsApp (future: Epic 9)
    - In-app notification
  - Reminder template includes: jamaah name, outstanding amount, due date, payment link
  - Returns: `{ queued: 3, failed: 0 }`
  - Shows success toast: "Payment reminders sent to 3 jamaah"
**And** bulk action: **Request Missing Documents**:
  - API endpoint `POST /api/v1/bulk-actions/request-documents`
  - Request body: `{ jamaah_ids: ["uuid1", "uuid2"] }`
  - Backend identifies missing documents per jamaah
  - Sends notification listing required documents
  - Returns count of notifications sent
**And** bulk action: **Export to CSV**:
  - API endpoint `GET /api/v1/agents/my-jamaah/export?jamaah_ids=uuid1,uuid2,uuid3`
  - Generates CSV with columns: name, package, departure_date, document_status, payment_status, approval_status
  - Downloads file: `my-jamaah-export-2025-12-22.csv`
**And** bulk action: **Unassign from Me**:
  - Shows modal: "Transfer jamaah to another agent"
  - Dropdown to select new agent (within same tenant)
  - Confirmation: "Transfer 3 jamaah from [Me] to [Agent Name]?"
  - API endpoint `POST /api/v1/bulk-actions/transfer-jamaah`
  - Updates jamaah_assignments table
  - Sends notification to new agent
**And** bulk operations are queued:
  - Background processing with BullMQ
  - Progress indicator: "Sending reminders... 2/3 complete"
  - Notification when complete: "All reminders sent successfully"
  - Error handling: "2 succeeded, 1 failed. View details."
**And** bulk operation limits:
  - Maximum 50 jamaah per bulk action
  - If >50 selected, show warning: "Bulk actions limited to 50. Please refine your selection."

**Technical Details:**
- Use BullMQ for background job processing
- Queue: `bulk-actions` with concurrency 5
- Job retry: 3 attempts with exponential backoff
- Store job results for 24 hours for audit
- Frontend: Optimistic UI with rollback on error

**NFRs Addressed:**
- NFR-1.8: Bulk operations complete within 5 minutes
- NFR-2.9: Handle batch operations for 50 jamaah efficiently
- NFR-4.6: Auto-retry failed notification deliveries

---

### Story 5.5: Audit Trail for Agent Actions

As an **Agency Owner**,
I want to see an audit trail of all agent actions on behalf of jamaah,
So that I can ensure accountability and resolve disputes.

**Acceptance Criteria:**

**Given** agents perform actions on behalf of jamaah (upload documents, record payments, send messages)
**When** these actions occur
**Then** an `agent_actions_log` table records all activities:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `agent_id` (UUID, foreign key to users)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `action_type` (ENUM: document_upload, payment_record, message_sent, status_change, bulk_action, jamaah_assign)
  - `action_description` (TEXT: "Uploaded KTP for Ahmad Zainuddin")
  - `metadata` (JSONB: {document_type: "ktp", file_name: "ktp.jpg", file_size: 1024000})
  - `ip_address` (VARCHAR: agent's IP for security audit)
  - `user_agent` (VARCHAR: browser/device info)
  - `created_at` (TIMESTAMP)
**And** audit logging is automatic:
  - Middleware captures agent actions
  - Logs created asynchronously (non-blocking)
  - All actions on jamaah resources are logged
**And** API endpoint `GET /api/v1/audit/agent-actions` for Agency Owner:
  - Lists all agent actions across entire tenant
  - Filters by:
    - agent_id (specific agent)
    - jamaah_id (specific jamaah)
    - action_type (document_upload, payment_record, etc.)
    - date_range (from_date, to_date)
  - Pagination: 50 records per page
  - Sorted by created_at DESC (newest first)
**And** API endpoint `GET /api/v1/jamaah/:id/audit-trail` for detailed history:
  - All actions related to specific jamaah
  - Timeline view showing chronological events
  - Response includes:
  ```json
  {
    "jamaah_id": "uuid",
    "jamaah_name": "Ahmad Zainuddin",
    "audit_trail": [
      {
        "timestamp": "2024-12-22T10:30:00Z",
        "action": "Document uploaded by Agent Budi on behalf of Ahmad",
        "details": "KTP uploaded (ktp.jpg, 1MB)",
        "agent_name": "Budi Santoso",
        "ip_address": "103.10.67.123"
      },
      {
        "timestamp": "2024-12-20T14:15:00Z",
        "action": "Payment recorded by Agent Budi",
        "details": "Down payment Rp 5,000,000 received",
        "agent_name": "Budi Santoso",
        "ip_address": "103.10.67.123"
      }
    ]
  }
  ```
**And** audit trail displayed in jamaah detail page:
  - "Activity Log" tab showing recent 20 actions
  - Filter by action type
  - "View Full History" link for complete timeline
**And** audit log retention:
  - Logs retained for 2 years (compliance requirement)
  - Archived to cold storage after 1 year
  - Critical actions (payment, document approval) retained indefinitely
**And** audit log export:
  - API endpoint `GET /api/v1/audit/agent-actions/export?format=csv`
  - Filters apply to export
  - CSV includes all fields + agent name, jamaah name

**Technical Details:**
- Write audit logs to separate database table for performance isolation
- Use database triggers for automatic logging (alternative to middleware)
- Index on `(tenant_id, created_at DESC)` for fast queries
- Partition audit table by month for efficient archival

**NFRs Addressed:**
- NFR-3.6: Log all critical operations (FR-3.5 fulfilled)
- NFR-6.5: Data retention policies enforced
- NFR-11.7: Full transaction audit trail (from PRD FR-11.7)

---

### Story 5.6: Delegation System for Document Upload

As an **Agent**,
I want to delegate document upload access to my assigned jamaah,
So that they can upload their own documents while I track progress.

**Acceptance Criteria:**

**Given** I am an agent with assigned jamaah
**When** I enable delegation for a jamaah
**Then** API endpoint `POST /api/v1/jamaah/:id/delegate-access` grants upload permissions:
  - Request body: `{ delegate_to: "jamaah", permissions: ["upload_documents"] }`
  - Creates record in `delegated_permissions` table:
    - `id` (UUID, primary key)
    - `tenant_id` (UUID, foreign key to tenants)
    - `jamaah_id` (UUID, foreign key to jamaah)
    - `delegated_to_user_id` (UUID, foreign key to users - the jamaah user)
    - `delegated_by_agent_id` (UUID, foreign key to users - the agent)
    - `permission_type` (ENUM: upload_documents, view_payments, update_profile)
    - `is_active` (BOOLEAN: default true)
    - `expires_at` (TIMESTAMP, nullable: optional expiration)
    - `created_at`, `revoked_at`
  - Returns delegation details
**And** jamaah receives notification:
  - Email: "Your agent has granted you access to upload documents"
  - In-app notification with link to upload page
  - Instructions on required documents
**And** jamaah can upload documents:
  - Logs in with jamaah account
  - Navigates to "My Documents" page
  - Sees list of required documents: KTP, Passport, KK, Vaksin
  - Upload button for each document type
  - API endpoint `POST /api/v1/jamaah/me/documents` with file upload
  - Document saved with `uploaded_by_type = 'jamaah'` and `uploaded_by_id = jamaah_id`
**And** agent maintains oversight:
  - Dashboard shows documents uploaded by jamaah
  - Audit trail records: "KTP uploaded by Ahmad (self-upload)"
  - Agent can review and request re-upload if needed
**And** agent can revoke delegation:
  - API endpoint `DELETE /api/v1/jamaah/:id/delegate-access/:delegationId`
  - Sets `is_active = false` and `revoked_at = NOW()`
  - Jamaah loses upload permission immediately
  - Notification sent: "Document upload access has been revoked"
**And** delegation expires automatically:
  - If `expires_at` is set, permission auto-revokes after expiration
  - Cron job checks expired delegations daily
  - Jamaah notified before expiration: "Upload access expires in 3 days"
**And** delegation scope is limited:
  - Jamaah can only upload own documents
  - Cannot view other jamaah data
  - Cannot modify payment information
  - Cannot delete uploaded documents (only agent can delete)
**And** hybrid mode indicator:
  - Dashboard shows "Self-service enabled" badge on jamaah card
  - Toggle switch to enable/disable delegation quickly

**Technical Details:**
- Frontend: jamaah-facing upload page (simplified UI, mobile-optimized)
- File upload uses same S3 infrastructure as agent uploads
- Permission check middleware validates delegated_permissions before upload
- Cache active delegations in Redis: `tenant:{tenantId}:delegations:{jamaahId}`

**NFRs Addressed:**
- NFR-7.4: Jamaah can upload documents with minimal training
- NFR-3.5: Granular access control (jamaah only sees own data)
- NFR-1.3: Upload page loads <2 seconds on mobile

---

### Story 5.7: Hybrid Mode - Agent-Assisted and Self-Service

As an **Agent**,
I want to support both agent-assisted and self-service workflows,
So that tech-savvy jamaah can self-serve while others receive full assistance.

**Acceptance Criteria:**

**Given** delegation is enabled for some jamaah (Story 5.6)
**When** I manage mixed workflows
**Then** dashboard clearly indicates service mode per jamaah:
  - **Agent-Assisted**: Badge "Full Service" - agent handles all uploads and data entry
  - **Self-Service**: Badge "Self-Service" - jamaah uploads own documents, agent monitors
  - **Hybrid**: Badge "Hybrid" - mix of both (e.g., jamaah uploads, agent enters payments)
**And** service mode is configurable:
  - API endpoint `PATCH /api/v1/jamaah/:id/service-mode`
  - Request body: `{ mode: "agent_assisted" | "self_service" | "hybrid" }`
  - Updates jamaah record with preferred service mode
  - Automatically grants/revokes delegation based on mode
**And** agent can switch modes on-the-fly:
  - Dropdown on jamaah card: "Change Service Mode"
  - Options: Full Service, Self-Service, Hybrid
  - Confirmation dialog for mode change
  - Background: updates delegation permissions
**And** service mode affects UI presentation:
  - **Agent-Assisted**:
    - Agent sees full upload buttons
    - Jamaah sees read-only view (cannot upload)
    - All actions performed by agent
  - **Self-Service**:
    - Agent sees monitoring dashboard (read-only uploads, can request changes)
    - Jamaah sees full upload interface
    - Audit trail shows "self-upload"
  - **Hybrid**:
    - Agent sees upload buttons + indicator of self-uploaded items
    - Jamaah sees upload interface for documents only
    - Agent enters payment data manually
**And** service mode analytics:
  - API endpoint `GET /api/v1/analytics/service-modes` for Agency Owner
  - Returns breakdown: X% agent-assisted, Y% self-service, Z% hybrid
  - Tracks adoption rate of self-service over time
  - Helps optimize training and support efforts
**And** jamaah onboarding considers service mode:
  - During jamaah creation, agent selects initial service mode
  - Default: "Agent-Assisted" (safest for non-tech-savvy)
  - Agent can switch after onboarding based on jamaah comfort level
**And** notifications adapt to service mode:
  - Self-service jamaah receive: "Please upload your KTP document"
  - Agent-assisted jamaah receive: "Your agent will upload documents on your behalf"
**And** performance metrics per mode:
  - Average time to complete documentation:
    - Agent-assisted: X days
    - Self-service: Y days
    - Hybrid: Z days
  - Helps agents optimize workflow

**Technical Details:**
- Service mode stored as ENUM on jamaah entity: `service_mode`
- Frontend conditionally renders UI based on mode + role
- Use feature flags to gradually roll out self-service mode
- A/B testing framework to measure adoption and satisfaction

**NFRs Addressed:**
- NFR-7.4: >95% agent training completion (agents can explain both modes)
- NFR-7.1: Mode descriptions and tooltips in Indonesian
- NFR-2.2: System handles mix of 3,000 jamaah across all service modes

---

## Epic 6: Document Management with OCR Integration Stub

### Story 6.1: Document Entity and Upload Infrastructure

As a **developer**,
I want to create the document entity and file upload infrastructure,
So that jamaah and agents can upload required travel documents.

**Acceptance Criteria:**

**Given** the jamaah entity exists
**When** I implement document infrastructure
**Then** a `documents` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `document_type` (ENUM: ktp, passport, kartu_keluarga, vaksin)
  - `file_url` (VARCHAR: S3/cloud storage URL)
  - `file_size` (INTEGER: bytes)
  - `file_mime_type` (VARCHAR: image/jpeg, application/pdf)
  - `status` (ENUM: uploaded, pending_review, approved, rejected)
  - `uploaded_by_type` (ENUM: agent, jamaah, admin)
  - `uploaded_by_id` (UUID, foreign key to users)
  - `reviewed_by_id` (UUID, nullable, foreign key to users)
  - `reviewed_at` (TIMESTAMP, nullable)
  - `rejection_reason` (TEXT, nullable)
  - `extracted_data` (JSONB, nullable: OCR results)
  - `created_at`, `updated_at`
**And** file upload service integrates with S3-compatible storage
**And** upload endpoint validates file type (JPEG, PNG, PDF only)
**And** maximum file size is 5MB per document
**And** file naming convention: `{tenantId}/{jamaahId}/{documentType}/{uuid}.{ext}`
**And** files are served with pre-signed URLs (15-minute expiry)
**And** document list endpoint returns documents grouped by type

**Technical Requirements:**
- AWS SDK or MinIO for object storage
- Multer for file upload handling
- Sharp library for image optimization
- Pre-signed URL generation for secure access

**Files Created/Modified:**
- `src/modules/documents/entities/document.entity.ts` (new)
- `src/modules/documents/documents.controller.ts` (new)
- `src/modules/documents/documents.service.ts` (new)
- `src/modules/documents/services/storage.service.ts` (new)
- `src/database/migrations/XXXXXX-CreateDocumentsTable.ts` (new)

**Validation:**
- POST `/api/v1/documents/upload` with multipart form uploads file to S3
- Database record created with file_url pointing to S3
- GET `/api/v1/documents/{id}/download` returns pre-signed URL
- Attempting to upload 6MB file returns 400 validation error

---

### Story 6.2: Single Document Upload

As a **jamaah or agent**,
I want to upload a single document (KTP/Passport/KK/Vaksin),
So that I can submit required travel documents.

**Acceptance Criteria:**

**Given** I am authenticated as jamaah or agent
**When** I upload a document
**Then** the upload form displays:
  - Document type selector (KTP, Passport, Kartu Keluarga, Vaksin)
  - File picker (accepts image/* and application/pdf)
  - "Upload" button
**And** selecting file shows preview (image thumbnail or PDF icon)
**And** clicking "Upload" sends file to `/api/v1/jamaah/{id}/documents/upload`
**And** progress bar shows upload percentage
**And** successful upload displays:
  - Success toast: "KTP berhasil diupload"
  - Document appears in document list with status "Pending Review"
  - File preview available
**And** upload failure displays clear error in Indonesian
**And** duplicate document type shows warning: "KTP sudah ada. Upload ulang?"
**And** replacing existing document soft-deletes old version and creates new record
**And** agent uploading on behalf of jamaah shows in audit trail

**Technical Requirements:**
- Frontend: react-dropzone for file picker
- Progress tracking with XMLHttpRequest
- Image compression before upload (max 1920px width)
- Duplicate detection by (jamaah_id, document_type, status != 'rejected')

**Files Created/Modified:**
- `frontend/src/components/DocumentUpload.tsx` (new)
- `frontend/src/hooks/useDocumentUpload.ts` (new)
- `src/modules/documents/dto/upload-document.dto.ts` (new)

**Validation:**
- Upload KTP image → appears in list with "Pending Review" status
- Upload duplicate KTP → confirmation modal shown
- Confirm replacement → old document soft-deleted, new document created
- Upload as agent → audit log shows "Uploaded by Agent X on behalf of Jamaah Y"

---

### Story 6.3: ZIP Batch Upload with Background Processing

As an **agent**,
I want to upload a ZIP file containing multiple jamaah documents,
So that I can efficiently process large batches (100+ documents).

**Acceptance Criteria:**

**Given** I am an agent with many assigned jamaah
**When** I upload a ZIP batch
**Then** batch upload page provides:
  - ZIP file picker (max 100MB)
  - Instructions: "Name files as: {JamaahName}-KTP.jpg, {JamaahName}-Passport.pdf"
  - "Upload Batch" button
**And** clicking upload triggers:
  - File uploaded to temporary storage
  - BullMQ job queued: `batch-document-processing`
  - Job ID returned to frontend
  - "Processing..." status displayed
**And** background job:
  - Extracts ZIP contents
  - Parses filenames to match jamaah and document type
  - Uploads each file to permanent storage
  - Creates document records
  - Reports errors for unmatched files
**And** I receive progress updates via WebSocket:
  - "Processing... 25/100 files (25%)"
  - Estimated time remaining
**And** upon completion:
  - Email sent with summary: "95 documents uploaded successfully, 5 failed"
  - Failed files listed with reasons in CSV report
**And** I can download error report and re-upload failed files

**Technical Requirements:**
- AdmZip or yauzl for ZIP extraction
- BullMQ job with progress tracking
- WebSocket events: `batch.progress`, `batch.completed`
- Filename parsing regex: `^(.+)-(KTP|Passport|KK|Vaksin)\.(jpg|jpeg|png|pdf)$`

**Files Created/Modified:**
- `src/modules/documents/jobs/batch-processing.job.ts` (new)
- `src/modules/documents/services/batch-processor.service.ts` (new)
- `frontend/src/pages/agent/documents/batch-upload.tsx` (new)
- `frontend/src/components/BatchUploadProgress.tsx` (new)

**Validation:**
- Upload ZIP with 100 files → job queued
- WebSocket shows progress updates every 10 files
- Email received with summary after completion
- Failed files CSV lists errors clearly

---

### Story 6.4: Admin Document Review Interface

As an **admin**,
I want to review uploaded documents and extracted OCR data,
So that I can approve accurate documents or correct errors.

**Acceptance Criteria:**

**Given** documents have been uploaded with status "pending_review"
**When** I access the document review interface
**Then** I see a queue of pending documents with:
  - Document image/PDF preview (left panel)
  - Extracted data form (right panel)
  - Document type indicator
  - Jamaah name and package
  - Uploaded by and upload date
**And** for KTP, extracted data fields include:
  - NIK, Full Name, Place of Birth, Date of Birth, Gender, Address, Province, City
**And** for Passport:
  - Passport Number, Full Name, Nationality, Date of Birth, Expiry Date
**And** I can edit any field if OCR is incorrect
**And** I can mark fields as "Verified" with checkmark
**And** action buttons available:
  - "Approve" (green) - sets status to 'approved'
  - "Reject" (red) - opens rejection reason modal
  - "Skip" - moves to next document
**And** keyboard shortcuts: A (approve), R (reject), S (skip) for efficiency
**And** approved documents notify jamaah and agent via email
**And** rejected documents require reason and send notification

**Technical Requirements:**
- Split-panel UI layout
- Keyboard event listeners for shortcuts
- Form autosave every 30 seconds
- Image zoom functionality for details

**Files Created/Modified:**
- `frontend/src/pages/admin/documents/review/index.tsx` (new)
- `frontend/src/components/DocumentReviewPanel.tsx` (new)
- `frontend/src/components/OcrDataForm.tsx` (new)
- `src/modules/documents/dto/review-document.dto.ts` (new)

**Validation:**
- Document queue displays pending documents
- Edit NIK field → autosaved after 30 seconds
- Press "A" key → document approved
- Approve document → status changes to 'approved'
- Jamaah receives email: "Your KTP has been approved"

---

### Story 6.5: Bulk Approval System

As an **admin**,
I want to approve multiple documents at once,
So that I can efficiently process high volumes.

**Acceptance Criteria:**

**Given** multiple documents are pending review
**When** I perform bulk approval
**Then** document review page includes:
  - Checkbox on each document row
  - "Select All" checkbox in header
  - Bulk action bar when items selected
**And** bulk action bar displays:
  - "X documents selected"
  - "Approve All" button (green)
  - "Reject All" button (red)
  - "Deselect" button
**And** clicking "Approve All" opens confirmation:
  - Lists selected jamaah and document types
  - "Confirm Approve (X documents)" button
**And** confirmation triggers:
  - BullMQ job for bulk approval
  - Updates all selected documents to 'approved'
  - Sends individual notifications to each jamaah
  - Creates audit log entries
**And** progress shown via toast: "Approving 50 documents..."
**And** completion toast: "50 documents approved successfully"
**And** I can filter by document type and approve all KTPs, then all Passports, etc.
**And** maximum 100 documents can be bulk approved at once

**Technical Requirements:**
- Multi-select state management
- BullMQ job: `bulk-approve-documents`
- Transaction ensures all-or-nothing approval
- Rate-limited notifications (batch email sending)

**Files Created/Modified:**
- `frontend/src/components/BulkDocumentActions.tsx` (new)
- `src/modules/documents/jobs/bulk-approval.job.ts` (new)
- `src/modules/documents/services/bulk-approval.service.ts` (new)

**Validation:**
- Select 50 documents → bulk action bar appears
- Click "Approve All" → confirmation modal
- Confirm → job queued and processed
- All 50 documents status changed to 'approved'
- All 50 jamaah receive approval email

---

### Story 6.6: OCR Integration Stub with "Coming Soon" Badge

As a **product owner**,
I want OCR integration marked as "Coming Soon" for MVP,
So that users know the feature is planned but not yet implemented.

**Acceptance Criteria:**

**Given** the document upload feature exists
**When** a user views document-related features
**Then** any UI mentioning "Auto-extract" or "OCR" displays:
  - "Coming Soon" badge (blue/yellow)
  - Tooltip: "Automatic data extraction will be available in Phase 2 with Verihubs OCR integration"
**And** document upload page shows:
  - Manual data entry form (enabled)
  - "Auto-Extract from KTP" button (disabled with "Coming Soon" badge)
**And** admin review page shows:
  - Manual review interface (enabled)
  - "OCR Confidence Score" section (grayed out with "Coming Soon")
**And** API endpoint `/api/v1/documents/{id}/ocr` returns:
  ```json
  {
    "error": {
      "message": "OCR integration coming soon. Currently in development for Phase 2.",
      "code": "FEATURE_NOT_AVAILABLE",
      "statusCode": 501
    }
  }
  ```
**And** README documents OCR as Phase 2 feature with Verihubs integration details

**Technical Requirements:**
- HTTP 501 Not Implemented for OCR endpoints
- Feature flag: `FEATURE_OCR_ENABLED=false` in .env
- Badge component: `<ComingSoonBadge feature="OCR Auto-Extract" />`

**Files Created/Modified:**
- `frontend/src/components/ComingSoonBadge.tsx` (new)
- `src/modules/documents/documents.controller.ts` (modified - OCR endpoint stub)
- `README.md` (modified - document Phase 2 features)

**Validation:**
- Document upload page shows "Coming Soon" badge on Auto-Extract button
- Button is disabled and non-clickable
- Tooltip displays integration roadmap message
- API returns 501 with clear message

---

## Epic 7: Payment Gateway & Financial Operations

### Story 7.1: Payment Entity and Manual Entry

As an **admin or agent**,
I want to manually record payments received from jamaah,
So that I can track payment status even before auto-reconciliation is implemented.

**Acceptance Criteria:**

**Given** a jamaah has made a payment
**When** I record the payment manually
**Then** a `payments` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `package_id` (UUID, foreign key to packages)
  - `amount` (DECIMAL(12,2), required)
  - `payment_method` (ENUM: bank_transfer, virtual_account, cash, other)
  - `payment_type` (ENUM: dp, installment, full_payment)
  - `status` (ENUM: pending, confirmed, cancelled, refunded)
  - `reference_number` (VARCHAR: bank transaction reference)
  - `payment_date` (TIMESTAMP, required)
  - `notes` (TEXT, nullable)
  - `recorded_by_id` (UUID, foreign key to users)
  - `created_at`, `updated_at`
**And** I can create payment via form:
  - Select jamaah (dropdown)
  - Amount (IDR)
  - Payment method dropdown
  - Payment type (DP, Installment, Full Payment)
  - Reference number (optional)
  - Payment date picker
  - Notes (optional)
**And** form validates:
  - Amount > 0
  - Payment date <= today
  - Reference number format (if provided)
**And** submitting creates payment record with status 'confirmed'
**And** jamaah payment_status updates automatically:
  - Total paid < package price → 'partial'
  - Total paid >= package price → 'paid'
**And** notification sent to jamaah: "Pembayaran Rp 5.000.000 telah dikonfirmasi"

**Technical Requirements:**
- Decimal precision for currency (12,2)
- Automatic payment status calculation
- Transaction ensures payment record + jamaah status update are atomic

**Files Created/Modified:**
- `src/modules/payments/entities/payment.entity.ts` (new)
- `src/modules/payments/payments.controller.ts` (new)
- `src/modules/payments/payments.service.ts` (new)
- `src/database/migrations/XXXXXX-CreatePaymentsTable.ts` (new)
- `frontend/src/components/PaymentForm.tsx` (new)

**Validation:**
- POST `/api/v1/payments` creates payment record
- Jamaah paid 10M of 30M package → status 'partial'
- Jamaah paid 30M total → status 'paid'
- Jamaah receives email confirmation

---

### Story 7.2: Installment Tracking System

As an **admin**,
I want to track installment schedules with due dates,
So that I know when payments are expected and can follow up on late payments.

**Acceptance Criteria:**

**Given** a jamaah is paying in installments
**When** I create an installment schedule
**Then** a `payment_schedules` table is created with fields:
  - `id` (UUID, primary key)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `installment_number` (INTEGER: 1, 2, 3...)
  - `due_date` (DATE, required)
  - `amount` (DECIMAL(12,2), required)
  - `status` (ENUM: pending, paid, overdue, waived)
  - `paid_at` (TIMESTAMP, nullable)
  - `payment_id` (UUID, nullable, foreign key to payments)
**And** installment schedule form allows:
  - Package total price display
  - DP amount input
  - Number of installments selector (1-12)
  - Auto-calculate installment amounts (remaining / n)
  - Adjust due dates (monthly default)
  - Custom amounts per installment
**And** schedule generation creates multiple rows in payment_schedules
**And** when payment is recorded, system auto-matches to nearest pending installment
**And** dashboard displays installment calendar:
  - Color-coded by status (green: paid, yellow: due soon, red: overdue)
  - Click installment to record payment
  - Filter by jamaah or date range
**And** cron job runs daily to mark overdue installments (due_date < today AND status = 'pending')

**Technical Requirements:**
- Installment calculation algorithm
- Payment matching logic (by jamaah_id and nearest due_date)
- Cron job: `@daily` update overdue statuses
- Calendar UI component (react-big-calendar)

**Files Created/Modified:**
- `src/modules/payments/entities/payment-schedule.entity.ts` (new)
- `src/modules/payments/services/installment.service.ts` (new)
- `src/database/migrations/XXXXXX-CreatePaymentSchedulesTable.ts` (new)
- `src/modules/payments/jobs/update-overdue.job.ts` (new)
- `frontend/src/components/InstallmentCalendar.tsx` (new)

**Validation:**
- Create schedule: 30M package, 5M DP, 5 installments → generates 5 records of 5M each
- Due dates set to 1st of each month starting next month
- Record 5M payment → first installment marked 'paid'
- Cron runs → installments past due date marked 'overdue'

---

### Story 7.3: Payment Reminder Scheduler

As a **system**,
I want to send automated payment reminders 3 days before installment due dates,
So that jamaah are reminded to pay on time and reduce late payments.

**Acceptance Criteria:**

**Given** installment schedules exist
**When** reminder scheduler runs
**Then** BullMQ cron job runs daily at 09:00 WIB:
  - Query all installments where due_date = today + 3 days AND status = 'pending'
  - For each installment, queue reminder job
**And** reminder job sends:
  - Email to jamaah with subject: "Reminder: Cicilan Umroh Jatuh Tempo 3 Hari Lagi"
  - Email includes:
    - Installment number and amount
    - Due date
    - Payment instructions (bank account details)
    - "Bayar Sekarang" button (links to payment portal)
  - Copy to assigned agent
  - WhatsApp message (if Phase 2 integration active)
**And** reminder is logged in `payment_reminders` table:
  - `installment_id`, `sent_at`, `channel` (email/whatsapp/both)
**And** reminder not sent if already paid
**And** reminder not sent if already sent within 24 hours (no spam)
**And** admin can manually trigger reminder for specific installment

**Technical Requirements:**
- Cron expression: `0 9 * * *` (09:00 daily)
- Email template in Indonesian with payment details
- Deduplication check (sent_at within 24 hours)
- Manual trigger endpoint: POST `/api/v1/payments/schedules/{id}/remind`

**Files Created/Modified:**
- `src/modules/payments/jobs/reminder-scheduler.job.ts` (new)
- `src/modules/payments/entities/payment-reminder.entity.ts` (new)
- `src/modules/payments/templates/reminder-email.hbs` (new - Handlebars template)
- `src/database/migrations/XXXXXX-CreatePaymentRemindersTable.ts` (new)

**Validation:**
- Set installment due_date to 3 days from now → reminder sent at 09:00 next day
- Email received with correct amount and due date
- payment_reminders table has record
- Trigger reminder again within 24 hours → blocked with message "Reminder already sent"

---

### Story 7.4: Commission Calculation Engine

As a **system**,
I want to automatically calculate agent commissions based on confirmed payments,
So that commission payouts are accurate and transparent.

**Acceptance Criteria:**

**Given** an agent has sold packages and payments are confirmed
**When** commission is calculated
**Then** a `commissions` table is created with fields:
  - `id` (UUID, primary key)
  - `tenant_id` (UUID, foreign key to tenants)
  - `agent_id` (UUID, foreign key to users)
  - `jamaah_id` (UUID, foreign key to jamaah)
  - `payment_id` (UUID, foreign key to payments)
  - `base_amount` (DECIMAL(12,2): payment amount)
  - `commission_percentage` (DECIMAL(5,2): e.g., 16.00)
  - `commission_amount` (DECIMAL(12,2): calculated)
  - `status` (ENUM: pending, approved, paid, cancelled)
  - `created_at`, `updated_at`
**And** commission is auto-calculated when payment status = 'confirmed':
  - Calculate: payment.amount * (package.wholesale_price / package.retail_price)
  - Commission = payment.amount - wholesale_cost
  - Or use fixed commission_percentage from agent settings
**And** commission record created with status 'pending'
**And** agent dashboard displays:
  - Total commissions this month
  - Pending commissions (not yet paid)
  - Paid commissions (historical)
  - Commission breakdown per jamaah
**And** admin can approve/reject commissions
**And** approved commissions ready for payout (Story 7.6)

**Technical Requirements:**
- Trigger/subscriber creates commission record on payment confirmed
- Commission calculation respects retail vs wholesale pricing
- Support both percentage and fixed amount commission models

**Files Created/Modified:**
- `src/modules/commissions/entities/commission.entity.ts` (new)
- `src/database/migrations/XXXXXX-CreateCommissionsTable.ts` (new)
- `src/database/subscribers/commission.subscriber.ts` (new - auto-create on payment)
- `frontend/src/pages/agent/commissions/index.tsx` (new)

**Validation:**
- Confirm 10M payment for package (retail 30M, wholesale 25M) → commission 5M created
- Commission record has status 'pending'
- Agent dashboard shows 5M in "Pending Commissions"

---

### Story 7.5: Multi-Level Commission Splits

As a **system**,
I want to split commissions across multi-level agent hierarchy,
So that agents, affiliates, and sub-affiliates all receive their appropriate share.

**Acceptance Criteria:**

**Given** agent hierarchy exists (Agent → Affiliate → Sub-Affiliate)
**When** a sale is made by Sub-Affiliate
**Then** commission split calculation:
  - Total commission = 16% of retail price
  - Sub-Affiliate (seller) = 10%
  - Affiliate (parent) = 4%
  - Agent (grandparent) = 2%
**And** split percentages are configurable per tenant in `commission_rules` table
**And** commission calculation creates multiple records:
  - Commission for Sub-Affiliate (10%)
  - Commission for Affiliate (4%)
  - Commission for Agent (2%)
**And** each commission record references:
  - Direct agent_id (who receives commission)
  - Original sale agent_id (Sub-Affiliate)
  - Hierarchy level (1 = direct, 2 = parent, 3 = grandparent)
**And** commission dashboard shows:
  - Direct sales commissions
  - Downline commissions (from team sales)
  - Total = Direct + Downline
**And** split rules validate: total split percentages <= 100%

**Technical Requirements:**
- Recursive query to traverse agent hierarchy
- Commission rules table with configurable splits
- Commission record includes `level` field

**Files Created/Modified:**
- `src/modules/commissions/services/commission-splitter.service.ts` (new)
- `src/modules/tenants/entities/commission-rules.entity.ts` (new)
- `src/database/migrations/XXXXXX-CreateCommissionRulesTable.ts` (new)

**Validation:**
- Sub-Affiliate sells package → 3 commission records created
- Sub-Affiliate commission = 10% of total
- Affiliate commission = 4% of total
- Agent commission = 2% of total
- Sum of splits = 16% = total commission

---

### Story 7.6: Batch Commission Payout System

As an **admin**,
I want to pay commissions to 200+ agents in a single batch,
So that monthly payouts are efficient and trackable.

**Acceptance Criteria:**

**Given** approved commissions exist for multiple agents
**When** I initiate batch payout
**Then** batch payout page displays:
  - Filter by date range (default: last month)
  - List of agents with approved commissions
  - Total payout amount per agent
  - "Select All" checkbox
  - "Generate Payout Batch" button
**And** clicking "Generate Payout Batch" creates:
  - `commission_payouts` table record:
    - `id`, `tenant_id`, `payout_date`, `total_amount`, `status`, `created_by_id`
  - `commission_payout_items` table records for each agent:
    - `payout_id`, `agent_id`, `amount`, `bank_account`, `status`
  - CSV export with columns: Agent Name, Bank Account, Amount
**And** CSV can be imported into bank's bulk transfer system
**And** after bank transfer completed:
  - Admin uploads bank confirmation file
  - System marks payout status as 'paid'
  - All commission records update to status 'paid'
  - Agents receive email: "Komisi Rp 5.000.000 telah ditransfer"
**And** payout history is viewable with audit trail

**Technical Requirements:**
- CSV generation with proper encoding (UTF-8 BOM for Excel)
- Bank account validation (stored in user profile)
- File upload for bank confirmation

**Files Created/Modified:**
- `src/modules/commissions/entities/commission-payout.entity.ts` (new)
- `src/modules/commissions/entities/commission-payout-item.entity.ts` (new)
- `src/modules/commissions/services/payout.service.ts` (new)
- `frontend/src/pages/admin/payouts/index.tsx` (new)
- `src/database/migrations/XXXXXX-CreatePayoutTables.ts` (new)

**Validation:**
- Select 200 agents with approved commissions → total calculated
- Generate batch → CSV downloaded
- Upload bank confirmation → all commissions marked 'paid'
- All 200 agents receive email notification

---

### Story 7.7: Payment Audit Trail

As a **compliance officer**,
I want complete payment audit trail with all transaction details,
So that I can ensure financial transparency and regulatory compliance.

**Acceptance Criteria:**

**Given** payment transactions occur
**When** I access payment audit trail
**Then** all payment operations are logged in `audit_logs` table:
  - Payment created (who, when, amount, jamaah)
  - Payment confirmed (who confirmed, reference number)
  - Payment cancelled (who cancelled, reason)
  - Commission calculated (amount, split details)
  - Commission paid (payout batch ID, bank reference)
**And** audit trail UI displays:
  - Timeline view of all payment events
  - Filterable by jamaah, agent, date range
  - Searchable by reference number
  - Exportable to PDF for reports
**And** each entry shows:
  - Timestamp (ISO 8601)
  - Actor (user who performed action)
  - Action type
  - Before/after values (for updates)
  - IP address
  - User agent
**And** audit logs are immutable (cannot be deleted)
**And** retention period: 7 years for compliance
**And** admin can generate financial reports:
  - Monthly revenue report
  - Commission payout report
  - Outstanding payments report

**Technical Requirements:**
- Audit subscriber captures all payment entity changes
- Read-only API endpoints (no DELETE)
- PDF generation library (Puppeteer or PDFKit)
- Indexed on (tenant_id, entity_type, created_at)

**Files Created/Modified:**
- `src/modules/audit/services/payment-audit.service.ts` (new)
- `frontend/src/pages/admin/audit/payments/index.tsx` (new)
- `frontend/src/components/PaymentTimeline.tsx` (new)

**Validation:**
- Create payment → audit log entry created
- Confirm payment → second audit entry with status change
- Query audit trail by jamaah_id → returns all payment events
- Export to PDF → generates formatted report

---

### Story 7.8: Virtual Account Integration Stub with "Coming Soon" Badge

As a **product owner**,
I want Virtual Account integration marked as "Coming Soon" for MVP,
So that users know auto-reconciliation is planned but manual entry works now.

**Acceptance Criteria:**

**Given** payment features exist with manual entry
**When** a user views payment-related features
**Then** any UI mentioning "Auto-Reconciliation" or "Virtual Account" displays:
  - "Coming Soon" badge
  - Tooltip: "Automatic payment reconciliation with BCA, BSI, BNI, Mandiri Virtual Accounts will be available in Phase 2"
**And** payment page shows:
  - Manual payment entry (enabled)
  - "Virtual Account" payment method in dropdown (disabled with "Coming Soon" badge)
**And** admin dashboard shows:
  - Manual reconciliation interface (enabled)
  - "Auto-Reconciliation" section (grayed out with "Coming Soon")
**And** API endpoint `/api/v1/payments/virtual-account` returns:
  ```json
  {
    "error": {
      "message": "Virtual Account integration coming soon. Phase 2 will include BCA, BSI, BNI, Mandiri.",
      "code": "FEATURE_NOT_AVAILABLE",
      "statusCode": 501
    }
  }
  ```
**And** documentation lists supported banks for Phase 2

**Technical Requirements:**
- HTTP 501 for VA endpoints
- Feature flag: `FEATURE_VIRTUAL_ACCOUNT_ENABLED=false`
- Payment method dropdown shows disabled VA options

**Files Created/Modified:**
- `src/modules/payments/payments.controller.ts` (modified - VA stub endpoints)
- `frontend/src/components/PaymentMethodSelector.tsx` (modified - show disabled VA)
- `README.md` (modified - document Phase 2 payment integrations)

**Validation:**
- Payment form shows "Virtual Account (Coming Soon)" option
- Option is disabled and non-selectable
- Tooltip explains Phase 2 timeline
- API returns 501 with feature roadmap

---

(Continuing with remaining epics 8-15 in next message due to length...)

## Epic 8: Real-Time Communication Infrastructure

### Story 8.1: Socket.IO Server Setup with Tenant Isolation

As a **developer**,
I want Socket.IO configured with tenant-isolated rooms,
So that real-time events only reach users within the same tenant.

**Acceptance Criteria:**
- Socket.IO 4.7+ server integrated with NestJS
- WebSocket gateway with JWT authentication
- Tenant rooms created: `tenant:{tenantId}`
- Connection event auto-joins user to their tenant room
- Cross-tenant event broadcasting blocked
- Connection tracking in Redis
- Reconnection logic with exponential backoff

**Files Created/Modified:**
- `src/modules/websocket/websocket.gateway.ts` (new)
- `src/modules/websocket/websocket.module.ts` (new)
- `src/main.ts` (modified - enable WebSocket)

---

### Story 8.2: WebSocket Authentication

As a **system**,
I want to authenticate WebSocket connections using JWT tokens,
So that only authorized users receive real-time updates.

**Acceptance Criteria:**
- JWT token validated on WebSocket handshake
- Token extracted from connection headers or query params
- Invalid token rejects connection with 401
- Token includes tenant_id claim
- User context stored in socket.data
- Middleware validates permissions for event subscriptions

**Files Created/Modified:**
- `src/modules/websocket/middleware/ws-auth.middleware.ts` (new)
- `src/modules/websocket/guards/ws-permissions.guard.ts` (new)

---

### Story 8.3: Real-Time Event Broadcasting

As a **system**,
I want to broadcast events in real-time to connected clients,
So that dashboards update instantly without page refresh.

**Acceptance Criteria:**
- Event types: `jamaah.updated`, `payment.received`, `document.approved`, `package.updated`
- Events published to tenant room only
- Event payload includes entity ID and changes
- Frontend subscribes to events with useWebSocket hook
- Auto-refresh components on event received
- Event history stored for reconnecting clients (last 100 events)

**Files Created/Modified:**
- `src/modules/websocket/events/*.events.ts` (new - event emitters)
- `frontend/src/hooks/useWebSocket.ts` (new)
- `frontend/src/hooks/useRealtimeData.ts` (new)

---

### Story 8.4: BullMQ Background Job Infrastructure

As a **developer**,
I want BullMQ configured for background job processing,
So that long-running tasks don't block API responses.

**Acceptance Criteria:**
- BullMQ 5.0+ integrated with Redis
- Job queues created: `email`, `notifications`, `batch-processing`, `reports`
- Job dashboard accessible at `/admin/jobs`
- Retry logic: 3 attempts with exponential backoff
- Job completion triggers WebSocket event
- Failed jobs logged to Sentry
- Job metrics tracked (success rate, avg duration)

**Files Created/Modified:**
- `src/modules/queue/queue.module.ts` (new)
- `src/modules/queue/processors/*.processor.ts` (new)
- `src/config/bull.config.ts` (new)

---

### Story 8.5: Redis Caching with Tenant Scoping

As a **developer**,
I want Redis caching with tenant-scoped keys,
So that cache performance is maximized without cross-tenant leaks.

**Acceptance Criteria:**
- Redis 7+ configured with cache-manager
- Cache key format: `tenant:{tenantId}:{resource}:{id}`
- Commonly cached data: packages, user permissions, tenant settings
- TTL defaults: 5 minutes (permissions), 15 minutes (packages), 1 hour (settings)
- Cache invalidation on entity update
- Cache hit rate monitoring
- Cache warm-up on tenant login

**Files Created/Modified:**
- `src/modules/cache/cache.module.ts` (new)
- `src/modules/cache/services/tenant-cache.service.ts` (new)
- `src/config/redis.config.ts` (new)

---

## Epic 9: AI Chatbot & WhatsApp Integration Stubs

### Story 9.1: Chatbot UI Placeholder with "Coming Soon" Badge

As a **user**,
I want to see where the AI chatbot will be located,
So that I know the feature is planned.

**Acceptance Criteria:**
- Chat icon in bottom-right corner of all pages
- Clicking shows modal with "Coming Soon" message
- Modal explains: "AI Chatbot with 3 modes (Public/Agent/Admin) coming in Phase 2"
- Modal includes feature preview screenshots
- Feature request form allows users to suggest chatbot queries
- "Notify Me" button collects email for launch announcement

**Files Created/Modified:**
- `frontend/src/components/ChatbotPlaceholder.tsx` (new)
- `frontend/src/pages/api/chatbot/notify-me.ts` (new - API route)

---

### Story 9.2: WhatsApp Integration Stub with "Coming Soon" Badge

As a **user**,
I want to see WhatsApp features marked as coming soon,
So that I understand future integration plans.

**Acceptance Criteria:**
- Settings page shows "WhatsApp Integration" section (disabled)
- Section explains: "Connect WhatsApp Business API in Phase 2"
- "Coming Soon" badge on all WhatsApp-related features
- Features listed: Bidirectional messaging, payment reminders, broadcast, chatbot integration
- Link to WhatsApp Business API documentation

**Files Created/Modified:**
- `frontend/src/pages/settings/integrations.tsx` (new)
- `src/modules/whatsapp/whatsapp.controller.ts` (new - stub returning 501)

---

### Story 9.3: Future Integration Documentation

As a **developer**,
I want comprehensive documentation for Phase 2 integrations,
So that implementation is straightforward when started.

**Acceptance Criteria:**
- `docs/integrations/chatbot.md` created with:
  - NLP provider options (Dialogflow, Rasa, OpenAI)
  - Multi-mode architecture design
  - Knowledge base sync strategy
  - Sample conversation flows
- `docs/integrations/whatsapp.md` created with:
  - WhatsApp Business API setup guide
  - Template message approval process
  - Webhook configuration
  - Message sync architecture

**Files Created/Modified:**
- `docs/integrations/chatbot.md` (new)
- `docs/integrations/whatsapp.md` (new)

---

## Epic 10: Agent Landing Page Builder

### Story 10.1: Landing Page Entity and Template Engine

As a **developer**,
I want a landing page entity and template rendering system,
So that agents can generate custom pages.

**Acceptance Criteria:**
- `landing_pages` table created with fields: id, tenant_id, agent_id, package_id, slug, template_id, customizations (JSONB), views_count, leads_count, published_at
- Template engine (Handlebars/EJS) renders HTML from template + data
- 3 default templates: Modern, Classic, Minimal
- Templates responsive and SEO-optimized
- Generated pages cached for performance

**Files Created/Modified:**
- `src/modules/landing-pages/entities/landing-page.entity.ts` (new)
- `src/modules/landing-pages/services/template-renderer.service.ts` (new)
- `src/modules/landing-pages/templates/*.hbs` (new)

---

### Story 10.2: Page Generator with Package Selection

As an **agent**,
I want to select a package and generate a landing page instantly,
So that I can share it with prospects.

**Acceptance Criteria:**
- "Create Landing Page" button on package details
- Wizard flow: 1) Select template, 2) Customize branding, 3) Preview, 4) Publish
- Auto-generates unique slug: `{agentSlug}-{packageSlug}`
- Published page accessible at: `{subdomain}.travelumroh.com/p/{slug}`
- Page includes: package details, itinerary, pricing, agent contact, WhatsApp CTA
- One-click duplication for similar packages

**Files Created/Modified:**
- `frontend/src/pages/agent/landing-pages/create.tsx` (new)
- `frontend/src/components/LandingPageWizard.tsx` (new)
- `src/modules/landing-pages/landing-pages.controller.ts` (new)

---

### Story 10.3: Agent Branding Customization

As an **agent**,
I want to customize my branding on landing pages,
So that they reflect my personal brand.

**Acceptance Criteria:**
- Customization options: Profile photo, name, tagline, phone, email, WhatsApp number
- Color scheme selector (primary, secondary, accent)
- Logo upload (optional)
- Social media links (Facebook, Instagram, TikTok)
- Custom intro text/video
- Branding saved to agent profile for reuse
- Preview updates in real-time

**Files Created/Modified:**
- `frontend/src/components/BrandingCustomizer.tsx` (new)
- `src/modules/users/entities/agent-branding.entity.ts` (new)

---

### Story 10.4: Social Media Sharing Integration

As an **agent**,
I want one-click sharing to social media,
So that I can easily promote landing pages.

**Acceptance Criteria:**
- Share buttons: Facebook, Instagram, WhatsApp, Twitter, LinkedIn
- Open Graph meta tags for rich previews
- Twitter Card meta tags
- UTM parameters auto-added for tracking: `?utm_source=facebook&utm_medium=social&utm_campaign={packageSlug}`
- Share analytics tracked (which platform drives most traffic)
- WhatsApp share includes pre-filled message template

**Files Created/Modified:**
- `frontend/src/components/ShareButtons.tsx` (new)
- Meta tags injected server-side for SEO

---

### Story 10.5: Lead Capture Form

As a **prospect**,
I want to submit an inquiry via the landing page,
So that the agent can follow up with me.

**Acceptance Criteria:**
- Lead form fields: Full name, email, phone, preferred departure month, message
- Form validation with clear error messages
- CAPTCHA (reCAPTCHA v3) to prevent spam
- Submission creates record in `leads` table
- Agent receives instant notification (email + WebSocket toast)
- Auto-reply email sent to prospect
- Lead status: new, contacted, converted, lost

**Files Created/Modified:**
- `src/modules/leads/entities/lead.entity.ts` (new)
- `src/modules/leads/leads.controller.ts` (new)
- `frontend/src/components/LeadCaptureForm.tsx` (new)

---

### Story 10.6: Analytics Tracking

As an **agent**,
I want to see landing page analytics,
So that I know which pages perform best.

**Acceptance Criteria:**
- Analytics dashboard shows per landing page:
  - Total views
  - Unique visitors
  - Lead conversion rate
  - Traffic sources (social, direct, referral)
  - Geographic distribution
  - Device types (mobile/desktop)
- Time-series chart of views over time
- Top performing pages leaderboard
- Export analytics to CSV

**Files Created/Modified:**
- `src/modules/analytics/services/page-analytics.service.ts` (new)
- `frontend/src/pages/agent/landing-pages/analytics.tsx` (new)
- Integrate Google Analytics or Plausible for client-side tracking

---

## Epic 11: Operational Intelligence Dashboard

### Story 11.1: Real-Time Revenue Metrics

**Acceptance Criteria:**
- Revenue widget displays: Total revenue today, this week, this month, this year
- Real-time updates via WebSocket on payment confirmation
- Revenue breakdown by package
- Revenue trend chart (line graph, last 30 days)
- Comparison to previous period (% change)

---

### Story 11.2: Revenue Projection Algorithm

**Acceptance Criteria:**
- 3-month projection based on: historical payment patterns, pending installments, pipeline potential
- Algorithm: `(avg_monthly_revenue_last_3_months * 0.7) + (pending_installments * 0.9) + (pipeline_potential * 0.3)`
- Confidence interval displayed
- Adjustable assumptions (conversion rate, payment completion rate)

---

### Story 11.3: Pipeline Potential Calculation

**Acceptance Criteria:**
- Pipeline potential = sum of all packages for jamaah with status: prospek, dp_paid, partial_payment
- Weighted by likelihood: prospek (30%), dp_paid (70%), partial_payment (90%)
- Pipeline funnel visualization
- Filter by agent, package, date range

---

### Story 11.4: Agent Performance Analytics

**Acceptance Criteria:**
- Metrics per agent: Conversion rate, avg deal size, jamaah count, revenue generated
- Performance trend over time
- Filter by time period
- Export to PDF for performance reviews

---

### Story 11.5: Top Performer Leaderboard

**Acceptance Criteria:**
- Leaderboard ranks agents by: Total revenue, Jamaah count, Conversion rate
- Monthly, quarterly, yearly leaderboards
- Badges for top 3 performers
- Gamification: achievements, milestones

---

### Story 11.6: Jamaah Pipeline Visualization

**Acceptance Criteria:**
- Kanban board view: columns for Prospek, DP Paid, Pelunasan, Ready to Depart
- Drag-and-drop to change jamaah status
- Count and total value per column
- Click jamaah card for details

---

### Story 11.7: Advanced Filtering and Search

**Acceptance Criteria:**
- Multi-select filters: Agents, packages, date ranges, statuses
- Search by jamaah name, email, phone
- Save filter presets
- URL state for shareable filtered views

---

## Epic 12: Sharia Compliance & Regulatory Reporting

### Story 12.1: Wakalah bil Ujrah Contract Templates

**Acceptance Criteria:**
- Contract template in Indonesian with Wakalah bil Ujrah structure
- Placeholder variables: {JAMAAH_NAME}, {PACKAGE_NAME}, {AMOUNT}, {DATE}
- Template generator fills placeholders with jamaah data
- PDF generation with proper formatting
- Multiple template variants for different package types

**Files Created/Modified:**
- `src/modules/contracts/templates/wakalah-bil-ujrah.hbs` (new)
- `src/modules/contracts/services/contract-generator.service.ts` (new)

---

### Story 12.2: Digital Akad with E-Signature

**Acceptance Criteria:**
- E-signature integration (DocuSign or local equivalent)
- Jamaah receives email with contract for signing
- Signing process tracked: sent, viewed, signed, completed
- Signed contracts stored securely
- Audit trail of all signing events
- Reminders sent if unsigned after 7 days

**Files Created/Modified:**
- `src/modules/contracts/services/esignature.service.ts` (new)
- `src/modules/contracts/entities/contract.entity.ts` (new)

---

### Story 12.3: Compliance Dashboard

**Acceptance Criteria:**
- Dashboard shows: Total contracts signed, pending signatures, compliance rate
- Filters by date range, agent
- Export compliance report to PDF
- Regulatory submission status (when SISKOPATUH integrated)

---

### Story 12.4: Transaction Audit Trail

**Acceptance Criteria:**
- All financial transactions logged immutably
- Audit log includes: amount, parties, contract reference, payment method
- Searchable and filterable
- Retention: 7 years

---

### Story 12.5: Critical Operations Logging

**Acceptance Criteria:**
- Critical operations logged: User role changes, payment confirmations, contract signatures, data exports
- Log format: timestamp, actor, action, entity, before/after state
- Logs streamed to external SIEM (optional)

---

### Story 12.6: SISKOPATUH Integration Stub with "Coming Soon" Badge

**Acceptance Criteria:**
- "SISKOPATUH Reporting" section in admin panel (disabled)
- "Coming Soon" badge with Phase 2 timeline
- Documentation of required data fields for submission
- API stub returns 501

**Files Created/Modified:**
- `src/modules/compliance/siskopatuh.controller.ts` (new - stub)
- `docs/compliance/siskopatuh-integration.md` (new)

---

## Epic 13: Onboarding & Migration Tools

### Story 13.1: CSV Import Infrastructure

**Acceptance Criteria:**
- CSV upload form with file picker
- Sample CSV template download
- Validation: required columns, data types, format
- Preview uploaded data before import
- BullMQ job processes import asynchronously

**Files Created/Modified:**
- `src/modules/migration/migration.controller.ts` (new)
- `src/modules/migration/services/csv-parser.service.ts` (new)
- `src/modules/migration/jobs/import-jamaah.job.ts` (new)

---

### Story 13.2: Data Validation and Error Reporting

**Acceptance Criteria:**
- Row-by-row validation
- Error types: missing required field, invalid format, duplicate
- Error report with row numbers and descriptions
- Valid rows imported, invalid rows skipped
- Downloadable error CSV for correction

---

### Story 13.3: Migration Workflow with Progress Tracking

**Acceptance Criteria:**
- Migration status: pending, validating, importing, completed, failed
- Progress bar shows: X/Y rows processed
- WebSocket updates every 100 rows
- Email notification on completion
- Rollback option if errors detected

---

### Story 13.4: Training Materials CMS

**Acceptance Criteria:**
- Training materials page with categories: Video Tutorials, PDF Guides, FAQs
- Video embed (YouTube/Vimeo)
- PDF viewer
- Search training materials
- Track completion (mark as watched/read)

**Files Created/Modified:**
- `src/modules/training/training.controller.ts` (new)
- `frontend/src/pages/training/index.tsx` (new)

---

### Story 13.5: Adoption Analytics Dashboard

**Acceptance Criteria:**
- Metrics: % of users logged in last 7 days, % completed training, avg session duration
- Per-user activity log
- Identify inactive users for targeted support
- Training completion rate chart

---

### Story 13.6: Training Escalation System

**Acceptance Criteria:**
- "Request Training" button on training page
- Form: preferred date/time, topics, contact method
- Creates support ticket
- Admin assigns trainer
- Calendar integration for scheduling

---

## Epic 14: Super Admin Platform & Monitoring

### Story 14.1: Cross-Tenant Health Metrics Dashboard

**Acceptance Criteria:**
- Metrics: Total tenants, active users across all tenants, total revenue, error rate
- System health: API latency p95, database query time, Redis hit rate, job queue length
- Real-time updates
- Historical trends

**Files Created/Modified:**
- `frontend/src/pages/super-admin/dashboard/index.tsx` (new)
- `src/modules/monitoring/services/health-metrics.service.ts` (new)

---

### Story 14.2: Per-Agency Monitoring

**Acceptance Criteria:**
- Select tenant dropdown
- Tenant-specific metrics: users, jamaah, revenue, activity
- Recent errors and warnings
- Resource usage vs limits

---

### Story 14.3: Anomaly Detection and Alerts

**Acceptance Criteria:**
- Anomaly detection: sudden drop in activity, spike in errors, unusual API usage
- Alerts sent via: Email, Slack, SMS
- Configurable thresholds
- Alert history and resolution tracking

**Files Created/Modified:**
- `src/modules/monitoring/services/anomaly-detector.service.ts` (new)

---

### Story 14.4: Account Diagnostics Tool

**Acceptance Criteria:**
- Run diagnostics button per tenant
- Checks: Database connectivity, Redis connectivity, external API health, data integrity
- Diagnostic report with pass/fail status
- Auto-fix option for common issues

---

### Story 14.5: Feature Trial Management

**Acceptance Criteria:**
- Feature flags per tenant: AI chatbot, WhatsApp, advanced analytics
- Enable trial for X days
- Trial expiry notification
- Usage tracking during trial

**Files Created/Modified:**
- `src/modules/features/services/feature-flags.service.ts` (new)

---

### Story 14.6: Sentry and Winston Integration

**Acceptance Criteria:**
- Sentry configured for error tracking
- Error rate dashboard
- Source maps uploaded for stack traces
- Winston logs to file and console
- Log levels: error, warn, info, debug
- Log rotation (14 days retention)

**Files Created/Modified:**
- `src/config/sentry.config.ts` (new)
- `src/config/winston.config.ts` (new)

---

## Epic 15: API & Developer Platform

### Story 15.1: OAuth 2.0 Authentication

**Acceptance Criteria:**
- OAuth 2.0 server with client credentials flow
- Client registration form for developers
- Client ID and secret generation
- Token endpoint: POST `/oauth/token`
- Token validation middleware

**Files Created/Modified:**
- `src/modules/oauth/oauth.controller.ts` (new)
- `src/modules/oauth/oauth.service.ts` (new)

---

### Story 15.2: RESTful API Endpoints for Core Resources

**Acceptance Criteria:**
- API endpoints for: Jamaah, Payments, Packages, Documents, Agents
- CRUD operations per resource
- Pagination, filtering, sorting
- Field selection (?fields=id,name,email)
- API versioning: /api/v1/

---

### Story 15.3: Webhook System

**Acceptance Criteria:**
- Webhook subscription management: POST /webhooks
- Supported events: payment.confirmed, jamaah.created, package.updated, document.approved
- Webhook delivery with retry (3 attempts)
- Webhook logs (request, response, status)
- Signature verification (HMAC-SHA256)

**Files Created/Modified:**
- `src/modules/webhooks/webhooks.controller.ts` (new)
- `src/modules/webhooks/services/webhook-delivery.service.ts` (new)

---

### Story 15.4: Rate Limiting

**Acceptance Criteria:**
- Rate limit: 1,000 requests/hour per API key
- Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- 429 Too Many Requests response when exceeded
- Redis-backed counter

**Files Created/Modified:**
- `src/common/guards/rate-limit.guard.ts` (new)

---

### Story 15.5: API Documentation Enhancement

**Acceptance Criteria:**
- Swagger UI with "Try it out" functionality
- Request/response examples for all endpoints
- Authentication documentation
- Error codes reference
- Interactive webhook testing

---

### Story 15.6: Developer Portal

**Acceptance Criteria:**
- Portal pages: API Keys, Usage Analytics, Webhook Logs, Documentation
- API key CRUD (create, revoke, regenerate)
- Usage charts: requests over time, by endpoint
- Webhook event logs with retry history

**Files Created/Modified:**
- `frontend/src/pages/developer/index.tsx` (new)

---

### Story 15.7: Sandbox Environment

**Acceptance Criteria:**
- Sandbox tenant with test data
- Separate API base URL: api-sandbox.travelumroh.com
- Test API keys (prefixed with `test_`)
- Sandbox data reset weekly
- Clearly marked in UI to prevent confusion with production

**Files Created/Modified:**
- Sandbox deployment configuration

---


---

## Epic 16: Customizable Production Pipeline Management

**User Outcome:** Admin staff can efficiently manage jamaah through a customizable multi-stage production pipeline with role-based task queues, bottleneck detection, and automated reminders. Each agency can configure their unique workflow stages.

**What Users Can Accomplish:**

**Super Admin:**
- Create and manage global pipeline stage library (15-20 default stages)
- Configure custom stages per tenant/agency
- Build agency-specific pipelines with drag-and-drop interface
- Set stage dependencies and automation rules
- Track pipeline performance across all tenants

**Agency Admin:**
- View their configured pipeline (read-only)
- Request pipeline modifications from support
- Monitor overall pipeline health

**Manager/Operations:**
- View pipeline overview dashboard with all stages
- Detect bottlenecks automatically (which stage has jamaah stuck)
- See team performance metrics per admin role
- Identify at-risk departures (jamaah not ready)
- Track stuck/blocked jamaah by stage

**Specialized Admins (Document, SISKOPATUH, Visa, Logistics, Travel):**
- Access role-specific task queue dashboard
- View tasks in Kanban format: Urgent | Today | Upcoming | Blocked
- See daily task counts and metrics
- Access jamaah pipeline detail with full history
- Mark tasks complete or add blockers
- Quick actions: call jamaah, WhatsApp agent, update status

**Agents:**
- Receive automated reminders for missing documents
- Get notified when jamaah stuck in pipeline
- See overall pipeline progress for their jamaah

**Jamaah:**
- Receive automated reminders for pending requirements
- Track their own pipeline progress
- Know exactly what's needed and when

**FRs Covered:** FR-16.1 through FR-16.12 (Customizable Production Pipeline Management)

**NFRs Addressed:**
- NFR-1.3: Dashboard load <2 seconds
- NFR-2.2: Support 3,000 jamaah/month per agency through pipeline
- NFR-6.2: Multi-tenancy with per-tenant pipeline configuration
- NFR-7.5: Contextual help for admin workflows
- NFR-9.3: Operational monitoring dashboard

**Implementation Notes:**
- Three-layer architecture: Global Library → Tenant Config → Runtime Tracking
- Pipeline versioning for change management
- Drag-and-drop pipeline builder for Super Admin
- Role-based dashboards dynamically generated from tenant config
- Bottleneck detection algorithm with SLA tracking
- Auto reminder system with multi-channel delivery
- Week 13-18 of timeline (5-6 weeks)

**Dependencies:** Epic 6 (Document Management), Epic 12 (SISKOPATUH), Epic 8 (WebSocket), Epic 9 (WhatsApp)

---

### Story 16.1: Global Pipeline Stage Library

As a **Super Admin**,
I want to create and manage a library of pipeline stages that agencies can use,
So that agencies can build custom workflows from pre-defined components.

**Acceptance Criteria:**

**Given** I need to create reusable pipeline stages
**When** I access the global stage library
**Then** I can create stages with:
  - Unique stage code (e.g., 'document-ktp', 'visa-application')
  - Stage category (Document, Government, Travel, Logistics, Custom)
  - Stage name and description
  - Default SLA in hours
  - Default responsible role
  - Icon and color for UI
  - Core vs Optional flag (core cannot be deleted)
  - Optional vs Mandatory flag (can agencies skip?)
**And** I can define custom configuration fields per stage:
  - Field name, type (text, number, date, select, checkbox)
  - Whether field is required
  - Select options if applicable
**And** global stage library includes 15-20 default stages:
  - Document: KTP, Passport, KK, Vaksin, Photo
  - Government: SISKOPATUH Submission, SISKOPATUH Approval, Visa Application, Visa Processing
  - Logistics: Uniform Order, Equipment Prep, Custom Merchandise
  - Travel: Flight Booking, Hotel Booking, Group Assignment
  - Custom: Medical Clearance, Pre-Departure Briefing
**And** I can edit existing stages (except core stages)
**And** I can delete optional stages (if not used by any agency)
**And** I can see usage count (how many agencies use this stage)

**Technical Requirements:**
- `global_pipeline_stages` table with versioning
- Stage templates with JSON schema for config fields
- Validation rules for stage codes (unique, kebab-case)
- UI supports icon picker and color selector
- Soft delete for stages with usage tracking

**Files Created/Modified:**
- `src/modules/pipeline/entities/global-pipeline-stage.entity.ts` (new)
- `src/modules/pipeline/dto/create-global-stage.dto.ts` (new)
- `frontend/src/pages/super-admin/pipeline/global-stages/index.tsx` (new)
- `frontend/src/components/pipeline/GlobalStageCard.tsx` (new)
- Database migration: `create_global_pipeline_stages_table.ts`

**Validation:**
- Create stage "KTP Collection" → saved with code 'document-ktp'
- Try to create duplicate code → validation error
- Delete core stage → prevented
- Delete optional stage used by 5 agencies → warning shown
- Edit stage name → all tenant configs auto-update

---

### Story 16.2: Tenant Pipeline Configuration System

As a **Super Admin**,
I want to configure custom pipeline workflows for each tenant/agency,
So that each agency can use stages that match their operational process.

**Acceptance Criteria:**

**Given** an agency needs a customized pipeline
**When** I configure their pipeline
**Then** I can use a drag-and-drop builder with:
  - Left panel: Available stages from global library
  - Right panel: Active pipeline (ordered stages)
  - Drag stages from left to right to add
  - Drag within right panel to reorder
  - Remove stage button
**And** for each stage in active pipeline, I can configure:
  - Enable/Disable toggle
  - Custom stage name (override default)
  - Custom SLA hours (override default)
  - Responsible role assignment
  - Mandatory for departure flag
  - Custom configuration values (per stage schema)
  - Conditional rules (e.g., "only if age > 65")
**And** I can define stage dependencies:
  - Stage B cannot start until Stage A complete
  - Multiple dependencies allowed
  - Visual dependency graph shown
**And** I can set automation rules:
  - Trigger: stage-complete, stage-delayed, stage-blocked
  - Action: send-notification, assign-task, escalate
  - Configuration per trigger/action
**And** I can save pipeline configuration:
  - Creates new version number
  - Locks version for existing jamaah (new jamaah use latest)
  - Saves to `tenant_pipeline_configs` table
**And** I can use pipeline templates:
  - "Budget Agency Minimal" (5 stages)
  - "Standard Full Service" (8 stages)
  - "Premium VIP Service" (12 stages)
  - "Copy from Agency X" feature
**And** I can preview pipeline:
  - Visual flow diagram with all stages
  - Estimated timeline calculation
  - Role distribution chart

**Technical Requirements:**
- React DnD library for drag-and-drop
- `tenant_pipeline_configs` table with JSONB columns
- Pipeline validation (at least 1 stage enabled, no circular dependencies)
- Version control with history tracking
- Config diff view for version comparison

**Files Created/Modified:**
- `src/modules/pipeline/dto/tenant-pipeline-config.dto.ts` (new)
- `src/modules/pipeline/services/pipeline-config.service.ts` (new)
- `frontend/src/pages/super-admin/tenants/[id]/pipeline/index.tsx` (new)
- `frontend/src/components/pipeline/PipelineBuilder.tsx` (new)
- `frontend/src/components/pipeline/DraggableStage.tsx` (new)
- Database migration: `create_tenant_pipeline_configs_table.ts`

**Validation:**
- Drag "KTP Collection" to active pipeline → appears as #1
- Disable "Vaksin" stage → jamaah skip that stage
- Set Visa to depend on [KTP, Passport] → enforced at runtime
- Save config → version incremented to 2
- Load Agency A's config → shows their 10 active stages
- Load Agency B's config → shows their 5 active stages

---

### Story 16.3: Pipeline Runtime Engine & Jamaah Tracking

As a **System**,
I want to initialize and track jamaah progression through their agency's configured pipeline,
So that admins can see real-time status and take action.

**Acceptance Criteria:**

**Given** a new jamaah is created
**When** system initializes pipeline tracking
**Then** system creates `jamaah_pipeline_status` record:
  - Links to jamaah, tenant, and pipeline config
  - Locks to current pipeline version (won't change if config updated)
  - Creates stage instances for all enabled stages
  - Sets initial stage status to 'pending'
  - Calculates SLA deadlines based on departure date
  - Sets overall progress to 0%
**And** as jamaah progresses through stages:
  - Admin marks stage as 'in-progress' → updates status
  - Admin completes stage → status 'completed', advances to next
  - System enforces stage dependencies (cannot start Stage B until A done)
  - System tracks time spent in each stage
  - System flags overdue stages (past SLA deadline)
  - System calculates overall progress percentage
**And** system detects stage status automatically:
  - 'on-track': within SLA, progressing normally
  - 'at-risk': 75% of SLA time used
  - 'delayed': past SLA deadline
  - 'blocked': has active blocker
  - 'completed': stage finished
**And** admins can add blockers to stages:
  - Blocker reason (free text)
  - Created by user and timestamp
  - Stage status changes to 'blocked'
  - Blocker can be resolved with notes
**And** system maintains full stage history:
  - Stage started at, completed at
  - Who handled the stage
  - Data collected during stage
  - Notes added
  - Blockers encountered
**And** conditional stages are auto-skipped:
  - If stage has condition "age > 65" and jamaah is 45
  - Stage status set to 'skipped'
  - Progress calculation excludes skipped stages

**Technical Requirements:**
- `jamaah_pipeline_status` table with JSONB stage instances
- `pipeline_stage_history` table for audit trail
- Pipeline engine service with state machine
- SLA calculation based on working hours (8hr/day, 5 days/week)
- Dependency graph validation
- Event-driven architecture for stage transitions

**Files Created/Modified:**
- `src/modules/pipeline/entities/jamaah-pipeline-status.entity.ts` (new)
- `src/modules/pipeline/entities/pipeline-stage-history.entity.ts` (new)
- `src/modules/pipeline/services/pipeline-engine.service.ts` (new)
- `src/modules/pipeline/dto/advance-stage.dto.ts` (new)
- Database migrations for pipeline tracking tables

**Validation:**
- Create jamaah → pipeline initialized with 10 stages
- Jamaah departure in 30 days → SLA deadlines calculated
- Mark KTP stage complete → Passport stage unlocked
- Try to start Visa before KTP done → blocked by dependency
- Jamaah age 45, Medical stage condition "age > 65" → stage skipped
- Add blocker "Passport photo unclear" → stage status 'blocked'

---

### Story 16.4: Manager Pipeline Overview Dashboard

As a **Manager/Operations Admin**,
I want to see a high-level overview of all jamaah in the pipeline,
So that I can identify bottlenecks and at-risk departures.

**Acceptance Criteria:**

**Given** I need to monitor overall pipeline health
**When** I access the manager dashboard
**Then** I see pipeline stage overview cards:
  - One card per enabled stage in agency config
  - Each card shows:
    - Stage name and icon
    - Total jamaah in this stage
    - Count by status: on-track, at-risk, delayed, blocked
    - Color coding (green, yellow, red)
    - Click to drill down
**And** I see bottleneck alerts section:
  - Automatically detected bottlenecks
  - Shows stage name, jamaah count stuck, average delay days
  - Root cause analysis (e.g., "80% missing passport photos")
  - Assigned admin responsible
  - Action button to view details
**And** I see upcoming departures section:
  - Departures in next 7 days
  - Group name, departure date, total pax
  - Progress summary: ready count, at-risk count, blocked count
  - Warning if <80% ready within 3 days of departure
**And** I see team performance section:
  - Table of all admins
  - Role, tasks completed today, tasks overdue, average completion time
  - Status indicator (good, at-risk, overloaded)
  - Load distribution chart
**And** I can filter dashboard:
  - By departure date range
  - By package type
  - By agent
  - By stage status
**And** dashboard auto-refreshes every 60 seconds via WebSocket

**Technical Requirements:**
- Pipeline analytics service with aggregation queries
- Bottleneck detection algorithm (SLA variance analysis)
- WebSocket events for real-time updates
- Caching layer for performance (Redis)
- Responsive grid layout for mobile

**Files Created/Modified:**
- `src/modules/pipeline/services/pipeline-analytics.service.ts` (new)
- `frontend/src/pages/admin/pipeline/overview/index.tsx` (new)
- `frontend/src/components/pipeline/StageOverviewCard.tsx` (new)
- `frontend/src/components/pipeline/BottleneckAlert.tsx` (new)
- `frontend/src/components/pipeline/UpcomingDepartureCard.tsx` (new)

**Validation:**
- Dashboard shows 8 stage cards (agency has 8 enabled stages)
- "Visa Processing" card shows: 42 total, 30 on-track, 7 at-risk, 3 delayed, 2 blocked
- Bottleneck alert: "Visa Processing - 12 jamaah stuck, avg 5.2 days delay"
- Upcoming departure warning: "3 days to departure, only 38/45 ready"
- Team performance shows Andi (Visa Admin): 8 completed, 5 overdue, 4.1hr avg time

---

### Story 16.5: Role-Based Admin Task Queue Dashboards

As an **Admin** (Document/SISKOPATUH/Visa/Logistics/Travel),
I want to see only tasks relevant to my role in a Kanban-style view,
So that I can efficiently work through my daily queue.

**Acceptance Criteria:**

**Given** I am a Document Admin
**When** I access my task queue dashboard
**Then** I see only stages where responsible_role = 'document-admin':
  - KTP Collection
  - Passport Verification
  - Vaksin Certificate (if enabled)
  - Photo Verification
**And** tasks are organized in Kanban columns:
  - **Urgent** (due today or overdue, sorted by departure date)
  - **Today** (due today, normal priority)
  - **Upcoming** (due in next 3-7 days)
  - **Blocked** (has active blocker)
**And** each column shows:
  - Count badge on header
  - Jamaah cards with key info
  - Empty state if no tasks
**And** each jamaah card displays:
  - Jamaah name and photo
  - Package name
  - Departure date and days until
  - Current stage status
  - Missing items or issue
  - Quick action buttons
**And** I see daily metrics at top:
  - Total tasks assigned to me
  - Completed today
  - Pending urgent
  - Blocked count
  - Average completion time
**And** I can click a card to open detail modal:
  - Full pipeline timeline
  - Stage history
  - Travel details (flight, hotel)
  - Documents uploaded
  - Notes and comments
  - Quick actions: call, WhatsApp, mark complete, add blocker
**And** I can bulk actions:
  - Select multiple cards
  - Send reminder to all
  - Export to Excel
**And** filtering options:
  - By departure date range
  - By agent
  - By package type
  - By status

**Technical Requirements:**
- Dynamic dashboard generation based on tenant pipeline config
- Task assignment algorithm (assigns to role at stage creation)
- Priority calculation (days until departure, SLA time remaining)
- Kanban drag-and-drop (optional)
- Optimistic UI updates

**Files Created/Modified:**
- `src/modules/pipeline/services/task-queue.service.ts` (new)
- `frontend/src/pages/admin/pipeline/documents/index.tsx` (new)
- `frontend/src/pages/admin/pipeline/visa/index.tsx` (new)
- `frontend/src/components/pipeline/TaskKanbanBoard.tsx` (new)
- `frontend/src/components/pipeline/JamaahTaskCard.tsx` (new)
- Similar files for SISKOPATUH, Logistics, Travel admins

**Validation:**
- Document Admin sees 8 urgent tasks (passport missing, KTP blurry, etc.)
- Visa Admin sees 22 tasks in visa-processing stage
- Click jamaah card → detail modal opens with full pipeline view
- Mark task complete → card moves to next admin's queue
- Add blocker "Passport photo unclear" → card moves to Blocked column
- Manager sees blocker alert on overview dashboard

---

### Story 16.6: Jamaah Pipeline Detail Modal

As an **Admin**,
I want to see detailed pipeline status for a specific jamaah,
So that I can understand their full journey and take appropriate action.

**Acceptance Criteria:**

**Given** I click on a jamaah card
**When** detail modal opens
**Then** I see pipeline progress timeline:
  - Horizontal timeline with all stages
  - Visual progress bar (completed vs total)
  - Each stage shows: icon, name, status, dates
  - Current stage highlighted
  - Completed stages in green
  - Pending stages in gray
  - Blocked/delayed stages in red/yellow
**And** I see current stage details card:
  - Stage name and status badge
  - Assigned to which admin
  - Started at timestamp
  - SLA deadline
  - Time remaining or overdue by X hours
  - Document checklist (if document stage)
  - Issue description (if blocked)
**And** I see travel details section:
  - Outbound flight: number, date, time, airport, seat
  - Inbound flight: number, date, time, airport, seat
  - Makkah hotel: name, check-in/out, room number
  - Madinah hotel: name, check-in/out, room number
  - Group: name, pembimbing, total pax
**And** I see stage history section:
  - Timeline of all stages completed
  - Who handled each stage
  - Time spent in each stage
  - Notes added at each stage
**And** I see activity log:
  - Chronological log of all actions
  - User, timestamp, action, details
  - System events (reminders sent, stage auto-advanced, etc.)
**And** I can take actions:
  - Mark current stage complete
  - Add blocker with reason
  - Resolve existing blocker
  - Add note/comment
  - Send reminder to agent
  - Send reminder to jamaah
  - Call jamaah (click-to-call if integrated)
  - WhatsApp agent (deep link)
**And** modal is mobile responsive

**Technical Requirements:**
- Complex modal component with multiple sections
- Real-time updates via WebSocket
- Lazy loading for activity log (pagination)
- Print-friendly view option
- Export to PDF option

**Files Created/Modified:**
- `frontend/src/components/pipeline/JamaahPipelineDetailModal.tsx` (new)
- `frontend/src/components/pipeline/PipelineTimeline.tsx` (new)
- `frontend/src/components/pipeline/StageDetailsCard.tsx` (new)
- `frontend/src/components/pipeline/TravelDetailsSection.tsx` (new)
- `frontend/src/components/pipeline/ActivityLog.tsx` (new)

**Validation:**
- Open jamaah "Ahmad Hidayat" → modal shows 10-stage timeline
- Current stage "Visa Processing" highlighted, shows "Started 3 days ago, SLA deadline in 2 days"
- Travel details show "Flight GA 123, 28 Dec 2024, 10:00 AM, CGK → JED, Seat 23A"
- Activity log shows "25 Dec 09:15 - Reminder sent to agent by system"
- Click "Add Blocker" → opens form → save → stage status changes to 'blocked'
- Click "WhatsApp Agent" → opens WhatsApp with pre-filled message

---

### Story 16.7: Auto Reminder & Notification System

As the **System**,
I want to automatically send reminders based on pipeline SLAs and deadlines,
So that admins, agents, and jamaah stay informed and take timely action.

**Acceptance Criteria:**

**Given** pipeline has SLA deadlines configured
**When** daily cron job runs
**Then** system identifies tasks needing reminders:
  - Urgent: SLA deadline within 24 hours
  - Overdue: past SLA deadline
  - At-risk: 75% of SLA time consumed
  - Departure imminent: <7 days to departure, stage incomplete
**And** system sends reminders to admins:
  - Email: daily digest of urgent tasks
  - WhatsApp: for critical/overdue tasks
  - In-app notification: for all task updates
  - Message format: "{Admin}, you have {count} urgent tasks. Jamaah {name} needs {action}."
**And** system sends reminders to agents:
  - If jamaah missing documents: "Jamaah {name} missing {document}, please assist"
  - If 5+ jamaah in group have issues: "Your group has {count} jamaah with pending items"
  - If departure <3 days and jamaah not ready: "URGENT: {name} departs in {days} days, {missing_items} still needed"
**And** system sends reminders to jamaah:
  - Missing documents: "Dokumen {list} masih kurang, mohon segera lengkapi"
  - Stage delayed: "Proses {stage_name} Anda tertunda, silakan hubungi {agent_name}"
  - Visa ready: "Visa Anda sudah ready, siap untuk pickup"
**And** reminder channels configurable per tenant:
  - Email only
  - WhatsApp only
  - Both
  - In-app only
**And** reminder templates customizable:
  - Admin can edit message templates
  - Support variables: {jamaah_name}, {days_remaining}, {missing_items}, etc.
  - Multi-language support (Indonesian primary, English secondary)
**And** escalation rules:
  - If task overdue by 24hr → notify manager
  - If task overdue by 48hr → notify operations head
  - If critical task (mandatory for departure) overdue <3 days to departure → alert owner
**And** reminder throttling:
  - Max 1 reminder per task per day (avoid spam)
  - Batch reminders for same jamaah (combine multiple issues in one message)
  - Quiet hours: no reminders between 10 PM - 8 AM

**Technical Requirements:**
- Cron job with BullMQ queue for reminder processing
- WhatsApp Business API integration (Epic 9)
- Email service integration (SendGrid/AWS SES)
- In-app notification service (WebSocket)
- Template engine with variable substitution
- Throttling logic with Redis cache

**Files Created/Modified:**
- `src/modules/pipeline/services/reminder.service.ts` (new)
- `src/modules/pipeline/cron/daily-reminder.cron.ts` (new)
- `src/modules/pipeline/templates/reminder-templates.ts` (new)
- `src/modules/pipeline/dto/send-reminder.dto.ts` (new)
- Database table: `reminder_logs` for tracking sent reminders

**Validation:**
- Cron runs daily at 8 AM → processes all urgent tasks
- Document Admin receives email: "You have 8 urgent tasks due today"
- Agent receives WhatsApp: "Jamaah Farida missing Passport, due in 2 days"
- Jamaah receives WhatsApp: "Dokumen Vaksin masih kurang, mohon segera lengkapi"
- Task overdue by 48hr → manager notified
- Same task doesn't get multiple reminders in same day
- Reminder sent at 9:50 PM → queued until 8 AM next day

---

### Story 16.8: Pipeline Version Control & History

As a **Super Admin**,
I want to track changes to pipeline configurations over time,
So that I can rollback if needed and audit modifications.

**Acceptance Criteria:**

**Given** pipeline configuration changes
**When** I save configuration
**Then** system creates new version:
  - Increments version number (1 → 2)
  - Saves full config snapshot to history table
  - Records change summary (what changed)
  - Records who made the change
  - Timestamps the change
**And** existing jamaah stay on their locked version:
  - Jamaah created on v1 continue using v1 pipeline
  - New jamaah use latest version (v2)
  - No retroactive changes to in-progress jamaah
**And** I can view version history:
  - List all versions with dates and authors
  - Click version to view full config
  - Diff view comparing two versions
  - Highlight added/removed/modified stages
**And** I can rollback to previous version:
  - Select version to restore
  - Preview changes before rollback
  - Confirm rollback → creates new version (v3 = copy of v1)
  - Only affects new jamaah, not existing
**And** I can see which jamaah are on which version:
  - Filter jamaah by pipeline version
  - Migration report: "123 jamaah on v1, 45 on v2"
  - Option to manually migrate specific jamaah to new version (with approval)

**Technical Requirements:**
- `tenant_pipeline_config_history` table
- Config diff algorithm (JSON deep comparison)
- Rollback transaction handling
- Migration tools for bulk version updates
- UI for version comparison

**Files Created/Modified:**
- `src/modules/pipeline/entities/pipeline-config-history.entity.ts` (new)
- `src/modules/pipeline/services/pipeline-version.service.ts` (new)
- `frontend/src/pages/super-admin/tenants/[id]/pipeline/history.tsx` (new)
- `frontend/src/components/pipeline/VersionDiffView.tsx` (new)

**Validation:**
- Save pipeline config → version incremented to 2
- View history → shows v1 (10 stages) and v2 (12 stages, added Medical + Briefing)
- Diff view highlights added stages in green
- Rollback to v1 → creates v3 which is copy of v1
- New jamaah created → uses v3
- Existing jamaah on v2 → still uses v2

---

### Story 16.9: Pipeline Templates & Import/Export (Optional)

As a **Super Admin**,
I want to use pre-built pipeline templates and copy configurations between agencies,
So that I can quickly onboard new agencies.

**Acceptance Criteria:**

**Given** I need to configure pipeline for new agency
**When** I use pipeline templates
**Then** I can select from pre-built templates:
  - "Budget Agency Minimal" - 5 essential stages
  - "Standard Full Service" - 8 stages with SISKOPATUH and Visa
  - "Premium VIP Service" - 12 stages with Medical, Merchandise, Briefing
  - "Corporate Umroh" - 9 stages + custom approval workflows
**And** template applies default configuration:
  - All stages enabled/disabled as per template
  - Default SLAs set
  - Default role assignments
  - Dependencies pre-configured
**And** I can customize after applying template:
  - Enable/disable stages
  - Modify SLAs
  - Reorder stages
  - Add custom stages
**And** I can copy configuration from existing agency:
  - Select "Copy from Agency X"
  - Loads Agency X's current pipeline config
  - Apply to new agency
  - Customize as needed
**And** I can export pipeline configuration:
  - Download as JSON file
  - Includes all stages, dependencies, automation rules
  - Can be shared with other admins
**And** I can import pipeline configuration:
  - Upload JSON file
  - Validates structure
  - Preview before import
  - Merge with existing or replace completely

**Technical Requirements:**
- Template library stored in database
- JSON schema validation for import/export
- Template preview UI
- Safe import with validation and conflict resolution

**Files Created/Modified:**
- `src/modules/pipeline/templates/pipeline-templates.ts` (new)
- `src/modules/pipeline/services/pipeline-template.service.ts` (new)
- `frontend/src/components/pipeline/TemplateSelector.tsx` (new)
- `frontend/src/components/pipeline/ImportExportDialog.tsx` (new)

**Validation:**
- Select "Standard Full Service" template → pipeline builder pre-filled with 8 stages
- Customize template: add "Medical Clearance" stage
- Save configuration
- Export config → downloads `pipeline-config-standard.json`
- Import config to another agency → successfully applied
- Copy from "PT Travel Berkah" → loads their 10-stage config

---

