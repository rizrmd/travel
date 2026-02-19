# Erahajj.co.id - Analisis Lengkap SaaS Travel Umroh/Haji

> Dokumen ini berisi analisis menyeluruh dari sistem Erahajj sebagai baseline untuk pengembangan SaaS Travel Umroh yang akan diintegrasikan dengan SaaS Akuntansi.

---

## 1. OVERVIEW BISNIS

### Deskripsi
Erahajj adalah platform ERP berbasis cloud yang dirancang khusus untuk travel umroh dan haji. Sistem ini mengintegrasikan seluruh aspek operasional travel mulai dari transaksi, keuangan, inventory, SDM, hingga marketing.

### Target Market
- Travel umroh/haji dengan 5-50+ karyawan
- Travel dengan sistem multi-cabang
- Travel dengan jaringan agen/mitra
- **670+ travel agencies** sudah menggunakan

### Value Proposition
- Single platform untuk semua kebutuhan operasional
- Otomasi proses akuntansi (SAK ETAP compliant)
- Manajemen multi-cabang dan agen
- Integrasi payment gateway
- Kepatuhan ISO 9001:2015

---

## 2. MODUL & FITUR LENGKAP

### 2.1 Modul Transaksi & Operasional

#### A. Manajemen Paket
- **Paket Umroh**
  - Regular/Plus/VIP packages
  - Harga dinamis per musim
  - Kuota per paket
  - Itinerary detail (hari per hari)
  - Include/exclude items

- **Paket Haji**
  - Haji reguler
  - Haji khusus/plus
  - Haji furoda

- **Paket Tour**
  - Tour religi
  - Muslim tour
  - Kombinasi umroh + tour

#### B. Booking & Reservasi
- Form booking jamaah
- Dokumen requirements:
  - Data diri lengkap
  - Scan passport
  - Scan KTP
  - Pas foto
  - Buku nikah (untuk mahram)
  - Kartu keluarga
- Status booking (pending, confirmed, cancelled)
- Waiting list management
- Seat allocation (hotel, pesawat)

#### C. Manajemen Jamaah
- Database jamaah lengkap
- Riwayat keberangkatan
- Medical history
- Emergency contact
- Document management
- Manifest generation
- Grouping jamaah per paket
- Room allocation
- Passport tracking (masa berlaku)

#### D. Inventory & Supplier
- **Hotel**
  - Database hotel Makkah & Madinah
  - Rating & jarak dari masjid
  - Kontrak & pricing
  - Room types & availability
  - Allotment management

- **Airlines**
  - Maskapai & rute
  - Class & pricing
  - Quota management
  - Group booking

- **Transport**
  - Bus dalam kota
  - Inter-city transport
  - Vendor management

- **Vendor Lainnya**
  - Catering
  - Tour guide
  - Perlengkapan (koper, tas, dll)
  - Visa service

- **Stock Management**
  - Barang inventory (koper, perlengkapan)
  - Transfer antar gudang
  - Monitoring kerusakan/kehilangan

#### E. Visa & Dokumen
- Aplikasi visa processing
- Tracking status visa
- Document checklist
- Approval workflow
- Integration dengan sistem visa (jika ada)

### 2.2 Modul Keuangan & Akuntansi

> **CATATAN**: Modul ini akan di-REPLACE dengan integrasi ke SaaS Akuntansi yang sudah ada

#### Fitur Akuntansi di Erahajj (untuk referensi):
- Chart of accounts (SAK ETAP)
- Jurnal otomatis dari transaksi
- Buku besar
- Neraca & Laba Rugi
- Laporan keuangan standar
- Rekonsiliasi bank
- Kas & bank management
- Hutang piutang
- Asset management
- Budgeting
- Tax reporting

#### Yang Perlu Diintegrasikan ke SaaS Akuntansi:
1. **Transaksi Penjualan Paket** → Journal Entry (Debit: Kas/Piutang, Kredit: Pendapatan)
2. **Pembayaran dari Jamaah** → Journal Entry (Debit: Kas, Kredit: Piutang)
3. **Pembelian dari Supplier** → Journal Entry (Debit: Biaya, Kredit: Hutang/Kas)
4. **Komisi Agen** → Journal Entry (Debit: Biaya Komisi, Kredit: Hutang Komisi)
5. **Cost of Sales** → Tracking biaya per paket (hotel, tiket, transport, dll)

