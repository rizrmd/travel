# 🌐 Travel Umroh Multi-Portal System - Overview

**Last Updated:** 2025-12-25
**Total Portals:** 5
**Total Pages:** 31

---

## 📊 Arsitektur Multi-Portal

Sistem Travel Umroh menggunakan arsitektur **multi-portal** dengan 5 portal berbeda yang melayani peran pengguna yang berbeda:

```
┌─────────────────────────────────────────────────────────┐
│              SUPER ADMIN PLATFORM                       │
│         (Platform Management - SaaS Level)              │
└─────────────────────────────────────────────────────────┘
                          │
                          │ manages
                          ↓
┌─────────────────────────────────────────────────────────┐
│              OWNER DASHBOARD                            │
│         (Business Intelligence - Agency Level)          │
└─────────────────────────────────────────────────────────┘
                          │
                          │ oversees
                          ↓
┌──────────────────┬──────────────────┬───────────────────┐
│   ADMIN PORTAL   │   AGENT PORTAL   │  JAMAAH PORTAL    │
│  (Operations)    │  (Sales & CRM)   │  (Self-Service)   │
└──────────────────┴──────────────────┴───────────────────┘
```

---

## 1️⃣ ADMIN PORTAL

### 👤 Siapa Penggunanya?
**Admin Travel** - Staff operasional travel yang mengelola operasional harian.

**Contoh User:** Mbak Rina (Admin Travel)

### 🎯 Fungsi Utama:
Portal ini adalah **pusat operasional** untuk mengelola seluruh aspek operasional travel umroh secara detail.

### ✨ Fitur-Fitur Utama:

#### 1. Dashboard & Monitoring
- Overview KPI (Total Jamaah, Pending Documents, Overdue Payments, Revenue)
- Recent activities feed
- Quick actions untuk tugas harian
- Personalized greeting

#### 2. Manajemen Jamaah (Master Data)
- Daftar lengkap semua jamaah (55 jamaah)
- CRUD operations (Create, Read, Update, Delete)
- Filter berdasarkan status dokumen (Urgent, Soon, Ready)
- Search by name, NIK, package
- Export to CSV
- Bulk operations

#### 3. Document Management
- Review & approve dokumen yang diupload
- Preview modal untuk lihat dokumen
- Approve/Reject dengan catatan
- Bulk approve untuk efisiensi
- Filter by status (Pending, Approved, Rejected)

#### 4. Payment Tracking
- Monitoring status pembayaran (Lunas/Cicilan/Nunggak)
- Record payment (catat pembayaran manual)
- Installment schedule tracking
- Payment history
- Virtual Account management

#### 5. Package Management
- Buat & edit paket umroh
- Dual pricing (retail vs wholesale)
- Itinerary builder (day-by-day schedule)
- Inclusions/Exclusions management
- Active/Inactive status control

#### 6. Agent Management
- Daftar semua agen (18 agen)
- Tier classification (Silver/Gold/Platinum)
- Performance metrics (conversion rate, jamaah count)
- Commission tracking
- Assign jamaah to agents

#### 7. Reports & Analytics
- 4 tipe laporan (Revenue, Documents, Payments, Agents)
- Date range filtering
- Charts & visualizations
- Export to PDF/Excel

#### 8. Settings & Configuration
- Agency profile management
- Email templates
- Commission structure (tier-based)
- Document requirements
- User/team management

### 🔑 Use Cases:
- Approve dokumen paspor jamaah
- Record pembayaran cicilan
- Assign 5 jamaah baru ke agent tertentu
- Generate laporan revenue bulanan
- Update itinerary paket umroh
- Manage team members & permissions

### 🎨 Base URL: `http://localhost:3001/dashboard`

---

## 2️⃣ AGENT PORTAL

### 👤 Siapa Penggunanya?
**Agent/Mitra Travel** - Sales agent yang merekrut jamaah dan mendapatkan komisi.

**Contoh User:** Ibu Siti Aminah (Agent Silver Tier)

