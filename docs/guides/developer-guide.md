# Developer Guide - Epic 3 Stories 3.3-3.6

**Quick Reference for Implementation**

---

## Quick Start

### 1. Install Dependencies (if not already installed)

```bash
npm install @nestjs/common @nestjs/typeorm @nestjs/cache-manager typeorm cache-manager-redis-yet class-validator class-transformer
```

### 2. Run Migrations

```bash
# Run both migrations
npm run migration:run

# Expected output:
# ✓ CreateAgentHierarchiesTable1766397000000
# ✓ CreateJamaahAssignmentsTable1766397100000
```

### 3. Import RolesModule in AppModule

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { RlsSessionMiddleware } from './roles/middleware/rls-session.middleware';

@Module({
  imports: [
    // ... existing imports
    RolesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RlsSessionMiddleware)
      .forRoutes('*');
  }
}
```

### 4. Test the API

Start the server:
```bash
npm run start:dev
```

Test endpoints:
```bash
# View Swagger docs
open http://localhost:3000/api

# Assign agent to hierarchy
curl -X POST http://localhost:3000/api/v1/agents/{agentId}/hierarchy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"uplineId": "upline-uuid"}'

# Get agent hierarchy
curl -X GET http://localhost:3000/api/v1/agents/{agentId}/hierarchy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## File Structure

```
travel-umroh/
├── src/
│   ├── roles/
│   │   ├── domain/
│   │   │   ├── agent-hierarchy.ts
│   │   │   └── jamaah-assignment.ts
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       └── relational/
│   │   │           └── entities/
│   │   │               ├── agent-hierarchy.entity.ts
│   │   │               └── jamaah-assignment.entity.ts
│   │   ├── dto/
│   │   │   ├── assign-agent-hierarchy.dto.ts
│   │   │   └── agent-hierarchy-response.dto.ts
│   │   ├── middleware/
│   │   │   └── rls-session.middleware.ts
│   │   ├── agent-hierarchy.service.ts
│   │   ├── agent-hierarchy.controller.ts
│   │   └── roles.module.ts
│   └── database/
│       └── migrations/
│           ├── 1766397000000-CreateAgentHierarchiesTable.ts
│           └── 1766397100000-CreateJamaahAssignmentsTable.ts
├── _bmad-output/
│   └── implementation-artifacts/
│       └── story-3.6-ui-notes.md
├── IMPLEMENTATION_SUMMARY.md
└── DEVELOPER_GUIDE.md (this file)
```

---

## Key Concepts

### Agent Hierarchy

**Purpose**: Multi-level agent structures for commission distribution

**Levels**:
- Level 0: Root agents (no upline)
- Level 1: Direct downline
- Level 2: Second level downline
- Level 3: Third level downline (maximum)

**Example**:
```
Agency Owner (Level 0)
└── Senior Agent (Level 1)
    └── Junior Agent (Level 2)
        └── Sub-Agent (Level 3) ← Maximum depth
```

### Jamaah Assignments

**Purpose**: Control which agents can access which jamaah (pilgrims)

**Rules**:
- Agents can only query jamaah assigned to them
- Agency owners and admins can see all jamaah
- Assignments are tenant-scoped
- Multiple agents can be assigned to one jamaah (team collaboration)

### RLS (Row-Level Security)

**Purpose**: Database-enforced access control

**How it works**:
1. JWT is decoded in AuthGuard
2. RlsSessionMiddleware sets PostgreSQL session variables
3. RLS policies use session variables to filter queries
4. Agents automatically only see their data

---

## API Examples

### Assign Agent to Hierarchy

```typescript
// Request
POST /api/v1/agents/750e8400-e29b-41d4-a716-446655440002/hierarchy
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "uplineId": "550e8400-e29b-41d4-a716-446655440000"
}

// Success Response (201)
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "agentId": "750e8400-e29b-41d4-a716-446655440002",
  "uplineId": "550e8400-e29b-41d4-a716-446655440000",
  "level": 2,
  "assignedById": "850e8400-e29b-41d4-a716-446655440003",
  "assignedAt": "2025-12-22T10:00:00Z",
  "createdAt": "2025-12-22T10:00:00Z",
  "updatedAt": "2025-12-22T10:00:00Z"
}

// Error Response (400) - Circular Reference
{
  "statusCode": 400,
  "message": "Cannot create circular reference in agent hierarchy",
  "error": "Bad Request"
}

// Error Response (400) - Max Level Exceeded
{
  "statusCode": 400,
  "message": "Cannot assign agent: maximum hierarchy depth of 3 levels exceeded (would be level 4)",
  "error": "Bad Request"
}
```

