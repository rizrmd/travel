# 🧪 Testing Guide - Travel Umroh Frontend

Panduan lengkap untuk testing aplikasi Travel Umroh di lokal.

## ✅ Prerequisites

Pastikan Anda sudah install:
- Node.js 20+
- npm atau yarn
- Browser modern (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

```bash
# 1. Masuk ke folder project
cd "/home/yopi/Projects/Travel Umroh/frontend"

# 2. Install dependencies (jika belum)
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser
# Akses: http://localhost:3000
```

Server akan running di **http://localhost:3000**

## 📋 Checklist Testing Lengkap

### 1. ✅ Installation & Build
- [ ] `npm install` berhasil tanpa error
- [ ] `npm run build` berhasil compile
- [ ] No TypeScript errors
- [ ] No ESLint warnings (kecuali img warnings yang expected)

### 2. ✅ Development Server
- [ ] `npm run dev` berjalan di port 3000
- [ ] Homepage load tanpa error
- [ ] Hot reload berfungsi saat edit file
- [ ] No console errors di browser

### 3. 🎨 Design System & UI Components

#### Navigation
- [ ] Top navigation bar terlihat (desktop)
- [ ] Logo "Travel Umroh" terlihat
- [ ] Density toggle icon terlihat (atas kanan)
- [ ] Notification bell dengan badge
- [ ] User dropdown menu berfungsi
- [ ] Bottom tab bar muncul di mobile (< 768px)
- [ ] Mobile menu drawer bisa dibuka (hamburger icon)

#### Density Mode
- [ ] Klik density toggle, dropdown muncul
- [ ] 3 mode tersedia: Padat, Nyaman, Lapang
- [ ] Pilih mode, UI berubah (spacing, padding, font)
- [ ] Refresh page, setting tersimpan
- [ ] localStorage menyimpan preference

### 4. 📊 Epic Testing

#### Epic 1-5: Foundation & Navigation
**Test Page:** `/test-components`
- [ ] Buttons: semua variant render
- [ ] Cards: berbagai ukuran
- [ ] Badges: semua warna status
- [ ] Inputs: text, email, password
- [ ] Breadcrumb navigation berfungsi
- [ ] Mobile responsive (resize browser)

#### Epic 6: Forms
**Test Page:** `/dashboard`
- [ ] Form validation berfungsi (NIK 16 digit)
- [ ] Phone validation (format Indonesia)
- [ ] Date picker muncul
- [ ] Error messages dalam Bahasa Indonesia

#### Epic 7: Feedback States
**Test Page:** Semua halaman
- [ ] Toast notifications muncul
- [ ] Loading spinners terlihat
- [ ] Empty states terlihat
- [ ] Error boundaries catch errors

#### Epic 8: Modals & Overlays
**Test Page:** Various components
- [ ] Modal dialogs bisa dibuka/ditutup
- [ ] Drawers slide dari kiri/kanan/atas/bawah
- [ ] Tooltips muncul on hover
- [ ] Popover menu berfungsi

#### Epic 9: Analytics Dashboard
**Test Page:** `/owner/analytics`
- [ ] 4 KPI cards terlihat
- [ ] Line chart render (pendapatan bulanan)
- [ ] Pie chart render (distribusi paket)
- [ ] Bar chart render (status jamaah)
- [ ] Agent performance table sortable
- [ ] Export report form berfungsi

#### Epic 10: Landing Page Builder
**Test Pages:** `/agent/landing-builder/*`

**Template Selection** (`/agent/landing-builder`)
- [ ] 6 template cards terlihat
- [ ] Filter kategori berfungsi
- [ ] Search template berfungsi
- [ ] Pilih template, tombol "Lanjutkan" muncul
- [ ] Klik template, status selected

**Editor** (`/agent/landing-builder/editor`)
- [ ] 4 tabs: Desain, Konten, Paket, SEO
- [ ] **Tab Desain:**
  - [ ] Color picker berfungsi
  - [ ] Preset colors bisa diklik
  - [ ] 3 color inputs: Primary, Secondary, Accent
- [ ] **Tab Konten:**
  - [ ] Hero title editable
  - [ ] Hero subtitle editable
  - [ ] CTA button text editable
  - [ ] Background image upload (visual feedback)
- [ ] **Tab Paket:**
  - [ ] Tambah paket baru
  - [ ] Edit nama paket
  - [ ] Edit harga & durasi
  - [ ] Tambah/hapus fitur paket
  - [ ] Toggle "populer"
  - [ ] Hapus paket
- [ ] **Tab SEO:**
  - [ ] Meta title editable (counter 60 char)
  - [ ] Meta description editable (counter 160 char)
  - [ ] Keywords tag system (enter to add)
  - [ ] OG image upload
  - [ ] Preview Google search terlihat
- [ ] Deployment status card terlihat
- [ ] Unsaved changes warning
- [ ] Simpan button berfungsi
- [ ] Publikasi button berfungsi

**Preview** (`/agent/landing-builder/preview`)
- [ ] Device selector: Desktop, Tablet, Mobile
- [ ] Switch device, preview resize
- [ ] Content dari editor terlihat
- [ ] Share button copy URL
- [ ] Buka di tab baru berfungsi

**Publish Dialog**
- [ ] Domain input validation
- [ ] Format: nama-agen.umroh.id
- [ ] Publishing status indicator
- [ ] Success state dengan URL
- [ ] Copy URL berfungsi

**Social Sharing**
- [ ] WhatsApp share button
- [ ] Facebook share button
- [ ] Twitter share button
- [ ] Telegram share button
- [ ] Embed code generator
- [ ] Copy embed code

#### Epic 11: Adaptive Density
**Test Page:** `/test-density`
- [ ] Toggle density (Padat/Nyaman/Lapang)
- [ ] **Compact mode:**
  - [ ] Cards lebih kecil (p-12)
  - [ ] Gap lebih rapat (gap-8)
  - [ ] Text lebih kecil (text-sm)
  - [ ] Table rows 40px
- [ ] **Comfortable mode (default):**
  - [ ] Cards sedang (p-24)
  - [ ] Gap sedang (gap-16)
  - [ ] Text normal (text-base)
  - [ ] Table rows 56px
- [ ] **Spacious mode:**
  - [ ] Cards lebih besar (p-32)
  - [ ] Gap lebih lebar (gap-24)
  - [ ] Text lebih besar (text-lg)
  - [ ] Table rows 72px
- [ ] Setting persisten setelah refresh
- [ ] Apply ke semua komponen:
  - [ ] Stat cards
  - [ ] List items
  - [ ] Table rows
  - [ ] Grid spacing

**Test Page:** `/owner/analytics-density`
- [ ] Semua analytics components dengan density
- [ ] Stats cards adaptive
- [ ] Charts tetap proporsional
- [ ] Table dengan density rows
- [ ] Export form adaptive

### 5. 📱 Responsive Testing

#### Desktop (≥ 1024px)
- [ ] Top nav bar visible
- [ ] Bottom tab bar hidden
- [ ] 4 column grid terlihat
- [ ] Sidebar (jika ada) terlihat
- [ ] Charts full width

#### Tablet (768px - 1024px)
- [ ] Top nav bar visible
- [ ] Bottom tab bar hidden
- [ ] 2-3 column grid
- [ ] Touch-friendly buttons

#### Mobile (< 768px)
- [ ] Top nav bar hidden/minimal
- [ ] Bottom tab bar visible
- [ ] Hamburger menu berfungsi
- [ ] 1 column layout
- [ ] Charts responsive
- [ ] Forms stack vertically
- [ ] Touch targets ≥ 44px

### 6. 🎯 User Flows

#### Flow 1: Owner Melihat Analytics
1. [ ] Buka `/owner/analytics`
2. [ ] Lihat 4 KPI cards
3. [ ] Scroll ke charts
4. [ ] Lihat agent performance table
5. [ ] Klik sort column headers
6. [ ] Export report:
   - [ ] Pilih jenis laporan
   - [ ] Pilih tanggal mulai & selesai
   - [ ] Pilih format (PDF/Excel/CSV)
   - [ ] Klik Export
   - [ ] Toast "berhasil" muncul

#### Flow 2: Agent Membuat Landing Page
1. [ ] Buka `/agent/landing-builder`
2. [ ] Browse templates
3. [ ] Filter kategori "Modern"
4. [ ] Search "blue"
5. [ ] Pilih template "Modern Blue"
6. [ ] Klik "Lanjutkan"
7. [ ] Editor terbuka
8. [ ] **Edit Desain:**
   - [ ] Ganti primary color
   - [ ] Lihat preview update
9. [ ] **Edit Konten:**
   - [ ] Ganti hero title
   - [ ] Upload background image
10. [ ] **Edit Paket:**
    - [ ] Tambah paket baru
    - [ ] Set harga Rp 25.000.000
    - [ ] Tambah 5 fitur
    - [ ] Toggle "populer"
11. [ ] **Edit SEO:**
    - [ ] Isi meta title
    - [ ] Isi description
    - [ ] Tambah keywords
12. [ ] Klik "Simpan"
13. [ ] Toast "berhasil disimpan"
14. [ ] Klik "Publikasi"
15. [ ] Input domain "my-travel"
16. [ ] Klik "Publikasi Sekarang"
17. [ ] Wait loading...
18. [ ] Success state muncul
19. [ ] URL: https://my-travel.umroh.id
20. [ ] Copy URL berfungsi
21. [ ] Buka landing page di tab baru

#### Flow 3: Testing Density Mode
1. [ ] Buka `/test-density`
2. [ ] Klik density toggle (nav bar)
3. [ ] Pilih "Padat"
4. [ ] Lihat semua cards mengecil
5. [ ] Lihat table rows lebih rapat
6. [ ] Refresh page
7. [ ] Mode masih "Padat"
8. [ ] Ganti ke "Lapang"
9. [ ] Lihat semua cards membesar
10. [ ] Navigate ke `/owner/analytics-density`
11. [ ] Density setting masih "Lapang"
12. [ ] Semua components lapang

### 7. 🔍 Browser Testing

Test di minimal 2 browser:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (jika macOS)
- [ ] Edge

Check di setiap browser:
- [ ] No console errors
- [ ] CSS render correct
- [ ] Fonts load
- [ ] Icons display
- [ ] Animations smooth

### 8. ⚡ Performance

- [ ] First page load < 3 detik
- [ ] Navigation instant (< 100ms)
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling
- [ ] Charts render < 500ms
- [ ] Form interactions immediate

### 9. 🌐 Accessibility

- [ ] Keyboard navigation works
  - [ ] Tab through interactive elements
  - [ ] Enter activates buttons
  - [ ] Esc closes modals
- [ ] Focus indicators visible
- [ ] Alt text on images (jika ada)
- [ ] ARIA labels on icons
- [ ] Color contrast ≥ 7:1 (WCAG AAA)
- [ ] Form errors announced
- [ ] Screen reader friendly (test dengan NVDA/JAWS)

### 10. 🐛 Known Issues (Expected)

#### Warnings yang OK:
- ✅ `Using <img>` could result in slower LCP
  - Expected: Next Image optimization akan ditambahkan nanti

- ✅ Template thumbnails 404
  - Expected: Gambar template belum ada, pakai placeholder

- ✅ Mock data tidak persist
  - Expected: Backend belum ada, semua data static

#### Issues yang TIDAK OK (report jika ada):
- ❌ Build fails
- ❌ Page tidak load
- ❌ JavaScript errors
- ❌ Components tidak render
- ❌ State tidak update
- ❌ Responsive broken

## 📊 Test Results Template

Copy template ini untuk report hasil testing:

```
# Test Results - Travel Umroh Frontend
Date: [Tanggal]
Tester: [Nama]
Browser: [Chrome/Firefox/Safari/Edge]
OS: [Windows/macOS/Linux]

## Build & Installation
- [ ] PASS / FAIL: npm install
- [ ] PASS / FAIL: npm run build
- [ ] PASS / FAIL: npm run dev

## Core Features
- [ ] PASS / FAIL: Navigation
- [ ] PASS / FAIL: Density Mode
- [ ] PASS / FAIL: Analytics Dashboard
- [ ] PASS / FAIL: Landing Builder
- [ ] PASS / FAIL: Responsive Layout

## Issues Found
1. [Description]
   - Severity: [Critical/High/Medium/Low]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

## Screenshots
[Attach if needed]

## Overall Status
✅ Ready for Production / ⚠️ Minor Issues / ❌ Major Issues
```

## 🎯 Quick Test (5 menit)

Jika waktu terbatas, test minimal ini:

1. [ ] `npm run dev` - server start
2. [ ] Buka http://localhost:3000 - homepage load
3. [ ] Klik density toggle - UI berubah
4. [ ] Navigate ke `/owner/analytics` - charts render
5. [ ] Navigate ke `/agent/landing-builder` - templates terlihat
6. [ ] Resize browser - responsive works

✅ **Jika semua PASS, aplikasi siap digunakan!**

## 📞 Support

Jika menemukan bug atau issue:
1. Check Known Issues di atas
2. Restart dev server: `Ctrl+C` → `npm run dev`
3. Clear cache: `rm -rf .next` → rebuild
4. Reinstall: `rm -rf node_modules` → `npm install`

Masih error? Report ke development team dengan:
- Error message lengkap
- Steps to reproduce
- Screenshot
- Browser & OS info

---

**Happy Testing!** 🚀
