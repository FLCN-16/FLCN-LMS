# LMS Apps — Full Development Plan

## Context

This plan covers all remaining feature work across the three `apps/lms-*` apps:
- **lms-backend** (Go Gin, port 8080) — Well-structured with 27 models, 70+ endpoints, but several modules are stubs or entirely missing.
- **lms-web** (Next.js 16, port 3000) — Marketing pages are mostly complete (~20% overall done). Most protected student routes are stubs.
- **lms-dashboard** (React + Vite, port 3001) — ~85% built. Gaps in edit pages, analytics, and batch operations.

Goal: bring all three apps to production-ready feature completeness.

---

## Phase 1 — Authentication Foundation (Unblocks Everything Else)

### lms-web auth middleware
- **File to create**: `apps/lms-web/app/middleware.ts`
- Redirect unauthenticated users to `/auth/login` for all `/learn/*`, `/user/*`, `/test/*`, `/live/*` routes
- Use `getSession()` from `apps/lms-web/fetchers/auth.ts` — already calls `GET /api/v1/auth/session`
- Return existing session cookie forward (httpOnly-aware, works in Next.js Edge)

### lms-web protected layout
- **File**: `apps/lms-web/app/(protected)/layout.tsx` (currently a pass-through stub)
- Add session fetch + user context provider (share session data to all child pages)

### lms-web login form submit handler
- **File**: `apps/lms-web/app/auth/(login)/page.tsx` or `LoginForm` component
- Wire existing `login()` from `apps/lms-web/fetchers/auth.ts` to form `onSubmit`
- On success: redirect to `/user/library` (or returnTo param)
- On error: display toast/inline error

### lms-web auth context
- Create `apps/lms-web/context/auth-context.tsx`
- Wraps protected layout; provides `user`, `isLoading`, `logout()` to all child pages
- Uses `getSession()` with SWR or React Query for client-side revalidation

---

## Phase 2 — Student Learning Experience (lms-web)

### User Dashboard pages
All live under `apps/lms-web/app/(protected)/user/`

| Page | File | What to build |
|------|------|---------------|
| Library | `library/page.tsx` | Enrolled courses list; call `GET /api/v1/enrollments`; course cards with progress bar |
| Profile | `profile/page.tsx` | Display + edit name, email, phone, avatar; call `PATCH /api/v1/auth/profile` |
| Orders | `orders/page.tsx` | Order history table; call `GET /api/v1/orders` (once endpoint is built in Phase 3) |
| Notifications | `notifications/page.tsx` | Notification list; call `GET /api/v1/notifications`; mark read |
| Settings | `settings/page.tsx` | Change password form; call `POST /api/v1/auth/change-password` |

### Course learning flow
- **`/learn/[courseSlug]`** (`app/(protected)/learn/[courseSlug]/page.tsx`) — Sidebar with modules + lessons, resume progress, call `GET /api/v1/courses/slug/:slug` + `GET /api/v1/enrollments`
- **`/learn/[courseSlug]/[moduleSlug]/[lessonSlug]`** — Video player (already has `VideoPlayer` component) + lesson notes; call `PATCH /api/v1/enrollments/:id/progress`
- **`/learn/[courseSlug]/notes`** — Notes viewer/editor for the course
- **`/learn/[courseSlug]/tests`** — List DPP + test series linked to course; call `GET /api/v1/dpp/course/:courseId`

### Test result page
- **File**: `apps/lms-web/app/(protected)/test/[slug]/result/page.tsx` (stub)
- Show score summary, correct/incorrect breakdown per question, percentage vs pass threshold
- Call `GET /api/v1/attempts/:id/results`

### Live session pages
- **`/live`** — List upcoming live sessions; `GET /api/v1/live-sessions`
- **`/live/[sessionId]`** — Join room; call `GET /api/v1/live-sessions/:id/token` then embed LiveKit React SDK

---

## Phase 3 — Backend Gaps (lms-backend)

