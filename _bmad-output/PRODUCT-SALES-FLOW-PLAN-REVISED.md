# 📦 Product & Sales Flow - REVISED Implementation Plan
**Based on BMAD Documentation (PRD + Architecture)**

**Date:** 2025-12-25
**Status:** REVISED - Aligned dengan BMAD
**Priority:** CRITICAL - Core Business Engine

---

## 🎯 BMAD Requirements Summary

Berdasarkan analisis mendalam dokumen BMAD (PRD + Architecture), berikut requirement aktual:

### 📋 From PRD - Package Management (FR-8):

```
FR-8.1: Agency owners SHALL create, edit, delete umroh packages
FR-8.2: System SHALL support itinerary builder for package details
FR-8.3: System SHALL support DUAL PRICING (retail for public, wholesale for agents)
FR-8.4: System SHALL support inclusions/exclusions documentation per package
FR-8.5: System SHALL AUTO-BROADCAST package updates to authenticated agents
FR-8.6: System SHALL version package changes for audit trail
FR-8.7: Agents SHALL view assigned packages (view-only, cannot edit)
```

### 🏗️ From Architecture - Technical Approach:

```
- Caching: Redis with 1-hour TTL for packages, invalidate on admin update
- Real-Time: WebSocket (Socket.IO) for package broadcast to agents
- Multi-Tenant: Package isolation by tenantId (agency_id)
- Dual Pricing: Separate fields price_retail, price_wholesale
- Agent Assignment: Junction table package_assignments (which agents can sell which packages)
```

### 💰 Commission Tier Structure (From mock-commissions.ts):

| Tier | Commission Rate | Min Jamaah | Max Jamaah | Benefits |
|------|-----------------|------------|------------|----------|
| **Silver** | 4% | 0 | 19 | Basic access, landing page builder |
| **Gold** | 6% | 20 | 49 | + Premium templates, priority support |
| **Platinum** | 8% | 50+ | - | + Custom branding, dedicated manager |

**Commission Calculation:**
- `commission = packagePrice * (tier_rate / 100)`
- Example: Paket Rp 35jt × 4% = Rp 1.4jt (Silver agent)
- Same paket × 6% = Rp 2.1jt (Gold agent)

### 🔐 Multi-Level Agent Hierarchy:

```
Agency Owner (Pak Hadi)
  ├─ Agent (Ibu Siti) - Full access, sees wholesale pricing
  │   ├─ Affiliate (Dani) - Limited access, sees commission only
  │   │   └─ Sub-Affiliate - (future)
  │   └─ Affiliate 2
  └─ Agent 2
```

**Pricing Visibility Rules:**
- **Public (jamaah):** Sees RETAIL pricing only
- **Agent (direct):** Sees WHOLESALE pricing + commission calculation
- **Affiliate:** Sees RETAIL pricing + their commission (NOT wholesale!)
- **Admin/Owner:** Sees both retail & wholesale

**Critical Insight dari PRD:**
> "Dani CANNOT see wholesale pricing (only his commission structure)"

Artinya affiliate tidak boleh tau harga wholesale, cuma tau komisi mereka.

---

## 🔄 Complete Product-to-Revenue Flow (BMAD Compliant)

### Flow 1: Package Creation → Agent Assignment

```
1. ADMIN PORTAL: Owner/Admin creates package
   ↓
2. Set DUAL PRICING:
   - Retail: Rp 35,000,000 (untuk public/landing page)
   - Wholesale: Rp 32,000,000 (untuk agent)
   - Margin: Rp 3,000,000 (agency profit before commission)
   ↓
3. Build itinerary (day-by-day)
   ↓
4. Set inclusions/exclusions
   ↓
5. ASSIGN TO AGENTS:
   - Select which agents can sell this package
   - Agent sees new package notification (WebSocket)
   - Cache invalidation (Redis) → Fresh data to all agents
   ↓
6. AUTO-BROADCAST:
   - System broadcasts to authenticated agents via WhatsApp/notification
   - "Paket baru tersedia: Umroh Reguler 9 Hari - Rp 32jt (wholesale)"
```

### Flow 2: Agent Landing Page → Lead Conversion

```
1. AGENT PORTAL: Agent selects from ASSIGNED packages only
   ↓
2. Landing Page Builder:
   - Package details auto-populated
   - Shows RETAIL price (Rp 35jt) ← Important!
   - Agent branding (name, photo, WhatsApp)
   ↓
3. Generate landing page URL:
   - Format: /lp/[agent-slug]/[package-slug]
   - Example: /lp/ibu-siti/umroh-reguler-9-hari
   ↓
4. PUBLIC LANDING PAGE:
   - Customer sees RETAIL price (Rp 35jt)
   - Customer NEVER sees wholesale price
   - Submit lead form → Create Lead record
   ↓
5. LEAD CREATED:
   - Agent notified via WhatsApp + in-app notification
   - Lead shows up in Agent Portal → Leads page
   ↓
6. AGENT CONVERTS LEAD:
   - Agent follows up via WhatsApp
   - Agent clicks "Convert to Jamaah"
   - System creates Jamaah record with:
     * packageId (link to package)
     * packagePrice: Rp 35,000,000 (RETAIL snapshot)
     * agentId: Ibu Siti
     * agentTier: Silver (current tier)
   ↓
7. COMMISSION CALCULATED:
   - Based on RETAIL price (not wholesale!)
   - Silver (4%): Rp 35jt × 4% = Rp 1.4jt
   - Commission status: "Pending" (until jamaah pays full)
```

