# Auth Decorator (HOF) - Usage Examples

This document provides comprehensive examples of using the `Decorators` HOF (Higher-Order Function) pattern for cleaner, more maintainable route definitions in the lms-gin backend.

## Overview

The decorator pattern allows you to wrap handlers with authentication, authorization, and other middleware in a composable, readable way.

**Benefits:**
- ✅ Cleaner, more readable router code
- ✅ Consistent middleware application
- ✅ Type-safe role checking
- ✅ Reusable decorator combinations
- ✅ Easier to maintain and refactor

---

## Basic Setup

```go
package router

import (
	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"github.com/gin-gonic/gin"
)

// Initialize decorators with JWT secret
auth := decorators.New(jwtSecret)
```

---

## Example 1: Course Routes with Decorators

### Before (Current Approach)
```go
func InitCourseRoutes(v1 *gin.RouterGroup, courseHandler *handlers.CourseHandler, jwtSecret string) {
	// Public routes
	publicCourses := v1.Group("/courses")
	{
		publicCourses.GET("/search", courseHandler.SearchCourses)
		publicCourses.GET("/published", courseHandler.ListPublishedCourses)
		publicCourses.GET("/slug/:slug", courseHandler.GetCourseBySlug)
	}

	// Protected routes
	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware(jwtSecret))

	courses := protected.Group("/courses")
	{
		courses.GET("", courseHandler.ListCourses)
		courses.POST("", middleware.RoleAuthMiddleware("admin", "faculty"), courseHandler.CreateCourse)
		courses.GET("/:id", courseHandler.GetCourse)
		courses.PATCH("/:id", middleware.RoleAuthMiddleware("admin", "faculty"), courseHandler.UpdateCourse)
		courses.DELETE("/:id", middleware.RoleAuthMiddleware("admin", "faculty"), courseHandler.DeleteCourse)
	}
}
```

### After (With Decorators)
```go
func InitCourseRoutes(v1 *gin.RouterGroup, courseHandler *handlers.CourseHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	// Public routes
	publicCourses := v1.Group("/courses")
	{
		publicCourses.GET("/search", auth.Public(courseHandler.SearchCourses))
		publicCourses.GET("/published", auth.Public(courseHandler.ListPublishedCourses))
		publicCourses.GET("/slug/:slug", auth.Public(courseHandler.GetCourseBySlug))
	}

	// Protected routes
	courses := v1.Group("/courses")
	{
		courses.GET("", auth.Auth(courseHandler.ListCourses))
		courses.POST("", auth.FacultyOrAdmin(courseHandler.CreateCourse))
		courses.GET("/:id", auth.Auth(courseHandler.GetCourse))
		courses.PATCH("/:id", auth.FacultyOrAdmin(courseHandler.UpdateCourse))
		courses.DELETE("/:id", auth.FacultyOrAdmin(courseHandler.DeleteCourse))
	}
}
```

---

## Example 2: Test Series Routes

```go
func InitTestSeriesRoutes(v1 *gin.RouterGroup, testSeriesHandler *handlers.TestSeriesHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	// Public routes
	publicTests := v1.Group("/test-series")
	{
		publicTests.GET("/search", auth.Public(testSeriesHandler.SearchTestSeries))
		publicTests.GET("/published", auth.Public(testSeriesHandler.ListPublishedTestSeries))
		publicTests.GET("/slug/:slug", auth.Public(testSeriesHandler.GetTestSeriesBySlug))
	}

	// Protected routes
	tests := v1.Group("/test-series")
	{
		tests.GET("", auth.Auth(testSeriesHandler.ListTestSeries))
		tests.POST("", auth.FacultyOrAdmin(testSeriesHandler.CreateTestSeries))
		tests.GET("/:id", auth.Auth(testSeriesHandler.GetTestSeries))
		tests.PATCH("/:id", auth.FacultyOrAdmin(testSeriesHandler.UpdateTestSeries))
		tests.DELETE("/:id", auth.FacultyOrAdmin(testSeriesHandler.DeleteTestSeries))
		tests.GET("/:id/questions", auth.Auth(testSeriesHandler.GetQuestions))
	}
}
```

