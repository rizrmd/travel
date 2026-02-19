# 📦 Product & Sales Flow - Implementation Plan

**Date:** 2025-12-25
**Status:** PROPOSAL - Untuk Pertimbangan
**Priority:** HIGH - Missing Core Business Logic

---

## 🎯 Problem Statement

User benar: **"Sejauh ini masih ranah operasional saja, tapi barang dagangannya belum ada"**

### ✅ Yang Sudah Ada (Operational Features):
- Admin bisa lihat list 6 paket (read-only mock data)
- Agent bisa pilih paket untuk landing page (dari mock data)
- Jamaah bisa lihat itinerary paket mereka
- Payment tracking & document management

### ❌ Yang Belum Ada (Product & Sales Engine):
1. **Package Creation Flow** - Admin belum bisa CREATE paket baru
2. **Itinerary Builder** - Belum ada UI untuk build itinerary day-by-day
3. **Package Assignment to Agents** - Belum ada logic paket mana bisa dijual agent mana
4. **Landing Page → Lead Form** - Landing page generator ada, tapi form submission belum
5. **Lead → Jamaah Conversion** - Modal convert ada, tapi belum create jamaah real
6. **Package → Revenue Connection** - Belum ada tracking paket mana yang menghasilkan revenue

**Analogi:** Seperti punya sistem kasir (operasional), tapi belum ada katalog produk dan sistem sales (bisnis).

---

## 🏢 Comparison: Travel Umroh vs Erahajj

### 📊 Berdasarkan PRD & Architecture:

| Aspek | Erahajj (Market Leader) | Travel Umroh (Kita) | Status |
|-------|-------------------------|---------------------|--------|
| **Target User** | Self-service jamaah | Agent-driven model | ✅ Unique positioning |
| **Core Focus** | Jamaah manage sendiri | Agent manage for jamaah | ✅ Different approach |
| **Package Management** | ✅ Full CRUD | ❌ Belum ada | 🔴 MISSING |
| **Agent Tools** | ⚠️ Limited | ✅ Landing page builder | ✅ Better |
| **Document Flow** | Self-service only | Agent-assisted + self | ✅ Better |
| **Commission System** | ⚠️ Basic | ✅ Tier-based (Slvr/Gld/Pltm) | ✅ Better |
| **WhatsApp Integration** | ⚠️ Manual | ✅ Bulk send + templates | ✅ Better |
| **UX Complexity** | ❌ Complex, feature overload | ✅ Simple, progressive | ✅ Better |

### 🎯 Erahajj's Weakness = Travel Umroh's Opportunity:

**Erahajj assumes:**
- Jamaah akan self-service (SALAH untuk 80% market Indonesia)
- Feature lengkap = better (SALAH, malah overwhelming)
- Agent hanya sales channel (SALAH, agent adalah full-service provider)

**Travel Umroh understands:**
- Agent butuh tools untuk manage jamaah efficiently
- Simple UX > Feature overload
- Agent bukan cuma sales, tapi service provider

### ⚠️ Current Gap:

**Kita punya agent tools BAGUS tapi belum punya "barang dagangan" yang proper!**

---

## 🔄 Complete Product-to-Revenue Flow (Yang Harus Ada)

### Flow Yang Diinginkan:

```
1. ADMIN PORTAL: Create Package
   ↓
2. ADMIN PORTAL: Build Itinerary Day-by-Day
   ↓
3. ADMIN PORTAL: Set Dual Pricing (Retail vs Wholesale)
   ↓
4. ADMIN PORTAL: Publish Package (Active/Inactive)
   ↓
5. AGENT PORTAL: Pilih Package → Create Landing Page
   ↓
6. LANDING PAGE (Public): Customer lihat package details
   ↓
7. LANDING PAGE (Public): Customer submit form → CREATE LEAD
   ↓
8. AGENT PORTAL: Terima lead baru, hubungi via WhatsApp
   ↓
9. AGENT PORTAL: Convert Lead → CREATE JAMAAH
   ↓
10. ADMIN PORTAL: Jamaah baru masuk, assign ke agent
    ↓
11. JAMAAH PORTAL: Jamaah bisa track progress
    ↓
12. ADMIN PORTAL: Record payment
    ↓
13. AGENT PORTAL: Commission calculated
    ↓
14. OWNER DASHBOARD: Revenue tracked by package
```

### Flow Yang Saat Ini Berjalan:

