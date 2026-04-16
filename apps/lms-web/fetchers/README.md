# Web App Fetchers

This directory contains typed fetcher functions for all API endpoints. Each file groups related endpoints for a specific feature.

## Structure

```
fetchers/
├── auth.ts           # Authentication endpoints (login, register, logout, password reset)
├── course.ts         # Course management (list, enroll, progress, reviews)
├── lessons.ts        # Lesson content and progress
├── test-series.ts    # Tests and exams
├── attempts.ts       # Test attempt submission and results
├── user.ts           # User profile and settings
└── README.md         # This file
```

## Core Concepts

### What is a Fetcher?

A fetcher is a typed function that:
1. Calls a specific API endpoint using the enhanced `fetcher` from `@/lib/fetcher`
2. Passes the response through a typed return
3. Handles errors appropriately
4. Documents the endpoint with JSDoc comments

### Pattern

Each fetcher file exports named functions, one per endpoint:

```typescript
import { fetcher } from "@/lib/fetcher"

/**
 * Get current user session
 * GET /api/v1/auth/session
 */
export async function getSession() {
  return fetcher<SessionResponse>("/api/v1/auth/session")
}

/**
 * Login user
 * POST /api/v1/auth/login
 */
export async function login(data: { email: string; password: string }) {
  return fetcher<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
```

## Using Fetchers

### Import and Call

```typescript
import { login, getSession } from "@/fetchers/auth"

// Simple usage
const session = await getSession()

// With error handling
try {
  const result = await login({
    email: "user@example.com",
    password: "password123",
  })
} catch (error) {
  if (error instanceof UnauthorizedError) {
    redirect("/auth/login")
  }
}
```

### In Server Components

Server Components can call fetchers directly:

```typescript
import { getSession } from "@/fetchers/auth"
import { getCourses } from "@/fetchers/course"

export default async function Dashboard() {
  const user = await getSession()
  const courses = await getCourses({ limit: 10 })

  return <div>{/* render */}</div>
}
```

### In Client Components

Use fetchers in `useEffect`:

```typescript
"use client"

import { useEffect, useState } from "react"
import { getCourses } from "@/fetchers/course"
import { ApiError } from "@/lib/fetcher"

export function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    getCourses({ limit: 10 })
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  )
}
```

### In Custom Hooks

Create reusable hooks that use fetchers:

```typescript
"use client"

import { useEffect, useState } from "react"
import { getCourses } from "@/fetchers/course"
import type { Course } from "@flcn-lms/types"
import { ApiError } from "@/lib/fetcher"

export function useCourses(limit = 10) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    getCourses({ limit })
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [limit])

  return { courses, loading, error }
}

// Usage
const { courses, loading } = useCourses(20)
```

## Creating New Fetchers

### 1. Create File

Create a new file in `fetchers/` following the naming convention:
- Singular form (e.g., `user.ts`, not `users.ts`)
- Lowercase, hyphenated for multi-word names (e.g., `test-series.ts`)

### 2. Import Fetcher

```typescript
import { fetcher } from "@/lib/fetcher"
import type { YourType } from "@flcn-lms/types"
```

### 3. Export Functions

```typescript
/**
 * Describe the endpoint
 * METHOD /api/v1/path
 *
 * @param param - Description
 * @returns Typed response
 * @throws UnauthorizedError if not authenticated
 * @throws ValidationError if data is invalid
 *
 * @example
 * ```ts
 * const result = await yourFetcher({ id: "123" })
 * ```
 */
export async function yourFetcher(data: {
  id: string
}) {
  return fetcher<YourResponse>("/api/v1/your-endpoint", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
```

### 4. Full Example

```typescript
// fetchers/payment.ts
import { fetcher } from "@/lib/fetcher"
import type { Payment, PaymentIntent } from "@flcn-lms/types"

/**
 * Create payment intent
 * POST /api/v1/payments/intent
 */
export async function createPaymentIntent(data: {
  courseId: string
  amount: number
}) {
  return fetcher<PaymentIntent>("/api/v1/payments/intent", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * Get payment by ID
 * GET /api/v1/payments/:id
 */
export async function getPayment(id: string) {
  return fetcher<Payment>(`/api/v1/payments/${id}`)
}

/**
 * List user payments
 * GET /api/v1/payments
 */
export async function getPayments(params?: {
  page?: number
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.page) query.append("page", String(params.page))
  if (params?.limit) query.append("limit", String(params.limit))

  const url = `/api/v1/payments${query.toString() ? "?" + query.toString() : ""}`
  return fetcher<{ payments: Payment[]; total: number }>(url)
}
```

## Authentication

All fetchers automatically include authentication via the enhanced `fetcher` function:

1. **Server-Side**: Uses `next/headers` to get the auth token from cookies
2. **Client-Side**: Uses `cookies-next` to get the auth token from cookies
3. **Both**: Injects `Authorization: Bearer <token>` header automatically

No additional setup needed!

### Logout

