# Production Pipeline Demo

## Overview

The Production Pipeline Management system tracks jamaah progress through 10 standardized stages, from document collection to departure readiness.

## Features Implemented

### 1. Manager Pipeline Overview (`/dashboard/pipeline`)
- **Pipeline Health KPIs**: Total jamaah, on-track, at-risk, and overdue counts
- **Stage Overview Cards**: Statistics for each pipeline stage
  - Pengumpulan Dokumen (Document Collection)
  - Verifikasi Dokumen (Document Verification)
  - Pengajuan SISKOPATUH (SISKOPATUH Submission)
  - Persetujuan SISKOPATUH (SISKOPATUH Approval)
  - Pengajuan Visa (Visa Application)
  - Persetujuan Visa (Visa Approval)
  - Persiapan Perlengkapan (Equipment Preparation)
  - Booking Penerbangan (Flight Booking)
  - Booking Hotel (Hotel Booking)
  - Siap Berangkat (Ready to Depart)
- **Bottleneck Alerts**: Critical and moderate severity alerts for stuck stages
- **Upcoming Departures**: Jamaah departing within next 7 days

### 2. Admin Task Queue (`/dashboard/pipeline/tasks`)
- **Kanban Board Layout**:
  - URGENT: Overdue or critical priority tasks
  - TODAY: Tasks due today
  - UPCOMING: Tasks due tomorrow
  - BLOCKED: Tasks requiring intervention
- **Role-Based Filtering**: Filter tasks by admin role
  - Document Admin
  - SISKOPATUH Admin
  - Visa Admin
  - Logistics Admin
  - Travel Admin
- **Quick Actions**: Call, WhatsApp, and view jamaah details

## Demo Dataset Configuration

### Small Dataset (Default)
- **Size**: 13 jamaah
- **Use Case**: Development and quick testing
- **Status Distribution**:
  - 7 on-track (53%)
  - 3 at-risk (23%)
  - 2 overdue (15%)
  - 1 completed (8%)

### Large Dataset (Demo)
- **Size**: 2000 jamaah
- **Use Case**: Scalability demonstration
- **Status Distribution**:
  - 1000 on-track (50%)
  - 300 at-risk (15%)
  - 200 overdue (10%)
  - 500 completed (25%)

## Enabling Large Dataset

### Method 1: Environment Variable

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and uncomment:
```bash
NEXT_PUBLIC_USE_LARGE_DATASET=true
```

3. Restart the development server:
```bash
npm run dev
```

### Method 2: Direct Edit (Not Recommended)

Edit `/lib/data/mock-pipeline.ts` line 9:
```typescript
const USE_LARGE_DATASET = true // Change from false to true
```

**Note**: This method requires code changes and is not recommended for demo purposes.

## Visual Indicators

When using the large dataset, the Pipeline Overview page will display:
- Badge showing "Demo: 2,000 Jamaah" in the header
- Larger numbers in all KPI cards
- More bottleneck alerts (if applicable)
- More upcoming departures

## Performance Considerations

### Current Demo Implementation
- **Load Time**: ~2-5 seconds for initial page load with 2000 jamaah
- **Browser Memory**: ~50-100 MB
- **Rendering**: All data loaded at once (not optimized)

### Production Recommendations
For real 2000 jamaah/month scenarios, implement:

1. **Pagination**: Load 20-50 items per page
2. **Virtual Scrolling**: Render only visible items in Kanban board
3. **Server-Side Filtering**: Filter at API level, not client-side
4. **Redis Caching**: Cache expensive calculations (15-30 min TTL)
5. **Background Jobs**: Calculate stats/bottlenecks asynchronously
6. **Database Indexes**: Index on `status`, `departure`, `currentStageId`

## Data Structure

### JamaahPipelineStatus
```typescript
interface JamaahPipelineStatus {
  jamaahId: string
  jamaahName: string
  packageName: string
  departure: string // YYYY-MM-DD
  currentStageId: string
  currentStageStatus: 'on-track' | 'at-risk' | 'overdue' | 'completed'
  overallProgress: number // 0-100
  stageInstances: StageInstance[]
}
```

### StageInstance
```typescript
interface StageInstance {
  stageId: string
  stageName: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  startedAt: string | null
  completedAt: string | null
  dueAt: string
  assignedTo: string
  notes: string
  isOverdue: boolean
  slaDays: number
  daysElapsed: number
}
```

