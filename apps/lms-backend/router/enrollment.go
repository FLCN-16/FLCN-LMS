package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitEnrollmentRoutes initializes all course enrollment-related routes with permission checks
func InitEnrollmentRoutes(
	v1 *gin.RouterGroup,
	enrollmentHandler *handlers.EnrollmentHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing enrollment routes")

	enrollments := v1.Group("/enrollments")
	{
		// ================================================
		// STUDENT ROUTES
		// ================================================

		// List student's enrollments
		enrollments.GET(
			"",
			permDecorator.Required(enrollmentHandler.ListEnrollments, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get specific enrollment
		enrollments.GET(
			"/:id",
			permDecorator.Required(enrollmentHandler.GetEnrollment, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Enroll in course
		enrollments.POST(
			"/enroll",
			permDecorator.Required(enrollmentHandler.EnrollStudent, []rbac.Permission{rbac.EnrollmentCreate}),
		)

		// Unenroll from course
		enrollments.DELETE(
			"/:course_id",
			permDecorator.Required(enrollmentHandler.Unenroll, []rbac.Permission{rbac.EnrollmentDelete}),
		)

		// Update progress
		enrollments.PATCH(
			"/:id/progress",
			permDecorator.Required(enrollmentHandler.UpdateProgress, []rbac.Permission{rbac.EnrollmentUpdate}),
		)

		// Complete enrollment
		enrollments.POST(
			"/:id/complete",
			permDecorator.Required(enrollmentHandler.CompleteEnrollment, []rbac.Permission{rbac.EnrollmentUpdate}),
		)

		// ================================================
		// FACULTY/ADMIN ROUTES
		// ================================================

		// Get admin enrollments for course
		enrollments.GET(
			"/course/:course_id",
			permDecorator.Required(enrollmentHandler.GetAdminEnrollments, []rbac.Permission{rbac.EnrollmentRead}),
		)

		// Get enrollment statistics
		enrollments.GET(
			"/course/:course_id/stats",
			permDecorator.Required(enrollmentHandler.GetEnrollmentStats, []rbac.Permission{rbac.AnalyticsView}),
		)
	}

	log.Println("✓ Enrollment routes initialized successfully")
}