```typescript
import { logout } from "@/fetchers/auth"

await logout()
redirect("/auth/login")
```

## Error Handling

All fetchers throw typed errors that can be caught:

```typescript
import {
  fetcher,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ApiError,
  NetworkError,
} from "@/lib/fetcher"

try {
  await someFetcher()
} catch (error) {
  if (error instanceof UnauthorizedError) {
    // 401 - redirect to login
    redirect("/auth/login")
  } else if (error instanceof ValidationError) {
    // 422 - show validation errors
    console.log(error.errors) // { field: ['error message'] }
  } else if (error instanceof NotFoundError) {
    // 404 - resource not found
    showToast("Not found")
  } else if (error instanceof NetworkError) {
    // Network error - check connection
    showToast("Connection error")
  } else if (error instanceof ApiError) {
    // Generic API error
    console.log(error.status, error.statusText)
  }
}
```

## Best Practices

### ✅ Do

```typescript
// Export named functions
export async function getCourse(id: string) {
  return fetcher<Course>(`/api/v1/courses/${id}`)
}

// Use JSDoc with examples
/**
 * Get course by ID
 * GET /api/v1/courses/:id
 *
 * @example
 * ```ts
 * const course = await getCourse("123")
 * ```
 */

// Handle errors specifically
try {
  await fetcher(...)
} catch (error) {
  if (error instanceof UnauthorizedError) {
    // handle 401
  }
}

// Use types from @flcn-lms/types
import type { Course } from "@flcn-lms/types"
```

### ❌ Don't

```typescript
// Don't export objects with methods
export const courseApi = {
  get: async () => {},
}

// Don't forget error handling
const data = await fetcher(...) // no try/catch

// Don't hardcode types
return fetcher("...") as any

// Don't make fetcher calls outside fetchers/
// Instead, create a fetcher and import it
import { getCourse } from "@/fetchers/course"
```

## Types

All types should be imported from `@flcn-lms/types`:

```typescript
import type {
  User,
  Course,
  Lesson,
  TestSeries,
  Attempt,
} from "@flcn-lms/types"
```

If a type is missing, add it to `@flcn-lms/types` package, not in this directory.

## Testing

Test fetchers using Mock Service Worker (MSW):

```typescript
import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { getCourse } from "@/fetchers/course"

const server = setupServer(
  http.get("/api/v1/courses/:id", () => {
    return HttpResponse.json({
      id: "1",
      title: "Test Course",
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("getCourse fetches course data", async () => {
  const course = await getCourse("1")
  expect(course.title).toBe("Test Course")
})
```

## File Organization

### auth.ts
- `login(email, password)`
- `register(email, password, name)`
- `getSession()`
- `logout()`
- `requestPasswordReset(email)`
- `resetPassword(token, password)`
- `changePassword(current, new)`
- `verifyEmail(token)`
- `refreshToken()`

### course.ts
- `getCourses(params)`
- `getCourse(slug)`
- `searchCourses(query)`
- `enroll(courseId)`
- `getEnrolledCourses(params)`
- `getProgress(courseId)`
- `updateLessonProgress(courseId, lessonId, progress)`
- `getCourseReviews(courseId)`
- `submitReview(courseId, review)`

### lessons.ts
- `getLesson(courseSlug, lessonId)`
- `markLessonComplete(courseId, lessonId)`
- `updateWatchProgress(lessonId, progress)`

### test-series.ts
- `getTestSeries(params)`
- `getTestSeries(slug)`
- `getTestQuestions(testId)`

### attempts.ts
- `startAttempt(testId)`
- `submitAnswers(attemptId, answers)`
- `getAttemptResult(attemptId)`
- `getAttemptHistory(userId)`

### user.ts
- `getProfile()`
- `updateProfile(data)`
- `getCertificates()`
- `downloadCertificate(id)`
- `getPreferences()`
- `updatePreferences(data)`

## Environment Variables

The base API URL is configured via environment variables (read by `fetcher`):

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Staging
NEXT_PUBLIC_API_URL=https://api.staging.flcn-lms.com

# Production
NEXT_PUBLIC_API_URL=https://api.flcn-lms.com
```

## Troubleshooting

### "UnauthorizedError" - User not authenticated

Solution: Redirect to login page

```typescript
catch (error) {
  if (error instanceof UnauthorizedError) {
    redirect("/auth/login")
  }
}
```

### "ValidationError" - Invalid request data

Solution: Check error.errors for field-level errors

```typescript
catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors) // { email: ['Email is required'] }
  }
}
```

### "NetworkError" - Connection issue

Solution: Check internet connection and API URL

```typescript
catch (error) {
  if (error instanceof NetworkError) {
    showToast("Check your internet connection")
  }
}
```

## Related Files

- `/lib/fetcher.ts` - Enhanced fetch wrapper with error handling
- `/lib/cookies.ts` - Cookie constants
- `/errors/api-errors.ts` - Error class definitions
- `@flcn-lms/types` - Shared type definitions