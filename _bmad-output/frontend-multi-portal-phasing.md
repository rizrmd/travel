# Frontend Multi-Portal Interface - Phasing Plan
**Project:** Travel Umroh
**Document Type:** Implementation Phasing
**Created:** 2025-12-25
**Status:** Planning

---

## Executive Summary

The Travel Umroh platform requires **7 distinct user interfaces** corresponding to 7 user roles defined in the backend. Currently, only the **Admin Portal** is partially implemented (Dashboard, Jamaah, Dokumen pages).

This document outlines a **5-phase implementation plan** to deliver all required portals in priority order based on business value and user impact.

---

## User Roles & Portal Requirements

Based on `/src/users/domain/user.ts`:

| Role | Portal Name | Priority | Status | Business Impact |
|------|------------|----------|--------|-----------------|
| `SUPER_ADMIN` | Super Admin Platform | P4 - Low | ❌ Not Started | Internal tool, low volume |
| `AGENCY_OWNER` | Owner Dashboard | P3 - Medium | ⚠️ Partial (analytics only) | Business intelligence, strategic decisions |
| `AGENT` | Agent/Mitra Portal | P1 - **CRITICAL** | ⚠️ Partial (landing builder only) | **80% of business flows through agents** |
| `AFFILIATE` | Affiliate Portal | P5 - Deferred | ❌ Not Started | Future feature, not MVP |
| `ADMIN` | Admin Portal | P2 - High | ⚠️ In Progress | Currently being built (Dashboard, Jamaah, Dokumen) |
| `JAMAAH` | Jamaah Self-Service | P2 - High | ❌ Not Started | Self-service option, reduces agent load |
| `FAMILY` | Family Tracking Portal | P4 - Low | ❌ Not Started | Nice-to-have, peace of mind feature |

---

## Phase Breakdown

### **PHASE 0: Authentication Foundation** 🔐
**Priority:** P0 - **BLOCKING ALL OTHER PHASES**
**Timeline:** Week 1 (5 days)
**Dependencies:** None
**Blocks:** All other phases require login

#### Stories (3 stories)
1. **Login Page with Role-Based Authentication**
   - Single unified login page (`/login`)
   - Email + password authentication
   - JWT token handling
   - Role detection from token
   - "Remember me" functionality
   - Password visibility toggle
   - Form validation (email format, required fields)

2. **Role-Based Routing & Redirect**
   - After login, redirect based on role:
     - `SUPER_ADMIN` → `/super-admin/dashboard`
     - `AGENCY_OWNER` → `/owner/dashboard`
     - `AGENT` → `/agent/my-jamaah`
     - `ADMIN` → `/dashboard` (current admin portal)
     - `JAMAAH` → `/my/dashboard`
     - `FAMILY` → `/family/dashboard`
   - Protected route middleware
   - Unauthorized access redirect to login
   - Token refresh logic

3. **Logout & Session Management**
   - Logout button in all portals
   - Clear JWT token on logout
   - Redirect to login page
   - Session timeout (30 min inactivity)
   - Automatic token refresh before expiry

**Deliverables:**
- ✅ `/app/login/page.tsx` - Login page
- ✅ `/lib/auth/` - Auth utilities (login, logout, token management)
- ✅ `/middleware.ts` - Route protection middleware
- ✅ Role-based redirect logic

**Acceptance Criteria:**
- User can login with email/password
- System detects user role from JWT
- User is redirected to correct portal based on role
- Unauthorized users are redirected to login
- Session expires after 30 min inactivity

---

### **PHASE 1: Admin Portal Completion** 👨‍💼
**Priority:** P2 - High
**Timeline:** Week 2-3 (10 days)
**Dependencies:** Phase 0 (Authentication)
**Current Status:** 30% complete (Dashboard, Jamaah, Dokumen pages exist but incomplete)

#### Stories (8 stories)

