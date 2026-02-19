# Travel Umroh - Frontend Management System

Sistem manajemen agen travel umroh berbasis Next.js dengan fitur lengkap untuk mengelola jamaah, dokumen, paket, analytics, dan landing page builder.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Tables**: TanStack Table v8
- **Notifications**: Sonner
- **Date Handling**: date-fns (Indonesian locale)

## ✨ Features

### Epic 1: Design System & Foundation
- Design tokens (colors, typography, spacing)
- Responsive breakpoints (320px - 1440px)
- Component library (Button, Card, Badge, Input, etc.)
- WCAG AAA accessibility compliance

### Epic 2: Agent Dashboard
- KPI cards dengan trend indicators
- Recent activities timeline
- Task lists dengan priority
- Quick actions shortcuts

### Epic 3: Bulk Operations & WhatsApp
- CSV import/export jamaah
- Bulk status updates
- WhatsApp broadcast templates
- Data validation & error handling

### Epic 4: Document Upload & OCR
- Drag & drop file upload
- KTP/Passport OCR auto-fill
- Document preview & management
- File type & size validation

### Epic 5: Responsive Navigation & Layout
- Top navigation bar (desktop)
- Bottom tab bar (mobile)
- Breadcrumb navigation
- Mobile menu drawer

### Epic 6: Form Patterns & Validation
- Indonesian-specific validation (NIK, phone)
- Date/time pickers with locale
- Multi-step form wizard
- Auto-save functionality

### Epic 7: Feedback & Loading States
- Loading spinners & skeletons
- Error boundaries
- Empty states
- Toast notifications
- Confirmation dialogs

### Epic 8: Modal & Overlay System
- Modal dialogs (sm/md/lg/xl/full)
- Slide-out drawers (top/right/bottom/left)
- Tooltips & popovers
- Menu popovers

### Epic 9: Analytics & Owner Dashboard
- Revenue charts (line, bar, pie)
- KPI tracking
- Agent performance metrics
- Export reports (PDF, Excel, CSV)

### Epic 10: Landing Page Builder
- 6 pre-built templates
- Visual editor (colors, content, packages)
- Device preview (desktop/tablet/mobile)
- Publish & deployment flow
- SEO & social sharing settings

### Epic 11: Adaptive Density Modes
- 3 density modes: Compact, Comfortable, Spacious
- Persistent user preference (localStorage)
- Auto-adjusting components (cards, tables, lists)
- Toggle UI in navigation bar

## 📦 Installation

```bash
# Clone repository (jika belum)
git clone <repository-url>
cd "Travel Umroh/frontend"

# Install dependencies
npm install

# Copy environment file (opsional untuk saat ini)
cp .env.example .env.local
```

## 🚀 Running Development Server

### **Recommended: Use dev.sh (Automated)**

```bash
# One command - handles everything!
./dev.sh
```

**Features:**
- ✅ Auto-checks Node.js & npm
- ✅ Auto-cleans ports
- ✅ Auto-installs dependencies
- ✅ Beautiful colored output
- ✅ Shows all URLs & pages
- ✅ Auto-cleanup on Ctrl+C
- ✅ Logs to `nextjs.log`

See **[DEV-SCRIPT.md](DEV-SCRIPT.md)** for complete guide.

### **Alternative: Manual**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

### Recommended

```bash
./dev.sh            # 🌟 Start dev server with auto-setup & monitoring
```

### Manual npm scripts

```bash
npm run dev         # Start dev server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

**Tip:** Use `./dev.sh` for better developer experience!

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout dengan DensityProvider
│   ├── agent/                   # Agent role pages
│   │   └── landing-builder/    # Landing page builder
│   ├── owner/                   # Owner role pages
│   │   ├── analytics/          # Analytics dashboard
│   │   └── analytics-density/  # Analytics dengan density mode
│   ├── dashboard/               # Shared dashboard pages
│   └── test-*/                  # Test pages untuk development
│
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui base components
│   ├── analytics/               # Analytics-specific components
│   ├── density/                 # Density mode components
│   ├── feedback/                # Loading, error, empty states
│   ├── forms/                   # Form components
│   ├── landing-builder/         # Landing page builder
│   │   ├── editor/             # Content & package editors
│   │   ├── preview/            # Device preview
│   │   ├── publish/            # Publish & deployment
│   │   └── seo/                # SEO & social sharing
│   ├── layout/                  # Layout components
│   ├── navigation/              # Navigation components
│   └── overlays/                # Modals, drawers, tooltips
│
├── lib/                          # Utilities & helpers
│   ├── data/                    # Mock data
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   └── validation/              # Zod schemas
│
├── public/                       # Static assets
└── styles/                       # Global styles
    └── globals.css              # Tailwind directives
```

