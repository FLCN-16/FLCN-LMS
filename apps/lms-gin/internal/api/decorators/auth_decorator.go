package decorators

import (
	"fmt"
	"log"
	"strings"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/utils"

	"github.com/gin-gonic/gin"
)

// Decorators provides middleware decorators for route handlers
// It wraps handlers with authentication, authorization, and other middleware
type Decorators struct {
	jwtSecret string
}

// New creates a new Decorators instance with JWT secret
//
// Parameters:
//   - jwtSecret: Secret key for JWT validation
//
// Returns:
//   - *Decorators: New decorator instance
//
// Usage:
//
//	auth := decorators.New(jwtSecret)
//	courses.POST("", auth.Auth(courseHandler.CreateCourse, "admin", "faculty"))
func New(jwtSecret string) *Decorators {
	return &Decorators{
		jwtSecret: jwtSecret,
	}
}

// Public marks a handler as publicly accessible (no authentication required)
// This is mainly for documentation clarity in router definitions
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler
//
// Usage:
//
//	courses.GET("/published", auth.Public(courseHandler.ListPublishedCourses))
//	courses.GET("/search", auth.Public(courseHandler.SearchCourses))
func (d *Decorators) Public(handler gin.HandlerFunc) gin.HandlerFunc {
	return handler
}

// Auth wraps a handler with JWT authentication and optional role authorization
// If no roles are provided, any authenticated user can access
// If roles are provided, user must have one of the specified roles
//
// Parameters:
//   - handler: Gin handler function
//   - allowedRoles: Variable number of role strings (e.g., "admin", "faculty", "student")
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with auth middleware
//
// Usage (authentication only):
//
//	courses.GET("", auth.Auth(courseHandler.ListCourses))
//
// Usage (with role check):
//
//	courses.POST("", auth.Auth(courseHandler.CreateCourse, "admin", "faculty"))
//	enrollments.POST("/enroll", auth.Auth(enrollmentHandler.EnrollStudent, "student"))
func (d *Decorators) Auth(handler gin.HandlerFunc, allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Missing authorization header")
			return
		}

		// Parse "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Invalid authorization header format")
			return
		}

		token := parts[1]

		// Create JWT manager and validate token
		jwtManager := utils.NewJWTManager(d.jwtSecret, 0, 0)
		claims, err := jwtManager.ValidateToken(token)
		if err != nil {
			log.Printf("[Auth Decorator] Token validation failed: %v", err)
			response.Unauthorized(c, "Invalid or expired token")
			return
		}

		// Set user info in context for handler use
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)

		// Check role authorization if roles are specified
		if len(allowedRoles) > 0 {
			authorized := false
			for _, allowedRole := range allowedRoles {
				if claims.Role == allowedRole {
					authorized = true
					break
				}
			}

			if !authorized {
				log.Printf("[Auth Decorator] User %s with role %s not authorized. Required roles: %v",
					claims.UserID, claims.Role, allowedRoles)
				response.Forbidden(c, fmt.Sprintf("Only users with roles %v can access this endpoint", allowedRoles))
				return
			}
		}

		// Call the actual handler
		handler(c)
	}
}

// Admin is shorthand for Auth with admin role requirement
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring admin role
//
// Usage:
//
//	users.GET("", auth.Admin(userHandler.ListUsers))
//	users.GET("/search", auth.Admin(userHandler.SearchUsers))
func (d *Decorators) Admin(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "admin")
}

// Faculty is shorthand for Auth with faculty role requirement
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring faculty role
//
// Usage:
//
//	courses.POST("", auth.Faculty(courseHandler.CreateCourse))
//	tests.POST("", auth.Faculty(testSeriesHandler.CreateTestSeries))
func (d *Decorators) Faculty(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "faculty")
}

// Student is shorthand for Auth with student role requirement
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring student role
//
// Usage:
//
//	enrollments.POST("/enroll", auth.Student(enrollmentHandler.EnrollStudent))
func (d *Decorators) Student(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "student")
}

// FacultyOrAdmin is shorthand for Auth accepting either faculty or admin roles
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler accepting faculty or admin
//
// Usage:
//
//	courses.POST("", auth.FacultyOrAdmin(courseHandler.CreateCourse))
//	courses.PATCH("/:id", auth.FacultyOrAdmin(courseHandler.UpdateCourse))
func (d *Decorators) FacultyOrAdmin(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "faculty", "admin")
}

// Support is shorthand for Auth with support role requirement
// Support staff can view analytics, customer data, and manage support tickets
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring support role
//
// Usage:
//
//	support.GET("/tickets", auth.Support(supportHandler.ListTickets))
//	support.GET("/users/:id", auth.Support(supportHandler.GetUserInfo))
func (d *Decorators) Support(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "support")
}

// Marketing is shorthand for Auth with marketing role requirement
// Marketing team can view analytics, manage campaigns, and access user insights
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring marketing role
//
// Usage:
//
//	marketing.GET("/analytics", auth.Marketing(marketingHandler.GetAnalytics))
//	marketing.GET("/campaigns", auth.Marketing(marketingHandler.ListCampaigns))
func (d *Decorators) Marketing(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "marketing")
}

// Management is shorthand for Auth with management role requirement
// Management can access reports, analytics, and make strategic decisions
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler requiring management role
//
// Usage:
//
//	management.GET("/reports", auth.Management(managementHandler.GetReports))
//	management.GET("/dashboard", auth.Management(managementHandler.GetDashboard))
func (d *Decorators) Management(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "management")
}

