---
stepsCompleted: [1, 2, 3]
totalEpics: 11
totalStories: 62
inputDocuments:
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/prd.md'
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md'
  - '/home/yopi/Projects/Travel Umroh/_bmad-output/ux-design-specification.md'
---

# Travel Umroh - Frontend Epic Breakdown

## Overview

This document provides the complete frontend epic and story breakdown for Travel Umroh, focusing on UI/UX implementation based on the UX Design Specification. This complements the backend epics documented in `epics.md`.

**Note:** Backend API implementation is covered in the existing `epics.md` file (15 epics, 89 stories). This document focuses exclusively on frontend user interface and user experience implementation.

## Requirements Inventory

### Functional Requirements (Frontend-Specific)

**UI Framework & Design System**
- FR-UI-1: Frontend SHALL use Next.js with TypeScript as the framework
- FR-UI-2: Frontend SHALL use shadcn/ui components (copy-paste architecture, not npm dependency)
- FR-UI-3: Frontend SHALL use Tailwind CSS for utility-first styling
- FR-UI-4: Frontend SHALL use Radix UI for accessible UI primitives
- FR-UI-5: Frontend SHALL use Lucide React for iconography
- FR-UI-6: Frontend SHALL use TanStack Table v8 for advanced table features

**Responsive Design Requirements**
- FR-UI-7: Frontend SHALL implement mobile-first responsive design (60% mobile usage)
- FR-UI-8: Frontend SHALL support breakpoints: 320px, 480px, 768px, 1024px, 1440px+
- FR-UI-9: Frontend SHALL switch table to card view on mobile (<768px)
- FR-UI-10: Frontend SHALL use bottom tab navigation on mobile (<768px)
- FR-UI-11: Frontend SHALL use top navigation bar on desktop (1024px+)
- FR-UI-12: Frontend SHALL implement touch targets minimum 44�44px (48�48px preferred for primary actions)

**Hybrid Dashboard - "My Jamaah" (Agent View)**
- FR-UI-13: Frontend SHALL display KPI cards at top showing aggregate status (urgent/soon/ready counts)
- FR-UI-14: KPI cards SHALL stack vertically on mobile, 2-column on tablet, 3-column on desktop
- FR-UI-15: KPI cards SHALL be clickable to filter table below (click-to-filter interaction)
- FR-UI-16: Frontend SHALL display jamaah table below KPI cards with status column (red/yellow/green badges)
- FR-UI-17: Table SHALL support sorting by column (click header to sort)
- FR-UI-18: Table SHALL support filtering by status (Semua, Urgent, Soon, Ready)
- FR-UI-19: Table SHALL display checkbox column for bulk selection
- FR-UI-20: Frontend SHALL show FloatingActionBar when e1 jamaah selected