### 2.3 Modul CRM (Customer Relationship Management)

#### Lead Management
- Lead source tracking (website, referral, social media, walk-in)
- Lead scoring & qualification
- Pipeline stages:
  - New lead
  - Contacted
  - Interested
  - Follow-up
  - Quotation sent
  - Closed won/lost
- Task & reminder untuk follow-up
- Notes & interaction history

#### Customer Management
- Customer database
- Customer category (retail, corporate, agen)
- Purchase history
- Outstanding payments
- Loyalty points/member
- Communication preferences

#### Communication Tools
- WhatsApp integration
  - Broadcast message
  - Template pesan
  - Auto-reply
  - Chat history
- Email marketing
  - Campaign management
  - Template library
  - Segmentasi customer
  - Analytics (open rate, click rate)
- SMS gateway (optional)

### 2.4 Modul Agen & Komisi

#### Manajemen Agen
- Database agen/mitra
- Hierarki agen (multi-level)
- Territory management
- Performance tracking
- Target & achievement

#### Sistem Komisi
- Skema komisi (percentage/fixed amount)
- Multi-tier commission
- Auto-calculation komisi
- Komisi per produk/paket
- Bonus & incentive rules
- Commission report
- Payment tracking

#### Portal Agen
- Login khusus agen
- Dashboard performance
- Booking untuk customer
- Komisi tracking
- Marketing materials download
- Training materials

### 2.5 Modul HRIS (Human Resources)

#### Employee Management
- Data karyawan lengkap
- Organization structure
- Job positions & levels
- Employee documents

#### Attendance
- Clock in/out
- Leave management
- Overtime tracking
- Shift scheduling

#### Payroll
- Salary structure
- Allowances & deductions
- Tax calculation (PPh 21)
- Payslip generation
- BPJS integration

#### Performance
- KPI setting
- Performance review
- Training & development
- Career path

### 2.6 Modul Operasional & Quality

#### Operational Workflow
- SOP digital
- Process documentation
- ISO 9001:2015 compliance
- Document control
- Approval matrix

#### Tour Management
- Tour leader assignment
- Tour guide assignment
- Pre-departure briefing
- During tour monitoring
- Post-tour evaluation

#### Customer Satisfaction
- Survey forms
- Feedback collection
- Complaint handling
- Service improvement tracking

### 2.7 Modul Branch Management

#### Multi-Branch Support
- Branch data & settings
- Inter-branch transfer
- Consolidated reporting
- Branch performance comparison
- Resource sharing

### 2.8 Modul Reporting & Analytics

#### Operational Reports
- Booking report
- Departure schedule
- Jamaah manifest
- Visa status report
- Inventory report

#### Financial Reports
- Sales report
- Revenue by product
- Cost analysis per paket
- Profit margin analysis
- Cash flow projection
- AR/AP aging

#### Marketing Reports
- Lead conversion rate
- Sales funnel analysis
- Campaign effectiveness
- Customer acquisition cost
- Customer lifetime value

#### Management Dashboard
- Real-time KPI
- Sales trend
- Revenue forecast
- Top selling packages
- Agent performance
- Customer satisfaction score

### 2.9 Teknologi Pendukung

#### Tour Guide System (TGS)
- Digital transmitter
- Real-time komunikasi guide-jamaah
- Broadcasting informasi
- Emergency notification

#### Mobile Application
- iOS & Android
- Jamaah app:
  - Itinerary view
  - Document upload
  - Payment tracking
  - Communication dengan travel
  - Doa & panduan ibadah
- Staff/Agent app:
  - Mobile CRM
  - Quick booking
  - Performance dashboard

#### Payment Gateway
- Virtual Account (VA):
  - BCA
  - BSI (Bank Syariah Indonesia)
  - BNI
  - Mandiri
- Credit card (optional)
- E-wallet integration (optional)
- Auto-reconciliation dengan bank

#### Digital Marketing Tools
- **WhatsApp Business API**
  - Broadcast
  - Template messages
  - Chatbot