### 🎯 Fungsi Utama:
Portal ini adalah **CRM & Sales Tool** untuk agent mengelola jamaah mereka, generate leads, dan track komisi.

### ✨ Fitur-Fitur Utama:

#### 1. My Jamaah Dashboard
- View hanya jamaah yang assigned ke agent tersebut (12 dari 55 total)
- KPI cards (Total, Urgent, Soon, Ready)
- Filter & search jamaah
- Status tracking per jamaah
- WhatsApp quick actions

#### 2. Upload Dokumen (Delegated)
- Agent bisa upload dokumen **untuk** jamaah mereka
- 3-step wizard flow:
  1. Select Jamaah (dari daftar assigned)
  2. Select Document Type (KTP, KK, Paspor, dll)
  3. Upload dengan drag & drop
- OCR simulation (auto-extract data)
- Progress tracking

#### 3. Jamaah Detail (Agent View)
- Profile jamaah (READ-ONLY data pribadi)
- WhatsApp CTA button (primary action)
- Document status view
- Payment info (READ-ONLY, tidak bisa edit)
- **Agent's private notes** (untuk tracking follow-up)

#### 4. Landing Page Builder
- **Marketing tool** untuk generate leads
- 4-step builder:
  1. Package Selection (pilih paket untuk dipromosikan)
  2. Agent Branding (nama, phone, bio, foto)
  3. Live Preview (lihat hasil real-time)
  4. Generate & Share (URL + QR Code)
- Share to WhatsApp Status
- Copy link untuk share di medsos

#### 5. Lead Management
- View leads yang masuk dari landing page
- Lead status tracking (Baru, Dihubungi, Konversi, Hilang)
- **WhatsApp integration** (langsung hubungi via WA)
- Convert lead to jamaah (dengan modal form)
- Filter by status
- Source tracking (dari landing page mana)

#### 6. Commission Tracking
- Commission overview (This Month, Pending, Paid Out, Available Balance)
- **Tier progression system:**
  - Silver: 4% commission, 0 minimum
  - Gold: 6% commission, 20 jamaah required
  - Platinum: 8% commission, 30 jamaah required
- Tier progress tracker ("12/20 jamaah untuk naik Gold")
- Commission breakdown table (per jamaah)
- **Payout request** (minimum Rp 500K)
- Bank account info
- Payout history

### 🔑 Use Cases:
- Buat landing page untuk paket umroh Ramadan
- Share QR code di WhatsApp Status
- Terima lead baru dari landing page
- Hubungi lead via WhatsApp
- Convert lead jadi jamaah baru
- Upload KTP untuk jamaah Pak Ahmad
- Track komisi bulan ini
- Request payout Rp 2.5 juta
- Lihat progress menuju tier Gold

### 💡 Key Differences dari Admin:
- **Scope terbatas:** Hanya lihat jamaah yang assigned
- **Sales-focused:** Tools untuk marketing & lead generation
- **Commission-driven:** Track earnings & tier progression
- **No payment recording:** Hanya view, tidak bisa catat bayaran
- **No package creation:** Hanya pilih paket existing

### 🎨 Base URL: `http://localhost:3001/agent/my-jamaah`

---

## 3️⃣ JAMAAH PORTAL

### 👤 Siapa Penggunanya?
**Jamaah** - Customer/peserta umroh yang terdaftar.

**Contoh User:** Pak Budi Santoso (Jamaah)

### 🎯 Fungsi Utama:
Portal ini adalah **Self-Service Platform** untuk jamaah track progress persiapan umroh mereka.

### ✨ Fitur-Fitur Utama:

#### 1. Dashboard Jamaah
- **Islamic greeting:** "Assalamu'alaikum, Pak Budi!"
- **Countdown timer:** "15 hari lagi menuju perjalanan umroh Anda"
- **Progress stepper** (5 tahapan):
  1. Dokumen (75% complete)
  2. Pembayaran (100% complete)
  3. Medical Checkup (0% - belum)
  4. Manasik (0% - belum)
  5. Keberangkatan (0% - belum)
- **Next steps recommendations** (smart, berdasarkan status)
- Contact agent button (langsung WA)
- Package info card

