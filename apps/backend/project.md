# FLCN LMS — Backend (`apps/backend`)

## Overview

The backend is a NestJS monolith serving two distinct route trees from a single process: a **SaaS Admin API** (`/api/v1/*`) operating on a shared master database, and an **Institute API** (`/api/v1/:instituteSlug/*`) operating on dynamically resolved per-institute databases.

**Stack:** NestJS, TypeScript, TypeORM, PostgreSQL, JWT (Passport), CASL, LiveKit, Redis (queues + leaderboard cache)

***

## Architecture

```
Single NestJS process (port 3000)
│
├── /api/v1/*                        SaaS Admin API
│   DB: flcn_master (shared)
│   Auth: SaasAuthGuard (SAAS_JWT_SECRET)
│   Users: SuperAdmin entity only
│
└── /api/v1/:instituteSlug/*         Institute API
    DB: inst_{slug} (per-institute, resolved at request time)
    Auth: InstituteAuthGuard (INSTITUTE_JWT_SECRET)
    Users: User entity (admin | faculty | student)
```

***

## Project Structure

```
apps/backend/src/
├── main.ts                          # App entry, global prefix, versioning
├── app.module.ts                    # Root module, RouterModule registration
├── app.controller.ts                # Health check endpoint
├── app.service.ts
│
├── common/                          # Shared across both route trees
│   ├── auth/                        # SaaS JWT strategy + login controller
│   ├── guards/                      # SaasAuthGuard, InstituteAuthGuard, PermissionsGuard
│   ├── decorators/                  # @CurrentUser, @CurrentInstituteSlug
│   ├── middleware/                  # InstituteRoutingMiddleware
│   └── casl/                        # CASL ability factory
│
├── database/
│   ├── master/                      # Master datasource (flcn_master)
│   │   ├── master.datasource.ts
│   │   ├── master.module.ts
│   │   └── migrations/
│   └── institute/                   # Per-institute datasource factory
│       ├── institute-connection.manager.ts
│       ├── institute.datasource.ts
│       └── migrations/
│
├── master-entities/                 # TypeORM entities for master DB
│   ├── institute.entity.ts
│   ├── institute-billing.entity.ts
│   ├── institute-database.entity.ts
│   ├── branch.entity.ts
│   ├── api-key.entity.ts
│   ├── audit-log.entity.ts
│   ├── feature-flag.entity.ts
│   ├── plan.entity.ts
│   └── super-admin.entity.ts
│
│   ── SaaS Admin Modules (/api/v1/*) ──────────────────
├── institutes-admin/                # Institute CRUD for SaaS admins
├── billing/                         # Institute billing management
├── plans/                           # SaaS pricing plans
├── super-admins/                    # SaaS-level user management
├── seeding/                         # Super admin seed script
│
│   ── Institute App (/api/v1/:slug/*) ─────────────────
└── institutes/
    ├── auth/                        # Institute JWT strategy + login
    ├── users/                       # Students + faculty
    ├── courses/                     # Courses, modules, lessons, enrollment
    ├── questions/                   # Question bank
    ├── exam-types/                  # Exam type configuration
    ├── test-series/                 # Test series, tests, sections
    ├── attempts/                    # Attempt engine, scoring
    ├── leaderboard/                 # Rankings
    └── live-sessions/               # LiveKit sessions, chat, Q&A, polls
```

***

## Database Strategy

### Master DB (`flcn_master`)

Stores all SaaS-level data. One shared database for the entire platform.

| Entity | Purpose |
|--------|---------|
| `Institute` | Registered institutes (tenants) |
| `InstituteBilling` | Billing records per institute |
| `InstituteDatabase` | DB credentials per institute |
| `Plan` | SaaS pricing plans |
| `Branch` | Institute branches |
| `ApiKey` | API keys per institute |
| `AuditLog` | Admin audit trail |
| `FeatureFlag` | Feature toggles per institute |
| `SuperAdmin` | SaaS admin users |

