# FLCN LMS — Institute Dashboard (`apps/dashboard`)

## Overview

The Institute Dashboard is a React + TypeScript single-page application serving as the primary management interface for institute administrators, faculty, and staff. It operates exclusively against the per-institute API (`/api/v1/:instituteSlug/*`) and has no SaaS admin capabilities.

**Stack:** React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind CSS, CASL

***

## Project Structure

```
apps/dashboard/src/
├── main.tsx
├── App.tsx
├── components/               # Shared UI components
├── features/
│   └── auth/                 # Auth context, hook, HOC
├── constants/                # Static config (auth keys etc.)
├── layouts/
│   ├── auth/                 # Login/reset layout
│   └── dashboard/            # Sidebar + header shell
├── lib/
│   ├── fetch.ts              # Base fetch wrapper (attaches JWT, instituteSlug)
│   ├── ability.ts            # CASL ability definitions
│   └── api/                  # Raw API call functions (one file per domain)
├── queries/                  # TanStack Query hooks (wrap lib/api/)
└── pages/                    # Route-level page components
```

***

## Authentication

- **JWT-based** — token stored in memory (not localStorage)
- **Login endpoint:** `POST /api/v1/:instituteSlug/auth/login`
- **Token payload:** `{ sub, email, role, instituteSlug, instituteId }`
- **Roles:** `admin | faculty | student`
- **Protected routes:** wrapped with `<ProtectedRoute>` component
- **CASL** used for fine-grained UI permission checks (hide/show buttons, sections)
- `instituteSlug` is derived from subdomain or stored post-login and prepended to every API call via `lib/fetch.ts`

***

## Routing Structure

```
/                               → Home (Dashboard overview)

/auth/login                     → Login page
/auth/forgot-password           → Forgot password
/auth/reset-password            → Reset password

── Courses ───────────────────────────────────────
/courses                        → Course list
/courses/new                    → Create course
/courses/:id/edit               → Edit course
/course-categories              → Category list
/course-categories/new          → Create category
/course-categories/:id/edit     → Edit category
/content-review                 → Pending content approvals
/dpp                            → Daily Practice Problems list
/dpp/new                        → Create DPP

── Tests ─────────────────────────────────────────
/test-series                    → Test series list
/test-series/new                → Create test series
/test-series/:id/edit           → Edit test series
/test-series/:id/tests          → Tests within a series
/test-series/:id/tests/new      → Create test
/test-series/:id/tests/:testId/edit → Edit test
/questions                      → Question bank
/questions/new                  → Create question
/questions/:id/edit             → Edit question
/exam-types                     → Exam type config
/attempts                       → All student attempts
/attempts/:id/result            → Attempt result detail
/leaderboard                    → Test leaderboard

── Live Classes ──────────────────────────────────
/live-classes                   → Scheduled + live sessions
/live-classes/new               → Schedule new session

── Institute Admin ───────────────────────────────
/institute/students             → Student management
/institute/faculty              → Faculty management
/institute/batches              → Batch management
/institute/attendance           → Attendance records
/institute/timetable            → Class timetable
/institute/roles-permissions    → Role & permission management
/institute/settings             → Institute profile settings

── Analytics ─────────────────────────────────────
/analytics                      → Overview dashboard
/analytics/course-reports       → Per-course analytics
/analytics/test-reports         → Per-test analytics

── Revenue ───────────────────────────────────────
/revenue/transactions           → Payment transactions
/revenue/coupons                → Discount coupons
/revenue/refunds                → Refund management

── Communications ────────────────────────────────
/communications/announcements      → Announcements
/communications/push-notifications → Push notification campaigns

── Settings ──────────────────────────────────────
/settings/branding              → Logo, colors, white-label
/settings/integrations          → Third-party integrations
```

***

## API Layer Convention

All API calls follow a two-layer pattern:

```
lib/api/{domain}.ts         ← pure async functions, no React
    ↓
queries/{domain}/index.ts   ← TanStack Query hooks (useQuery / useMutation)
    ↓
pages/{domain}/*.tsx         ← consumes hooks
```