#### 2. Upload Dokumen (Self-Service)
- **Checklist 6 dokumen:**
  - KTP: Complete ✅
  - KK: Complete ✅
  - Paspor: Pending ⏳
  - Vaksin: Missing ❌
  - Buku Nikah: Rejected 🔴 (dengan reason)
  - Akta: Missing ❌
- Upload modal dengan drag & drop
- View rejection reason
- **Reupload button** (untuk dokumen yang rejected)
- Real-time status update

#### 3. Payment Tracking (READ-ONLY)
- Package price summary (Rp 35.000.000)
- Payment status badge (LUNAS/CICILAN/NUNGGAK)
- **Installment schedule** (3 installments):
  - DP: Paid ✅
  - Cicilan 1: Paid ✅
  - Cicilan 2: Paid ✅
- **Virtual Account info** dengan copy button
- Payment instructions (collapsible)
- Payment history table
- **NO payment recording** (hanya view)

#### 4. Itinerary & Schedule
- Package details (Umroh Reguler 9 Hari 7 Malam)
- **9-day timeline** (tabs untuk setiap hari)
- **Hotel information:**
  - Makkah: Grand Zam Zam Hotel (500m dari Masjidil Haram)
  - Madinah: Anwar Al Madinah Movenpick (300m dari Masjid Nabawi)
- Flight information (SV 823)
- **Important dates:**
  - Medical Checkup date
  - Manasik date
  - Departure date
- Download PDF button

#### 5. Profile Management
- **5 tabs:**
  1. **Personal Info:** nama, NIK, alamat, phone, email, birth info
  2. **Emergency Contact:** 3 emergency contacts
  3. **Medical Info:** blood type, allergies, medications, health conditions
  4. **Passport Info:** number, issue date, expiry date, place of issue
  5. **Change Password:** dengan strength indicator
- Profile photo upload
- Age auto-calculator
- Save changes button

#### 6. Notifications
- **15 notifications** grouped by:
  - Today (3 notifications)
  - Yesterday (2)
  - Last Week (5)
  - Older (5)
- **4 notification types:**
  - Document (KTP approved, Paspor pending, dll)
  - Payment (Payment received, reminder, dll)
  - Update (Itinerary update, schedule change)
  - Important (Urgent messages)
- Unread indicator (blue dot)
- Mark as read functionality
- **Notification preferences:**
  - Email notifications toggle
  - WhatsApp notifications toggle
  - Push notifications toggle
- Statistics (Total: 15, Unread: 5, Last 7 Days: 10)

### 🔑 Use Cases:
- Cek berapa hari lagi berangkat
- Upload foto paspor yang baru
- Reupload buku nikah yang ditolak (blur)
- Copy Virtual Account number untuk bayar
- Lihat jadwal hari ke-3 di Makkah
- Update alamat emergency contact
- Lihat notifikasi bahwa KTP sudah approved
- Download itinerary PDF
- Atur preference notifikasi (WA only)

### 💡 Key Differences:
- **Fully self-service:** Tidak perlu hubungi admin untuk upload dokumen
- **Progress-oriented:** Focus pada countdown & checklist
- **READ-ONLY payments:** Lihat saja, tidak bisa bayar di portal (via VA/transfer)
- **Personal scope:** Hanya data diri sendiri
- **Islamic UX:** Greeting, design elements

### 🎨 Base URL: `http://localhost:3001/my/dashboard`

---

## 4️⃣ OWNER DASHBOARD

### 👤 Siapa Penggunanya?
**Agency Owner/CEO** - Pemilik travel yang ingin monitor bisnis secara strategis.

**Contoh User:** Haji Abdullah Rahman (Agency Owner)

### 🎯 Fungsi Utama:
Portal ini adalah **Business Intelligence Dashboard** untuk owner monitor kesehatan bisnis dan membuat keputusan strategis.

### ✨ Fitur-Fitur Utama:

