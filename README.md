# Travel Umroh Platform API

Multi-tenant SaaS platform for Umroh travel agencies

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

## 🌍 Local Testing

Run backend + frontend locally using external PostgreSQL and Redis:

```bash
# Make script executable (first time only)
chmod +x start-local.sh

# Start everything
./start-local.sh
```

Requirements: external PostgreSQL and Redis must be running and reachable.
This script will:
1. Use PostgreSQL & Redis from your `.env`
2. Run Database Migrations
3. Start the Backend API
4. Start the Frontend Application

## 🐳 Docker (Backend Only)

This repository now uses a single `Dockerfile` for backend deployment.
PostgreSQL and Redis must be provided externally.

```bash
# Build backend image
docker build -t travel-umroh-backend .

# Run backend with external DB/Redis configuration
docker run --rm -p 3001:3001 --env-file .env.docker travel-umroh-backend
```


## 📚 API Documentation

- **Swagger UI:** http://localhost:3000/api/docs
- **Base URL:** http://localhost:3000/api/v1

## 🏗️ Project Structure

```
travel-umroh/
├── src/
│   ├── roles/                 # Epic 3: Role-based access control
│   ├── whatsapp/              # Epic 9: WhatsApp stub (Phase 2)
│   ├── landing-pages/         # Epic 10: Agent landing pages (core)
│   ├── leads/                 # Epic 10: Lead capture
│   ├── users/                 # Epic 10: Agent branding
│   ├── app.module.ts          # Main application module
│   └── main.ts                # Application entry point
├── docs/
│   ├── integrations/          # Phase 2 integration guides
│   │   ├── whatsapp.md        # WhatsApp Business API guide
│   │   └── chatbot.md         # AI Chatbot integration guide
│   └── frontend-tasks/        # Frontend implementation specs
└── database/
    └── migrations/            # Database schema migrations
```

## 📦 Implemented Features

### ✅ Epic 3: Role-Based Access Control & Agent Hierarchy
- Multi-level agent hierarchy (max 3 levels)
- Granular data access control with RLS
- Agent-jamaah assignment system
- Redis caching for performance

### ✅ Epic 9: Phase 2 Placeholders
- WhatsApp Business API stub endpoints (returns 501)
- AI Chatbot frontend specification
- Comprehensive integration documentation

### 🚧 Epic 10: Agent Landing Page Builder (40% Complete)
- Landing page domain models and entities
- Lead capture domain models and entities
- Agent branding domain models and entities
- Template renderer service with Handlebars
- 3 responsive templates (Modern, Classic, Minimal)
- **Pending:** Controllers, Services, DTOs, Migration

## 🔧 Available Scripts

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debugger

# Production
npm run build            # Build for production
npm run start:prod       # Start production server

# Database
npm run migration:run    # Run pending migrations
npm run migration:revert # Revert last migration

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:cov         # Generate coverage report

# Code Quality
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

## 🗄️ Database Setup

### PostgreSQL Setup

```bash
# Create database
createdb travel_umroh

# Create user (optional)
createuser -P travel_umroh_user

# Grant permissions
psql -d travel_umroh -c "GRANT ALL PRIVILEGES ON DATABASE travel_umroh TO travel_umroh_user;"
```

### Run Migrations

```bash
npm run migration:run
```

### Current Tables

From **Epic 3**:
- `agent_hierarchies` - Multi-level agent relationships
- `jamaah_assignments` - Agent-jamaah access control

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/travel_umroh

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📡 API Endpoints

### Roles & Agent Hierarchy (Epic 3)

```bash
# Assign agent to hierarchy
POST /api/v1/agents/:id/hierarchy
{
  "uplineId": "uuid",
  "level": 1
}

# Get agent hierarchy
GET /api/v1/agents/:id/hierarchy

# Remove from hierarchy
DELETE /api/v1/agents/:id/hierarchy
```

