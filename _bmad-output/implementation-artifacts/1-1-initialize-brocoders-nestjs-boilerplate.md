# Story 1.1: Initialize Brocoders NestJS Boilerplate

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want to clone and initialize the Brocoders NestJS Boilerplate with all required services,
So that I have a production-ready foundation with PostgreSQL, authentication, Docker, and API documentation.

## Acceptance Criteria

**Given** I have access to the project repository
**When** I execute the boilerplate initialization commands
**Then** the project is cloned from `https://github.com/brocoders/nestjs-boilerplate.git`
**And** the project is renamed to `travel-umroh`
**And** environment configuration is copied from `env-example-relational` to `.env`
**And** Docker Compose services are started (PostgreSQL, Adminer, MailDev)
**And** npm dependencies are installed successfully
**And** database migrations are executed via `npm run migration:run`
**And** database seeds are loaded via `npm run seed:run:relational`
**And** the development server starts successfully on `http://localhost:3000`
**And** Swagger API documentation is accessible at `http://localhost:3000/docs`
**And** PostgreSQL database is accessible at `localhost:5432`
**And** Adminer database UI is accessible at `http://localhost:8080`
**And** MailDev email testing UI is accessible at `http://localhost:1080`

## Tasks / Subtasks

- [x] Task 1: Clone and rename boilerplate repository (AC: 1)
  - [x] Execute `git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh`
  - [x] Navigate to project directory `cd travel-umroh/`
  - [x] Verify repository structure matches Brocoders boilerplate structure

- [x] Task 2: Configure environment and start Docker services (AC: 2, 3)
  - [x] Copy `env-example-relational` to `.env`
  - [x] Start Docker services: `docker compose up -d postgres adminer maildev`
  - [x] Verify Docker containers are running with `docker ps`
  - [x] Verify PostgreSQL is accessible on port 5434 (changed from 5432 due to port conflict)
  - [x] Verify Adminer is accessible at http://localhost:8080
  - [x] Verify MailDev is accessible at http://localhost:1080

- [x] Task 3: Install dependencies and configure application (AC: 4)
  - [x] Run `npm install` and verify successful installation
  - [x] Updated jwa and jws packages to latest versions for Node.js v25 compatibility
  - [x] Verify no errors during dependency installation

- [x] Task 4: Execute database migrations and seeds (AC: 5, 6)
  - [x] Run `npm run migration:run` to execute database migrations
  - [x] Verify migrations completed successfully
  - [x] Run `npm run seed:run:relational` to load seed data
  - [x] Verify seed data loaded successfully
  - [x] Connect to database via Adminer and verify tables exist
  - [x] Verify seeded users exist in database

- [x] Task 5: Start development server and validate endpoints (AC: 7, 8)
  - [x] Run `npm run start:dev` to start development server
  - [x] Verify server starts on http://localhost:3000
  - [x] Access Swagger documentation at http://localhost:3000/docs
  - [x] Verify Swagger displays all default endpoints
  - [x] Test auth endpoint: `curl http://localhost:3000/api/v1/auth/me` returns 401 Unauthorized

## Dev Notes

### Technical Requirements
- **Node.js Version**: 18+ LTS version required
- **Docker**: Docker and Docker Compose must be installed
- **Git**: Git must be installed for repository cloning
- **System Resources**: Minimum 4GB RAM available for Docker services

### Architecture Context

**Why Brocoders NestJS Boilerplate?**

This starter template was selected for critical strategic reasons documented in Architecture Decision Document:

1. **Speed to MVP**: Pre-configured authentication, database, Docker setup saves 2-3 weeks of foundation work - critical for aggressive 3-month timeline
2. **Production-Ready**: Battle-tested structure with security best practices, suitable for enterprise SaaS serving 1,036+ travel agencies
3. **Docker-Native**: Complete Docker Compose configuration with PostgreSQL, Adminer (DB management), MailDev (email testing) - essential for multi-tenant environment
4. **Extensibility**: Modular architecture allows easy addition of multi-tenancy, RBAC, WebSocket, Redis - all required for Travel Umroh
5. **I18N Built-in**: Native support for Indonesian language (Bahasa Indonesia) required by all 1,036 target agencies
6. **Documentation**: Comprehensive docs for quick team onboarding during aggressive timeline

**What This Boilerplate Provides Out-of-the-Box:**

✅ **Authentication System**:
- JWT-based authentication with access and refresh tokens
- Session management supporting multiple devices per user
- Password hashing with bcrypt
- Email verification flow ready
- Password reset flow ready
- Social login stubs (Apple, Facebook, Google) - can be activated in Phase 2
- Role-based access foundation (Admin, User) - will extend to 6 roles in Story 3.1

✅ **Database Infrastructure**:
- PostgreSQL as primary database (multi-tenant ready with RLS capabilities)
- TypeORM for database abstraction and migrations
- Migration system for version-controlled schema changes
- Seeding support for initial data and testing
- Adminer GUI for database management during development