#### 1. Revenue Intelligence Dashboard
- **6 KPI cards:**
  - Total Revenue (all-time)
  - Monthly Revenue (this month)
  - Growth Rate (vs last month)
  - Active Jamaah (current)
  - Active Agents (current)
  - Average Order Value
- **Revenue trend chart** (12 months, line chart)
- **Top 5 packages table:**
  - Package name
  - Bookings count
  - Revenue
  - Trend indicator
- **Revenue by agent visualization:**
  - Top 8 agents
  - Bar chart comparison
  - Contribution percentage
- Quick actions (Export, View Details, Generate Forecast)

#### 2. Agent Performance Analytics
- **4 summary KPI cards:**
  - Total Agents
  - Total Commission Paid
  - Avg Revenue per Agent
  - Top Performer
- **Tier distribution chart:**
  - Purple: Platinum (2 agents)
  - Amber: Gold (5 agents)
  - Slate: Silver (11 agents)
  - Pie chart visualization
- **Agent leaderboard table:**
  - Sortable columns: Rank, Agent, Tier, Revenue, Jamaah Count, Conversion Rate, Avg Deal Size, Response Time, Commission
  - Performance indicators (🟢 on-target, 🟡 at-risk)
  - Filter by tier & status
- **Commission breakdown:**
  - Top 10 agents
  - Commission amount
  - Payment status
  - Trend

#### 3. Business Intelligence Reports
- **5 report categories:**
  1. Revenue Reports (sales, packages, trends)
  2. Sales Reports (conversion, sources, pipeline)
  3. Commission Reports (by agent, by tier, payout)
  4. Document Reports (completion, rejection, pending)
  5. Operational Reports (capacity, efficiency, SLA)
- **Date range picker:**
  - This Month
  - Last Month
  - Last Quarter
  - Custom Range
- **10 pre-built templates** (per category)
- Dynamic charts & visualizations
- **Key insights section** (auto-generated highlights)
- Export to PDF/Excel

#### 4. Strategic Metrics Dashboard
- **Overall business health score:** 82/100 🟢
- **5 health categories:**
  1. **Revenue Health (85/100)** - Excellent
     - Revenue growth
     - Revenue per jamaah
     - Package diversity
     - Seasonal balance
  2. **Operational Excellence (78/100)** - Good
     - Document processing time
     - Payment collection rate
     - SLA compliance
     - Process efficiency
  3. **Customer Satisfaction (92/100)** - Excellent
     - NPS score
     - Review ratings
     - Repeat rate
     - Referral rate
  4. **Agent Performance (74/100)** - Good
     - Avg conversion rate
     - Response time
     - Retention rate
     - Training completion
  5. **Financial Health (81/100)** - Good
     - Profit margin
     - Cash flow
     - Debt ratio
     - Reserve fund
