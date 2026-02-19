# Epic 16: Customizable Production Pipeline Management

**Status:** 🟡 Phase 1 Complete (Demo) - Production Implementation Pending
**Last Updated:** 2024-12-26
**Priority:** High
**Assignee:** Development Team

---

## Executive Summary

Production Pipeline Management system untuk tracking jamaah dari document collection hingga departure. Phase 1 (Demo/POC) **SELESAI** dengan capability handle 2000 jamaah data. **Belum production-ready** - requires backend API, pagination, dan performance optimization.

---

## Implementation Status

### ✅ Phase 1: Proof of Concept (COMPLETE)

**Deliverables:**
- [x] Pipeline Overview dashboard (`/dashboard/pipeline`)
- [x] Admin Task Queue kanban (`/dashboard/pipeline/tasks`)
- [x] Mock data generator untuk 2000 jamaah
- [x] Dynamic statistics calculation
- [x] Bottleneck detection algorithm
- [x] 10-stage pipeline system
- [x] Toggle mechanism (13 vs 2000 dataset)
- [x] UI/UX design validation

**Files Created:**
```
lib/data/
  ├── mock-pipeline.ts (1,200+ lines)
  └── generate-mock-jamaah-2000.ts (330 lines)

app/dashboard/pipeline/
  ├── page.tsx (338 lines - Manager Overview)
  └── tasks/page.tsx (327 lines - Task Queue)

docs/
  └── PIPELINE_DEMO.md (Documentation)

.env.local.example (Dataset toggle config)
```

**Performance (Demo Mode):**
- Initial Load: 2-9 seconds (2000 jamaah)
- Memory Usage: 50-100 MB per browser tab
- Client-Side Processing: All calculations done in browser

---

## Current Architecture

### Data Flow (Demo)
```
Frontend Component
    ↓
useMemo() hooks
    ↓
Client-side calculations
    ↓
Mock data arrays (2000 items)
    ↓
Render all at once
```

### Key Components

**1. Pipeline Overview (`/dashboard/pipeline`)**
- Pipeline Health KPIs (Total, On Track, At Risk, Overdue)
- 9 Pipeline Stage Cards with statistics
- Bottleneck Alerts (auto-calculated)
- Upcoming Departures (7 days)

**2. Task Queue (`/dashboard/pipeline/tasks`)**
- Kanban board: URGENT | TODAY | UPCOMING | BLOCKED
- Role-based filtering (5 admin roles)
- Task cards with Call/WhatsApp actions
- Priority management

**3. Mock Data Generator**
- Generates 2000 realistic jamaah records
- Indonesian names, NIK, package assignments
- Proper status distribution (50% on-track, 15% at-risk, 10% overdue, 25% completed)
- Realistic stage progression and SLA tracking

---

## Known Limitations (Production Blockers)

### 🔴 Critical Issues

**1. Client-Side Data Loading**
```typescript
// Current: Load ALL 2000 jamaah in browser
const dataset = getAllJamaahPipeline() // 2000 items!
const stats = calculatePipelineStatsFromData() // Process all
```
- **Impact:** 9 second initial load time
- **Risk:** Browser freeze/crash with more data
- **Blocker:** Cannot scale beyond 2000 jamaah

**2. No Backend API**
- All data is mock/static
- No database persistence
- No real-time updates
- Cannot integrate with real systems

**3. No Pagination/Virtual Scrolling**
```typescript
// Current: Render all items
{tasksByColumn.urgent.map(task => <TaskCard key={task.id} task={task} />)}
```
- **Impact:** Poor performance with many tasks
- **Risk:** UI becomes unusable with scale

**4. No Caching Layer**
- Statistics recalculated on every render
- No Redis/memory cache
- Inefficient for real-time dashboards

### 🟡 Medium Priority Issues

**5. Task Queue Not Integrated with 2000 Dataset**
- Still uses hardcoded 13 tasks
- Needs task generator from 2000 jamaah data

**6. No Optimization Strategies**
- No lazy loading
- No code splitting
- No memoization of expensive operations

**7. No Error Handling**
- No loading states
- No error boundaries
- No retry logic

---

## Production Requirements

### Must-Have Features

**1. Backend API Layer**
```typescript
// Required API Endpoints
GET  /api/pipeline/health              // KPIs summary
GET  /api/pipeline/stages              // Stage statistics
GET  /api/pipeline/bottlenecks         // Alert list
GET  /api/pipeline/departures?days=7   // Upcoming departures
GET  /api/pipeline/tasks?role=visa&status=urgent&page=1&limit=20
POST /api/pipeline/tasks/:id/complete  // Task actions
```