### Flow 3: Multi-Level Commission (Agent → Affiliate)

```
Scenario: Agent Ibu Siti has affiliate Dani

1. Dani's Landing Page:
   - Shows RETAIL price (Rp 35jt)
   - Dani's branding
   ↓
2. Lead converts → Jamaah created:
   - packagePrice: Rp 35jt (retail)
   - agentId: Ibu Siti (parent agent)
   - affiliateId: Dani (who brought the lead)
   ↓
3. Commission Split (example):
   - Total commission: Rp 1.4jt (4% of Rp 35jt)
   - Dani (affiliate): Rp 700K (50% split)
   - Ibu Siti (agent): Rp 700K (50% split)
   ↓
4. Visibility:
   - Dani sees: "Your commission: Rp 700K"
   - Dani DOES NOT see: Wholesale price (Rp 32jt)
   - Ibu Siti sees: Wholesale Rp 32jt, her commission Rp 700K
```

**Why This Matters (dari PRD):**
> "Secure pricing separation (wholesale vs retail)" - FR-2.4
> "Granular access control ensures wholesale pricing never leaks"

Ini untuk prevent:
1. Affiliate jual langsung dengan harga wholesale (bypass agent)
2. Customer tau margin agency (pricing transparency issue)
3. Race to bottom pricing competition antar agents

---

## 📊 Database Schema (Backend Reference)

### Core Tables:

```sql
-- Packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id), -- Multi-tenant isolation
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  duration VARCHAR(50), -- "9 Hari 7 Malam"

  -- DUAL PRICING (Critical!)
  price_retail INTEGER NOT NULL, -- Public sees this
  price_wholesale INTEGER NOT NULL, -- Agents see this

  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active/inactive/draft

  -- JSONB fields
  itinerary JSONB, -- [{day: 1, title: "...", activities: [...]}]
  inclusions JSONB, -- ["Tiket pesawat", "Hotel bintang 4", ...]
  exclusions JSONB, -- ["Visa", "Pengeluaran pribadi", ...]

  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  version INTEGER DEFAULT 1, -- Audit trail (FR-8.6)

  UNIQUE(agency_id, slug)
);

-- Package Assignments (Which agents can sell which packages)
CREATE TABLE package_assignments (
  id UUID PRIMARY KEY,
  package_id UUID REFERENCES packages(id),
  agent_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id), -- Who assigned (admin/owner)

  UNIQUE(package_id, agent_id)
);

-- Package Version History (Audit trail - FR-8.6)
CREATE TABLE package_versions (
  id UUID PRIMARY KEY,
  package_id UUID REFERENCES packages(id),
  version INTEGER NOT NULL,
  changes JSONB, -- What changed
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Landing Pages
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  package_id UUID REFERENCES packages(id),
  agent_id UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id),

  -- Agent branding
  agent_name VARCHAR(255),
  agent_photo_url VARCHAR(500),
  agent_phone VARCHAR(50),
  agent_whatsapp VARCHAR(50),
  custom_message TEXT,

  -- Analytics
  views_count INTEGER DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,

  -- Pricing shown (ALWAYS retail!)
  displayed_price INTEGER, -- Snapshot of package.price_retail

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  package_id UUID REFERENCES packages(id),
  landing_page_id UUID REFERENCES landing_pages(id),
  agent_id UUID REFERENCES users(id), -- Agent who owns landing page
  affiliate_id UUID REFERENCES users(id), -- If lead came from affiliate

  -- Lead info
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  notes TEXT,

  -- Status tracking
  status VARCHAR(20) DEFAULT 'new', -- new/contacted/converted/lost
  date_submitted TIMESTAMP DEFAULT NOW(),
  last_contacted_at TIMESTAMP,

  -- Conversion
  converted_to_jamaah_id UUID REFERENCES jamaah(id),
  converted_at TIMESTAMP
);

-- Jamaah (Enhanced with package connection)
ALTER TABLE jamaah ADD COLUMN package_id UUID REFERENCES packages(id);
ALTER TABLE jamaah ADD COLUMN package_name VARCHAR(255); -- Denormalized
ALTER TABLE jamaah ADD COLUMN package_price INTEGER; -- RETAIL price snapshot
ALTER TABLE jamaah ADD COLUMN package_price_type VARCHAR(20) DEFAULT 'retail'; -- retail/wholesale

-- Commissions (Enhanced with tier tracking)
CREATE TABLE commissions (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  jamaah_id UUID REFERENCES jamaah(id),
  package_id UUID REFERENCES packages(id),
  agent_id UUID REFERENCES users(id),
  affiliate_id UUID REFERENCES users(id), -- If multi-level

  -- Pricing snapshot
  package_price INTEGER NOT NULL, -- Price jamaah paid (retail)

  -- Commission calculation
  agent_tier VARCHAR(20), -- Silver/Gold/Platinum at time of earn
  commission_rate DECIMAL(5,2), -- 4.00, 6.00, 8.00
  commission_amount INTEGER,

  -- Multi-level split (if applicable)
  parent_commission_id UUID REFERENCES commissions(id),
  split_percentage DECIMAL(5,2), -- If split with affiliate

  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending/approved/paid
  earned_date TIMESTAMP DEFAULT NOW(),
  paid_date TIMESTAMP
);
```