```
1. ❌ ADMIN: Lihat mock packages (read-only)
2. ❌ AGENT: Pilih mock package → Generate landing page URL (tapi...)
3. ❌ LANDING PAGE: URL generated tapi form belum ada!
4. ❌ LEAD: Lead data hardcoded mock, bukan real submission
5. ⚠️ AGENT: Convert lead (modal ada, tapi create jamaah mock only)
6. ✅ ADMIN: Jamaah management works (but manual entry)
7. ✅ JAMAAH: Portal works
8. ✅ PAYMENT: Tracking works
9. ⚠️ COMMISSION: View works, tapi calculation manual
10. ⚠️ OWNER: Analytics works, tapi data mock
```

**Masalah:** Flow terputus di step 1-5! "Barang dagangan" belum bisa dibuat dan dijual secara real.

---

## 📋 Implementation Plan - Prioritized by Business Impact

### 🔴 PHASE 1: Package Management (MUST HAVE - Foundational)
**Priority: CRITICAL**
**Timeline: 1 week**
**Why First:** Tanpa ini, tidak ada "barang dagangan" untuk dijual

#### Story 1.1: Package CRUD (Admin Portal)
**Route:** `/packages/create`, `/packages/[id]/edit`

**Features:**
- Create package form:
  - Package name
  - Duration (e.g., "9 Hari 7 Malam")
  - Description
  - Price retail
  - Price wholesale (untuk agent)
  - Status (Active/Inactive)
- Edit package
- Delete package (soft delete, archive)
- Validation rules

**UI Components:**
```typescript
<PackageForm>
  <Input name="name" label="Nama Paket" />
  <Input name="duration" label="Durasi" placeholder="9 Hari 7 Malam" />
  <Textarea name="description" label="Deskripsi" />
  <Input name="priceRetail" type="number" label="Harga Retail" />
  <Input name="priceWholesale" type="number" label="Harga Wholesale (Agent)" />
  <ItineraryBuilder days={[]} />
  <InclusionsEditor items={[]} />
  <ExclusionsEditor items={[]} />
  <Select name="status" options={['Active', 'Inactive']} />
</PackageForm>
```

**Mock Data → Real Data Migration:**
- Keep mock data as seed data
- Add `createdBy`, `updatedBy` fields
- Add `agencyId` for multi-tenant (future)

#### Story 1.2: Itinerary Builder (Visual Day-by-Day)
**Why Critical:** Itinerary adalah selling point utama paket umroh

**Features:**
- Add/remove days
- Each day:
  - Day number (auto-increment)
  - Day title (e.g., "Keberangkatan Jakarta - Jeddah")
  - Multiple activities (add/remove/reorder)
- Drag & drop to reorder days
- Preview mode (show itinerary seperti jamaah lihat)

**UI Design:**
```
┌─────────────────────────────────────┐
│  Itinerary Builder                  │
├─────────────────────────────────────┤
│  [+ Add Day]                        │
│                                     │
│  ┌─── Day 1 ──────────────────┐   │
│  │ Title: [Keberangkatan...  ]│   │
│  │                            │   │
│  │ Activities:                │   │
│  │ • Berkumpul di Bandara     │   │
│  │   [Edit] [Delete]          │   │
│  │ • Penerbangan ke Jeddah    │   │
│  │   [Edit] [Delete]          │   │
│  │                            │   │
│  │ [+ Add Activity]           │   │
│  │                            │   │
│  │ [↑] [↓] [Remove Day]      │   │
│  └────────────────────────────┘   │
│                                     │
│  ┌─── Day 2 ──────────────────┐   │
│  │ ...                        │   │
│  └────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Component Structure:**
```typescript
<ItineraryBuilder
  value={itinerary}
  onChange={setItinerary}
>
  <DayCard day={1}>
    <Input name="title" />
    <ActivityList>
      <ActivityItem index={0} />
      <ActivityItem index={1} />
      <AddActivityButton />
    </ActivityList>
    <DayActions />
  </DayCard>
</ItineraryBuilder>
```

#### Story 1.3: Inclusions/Exclusions Editor
**Features:**
- List of inclusions (bullet points)
- List of exclusions (bullet points)
- Add/remove/edit items
- Common templates (copy dari paket lain)

**UI:**
```
Inclusions (Termasuk dalam Paket):
☑ Tiket pesawat PP Jakarta-Jeddah
☑ Hotel bintang 4 di Madinah
☑ Makan 3x sehari
[+ Add Inclusion]

