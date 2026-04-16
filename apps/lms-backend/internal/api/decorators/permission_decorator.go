package decorators

import (
	"log"
	"reflect"

	"flcn_lms_backend/internal/api/middleware"
	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/rbac"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
)

// PermissionDecorator handles permission-based access control
// Provides two methods: Required (AND logic) and Any (OR logic)
type PermissionDecorator struct {
	permissionService *service.PermissionService
	jwtSecret         string
}

// NewPermissionDecorator creates a new permission decorator instance
// Parameters:
//   - permissionService: Service for permission checks
//   - jwtSecret: JWT secret for token validation
//
// Returns:
//   - *PermissionDecorator: New permission decorator instance
func NewPermissionDecorator(permissionService *service.PermissionService, jwtSecret string) *PermissionDecorator {
	return &PermissionDecorator{
		permissionService: permissionService,
		jwtSecret:         jwtSecret,
	}
}

// getHandlerName extracts the handler method name for logging
func getHandlerName(handler gin.HandlerFunc) string {
	name := reflect.ValueOf(handler).String()
	return name
}

// Required wraps a handler and checks if user has ALL required permissions (AND logic)
// All permissions in the slice must be present for access to be granted
//
// Parameters:
//   - handler: The gin handler function to wrap
//   - permissions: Slice of required permissions - user must have ALL of them
//
// Returns:
//   - gin.HandlerFunc: The wrapped handler with permission checks
//
// Example:
//
//	courses.PATCH(
//	    "/:id",
//	    permDecorator.Required(courseHandler.UpdateCourse, []rbac.Permission{rbac.CourseUpdate}),
//	)
//
// Example with multiple permissions:
//
//	users.DELETE(
//	    "/:id",
//	    permDecorator.Required(userHandler.DeleteUser, []rbac.Permission{rbac.AdminAccess, rbac.UserDelete}),
//	)
func (pd *PermissionDecorator) Required(handler gin.HandlerFunc, permissions []rbac.Permission) gin.HandlerFunc {
	handlerName := getHandlerName(handler)

	return func(c *gin.Context) {
		method := c.Request.Method
		path := c.Request.URL.Path

		// Step 1: Verify JWT authentication
		userID, err := middleware.GetUserID(c)
		if err != nil {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - User not authenticated",
				method, path, handlerName)
			response.Unauthorized(c, "Authentication required")
			c.Abort()
			return
		}

		// Step 2: Get user role from context
		role, exists := c.Get("role")
		if !exists {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - Role not found for user %s",
				method, path, handlerName, userID)
			response.Forbidden(c, "Unable to verify user role")
			c.Abort()
			return
		}

		// Step 3: Type assertion for role string
		roleStr, ok := role.(string)
		if !ok {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - Invalid role format for user %s",
				method, path, handlerName, userID)
			response.Forbidden(c, "Invalid role format")
			c.Abort()
			return
		}

		// Step 4: Check if user has ALL required permissions
		if !pd.permissionService.HasAllPermissions(roleStr, permissions...) {
			permNames := make([]string, len(permissions))
			for i, p := range permissions {
				permNames[i] = string(p)
			}
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - User %s (role: %s) missing required permissions: %v",
				method, path, handlerName, userID, roleStr, permNames)
			response.Forbidden(c, "You do not have permission to perform this action")
			c.Abort()
			return
		}

		// Step 5: Access granted - log and continue
		log.Printf("[Permission Decorator] ALLOWED: %s %s (%s) - User %s (role: %s)",
			method, path, handlerName, userID, roleStr)
		handler(c)
	}
}

// Any wraps a handler and checks if user has ANY of the required permissions (OR logic)
// At least one permission from the slice must be present for access to be granted
//
// Parameters:
//   - handler: The gin handler function to wrap
//   - permissions: Slice of acceptable permissions - user must have AT LEAST ONE
//
// Returns:
//   - gin.HandlerFunc: The wrapped handler with permission checks
//
// Example with one permission option:
//
//	courses.GET(
//	    "/:id",
//	    permDecorator.Any(courseHandler.GetCourse, []rbac.Permission{rbac.CourseRead}),
//	)
//
// Example with multiple permission options:
//
//	users.GET(
//	    "/:userId",
//	    permDecorator.Any(userHandler.GetUser, []rbac.Permission{rbac.AdminAccess, rbac.UserRead}),
//	)
//	// User needs either admin:access OR users:read
func (pd *PermissionDecorator) Any(handler gin.HandlerFunc, permissions []rbac.Permission) gin.HandlerFunc {
	handlerName := getHandlerName(handler)

	return func(c *gin.Context) {
		method := c.Request.Method
		path := c.Request.URL.Path

		// Step 1: Verify JWT authentication
		userID, err := middleware.GetUserID(c)
		if err != nil {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - User not authenticated",
				method, path, handlerName)
			response.Unauthorized(c, "Authentication required")
			c.Abort()
			return
		}

		// Step 2: Get user role from context
		role, exists := c.Get("role")
		if !exists {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - Role not found for user %s",
				method, path, handlerName, userID)
			response.Forbidden(c, "Unable to verify user role")
			c.Abort()
			return
		}

		// Step 3: Type assertion for role string
		roleStr, ok := role.(string)
		if !ok {
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - Invalid role format for user %s",
				method, path, handlerName, userID)
			response.Forbidden(c, "Invalid role format")
			c.Abort()
			return
		}

		// Step 4: Check if user has ANY of the required permissions
		if !pd.permissionService.HasAnyPermission(roleStr, permissions...) {
			permNames := make([]string, len(permissions))
			for i, p := range permissions {
				permNames[i] = string(p)
			}
			log.Printf("[Permission Decorator] DENIED: %s %s (%s) - User %s (role: %s) missing any required permission: %v",
				method, path, handlerName, userID, roleStr, permNames)
			response.Forbidden(c, "You do not have permission to perform this action")
			c.Abort()
			return
		}

		// Step 5: Access granted - log and continue
		log.Printf("[Permission Decorator] ALLOWED: %s %s (%s) - User %s (role: %s)",
			method, path, handlerName, userID, roleStr)
		handler(c)
	}
}