---

## 🚀 REVISED Implementation Plan (BMAD Aligned)

### 🔴 PHASE 1: Package Management with Dual Pricing
**Timeline:** 1 week (5 days)
**Priority:** P0 - MUST HAVE

#### Day 1-2: Package CRUD + Dual Pricing
**Route:** `/packages/create`, `/packages/[id]/edit`

**Features:**
- Package creation form with:
  ```tsx
  <PackageForm>
    <Input name="name" label="Nama Paket" required />
    <Input name="slug" label="URL Slug" auto-generate />
    <Input name="duration" label="Durasi" placeholder="9 Hari 7 Malam" />

    {/* DUAL PRICING - Critical! */}
    <div className="grid grid-cols-2 gap-16">
      <div className="p-16 bg-blue-50 border border-blue-200 rounded-lg">
        <Label>Harga Retail (Public)</Label>
        <Input
          type="number"
          name="priceRetail"
          placeholder="35000000"
          helpText="Harga untuk customer di landing page"
        />
      </div>
      <div className="p-16 bg-green-50 border border-green-200 rounded-lg">
        <Label>Harga Wholesale (Agent)</Label>
        <Input
          type="number"
          name="priceWholesale"
          placeholder="32000000"
          helpText="Harga untuk agent (tidak tampil di public)"
        />
        <p className="text-sm text-slate-600 mt-8">
          Margin: {formatCurrency(priceRetail - priceWholesale)}
        </p>
      </div>
    </div>

    <Textarea name="description" label="Deskripsi Paket" rows={4} />
    <Select name="status" options={['active', 'inactive', 'draft']} />
  </PackageForm>
  ```

- **Commission Preview:**
  ```tsx
  <div className="mt-16 p-16 bg-slate-50 rounded-lg">
    <h4 className="font-semibold mb-8">Preview Komisi per Tier:</h4>
    <div className="space-y-4">
      <div className="flex justify-between">
        <span>Silver (4%):</span>
        <span className="font-bold">{formatCurrency(priceRetail * 0.04)}</span>
      </div>
      <div className="flex justify-between">
        <span>Gold (6%):</span>
        <span className="font-bold">{formatCurrency(priceRetail * 0.06)}</span>
      </div>
      <div className="flex justify-between">
        <span>Platinum (8%):</span>
        <span className="font-bold">{formatCurrency(priceRetail * 0.08)}</span>
      </div>
    </div>
    <p className="text-xs text-slate-500 mt-8">
      *Komisi dihitung dari harga retail
    </p>
  </div>
  ```

**API Endpoints:**
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Soft delete
- `GET /api/packages` - List (with role-based pricing visibility)

#### Day 3: Itinerary Builder
**Component:** `<ItineraryBuilder>`

```tsx
interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

<ItineraryBuilder
  value={itinerary}
  onChange={setItinerary}
  maxDays={30}
>
  {itinerary.map((day, index) => (
    <DayCard key={day.day} day={day.day} index={index}>
      <Input
        value={day.title}
        onChange={(e) => updateDayTitle(index, e.target.value)}
        placeholder="e.g., Keberangkatan Jakarta - Jeddah"
      />

      <ActivityList>
        {day.activities.map((activity, actIndex) => (
          <ActivityItem key={actIndex}>
            <Input
              value={activity}
              onChange={(e) => updateActivity(index, actIndex, e.target.value)}
              placeholder="e.g., Berkumpul di Bandara"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeActivity(index, actIndex)}
            >
              <X className="h-16 w-16" />
            </Button>
          </ActivityItem>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addActivity(index)}
        >
          + Add Activity
        </Button>
      </ActivityList>

      <div className="flex gap-8 mt-12">
        <Button size="sm" onClick={() => moveDay(index, 'up')} disabled={index === 0}>
          ↑ Move Up
        </Button>
        <Button size="sm" onClick={() => moveDay(index, 'down')} disabled={index === itinerary.length - 1}>
          ↓ Move Down
        </Button>
        <Button size="sm" variant="destructive" onClick={() => removeDay(index)}>
          Remove Day
        </Button>
      </div>
    </DayCard>
  ))}

  <Button onClick={addDay}>
    + Add Day {itinerary.length + 1}
  </Button>
</ItineraryBuilder>
```