- Each metric dengan:
  - Progress bar
  - Insights (what's working/needs improvement)
  - Recommended actions
- **Goal tracking** (5 strategic goals):
  - Status badges (On-track, At-risk, Behind)
  - Target vs actual
  - Timeline

#### 5. Agency Settings
- **4 tabs:**
  1. **Business Profile:**
     - Agency name
     - Logo upload
     - License number
     - Contact info
     - Operating hours
  2. **Commission Structure:**
     - Silver: 8% base, no minimum
     - Gold: 9% + 1% bonus, Rp 200jt/15 jamaah minimum
     - Platinum: 10% + 2% bonus, Rp 350jt/25 jamaah minimum
     - Edit commission rates
     - Set tier requirements
  3. **Billing & Subscription:**
     - Current plan (Professional - Rp 2.5jt/month)
     - Usage stats (18/25 agents, 247/500 jamaah, 3.2k/5k WhatsApp)
     - **3 subscription tiers:**
       - Starter (Rp 999K/month)
       - Professional (Rp 2.5jt/month)
       - Enterprise (Rp 7.5jt/month)
     - Upgrade/downgrade buttons
     - Billing history
  4. **Team Management:**
     - 8 users list
     - Role badges (Owner, Admin, Finance, Support)
     - Last active time
     - Invite user button
     - Permissions management

### 🔑 Use Cases:
- Cek revenue bulan ini vs bulan lalu
- Lihat agent mana yang paling produktif
- Generate laporan komisi Q4 untuk accounting
- Analisis paket mana yang paling laku
- Monitor business health score turun dari 85 ke 82
- Set target revenue Q1
- Upgrade subscription dari Professional ke Enterprise
- Invite finance manager baru ke sistem
- Review commission structure apakah perlu adjustment
- Export revenue trend untuk presentasi investor

### 💡 Key Differences:
- **High-level view:** Aggregated data, tidak detail per jamaah
- **Read-only:** Tidak ada CRUD operations, hanya analytics
- **Strategic focus:** Business intelligence, bukan operations
- **Multi-dimensional:** Revenue + agents + operations + goals
- **Subscription-aware:** Billing & plan management

### 🎨 Base URL: `http://localhost:3001/owner/dashboard`

---

## 5️⃣ SUPER ADMIN PLATFORM

### 👤 Siapa Penggunanya?
**System Administrator** - Platform operator yang manage multiple travel agencies (SaaS level).

**Contoh User:** System Administrator

### 🎯 Fungsi Utama:
Portal ini adalah **Platform Management Console** untuk manage multi-tenant SaaS platform.

### ✨ Fitur-Fitur Utama:

#### 1. Tenant Management
- **4 KPI cards:**
  - Total Tenants (15 agencies)
  - Active Subscriptions (12)
  - Monthly Revenue (Rp 45.75jt)
  - Trial Accounts (3)
- **Tenant list table:**
  - Columns: Agency Name, Subdomain, Plan, Status, Agents, Jamaah, Revenue, Created Date
  - Filter by plan (Enterprise/Professional/Starter/Trial)
  - Filter by status (Active/Trial/Suspended)
  - Search by name or subdomain
- **Tenant detail modal:**
  - Agency information
  - Subscription details
  - Usage statistics (agents, jamaah, WhatsApp, storage)
  - Billing history
  - Activity logs
- **Actions:**
  - View Details
  - Contact tenant
  - Upgrade/downgrade plan
  - Suspend account
  - Export data
- Export to CSV

#### 2. Cross-Tenant Monitoring
- **4 system health cards:**
  - API Health (status, uptime)
  - Database (connections, query time)
  - Redis Cache (hit rate, memory)
  - Background Jobs (queue size, failed jobs)
- **System metrics gauges:**
  - CPU Usage: 45%
  - Memory: 62%
  - Disk: 58%
  - Network: 28 Mbps
- **Real-time activity feed:**
  - Last 50 cross-tenant activities
  - Showing 15 most recent
  - Auto-refresh toggle (30 seconds)
  - Pulse animation when refreshing
- **Tenant activity comparison:**
  - Top 10 most active tenants
  - Bar chart
  - Request count
- **Error rate monitoring:**
  - 5 error types
  - Count per type
  - Trend indicators
- **Performance metrics:**
  - API Response Time: 45ms
  - DB Query Time: 12ms
  - Page Load Time: 1.8s
  - WebSocket Latency: 8ms
- **Alert status:**
  - 0 Critical
  - 3 Warning
  - 5 Info

#### 3. Anomaly Detection
- **4 overview cards:**
  - Critical Anomalies: 2
  - Warnings: 8
  - Resolved: 15
  - Last 24 Hours: 12
- **6 anomaly type tabs:**
  1. **Security (5 anomalies):**
     - Failed login attempts spike
     - Weak passwords detected
     - API key exposed in logs
     - Unusual access patterns
     - Data export anomaly
  2. **Performance (5):**
     - API timeout spike
     - Slow database queries
     - Memory leak detected
     - Connection pool exhausted
     - CDN degradation
  3. **Usage (5):**
     - API rate limit spike
     - Trial account inactive 28 days
     - Storage quota exceeded
     - WhatsApp quota 95% used
     - Unusual upload volume
  4. **Financial (3):**
     - Payment failure rate high
     - Revenue drop 30% MoM
     - Subscription churn spike
  5. **Data Integrity (4):**
     - Duplicate jamaah records
     - Missing required fields
     - Orphaned documents
     - Data sync failures
  6. **All (20 total)**
- Filter by severity (Critical/Warning/Info)
- Filter by status (Active/Investigating/Resolved/False Positive)
- **Anomaly detail modal:**
  - Full description
  - Impact assessment
  - Timeline
  - Affected tenants
  - Resolution steps
  - Similar incidents
- **Actions:**
  - Mark as Investigating
  - Resolve (with notes)
  - Flag as False Positive
  - Contact affected tenant
  - Create incident report

#### 4. Feature Trial Management
- **4 trial KPI cards:**
  - Active Trials: 12
  - Conversion Rate: 28.5%
  - Avg Trial Duration: 18 days
  - Expiring Soon: 4
- **6 available features:**
  - **TRIAL features:**
    - OCR Document Processing (14 days trial)
    - AI Chatbot Support (7 days trial)
    - WhatsApp API Integration (30 days trial)
  - **PAID features:**
    - Virtual Account Integration
    - E-Signature
    - SISKOPATUH Integration
- **Conversion funnel:**
  - 42 Started → 28 Active → 12 Converted
  - Visual funnel chart
  - Conversion rate per stage
- **Active trials table:**
  - 15 ongoing trials
  - Columns: Tenant, Feature, Started, Expires, Days Remaining, Usage %, Status
  - Status badges (Active, Expiring Soon, Expired, Converted)
  - Filter by feature
  - Filter by status
- **Trial detail modal:**
  - Usage statistics
  - Feature adoption metrics
  - User engagement
  - Conversion likelihood score
- **Actions:**
  - Extend Trial (+7 days)
  - Convert to Paid
  - Revoke Access
  - View Detailed Usage
  - Send reminder email

#### 5. Platform Analytics
- **6 executive KPIs:**
  - Total Revenue: Rp 548M (all-time)
  - MRR (Monthly Recurring Revenue): Rp 45.75M
  - Churn Rate: 3.2%
  - ARPT (Avg Revenue per Tenant): Rp 3.8M
  - Total Agents: 191 (across all tenants)
  - Total Jamaah: 9,995 (across all tenants)
- **Growth metrics chart:**
  - 12 months trend
  - MRR growth
  - Tenant growth
  - User growth
  - Dual-axis line chart
- **Tenant distribution by plan:**
  - Enterprise: 20% (3 tenants)
  - Professional: 53% (8 tenants)
  - Starter: 20% (3 tenants)
  - Trial: 7% (1 tenant)
  - Donut chart
- **Revenue breakdown:**
  - Subscription Revenue: 83.5%
  - Add-ons Revenue: 13.7%
  - Professional Services: 2.8%
  - Pie chart
- **Top 10 tenants by revenue:**
  - Table with ranking
  - MRR per tenant
  - Growth rate
  - Health score
- **Geographic distribution:**
  - 9 provinces
  - Map visualization
  - Concentration by region
- **Feature adoption rates:**
  - 6 features tracked
  - 20% - 80% adoption
  - Bar chart
  - Trend indicators
- **Customer health segmentation:**
  - Champions: 5 tenants (high value, high engagement)
  - Loyal: 4 tenants (high value, consistent)
  - At Risk: 2 tenants (declining engagement)
  - Trial: 3 tenants (evaluating)
  - Churned: 1 tenant (inactive)
- **Cohort analysis table:**
  - 14 cohorts (monthly)
  - Retention rates over 12 months
  - Heatmap visualization
  - Cohort size
- Export to PDF/Excel

### 🔑 Use Cases:
- Onboard travel agency baru (create tenant)
- Monitor system health across all tenants
- Investigate security anomaly (failed login spike)
- Extend trial OCR feature untuk tenant ABC (+7 days)
- Suspend tenant yang nunggak payment
- Analisis churn: kenapa tenant XYZ cancel subscription
- View MRR growth trend 12 bulan terakhir
- Contact tenant yang approaching quota limit
- Generate platform analytics untuk investor
- Resolve performance anomaly (API timeout spike)
- Track conversion rate trial to paid

### 💡 Key Differences:
- **Multi-tenant scope:** Manage multiple agencies, bukan single agency
- **Platform-level:** Infrastructure, system health, SaaS metrics
- **No business operations:** Tidak manage jamaah/dokumen/payment
- **B2B focus:** Customers are agencies, bukan end-users
- **Billing & subscription:** Manage tenant subscriptions
- **System administration:** Performance, security, anomalies

### 🎨 Base URL: `http://localhost:3001/super-admin/tenants`

---

## 📊 Comparison Matrix

| Aspect | Admin | Agent | Jamaah | Owner | Super Admin |
|--------|-------|-------|--------|-------|-------------|
| **User Type** | Staff | Sales Agent | Customer | CEO | Platform Admin |
| **Scope** | All jamaah | Assigned jamaah only | Self only | All (aggregate) | All tenants |
| **Focus** | Operations | Sales & CRM | Self-service | Analytics | Platform management |
| **CRUD Access** | ✅ Full | ⚠️ Limited | ⚠️ Self only | ❌ Read-only | ✅ Tenant-level |
| **Payment Recording** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Document Approval** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Commission Tracking** | ✅ View all | ✅ Own only | ❌ No | ✅ View all | ❌ No |
| **Landing Page Builder** | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Lead Management** | ⚠️ View | ✅ Manage | ❌ No | ⚠️ View | ❌ No |
| **Analytics Level** | Basic | Sales | Personal | Business Intelligence | Platform Intelligence |
| **Package Management** | ✅ Create/Edit | ⚠️ View only | ⚠️ View only | ⚠️ View only | ❌ No |
| **Team Management** | ⚠️ Limited | ❌ No | ❌ No | ✅ Full | ✅ Tenant-level |
| **Billing & Subscription** | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Platform-level |

### Legend:
- ✅ Full Access
- ⚠️ Limited/View-only
- ❌ No Access

---

## 🔐 Access Control & Permissions

### Role Hierarchy:
```
Super Admin (Platform Level)
    ↓
Owner (Agency Level)
    ↓
Admin (Operations Level)
    ↓
Agent (Sales Level)

Jamaah (Customer Level) - Separate hierarchy
```

### Data Visibility:

**Super Admin:**
- Tenant 1 → Agency A → All data
- Tenant 2 → Agency B → All data
- Tenant 3 → Agency C → All data

**Owner (Agency A):**
- Agency A → All data (aggregated)
- Cannot see other agencies

**Admin (Agency A):**
- Agency A → All jamaah, agents, documents
- Full operational access

**Agent 1 (Agency A):**
- Agency A → Only assigned jamaah (e.g., 12 of 55)
- Cannot see other agents' jamaah

**Jamaah:**
- Own data only
- Cannot see other jamaah

---

## 🎯 User Journey Examples

### Journey 1: New Jamaah Registration (Admin Flow)
1. **Admin Portal:** Admin creates new jamaah record
2. **Admin Portal:** Admin assigns jamaah to Agent 1
3. **Agent Portal:** Agent 1 sees new jamaah in "My Jamaah"
4. **Agent Portal:** Agent 1 uploads KTP for jamaah
5. **Admin Portal:** Admin reviews & approves KTP
6. **Jamaah Portal:** Jamaah receives notification "KTP approved"
7. **Jamaah Portal:** Jamaah uploads remaining documents (self-service)

### Journey 2: Lead Conversion (Agent Flow)
1. **Agent Portal:** Agent creates landing page for "Umroh Ramadan"
2. **Agent Portal:** Agent shares QR code di WhatsApp Status
3. **Lead:** Customer klik link, isi form
4. **Agent Portal:** Lead baru masuk, status "Baru"
5. **Agent Portal:** Agent klik "Hubungi" → buka WhatsApp
6. **WhatsApp:** Agent follow-up lead
7. **Agent Portal:** Agent update status → "Dihubungi"
8. **Agent Portal:** Lead setuju → Agent klik "Convert to Jamaah"
9. **Admin Portal:** New jamaah appears (created by Agent)
10. **Agent Portal:** Commission pending count +1

### Journey 3: Payment Tracking (Multi-Portal)
1. **Jamaah Portal:** Jamaah cek Virtual Account number
2. **Jamaah Portal:** Copy VA number
3. **External:** Jamaah transfer via mobile banking
4. **Admin Portal:** Admin receives payment notification (external system)
5. **Admin Portal:** Admin records payment (DP Rp 10jt)
6. **Jamaah Portal:** Payment status updates (DP: Paid ✅)
7. **Owner Dashboard:** Revenue metrics update (+Rp 10jt)
8. **Agent Portal:** Commission pending updates

### Journey 4: Business Intelligence (Owner Flow)
1. **Owner Dashboard:** Owner opens dashboard
2. **Owner Dashboard:** Checks MRR: Rp 45.75M
3. **Owner Dashboard:** Notices revenue growth -5% (down)
4. **Owner Dashboard:** Opens agent performance analytics
5. **Owner Dashboard:** Sees Agent A conversion rate drop from 35% to 15%
6. **Owner Dashboard:** Generate detailed agent performance report
7. **Owner Dashboard:** Export to PDF
8. **External:** Owner schedules meeting with Agent A untuk coaching

### Journey 5: Platform Management (Super Admin Flow)
1. **Super Admin:** Monitors system health dashboard
2. **Super Admin:** Sees anomaly "API timeout spike" (Critical)
3. **Super Admin:** Opens anomaly detail → Tenant "ABC Travel"
4. **Super Admin:** Checks tenant usage → 450/500 jamaah (90% quota)
5. **Super Admin:** Marks anomaly as "Investigating"
6. **Super Admin:** Contacts tenant → recommend upgrade to Professional
7. **Super Admin:** Tenant agrees, Super Admin upgrades plan
8. **Super Admin:** Anomaly resolves, marks as "Resolved"
9. **Super Admin:** Reviews platform analytics → MRR +Rp 2jt

---

## 🚀 Technical Stack (Shared)

Semua 5 portal menggunakan teknologi yang sama:

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **State:** React hooks (useState, useEffect)
- **Notifications:** Sonner (toast)
- **Mock Data:** Static TypeScript files

### Shared Components:
- `<AppLayout>` - Main layout wrapper
- `<SidebarNav>` - Desktop sidebar
- `<TopNavBar>` - Header with user info
- `<BottomTabBar>` - Mobile navigation
- `<Breadcrumb>` - Navigation breadcrumbs

### Portal-Specific:
Each portal has dedicated:
- Route prefix (e.g., `/agent/*`, `/my/*`)
- Menu items configuration
- Page components
- Mock data files

---

## 📈 Statistics

| Metric | Count |
|--------|-------|
| **Total Portals** | 5 |
| **Total Pages** | 31 |
| **Total Menu Items** | 29 |
| **Admin Pages** | 9 |
| **Agent Pages** | 7 |
| **Jamaah Pages** | 6 |
| **Owner Pages** | 5 |
| **Super Admin Pages** | 5 |
| **Shared Components** | 15+ |
| **Mock Data Files** | 18+ |
| **Lines of Code** | ~14,000 |

---

## ✅ Summary

### Quick Reference:

- **Admin Portal** = Operasional harian (CRUD semua data)
- **Agent Portal** = Sales & CRM (manage assigned jamaah + leads + komisi)
- **Jamaah Portal** = Self-service customer (track progress umroh)
- **Owner Dashboard** = Business intelligence (strategic analytics)
- **Super Admin Platform** = SaaS management (multi-tenant operations)

### Key Principle:

> **"Right tool for the right user"**
>
> Setiap portal dirancang spesifik untuk kebutuhan peran pengguna, dengan akses data dan fitur yang sesuai tanpa overwhelming dengan informasi yang tidak relevan.

---

*Dokumentasi ini memberikan overview lengkap untuk memahami fungsi dan perbedaan masing-masing portal dalam sistem Travel Umroh Multi-Portal.* 🎉