## File Structure

```
frontend/
├── app/
│   └── dashboard/
│       └── pipeline/
│           ├── page.tsx              # Manager Overview
│           └── tasks/
│               └── page.tsx          # Admin Task Queue
├── lib/
│   ├── data/
│   │   ├── mock-pipeline.ts          # Main pipeline data
│   │   └── generate-mock-jamaah-2000.ts # 2000 jamaah generator
│   └── navigation/
│       └── menu-items.ts             # Added Pipeline menu item
└── docs/
    └── PIPELINE_DEMO.md              # This file
```

## Navigation

- **Admin Portal**: Main menu → "Pipeline"
- **Direct URL**: `http://localhost:3001/dashboard/pipeline`
- **Task Queue**: Click "View Task Queue" button or navigate to `/dashboard/pipeline/tasks`

## Testing Checklist

- [ ] Navigate to `/dashboard/pipeline`
- [ ] Verify Pipeline Health KPIs display correct numbers
- [ ] Check all 6 stage cards render (stages 1,2,3,5,7,8)
- [ ] Verify Bottleneck Alerts section (may be empty if no bottlenecks)
- [ ] Check Upcoming Departures section
- [ ] Click "View Task Queue" button
- [ ] Verify Kanban board with 4 columns
- [ ] Test role filtering tabs
- [ ] Enable large dataset via `.env.local`
- [ ] Restart server and verify "Demo: 2,000 Jamaah" badge appears
- [ ] Verify larger numbers in all KPI cards

## Known Limitations (Demo)

1. **No Backend Integration**: All data is client-side mock data
2. **No Real-Time Updates**: Data is static, no WebSocket updates
3. **No Task Actions**: Call/WhatsApp buttons are UI-only
4. **No Persistence**: Changes not saved to database
5. **No User Permissions**: All users see all data
6. **Performance**: Not optimized for production 2000 jamaah load

## Production Readiness Assessment

### ⚠️ Current Status: DEMO ONLY

This implementation is a **Proof of Concept** designed to:
- ✅ Validate data structure with 2000 jamaah
- ✅ Test UI/UX design
- ✅ Demonstrate pipeline tracking capabilities

**NOT production-ready for real 2000 jamaah/month workloads.**

### Known Limitations

**Performance:**
- Load Time: 2-9 seconds (all 2000 jamaah loaded at once)
- Memory Usage: 50-100 MB per browser tab
- Client-Side Processing: All calculations in browser
- No pagination, caching, or optimization

**Architecture:**
- No backend API (all data is mock/static)
- No database integration
- No real-time updates
- No error handling or loading states

**Functionality:**
- Task queue not integrated with 2000 jamaah dataset
- No task action handlers (Call/WhatsApp are UI-only)
- No persistence (changes not saved)

### Production Requirements

For real production use with 2000+ jamaah/month, requires:

**Phase 2: Backend Integration (2 weeks)**
1. PostgreSQL database with proper indexes
2. REST API endpoints with pagination
3. Redis caching for statistics (TTL: 5-15 min)
4. Server-side calculations

**Phase 3: Performance (1 week)**
5. Pagination (20-50 items per page)
6. Virtual scrolling for large lists
7. Lazy loading for components
8. Error boundaries and loading states

**Phase 4: Real-time Features (1 week)**
9. WebSocket for live updates
10. Optimistic UI updates
11. Push notifications for critical alerts

**Phase 5: Scale Testing (1 week)**
12. Load testing with 10,000+ jamaah
13. Performance monitoring
14. Production deployment

**Estimated Total:** 5 weeks for full production implementation

See [_bmad-output/epic-16-pipeline-management.md](../_bmad-output/epic-16-pipeline-management.md) for detailed roadmap.

## Next Steps (Demo → Production)

### Option A: Full Production (5 weeks)
Complete all phases above for enterprise-grade pipeline system

### Option B: Minimal Production (2 weeks)
- Basic API + database integration
- Simple pagination
- Functional but not optimized
- Suitable for < 1000 jamaah/month

### Option C: Continue Demo
- Use current implementation for stakeholder validation
- Postpone production to next sprint
- Focus on other features first

**Decision needed:** Consult with Product Owner on priority and timeline.
