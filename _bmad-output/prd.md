---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/analysis/product-brief-Travel Umroh-2025-12-21.md'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 11
project_name: 'Travel Umroh'
user_name: 'Yopi'
date: '2025-12-21'
status: 'complete'
---

# Product Requirements Document - Travel Umroh

**Author:** Yopi
**Date:** 2025-12-21

---

## Executive Summary

Travel Umroh is a next-generation SaaS platform designed specifically for Indonesian travel agencies operating in the umroh/haji market. The platform addresses a critical market gap: while existing solutions like Erahajj assume self-service models, **80% of Indonesian umroh business flows through agent networks** who provide full-service support to pilgrims.

**The Core Problem:**
Travel agency owners see massive demand (Indonesia has 244.7 million Muslims with umroh demand growing 68% in 5 years, reaching 1M+ pilgrims annually) but cannot capture market share due to operational bottlenecks. Current systems are built on the wrong assumption—that pilgrims will self-service—when the market reality is agent-driven B2B with full-service expectations.

**The Solution:**
Travel Umroh enables agencies to scale from 300 to 3,000+ pilgrims per month without proportional staff increases through:

- **Agent-First Architecture:** Delegated access and "My Jamaah" dashboard enabling agents to manage 50+ pilgrims efficiently (80% admin time reduction: 10hr → 2hr/week)
- **AI-Powered Automation:** Multi-mode chatbot handling 80% of queries with secure pricing separation, saving Rp 180M annually
- **Operational Intelligence:** Real-time visibility into revenue, agent performance, and pipeline for strategic decision-making
- **Scale-Ready Infrastructure:** Proven capacity for 3,000 pilgrims/month with 92.7% operational time reduction