Exclusions (Tidak Termasuk):
☐ Biaya passport dan visa
☐ Pengeluaran pribadi
[+ Add Exclusion]
```

---

### 🟠 PHASE 2: Agent Landing Page → Lead Submission (HIGH PRIORITY)
**Priority: HIGH**
**Timeline: 3 days**
**Why:** Connect sales tool (landing page) to actual leads

#### Story 2.1: Public Landing Page Template
**Route:** `/lp/[agentSlug]/[packageSlug]` (public, no auth)

**Features:**
- Display selected package details:
  - Package name, duration, price (RETAIL ONLY!)
  - Itinerary (read-only, beautiful display)
  - Inclusions/exclusions
  - Photos (future: upload package photos)
- Agent branding section:
  - Agent name
  - Agent photo
  - Agent bio/message
  - WhatsApp CTA button (primary)
- **Lead submission form:**
  - Nama lengkap (required)
  - Nomor WhatsApp (required)
  - Email (optional)
  - Catatan/pertanyaan (optional)
  - [Submit] → Create Lead

**Example URL:**
```
https://travelumroh.com/lp/ibu-siti/umroh-reguler-9-hari
                              ^agent     ^package
```

**Design Inspiration:**
- Single page scroll
- Hero: Package name + price + "Daftar Sekarang" CTA
- Section 1: Itinerary timeline (vertical)
- Section 2: Inclusions/Exclusions (2 columns)
- Section 3: Agent info + CTA
- Section 4: Lead form (sticky bottom or modal)

#### Story 2.2: Lead Form Submission → Create Lead
**Flow:**
1. Customer isi form di landing page
2. Submit → POST `/api/leads/submit`
3. Backend create Lead record:
   ```typescript
   {
     name: "Farida Rahman",
     phone: "+62 821-9876-5432",
     email: "farida@gmail.com",
     packageInterest: "Umroh Reguler 9 Hari", // from package
     source: "ibu-siti-umroh-reguler", // from landing page slug
     status: "new",
     dateSubmitted: "2024-12-25",
     agentId: "agent-siti-id", // from landing page
   }
   ```
4. Success → Show thank you message
5. Redirect to WhatsApp chat with agent (auto-open)

**Thank You Message:**
```
✅ Terima kasih! Formulir Anda telah dikirim.

Ibu Siti akan segera menghubungi Anda via WhatsApp
dalam 1x24 jam.

[💬 Chat WhatsApp Sekarang]
```

#### Story 2.3: Agent Notification (Lead Baru Masuk)
**Features:**
- Real-time notification (future: WebSocket)
- For MVP: Polling or refresh
- Badge count di sidebar "Leads" menu
- Toast notification saat ada lead baru

---

### 🟡 PHASE 3: Lead → Jamaah Conversion (MEDIUM PRIORITY)
**Priority: MEDIUM**
**Timeline: 2 days**
**Why:** Complete sales funnel dari lead sampai jamaah

#### Story 3.1: Convert Lead to Jamaah (Agent Portal)
**Current State:** Modal ada, tapi hanya simulasi

**Changes Needed:**
1. Pre-fill form dari lead data:
   - Nama dari lead
   - Phone dari lead
   - Package dari packageInterest
2. Add required fields untuk create jamaah:
   - NIK (16 digit)
   - Tanggal lahir
   - Alamat
   - Jenis kelamin
3. Submit → Create Jamaah record
4. Update Lead status → "converted"
5. Link lead.convertedToJamaahId → jamaah.id
6. Auto-assign jamaah to agent

**Flow:**
```
Lead (before):
{
  id: "lead-1",
  name: "Farida Rahman",
  phone: "+62 821-9876-5432",
  packageInterest: "Umroh Reguler 9 Hari",
  status: "new"
}

Agent clicks "Convert to Jamaah" → Form pre-filled

Agent fills additional data:
- NIK: 3201012345670001
- Tanggal lahir: 1985-05-15
- Alamat: Jl. Merdeka No. 123, Jakarta
- Jenis kelamin: Perempuan

Submit → Create Jamaah:
{
  id: "j-56",
  name: "Farida Rahman", // from lead
  nik: "3201012345670001",
  phone: "+62 821-9876-5432", // from lead
  package: "Umroh Reguler 9 Hari", // from lead.packageInterest
  agentId: "agent-siti",
  status: "pending-documents",
  ...
}