**2. Database Schema**
```sql
-- Pipeline stages
CREATE TABLE pipeline_stages (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  sla_hours INTEGER,
  is_active BOOLEAN DEFAULT true
);

-- Jamaah pipeline status
CREATE TABLE jamaah_pipeline_status (
  id SERIAL PRIMARY KEY,
  jamaah_id INTEGER REFERENCES jamaah(id),
  current_stage_id VARCHAR REFERENCES pipeline_stages(id),
  status VARCHAR CHECK (status IN ('on-track', 'at-risk', 'overdue', 'completed')),
  overall_progress INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes for performance
  INDEX idx_status (status),
  INDEX idx_stage (current_stage_id),
  INDEX idx_departure (departure_date)
);

-- Stage instances (history)
CREATE TABLE stage_instances (
  id SERIAL PRIMARY KEY,
  jamaah_id INTEGER,
  stage_id VARCHAR,
  status VARCHAR,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  due_at TIMESTAMP,
  assigned_to VARCHAR,
  is_overdue BOOLEAN,
  sla_days INTEGER,
  days_elapsed INTEGER,

  INDEX idx_jamaah_stage (jamaah_id, stage_id)
);

-- Daily tasks
CREATE TABLE pipeline_tasks (
  id SERIAL PRIMARY KEY,
  jamaah_id INTEGER,
  task_type VARCHAR,
  stage_id VARCHAR,
  priority VARCHAR CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  status VARCHAR CHECK (status IN ('pending', 'in-progress', 'completed', 'blocked')),
  due_at DATE,
  assigned_role VARCHAR,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_priority_status (priority, status),
  INDEX idx_due_date (due_at),
  INDEX idx_assigned_role (assigned_role)
);
```

**3. Redis Caching Strategy**
```typescript
// Cache pipeline health stats (TTL: 5 minutes)
const cacheKey = 'pipeline:health'
const ttl = 300 // 5 minutes

// Cache stage statistics (TTL: 15 minutes)
const stageCacheKey = `pipeline:stage:${stageId}`
const stageTtl = 900 // 15 minutes

// Cache bottleneck alerts (TTL: 10 minutes)
const bottleneckKey = 'pipeline:bottlenecks'
const bottleneckTtl = 600
```

**4. Pagination Implementation**
```typescript
// Frontend
const [page, setPage] = useState(1)
const [limit] = useState(20)

const { data, isLoading } = useQuery(['tasks', page, limit], () =>
  fetch(`/api/pipeline/tasks?page=${page}&limit=${limit}`)
)

// Backend
app.get('/api/pipeline/tasks', async (req, res) => {
  const { page = 1, limit = 20, role, status } = req.query
  const offset = (page - 1) * limit

  const tasks = await db.query(`
    SELECT * FROM pipeline_tasks
    WHERE assigned_role = $1 AND status = $2
    ORDER BY priority DESC, due_at ASC
    LIMIT $3 OFFSET $4
  `, [role, status, limit, offset])

  const total = await db.query('SELECT COUNT(*) FROM pipeline_tasks WHERE...')

  res.json({
    data: tasks.rows,
    pagination: {
      page,
      limit,
      total: total.rows[0].count,
      totalPages: Math.ceil(total.rows[0].count / limit)
    }
  })
})
```

**5. Real-Time Updates (WebSocket)**
```typescript
// Server-side
io.on('connection', (socket) => {
  socket.on('subscribe:pipeline', ({ role }) => {
    socket.join(`pipeline:${role}`)
  })
})

// Emit updates when task status changes
async function updateTaskStatus(taskId, status) {
  await db.query('UPDATE pipeline_tasks SET status = $1 WHERE id = $2', [status, taskId])

  const task = await db.query('SELECT * FROM pipeline_tasks WHERE id = $1', [taskId])
  io.to(`pipeline:${task.assigned_role}`).emit('task:updated', task)
}

// Client-side
const socket = io()
socket.emit('subscribe:pipeline', { role: 'visa-admin' })
socket.on('task:updated', (task) => {
  // Update UI optimistically
  queryClient.setQueryData(['tasks'], (old) => {
    // Update task in cache
  })
})
```

**6. Performance Optimization**
```typescript
// Virtual scrolling for large lists
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: tasks.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120, // Task card height
})

// Lazy loading for stage cards
const StageCard = lazy(() => import('./StageCard'))

// Memoize expensive calculations
const memoizedStats = useMemo(() =>
  calculateStageStats(stageData),
  [stageData.lastUpdated]
)
```