## 🎨 Design System

### Colors
- **Primary**: Blue #2563EB
- **Status**:
  - Urgent: Red #EF4444
  - Soon: Orange #D97706
  - Ready: Green #10B981

### Typography
- **Body**: Inter
- **Display/Headings**: Poppins

### Spacing Scale
4px base unit: 4, 8, 12, 16, 24, 32, 48, 64px

### Breakpoints
- Mobile: 320px
- Small: 480px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px

## 🧪 Testing Pages

Development test pages untuk melihat komponen:

- **/** - Homepage placeholder
- **/test-components** - Component showcase
- **/test-density** - Density mode showcase dengan semua komponen
- **/dashboard** - Dashboard utama
- **/dashboard/test-kpi** - KPI cards showcase
- **/owner/analytics** - Analytics dashboard lengkap
- **/owner/analytics-density** - Analytics dengan density mode
- **/agent/landing-builder** - Landing page builder (template selection)
- **/agent/landing-builder/editor** - Landing page editor
- **/agent/landing-builder/preview** - Landing page preview

## 🎯 Cara Test Lokal

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Buka Browser** ke `http://localhost:3000`

3. **Test Halaman-Halaman Utama:**
   - `/test-density` - Lihat density mode action (toggle di nav bar)
   - `/owner/analytics` - Lihat charts dan analytics
   - `/agent/landing-builder` - Lihat template gallery
   - `/agent/landing-builder/editor` - Lihat editor (pilih template dulu)

4. **Test Density Mode:**
   - Klik icon density di navigation bar (atas kanan)
   - Pilih mode: Compact / Comfortable / Spacious
   - Lihat perubahan spacing, padding, font size
   - Refresh page - setting tersimpan di localStorage

5. **Test Responsive:**
   - Resize browser window
   - Check mobile view (< 768px) - bottom tab bar muncul
   - Check tablet view (768px - 1024px)
   - Check desktop view (> 1024px)

## 🔐 Authentication (Future)

⚠️ **PENTING**: Saat ini aplikasi belum terintegrasi dengan backend authentication. 
Semua halaman dapat diakses langsung untuk development/testing.

**Planned roles:**
- Owner (Pemilik Usaha)
- Agent (Agen Travel)
- Admin (Administrator)

## 📊 Data

Aplikasi menggunakan mock data untuk development:
- `/lib/data/mock-analytics.ts` - Analytics data
- `/lib/data/mock-templates.ts` - Landing page templates

Semua data saat ini **static** dan **tidak tersimpan** ke database.

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication & authorization
- [ ] Database integration (PostgreSQL)
- [ ] Real-time notifications
- [ ] WhatsApp API integration
- [ ] OCR service integration
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Actual file upload & storage

## 📝 Component Usage Examples

### Density Mode
```tsx
import { useDensity } from '@/lib/hooks/use-density'
import { DensityCard } from '@/components/density/density-card'

function MyComponent() {
  const { density } = useDensity() // 'compact' | 'comfortable' | 'spacious'

  return (
    <DensityCard title="My Card">
      Content auto-adjusts based on density mode
    </DensityCard>
  )
}
```

### Toast Notifications
```tsx
import { toast } from '@/lib/utils/toast'

toast.success('Operasi berhasil!')
toast.error('Terjadi kesalahan')
toast.warning('Peringatan')
toast.info('Informasi')
```

### Form Validation
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nikSchema, phoneSchema } from '@/lib/validation/schemas'
import { z } from 'zod'

const schema = z.object({
  nik: nikSchema,
  phone: phoneSchema,
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

## ✅ Checklist Testing Lokal

- [ ] `npm install` berhasil
- [ ] `npm run dev` berjalan tanpa error
- [ ] Homepage muncul di `http://localhost:3000`
- [ ] Navigation bar terlihat (logo, density toggle, notifications, user menu)
- [ ] Bottom tab bar muncul di mobile view
- [ ] Density toggle berfungsi (compact/comfortable/spacious)
- [ ] Toast notifications muncul
- [ ] Analytics charts render dengan baik
- [ ] Landing builder template gallery terlihat
- [ ] Forms validation berfungsi
- [ ] Responsive layout bekerja di semua breakpoint

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Module not found errors
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clean build
rm -rf .next
npm run build
```

## 📄 License

[MIT License](LICENSE)

## 👥 Authors

Travel Umroh Development Team

---

**Status**: ✅ Production Ready (Frontend Only)
**Last Updated**: 2025-12-25
**Version**: 0.1.0
