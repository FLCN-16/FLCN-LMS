# FLCN-LMS — Development Plan

> Generated: 2026-04-15  
> Based on: full codebase analysis via code-review-graph (429 files, 2,119 nodes, 11,569 edges)

---

## Project State Summary

| App | Status |
|---|---|
| `apps/backend` (NestJS SaaS) | ✅ Core complete — auth, licenses, billing, API keys, rate limiting, refunds |
| `apps/lms-gin` (Go LMS API) | ✅ Core complete — courses, tests, attempts, enrollments, live sessions, DPP, announcements, reviews |
| `apps/dashboard` (Vite/React) | 🟡 Partial — courses/tests/analytics built; 16 feature areas are stubs |
| `apps/web` (Next.js storefront) | 🔴 Mostly stubs — no API integration, student panel is empty shells |
| `packages/ui` | ✅ Complete component library |

---

## SECTION 1 — Web App (apps/web)

The storefront has routes and UI components in place but **zero API integration**. Every student-facing page shows static or hardcoded data.

### 1.1 API Layer Setup
- [x] Enhanced `lib/fetcher.ts` with generic typing, error handling, cookie support ✅
- [x] Created error classes in `lib/errors/api-errors.ts` ✅
  - ApiError, UnauthorizedError, ForbiddenError, ValidationError, RateLimitError, NetworkError, ParseError
- [x] Created `fetchers/auth.ts` module — login, register, session, password reset ✅
- [x] Created `fetchers/course.ts` module — list, filter, enroll, progress, reviews ✅
- [x] Created `fetchers/README.md` — comprehensive fetchers usage guide ✅
- [x] `fetchers/test-series.ts` already exists — list tests, get test, questions
- [x] `fetchers/attempts.ts` already exists — create attempt, submit answers, get result
- [x] `fetchers/user.ts` already exists — profile, settings, enrollment list, certificates
- [x] `fetchers/lessons.ts` already exists — get lesson content, mark progress
- [x] httpOnly cookie injection implemented in `fetcher.ts` — works on server & client ✅
- [x] JWT token injection middleware in `fetcher.ts` for authenticated requests ✅

### 1.2 Home Page (Marketing)
- [ ] Build hero section with real course count and stats from API (use `getCourses()` from `fetchers/course`)
- [ ] Featured courses carousel — fetch featured courses (use `getFeaturedCourses()` from `fetchers/course`)
- [ ] Categories grid — fetch course categories (use `getCategories()` from `fetchers/course`)
- [ ] Testimonials section
- [ ] CTA sections (pricing plans, signup)

### 1.3 Courses Listing Pages
- [ ] `app/(marketing)/courses/page.tsx` — wire to `getCourses()` with pagination and filters (from `fetchers/course`)
- [ ] `app/(marketing)/courses/[category]/page.tsx` — wire to `getCoursesByCategory()` (from `fetchers/course`)
- [ ] `app/(marketing)/course/[slug]/page.tsx` — wire to `getCourse()` (overview, modules, instructor, reviews) (from `fetchers/course`)
- [ ] Course search with debounced query — use `searchCourses()` (from `fetchers/course`)

### 1.4 Student Panel — Course Consumption
- [ ] `app/(protected)/learn/[courseSlug]/page.tsx` — load course with `getCourse()`, redirect to first incomplete lesson (from `fetchers/course`)
- [ ] `app/(protected)/learn/[courseSlug]/[moduleSlug]/page.tsx` — module overview with `getLesson()`, progress indicators (from `fetchers/lessons`)
- [ ] `app/(protected)/learn/[courseSlug]/[moduleSlug]/[lessonSlug]/page.tsx` — wire `getLesson()` for video URL, replace hardcoded Mux URL (from `fetchers/lessons`)
- [ ] Lesson progress auto-save — use `markLessonComplete()` on video end (from `fetchers/lessons`)
- [ ] Module progress calculation — use `getProgress()` (from `fetchers/course`)
- [ ] Course sidebar — show current position using enrolled course list
- [ ] Resume learning button — store last accessed lesson in localStorage or server

