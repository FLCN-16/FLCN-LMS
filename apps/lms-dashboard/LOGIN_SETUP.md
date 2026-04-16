# Dashboard Login Setup Guide

## Login Schema

The dashboard login system uses the following schema:

```json
{
  "email": "admin@flcn-lms.com",
  "password": "admin123456",
  "remember": false
}
```

### Request Fields

- **email** (string, required): User's email address
- **password** (string, required): User's password
- **remember** (boolean, optional): Whether to persist the login session for 30 days

## API Response Format

### Success Response (HTTP 200)

```json
{
  "user": {
    "id": "b2663a20-cf98-4461-bc79-5c765b16750f",
    "tenantId": "1455c765-d0bb-4bb0-9f1e-662f50fff4db",
    "name": "System Administrator",
    "email": "admin@flcn-lms.com",
    "phone": null,
    "avatarUrl": null,
    "role": "super_admin",
    "permissions": [],
    "isActive": true,
    "createdAt": "2026-04-01T03:27:09.028Z",
    "updatedAt": "2026-04-01T03:27:09.028Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMjY2M2EyMC1jZjk4LTQ0NjEtYmM3OS01Yzc2NWIxNjc1MGYiLCJlbWFpbCI6ImFkbWluQGZsY24tbG1zLmNvbSIsInJvbGUiOiJzdXBlcl9hZG1pbiIsIm5hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzc1MDMzODUyLCJleHAiOjE3Nzc2MjU4NTJ9.9qFjeH3NPbQdcL8cqWZ_vl2J8WZAvOFgBVCR2TznqkA"
}
```

### User Object Structure

```typescript
interface User {
  id: string                    // UUID
  tenantId: string              // UUID (Tenant/Organization)
  name: string                  // User's full name
  email: string                 // User's email address
  phone: string | null          // Optional phone number
  avatarUrl: string | null      // Optional profile avatar URL
  role: Role                    // "super_admin" | "admin" | "instructor" | "student"
  permissions: string[]         // Array of permission tokens (e.g., "read:Dashboard")
  isActive: boolean             // Account active status
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
}
```

### JWT Token Payload

The JWT token contains the following claims:

```json
{
  "sub": "b2663a20-cf98-4461-bc79-5c765b16750f",
  "email": "admin@flcn-lms.com",
  "role": "super_admin",
  "name": "System Administrator",
  "permissions": [],
  "iat": 1775033852,
  "exp": 1777625852
}
```

## Updated Components & Files

### 1. Login Query (`src/queries/auth/login.ts`)

The main mutation hook for user login:

```typescript
import { useLoginUser, type LoginVariables, type LoginResponse } from "@/queries/auth"

// LoginVariables interface
export interface LoginVariables {
  email: string
  password: string
  remember: boolean
}

// LoginResponse interface
export interface LoginResponse {
  user: User
  token: string
}

const mutation = useLoginUser()
const response = await mutation.mutateAsync({ 
  email: "admin@flcn-lms.com", 
  password: "admin123456", 
  remember: false 
})

// response.user contains the User object
// response.token contains the JWT token
```

**Features:**
- Automatically sets authentication cookie when login is successful
- Cookie contains the JWT token
- Cookie expires in 30 days if `remember` is true, otherwise expires at end of session
- Uses secure and sameSite=lax cookie settings in production

### 2. Auth Context (`src/contexts/auth.tsx`)

Manages global authentication state:

```typescript
const { login, logout, isAuthenticated, user, isLoading, ability } = useAuth()

// Login usage
await login("admin@flcn-lms.com", "admin123456", false)

// Logout usage
await logout()

// Access user properties
console.log(user?.name)        // "System Administrator"
console.log(user?.role)        // "super_admin"
console.log(user?.tenantId)    // "1455c765-d0bb-4bb0-9f1e-662f50fff4db"
console.log(user?.isActive)    // true
```

**Context Properties:**
- `isLoading`: Whether auth operations are in progress
- `isAuthenticated`: Whether user is logged in
- `user`: Current user object with all properties
- `ability`: CASL ability instance for authorization checks
- `login(email, password, remember)`: Login mutation
- `logout()`: Logout mutation
- `revalidateSession()`: Revalidate current session

### 3. Login Page (`src/pages/auth/login.tsx`)

The UI component for user login:

