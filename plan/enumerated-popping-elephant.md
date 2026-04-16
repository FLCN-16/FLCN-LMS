# Plan: saas-dashboard API Integration

## Context

The `saas-dashboard` app (React + Vite, port 3002) is in scaffold phase — routing, Axios, and React Query are wired up, but the auth context is a stub and no pages exist. The `saas-backend` (NestJS, port 3000) has a fully working REST API. This plan wires the dashboard to the backend and builds all the feature pages.

---

## Architecture Decisions

- **Mirror `lms-dashboard` patterns** exactly: `react-query-kit` mutations/queries, `js-cookie` for token, `withAuth` HOC, sidebar layout, lazy pages, CASL for ability (single super_admin role)
- **Cookie-based auth**: JWT stored as `flcn-lms.saas.auth-token` (HttpOnly in production, readable cookie in dev)
- **Proxy already configured**: Vite sends `/api → http://localhost:3000`; all API calls use `/api/v1/...`
- **No new packages needed**: all deps (`jotai`, `@casl/ability`, `react-query-kit`, `js-cookie`, `react-hook-form`) already installed

---

## Files to Create / Modify

### 1. Constants & Config
- **`src/constants/auth.ts`** — `AUTH_COOKIE_NAME = 'flcn-lms.saas.auth-token'`, `AUTH_DISABLED = false`

### 2. Fix existing `fetch.ts`
- **`src/lib/fetch.ts`** — change token source from `localStorage` to `js-cookie` (match lms-dashboard pattern)

### 3. CASL Ability
- **`src/lib/ability.ts`** — define `AppAbility` for a single `super_admin` subject with blanket manage all

### 4. Auth Queries (`src/queries/auth/`)
- **`login.ts`** — `createMutation` → `POST /api/v1/auth/login`, stores cookie
- **`session.ts`** — `createQuery` → `GET /api/v1/auth/session`
- **`logout.ts`** — `createMutation` → clears cookie client-side

### 5. Feature Queries (one file per resource in `src/queries/`)

| Module | Key operations |
|---|---|
| `plans/index.ts` | list, get, create, update, delete |
| `licenses/index.ts` | list, get, issue, suspend, reactivate, revoke, stats |
| `api-keys/index.ts` | list, get, create, update, enable, disable, delete, stats |
| `billing/index.ts` | list, get by institute, create, update, subscription, invoices |
| `invoices/index.ts` | list, get, create, update, mark-paid, cancel, stats, overdue |
| `refunds/index.ts` | list, get, create, process, approve, reject, retry, stats |
| `super-admins/index.ts` | list, get, create, update, delete |

### 6. Auth Feature (`src/features/auth/`)
- **`auth.context.tsx`** — replace stub with full implementation using session/login/logout queries + CASL ability (mirror lms-dashboard pattern)
- **`with-auth.hoc.tsx`** — HOC that reads `useAuth()`, shows spinner while loading, redirects to `/auth/login` if unauthenticated

### 7. Components
- **`src/components/protected-route.tsx`** — renders children if `isAuthenticated`, otherwise `<Navigate to="/auth/login" />`

### 8. Layouts (`src/layouts/`)
- **`auth/index.tsx`** — centered card layout with `<Outlet />`
- **`dashboard/index.tsx`** — `SidebarProvider` + `AppSidebar` + `SidebarInset` + `SiteHeader` + `<Outlet />`
- **`dashboard/app-sidebar.tsx`** — nav items: Overview, Super Admins, Plans, Licenses, API Keys, Billing, Invoices, Refunds
- **`dashboard/site-header.tsx`** — app title + logged-in user display + logout button

### 9. Pages (`src/pages/`)

| Route | Page | Description |
|---|---|---|
| `/auth/login` | `auth/login.tsx` | Login form using `react-hook-form` + `useLoginUser` mutation |
| `/` | `home/index.tsx` | Overview cards: license count, active plans, revenue summary, pending refunds |
| `/super-admins` | `super-admins/index.tsx` | Table list + create/edit/delete |
| `/plans` | `plans/index.tsx` | Plan cards + create/edit/delete |
| `/licenses` | `licenses/index.tsx` | Filterable table + issue/suspend/reactivate/revoke actions |
| `/api-keys` | `api-keys/index.tsx` | List + create (show key once) + enable/disable/delete |
| `/billing` | `billing/index.tsx` | Billing records table + create + subscription/invoices view |
| `/invoices` | `invoices/index.tsx` | Invoices table with status filter + mark-paid/cancel actions |
| `/refunds` | `refunds/index.tsx` | Refund queue + approve/reject/retry actions |

### 10. Updated `App.tsx`
Replace placeholder with full route tree:
```
/auth/*         → AuthLayout (public)
/*              → ProtectedDashboardLayout (withAuth HOC)
```

### 11. Update `main.tsx`
Wrap app in `AuthProvider` (currently missing from provider tree — `QueryClientProvider` is present but `AuthProvider` is not wired in)

---

## Implementation Order

1. `constants/auth.ts` + fix `lib/fetch.ts`
2. `lib/ability.ts`
3. `queries/auth/*`
4. `features/auth/auth.context.tsx` + `with-auth.hoc.tsx`
5. `components/protected-route.tsx`
6. `layouts/auth` + `layouts/dashboard`
7. `pages/auth/login`
8. `App.tsx` (full route tree)
9. All feature queries
10. Feature pages (home → super-admins → plans → licenses → api-keys → billing → invoices → refunds)

---

## Verification

1. `cd apps/saas-dashboard && pnpm dev` — server starts on port 3002, `/` redirects to `/auth/login`
2. Start `saas-backend`: `cd apps/saas-backend && pnpm start:dev` — runs on port 3000
3. Log in with a seeded super admin → redirected to dashboard home
4. Navigate each section; data loads from backend
5. Test create/edit/delete flows for Plans and Super Admins
6. Test license issue → suspend → reactivate flow
7. Verify API key create shows raw key once, then shows preview only
8. `pnpm typecheck` passes with no errors
