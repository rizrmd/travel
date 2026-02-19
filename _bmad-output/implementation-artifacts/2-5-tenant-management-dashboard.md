# Story 2.5: Tenant Management Dashboard

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **super admin**,
I want a tenant management dashboard to view all agencies, their status, and perform admin actions,
So that I can monitor platform health and manage tenants effectively.

## Acceptance Criteria

1. **Given** I am logged in as super admin
   **When** I access the tenant management dashboard
   **Then** I see a table listing all tenants with columns:
   - Agency Name
   - Slug
   - Status (Active/Suspended/Inactive badge)
   - Resource Usage (users/jamaah this month)
   - Created Date
   - Actions (View, Edit, Suspend, Delete)

2. **And** I can filter tenants by status

3. **And** I can search tenants by name or slug

4. **And** I can sort by any column

5. **And** clicking "View" shows tenant details with full analytics

6. **And** clicking "Edit" allows updating resource limits

7. **And** clicking "Suspend" changes status to "suspended" and blocks all tenant access

8. **And** clicking "Delete" soft-deletes tenant (status: "deleted")

9. **And** pagination supports 20 tenants per page

10. **And** dashboard updates in real-time via WebSocket when tenant status changes

## Tasks / Subtasks

- [ ] Task 1: Implement Backend API Endpoints for Tenant Management (AC: #1, #2, #3, #4, #5, #6, #7, #8, #9)
  - [ ] Subtask 1.1: Create filter/query DTO (`FilterTenantsDto`) with status, search, pagination, sorting
  - [ ] Subtask 1.2: Add admin endpoints to `tenants.controller.ts`:
    - GET `/api/v1/admin/tenants` - List tenants with filtering/pagination
    - GET `/api/v1/admin/tenants/:id` - View single tenant with analytics
    - PATCH `/api/v1/admin/tenants/:id` - Update tenant resource limits
    - PATCH `/api/v1/admin/tenants/:id/suspend` - Suspend tenant
    - DELETE `/api/v1/admin/tenants/:id` - Soft delete tenant
  - [ ] Subtask 1.3: Implement service methods in `tenants.service.ts` for filtering, sorting, pagination
  - [ ] Subtask 1.4: Add super admin role guard to all admin endpoints (`@RequireRole('super_admin')`)
  - [ ] Subtask 1.5: Implement soft delete logic (set `deleted_at` timestamp)
  - [ ] Subtask 1.6: Add resource usage calculation (concurrent users from Redis, jamaah count query)
  - [ ] Subtask 1.7: Write unit tests for tenant service methods
  - [ ] Subtask 1.8: Write integration tests for admin endpoints

- [ ] Task 2: Implement Real-Time Updates via WebSocket (AC: #10)
  - [ ] Subtask 2.1: Create WebSocket gateway for tenant status changes (`TenantGateway`)
  - [ ] Subtask 2.2: Emit `tenant.status.changed` event when tenant status updates
  - [ ] Subtask 2.3: Implement admin room subscription for real-time updates
  - [ ] Subtask 2.4: Add tenant isolation to ensure only super admins receive updates
  - [ ] Subtask 2.5: Test WebSocket connection and event emission

- [ ] Task 3: Create Frontend Dashboard Page (AC: #1, #2, #3, #4, #5, #9)
  - [ ] Subtask 3.1: Create Next.js page: `frontend/src/pages/admin/tenants/index.tsx`
  - [ ] Subtask 3.2: Implement TenantTable component with Tanstack Table
  - [ ] Subtask 3.3: Add table columns: Agency Name, Slug, Status Badge, Resource Usage, Created Date, Actions
  - [ ] Subtask 3.4: Implement status filter dropdown (All, Active, Suspended, Inactive, Deleted)
  - [ ] Subtask 3.5: Implement search input for name/slug filtering
  - [ ] Subtask 3.6: Add column sorting functionality (click column header to sort)
  - [ ] Subtask 3.7: Implement pagination controls (20 tenants per page)
  - [ ] Subtask 3.8: Style table with shadcn/ui components and Tailwind CSS
  - [ ] Subtask 3.9: Add responsive design for mobile/tablet views

- [ ] Task 4: Implement Action Buttons and Modals (AC: #5, #6, #7, #8)
  - [ ] Subtask 4.1: Create "View" button that navigates to tenant details page
  - [ ] Subtask 4.2: Create "Edit" modal for updating resource limits (concurrent users, jamaah limit)
  - [ ] Subtask 4.3: Create "Suspend" confirmation dialog with warning message
  - [ ] Subtask 4.4: Create "Delete" confirmation dialog with warning message
  - [ ] Subtask 4.5: Implement API calls for each action (PATCH, DELETE)
  - [ ] Subtask 4.6: Add loading states and error handling for all actions
  - [ ] Subtask 4.7: Show success/error toast notifications after actions
  - [ ] Subtask 4.8: Refresh table data after successful action

- [ ] Task 5: Implement Tenant Details View (AC: #5)
  - [ ] Subtask 5.1: Create tenant details page: `frontend/src/pages/admin/tenants/[id].tsx`
  - [ ] Subtask 5.2: Display tenant overview (name, slug, status, created date, owner info)
  - [ ] Subtask 5.3: Show resource usage analytics with charts/graphs
  - [ ] Subtask 5.4: Display current concurrent users count
  - [ ] Subtask 5.5: Display monthly jamaah count with trend
  - [ ] Subtask 5.6: Add "Back to List" navigation button
  - [ ] Subtask 5.7: Style details page with shadcn/ui cards and layouts

- [ ] Task 6: Integrate Real-Time Updates in Frontend (AC: #10)
  - [ ] Subtask 6.1: Set up Socket.IO client connection in frontend
  - [ ] Subtask 6.2: Subscribe to `tenant.status.changed` event
  - [ ] Subtask 6.3: Update Zustand store when tenant status changes
  - [ ] Subtask 6.4: Invalidate TanStack Query cache to refetch tenant list
  - [ ] Subtask 6.5: Show visual indicator when tenant status updates (badge animation)
  - [ ] Subtask 6.6: Test real-time updates by suspending tenant in another tab

- [ ] Task 7: Add Super Admin Role and Authorization (AC: #1)
  - [ ] Subtask 7.1: Add `super_admin` role to role enum if not exists
  - [ ] Subtask 7.2: Create role guard decorator for super admin routes
  - [ ] Subtask 7.3: Verify JWT token contains super_admin role claim
  - [ ] Subtask 7.4: Return 403 Forbidden if non-admin user accesses admin routes
  - [ ] Subtask 7.5: Add super admin check to frontend route protection
  - [ ] Subtask 7.6: Redirect non-admin users to dashboard home

- [ ] Task 8: Testing and Documentation (All AC)
  - [ ] Subtask 8.1: Write E2E tests for tenant list page (Cypress or Playwright)
  - [ ] Subtask 8.2: Test filtering, searching, sorting, pagination functionality
  - [ ] Subtask 8.3: Test all action buttons (View, Edit, Suspend, Delete)
  - [ ] Subtask 8.4: Test real-time WebSocket updates
  - [ ] Subtask 8.5: Test super admin authorization
  - [ ] Subtask 8.6: Update API documentation with admin endpoints
  - [ ] Subtask 8.7: Add README section for super admin dashboard usage

## Dev Notes

### Architecture Alignment

This story implements the **Super Admin Tenant Management Dashboard** as part of Epic 2: Multi-Tenant Agency Management. It enables platform administrators to monitor and manage all agencies from a centralized dashboard.

**Key Architecture Patterns:**
- **Multi-Tenancy Isolation**: Admin endpoints access cross-tenant data with proper authorization
- **RBAC**: Super admin role enforcement on all admin endpoints
- **Real-Time Updates**: WebSocket integration for live dashboard updates
- **Frontend Architecture**: Next.js with Zustand + TanStack Query + shadcn/ui components
- **API Standards**: RESTful endpoints following existing patterns from Story 1.3

**Technology Stack Compliance:**
- **Backend**: NestJS with TypeORM, follows Brocoders boilerplate patterns
- **Frontend**: Next.js 14+ with React, SSR for initial load
- **State Management**: Zustand for UI state, TanStack Query for server state
- **UI Components**: shadcn/ui with Tailwind CSS for consistent styling
- **Real-Time**: Socket.IO 4.7+ for WebSocket communication
- **Database**: PostgreSQL with TypeORM, soft delete pattern

### Project Structure Notes

**Backend Files to Create:**
```
src/modules/tenants/dto/filter-tenants.dto.ts           # Query/filter DTO for tenant list
src/modules/tenants/dto/resource-usage.dto.ts           # DTO for resource usage response
src/modules/tenants/dto/update-tenant-limits.dto.ts     # DTO for updating resource limits
src/modules/tenants/gateways/tenant.gateway.ts          # WebSocket gateway for real-time updates
```

**Backend Files to Modify:**
```
src/modules/tenants/tenants.controller.ts               # Add admin endpoints
src/modules/tenants/tenants.service.ts                  # Add admin service methods
src/modules/tenants/entities/tenant.entity.ts           # Ensure deleted_at field exists
src/common/guards/roles.guard.ts                        # Add super_admin role check
```

**Frontend Files to Create:**
```
frontend/src/pages/admin/tenants/index.tsx              # Tenant list page
frontend/src/pages/admin/tenants/[id].tsx               # Tenant details page
frontend/src/components/admin/TenantTable.tsx           # Table component with filtering/sorting
frontend/src/components/admin/TenantStatusBadge.tsx     # Status badge component
frontend/src/components/admin/EditTenantModal.tsx       # Modal for editing resource limits
frontend/src/components/admin/ConfirmDialog.tsx         # Reusable confirmation dialog
frontend/src/hooks/useTenantsQuery.ts                   # TanStack Query hook for tenants
frontend/src/hooks/useTenantWebSocket.ts                # WebSocket hook for real-time updates
frontend/src/stores/adminStore.ts                       # Zustand store for admin UI state
```

**Naming Conventions:**
- **Backend**:
  - Files: `kebab-case.ts` (e.g., `filter-tenants.dto.ts`)
  - Classes: `PascalCase` (e.g., `FilterTenantsDto`)
  - Methods: `camelCase` (e.g., `findAllWithFilters`)
- **Frontend**:
  - Pages: `kebab-case.tsx` (e.g., `index.tsx`, `[id].tsx`)
  - Components: `PascalCase.tsx` (e.g., `TenantTable.tsx`)
  - Hooks: `useCamelCase.ts` (e.g., `useTenantsQuery.ts`)
  - Stores: `camelCaseStore.ts` (e.g., `adminStore.ts`)

### Technical Implementation Details

**Backend API Endpoints:**

```typescript
// GET /api/v1/admin/tenants - List all tenants with filtering
@Get('admin/tenants')
@RequireRole('super_admin')
async findAll(@Query() query: FilterTenantsDto): Promise<PaginatedTenantsDto> {
  // Implement filtering, searching, sorting, pagination
  return this.tenantsService.findAllWithFilters(query);
}

// GET /api/v1/admin/tenants/:id - View single tenant with analytics
@Get('admin/tenants/:id')
@RequireRole('super_admin')
async findOne(@Param('id') id: string): Promise<TenantDetailsDto> {
  return this.tenantsService.findOneWithAnalytics(id);
}

// PATCH /api/v1/admin/tenants/:id - Update resource limits
@Patch('admin/tenants/:id')
@RequireRole('super_admin')
async update(
  @Param('id') id: string,
  @Body() dto: UpdateTenantLimitsDto
): Promise<TenantEntity> {
  return this.tenantsService.updateResourceLimits(id, dto);
}

// PATCH /api/v1/admin/tenants/:id/suspend - Suspend tenant
@Patch('admin/tenants/:id/suspend')
@RequireRole('super_admin')
async suspend(@Param('id') id: string): Promise<TenantEntity> {
  const tenant = await this.tenantsService.updateStatus(id, 'suspended');
  // Emit WebSocket event
  this.tenantGateway.emitTenantStatusChanged(tenant);
  return tenant;
}

// DELETE /api/v1/admin/tenants/:id - Soft delete tenant
@Delete('admin/tenants/:id')
@RequireRole('super_admin')
async remove(@Param('id') id: string): Promise<void> {
  await this.tenantsService.softDelete(id);
  // Emit WebSocket event
  this.tenantGateway.emitTenantDeleted(id);
}
```

**FilterTenantsDto Structure:**

```typescript
// src/modules/tenants/dto/filter-tenants.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export class FilterTenantsDto {
  @ApiPropertyOptional({ enum: TenantStatus })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string; // Search by name or slug

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string; // Column to sort by (name, slug, createdAt)

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
```

**WebSocket Gateway Implementation:**

```typescript
// src/modules/tenants/gateways/tenant.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TenantEntity } from '../entities/tenant.entity';

@WebSocketGateway({
  namespace: '/admin',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class TenantGateway {
  @WebSocketServer()
  server: Server;

  emitTenantStatusChanged(tenant: TenantEntity) {
    this.server.to('super-admins').emit('tenant.status.changed', {
      id: tenant.id,
      status: tenant.status,
      updatedAt: tenant.updatedAt,
    });
  }

  emitTenantDeleted(tenantId: string) {
    this.server.to('super-admins').emit('tenant.deleted', {
      id: tenantId,
      deletedAt: new Date(),
    });
  }

  @SubscribeMessage('join-admin-room')
  handleJoinAdminRoom(client: any) {
    // Verify client is super admin via JWT
    const user = client.handshake.auth.user;
    if (user?.role === 'super_admin') {
      client.join('super-admins');
    }
  }
}
```

**Frontend TanStack Query Hook:**

```typescript
// frontend/src/hooks/useTenantsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { FilterTenantsDto, PaginatedTenantsDto } from '@/types/tenant';

export const useTenantsQuery = (filters: FilterTenantsDto) => {
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/v1/admin/tenants?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }

      return response.json() as Promise<PaginatedTenantsDto>;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};
```

**Frontend Zustand Store:**

```typescript
// frontend/src/stores/adminStore.ts
import { create } from 'zustand';

interface AdminStore {
  selectedStatus: string | null;
  searchQuery: string;
  currentPage: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';

  setSelectedStatus: (status: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setSorting: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  resetFilters: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedStatus: null,
  searchQuery: '',
  currentPage: 1,
  sortBy: 'createdAt',
  sortOrder: 'DESC',

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  resetFilters: () => set({
    selectedStatus: null,
    searchQuery: '',
    currentPage: 1,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  }),
}));
```

**Frontend TenantTable Component Pattern:**

```typescript
// frontend/src/components/admin/TenantTable.tsx
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { TenantStatusBadge } from './TenantStatusBadge';
import { Button } from '@/components/ui/button';

const columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: 'name',
    header: 'Agency Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'resourceUsage',
    header: 'Resource Usage',
    cell: ({ row }) => (
      <div>
        <div>Users: {row.original.concurrentUsers}/500</div>
        <div>Jamaah: {row.original.jamaahCount}/3000</div>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleView(row.original.id)}>
          View
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleSuspend(row.original)}>
          Suspend
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>
          Delete
        </Button>
      </div>
    ),
  },
];

export const TenantTable = ({ data, onRefetch }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Render table with shadcn/ui components
  return <div>{/* Table implementation */}</div>;
};
```

**WebSocket Real-Time Integration:**

```typescript
// frontend/src/hooks/useTenantWebSocket.ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export const useTenantWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
      auth: {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || '{}'),
      },
    });

    socket.emit('join-admin-room');

    socket.on('tenant.status.changed', (data) => {
      // Invalidate tenants query to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['tenants'] });

      // Show toast notification
      console.log('Tenant status updated:', data);
    });

    socket.on('tenant.deleted', (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      console.log('Tenant deleted:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
```

### Resource Usage Calculation

**Backend Service Method:**

```typescript
// src/modules/tenants/tenants.service.ts
async findOneWithAnalytics(id: string): Promise<TenantDetailsDto> {
  const tenant = await this.tenantRepository.findOneOrFail({ where: { id } });

  // Get concurrent users from Redis
  const concurrentUsers = await this.redis.scard(`tenant:${id}:concurrent_users`);

  // Get jamaah count for current month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const jamaahCount = await this.redis.get(`tenant:${id}:jamaah_count:${currentMonth}`) || 0;

  return {
    ...tenant,
    resourceUsage: {
      concurrentUsers: parseInt(concurrentUsers as string),
      maxConcurrentUsers: 500,
      jamaahThisMonth: parseInt(jamaahCount as string),
      maxJamaahPerMonth: 3000,
    },
  };
}
```

### Testing Standards

**Backend Integration Tests:**

```typescript
// src/modules/tenants/tenants.controller.spec.ts
describe('TenantsController (Admin)', () => {
  it('should list all tenants for super admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/tenants')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should filter tenants by status', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/tenants?status=active')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);

    expect(response.body.data.every(t => t.status === 'active')).toBe(true);
  });

  it('should return 403 for non-admin users', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/admin/tenants')
      .set('Authorization', `Bearer ${regularUserToken}`)
      .expect(403);
  });

  it('should suspend tenant successfully', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/tenants/${tenantId}/suspend`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);

    expect(response.body.status).toBe('suspended');
  });

  it('should soft delete tenant', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/admin/tenants/${tenantId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(204);

    const tenant = await tenantRepository.findOne({ where: { id: tenantId }, withDeleted: true });
    expect(tenant.deletedAt).not.toBeNull();
  });
});
```

**Frontend E2E Tests (Cypress/Playwright):**

```typescript
// cypress/e2e/admin/tenant-management.cy.ts
describe('Tenant Management Dashboard', () => {
  beforeEach(() => {
    cy.loginAsSuperAdmin();
    cy.visit('/admin/tenants');
  });

  it('should display tenant list table', () => {
    cy.get('table').should('be.visible');
    cy.get('th').should('contain', 'Agency Name');
    cy.get('th').should('contain', 'Status');
  });

  it('should filter tenants by status', () => {
    cy.get('[data-testid="status-filter"]').select('Active');
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).find('.status-badge').should('contain', 'Active');
    });
  });

  it('should search tenants by name', () => {
    cy.get('[data-testid="search-input"]').type('Berkah');
    cy.get('tbody tr').should('have.length.lessThan', 10);
    cy.get('tbody tr').first().should('contain', 'Berkah');
  });

  it('should suspend tenant with confirmation', () => {
    cy.get('tbody tr').first().find('[data-testid="suspend-btn"]').click();
    cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    cy.get('[data-testid="confirm-btn"]').click();
    cy.get('.toast').should('contain', 'Tenant suspended successfully');
  });

  it('should update resource limits', () => {
    cy.get('tbody tr').first().find('[data-testid="edit-btn"]').click();
    cy.get('[data-testid="edit-modal"]').should('be.visible');
    cy.get('[data-testid="concurrent-users-input"]').clear().type('1000');
    cy.get('[data-testid="save-btn"]').click();
    cy.get('.toast').should('contain', 'Resource limits updated');
  });

  it('should receive real-time updates via WebSocket', () => {
    // Simulate tenant status change in another session
    cy.window().then((win) => {
      win.simulateTenantStatusChange({ id: 'tenant-1', status: 'suspended' });
    });

    // Verify table updates without manual refresh
    cy.get('tbody tr[data-id="tenant-1"]')
      .find('.status-badge')
      .should('contain', 'Suspended');
  });
});
```

### References

**Source Documents:**
- [Epic 2, Story 2.5: Tenant Management Dashboard - /home/yopi/Projects/Travel Umroh/_bmad-output/epics.md#Story-2.5]
- [Architecture: Frontend Architecture (Next.js, Zustand, TanStack Query) - /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#Frontend-Architecture]
- [Architecture: Multi-Tenancy Isolation - /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#Multi-Tenancy-Isolation]
- [Architecture: Real-Time Synchronization (Socket.IO) - /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#Real-Time-Synchronization]
- [Architecture: RBAC with 6 Roles - /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#RBAC]
- [Story 1.4: Development Tools Pattern Reference - /home/yopi/Projects/Travel Umroh/_bmad-output/implementation-artifacts/1-4-set-up-development-tools-and-documentation.md]

**Key Architecture Decisions:**
- Next.js 14+ with SSR for admin dashboard pages
- Zustand for UI state management (filters, modals)
- TanStack Query for server state and automatic cache invalidation
- shadcn/ui components for consistent table, badges, modals
- Socket.IO for real-time tenant status updates
- Super admin role enforcement at both backend and frontend
- Soft delete pattern for tenant deletion (preserves audit trail)

**Technical Dependencies:**
- `@tanstack/react-table` - Table with filtering, sorting, pagination
- `@tanstack/react-query` - Server state management
- `zustand` - UI state management
- `socket.io-client` - WebSocket client for real-time updates
- `socket.io` (backend) - WebSocket server
- `shadcn/ui` components - Table, Button, Badge, Dialog, Input

### Common Pitfalls to Avoid

1. **Authorization:**
   - Don't forget to add `@RequireRole('super_admin')` decorator to ALL admin endpoints
   - Verify JWT token contains correct role claims before allowing access
   - Implement frontend route guards to prevent non-admins from accessing admin pages
   - Return 403 Forbidden (not 401 Unauthorized) for insufficient permissions

2. **WebSocket Implementation:**
   - Verify user is super admin before allowing join to admin room
   - Use separate WebSocket namespace (`/admin`) to isolate admin events
   - Disconnect socket on component unmount to prevent memory leaks
   - Handle reconnection logic when connection drops

3. **Real-Time Updates:**
   - Invalidate TanStack Query cache when receiving WebSocket events
   - Don't manually update cache - let TanStack Query refetch data
   - Use optimistic updates for immediate UI feedback before server confirmation
   - Show loading indicators during refetch

4. **Soft Delete:**
   - Set `deletedAt` timestamp instead of hard deleting records
   - Exclude deleted records from queries by default (use `withDeleted: false`)
   - Allow super admins to view deleted records with special filter option
   - Preserve all tenant data for audit trail and potential recovery

5. **Resource Usage Calculation:**
   - Use Redis for concurrent user tracking (fast read/write)
   - Cache jamaah count queries with 5-minute TTL
   - Handle Redis connection errors gracefully (return 0 if unavailable)
   - Use monthly counter reset cron job (1st of each month)

6. **Table Performance:**
   - Implement server-side pagination (don't load all tenants at once)
   - Add database indexes on frequently filtered/sorted columns (status, createdAt, slug)
   - Use `select` to fetch only required columns for list view
   - Lazy load tenant details only when "View" is clicked

7. **Frontend State Management:**
   - Keep filters in Zustand store for persistence across route changes
   - Use TanStack Query for server data (don't duplicate in Zustand)
   - Reset filters when navigating away from page
   - Sync URL query params with filter state for shareable links

### Performance Considerations

- **Database Queries**: Add indexes on `tenants(status)`, `tenants(created_at)`, `tenants(slug)` for fast filtering/sorting
- **Pagination**: Limit to 20 tenants per page to reduce payload size
- **WebSocket**: Use rooms to prevent broadcasting to all connected clients
- **TanStack Query**: Set `staleTime: 30000` (30s) to reduce unnecessary refetches
- **Resource Usage**: Cache Redis queries for 5 minutes to avoid repeated calculations
- **Table Rendering**: Use virtualization for very large tenant lists (if >100 tenants)

### Security Considerations

- **Super Admin Access**: Only users with `super_admin` role can access admin endpoints
- **Tenant Isolation**: Admin endpoints can access cross-tenant data (by design)
- **Audit Trail**: Log all admin actions (suspend, delete, edit) with timestamp and user
- **Soft Delete**: Prevent permanent data loss, allow recovery if needed
- **WebSocket Auth**: Verify JWT token in WebSocket handshake
- **CORS**: Configure WebSocket CORS to allow only frontend origin
- **Rate Limiting**: Add rate limiting to admin endpoints to prevent abuse

### UX Considerations

- **Status Badges**: Use color-coded badges for quick visual status identification
  - Active: Green badge
  - Suspended: Yellow/Orange badge
  - Inactive: Gray badge
  - Deleted: Red badge (if shown)
- **Confirmation Dialogs**: Always require confirmation for destructive actions (Suspend, Delete)
- **Toast Notifications**: Show success/error messages for all actions
- **Loading States**: Display spinners during API calls and refetches
- **Real-Time Indicators**: Animate status badge when receiving WebSocket update
- **Responsive Design**: Ensure table is mobile-friendly (horizontal scroll or card layout)
- **Empty States**: Show helpful message when no tenants match filters

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (model ID: claude-sonnet-4-5-20250929)

### Debug Log References

No debug logs yet - story file created in preparation for implementation.

### Completion Notes List

Story file created successfully with comprehensive implementation guidance. Ready for dev-story workflow.

### File List

**Files to be Created:**
- Backend: FilterTenantsDto, ResourceUsageDto, UpdateTenantLimitsDto, TenantGateway
- Frontend: Tenant list page, details page, table component, status badge, modals, hooks, store

**Files to be Modified:**
- Backend: tenants.controller.ts, tenants.service.ts, tenant.entity.ts, roles.guard.ts
- Frontend: None (all new files)