### WhatsApp Integration (Epic 9 - Stub)

```bash
# Get integration status
GET /api/v1/whatsapp/status
# Returns 501 with planned features

# Register for launch notification
POST /api/v1/whatsapp/notify-me
{
  "email": "user@example.com",
  "feature": "whatsapp"
}
# Returns 200 - Actually works!

# Other endpoints return 501
POST /api/v1/whatsapp/send
POST /api/v1/whatsapp/broadcast
GET /api/v1/whatsapp/conversations/:id
```

## 🎯 Phase 2 Features (Coming Soon)

### WhatsApp Business API Integration
- Bidirectional messaging
- Automated payment reminders
- Broadcast messages
- Template message system
- Full documentation: `docs/integrations/whatsapp.md`

### AI-Powered Chatbot
- 3 modes: Public, Agent, Admin
- Natural language understanding
- Knowledge base sync
- Lead capture and routing
- Full documentation: `docs/integrations/chatbot.md`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## 📖 Documentation

- **Epic 9 Summary:** `EPIC_9_SUMMARY.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Developer Guide:** `DEVELOPER_GUIDE.md`
- **Files Created:** `FILES_CREATED.md`
- **WhatsApp Integration:** `docs/integrations/whatsapp.md`
- **AI Chatbot:** `docs/integrations/chatbot.md`
- **Frontend Tasks:** `docs/frontend-tasks/`

## 🏛️ Architecture

### Design Patterns
- **Domain-Driven Design (DDD)** - Clean separation of concerns
- **Multi-Tenancy** - Row-Level Security (RLS) for data isolation
- **CQRS** - Command-Query Responsibility Segregation
- **Repository Pattern** - Data access abstraction

### Tech Stack
- **Framework:** NestJS 10+
- **ORM:** TypeORM 0.3+
- **Database:** PostgreSQL 14+
- **Cache:** Redis 7+
- **Authentication:** JWT
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator

## 🔒 Security

- Row-Level Security (RLS) at database level
- JWT-based authentication
- Role-based authorization
- Input validation with class-validator
- SQL injection prevention (TypeORM)
- CORS configuration
- Environment-based secrets

## 📊 Monitoring

### Health Check
```bash
GET /api/v1/health
```

### Swagger Documentation
```bash
GET /api/docs
```

## 🚧 Roadmap

### Phase 1 (MVP) - Current
- [x] Epic 1: Database & Multi-Tenancy
- [x] Epic 2: Authentication & Authorization
- [x] Epic 3: Role-Based Access Control
- [ ] Epic 4: Jamaah Management
- [ ] Epic 5: Package Management
- [ ] Epic 6: Booking System
- [ ] Epic 7: Payment Gateway
- [ ] Epic 8: Real-Time Communication
- [x] Epic 9: Phase 2 Placeholders
- [ ] Epic 10: Agent Landing Pages

### Phase 2 (Q2 2025)
- [ ] WhatsApp Business API Integration
- [ ] AI-Powered Chatbot (3 modes)
- [ ] Advanced Reporting & Analytics
- [ ] Mobile App (React Native)

## 🤝 Contributing

### Code Style
- Follow NestJS best practices
- Use TypeScript strict mode
- Write JSDoc comments for public APIs
- Include unit tests for new features

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/epic-X-story-Y

# Commit with descriptive messages
git commit -m "feat(epic-X): implement story Y.Z"

# Push and create PR
git push origin feature/epic-X-story-Y
```

## 📝 License

UNLICENSED - Proprietary software for Travel Umroh platform

## 📞 Support

For questions or issues:
- Review documentation in `docs/` folder
- Check `DEVELOPER_GUIDE.md` for common issues
- Review Swagger API docs at `/api/docs`

---

**Current Status:** Epic 3 + Epic 9 (Stubs) Implemented
**Next Steps:** Implement Epic 4 (Jamaah Management)
**Last Updated:** 2025-12-22