✅ **API Architecture**:
- RESTful API architecture
- Swagger/OpenAPI documentation auto-generated
- Versioning support for API evolution (currently /api/v1/)
- Request validation with class-validator
- Error handling middleware with consistent responses
- CORS configuration for web clients

✅ **Email System**:
- Nodemailer integration for transactional emails
- Email templates with Handlebars
- MailDev for local email testing (Docker)
- Queue-ready structure for async email sending (will integrate BullMQ in Epic 8)

✅ **File Management**:
- File upload system with local storage (will add S3 in Phase 2)
- File entity abstraction for attaching files to any entity
- Multi-part form data handling

✅ **Internationalization**:
- I18N (nestjs-i18n) configured for multi-language support
- Translation files structure ready for Bahasa Indonesia
- Language detection from headers/query params

✅ **Testing Infrastructure**:
- Jest configured for unit and E2E tests
- Test database separate from development
- E2E test examples for API endpoints
- CI/CD ready with GitHub Actions examples

✅ **Development Experience**:
- Hot reload in development mode
- Docker Compose for local development environment
- Environment variables management (.env files)
- Database GUI (Adminer) included in Docker
- API documentation auto-updated on code changes

✅ **Security Foundation**:
- Helmet for HTTP header security
- CSRF protection ready
- Rate limiting structure ready
- SQL injection protection via TypeORM parameterized queries
- XSS protection via input validation

✅ **Monitoring & Logging**:
- Winston logger integration ready (will enhance in Story 1.4)
- Request logging middleware
- Error tracking structure ready for Sentry integration (Epic 14)

**Boilerplate Project Structure:**
```
src/
├── auth/              # Authentication module (JWT, sessions, password reset)
├── database/          # Database config, migrations, seeds
├── files/             # File upload module
├── home/              # Example home module
├── mail/              # Email sending module with templates
├── session/           # Session management
├── users/             # User management module
├── utils/             # Utility functions
└── main.ts            # Application entry point
```

### What We'll Add on Top of Boilerplate

**Immediate Next Stories (Epic 1):**
- Story 1.2: Multi-tenancy foundation with `tenant_id` pattern and RLS
- Story 1.3: API standards and TypeScript strict mode
- Story 1.4: Enhanced logging and documentation

**Future Epics Build on This Foundation:**
- Epic 2: Multi-tenant agency management with subdomain routing
- Epic 3: RBAC system extending boilerplate's 2 roles to 6 roles
- Epic 4-15: Business modules leveraging boilerplate's auth, database, and API patterns

### Commands Reference

**Complete Initialization Sequence:**
```bash
# Clone boilerplate with depth 1 for faster cloning
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git travel-umroh

# Navigate to project
cd travel-umroh/

# Copy environment configuration (relational DB variant)
cp env-example-relational .env

# Start Docker services (PostgreSQL + Adminer + MailDev)
docker compose up -d postgres adminer maildev

# Install dependencies
npm install

# Configure app (first time only - generates app ID, etc.)
npm run app:config

# Run database migrations
npm run migration:run

# Run database seeds (creates default users and data)
npm run seed:run:relational

# Start development server with hot reload
npm run start:dev
```

**Service URLs After Initialization:**
- **API**: http://localhost:3000
- **API Documentation (Swagger)**: http://localhost:3000/docs
- **Adminer (DB Management)**: http://localhost:8080
  - System: PostgreSQL
  - Server: postgres (Docker service name)
  - Username: root (from .env)
  - Password: secret (from .env)
  - Database: api (from .env)
- **MailDev (Email Testing)**: http://localhost:1080
- **PostgreSQL Direct Connection**: localhost:5432

### Validation Tests

**1. Database Verification:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Connect via Adminer at http://localhost:8080
# Verify tables exist: users, sessions, files, etc.
# Verify seeded data: default admin/user accounts
```

**2. API Verification:**
```bash
# Test that API is running
curl http://localhost:3000

# Test auth endpoint (should return 401 Unauthorized - auth working correctly)
curl http://localhost:3000/api/v1/auth/me

# Expected response:
# {"statusCode":401,"message":"Unauthorized"}
```

**3. Swagger Documentation:**
- Navigate to http://localhost:3000/docs
- Verify all default endpoints visible:
  - /api/v1/auth/* (login, register, refresh, logout, etc.)
  - /api/v1/users/* (CRUD operations)
  - /api/v1/files/* (upload endpoints)

**4. Email Testing:**
- Navigate to http://localhost:1080
- Trigger password reset or email verification flow
- Verify emails appear in MailDev inbox

### Architecture Compliance Rules

**Critical Rules to Follow Throughout All Future Development:**

1. **ALWAYS use `camelCase` for JSON fields** - Frontend/backend consistency
   - Example: `firstName`, `createdAt`, `packageId`
   - Database columns auto-convert to `snake_case` via TypeORM

2. **ALWAYS use ISO 8601 for dates** - No timestamps, no custom formats
   - Example: "2025-12-22T10:30:00.000Z"

3. **ALWAYS use TypeScript strict mode** - No `any` types without justification
   - Already configured in boilerplate's `tsconfig.json`

4. **ALWAYS use standardized API response format** (will implement in Story 1.3)
   - Success: `{data, meta}`
   - Error: `{error}`

5. **ALWAYS prepare for multi-tenancy** - Design with tenant isolation in mind
   - Story 1.2 will add `tenantId` to all entities
   - All future entities MUST extend `TenantBaseEntity`

**Naming Conventions (from Architecture Document):**
- **Files**: `PascalCase` for classes/components (e.g., `UserService.ts`)
- **Folders**: `kebab-case` (e.g., `agent-management/`)
- **Functions**: `camelCase` (e.g., `calculateCommission()`)
- **Variables**: `camelCase` (e.g., `totalRevenue`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`)
- **Database Tables**: `snake_case` plural (e.g., `travel_agencies`)

