# Story 3.1: Create Role Entity and Permission Matrix

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want to create the role entity with permission matrix infrastructure,
So that the system can enforce role-based access control across all features.

## Acceptance Criteria

1. **Given** the tenant and user entities exist
   **When** I implement RBAC foundation
   **Then** a `roles` table is created with fields:
   - `id` (UUID, primary key)
   - `tenant_id` (UUID, foreign key to tenants)
   - `name` (ENUM: agency_owner, agent, affiliate, admin, jamaah, family)
   - `display_name` (VARCHAR: localized role name in Indonesian)
   - `description` (TEXT: role purpose and permissions)
   - `created_at`, `updated_at`

2. **And** a `user_roles` junction table links users to roles:
   - `id` (UUID, primary key)
   - `tenant_id` (UUID)
   - `user_id` (UUID, foreign key to users)
   - `role_id` (UUID, foreign key to roles)
   - `assigned_by_id` (UUID, foreign key to users)
   - `assigned_at` (TIMESTAMP)

3. **And** a `permissions` table defines granular permissions:
   - `id` (UUID, primary key)
   - `resource` (VARCHAR: jamaah, payment, package, document, etc.)
   - `action` (ENUM: create, read, update, delete, export, approve)
   - `role_id` (UUID, foreign key to roles)

4. **And** the 7 roles are seeded with default permissions per RBAC matrix:
   - Super Admin: Platform-wide access to all tenants and resources
   - Agency Owner: Full access to all tenant resources
   - Agent: Read/write assigned jamaah, read-only packages
   - Affiliate: Limited access within hierarchy
   - Admin: Review/approve documents and payments
   - Jamaah: Read-only own data, upload own documents
   - Family: Read-only for linked family member data

**And** role assignment authorization enforces:
   - Super Admin can assign ANY role (including super_admin)
   - Agency Owner can assign: agent, affiliate, admin, jamaah, family (NOT super_admin)
   - All other roles CANNOT assign roles

**And** role removal validation prevents:
   - Removing last agency_owner from a tenant (must have at least 1)
   - Self-removal of agency_owner role
   - Non-authorized users from removing roles

5. **And** database migration includes PostgreSQL RLS policies for role-based filtering

6. **And** unit tests verify role creation and permission assignment

## Tasks / Subtasks