- **Email Marketing**
  - Campaign builder
  - Template design
  - A/B testing
  - Analytics

- **SEO Tools**
  - Keyword tracking
  - Content optimization
  - Backlink management

---

## 3. ARSITEKTUR TEKNIS

### 3.1 Infrastructure

#### Cloud Architecture
- Multi-tenant SaaS model
- Resource sharing
- Optional dedicated server (+Rp 125K/bulan)
- Auto-scaling capability

#### Security Features
- SSL 256-bit encryption
- Anti-DDOS (CloudFlare)
- Anti-brute-force
- SQL injection prevention
- AI-based fraud detection
- Activity logging & monitoring

#### Backup & Recovery
- Automated hourly backups
- 4 distributed storage locations
- Point-in-time recovery
- Disaster recovery plan

### 3.2 Storage & Capacity

| Tier | Storage | Transaction Capacity | Price/Month |
|------|---------|---------------------|-------------|
| EH Starter | 2GB | 1,625 | Rp 875,000 |
| EH Small | 10GB | 3,625 | Rp 1,025,000 |
| EH Medium | 25GB | 5,625 | Rp 1,175,000 |
| EH Unlimited | 50GB | Unlimited | Rp 2,150,000 |

Setup fee: Rp 1,500,000 (one-time)

### 3.3 User Roles & Access Control

#### Role Types
1. **Super Admin** (Owner)
   - Full access semua modul
   - System configuration
   - User management

2. **Admin/Manager**
   - Operational management
   - Reporting
   - Approval authority

3. **Operator**
   - Data entry
   - Transaction processing
   - Customer service

4. **Sales/Marketing**
   - Lead management
   - Quotation
   - Customer communication

5. **Agen/Mitra**
   - Limited access via portal
   - Booking untuk customer
   - Commission tracking

6. **Jamaah** (via mobile app)
   - View booking
   - Upload documents
   - Payment tracking

### 3.4 Integration Capabilities

#### API Integration Points
- Payment gateway APIs
- WhatsApp Business API
- Email service (SMTP/API)
- SMS gateway
- Bank APIs (untuk VA)
- Visa processing system (jika ada)
- Accounting system integration (yang akan kita develop)

---

## 4. BUSINESS MODEL

### 4.1 Pricing Strategy
- Subscription-based (monthly)
- Tiered pricing by capacity
- Setup fee untuk onboarding
- Optional add-ons (dedicated server, custom features)

### 4.2 Customer Acquisition
- 7-day free trial (no credit card required)
- Comprehensive training program (5 days)
- Hybrid online/offline training

### 4.3 Guarantees
- 100% money-back guarantee (jika ada sistem lebih baik)
- Lifetime warranty untuk system errors
- 24/7 customer support

### 4.4 Partnership
- Official partnership dengan HIMPUH (Himpunan Penyelenggara Umroh Haji)
- Memberikan kredibilitas & trust

---

## 5. USER EXPERIENCE & WORKFLOW

### 5.1 Customer Journey (Jamaah)

```
1. Lead Generation
   ↓
2. Inquiry (via WA/Phone/Email/Website)
   ↓
3. Follow-up oleh Sales (CRM tracking)
   ↓
4. Quotation & Paket Explanation
   ↓
5. Booking (Down Payment)
   ↓
6. Document Submission
   ↓
7. Payment Installments
   ↓
8. Full Payment
   ↓
9. Visa Processing
   ↓
10. Pre-Departure Briefing
    ↓
11. Departure (Manifest, Tickets, etc)
    ↓
12. During Tour (TGS Communication)
    ↓
13. Return
    ↓
14. Post-Tour Survey
    ↓
15. Retention (untuk repeat customer)
```

### 5.2 Operational Workflow

#### Booking Flow
```
Sales Input Booking
   ↓
System Check Quota
   ↓
Generate Invoice
   ↓
Send Payment Link (VA)
   ↓
Auto-reconciliation saat bayar
   ↓
Update booking status
   ↓
Trigger notification (email/WA)
   ↓
Update CRM pipeline
   ↓
Post journal ke accounting (AUTO)
```