### Project Structure Notes

**Boilerplate Structure Alignment:**
The cloned boilerplate follows a modular NestJS architecture that aligns with our Architecture Decision Document (Section: Structure Patterns).

**No Modifications Required in This Story:**
This story is PURELY initialization - no code changes, no custom modules yet. Simply clone, configure, and validate that all services start correctly.

**Next Story Will Begin Customization:**
Story 1.2 (Configure Multi-Tenancy Database Foundation) will be the first to add custom code:
- New `TenantBaseEntity` abstract class
- New `tenants` table and entity
- Migration for multi-tenancy infrastructure

### Troubleshooting Common Issues

**Issue: Docker services won't start**
- Solution: Ensure Docker Desktop is running
- Solution: Check ports 3000, 5432, 8080, 1080 are not in use
- Command: `docker compose down` then `docker compose up -d postgres adminer maildev`

**Issue: npm install fails**
- Solution: Verify Node.js 18+ is installed: `node --version`
- Solution: Clear npm cache: `npm cache clean --force`
- Solution: Delete `node_modules` and `package-lock.json`, retry install

**Issue: Migration fails**
- Solution: Verify PostgreSQL is running: `docker ps | grep postgres`
- Solution: Check database credentials in `.env` match Docker Compose settings
- Solution: Manually connect to DB via Adminer to verify connectivity

**Issue: Port conflicts**
- Solution: Change ports in `docker-compose.yml` if defaults conflict
- Solution: Update `.env` to match new port configuration

### References

All technical details sourced from:
- [Source: /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#Selected Starter: Brocoders NestJS Boilerplate]
- [Source: /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#Architectural Decisions Provided by Starter]
- [Source: /home/yopi/Projects/Travel Umroh/_bmad-output/architecture.md#MVP Implementation Plan with Starter]
- [Source: /home/yopi/Projects/Travel Umroh/_bmad-output/epics.md#Epic 1: Story 1.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Node.js v25 compatibility issue with buffer-equal-constant-time package resolved by updating jwa and jws packages
- PostgreSQL port changed from 5432 to 5434 due to port conflict with existing autolumiku-postgres container
- DATABASE_HOST changed from 'postgres' to 'localhost' in .env for migrations to work from host machine

### Completion Notes List

**Story 1.1 Implementation Summary:**

All acceptance criteria successfully met:

1. **Repository Cloned**: Brocoders NestJS boilerplate cloned to `/home/yopi/Projects/travel-umroh`
2. **Environment Configured**: .env file created from env-example-relational with PostgreSQL configuration
3. **Docker Services Running**:
   - PostgreSQL 17.6-alpine running on port 5434
   - Adminer database UI accessible at http://localhost:8080
   - MailDev email testing UI accessible at http://localhost:1080
4. **Dependencies Installed**: 1393 packages installed via npm install
5. **Database Migrations Executed**: All migrations ran successfully, created tables: user, role, status, session, file, migrations
6. **Seed Data Loaded**: Default users created (admin@example.com, john.doe@example.com)
7. **Development Server Running**: NestJS application started successfully on http://localhost:3000
8. **API Documentation Accessible**: Swagger UI available at http://localhost:3000/docs
9. **Endpoints Validated**:
   - Root endpoint: http://localhost:3000 returns {"name":"NestJS API"}
   - Auth endpoint: http://localhost:3000/api/v1/auth/me returns 401 Unauthorized (correct behavior)

**Configuration Adjustments Made:**
- Updated DATABASE_PORT from 5432 to 5434 in .env (port conflict resolution)
- Updated DATABASE_HOST from 'postgres' to 'localhost' in .env (host machine access)
- Updated jwa and jws packages to latest versions (Node.js v25 compatibility)

**Verification Completed:**
- All 6 database tables created and verified via psql
- Seeded users verified in database
- All Docker services confirmed running
- All API endpoints mapped and accessible
- Swagger documentation displaying all default endpoints

### File List

Files modified/created (relative to project root):
- `.env` - Created from env-example-relational, modified DATABASE_PORT and DATABASE_HOST
- `package.json` - Updated jwa and jws dependencies for Node.js v25 compatibility
- `package-lock.json` - Updated with new dependency versions