### 1.5 Student Panel — Test / Exam Flow
- [x] `fetchers/test-series.ts` already exists — list, get by slug, questions ✅
- [ ] `app/(protected)/test/[slug]/page.tsx` — load test with `getTestSeries()`, check enrollment, start button (from `fetchers/test-series`)
- [ ] `app/(protected)/test/[slug]/attempt/page.tsx` — full exam UI: questions, timer, navigation; wire to `startAttempt()` and `submitAnswers()` (from `fetchers/attempts`)
- [ ] `app/(protected)/test/[slug]/result/page.tsx` — display score, rank, answer review from `getAttemptResult()` (from `fetchers/attempts`)
- [x] `fetchers/attempts.ts` already exists — create, submit answers, get result ✅

### 1.6 Student Panel — User Profile
- [x] `fetchers/user.ts` already exists — profile, settings, password change, certificates ✅
- [ ] `app/(protected)/user/profile/page.tsx` — profile form with `updateProfile()` (from `fetchers/user`)
- [ ] `app/(protected)/user/settings/page.tsx` — password change with `changePassword()`, notification preferences (from `fetchers/user`)
- [ ] `app/(protected)/user/courses/page.tsx` — enrolled courses using `getEnrolledCourses()` with progress (from `fetchers/course`)
- [ ] `app/(protected)/user/certificates/page.tsx` — earned certificates with `getCertificates()`, download links (from `fetchers/user`)

### 1.7 Checkout & Cart
- [ ] Wire `app/(marketing)/cart/page.tsx` to real cart state (Zustand/Jotai store)
- [ ] Wire `app/(marketing)/checkout/page.tsx` to payment flow — create payment fetcher in `fetchers/payment.ts`
- [ ] Create `fetchers/payment.ts` — payment intent, payment status, order confirmation
- [ ] Order confirmation page — display order summary after successful payment

### 1.8 Auth Improvements
- [x] Connect login/register forms to `login()` and `register()` from `fetchers/auth` ✅ (ready to use)
- [x] Persist JWT in httpOnly cookie — cookie injection implemented in `fetcher.ts` ✅
- [ ] Session refresh / token rotation — implement `refreshToken()` on token expiry (from `fetchers/auth`)
- [ ] Redirect after login to intended page (from query param or session store)
- [ ] Add `loading.tsx` and `error.tsx` to all route segments (currently missing on 34 of 38 pages)
- [ ] Implement middleware to check authentication on protected routes
- [ ] Add `verifyEmail()` flow for email verification (from `fetchers/auth`)

### 1.9 Static / Marketing Pages
- [ ] `app/(marketing)/about/page.tsx` — team info
- [ ] `app/(marketing)/instructors/page.tsx` — wire instructor list to API
- [ ] `app/(marketing)/blogs/page.tsx` — blog list (CMS or static MDX)
- [ ] `app/(marketing)/contact/page.tsx` — contact form with email submission

---

## SECTION 2 — Dashboard (apps/dashboard)

Core course/test management is working. These 16 stub areas need to be built:

### 2.1 Live Classes
- [ ] `pages/live-classes/index.tsx` — list of scheduled live sessions with join/manage buttons
- [ ] `pages/live-classes/new.tsx` — create live session form (title, date/time, instructor, Zoom/Meet URL)
- [ ] Wire to Go Gin `GET /api/v1/live-sessions` and `POST /api/v1/live-sessions`
- [ ] Live session status badges (upcoming, live, ended)
- [ ] Attendance report per session

### 2.2 Daily Practice Papers (DPP)
- [ ] `pages/dpp/index.tsx` — list DPPs assigned per course/batch
- [ ] `pages/dpp/new.tsx` — create DPP form (select questions from bank, assign to batch/date)
- [x] Backend endpoint needed: `POST /api/v1/dpp` (Go Gin) ✅
- [ ] DPP completion stats per student

### 2.3 Revenue & Billing
- [ ] `pages/revenue/transactions/index.tsx` — list all payments with Stripe transaction IDs, amounts, status
- [ ] `pages/revenue/coupons/index.tsx` — coupon/promo code management (create, disable, usage stats)
- [ ] `pages/revenue/refunds/index.tsx` — refund requests list; approve/deny actions wired to NestJS refund API
- [ ] Backend endpoint needed: coupon CRUD in NestJS or Go Gin
- [ ] Revenue charts (MRR, ARR, daily revenue) — wire to NestJS `/api/v1/billing`