#### Procurement Flow
```
Ops Team Create PO
   ↓
Approval workflow
   ↓
PO sent to supplier
   ↓
Goods/Service received
   ↓
Invoice dari supplier
   ↓
Post AP journal ke accounting
   ↓
Payment schedule
   ↓
Payment execution
   ↓
Post payment journal
```

---

## 6. KEY DIFFERENTIATORS

### Kelebihan Erahajj
1. **All-in-one solution** - Tidak perlu banyak software
2. **Industry-specific** - Dibuat khusus untuk travel umroh/haji
3. **Compliance** - SAK ETAP & ISO 9001:2015
4. **Automation** - Jurnal akuntansi otomatis, komisi auto-calculate
5. **Multi-channel payment** - VA dari 4 bank besar
6. **CRM built-in** - Sales pipeline & marketing automation
7. **Mobile app** - Untuk jamaah & staff
8. **Scalable** - Dari 5 karyawan sampai enterprise
9. **Security** - Enterprise-grade dengan AI fraud detection
10. **Support & Training** - Comprehensive onboarding

### Potential Weaknesses (untuk kita enhance)
1. **Customization** - Mungkin terbatas karena multi-tenant
2. **Integration** - Terkunci dalam ekosistem mereka
3. **Mobile UX** - Perlu dicek seberapa bagus
4. **Advanced Analytics** - Apakah cukup powerful untuk decision making
5. **Automation** - Seberapa banyak yang bisa di-automate dengan AI/ML
6. **Real-time Collaboration** - Fitur kolaborasi tim
7. **Document Management** - Apakah ada e-signature, workflow approval digital
8. **Customer Portal** - Apakah jamaah punya portal lengkap atau cuma mobile app

---

## 7. OPPORTUNITY FOR ENHANCEMENT

> Area-area yang bisa kita tingkatkan dari sistem Erahajj

### 7.1 Advanced Analytics & BI
- Predictive analytics untuk demand forecasting
- AI-powered pricing recommendation
- Customer churn prediction
- Revenue optimization engine
- Advanced data visualization

### 7.2 Automation & AI
- Chatbot untuk customer service
- Auto-assignment lead to sales (berdasarkan scoring)
- Smart document processing (OCR untuk passport, KTP)
- Auto-translate untuk communication dengan jamaah
- Intelligent inventory optimization

### 7.3 Enhanced Customer Experience
- Comprehensive customer portal (web)
- Live chat support
- Video consultation
- Virtual tour preview
- Gamification (loyalty points, badges)
- Social proof & reviews
- Referral program automation

### 7.4 Advanced Integration
- Open API untuk third-party integration
- Webhook support
- Zapier/Make.com integration
- Social media integration (Instagram, Facebook, TikTok)
- Google My Business integration
- Marketplace integration (Tokopedia, Shopee untuk paket umroh)

### 7.5 Collaboration & Workflow
- Real-time collaboration tools
- Internal chat/messaging
- Task management
- Project management untuk keberangkatan
- File sharing & version control
- E-signature untuk kontrak
- Advanced approval workflow

### 7.6 Advanced Financial Features (via Integration)
- Multi-currency support
- Automated reconciliation
- Budget vs actual analysis
- Profitability analysis per paket
- Cash flow forecasting
- Financial planning & scenario modeling

### 7.7 Marketing Automation
- Advanced segmentation
- Behavior-based automation
- Drip campaigns
- Lead nurturing automation
- Social media scheduling
- Landing page builder
- A/B testing framework
- Attribution tracking

### 7.8 Developer Experience
- Comprehensive API documentation
- SDK untuk berbagai bahasa
- Sandbox environment
- Webhook testing tools
- Plugin/extension marketplace

---

## 8. TECHNICAL STACK RECOMMENDATIONS

### 8.1 Backend
**Option 1: Node.js Ecosystem**
- **Framework**: NestJS (enterprise-ready, TypeScript)
- **API**: GraphQL + REST
- **Database**: PostgreSQL (main), Redis (cache)
- **ORM**: Prisma atau TypeORM
- **Queue**: BullMQ (untuk background jobs)
- **Search**: Elasticsearch (untuk search jamaah, leads, etc)