### 3a. Module & Lesson direct CRUD endpoints
Currently modules/lessons are only accessible through course routes. Add:
- `POST /api/v1/courses/:id/modules` — Create module  
- `PATCH /api/v1/modules/:id` — Update module  
- `DELETE /api/v1/modules/:id` — Delete module  
- `POST /api/v1/modules/:id/lessons` — Create lesson  
- `PATCH /api/v1/lessons/:id` — Update lesson  
- `DELETE /api/v1/lessons/:id` — Delete lesson  

New handler file: `apps/lms-backend/internal/api/handlers/module.go`  
New handler file: `apps/lms-backend/internal/api/handlers/lesson.go`  
Register in: `apps/lms-backend/router/routes.go`

### 3b. Question CRUD endpoints
- `POST /api/v1/test-series/:id/questions` — Create question with options  
- `PATCH /api/v1/questions/:id` — Update question  
- `DELETE /api/v1/questions/:id` — Delete question  
- `PATCH /api/v1/questions/:id/options` — Manage options  

Handler: `apps/lms-backend/internal/api/handlers/question.go`

### 3c. Fix existing TODOs
1. **`course.go:444` GetModules** — Wire `CourseService.GetModules()` (service exists, handler doesn't call it)
2. **`enrollment.go:288` GetEnrollment** — Add admin/instructor override check
3. **`live_session_service.go:511` GetToken** — Implement LiveKit `livekit-server-sdk-go` token generation; use `LIVEKIT_API_KEY` + `LIVEKIT_SECRET` from config
4. **`user_service.go:589` BulkImportUsers** — Implement CSV parse using `encoding/csv`

### 3d. Study Materials endpoints
Model exists (`StudyMaterial`). Add:
- `GET/POST /api/v1/courses/:id/materials`  
- `PATCH/DELETE /api/v1/materials/:id`  
- File upload handler (local disk for now; S3 path for later)

Handler: `apps/lms-backend/internal/api/handlers/study_material.go`

### 3e. Notification endpoints
Model exists (`Notification`). Add:
- `GET /api/v1/notifications` — List user's notifications (paginated)  
- `PATCH /api/v1/notifications/:id/read` — Mark read  
- `PATCH /api/v1/notifications/read-all` — Bulk mark read  

Trigger notifications on: enrollment, attempt completion, certificate issuance, new announcements.

### 3f. Batch management endpoints
Models exist (`Batch`, `BatchEnrollment`). Add:
- `GET/POST /api/v1/batches`  
- `GET/PATCH/DELETE /api/v1/batches/:id`  
- `POST /api/v1/batches/:id/enroll` — Add student to batch  
- `GET /api/v1/batches/:id/students`  

Handler: `apps/lms-backend/internal/api/handlers/batch.go`

### 3g. Order & Payment foundation
Model exists (`Order`). Add:
- `GET /api/v1/orders` — Student order history  
- `POST /api/v1/orders` — Create order (pre-payment)  
- `PATCH /api/v1/orders/:id/status` — Update order status (webhook-ready)  

Handler: `apps/lms-backend/internal/api/handlers/order.go`  
Note: Real payment gateway (Razorpay/Stripe) wired in a later pass.

### 3h. Coupon system
Models exist (`Coupon`, `CouponUsage`). Add:
- `GET/POST /api/v1/coupons` (Admin/Faculty)  
- `PATCH/DELETE /api/v1/coupons/:id`  
- `POST /api/v1/coupons/validate` — Student validates coupon at checkout  

Handler: `apps/lms-backend/internal/api/handlers/coupon.go`

---

## Phase 4 — LMS Dashboard Completions (lms-dashboard)

### Edit forms audit & completion
All list pages exist. Verify and complete edit routes for:
- **DPP edit** — `/dpp/:id/edit` — form with question attachment
- **Live class edit** — `/live-classes/:id/edit` — reschedule + edit details
- **Batch management** — New section `/institute/batches` already exists; wire to Phase 3f endpoints
- **Study materials** — New section under course edit: upload/manage materials

### Analytics visualizations
- **`/analytics`** — Add Recharts line charts for enrollment trends, revenue over time
- **`/analytics/course-reports`** — Add completion rate funnel, top courses by enrollment
- **`/analytics/test-reports`** — Add score distribution histogram, pass/fail ratio

### Notification management
- **`/communications/push-notifications`** — Wire to notification create endpoint
- Show delivery stats

### Coupon management  
- **`/revenue/coupons`** — Full CRUD table; wire to Phase 3h endpoints
- Coupon create form: code, discount type (%), expiry, usage limit

---

## Phase 5 — Polishing & Cross-cutting

### lms-web
- Loading skeletons on all list/data pages (use `@flcn-lms/ui` skeleton component)
- Empty states with helpful CTAs (enroll prompt on empty library, etc.)
- Error boundaries on all protected pages
- Toast notifications (success/error) for all mutations

### lms-backend
- **Media upload** — Add `POST /api/v1/upload` endpoint; store locally at first, env-toggle for S3 (`AWS_S3_BUCKET`)
- **Full-text search** — Extend course/test search to include category, instructor, description using `ILIKE`
- **Certificate PDF** — Integrate `jung-kurt/gofpdf` or `signintech/gopdf` for actual PDF output in `certificate_pdf_generator.go`

### lms-dashboard
- Bulk student import UI (CSV upload, preview, confirm) using Phase 3c bulk import fix
- Role creation UI under `/institute/roles-permissions`
- Branding/settings form (`/settings/branding`) wired to Institute model update endpoint

---

## File Map — Critical Paths

| Priority | File | Action |
|----------|------|--------|
| P0 | `apps/lms-web/app/middleware.ts` | Create — auth guard |
| P0 | `apps/lms-web/app/(protected)/layout.tsx` | Edit — add session provider |
| P0 | `apps/lms-web/components/auth/LoginForm.tsx` | Edit — wire submit handler |
| P1 | `apps/lms-web/app/(protected)/user/library/page.tsx` | Build — enrollment list |
| P1 | `apps/lms-web/app/(protected)/user/profile/page.tsx` | Build — profile edit |
| P1 | `apps/lms-web/app/(protected)/learn/[courseSlug]/page.tsx` | Build — lesson sidebar |
| P1 | `apps/lms-web/app/(protected)/test/[slug]/result/page.tsx` | Build — results page |
| P1 | `apps/lms-backend/internal/api/handlers/module.go` | Create — module CRUD |
| P1 | `apps/lms-backend/internal/api/handlers/lesson.go` | Create — lesson CRUD |
| P1 | `apps/lms-backend/internal/api/handlers/question.go` | Create — question CRUD |
| P1 | `apps/lms-backend/internal/service/live_session_service.go:511` | Fix — LiveKit token |
| P2 | `apps/lms-backend/internal/api/handlers/notification.go` | Create — notifications |
| P2 | `apps/lms-backend/internal/api/handlers/batch.go` | Create — batch mgmt |
| P2 | `apps/lms-backend/internal/api/handlers/order.go` | Create — orders |
| P2 | `apps/lms-backend/internal/api/handlers/coupon.go` | Create — coupons |
| P2 | `apps/lms-backend/internal/api/handlers/study_material.go` | Create — materials |
| P3 | `apps/lms-dashboard/src/pages/analytics/` | Edit — add Recharts |
| P3 | `apps/lms-dashboard/src/pages/revenue/coupons/` | Build — coupon CRUD |

---

## Verification

### Backend
```bash
cd apps/lms-backend && go build ./...          # must compile
cd apps/lms-backend && go test ./...           # run test suite
curl http://localhost:8080/health              # health check
```

### lms-web
```bash
cd apps/lms-web && pnpm typecheck             # no type errors
cd apps/lms-web && pnpm dev                   # spin up
# Manual: visit /auth/login, login, verify redirect to /user/library
# Manual: visit /learn/<slug>, verify module/lesson navigation
# Manual: attempt a test, verify result page populates
```

### lms-dashboard
```bash
cd apps/lms-dashboard && pnpm typecheck       # no type errors
cd apps/lms-dashboard && pnpm dev             # spin up
# Manual: create a course, add module + lesson, publish
# Manual: check analytics charts render with data
```