### 2.4 Communications
- [ ] `pages/communications/announcements/index.tsx` — create/list announcements targeted to batches or all students
- [ ] `pages/communications/push-notifications/index.tsx` — push notification management (title, body, target audience, schedule)
- [x] Backend endpoints needed: announcements CRUD ✅ (Go Gin) + notification service integration (FCM/OneSignal) — pending

### 2.5 Institute Management
- [ ] `pages/institute/batches/index.tsx` — batch list with student counts, assign courses to batches
- [ ] `pages/institute/batches/new.tsx` — create batch form
- [ ] `pages/institute/timetable/index.tsx` — weekly schedule grid per batch
- [ ] `pages/institute/attendance/index.tsx` — date-based attendance marking per batch/student
- [ ] `pages/institute/roles-permissions/index.tsx` — role CRUD with permission matrix (uses CASL already on backend)

### 2.6 Content Review / Moderation
- [ ] `pages/content-review/index.tsx` — queue of flagged content (reported questions, lesson comments)
- [ ] Approve / reject / edit actions
- [ ] Backend endpoint needed: content moderation module in Go Gin

### 2.7 Settings — Branding
- [ ] `pages/settings/branding/index.tsx` — upload logo, set primary color, institute name
- [ ] Backend: store branding config in institute entity (NestJS)
- [ ] CSS variables applied dynamically based on institute config

### 2.8 Settings — Integrations
- [ ] `pages/settings/integrations/index.tsx` — third-party connections: Zoom, Google Meet, payment gateways, SMS, email
- [ ] API key input forms with test-connection buttons
- [ ] Store integration credentials encrypted in backend

### 2.9 Analytics — Reporting
- [ ] `pages/analytics/index.tsx` — full dashboard: DAU, revenue, test pass rate, course completion rate
- [ ] `pages/analytics/course-reports/index.tsx` — per-course enrollment trend, completion funnel, rating distribution
- [ ] `pages/analytics/test-reports/index.tsx` — per-test attempt count, avg score, time-spent, top/bottom performers

---

## SECTION 3 — NestJS Backend (apps/backend)

### 3.1 Swagger / OpenAPI Documentation
- [ ] Install `@nestjs/swagger` and `swagger-ui-express`
- [ ] Add `@ApiTags`, `@ApiOperation`, `@ApiResponse` decorators to all controllers
- [ ] Serve Swagger UI at `/api/docs` (disable in production or protect with basic auth)
- [ ] Add DTO property decorators (`@ApiProperty`) to all DTOs

### 3.2 Redis Integration
- [ ] Add `ioredis` or `@nestjs/cache-manager` with Redis adapter
- [ ] Replace in-memory `Map` in `RateLimitingService` with Redis backend
- [ ] Cache license verification responses in Redis (TTL = cacheTTL from license)
- [ ] Session/token blacklist for logout using Redis

### 3.3 Email Service
- [ ] Add Nodemailer or Resend/SendGrid SDK
- [ ] Create `EmailModule` with `EmailService`
- [ ] Implement transactional emails:
  - Welcome email on super-admin creation
  - Invoice/receipt email after payment
  - License expiry warning (30 days before)
  - Password reset OTP
- [ ] HTML email templates with handlebars/mjml

### 3.4 Feature Flags Module
- [ ] `FeatureFlag` entity already exists — create `FeatureFlagsModule`, `FeatureFlagsController`, `FeatureFlagsService`
- [ ] CRUD endpoints for managing feature flags per institute
- [ ] Guard/decorator: `@RequireFeature('live_sessions')` to gate endpoints by license features

### 3.5 Institute Management Module
- [ ] `Institute` entity exists — create `InstitutesModule`, `InstitutesController`, `InstitutesService`
- [ ] CRUD endpoints (create institute, update profile, delete, list)
- [ ] Onboarding flow: create institute → assign plan → generate license → create API key

### 3.6 Webhook Notifications
- [ ] `AuditLog` entity exists — build `WebhooksModule`
- [ ] Emit webhooks on key lifecycle events: license created/expired/revoked, payment received/failed, institute onboarded
- [ ] Per-institute webhook URL registration with HMAC signature
- [ ] Webhook delivery with retry (exponential backoff)

### 3.7 Coupon / Promo Code Module
- [ ] Create `Coupon` entity (code, discount type, value, expiry, usage limit, usage count)
- [ ] `CouponsModule` with CRUD + validate endpoint
- [ ] Apply coupon in checkout flow
- [ ] Usage tracking and reporting