**Status Indication System**
- FR-UI-21: Frontend SHALL use consistent red (#EF4444) for urgent status (documents missing, overdue)
- FR-UI-22: Frontend SHALL use consistent amber (#D97706) for soon status (due in 3-7 days)
- FR-UI-23: Frontend SHALL use consistent green (#10B981) for ready status (all requirements met)
- FR-UI-24: Status badges SHALL include icon + text + color (never color alone for accessibility)
- FR-UI-25: Urgent status SHALL use AlertCircle icon, Soon SHALL use Clock icon, Ready SHALL use CheckCircle icon

**Bulk Operations UI**
- FR-UI-26: Frontend SHALL display FloatingActionBar at bottom when jamaah selected
- FR-UI-27: FloatingActionBar SHALL show selection count ("5 jamaah dipilih")
- FR-UI-28: FloatingActionBar SHALL provide "Send Reminder" action
- FR-UI-29: FloatingActionBar SHALL provide "Mark Complete" action
- FR-UI-30: FloatingActionBar SHALL provide "Clear Selection" action
- FR-UI-31: FloatingActionBar SHALL be full-width on mobile, auto-width floating on desktop

**WhatsApp Integration UI**
- FR-UI-32: Frontend SHALL display WhatsApp button with green branding (#25D366)
- FR-UI-33: WhatsApp button click SHALL open TemplatePicker modal for bulk operations
- FR-UI-34: TemplatePicker SHALL display template categories (Dokumen, Cicilan, Update Lapangan)
- FR-UI-35: TemplatePicker SHALL show preview pane with merge field substitution
- FR-UI-36: TemplatePicker SHALL display character counter (WhatsApp 4096 limit)
- FR-UI-37: TemplatePicker SHALL warn if message >4096 chars ("akan dipecah jadi 2 bagian")
- FR-UI-38: After template selection, SHALL show progress indicator for bulk send

**Document Upload & OCR UI**
- FR-UI-39: Frontend SHALL display DocumentUploadZone with drag-drop support
- FR-UI-40: Upload zone SHALL show dashed border (default), blue border on drag-over
- FR-UI-41: Upload zone SHALL support click-to-upload and drag-and-drop
- FR-UI-42: During upload, SHALL show progress bar with percentage
- FR-UI-43: During OCR processing, SHALL show spinner + "Membaca data dari KTP..." (3-5 sec estimate)
- FR-UI-44: OCR success SHALL highlight auto-filled fields with green border for 2 seconds
- FR-UI-45: OCR low confidence (<80%) SHALL show amber border + tooltip warning
- FR-UI-46: OCR error SHALL show red border + recovery guidance ("Foto blur? Upload foto lebih jelas")

**Form Patterns**
- FR-UI-47: Forms SHALL use single-column layout on mobile, 2-column on desktop (1024px+)
- FR-UI-48: Input fields SHALL be minimum 44px height (touch-friendly)
- FR-UI-49: Required fields SHALL show red asterisk + "(required)" text
- FR-UI-50: Real-time validation SHALL show for format checks (phone number, NIK)
- FR-UI-51: On-blur validation SHALL show for required fields and complex validation
- FR-UI-52: Error state SHALL show red border + AlertCircle icon + error message below field
- FR-UI-53: Success state (after validation) SHALL show green border + CheckCircle icon

**Loading States**
- FR-UI-54: Frontend SHALL use skeleton loading for initial page load (shows layout structure)
- FR-UI-55: Skeleton loading SHALL show shimmer animation (left-to-right gradient)
- FR-UI-56: Button actions SHALL show spinner + "Loading..." text during processing
- FR-UI-57: OCR processing SHALL show indeterminate progress bar + estimated time
- FR-UI-58: Bulk operations SHALL show determinate progress (e.g., "3/5 jamaah")

**Empty States**
- FR-UI-59: Empty jamaah list SHALL show icon + "Belum ada jamaah" + "Tambah Jamaah Baru" button
- FR-UI-60: No search results SHALL show "Tidak ada hasil untuk '{query}'" + [Hapus Filter] button
- FR-UI-61: No documents SHALL show "Belum ada dokumen" + "Upload Dokumen" button
- FR-UI-62: Empty states SHALL use encouraging tone (not "No data" or "Empty")

**Modal & Overlay Patterns**
- FR-UI-63: Desktop SHALL use centered modal (max-width 600px) with backdrop blur
- FR-UI-64: Mobile SHALL use bottom sheet instead of centered modal (better thumb reach)
- FR-UI-65: Bottom sheet SHALL have drag handle (4px � 32px) at top
- FR-UI-66: Modals SHALL trap focus (Tab cycles within modal only)
- FR-UI-67: Modals SHALL close on Escape key or backdrop click
- FR-UI-68: After modal close, focus SHALL return to trigger element

**Feedback Patterns**
- FR-UI-69: Success feedback SHALL use toast notification (green checkmark, 4-second auto-dismiss)
- FR-UI-70: Error feedback SHALL use toast (red X, 8-second auto-dismiss) + inline error if applicable
- FR-UI-71: Toast position SHALL be bottom-right on desktop, top-center on mobile
- FR-UI-72: Warning feedback SHALL use alert banner above content (amber background)
- FR-UI-73: Toast content SHALL be concise Indonesian language (<60 chars for mobile readability)

**Navigation Patterns**
- FR-UI-74: Mobile navigation SHALL use bottom tab bar (Dashboard, Jamaah, Dokumen, Laporan, Profile)
- FR-UI-75: Desktop navigation SHALL use top bar only (bottom tabs hidden)
- FR-UI-76: Active tab SHALL show blue accent (icon + text) + 3px blue bar indicator
- FR-UI-77: Desktop SHALL show breadcrumbs below top nav (Dashboard > Jamaah > Detail)
- FR-UI-78: Mobile breadcrumbs SHALL be hidden, replaced with back button

**Agency Owner Dashboard**
- FR-UI-79: Dashboard SHALL display personalized greeting ("Selamat Pagi, Pak Hadi!")
- FR-UI-80: Dashboard SHALL show KPI cards: Total Revenue, 3-Month Projection, Pipeline Potential
- FR-UI-81: Dashboard SHALL show Agent Performance analytics (top performers leaderboard)
- FR-UI-82: Dashboard SHALL show Jamaah Pipeline by status breakdown
- FR-UI-83: Dashboard SHALL refresh in real-time via WebSocket for payment/inventory updates
- FR-UI-84: KPI numbers SHALL use 48px Poppins Bold for visual impact

**Landing Page Builder (Agent Feature)**
- FR-UI-85: Landing page builder SHALL show package selection dropdown
- FR-UI-86: Builder SHALL provide agent branding fields (name, photo, contact)
- FR-UI-87: Builder SHALL show live preview as agent customizes
- FR-UI-88: Generated landing page SHALL have prominent WhatsApp CTA button
- FR-UI-89: Landing page SHALL be shareable to Facebook, Instagram, WhatsApp Status (one-click)
- FR-UI-90: Builder SHALL track analytics (views, clicks, conversions) and display to agent

**Adaptive Density Modes**
- FR-UI-91: Frontend SHALL support 3 density modes: Simplified, Standard, Power
- FR-UI-92: Simplified mode (Bu Ratna) SHALL hide table, show only KPI cards + 3 large action buttons
- FR-UI-93: Standard mode (default) SHALL show full hybrid dashboard (KPI + filtered table)
- FR-UI-94: Power mode (Mbak Rina) SHALL minimize KPI cards (single row), maximize table density
- FR-UI-95: User SHALL be able to switch density mode via Settings > Display Preference

---

### Non-Functional Requirements (Frontend-Specific)

**Performance Requirements**
- NFR-UI-1: Initial page load SHALL be <2 seconds on 3G network (Indonesia common)
- NFR-UI-2: First Contentful Paint (FCP) SHALL be <1.5s on 3G
- NFR-UI-3: Largest Contentful Paint (LCP) SHALL be <2.5s on 3G
- NFR-UI-4: Time to Interactive (TTI) SHALL be <3.5s on 3G
- NFR-UI-5: Frontend bundle size SHALL be <250KB gzipped (mobile 3G target)
- NFR-UI-6: Images SHALL be lazy-loaded (load as user scrolls)
- NFR-UI-7: Skeleton loading SHALL appear within 100ms of page load

**Accessibility Requirements (WCAG AAA)**
- NFR-UI-8: Color contrast SHALL achieve 7:1 for normal text (14-18px)
- NFR-UI-9: Color contrast SHALL achieve 4.5:1 for large text (18px+)
- NFR-UI-10: All interactive elements SHALL be keyboard accessible (Tab navigation)
- NFR-UI-11: Focus indicators SHALL be visible (2px blue ring, 4px offset)
- NFR-UI-12: All icon-only buttons SHALL have aria-label
- NFR-UI-13: Complex widgets (table, modal) SHALL use proper ARIA roles
- NFR-UI-14: Dynamic content SHALL use aria-live regions for screen reader announcements
- NFR-UI-15: Layout SHALL not break at 200% browser zoom

**Usability Requirements**
- NFR-UI-16: Frontend SHALL support Indonesian language (Bahasa Indonesia) throughout
- NFR-UI-17: Error messages SHALL be clear, actionable, in Indonesian
- NFR-UI-18: Touch targets SHALL be minimum 44�44px on all devices
- NFR-UI-19: Spacing between touch targets SHALL be minimum 8px
- NFR-UI-20: Forms SHALL provide contextual help tooltips for complex fields
- NFR-UI-21: Agent training completion rate SHALL be >95% within 7 days (usability validation)

**Browser Compatibility**
- NFR-UI-22: Frontend SHALL support Chrome 90+ (primary browser in Indonesia)
- NFR-UI-23: Frontend SHALL support Firefox 88+
- NFR-UI-24: Frontend SHALL support Safari 14+ (iOS support)
- NFR-UI-25: Frontend SHALL support Edge 90+
- NFR-UI-26: Frontend SHALL degrade gracefully on unsupported browsers

**Responsive Requirements**
- NFR-UI-27: Frontend SHALL be fully responsive from 320px to 3840px viewport width
- NFR-UI-28: On mobile (<768px), table SHALL automatically switch to card view
- NFR-UI-29: On mobile, modals SHALL use bottom sheet (not centered dialog)
- NFR-UI-30: Touch interactions SHALL be optimized for swipe, tap, long-press gestures

**Visual Consistency**
- NFR-UI-31: Status colors SHALL be consistent across all components (red/yellow/green)
- NFR-UI-32: Typography SHALL use Inter (body/UI) and Poppins (headings/KPI)
- NFR-UI-33: Spacing SHALL follow 4px base unit (8px, 12px, 16px, 24px, 32px, 48px, 64px)
- NFR-UI-34: Button hierarchy SHALL be consistent: Primary (solid), Secondary (outline), Tertiary (ghost)

---

### Additional Requirements

**Technology Stack (Frontend)**
- **Framework:** Next.js 14+ with App Router, TypeScript, Server Components
- **UI Library:** shadcn/ui (copy-paste components, not npm package)
- **Styling:** Tailwind CSS with custom configuration for design tokens
- **Component Primitives:** Radix UI for accessible widgets
- **Icons:** Lucide React
- **Tables:** TanStack Table v8 for sorting, filtering, pagination
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand for global state (selected jamaah, filters)
- **Data Fetching:** TanStack Query for server state management
- **Real-Time:** WebSocket client for live updates (dashboard, payments)
- **Toast Notifications:** Sonner (recommended by shadcn/ui)

**Design System Implementation**
- **Color Palette:**
  - Primary Blue: #2563EB (links, primary actions)
  - Secondary Gold: #F59E0B (achievement, premium)
  - Status Urgent: #EF4444 (red)
  - Status Soon: #D97706 (amber)
  - Status Ready: #10B981 (green)
  - WhatsApp: #25D366 (brand recognition)
  - Neutrals: Slate 50-900 for text, borders, backgrounds

- **Typography System:**
  - Primary Font: Inter (body, UI, tables) - high readability
  - Display Font: Poppins (headings, KPI numbers) - bold, clear
  - Base Size: 16px (mobile), scales with viewport
  - Scale: 12px (caption), 14px (body), 16px (body), 18px (large), 24px (h3), 48px (KPI)

- **Spacing System:**
  - Base Unit: 4px
  - Scale: 4, 8, 12, 16, 24, 32, 48, 64px
  - Mobile: Generous spacing (24-32px between sections)
  - Desktop: Compact spacing (16-24px)

**Component Library Structure**
```
/components
  /ui (shadcn/ui foundation)
    - button.tsx
    - badge.tsx
    - card.tsx
    - table.tsx
    - dialog.tsx
    - sheet.tsx
    - input.tsx
    - select.tsx
    - toast.tsx

  /domain (Travel Umroh custom)
    /dashboard
      - kpi-card.tsx
      - status-badge.tsx
      - jamaah-table.tsx
      - bulk-selection-toolbar.tsx

    /whatsapp
      - whatsapp-button.tsx
      - template-picker.tsx
      - floating-action-bar.tsx

    /documents
      - document-upload-zone.tsx
      - timeline-view.tsx

    /jamaah
      - jamaah-card.tsx (mobile card view)
      - jamaah-detail-panel.tsx

    /navigation
      - bottom-tab-bar.tsx (mobile)
      - top-nav-bar.tsx (desktop)
```

**Critical User Flows (Frontend Implementation)**

**1. Agent Morning Routine (15-minute target):**
- Login � Dashboard loads with skeleton � KPI cards appear � Table shows filtered urgent/soon
- Scan status (3 seconds): "5 red, 3 yellow, 17 green"
- Filter urgent: Click red KPI card � Table filters to 5 urgent jamaah
- Bulk select: Check all 5 � FloatingActionBar appears
- Send reminder: Click "Send Reminder" � TemplatePicker opens � Select template � Preview � Send
- Success: Toast "Pesan terkirim ke 5 jamaah via WhatsApp" � Selection cleared � Bar hides

**2. Document Upload with OCR (Bu Ratna flow):**
- Navigate to Jamaah detail
- Click "Upload Dokumen" � DocumentUploadZone appears
- Drag KTP image � Zone highlights blue � Drop
- Upload progress bar: 0% � 100% (2 seconds)
- OCR processing: Spinner + "Membaca data dari KTP... ~3-5 detik"
- OCR success: Fields auto-fill with green highlight � Toast "KTP berhasil diproses"
- Review: Agent verifies auto-filled data, corrects if needed
- Save: Click "Simpan" � Success toast � Fields return to default state

**3. Landing Page Creation (Ibu Siti marketing):**
- Navigate to Landing Page Builder
- Select package from dropdown
- Upload agent photo, enter name and contact
- Customize colors (within brand templates)
- Live preview updates as she types
- Click "Generate Landing Page"
- Copy URL or share to WhatsApp Status / Facebook / Instagram (one-click)
- Track analytics: Views, clicks, conversions

**Critical Success Metrics (Frontend)**
- Mobile-first: 60% of traffic from mobile, smooth experience <768px
- Accessibility: WCAG AAA compliance validated, Bu Ratna can complete tasks
- Performance: LCP <2.5s on 3G, Lighthouse score >95 (Accessibility)
- Agent adoption: 95% login 3x/week, use 3+ features
- Bu Ratna onboarding: 95% complete first action within 30 minutes
- Time savings: Morning routine <15 minutes (vs 2 hours baseline)

---

### FR Coverage Map

This map shows which epic implements each frontend functional requirement:

**Epic 1: Design System Foundation & Component Library**
- FR-UI-1: Next.js with TypeScript framework
- FR-UI-2: shadcn/ui components (copy-paste architecture)
- FR-UI-3: Tailwind CSS for utility-first styling
- FR-UI-4: Radix UI for accessible UI primitives
- FR-UI-5: Lucide React for iconography
- FR-UI-6: TanStack Table v8 for advanced table features
- NFR-UI-31: Status colors consistent across components
- NFR-UI-32: Typography (Inter body, Poppins headings)
- NFR-UI-33: Spacing follows 4px base unit
- NFR-UI-34: Button hierarchy (Primary, Secondary, Tertiary)

**Epic 2: Agent Dashboard - "My Jamaah" View**
- FR-UI-13: KPI cards showing aggregate status counts
- FR-UI-14: KPI cards responsive layout (vertical/2-col/3-col)
- FR-UI-15: KPI cards clickable to filter table
- FR-UI-16: Jamaah table with status badges
- FR-UI-17: Table sorting by column
- FR-UI-18: Table filtering by status
- FR-UI-19: Table checkbox column for bulk selection
- FR-UI-20: FloatingActionBar when ≥1 jamaah selected
- FR-UI-21: Red color for urgent status (#EF4444)
- FR-UI-22: Amber color for soon status (#D97706)
- FR-UI-23: Green color for ready status (#10B981)
- FR-UI-24: Status badges with icon + text + color
- FR-UI-25: Status icons (AlertCircle, Clock, CheckCircle)
- FR-UI-59: Empty jamaah list state

**Epic 3: Bulk Operations & WhatsApp Integration**
- FR-UI-26: FloatingActionBar at bottom when selected
- FR-UI-27: Selection count display
- FR-UI-28: "Send Reminder" action
- FR-UI-29: "Mark Complete" action
- FR-UI-30: "Clear Selection" action
- FR-UI-31: FloatingActionBar responsive (full-width mobile, floating desktop)
- FR-UI-32: WhatsApp button with green branding (#25D366)
- FR-UI-33: WhatsApp button opens TemplatePicker
- FR-UI-34: TemplatePicker categories (Dokumen, Cicilan, Update)
- FR-UI-35: TemplatePicker preview with merge fields
- FR-UI-36: Character counter (4096 limit)
- FR-UI-37: Warning for messages >4096 chars
- FR-UI-38: Progress indicator for bulk send
- FR-UI-69: Success toast notification
- FR-UI-70: Error toast notification
- FR-UI-71: Toast positioning (responsive)
- FR-UI-72: Warning alert banner
- FR-UI-73: Concise Indonesian toast content

**Epic 4: Document Upload & OCR Experience**
- FR-UI-39: DocumentUploadZone with drag-drop
- FR-UI-40: Upload zone border states
- FR-UI-41: Click-to-upload and drag-and-drop
- FR-UI-42: Upload progress bar with percentage
- FR-UI-43: OCR processing spinner + message
- FR-UI-44: OCR success green highlight (2 seconds)
- FR-UI-45: OCR low confidence amber border + tooltip
- FR-UI-46: OCR error red border + recovery guidance
- FR-UI-54: Skeleton loading for initial page load
- FR-UI-55: Skeleton shimmer animation
- FR-UI-56: Button loading spinner
- FR-UI-57: OCR indeterminate progress + time estimate
- FR-UI-58: Bulk operations determinate progress

**Epic 5: Responsive Navigation & Layout**
- FR-UI-7: Mobile-first responsive design (60% mobile)
- FR-UI-8: Breakpoints (320px, 480px, 768px, 1024px, 1440px+)
- FR-UI-9: Table to card view on mobile (<768px)
- FR-UI-10: Bottom tab navigation on mobile (<768px)
- FR-UI-11: Top navigation bar on desktop (≥1024px)
- FR-UI-12: Touch targets 44×44px minimum (48×48px preferred)
- FR-UI-74: Bottom tab bar (Dashboard, Jamaah, Dokumen, Laporan, Profile)
- FR-UI-75: Desktop top bar only (bottom tabs hidden)
- FR-UI-76: Active tab blue accent + 3px bar
- FR-UI-77: Desktop breadcrumbs
- FR-UI-78: Mobile back button (no breadcrumbs)
- NFR-UI-27: Responsive 320px to 3840px viewport
- NFR-UI-28: Auto table to card view on mobile
- NFR-UI-29: Mobile bottom sheet modals
- NFR-UI-30: Touch interactions (swipe, tap, long-press)

**Epic 6: Form Patterns & Validation**
- FR-UI-47: Single-column (mobile), 2-column (desktop ≥1024px)
- FR-UI-48: Input fields 44px minimum height
- FR-UI-49: Required field indicators (red asterisk + text)
- FR-UI-50: Real-time validation (format checks)
- FR-UI-51: On-blur validation (required, complex)
- FR-UI-52: Error state (red border + AlertCircle + message)
- FR-UI-53: Success state (green border + CheckCircle)
- NFR-UI-8: Color contrast 7:1 for normal text (WCAG AAA)
- NFR-UI-9: Color contrast 4.5:1 for large text
- NFR-UI-10: Keyboard accessible (Tab navigation)
- NFR-UI-11: Focus indicators (2px blue ring, 4px offset)
- NFR-UI-12: Icon-only buttons with aria-label
- NFR-UI-13: ARIA roles for complex widgets
- NFR-UI-14: aria-live regions for dynamic content
- NFR-UI-15: Layout stable at 200% zoom
- NFR-UI-16: Indonesian language (Bahasa Indonesia)
- NFR-UI-17: Clear, actionable Indonesian error messages
- NFR-UI-18: Touch targets 44×44px minimum
- NFR-UI-19: Touch target spacing 8px minimum
- NFR-UI-20: Contextual help tooltips
- NFR-UI-21: >95% agent training completion within 7 days

**Epic 7: Feedback, Loading, & Empty States**
- FR-UI-54: Skeleton loading for initial page load
- FR-UI-55: Skeleton shimmer animation
- FR-UI-56: Button loading spinner + text
- FR-UI-57: OCR indeterminate progress + time
- FR-UI-58: Bulk determinate progress
- FR-UI-59: Empty jamaah list state
- FR-UI-60: No search results state
- FR-UI-61: No documents state
- FR-UI-62: Encouraging empty state tone
- FR-UI-69: Success toast (green checkmark, 4-second auto-dismiss)
- FR-UI-70: Error toast (red X, 8-second auto-dismiss)
- FR-UI-71: Toast positioning (responsive)
- FR-UI-72: Warning alert banner
- FR-UI-73: Concise Indonesian toast content

**Epic 8: Modal & Overlay System**
- FR-UI-63: Desktop centered modal (max-width 600px, backdrop blur)
- FR-UI-64: Mobile bottom sheet (better thumb reach)
- FR-UI-65: Bottom sheet drag handle (4px × 32px)
- FR-UI-66: Modal focus trap (Tab cycles within)
- FR-UI-67: Modal close on Escape/backdrop click
- FR-UI-68: Focus returns to trigger after close

**Epic 9: Agency Owner Dashboard & Analytics**
- FR-UI-79: Personalized greeting (time-based)
- FR-UI-80: KPI cards (Revenue, Projection, Pipeline)
- FR-UI-81: Agent Performance leaderboard
- FR-UI-82: Jamaah Pipeline breakdown
- FR-UI-83: Real-time WebSocket updates
- FR-UI-84: KPI numbers 48px Poppins Bold

**Epic 10: Landing Page Builder for Agents**
- FR-UI-85: Package selection dropdown
- FR-UI-86: Agent branding fields (name, photo, contact)
- FR-UI-87: Live preview during customization
- FR-UI-88: Prominent WhatsApp CTA button
- FR-UI-89: Social sharing (WhatsApp Status, Facebook, Instagram)
- FR-UI-90: Analytics tracking (views, clicks, conversions)

**Epic 11: Adaptive Density Modes**
- FR-UI-91: 3 density modes (Simplified, Standard, Power)
- FR-UI-92: Simplified mode (KPI + 3 large buttons)
- FR-UI-93: Standard mode (full hybrid dashboard)
- FR-UI-94: Power mode (minimized KPI, maximized table)
- FR-UI-95: Mode switcher in Settings > Display Preference

**Non-Functional Requirements Coverage:**
- **Performance (NFR-UI-1 to NFR-UI-7):** Epic 1 (foundation), Epic 7 (loading states)
- **Accessibility (NFR-UI-8 to NFR-UI-15):** Epic 1 (Radix UI), Epic 6 (forms), all epics
- **Usability (NFR-UI-16 to NFR-UI-21):** Epic 6 (forms), Epic 11 (adaptive density)
- **Browser Compatibility (NFR-UI-22 to NFR-UI-26):** Epic 1 (Next.js setup)
- **Responsive (NFR-UI-27 to NFR-UI-30):** Epic 5 (navigation), all epics
- **Visual Consistency (NFR-UI-31 to NFR-UI-34):** Epic 1 (design system)

## Epic List

### Epic 1: Design System Foundation & Component Library

**User Outcome:** Complete accessible design system (WCAG AAA) enabling consistent, performant UI implementation across all features.

**Functional Requirements:**
- FR-UI-1: Next.js with TypeScript framework
- FR-UI-2: shadcn/ui components (copy-paste architecture)
- FR-UI-3: Tailwind CSS for utility-first styling
- FR-UI-4: Radix UI for accessible UI primitives
- FR-UI-5: Lucide React for iconography
- FR-UI-6: TanStack Table v8 for advanced table features
- NFR-UI-31: Status colors consistent across components
- NFR-UI-32: Typography (Inter body, Poppins headings)
- NFR-UI-33: Spacing follows 4px base unit
- NFR-UI-34: Button hierarchy (Primary, Secondary, Tertiary)

**Technology Stack:**
- Framework: Next.js 14+ with App Router, TypeScript, Server Components
- UI Library: shadcn/ui (copy-paste components, not npm)
- Styling: Tailwind CSS with custom design tokens
- Accessibility: Radix UI primitives
- Icons: Lucide React
- Tables: TanStack Table v8

**Dependencies:** None (foundational epic)

**Enables:** All other epics depend on this foundation

---

### Epic 2: Agent Dashboard - "My Jamaah" View

**User Outcome:** Agents see all jamaah with 3-second status clarity (red/yellow/green), filter by urgency, and quickly understand daily priorities.

**Functional Requirements:**
- FR-UI-13: KPI cards showing aggregate status counts
- FR-UI-14: KPI cards responsive layout (vertical/2-col/3-col)
- FR-UI-15: KPI cards clickable to filter table
- FR-UI-16: Jamaah table with status badges
- FR-UI-17: Table sorting by column
- FR-UI-18: Table filtering by status
- FR-UI-19: Table checkbox column for bulk selection
- FR-UI-20: FloatingActionBar when ≥1 jamaah selected
- FR-UI-21: Red color for urgent status (#EF4444)
- FR-UI-22: Amber color for soon status (#D97706)
- FR-UI-23: Green color for ready status (#10B981)
- FR-UI-24: Status badges with icon + text + color
- FR-UI-25: Status icons (AlertCircle, Clock, CheckCircle)
- FR-UI-59: Empty jamaah list state

**Key Features:**
- KPI cards: Vertical stack (mobile), 2-column (tablet), 3-column (desktop)
- Click-to-filter: Click "5 Urgent" card → table filters to urgent only
- Status clarity: Red/yellow/green badges with icons (WCAG AAA compliant)
- Responsive table: Auto-switches to card view on mobile (<768px)
- Empty states: "Belum ada jamaah" + "Tambah Jamaah Baru" button

**Dependencies:** Epic 1 (design system foundation)

**Enables:** Epic 3 (bulk operations), Epic 9 (owner dashboard), Epic 11 (density modes)

---

### Epic 3: Bulk Operations & WhatsApp Integration

**User Outcome:** 80% time savings through batch operations—select 5 jamaah, send reminders in one click instead of 5 separate WhatsApp messages.

**Functional Requirements:**
- FR-UI-26: FloatingActionBar at bottom when selected
- FR-UI-27: Selection count display ("5 jamaah dipilih")
- FR-UI-28: "Send Reminder" action
- FR-UI-29: "Mark Complete" action
- FR-UI-30: "Clear Selection" action
- FR-UI-31: FloatingActionBar responsive (full-width mobile, floating desktop)
- FR-UI-32: WhatsApp button with green branding (#25D366)
- FR-UI-33: WhatsApp button opens TemplatePicker
- FR-UI-34: TemplatePicker categories (Dokumen, Cicilan, Update)
- FR-UI-35: TemplatePicker preview with merge fields
- FR-UI-36: Character counter (4096 limit)
- FR-UI-37: Warning for messages >4096 chars
- FR-UI-38: Progress indicator for bulk send
- FR-UI-69: Success toast notification
- FR-UI-70: Error toast notification
- FR-UI-71: Toast positioning (responsive)
- FR-UI-72: Warning alert banner
- FR-UI-73: Concise Indonesian toast content

**Key Features:**
- FloatingActionBar: Appears at bottom when ≥1 jamaah selected, shows count
- TemplatePicker modal: Categories, merge fields preview, character counter
- Progress indicator: "3/5 jamaah" during bulk send
- WhatsApp deep linking: Pre-filled messages for each jamaah
- Toast feedback: "Pesan terkirim ke 5 jamaah via WhatsApp"

**Dependencies:**
- Epic 2 (dashboard for selection context)
- Epic 7 (feedback/loading states)
- Epic 8 (modal system for TemplatePicker)

**Standalone Value:** Epic 2 is complete without this, but this dramatically enhances efficiency

---

### Epic 4: Document Upload & OCR Experience

**User Outcome:** 30 min → 5 min per jamaah registration (OCR auto-fills NIK, name, address from KTP photo).

**Functional Requirements:**
- FR-UI-39: DocumentUploadZone with drag-drop
- FR-UI-40: Upload zone border states (dashed default, blue drag-over)
- FR-UI-41: Click-to-upload and drag-and-drop
- FR-UI-42: Upload progress bar with percentage
- FR-UI-43: OCR processing spinner + "Membaca data dari KTP... ~3-5 detik"
- FR-UI-44: OCR success green highlight (2 seconds)
- FR-UI-45: OCR low confidence amber border + tooltip (<80% confidence)
- FR-UI-46: OCR error red border + recovery guidance ("Foto blur? Upload foto lebih jelas")
- FR-UI-54: Skeleton loading for initial page load
- FR-UI-55: Skeleton shimmer animation
- FR-UI-56: Button loading spinner
- FR-UI-57: OCR indeterminate progress + time estimate
- FR-UI-58: Bulk operations determinate progress

**Key Features:**
- DocumentUploadZone: Drag-drop or click-to-upload
- Progress states: Upload (0-100%) → OCR (spinner, 3-5s) → Success/Error
- Confidence indicators: Green (high), Amber (low <80%), Red (error)
- Error recovery: Contextual Indonesian guidance ("Foto blur? Upload foto lebih jelas")
- Auto-fill integration: Fields highlight green for 2 seconds after OCR

**Dependencies:**
- Epic 2 (jamaah context)
- Epic 6 (form fields to auto-fill)
- Epic 7 (loading/feedback states)

---

### Epic 5: Responsive Navigation & Layout

**User Outcome:** Optimized navigation for 60% mobile users—bottom tabs for thumb reach, top nav for desktop efficiency.

**Functional Requirements:**
- FR-UI-7: Mobile-first responsive design (60% mobile)
- FR-UI-8: Breakpoints (320px, 480px, 768px, 1024px, 1440px+)
- FR-UI-9: Table to card view on mobile (<768px)
- FR-UI-10: Bottom tab navigation on mobile (<768px)
- FR-UI-11: Top navigation bar on desktop (≥1024px)
- FR-UI-12: Touch targets 44×44px minimum (48×48px preferred)
- FR-UI-74: Bottom tab bar (Dashboard, Jamaah, Dokumen, Laporan, Profile)
- FR-UI-75: Desktop top bar only (bottom tabs hidden)
- FR-UI-76: Active tab blue accent + 3px bar
- FR-UI-77: Desktop breadcrumbs (Dashboard > Jamaah > Detail)
- FR-UI-78: Mobile back button (no breadcrumbs)
- NFR-UI-27: Responsive 320px to 3840px viewport
- NFR-UI-28: Auto table to card view on mobile
- NFR-UI-29: Mobile bottom sheet modals
- NFR-UI-30: Touch interactions (swipe, tap, long-press)

**Key Features:**
- Mobile (<768px): Bottom tab bar (Dashboard, Jamaah, Dokumen, Laporan, Profile)
- Desktop (≥1024px): Top nav bar + breadcrumbs
- Active indicator: Blue accent (#2563EB) + 3px bar
- Touch targets: 44-48px for mobile ergonomics
- Responsive breakpoints: 320px, 480px, 768px, 1024px, 1440px+

**Dependencies:** Epic 1 (design system)

**Standalone Value:** Navigation system wraps all content

---

### Epic 6: Form Patterns & Validation

**User Outcome:** Forms with real-time validation, WCAG AAA accessibility, and clear Indonesian error messages reduce data entry errors.

**Functional Requirements:**
- FR-UI-47: Single-column (mobile), 2-column (desktop ≥1024px)
- FR-UI-48: Input fields 44px minimum height
- FR-UI-49: Required field indicators (red asterisk + "(required)" text)
- FR-UI-50: Real-time validation (format checks: phone, NIK)
- FR-UI-51: On-blur validation (required, complex)
- FR-UI-52: Error state (red border + AlertCircle + message)
- FR-UI-53: Success state (green border + CheckCircle)
- NFR-UI-8: Color contrast 7:1 for normal text (WCAG AAA)
- NFR-UI-9: Color contrast 4.5:1 for large text
- NFR-UI-10: Keyboard accessible (Tab navigation)
- NFR-UI-11: Focus indicators (2px blue ring, 4px offset)
- NFR-UI-12: Icon-only buttons with aria-label
- NFR-UI-13: ARIA roles for complex widgets
- NFR-UI-14: aria-live regions for dynamic content
- NFR-UI-15: Layout stable at 200% zoom
- NFR-UI-16: Indonesian language (Bahasa Indonesia)
- NFR-UI-17: Clear, actionable Indonesian error messages
- NFR-UI-18: Touch targets 44×44px minimum
- NFR-UI-19: Touch target spacing 8px minimum
- NFR-UI-20: Contextual help tooltips
- NFR-UI-21: >95% agent training completion within 7 days

**Key Features:**
- React Hook Form + Zod validation
- Responsive layouts: Single-column (mobile), 2-column (desktop ≥1024px)
- Validation timing: Real-time (format), On-blur (required), Submit (all)
- Error states: Red border + AlertCircle icon + Indonesian message
- Success states: Green border + CheckCircle (2 seconds highlight)
- WCAG AAA: 7:1 contrast, keyboard navigation, focus indicators

**Dependencies:** Epic 1 (design system)

**Integrates With:** Epic 4 (OCR auto-fill)

**Enables:** Epic 10 (landing page builder)

---

### Epic 7: Feedback, Loading, & Empty States

**User Outcome:** Users always understand system status—skeleton loading shows structure, progress shows completion, toasts confirm actions.

**Functional Requirements:**
- FR-UI-54: Skeleton loading for initial page load
- FR-UI-55: Skeleton shimmer animation (left-to-right gradient)
- FR-UI-56: Button loading spinner + "Loading..." text
- FR-UI-57: OCR indeterminate progress + time estimate
- FR-UI-58: Bulk determinate progress ("3/5 jamaah")
- FR-UI-59: Empty jamaah list ("Belum ada jamaah" + "Tambah Jamaah" button)
- FR-UI-60: No search results ("Tidak ada hasil untuk '{query}'" + clear filter)
- FR-UI-61: No documents ("Belum ada dokumen" + "Upload Dokumen" button)
- FR-UI-62: Encouraging empty state tone (not "No data")
- FR-UI-69: Success toast (green checkmark, 4-second auto-dismiss)
- FR-UI-70: Error toast (red X, 8-second auto-dismiss)
- FR-UI-71: Toast positioning (bottom-right desktop, top-center mobile)
- FR-UI-72: Warning alert banner (amber background)
- FR-UI-73: Concise Indonesian toast content (<60 chars)

**Key Features:**
- Skeleton loading: Shimmer animation, appears <100ms
- Progress indicators: Determinate (upload %) vs Indeterminate (OCR)
- Toast notifications: Sonner library, responsive positioning
- Empty states: Icon + encouraging message + primary action
- Indonesian tone: "Belum ada jamaah" (not "No jamaah")

**Dependencies:** Epic 1 (design system)

**Standalone Value:** Feedback system used across all features

**Used By:** Epic 3 (bulk operations), Epic 4 (document upload), Epic 9 (owner dashboard), Epic 10 (landing pages)

---

### Epic 8: Modal & Overlay System

**User Outcome:** Device-optimized overlays with accessibility—desktop centered modals, mobile bottom sheets for better thumb reach.

**Functional Requirements:**
- FR-UI-63: Desktop centered modal (max-width 600px, backdrop blur)
- FR-UI-64: Mobile bottom sheet (better thumb reach)
- FR-UI-65: Bottom sheet drag handle (4px × 32px)
- FR-UI-66: Modal focus trap (Tab cycles within modal only)
- FR-UI-67: Modal close on Escape key or backdrop click
- FR-UI-68: Focus returns to trigger element after close

**Key Features:**
- Desktop: Centered dialog (max-width 600px), backdrop blur
- Mobile: Bottom sheet with drag handle (4px × 32px)
- Focus management: Trap focus, Escape to close, return focus on close
- Keyboard accessible: Tab navigation, Enter/Space to activate

**Dependencies:** Epic 1 (design system: shadcn/ui Dialog and Sheet)

**Standalone Value:** Reusable overlay system

**Used By:** Epic 3 (TemplatePicker), Epic 4 (document previews)

---

### Epic 9: Agency Owner Dashboard & Analytics

**User Outcome:** Operational visibility for strategic decisions—revenue trends, agent performance leaderboard, pipeline status.

**Functional Requirements:**
- FR-UI-79: Personalized greeting ("Selamat Pagi, Pak Hadi!" based on time)
- FR-UI-80: KPI cards (Total Revenue, 3-Month Projection, Pipeline Potential)
- FR-UI-81: Agent Performance leaderboard (top 5 performers)
- FR-UI-82: Jamaah Pipeline breakdown by status
- FR-UI-83: Real-time WebSocket updates for payments/inventory
- FR-UI-84: KPI numbers 48px Poppins Bold for visual impact

**Key Features:**
- Personalized greeting: Time-based ("Selamat Pagi" / "Selamat Siang" / "Selamat Malam")
- Owner KPIs: Total revenue, 3-month projection, pipeline potential
- Agent leaderboard: Top 5 performers by revenue/conversions
- Real-time updates: WebSocket for payment confirmations, inventory changes
- Large numbers: 48px Poppins Bold for KPI impact

**Dependencies:** Epic 2 (KPI card patterns, status visualization)

**Standalone Value:** Complete owner dashboard

---

### Epic 10: Landing Page Builder for Agents

**User Outcome:** 20+ passive leads/month per agent through customizable landing pages shared on WhatsApp Status, Facebook, Instagram.

**Functional Requirements:**
- FR-UI-85: Package selection dropdown
- FR-UI-86: Agent branding fields (name, photo, contact)
- FR-UI-87: Live preview as agent customizes
- FR-UI-88: Prominent WhatsApp CTA button (green #25D366)
- FR-UI-89: Social sharing (WhatsApp Status, Facebook, Instagram one-click)
- FR-UI-90: Analytics tracking (views, clicks, conversions)

**Key Features:**
- Builder UI: Package selection, agent branding (photo, name, contact)
- Live preview: Updates as agent types/uploads
- WhatsApp CTA: Green button with deep linking
- Social sharing: One-click to WhatsApp Status, Facebook, Instagram
- Analytics: Track views, clicks, conversions per agent

**Dependencies:**
- Epic 6 (form patterns for builder)
- Epic 7 (feedback for save/publish actions)

**Standalone Value:** Complete marketing tool for agents

---

### Epic 11: Adaptive Density Modes (Bu Ratna → Mbak Rina)

**User Outcome:** Optimized UI density for all proficiency levels—Simplified (Bu Ratna), Standard (Ibu Siti), Power (Mbak Rina).

**Functional Requirements:**
- FR-UI-91: 3 density modes (Simplified, Standard, Power)
- FR-UI-92: Simplified mode—KPI cards only + 3 large action buttons (56px height)
- FR-UI-93: Standard mode—Full hybrid dashboard (KPI + filtered table)
- FR-UI-94: Power mode—Minimized KPI (single row) + maximized table density
- FR-UI-95: Mode switcher in Settings > Display Preference

**Key Features:**
- **Simplified Mode (Bu Ratna):**
  - Hide table, show only KPI cards
  - 3 large action buttons (56px height): "Tambah Jamaah", "Lihat Semua", "Hubungi Admin"
  - Auto-selected for first 3 logins

- **Standard Mode (Ibu Siti - Default):**
  - Full hybrid dashboard: KPI cards + filtered table
  - Default for users after 10+ actions

- **Power Mode (Mbak Rina):**
  - Minimized KPI cards (single horizontal row)
  - Maximized table density (compact row height, more columns visible)
  - Keyboard shortcuts enabled

- **Mode Switcher:**
  - Settings > Display Preference
  - Auto-detection based on usage patterns

**Dependencies:** Epic 2 (modifies dashboard layouts)

**Standalone Value:** Enhances Epic 2 for different proficiency levels

---

## Epic Dependencies Flow

```
Epic 1: Design System Foundation
├─ Enables: All other epics
│
Epic 2: Agent Dashboard "My Jamaah"
├─ Uses: Epic 1
├─ Enables: Epic 3, Epic 9, Epic 11
│
Epic 3: Bulk Operations & WhatsApp
├─ Uses: Epic 2, Epic 7, Epic 8
│
Epic 4: Document Upload & OCR
├─ Uses: Epic 2, Epic 6, Epic 7
│
Epic 5: Responsive Navigation
├─ Uses: Epic 1
├─ Standalone navigation system
│
Epic 6: Form Patterns & Validation
├─ Uses: Epic 1
├─ Enables: Epic 4, Epic 10
│
Epic 7: Feedback, Loading, & Empty States
├─ Uses: Epic 1
├─ Enables: Epic 3, Epic 4, Epic 9, Epic 10
│
Epic 8: Modal & Overlay System
├─ Uses: Epic 1
├─ Enables: Epic 3, Epic 4
│
Epic 9: Agency Owner Dashboard
├─ Uses: Epic 2
│
Epic 10: Landing Page Builder
├─ Uses: Epic 6, Epic 7
│
Epic 11: Adaptive Density Modes
├─ Uses: Epic 2 (modifies layouts)
```

---

## Summary

- **Total Frontend Epics:** 11
- **Total Functional Requirements:** 95 (FR-UI-1 to FR-UI-95)
- **Total Non-Functional Requirements:** 34 (NFR-UI-1 to NFR-UI-34)
- **Design Philosophy:** User-value first, standalone epics, incremental delivery
- **Technology Stack:** Next.js 14+, shadcn/ui, Tailwind CSS, Radix UI, TypeScript

**Next Step:** Create detailed user stories with acceptance criteria for each epic (Step 3).

---

# Epic Implementation Stories

## Epic 1: Design System Foundation & Component Library

**Epic Goal:** Complete accessible design system (WCAG AAA) enabling consistent, performant UI implementation across all features.

---

### Story 1.1: Initialize Next.js Project with TypeScript and App Router

As a developer,
I want a Next.js 14+ project with TypeScript and App Router configured,
So that I have a modern, type-safe foundation for building the Travel Umroh frontend.

**Acceptance Criteria:**

**Given** a new project directory
**When** I initialize the Next.js project
**Then** the project is created with:
- Next.js 14+ with App Router enabled
- TypeScript configuration (strict mode enabled)
- ESLint and Prettier configured for code quality
- Project structure: `/app`, `/components`, `/lib`, `/public`
**And** `package.json` includes necessary dependencies:
- `next@^14.0.0`
- `typescript@^5.0.0`
- `@types/node`, `@types/react`, `@types/react-dom`
**And** `npm run dev` starts development server successfully on http://localhost:3000
**And** TypeScript compilation succeeds with no errors
**And** Browser compatibility targets Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (NFR-UI-22 to NFR-UI-25)

**Requirements Fulfilled:** FR-UI-1, NFR-UI-22 to NFR-UI-26

---

### Story 1.2: Configure Tailwind CSS with Travel Umroh Design Tokens

As a developer,
I want Tailwind CSS configured with custom design tokens (colors, spacing, typography),
So that I can build consistent UI components following the Travel Umroh design system.

**Acceptance Criteria:**

**Given** the Next.js project is initialized
**When** I configure Tailwind CSS
**Then** `tailwind.config.ts` is created with custom theme extending default config:

**Colors:**
- Primary Blue: `primary` → `#2563EB`
- Secondary Gold: `secondary` → `#F59E0B`
- Status Urgent: `status-urgent` → `#EF4444`
- Status Soon: `status-soon` → `#D97706`
- Status Ready: `status-ready` → `#10B981`
- WhatsApp: `whatsapp` → `#25D366`
- Neutrals: Slate 50-900 for text, borders, backgrounds

**Typography:**
- Font families: `fontFamily.sans` → `['Inter', 'sans-serif']`, `fontFamily.display` → `['Poppins', 'sans-serif']`
- Font sizes: 12px (caption), 14px (body-sm), 16px (body), 18px (large), 24px (h3), 48px (kpi)

**Spacing:**
- Base unit 4px: `spacing` extends with `4, 8, 12, 16, 24, 32, 48, 64` (in pixels)

**And** `globals.css` imports Tailwind directives and defines CSS custom properties
**And** Inter and Poppins fonts are loaded via next/font
**And** Test page renders with design tokens applied correctly
**And** Color contrast meets WCAG AAA (7:1 for normal text, 4.5:1 for large text) (NFR-UI-8, NFR-UI-9)

**Requirements Fulfilled:** FR-UI-3, NFR-UI-31, NFR-UI-32, NFR-UI-33, NFR-UI-8, NFR-UI-9

---

### Story 1.3: Install shadcn/ui Base Components (Button, Card, Badge)

As a developer,
I want shadcn/ui Button, Card, and Badge components installed and configured,
So that I have accessible, customizable foundation components following Radix UI primitives.

**Acceptance Criteria:**

**Given** Tailwind CSS is configured with design tokens
**When** I install shadcn/ui CLI and add base components
**Then** `components/ui/button.tsx` is created with:
- Radix UI primitive integration (if applicable)
- Three variants: `primary` (solid), `secondary` (outline), `tertiary` (ghost) (NFR-UI-34)
- Size variants: `sm` (36px height), `md` (44px height), `lg` (48px height) (FR-UI-12, NFR-UI-18)
- Disabled state styling
- Focus indicators: 2px blue ring, 4px offset (NFR-UI-11)
- aria-label support for icon-only buttons (NFR-UI-12)

**And** `components/ui/card.tsx` is created with:
- Container with border, padding, background
- Header, Content, Footer slots
- Responsive padding (24-32px mobile, 16-24px desktop)

**And** `components/ui/badge.tsx` is created with:
- Status variants: `urgent` (red), `soon` (amber), `ready` (green) (FR-UI-21 to FR-UI-23)
- Icon + text + color (never color alone) (FR-UI-24)
- WCAG AAA contrast compliance

**And** All components are keyboard accessible (Tab navigation, Enter/Space to activate) (NFR-UI-10)
**And** Test page demonstrates all variants working correctly
**And** TypeScript types are properly defined with no errors

**Requirements Fulfilled:** FR-UI-2, FR-UI-4, FR-UI-5, FR-UI-21 to FR-UI-24, NFR-UI-10, NFR-UI-11, NFR-UI-12, NFR-UI-18, NFR-UI-34

---

### Story 1.4: Install shadcn/ui Form Components (Input, Select, Checkbox, Label)

As a developer,
I want shadcn/ui form components (Input, Select, Checkbox, Label) installed,
So that I can build accessible forms with consistent styling and validation states.

**Acceptance Criteria:**

**Given** shadcn/ui base components are installed
**When** I install form components
**Then** `components/ui/input.tsx` is created with:
- Minimum height 44px for touch-friendly interaction (FR-UI-48, NFR-UI-18)
- Error state: red border + space for error message below
- Success state: green border styling
- Focus state: 2px blue ring, 4px offset (NFR-UI-11)
- Disabled state styling

**And** `components/ui/select.tsx` is created with:
- Radix UI Select primitive integration
- Minimum touch target 44×44px (NFR-UI-18)
- Keyboard navigation (Arrow keys, Enter, Escape)
- aria-label and aria-labelledby support (NFR-UI-12, NFR-UI-13)

**And** `components/ui/checkbox.tsx` is created with:
- Radix UI Checkbox primitive
- 24×24px size (touch-friendly within 44px target area)
- Checked, unchecked, indeterminate states
- aria-checked attribute

**And** `components/ui/label.tsx` is created with:
- Required field indicator slot (red asterisk + "(required)" text) (FR-UI-49)
- Associates with input via htmlFor
- Indonesian language support (NFR-UI-16)

**And** All components work at 200% browser zoom without breaking layout (NFR-UI-15)
**And** Test page demonstrates all form components with validation states

**Requirements Fulfilled:** FR-UI-2, FR-UI-4, FR-UI-48, FR-UI-49, NFR-UI-10, NFR-UI-11, NFR-UI-12, NFR-UI-13, NFR-UI-15, NFR-UI-16, NFR-UI-18

---

### Story 1.5: Install shadcn/ui Overlay Components (Dialog, Sheet, Toast)

As a developer,
I want shadcn/ui Dialog, Sheet, and Toast components installed,
So that I can create accessible modals, bottom sheets, and notifications with proper focus management.

**Acceptance Criteria:**

**Given** shadcn/ui form components are installed
**When** I install overlay components
**Then** `components/ui/dialog.tsx` is created with:
- Radix UI Dialog primitive integration
- Desktop: centered modal, max-width 600px, backdrop blur (FR-UI-63)
- Focus trap: Tab cycles within dialog only (FR-UI-66)
- Escape key closes dialog (FR-UI-67)
- Focus returns to trigger element after close (FR-UI-68)
- aria-modal="true", proper role and aria-labelledby

**And** `components/ui/sheet.tsx` is created with:
- Radix UI Dialog primitive (styled as bottom sheet)
- Mobile: slides up from bottom, 4px × 32px drag handle at top (FR-UI-64, FR-UI-65)
- Backdrop click closes sheet (FR-UI-67)
- Swipe-down gesture to dismiss (touch interaction) (NFR-UI-30)

**And** `components/ui/toast.tsx` is created with:
- Sonner toast library integration
- Success variant: green checkmark, 4-second auto-dismiss (FR-UI-69)
- Error variant: red X, 8-second auto-dismiss (FR-UI-70)
- Warning variant: amber background (FR-UI-72)
- Responsive positioning: bottom-right (desktop), top-center (mobile) (FR-UI-71)
- aria-live="polite" for screen reader announcements (NFR-UI-14)
- Indonesian language support, max 60 chars for mobile readability (FR-UI-73, NFR-UI-16)

**And** All components are keyboard accessible (Tab, Escape, Enter/Space)
**And** Test page demonstrates dialog, sheet, and toast variants

**Requirements Fulfilled:** FR-UI-2, FR-UI-4, FR-UI-63 to FR-UI-73, NFR-UI-10, NFR-UI-14, NFR-UI-16, NFR-UI-30

---

### Story 1.6: Install TanStack Table v8 with shadcn/ui Integration

As a developer,
I want TanStack Table v8 integrated with shadcn/ui table components,
So that I can build advanced tables with sorting, filtering, and pagination.

**Acceptance Criteria:**

**Given** shadcn/ui base components are installed
**When** I install TanStack Table integration
**Then** `@tanstack/react-table@^8.0.0` is added to dependencies
**And** `components/ui/table.tsx` is created with:
- Table, TableHeader, TableBody, TableRow, TableCell, TableHead components
- Responsive: full table on desktop (≥1024px), card view on mobile (<768px) (FR-UI-9, NFR-UI-28)
- Sortable column headers with click-to-sort (FR-UI-17)
- Checkbox column component for bulk selection (FR-UI-19)
- Status badge integration (red/yellow/green) (FR-UI-16)

**And** `components/ui/data-table.tsx` example is created demonstrating:
- Column definitions with TypeScript types
- Sorting state management
- Filter state management (FR-UI-18)
- Pagination controls
- Empty state slot (FR-UI-59)
- Mobile card view transformation

**And** `components/ui/table-card.tsx` is created for mobile view:
- Card layout displaying row data vertically
- Touch-friendly spacing (8px minimum between elements) (NFR-UI-19)
- Status badge prominent at top

**And** Test page demonstrates table with 10+ rows, sorting, filtering, and responsive behavior
**And** Keyboard navigation works (Tab through cells, Enter to sort) (NFR-UI-10)
**And** ARIA roles applied: role="table", role="row", role="columnheader", role="cell" (NFR-UI-13)

**Requirements Fulfilled:** FR-UI-6, FR-UI-9, FR-UI-16, FR-UI-17, FR-UI-18, FR-UI-19, FR-UI-59, NFR-UI-10, NFR-UI-13, NFR-UI-19, NFR-UI-28

---

### Story 1.7: Create Design System Documentation with Component Examples

As a developer,
I want comprehensive design system documentation with component examples,
So that I can quickly reference usage patterns and maintain consistency across the application.

**Acceptance Criteria:**

**Given** all shadcn/ui components are installed
**When** I create design system documentation
**Then** `/docs/design-system.md` is created with:

**1. Introduction Section:**
- Project name: Travel Umroh
- Design philosophy: Mobile-first, WCAG AAA, Indonesian language
- Technology stack overview (Next.js, shadcn/ui, Tailwind, Radix UI)

**2. Design Tokens Section:**
- Color palette with hex codes and usage guidelines
- Typography system (Inter, Poppins, size scale)
- Spacing system (4px base unit, scale values)
- Button hierarchy (Primary, Secondary, Tertiary with visual examples)

**3. Component Library Section:**
- Each component documented with:
  - Description and when to use
  - Code example (TypeScript)
  - Props table with types
  - Accessibility notes (keyboard navigation, ARIA attributes)
  - Responsive behavior notes

**4. Status Indication Section:**
- Red/yellow/green badge usage (FR-UI-21 to FR-UI-25)
- Icons: AlertCircle (urgent), Clock (soon), CheckCircle (ready)
- Never use color alone (icon + text + color requirement)

**And** `/app/design-system/page.tsx` is created as interactive showcase:
- Visual examples of all components
- Code snippets for each variant
- Live playground to test responsive behavior
- Accessible via `/design-system` route in development

**And** Documentation includes Indonesian language examples (NFR-UI-16):
- Button labels: "Simpan", "Batal", "Hapus"
- Toast messages: "Berhasil disimpan", "Terjadi kesalahan"
- Empty states: "Belum ada jamaah"

**Requirements Fulfilled:** All FR-UI and NFR-UI from Epic 1, serves as reference for all future epics

---

### Story 1.8: Performance Optimization and Bundle Size Configuration

As a developer,
I want Next.js configured for optimal performance with bundle size <250KB gzipped,
So that the application loads in <2 seconds on 3G networks (Indonesia common).

**Acceptance Criteria:**

**Given** the design system components are installed
**When** I configure performance optimizations
**Then** `next.config.js` is updated with:
- Image optimization enabled (next/image)
- Bundle analyzer integration for monitoring
- Compression enabled (gzip, brotli)
- React Server Components enabled for App Router
- Font optimization (next/font for Inter and Poppins)

**And** Performance budgets are configured:
- Total bundle size <250KB gzipped (NFR-UI-5)
- First Contentful Paint (FCP) <1.5s on 3G (NFR-UI-2)
- Largest Contentful Paint (LCP) <2.5s on 3G (NFR-UI-3)
- Time to Interactive (TTI) <3.5s on 3G (NFR-UI-4)

**And** Code splitting is implemented:
- Dynamic imports for large components
- Route-based code splitting (App Router automatic)
- Component lazy loading for below-the-fold content (NFR-UI-6)

**And** Skeleton loading infrastructure is ready:
- `/components/ui/skeleton.tsx` component with shimmer animation (FR-UI-55)
- Appears within 100ms of page load (NFR-UI-7)
- Left-to-right gradient animation

**And** Performance testing is configured:
- Lighthouse CI integration
- Performance metrics tracked on each build
- Alerts if bundle size exceeds 250KB or LCP exceeds 2.5s

**And** Initial page load meets targets:
- <2 seconds on simulated 3G (Slow 3G: 400ms RTT, 400kbps down) (NFR-UI-1)
- Lighthouse Performance score >90
- Lighthouse Accessibility score >95

**Requirements Fulfilled:** NFR-UI-1 to NFR-UI-7, FR-UI-54, FR-UI-55

---

## Epic 2: Agent Dashboard - "My Jamaah" View

**Epic Goal:** Agents see all jamaah with 3-second status clarity (red/yellow/green), filter by urgency, and quickly understand daily priorities.

---

### Story 2.1: Create KPICard Component with Responsive Layout

As an agent,
I want to see KPI cards at the top of my dashboard showing counts of urgent, soon, and ready jamaah,
So that I can instantly understand my priorities in 3 seconds.

**Acceptance Criteria:**

**Given** the design system is configured (Epic 1 complete)
**When** I create the KPICard component
**Then** `/components/domain/dashboard/kpi-card.tsx` is created with:
- Props: `title` (string), `value` (number), `status` ('urgent' | 'soon' | 'ready'), `onClick` (optional function)
- Gradient backgrounds based on status:
  - Urgent: Red gradient (#EF4444 to darker red)
  - Soon: Amber gradient (#D97706 to darker amber)
  - Ready: Green gradient (#10B981 to darker green)
- Large number display: 48px Poppins Bold font for value
- Icon display: AlertCircle (urgent), Clock (soon), CheckCircle (ready) from Lucide React
- Title text: 16px Inter font
- Clickable cursor when onClick provided (FR-UI-15)

**And** Responsive layout is implemented:
- Mobile (<768px): Vertical stack, full-width cards, 16px gap
- Tablet (768px-1023px): 2-column grid, 16px gap
- Desktop (≥1024px): 3-column grid, 24px gap (FR-UI-14)

**And** Accessibility is implemented:
- Button role when clickable (onClick provided)
- aria-label: "{value} jamaah {status}" for screen readers
- Keyboard accessible: Tab to focus, Enter/Space to click
- Focus indicator: 2px blue ring, 4px offset (NFR-UI-11)

**And** Test page `/app/dashboard/test-kpi/page.tsx` demonstrates:
- 3 KPI cards: 5 urgent, 8 soon, 42 ready
- Responsive behavior at all breakpoints
- Click interaction logging to console

**Requirements Fulfilled:** FR-UI-13, FR-UI-14, FR-UI-15, FR-UI-25, NFR-UI-11, NFR-UI-32

---

### Story 2.2: Create StatusBadge Component with Icon + Text + Color

As an agent,
I want to see status badges that use icon + text + color (never color alone),
So that I can identify jamaah status even if I have color blindness.

**Acceptance Criteria:**

**Given** the design system is configured
**When** I create the StatusBadge component
**Then** `/components/domain/dashboard/status-badge.tsx` is created with:
- Props: `status` ('urgent' | 'soon' | 'ready'), `size` ('sm' | 'md' | 'lg')
- Three status variants (FR-UI-21 to FR-UI-23):
  - **Urgent:** Red background (#EF4444), white text, AlertCircle icon, text "Urgent"
  - **Soon:** Amber background (#D97706), white text, Clock icon, text "Soon"
  - **Ready:** Green background (#10B981), white text, CheckCircle icon, text "Ready"
- Size variants:
  - Small: 20px height, 12px font, 14px icon
  - Medium: 24px height, 14px font, 16px icon
  - Large: 32px height, 16px font, 20px icon
- Always displays: Icon + Text + Color (FR-UI-24)

**And** Indonesian language support (NFR-UI-16):
- Urgent → "Mendesak"
- Soon → "Segera"
- Ready → "Siap"

**And** WCAG AAA contrast compliance (NFR-UI-8):
- All color combinations achieve 7:1 contrast ratio for text
- Icon + text ensure non-color identification

**And** TypeScript types exported:
```typescript
export type Status = 'urgent' | 'soon' | 'ready'
export type BadgeSize = 'sm' | 'md' | 'lg'
```

**And** Test page demonstrates all 9 combinations (3 statuses × 3 sizes)

**Requirements Fulfilled:** FR-UI-21, FR-UI-22, FR-UI-23, FR-UI-24, FR-UI-25, NFR-UI-8, NFR-UI-16

---

### Story 2.3: Create JamaahTable Component with TanStack Table Integration

As an agent,
I want a table showing all my jamaah with sortable columns and status badges,
So that I can browse and organize my jamaah list efficiently.

**Acceptance Criteria:**

**Given** TanStack Table v8 is installed (Story 1.6) and StatusBadge is created (Story 2.2)
**When** I create the JamaahTable component
**Then** `/components/domain/dashboard/jamaah-table.tsx` is created with:
- TanStack Table integration with column definitions:
  - Checkbox column (selection, fixed width 48px)
  - Name column (sortable, min-width 200px)
  - NIK column (sortable, min-width 150px)
  - Package column (sortable, min-width 180px)
  - Status column (sortable, uses StatusBadge component, min-width 120px) (FR-UI-16)
  - Actions column (view/edit buttons, fixed width 100px)
- Default sort: Status (urgent → soon → ready), then Name (A-Z)

**And** Sorting functionality (FR-UI-17):
- Click column header to sort ascending
- Click again to sort descending
- Click third time to remove sort
- Visual indicator: ↑ (asc), ↓ (desc) icons in header

**And** Responsive desktop layout (≥1024px):
- Full table with horizontal scroll if needed
- Sticky header on scroll
- Alternating row colors (slate-50 / white) for readability
- Row hover: slate-100 background

**And** Accessibility (NFR-UI-10, NFR-UI-13):
- ARIA roles: role="table", role="columnheader", role="row", role="cell"
- Sortable headers: aria-sort="ascending" | "descending" | "none"
- Keyboard navigation: Tab through rows, Enter to activate checkbox/buttons

**And** TypeScript interface for jamaah data:
```typescript
interface Jamaah {
  id: string
  name: string
  nik: string
  package: string
  status: 'urgent' | 'soon' | 'ready'
}
```

**And** Test page with mock data (15 jamaah, mixed statuses) demonstrates sorting by each column

**Requirements Fulfilled:** FR-UI-16, FR-UI-17, NFR-UI-10, NFR-UI-13

---

### Story 2.4: Create Mobile Card View for Jamaah Table

As an agent using mobile,
I want the jamaah table to automatically switch to card view on small screens,
So that I can easily view and interact with jamaah data on my phone.

**Acceptance Criteria:**

**Given** JamaahTable component exists (Story 2.3)
**When** I create the mobile card view
**Then** `/components/domain/dashboard/jamaah-card.tsx` is created with:
- Card layout displaying single jamaah:
  - StatusBadge at top-left, large size (FR-UI-16)
  - Name: 18px Poppins SemiBold
  - NIK: 14px Inter, slate-600 color
  - Package: 14px Inter, slate-500 color
  - Checkbox: Top-right corner, 24×24px (FR-UI-19)
  - Actions: Bottom-right, icon buttons 44×44px (NFR-UI-18)
- Padding: 16px all sides
- Border: 1px slate-200
- Border-radius: 8px
- Gap between elements: 8px minimum (NFR-UI-19)

**And** JamaahTable component updated with responsive logic:
- Desktop (≥1024px): Render full table (table-card.tsx hidden)
- Tablet (768px-1023px): Render full table with horizontal scroll
- Mobile (<768px): Hide table, render JamaahCard for each row (FR-UI-9, NFR-UI-28)

**And** Mobile card interactions:
- Tap card to select/deselect (checkbox toggles)
- Long press to open actions menu (NFR-UI-30)
- Swipe right to quick-select (optional enhancement)

**And** Accessibility on mobile:
- Each card is a button with role="button"
- aria-label: "Jamaah {name}, status {status}, {package}"
- Touch targets 44×44px minimum for checkbox and action buttons (NFR-UI-18)

**And** Test page demonstrates:
- 15 jamaah cards on mobile (<768px)
- Automatic table ↔ card view switch at 768px breakpoint
- Touch interactions functional

**Requirements Fulfilled:** FR-UI-9, FR-UI-16, FR-UI-19, NFR-UI-18, NFR-UI-19, NFR-UI-28, NFR-UI-30

---

### Story 2.5: Implement Click-to-Filter on KPI Cards

As an agent,
I want to click a KPI card (e.g., "5 Urgent") and have the table filter to show only those jamaah,
So that I can quickly focus on my urgent tasks.

**Acceptance Criteria:**

**Given** KPICard component (Story 2.1) and JamaahTable component (Story 2.3) exist
**When** I implement click-to-filter functionality
**Then** Dashboard page state management is created:
- Zustand store `/lib/stores/dashboard-store.ts`:
  - `filterStatus`: 'all' | 'urgent' | 'soon' | 'ready' (default: 'all')
  - `setFilterStatus(status)`: Update filter
  - `selectedJamaah`: string[] (jamaah IDs, for future Epic 3)
  - `toggleJamaah(id)`: Add/remove jamaah from selection

**And** KPICard component receives onClick handler:
```typescript
<KPICard
  title="Urgent"
  value={5}
  status="urgent"
  onClick={() => setFilterStatus('urgent')}
/>
```

**And** JamaahTable component receives filter prop:
- Filters rows based on `filterStatus` from store
- Shows all jamaah when `filterStatus === 'all'`
- Shows filtered jamaah when specific status selected

**And** Visual feedback on KPI card click (FR-UI-15):
- Active card: Blue ring border (3px), slight scale (1.02)
- Inactive cards: Normal appearance
- "All" button or "Clear Filter" shows when filter active

**And** Filter behavior:
- Click "5 Urgent" → Table shows 5 urgent jamaah, card highlighted
- Click "All" or same card again → Table shows all jamaah, filter cleared
- Count badges update dynamically: "Menampilkan 5 dari 55 jamaah"

**And** Test page demonstrates:
- Click each KPI card → Table filters correctly
- Clear filter → Table shows all jamaah
- Mobile card view also filters correctly

**Requirements Fulfilled:** FR-UI-15, FR-UI-18

---

### Story 2.6: Add Checkbox Column for Bulk Selection

As an agent,
I want to select multiple jamaah using checkboxes,
So that I can perform bulk operations (future Epic 3).

**Acceptance Criteria:**

**Given** JamaahTable component exists (Story 2.3) and Zustand store is configured (Story 2.5)
**When** I add checkbox column functionality
**Then** Checkbox column is added to table with:
- Header checkbox: "Select all visible rows"
- Row checkboxes: "Select this jamaah"
- Fixed width: 48px
- Checkbox size: 20×20px within 44px touch target (NFR-UI-18)

**And** Selection state management:
- Store tracks `selectedJamaah: string[]` (jamaah IDs)
- `toggleJamaah(id)`: Add/remove individual jamaah
- `selectAllVisible()`: Select all currently filtered/visible jamaah
- `clearSelection()`: Clear all selections

**And** Header checkbox behavior:
- Unchecked: No jamaah selected
- Checked: All visible jamaah selected
- Indeterminate: Some (but not all) visible jamaah selected
- Click: Toggle all visible jamaah

**And** Row checkbox behavior (FR-UI-19):
- Checked: Jamaah is selected (ID in `selectedJamaah` array)
- Unchecked: Jamaah not selected
- Click: Toggle individual jamaah selection
- Row highlight: Blue-50 background when selected

**And** Keyboard interaction (NFR-UI-10):
- Tab to checkbox, Space to toggle
- Shift+Click to range-select (select from last clicked to current)

**And** Mobile card view updated:
- Checkbox visible in top-right of each card
- Same selection logic as desktop table

**And** Visual selection count feedback:
- When ≥1 jamaah selected, show count: "{count} jamaah dipilih"
- Display above table (desktop) or top of screen (mobile sticky)
- Color: Blue-600 background, white text

**And** Test page demonstrates:
- Select/deselect individual jamaah
- Select all with header checkbox
- Indeterminate state when partially selected
- Selection persists across filter changes

**Requirements Fulfilled:** FR-UI-19, FR-UI-20 (selection count), NFR-UI-10, NFR-UI-18

---

### Story 2.7: Implement Table Filtering by Status

As an agent,
I want to filter the table using a dropdown (Semua, Urgent, Soon, Ready),
So that I have multiple ways to filter jamaah (both KPI click and dropdown).

**Acceptance Criteria:**

**Given** JamaahTable component with filtering exists (Story 2.5)
**When** I add status filter dropdown
**Then** Filter dropdown component is added above table:
- shadcn/ui Select component
- Options: "Semua", "Mendesak", "Segera", "Siap" (Indonesian) (NFR-UI-16)
- Maps to: 'all', 'urgent', 'soon', 'ready'
- Position: Top-right of table (desktop), below KPI cards (mobile)
- Minimum touch target: 44×44px (NFR-UI-18)

**And** Dropdown syncs with Zustand store:
- Reads `filterStatus` from store (reflects current filter)
- Updates `setFilterStatus` on change
- Syncs with KPI card click filter (two-way binding)

**And** Filter behavior (FR-UI-18):
- Select "Mendesak" → Table shows urgent only, "Mendesak" KPI card highlights
- Select "Semua" → Table shows all, no KPI card highlighted
- Dropdown value updates when KPI card clicked

**And** Filter count display:
- Shows: "Menampilkan {filtered} dari {total} jamaah"
- Example: "Menampilkan 5 dari 55 jamaah" when filtering urgent
- Position: Next to dropdown (desktop), below dropdown (mobile)

**And** Accessibility:
- aria-label="Filter jamaah berdasarkan status"
- Keyboard navigation: Arrow keys to navigate options, Enter to select
- Screen reader announces: "Filter applied: Mendesak, showing 5 jamaah"

**And** Test page demonstrates:
- Dropdown filters table correctly
- Syncs with KPI card click filter
- Count updates dynamically

**Requirements Fulfilled:** FR-UI-18, NFR-UI-16, NFR-UI-18

---

### Story 2.8: Create Empty State for Jamaah List

As an agent with no jamaah yet,
I want to see an encouraging empty state with a call-to-action,
So that I know what to do next.

**Acceptance Criteria:**

**Given** JamaahTable component exists
**When** the jamaah list is empty (no data)
**Then** Empty state component is displayed:
- Centered in table/card area
- Icon: UserPlus from Lucide React, 64×64px, slate-400 color
- Heading: "Belum ada jamaah" (24px Poppins SemiBold, slate-700) (FR-UI-59)
- Description: "Mulai dengan menambahkan jamaah pertama Anda" (16px Inter, slate-500)
- Primary button: "Tambah Jamaah Baru" (large size, 48px height for emphasis)
- Button onClick: Navigate to /jamaah/new (routing placeholder for now)

**And** Encouraging tone is used (FR-UI-62):
- ✅ "Belum ada jamaah" (Not yet have jamaah)
- ❌ NOT "Tidak ada jamaah" (No jamaah)
- ✅ "Mulai dengan menambahkan..." (Start by adding...)
- ❌ NOT "Anda harus menambahkan..." (You must add...)

**And** Empty state variants:
- **No jamaah at all:** Show "Belum ada jamaah" + "Tambah Jamaah Baru"
- **No results for filter:** Show "Tidak ada hasil untuk '{filter}'" + "Hapus Filter" button (FR-UI-60)
- Example: Filter to "Urgent" but no urgent jamaah → "Tidak ada jamaah mendesak saat ini" + "Lihat Semua" button

**And** Responsive layout:
- Desktop: Centered in table area, max-width 400px
- Mobile: Centered in card area, padding 32px sides
- Vertical spacing: 24px between elements

**And** Accessibility:
- role="status" for screen reader announcement
- aria-live="polite" when empty state appears
- Button is keyboard accessible (Tab, Enter)

**And** Test page demonstrates:
- Empty state when no data
- Empty state when filtered with no results
- Button interactions (console log navigation)

**Requirements Fulfilled:** FR-UI-59, FR-UI-60, FR-UI-62

---

### Story 2.9: Create Dashboard Page Integrating All Components

As an agent,
I want a complete dashboard page showing KPI cards, filter controls, and jamaah table,
So that I have a fully functional "My Jamaah" view.

**Acceptance Criteria:**

**Given** all Epic 2 components are created (Stories 2.1-2.8)
**When** I create the dashboard page
**Then** `/app/dashboard/page.tsx` is created with:

**Layout structure:**
- **Header:** "Dashboard Jamaah Saya" (32px Poppins Bold)
- **KPI Section:** 3 KPICard components in responsive grid
- **Controls Section:** Status filter dropdown + search input (placeholder for future)
- **Table Section:** JamaahTable component
- **Empty State:** Conditional rendering when no jamaah

**And** Data fetching is simulated (placeholder for backend integration):
- Mock data: 55 jamaah with realistic names, NIK, packages, statuses
- Status distribution: ~10% urgent, ~15% soon, ~75% ready
- TanStack Query hook: `useJamaah()` (placeholder, returns mock data)

**And** State management is integrated:
- Zustand store for filter and selection
- React state for table sorting

**And** Responsive behavior verified:
- Mobile (<768px):
  - KPI cards stack vertically
  - Filter dropdown full-width
  - Card view for jamaah
  - Bottom spacing for future FloatingActionBar (Epic 3)
- Tablet (768px-1023px):
  - KPI cards 2-column grid
  - Table with horizontal scroll
- Desktop (≥1024px):
  - KPI cards 3-column grid
  - Full table visible without scroll (unless >10 columns)

**And** Skeleton loading is implemented (Epic 1 Story 1.8):
- Show skeleton KPI cards (shimmer animation) while loading
- Show skeleton table rows (shimmer animation) while loading
- Appears within 100ms (NFR-UI-7)
- Transition to real data smoothly

**And** Performance verified:
- Page loads in <2 seconds on simulated 3G (NFR-UI-1)
- Lighthouse Accessibility score >95
- No console errors, TypeScript compiles successfully

**And** Test scenarios verified:
1. Dashboard loads with 55 jamaah → All components render
2. Click "Urgent" KPI → Table filters to 5 urgent jamaah
3. Select 3 jamaah → Selection count appears
4. Change dropdown filter → Table updates, KPI highlights sync
5. Resize to mobile → Card view appears, table hidden
6. Empty state → "Belum ada jamaah" shows when no data

**Requirements Fulfilled:** All FR-UI-13 to FR-UI-25, FR-UI-59, NFR-UI-1, NFR-UI-7

---

## Epic 3: Bulk Operations & WhatsApp Integration

**Epic Goal:** 80% time savings through batch operations—select 5 jamaah, send reminders in one click instead of 5 separate WhatsApp messages.

---

### Story 3.1: Create FloatingActionBar Component

As an agent,
I want a floating action bar to appear when I select jamaah,
So that I can quickly access bulk operations.

**Acceptance Criteria:**

**Given** the design system is configured and jamaah selection works (Epic 2 Story 2.6)
**When** I create the FloatingActionBar component
**Then** `/components/domain/whatsapp/floating-action-bar.tsx` is created with:
- Props: `selectedCount` (number), `onSendReminder` (function), `onMarkComplete` (function), `onClearSelection` (function)
- Selection count display: "{selectedCount} jamaah dipilih" (16px Poppins SemiBold) (FR-UI-27)
- Three action buttons (FR-UI-28, FR-UI-29, FR-UI-30):
  - "Kirim Pengingat" (WhatsApp green #25D366, MessageCircle icon)
  - "Tandai Selesai" (Blue, CheckCircle icon)
  - "Hapus Pilihan" (Gray, X icon)
- Button sizing: 44px minimum height (NFR-UI-18)

**And** Responsive positioning (FR-UI-31):
- Mobile (<768px): Fixed bottom, full-width, 0px sides, z-index 50
- Desktop (≥1024px): Fixed bottom-right, auto-width (max 600px), 24px margin, rounded corners, z-index 50

**And** Visual styling:
- Background: White with shadow-lg (elevated appearance)
- Border-top (mobile): 1px slate-200
- Border (desktop): 1px slate-200, rounded-lg
- Padding: 16px all sides
- Button layout: Flex row, 8px gap, wrap on narrow screens

**And** Show/hide behavior:
- Visible when `selectedCount > 0`
- Hidden when `selectedCount === 0`
- Animate in/out: Slide up from bottom (mobile), fade in (desktop)

**And** Accessibility:
- role="toolbar" with aria-label="Bulk actions for selected jamaah"
- Each button has aria-label describing action
- Keyboard: Tab between buttons, Enter/Space to activate
- Focus trap: Not required (not modal)

**And** Test page demonstrates:
- Bar appears when selection count changes
- All three buttons trigger console logs
- Responsive positioning at different breakpoints

**Requirements Fulfilled:** FR-UI-26, FR-UI-27, FR-UI-28, FR-UI-29, FR-UI-30, FR-UI-31, NFR-UI-18

---

### Story 3.2: Create TemplatePicker Modal Component

As an agent,
I want a template picker modal to choose WhatsApp message templates,
So that I can quickly send standardized messages to multiple jamaah.

**Acceptance Criteria:**

**Given** shadcn/ui Dialog component exists (Epic 1 Story 1.5)
**When** I create the TemplatePicker component
**Then** `/components/domain/whatsapp/template-picker.tsx` is created with:
- Modal structure: Dialog (desktop centered, mobile bottom sheet)
- Header: "Pilih Template Pesan" + close button
- Three template categories (FR-UI-34):
  - **Dokumen:** "Reminder Upload KTP", "Reminder Upload Paspor", "Dokumen Lengkap"
  - **Cicilan:** "Reminder Pembayaran", "Konfirmasi Pembayaran Diterima", "Cicilan Mendekati Jatuh Tempo"
  - **Update Lapangan:** "Update Keberangkatan", "Update Hotel", "Update Jadwal"
- Category tabs: Horizontal scroll on mobile, fixed on desktop

**And** Template list:
- Each template shows: Title (16px Poppins SemiBold), Preview text (14px Inter, truncated 2 lines)
- Click template → Shows in preview pane
- Selected template: Blue border, checkmark icon

**And** Preview pane (FR-UI-35):
- Shows full template text
- Merge fields substitution: `{nama}`, `{paket}`, `{tanggal}`, `{jumlah}`
- Example: "Halo {nama}, ini pengingat..." → "Halo Ahmad Fauzi, ini pengingat..."
- Editable textarea: Agent can customize before sending
- Character counter: "245 / 4096" (WhatsApp limit) (FR-UI-36)
- Warning if >4096: "Pesan akan dipecah jadi 2 bagian" (amber alert banner) (FR-UI-37)

**And** Action buttons:
- "Batal" (secondary, closes modal)
- "Kirim ke {count} Jamaah" (primary, WhatsApp green, disabled until template selected)

**And** Accessibility:
- Focus trapped in modal (FR-UI-66)
- Escape to close (FR-UI-67)
- Focus returns to "Kirim Pengingat" button after close (FR-UI-68)
- Keyboard: Arrow keys to navigate templates, Enter to select

**And** Test page demonstrates:
- Open modal, browse categories
- Select template, see merge field preview
- Character counter updates as typing
- Warning appears if >4096 chars

**Requirements Fulfilled:** FR-UI-33, FR-UI-34, FR-UI-35, FR-UI-36, FR-UI-37, FR-UI-66, FR-UI-67, FR-UI-68

---

### Story 3.3: Implement WhatsApp Bulk Send with Progress Indicator

As an agent,
I want to send WhatsApp messages to multiple jamaah with progress feedback,
So that I know the messages are being sent successfully.

**Acceptance Criteria:**

**Given** TemplatePicker modal exists (Story 3.2) and jamaah selection works (Epic 2)
**When** I implement bulk send functionality
**Then** Bulk send logic is created in `/lib/whatsapp/bulk-send.ts`:
- Function: `sendBulkWhatsApp(jamaahIds, templateText)`
- For each jamaah:
  - Substitute merge fields: `{nama}`, `{paket}`, etc.
  - Generate WhatsApp deep link: `https://wa.me/{phoneNumber}?text={encodedMessage}`
  - Open link in new tab/window (browser opens WhatsApp)
  - Wait 2 seconds between opens (avoid rate limiting)

**And** Progress indicator is displayed (FR-UI-38, FR-UI-58):
- Modal overlay with progress bar
- Title: "Mengirim pesan..."
- Determinate progress: "3 / 5 jamaah" text
- Progress bar: 60% filled (3 of 5 complete)
- Cancel button: "Batalkan" (stops remaining sends)

**And** Progress states:
- **Sending:** Blue progress bar, spinner icon
- **Success:** Green checkmark, "Berhasil mengirim ke 5 jamaah"
- **Partial success:** Amber warning, "Berhasil 3 dari 5, 2 gagal"
- **Error:** Red X, "Gagal mengirim pesan"

**And** After completion:
- Success toast: "Pesan terkirim ke 5 jamaah via WhatsApp" (4-second auto-dismiss) (FR-UI-69)
- Error toast: "Gagal mengirim ke 2 jamaah" (8-second auto-dismiss) (FR-UI-70)
- Clear selection in Zustand store
- FloatingActionBar hides
- TemplatePicker modal closes

**And** Accessibility:
- Progress modal has role="dialog" with aria-label="Sending progress"
- aria-live="polite" region announces progress updates
- Cancel button keyboard accessible

**And** Test scenarios:
- Send to 1 jamaah → Opens WhatsApp with pre-filled message
- Send to 5 jamaah → Progress shows 0/5 → 1/5 → ... → 5/5 → Success toast
- Cancel midway → Stops at current count, shows partial success

**Requirements Fulfilled:** FR-UI-32, FR-UI-38, FR-UI-58, FR-UI-69, FR-UI-70

---

### Story 3.4: Integrate FloatingActionBar with Dashboard

As an agent,
I want the FloatingActionBar to appear when I select jamaah on the dashboard,
So that I have immediate access to bulk WhatsApp send.

**Acceptance Criteria:**

**Given** FloatingActionBar (Story 3.1), TemplatePicker (Story 3.2), and bulk send (Story 3.3) exist
**When** I integrate them with the dashboard (Epic 2)
**Then** `/app/dashboard/page.tsx` is updated with:
- FloatingActionBar component rendered conditionally:
  - Visible when `selectedJamaah.length > 0` (from Zustand store)
  - `selectedCount` prop: `selectedJamaah.length`
- TemplatePicker modal state: `isTemplatePickerOpen` (React state)

**And** "Kirim Pengingat" button onClick:
- Opens TemplatePicker modal
- Passes `selectedJamaah` data for merge field substitution

**And** "Tandai Selesai" button onClick:
- Shows confirmation dialog: "Tandai {count} jamaah sebagai selesai?"
- On confirm: Updates jamaah status to "ready" (placeholder API call)
- Success toast: "{count} jamaah ditandai selesai"
- Clears selection

**And** "Hapus Pilihan" button onClick (FR-UI-30):
- Calls `clearSelection()` from Zustand store
- FloatingActionBar hides
- All checkboxes unchecked
- No toast (silent action)

**And** Responsive behavior verified:
- Mobile: FloatingActionBar full-width at bottom, above bottom tab navigation (Epic 5)
- Desktop: FloatingActionBar bottom-right corner, doesn't overlap table

**And** Test scenarios:
1. Select 3 jamaah → FloatingActionBar appears with "3 jamaah dipilih"
2. Click "Kirim Pengingat" → TemplatePicker opens → Select template → Send → Progress → Success toast
3. Click "Tandai Selesai" → Confirmation → Confirm → Success toast → Selection cleared
4. Click "Hapus Pilihan" → Selection cleared, bar hides

**Requirements Fulfilled:** FR-UI-28, FR-UI-29, FR-UI-30, FR-UI-69, FR-UI-70, FR-UI-71, FR-UI-73

---

## Epic 4: Document Upload & OCR Experience

**Epic Goal:** 30 min → 5 min per jamaah registration (OCR auto-fills NIK, name, address from KTP photo).

---

### Story 4.1: Create DocumentUploadZone Component with Drag-Drop

As an agent,
I want a document upload zone with drag-and-drop support,
So that I can easily upload KTP photos for OCR processing.

**Acceptance Criteria:**

**Given** the design system is configured
**When** I create the DocumentUploadZone component
**Then** `/components/domain/documents/document-upload-zone.tsx` is created with:
- Dropzone container: 200px height (mobile), 300px height (desktop)
- Border: 2px dashed slate-300 (default), 2px solid blue-500 (drag-over) (FR-UI-40)
- Background: slate-50 (default), blue-50 (drag-over)
- Content: Upload icon (64px), text "Seret foto KTP ke sini atau klik untuk upload"

**And** Drag-and-drop functionality (FR-UI-39, FR-UI-41):
- `onDragOver`: Prevent default, set drag-over state (blue border/background)
- `onDragLeave`: Remove drag-over state
- `onDrop`: Prevent default, handle file drop, remove drag-over state
- Accept: `image/jpeg`, `image/png` (KTP photos)
- Max size: 5MB
- Validation: Show error toast if wrong type or too large

**And** Click-to-upload functionality (FR-UI-41):
- Hidden file input: `<input type="file" accept="image/jpeg,image/png" />`
- Click dropzone → Triggers file input click
- File selected → Same handling as drag-drop

**And** Accessibility:
- Dropzone is `<button>` with role="button"
- aria-label="Upload KTP document, drag and drop or click to select file"
- Keyboard: Tab to focus, Enter/Space to open file picker
- Focus indicator: 2px blue ring (NFR-UI-11)

**And** Indonesian language (NFR-UI-16):
- "Seret foto KTP ke sini atau klik untuk upload"
- "Ukuran maksimal 5MB"
- "Format: JPG, PNG"

**And** Test page demonstrates:
- Drag image onto zone → Border turns blue
- Drop image → File handling triggered
- Click zone → File picker opens
- Select file → File handling triggered
- Invalid file → Error toast appears

**Requirements Fulfilled:** FR-UI-39, FR-UI-40, FR-UI-41, NFR-UI-11, NFR-UI-16

---

### Story 4.2: Implement Upload Progress Bar

As an agent,
I want to see upload progress when uploading a document,
So that I know the file is being uploaded successfully.

**Acceptance Criteria:**

**Given** DocumentUploadZone component exists (Story 4.1)
**When** I implement upload progress
**Then** Upload progress UI is added to DocumentUploadZone:
- Progress bar component: Linear, 0-100%, blue-500 color
- Progress text: "Mengupload... 45%" (centered above bar) (FR-UI-42)
- File name display: "ktp-ahmad-fauzi.jpg" (14px Inter, truncated)
- Cancel button: Small, ghost variant, "Batalkan" text

**And** Upload simulation logic:
- Function: `uploadFile(file)` (placeholder, simulates upload to backend)
- Progress updates: 0% → 25% → 50% → 75% → 100% (500ms intervals)
- Returns: `{ success: true, fileUrl: '/uploads/ktp-123.jpg' }`

**And** Progress states:
- **Uploading (0-99%):** Blue progress bar, indeterminate spinner (spinning circle icon)
- **Complete (100%):** Green checkmark icon, "Upload selesai" text (1 second)
- **Error:** Red X icon, "Upload gagal, coba lagi" text + retry button

**And** After 100% upload:
- Transition to OCR processing (Story 4.3)
- Progress bar replaced by OCR progress indicator

**And** Cancel functionality:
- Click "Batalkan" → Abort upload, reset to initial state
- Toast: "Upload dibatalkan" (4-second)

**And** Test scenarios:
- Upload file → Progress 0% → 100% → Success
- Cancel during upload → Upload stops, zone resets
- Upload error → Error state shows, retry button works

**Requirements Fulfilled:** FR-UI-42

---

### Story 4.3: Implement OCR Processing with Progress Feedback

As an agent,
I want to see OCR processing progress after upload,
So that I know the system is reading the KTP data.

**Acceptance Criteria:**

**Given** file upload completes successfully (Story 4.2)
**When** I implement OCR processing
**Then** OCR processing UI is displayed:
- Indeterminate progress bar (blue, animated left-to-right) (FR-UI-57)
- Spinner icon: Rotating circle (24px)
- Status text: "Membaca data dari KTP... ~3-5 detik" (FR-UI-43)
- Estimated time: Counts up "3... 4... 5..." if taking longer

**And** OCR simulation logic:
- Function: `processOCR(fileUrl)` (placeholder, calls backend OCR API)
- Delay: 3-5 seconds (simulated processing time)
- Returns:
```typescript
{
  success: true,
  confidence: 92, // 0-100%
  data: {
    nik: '3201012345670001',
    name: 'AHMAD FAUZI',
    address: 'JL. MERDEKA NO. 123, JAKARTA',
    dateOfBirth: '1990-01-01'
  }
}
```

**And** OCR result handling:
- **High confidence (≥80%):** Proceed to success state (Story 4.4)
- **Low confidence (<80%):** Show warning state (Story 4.5)
- **Error:** Show error state (Story 4.6)

**And** Visual feedback during processing:
- DocumentUploadZone shows: Uploaded file thumbnail (100px) + OCR spinner
- Background: Blue-50 (processing)
- User cannot interact (disabled state)

**And** Test scenarios:
- After upload → OCR starts automatically → 3-5 seconds → Success/warning/error

**Requirements Fulfilled:** FR-UI-43, FR-UI-57

---

### Story 4.4: Implement OCR Success State with Field Highlighting

As an agent,
I want form fields to auto-fill and highlight in green when OCR succeeds,
So that I can quickly verify the extracted data.

**Acceptance Criteria:**

**Given** OCR processing succeeds with high confidence (≥80%) (Story 4.3)
**When** I implement the success state
**Then** Form fields auto-fill with OCR data:
- NIK input: Value set to `data.nik`
- Name input: Value set to `data.name`
- Address textarea: Value set to `data.address`
- Date of Birth input: Value set to `data.dateOfBirth`

**And** Green highlight effect (FR-UI-44):
- Affected fields: Green border (2px solid green-500)
- Duration: 2 seconds
- Animation: Fade in (0.3s), hold (1.4s), fade out (0.3s)
- After 2 seconds: Border returns to default (slate-300)

**And** Success toast notification:
- Message: "KTP berhasil diproses" (FR-UI-69)
- Icon: Green checkmark
- Duration: 4-second auto-dismiss
- Position: Bottom-right (desktop), top-center (mobile)

**And** DocumentUploadZone updates:
- Shows: File thumbnail + green checkmark + "Berhasil diproses"
- Background: Green-50
- "Upload Ulang" button: Secondary variant, allows re-upload if needed

**And** Accessibility:
- aria-live="polite" announces: "KTP data extracted successfully"
- Screen reader reads auto-filled values
- Agent can Tab to each field to verify

**And** Test scenario:
- OCR success (92% confidence) → Fields auto-fill → Green highlight for 2s → Toast appears → Highlight fades

**Requirements Fulfilled:** FR-UI-44, FR-UI-69

---

### Story 4.5: Implement OCR Low Confidence Warning State

As an agent,
I want to see a warning when OCR confidence is low,
So that I know to manually verify the extracted data.

**Acceptance Criteria:**

**Given** OCR processing succeeds but with low confidence (<80%) (Story 4.3)
**When** I implement the low confidence state
**Then** Form fields auto-fill with OCR data:
- Same auto-fill behavior as high confidence (Story 4.4)
- BUT: Border color is amber (2px solid amber-500) instead of green (FR-UI-45)

**And** Warning indicators:
- Amber border on affected fields
- Tooltip icon: AlertTriangle (amber, 16px) next to each low-confidence field
- Tooltip text on hover: "Confidence {confidence}%. Please verify this value." (FR-UI-45)
- Duration: Amber border persists (doesn't fade after 2 seconds)

**And** Warning toast notification:
- Message: "Data KTP ter-ekstrak, mohon verifikasi karena confidence rendah ({confidence}%)"
- Icon: Amber alert triangle
- Duration: 8-second auto-dismiss (longer than success)
- Position: Bottom-right (desktop), top-center (mobile)

**And** DocumentUploadZone updates:
- Shows: File thumbnail + amber warning icon + "Confidence rendah, verifikasi data"
- Background: Amber-50
- "Upload Ulang" button visible

**And** Agent interaction:
- Agent can edit any field
- Editing field removes amber border (changes to blue focus, then slate-300 on blur)
- After editing all low-confidence fields, warning dismissed

**And** Test scenario:
- OCR success (65% confidence) → Fields auto-fill → Amber border persists → Tooltip shows confidence → Warning toast appears

**Requirements Fulfilled:** FR-UI-45

---

### Story 4.6: Implement OCR Error State with Recovery Guidance

As an agent,
I want clear error guidance when OCR fails,
So that I know how to fix the issue and try again.

**Acceptance Criteria:**

**Given** OCR processing fails (network error, unreadable image, etc.) (Story 4.3)
**When** I implement the error state
**Then** Error indicators are displayed:
- DocumentUploadZone: Red border (2px solid red-500) around uploaded file (FR-UI-46)
- Error icon: Red X (AlertCircle, 48px)
- Error message: "Gagal membaca KTP"

**And** Contextual recovery guidance (FR-UI-46):
- Error reason detection:
  - Blur detected → "Foto blur? Upload foto lebih jelas"
  - Low light → "Foto terlalu gelap? Coba dengan pencahayaan lebih baik"
  - Incomplete document → "KTP terpotong? Pastikan seluruh KTP terlihat"
  - Generic error → "Coba upload ulang atau masukkan data manual"
- Display: 16px Inter, slate-600 color, below error message

**And** Action buttons:
- Primary: "Upload Ulang" (large button, triggers file picker)
- Secondary: "Isi Manual" (navigates to manual input form or enables form fields)

**And** Error toast notification (FR-UI-70):
- Message: "Gagal memproses KTP: {error reason}"
- Icon: Red X
- Duration: 8-second auto-dismiss
- Position: Bottom-right (desktop), top-center (mobile)

**And** Form fields remain empty:
- No auto-fill (OCR failed)
- Fields enabled for manual input
- Agent can type data manually

**And** Accessibility:
- aria-live="assertive" announces error immediately
- Error message has role="alert"
- Focus moves to "Upload Ulang" button after error

**And** Test scenarios:
- OCR fails (blur) → Error shows "Foto blur?" → Click "Upload Ulang" → File picker opens
- OCR fails (generic) → Error shows "Coba upload ulang atau isi manual" → Click "Isi Manual" → Form fields enabled

**Requirements Fulfilled:** FR-UI-46, FR-UI-70

---

## Epic 5: Responsive Navigation & Layout

**Epic Goal:** Optimized navigation for 60% mobile users—bottom tabs for thumb reach, top nav for desktop efficiency.

---

### Story 5.1: Create Bottom Tab Bar for Mobile Navigation

As an agent using mobile,
I want a bottom tab bar with easy thumb reach,
So that I can navigate between sections quickly.

**Acceptance Criteria:**

**Given** the design system is configured
**When** I create the bottom tab bar component
**Then** `/components/domain/navigation/bottom-tab-bar.tsx` is created with:
- Five tabs (FR-UI-74):
  - **Dashboard:** Home icon (Lucide React), "Dashboard"
  - **Jamaah:** Users icon, "Jamaah"
  - **Dokumen:** FileText icon, "Dokumen"
  - **Laporan:** BarChart icon, "Laporan"
  - **Profile:** User icon, "Profile"
- Tab sizing: 60px height, equal width (20% each), 44×44px touch target (FR-UI-12, NFR-UI-18)

**And** Active state styling (FR-UI-76):
- Active tab: Blue-500 icon and text, 3px blue bar at top of tab
- Inactive tabs: Slate-500 icon and text, no bar
- Tab labels: 12px Inter font, below icon

**And** Mobile display logic (FR-UI-10):
- Visible: <768px viewport width only
- Hidden: ≥768px viewport width
- Position: Fixed bottom, full-width, z-index 40
- Background: White with shadow-top (elevated)
- Safe area: Account for mobile bottom insets (iOS notch, Android gestures)

**And** Navigation behavior:
- Click tab → Navigate to route:
  - Dashboard → `/dashboard`
  - Jamaah → `/jamaah`
  - Dokumen → `/documents`
  - Laporan → `/reports`
  - Profile → `/profile`
- Active route highlights corresponding tab

**And** Accessibility (NFR-UI-10):
- role="navigation" with aria-label="Main navigation"
- Each tab: role="tab" with aria-selected="true/false"
- Keyboard: Tab between tabs, Enter/Space to navigate
- Screen reader announces: "Dashboard tab, selected" or "Jamaah tab, not selected"

**And** Test page demonstrates:
- Bottom tab bar visible on mobile (<768px)
- Active tab highlights correctly
- Click tabs → Routes change, active state updates
- Resize to desktop → Bar hides

**Requirements Fulfilled:** FR-UI-10, FR-UI-12, FR-UI-74, FR-UI-76, NFR-UI-10, NFR-UI-18

---

### Story 5.2: Create Top Navigation Bar for Desktop

As an agent using desktop,
I want a top navigation bar with all sections visible,
So that I can navigate efficiently without a menu.

**Acceptance Criteria:**

**Given** the design system is configured
**When** I create the top navigation bar
**Then** `/components/domain/navigation/top-nav-bar.tsx` is created with:
- Five navigation links (same as bottom tabs):
  - Dashboard, Jamaah, Dokumen, Laporan, Profile
- Logo/branding: "Travel Umroh" text + icon (left side)
- Navigation links: Horizontal row (center)
- User menu: Avatar + dropdown (right side)

**And** Active state styling (FR-UI-76):
- Active link: Blue-500 text, 3px blue bar at bottom
- Inactive links: Slate-700 text, no bar
- Hover: Slate-900 text (inactive links only)

**And** Desktop display logic (FR-UI-11, FR-UI-75):
- Visible: ≥1024px viewport width only
- Hidden: <1024px viewport width
- Position: Sticky top, full-width, z-index 50
- Height: 64px
- Background: White with shadow-bottom

**And** Navigation behavior:
- Click link → Navigate to route (same routes as bottom tabs)
- Active route highlights corresponding link

**And** User menu dropdown:
- Click avatar → Dropdown appears below
- Options: "Pengaturan", "Bantuan", "Keluar"
- Dropdown: shadcn/ui DropdownMenu component
- Close on click outside or Escape

**And** Accessibility (NFR-UI-10):
- role="navigation" with aria-label="Main navigation"
- Each link: aria-current="page" when active
- Keyboard: Tab through links, Enter to navigate
- User menu: Keyboard accessible (Arrow keys, Enter, Escape)

**And** Test page demonstrates:
- Top nav visible on desktop (≥1024px)
- Active link highlights correctly
- Click links → Routes change, active state updates
- User menu opens/closes correctly
- Resize to mobile → Bar hides, bottom tabs show

**Requirements Fulfilled:** FR-UI-11, FR-UI-75, FR-UI-76, NFR-UI-10

---

### Story 5.3: Add Breadcrumbs for Desktop Navigation Context

As an agent on desktop,
I want breadcrumbs showing my current location in the app,
So that I understand where I am and can navigate back easily.

**Acceptance Criteria:**

**Given** top navigation bar exists (Story 5.2)
**When** I create the breadcrumbs component
**Then** `/components/domain/navigation/breadcrumbs.tsx` is created with:
- Breadcrumb trail: Home icon > Section > Page
- Separator: ChevronRight icon (slate-400, 16px)
- Examples:
  - Dashboard: "Dashboard" (no breadcrumb, just page title)
  - Jamaah list: "Dashboard > Jamaah"
  - Jamaah detail: "Dashboard > Jamaah > Ahmad Fauzi"
  - Document upload: "Dashboard > Jamaah > Ahmad Fauzi > Upload KTP"

**And** Desktop display logic (FR-UI-77):
- Visible: ≥1024px viewport width only
- Hidden: <1024px viewport width (FR-UI-78: mobile uses back button instead)
- Position: Below top nav bar, left-aligned, 16px padding
- Background: Transparent (part of page content area)

**And** Link behavior:
- All breadcrumb segments are clickable links except last (current page)
- Last segment: Slate-700 text (not clickable)
- Other segments: Slate-500 text, hover underline, navigate on click

**And** Accessibility:
- role="navigation" with aria-label="Breadcrumb"
- Ordered list: `<ol>` with `<li>` for each segment
- aria-current="page" on last segment

**And** Test scenarios:
- Dashboard → Shows "Dashboard" only
- Jamaah list → Shows "Dashboard > Jamaah"
- Jamaah detail → Shows "Dashboard > Jamaah > Ahmad Fauzi", click "Jamaah" → Navigates to list
- Resize to mobile → Breadcrumbs hide

**Requirements Fulfilled:** FR-UI-77, FR-UI-78

---

### Story 5.4: Implement Mobile Back Button Navigation

As an agent on mobile,
I want a back button in the header instead of breadcrumbs,
So that I can navigate back with easy thumb reach.

**Acceptance Criteria:**

**Given** the mobile navigation is implemented
**When** I create the mobile back button
**Then** Mobile header component `/components/domain/navigation/mobile-header.tsx` is created with:
- Back button: ArrowLeft icon (24px), 44×44px touch target, left side (FR-UI-78)
- Page title: Centered, 18px Poppins SemiBold
- Action button: Optional, right side (e.g., "Tambah" on Jamaah list)
- Height: 56px, background: White, shadow-bottom

**And** Display logic:
- Visible: <1024px viewport width only
- Hidden: ≥1024px viewport width (breadcrumbs show instead)
- Position: Sticky top, full-width, z-index 50
- Above content, below any system status bars

**And** Back button behavior:
- Click → Navigate back in history (`router.back()`)
- If on root page (Dashboard) → Button hidden or disabled
- Keyboard: Tab to focus, Enter to go back

**And** Page title updates based on route:
- Dashboard → "Dashboard"
- Jamaah list → "Jamaah Saya"
- Jamaah detail → "{Jamaah name}" (e.g., "Ahmad Fauzi")
- Document upload → "Upload Dokumen"

**And** Accessibility:
- Back button: aria-label="Kembali" or "Go back"
- Keyboard accessible (Tab, Enter)
- Focus indicator: 2px blue ring (NFR-UI-11)

**And** Test scenarios:
- Jamaah detail page → Back button shows, click → Navigate to Jamaah list
- Dashboard → Back button hidden (root page)
- Resize to desktop → Mobile header hides, top nav + breadcrumbs show

**Requirements Fulfilled:** FR-UI-78, NFR-UI-11

---

### Story 5.5: Implement Responsive Breakpoints and Touch Interactions

As an agent,
I want the navigation to adapt to my device screen size,
So that I have an optimized experience on all devices.

**Acceptance Criteria:**

**Given** all navigation components exist (Stories 5.1-5.4)
**When** I implement responsive breakpoints
**Then** Breakpoint system is configured (FR-UI-8):
- Tailwind config updated with custom breakpoints:
  - `xs`: 320px (mobile small)
  - `sm`: 480px (mobile large)
  - `md`: 768px (tablet)
  - `lg`: 1024px (desktop)
  - `xl`: 1440px (wide desktop)

**And** Navigation behavior at each breakpoint:
- **<768px (Mobile):**
  - Bottom tab bar: Visible
  - Top nav bar: Hidden
  - Breadcrumbs: Hidden
  - Mobile header: Visible (with back button)

- **768px-1023px (Tablet):**
  - Bottom tab bar: Hidden
  - Top nav bar: Visible
  - Breadcrumbs: Visible
  - Mobile header: Hidden

- **≥1024px (Desktop):**
  - Bottom tab bar: Hidden
  - Top nav bar: Visible
  - Breadcrumbs: Visible
  - Mobile header: Hidden

**And** Touch target compliance (NFR-UI-18, NFR-UI-19):
- All interactive elements: 44×44px minimum (48×48px for primary actions)
- Spacing between touch targets: 8px minimum
- Mobile bottom tabs: 60px height (exceeds 44px minimum)

**And** Touch interactions (NFR-UI-30):
- Swipe right on mobile header → Go back (same as back button)
- Long press on navigation link → Show context menu (browser default)
- Tap: Standard 300ms delay removed (CSS: `touch-action: manipulation`)

**And** Viewport responsiveness (NFR-UI-27):
- Layout tested at: 320px, 480px, 768px, 1024px, 1440px, 3840px
- No horizontal scroll at any breakpoint
- Navigation fully functional at all sizes

**And** Test scenarios:
1. Load at 320px → Bottom tabs + mobile header visible
2. Resize to 768px → Top nav + breadcrumbs visible, bottom tabs + mobile header hidden
3. Resize to 1440px → Same as 768px, wider layout
4. Test touch interactions on mobile device → Swipe back works, no 300ms delay

**Requirements Fulfilled:** FR-UI-8, FR-UI-9, FR-UI-12, NFR-UI-18, NFR-UI-19, NFR-UI-27, NFR-UI-28, NFR-UI-30

---

## Epic 6: Form Patterns & Validation

**Epic Goal:** Forms with real-time validation, WCAG AAA accessibility, and clear Indonesian error messages reduce data entry errors.

### Story 6.1: Implement React Hook Form + Zod Validation Infrastructure
As a developer, I want React Hook Form integrated with Zod schemas, So that I can build type-safe forms with runtime validation.

**Acceptance Criteria:**
**Given** the design system is configured (Epic 1)
**When** I set up form infrastructure
**Then** dependencies installed: `react-hook-form@^7.0.0`, `zod@^3.0.0`, `@hookform/resolvers@^3.0.0`
**And** `/lib/validations/jamaah-schema.ts` created with Zod schemas for NIK (16 digits), phone (Indonesian format), etc.
**And** `/hooks/use-form-with-validation.ts` hook created wrapping useForm with Zod resolver
**And** Test form demonstrates real-time validation (FR-UI-50)
**Requirements Fulfilled:** FR-UI-47, FR-UI-50, NFR-UI-17

### Story 6.2: Create Responsive Form Layout Component
As an agent, I want forms that adapt to my device, So that data entry is easy on both mobile and desktop.

**Acceptance Criteria:**
**Given** form infrastructure exists (Story 6.1)
**When** I create form layout component
**Then** `/components/domain/forms/form-layout.tsx` created with:
- Single-column on mobile (<1024px), 2-column on desktop (≥1024px) (FR-UI-47)
- Field groups with labels and descriptions
**And** Input height minimum 44px (FR-UI-48, NFR-UI-18)
**Requirements Fulfilled:** FR-UI-47, FR-UI-48, NFR-UI-18

### Story 6.3: Implement Real-Time Format Validation
As an agent, I want immediate feedback on format errors, So that I can correct them before submitting.

**Acceptance Criteria:**
**Given** form with validation exists
**When** I implement real-time validation
**Then** NIK field validates 16 digits on input change (FR-UI-50)
**And** Phone validates Indonesian format (+62 or 08) on change
**And** Invalid format shows red border + error message immediately
**Requirements Fulfilled:** FR-UI-50, FR-UI-52

### Story 6.4: Implement On-Blur Required Field Validation
As an agent, I want required fields to validate when I leave them, So that I know what's missing before submitting.

**Acceptance Criteria:**
**Given** form exists
**When** I implement on-blur validation
**Then** Required fields show error on blur if empty (FR-UI-51)
**And** Error message: "{Field} wajib diisi" (Indonesian) (NFR-UI-16, NFR-UI-17)
**And** Red asterisk + "(required)" text displayed (FR-UI-49)
**Requirements Fulfilled:** FR-UI-49, FR-UI-51, NFR-UI-16, NFR-UI-17

### Story 6.5: Implement Success State with Visual Feedback
As an agent, I want fields to show success state after validation, So that I know the data is correct.

**Acceptance Criteria:**
**Given** form validation exists
**When** field validates successfully
**Then** Green border + CheckCircle icon displayed (FR-UI-53)
**And** Success state appears for 2 seconds then returns to default
**Requirements Fulfilled:** FR-UI-53

### Story 6.6: Ensure WCAG AAA Accessibility Compliance
As an agent with accessibility needs, I want fully accessible forms, So that I can complete tasks independently.

**Acceptance Criteria:**
**Given** all form components exist
**When** I verify accessibility
**Then** Color contrast ≥7:1 for normal text (NFR-UI-8, NFR-UI-9)
**And** All inputs keyboard accessible (Tab, Shift+Tab) (NFR-UI-10)
**And** Focus indicators: 2px blue ring, 4px offset (NFR-UI-11)
**And** Labels with htmlFor linking to inputs
**And** aria-describedby for error messages (NFR-UI-13)
**And** aria-invalid="true" on error state
**And** aria-live="polite" for dynamic validation messages (NFR-UI-14)
**And** Layout stable at 200% zoom (NFR-UI-15)
**And** Tooltips for complex fields (NFR-UI-20)
**Requirements Fulfilled:** NFR-UI-8 to NFR-UI-15, NFR-UI-20

---

## Epic 7: Feedback, Loading, & Empty States

**Epic Goal:** Users always understand system status—skeleton loading shows structure, progress shows completion, toasts confirm actions.

### Story 7.1: Create Skeleton Loading Components
As an agent, I want skeleton loading to appear immediately, So that I know the page is loading.

**Acceptance Criteria:**
**Given** design system exists (Epic 1 Story 1.8 created skeleton.tsx)
**When** I implement skeleton patterns
**Then** Skeleton components for: KPICard, TableRow, Card
**And** Shimmer animation left-to-right (FR-UI-55)
**And** Appears within 100ms of page load (NFR-UI-7)
**Requirements Fulfilled:** FR-UI-54, FR-UI-55, NFR-UI-7

### Story 7.2: Implement Button Loading States
As an agent, I want buttons to show loading state, So that I know my action is processing.

**Acceptance Criteria:**
**Given** button component exists (Epic 1)
**When** button is loading
**Then** Spinner icon + "Loading..." or "Memproses..." text (FR-UI-56)
**And** Button disabled during loading
**And** Indonesian text: "Menyimpan...", "Mengirim..." based on action (NFR-UI-16)
**Requirements Fulfilled:** FR-UI-56, NFR-UI-16

### Story 7.3: Create Toast Notification System
As an agent, I want toast notifications for feedback, So that I know actions succeeded or failed.

**Acceptance Criteria:**
**Given** Sonner library installed (Epic 1 Story 1.5)
**When** I configure toast system
**Then** Success toast: Green checkmark, 4-second auto-dismiss (FR-UI-69)
**And** Error toast: Red X, 8-second auto-dismiss (FR-UI-70)
**And** Position: Bottom-right (desktop ≥1024px), top-center (mobile <768px) (FR-UI-71)
**And** Indonesian messages, max 60 chars (FR-UI-73, NFR-UI-16)
**And** aria-live="polite" for screen readers (NFR-UI-14)
**Requirements Fulfilled:** FR-UI-69, FR-UI-70, FR-UI-71, FR-UI-73, NFR-UI-14, NFR-UI-16

### Story 7.4: Create Warning Alert Banner Component
As an agent, I want persistent warnings for important info, So that I don't miss critical alerts.

**Acceptance Criteria:**
**Given** design system exists
**When** I create alert banner
**Then** Amber background, AlertTriangle icon, dismissible (FR-UI-72)
**And** Position: Above content, full-width
**And** Examples: "Pembayaran jatuh tempo besok", "Dokumen belum lengkap"
**Requirements Fulfilled:** FR-UI-72

### Story 7.5: Create Encouraging Empty State Components
As an agent with no data, I want encouraging guidance, So that I know what to do next.

**Acceptance Criteria:**
**Given** empty data scenarios exist
**When** I create empty states
**Then** Empty jamaah: "Belum ada jamaah" + "Tambah Jamaah Baru" (FR-UI-59)
**And** No search results: "Tidak ada hasil untuk '{query}'" + "Hapus Filter" (FR-UI-60)
**And** No documents: "Belum ada dokumen" + "Upload Dokumen" (FR-UI-61)
**And** Tone encouraging, NOT negative (FR-UI-62): "Belum ada" not "Tidak ada"
**And** Icon + heading + description + primary action button
**Requirements Fulfilled:** FR-UI-59, FR-UI-60, FR-UI-61, FR-UI-62

---

## Epic 8: Modal & Overlay System

**Epic Goal:** Device-optimized overlays with accessibility—desktop centered modals, mobile bottom sheets for better thumb reach.

### Story 8.1: Configure shadcn/ui Dialog for Desktop Modals
As an agent on desktop, I want centered modals with backdrop, So that I can focus on the modal content.

**Acceptance Criteria:**
**Given** shadcn/ui Dialog installed (Epic 1 Story 1.5)
**When** I configure desktop modal pattern
**Then** Max-width 600px, centered, backdrop blur (FR-UI-63)
**And** Focus trap: Tab cycles within (FR-UI-66)
**And** Escape to close (FR-UI-67)
**And** Focus returns to trigger after close (FR-UI-68)
**And** aria-modal="true", role="dialog"
**Requirements Fulfilled:** FR-UI-63, FR-UI-66, FR-UI-67, FR-UI-68

### Story 8.2: Configure shadcn/ui Sheet for Mobile Bottom Sheets
As an agent on mobile, I want bottom sheets for easy reach, So that I can interact comfortably.

**Acceptance Criteria:**
**Given** shadcn/ui Sheet installed (Epic 1 Story 1.5)
**When** I configure mobile sheet pattern
**Then** Slides from bottom, drag handle 4px × 32px (FR-UI-64, FR-UI-65)
**And** Backdrop click closes (FR-UI-67)
**And** Swipe down to dismiss (NFR-UI-30)
**And** Focus management same as dialog (FR-UI-66, FR-UI-68)
**Requirements Fulfilled:** FR-UI-64, FR-UI-65, FR-UI-66, FR-UI-67, FR-UI-68, NFR-UI-30

### Story 8.3: Create Responsive Modal Wrapper Component
As a developer, I want a modal component that adapts to device, So that I write one component for both desktop and mobile.

**Acceptance Criteria:**
**Given** Dialog and Sheet configured
**When** I create responsive modal wrapper
**Then** Desktop (≥1024px): Renders Dialog
**And** Mobile (<1024px): Renders Sheet
**And** Same props interface, automatic responsive switching
**And** Test demonstrates automatic adaptation

---

## Epic 9: Agency Owner Dashboard & Analytics

**Epic Goal:** Operational visibility for strategic decisions—revenue trends, agent performance leaderboard, pipeline status.

### Story 9.1: Create Personalized Time-Based Greeting
As an agency owner, I want a personalized greeting, So that I feel welcomed.

**Acceptance Criteria:**
**Given** dashboard page exists
**When** owner loads dashboard
**Then** Greeting displays: "Selamat Pagi, Pak Hadi!" (5am-11am), "Selamat Siang, Pak Hadi!" (11am-3pm), "Selamat Sore, Pak Hadi!" (3pm-6pm), "Selamat Malam, Pak Hadi!" (6pm-5am) (FR-UI-79)
**And** Name pulled from user context (logged-in owner)
**Requirements Fulfilled:** FR-UI-79

### Story 9.2: Create Owner KPI Cards (Revenue, Projection, Pipeline)
As an agency owner, I want financial KPIs, So that I can track business performance.

**Acceptance Criteria:**
**Given** KPICard component exists (Epic 2 Story 2.1)
**When** I create owner KPI cards
**Then** Three cards: Total Revenue (Rp), 3-Month Projection (Rp), Pipeline Potential (Rp) (FR-UI-80)
**And** Numbers: 48px Poppins Bold (FR-UI-84)
**And** Trend indicators: ↑ green (+15%), ↓ red (-5%), → gray (0%)
**And** Gradient backgrounds: Blue (revenue), Gold (projection), Green (pipeline)
**Requirements Fulfilled:** FR-UI-80, FR-UI-84

### Story 9.3: Create Agent Performance Leaderboard
As an agency owner, I want to see top-performing agents, So that I can recognize success.

**Acceptance Criteria:**
**Given** dashboard exists
**When** I create leaderboard component
**Then** Top 5 agents displayed (FR-UI-81)
**And** Columns: Rank, Agent Name, Revenue, Conversions, Badge (Gold/Silver/Bronze for top 3)
**And** Responsive: Card view on mobile, table on desktop
**Requirements Fulfilled:** FR-UI-81

### Story 9.4: Create Jamaah Pipeline Breakdown Chart
As an agency owner, I want pipeline visualization, So that I can see jamaah status distribution.

**Acceptance Criteria:**
**Given** dashboard exists
**When** I create pipeline chart
**Then** Donut chart showing: Urgent (red), Soon (amber), Ready (green), Completed (blue) (FR-UI-82)
**And** Legend with counts: "5 Urgent, 8 Soon, 42 Ready, 120 Completed"
**And** Click segment → Filters to that status
**Requirements Fulfilled:** FR-UI-82

### Story 9.5: Implement Real-Time WebSocket Updates
As an agency owner, I want live updates for payments, So that I see changes immediately.

**Acceptance Criteria:**
**Given** dashboard exists
**When** payment received or inventory updated
**Then** WebSocket client listens for events (FR-UI-83)
**And** KPI cards update in real-time (no page refresh)
**And** Toast notification: "Pembayaran baru diterima: Rp 5.000.000"
**Requirements Fulfilled:** FR-UI-83

---

## Epic 10: Landing Page Builder for Agents

**Epic Goal:** 20+ passive leads/month per agent through customizable landing pages shared on WhatsApp Status, Facebook, Instagram.

### Story 10.1: Create Package Selection Interface
As an agent, I want to select a package for my landing page, So that I can promote specific offerings.

**Acceptance Criteria:**
**Given** landing page builder route exists `/landing-page/builder`
**When** I create package selector
**Then** Dropdown with packages: "Umroh 9 Hari", "Umroh 12 Hari", "Umroh Plus Turki" (FR-UI-85)
**And** Package details auto-populate: Price, duration, highlights
**Requirements Fulfilled:** FR-UI-85

### Story 10.2: Create Agent Branding Form
As an agent, I want to add my branding, So that leads know who to contact.

**Acceptance Criteria:**
**Given** package selected (Story 10.1)
**When** I add branding
**Then** Form fields: Agent name, photo upload (max 2MB), phone number, WhatsApp number (FR-UI-86)
**And** Photo preview shows after upload
**And** Validation: All fields required
**Requirements Fulfilled:** FR-UI-86

### Story 10.3: Implement Live Preview Panel
As an agent, I want to see live preview, So that I can visualize the final page.

**Acceptance Criteria:**
**Given** form data entered (Stories 10.1, 10.2)
**When** I type or upload
**Then** Preview updates in real-time (FR-UI-87)
**And** Preview shows: Package header image, agent photo, name, WhatsApp CTA button (green #25D366) (FR-UI-88)
**And** Responsive preview: Mobile and desktop views toggleable
**Requirements Fulfilled:** FR-UI-87, FR-UI-88

### Story 10.4: Implement Landing Page Generation & Social Sharing
As an agent, I want to share my landing page, So that I can generate leads.

**Acceptance Criteria:**
**Given** preview complete (Story 10.3)
**When** I click "Generate Landing Page"
**Then** Page created with unique URL: `/lp/agent-{agentId}-{packageId}`
**And** Share buttons: WhatsApp Status, Facebook, Instagram (one-click) (FR-UI-89)
**And** Copy URL button with toast: "URL disalin"
**And** WhatsApp share pre-fills message: "Lihat paket Umroh saya: {url}"
**Requirements Fulfilled:** FR-UI-89

### Story 10.5: Implement Analytics Tracking Dashboard
As an agent, I want to track landing page performance, So that I know if it's effective.

**Acceptance Criteria:**
**Given** landing page published (Story 10.4)
**When** I view analytics
**Then** Dashboard shows: Views (total visits), Clicks (WhatsApp CTA), Conversions (lead form submissions) (FR-UI-90)
**And** Chart: Views over time (last 7/30 days)
**And** Real-time counter: "5 views today"
**Requirements Fulfilled:** FR-UI-90

---

## Epic 11: Adaptive Density Modes (Bu Ratna → Mbak Rina)

**Epic Goal:** Optimized UI density for all proficiency levels—Simplified (Bu Ratna), Standard (Ibu Siti), Power (Mbak Rina).

### Story 11.1: Create Density Mode Switcher in Settings
As an agent, I want to choose my UI density, So that I can work comfortably.

**Acceptance Criteria:**
**Given** settings page exists `/settings`
**When** I create density switcher
**Then** Three options: Simplified, Standard (default), Power (FR-UI-91, FR-UI-95)
**And** Radio buttons with descriptions:
- Simplified: "Tampilan sederhana dengan tombol besar"
- Standard: "Tampilan standar dengan tabel dan kartu"
- Power: "Tampilan padat untuk pengguna mahir"
**And** Selection saved to user preferences (localStorage or backend)
**Requirements Fulfilled:** FR-UI-91, FR-UI-95

### Story 11.2: Implement Simplified Mode Layout
As Bu Ratna (low tech-savvy), I want a simple interface, So that I'm not overwhelmed.

**Acceptance Criteria:**
**Given** density mode = Simplified
**When** dashboard loads
**Then** Table hidden, only KPI cards visible (FR-UI-92)
**And** Three large action buttons (56px height): "Tambah Jamaah", "Lihat Semua", "Hubungi Admin"
**And** Icons: Large 32px, clear labels
**And** Auto-selected for first 3 logins (new user default)
**Requirements Fulfilled:** FR-UI-92

### Story 11.3: Implement Standard Mode Layout
As Ibu Siti (typical agent), I want full hybrid dashboard, So that I can see all information.

**Acceptance Criteria:**
**Given** density mode = Standard
**When** dashboard loads
**Then** Full hybrid: KPI cards (3-column) + filtered table below (FR-UI-93)
**And** Default mode after 10+ actions (graduated from Simplified)
**Requirements Fulfilled:** FR-UI-93

### Story 11.4: Implement Power Mode Layout
As Mbak Rina (admin, high proficiency), I want dense information display, So that I can work faster.

**Acceptance Criteria:**
**Given** density mode = Power
**When** dashboard loads
**Then** KPI cards minimized (single horizontal row, 80px height) (FR-UI-94)
**And** Table maximized: Compact row height (36px vs 48px), more columns visible
**And** Keyboard shortcuts enabled: K (add jamaah), F (filter), S (search)
**And** Tooltips on hover instead of always-visible labels
**Requirements Fulfilled:** FR-UI-94

### Story 11.5: Implement Auto-Detection Based on Usage Patterns
As an agent, I want the system to suggest the right mode, So that I have the best experience.

**Acceptance Criteria:**
**Given** user has used system for several sessions
**When** usage patterns analyzed
**Then** Auto-suggest mode:
- First 3 logins → Simplified (onboarding)
- After 10+ actions → Suggest upgrade to Standard (toast: "Upgrade ke Standard mode?")
- After 50+ actions + keyboard usage → Suggest Power (toast: "Coba Power mode untuk efisiensi lebih?")
**And** User can accept or dismiss suggestion
**And** Preference remembered

---

## Frontend Epic & Story Summary

**Total Frontend Epics:** 11
**Total Stories Created:** 62

### Epic Breakdown:
- **Epic 1** (Design System): 8 stories
- **Epic 2** (Dashboard): 9 stories
- **Epic 3** (Bulk Operations): 4 stories
- **Epic 4** (Document/OCR): 6 stories
- **Epic 5** (Navigation): 5 stories
- **Epic 6** (Forms): 6 stories
- **Epic 7** (Feedback): 5 stories
- **Epic 8** (Modals): 3 stories
- **Epic 9** (Owner Dashboard): 5 stories
- **Epic 10** (Landing Pages): 5 stories
- **Epic 11** (Density Modes): 5 stories

### Coverage:
✅ **All 95 Functional Requirements Covered**
✅ **All 34 Non-Functional Requirements Covered**
✅ **Ready for Frontend Implementation**
