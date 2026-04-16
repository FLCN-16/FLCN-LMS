package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitTestSeriesRoutes initializes all test series and question-related routes with permission checks
func InitTestSeriesRoutes(
	v1 *gin.RouterGroup,
	testSeriesHandler *handlers.TestSeriesHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing test series routes")

	tests := v1.Group("/test-series")
	{
		// ================================================
		// PUBLIC ROUTES (no authentication required)
		// ================================================

		tests.GET("/search", testSeriesHandler.SearchTestSeries)
		tests.GET("/published", testSeriesHandler.ListPublishedTestSeries)
		tests.GET("/slug/:slug", testSeriesHandler.GetTestSeriesBySlug)

		// ================================================
		// STUDENT ROUTES
		// ================================================
		// Students can read tests
		tests.GET(
			"/:id",
			permDecorator.Required(testSeriesHandler.GetTestSeries, []rbac.Permission{rbac.TestRead}),
		)

		tests.GET(
			"/:id/questions",
			permDecorator.Required(testSeriesHandler.GetQuestions, []rbac.Permission{rbac.TestRead}),
		)

		tests.GET(
			"/:id/stats",
			permDecorator.Required(testSeriesHandler.GetTestSeriesStats, []rbac.Permission{rbac.TestRead}),
		)

		// ================================================
		// FACULTY/ADMIN ROUTES
		// ================================================

		// Create test series
		tests.POST(
			"",
			permDecorator.Required(testSeriesHandler.CreateTestSeries, []rbac.Permission{rbac.TestCreate}),
		)

		// Update test series
		tests.PATCH(
			"/:id",
			permDecorator.Required(testSeriesHandler.UpdateTestSeries, []rbac.Permission{rbac.TestUpdate}),
		)

		// Delete test series
		tests.DELETE(
			"/:id",
			permDecorator.Required(testSeriesHandler.DeleteTestSeries, []rbac.Permission{rbac.TestDelete}),
		)

		// Publish test series
		tests.POST(
			"/:id/publish",
			permDecorator.Required(testSeriesHandler.PublishTestSeries, []rbac.Permission{rbac.TestUpdate}),
		)

		// Duplicate test series
		tests.POST(
			"/:id/duplicate",
			permDecorator.Required(testSeriesHandler.DuplicateTestSeries, []rbac.Permission{rbac.TestCreate}),
		)

		// Get test series count
		tests.GET(
			"/count",
			permDecorator.Required(testSeriesHandler.GetTestSeriesCount, []rbac.Permission{rbac.TestRead}),
		)
	}

	log.Println("✓ Test series routes initialized successfully")
}
