# Repository Guidelines

## Project Structure & Module Organization
This repository contains a NestJS backend and a Next.js frontend.

- `src/`: backend modules (e.g., `auth/`, `jamaah/`, `payments/`, `documents/`, `virtual-account/`), plus `src/database/migrations/`.
- `frontend/`: Next.js App Router app (`app/`, `components/`, `lib/`, `hooks/`).
- `docs/`: integration, API platform, compliance, and planning docs.
- `scripts/`: utility scripts such as local seed helpers.
- Infra/runtime files: `Dockerfile`, `start-local.sh`, `dev.sh`.

## Build, Test, and Development Commands
Backend (repo root):

- `npm install`: install backend dependencies.
- `npm run start:dev`: run NestJS in watch mode.
- `npm run build` and `npm run start:prod`: build and run production bundle.
- `npm run lint` / `npm run format`: run ESLint + Prettier fixes.
- `npm run test`, `npm run test:cov`, `npm run test:e2e`: unit, coverage, and e2e tests.
- `npm run migration:run` / `npm run migration:generate`: apply or generate TypeORM migrations.

Frontend (`frontend/`):

- `npm install`
- `npm run dev`: run Next.js locally.
- `npm run build` and `npm run start`
- `npm run lint`

Full local stack:

- `./start-local.sh` starts Postgres, backend, and frontend (frontend on port `3001`).

## Coding Style & Naming Conventions
- Language: TypeScript across backend/frontend.
- Formatting/linting: Prettier + ESLint (`.eslintrc.js`, `frontend` ESLint via Next).
- Indentation: 2 spaces in most TS/TSX files; keep style consistent with surrounding code.
- Naming: kebab-case filenames; Nest patterns like `*.module.ts`, `*.service.ts`, `*.controller.ts`, DTOs in `dto/`.
- Follow `AI_RULES.md`: no hardcoded secrets/URLs, avoid `any`, explicit error handling, remove TODO/FIXME before merge.

## Testing Guidelines
- Backend uses Jest (`*.spec.ts`, configured in root `package.json`).
- Place tests beside implementation or under matching module paths.
- Run `npm run test:cov` before opening PRs for backend changes.
- Frontend currently relies on manual validation; use `frontend/TESTING-GUIDE.md` checklists for UI flows.

## Commit & Pull Request Guidelines
- Git history is currently minimal (`Initial commit`), so use Conventional Commit-style messages going forward.
- Preferred format: `feat(scope): short summary` (e.g., `feat(payments): add payout approval endpoint`), similarly `fix`, `refactor`, `docs`, `test`.
- PRs should include: concise description, linked issue/story, impacted modules, migration notes (if DB changed), test evidence, and UI screenshots for frontend changes.