### Get Agent Hierarchy

```typescript
// Request
GET /api/v1/agents/750e8400-e29b-41d4-a716-446655440002/hierarchy
Authorization: Bearer eyJhbGc...

// Response (200) - Cached for 1 hour
{
  "agent": "750e8400-e29b-41d4-a716-446655440002",
  "level": 2,
  "uplineChain": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "agentId": "750e8400-e29b-41d4-a716-446655440002",
      "uplineId": "550e8400-e29b-41d4-a716-446655440000",
      "level": 2,
      "assignedById": "850e8400-e29b-41d4-a716-446655440003",
      "assignedAt": "2025-12-22T10:00:00Z",
      "createdAt": "2025-12-22T10:00:00Z",
      "updatedAt": "2025-12-22T10:00:00Z"
    }
  ],
  "downlineTree": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440004",
      "agentId": "850e8400-e29b-41d4-a716-446655440005",
      "uplineId": "750e8400-e29b-41d4-a716-446655440002",
      "level": 3,
      "assignedById": "850e8400-e29b-41d4-a716-446655440003",
      "assignedAt": "2025-12-22T11:00:00Z",
      "createdAt": "2025-12-22T11:00:00Z",
      "updatedAt": "2025-12-22T11:00:00Z"
    }
  ]
}
```

### Remove from Hierarchy

```typescript
// Request
DELETE /api/v1/agents/750e8400-e29b-41d4-a716-446655440002/hierarchy
Authorization: Bearer eyJhbGc...

// Success Response (204 No Content)
// No response body
```

---

## Service Usage

### In Your Service/Controller

```typescript
import { Injectable } from '@nestjs/common';
import { AgentHierarchyService } from './roles/agent-hierarchy.service';

@Injectable()
export class CommissionService {
  constructor(
    private readonly agentHierarchyService: AgentHierarchyService,
  ) {}

  async calculateCommission(agentId: string, tenantId: string, amount: number) {
    // Get agent's upline chain for commission distribution
    const uplineChain = await this.agentHierarchyService.getUplineChain(
      agentId,
      tenantId,
    );

    // Calculate commission for each level
    const commissions = uplineChain.map((hierarchy, index) => ({
      agentId: hierarchy.uplineId,
      level: hierarchy.level,
      amount: amount * this.getCommissionRate(hierarchy.level),
    }));

    return commissions;
  }

  private getCommissionRate(level: number): number {
    // Example: 10% for level 1, 5% for level 2, 2% for level 3
    const rates = { 1: 0.10, 2: 0.05, 3: 0.02 };
    return rates[level] || 0;
  }
}
```

---

## Database Queries

### Check Session Variables

```sql
-- Check current session variables
SELECT current_setting('app.tenant_id', true) AS tenant_id;
SELECT current_setting('app.user_id', true) AS user_id;
SELECT current_setting('app.role', true) AS role;
```

### Manual Hierarchy Query

```sql
-- Get upline chain
WITH RECURSIVE upline_chain AS (
  SELECT * FROM agent_hierarchies
  WHERE agent_id = 'YOUR_AGENT_ID'
    AND tenant_id = 'YOUR_TENANT_ID'
    AND deleted_at IS NULL

  UNION ALL

  SELECT h.* FROM agent_hierarchies h
  INNER JOIN upline_chain uc ON h.agent_id = uc.upline_id
  WHERE h.tenant_id = 'YOUR_TENANT_ID'
    AND h.deleted_at IS NULL
)
SELECT * FROM upline_chain;

-- Get downline tree
WITH RECURSIVE downline_tree AS (
  SELECT * FROM agent_hierarchies
  WHERE upline_id = 'YOUR_AGENT_ID'
    AND tenant_id = 'YOUR_TENANT_ID'
    AND deleted_at IS NULL

  UNION ALL

  SELECT h.* FROM agent_hierarchies h
  INNER JOIN downline_tree dt ON h.upline_id = dt.agent_id
  WHERE h.tenant_id = 'YOUR_TENANT_ID'
    AND h.deleted_at IS NULL
)
SELECT * FROM downline_tree;
```

### Check RLS Policies