Update Lead:
{
  id: "lead-1",
  status: "converted",
  convertedToJamaahId: "j-56"
}
```

#### Story 3.2: Package → Jamaah Connection
**Why:** Track revenue per package

**Changes to Jamaah model:**
```typescript
interface Jamaah {
  // ... existing fields
  packageId: string // NEW: link to Package.id
  packageName: string // denormalized for quick access
  packagePrice: number // snapshot price saat daftar
  packagePriceType: 'retail' | 'wholesale' // apa harga yang dipakai
}
```

**Benefits:**
- Owner dashboard: Revenue by package (real data)
- Analytics: Package mana yang paling laku
- Commission calculation: Based on package price
- Price history: Kalau package harga berubah, jamaah lama tetap pakai harga lama

---

### 🟢 PHASE 4: Package Analytics & Reporting (NICE TO HAVE)
**Priority: LOW (can wait)**
**Timeline: 2 days**
**Why:** Business intelligence untuk Owner

#### Story 4.1: Package Performance Dashboard (Owner)
**Route:** `/owner/packages` (new page)

**Metrics:**
- Revenue per package (total & monthly)
- Bookings count per package
- Conversion rate (leads → jamaah) per package
- Average sale price per package
- Top 5 best-selling packages
- Package trend (growing/declining)

**Visualizations:**
```
┌─────────────────────────────────────┐
│  Package Performance                │
├─────────────────────────────────────┤
│                                     │
│  Total Revenue: Rp 1.2 Miliar      │
│  Total Bookings: 48 jamaah          │
│  Best Seller: Umroh Reguler 9 Hari │
│                                     │
│  ┌─── Top Packages ───────────┐   │
│  │ 1. Umroh Reguler 9 Hari    │   │
│  │    • 25 bookings           │   │
│  │    • Rp 625 juta           │   │
│  │    • ████████████ 52%      │   │
│  │                            │   │
│  │ 2. Umroh Plus Turki        │   │
│  │    • 12 bookings           │   │
│  │    • Rp 384 juta           │   │
│  │    • ██████ 25%            │   │
│  └────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Story 4.2: Lead Source Tracking
**Why:** Track mana landing page yang paling efektif

**Features:**
- Lead source breakdown (landing page slug)
- Conversion rate per source
- Best performing agent landing pages

---

## 🛠️ Technical Implementation Details

### Database Schema Changes (Backend - for reference)

```sql
-- Packages table (replace mock data)
CREATE TABLE packages (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(50), -- "9 Hari 7 Malam"
  price_retail INTEGER NOT NULL,
  price_wholesale INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active/inactive
  description TEXT,
  itinerary JSONB, -- array of {day, title, activities[]}
  inclusions JSONB, -- array of strings
  exclusions JSONB, -- array of strings
  created_by UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id), -- multi-tenant
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Landing pages table
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL, -- "ibu-siti-umroh-reguler"
  agent_id UUID REFERENCES users(id),
  package_id UUID REFERENCES packages(id),
  agent_name VARCHAR(255),
  agent_phone VARCHAR(50),
  agent_whatsapp VARCHAR(50),
  agent_photo_url VARCHAR(500),
  custom_message TEXT,
  views_count INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leads table (replace mock data)
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  package_id UUID REFERENCES packages(id),
  package_interest VARCHAR(255), -- denormalized
  source VARCHAR(255), -- landing page slug
  landing_page_id UUID REFERENCES landing_pages(id),
  agent_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'new', -- new/contacted/converted/lost
  date_submitted TIMESTAMP DEFAULT NOW(),
  last_contacted_at TIMESTAMP,
  notes TEXT,
  converted_to_jamaah_id UUID REFERENCES jamaah(id),
  converted_at TIMESTAMP
);

-- Jamaah table (add package connection)
ALTER TABLE jamaah ADD COLUMN package_id UUID REFERENCES packages(id);
ALTER TABLE jamaah ADD COLUMN package_name VARCHAR(255); -- denormalized
ALTER TABLE jamaah ADD COLUMN package_price INTEGER; -- snapshot
ALTER TABLE jamaah ADD COLUMN package_price_type VARCHAR(20); -- retail/wholesale
```

### Frontend API Integration Points

**Phase 1: Package Management**
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package
- `PATCH /api/packages/:id/status` - Toggle active/inactive

**Phase 2: Landing Page**
- `GET /api/landing-pages/:slug` - Get landing page data (public)
- `POST /api/landing-pages` - Create landing page (agent)
- `POST /api/leads/submit` - Submit lead form (public)
- `GET /api/agents/:agentId/leads` - Get agent's leads

**Phase 3: Lead Conversion**
- `POST /api/leads/:id/convert` - Convert lead to jamaah
- `POST /api/jamaah` - Create jamaah (from lead data)

---

## 📊 Success Metrics

### Phase 1 (Package Management):
- ✅ Admin dapat create minimal 3 paket baru
- ✅ Itinerary builder dapat build 9-day itinerary dalam < 15 menit
- ✅ Package list menampilkan real data, bukan mock

