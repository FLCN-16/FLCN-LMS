package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitializeAllRoutes initializes all API routes
// This is the central place where all route groups are registered
// Calls modular router functions for each route group
//
// Parameters:
//   - v1: API v1 route group from main router
//   - authHandler: Handler for auth business logic
//   - courseHandler: Handler for course business logic
//   - testSeriesHandler: Handler for test series business logic
//   - attemptHandler: Handler for attempt business logic
//   - userHandler: Handler for user management
//   - enrollmentHandler: Handler for enrollments
//   - liveSessionHandler: Handler for live sessions
//   - leaderboardHandler: Handler for leaderboards
//   - licenseHandler: Handler for license verification
//   - jwtSecret: Secret key for JWT validation in middleware
func InitializeAllRoutes(
	v1 *gin.RouterGroup,
	authHandler *handlers.AuthHandler,
	courseHandler *handlers.CourseHandler,
	instructorCourseHandler *handlers.InstructorCourseHandler,
	testSeriesHandler *handlers.TestSeriesHandler,
	attemptHandler *handlers.AttemptHandler,
	userHandler *handlers.UserHandler,
	enrollmentHandler *handlers.EnrollmentHandler,
	liveSessionHandler *handlers.LiveSessionHandler,
	leaderboardHandler *handlers.LeaderboardHandler,
	licenseHandler *handlers.LicenseHandler,
	permissionDecorator *decorators.PermissionDecorator,
	jwtSecret string,
) {
	log.Println("[Router] Initializing all API routes")

	// Public routes (no authentication required)
	InitAuthRoutes(v1, authHandler, jwtSecret)
	InitLicenseRoutes(v1, licenseHandler)

	// Protected routes (authentication required)
	InitCourseRoutes(v1, courseHandler, permissionDecorator)
	InitInstructorCourseRoutes(v1, instructorCourseHandler, permissionDecorator)
	InitTestSeriesRoutes(v1, testSeriesHandler, permissionDecorator)
	InitAttemptRoutes(v1, attemptHandler, permissionDecorator)
	InitUserRoutes(v1, userHandler, permissionDecorator)
	InitEnrollmentRoutes(v1, enrollmentHandler, permissionDecorator)
	InitLiveSessionRoutes(v1, liveSessionHandler, permissionDecorator)
	InitLeaderboardRoutes(v1, leaderboardHandler, permissionDecorator)

	log.Println("[Router] All API routes initialized successfully")
}

// InitInstructorCourseRoutes initializes instructor-specific course routes with permission checks
func InitInstructorCourseRoutes(
	v1 *gin.RouterGroup,
	instructorCourseHandler *handlers.InstructorCourseHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing instructor course routes")

	instructors := v1.Group("/instructors")
	{
		// ================================================
		// LIST INSTRUCTOR'S COURSES
		// ================================================
		// Requires: courses:list permission
		instructors.GET(
			"/:instructorId/courses",
			permDecorator.Required(instructorCourseHandler.ListInstructorCourses, []rbac.Permission{rbac.CourseList}),
		)

		// ================================================
		// GET SPECIFIC COURSE FOR EDITING
		// ================================================
		// Requires: courses:read permission
		instructors.GET(
			"/:instructorId/courses/:courseId",
			permDecorator.Required(instructorCourseHandler.GetInstructorCourse, []rbac.Permission{rbac.CourseRead}),
		)

		// ================================================
		// UPDATE INSTRUCTOR'S COURSE
		// ================================================
		// Requires: courses:update permission
		instructors.PATCH(
			"/:instructorId/courses/:courseId",
			permDecorator.Required(instructorCourseHandler.UpdateInstructorCourse, []rbac.Permission{rbac.CourseUpdate}),
		)

		// ================================================
		// DELETE INSTRUCTOR'S COURSE
		// ================================================
		// Requires: courses:delete permission
		instructors.DELETE(
			"/:instructorId/courses/:courseId",
			permDecorator.Required(instructorCourseHandler.DeleteInstructorCourse, []rbac.Permission{rbac.CourseDelete}),
		)

		// ================================================
		// PUBLISH INSTRUCTOR'S COURSE
		// ================================================
		// Requires: courses:publish permission
		instructors.POST(
			"/:instructorId/courses/:courseId/publish",
			permDecorator.Required(instructorCourseHandler.PublishInstructorCourse, []rbac.Permission{rbac.CoursePublish}),
		)

		// ================================================
		// ARCHIVE INSTRUCTOR'S COURSE
		// ================================================
		// Requires: courses:archive permission
		instructors.POST(
			"/:instructorId/courses/:courseId/archive",
			permDecorator.Required(instructorCourseHandler.ArchiveInstructorCourse, []rbac.Permission{rbac.CourseArchive}),
		)
	}

	log.Println("✓ Instructor course routes initialized successfully")
}

// InitLicenseRoutes initializes license verification routes
// These routes handle license verification and status checking
//
// Parameters:
//   - v1: API v1 route group from main router
//   - licenseHandler: Handler for license business logic
func InitLicenseRoutes(v1 *gin.RouterGroup, licenseHandler *handlers.LicenseHandler) {
	log.Println("Initializing license routes")

	license := v1.Group("/license")
	{
		// Verify license (bypass cache)
		license.POST("/verify", licenseHandler.VerifyLicense)

		// Get current license status
		license.GET("/status", licenseHandler.GetLicenseStatus)

		// Check if specific feature is enabled
		license.GET("/feature", licenseHandler.CheckFeature)

		// Get all enabled features
		license.GET("/features", licenseHandler.GetFeatures)

		// Refresh license cache
		license.POST("/refresh", licenseHandler.RefreshLicenseCache)

		// Get max users allowed
		license.GET("/max-users", licenseHandler.GetMaxUsers)

		// License system health check
		license.GET("/health", licenseHandler.HealthCheck)
	}
}