**Form Fields:**
- Email input with validation (required, valid email format)
- Password input with "Forgot your password?" link
- Remember me checkbox
- Login button with loading state
- OAuth login option (GitHub)
- Server error display

**Form Submission:**
```typescript
const onSubmit = async (values: LoginFormValues) => {
  await auth.login(values.email, values.password, values.remember)
  navigate("/")  // Redirect to dashboard
}
```

### 4. Auth API Helper (`src/lib/api/auth.ts`)

Low-level API functions:

```typescript
import { loginUser, logoutUser } from "@/lib/api/auth"

const response = await loginUser("admin@flcn-lms.com", "admin123456", false)
await logoutUser()
```

### 5. User Types (`packages/types/src/auth.ts`)

Updated User interface matching the API response:

```typescript
export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: Role
  permissions: UserPermissions
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

## API Endpoint

The login query calls the following backend endpoint:

```
POST /api/v1/auth/admin/login
Content-Type: application/json

Request Body:
{
  "email": "admin@flcn-lms.com",
  "password": "admin123456",
  "remember": false
}

Response Body:
{
  "user": { ... User object ... },
  "token": "JWT_TOKEN_HERE"
}
```

## Authentication Flow

1. User enters email and password in login form
2. Form validates email format and required fields
3. On submit, `auth.login()` is called with credentials
4. Login mutation POSTs to `/api/v1/auth/admin/login`
5. If successful:
   - Response contains user object and JWT token
   - Token is stored in secure HTTP-only cookie
   - Session is validated (if enabled)
   - User is redirected to dashboard home (`/`)
   - CASL ability is initialized with user permissions
6. If failed:
   - Server error message is displayed
   - Cookie is not set
   - User remains on login page

## Cookie Management

Authentication uses `js-cookie` library:

- **Cookie Name:** `AUTH_COOKIE_NAME` (from constants)
- **Value:** JWT token from login response
- **Secure:** Only sent over HTTPS in production
- **SameSite:** Lax (CSRF protection)
- **HttpOnly:** (should be set by backend if possible)
- **Expires:** 
  - 30 days if `remember: true`
  - Session end if `remember: false`

## Session Management

The auth context automatically:

- Fetches user session from `/api/v1/auth/admin/session` on mount
- Revalidates session every 5 minutes when authenticated
- Refetches on reconnect
- Refetches on window focus
- Initializes CASL permissions from user role and permissions array

## Permission System

Permissions are resolved through:

1. **Default permissions by role**: Fixed permissions based on user role
2. **Custom permissions**: Server-provided permission overrides
3. **CASL Ability**: Permission checking throughout the app

Permission tokens follow the format: `action:subject`
- Actions: manage, read, create, update, delete, publish, approve, enroll
- Subjects: Dashboard, Question, Course, Student, Tenant, etc.

## Testing with Default Credentials

```
Email: admin@flcn-lms.com
Password: admin123456
Remember: false

Expected Response:
- User Role: super_admin
- Tenant ID: 1455c765-d0bb-4bb0-9f1e-662f50fff4db
- Permissions: [] (inherited from super_admin role)
```

## Type Exports

Export types for use in other parts of the app:

```typescript
import { 
  type LoginVariables, 
  type LoginResponse,
  type User,
  type Role,
  type UserPermissions,
} from "@flcn-lms/types/auth"
```

## AUTH_DISABLED Flag

For development, you can disable authentication by setting `AUTH_DISABLED` to `true` in your constants. This will:

- Use mock user data (super_admin role)
- Skip all API calls
- Bypass token validation

## Error Handling

Common login errors:

```typescript
try {
  await auth.login(email, password, remember)
} catch (error) {
  if (error.response?.status === 401) {
    // Invalid credentials
  } else if (error.response?.status === 403) {
    // Account inactive or forbidden
  } else {
    // Network or server error
  }
}
```

## Related Files Modified

- `packages/types/src/auth.ts` - Updated User interface
- `apps/dashboard/src/queries/auth/login.ts` - Login mutation hook
- `apps/dashboard/src/queries/auth/index.ts` - Type exports
- `apps/dashboard/src/contexts/auth.tsx` - Auth context provider
- `apps/dashboard/src/pages/auth/login.tsx` - Login form component
- `apps/dashboard/src/lib/api/auth.ts` - Legacy API helper