**Option 2: Laravel Ecosystem**
- **Framework**: Laravel 11
- **API**: Laravel Sanctum + GraphQL
- **Database**: PostgreSQL, Redis
- **ORM**: Eloquent
- **Queue**: Laravel Horizon
- **Search**: Laravel Scout + Meilisearch

### 8.2 Frontend
**Admin Panel**
- **Framework**: Next.js 14+ (React)
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand atau TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts atau Chart.js
- **Tables**: TanStack Table

**Customer Portal**
- Next.js 14+ dengan route groups untuk separation
- SSR untuk SEO optimization

### 8.3 Mobile App
**Option 1: React Native**
- Expo untuk faster development
- Shared components dengan web

**Option 2: Flutter**
- Better performance
- Lebih native look & feel

### 8.4 Infrastructure
- **Cloud**: AWS atau Google Cloud
- **Container**: Docker + Kubernetes
- **CI/CD**: GitHub Actions atau GitLab CI
- **Monitoring**: Sentry (error tracking), DataDog (APM)
- **Storage**: S3-compatible untuk dokumen
- **CDN**: CloudFlare
- **Email**: SendGrid atau AWS SES
- **WhatsApp**: Official WhatsApp Business API

### 8.5 Database Design Approach
- Multi-tenant dengan schema separation
- Audit trail untuk semua transaksi
- Soft delete untuk data integrity
- Encryption at rest untuk data sensitif
- Regular backup dengan point-in-time recovery

---

## 9. INTEGRATION DENGAN SAAS AKUNTANSI

### 9.1 API Endpoints yang Perlu Dibangun di SaaS Akuntansi

#### A. Journal Entry API
```
POST /api/v1/journal-entries
```
Payload:
```json
{
  "date": "2025-12-21",
  "reference": "INV-00123",
  "source": "travel-umroh",
  "entries": [
    {
      "account_code": "1-10001",
      "account_name": "Bank BCA",
      "debit": 25000000,
      "credit": 0,
      "description": "DP Paket Umroh - Ahmad"
    },
    {
      "account_code": "4-10001",
      "account_name": "Pendapatan Paket Umroh",
      "debit": 0,
      "credit": 25000000,
      "description": "DP Paket Umroh - Ahmad"
    }
  ]
}
```

#### B. Account List API
```
GET /api/v1/accounts
```
Untuk dropdown COA saat mapping

#### C. Contact/Vendor API
```
POST /api/v1/contacts
GET /api/v1/contacts
```
Sync customer & supplier ke accounting

#### D. Tax API
```
GET /api/v1/taxes
```
Untuk perhitungan PPN/PPh

#### E. Budget API
```
GET /api/v1/budgets
POST /api/v1/budgets
```
Budget planning per paket

### 9.2 Mapping Transaksi

| Event di Travel SaaS | Journal Entry |
|---------------------|---------------|
| Down Payment Jamaah | Dr: Bank/Kas, Cr: Uang Muka Penjualan |
| Pelunasan Jamaah | Dr: Bank, Cr: Piutang |
| Revenue Recognition | Dr: Uang Muka, Cr: Pendapatan |
| Purchase Hotel | Dr: Biaya Hotel, Cr: Hutang |
| Payment ke Hotel | Dr: Hutang, Cr: Bank |
| Komisi Agen | Dr: Biaya Komisi, Cr: Hutang Komisi |
| Bayar Komisi | Dr: Hutang Komisi, Cr: Bank |
| Gaji Karyawan | Dr: Biaya Gaji, Cr: Hutang Gaji |
| Bayar Gaji | Dr: Hutang Gaji, Cr: Bank |

### 9.3 Real-time vs Batch Sync
- **Real-time**: Transaksi penjualan & pembayaran (critical)
- **Batch**: Cost allocation, komisi calculation (setiap akhir hari)

---

## 10. DEVELOPMENT ROADMAP (Usulan)

### Phase 1: MVP Core (3-4 bulan)
- [ ] User management & roles
- [ ] Manajemen paket umroh
- [ ] Booking & reservasi
- [ ] Manajemen jamaah & dokumen
- [ ] CRM dasar (lead & customer)
- [ ] Payment gateway integration
- [ ] Basic reporting
- [ ] API integration ke SaaS Akuntansi (simple journal posting)

