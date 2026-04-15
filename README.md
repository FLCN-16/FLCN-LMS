# FLCN-LMS

A multi-tenant, white-label Learning Management System built as a monorepo using Turborepo and pnpm.

## Project Overview

**Business Model:** FLCN issues licenses to customers who self-host the LMS in their own infrastructure. Each customer deployment verifies its license with the FLCN backend periodically. Customer data stays on their side — FLCN only sees license pings and billing events.

```
FLCN (Your Side)
├── Issue licenses to customers
├── Manage billing via Stripe
├── Control feature flags per license
└── Track usage analytics

Customer (Tenant)
├── Buys a license
├── Downloads LMS package (Docker)
├── Deploys in their own infrastructure
└── Verifies license with FLCN every 24h (cached)
```

---

## Architecture: 5 Apps

```
┌─────────────────────────────────────────────────┐
│                  FLCN (Your Side)               │
│                                                 │
│   App 1: SaaS Admin Panel   App 2: NestJS API   │
│   React + Vite (port 3001) ◄──► /api/v1/*       │
│   - Manage customers                            │
│   - Issue licenses          flcn_master DB      │
│   - Billing / feature flags                     │
└─────────────────────────────┬───────────────────┘
                              │ HTTPS (license verify)
┌─────────────────────────────▼───────────────────┐
│              Customer (Tenant Side)             │
│                                                 │
│   App 3: LMS Dashboard      App 4: Go Gin API   │
│   React + Vite             ◄──► /api/v1/courses │
│   - Courses / students           /api/v1/users  │
│   - Test series                  /api/v1/auth   │
│                             customer DB         │
│   App 5: Storefront                             │
│   Next.js (port 3000)                           │
│   - Public catalog / student portal             │
└─────────────────────────────────────────────────┘
```

---

## Monorepo Structure