`lib/fetch.ts` handles:
- Attaching `Authorization: Bearer <token>` header
- Prepending `/api/v1/:instituteSlug` to every request
- Global error handling (401 → redirect to login)

***

## API Files (`lib/api/`)

| File | Covers |
|------|--------|
| `auth.ts` | Login, logout, session refresh |
| `courses.ts` | Course CRUD, enrollment |
| `attempts.ts` | Start, save response, submit, result |
| `questions.ts` | Question bank CRUD |
| `test-series.ts` | Test series + tests CRUD |
| `exam-types.ts` | Exam type config |
| `live-sessions.ts` | Schedule, start, end sessions |
| `users.ts` | Students, faculty CRUD |
| `leaderboard.ts` | Fetch leaderboard by test |
| `analytics.ts` | Course + test report data |

***

## Query Files (`queries/`)

| Folder | Key Hooks |
|--------|-----------|
| `auth/` | `useLogin`, `useLogout`, `useSession` |
| `courses/` | `useCourses`, `useCourse`, `useCreateCourse` |
| `attempts/` | `useAttempts`, `useStartAttempt`, `useSubmitAttempt` |
| `questions/` | `useQuestions`, `useCreateQuestion` |
| `test-series/` | `useTestSeries`, `useTests`, `useCreateTest` |
| `exam-types/` | `useExamTypes` |
| `live-sessions/` | `useLiveSessions`, `useScheduleSession` |
| `users/` | `useStudents`, `useFaculty` |
| `leaderboard/` | `useLeaderboard` |
| `analytics/` | `useCourseReports`, `useTestReports` |

***

## Layout — Dashboard Shell

```
layouts/dashboard/
  app-sidebar.tsx         # Sidebar with nav sections
  site-header.tsx         # Header with breadcrumb, search, user menu
  nav-main.tsx            # Dashboard, Analytics
  nav-courses.tsx         # Courses, Categories, DPP, Content Review
  nav-test-series.tsx     # Test Series, Questions, Attempts, Leaderboard
  nav-institute.tsx       # Students, Faculty, Batches, Attendance
  nav-user.tsx            # User avatar, role, logout
  navigation-config.ts    # Central nav data (titles, icons, routes)
  index.tsx               # Root layout wrapper
```

***

## Shared Components

| Component | Purpose |
|-----------|---------|
| `rich-editor.tsx` | TipTap/Quill editor for course + question content (LaTeX support) |
| `date-time-picker.tsx` | Date/time input for live sessions and tests |
| `entity-seo-form.tsx` | SEO fields (slug, meta title, meta description) reused across courses/series |
| `loader.tsx` | Full-page and inline loading spinner |
| `panel-placeholder-page.tsx` | Coming-soon placeholder for unbuilt pages |
| `protected-route.tsx` | Route guard — redirects unauthenticated users |

***

## Permissions (CASL)

Roles and abilities defined in `lib/ability.ts`:

```
admin   → full access to all institute resources
faculty → manage own courses, questions, live sessions; read students
student → view enrolled courses, take tests, view own results
```

UI elements conditionally rendered using `<Can>` component from CASL React.

***

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_INSTITUTE_SLUG=pw-live          # dev override; production derives from subdomain
```

***

## Key Implementation Notes

1. **instituteSlug** is read from subdomain in production (`pw-live.flcn.app` → `pw-live`). In development it falls back to `VITE_INSTITUTE_SLUG` env var.
2. **No localStorage** — JWT stored in React context memory only. Page refresh requires re-login or silent refresh via a `refreshToken` cookie (httpOnly).
3. **TanStack Query** cache keys always include `instituteSlug` to prevent cross-institute cache collisions if ever tested locally with multiple slugs.
4. **rich-editor** must support LaTeX rendering for math questions — use KaTeX extension.
5. **Attempt engine pages** are time-sensitive — disable React Query background refetching during an active test attempt.