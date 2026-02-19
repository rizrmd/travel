# Story 3.6: Role Assignment and Management UI - Implementation Notes

**Status**: Deferred - Frontend Pending

**Story Type**: Frontend Implementation

**Priority**: Medium

---

## Overview

Story 3.6 focuses on creating the user interface for role assignment and management within the Travel Umroh platform. This is a **Next.js frontend task** that requires the Team Management page implementation.

## Current Status

This story has been **deferred** until frontend development begins. The backend infrastructure for role-based access control (RBAC) is being implemented in parallel through Epic 3 stories 3.1-3.5.

## Reason for Deferral

1. **Backend-First Approach**: The architecture follows a backend-first development approach where API endpoints and business logic are implemented before UI
2. **No Frontend Codebase Yet**: The Next.js frontend application has not been initialized
3. **Dependency on Backend APIs**: The UI requires the following backend endpoints to be completed:
   - Role listing API (`GET /api/v1/roles`)
   - Role assignment API (`POST /api/v1/users/:userId/roles/:roleName`)
   - Role removal API (`DELETE /api/v1/users/:userId/roles/:roleName`)
   - User listing API with role information

## Backend Dependencies (Completed/In Progress)

The following backend components are being implemented in Epic 3:

### Story 3.1: Role Entity and Permission Matrix ✓
- Roles table with 7 role types
- User-roles junction table
- Permissions matrix
- Role assignment service with authorization

### Story 3.2: Custom Role Guards ✓
- `@Roles()` decorator
- `RolesGuard` for route protection
- Permission checking logic

### Story 3.3: Multi-Level Agent Hierarchy ✓
- Agent hierarchy service
- Hierarchy assignment API
- Recursive hierarchy queries

### Story 3.5: Granular Data Access Control ✓
- Jamaah assignments table
- RLS policies for tenant isolation
- PostgreSQL session variables middleware

## Frontend Requirements (To Be Implemented)

When frontend development begins, the following components will need to be created:

### 1. Team Management Page

**Route**: `/dashboard/team`

**Components**:
```typescript
/app/dashboard/team/
├── page.tsx                    // Main team management page
├── components/
│   ├── UserList.tsx           // List of all users in tenant
│   ├── UserCard.tsx           // Individual user card with role badges
│   ├── RoleAssignmentModal.tsx // Modal for assigning/removing roles
│   ├── RoleFilter.tsx         // Filter users by role
│   └── BulkActionBar.tsx      // Bulk role assignment actions
├── hooks/
│   ├── useUsers.ts            // Fetch users with roles
│   ├── useRoles.ts            // Fetch available roles
│   └── useRoleAssignment.ts   // Role assignment mutations
└── types/
    └── team.types.ts          // TypeScript interfaces
```

### 2. Key Features

#### User Listing
- Display all users in the current tenant
- Show user's name, email, and assigned roles
- Support pagination (20 users per page)
- Search by name/email
- Filter by role type

#### Role Assignment Interface
- Click user to open role assignment modal
- Display all available roles with descriptions
- Show which roles user currently has
- Allow adding/removing multiple roles
- Display authorization constraints:
  - Agency Owner can assign: agent, affiliate, admin, jamaah, family
  - Agency Owner **cannot** assign: super_admin, agency_owner
  - Show warning when trying to remove last agency_owner

#### Bulk Operations
- Select multiple users (checkbox selection)
- Bulk assign role to selected users
- Bulk remove role from selected users
- Show confirmation dialog for bulk actions

#### Visual Indicators
- Role badges with color coding:
  - Super Admin: Purple
  - Agency Owner: Red
  - Agent: Blue
  - Affiliate: Cyan
  - Admin: Orange
  - Jamaah: Green
  - Family: Gray
- Icons for each role type
- Loading states during API calls
- Success/error toast notifications

### 3. API Integration

The UI will consume the following REST APIs:

```typescript
// Fetch all users with roles
GET /api/v1/users
Response: {
  data: Array<{
    id: string;
    email: string;
    name: string;
    roles: Array<{
      id: string;
      name: string;
      display_name: string;
    }>;
  }>;
  pagination: { ... };
}

// Fetch available roles
GET /api/v1/roles
Response: {
  data: Array<{
    id: string;
    name: string;
    display_name: string;
    description: string;
  }>;
}

// Assign role to user
POST /api/v1/users/:userId/roles/:roleName
Body: {}
Response: { success: true }

// Remove role from user
DELETE /api/v1/users/:userId/roles/:roleName
Response: { success: true }

// Bulk assign role
POST /api/v1/users/bulk/roles/:roleName
Body: { userIds: string[] }
Response: { success: true, count: number }
```