- [ ] Task 1: Create Role Entity and Migration (AC: #1)
  - [ ] Subtask 1.1: Create `src/roles/domain/role.ts` domain entity
  - [ ] Subtask 1.2: Create `src/roles/infrastructure/persistence/relational/entities/role.entity.ts`
  - [ ] Subtask 1.3: Extend `TenantBaseEntity` to inherit `tenant_id` and soft delete
  - [ ] Subtask 1.4: Define role name ENUM: `super_admin | agency_owner | agent | affiliate | admin | jamaah | family`
  - [ ] Subtask 1.5: Add Indonesian display names in entity
  - [ ] Subtask 1.6: Add audit trail fields: `created_by_id`, `updated_by_id` (following Epic 2 retrospective recommendation)
  - [ ] Subtask 1.7: Generate migration: `npm run migration:generate -- src/database/migrations/CreateRolesTable`
  - [ ] Subtask 1.8: Review migration file for composite indexes: `(tenant_id, name)`
  - [ ] Subtask 1.9: Add unique constraint on `(tenant_id, name)` to prevent duplicate roles per tenant

- [ ] Task 2: Create User-Roles Junction Table (AC: #2)
  - [ ] Subtask 2.1: Create `src/roles/infrastructure/persistence/relational/entities/user-role.entity.ts`
  - [ ] Subtask 2.2: Extend `TenantBaseEntity` for tenant isolation
  - [ ] Subtask 2.3: Add foreign keys: `user_id`, `role_id`, `assigned_by_id`
  - [ ] Subtask 2.4: Add `assigned_at` timestamp (defaults to `CURRENT_TIMESTAMP`)
  - [ ] Subtask 2.5: Add `deleted_at` timestamp for soft delete (audit trail compliance)
  - [ ] Subtask 2.6: Generate migration: `npm run migration:generate -- src/database/migrations/CreateUserRolesTable`
  - [ ] Subtask 2.7: Add composite index: `(user_id, role_id, tenant_id)` for performance
  - [ ] Subtask 2.8: Add unique constraint: `(user_id, role_id, tenant_id)` to prevent duplicate assignments
  - [ ] Subtask 2.9: Add cascade delete behavior: delete user-role when user or role is deleted
  - [ ] Subtask 2.10: **CRITICAL**: Create trigger function `validate_user_role_tenant()` to enforce tenant consistency
  - [ ] Subtask 2.11: Attach BEFORE INSERT/UPDATE trigger to validate user, role, and assigned_by belong to same tenant
  - [ ] Subtask 2.12: Test trigger by attempting cross-tenant role assignment (should fail)

- [ ] Task 3: Create Permissions Entity (AC: #3)
  - [ ] Subtask 3.1: Create `src/roles/infrastructure/persistence/relational/entities/permission.entity.ts`
  - [ ] Subtask 3.2: Define resource ENUM: `jamaah | payment | package | document | user | tenant | role`
  - [ ] Subtask 3.3: Define action ENUM: `create | read | update | delete | export | approve`
  - [ ] Subtask 3.4: Add foreign key: `role_id` → roles table
  - [ ] Subtask 3.5: **NOTE**: Permissions are GLOBAL (no tenant_id) - same permission matrix for all tenants
  - [ ] Subtask 3.6: Generate migration: `npm run migration:generate -- src/database/migrations/CreatePermissionsTable`
  - [ ] Subtask 3.7: Add composite index: `(role_id, resource, action)` for fast permission checks
  - [ ] Subtask 3.8: Add unique constraint: `(role_id, resource, action)` to prevent duplicate permissions

- [ ] Task 4: Implement Role Repository and Service (AC: #4)
  - [ ] Subtask 4.1: Create `src/roles/infrastructure/persistence/role.repository.ts` implementing `RoleRepository`
  - [ ] Subtask 4.2: Create `src/roles/roles.service.ts` with methods: `create()`, `findByName()`, `findAll()`, `update()`, `remove()`
  - [ ] Subtask 4.3: Implement tenant-scoped queries (filter by `tenant_id` automatically via `TenantAwareRepository`)
  - [ ] Subtask 4.4: **TRANSACTION SAFETY**: Add `assignRoleToUser(userId, roleName, queryRunner)` method
    - Require `queryRunner` parameter for transactional safety (follows Story 2.1 pattern)
    - Wrap role assignment + cache invalidation in transaction
    - Validate assignment authorization (who can assign what roles)
    - Throw `ForbiddenException` if user not authorized to assign role
  - [ ] Subtask 4.5: Add `removeRoleFromUser(userId, roleName, queryRunner)` method with validation:
    - **CRITICAL**: Prevent removing last agency_owner from tenant (count check)
    - Prevent self-removal of agency_owner role
    - Require queryRunner for transaction safety
    - Throw `ForbiddenException` if validation fails
  - [ ] Subtask 4.6: Add `getUserRoles(userId)` method to fetch user's roles
  - [ ] Subtask 4.7: Add `checkPermission(userId, resource, action)` method
  - [ ] Subtask 4.8: Cache role permissions in Redis: `tenant:{tenantId}:user:{userId}:permissions` (TTL: 5 minutes)
  - [ ] Subtask 4.9: Invalidate cache when role assignment changes
  - [ ] Subtask 4.10: Add `canAssignRole(assignerRole, targetRole)` helper method for authorization matrix

- [ ] Task 5: Seed Default Roles and Permissions (AC: #4)
  - [ ] Subtask 5.1: Create seed file: `src/database/seeds/relational/role/role-seed.service.ts`
  - [ ] Subtask 5.2: Seed 7 roles with Indonesian display names and descriptions (including super_admin)
  - [ ] Subtask 5.3: Create permission matrix configuration in `src/roles/config/permission-matrix.ts`
  - [ ] Subtask 5.4: Seed permissions based on matrix:
    - **Super Admin**: ALL resources → ALL actions + cross-tenant access + role management
    - **Agency Owner**: All tenant resources → all actions (except cross-tenant)
    - **Agent**: `jamaah` → read/update (assigned only), `package` → read
    - **Affiliate**: `jamaah` → read (assigned only), `package` → read
    - **Admin**: `document` → approve, `payment` → approve, `jamaah` → read
    - **Jamaah**: Own `jamaah` record → read, Own `document` → create/read
    - **Family**: Linked family `jamaah` → read
  - [ ] Subtask 5.5: Run seed: `npm run seed:run:relational`
  - [ ] Subtask 5.6: Verify roles and permissions created in database
  - [ ] Subtask 5.7: **DATA MIGRATION**: Create migration to assign default roles to existing users
  - [ ] Subtask 5.8: **CRITICAL**: Backfill tenant admin users (created in Story 2.1) with agency_owner role
  - [ ] Subtask 5.9: Verify all existing users have at least one role assigned

- [ ] Task 6: Implement PostgreSQL RLS Policies (AC: #5)
  - [ ] Subtask 6.1: Create migration for RLS policies: `src/database/migrations/AddRlsPoliciesForRoles.ts`
  - [ ] Subtask 6.2: Enable RLS on `roles` table: `ALTER TABLE roles ENABLE ROW LEVEL SECURITY;`
  - [ ] Subtask 6.3: Create policy for tenant isolation on roles:
    ```sql
    CREATE POLICY roles_tenant_isolation ON roles
      FOR ALL
      USING (tenant_id = current_setting('app.tenant_id')::uuid);
    ```
  - [ ] Subtask 6.4: Enable RLS on `user_roles` table with same policy
  - [ ] Subtask 6.5: **SKIP RLS on permissions table** - Permissions are GLOBAL (no tenant_id), same permission matrix for all tenants
  - [ ] Subtask 6.6: Test RLS policies by setting `app.tenant_id` session variable
  - [ ] Subtask 6.7: Update `TenantMiddleware` to set PostgreSQL session variables from JWT

- [ ] Task 7: Update User Entity to Reference Roles (AC: #2)
  - [ ] Subtask 7.1: Update `src/users/infrastructure/persistence/relational/entities/user.entity.ts`
  - [ ] Subtask 7.2: Add `@ManyToMany` relationship to roles via `user_roles` junction table
  - [ ] Subtask 7.3: Add `roles` getter that loads user's roles eagerly
  - [ ] Subtask 7.4: Update UserRepository to include roles in queries when needed
  - [ ] Subtask 7.5: Generate migration if needed for foreign key changes

- [ ] Task 8: Create Roles Module and Controller (AC: #4)
  - [ ] Subtask 8.1: Create NestJS module: `src/roles/roles.module.ts`
  - [ ] Subtask 8.2: Create controller: `src/roles/roles.controller.ts`
  - [ ] Subtask 8.3: Add admin endpoints:
    - `GET /api/v1/roles` - List all roles (super_admin/agency_owner only)
    - `GET /api/v1/roles/:id` - Get single role with permissions
    - `POST /api/v1/users/:userId/roles/:roleName` - Assign role to user (authorization enforced)
    - `DELETE /api/v1/users/:userId/roles/:roleName` - Remove role from user (with validations)
    - `POST /api/v1/users/bulk/roles/:roleName` - Bulk assign role to multiple users (optional optimization)
  - [ ] Subtask 8.4: Create DTOs: `AssignRoleDto`, `BulkAssignRoleDto`, `RoleResponseDto`, `PermissionResponseDto`
  - [ ] Subtask 8.5: Add authorization guards to enforce role assignment matrix in controller
  - [ ] Subtask 8.6: Import RolesModule in AppModule
  - [ ] Subtask 8.7: Add Swagger documentation with `@ApiTags('roles')` and auth examples

- [ ] Task 9: Write Unit Tests (AC: #6)
  - [ ] Subtask 9.1: Create `src/roles/roles.service.spec.ts`
  - [ ] Subtask 9.2: Test role creation and retrieval
  - [ ] Subtask 9.3: Test role assignment to user
  - [ ] Subtask 9.4: Test `checkPermission()` method logic
  - [ ] Subtask 9.5: Test tenant isolation (role from tenant A not visible to tenant B)
  - [ ] Subtask 9.6: Test permission seeding logic
  - [ ] Subtask 9.7: Mock Redis cache for permission checking tests

- [ ] Task 10: Write Integration Tests (AC: #6)
  - [ ] Subtask 10.1: Create `test/roles.e2e-spec.ts`
  - [ ] Subtask 10.2: Test role assignment API endpoint
  - [ ] Subtask 10.3: Test role listing API endpoint
  - [ ] Subtask 10.4: Test cross-tenant role isolation (tenant A admin cannot assign roles in tenant B)
  - [ ] Subtask 10.5: Test permission checking across different roles
  - [ ] Subtask 10.6: Test seed data creation and validation
  - [ ] Subtask 10.7: **NEW**: Test removing last agency_owner (should fail with 403)
  - [ ] Subtask 10.8: **NEW**: Test super_admin accessing cross-tenant data
  - [ ] Subtask 10.9: **NEW**: Test permission cache hit/miss with Redis
  - [ ] Subtask 10.10: **NEW**: Test RLS policy enforcement at database level
  - [ ] Subtask 10.11: **NEW**: Test role assignment with invalid tenant_id (should fail)
  - [ ] Subtask 10.12: **NEW**: Test bulk role assignment endpoint
  - [ ] Subtask 10.13: **NEW**: Test trigger validation for cross-tenant role assignments
  - [ ] Subtask 10.14: Clean up test database after tests

- [ ] Task 11: Update JWT Token to Include Roles (HIGH PRIORITY)
  - [ ] Subtask 11.1: Modify `auth.service.ts` to include user roles in JWT payload
  - [ ] Subtask 11.2: Update JwtStrategy to extract and validate roles from token
  - [ ] Subtask 11.3: Add roles array to request.user object for controller access
  - [ ] Subtask 11.4: Update JWT payload interface to include `roles: string[]` field
  - [ ] Subtask 11.5: Update token refresh logic to include latest roles
  - [ ] Subtask 11.6: Invalidate JWT when user role changes (force re-login)
  - [ ] Subtask 11.7: Update API documentation with new JWT structure
  - [ ] Subtask 11.8: Test JWT token contains roles after login
  - [ ] Subtask 11.9: Test role-based route access using JWT claims

## Dev Notes

### Architecture Alignment

This story implements the **RBAC Foundation** for the Travel Umroh platform, establishing the role and permission infrastructure required by Epic 3: Role-Based Access Control System.

**Key Architecture Patterns:**
- **Multi-Tenancy**: All role entities extend `TenantBaseEntity` for automatic tenant isolation
- **PostgreSQL RLS**: Row-Level Security policies enforce tenant boundaries at database level
- **Permission Caching**: Redis caching (5-min TTL) for role permission lookups to meet <10ms guard overhead (NFR-1.2)
- **Soft Deletes**: Role assignments use soft delete for audit trail compliance (NFR-3.6)
- **Seeded Data**: Roles and permissions seeded from configuration file for easy updates

**Technology Stack Compliance:**
- **Backend**: NestJS with TypeORM, extends Brocoders boilerplate patterns
- **Database**: PostgreSQL 15+ with TypeORM migrations
- **Caching**: Redis (shared with BullMQ) via `@nestjs/cache-manager`
- **ORM**: TypeORM entities with decorators, follows existing entity patterns

### Project Structure Notes

**Files to Create:**

```
src/roles/
├── domain/
│   ├── role.ts                                      # Domain entity
│   ├── permission.ts                                # Permission domain entity
│   └── user-role.ts                                 # User-role junction domain entity
├── infrastructure/
│   └── persistence/
│       ├── role.repository.ts                       # Role repository interface
│       └── relational/
│           ├── entities/
│           │   ├── role.entity.ts                   # TypeORM role entity (extends TenantBaseEntity)
│           │   ├── permission.entity.ts             # TypeORM permission entity
│           │   └── user-role.entity.ts              # TypeORM user-role junction entity
│           ├── repositories/
│           │   └── role.repository.impl.ts          # Role repository implementation
│           └── mappers/
│               └── role.mapper.ts                   # Entity ↔ Domain mapping
├── config/
│   └── permission-matrix.ts                         # Permission matrix configuration
├── dto/
│   ├── assign-role.dto.ts                          # DTO for assigning roles
│   ├── role-response.dto.ts                        # DTO for role API responses
│   └── permission-response.dto.ts                  # DTO for permission responses
├── roles.controller.ts                              # REST API endpoints
├── roles.service.ts                                 # Business logic
├── roles.service.spec.ts                           # Unit tests
└── roles.module.ts                                  # NestJS module

src/database/
├── migrations/
│   ├── XXXXXX-CreateRolesTable.ts                  # Roles table migration
│   ├── XXXXXX-CreateUserRolesTable.ts              # User-roles junction table migration
│   ├── XXXXXX-CreatePermissionsTable.ts            # Permissions table migration
│   └── XXXXXX-AddRlsPoliciesForRoles.ts            # RLS policies migration
└── seeds/
    └── relational/
        └── role/
            └── role-seed.service.ts                 # Seed roles and permissions

test/
└── roles.e2e-spec.ts                                # Integration tests
```

**Files to Modify:**

```
src/users/infrastructure/persistence/relational/entities/user.entity.ts  # Add @ManyToMany roles relationship
src/common/middleware/tenant.middleware.ts                                # Add PostgreSQL session variable setting
src/app.module.ts                                                         # Import RolesModule
```

### Previous Story Intelligence (Epic 2 Learnings)

**From Story 2.2 (Subdomain Routing):**
- ✅ **TenantBaseEntity pattern works perfectly** - All entities extending it get automatic `tenant_id` and soft delete
- ✅ **TenantSubscriber auto-injects tenant_id** - No manual setting needed in service methods
- ✅ **ClsService stores request context** - Use `this.clsService.get('tenantSlug')` to get current tenant
- ⚠️ **Migration planning**: Create default data BEFORE adding NOT NULL constraints
- 📝 **Composite indexes**: Always add `(tenant_id, <primary_key>)` for tenant-scoped queries

**From Story 2.4 (Resource Limits):**
- ✅ **Redis integration via cache-manager-redis-yet** - Use this library, NOT cache-manager-redis-store
- ✅ **Redis key naming**: Follow pattern `tenant:{tenantId}:resource:{resourceId}:data`
- ✅ **Atomic operations**: Use Lua scripts for multi-step Redis operations
- ✅ **Fail-closed strategy**: Throw errors (don't return defaults) for critical security checks
- ⚠️ **UTC standardization**: Always use `getUTCFullYear()` and `getUTCMonth()` for date operations

**From Epic 2 Retrospective:**
- 🔐 **Security-first**: Use `crypto.randomInt()` instead of `Math.random()` for any random generation
- 🔒 **Pessimistic locking**: Use `lock: { mode: 'pessimistic_write' }` for conflict-prone operations
- 📊 **Transaction safety**: Require `queryRunner` parameter for multi-step operations
- 🧪 **Adversarial testing**: E2E tests caught cross-tenant leakage, unit tests didn't

**Epic 3 Story 3.1 Specific Learnings to Apply:**
- **Extend ClsService usage**: Store `currentUser` and `currentRole` in addition to `tenantSlug`
- **Use TenantAwareRepository**: Automatically filters by `tenant_id`, no manual WHERE clauses needed
- **Cache permissions aggressively**: NFR-1.2 requires <10ms guard overhead, Redis cache is mandatory
- **PostgreSQL session variables**: Set `app.tenant_id` and `app.role` in middleware for RLS policies

### Technical Requirements

**Database Schema Design:**

1. **Roles Table:**
   ```sql
   CREATE TABLE roles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
     name VARCHAR(50) NOT NULL CHECK (name IN ('super_admin', 'agency_owner', 'agent', 'affiliate', 'admin', 'jamaah', 'family')),
     display_name VARCHAR(100) NOT NULL,  -- Indonesian localized name
     description TEXT,
     created_by_id UUID REFERENCES users(id),  -- Audit trail
     updated_by_id UUID REFERENCES users(id),  -- Audit trail
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     deleted_at TIMESTAMP,                -- Soft delete
     UNIQUE (tenant_id, name)             -- Prevent duplicate roles per tenant
   );
   CREATE INDEX idx_roles_tenant_id ON roles(tenant_id, id);
   ```

2. **User-Roles Junction Table:**
   ```sql
   CREATE TABLE user_roles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
     assigned_by_id UUID NOT NULL REFERENCES users(id),
     assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     deleted_at TIMESTAMP,  -- Soft delete for audit trail
     UNIQUE (user_id, role_id, tenant_id)
   );
   CREATE INDEX idx_user_roles_user_id ON user_roles(user_id, tenant_id);
   CREATE INDEX idx_user_roles_role_id ON user_roles(role_id, tenant_id);

   -- Trigger function to validate tenant consistency (replaces CHECK constraint)
   CREATE OR REPLACE FUNCTION validate_user_role_tenant()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Validate user belongs to tenant
     IF NOT EXISTS (
       SELECT 1 FROM users WHERE id = NEW.user_id AND tenant_id = NEW.tenant_id
     ) THEN
       RAISE EXCEPTION 'User % does not belong to tenant %', NEW.user_id, NEW.tenant_id;
     END IF;

     -- Validate role belongs to tenant
     IF NOT EXISTS (
       SELECT 1 FROM roles WHERE id = NEW.role_id AND tenant_id = NEW.tenant_id
     ) THEN
       RAISE EXCEPTION 'Role % does not belong to tenant %', NEW.role_id, NEW.tenant_id;
     END IF;

     -- Validate assigned_by user belongs to tenant
     IF NOT EXISTS (
       SELECT 1 FROM users WHERE id = NEW.assigned_by_id AND tenant_id = NEW.tenant_id
     ) THEN
       RAISE EXCEPTION 'Assigner % does not belong to tenant %', NEW.assigned_by_id, NEW.tenant_id;
     END IF;

     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Attach trigger
   CREATE TRIGGER trg_validate_user_role_tenant
     BEFORE INSERT OR UPDATE ON user_roles
     FOR EACH ROW
     EXECUTE FUNCTION validate_user_role_tenant();
   ```

3. **Permissions Table:**
   ```sql
   CREATE TABLE permissions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
     resource VARCHAR(50) NOT NULL CHECK (resource IN ('jamaah', 'payment', 'package', 'document', 'user', 'tenant', 'role')),
     action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'export', 'approve')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     UNIQUE (role_id, resource, action)   -- Prevent duplicate permissions per role
   );
   CREATE INDEX idx_permissions_role_id ON permissions(role_id, resource, action);

   -- NOTE: Permissions table is GLOBAL (no tenant_id)
   -- Same permission matrix applies to all tenants
   -- Role assignments (user_roles) are tenant-scoped
   ```

**Permission Matrix Configuration:**

```typescript
// src/roles/config/permission-matrix.ts

export const PERMISSION_MATRIX = {
  super_admin: {
    jamaah: ['create', 'read', 'update', 'delete', 'export'],
    payment: ['create', 'read', 'update', 'delete', 'export', 'approve'],
    package: ['create', 'read', 'update', 'delete'],
    document: ['create', 'read', 'update', 'delete', 'approve'],
    user: ['create', 'read', 'update', 'delete'],
    tenant: ['create', 'read', 'update', 'delete', 'export'],  // Can manage all tenants
    role: ['create', 'read', 'update', 'delete'],  // Can manage roles globally
  },
  agency_owner: {
    jamaah: ['create', 'read', 'update', 'delete', 'export'],
    payment: ['create', 'read', 'update', 'delete', 'export', 'approve'],
    package: ['create', 'read', 'update', 'delete'],
    document: ['create', 'read', 'update', 'delete', 'approve'],
    user: ['create', 'read', 'update', 'delete'],
    tenant: ['read', 'update'],  // Own tenant only
    role: ['read'],  // Can view roles (assign via dedicated endpoint)
  },
  agent: {
    jamaah: ['read', 'update'],  // Only assigned jamaah
    package: ['read'],
    document: ['read'],
  },
  affiliate: {
    jamaah: ['read'],  // Only assigned jamaah
    package: ['read'],
  },
  admin: {
    jamaah: ['read', 'export'],
    payment: ['read', 'approve'],
    package: ['read'],
    document: ['read', 'approve'],
  },
  jamaah: {
    jamaah: ['read'],        // Only own record
    document: ['create', 'read'],  // Own documents only
    package: ['read'],
  },
  family: {
    jamaah: ['read'],        // Only linked family member
    document: ['read'],      // Linked family member's documents
    package: ['read'],
  },
};

export const ROLE_DISPLAY_NAMES = {
  super_admin: 'Super Admin',
  agency_owner: 'Pemilik Agensi',
  agent: 'Agen',
  affiliate: 'Afiliasi',
  admin: 'Admin',
  jamaah: 'Jamaah',
  family: 'Keluarga',
};

export const ROLE_DESCRIPTIONS = {
  super_admin: 'Akses platform penuh untuk mengelola semua agensi',
  agency_owner: 'Akses penuh ke semua fitur dan data agensi',
  agent: 'Dapat mengelola jamaah yang ditugaskan dan melihat paket',
  affiliate: 'Akses terbatas untuk afiliasi dalam hierarki agen',
  admin: 'Dapat mereview dan menyetujui dokumen serta pembayaran',
  jamaah: 'Hanya dapat melihat data pribadi dan mengunggah dokumen',
  family: 'Dapat melihat data anggota keluarga yang terhubung',
};

// Role Assignment Authorization Matrix
export const ROLE_ASSIGNMENT_MATRIX = {
  super_admin: ['super_admin', 'agency_owner', 'agent', 'affiliate', 'admin', 'jamaah', 'family'],
  agency_owner: ['agent', 'affiliate', 'admin', 'jamaah', 'family'],  // Cannot assign super_admin or agency_owner
  // All other roles cannot assign roles
};
```

**TypeORM Entity Pattern:**

```typescript
// src/roles/infrastructure/persistence/relational/entities/role.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { TenantBaseEntity } from 'src/common/entities/tenant-base.entity';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { PermissionEntity } from './permission.entity';

export enum RoleName {
  SUPER_ADMIN = 'super_admin',
  AGENCY_OWNER = 'agency_owner',
  AGENT = 'agent',
  AFFILIATE = 'affiliate',
  ADMIN = 'admin',
  JAMAAH = 'jamaah',
  FAMILY = 'family',
}

@Entity('roles')
@Unique(['tenant_id', 'name'])
export class RoleEntity extends TenantBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleName,
  })
  name: RoleName;

  @Column({ type: 'varchar', length: 100 })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @OneToMany(() => PermissionEntity, (permission) => permission.role, { eager: true })
  permissions: PermissionEntity[];
}
```

**Redis Caching Strategy:**

```typescript
// Cache user permissions in Redis
const cacheKey = `tenant:${tenantId}:user:${userId}:permissions`;
const cachedPermissions = await this.cacheManager.get<Permission[]>(cacheKey);

if (cachedPermissions) {
  return cachedPermissions;
}

// If not cached, query from database
const permissions = await this.permissionRepository.findByUserId(userId);

// Cache for 5 minutes (300 seconds)
await this.cacheManager.set(cacheKey, permissions, 300);

return permissions;
```

**Cache Invalidation on Role Changes:**

```typescript
// When role assignment changes, invalidate user's permission cache
async invalidateUserPermissionsCache(userId: string, tenantId: string): Promise<void> {
  const cacheKey = `tenant:${tenantId}:user:${userId}:permissions`;
  await this.cacheManager.del(cacheKey);
}
```

### Library & Framework Requirements

**Required Dependencies (Already Installed):**
- `@nestjs/common` (NestJS core)
- `@nestjs/typeorm` (TypeORM integration)
- `typeorm` (ORM)
- `@nestjs/cache-manager` (Caching)
- `cache-manager-redis-yet` (Redis cache store)

**NO NEW DEPENDENCIES NEEDED** - All required libraries already installed from Epic 1 and Epic 2.

### Testing Requirements

**Unit Tests (`src/roles/roles.service.spec.ts`):**

```typescript
describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: MockType<RoleRepository>;
  let cacheManager: MockType<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RoleRepository, useFactory: mockRoleRepository },
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get(RoleRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('assignRoleToUser', () => {
    it('should assign role to user successfully', async () => {
      // Test role assignment logic
    });

    it('should prevent cross-tenant role assignment', async () => {
      // Ensure user from tenant A cannot be assigned role from tenant B
    });

    it('should invalidate cache after role assignment', async () => {
      // Verify cache invalidation on role change
    });
  });

  describe('checkPermission', () => {
    it('should return true for agency_owner with any permission', async () => {
      // Agency owner has full access
    });

    it('should return false for agent accessing payment creation', async () => {
      // Agent does not have payment:create permission
    });

    it('should use cached permissions if available', async () => {
      // Verify Redis cache hit
    });
  });
});
```

**Integration Tests (`test/roles.e2e-spec.ts`):**

```typescript
describe('Roles API (e2e)', () => {
  let app: INestApplication;
  let tenantA: TenantEntity;
  let tenantB: TenantEntity;
  let agencyOwnerA: User;
  let agentA: User;
  let agencyOwnerB: User;

  beforeAll(async () => {
    // Set up test app and seed test data
  });

  describe('POST /api/v1/users/:userId/roles/:roleName', () => {
    it('should assign role to user within same tenant', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/users/${agentA.id}/roles/agent`)
        .set('Authorization', `Bearer ${agencyOwnerAToken}`)
        .expect(201);
    });

    it('should prevent cross-tenant role assignment (403 Forbidden)', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/users/${agentA.id}/roles/agent`)  // Tenant A user
        .set('Authorization', `Bearer ${agencyOwnerBToken}`)  // Tenant B token
        .expect(403);
    });

    it('should prevent non-owner from assigning roles (403 Forbidden)', async () => {
      return request(app.getHttpServer())
        .post(`/api/v1/users/${agentA.id}/roles/agent`)
        .set('Authorization', `Bearer ${agentAToken}`)  // Agent trying to assign roles
        .expect(403);
    });
  });

  describe('GET /api/v1/roles', () => {
    it('should return all roles for tenant', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/roles')
        .set('Authorization', `Bearer ${agencyOwnerAToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(6);  // 6 roles
      expect(response.body.data[0].name).toBe('agency_owner');
    });

    it('should only return roles for current tenant (isolation)', async () => {
      // Verify tenant A roles not visible to tenant B
    });
  });
});
```

### NFRs Addressed

**NFR-1.2: Guard execution <10ms overhead per request**
- ✅ Redis caching for permission lookups (5-min TTL)
- ✅ Composite indexes on `(role_id, resource, action)` for fast queries
- ✅ Eager loading of permissions with roles to avoid N+1 queries

**NFR-3.7: Zero privilege escalation enforcement**
- ✅ PostgreSQL RLS policies enforce tenant boundaries at database level
- ✅ Unique constraint `(user_id, role_id, tenant_id)` prevents duplicate assignments
- ✅ Foreign key constraint ensures user, role, and assigned_by belong to same tenant
- ✅ Integration tests verify cross-tenant isolation

**NFR-3.6: Log all role assignments as critical operations**
- ✅ `assigned_by_id` field tracks who assigned the role
- ✅ `assigned_at` timestamp records when assignment occurred
- ✅ Soft delete on roles and user-roles preserves audit trail
- ✅ (Future): Audit log table will capture role assignment events

### Role Assignment Strategy & Authorization

**Default Role Assignment:**
- **Tenant Owner** (created in Story 2.1): Automatically assigned `agency_owner` role via data migration (Subtask 5.8)
- **New Users Invited by Owner**: Role specified at invitation time via API parameter
- **New Jamaah/Family Users**: Assigned appropriate role during registration flow

**Role Assignment Authorization Matrix:**
```typescript
// Who can assign which roles
const ROLE_ASSIGNMENT_MATRIX = {
  super_admin: ['super_admin', 'agency_owner', 'agent', 'affiliate', 'admin', 'jamaah', 'family'],
  agency_owner: ['agent', 'affiliate', 'admin', 'jamaah', 'family'],  // CANNOT assign super_admin or agency_owner
  // All other roles: CANNOT assign any roles
};
```

**Role Removal Protection:**
- **Last Agency Owner**: Cannot be removed (tenant must have ≥1 agency_owner)
- **Self-Removal**: Agency owner cannot remove their own agency_owner role
- **Authorization Check**: Only users with assignment authority can remove roles

**JWT Token Integration:**
- JWT payload includes `roles: string[]` field
- Role changes invalidate JWT (force re-login for immediate effect)
- Guards read roles from JWT claims for fast authorization checks

### References

- [Source: _bmad-output/epics.md#Epic 3: Role-Based Access Control System]
- [Source: _bmad-output/architecture.md#Authentication & Security]
- [Source: _bmad-output/architecture.md#Data Architecture - PostgreSQL with TypeORM]
- [Source: _bmad-output/architecture.md#Caching Strategy: Redis with cache-manager]
- [Source: _bmad-output/implementation-artifacts/2-2-subdomain-routing-configuration.md#TenantBaseEntity Pattern]
- [Source: _bmad-output/implementation-artifacts/2-4-resource-limits-enforcement.md#Redis Integration]
- [Source: _bmad-output/implementation-artifacts/retrospectives/epic-2-retrospective.md#Lessons Learned]

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent_
