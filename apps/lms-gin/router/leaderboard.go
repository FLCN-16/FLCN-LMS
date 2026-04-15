package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitLeaderboardRoutes initializes all leaderboard-related routes with permission checks
func InitLeaderboardRoutes(
	v1 *gin.RouterGroup,
	leaderboardHandler *handlers.LeaderboardHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing leaderboard routes")

	leaderboard := v1.Group("/leaderboard")
	{
		// ================================================
		// LEADERBOARD ROUTES
		// ================================================

		// Get global leaderboard
		leaderboard.GET(
			"",
			permDecorator.Required(leaderboardHandler.GetGlobalLeaderboard, []rbac.Permission{rbac.LeaderboardView}),
		)

		// Get course-specific leaderboard
		leaderboard.GET(
			"/course/:id",
			permDecorator.Required(leaderboardHandler.GetCourseLeaderboard, []rbac.Permission{rbac.LeaderboardView}),
		)

		// Get test-specific leaderboard
		leaderboard.GET(
			"/test/:id",
			permDecorator.Required(leaderboardHandler.GetTestLeaderboard, []rbac.Permission{rbac.LeaderboardView}),
		)
	}

	log.Println("✓ Leaderboard routes initialized successfully")
}