### 4. State Management

Use React Query (TanStack Query) for API state management:

```typescript
// hooks/useUsers.ts
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  });
}

// hooks/useRoleAssignment.ts
export function useRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: AssignRoleParams) =>
      assignRole(userId, roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### 5. Authorization Guards

The UI must respect role-based authorization:

```typescript
// Only show team management page to authorized roles
if (!['agency_owner', 'super_admin'].includes(currentUserRole)) {
  return <Forbidden />;
}

// Disable role assignment UI based on user's role
const canAssignRoles = ['agency_owner', 'super_admin'].includes(currentUserRole);

// Show appropriate role options based on current user's role
const availableRoles = currentUserRole === 'super_admin'
  ? ALL_ROLES
  : ROLES_ASSIGNABLE_BY_AGENCY_OWNER;
```

## Technical Stack (Frontend)

When implemented, the frontend will use:

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui or Material-UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios or Fetch API
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons or Heroicons

## Acceptance Criteria (Deferred)

When implementing this story, ensure:

1. **Given** an agency owner is logged in
   **When** they navigate to `/dashboard/team`
   **Then** they see a list of all users in their tenant with role badges

2. **Given** an agency owner views the team page
   **When** they click on a user
   **Then** a role assignment modal opens showing available roles

3. **Given** the role assignment modal is open
   **When** the agency owner selects roles and clicks "Save"
   **Then** the roles are assigned via API and the UI updates

4. **Given** an agency owner tries to remove the last agency_owner role
   **When** they attempt to save
   **Then** an error message is shown preventing the action

5. **Given** an agency owner selects multiple users
   **When** they choose "Bulk Assign Role"
   **Then** all selected users receive the specified role

6. **Given** an agent user is logged in
   **When** they try to access `/dashboard/team`
   **Then** they see a 403 Forbidden page

## Testing Requirements (Deferred)

When implemented, create:

1. **Unit Tests**: Component tests with React Testing Library
2. **Integration Tests**: API integration with MSW (Mock Service Worker)
3. **E2E Tests**: Playwright tests for critical user flows
4. **Accessibility Tests**: WCAG 2.1 AA compliance

## Design Mockups

**Note**: Design mockups for this page will be created during the UX design phase (Story 2.5 or equivalent UX story).

## Related Backend Stories

- **Story 3.1**: Role Entity and Permission Matrix (provides role data)
- **Story 3.2**: Custom Role Guards (protects routes)
- **Story 3.3**: Agent Hierarchy (shows hierarchy in UI)
- **Story 3.5**: Data Access Control (enforces visibility rules)

## Future Enhancements

When implementing, consider these future enhancements:

1. **Role History Timeline**: Show audit log of role changes for each user
2. **Role Templates**: Pre-configured role sets for common user types
3. **Invitation with Roles**: Assign roles during user invitation flow
4. **Role Descriptions**: Tooltips explaining what each role can do
5. **Permission Matrix View**: Visual table showing role permissions
6. **Export User Roles**: Export CSV of users and their roles

## Implementation Checklist

When frontend development begins:

- [ ] Initialize Next.js frontend application
- [ ] Set up API client with authentication
- [ ] Create Team Management page route
- [ ] Implement UserList component
- [ ] Implement RoleAssignmentModal component
- [ ] Add role filtering and search
- [ ] Implement bulk operations
- [ ] Add authorization guards
- [ ] Create React Query hooks
- [ ] Add loading and error states
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Ensure accessibility compliance
- [ ] Add responsive mobile design

## Contact for Questions

When frontend development begins, coordinate with:
- **Backend Team**: For API contract clarification
- **Design Team**: For UI/UX specifications
- **Product Owner**: For feature prioritization

---

## Notes

- This story is marked as **deferred** and should be moved to the backlog
- Re-prioritize when Next.js frontend initialization is complete
- Backend APIs are being built independently and will be ready when frontend work begins
- Consider this story as part of the frontend sprint planning phase