#### Day 4: Inclusions/Exclusions Editor

```tsx
<div className="grid grid-cols-2 gap-16">
  <div>
    <Label>Inclusions (Termasuk)</Label>
    <ItemList
      items={inclusions}
      onChange={setInclusions}
      placeholder="e.g., Tiket pesawat PP Jakarta-Jeddah"
      addButtonText="+ Add Inclusion"
    />
  </div>

  <div>
    <Label>Exclusions (Tidak Termasuk)</Label>
    <ItemList
      items={exclusions}
      onChange={setExclusions}
      placeholder="e.g., Biaya passport dan visa"
      addButtonText="+ Add Exclusion"
    />
  </div>
</div>

{/* Common Templates */}
<div className="mt-16">
  <Label>Copy from Template:</Label>
  <Select onChange={(template) => applyTemplate(template)}>
    <option value="">-- Pilih Template --</option>
    <option value="standard">Standard Umroh</option>
    <option value="vip">VIP Umroh</option>
    <option value="plus">Umroh Plus</option>
  </Select>
</div>
```

#### Day 5: Package Assignment to Agents

**Route:** `/packages/[id]/assign-agents`

```tsx
<PackageAssignment packageId={packageId}>
  <div className="mb-16">
    <h3 className="font-semibold">Assign Package to Agents</h3>
    <p className="text-sm text-slate-600">
      Pilih agent mana yang bisa menjual paket ini
    </p>
  </div>

  {/* Agent Selection */}
  <div className="space-y-8">
    {agents.map(agent => (
      <div key={agent.id} className="flex items-center gap-12 p-12 border rounded-lg">
        <Checkbox
          checked={assignedAgents.includes(agent.id)}
          onChange={() => toggleAgent(agent.id)}
        />
        <div className="flex-1">
          <p className="font-medium">{agent.name}</p>
          <p className="text-sm text-slate-500">
            Tier: {agent.tier} | {agent.jamaahCount} jamaah | {agent.phone}
          </p>
        </div>
        <Badge>{agent.tier}</Badge>
      </div>
    ))}
  </div>

  <div className="mt-16 flex gap-8">
    <Button onClick={selectAll}>Select All</Button>
    <Button variant="outline" onClick={selectNone}>Deselect All</Button>
  </div>

  <div className="mt-16 p-12 bg-blue-50 rounded-lg">
    <p className="text-sm text-blue-900">
      ✅ {assignedAgents.length} agent akan menerima notifikasi paket baru ini
    </p>
  </div>

  <Button className="mt-16" onClick={saveAssignments}>
    Save & Broadcast to Agents
  </Button>
</PackageAssignment>
```

**Backend Logic:**
```typescript
// When saving assignments
async savePackageAssignments(packageId, agentIds) {
  // 1. Save to package_assignments table
  await db.packageAssignments.upsert(packageId, agentIds)

  // 2. Invalidate cache (Redis)
  await cache.invalidate(`packages:${agencyId}:*`)

  // 3. WebSocket broadcast to affected agents
  agentIds.forEach(agentId => {
    io.to(`agent:${agentId}`).emit('package:new', {
      packageId,
      packageName,
      priceWholesale, // Agent sees wholesale
      message: `Paket baru tersedia: ${packageName}`
    })
  })

  // 4. Optional: WhatsApp broadcast (Coming Soon feature)
  // await whatsapp.broadcast(agentIds, templateMessage)
}
```

---

### 🟠 PHASE 2: Agent Package Visibility & Landing Page
**Timeline:** 3 days
**Priority:** P0 - MUST HAVE

#### Day 6: Agent Package List (Assigned Only)

**Route:** `/agent/packages` (new page in agent portal)

