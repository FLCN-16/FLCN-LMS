# FLCN-LMS — Agent Guide

## Project Overview

FLCN-LMS is a Learning Management System (LMS) monorepo built with Turborepo and pnpm. It consists of three apps and shared packages.

## Monorepo Structure

```
flcn-lms/
├── apps/
│   ├── web/          # Marketing + student-facing Next.js app (port 3000)
│   ├── dashboard/    # Admin/instructor dashboard — React + Vite (port 3001)
│   └── backend/      # API server — NestJS
├── packages/
│   ├── ui/           # Shared component library (shadcn/ui + Radix + Tailwind v4)
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared tsconfig presets
```

## Tech Stack

| Layer | Technology |
|---|---|
| Web frontend | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 |
| Dashboard | React 19, Vite 8, TypeScript, `@flcn-lms/ui` |
| Backend | NestJS 11, TypeScript |
| UI library | shadcn/ui, Radix UI, Base UI, Recharts, Embla Carousel |
| Monorepo | Turborepo, pnpm 10 |
| Icons | HugeIcons |
| Theming | next-themes |
| Fonts | DM Sans, Space Grotesk, Geist Mono |

## Package Manager

This project uses **pnpm**. Do not use npm or yarn directly.

```bash
pnpm install          # install all dependencies
pnpm dev              # run all apps in dev mode (via turbo)
pnpm build            # build all apps
pnpm lint             # lint all packages
pnpm typecheck        # type-check all packages
```

## App-Specific Dev Commands

```bash
# Web (Next.js) — port 3000
cd apps/web && pnpm dev

# Dashboard (Vite) — port 3001
cd apps/dashboard && pnpm dev

# Backend (NestJS)
cd apps/backend && pnpm start:dev
```

## Adding UI Components

Components live in `packages/ui/src/components`. Add shadcn components from the repo root:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Import them in any app:

```tsx
import { Button } from "@flcn-lms/ui/components/button"
```

## Web App Route Structure

- `app/(marketing)/` — public marketing pages (courses, instructors, blogs, cart, checkout)
- `app/auth/` — login & register
- `app/panel/` — authenticated student panel (course consumption, library, tests, notes)

## Key Conventions

- Shared UI exports are defined in `packages/ui/package.json` under `exports`
- Workspace packages are referenced as `@flcn-lms/<name>`
- TypeScript configs extend from `@flcn-lms/typescript-config`
- ESLint configs extend from `@flcn-lms/eslint-config` (base, next-js, react-internal)
- Node.js >= 20 required