**Market Opportunity:**
Target 1,036 travel agencies (60% of Erahajj's current base) with validated willingness to pay for SaaS solutions. Financial targets: Rp 125 juta MRR (3 months), Rp 10.5 miliar ARR (12 months), Rp 31 miliar ARR (3 years).

**Target Users:**
- **Primary:** Agency Owners (Pak Hadi) - need to scale operations and gain business visibility
- **Primary:** Agents/Mitra (Ibu Siti) - need efficiency tools to manage multiple pilgrims
- **Secondary:** Admin Staff (Mbak Rina) - need automation to handle volume without errors
- **Secondary:** Pilgrims (Pak Budi) - prefer full-service through trusted agents
- **Secondary:** Family Members (Siti) - want peace of mind via real-time tracking

### What Makes This Special

Travel Umroh's competitive advantage lies in understanding and solving for the **agent-driven reality** of the Indonesian umroh market that competitors fundamentally misunderstand:

**1. Agent-Assisted Service Model (THE Game Changer)**
- **Delegated Access:** Agents can "act as" pilgrims—upload documents, update data, manage on their behalf
- **"My Jamaah" Dashboard:** Single view of all assigned pilgrims with status tracking (documents, payments, approvals)
- **Hybrid Mode:** Supports both agent-assisted AND self-service (covers 100% market vs competitors' 40%)
- **Impact:** 80% reduction in agent admin time, 30-50% revenue increase through productivity

**2. AI Automation for Scale**
- **Multi-Mode Chatbot:** NLP-powered with Public/Agent/Admin modes, authentication-based pricing visibility
- **Auto-Update & Broadcast:** Admin changes package → chatbot auto-syncs → broadcasts to authenticated agents
- **Secure by Design:** Granular access control ensures wholesale pricing never leaks to retail customers
- **Impact:** 80% query deflection, Rp 180M/year savings, instant 24/7 response

**3. OCR Document Processing**
- **Verihubs API Integration:** 98% accuracy, 4.5 seconds per document
- **Batch Operations:** ZIP upload 100+ documents, queue processing, auto-extraction
- **Impact:** 94% time reduction (83hr → 5hr/month in document processing)

**4. WhatsApp Business Integration**
- **Official Business API:** Meet users where they are (90%+ agent preference)
- **Chatbot Integration:** AI responds directly in WhatsApp conversations
- **Rich Media Support:** Images, PDFs, itineraries, payment reminders via WhatsApp
- **Impact:** Seamless user experience in familiar channel

**5. Landing Page Builder for Agents**
- **Auto-Generate Pages:** Select package → customizable landing page with agent branding
- **WhatsApp CTA:** Direct chat button for lead conversion
- **Social Sharing:** One-click share to Facebook, Instagram, WhatsApp Status
- **Impact:** 20+ passive leads/month per agent, agent satisfaction boost

**6. Operational Intelligence Dashboard**
- **Revenue Visibility:** Real-time total revenue, 3-month projection, pipeline potential
- **Agent Analytics:** Performance metrics, top performers, coaching opportunities
- **Strategic Metrics:** Business intelligence for growth decisions vs operational firefighting
- **Impact:** Agency owners make strategic decisions instead of reacting to crises

**7. Scale-Ready Architecture**
- **Proven Capacity:** Load tested for 3,000 pilgrims/month, 500 concurrent users
- **Queue System:** Background jobs for OCR, email/SMS, commission calculation
- **Real-time Sync:** WebSocket for live inventory updates (prevent overbooking)
- **Impact:** 92.7% operational time reduction at scale, Rp 516M/year savings

**The Market Blind Spot:**
Competitors like Erahajj don't understand that in the Indonesian umroh market, **agents are not just sales channels—they are full-service providers** who need tools to efficiently manage pilgrims end-to-end. This fundamental misunderstanding creates Travel Umroh's competitive moat.

## Project Classification

**Technical Type:** SaaS B2B Platform
**Domain:** General (with Fintech & Regulatory components)
**Complexity:** High
**Project Context:** Greenfield - new project

**Classification Rationale:**

**SaaS B2B Platform Characteristics:**
- Multi-tenant architecture supporting 350-1,036 travel agencies
- Complex permission model with RBAC (Agency Owner, Agent, Admin, Jamaah, Family roles)
- Subscription-based revenue model (Rp 2.5 juta/month ARPU)
- Enterprise features: dashboard, analytics, team management, operational intelligence
- Integration ecosystem: WhatsApp Business API, Payment Gateway, SISKOPATUH, Verihubs OCR

**Fintech Components:**
- Virtual Account integration (BCA, BSI, BNI, Mandiri)
- Installment tracking and auto-reconciliation
- Commission calculation and batch payment processing
- Financial operations requiring PCI-DSS consideration

**Regulatory Requirements:**
- SISKOPATUH integration (Kemenag government regulatory reporting)
- DSN-MUI fatwa compliance (sharia-compliant financial structures)
- Audit trails for regulatory compliance
- Enterprise-grade data privacy and encryption

**High Complexity Drivers:**
- Multi-mode AI with secure pricing separation (wholesale vs retail)
- OCR integration with 98% accuracy SLA requirements
- Real-time operations (WebSocket, payment reconciliation, inventory management)
- Scale requirements (3,000 pilgrims/month, 500 concurrent users)
- Complex workflow automation (delegated access, bulk operations, queue systems)
- Multi-channel integration (web app, mobile responsive, WhatsApp Business API)

---

## Success Criteria

### User Success

**For Agency Owners (Pak Hadi) - Strategic Growth:**
- **Scale Achievement:** Successfully handle 3,000 jamaah/month capacity without operational chaos
- **Operational Efficiency:** 92.7% time reduction (562hr → 41hr/month at scale)
- **Cost Savings:** Rp 43 juta/month operational cost reduction
- **Revenue Visibility:** Real-time dashboard usage (login 3x/week minimum) with total revenue, agent performance, pipeline metrics
- **ROI Achievement:** Positive ROI within 3 months
- **Calm Scaling:** Can multiply agents with confidence—adding 10-20 new agents without worrying about breaking systems
- **Multi-Level Support:** System handles both direct agents/mitra AND their affiliates seamlessly
- **Aha Moment Tracking:**
  - Week 1: "I can see my entire business in one dashboard!"
  - Month 1: "I just onboarded 10 new agents and nothing broke—this scales!"
  - Month 3: "My agents are more productive, I'm adding agents confidently, revenue is up"

**For Agents/Mitra (Ibu Siti) - Productivity & Income:**
- **Efficiency Gain:** 80% admin time reduction (10hr → 2hr/week)
- **Capacity Increase:** Manage 2x more jamaah (25 → 50) without burnout
- **Income Growth:** 30-50% commission income increase
- **Daily Usage:** Login daily, use "My Jamaah" dashboard as primary tool
- **Marketing Success:** Landing page generates 20+ leads/month passively
- **Satisfaction:** NPS > 50, would recommend to other agents
- **Aha Moment Tracking:**
  - Day 1: "The 'My Jamaah' dashboard makes everything clear!"
  - Week 1: "I just saved 8 hours—I can actually focus on sales now"
  - Month 1: "Landing page brought me 20 new leads without extra work"

**For Admin Staff (Mbak Rina) - Automation & Quality:**
- **Automation Success:** 80% queries handled by AI chatbot (deflection rate)
- **Processing Speed:** OCR reduces document entry from 83hr → 5hr/month (94% reduction)
- **Quality Improvement:** Zero document mix-ups, 100% on-time visa submission
- **Bulk Efficiency:** Approve 50 documents in 1 click vs 50 manual clicks
- **Stress Reduction:** Not overwhelmed by repetitive agent questions
- **Aha Moment Tracking:**
  - Day 1: "OCR auto-filled everything—I just reviewed and approved!"
  - Week 1: "Chatbot handled 80% of agent questions—I'm not overwhelmed anymore"
  - Month 1: "Zero document mix-ups this month—quality is up, stress is down"

**For Pilgrims (Pak Budi) - Peace of Mind:**
- **Peace of Mind:** 90%+ satisfaction with full-service via agent
- **Transparency:** Can view status anytime via optional mobile app
- **Safety:** Family can track via Family Portal (80% family adoption in Phase 2)

**For Family Members (Siti) - Connection:**
- **Real-Time Tracking:** Can see loved ones' location and status during umroh (Phase 2)
- **Peace of Mind:** Focus on work knowing parents are safe and trackable

### Business Success

**3-Month Milestone (Critical Validation - PROOF OF VALUE):**
- **Customer Acquisition:** 50 travel agencies onboarded and paying
- **Agent Adoption:** 80% of agents actively using system (login 3x/week, use 3+ features)
- **Time Savings Validated:** 70% average admin time reduction reported by agents (survey-based)
- **Customer Satisfaction:** NPS > 50 (promoters outnumber detractors)
- **Churn:** <10% (early adopter retention validates product-market fit)
- **Revenue:** Rp 125 juta MRR
- **Calm Scaling Indicator:** Agency owners report confidence in adding new agents without operational fear
- **Multi-Level Success:** Agencies with agent → affiliate structures report seamless operations
- **Success Criteria:** If agents report real time savings + agencies see cost reduction + owners feel confident scaling → **product-market fit validated**

**12-Month Milestone (Scale Phase - PROFITABLE GROWTH):**
- **Customer Acquisition:** 350 travel agencies
- **Revenue:** Rp 10.5 miliar ARR (Rp 875 juta MRR)
- **Retention:** 90% customer retention rate
- **Agent Network:** 10,500 active agents using platform (350 agencies × 30 agents avg)
- **Jamaah Processed:** 100,000+ jamaah/year through platform
- **Profit Margin:** 40%+ (SaaS benchmark achieved)
- **Customer LTV:** Rp 90 juta (36 months × Rp 2.5 juta/month)
- **CAC Payback:** <6 months
- **Agent Growth Rate:** Agencies confidently adding 15-20% more agents quarterly

**3-Year Milestone (Market Leadership - CATEGORY DOMINANCE):**
- **Market Share:** 1,036 agencies (60% of Erahajj's current base)
- **Revenue:** Rp 31 miliar ARR
- **Agent Network:** 31,000+ active agents (including multi-level affiliates)
- **Jamaah Processed:** 1M+ jamaah/year (competitive with market leader)
- **Brand Recognition:** Top-of-mind for "agent-first umroh SaaS"
- **Customer LTV:** Rp 120 juta (48+ months retention)
- **Market Position:** Category leader in agent-driven umroh SaaS in Indonesia

### Technical Success

**Performance Requirements:**
- **System Uptime:** 99.9% availability (max 43 minutes downtime/month)
- **API Response Time:** <200ms for 95% of requests
- **Page Load Time:** <2 seconds for initial load
- **Real-Time Operations:** WebSocket latency <100ms for inventory updates
- **Concurrent Users:** Support 500 concurrent users without degradation

**Integration Success:**
- **OCR Accuracy:** 98%+ accuracy with Verihubs API
- **OCR Processing Speed:** 4.5 seconds per document average
- **AI Chatbot Deflection:** 80% query deflection rate
- **AI Response Time:** <2 seconds average response time
- **WhatsApp Integration:** 99.9% message delivery rate
- **Payment Gateway:** Auto-reconciliation accuracy 99.5%+

**Scale & Capacity:**
- **Processing Capacity:** 3,000 pilgrims/month per agency supported
- **Batch Operations:** Handle ZIP upload of 100+ documents without timeout
- **Queue Processing:** Background jobs complete within 5 minutes
- **Database Performance:** Support 1M+ records with <200ms query time
- **Storage:** Efficient document storage with CDN delivery <500ms

**Security & Compliance:**
- **Data Encryption:** End-to-end encryption for sensitive data
- **Access Control:** RBAC implementation with zero privilege escalation incidents
- **Audit Trail:** 100% of critical actions logged with tamper-proof audit trail
- **SISKOPATUH Integration:** Automated regulatory reporting with 100% submission success
- **Backup & Recovery:** RPO <1 hour, RTO <4 hours

**Quality Metrics:**
- **Bug Density:** <1 critical bug per 1,000 lines of code
- **Test Coverage:** >80% code coverage with automated tests
- **Deployment Frequency:** Weekly releases without downtime
- **Mean Time to Recovery (MTTR):** <2 hours for critical issues

### Measurable Outcomes

**Leading Indicators (Predict Future Success):**
- **Agent Training Completion:** 95% complete training within 7 days → predicts adoption
- **First-Week Activity:** Agents using 3+ features in first week → predicts retention
- **Owner Dashboard Usage:** 3x/week login → predicts renewal
- **Support Ticket Trend:** Decreasing tickets over time → predicts satisfaction
- **Landing Page Creation:** 40% agents create landing pages → predicts marketing success
- **Referral Requests:** Agencies asking "can I invite partner agency?" → predicts growth
- **Agent Addition Rate:** Increasing rate of new agent onboarding → predicts calm scaling success

**Lagging Indicators (Confirm Success):**
- **Revenue Growth:** 15% MoM in first year
- **Customer Retention:** 90% at 12 months
- **NPS Score:** >50 consistently
- **Agent Productivity:** Measured time savings vs baseline
- **Operational Cost Reduction:** Rp 43M/month average per agency

**Product Usage KPIs:**
- **Daily Active Users (DAU):** 60% of agents login daily
- **Weekly Active Users (WAU):** 85% of agents login weekly
- **Feature Adoption:**
  - "My Jamaah" dashboard: 95% weekly usage
  - Bulk reminder: 70% weekly usage
  - Landing page builder: 40% monthly usage
  - OCR document upload: 80% weekly usage
- **AI Chatbot Metrics:**
  - 80% query deflection rate
  - <2 second average response time
  - 90% accuracy rate (user satisfaction with answers)

**Customer Success KPIs:**
- **Onboarding Success:** 90% complete onboarding within 7 days
- **Time to Value:** Agents see efficiency gain within first week
- **Retention Metrics:**
  - 3-month retention: 90%
  - 12-month retention: 85%
  - 24-month retention: 80%
- **Customer Support:** <4 hour response time, 95% satisfaction

**Competitive KPIs:**
- **Win Rate:** 60% when competing with Erahajj in sales
- **Customer Switch Rate:** 30% of Erahajj customers consider switching
- **Brand Awareness:** 70% of target market knows Travel Umroh by month 12
- **Feature Differentiation:** 8 unique features vs market leader

---

## Product Scope

### MVP - Minimum Viable Product (Month 1-3)

**Core Features - LIVE:**

The MVP delivers the 7 game-changing features that directly solve the core problem: enabling travel agencies to scale from 300 to 3,000 jamaah/month through agent empowerment and operational automation.

**1. Agent-Assisted Service Model**
- Delegated access: Agents can "act as" jamaah
- "My Jamaah" Dashboard with status indicators
- Batch operations for bulk reminders
- Audit trail for transparency
- Hybrid mode (agent-assisted + self-service)
- Multi-level support: Agent → affiliate hierarchy

**2. AI Chatbot Multi-Mode**
- Public/Agent/Admin modes with authentication
- NLP-powered natural language understanding
- Auto-update integration with package changes
- Broadcast integration to authenticated agents
- Secure pricing separation (wholesale vs retail)
- Bot-to-human handoff for complex queries

**3. OCR Document Processing**
- Verihubs API integration (98% accuracy)
- Supported documents: KTP, Passport, Kartu Keluarga, Vaksin
- Auto-extract fields with review workflow
- Batch upload (ZIP file support)
- Queue processing for high volume

**4. WhatsApp Business Integration**
- Official WhatsApp Business API
- Chatbot integration in WhatsApp
- Broadcast messaging with authentication
- Rich media support (images, PDFs, itineraries)
- Template messages for reminders
- Two-way sync with platform

**5. Payment Gateway & Virtual Account**
- Virtual Account: BCA, BSI, BNI, Mandiri
- Auto-reconciliation
- Installment tracking (cicilan 1, 2, 3, 4)
- Payment reminders via WhatsApp
- Commission calculation for agents
- Batch payment to multiple agents

**6. Sharia Compliance & Regulatory**
- DSN-MUI fatwa compliant structure (Wakalah bil Ujrah)
- SISKOPATUH integration (Kemenag)
- Digital akad (contract) with e-signature
- Compliance dashboard
- Full audit trail

**7. Landing Page Builder for Agents**
- Auto-generate customizable landing pages
- Agent branding with photo and contact
- WhatsApp CTA button
- Package display with details
- Social media sharing
- Lead capture with auto-notification
- Analytics (views, clicks, conversions)

**MVP Success Validation Gates:**
- 80% agent adoption (login 3x/week, use 3+ features)
- 70% time reduction validated
- NPS > 50
- 99.9% uptime
- OCR 98% accuracy
- 50 agencies onboarded
- Rp 125 juta MRR

**Navigation Strategy:**
ALL menu items visible from day 1 with "Coming Soon 🔜" badges for deferred features. This shows full vision, sets expectations, prevents re-training when features launch.

### Growth Features (Post-MVP - Month 4-12)

**Phase 2 (Month 4-6) - Enhanced User Experience:**
- **Family Portal:** Real-time GPS tracking, timeline updates, photo gallery
- **Advanced Gamification:** Full leaderboard, badges, contests, rewards
- **Mobile App (Native):** iOS/Android native apps for on-the-go access
- **Advanced BI Analytics:** Predictive analytics, revenue forecasting, churn prediction
- **Custom Report Builder:** User-defined reports with drag-drop interface

**Phase 3 (Month 7-12) - Advanced Operations:**
- **Dynamic Pricing Engine:** AI-powered pricing optimization based on demand/seasonality
- **Integration Marketplace:** Accounting (Accurate, Zahir), CRM, email marketing integrations
- **Advanced Bulk Operations:** More sophisticated batch approvals and processing
- **Chatbot Analytics:** Deep insights into chatbot performance and user queries
- **Package Templates Library:** Pre-built package templates for quick setup

**Business Driver for Growth Features:**
After MVP validates product-market fit, these features:
- Increase customer delight (Family Portal)
- Improve retention (Advanced Gamification)
- Enable premium pricing tiers (Advanced BI, Custom Reports)
- Reduce support costs (Integration Marketplace)

### Vision (Future - Year 2+)

**Phase 4+ (Year 2+) - Market Expansion:**
- **Multi-Language Support:** English, Arabic for international expansion (Malaysia, Singapore, Brunei)
- **Haji Full Feature Set:** Haji-specific workflows (different from umroh)
- **B2C Marketplace:** Public marketplace where customers find agencies
- **Franchise Management:** Tools for agencies managing franchises/branches
- **Agent Training Academy:** Built-in training and certification for agents
- **Advanced Permissions:** Granular permission controls for enterprise customers

**Year 5+ - Platform Ecosystem:**
- **Ecosystem Play:** B2C marketplace connecting agencies with customers
- **International Expansion:** ASEAN Muslim markets (Malaysia, Singapore, Brunei)
- **Product Line:** Umroh + Haji + General Travel SaaS
- **Network Effects:** 100,000+ agents, agency-to-agency referrals, marketplace liquidity
- **Revenue Model:** SaaS subscription + marketplace transaction fees + premium features
- **Strategic Options:** IPO readiness, strategic acquisition target, regional expansion

**Long-Term Differentiator:**
Travel Umroh becomes the **operating system** for umroh/haji agencies across Southeast Asia—the only platform built for agent-driven, full-service cultural models that dominate Muslim-majority markets.

**Exit Vision (Optional):**
- Strategic acquirers: Traveloka, Tiket.com, Grab, SoftBank
- Valuation drivers: Recurring revenue, agent network moat, regulatory compliance infrastructure
- IPO path: 3,000+ agencies, Rp 100B+ ARR, ASEAN market leader

**Explicitly NOT in Scope:**
- Flight booking engine (agencies use existing suppliers)
- Hotel booking engine (agencies have hotel partnerships)
- Visa processing system (SISKOPATUH integration sufficient)
- Currency exchange (agencies use banks/money changers)
- In-flight entertainment (out of scope)

---

## User Journeys

### Journey 1: Pak Hadi (Agency Owner) - Scaling With Confidence

**Opening Scene:**
Pak Hadi wakes up at 5 AM to 73 WhatsApp messages. Half are agents asking "Hotel untuk paket Maret apa?", the other half are jamaah asking their agents who then ask him. He's stuck at 400 jamaah/month for 18 months while his competitor just announced they hit 1,500/month. His wife says "Kenapa kamu ga bisa scale seperti mereka?" He doesn't have an answer.

The breaking point comes when he loses his top agent, Ibu Siti, who says "Pak, sistem kita terlalu ribet. Saya spend 10 jam/minggu cuma untuk admin, ga ada waktu untuk closing deals." That's when a fellow agency owner tells him about Travel Umroh at a HIMPUH conference.

**Rising Action:**
Pak Hadi books a demo. The sales team shows him the dashboard—real-time revenue, agent performance analytics, pipeline visibility. "Ini yang gue cari selama 2 tahun!" He signs up for a 7-day free trial.

The onboarding specialist migrates 50 agents and 100 active jamaah from Erahajj in 3 days. Training sessions: 2 hours for Pak Hadi (dashboard mastery), 3 hours for agents (My Jamaah feature deep dive).

**First Week - The Aha Moment:**
Monday morning, Pak Hadi opens the dashboard. He can SEE everything: Total projected revenue Rp 8 miliar, 40 of 50 agents active, 25 jamaah in pipeline "dokumen kurang." He updates the Maret package (hotel change from Hotel A to Hotel B). Instead of manually broadcasting to 10 WhatsApp groups, he clicks "Update Package" → AI chatbot auto-syncs → broadcasts to 50 authenticated agents → DONE in 30 seconds.

"WOW. Ini yang gue cari! Finally, visibility AND automation!"

**Climax - Calm Scaling:**
Month 2: Pak Hadi feels confident enough to recruit 15 new agents from a partner agency. He onboards them in one afternoon. Nothing breaks. No chaos. The system handles it smoothly.

Month 3: He's at 1,000 jamaah/month (3x growth!). Agent retention is 90% (Ibu Siti stayed—she's now a top performer). His operational costs dropped Rp 43 juta/month. Most importantly: He sleeps well knowing operations run without him micromanaging.

**Resolution:**
Six months later, Pak Hadi is at 2,500 jamaah/month, targeting 3,000 next quarter. At the next HIMPUH conference, OTHER agency owners ask HIM: "Pak Hadi, gimana caranya scale tanpa chaos?" His answer: "Travel Umroh. It's the only system yang understand agent-driven business kita."

**Journey Requirements Revealed:**
- Agency owner dashboard (revenue visibility, agent analytics, pipeline tracking)
- Package management with auto-broadcast to agents
- Multi-tenant onboarding and migration tools
- Agent management (onboard, activate, monitor performance)
- Real-time operational monitoring
- Batch operations for scaling

---

### Journey 2: Ibu Siti (Agent/Mitra) - Reclaiming Her Sales Time

**Opening Scene:**
Ibu Siti manages 25 jamaah using Excel spreadsheets and manual WhatsApp tracking. Every Monday, she spends 3 hours checking: siapa cicilan telat? Siapa dokumen kurang? Then she sends 25 individual WhatsApp messages. By the time she's done with admin, it's lunchtime and she has zero energy for sales calls.

Her husband says, "Bu, penghasilan kita flat selama 6 bulan. You work so hard, tapi kok ga naik-naik?" She knows the answer: She's spending 10 jam/minggu on admin vs 5 jam on actual SALES.

**Rising Action:**
When Pak Hadi announces "Kita pakai system baru, lebih mudah untuk kalian," Siti is skeptical. "Ah, system lagi... Erahajj aja susah, ini pasti lebih ribet." But she attends the 3-hour training session anyway.

The trainer shows the "My Jamaah" dashboard. One screen, all 25 jamaah, color-coded: 5 red (dokumen kurang), 3 yellow (cicilan due this week), 17 green (ready). Bulk operations: Select 5 red → click "Send Reminder" → DONE.

"Oh... ini SIMPLE banget! Ga kayak Erahajj yang banyak klik-klik ga jelas."

**First Week - The Aha Moment:**
Day 1: Siti uploads documents for 3 jamaah via OCR. Auto-extract KTP, Passport data. She just verifies and approves. "Biasanya 30 menit per jamaah, sekarang 5 menit! Cepat banget!"

Day 3: She discovers the Landing Page Builder. Select "Paket Maret," customize with her photo and contact, generate. Share to WhatsApp Status. Within 2 days: 5 inquiries from people she doesn't even know.

Day 7: Morning routine now takes 15 minutes (used to be 2 hours). She has TIME to make 10 sales calls. "WOW! Saya bisa fokus ke sales akhirnya!"

**Climax - Income Breakthrough:**
Month 1: Siti closes 15 new jamaah (vs her usual 8/month). Her dashboard shows 40 jamaah total. The landing page generated 20 leads, she converted 3 (15% conversion—incredible!). Admin time: 2 hours/week. Sales time: 13 hours/week. Income: +50%.

She's now in the Top 5 Agent leaderboard. She earns a "Rising Star" badge. Pak Hadi calls her personally: "Bu Siti, performance ibu luar biasa! Keep it up!"

**Resolution:**
Six months later, Siti manages 65 jamaah comfortably. Her income doubled. She bought her dream motorcycle for door-to-door jamaah visits. When her sister (also an agent at another travel) complains about manual work, Siti says: "Pindah ke Travel Umroh aja. System-nya beda, kita bisa fokus ke sales, bukan admin."

**Journey Requirements Revealed:**
- "My Jamaah" dashboard with status indicators and filtering
- Bulk operations (reminders, document requests)
- OCR document upload with auto-extraction and review workflow
- Landing page builder with customization, WhatsApp CTA, social sharing
- Lead capture and auto-notification
- Performance leaderboard and gamification
- Analytics (lead sources, conversion tracking)

---

### Journey 3: Mbak Rina (Admin/Operations) - From Overwhelmed to In Control

**Opening Scene:**
Mbak Rina processes 500 jamaah documents per month. Manual data entry: 10 minutes per document × 500 = 83 hours/month of pure typing. She has 3 staff, but they're drowning. Agents upload documents via WhatsApp → Rina downloads, renames, organizes manually → chaos.

Yesterday, she mixed up Pak Ahmad's passport with Bu Siti's passport in the system. The visa got rejected. Pak Hadi was furious. Rina cried in the bathroom.

She also answers 50+ repetitive questions daily in 10 different agent WhatsApp groups: "Pak, hotel di Makkah apa?", "Bu, harga wholesale berapa?", "Mas, komisi saya berapa ya?"

**Rising Action:**
When Travel Umroh launches, Rina attends the admin training. The trainer shows OCR: "Agent upload → OCR auto-extract → Rina REVIEW & APPROVE, no manual typing."

Then the AI chatbot: "80% of agent questions answered automatically. Rina only handles complex escalations."

She thinks: "Ini too good to be true. Pasti ada catch-nya."

**First Day - The Aha Moment:**
Agent uploads 50 documents via ZIP file. OCR processes all 50 in background. Rina gets notification: "50 documents ready for review." She opens the review dashboard. Each document: auto-extracted fields (Name, NIK, DOB, passport number). She just verifies accuracy and clicks "Approve" or corrects errors.

50 documents reviewed in 90 minutes (vs 8 hours manual entry). "OH MY GOD. Ini game changer!"

The chatbot deflects 40 of 50 agent questions. Rina only handles 10 complex queries. Her WhatsApp is QUIET for the first time in 2 years.

**Climax - Zero Errors Month:**
Month 1: Rina processes 500 documents with ZERO mix-ups. The system auto-organizes everything by jamaah. Audit trail shows: "Document uploaded by Agent Ahmad on behalf of Jamaah Siti at 14:30" - complete transparency.

Bulk approval feature: 50 pending documents → Rina reviews batch → one click "Approve All" → DONE.

Her stress level drops 80%. She stops having Sunday night anxiety about Monday's document pile.

**Resolution:**
Three months later, Rina's team handles 1,500 documents/month (3x volume) with the SAME 3-person team. No additional hiring needed. Pak Hadi gives her a bonus: "Mbak Rina, efficiency tim kamu luar biasa. Terima kasih!"

Rina recommends Travel Umroh to her friend who works at another travel agency: "Sistem ini literally saved my mental health."

**Journey Requirements Revealed:**
- OCR integration with batch upload (ZIP support)
- Review dashboard with approve/reject workflow
- Auto-organization by jamaah with audit trail
- Bulk approval operations
- AI chatbot with agent mode for deflecting queries
- Escalation workflow (bot → human handoff with context)
- Document management system with search and filtering

---

### Journey 4: Pak Budi (Jamaah) & Siti (Family) - Peace of Mind Journey

**Opening Scene:**
Pak Budi, 52, dreams of umroh for 20 years. He's a small electronics shop owner, not tech-savvy. The process terrifies him: documents, visa, passport, payments, what to bring, where to go in Mecca. He's overwhelmed.

His daughter Siti (25, marketing professional) helps him research travel agencies. They choose PT Berkah Umroh because of Ibu Siti (the agent), who promises "Saya handle semuanya Pak, Bapak tinggal focus ke persiapan spiritual."

**Rising Action:**
Ibu Siti (agent) uses Travel Umroh to manage Pak Budi's entire journey:
- Uploads his documents via OCR (KTP, passport, vaksin)
- Tracks his 4 installment payments
- Updates him via WhatsApp when documents are approved
- Shares itinerary and packing list

Pak Budi NEVER logs into the platform. He doesn't need to. Ibu Siti handles everything. This is exactly what he wanted: full-service, personal touch.

His daughter Siti receives an email from Ibu Siti: "Dear family, track your loved ones via Family Portal: [link]." She creates an account.

**During Umroh - The Peace of Mind Moment:**
Day 1: Push notification to Siti's phone: "Bapak & Ibu arrived Jeddah safely ✅"

Day 3: Siti opens Family Portal during her work break. Map shows: "Currently at Masjidil Haram." She smiles, takes a screenshot, shares to family WhatsApp group.

Day 7: Timeline update: "Check-in Hotel Madinah 16:00 ✅." Photo gallery updated: Pictures of her parents happy at Masjid Nabawi.

Siti can focus on her work presentation knowing her parents are safe and trackable. No expensive roaming calls needed.

**Resolution:**
Pak Budi returns safely. The umroh was spiritually fulfilling. When his friends ask "Gimana umrohnya?", he says: "Alhamdulillah lancar. Travel-nya professional, agen-nya helpful, keluarga di rumah ga khawatir karena bisa tracking."

Siti tells her office colleagues: "Kalau orangtua kalian mau umroh, harus pakai travel yang punya Family Portal. We had so much peace of mind!"

Two of her colleagues book umroh through PT Berkah Umroh because of her recommendation.

**Journey Requirements Revealed:**
- Agent delegated access (upload documents on behalf of jamaah)
- WhatsApp notifications for status updates
- Family Portal with real-time GPS tracking
- Timeline updates and photo gallery
- Push notifications for key events
- No-login option for jamaah (fully agent-assisted mode)

---

### Journey 5: Dani (Affiliate Agent under Ibu Siti) - Multi-Level Success

**Opening Scene:**
Dani, 26, works part-time as an affiliate agent under Ibu Siti. He's a college student who earns extra income by referring friends/family for umroh. He manages 5-8 jamaah at a time, small scale compared to Ibu Siti's 65.

Previously, he had NO access to any system. He WhatsApps Ibu Siti for everything: "Bu, status dokumen Pak Ahmad gimana?", "Bu, cicilan Bu Rahma udah dibayar belum?" Ibu Siti gets frustrated answering 20 messages/day from Dani and 3 other affiliates.

**Rising Action:**
When Ibu Siti migrates to Travel Umroh, she discovers the multi-level agent feature. She can give Dani LIMITED access:
- Dani can see ONLY his 8 jamaah (not Ibu Siti's other 57)
- Dani can upload documents on their behalf
- Dani can see payment status
- Dani CANNOT see wholesale pricing (only his commission structure)

Ibu Siti onboards Dani: "Mas Dani, sekarang kamu ada akses ke system. You can manage your jamaah sendiri, ga usah tanya-tanya saya lagi."

**First Week - The Independence Moment:**
Dani logs in. His dashboard shows "My 8 Jamaah." Status indicators: 2 red (dokumen kurang), 1 yellow (cicilan due), 5 green (ready).

He uploads documents for Pak Ahmad directly via OCR. He sees Pak Ahmad's payment status: "Cicilan 2 of 4 paid, cicilan 3 due Dec 30." He sends a payment reminder via WhatsApp using the system.

"Wow, saya bisa kerja independently sekarang! Ga perlu ganggu Bu Siti tiap hari!"

**Climax - Scaling Together:**
Month 2: Dani manages 15 jamaah (up from 8). His efficiency increased because he has tools now, not just manual WhatsApp tracking.

Ibu Siti is THRILLED. Her message volume from affiliates dropped 80%. Her 4 affiliates (including Dani) are more productive and independent. Ibu Siti can focus on HER jamaah and recruiting MORE affiliates.

The system tracks Dani's commission automatically. When Ibu Siti gets paid, Dani's share is calculated and ready for payout.

**Resolution:**
Six months later, Dani graduates and becomes a full-time agent. He recruits his OWN 2 affiliates (sub-sub level). The multi-level structure works: Pak Hadi → Ibu Siti → Dani → Dani's affiliates. Everyone has appropriate access levels.

Dani says: "Tanpa Travel Umroh, I would still be a tiny affiliate asking questions all day. Now I'm building my own agent business."

**Journey Requirements Revealed:**
- Multi-level agent hierarchy (agent → affiliate → sub-affiliate)
- Granular permissions (view only own jamaah, limited pricing visibility)
- Delegated access at affiliate level
- Commission calculation across multiple levels
- Independent dashboard for affiliates
- Audit trail showing who did what at each level

---

### Journey 6: Andi (Platform Support - Travel Umroh Team) - Multi-Tenant Monitoring

**Opening Scene:**
Andi is a customer success manager at Travel Umroh (the SaaS company). He monitors 350 travel agencies using the platform. His KPI: 90% retention, <10% churn, NPS >50.

This morning, he sees an alert: "PT Berkah Wisata - 30% drop in agent logins (week over week)." Something's wrong.

**Rising Action:**
Andi opens the Super Admin dashboard. He can see:
- PT Berkah Wisata has 45 agents, but only 14 logged in this week (vs 32 last week)
- Document upload volume down 40%
- No new jamaah added in 5 days

He calls the agency owner: "Pak, I notice activity drop. Ada masalah?" Owner says: "Kami ada konflik internal, beberapa agen pindah ke kompetitor."

Andi offers: "Let me help. I'll run a health check on your account and provide recommendations."

**The Intervention:**
Andi runs diagnostics:
- Identifies which agents left (inactive accounts)
- Sees which agents are still active but struggling (low feature adoption)
- Generates a report: "15 agents need re-training on My Jamaah dashboard"

He schedules a rescue session: 1-hour refresher training for remaining agents. He also offers a free feature unlock (Advanced BI Analytics trial) to help the owner see value.

**Resolution:**
Two weeks later, PT Berkah Wisata's activity stabilizes. Agent logins back to 28/45 (62%). The owner says: "Terima kasih Mas Andi. Support kalian luar biasa. Kompetitor ga ada yang peduli kayak gini."

Andi's retention target: ✅ ACHIEVED. PT Berkah Wisata renews annual subscription early.

**Journey Requirements Revealed:**
- Super Admin dashboard with multi-tenant monitoring
- Health metrics per agency (agent activity, document volume, jamaah growth)
- Alert system for anomaly detection (sudden drops)
- Account diagnostics and reporting tools
- Feature management (unlock trials, premium features)
- Customer success intervention workflows

---

### Journey 7: Reza (Integration Developer) - API Consumer Journey

**Opening Scene:**
Reza is an IT consultant hired by PT Surya Umroh (one of the larger agencies using Travel Umroh). The agency wants to integrate Travel Umroh with their existing accounting system (Accurate) so financial data syncs automatically.

Reza reviews Travel Umroh's API documentation. He needs:
- Read jamaah data (name, package, payment status)
- Sync payment records to Accurate when cicilan paid
- Push invoice data back to Travel Umroh

**Rising Action:**
Reza creates an API key from the Travel Umroh admin panel. The documentation shows RESTful endpoints:
- `GET /api/v1/jamaah` - Retrieve jamaah list
- `GET /api/v1/payments` - Retrieve payment records
- `POST /api/v1/invoices` - Create invoices

He tests in Postman. Authentication works (OAuth 2.0). Response format is clean JSON. Rate limits: 1,000 requests/hour (sufficient for PT Surya's 500 jamaah/month).

**The Integration:**
Reza builds a middleware service:
1. Every hour, fetch new payment records from Travel Umroh
2. Transform data to Accurate format
3. POST to Accurate API
4. Log success/failure

He also builds a webhook listener: When payment confirmed in Travel Umroh → triggers webhook → updates Accurate in real-time.

**Resolution:**
Integration goes live. PT Surya's accounting team is thrilled: "Manual entry ELIMINATED. Financial data 100% accurate and real-time."

The agency owner upgrades to the Enterprise plan to unlock more API endpoints (advanced analytics, custom reports).

Reza writes a case study on his blog: "How I integrated Travel Umroh with Accurate in 2 days." Three other agencies reach out asking for the same integration.

**Journey Requirements Revealed:**
- RESTful API with OAuth 2.0 authentication
- Endpoints for jamaah, payments, invoices, packages
- Webhook support for real-time events
- API documentation (clear, with examples)
- Rate limiting and quota management
- Developer portal with API key management
- Sandbox environment for testing

---

### Journey 8: Sari (Onboarding Specialist - Travel Umroh Team) - Migration Journey

**Opening Scene:**
Sari is an onboarding specialist at Travel Umroh. Today, she's migrating PT Harapan Umroh from Erahajj to Travel Umroh. This agency has:
- 80 agents
- 200 active jamaah
- 15 packages
- 2 years of historical data

The owner says: "Saya takut migration-nya ribet. Data ilang, agen-agen complain, chaos 2 minggu."

**Rising Action:**
Sari reassures: "Pak, migration kami structured. Zero downtime, zero data loss. I'll personally handle it."

**Migration Plan (7 Days):**
- **Day 1-2:** Data export from Erahajj (CSV format), mapping to Travel Umroh schema
- **Day 3:** Import agents (80 accounts created with temp passwords)
- **Day 4:** Import jamaah (200 records with full history)
- **Day 5:** Import packages and pricing
- **Day 6:** Training sessions (3 batches of agents, 1 admin session)
- **Day 7:** Go-live, Erahajj deactivated

**The Critical Moment:**
Day 6, training session 2: One senior agent (Bu Ratna, 60 years old) struggles. She says: "Saya ga bisa komputer, saya biasa manual."

Sari spends extra 30 minutes one-on-one with Bu Ratna. Shows her ONLY the 3 features she needs: My Jamaah dashboard, upload document, send reminder. Bu Ratna gets it: "Oh, cuma 3 ini aja? Okay, saya bisa."

**Resolution:**
Day 8 (post-launch): The owner calls Sari: "Mbak Sari, migration-nya smooth banget! 70 of 80 agen udah aktif, ga ada yang complain. Bu Ratna even said 'ini lebih gampang dari Erahajj!'"

Sari marks the migration: ✅ SUCCESS. Agency retention probability: 95%.

She documents the success case: "PT Harapan Umroh migration - 80 agents, 7 days, 88% agent adoption week 1."

**Journey Requirements Revealed:**
- Data import tools (CSV, batch processing)
- Migration workflows and checklists
- Training materials (video tutorials, PDFs)
- Onboarding dashboard (track migration progress)
- One-on-one support escalation path
- Adoption analytics (track which agents login post-migration)
- Success metrics and reporting

---

### Journey Requirements Summary

These journeys reveal comprehensive capability areas needed:

**Core Platform Capabilities:**
1. **Multi-Tenant SaaS Infrastructure** - Agency isolation, data security, scaling to 1,036 agencies
2. **Agent Management System** - Onboarding, activation, multi-level hierarchy, permissions, analytics
3. **"My Jamaah" Dashboard** - Agent workspace with status indicators, filtering, bulk operations
4. **Document Management & OCR** - Upload, auto-extraction (Verihubs), review workflow, batch processing, audit trail
5. **Payment & Financial Operations** - Virtual Account integration, installment tracking, auto-reconciliation, commission calculation (multi-level)
6. **AI Chatbot Multi-Mode** - Public/Agent/Admin modes, authentication-based pricing, auto-update, bot-to-human handoff
7. **WhatsApp Business Integration** - Official API, chatbot integration, broadcast, rich media, templates
8. **Landing Page Builder** - Agent branding, WhatsApp CTA, social sharing, lead capture, analytics
9. **Operational Intelligence Dashboard** - Revenue visibility, agent analytics, pipeline tracking for agency owners
10. **Package Management** - Create, update, pricing (retail/wholesale), auto-broadcast to agents

**Secondary Capabilities:**
11. **Family Portal** - Real-time GPS tracking, timeline updates, photo gallery, push notifications (Phase 2)
12. **Super Admin Platform** - Multi-tenant monitoring, health metrics, alerts, diagnostics, intervention tools
13. **RESTful API & Webhooks** - OAuth 2.0, endpoints for jamaah/payments/invoices, webhook events, developer portal
14. **Migration & Onboarding Tools** - Data import (CSV), batch processing, training materials, adoption tracking
15. **Gamification System** - Leaderboards, badges, performance tracking
16. **Sharia Compliance & Regulatory** - SISKOPATUH integration, DSN-MUI compliance, digital akad, audit trail
17. **Security & Access Control** - RBAC with granular permissions, multi-level agent access, pricing visibility controls

---

## Domain-Specific Requirements

**Note:** Detailed domain exploration deferred to focus on MVP speed. Key compliance areas to address during implementation:

**Fintech Compliance (Payment Processing):**
- PCI-DSS compliance level determination (likely SAQ A - using third-party payment gateway)
- Virtual Account integration security (BCA, BSI, BNI, Mandiri APIs)
- Transaction audit trails for financial reconciliation
- Fraud prevention for installment payments

**Sharia Compliance (DSN-MUI):**
- Wakalah bil Ujrah contract structure implementation
- Digital akad (contract) with e-signature compliance
- Transaction validation for sharia compliance
- Religious authority reporting (if required)

**Government Regulatory (SISKOPATUH - Kemenag):**
- API integration requirements and data format
- Reporting frequency and data synchronization
- Compliance dashboard for tracking submission status
- Penalty avoidance through automated reporting

**Data Privacy & Security (Indonesian Regulations):**
- UU ITE (Information and Electronic Transactions Law) compliance
- UU PDP (Personal Data Protection Law) requirements
- Encryption standards for sensitive data (KTP, passport, personal information)
- Data residency considerations (Indonesian data centers)
- Access control and audit trails

**Multi-Level Commission Structure:**
- Compliance with Indonesian MLM regulations (if applicable)
- Tax reporting for commission payments
- Commission structure transparency and documentation
- Agent/affiliate agreement legal framework

**Implementation Approach:**
- MVP Phase: Implement basic compliance (SISKOPATUH integration, basic encryption, sharia contract structure)
- Phase 2: Full compliance audit and certification (PCI-DSS, data privacy)
- Phase 3: Advanced compliance features (automated regulatory reporting, compliance dashboard)

**Risk Mitigation:**
- Engage legal counsel for Indonesian financial and data regulations
- Partner with payment gateway providers with existing PCI-DSS compliance
- Consult DSN-MUI experts for sharia compliance validation
- Implement audit trails from day 1 for all critical operations

---

## Innovation & Novel Patterns

**Note:** Core innovation captured for MVP focus - detailed exploration deferred.

**Key Innovation Areas:**

1. **Agent-First Architecture** (THE Market Disruption)
   - **Innovation:** Rethinking umroh SaaS from agent-driven perspective, not self-service
   - **Market Blind Spot:** Competitors (Erahajj) assume pilgrims self-service, but 80% of Indonesian business flows through agents
   - **Validation:** 50 agencies onboarded in 3 months, 80% agent adoption rate

2. **Multi-Mode AI with Secure Pricing Separation**
   - **Innovation:** Single chatbot with authentication-based response modes (Public sees retail pricing, Agents see wholesale + commission)
   - **Novel Approach:** Combining AI automation with granular access control for multi-tenant B2B SaaS
   - **Validation:** 80% query deflection rate, zero wholesale pricing leakage incidents

3. **Multi-Level Agent Hierarchy with Granular Permissions**
   - **Innovation:** Agent → Affiliate → Sub-affiliate structure with independent dashboards and commission tracking
   - **Unique:** Each level sees only their jamaah, pricing visibility controlled by level
   - **Validation:** Agents report 80% reduction in affiliate question volume, multi-level scaling working smoothly

**Competitive Validation:**
- Erahajj (670+ agencies, market leader) has comprehensive features BUT lacks agent-first model
- Travel Umroh's innovation is not technology (OCR, AI exist) but **business model understanding** - recognizing agent-driven reality vs self-service assumption

**Risk Mitigation:**
- Innovation is market-fit innovation (solving real pain), not technology risk
- Validation through 3-month MVP with 50 agencies proves model before scaling
- Fallback: If agent model fails, system supports self-service mode (hybrid approach built-in)

---

## SaaS B2B Platform Specific Requirements

**Note:** Technical architecture requirements synthesized for MVP focus.

### Multi-Tenancy Model

**Architecture:** Complete agency isolation model

- **Tenant Structure:** Each travel agency is an independent tenant with isolated data
- **Scaling Target:** 1,036 agencies (60% market share), 31,000+ agents, 1M+ jamaah/year
- **Data Isolation:** Complete schema isolation per tenant (no cross-agency data access)
- **Tenant Provisioning:** Automated onboarding with 7-day migration timeline from competitors
- **Database Strategy:** Shared infrastructure with logical separation (single database, tenant_id partitioning for cost efficiency at scale)
- **Subdomain Strategy:** agency-slug.travelumroh.com OR custom domain support (enterprise tier)
- **Resource Limits:** 500 concurrent users per agency, 3,000 jamaah/month capacity per agency

### RBAC & Permission Matrix

**5-Layer Permission Model:**

| Role | Agency Owner | Agent/Mitra | Affiliate | Admin/Operations | Jamaah | Family |
|------|--------------|-------------|-----------|------------------|--------|--------|
| **Dashboard Access** | Full agency dashboard | My Jamaah dashboard | My Jamaah (limited) | Operations dashboard | Optional self-service | Family Portal |
| **View Revenue** | ✅ All | ❌ No | ❌ No | ✅ All | ❌ No | ❌ No |
| **View Wholesale Pricing** | ✅ Yes | ✅ Yes | ❌ No (commission only) | ✅ Yes | ❌ No | ❌ No |
| **View Retail Pricing** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Manage Agents** | ✅ Add/remove/monitor | ❌ No | ❌ No | ✅ Add/remove | ❌ No | ❌ No |
| **Manage Packages** | ✅ Create/edit/delete | ❌ View only | ❌ View only | ✅ Create/edit | ❌ View only | ❌ View only |
| **Manage Jamaah** | ✅ All jamaah | ✅ Assigned jamaah | ✅ Assigned jamaah | ✅ All jamaah | ✅ Self only | ❌ View only (family) |
| **Upload Documents** | ✅ Any jamaah | ✅ Delegated access | ✅ Delegated access | ✅ Any jamaah | ✅ Self | ❌ No |
| **Approve Documents** | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Process Payments** | ✅ View all | ✅ View assigned | ✅ View assigned | ✅ Process all | ✅ Pay self | ❌ No |
| **Commission Tracking** | ✅ All commissions | ✅ Own + affiliates | ✅ Own only | ✅ Calculate/payout | ❌ No | ❌ No |
| **Reports & Analytics** | ✅ Full BI | ✅ Own performance | ✅ Own performance | ✅ Operational reports | ❌ No | ❌ No |
| **Settings & Configuration** | ✅ All settings | ❌ Profile only | ❌ Profile only | ✅ Operational settings | ❌ Profile only | ❌ Profile only |

**Multi-Level Agent Hierarchy:**
- **Level 1 (Agency Owner → Agent):** Full agent permissions, wholesale pricing visibility, commission on own sales
- **Level 2 (Agent → Affiliate):** Limited permissions, view only assigned jamaah, commission-only visibility (no wholesale pricing)
- **Level 3 (Affiliate → Sub-Affiliate):** Same as Level 2, commission split calculated across levels

### Subscription Tiers

**Tiered Pricing Model:**

| Tier | Monthly Price | Target | Features | Agent Limit | Jamaah Limit |
|------|---------------|--------|----------|-------------|--------------|
| **Starter** | Rp 1.5 juta | Small agencies (100-300 jamaah/year) | 7 core features, basic support | Up to 20 agents | Up to 500 jamaah/month |
| **Professional** (MVP Default) | Rp 2.5 juta | Growing agencies (300-1,500 jamaah/year) | 7 core features + gamification, priority support | Up to 100 agents | Up to 3,000 jamaah/month |
| **Enterprise** | Rp 5 juta | Large agencies (1,500+ jamaah/year) | All features + API access + custom integrations + dedicated support | Unlimited agents | Unlimited jamaah |
| **Enterprise+** | Custom pricing | Multi-branch agencies, franchises | White-label options, custom development, SLA guarantees | Unlimited | Unlimited |

**Billing Model:**
- Annual upfront payment (10% discount)
- Monthly payment with 3-month commitment minimum
- Usage overage fees: +Rp 50,000 per additional 100 jamaah beyond tier limit
- Add-ons: Family Portal (+Rp 500,000), Advanced BI (+Rp 750,000), Custom integrations (quote-based)

### Integration Architecture

**Core Integrations (MVP):**

1. **WhatsApp Business API**
   - Provider: Twilio / MessageBird / official Meta API
   - Integration: Webhook-based bidirectional messaging
   - Features: Chatbot responses, broadcast messaging, rich media, template messages
   - SLA: 99.9% message delivery rate

2. **Payment Gateway - Virtual Account**
   - Providers: BCA, BSI, BNI, Mandiri (direct bank APIs)
   - Integration: RESTful API with webhook callbacks
   - Features: Auto-reconciliation, installment tracking, commission calculation
   - Security: PCI-DSS SAQ A compliant (no card data storage)

3. **OCR - Verihubs API**
   - Provider: Verihubs Indonesia
   - Integration: REST API with batch processing
   - Features: KTP, Passport, Kartu Keluarga, Vaksin extraction
   - SLA: 98% accuracy, 4.5 seconds per document

4. **SISKOPATUH - Kemenag Regulatory**
   - Provider: Indonesian Ministry of Religious Affairs
   - Integration: SOAP/REST API (depending on Kemenag spec)
   - Features: Automated jamaah data submission, visa status tracking
   - Compliance: 100% submission accuracy requirement

**Future Integrations (Phase 2+):**
- Accounting: Accurate, Zahir (API-based sync)
- CRM: Custom CRM integrations for larger agencies
- Email Marketing: Mailchimp, SendGrid for agent communication
- SMS Gateway: Local Indonesian SMS providers

### Compliance & Security Requirements

**Multi-Tenant Security:**
- Row-level security (RLS) with tenant_id enforcement
- API authentication: JWT tokens with tenant scope
- Rate limiting per tenant (1,000 API calls/hour default)
- Data encryption: AES-256 at rest, TLS 1.3 in transit
- Audit logging: All critical operations logged with tenant + user + timestamp

**GDPR-Like Data Privacy (UU PDP):**
- Right to data portability (export all jamaah data)
- Right to deletion (GDPR-style data erasure)
- Consent management for Family Portal tracking
- Data retention policies (7 years for financial records, 3 years for operational data)

**Backup & Disaster Recovery:**
- Daily automated backups per tenant
- 7-day backup retention for point-in-time recovery
- RPO (Recovery Point Objective): <1 hour
- RTO (Recovery Time Objective): <4 hours
- Geographic redundancy: Primary (Jakarta), Secondary (Singapore)

### Implementation Considerations

**Technology Stack Recommendations:**
- **Backend:** Node.js (NestJS) or Laravel (PHP) for rapid MVP development
- **Database:** PostgreSQL with tenant_id partitioning and RLS
- **Queue System:** Redis + Bull for OCR processing, email/SMS, commission calculations
- **Real-Time:** WebSocket (Socket.io) for inventory updates, payment notifications
- **File Storage:** AWS S3 / Google Cloud Storage with CDN for documents
- **Deployment:** Kubernetes for auto-scaling, Docker containers
- **Monitoring:** Sentry (error tracking), DataDog (performance monitoring)

**Scalability Considerations:**
- Horizontal scaling for web servers (auto-scale based on CPU/memory)
- Database read replicas for reporting queries
- Caching layer (Redis) for frequently accessed data (packages, pricing)
- Background job processing (queue workers) for heavy operations
- CDN for static assets and document delivery

**DevOps & CI/CD:**
- Automated testing (unit, integration, e2e)
- Blue-green deployment for zero-downtime releases
- Feature flags for gradual rollouts
- Automated database migrations with rollback capability
- Weekly release cadence for MVP phase

---

## MVP Scoping & Prioritization

**Note:** Scoping decisions already defined in Product Scope section - summarized here for implementation clarity.

### MVP Boundaries (Month 1-3)

**Strategy:** Aggressive 3-month timeline targeting 50 agencies and Rp 125 juta MRR to validate product-market fit.

**7 Core Features (MUST HAVE - MVP Blockers):**

1. **Agent-Assisted Service Model** - Delegated access, "My Jamaah" dashboard, batch operations, audit trail
2. **AI Chatbot Multi-Mode** - Public/Agent/Admin modes with secure pricing separation
3. **OCR Document Processing** - Verihubs integration with 98% accuracy
4. **WhatsApp Business Integration** - Official API with chatbot and broadcast
5. **Payment Gateway & Virtual Account** - BCA, BSI, BNI, Mandiri with auto-reconciliation
6. **Sharia Compliance & Regulatory** - SISKOPATUH integration, DSN-MUI compliance
7. **Landing Page Builder** - Agent branding with WhatsApp CTA

**MVP Validation Gates:**
- 80% agent adoption (login 3x/week, use 3+ features)
- 70% time reduction validated via surveys
- NPS > 50
- 50 agencies onboarded
- Rp 125 juta MRR
- 99.9% uptime, OCR 98% accuracy

**Deferred to Phase 2 (Month 4-6):**
- Family Portal (real-time GPS tracking)
- Advanced Gamification (full leaderboard, contests)
- Native Mobile Apps (iOS/Android)
- Advanced BI Analytics
- Custom Report Builder

**Navigation Strategy:**
- ALL menu items visible from day 1
- Deferred features show "Coming Soon 🔜" badges with target timeline
- Benefits: Shows full vision, prevents re-training when features launch, enables early feedback

### Feature Prioritization Framework

**Priority Matrix:**

| Feature | User Impact | Implementation Effort | MVP Priority | Phase |
|---------|-------------|----------------------|--------------|-------|
| Agent-Assisted Model | CRITICAL | High | P0 | MVP |
| AI Chatbot Multi-Mode | CRITICAL | High | P0 | MVP |
| OCR Document Processing | CRITICAL | Medium | P0 | MVP |
| WhatsApp Integration | CRITICAL | Medium | P0 | MVP |
| Payment Gateway | CRITICAL | High | P0 | MVP |
| Sharia Compliance | CRITICAL | Medium | P0 | MVP |
| Landing Page Builder | HIGH | Medium | P0 | MVP |
| Operational Dashboard (Owner) | HIGH | Medium | P0 | MVP |
| Package Management | HIGH | Low | P0 | MVP |
| Multi-Level Agent Hierarchy | HIGH | High | P0 | MVP |
| Family Portal | MEDIUM | High | P1 | Phase 2 |
| Advanced Gamification | MEDIUM | Medium | P1 | Phase 2 |
| Mobile Native Apps | MEDIUM | Very High | P2 | Phase 2 |
| Dynamic Pricing Engine | LOW | Very High | P2 | Phase 3 |
| Integration Marketplace | LOW | High | P2 | Phase 3 |

**Decision Rationale:**
- **P0 (MVP Blockers):** Cannot validate product-market fit without these - directly address core problem (scaling agencies through agent empowerment)
- **P1 (Value Enhancers):** Improve user delight and retention but not required for initial validation
- **P2 (Competitive Differentiators):** Build moat and enable premium pricing after product-market fit proven

### Implementation Timeline

**Month 1 (Foundation):**
- Multi-tenant infrastructure setup
- RBAC implementation (5 roles)
- Database schema with tenant isolation
- Authentication & authorization
- Agency onboarding workflow

**Month 2 (Core Features - Part 1):**
- "My Jamaah" dashboard for agents
- Document management & OCR integration (Verihubs)
- Package management system
- Agent management (onboard, activate, permissions)

**Month 3 (Core Features - Part 2 + Integrations):**
- AI Chatbot (multi-mode with secure pricing)
- WhatsApp Business API integration
- Payment Gateway (Virtual Account - 4 banks)
- SISKOPATUH integration (Kemenag)
- Landing Page Builder
- Operational Intelligence Dashboard (agency owners)

**Month 3 (Launch Prep):**
- Load testing (3,000 jamaah/month, 500 concurrent users)
- Security audit & penetration testing
- Training materials & documentation
- 10 pilot agencies onboarded
- Bug fixes & performance optimization

**Go-Live:** End of Month 3 with 10 pilot agencies

**Month 4 (Scale):**
- Onboard remaining 40 agencies (target: 50 total)
- Monitor validation gates
- Iterate based on user feedback
- Plan Phase 2 features

### Technical Debt Strategy

**Acceptable Technical Debt for MVP Speed:**
- Manual deployment acceptable (automate in Month 4)
- Basic monitoring (enhance with DataDog in Phase 2)
- Minimal test coverage initially (build up to 80% by Month 6)
- Monolithic architecture acceptable (microservices if needed at scale)

**Non-Negotiable Quality Standards:**
- 99.9% uptime from day 1
- Data encryption (AES-256 at rest, TLS 1.3 in transit)
- Tenant data isolation (zero cross-contamination tolerance)
- Audit trails for all critical operations
- SISKOPATUH 100% submission accuracy

### Risk Mitigation

**MVP Risks & Mitigation:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| 3-month timeline too aggressive | Medium | High | Cut scope to 5 core features if behind schedule (drop Landing Page Builder, defer chatbot to Phase 2) |
| Verihubs OCR accuracy < 98% | Low | High | Fallback: Manual entry with auto-save (accept lower efficiency temporarily) |
| SISKOPATUH API integration issues | Medium | Critical | Early integration test (Month 1), alternative: manual submission backup |
| Agent adoption < 80% | Medium | Critical | Intensive training, one-on-one support, UX iteration based on feedback |
| Performance issues at scale | Low | High | Load testing from Month 2, horizontal scaling ready |

---

## Functional Requirements

**Note:** Functional requirements synthesized from User Journeys and MVP Scope - organized by capability area.

### 1. Multi-Tenant Agency Management

**FR-1.1:** System SHALL support complete tenant isolation per travel agency
**FR-1.2:** System SHALL provision new agencies within 24 hours with automated onboarding
**FR-1.3:** System SHALL support agency-specific subdomain (agency-slug.travelumroh.com)
**FR-1.4:** System SHALL support custom domain mapping for Enterprise tier
**FR-1.5:** System SHALL enforce tenant resource limits (500 concurrent users, 3,000 jamaah/month)

### 2. Role-Based Access Control

**FR-2.1:** System SHALL implement 6 distinct roles (Agency Owner, Agent, Affiliate, Admin, Jamaah, Family)
**FR-2.2:** System SHALL enforce role-based permissions per RBAC matrix (see SaaS B2B section)
**FR-2.3:** System SHALL support multi-level agent hierarchy (Agent → Affiliate → Sub-Affiliate)
**FR-2.4:** System SHALL restrict wholesale pricing visibility based on role level
**FR-2.5:** System SHALL provide granular data access control (agents see only assigned jamaah)

### 3. Agent Management & "My Jamaah" Dashboard

**FR-3.1:** Agents SHALL view all assigned jamaah in single dashboard view
**FR-3.2:** System SHALL display status indicators (red/yellow/green) for documents, payments, approvals
**FR-3.3:** Agents SHALL filter jamaah by status ("Dokumen kurang", "Cicilan telat", "Ready to depart")
**FR-3.4:** Agents SHALL perform bulk operations (select multiple jamaah → send reminders in one action)
**FR-3.5:** System SHALL provide audit trail showing "Document uploaded by Agent X on behalf of Jamaah Y at timestamp"
**FR-3.6:** Agents SHALL delegate access to upload/manage documents for assigned jamaah
**FR-3.7:** System SHALL support hybrid mode (both agent-assisted and self-service jamaah management)

### 4. Document Management & OCR

**FR-4.1:** System SHALL integrate Verihubs OCR API for document processing
**FR-4.2:** System SHALL support KTP, Passport, Kartu Keluarga, Vaksin certificate extraction
**FR-4.3:** System SHALL achieve 98% OCR accuracy or notify for manual review
**FR-4.4:** System SHALL process single document in <4.5 seconds average
**FR-4.5:** System SHALL support ZIP batch upload of 100+ documents
**FR-4.6:** System SHALL queue batch processing jobs and notify upon completion
**FR-4.7:** Admin SHALL review OCR-extracted data before approval
**FR-4.8:** Admin SHALL correct OCR errors and save corrected data
**FR-4.9:** System SHALL provide bulk approval (select 50 documents → approve all in one click)
**FR-4.10:** System SHALL auto-organize documents by jamaah with search/filter capability

### 5. AI Chatbot Multi-Mode

**FR-5.1:** System SHALL implement NLP-powered chatbot with multi-mode support (Public/Agent/Admin)
**FR-5.2:** Chatbot SHALL respond to Public mode with retail pricing only
**FR-5.3:** Chatbot SHALL respond to Agent mode (authenticated) with wholesale pricing + commission info
**FR-5.4:** Chatbot SHALL respond to Admin mode (authenticated) with internal operations support
**FR-5.5:** Chatbot SHALL achieve 80% query deflection rate
**FR-5.6:** Chatbot SHALL respond within <2 seconds average response time
**FR-5.7:** Chatbot SHALL auto-sync knowledge when admin updates packages
**FR-5.8:** Chatbot SHALL auto-broadcast updates to authenticated agents via WhatsApp
**FR-5.9:** Chatbot SHALL escalate complex queries to human with full conversation context
**FR-5.10:** Chatbot SHALL maintain 90% accuracy rate (user satisfaction with answers)

### 6. WhatsApp Business Integration

**FR-6.1:** System SHALL integrate WhatsApp Business API (Twilio / MessageBird / Meta)
**FR-6.2:** System SHALL enable bidirectional messaging (receive and send messages)
**FR-6.3:** Chatbot SHALL respond to WhatsApp messages directly
**FR-6.4:** System SHALL support broadcast messaging to agent groups with authentication
**FR-6.5:** System SHALL send rich media (images, PDFs, itineraries) via WhatsApp
**FR-6.6:** System SHALL use template messages for payment reminders, document requests
**FR-6.7:** System SHALL sync WhatsApp messages to platform history for audit trail
**FR-6.8:** System SHALL achieve 99.9% message delivery rate

### 7. Payment Gateway & Financial Operations

**FR-7.1:** System SHALL integrate Virtual Account for BCA, BSI, BNI, Mandiri
**FR-7.2:** System SHALL auto-reconcile payments when received (match to jamaah, update status)
**FR-7.3:** System SHALL track installments (cicilan 1, 2, 3, 4) with due dates
**FR-7.4:** System SHALL send payment reminders 3 days before due date via WhatsApp
**FR-7.5:** System SHALL calculate agent commission based on jamaah payments
**FR-7.6:** System SHALL calculate multi-level commission splits (Agent → Affiliate → Sub-Affiliate)
**FR-7.7:** System SHALL support batch payment to 200+ agents (one click → CSV export for bank transfer)
**FR-7.8:** System SHALL maintain payment history with full transaction audit trail
**FR-7.9:** System SHALL achieve 99.5%+ auto-reconciliation accuracy

### 8. Package Management

**FR-8.1:** Agency owners SHALL create, edit, delete umroh packages
**FR-8.2:** System SHALL support itinerary builder for package details
**FR-8.3:** System SHALL support dual pricing (retail for public, wholesale for agents)
**FR-8.4:** System SHALL support inclusions/exclusions documentation per package
**FR-8.5:** System SHALL auto-broadcast package updates to authenticated agents
**FR-8.6:** System SHALL version package changes for audit trail
**FR-8.7:** Agents SHALL view assigned packages (view-only, cannot edit)

### 9. Landing Page Builder

**FR-9.1:** Agents SHALL select package and auto-generate customizable landing page
**FR-9.2:** System SHALL support agent branding (name, photo, contact info)
**FR-9.3:** Landing page SHALL include prominent WhatsApp CTA button
**FR-9.4:** Landing page SHALL display package details (itinerary, hotel, pricing, inclusions/exclusions)
**FR-9.5:** Agents SHALL share landing page to Facebook, Instagram, WhatsApp Status (one-click)
**FR-9.6:** Landing page SHALL capture leads via inquiry form
**FR-9.7:** System SHALL auto-notify agent via WhatsApp when lead submits inquiry
**FR-9.8:** System SHALL track analytics (page views, clicks, conversions) per agent
**FR-9.9:** Agent SHALL customize landing page design within brand templates

### 10. Operational Intelligence Dashboard (Agency Owners)

**FR-10.1:** Agency owners SHALL view real-time total revenue
**FR-10.2:** Agency owners SHALL view 3-month revenue projection
**FR-10.3:** Agency owners SHALL view pipeline potential
**FR-10.4:** Agency owners SHALL view agent performance analytics
**FR-10.5:** Agency owners SHALL view top performer leaderboard
**FR-10.6:** Agency owners SHALL view jamaah pipeline by status ("dokumen kurang", etc.)
**FR-10.7:** Agency owners SHALL filter/search all data (agents, jamaah, packages)
**FR-10.8:** Dashboard SHALL refresh in real-time via WebSocket for inventory/payment updates

### 11. Sharia Compliance & Regulatory

**FR-11.1:** System SHALL implement Wakalah bil Ujrah contract structure (DSN-MUI compliant)
**FR-11.2:** System SHALL support digital akad (contract) with e-signature
**FR-11.3:** System SHALL integrate SISKOPATUH API for Kemenag regulatory reporting
**FR-11.4:** System SHALL automate jamaah data submission to SISKOPATUH
**FR-11.5:** System SHALL achieve 100% submission accuracy requirement
**FR-11.6:** System SHALL display compliance dashboard tracking submission status
**FR-11.7:** System SHALL maintain full transaction audit trail for regulatory compliance
**FR-11.8:** System SHALL log all critical operations with timestamp, user, action for auditing

### 12. Onboarding & Migration

**FR-12.1:** System SHALL support CSV import for batch data migration (agents, jamaah, packages)
**FR-12.2:** System SHALL provide migration workflows with progress tracking
**FR-12.3:** System SHALL complete agency migration within 7 days target
**FR-12.4:** System SHALL provide training materials (video tutorials, PDFs)
**FR-12.5:** System SHALL track adoption analytics (which agents login post-migration)
**FR-12.6:** System SHALL support one-on-one training escalation for struggling users

### 13. Super Admin Platform (Multi-Tenant Monitoring)

**FR-13.1:** Super Admin SHALL monitor health metrics per agency (agent activity, document volume, jamaah growth)
**FR-13.2:** System SHALL alert on anomaly detection (sudden 30%+ drops in activity)
**FR-13.3:** Super Admin SHALL run account diagnostics and generate reports
**FR-13.4:** Super Admin SHALL unlock feature trials for specific agencies
**FR-13.5:** Super Admin SHALL track customer success interventions

### 14. API & Webhook Support

**FR-14.1:** System SHALL provide RESTful API with OAuth 2.0 authentication
**FR-14.2:** System SHALL expose endpoints for jamaah, payments, invoices, packages
**FR-14.3:** System SHALL support webhook events for real-time notifications
**FR-14.4:** System SHALL enforce rate limiting (1,000 requests/hour default per tenant)
**FR-14.5:** System SHALL provide API documentation with examples
**FR-14.6:** System SHALL provide developer portal with API key management
**FR-14.7:** System SHALL provide sandbox environment for integration testing

---

## Non-Functional Requirements

**Note:** Performance, security, scalability, and reliability requirements for production-ready MVP.

### Performance Requirements

**NFR-1.1:** System SHALL achieve 99.9% uptime (max 43 minutes downtime/month)
**NFR-1.2:** API responses SHALL complete in <200ms for 95% of requests
**NFR-1.3:** Page load time SHALL be <2 seconds for initial load
**NFR-1.4:** WebSocket latency SHALL be <100ms for real-time inventory/payment updates
**NFR-1.5:** System SHALL support 500 concurrent users per agency without degradation
**NFR-1.6:** OCR processing SHALL complete in 4.5 seconds average per document
**NFR-1.7:** AI Chatbot SHALL respond in <2 seconds average response time
**NFR-1.8:** Background jobs (OCR, email/SMS, commission calc) SHALL complete within 5 minutes

### Scalability Requirements

**NFR-2.1:** System SHALL support 1,036 travel agencies at full scale
**NFR-2.2:** System SHALL handle 3,000 jamaah/month per agency
**NFR-2.3:** System SHALL support 31,000+ total agents across all agencies
**NFR-2.4:** System SHALL process 1M+ jamaah/year at scale
**NFR-2.5:** Database SHALL perform with <200ms query time for 1M+ records
**NFR-2.6:** System SHALL support horizontal scaling for web servers (auto-scale based on load)
**NFR-2.7:** System SHALL support database read replicas for reporting queries
**NFR-2.8:** System SHALL cache frequently accessed data (packages, pricing) with Redis
**NFR-2.9:** System SHALL handle batch operations (ZIP upload 100+ documents, 200+ agent payouts)

### Security Requirements

**NFR-3.1:** System SHALL encrypt data at rest using AES-256
**NFR-3.2:** System SHALL encrypt data in transit using TLS 1.3
**NFR-3.3:** System SHALL enforce Row-Level Security (RLS) with tenant_id partitioning
**NFR-3.4:** System SHALL use JWT tokens with tenant scope for API authentication
**NFR-3.5:** System SHALL implement rate limiting per tenant (1,000 API calls/hour)
**NFR-3.6:** System SHALL log all critical operations (tenant + user + timestamp + action)
**NFR-3.7:** System SHALL enforce zero privilege escalation (agents cannot access owner functions)
**NFR-3.8:** System SHALL achieve PCI-DSS SAQ A compliance (no card data storage)
**NFR-3.9:** System SHALL pass penetration testing before production launch
**NFR-3.10:** System SHALL enforce password complexity (min 12 chars, uppercase, lowercase, number, symbol)

### Reliability Requirements

**NFR-4.1:** System SHALL maintain daily automated backups per tenant
**NFR-4.2:** System SHALL retain 7-day backup history for point-in-time recovery
**NFR-4.3:** System SHALL achieve RPO (Recovery Point Objective) <1 hour
**NFR-4.4:** System SHALL achieve RTO (Recovery Time Objective) <4 hours
**NFR-4.5:** System SHALL implement geographic redundancy (Primary: Jakarta, Secondary: Singapore)
**NFR-4.6:** System SHALL auto-retry failed webhook deliveries (3 attempts with exponential backoff)
**NFR-4.7:** System SHALL implement circuit breakers for third-party API calls (Verihubs, Payment Gateway)
**NFR-4.8:** System SHALL gracefully degrade when non-critical services fail (chatbot down → show offline message)

### Availability Requirements

**NFR-5.1:** System SHALL achieve 99.9% uptime SLA
**NFR-5.2:** System SHALL complete deployments with zero downtime (blue-green deployment)
**NFR-5.3:** System SHALL support rolling updates without service interruption
**NFR-5.4:** System SHALL implement health checks for auto-recovery (Kubernetes liveness probes)
**NFR-5.5:** System SHALL monitor error rates and auto-alert on threshold breach (>1% error rate)

### Compliance Requirements

**NFR-6.1:** System SHALL comply with UU ITE (Indonesian Information and Electronic Transactions Law)
**NFR-6.2:** System SHALL comply with UU PDP (Indonesian Personal Data Protection Law)
**NFR-6.3:** System SHALL support data portability (export all jamaah data in standard format)
**NFR-6.4:** System SHALL support right to deletion (GDPR-style data erasure)
**NFR-6.5:** System SHALL maintain data retention policies (7 years financial, 3 years operational)
**NFR-6.6:** System SHALL achieve 100% SISKOPATUH submission accuracy for regulatory compliance
**NFR-6.7:** System SHALL implement consent management for Family Portal GPS tracking

### Usability Requirements

**NFR-7.1:** System SHALL support Indonesian language (Bahasa Indonesia) as primary language
**NFR-7.2:** System SHALL be responsive across desktop, tablet, mobile web browsers
**NFR-7.3:** System SHALL support modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**NFR-7.4:** Agent training completion rate SHALL be >95% within 7 days (measure usability success)
**NFR-7.5:** System SHALL provide contextual help/tooltips for complex workflows
**NFR-7.6:** Error messages SHALL be clear, actionable, in Indonesian language
**NFR-7.7:** System SHALL support keyboard shortcuts for power users (bulk operations)

### Maintainability Requirements

**NFR-8.1:** System SHALL implement automated testing (unit, integration, e2e) with >80% code coverage
**NFR-8.2:** System SHALL support automated database migrations with rollback capability
**NFR-8.3:** System SHALL implement feature flags for gradual rollouts and A/B testing
**NFR-8.4:** System SHALL maintain API versioning for backward compatibility
**NFR-8.5:** System SHALL implement structured logging for debugging and troubleshooting
**NFR-8.6:** System SHALL monitor error tracking with Sentry or similar tool
**NFR-8.7:** System SHALL monitor performance with DataDog or similar APM tool
**NFR-8.8:** Bug density SHALL be <1 critical bug per 1,000 lines of code

### Operability Requirements

**NFR-9.1:** System SHALL support weekly release cadence during MVP phase
**NFR-9.2:** System SHALL implement automated CI/CD pipelines
**NFR-9.3:** System SHALL provide admin dashboard for operational monitoring
**NFR-9.4:** System SHALL alert on critical threshold breaches (disk space >80%, CPU >85%)
**NFR-9.5:** System SHALL provide metrics dashboard (Prometheus + Grafana or similar)
**NFR-9.6:** Mean Time to Recovery (MTTR) SHALL be <2 hours for critical issues

---

## PRD Summary & Next Steps

### Document Status

**Status:** COMPLETE - Ready for Architecture & Implementation Phase
**Date Completed:** 2025-12-21
**Author:** Yopi
**Version:** 1.0 (MVP Definition)

### Key Deliverables Documented

✅ **Executive Summary** - Product vision, problem statement, solution approach, market opportunity
✅ **Success Criteria** - User success, business success (3mo/12mo/3yr), technical success, measurable outcomes
✅ **Product Scope** - MVP (7 core features), Growth Features (Phase 2-3), Vision (Year 2+), Coming Soon strategy
✅ **User Journeys** - 8 comprehensive narrative journeys covering all user types
✅ **Domain Requirements** - Fintech, Sharia compliance, regulatory (SISKOPATUH), data privacy
✅ **Innovation Patterns** - Agent-first architecture, multi-mode AI, multi-level agent hierarchy
✅ **SaaS B2B Requirements** - Multi-tenancy, RBAC matrix, subscription tiers, integration architecture
✅ **MVP Scoping** - Prioritization matrix, implementation timeline (Month 1-3), technical debt strategy
✅ **Functional Requirements** - 14 capability areas, 100+ specific requirements
✅ **Non-Functional Requirements** - Performance, scalability, security, reliability, compliance

### Critical Decision Summary

| Decision Area | Selected Approach | Rationale |
|---------------|-------------------|-----------|
| **MVP Timeline** | 3 months (aggressive) | Validate product-market fit quickly, 50 agencies target |
| **Core Features** | 7 must-have features | Directly address core problem (scaling through agent empowerment) |
| **Architecture** | Monolithic SaaS with tenant isolation | Cost-efficient for MVP, microservices if needed at scale |
| **Database** | PostgreSQL with tenant_id RLS | Proven reliability, excellent for multi-tenant, powerful querying |
| **Tech Stack** | Node.js (NestJS) or Laravel (PHP) | Rapid development, strong ecosystem, team familiarity |
| **Deployment** | Kubernetes + Docker | Auto-scaling, zero-downtime deployments, production-grade |
| **Coming Soon Strategy** | ALL menus visible day 1 with badges | Show vision, prevent re-training, enable early feedback |
| **Pricing Model** | 4-tier subscription (Rp 1.5M - 5M - custom) | Covers small agencies to enterprise, room for upsell |

### MVP Validation Gates (3-Month Success Criteria)

- ✅ 50 travel agencies onboarded and paying
- ✅ 80% agent adoption (login 3x/week, use 3+ features)
- ✅ 70% time reduction validated via agent surveys
- ✅ NPS > 50 (strong customer satisfaction)
- ✅ Rp 125 juta MRR achieved
- ✅ 99.9% uptime, OCR 98% accuracy maintained
- ✅ Agents report confidence in "calm scaling" (can add agents without operational fear)

### Recommended Next Steps

**Immediate Next Actions (Week 1):**

1. **Create System Architecture Document** - Use `/bmad:bmm:workflows:create-architecture` command
   - Technical architecture design (infrastructure, database schema, API design)
   - Security architecture (authentication, authorization, data encryption)
   - Integration architecture (WhatsApp, Payment Gateway, OCR, SISKOPATUH)
   - Deployment architecture (Kubernetes, CI/CD pipeline)

2. **Create UX Design Document** (Optional but Recommended) - Use `/bmad:bmm:workflows:create-ux-design` command
   - Wireframes for key workflows (My Jamaah dashboard, document upload, package management)
   - User flow diagrams for critical paths (agent onboarding, document approval, payment tracking)
   - Design system (colors, typography, components) aligned with Travel Umroh brand

3. **Break Down into Epics & Stories** - Use `/bmad:bmm:workflows:create-epics-and-stories` command
   - Convert 7 MVP features into detailed user stories
   - Estimate story points and sprint capacity
   - Prioritize stories for Month 1-3 sprints
   - Create acceptance criteria per story

**Implementation Phase (Month 1-3):**

4. **Sprint Planning** - Use `/bmad:bmm:workflows:sprint-planning` command after epics created
   - 2-week sprint cadence recommended
   - Sprint 1-2: Foundation (multi-tenant infra, RBAC, database schema)
   - Sprint 3-4: Core Features Part 1 (My Jamaah dashboard, OCR, package management)
   - Sprint 5-6: Core Features Part 2 + Integrations (Chatbot, WhatsApp, Payment, SISKOPATUH, Landing Page Builder)

5. **Development Execution** - Use `/bmad:bmm:workflows:dev-story` command per story
   - Follow TDD approach (write tests first, then implementation)
   - Code review mandatory before merge
   - Deploy to staging after each sprint
   - User acceptance testing with pilot agencies

6. **Quality Assurance** - Use `/bmad:bmm:workflows:testarch-*` commands
   - Automated test framework setup
   - Integration testing for third-party APIs
   - Load testing from Month 2 (3,000 jamaah/month capacity)
   - Security penetration testing before production launch

**Go-Live Preparation (Month 3 Final Weeks):**

7. **Implementation Readiness Check** - Use `/bmad:bmm:workflows:check-implementation-readiness`
   - Validate all 7 MVP features complete and tested
   - Confirm training materials ready
   - Security audit passed
   - Performance benchmarks met (99.9% uptime, <2sec page load, OCR 98%)

8. **Pilot Launch** - 10 agencies in controlled rollout
   - Monitor validation gates closely
   - Intensive support for first week
   - Rapid iteration based on feedback

9. **Scale to 50 Agencies** (Month 4)
   - Onboard remaining 40 agencies
   - Measure success criteria (adoption, time savings, NPS, MRR)
   - Make GO/NO-GO decision for Phase 2 investment

### Risk-Adjusted Timeline

**Best Case Scenario (95% confidence):** MVP launch end of Month 3 with 40 agencies (adjust target from 50)
**Realistic Scenario (80% confidence):** MVP launch end of Month 3.5 with 30 agencies (extend 2 weeks, reduce scope if needed)
**Worst Case Scenario (50% confidence):** MVP launch end of Month 4 with 20 agencies (cut Landing Page Builder and Chatbot to Phase 2)

**Recommendation:** Plan for realistic scenario, have contingency to cut scope if behind schedule rather than delay launch.

### Document Change Control

**Version History:**
- v1.0 (2025-12-21): Initial PRD for MVP - Yopi (Author)

**Future Updates:**
- Post-MVP feedback → v1.1 (update success metrics, refine scope for Phase 2)
- Architecture decisions → v1.2 (reference architecture document when completed)
- Epic breakdown → v1.3 (reference epics & stories document when completed)

**Change Approval:**
- Scope changes requiring >2 week delay: Yopi approval required
- Feature additions to MVP: Yopi approval + impact analysis (timeline, budget, risk)
- Non-functional requirement changes: Architecture review + Yopi approval

---

## Appendix

### Glossary

- **Jamaah:** Pilgrim performing umroh or haji
- **Agent/Mitra:** Independent agent working under travel agency, manages pilgrims
- **Affiliate:** Sub-agent working under main agent (multi-level structure)
- **Agency Owner:** Travel agency business owner (tenant admin)
- **SISKOPATUH:** Kemenag (Ministry of Religious Affairs) regulatory system
- **DSN-MUI:** National Sharia Council - Indonesian Ulema Council (religious authority)
- **Wakalah bil Ujrah:** Sharia-compliant contract structure (agency with fee)
- **Virtual Account:** Bank account number unique per customer for payment tracking
- **OCR:** Optical Character Recognition (auto-extract text from images)
- **NLP:** Natural Language Processing (AI understanding human language)

### References

- Product Brief: `_bmad-output/analysis/product-brief-Travel Umroh-2025-12-21.md`
- Erahajj Research: `erahajj.md` (competitor analysis)
- Comparison Analysis: `comparison-vs-erahajj.md` (feature comparison)
- Enhancement Plan: `enhancement-plan-erahajj.md` (7 critical features)
- BMM Workflow Status: `_bmad-output/bmm-workflow-status.yaml`

### Contact & Collaboration

- **Product Owner:** Yopi
- **Project:** Travel Umroh (Umroh/Haji SaaS for Indonesian Travel Agencies)
- **Timeline:** 3-month MVP → 12-month scale → 3-year market leadership
- **Target Market:** 1,036 Indonesian travel agencies, 31,000+ agents, 1M+ jamaah/year

---

**END OF PRD - READY FOR IMPLEMENTATION** 🚀

---

### 16. Customizable Production Pipeline Management

**FR-16.1:** Super Admin SHALL create and manage global pipeline stage library with 15-20 default stages
**FR-16.2:** Super Admin SHALL configure custom pipeline workflows per tenant/agency with drag-and-drop builder
**FR-16.3:** System SHALL support pipeline stages across categories: Document, Government, Travel, Logistics, Custom
**FR-16.4:** System SHALL support stage configuration: enable/disable, custom SLA, role assignment, dependencies, conditional rules
**FR-16.5:** System SHALL initialize pipeline tracking when jamaah created, locked to tenant's pipeline version
**FR-16.6:** System SHALL track jamaah progression through configured pipeline with real-time status updates
**FR-16.7:** System SHALL detect pipeline bottlenecks automatically and alert managers
**FR-16.8:** Manager SHALL view pipeline overview dashboard with stage metrics, bottlenecks, team performance, upcoming departures
**FR-16.9:** Admin staff SHALL access role-based task queue dashboards (Document, SISKOPATUH, Visa, Logistics, Travel admins)
**FR-16.10:** Admin task queues SHALL display Kanban format: Urgent | Today | Upcoming | Blocked
**FR-16.11:** System SHALL send automated reminders to admins, agents, and jamaah based on SLA deadlines
**FR-16.12:** System SHALL support multi-channel reminders: email, WhatsApp, in-app notifications
**FR-16.13:** System SHALL maintain pipeline version control with full history and rollback capability
**FR-16.14:** System SHALL provide pipeline templates for quick agency onboarding
**FR-16.15:** Admin SHALL view detailed jamaah pipeline status with timeline, stage history, travel details, activity log

