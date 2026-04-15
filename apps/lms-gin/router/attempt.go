package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitAttemptRoutes initializes all test attempt-related routes with permission checks
func InitAttemptRoutes(
	v1 *gin.RouterGroup,
	attemptHandler *handlers.AttemptHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing attempt routes")

	attempts := v1.Group("/attempts")
	{
		// ================================================
		// STUDENT ONLY ROUTES
		// ================================================

		// List student's attempts
		attempts.GET(
			"",
			permDecorator.Required(attemptHandler.ListAttempts, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Start new attempt
		attempts.POST(
			"/start",
			permDecorator.Required(attemptHandler.StartAttempt, []rbac.Permission{rbac.EnrollmentCreate}),
		)

		// Get specific attempt
		attempts.GET(
			"/:id",
			permDecorator.Required(attemptHandler.GetAttempt, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Submit attempt
		attempts.POST(
			"/submit",
			permDecorator.Required(attemptHandler.SubmitAttempt, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get attempt results
		attempts.GET(
			"/:id/results",
			permDecorator.Required(attemptHandler.GetResults, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get attempt score
		attempts.GET(
			"/:id/score",
			permDecorator.Required(attemptHandler.GetScore, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get user attempt history
		attempts.GET(
			"/history/:test_series_id",
			permDecorator.Required(attemptHandler.GetUserHistory, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// ================================================
		// FACULTY/ADMIN ROUTES
		// ================================================

		// List all attempts for a test series
		attempts.GET(
			"/test/:test_series_id",
			permDecorator.Required(attemptHandler.ListTestAttempts, []rbac.Permission{rbac.ReportsView}),
		)

		// ================================================
		// ADMIN ONLY ROUTES
		// ================================================

		// Evaluate attempt
		attempts.POST(
			"/:id/evaluate",
			permDecorator.Required(attemptHandler.EvaluateAttempt, []rbac.Permission{rbac.AdminAccess}),
		)
	}

	log.Println("✓ Attempt routes initialized successfully")
}
