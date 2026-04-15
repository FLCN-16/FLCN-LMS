package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitLiveSessionRoutes initializes all live session routes with permission checks
func InitLiveSessionRoutes(
	v1 *gin.RouterGroup,
	liveSessionHandler *handlers.LiveSessionHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing live session routes")

	sessions := v1.Group("/live-sessions")
	{
		// ================================================
		// FACULTY/ADMIN ROUTES (management & administration)
		// ================================================

		// List live sessions
		sessions.GET(
			"",
			permDecorator.Required(liveSessionHandler.ListSessions, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Create live session
		sessions.POST(
			"",
			permDecorator.Required(liveSessionHandler.CreateSession, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Get specific live session
		sessions.GET(
			"/:id",
			permDecorator.Required(liveSessionHandler.GetSession, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Update live session
		sessions.PATCH(
			"/:id",
			permDecorator.Required(liveSessionHandler.UpdateSession, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Cancel live session
		sessions.DELETE(
			"/:id",
			permDecorator.Required(liveSessionHandler.CancelSession, []rbac.Permission{rbac.CourseUpdate}),
		)

		// ================================================
		// STUDENT ROUTES (participation only)
		// ================================================

		// Join live session
		sessions.POST(
			"/:id/join",
			permDecorator.Required(liveSessionHandler.JoinSession, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get session token
		sessions.GET(
			"/:id/token",
			permDecorator.Required(liveSessionHandler.GetToken, []rbac.Permission{rbac.EnrollmentRead}),
		)
	}

	log.Println("✓ Live session routes initialized successfully")
}