```
flcn-lms/
├── apps/
│   ├── web/          # Storefront — Next.js 16, App Router (port 3000)
│   ├── dashboard/    # SaaS Admin Panel — React + Vite (port 3001)
│   └── backend/      # SaaS API — NestJS 11
├── packages/
│   ├── ui/                # Shared component library (shadcn/ui + Radix + Tailwind v4)
│   ├── eslint-config/     # Shared ESLint configs
│   └── typescript-config/ # Shared tsconfig presets
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web (storefront) | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 |
| Dashboard | React 19, Vite 8, TypeScript |
| Backend | NestJS 11, TypeScript, TypeORM, PostgreSQL |
| Auth | Passport.js (`passport-jwt`), bcrypt |
| Payments | Stripe SDK, webhooks |
| UI library | shadcn/ui, Radix UI, Base UI, Recharts, Embla Carousel |
| Monorepo | Turborepo, pnpm 10 |
| Icons | HugeIcons |
| Theming | next-themes |
| Fonts | DM Sans, Space Grotesk, Geist Mono |

---

## Implemented Features

### Backend (NestJS — `apps/backend`)

| Module | Status | Notes |
|---|---|---|
| Authentication (JWT + Passport.js) | ✅ | bcrypt password hashing, timing-safe comparison |
| License Management API | ✅ | 12 endpoints — verify, issue, suspend, revoke, stats |
| API Key Authentication | ✅ | SHA-256 hashed keys, scope-based access control |
| Rate Limiting | ✅ | 13 decorators, sliding window, IP/user/key modes |
| Plans | ✅ | CRUD for pricing plans |
| Billing (Stripe) | ✅ | Webhooks, invoices, subscription lifecycle |
| Refunds | ✅ | JWT-authenticated, validated amounts |
| Super Admins | ✅ | CRUD, password excluded from responses |

### Web App Routes (`apps/web`)

| Route | Purpose |
|---|---|
| `app/(marketing)/` | Public pages — courses, instructors, blogs, cart, checkout |
| `app/auth/` | Login & register |
| `app/panel/` | Authenticated student panel — course consumption, library, tests, notes |

---

## Backend API Endpoints

### Auth
```
POST /api/v1/auth/login        Public
POST /api/v1/auth/register     Public
```

### Licenses
```
POST   /api/v1/licenses/verify          Public — verify license key
POST   /api/v1/licenses/check-feature   Public — check feature availability
POST   /api/v1/licenses/issue           Protected — create license
GET    /api/v1/licenses                 Protected — list with pagination/filter
GET    /api/v1/licenses/stats/summary   Protected — aggregate counts
GET    /api/v1/licenses/:id             Protected
GET    /api/v1/licenses/key/:key        Protected
GET    /api/v1/licenses/:key/features   Protected
PUT    /api/v1/licenses/:id             Protected — update
PATCH  /api/v1/licenses/:id/suspend     Protected
PATCH  /api/v1/licenses/:id/reactivate  Protected
DELETE /api/v1/licenses/:id             Protected — revoke
```

### API Keys
```
POST   /api/v1/api-keys                 Protected — create key (raw key shown once)
GET    /api/v1/api-keys                 Protected — list keys
GET    /api/v1/api-keys/:keyId          Protected
PUT    /api/v1/api-keys/:keyId          Protected — update
DELETE /api/v1/api-keys/:keyId          Protected
POST   /api/v1/api-keys/validate        Public — validate key
PATCH  /api/v1/api-keys/:keyId/disable  Protected
PATCH  /api/v1/api-keys/:keyId/enable   Protected
GET    /api/v1/api-keys/:keyId/stats    Protected — usage stats
```

### Plans, Billing, Refunds
```
GET/POST/PUT/DELETE /api/v1/plans            Protected
GET/POST            /api/v1/billing          Protected
POST                /api/v1/billing/webhook  Stripe webhook (signature-verified)
GET/POST            /api/v1/invoices         Protected
POST                /api/v1/refunds          Protected
```

---

## Security Posture

| Area | Implementation |
|---|---|
| Password hashing | bcrypt, 10 salt rounds (~150ms/hash) |
| JWT auth | Passport.js strategy on all protected endpoints |
| Timing attacks | Constant-time buffer comparison on signature checks |
| API key storage | SHA-256 hash only; raw key shown once at creation |
| API key scopes | Allowlisted — 8 predefined scopes, no arbitrary values |
| Input validation | `class-validator` DTOs on all user-facing endpoints |
| Stripe webhooks | `crypto.timingSafeEqual` Buffer comparison; 5xx on failure triggers retry |
| CORS | Configurable via `CORS_ORIGIN` env var |
| DB schema sync | `synchronize: true` only in `development` |
| Rate limiting | IP/user/key-based; 13 decorators; Redis-ready architecture |

---

## Development Setup

### Prerequisites
- Node.js >= 20
- pnpm 10
- PostgreSQL with `uuid-ossp` extension

### Environment Variables (`apps/backend/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/flcn_master
JWT_SECRET=<32+ char random string>
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Database Setup
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Commands

```bash
# Install all dependencies
pnpm install

# Run all apps (turbo)
pnpm dev

# Run individually
cd apps/web      && pnpm dev          # port 3000
cd apps/dashboard && pnpm dev         # port 3001
cd apps/backend  && pnpm start:dev    # NestJS API

# Build / lint / typecheck
pnpm build
pnpm lint
pnpm typecheck
```

### Adding UI Components
```bash
# From repo root
pnpm dlx shadcn@latest add <component> -c apps/web
```

```tsx
// Import anywhere
import { Button } from "@flcn-lms/ui/components/button"
```

---

## Roadmap

| Item | Priority | Notes |
|---|---|---|
| Redis-backed rate limiting | P1 | Required for distributed/multi-instance |
| Swagger / OpenAPI docs | P1 | Auto-generated from NestJS decorators |
| RBAC (role-based access) | P1 | Admin permission matrix |
| Google / OAuth login | P2 | Passport.js strategy already wired — add `passport-google-oauth20` |
| Real-time dashboard metrics | P1 | WebSocket integration |
| License renewal flow | P1 | Extend expiry, auto-renewal |
| Customer activity audit log | P1 | Audit trail |
| IP whitelist per API key | P2 | Security hardening |
| Webhook notifications | P2 | Key lifecycle events |
| Redis caching layer | P2 | License verification hot path |