```tsx
<AppLayout menuItems={agentMenuItems}>
  <div className="mb-24">
    <h1 className="text-h2">Paket yang Dapat Anda Jual</h1>
    <p className="text-body text-slate-600">
      Paket yang sudah di-assign oleh agency untuk Anda promosikan
    </p>
  </div>

  {/* Filter */}
  <div className="mb-16 flex gap-8">
    <Select value={statusFilter} onChange={setStatusFilter}>
      <option value="all">Semua Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </Select>
  </div>

  {/* Package Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
    {assignedPackages.map(pkg => (
      <Card key={pkg.id} className="p-20">
        <Badge className={pkg.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}>
          {pkg.status}
        </Badge>

        <h3 className="font-bold text-lg mt-12">{pkg.name}</h3>
        <p className="text-sm text-slate-600 mb-12">{pkg.duration}</p>

        {/* Pricing - WHOLESALE for agent */}
        <div className="p-12 bg-green-50 border border-green-200 rounded-lg mb-12">
          <p className="text-xs text-green-700">Harga Wholesale (Anda)</p>
          <p className="text-xl font-bold text-green-900">
            {formatCurrency(pkg.priceWholesale)}
          </p>
          <p className="text-xs text-green-600 mt-4">
            Komisi {currentTier.commissionRate}%: {formatCurrency(pkg.priceRetail * currentTier.commissionRate / 100)}
          </p>
        </div>

        <div className="text-xs text-slate-500 mb-12">
          <p>Harga Public: {formatCurrency(pkg.priceRetail)}</p>
          <p>Margin: {formatCurrency(pkg.priceRetail - pkg.priceWholesale)}</p>
        </div>

        <div className="flex gap-8">
          <Button
            size="sm"
            onClick={() => viewDetails(pkg.id)}
          >
            Lihat Detail
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => createLandingPage(pkg.id)}
          >
            Buat Landing Page
          </Button>
        </div>
      </Card>
    ))}
  </div>

  {assignedPackages.length === 0 && (
    <Card className="p-48 text-center">
      <p className="text-slate-500">
        Belum ada paket yang di-assign untuk Anda.
        Hubungi admin untuk mendapatkan akses paket.
      </p>
    </Card>
  )}
</AppLayout>
```

**API:**
```typescript
// GET /api/agent/packages
// Returns only packages assigned to current agent
// Pricing: Shows wholesale price
async getAgentPackages(agentId) {
  const packages = await db.packages
    .join('package_assignments', 'packages.id', 'package_assignments.package_id')
    .where('package_assignments.agent_id', agentId)
    .where('packages.status', 'active')
    .select([
      'packages.*',
      'packages.price_wholesale', // Agent sees this
      'packages.price_retail' // For commission calculation
    ])

  return packages
}
```

#### Day 7-8: Landing Page Generator (Enhanced)

**Changes to existing `/agent/landing-builder/create`:**

1. **Step 1: Package Selection** - Only show assigned packages
```tsx
// BEFORE: mockPackages (all packages)
const availablePackages = mockPackages

// AFTER: Only assigned packages
const availablePackages = await fetch('/api/agent/packages')
```

2. **Step 3: Preview** - Ensure RETAIL price shown
```tsx
<div className="preview-section">
  <h2>{selectedPackage.name}</h2>
  <p className="text-3xl font-bold">
    {formatCurrency(selectedPackage.priceRetail)}
    {/* NEVER show priceWholesale in preview! */}
  </p>

  <div className="commission-note bg-blue-50 p-12">
    <p className="text-sm text-blue-900">
      💰 Your Commission ({currentTier.commissionRate}%):
      {formatCurrency(selectedPackage.priceRetail * currentTier.commissionRate / 100)}
    </p>
    <p className="text-xs text-blue-700 mt-4">
      (Komisi dihitung dari harga retail, tidak tampil di landing page)
    </p>
  </div>
</div>
```

3. **Step 4: Generate** - Create landing page record
```typescript
async generateLandingPage(data) {
  const response = await fetch('/api/landing-pages', {
    method: 'POST',
    body: JSON.stringify({
      packageId: data.selectedPackageId,
      agentId: currentUser.id,
      agentName: data.agentName,
      agentPhoto: data.agentPhoto,
      agentPhone: data.agentPhone,
      agentWhatsapp: data.agentWhatsapp,
      customMessage: data.customMessage,
      // Server will auto-populate:
      // - displayed_price (from package.price_retail)
      // - slug (auto-generated)
    })
  })

  const { slug, url } = await response.json()

  // url = /lp/ibu-siti/umroh-reguler-9-hari
  return { slug, url }
}
```

---

### 🟡 PHASE 3: Public Landing Page & Lead Submission
**Timeline:** 2 days
**Priority:** P0 - MUST HAVE

#### Day 9: Public Landing Page Route

**Route:** `/lp/[agentSlug]/[packageSlug]/page.tsx` (PUBLIC, no auth)