// StaffOrAdmin is shorthand for Auth accepting staff roles (support, marketing, management) and admin
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler accepting staff roles
//
// Usage:
//
//	analytics.GET("", auth.StaffOrAdmin(analyticsHandler.GetAnalytics))
func (d *Decorators) StaffOrAdmin(handler gin.HandlerFunc) gin.HandlerFunc {
	return d.Auth(handler, "support", "marketing", "management", "admin")
}

// AdminOrStudent combines multiple roles for more complex permission structures
//
// Parameters:
//   - handler: Gin handler function
//   - roles: Role strings to allow
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with specified roles
//
// Usage:
//
//	leaderboard.GET("", auth.Multiple(leaderboardHandler.GetLeaderboard, "student", "faculty", "admin"))
func (d *Decorators) Multiple(handler gin.HandlerFunc, roles ...string) gin.HandlerFunc {
	return d.Auth(handler, roles...)
}

// OptionalAuth wraps a handler that works with or without authentication
// If a valid token is provided, user context is set
// If no token or invalid token, handler still executes (useful for personalized but public endpoints)
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with optional auth
//
// Usage:
//
//	courses.GET("/featured", auth.OptionalAuth(courseHandler.GetFeaturedCourses))
func (d *Decorators) OptionalAuth(handler gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try to extract and validate token
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				token := parts[1]
				jwtManager := utils.NewJWTManager(d.jwtSecret, 0, 0)
				if claims, err := jwtManager.ValidateToken(token); err == nil {
					// Valid token, set user info in context
					c.Set("userID", claims.UserID)
					c.Set("userRole", claims.Role)
				}
			}
		}

		// Call handler with or without auth context
		handler(c)
	}
}

// CacheablePublic wraps a public handler with cache-control headers
// Useful for endpoints that return consistent data that can be cached
//
// Parameters:
//   - handler: Gin handler function
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with cache headers
//
// Usage:
//
//	courses.GET("/published", auth.CacheablePublic(courseHandler.ListPublishedCourses))
func (d *Decorators) CacheablePublic(handler gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Add cache headers for public endpoints (1 hour)
		c.Header("Cache-Control", "public, max-age=3600")
		handler(c)
	}
}

// LoggingDecorator adds request logging to handlers
//
// Parameters:
//   - handler: Gin handler function
//   - name: Name of the endpoint for logging
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with logging
//
// Usage:
//
//	courses.POST("", auth.Logging(courseHandler.CreateCourse, "CreateCourse"))
func (d *Decorators) Logging(handler gin.HandlerFunc, name string) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("[%s] %s %s", name, c.Request.Method, c.Request.URL.Path)
		handler(c)
	}
}

// Chain combines multiple decorators into a single wrapper
//
// Parameters:
//   - handler: Gin handler function
//   - decorators: Variable number of decorator functions
//
// Returns:
//   - gin.HandlerFunc: Handler with all decorators applied
//
// Usage:
//
//	courses.POST("",
//	  auth.Chain(courseHandler.CreateCourse,
//	    auth.Logging(nil, "CreateCourse"),
//	    auth.Auth(nil, "faculty", "admin"),
//	  ),
//	)
func (d *Decorators) Chain(handler gin.HandlerFunc, decorators ...func(gin.HandlerFunc) gin.HandlerFunc) gin.HandlerFunc {
	for i := len(decorators) - 1; i >= 0; i-- {
		handler = decorators[i](handler)
	}
	return handler
}

// Impersonate allows admin users to impersonate a student for testing purposes
// Only admin users can use this decorator
// The handler will receive:
//   - adminID: The original admin's user ID
//   - adminRole: The original admin's role
//   - userID: The impersonated student's user ID (set by handler)
//   - userRole: Will be "student" for impersonation
//
// Parameters:
//   - handler: Gin handler function that will handle the impersonation
//
// Returns:
//   - gin.HandlerFunc: Wrapped handler with admin validation
//
// Usage:
//
//	auth.POST("/impersonate", auth.Impersonate(authHandler.ImpersonateStudent))
//
// Handler should extract student_id from request body/params:
//
//	studentID := c.Param("student_id") // or from request body
//	c.Set("userID", studentID)
//	c.Set("userRole", "student")
func (d *Decorators) Impersonate(handler gin.HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Missing authorization header")
			return
		}

		// Parse "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Invalid authorization header format")
			return
		}

		token := parts[1]

		// Create JWT manager and validate token
		jwtManager := utils.NewJWTManager(d.jwtSecret, 0, 0)
		claims, err := jwtManager.ValidateToken(token)
		if err != nil {
			log.Printf("[Impersonate Decorator] Token validation failed: %v", err)
			response.Unauthorized(c, "Invalid or expired token")
			return
		}

		// Only admins can impersonate
		if claims.Role != "admin" {
			log.Printf("[Impersonate Decorator] User %s with role %s attempted impersonation. Admin role required.",
				claims.UserID, claims.Role)
			response.Forbidden(c, "Only admins can impersonate students. Admin role is required.")
			return
		}

		// Set admin's original info in context (for audit logging)
		c.Set("adminID", claims.UserID)
		c.Set("adminRole", claims.Role)

		// Handler will extract student_id and set impersonated context
		handler(c)
	}
}