### Phase 2: Sales & Operations (2-3 bulan)
- [ ] Sistem agen & komisi
- [ ] Inventory management (hotel, airlines)
- [ ] Supplier management
- [ ] Visa tracking
- [ ] WhatsApp integration
- [ ] Email marketing
- [ ] Enhanced CRM (pipeline, automation)
- [ ] Tour management

### Phase 3: Advanced Features (2-3 bulan)
- [ ] Mobile app (jamaah)
- [ ] Advanced analytics & dashboard
- [ ] HRIS integration
- [ ] Branch management
- [ ] Customer portal
- [ ] E-signature
- [ ] Advanced workflow automation

### Phase 4: AI & Automation (2-3 bulan)
- [ ] Chatbot
- [ ] OCR document processing
- [ ] Predictive analytics
- [ ] Smart pricing
- [ ] Marketing automation
- [ ] Lead scoring

---

## 11. COMPETITIVE ANALYSIS

### Direct Competitors
1. **Erahajj** (yang kita analisis ini)
2. **Umrohzone**
3. **Hafiztravel Software**
4. **iHajj**
5. **ManasikApp**

### Indirect Competitors
- Generic CRM (Salesforce, HubSpot)
- Generic ERP (Odoo, ERPNext)
- Travel booking systems (not specific to umroh)

### Competitive Advantages kita (usulan)
1. **Integration-first approach** - Modular, bisa digabung dengan sistem existing
2. **Modern tech stack** - Better UX, faster, more scalable
3. **API-first design** - Easy integration dengan third-party
4. **Advanced analytics** - AI-powered insights
5. **Better pricing** - Lebih fleksibel, pay-as-you-grow
6. **Open ecosystem** - Plugin/extension marketplace
7. **Superior customer experience** - Portal, mobile app, real-time updates

---

## 12. SUCCESS METRICS (KPI)

### Product Metrics
- Number of active travel agencies
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Customer acquisition cost (CAC)
- Customer lifetime value (LTV)
- Churn rate
- Net promoter score (NPS)

### Usage Metrics
- Daily active users (DAU)
- Transactions processed per month
- API calls per day
- Mobile app downloads & engagement
- Feature adoption rate

### Technical Metrics
- System uptime (target: 99.9%)
- API response time (target: <200ms)
- Page load time (target: <2s)
- Error rate (target: <0.1%)
- Support ticket resolution time

---

## 13. KESIMPULAN

Erahajj adalah sistem yang sangat comprehensive untuk travel umroh/haji dengan fitur enterprise-grade. Untuk membuat SaaS yang lebih baik, kita perlu fokus pada:

### Strengths to Maintain:
✅ Industry-specific features (paket, jamaah, visa, manifest)
✅ Multi-channel payment integration
✅ CRM & marketing automation
✅ Mobile app support
✅ Enterprise security & compliance

### Areas to Improve:
🚀 **Better Integration** - API-first, webhook, open ecosystem
🚀 **Modern UX** - Lebih intuitive, faster, mobile-first
🚀 **AI & Automation** - Chatbot, OCR, predictive analytics
🚀 **Advanced Analytics** - Better insights untuk decision making
🚀 **Modular Architecture** - Bisa mix & match dengan sistem existing (seperti SaaS Akuntansi kita)
🚀 **Developer Experience** - API documentation, SDK, sandbox
🚀 **Customer Experience** - Portal lengkap, real-time updates, self-service

### Keputusan Arsitektur Kunci:
1. **Pisahkan concern**: Travel Operations vs Accounting
2. **API-first design**: Semua via API, mudah diintegrasikan
3. **Event-driven**: Untuk real-time sync antar sistem
4. **Multi-tenant**: Dengan option dedicated untuk enterprise
5. **Microservices** (optional): Untuk scalability long-term

---

## NEXT STEPS

1. ✅ Review dokumen ini
2. 📋 Diskusi enhancement & differentiation strategy
3. 🎨 Wireframe & UX design
4. 🏗️ Database schema design
5. 🛠️ Tech stack finalization
6. 📝 PRD (Product Requirement Document) detail
7. 👨‍💻 Start development

---

**Prepared by**: Claude Code
**Date**: 2025-12-21
**Version**: 1.0