---

## Production Roadmap

### 🎯 Phase 2: Backend Integration (Week 1-2)

**Week 1: Database & API Setup**
- [ ] Create database schema and migrations
- [ ] Implement seed data (migrate from mock data)
- [ ] Create Next.js API routes for pipeline endpoints
- [ ] Setup Redis for caching
- [ ] Add database indexes for performance

**Week 2: Frontend Integration**
- [ ] Integrate API calls with React Query
- [ ] Implement pagination for task queue
- [ ] Add loading states and error handling
- [ ] Test with production-like data volume

**Acceptance Criteria:**
- API responds within 200ms for health stats
- Task queue loads 20 items in < 500ms
- Database queries optimized with indexes
- Redis cache hit rate > 80%

### 🎯 Phase 3: Performance Optimization (Week 3)

**Tasks:**
- [ ] Implement virtual scrolling for task lists
- [ ] Add lazy loading for stage cards
- [ ] Optimize re-render cycles
- [ ] Add background jobs for heavy calculations
- [ ] Performance testing with 5000+ jamaah

**Acceptance Criteria:**
- Page load time < 2 seconds
- Smooth scrolling with 1000+ tasks
- Memory usage < 100 MB
- No UI freezes during interactions

### 🎯 Phase 4: Real-Time Features (Week 4)

**Tasks:**
- [ ] Setup WebSocket server
- [ ] Implement real-time task updates
- [ ] Add optimistic UI updates
- [ ] Push notifications for critical alerts
- [ ] Live dashboard refresh

**Acceptance Criteria:**
- Task status updates appear within 1 second
- Multiple users can work simultaneously
- No race conditions in concurrent updates

### 🎯 Phase 5: Scale Testing (Week 5)

**Tasks:**
- [ ] Load testing with 10,000 jamaah
- [ ] Stress testing concurrent users
- [ ] Database query optimization
- [ ] CDN setup for static assets
- [ ] Monitoring and alerting

**Acceptance Criteria:**
- Supports 10,000+ jamaah
- Handles 100+ concurrent users
- 99.9% uptime
- Automated alerts for anomalies

---

## Testing Strategy

### Unit Tests
```typescript
// Pipeline calculations
describe('calculatePipelineHealth', () => {
  it('should calculate correct statistics for 2000 jamaah', () => {
    const health = calculatePipelineHealth(mock2000Jamaah)
    expect(health.totalJamaah).toBe(2000)
    expect(health.onTrack).toBe(1500)
  })
})

// Bottleneck detection
describe('calculateBottlenecks', () => {
  it('should detect critical bottlenecks', () => {
    const bottlenecks = calculateBottlenecks(testData)
    expect(bottlenecks[0].severity).toBe('critical')
  })
})
```

### Integration Tests
```typescript
// API endpoints
describe('GET /api/pipeline/health', () => {
  it('should return pipeline health stats', async () => {
    const res = await request(app).get('/api/pipeline/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('totalJamaah')
  })
})

// Database queries
describe('Pipeline queries', () => {
  it('should fetch tasks with pagination', async () => {
    const tasks = await db.getPipelineTasks({ page: 1, limit: 20 })
    expect(tasks.length).toBeLessThanOrEqual(20)
  })
})
```

### Performance Tests
```typescript
// Load testing
describe('Performance', () => {
  it('should load pipeline health in < 200ms', async () => {
    const start = Date.now()
    await fetch('/api/pipeline/health')
    const duration = Date.now() - start
    expect(duration).toBeLessThan(200)
  })

  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      fetch('/api/pipeline/tasks?page=1&limit=20')
    )
    const results = await Promise.all(requests)
    expect(results.every(r => r.ok)).toBe(true)
  })
})
```

### E2E Tests
```typescript
// User workflows
describe('Pipeline Manager Workflow', () => {
  it('should view pipeline overview and drill into tasks', async () => {
    await page.goto('/dashboard/pipeline')
    await page.waitForSelector('[data-testid="pipeline-health"]')

    const onTrackCount = await page.textContent('[data-testid="on-track-count"]')
    expect(parseInt(onTrackCount)).toBeGreaterThan(0)

    await page.click('button:has-text("View Task Queue")')
    await page.waitForURL('/dashboard/pipeline/tasks')

    const taskCards = await page.locator('[data-testid="task-card"]').count()
    expect(taskCards).toBeGreaterThan(0)
  })
})
```

---

## Monitoring & Metrics

### Key Performance Indicators (KPIs)