---

## Example 3: Enrollment Routes (Mixed Roles)

```go
func InitEnrollmentRoutes(v1 *gin.RouterGroup, enrollmentHandler *handlers.EnrollmentHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	enrollments := v1.Group("/enrollments")
	{
		// Student operations - any authenticated user
		enrollments.GET("", auth.Auth(enrollmentHandler.ListEnrollments))
		enrollments.POST("/enroll", auth.Auth(enrollmentHandler.EnrollStudent))
		enrollments.DELETE("/:course_id", auth.Auth(enrollmentHandler.Unenroll))
		enrollments.PATCH("/:id/progress", auth.Auth(enrollmentHandler.UpdateProgress))
		enrollments.POST("/:id/complete", auth.Auth(enrollmentHandler.CompleteEnrollment))

		// Faculty/Admin operations
		enrollments.GET("/course/:course_id", auth.FacultyOrAdmin(enrollmentHandler.GetAdminEnrollments))
		enrollments.GET("/course/:course_id/stats", auth.FacultyOrAdmin(enrollmentHandler.GetEnrollmentStats))
	}
}
```

---

## Example 4: User Management Routes (Admin Only)

```go
func InitUserRoutes(v1 *gin.RouterGroup, userHandler *handlers.UserHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	users := v1.Group("/users")
	{
		users.GET("", auth.Admin(userHandler.ListUsers))
		users.POST("", auth.Admin(userHandler.CreateUser))
		users.GET("/search", auth.Admin(userHandler.SearchUsers))
		users.POST("/bulk-import", auth.Admin(userHandler.BulkImport))
		users.GET("/:id", auth.Admin(userHandler.GetUser))
		users.PATCH("/:id", auth.Admin(userHandler.UpdateUser))
		users.DELETE("/:id", auth.Admin(userHandler.DeleteUser))
	}
}
```

---

## Example 5: Authentication Routes

```go
func InitAuthRoutes(v1 *gin.RouterGroup, authHandler *handlers.AuthHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	authGroup := v1.Group("/auth")
	{
		// Public endpoints
		authGroup.POST("/register", auth.Public(authHandler.Register))
		authGroup.POST("/login", auth.Public(authHandler.Login))
		authGroup.POST("/refresh", auth.Public(authHandler.RefreshToken))

		// Protected endpoints
		authGroup.POST("/logout", auth.Auth(authHandler.Logout))
		authGroup.GET("/validate", auth.Auth(authHandler.ValidateToken))
		authGroup.GET("/me", auth.Auth(authHandler.Me))
		authGroup.PATCH("/profile", auth.Auth(authHandler.UpdateProfile))
		authGroup.POST("/change-password", auth.Auth(authHandler.ChangePassword))
	}
}
```

---

## Example 6: Complex Role Requirements

### Multiple Specific Roles
```go
// Allow faculty, admin, or instructors
courses.POST("", auth.Multiple(courseHandler.CreateCourse, "faculty", "admin", "instructor"))
```

### Using Auth with Inline Roles
```go
// Directly specify roles in Auth call
courses.POST("", auth.Auth(courseHandler.CreateCourse, "admin", "faculty", "instructor"))
```

---

## Example 7: Optional Authentication

For endpoints that work both with and without authentication:

```go
func InitCourseRoutes(v1 *gin.RouterGroup, courseHandler *handlers.CourseHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	courses := v1.Group("/courses")
	{
		// Public courses - shows recommendations based on auth if available
		courses.GET("/featured", auth.OptionalAuth(courseHandler.GetFeaturedCourses))
		
		// Anonymous users see general catalog, authenticated users see personalized
		courses.GET("/", auth.OptionalAuth(courseHandler.ListCourses))
	}
}
```

---

## Example 8: Leaderboard Routes (Multiple Access Levels)