```tsx
// app/lp/[agentSlug]/[packageSlug]/page.tsx
export default async function PublicLandingPage({ params }) {
  const { agentSlug, packageSlug } = params

  // Fetch landing page data (SERVER COMPONENT)
  const landingPage = await fetch(
    `${API_URL}/api/public/landing-pages/${agentSlug}/${packageSlug}`
  ).then(r => r.json())

  // Destructure
  const {
    package: pkg,
    agent,
    displayedPrice, // RETAIL price
    customMessage
  } = landingPage

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-16 py-48">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16">
            {pkg.name}
          </h1>
          <p className="text-xl text-slate-600 mb-24">
            {pkg.duration}
          </p>
          <div className="inline-block p-24 bg-white rounded-lg shadow-lg">
            <p className="text-sm text-slate-600 mb-8">Mulai dari</p>
            <p className="text-5xl font-bold text-emerald-600">
              {formatCurrency(displayedPrice)}
              {/* RETAIL price - NEVER show wholesale! */}
            </p>
            <p className="text-sm text-slate-500 mt-8">per orang</p>
          </div>

          <Button
            size="lg"
            className="mt-32 bg-whatsapp hover:bg-whatsapp/90"
            onClick={scrollToForm}
          >
            💬 Daftar Sekarang
          </Button>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className="container mx-auto px-16 py-48 bg-white">
        <h2 className="text-3xl font-bold text-center mb-32">
          Itinerary Perjalanan
        </h2>
        <div className="max-w-4xl mx-auto">
          {pkg.itinerary.map((day) => (
            <div key={day.day} className="mb-24 flex gap-16">
              <div className="flex-shrink-0 w-64 h-64 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                Day {day.day}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-8">{day.title}</h3>
                <ul className="space-y-4 text-slate-600">
                  {day.activities.map((activity, i) => (
                    <li key={i}>• {activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inclusions/Exclusions */}
      <section className="container mx-auto px-16 py-48">
        <div className="grid md:grid-cols-2 gap-32 max-w-5xl mx-auto">
          <div className="bg-green-50 p-32 rounded-lg">
            <h3 className="font-bold text-xl mb-16 text-green-900">
              ✅ Sudah Termasuk
            </h3>
            <ul className="space-y-8">
              {pkg.inclusions.map((item, i) => (
                <li key={i} className="flex gap-8">
                  <span className="text-green-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 p-32 rounded-lg">
            <h3 className="font-bold text-xl mb-16 text-red-900">
              ❌ Tidak Termasuk
            </h3>
            <ul className="space-y-8">
              {pkg.exclusions.map((item, i) => (
                <li key={i} className="flex gap-8">
                  <span className="text-red-600">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Agent Info Section */}
      <section className="container mx-auto px-16 py-48 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">
            Hubungi Agen Anda
          </h2>
          <div className="flex items-center justify-center gap-16 mb-24">
            <img
              src={agent.photoUrl || '/default-avatar.png'}
              alt={agent.name}
              className="w-96 h-96 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold text-xl">{agent.name}</p>
              <p className="text-slate-600">{agent.phone}</p>
            </div>
          </div>

          {customMessage && (
            <p className="text-slate-700 italic mb-24">
              "{customMessage}"
            </p>
          )}

          <Button
            size="lg"
            className="bg-whatsapp hover:bg-whatsapp/90"
            onClick={() => window.open(`https://wa.me/${agent.whatsapp}`, '_blank')}
          >
            💬 Chat via WhatsApp
          </Button>
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="form" className="container mx-auto px-16 py-48">
        <LeadSubmissionForm
          landingPageId={landingPage.id}
          packageName={pkg.name}
          agentName={agent.name}
        />
      </section>
    </div>
  )
}
```

#### Day 10: Lead Submission Form Component

```tsx
'use client'

