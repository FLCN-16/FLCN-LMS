# Courses Page UI — Implementation Plan

## Context
The current courses page (`apps/lms-web/app/(marketing)/courses/page.tsx`) is placeholder code: a plain grid of hardcoded cards with no search, filtering, or visual identity. The goal is to redesign it as a production-grade, energetic course discovery experience aligned with the lms-web design context: **Modern & Energetic** (StudyIQ / Physics Wallah aesthetic), warm orange accent, Space Grotesk headings, DM Sans body.

## Files to Create / Modify

| File | Action |
|---|---|
| `apps/lms-web/app/(marketing)/courses/page.tsx` | **Rewrite** — server component, compose section components |
| `apps/lms-web/app/(marketing)/courses/_components/courses-header.tsx` | **Create** — search hero section |
| `apps/lms-web/app/(marketing)/courses/_components/courses-filter.tsx` | **Create** — client component for category tabs + sidebar filters |
| `apps/lms-web/app/(marketing)/courses/_components/courses-grid.tsx` | **Create** — responsive grid with CourseCard |

## Reusable Imports

- `CourseCard` from `@/components/card/course` — existing card with image, title, price, buttons
- `CourseGridSkeleton` from `@/components/course-card-skeleton` — loading skeleton
- `InputGroup`, `InputGroupAddon`, `InputGroupInput` from `@flcn-lms/ui/components/input-group` — search with icon prefix
- `Badge` from `@flcn-lms/ui/components/badge` — category tags / active filter chips
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` from `@flcn-lms/ui/components/select` — sort-by dropdown
- `Checkbox` from `@flcn-lms/ui/components/checkbox` — filter facets
- `HugeiconsIcon` + `Search01Icon`, `Filter` icons from `@hugeicons/core-free-icons`

## Design Approach

### `courses-header.tsx` (server)
- Accent-warm section: `bg-accent/10` background, subtle radial warm glow via CSS gradient (no gradient text)
- Space Grotesk `h1` title: "Find Your Next Course"
- Subtext about course count
- Search bar spanning ~600px max using InputGroup — search icon prefix, input, search button

### `courses-filter.tsx` (client)
State: `selectedCategory`, `sortBy`, `selectedLevels[]`, `priceRange`

Layout:
- **Category tab strip** — horizontal scrollable strip of category buttons above the grid. Active = accent-colored pill, inactive = ghost. Categories: All, Technology, Finance, Design, Marketing, Science, Language
- **Desktop sidebar** (left, sticky, `w-64`) — collapsible groups:
  - Sort By: `Select` (Newest, Most Popular, Price: Low to High, Highest Rated)
  - Level: `Checkbox` facets (Beginner, Intermediate, Advanced)
  - Price: `Checkbox` facets (Free, Paid, Under ₹500, Under ₹1000)
- **Mobile**: Category strip stays; filters move into a slide-out sheet triggered by a Filter button
- **Active filters strip**: below category tabs, shows `Badge` chips with ×  dismiss for each applied filter

### `courses-grid.tsx` (server/client hybrid)
- Receives filtered/sorted course data
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` gap-6
- Shows result count above grid: "Showing 24 courses"
- Renders `CourseCard` for each course
- Empty state: centered icon + "No courses match your filters" + "Clear filters" CTA

### `page.tsx` (server)
```tsx
// Two-column layout on desktop, stacked on mobile
<main>
  <CoursesHeader />
  <section className="container mx-auto px-4 py-12">
    <CoursesFilter />       // client: category tabs, sidebar
    <CoursesGrid courses={courses} />
  </section>
</main>
```

Since there's no API yet, use rich mock data (8+ courses with varied titles, images from d3njjcbhbojbot CDN, prices, categories).

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  CoursesHeader (warm accent bg)                     │
│  h1 "Find Your Next Course"                         │
│  [🔍 Search courses...              Search ]        │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  Category tabs: All | Technology | Finance | ...    │
│  Active filters: [Technology ×] [Beginner ×]        │
├──────────────────┬──────────────────────────────────┤
│  Sidebar         │  "Showing 24 courses"             │
│  Sort By [v]     │  ┌──┐ ┌──┐ ┌──┐                  │
│  ☐ Beginner      │  │  │ │  │ │  │  CourseCards     │
│  ☐ Intermediate  │  └──┘ └──┘ └──┘                  │
│  ☐ Free          │  ┌──┐ ┌──┐ ┌──┐                  │
│  ☐ Under ₹500    │  │  │ │  │ │  │                  │
└──────────────────┴──────────────────────────────────┘
```

## Key Design Decisions
- **No border-left accents** — Use background tint + weight for active filter states
- **No gradient text** — Solid foreground colors throughout
- **Accent color** `oklch(0.68 0.27 57)` (warm orange) for active category tab, active checkbox fill, search button
- **Category tabs scroll horizontally on mobile** — no hidden items
- **Filter sidebar sticky on desktop** — `sticky top-20 h-fit`

## Verification
1. Run `pnpm dev` from repo root, navigate to `/courses`
2. Check: search bar renders with icon, category tabs scroll, sidebar shows facets
3. Click a category → grid shows filtered courses
4. Apply level filter → active filter badge appears
5. Click badge × → filter clears
6. Resize to mobile → sidebar hides, filter button appears
7. Run `pnpm typecheck` — no TypeScript errors