```go
func InitLeaderboardRoutes(v1 *gin.RouterGroup, leaderboardHandler *handlers.LeaderboardHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	leaderboard := v1.Group("/leaderboard")
	{
		// Any authenticated user can view leaderboards
		leaderboard.GET("", auth.Auth(leaderboardHandler.GetGlobalLeaderboard))
		leaderboard.GET("/course/:id", auth.Auth(leaderboardHandler.GetCourseLeaderboard))
		leaderboard.GET("/test/:id", auth.Auth(leaderboardHandler.GetTestLeaderboard))
	}
}
```

---

## Example 9: Live Session Routes

```go
func InitLiveSessionRoutes(v1 *gin.RouterGroup, liveSessionHandler *handlers.LiveSessionHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	sessions := v1.Group("/live-sessions")
	{
		// Any authenticated user can list and join
		sessions.GET("", auth.Auth(liveSessionHandler.ListSessions))
		sessions.POST("/:id/join", auth.Auth(liveSessionHandler.JoinSession))
		sessions.GET("/:id/token", auth.Auth(liveSessionHandler.GetToken))
		sessions.GET("/:id", auth.Auth(liveSessionHandler.GetSession))

		// Faculty/Admin only
		sessions.POST("", auth.Faculty(liveSessionHandler.CreateSession))
		sessions.PATCH("/:id", auth.Faculty(liveSessionHandler.UpdateSession))
		sessions.DELETE("/:id", auth.Faculty(liveSessionHandler.CancelSession))
	}
}
```

---

## Example 10: Attempts Routes

```go
func InitAttemptRoutes(v1 *gin.RouterGroup, attemptHandler *handlers.AttemptHandler, jwtSecret string) {
	auth := decorators.New(jwtSecret)

	attempts := v1.Group("/attempts")
	{
		// Student operations - any authenticated user
		attempts.GET("", auth.Auth(attemptHandler.ListAttempts))
		attempts.POST("/start", auth.Auth(attemptHandler.StartAttempt))
		attempts.POST("/submit", auth.Auth(attemptHandler.SubmitAttempt))
		attempts.GET("/:id", auth.Auth(attemptHandler.GetAttempt))
		attempts.GET("/:id/results", auth.Auth(attemptHandler.GetResults))
		attempts.GET("/:id/score", auth.Auth(attemptHandler.GetScore))
		attempts.GET("/history/:test_series_id", auth.Auth(attemptHandler.GetUserHistory))

		// Faculty/Admin only
		attempts.GET("/test/:test_series_id", auth.FacultyOrAdmin(attemptHandler.ListTestAttempts))
		attempts.POST("/:id/evaluate", auth.Admin(attemptHandler.EvaluateAttempt))
	}
}
```

---

## Example 11: Chaining Decorators

For advanced use cases where you need multiple decorators:

```go
auth := decorators.New(jwtSecret)

// Method 1: Manual stacking
courses.POST("",
	auth.Chain(
		courseHandler.CreateCourse,
		func(h gin.HandlerFunc) gin.HandlerFunc { return auth.FacultyOrAdmin(h) },
		func(h gin.HandlerFunc) gin.HandlerFunc { return auth.Logging(h, "CreateCourse") },
	),
)

// Method 2: Direct composition (simpler)
courses.POST("",
	auth.Logging(
		auth.FacultyOrAdmin(courseHandler.CreateCourse),
		"CreateCourse",
	),
)
```

---

## Example 12: Caching Public Endpoints

```go
auth := decorators.New(jwtSecret)

courses := v1.Group("/courses")
{
	// Cache published courses list (1 hour TTL)
	courses.GET("/published", auth.CacheablePublic(courseHandler.ListPublishedCourses))
	
	// Cache course search results
	courses.GET("/search", auth.CacheablePublic(courseHandler.SearchCourses))
}
```

---

## Decorator Quick Reference

