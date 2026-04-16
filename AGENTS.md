# FLCN-LMS — Agent Guide

## Project Overview

FLCN-LMS is a Learning Management System (LMS) monorepo built with Turborepo and pnpm. It consists of LMS apps (web, dashboard, backend), SaaS admin apps (dashboard, backend), and shared packages.

## Monorepo Structure

```
flcn-lms/
├── apps/
│   ├── lms-web/          # Marketing + student-facing Next.js app (port 3000)
│   ├── lms-dashboard/    # LMS admin/instructor dashboard — React + Vite (port 3001)
│   ├── lms-backend/      # LMS API server — Go Gin
│   ├── saas-dashboard/   # SaaS admin dashboard — React + Vite (port 3002)
│   └── saas-backend/     # SaaS API server — NestJS
├── packages/
│   ├── ui/           # Shared component library (shadcn/ui + Radix + Tailwind v4)
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared tsconfig presets
```

## Tech Stack

| Layer | Technology |
|---|---|
| LMS Web frontend | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4 |
| LMS Dashboard | React 19, Vite 8, TypeScript, `@flcn-lms/ui` |
| LMS Backend | Go Gin |
| SaaS Dashboard | React 19, Vite 8, TypeScript, `@flcn-lms/ui` |
| SaaS Backend | NestJS 11, TypeScript |
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
# LMS Web (Next.js) — port 3000
cd apps/lms-web && pnpm dev

# LMS Dashboard (Vite) — port 3001
cd apps/lms-dashboard && pnpm dev

# LMS Backend (Go Gin) — port 8080
cd apps/lms-backend && go run ./cmd

# SaaS Dashboard (Vite) — port 3002
cd apps/saas-dashboard && pnpm dev

# SaaS Backend (NestJS) — port 3000
cd apps/saas-backend && pnpm start:dev
```

## Adding UI Components

Components live in `packages/ui/src/components`. Add shadcn components from the repo root:

```bash
pnpm dlx shadcn@latest add <component> -c apps/lms-web
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

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

---

## Design Context

**See `.impeccable.md` for full design guidelines.**

### Brand & Aesthetic
- **Brand**: Modern, innovative, forward-thinking
- **Aesthetic**: Minimal & Refined (Linear, Vercel, Stripe style)
- **Themes**: Light and dark mode with system preference detection

### Key Design Principles
1. **Clarity through simplicity** — Remove visual noise; focus on essential information
2. **Contemporary typography** — Sophisticated font pairing with intentional hierarchy
3. **Intent over decoration** — Every element serves a purpose; no gratuitous effects
4. **Performance & efficiency** — Fast interactions, optimistic UI, minimal cognitive load
5. **Refined color treatment** — OKLCH color space; sophisticated palette; both themes equally polished

### SaaS Dashboard Target
- **Users**: FLCN internal operations team managing licenses, billing, API keys
- **Job**: Quickly manage customer subscriptions, issue licenses, track billing
- **Feel**: Premium, efficient, trustworthy (not cold or overly minimal)

### What We Avoid
❌ Dark mode + glowing accents | ❌ Gradient backgrounds | ❌ Heavy shadows/glassmorphism | ❌ Neon colors | ❌ Generic card grids | ❌ Modal overuse | ❌ Same padding everywhere

### What We Embrace
✅ Distinctive typography | ✅ Whitespace & rhythm | ✅ Asymmetrical layouts | ✅ Fast interactions | ✅ Progressive disclosure | ✅ Clean data tables | ✅ Empty states that teach

<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->
