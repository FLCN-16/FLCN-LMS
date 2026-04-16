package router

import (
	"log"

	"flcn_lms_backend/internal/api/handlers"

	"github.com/gin-gonic/gin"
)

// InitMarketingRoutes registers all public storefront routes under /marketing.
// None of these routes require authentication — they power the public lms-web frontend.
func InitMarketingRoutes(v1 *gin.RouterGroup, marketingHandler *handlers.MarketingHandler) {
	log.Println("Initializing marketing routes")

	marketing := v1.Group("/marketing")
	{
		// ================================================
		// COURSES
		// ================================================

		// List published courses (page, limit, search)
		marketing.GET("/courses", marketingHandler.ListCourses)

		// Featured courses for homepage
		marketing.GET("/courses/featured", marketingHandler.GetFeaturedCourses)

		// Course detail by slug — must come after /courses/featured to avoid param capture
		marketing.GET("/courses/:slug", marketingHandler.GetCourse)

		// Public curriculum (modules + lesson titles, no content URLs)
		marketing.GET("/courses/:slug/curriculum", marketingHandler.GetCourseCurriculum)

		// Related published courses
		marketing.GET("/courses/:slug/related", marketingHandler.GetRelatedCourses)

		// Active pricing packages for a course
		marketing.GET("/courses/:slug/packages", marketingHandler.GetCoursePackages)

		// ================================================
		// TEST SERIES
		// ================================================

		// List published test series (page, limit, search)
		marketing.GET("/test-series", marketingHandler.ListTestSeries)

		// Test series detail by slug
		marketing.GET("/test-series/:slug", marketingHandler.GetTestSeries)

		// ================================================
		// CATEGORIES
		// ================================================

		// List active categories with course counts
		marketing.GET("/categories", marketingHandler.ListCategories)

		// ================================================
		// INSTRUCTORS
		// ================================================

		// List all faculty instructors
		marketing.GET("/instructors", marketingHandler.ListInstructors)

		// Instructor profile with their published courses
		marketing.GET("/instructors/:id", marketingHandler.GetInstructor)

		// ================================================
		// STATS
		// ================================================

		// Public site-wide statistics
		marketing.GET("/stats", marketingHandler.GetStats)
	}

	log.Println("✓ Marketing routes initialized successfully")
}
