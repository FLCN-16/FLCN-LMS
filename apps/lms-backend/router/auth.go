package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"

	"github.com/gin-gonic/gin"
)

// InitAuthRoutes initializes all authentication-related routes
// Handles both public authentication endpoints (register, login, refresh)
// and protected user profile endpoints (logout, me, update profile, change password)
// Also includes admin-only impersonation for testing and support
//
// Parameters:
//   - v1: API v1 route group from main router
//   - authHandler: Handler for auth business logic
//   - jwtSecret: Secret key for JWT validation
func InitAuthRoutes(v1 *gin.RouterGroup, authHandler *handlers.AuthHandler, jwtSecret string) {
	log.Println("Initializing authentication routes")

	auth := decorators.New(jwtSecret)

	authGroup := v1.Group("/auth")
	{
		// ================================================
		// PUBLIC ROUTES (no authentication required)
		// ================================================

		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/refresh", authHandler.RefreshToken)

		// ================================================
		// PROTECTED ROUTES (authentication required)
		// ================================================

		authGroup.POST("/logout", auth.Auth(authHandler.Logout))
		authGroup.GET("/validate", auth.Auth(authHandler.ValidateToken))
		authGroup.GET("/me", auth.Auth(authHandler.Me))
		authGroup.PATCH("/profile", auth.Auth(authHandler.UpdateProfile))
		authGroup.POST("/change-password", auth.Auth(authHandler.ChangePassword))

		// ================================================
		// ADMIN ONLY ROUTES (impersonation for testing/support)
		// ================================================

		authGroup.POST("/impersonate", auth.Impersonate(authHandler.ImpersonateStudent))
	}

	log.Println("✓ Authentication routes initialized successfully")
}