### Per-Institute DBs (`inst_{slug}`)

Each institute gets its own isolated PostgreSQL database. All institute TypeORM entities live here.

**DB name pattern:** `inst_pw_live`, `inst_adda247`, `inst_motion`

**Connection resolution:** `InstituteConnectionManager` resolves the correct DataSource at request time using `instituteSlug` from the JWT payload.

```
Request arrives → InstituteRoutingMiddleware extracts slug
→ InstituteJwtStrategy validates token + slug match
→ InstituteConnectionManager.getRepo(slug, Entity) returns correct repo
→ Controller uses repo normally
```

***

## Routing

Both route trees are registered in `app.module.ts` via NestJS `RouterModule`:

```
SaaS Admin:
  POST   /api/v1/auth/login
  GET    /api/v1/institutes
  POST   /api/v1/institutes
  PATCH  /api/v1/institutes/:id
  GET    /api/v1/billing
  GET    /api/v1/plans
  GET    /api/v1/audit-logs
  GET    /api/v1/feature-flags
  GET    /api/v1/super-admins

Institute:
  POST   /api/v1/:slug/auth/login
  GET    /api/v1/:slug/courses
  POST   /api/v1/:slug/courses
  GET    /api/v1/:slug/test-series
  GET    /api/v1/:slug/test-series/:id/tests
  POST   /api/v1/:slug/attempts/start
  PATCH  /api/v1/:slug/attempts/:id/response
  POST   /api/v1/:slug/attempts/:id/submit
  GET    /api/v1/:slug/leaderboard/:testId
  GET    /api/v1/:slug/live-sessions
  POST   /api/v1/:slug/live-sessions
  GET    /api/v1/:slug/users/students
  GET    /api/v1/:slug/users/faculty
  GET    /api/v1/:slug/questions
  GET    /api/v1/:slug/exam-types
```

***

## Authentication

### SaaS Admin Auth

| Property | Value |
|----------|-------|
| Strategy name | `saas-jwt` |
| Guard | `SaasAuthGuard` |
| Secret | `SAAS_JWT_SECRET` |
| DB | `flcn_master` → `SuperAdmin` entity |
| JWT payload | `{ sub, email, role: "super_admin" }` |
| Used on | All `/api/v1/*` routes |

### Institute Auth

| Property | Value |
|----------|-------|
| Strategy name | `institute-jwt` |
| Guard | `InstituteAuthGuard` |
| Secret | `INSTITUTE_JWT_SECRET` |
| DB | `inst_{slug}` → `User` entity |
| JWT payload | `{ sub, email, role, instituteSlug, instituteId }` |
| Used on | All `/api/v1/:slug/*` routes |

**Security check:** JWT `instituteSlug` must match URL `:instituteSlug`. Mismatch throws `401 Institute mismatch`.

***

## Institute Modules (`institutes/`)

### `auth/`
- `POST /auth/login` → validates credentials against `inst_*` DB, returns JWT
- `institute-jwt.strategy.ts` → Passport strategy, resolves user from correct DB

### `users/`
- Entities: `User` (role: admin | faculty | student)
- Services: `findStudents()`, `findFaculty()`, `createUser()`, `updateUser()`

### `courses/`
- Entities: `Course`, `Module`, `Lesson`, `Category`, `CourseEnrollment`, `LessonProgress`
- `Lesson.type`: `video | live | pdf | quiz | dpp | text`
- Tracks per-student progress via `LessonProgress`

### `questions/`
- Entities: `Question`, `QuestionOption`
- `Question.type`: `mcq | msq | integer | subjective`
- `isApproved` flag — faculty creates, admin approves before use in tests
- Supports LaTeX content fields

### `exam-types/`
- Stores exam configs (JEE Mains, NEET, UPSC etc.)
- Each exam type defines marking scheme defaults

