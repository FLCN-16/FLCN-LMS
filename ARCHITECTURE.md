# FLCN-LMS Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [5-App Architecture](#5-app-architecture)
3. [Tech Stack](#tech-stack)
4. [Data Flow](#data-flow)
5. [Component Breakdown](#component-breakdown)
6. [API Endpoints](#api-endpoints)
7. [Database Architecture](#database-architecture)
8. [Deployment Model](#deployment-model)
9. [Security & License Verification](#security--license-verification)
10. [Development Guidelines](#development-guidelines)

---

## Project Overview

**FLCN-LMS** is a **multi-tenant, white-label Learning Management System** built as a monorepo using Turborepo and pnpm.

### Key Characteristics

- **SaaS Model**: You (FLCN) manage licenses, billing, and customer data
- **White-Label**: Customers get fully customizable, self-contained LMS deployments
- **Self-Hosted**: Customers run LMS in their own infrastructure (Docker containers)
- **License Verification**: All customer instances verify their license with your backend periodically
- **Data Separation**: Complete data isolation — you never see customer LMS data
- **Feature-Based Licensing**: Control what features each customer can use

### Business Model

```
FLCN (You)
├── Issue licenses to customers
├── Collect license verification pings for analytics
├── Track usage, billing, and feature flags
└── Provide support & updates

Customer (Tenant)
├── Buys a license from you
├── Downloads LMS package (Docker)
├── Deploys in their own infrastructure
├── Uses complete, standalone LMS
└── Verifies license with you (cached for 24h)
```

---

## 5-App Architecture

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLCN (Your Side)                             │
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │   App 1              │    │   App 2                      │  │
│  │   SaaS Admin Panel   │◄──►│   NestJS Backend             │  │
│  │   (React + Vite)     │    │                              │  │
│  │                      │    │   /api/v1/licenses           │  │
│  │   - Manage clients   │    │   /api/v1/customers          │  │
│  │   - Issue licenses   │    │   /api/v1/plans              │  │
│  │   - View analytics   │    │   /api/v1/billing            │  │
│  │   - Billing          │    │   /api/v1/feature-flags      │  │
│  │   - Feature flags    │    │   /api/v1/analytics          │  │
│  └──────────────────────┘    └──────────────┬───────────────┘  │
│                                             │ flcn_master DB   │
└─────────────────────────────────────────────┼───────────────────┘
                                              │
                              License Verify  │  HTTPS
                              POST /api/v1/license/verify
                              { licenseKey, domain, instanceId }
                                              │
┌─────────────────────────────────────────────┼───────────────────┐
│                 LMS Owner (Customer Side)   │                   │
│                                             ▼                   │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │   App 3              │    │   App 4                      │  │
│  │   Dashboard          │◄──►│   Go Gin LMS Backend         │  │
│  │   (React + Vite)     │    │                              │  │
│  │                      │    │   /api/v1/courses            │  │
│  │   - Manage courses   │    │   /api/v1/test-series        │  │
│  │   - Manage students  │    │   /api/v1/attempts           │  │
│  │   - Test series      │    │   /api/v1/live-sessions      │  │
│  │   - Live sessions    │    │   /api/v1/users              │  │
│  │   - Analytics        │    │   /api/v1/auth               │  │
│  │   - Settings         │    │                              │  │
│  └──────────────────────┘    └──────────────┬───────────────┘  │
│                                             │                   │
│  ┌──────────────────────┐                   │ customer_db       │
│  │   App 5              │                   │ (their Postgres)  │
│  │   Storefront         │◄──────────────────┘                   │
│  │   (Next.js)          │                                       │
│  │                      │                                       │
│  │   - Public catalog   │                                       │
│  │   - Course pages     │                                       │
│  │   - Test series      │                                       │
│  │   - Student portal   │                                       │
│  │   - Test attempt     │                                       │
│  │   - Live player      │                                       │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

### App 1: SaaS Admin Panel (Your Side)

**Purpose**: Internal administrative interface for managing the SaaS business

**Technology**:
- React 19
- Vite 8
- TanStack Query
- shadcn/ui + Radix UI
- Tailwind CSS v4

**Hosted On**: Your infrastructure (Vercel, AWS, or VPS)

**Users**: Only your team (SuperAdmins)

**Authentication**: Internal JWT authentication

**Key Features**:
- Customer/Tenant management (CRUD)
- License issuance and tracking
- Subscription/Billing management
- Feature flags per customer
- Usage analytics dashboard
- Audit logs
- Payment records
- Support ticket system

**Routes**:
```
/dashboard
  /customers              → List, create, edit, delete customers
  /licenses               → View, create, revoke, inspect licenses
  /plans                  → Manage subscription tiers and features
  /billing                → Payment records, invoices, refunds
  /feature-flags          → Toggle features per customer
  /analytics              → Usage dashboard from all instances
  /audit-logs             → Internal audit trail
  /support                → Support requests from customers
  /settings               → System configuration
```

**Communicates With**:
- App 2 (NestJS Backend) — for all business logic

**Database Access**: flcn_master PostgreSQL (owned by you)

---

### App 2: NestJS Backend (Your Side)

**Purpose**: Core business logic, license verification, billing, analytics

**Technology**:
- NestJS 11
- TypeORM
- PostgreSQL (flcn_master)
- JWT authentication
- GraphQL (optional)

**Hosted On**: Your infrastructure

**Key Modules**:

#### `licenses/` Module
```
Responsibilities:
  - Issue licenses (unique keys)
  - Verify licenses from App 4 (Go Gin)
  - Track license expiration
  - Manage feature sets per license
  - Log verification attempts for analytics

Routes:
  POST   /api/v1/licenses              → Create new license
  GET    /api/v1/licenses              → List all licenses (admin)
  GET    /api/v1/licenses/:id          → Get license details
  PATCH  /api/v1/licenses/:id          → Update license
  DELETE /api/v1/licenses/:id          → Revoke license
  POST   /api/v1/licenses/verify       → Verify license (from App 4)
```

#### `customers/` Module
```
Responsibilities:
  - Customer account management
  - Organization details
  - Contact information

Routes:
  POST   /api/v1/customers             → Create customer
  GET    /api/v1/customers             → List customers
  GET    /api/v1/customers/:id         → Get customer
  PATCH  /api/v1/customers/:id         → Update customer
  DELETE /api/v1/customers/:id         → Delete customer
```

#### `plans/` Module
```
Responsibilities:
  - Define subscription tiers
  - Feature sets per plan
  - Pricing information

Routes:
  GET    /api/v1/plans                 → List all plans
  POST   /api/v1/plans                 → Create plan (admin)
  PATCH  /api/v1/plans/:id             → Update plan (admin)
```

#### `billing/` Module
```
Responsibilities:
  - Stripe integration
  - Invoice generation
  - Payment tracking

Routes:
  POST   /api/v1/billing/webhook       → Stripe webhook handler
  GET    /api/v1/billing/invoices      → List invoices
```

#### `feature-flags/` Module
```
Responsibilities:
  - Enable/disable features per customer
  - Feature availability checks

Routes:
  GET    /api/v1/feature-flags/:customerId → Get flags for customer
  POST   /api/v1/feature-flags/:customerId → Set flags (admin)
```

#### `analytics/` Module
```
Responsibilities:
  - Collect license verification pings
  - Track usage metrics
  - Generate reports

Routes:
  POST   /api/v1/analytics/ping        → Log verification attempt (from App 4)
  GET    /api/v1/analytics/dashboard   → Analytics data (admin)
```

**Communicates With**:
- App 1 (Admin Dashboard) — receives requests
- App 4 (Go Gin) — receives license verification pings
- Stripe API — for billing

**Database**: flcn_master PostgreSQL

**Authentication**: 
- SaasAuthGuard for Admin requests (from App 1)
- PublicApiKeyGuard for license verification (from App 4)

---

### App 3: LMS Admin Dashboard (Customer Side)

**Purpose**: Admin interface for institute/customer to manage LMS

**Technology**:
- React 19
- Vite 8
- TanStack Query
- shadcn/ui + Radix UI
- Tailwind CSS v4

**Hosted On**: Customer's Docker container (shipped with package)

**Users**: Institute admin, faculty, department heads

**Authentication**: JWT from App 4

**Key Features**:
- Course CRUD and organization
- Module and lesson management
- Test series and question bank
- Live session management
- Student management and enrollments
- Faculty management
- Grade tracking and reports
- Revenue/transaction management
- Branding and customization settings
- Integration settings

**Routes**:
```
/admin
  /courses              → Course management (CRUD)
  /modules              → Module organization within courses
  /lessons              → Individual lesson content
  /test-series          → Test series management
  /questions            → Question bank management
  /live-sessions        → Schedule and manage live classes
  /students             → Student management, bulk import
  /faculty              → Faculty management
  /enrollments          → Manage course enrollments
  /analytics            → Course and test analytics
  /revenue              → Transaction history, coupons
  /settings             → Branding, integrations, API keys
  /reports              → Advanced reporting
```

**Communicates With**:
- App 4 (Go Gin Backend) — all data operations

**Database Access**: Customer's PostgreSQL database (through App 4 API only)

---

### App 4: Go Gin LMS Backend (Customer Side)

**Purpose**: Core LMS engine, handles all business logic and data persistence

**Technology**:
- Go 1.21+
- Gin Web Framework
- GORM (ORM)
- PostgreSQL
- JWT authentication
- LiveKit integration (for live sessions)

**Hosted On**: Customer's Docker container (shipped with package)

**Key Features**:
- License verification and caching
- User authentication (students, faculty, admins)
- Course management and organization
- Module and lesson delivery
- Test series engine with questions
- Attempt submission and scoring
- Live session integration
- Leaderboard and rankings
- Progress tracking
- Certificate generation
- Payment processing (Razorpay, Stripe)

**API Endpoints**:

#### Authentication (`/api/v1/auth`)
```
POST   /api/v1/auth/register           → Student registration
POST   /api/v1/auth/login              → Login (student/admin)
POST   /api/v1/auth/refresh            → Refresh JWT token
POST   /api/v1/auth/logout             → Logout
GET    /api/v1/auth/me                 → Get current user
```

#### Courses (`/api/v1/courses`)
```
GET    /api/v1/courses                 → List courses
POST   /api/v1/courses                 → Create course (admin)
GET    /api/v1/courses/:id             → Get course details
PATCH  /api/v1/courses/:id             → Update course (admin)
DELETE /api/v1/courses/:id             → Delete course (admin)
GET    /api/v1/courses/:id/modules     → Get modules in course
GET    /api/v1/courses/:id/lessons     → Get all lessons
GET    /api/v1/courses/:id/enrolled-students → Get enrolled students
```

#### Test Series (`/api/v1/test-series`)
```
GET    /api/v1/test-series             → List test series
POST   /api/v1/test-series             → Create test series (admin)
GET    /api/v1/test-series/:id         → Get test details
PATCH  /api/v1/test-series/:id         → Update test (admin)
DELETE /api/v1/test-series/:id         → Delete test (admin)
GET    /api/v1/test-series/:id/sections → Get sections/questions
```

#### Attempts (`/api/v1/attempts`)
```
POST   /api/v1/attempts                → Start new attempt
GET    /api/v1/attempts/:id            → Get attempt details
PATCH  /api/v1/attempts/:id/submit     → Submit answers
GET    /api/v1/attempts/:id/result     → Get attempt result
GET    /api/v1/attempts/user/history   → Get student's attempt history
```

#### Live Sessions (`/api/v1/live-sessions`)
```
GET    /api/v1/live-sessions           → List sessions
POST   /api/v1/live-sessions           → Create session (admin)
GET    /api/v1/live-sessions/:id       → Get session details
PATCH  /api/v1/live-sessions/:id       → Update session (admin)
DELETE /api/v1/live-sessions/:id       → Cancel session (admin)
POST   /api/v1/live-sessions/:id/join  → Join live session
GET    /api/v1/live-sessions/:id/token → Get LiveKit token
```

#### Leaderboard (`/api/v1/leaderboard`)
```
GET    /api/v1/leaderboard             → Global leaderboard
GET    /api/v1/leaderboard/course/:id  → Course leaderboard
GET    /api/v1/leaderboard/test/:id    → Test leaderboard
```

#### Users (`/api/v1/users`)
```
GET    /api/v1/users                   → List users (admin)
POST   /api/v1/users                   → Create user (admin)
GET    /api/v1/users/:id               → Get user details
PATCH  /api/v1/users/:id               → Update user
DELETE /api/v1/users/:id               → Delete user (admin)
POST   /api/v1/users/bulk-import       → Bulk import students (admin)
```

#### Enrollments (`/api/v1/enrollments`)
```
POST   /api/v1/enrollments             → Enroll in course (student)
GET    /api/v1/enrollments             → Get my enrollments (student)
GET    /api/v1/enrollments/admin       → Get all enrollments (admin)
DELETE /api/v1/enrollments/:id         → Unenroll (student/admin)
```

#### License (`/api/v1/license`)
```
POST   /api/v1/license/ping            → Verify license (internal cron)
GET    /api/v1/license/status          → Get current license status
```

**Internal Background Jobs**:
```
License Verification Cron
  Runs: Every 24 hours
  Action: Calls App 2 to verify license
  Fallback: Uses cached license (24h TTL) if offline
  Failure: Graceful degradation or readonly mode
```

**Communicates With**:
- App 2 (NestJS) — license verification only
- App 3 (React Dashboard) — REST API calls
- App 5 (Next.js Storefront) — REST API calls
- LiveKit — for live sessions
- Payment gateways — for transactions

**Database**: Customer's PostgreSQL database

**Authentication**: Issues JWT tokens, validates them for each request

---

### App 5: Storefront (Customer Side)

**Purpose**: Public-facing student portal and course catalog

**Technology**:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query
- shadcn/ui

**Hosted On**: Customer's Docker container (shipped with package)

**Users**: Students (public + authenticated), general visitors

**Authentication**: Optional, JWT from App 4

**Key Features**:
- Public course catalog (browsable without login)
- Course detail pages with rich content
- Test series preview
- Student registration and login
- Learning dashboard and progress tracking
- Course enrollment and purchase
- Lesson content viewing
- Test attempt interface
- Live session player
- Student profile and settings
- Certificate viewing

**Routes**:
```
/                           → Homepage with featured courses
/courses                    → Course catalog (filterable)
/courses/:slug              → Course detail page
/courses/:slug/preview      → Course preview (can be public)

/test-series                → Test series listing
/test-series/:slug          → Test series detail page
/test-series/:slug/preview  → Preview questions (admin view)

/auth/register              → Student registration
/auth/login                 → Student login
/auth/forgot-password       → Password reset

/dashboard                  → Student dashboard (authenticated)
  /enrolled-courses         → My courses
  /course/:slug             → View course content
  /course/:slug/lesson/:id  → Lesson content player
  /test/:slug/attempt       → Test attempt interface
  /live/watch/:sessionId    → Watch live session
  /profile                  → Student profile
  /certificates             → My certificates
  /settings                 → Preferences

/api/internal/...           → Internal API routes
```

**Communicates With**:
- App 4 (Go Gin Backend) — all data operations

**Database Access**: Read-only API calls to App 4

---

## Tech Stack

### Frontend
| Library | Purpose | Version |
|---------|---------|---------|
| React | UI library | 19 |
| Next.js | Web framework (App 5 only) | 16 |
| Vite | Build tool (App 1, 3) | 8 |
| TypeScript | Type safety | Latest |
| Tailwind CSS | Styling | v4 |
| shadcn/ui | Component library | Latest |
| Radix UI | Headless components | Latest |
| TanStack Query | Data fetching & caching | v5 |
| TanStack Router | Routing (optional) | Latest |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| NestJS | API framework (App 2) | 11 |
| Go | Backend (App 4) | 1.21+ |
| Gin | Web framework (App 4) | Latest |
| GORM | ORM (App 4) | Latest |
| TypeORM | ORM (App 2) | Latest |
| PostgreSQL | Database | 15+ |
| JWT | Authentication | - |
| Docker | Containerization | Latest |

### DevOps
| Tool | Purpose |
|------|---------|
| Turborepo | Monorepo orchestration |
| pnpm | Package manager |
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD |

### External Services
| Service | Purpose |
|---------|---------|
| Stripe | Payment processing |
| Razorpay | Payment processing |
| LiveKit | Live streaming |
| SendGrid/AWS SES | Email delivery |

---

## Data Flow

### License Verification Flow (Most Critical)

```
1. Customer starts Docker container
   ↓
2. App 4 (Go Gin) initializes
   ↓
3. Reads LICENSE_KEY from environment
   ↓
4. Calls App 2 endpoint:
   POST /api/v1/licenses/verify
   {
     "license_key": "lic-550e8400-e29b-41d4-a716-446655440000",
     "domain": "acme.academy.com",
     "instance_id": "i-acme-001"
   }
   ↓
5. App 2 validates in database:
   - License exists
   - Not expired
   - Active status
   - Feature set
   ↓
6. App 2 returns response:
   {
     "valid": true,
     "expiry_date": "2025-12-31T23:59:59Z",
     "max_users": 500,
     "features": ["courses", "tests", "live-sessions"],
     "organization": "Acme Academy",
     "cache_ttl": 86400
   }
   ↓
7. App 4 caches locally (24h TTL)
   ↓
8. App 4 allows LMS to operate
   ↓
9. Every 24h, App 4 runs cron job:
   - Tries to verify again
   - Falls back to cache if offline
   - If license invalid: graceful shutdown or readonly mode
```

### Student Enrollment Flow

```
Student visits storefront (App 5)
  ↓
Clicks "Enroll" on course
  ↓
App 5 calls App 4:
POST /api/v1/enrollments
{
  "course_id": "course-123",
  "student_id": "user-456"
}
  ↓
App 4 validates:
  - Student exists
  - Course exists
  - Not already enrolled
  - License allows enrollment
  ↓
App 4 creates enrollment record in customer DB
  ↓
Returns enrollment confirmation
  ↓
Student now sees course in dashboard
```

### Test Attempt Flow

```
Student clicks "Start Test"
  ↓
App 5 calls App 4:
POST /api/v1/attempts
{
  "test_series_id": "test-123"
}
  ↓
App 4 creates attempt record with:
  - Timestamp
  - Questions (randomized if enabled)
  - Time limit
  - Passing score
  ↓
Returns attempt session with questions
  ↓
Student answers questions in App 5
  ↓
Student submits answers
  ↓
App 5 calls App 4:
PATCH /api/v1/attempts/attempt-789/submit
{
  "answers": [
    { "question_id": "q1", "selected": "A" },
    { "question_id": "q2", "selected": "B" }
  ]
}
  ↓
App 4 scores attempt:
  - Check answers
  - Calculate score
  - Generate report
  - Update student progress
  ↓
App 4 returns result with score and feedback
  ↓
Student sees result in App 5
```

### Admin Dashboard Update Flow

```
Admin (using App 3) creates new course
  ↓
App 3 calls App 4:
POST /api/v1/courses
{
  "title": "Python 101",
  "description": "...",
  "instructor_id": "faculty-123",
  "max_students": 100
}
  ↓
App 4 validates permission:
  - User is admin/instructor
  - License allows courses
  - Max courses not exceeded
  ↓
App 4 creates course in customer DB
  ↓
Returns course details with ID
  ↓
Admin sees course in App 3 dashboard
  ↓
Admin can now upload modules, lessons, tests
```

### Your SaaS Analytics Flow

```
Every 24 hours (or on demand):
App 4 background job runs
  ↓
POST /api/v1/analytics/ping
{
  "instance_id": "i-acme-001",
  "license_key": "lic-xxxx",
  "metrics": {
    "total_students": 450,
    "total_courses": 25,
    "active_users_24h": 180,
    "tests_attempted": 1250
  }
}
  ↓
App 2 logs analytics data
  ↓
App 1 (your dashboard) displays:
  - Active instances
  - Total students across all customers
  - Revenue trends
  - Feature usage
  - System health
```

---

## Component Breakdown

### App 1: SaaS Admin Panel Structure

```
saas-admin/
├── src/
│   ├── pages/
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/detail.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── create.tsx
│   │   ├── licenses/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/detail.tsx
│   │   │   └── create.tsx
│   │   ├── plans/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── create.tsx
│   │   ├── billing/
│   │   │   ├── invoices.tsx
│   │   │   ├── transactions.tsx
│   │   │   └── refunds.tsx
│   │   ├── analytics/
│   │   │   ├── dashboard.tsx
│   │   │   ├── usage.tsx
│   │   │   └── reports.tsx
│   │   └── settings/
│   │       ├── system.tsx
│   │       ├── integrations.tsx
│   │       └── security.tsx
│   ├── components/
│   │   ├── customer-form.tsx
│   │   ├── license-generator.tsx
│   │   ├── plan-editor.tsx
│   │   ├── analytics-chart.tsx
│   │   └── tables/
│   │       ├── customers-table.tsx
│   │       ├── licenses-table.tsx
│   │       └── transactions-table.tsx
│   ├── hooks/
│   │   ├── useCustomers.ts
│   │   ├── useLicenses.ts
│   │   └── useAnalytics.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── Dockerfile
└── vite.config.ts
```

### App 2: NestJS Backend Structure

```
saas-backend/
├── src/
│   ├── modules/
│   │   ├── licenses/
│   │   │   ├── license.controller.ts
│   │   │   ├── license.service.ts
│   │   │   ├── license.entity.ts
│   │   │   ├── license.module.ts
│   │   │   └── dto/
│   │   │       ├── verify-license.dto.ts
│   │   │       ├── create-license.dto.ts
│   │   │       └── update-license.dto.ts
│   │   ├── customers/
│   │   │   ├── customer.controller.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── customer.entity.ts
│   │   │   ├── customer.module.ts
│   │   │   └── dto/
│   │   ├── plans/
│   │   ├── billing/
│   │   ├── feature-flags/
│   │   ├── analytics/
│   │   └── admin/
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt.guard.ts
│   │   │   ├── api-key.guard.ts
│   │   │   └── super-admin.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── api-key.decorator.ts
│   │   ├── filters/
│   │   │   └── exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   └── utilities/
│   │       ├── license-generator.ts
│   │       └── jwt.utility.ts
│   ├── database/
│   │   ├── entities/
│   │   └── migrations/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── stripe.config.ts
│   └── app.module.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
└── nest-cli.json
```

### App 3: LMS Admin Dashboard Structure

```
dashboard/
├── src/
│   ├── pages/
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   ├── [id]/modules.tsx
│   │   │   └── create.tsx
│   │   ├── test-series/
│   │   ├── students/
│   │   ├── faculty/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── dashboard.tsx
│   ├── components/
│   │   ├── course-form.tsx
│   │   ├── module-builder.tsx
│   │   ├── test-builder.tsx
│   │   ├── question-form.tsx
│   │   ├── student-bulk-upload.tsx
│   │   └── analytics-chart.tsx
│   ├── hooks/
│   │   ├── useCourses.ts
│   │   ├── useTests.ts
│   │   ├── useStudents.ts
│   │   └── useAnalytics.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── Dockerfile
└── vite.config.ts
```

### App 4: Go Gin Backend Structure

```
backend/
├── cmd/
│   └── lms/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.go
│   │   │   ├── courses.go
│   │   │   ├── tests.go
│   │   │   ├── attempts.go
│   │   │   ├── users.go
│   │   │   ├── live-sessions.go
│   │   │   └── license.go
│   │   ├── handlers/
│   │   │   ├── auth_handler.go
│   │   │   ├── course_handler.go
│   │   │   ├── test_handler.go
│   │   │   ├── attempt_handler.go
│   │   │   └── license_handler.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   ├── error-handler.go
│   │   │   └── cors.go
│   │   └── response/
│   │       └── response.go
│   ├── models/
│   │   ├── user.go
│   │   ├── course.go
│   │   ├── test.go
│   │   ├── attempt.go
│   │   ├── enrollment.go
│   │   └── license.go
│   ├── database/
│   │   ├── connection.go
│   │   ├── models.go (register all models)
│   │   └── migrations/
│   │       ├── 001_create_users_table.sql
│   │       ├── 002_create_courses_table.sql
│   │       └── ...
│   ├── service/
│   │   ├── auth_service.go
│   │   ├── course_service.go
│   │   ├── test_service.go
│   │   ├── attempt_service.go
│   │   └── license_service.go
│   ├── repository/
│   │   ├── user_repo.go
│   │   ├── course_repo.go
│   │   ├── test_repo.go
│   │   └── attempt_repo.go
│   ├── license/
│   │   ├── manager.go
│   │   ├── verifier.go
│   │   ├── cache.go
│   │   └── api_client.go
│   ├── cron/
│   │   ├── jobs.go
│   │   └── license_pinger.go
│   ├── config/
│   │   └── config.go
│   └── utils/
│       ├── jwt.go
│       ├── errors.go
│       └── validators.go
├── migrations/
│   ├── 001_initial_schema.up.sql
│   ├── 001_initial_schema.down.sql
│   └── ...
├── Dockerfile
├── .env.example
├── go.mod
├── go.sum
└── main.go
```

### App 5: Next.js Storefront Structure

```
web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx (homepage)
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── preview.tsx
│   │   ├── test-series/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── preview.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── enrolled-courses/page.tsx
│   │   ├── course/[slug]/
│   │   │   ├── page.tsx
│   │   │   └── lesson/[id]/page.tsx
│   │   ├── test/[slug]/
│   │   │   └── attempt/page.tsx
│   │   ├── live/[sessionId]/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── certificates/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── internal/
│   │       ├── health/route.ts
│   │       └── config/route.ts
│   └── layout.tsx (root)
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── course-card.tsx
│   ├── test-card.tsx
│   ├── course-hero.tsx
│   ├── lesson-player.tsx
│   ├── test-attempt.tsx
│   ├── live-player.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── api-client.ts
│   ├── constants.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   └── useUser.ts
├── types/
│   └── index.ts
├── Dockerfile
├── .env.example
└── next.config.ts
```

---

## API Endpoints

### App 2: NestJS Backend (Your SaaS)

#### License Verification (Public, from App 4)
```
POST /api/v1/licenses/verify
Authorization: None (rate-limited)
Body: {
  "license_key": "string",
  "domain": "string",
  "instance_id": "string"
}
Response: {
  "valid": boolean,
  "expiry_date": "ISO8601",
  "max_users": number,
  "features": ["string"],
  "organization": "string",
  "cache_ttl": number
}
```

#### License Management (Authenticated, from App 1)
```
POST   /api/v1/licenses              → Create new license
GET    /api/v1/licenses              → List all licenses
GET    /api/v1/licenses/:id          → Get license details
PATCH  /api/v1/licenses/:id          → Update license
DELETE /api/v1/licenses/:id          → Revoke license
POST   /api/v1/licenses/:id/extend   → Extend expiry
```

#### Customer Management (Authenticated, from App 1)
```
POST   /api/v1/customers             → Create customer
GET    /api/v1/customers             → List customers
GET    /api/v1/customers/:id         → Get customer details
PATCH  /api/v1/customers/:id         → Update customer
DELETE /api/v1/customers/:id         → Delete customer
```

#### Plans (Authenticated, from App 1)
```
GET    /api/v1/plans                 → List all plans
POST   /api/v1/plans                 → Create plan
PATCH  /api/v1/plans/:id             → Update plan
DELETE /api/v1/plans/:id             → Delete plan
```

#### Analytics (Authenticated, from App 1)
```
GET    /api/v1/analytics/dashboard   → Analytics dashboard data
GET    /api/v1/analytics/instances   → Active instances
POST   /api/v1/analytics/ping        → Log verification ping (from App 4)
GET    /api/v1/analytics/usage       → Usage metrics
```

---

## Database Architecture

### App 2: FLCN Master Database (flcn_master)

```sql
-- Customers/Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  website VARCHAR,
  country VARCHAR,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plans/Tiers
CREATE TABLE plans (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  billing_cycle ENUM('monthly', 'yearly'),
  max_students INT,
  max_courses INT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Licenses
CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  plan_id UUID REFERENCES plans(id),
  expiry_date TIMESTAMP NOT NULL,
  issued_date TIMESTAMP DEFAULT NOW(),
  last_verified_at TIMESTAMP,
  verification_count INT DEFAULT 0,
  max_users INT,
  features JSONB,
  status ENUM('active', 'expired', 'revoked', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  INDEX (key),
  INDEX (organization_id),
  INDEX (status)
);

-- License Verification Logs (Analytics)
CREATE TABLE license_verification_logs (
  id UUID PRIMARY KEY,
  license_id UUID REFERENCES licenses(id),
  instance_id VARCHAR,
  domain VARCHAR,
  verified_at TIMESTAMP DEFAULT NOW(),
  status ENUM('success', 'failed', 'expired'),
  ip_address VARCHAR,
  metrics JSONB,
  error_message TEXT
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  license_id UUID REFERENCES licenses(id),
  status ENUM('active', 'cancelled', 'suspended') DEFAULT 'active',
  billing_cycle ENUM('monthly', 'yearly'),
  renewal_date TIMESTAMP,
  auto_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments/Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status ENUM('paid', 'pending', 'failed', 'cancelled') DEFAULT 'pending',
  invoice_number VARCHAR UNIQUE,
  issued_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  paid_at TIMESTAMP,
  payment_method VARCHAR,
  notes TEXT
);

-- Feature Flags (per customer)
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  feature_name VARCHAR NOT NULL,
  enabled BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, feature_name)
);

-- Super Admins
CREATE TABLE super_admins (
  id UUID PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES super_admins(id),
  action VARCHAR NOT NULL,
  entity_type VARCHAR,
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### App 4: Customer Database (customer_db)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  phone VARCHAR,
  profile_picture_url VARCHAR,
  role ENUM('student', 'faculty', 'admin') DEFAULT 'student',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX (email),
  INDEX (role)
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url VARCHAR,
  instructor_id UUID REFERENCES users(id),
  max_students INT,
  price DECIMAL(10, 2),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX (slug),
  INDEX (status)
);

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id),
  title VARCHAR NOT NULL,
  description TEXT,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES modules(id),
  title VARCHAR NOT NULL,
  description TEXT,
  content_type ENUM('video', 'text', 'document', 'quiz') DEFAULT 'video',
  content_url VARCHAR,
  duration_seconds INT,
  order_index INT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test Series
CREATE TABLE test_series (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  total_questions INT,
  duration_minutes INT,
  passing_percentage INT DEFAULT 40,
  shuffle_questions BOOLEAN DEFAULT false,
  show_correct_answers BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX (slug)
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  test_series_id UUID NOT NULL REFERENCES test_series(id),
  question_text TEXT NOT NULL,
  question_type ENUM('mcq', 'true-false', 'short-answer') DEFAULT 'mcq',
  difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  marks INT DEFAULT 1,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Question Options (for MCQ)
CREATE TABLE question_options (
  id UUID PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attempts (Test submissions)
CREATE TABLE attempts (
  id UUID PRIMARY KEY,
  test_series_id UUID NOT NULL REFERENCES test_series(id),
  student_id UUID NOT NULL REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  total_marks INT,
  obtained_marks INT,
  percentage DECIMAL(5, 2),
  status ENUM('in-progress', 'submitted', 'graded') DEFAULT 'in-progress',
  time_spent_seconds INT
);

-- Attempt Answers (Individual question answers)
CREATE TABLE attempt_answers (
  id UUID PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES attempts(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_option_id UUID REFERENCES question_options(id),
  written_answer TEXT,
  marks_obtained INT,
  is_correct BOOLEAN
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id),
  student_id UUID NOT NULL REFERENCES users(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  status ENUM('enrolled', 'in-progress', 'completed', 'dropped') DEFAULT 'enrolled',
  UNIQUE(course_id, student_id)
);

-- Progress Tracking
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  student_id UUID NOT NULL REFERENCES users(id),
  watched_at TIMESTAMP DEFAULT NOW(),
  watch_time_seconds INT,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(lesson_id, student_id)
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  test_series_id UUID REFERENCES test_series(id),
  student_id UUID NOT NULL REFERENCES users(id),
  certificate_number VARCHAR UNIQUE,
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Live Sessions
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES users(id),
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  livekit_room_name VARCHAR UNIQUE,
  status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX (status),
  INDEX (scheduled_start)
);

-- Live Session Participants
CREATE TABLE live_session_participants (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES live_sessions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  UNIQUE(session_id, user_id)
);

-- License Configuration (stored locally)
CREATE TABLE license_config (
  id UUID PRIMARY KEY,
  license_key VARCHAR NOT NULL UNIQUE,
  organization_name VARCHAR,
  max_users INT,
  features JSONB,
  expiry_date TIMESTAMP,
  cached_at TIMESTAMP DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true
);
```

---

## Deployment Model

### Your SaaS Infrastructure

```bash
# Your servers run:
docker-compose -f docker/saas.docker-compose.yml up -d

# Starts:
# - App 1 (Admin Dashboard) on port 3001
# - App 2 (NestJS Backend) on port 8000
# - PostgreSQL (flcn_master) on port 5432
```

### Customer Deployment

```bash
# Customer receives tarball
tar -xzf flcn-lms-v1.0.0.tar.gz
cd flcn-lms

# Setup configuration
cp .env.example .env
# Edits .env with:
#   FLCN_LICENSE_KEY=lic-xxxx-xxxx
#   DB_NAME=their_lms_db
#   POSTGRES_PASSWORD=secure_password
#   NEXT_PUBLIC_APP_NAME="Their Institute"
#   LIVEKIT_URL=https://livekit.example.com

# Deploy
docker-compose up -d

# Apps available:
# - App 3 (Dashboard) on port 3001
# - App 4 (Go Gin Backend) on port 8080
# - App 5 (Storefront) on port 3000
# - PostgreSQL on port 5432
```

### Docker Compose for Customer

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      LICENSE_KEY: ${FLCN_LICENSE_KEY}
      FLCN_API_URL: https://api.flcn.com
      JWT_SECRET: ${JWT_SECRET}
      LIVEKIT_URL: ${LIVEKIT_URL}
      GIN_MODE: release
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  dashboard:
    build:
      context: ./dashboard
      dockerfile: Dockerfile
    environment:
      VITE_API_URL: http://backend:8080
      VITE_APP_NAME: ${APP_NAME}
    ports:
      - "3001:3001"
    depends_on:
      - backend
    restart: unless-stopped

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
      NEXT_PUBLIC_APP_NAME: ${APP_NAME}
      NEXT_PUBLIC_STOREFRONT_DOMAIN: ${STOREFRONT_DOMAIN}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
```

---

## Security & License Verification

### License Key Format

```
Format: lic-{UUID}
Example: lic-550e8400-e29b-41d4-a716-446655440000

Generated by: App 2 (NestJS) using UUID v4
Stored in: App 2 database
Used by: App 4 (Go Gin)
```

### Verification Process

1. **Initial Verification** (on App 4 startup):
   - Read LICENSE_KEY from environment
   - Call App 2: `POST /api/v1/licenses/verify`
   - If valid: cache locally (24h TTL)
   - If invalid: block startup

2. **Periodic Verification** (background cron job):
   - Every 24 hours
   - Call App 2 again
   - Update cache if successful
   - Fall back to cache if offline

3. **Offline Mode**:
   - If App 2 is unreachable
   - Use cached license (24h old max)
   - Log error but keep running
   - Degraded functionality optional

4. **Expired License Handling**:
   - Check expiry date
   - If expired: block new enrollments
   - Option: read-only mode
   - Option: complete shutdown

### Security Best Practices

1. **API Security**:
   - License verification endpoint: Rate-limited, no authentication required
   - Admin endpoints: JWT authentication from App 1
   - HTTPS only for all communication

2. **Database Security**:
   - Encrypted connection strings
   - Row-level security (RLS) for multi-tenant databases
   - Regular backups (your SaaS)
   - Customer responsible for backups

3. **License Protection**:
   - License key never sent in API response to customer
   - Stored only in environment variables
   - Not logged or exposed in errors
   - Support for key rotation

4. **Data Privacy**:
   - App 2 never reads customer LMS data
   - License verification doesn't expose course/student info
   - Customers' data remains 100% their responsibility
   - Optional analytics collection (opt-in)

---

## Development Guidelines

### Local Development Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with local values

# Run all apps in development
pnpm dev

# Or run individual apps:
cd apps/saas-admin && pnpm dev     # App 1
cd apps/saas-backend && pnpm dev   # App 2
cd apps/dashboard && pnpm dev      # App 3
cd apps/backend && go run cmd/lms/main.go  # App 4
cd apps/web && pnpm dev            # App 5
```

### API Communication Between Apps

#### App 4 → App 2 (License Verification)

```go
// Example in Go
import "net/http"

func (lm *LicenseManager) VerifyLicense() (*LicenseResponse, error) {
    url := fmt.Sprintf("%s/api/v1/licenses/verify", os.Getenv("FLCN_API_URL"))
    
    payload := map[string]string{
        "license_key": os.Getenv("LICENSE_KEY"),
        "domain": "customer.domain.com",
        "instance_id": os.Getenv("INSTANCE_ID"),
    }
    
    // Make HTTP request...
}
```

#### App 3 → App 4 (Create Course)

```typescript
// Example in React
const response = await fetch('http://backend:8080/api/v1/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Python 101',
    description: '...',
    instructor_id: 'faculty-123'
  })
});
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
cd apps/saas-backend && pnpm test
cd apps/backend && go test ./...

# Run E2E tests
pnpm test:e2e
```

### Build & Deployment

```bash
# Build all apps
pnpm build

# Build Docker images for customer
docker build -t flcn-lms-backend:1.0.0 ./apps/backend
docker build -t flcn-lms-dashboard:1.0.0 ./apps/dashboard
docker build -t flcn-lms-web:1.0.0 ./apps/web

# Package for distribution
tar -czf flcn-lms-v1.0.0.tar.gz \
  apps/backend \
  apps/dashboard \
  apps/web \
  docker-compose.yml \
  .env.example \
  README.md
```

---

## Glossary

| Term | Definition |
|------|-----------|
| **FLCN** | Your SaaS company/platform |
| **Tenant** | A customer who buys your LMS |
| **Instance** | One deployment of LMS by a customer |
| **License Key** | Unique identifier authorizing a customer instance |
| **flcn_master DB** | Your database (App 2) containing licenses and customers |
| **customer_db** | Each customer's database (App 4) containing their LMS data |
| **LMS** | Learning Management System (the core product) |
| **Storefront** | Public-facing portal (App 5) where students browse and enroll |
| **Dashboard** | Admin interface for managing LMS (App 3) |
| **Live Session** | Real-time online class using LiveKit |
| **Attempt** | Student's submission of a test |
| **Enrollment** | Student's registration in a course |

---

## Support & Maintenance

### For You (FLCN Team)
- Monitor App 1 and App 2 uptime
- Manage licenses and customers
- Handle billing and support
- Release updates and patches

### For Customers
- Run and maintain their App 3, 4, 5 deployments
- Manage their database backups
- Configure their domain and integrations
- Support their end users (students, faculty)

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: Engineering Team