**1.1 Dashboard Overview - Revenue & KPI Cards**
- Greeting with user name ("Selamat Pagi, Mbak Rina!")
- KPI cards: Total Jamaah, Pending Documents, Overdue Payments
- Recent activities feed
- Quick actions (Add Jamaah, Upload Document, Record Payment)

**1.2 Jamaah Management - Enhanced Features**
- ✅ Already exists: Table view, search, filter
- Add: Bulk delete functionality
- Add: Export to CSV
- Add: Advanced filters (package, date range, agent assignment)
- Add: Jamaah detail page (`/jamaah/[id]`)

**1.3 Document Management - Review & Approval**
- ✅ Already exists: Document list, status badges
- Add: Document preview modal (PDF, image viewer)
- Add: Approve/Reject with notes
- Add: Bulk approve/reject
- Add: Document history & audit trail

**1.4 Payment Tracking**
- Create: `/app/payments/page.tsx`
- Payment list table (jamaah name, amount, status, due date)
- Record manual payment
- Installment tracking
- Payment reminders
- Overdue indicator

**1.5 Package Management**
- Create: `/app/packages/page.tsx`
- Package list (name, price retail/wholesale, active status)
- Create/Edit package form
- Itinerary builder (day-by-day)
- Inclusions/Exclusions list
- Package activation/deactivation

**1.6 Agent Management**
- Create: `/app/agents/page.tsx`
- Agent list (name, tier, jamaah count, commission total)
- Create/Edit agent
- Assign jamaah to agent
- Commission tracking
- Performance metrics per agent

**1.7 Reports & Analytics**
- Create: `/app/reports/page.tsx`
- Revenue reports (monthly, by package, by agent)
- Document completion rate
- Payment collection rate
- Agent performance comparison
- Export to PDF/Excel

**1.8 Settings & Configuration**
- Create: `/app/settings/page.tsx`
- Agency profile settings
- Email/SMS templates
- Commission structure configuration
- Document requirements configuration
- User management (create admin users)

**Deliverables:**
- ✅ Complete admin portal with 8 main sections
- ✅ Fully functional CRUD operations
- ✅ Integration with backend APIs
- ✅ Responsive mobile views

---

### **PHASE 2: Agent/Mitra Portal** 🏢
**Priority:** P1 - **CRITICAL** (80% of business)
**Timeline:** Week 4-5 (10 days)
**Dependencies:** Phase 0, Phase 1 (some shared components)

#### Stories (7 stories)

**2.1 "My Jamaah" Dashboard**
- KPI cards showing agent's assigned jamaah:
  - Total My Jamaah
  - Urgent (documents missing)
  - Soon (due in 3-7 days)
  - Ready (all complete)
- KPI cards are clickable filters
- Table of assigned jamaah only (not all agency jamaah)
- Status-based filtering (Urgent/Soon/Ready)
- Search by name, NIK, package

**2.2 Delegated Document Upload**
- Agent can upload documents **on behalf of jamaah**
- Select jamaah from dropdown
- Select document type (KTP, KK, Passport, etc.)
- Drag-drop upload
- OCR processing (auto-fill data)
- View upload history