### 3.8 Analytics & Reporting Endpoints
- [ ] `GET /api/v1/analytics/revenue` — MRR, ARR by time range
- [ ] `GET /api/v1/analytics/licenses` — active, trial, expired counts over time
- [ ] `GET /api/v1/analytics/institutes` — onboarded institutes per month
- [ ] Wire to dashboard analytics pages

### 3.9 Low-Priority Code Cleanup (from review.md findings)
- [ ] Move `require('crypto')` in `stripe-webhook.controller.ts` to top-level import
- [ ] Remove duplicate `StripeEvent` interface (one in webhook controller, one in stripe service)
- [ ] Replace `console.log` in `RateLimitingService` with NestJS `Logger`
- [ ] Remove duplicate `JwtPayload` types across jwt strategy and auth controller
- [ ] Remove `SaasAuthController` from `AuthModule` exports (controllers shouldn't be exported)

---

## SECTION 4 — Go Gin Backend (apps/lms-gin)

### 4.1 Missing API Endpoints
- [x] `POST /api/v1/dpp` — create Daily Practice Paper (question set) ✅
- [x] `GET /api/v1/dpp` — list DPPs with filters (batch, date, course) ✅
- [x] `POST /api/v1/announcements` — create announcement for batch/all-students ✅
- [x] `GET /api/v1/announcements` — list announcements for current user ✅
- [x] `GET /api/v1/courses/:slug/reviews` — course reviews/ratings ✅
- [x] `POST /api/v1/courses/:slug/reviews` — submit review with rating ✅
- [ ] `GET /api/v1/certificates/:id/download` — generate and serve PDF certificate

### 4.2 Certificate Generation
- [x] Generate PDF certificates on course completion using `gofpdf` ✅
- [ ] Store generated PDF in S3/object storage
- [x] `certificate_repository.go` exists — wired to generation service ✅
- [x] Endpoint: `GET /api/v1/user/certificates` — list user certificates ✅
- [x] Endpoint: `GET /api/v1/certificates/:id/download` — download PDF ✅
- [x] Endpoint: `GET /api/v1/certificates/:number/verify` — verify certificate ✅

### 4.3 Video / Media Storage
- [ ] Integrate cloud storage (S3/Cloudflare R2/Mux) for lesson videos
- [ ] Secure signed URL generation for video playback (time-limited, user-scoped)
- [ ] Replace hardcoded Mux URL in web app lesson page with API-served signed URL
- [ ] Lesson file attachments (PDFs, slides) served from storage

### 4.4 Search
- [ ] Full-text search on courses, test series, questions
- [ ] PostgreSQL `tsvector` or Typesense/Meilisearch integration
- [ ] `GET /api/v1/search?q=` endpoint returning ranked results across types

---

## SECTION 5 — Infrastructure & DevOps

### 5.1 Environment & Configuration
- [ ] Create `.env.example` files for all three apps (web, dashboard, backend)
- [ ] Document all required environment variables
- [ ] Validate env vars at startup (use `@nestjs/config` `validate` for backend)
- [ ] Separate `.env.development`, `.env.staging`, `.env.production` templates

### 5.2 Docker
- [ ] `Dockerfile` for `apps/backend` (multi-stage, non-root user)
- [ ] `Dockerfile` for `apps/lms-gin` (multi-stage Go build)
- [ ] `Dockerfile` for `apps/web` (Next.js standalone output)
- [ ] `docker-compose.yml` for local dev (postgres, redis, backend, lms-gin, web)
- [ ] `docker-compose.prod.yml` for production

### 5.3 Database Migrations
- [ ] Switch NestJS TypeORM `synchronize: false` in all non-dev environments (already `dev`-only)
- [ ] Generate initial TypeORM migration from current entity schema
- [ ] Document migration workflow: `pnpm migration:generate`, `pnpm migration:run`
- [ ] Go Gin migration runner (confirm `migrate` CLI or `golang-migrate` is wired)

### 5.4 CI / CD
- [ ] GitHub Actions workflow: `on: push` to `develop` and `main`
  - [ ] Lint all packages (`pnpm lint`)
  - [ ] Type check all packages (`pnpm typecheck`)
  - [ ] Build all apps (`pnpm build`)
  - [ ] Run test suite
- [ ] Deploy workflow: `on: push` to `main` → staging deploy
- [ ] Dockerfile build and push to container registry

### 5.5 Logging & Observability
- [ ] Structured JSON logging in NestJS (`nest-winston` or `pino`)
- [ ] Request/response logging middleware
- [ ] Go Gin structured logging (replace default logger with `zap` or `zerolog`)
- [ ] Health check endpoints: `GET /health` on all services
- [ ] Error tracking integration (Sentry)

---

## SECTION 6 — Testing

> Currently: 28 test nodes found in graph, mostly in `app.controller.spec.ts`. Zero frontend tests.

### 6.1 NestJS Backend Tests
- [ ] Unit tests for `AuthService` (login, hash, token generation)
- [ ] Unit tests for `LicensesService` (verify, checkFeature, stats)
- [ ] Unit tests for `ApiKeysService` (create, validate, scope check)
- [ ] Integration tests for auth flow (POST `/auth/login` → protected endpoint)
- [ ] Integration tests for license lifecycle (create → verify → suspend → reactivate)
- [ ] `jest.config.ts` test coverage report at 80%+ for service layer

### 6.2 Go Gin Backend Tests
- [ ] Unit tests for course service (list, enroll, progress)
- [ ] Unit tests for attempt service (create, submit, score calculation)
- [ ] Integration tests for auth middleware
- [ ] Table-driven tests for permission decorator

### 6.3 Frontend Tests
- [ ] Add Vitest to `apps/dashboard`
- [ ] Component tests for course form, test series form
- [ ] React Query hook tests with MSW (mock service worker)
- [ ] Add Playwright for E2E:
  - [ ] Student: sign up → enroll → watch lesson → complete
  - [ ] Admin: create course → publish → check analytics

---

## SECTION 7 — Security Hardening

### 7.1 Remaining Low-Priority Fixes
- [ ] Resolve duplicate `StripeEvent` interface (stripe-webhook.controller.ts + stripe.service.ts)
- [ ] Replace inline `require('crypto')` with top-level import
- [ ] Replace `console.log` with NestJS `Logger` across rate-limiting module

### 7.2 Token Management
- [ ] Implement refresh token rotation (short-lived access token + long-lived refresh)
- [ ] Token blacklist on logout using Redis SET with TTL
- [ ] Invalidate all tokens on password change

### 7.3 Input / Output Hardening
- [ ] Global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` (block unknown fields)
- [ ] Response serialization: `ClassSerializerInterceptor` globally to enforce `@Exclude()` on sensitive fields
- [ ] Helmet.js for security headers in NestJS `main.ts`

### 7.4 Secrets Management
- [ ] Rotate JWT_SECRET, Stripe keys, and database passwords
- [ ] No secrets in code — enforce via `git-secrets` pre-commit hook
- [ ] Add `.env` to `.gitignore` (verify it's not already committed)

---

## Priority Order

| Priority | Section | Effort |
|---|---|---|
| P0 — Unblocks student value | 1.1 API Layer, 1.4 Course Consumption, 1.5 Exam Flow, 1.8 Auth | High |
| P0 — Revenue | 3.3 Email Service, 2.3 Revenue/Billing Dashboard | Medium |
| P1 — Product completeness | 1.2 Home Page, 1.3 Course Listings, 1.6 User Profile | Medium |
| P1 — Admin completeness | 2.1 Live Classes, 2.2 DPP, 2.4 Communications | Medium |
| P1 — Operations | 5.1 Env Config, 5.2 Docker, 5.3 Migrations | Low |
| P2 — Quality | 6.1–6.3 Tests, 3.1 Swagger, 3.2 Redis | Medium |
| P2 — Growth features | 3.4 Feature Flags, 3.6 Webhooks, 4.3 Video Storage | High |
| P3 — Polish | 7.x Security hardening, 3.9 Code cleanup, 4.4 Search | Low |

---

## Task Count

| Section | Tasks |
|---|---|
| 1 — Web App | 41 |
| 2 — Dashboard | 27 |
| 3 — NestJS Backend | 23 |
| 4 — Go Gin Backend | 11 |
| 5 — Infrastructure | 18 |
| 6 — Testing | 14 |
| 7 — Security | 9 |
| **Total** | **143** |