### `test-series/`
- Entities: `TestSeries`, `Test`, `TestSection`, `TestQuestion`, `TestSeriesEnrollment`
- `Test.type`: `full_length | sectional | chapter_wise | dpp | previous_year`
- Supports per-section timers and max-attemptable question limits
- `shuffleQuestions` and `shuffleOptions` flags per test

### `attempts/`
- Entities: `TestAttempt`, `AttemptSection`, `QuestionResponse`, `TestResult`
- **Pause/Resume:** `remainingTimeSecs` saved on heartbeat
- **Anti-cheat:** `tabSwitchCount` incremented via WebSocket focus events
- **Scoring:** `scoring.util.ts` handles positive/negative/partial marks
- **Result:** `sectionBreakdown` and `topicBreakdown` stored as `jsonb` on `TestResult`
- `showResultAfter`: `instant | after_end_date | manual`

### `leaderboard/`
- Entity: `Leaderboard` (materialised table, updated async after submit)
- Indexed on `(testId, rank)` for fast ordered reads
- Tiebreaker: `timeTakenSecs`

### `live-sessions/`
- Entities: `LiveSession`, `LiveChatMessage`, `LiveQA`, `LivePoll`, `LiveAttendance`
- Integrates with **LiveKit** for WebRTC
- HLS fallback URL stored for 500+ viewer classes
- Poll votes cached in Redis, flushed to DB on session end
- Attendance tracked with join/leave timestamps

***

## Master-Level Modules

### `institutes-admin/`
- Full CRUD for `Institute` entity on master DB
- `InstituteContextService` handles provisioning new institute DB on create

### `billing/`
- Manages `InstituteBilling` records
- Tracks plan, payment status, renewal dates

### `plans/`
- SaaS pricing tiers stored in `Plan` entity
- `features` stored as `jsonb` array

### `super-admins/`
- Full CRUD for `SuperAdmin` entity
- Only accessible with valid `SaasAuthGuard` token

### `seeding/`
- `seed-super-admin.ts` — creates initial super admin on first deploy
- Run via: `npx ts-node src/seeding/seed-super-admin.ts`

***

## Migrations

```bash
# Master DB migrations
npm run migration:master:generate -- --name=MigrationName
npm run migration:master:run

# Institute DB migrations (runs against all inst_* DBs)
npm run migration:institute:generate -- --name=MigrationName
npm run migration:institute:run -- --slug=pw-live
```

***

## Environment Variables

```env
# App
PORT=3000
NODE_ENV=development

# Master DB
MASTER_DB_HOST=localhost
MASTER_DB_PORT=5432
MASTER_DB_NAME=flcn_master
MASTER_DB_USER=postgres
MASTER_DB_PASS=secret

# Institute DB (template — slug substituted at runtime)
INSTITUTE_DB_HOST=localhost
INSTITUTE_DB_PORT=5432
INSTITUTE_DB_USER=postgres
INSTITUTE_DB_PASS=secret

# Auth
SAAS_JWT_SECRET=change_in_production_saas
SAAS_JWT_EXPIRES=8h
INSTITUTE_JWT_SECRET=change_in_production_institute
INSTITUTE_JWT_EXPIRES=24h

# LiveKit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_HOST=

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

***

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| Single process, two route trees | Simpler deployment (one Docker container) without sacrificing logical separation |
| Per-institute PostgreSQL DB | Full data isolation, easier GDPR compliance, no row-level tenant leakage risk |
| `instituteSlug` in JWT payload | Every request is self-contained — no middleware lookup needed to find the right DB |
| `sectionBreakdown` as `jsonb` | Avoids heavy joins on the post-test analysis page |
| `Leaderboard` as materialised table | Fast rank reads without recalculating percentile on every request |
| `isApproved` on `Question` | Quality gate — faculty creates, admin reviews before question enters any live test |
| `tabSwitchCount` on `TestAttempt` | Anti-cheat signal without full proctoring infrastructure |
| Two separate JWT secrets | Compromising one secret does not affect the other auth system |