| Decorator | Usage | Auth Required | Role Check |
|-----------|-------|---------------|-----------|
| `Public()` | `auth.Public(handler)` | ❌ No | ❌ No |
| `Auth()` | `auth.Auth(handler)` | ✅ Yes | ❌ No |
| `Auth()` | `auth.Auth(handler, "admin")` | ✅ Yes | ✅ Yes |
| `Admin()` | `auth.Admin(handler)` | ✅ Yes | ✅ Admin only |
| `Faculty()` | `auth.Faculty(handler)` | ✅ Yes | ✅ Faculty only |
| `Student()` | `auth.Student(handler)` | ✅ Yes | ✅ Student only |
| `FacultyOrAdmin()` | `auth.FacultyOrAdmin(handler)` | ✅ Yes | ✅ Faculty or Admin |
| `Multiple()` | `auth.Multiple(handler, roles...)` | ✅ Yes | ✅ Custom roles |
| `OptionalAuth()` | `auth.OptionalAuth(handler)` | ⚠️ Optional | ⚠️ Optional |
| `CacheablePublic()` | `auth.CacheablePublic(handler)` | ❌ No | ❌ No |
| `Logging()` | `auth.Logging(handler, name)` | - | - |
| `Chain()` | `auth.Chain(handler, decs...)` | - | - |

---

## Pattern Advantages

### 1. Readability
```go
// Clear intent in one line
courses.POST("", auth.FacultyOrAdmin(courseHandler.CreateCourse))

// vs complex middleware setup
courses.POST("",
	middleware.AuthMiddleware(jwtSecret),
	middleware.RoleAuthMiddleware("admin", "faculty"),
	courseHandler.CreateCourse,
)
```

### 2. Consistency
```go
// All admin routes follow same pattern
users.GET("", auth.Admin(userHandler.ListUsers))
users.POST("", auth.Admin(userHandler.CreateUser))
users.GET("/search", auth.Admin(userHandler.SearchUsers))
```

### 3. Reusability
```go
// Shorthand for common patterns
auth.Admin(handler)        // vs auth.Auth(handler, "admin")
auth.FacultyOrAdmin(handler) // vs auth.Auth(handler, "faculty", "admin")
```

### 4. Maintainability
```go
// Easy to change requirements
// Before: courses.POST("", auth.Faculty(handler))
// After: courses.POST("", auth.FacultyOrAdmin(handler))
// (Single line change vs modifying middleware)
```

---

## Migration Path

When converting existing routes to use decorators:

1. Create `Decorators` instance: `auth := decorators.New(jwtSecret)`
2. Replace middleware groups with decorator calls
3. Test all routes to ensure same behavior
4. Remove old middleware from protected groups

---

## Performance Considerations

- **No performance penalty**: Decorators are just function wrappers
- **Lazy evaluation**: Middleware only runs when route is called
- **Composable**: Stack multiple decorators without overhead
- **Token validation**: Still happens once per request (same as before)

---

## Error Handling

All decorators follow consistent error responses:

```json
// Missing auth header
{
  "success": false,
  "error": "Missing authorization header",
  "status": 401
}

// Invalid/expired token
{
  "success": false,
  "error": "Invalid or expired token",
  "status": 401
}

// Insufficient permissions
{
  "success": false,
  "error": "Only users with roles [admin, faculty] can access this endpoint",
  "status": 403
}
```

---

## Best Practices

1. **Use specific shortcuts** when possible
   ```go
   // Good
   auth.Admin(handler)
   auth.Faculty(handler)
   
   // Less clear
   auth.Auth(handler, "admin")
   ```

2. **Group related routes**
   ```go
   // Good
   adminRoutes := v1.Group("/admin")
   {
       adminRoutes.GET("/users", auth.Admin(userHandler.ListUsers))
       adminRoutes.GET("/courses", auth.Admin(courseHandler.ListAllCourses))
   }
   ```

3. **Document required roles in code**
   ```go
   // Clear what permissions are needed
   courses.POST("", auth.FacultyOrAdmin(courseHandler.CreateCourse)) // Create course
   ```

4. **Test role combinations**
   ```go
   // Test that admin can access faculty endpoint
   // Test that student cannot
   // Test that faculty can access faculty endpoint
   ```

---

## See Also

- `internal/api/decorators/auth_decorator.go` - Implementation
- `internal/api/middleware/auth.go` - Core auth logic
- `internal/utils/jwt.go` - JWT validation