```sql
-- View RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('agent_hierarchies', 'jamaah_assignments');

-- Test RLS (as application user)
SET app.tenant_id = 'YOUR_TENANT_ID';
SET app.user_id = 'YOUR_USER_ID';
SET app.role = 'agent';

SELECT * FROM jamaah_assignments; -- Should only see assigned jamaah
```

---

## Testing

### Unit Test Example

```typescript
// agent-hierarchy.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AgentHierarchyService } from './agent-hierarchy.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';

describe('AgentHierarchyService', () => {
  let service: AgentHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentHierarchyService,
        {
          provide: getRepositoryToken(AgentHierarchyEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
            createQueryRunner: jest.fn().mockReturnValue({
              query: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AgentHierarchyService>(AgentHierarchyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should prevent circular reference', async () => {
    // Test implementation
  });
});
```

### E2E Test Example

```typescript
// agent-hierarchy.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AgentHierarchyController (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'owner@test.com', password: 'password' });

    ownerToken = loginResponse.body.token;
  });

  it('POST /api/v1/agents/:id/hierarchy - should assign agent to hierarchy', () => {
    return request(app.getHttpServer())
      .post('/api/v1/agents/agent-id/hierarchy')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ uplineId: 'upline-id' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.level).toBeGreaterThan(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## Common Issues & Solutions

### Issue: "Role is not defined" error

**Cause**: JWT doesn't contain roles array

**Solution**: Update JWT payload to include roles:
```typescript
// auth.service.ts
const payload = {
  sub: user.id,
  email: user.email,
  tenantId: user.tenantId,
  roles: user.roles.map(r => r.name), // Add this
};
```

### Issue: RLS blocking all queries

**Cause**: Session variables not set

**Solution**: Ensure middleware is applied:
```typescript
// app.module.ts
configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(RlsSessionMiddleware)
    .forRoutes('*'); // Must be '*' not specific routes
}
```

### Issue: Cache not working

**Cause**: Redis not connected

**Solution**: Check Redis configuration:
```typescript
// Check Redis connection
redis-cli ping
# Should return: PONG

// Check NestJS Redis config
CacheModule.registerAsync({
  useFactory: async () => ({
    store: await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
  }),
}),
```

### Issue: TypeORM can't find entities

**Cause**: Entities not included in TypeORM config

**Solution**: Add entity path:
```typescript
TypeOrmModule.forRoot({
  // ... other config
  entities: ['dist/**/*.entity.js'],
  // OR explicitly:
  entities: [AgentHierarchyEntity, JamaahAssignmentEntity],
}),
```

---

## Performance Tips

1. **Use Cache**: Hierarchy queries are cached for 1 hour. Clear cache only when necessary.

2. **Batch Operations**: If assigning multiple agents, consider adding a bulk assignment endpoint.

3. **Indexes**: Composite indexes are already created. Don't add more unless profiling shows need.

4. **Recursive Depth Limit**: CTE queries have safety limit of 10 levels. Adjust if needed.

5. **Connection Pooling**: Use connection pooling for high-traffic scenarios:
   ```typescript
   TypeOrmModule.forRoot({
     // ...
     extra: {
       max: 20, // Maximum connections
       min: 5,  // Minimum connections
     },
   }),
   ```

---

## Security Checklist

- ✓ All queries filter by tenant_id
- ✓ RLS policies enforce database-level isolation
- ✓ JWT contains tenant and role information
- ✓ Authorization guards protect endpoints
- ✓ Input validation with class-validator
- ✓ SQL injection prevented (parameterized queries)
- ✓ Audit trail (assigned_by_id, timestamps)
- ✓ Soft delete preserves history

---

## Next Steps

1. **Test the Implementation**
   - Run migrations
   - Test API endpoints
   - Verify RLS policies
   - Check cache behavior

2. **Integration**
   - Add to existing AppModule
   - Configure authorization guards
   - Update JWT payload with roles

3. **Documentation**
   - Update Swagger docs
   - Add usage examples
   - Document API contracts

4. **Monitoring**
   - Log hierarchy operations
   - Monitor cache hit rates
   - Track query performance

---

## Resources

- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io
- **PostgreSQL RLS**: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **Redis Caching**: https://redis.io/docs/manual/patterns/

---

## Support

For questions or issues:
1. Check IMPLEMENTATION_SUMMARY.md for detailed information
2. Review story-3.6-ui-notes.md for frontend requirements
3. Consult PostgreSQL logs for RLS issues
4. Check Redis for caching issues

**Implementation Status**: ✓ Complete and Ready for Testing