### Phase 2 (Landing Page → Lead):
- ✅ Agent dapat generate landing page dalam < 2 menit
- ✅ Landing page dapat submit form → create lead real
- ✅ Minimal 5 test leads berhasil masuk dari form submission

### Phase 3 (Lead → Jamaah):
- ✅ Agent dapat convert lead → jamaah dalam < 3 menit
- ✅ Jamaah terhubung ke package (package_id populated)
- ✅ Lead status ter-update otomatis saat di-convert

### Phase 4 (Analytics):
- ✅ Owner dapat lihat revenue breakdown per package
- ✅ Top 5 packages ter-display dengan benar
- ✅ Conversion rate per landing page tracked

---

## 🎯 Recommended Priority Order

### Week 1: Foundation (MUST DO)
1. **Day 1-2:** Package CRUD form (create/edit)
2. **Day 3-4:** Itinerary builder component
3. **Day 5:** Inclusions/exclusions editor
4. **Day 6-7:** Testing & bug fixes

### Week 2: Sales Engine (HIGH PRIORITY)
1. **Day 1-2:** Public landing page template
2. **Day 2-3:** Lead form submission → create lead
3. **Day 4:** Agent notification for new leads
4. **Day 5:** Testing end-to-end flow

### Week 3: Conversion (COMPLETE THE FUNNEL)
1. **Day 1-2:** Lead → Jamaah conversion (real)
2. **Day 3:** Package → Jamaah connection
3. **Day 4:** Commission calculation update
4. **Day 5:** Testing & bug fixes

### Week 4: Polish & Analytics (OPTIONAL)
1. **Day 1-2:** Package performance dashboard
2. **Day 3:** Lead source tracking
3. **Day 4-5:** UI/UX improvements

---

## 🔍 Key Decisions Needed

### 1. Multi-Tenant or Single-Tenant First?
**Options:**
- **A) Single-tenant MVP:** All packages shared across all agents (simpler)
- **B) Multi-tenant from start:** Each agency has own packages (complex tapi scalable)

**Recommendation:** Start with single-tenant (Option A) untuk MVP, add multi-tenant Phase 2.

### 2. Package Photo Upload?
**Options:**
- **A) Phase 1:** Just text-based (faster MVP)
- **B) Include photo upload dari awal (better UX)

**Recommendation:** Phase 1 without photos, add in Phase 2.

### 3. Landing Page: Custom Domain atau Subdomain?
**Options:**
- **A) travelumroh.com/lp/agent-slug/package-slug** (simpler)
- **B) agent-name.travelumroh.com/package-slug** (lebih branded)

**Recommendation:** Option A untuk MVP, Option B future enhancement.

### 4. Commission Auto-Calculate atau Manual?
**Current:** Manual (agent bisa lihat, admin approve payout)
**Future:** Auto-calculate saat jamaah bayar lunas

**Recommendation:** Keep manual untuk Phase 1-3, auto-calculate Phase 4.

---

## 🚨 Risks & Mitigation

### Risk 1: Scope Creep
**Mitigation:** Stick to 3-phase plan, defer analytics to Phase 4

### Risk 2: Complex Itinerary Builder
**Mitigation:** Start simple (just text inputs), enhance UI incrementally

### Risk 3: Lead Spam from Public Form
**Mitigation:** Add reCAPTCHA atau simple honeypot field

### Risk 4: Package Pricing Changes → Existing Jamaah
**Mitigation:** Snapshot package price saat jamaah daftar (denormalized)

---

## 💡 Next Steps - Action Items

1. **Review this plan** - User feedback & approval
2. **Prioritize phases** - Confirm Week 1-4 timeline realistic
3. **Design decisions** - Resolve key decisions (multi-tenant, photos, etc.)
4. **Start Phase 1** - Package CRUD form implementation
5. **Backend coordination** - Ensure backend team aligned on schema

---

## 📝 Notes & Assumptions

- **Frontend-only scope:** This plan fokus pada UI/UX, assumes backend API will exist
- **Mock data transition:** Gradually replace mock dengan real API calls
- **User testing:** Plan untuk test dengan real agent setelah Phase 2
- **Documentation:** Update PORTAL-OVERVIEW.md setelah implementation

---

*Plan ini comprehensive but achievable dalam 3-4 minggu. Phase 1-2 adalah CRITICAL untuk business functioning. Phase 3 completes the funnel. Phase 4 adalah bonus analytics.*

**User: Apakah plan ini masuk akal? Ada yang perlu disesuaikan?** 🚀