export function LeadSubmissionForm({ landingPageId, packageName, agentName }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/public/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landingPageId,
          ...formData
        })
      })

      if (response.ok) {
        setIsSuccess(true)

        // Track conversion
        trackEvent('lead_submitted', {
          package: packageName,
          agent: agentName
        })
      }
    } catch (error) {
      toast.error('Gagal mengirim formulir. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-48 rounded-lg shadow-lg text-center">
        <div className="mb-24">
          <div className="w-96 h-96 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-16">
            <CheckCircle className="w-64 h-64 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8">
            Terima Kasih! 🎉
          </h3>
          <p className="text-slate-600 mb-24">
            Formulir Anda telah dikirim. <br />
            {agentName} akan segera menghubungi Anda via WhatsApp dalam 1x24 jam.
          </p>
        </div>

        <Button
          size="lg"
          className="bg-whatsapp hover:bg-whatsapp/90"
          onClick={() => window.open(`https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Halo ${agentName}, saya tertarik dengan ${packageName}`)}`, '_blank')}
        >
          💬 Chat WhatsApp Sekarang
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-48 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-24">
        Daftar Sekarang
      </h3>

      <form onSubmit={handleSubmit} className="space-y-24">
        <div>
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ahmad Hidayat"
            required
            className="mt-8"
          />
        </div>

        <div>
          <Label htmlFor="phone">Nomor WhatsApp *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+62 821-xxxx-xxxx"
            required
            className="mt-8"
          />
        </div>

        <div>
          <Label htmlFor="email">Email (Opsional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="email@example.com"
            className="mt-8"
          />
        </div>

        <div>
          <Label htmlFor="notes">Catatan/Pertanyaan (Opsional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Ada pertanyaan? Tulis di sini..."
            rows={4}
            className="mt-8"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-56"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Formulir'}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          Dengan mengirim formulir ini, Anda setuju untuk dihubungi oleh {agentName}
        </p>
      </form>
    </div>
  )
}
```

**Backend API:**
```typescript
// POST /api/public/leads/submit
async submitLead(data) {
  const { landingPageId, name, phone, email, notes } = data

  // Get landing page details
  const landingPage = await db.landingPages.findById(landingPageId)

  // Create lead
  const lead = await db.leads.create({
    agency_id: landingPage.agency_id,
    package_id: landingPage.package_id,
    landing_page_id: landingPageId,
    agent_id: landingPage.agent_id,
    name,
    phone,
    email,
    notes,
    status: 'new',
    date_submitted: new Date()
  })

  // Update landing page stats
  await db.landingPages.increment(landingPageId, 'leads_count')

  // Notify agent (WebSocket + optional WhatsApp)
  io.to(`agent:${landingPage.agent_id}`).emit('lead:new', {
    leadId: lead.id,
    leadName: name,
    packageName: landingPage.package.name,
    message: `Lead baru: ${name} tertarik dengan ${landingPage.package.name}`
  })

  // Optional: WhatsApp notification to agent
  // await whatsapp.sendTemplate(agent.phone, 'new_lead', {...})

  return { success: true, leadId: lead.id }
}
```

---

### 🟢 PHASE 4: Lead → Jamaah Conversion & Commission
**Timeline:** 3 days
**Priority:** P0 - MUST HAVE

#### Day 11-12: Convert Lead to Jamaah (Real)

**Update existing modal in `/agent/leads/page.tsx`:**

```tsx
async function handleConvertLead(leadId) {
  const lead = leads.find(l => l.id === leadId)
  if (!lead) return

  setSelectedLead(lead)
  setShowConvertModal(true)

  // Pre-fill form
  setConversionForm({
    name: lead.name,
    phone: lead.phone,
    email: lead.email || '',
    packageId: lead.package_id,
    packageName: lead.packageInterest,
    // Additional required fields:
    nik: '',
    birthDate: '',
    address: '',
    gender: '',
  })
}

async function handleConfirmConversion() {
  setIsConverting(true)

  try {
    // Create jamaah from lead
    const response = await fetch('/api/leads/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: selectedLead.id,
        jamaahData: conversionForm
      })
    })

    const { jamaahId } = await response.json()

    toast.success(
      `${selectedLead.name} berhasil dikonversi menjadi jamaah!`,
      { duration: 4000 }
    )

    // Update lead list
    mutate('/api/agent/leads')

    setShowConvertModal(false)

    // Optional: Redirect to jamaah detail
    // router.push(`/agent/jamaah/${jamaahId}`)
  } catch (error) {
    toast.error('Gagal convert lead. Silakan coba lagi.')
  } finally {
    setIsConverting(false)
  }
}
```

**Backend API:**
```typescript
// POST /api/leads/convert
async convertLeadToJamaah(leadId, jamaahData) {
  const lead = await db.leads.findById(leadId)
  const package = await db.packages.findById(lead.package_id)
  const agent = await db.users.findById(lead.agent_id)

  // Get agent tier (for commission calculation)
  const tier = getCurrentTier(agent.jamaah_count)

  // Create jamaah
  const jamaah = await db.jamaah.create({
    agency_id: lead.agency_id,
    name: jamaahData.name,
    nik: jamaahData.nik,
    phone: jamaahData.phone,
    email: jamaahData.email,
    birth_date: jamaahData.birthDate,
    address: jamaahData.address,
    gender: jamaahData.gender,

    // Package connection
    package_id: package.id,
    package_name: package.name,
    package_price: package.price_retail, // RETAIL price (not wholesale!)
    package_price_type: 'retail',

    // Agent assignment
    agent_id: lead.agent_id,
    affiliate_id: lead.affiliate_id, // If multi-level

    status: 'pending-documents',
    created_at: new Date()
  })

  // Update lead status
  await db.leads.update(leadId, {
    status: 'converted',
    converted_to_jamaah_id: jamaah.id,
    converted_at: new Date()
  })

  // Create commission record (PENDING until payment complete)
  await db.commissions.create({
    agency_id: lead.agency_id,
    jamaah_id: jamaah.id,
    package_id: package.id,
    agent_id: lead.agent_id,
    affiliate_id: lead.affiliate_id,

    package_price: package.price_retail, // Commission from RETAIL
    agent_tier: tier.tier, // Silver/Gold/Platinum
    commission_rate: tier.commissionRate, // 4/6/8
    commission_amount: package.price_retail * (tier.commissionRate / 100),

    status: 'pending', // Until jamaah pays full
    earned_date: new Date()
  })

  // Update agent jamaah count (for tier progression)
  await db.users.increment(lead.agent_id, 'jamaah_count')

  // Notify agent
  io.to(`agent:${lead.agent_id}`).emit('jamaah:new', {
    jamaahId: jamaah.id,
    jamaahName: jamaah.name,
    message: `Selamat! ${jamaah.name} telah menjadi jamaah Anda`
  })

  return { jamaahId: jamaah.id }
}
```

#### Day 13: Commission Calculation & Tier Updates

**Auto-update tier when jamaah count changes:**

```typescript
// Function to check and update agent tier
async function updateAgentTier(agentId) {
  const agent = await db.users.findById(agentId)
  const currentTier = getCurrentTier(agent.jamaah_count)

  if (agent.tier !== currentTier.tier) {
    // Tier changed!
    await db.users.update(agentId, {
      tier: currentTier.tier
    })

    // Notify agent of tier upgrade
    io.to(`agent:${agentId}`).emit('tier:upgraded', {
      newTier: currentTier.tier,
      newCommissionRate: currentTier.commissionRate,
      message: `Selamat! Anda naik ke tier ${currentTier.tier}! Komisi Anda sekarang ${currentTier.commissionRate}%`
    })

    // Send WhatsApp notification
    // await whatsapp.sendTemplate(...)
  }
}

// Helper function
function getCurrentTier(jamaahCount) {
  if (jamaahCount >= 50) return { tier: 'Platinum', commissionRate: 8 }
  if (jamaahCount >= 20) return { tier: 'Gold', commissionRate: 6 }
  return { tier: 'Silver', commissionRate: 4 }
}
```

---

## 🔐 Security & Pricing Visibility Rules

### Implementation Checklist:

```typescript
// middleware/pricing-visibility.ts
export function filterPackageByRole(package, userRole, userLevel) {
  const filtered = { ...package }

  switch (userRole) {
    case 'public':
    case 'jamaah':
      // Only retail price
      delete filtered.price_wholesale
      return filtered

    case 'agent':
      // Full pricing
      return filtered

    case 'affiliate':
      // Retail + commission only, NO wholesale
      delete filtered.price_wholesale
      filtered.estimated_commission = calculateCommission(
        package.price_retail,
        userLevel.commission_rate
      )
      return filtered

    case 'admin':
    case 'owner':
      // Full access
      return filtered

    default:
      // Paranoid: Only retail
      delete filtered.price_wholesale
      return filtered
  }
}
```

---

## 📊 Success Metrics

### Phase 1 Success (Package Management):
- ✅ Admin dapat create 5+ paket dengan dual pricing
- ✅ Itinerary builder dapat build 9-day itinerary < 15 menit
- ✅ Package assignment works (select agents, broadcast notification)
- ✅ Wholesale pricing NEVER tampil di public pages

### Phase 2 Success (Agent Visibility):
- ✅ Agent hanya lihat assigned packages
- ✅ Agent sees wholesale price + commission preview
- ✅ Landing page generator uses correct pricing (retail)
- ✅ Commission preview accurate per tier

### Phase 3 Success (Landing Page):
- ✅ Public landing page shows RETAIL price only
- ✅ Lead submission form works, creates lead record
- ✅ Agent receives real-time notification (WebSocket)
- ✅ 5+ test leads berhasil submit

### Phase 4 Success (Conversion):
- ✅ Convert lead → create jamaah with package link
- ✅ Commission auto-created with correct tier
- ✅ Tier auto-updates saat jamaah count changes
- ✅ Lead status updates to "converted"

---

## 🎯 Next Steps - Decision Points

1. **Approve this revised plan?**
2. **Timeline realistic? (13 days total)**
3. **Multi-tenant from start or defer?**
4. **WebSocket implementation priority?** (Can defer, use polling for MVP)
5. **Commission auto-calculation vs manual?** (Recommend manual for MVP)

---

## 📝 Key Differences from Previous Plan

| Aspect | Previous Plan | Revised (BMAD Aligned) |
|--------|---------------|------------------------|
| **Pricing Model** | Single price | ✅ Dual pricing (retail/wholesale) |
| **Agent Assignment** | All agents see all packages | ✅ Selective assignment per agent |
| **Commission** | Simple percentage | ✅ Tier-based (Silver/Gold/Platinum) |
| **Pricing Visibility** | Not specified | ✅ Role-based (affiliates don't see wholesale) |
| **Real-time Updates** | Not mentioned | ✅ WebSocket broadcast to agents |
| **Multi-level** | Not included | ✅ Agent → Affiliate hierarchy |
| **Cache Strategy** | Not specified | ✅ Redis with 1-hour TTL, invalidate on update |

---

**Kesimpulan:** Plan ini sekarang 100% aligned dengan BMAD requirements dan memecahkan masalah yang user identified: *"agent-agen dan mitra butuh kemudahan untuk tau update berbagai harga dan kondisi lapangan"* melalui:

1. ✅ Package assignment (agency control apa yang bisa dijual)
2. ✅ Dual pricing with tier-based commission
3. ✅ Real-time broadcast saat ada update
4. ✅ Pricing visibility control (prevent leakage)
5. ✅ Complete sales funnel (package → landing page → lead → jamaah → commission)

**Ready to implement! 🚀**