**Technical KPIs:**
- API Response Time: p50 < 100ms, p95 < 500ms, p99 < 1s
- Page Load Time: < 2 seconds
- Database Query Time: < 50ms average
- Cache Hit Rate: > 80%
- Error Rate: < 0.1%

**Business KPIs:**
- Jamaah on-track rate: > 70%
- Average stage completion time vs SLA
- Bottleneck resolution time
- Task completion rate per admin role

### Monitoring Setup
```typescript
// Application Performance Monitoring
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter sensitive data
    return event
  }
})

// Custom metrics
const metrics = {
  trackPipelineLoad: (duration: number) => {
    Sentry.captureMessage('Pipeline loaded', {
      level: 'info',
      tags: { duration: `${duration}ms` }
    })
  },

  trackBottleneckDetected: (stage: string, count: number) => {
    Sentry.captureMessage('Bottleneck detected', {
      level: 'warning',
      tags: { stage, jamaahCount: count }
    })
  }
}
```

---

## Risk Assessment

### High Risk Items

**1. Data Migration**
- **Risk:** Loss of data during mock → production migration
- **Mitigation:**
  - Create comprehensive migration scripts
  - Test on staging environment
  - Backup before migration
  - Rollback plan ready

**2. Performance Degradation**
- **Risk:** Slow queries with real data volume
- **Mitigation:**
  - Database indexes on all query columns
  - Query optimization during development
  - Load testing before production
  - Redis caching layer

**3. Concurrent Updates**
- **Risk:** Race conditions when multiple admins update same task
- **Mitigation:**
  - Optimistic locking
  - WebSocket for real-time sync
  - Conflict resolution strategy
  - Transaction isolation

### Medium Risk Items

**4. User Training**
- **Risk:** Admin confusion with new pipeline system
- **Mitigation:**
  - Comprehensive user documentation
  - Video tutorials
  - Training sessions
  - In-app help tooltips

**5. Integration Complexity**
- **Risk:** Difficulty integrating with existing systems
- **Mitigation:**
  - API-first design
  - Clear integration documentation
  - Sandbox environment for testing
  - Gradual rollout

---

## Dependencies

### Technical Dependencies
- Next.js 14+ (App Router)
- PostgreSQL 14+ with pg extension
- Redis 6+ for caching
- React Query for data fetching
- Socket.io for WebSocket
- Tailwind CSS for styling
- shadcn/ui components

### External System Dependencies
- Jamaah database (for real jamaah data)
- SISKOPATUH integration (for approval status)
- Visa tracking system (for visa status)
- Travel booking system (for flight/hotel data)

---

## Success Criteria

### Phase 1 (Demo) - ✅ COMPLETE
- [x] UI/UX validated with stakeholders
- [x] Data structure proven to handle 2000 jamaah
- [x] Core calculations working correctly
- [x] Bottleneck detection algorithm accurate

### Phase 2 (Backend Integration)
- [ ] All API endpoints functional
- [ ] Database queries optimized (< 50ms)
- [ ] Redis cache working (> 80% hit rate)
- [ ] Pagination implemented and tested

### Phase 3 (Performance)
- [ ] Page load < 2 seconds
- [ ] Support 5000+ jamaah
- [ ] Memory usage < 100 MB
- [ ] No UI freezes

### Phase 4 (Real-Time)
- [ ] WebSocket updates < 1 second
- [ ] Supports 50+ concurrent users
- [ ] Optimistic updates working

### Phase 5 (Production)
- [ ] Handles 10,000+ jamaah
- [ ] 99.9% uptime
- [ ] < 0.1% error rate
- [ ] Monitoring dashboards active

---

## Documentation Links

- [Pipeline Demo Guide](../docs/PIPELINE_DEMO.md)
- API Documentation: TBD (Phase 2)
- Database Schema: TBD (Phase 2)
- User Manual: TBD (Phase 4)
- Admin Training: TBD (Phase 4)

---

## Team Notes

**Current Status (2024-12-26):**
- Phase 1 complete and validated ✅
- Ready to proceed to Phase 2 (Backend Integration)
- Stakeholder sign-off needed before production implementation
- Estimated timeline: 5 weeks for full production deployment

**Known Issues:**
- Task queue not yet integrated with 2000 jamaah dataset
- No error boundaries implemented
- Missing loading states in several components

**Next Actions:**
1. Get stakeholder approval for production implementation
2. Prioritize Phase 2, 3, or continue with other features
3. Schedule technical review with backend team
4. Plan database migration strategy

---

**Last Updated:** 2024-12-26
**Document Owner:** Development Team
**Review Frequency:** Weekly during active development