**2.3 Jamaah Detail View (Agent Perspective)**
- View jamaah complete profile
- Upload documents for this jamaah
- View payment status (not edit - admin only)
- Add notes for this jamaah
- WhatsApp direct chat button (opens WhatsApp to jamaah's number)

**2.4 Bulk Operations**
- Select multiple jamaah (checkbox)
- Send WhatsApp reminder (template picker)
- Send progress update
- View bulk operation history

**2.5 Landing Page Builder**
- ✅ Already exists (partial): `/app/agent/landing-builder`
- Enhance: Package selection dropdown
- Enhance: Agent branding customization (name, photo, phone)
- Enhance: Live preview
- Enhance: Generate shareable link
- Enhance: Social media share buttons (WhatsApp, Facebook, Instagram)

**2.6 Lead Management**
- View leads captured from landing pages
- Lead status (New, Contacted, Converted, Lost)
- Follow-up reminders
- Convert lead to jamaah (create from lead)
- Lead analytics (views, clicks, conversion rate)

**2.7 Commission Tracking**
- View my commission per jamaah
- Total earned this month
- Commission breakdown (self + downline if multi-level)
- Payout history
- Request payout (if balance >= minimum)

**Deliverables:**
- ✅ Complete agent portal (`/agent/*`)
- ✅ "My Jamaah" concept fully implemented
- ✅ Delegated access working
- ✅ Commission transparency

**Acceptance Criteria:**
- Agent sees ONLY their assigned jamaah
- Agent can upload documents for their jamaah
- Agent can send bulk WhatsApp reminders
- Agent can track commissions
- Landing pages generate and are shareable

---

### **PHASE 3: Jamaah Self-Service Portal** 🕌
**Priority:** P2 - High
**Timeline:** Week 6-7 (10 days)
**Dependencies:** Phase 0

#### Stories (6 stories)

**3.1 Jamaah Dashboard**
- Welcome message ("Selamat datang, Pak Budi!")
- Progress tracker: Documents, Payments, Medical Check, Departure
- Completion percentage (e.g., "75% complete")
- Next steps recommendations
- Direct contact agent button (WhatsApp)

**3.2 Document Upload (Self-Service)**
- Upload my own documents
- Document checklist (KTP, KK, Passport, Vaksin, Buku Nikah, Akta)
- Status indicator (Uploaded, Pending Review, Approved, Rejected)
- OCR auto-fill after upload
- Reupload if rejected

**3.3 Payment Tracking**
- View my package price
- View installments (amount, due date, status)
- Payment history
- Overdue indicator
- Pay now button (redirects to Virtual Account)

**3.4 Itinerary & Schedule**
- View my package itinerary (day-by-day)
- View departure date, hotel, flight details
- Download itinerary as PDF
- View important dates (medical check, manasik, departure)

**3.5 Profile Management**
- View/Edit personal information
- Change password
- Emergency contact details
- Medical information (allergies, medications)
- Passport information

**3.6 Notifications & Updates**
- In-app notifications
- Email notification preferences
- WhatsApp notification preferences
- Mark as read
- Notification history

**Deliverables:**
- ✅ Complete jamaah portal (`/my/*`)
- ✅ Self-service document upload
- ✅ Payment transparency
- ✅ Itinerary access

**Acceptance Criteria:**
- Jamaah can login and see their dashboard
- Jamaah can upload documents without agent help
- Jamaah can view payment status
- Jamaah can view itinerary
- Jamaah can contact their assigned agent

---

### **PHASE 4: Agency Owner Dashboard** 📊
**Priority:** P3 - Medium
**Timeline:** Week 8 (5 days)
**Dependencies:** Phase 0, Phase 1 (uses aggregated data)

#### Stories (5 stories)

**4.1 Revenue Intelligence Dashboard**
- ✅ Already exists: `/app/owner/analytics`
- Enhance: Real-time revenue metrics
- Enhance: 3-month projection algorithm
- Enhance: Pipeline potential calculation
- Enhance: Revenue by package breakdown
- Enhance: Revenue by agent breakdown

**4.2 Agent Performance Analytics**
- Top performers leaderboard
- Commission paid per agent
- Jamaah count per agent
- Conversion rate per agent
- Agent tier distribution
- Identify underperforming agents

**4.3 Business Intelligence Reports**
- Monthly revenue trend chart
- Document completion rate trend
- Payment collection efficiency
- Package popularity analysis
- Seasonal demand patterns
- Customer acquisition cost (if lead tracking enabled)

**4.4 Strategic Metrics**
- Average order value
- Customer lifetime value
- Churn rate
- Net promoter score (if feedback enabled)
- Market share estimate

**4.5 Agency Settings**
- Agency profile (name, logo, contact)
- Subdomain configuration
- Custom domain setup
- Branding customization
- Email/SMS provider settings
- Commission structure rules

**Deliverables:**
- ✅ Complete owner portal (`/owner/*`)
- ✅ Business intelligence dashboards
- ✅ Strategic decision-making tools

**Acceptance Criteria:**
- Owner can see real-time revenue
- Owner can identify top-performing agents
- Owner can analyze business trends
- Owner can customize agency branding

---

### **PHASE 5: Super Admin Platform** 🛠️
**Priority:** P4 - Low (Internal Tool)
**Timeline:** Week 9 (5 days)
**Dependencies:** Phase 0

#### Stories (5 stories)

**5.1 Tenant Management**
- List all agencies (tenants)
- Create new tenant (onboarding)
- Suspend/Activate tenant
- View tenant resource usage
- Tenant contact information

**5.2 Cross-Tenant Monitoring**
- Health metrics dashboard (all agencies)
- Uptime monitoring
- Error rate per agency
- API usage per agency
- Database size per agency

**5.3 Anomaly Detection**
- Spike in errors for specific agency
- Unusual API usage patterns
- Payment gateway failures
- OCR processing failures
- Alert notifications (Slack/Email)

**5.4 Feature Trial Management**
- Enable/Disable features per tenant
- Trial period management
- Feature usage analytics
- Upgrade recommendations

**5.5 Platform Analytics**
- Total agencies count
- Total jamaah across all agencies
- Total revenue (platform-wide)
- Most popular packages
- Geographic distribution
- Growth metrics

**Deliverables:**
- ✅ Complete super admin portal (`/super-admin/*`)
- ✅ Platform-wide monitoring
- ✅ Tenant management tools

**Acceptance Criteria:**
- Super admin can view all agencies
- Super admin can monitor health metrics
- Super admin can enable/disable features per agency
- Super admin receives anomaly alerts

---

### **PHASE 6: Family Tracking Portal** (DEFERRED)
**Priority:** P5 - Deferred to Post-MVP
**Timeline:** TBD
**Dependencies:** Phase 0, GPS tracking integration

#### Future Stories (3 stories)
- Real-time location tracking (during umroh trip)
- Jamaah status updates
- Photo sharing from trip
- Emergency contact access

---

## Implementation Summary

### Week-by-Week Plan

| Week | Phase | Focus Area | Stories | Status |
|------|-------|-----------|---------|--------|
| Week 1 | Phase 0 | Authentication | 3 | 🔴 Not Started |
| Week 2-3 | Phase 1 | Admin Portal | 8 | 🟡 30% Complete |
| Week 4-5 | Phase 2 | Agent Portal | 7 | 🟡 10% Complete |
| Week 6-7 | Phase 3 | Jamaah Portal | 6 | 🔴 Not Started |
| Week 8 | Phase 4 | Owner Dashboard | 5 | 🟡 20% Complete |
| Week 9 | Phase 5 | Super Admin | 5 | 🔴 Not Started |

**Total Stories:** 34 stories across 6 phases
**Estimated Timeline:** 9 weeks (2 months)

### Current Status
- **Backend:** ✅ 100% Complete (15 epics + 3 integrations)
- **Frontend:** 🟡 **15% Complete** (only partial admin portal)

### Next Immediate Actions
1. ✅ **START: Phase 0 - Authentication** (BLOCKING)
2. ⏳ Complete Phase 1 - Admin Portal (in progress)
3. ⏳ Phase 2 - Agent Portal (CRITICAL for business)

---

## Technical Considerations

### Shared Components
Create reusable components to speed up development:
- `DashboardLayout` - Common layout for all portals
- `KPICard` - Consistent KPI display
- `StatusBadge` - Unified status indicators
- `JamaahTable` - Reusable table with filters/search
- `TemplatePicker` - WhatsApp template selector
- `DocumentUploadZone` - Drag-drop upload

### Role-Based UI Components
Create wrapper components for conditional rendering:
```tsx
<RoleGuard allowedRoles={['ADMIN', 'AGENCY_OWNER']}>
  <AdminOnlyButton />
</RoleGuard>
```

### API Integration
- All portals consume same backend APIs
- Role-based API responses (backend already handles via RLS)
- JWT token in Authorization header
- Automatic token refresh

### State Management
- Zustand for global state (user profile, selected items)
- TanStack Query for server state (API data)
- React Context for theme/density preferences

---

## Success Metrics

### Phase 0 Success Criteria
- ✅ 100% of users can login successfully
- ✅ 0% unauthorized access to restricted portals
- ✅ Token refresh works without user interruption

### Phase 1 Success Criteria
- ✅ Admin can manage 100+ jamaah efficiently
- ✅ Document approval time < 2 minutes per document
- ✅ 95% of admin tasks completable without training

### Phase 2 Success Criteria
- ✅ Agent admin time reduced by 80% (10hr → 2hr/week)
- ✅ Agent can manage 50+ jamaah without agent help
- ✅ Landing page leads increase by 20+/month per agent

### Phase 3 Success Criteria
- ✅ 40% of jamaah use self-service (not agent-assisted)
- ✅ Self-service document upload success rate > 90%
- ✅ Agent support ticket volume decreases by 30%

### Phase 4 Success Criteria
- ✅ Owner can make strategic decisions from dashboard
- ✅ Owner identifies top/bottom agents within 30 seconds
- ✅ Revenue projections accurate within ±10%

### Phase 5 Success Criteria
- ✅ Platform uptime visibility for all tenants
- ✅ Anomaly detection catches 95% of critical issues
- ✅ Tenant onboarding time < 15 minutes

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Shared component changes break multiple portals | High | Comprehensive component testing, strict versioning |
| Role-based routing bugs expose unauthorized data | Critical | Extensive security testing, middleware audits |
| Different portals have inconsistent UX | Medium | Shared design system, regular UX reviews |
| Backend API changes break frontend | High | API versioning, backend-frontend contract tests |

---

## Appendix: Route Structure

```
/
├── /login                      # Phase 0: Universal login
├── /dashboard                  # Phase 1: Admin Portal (current)
├── /jamaah                     # Phase 1: Jamaah management
├── /dokumen                    # Phase 1: Document management
├── /payments                   # Phase 1: Payment tracking
├── /packages                   # Phase 1: Package management
├── /agents                     # Phase 1: Agent management
├── /reports                    # Phase 1: Reports
├── /settings                   # Phase 1: Settings
│
├── /agent                      # Phase 2: Agent Portal
│   ├── /my-jamaah              # My assigned jamaah
│   ├── /landing-builder        # Landing page builder
│   ├── /leads                  # Lead management
│   ├── /commission             # Commission tracking
│
├── /my                         # Phase 3: Jamaah Portal
│   ├── /dashboard              # Jamaah dashboard
│   ├── /documents              # Upload my documents
│   ├── /payments               # View my payments
│   ├── /itinerary              # View my itinerary
│   ├── /profile                # My profile
│
├── /owner                      # Phase 4: Owner Portal
│   ├── /dashboard              # Revenue intelligence
│   ├── /analytics              # Business analytics (exists)
│   ├── /agents-performance     # Agent performance
│   ├── /settings               # Agency settings
│
├── /super-admin                # Phase 5: Super Admin
│   ├── /dashboard              # Platform overview
│   ├── /tenants                # Tenant management
│   ├── /monitoring             # Health monitoring
│   ├── /features               # Feature trials
│   ├── /analytics              # Platform analytics
│
└── /family                     # Phase 6: Family Portal (DEFERRED)
    ├── /dashboard              # Family member tracking
    ├── /location               # Real-time location
    ├── /photos                 # Trip photos
```

---

**Next Step:** Update `sprint-status.yaml` with Frontend Epics and begin Phase 0 implementation.
