package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitCourseRoutes initializes all course-related routes with permission checks
func InitCourseRoutes(
	v1 *gin.RouterGroup,
	courseHandler *handlers.CourseHandler,
	studyMaterialHandler *handlers.StudyMaterialHandler,
	courseReviewHandler *handlers.CourseReviewHandler,
	orderHandler *handlers.OrderHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing course routes")

	courses := v1.Group("/courses")
	{
		// ================================================
		// PUBLIC ROUTES (no authentication required)
		// ================================================

		courses.GET("/search", courseHandler.SearchCourses)
		courses.GET("/published", courseHandler.ListPublishedCourses)
		courses.GET("/slug/:slug", courseHandler.GetCourseBySlug)

		// ================================================
		// STUDENT ROUTES
		// ================================================
		// Students can read courses
		courses.GET(
			"/:id",
			permDecorator.Required(courseHandler.GetCourse, []rbac.Permission{rbac.CourseRead}),
		)

		courses.GET(
			"/:id/modules",
			permDecorator.Required(courseHandler.GetModules, []rbac.Permission{rbac.ModuleRead}),
		)

		courses.GET(
			"/:id/lessons",
			permDecorator.Required(courseHandler.GetLessons, []rbac.Permission{rbac.LessonRead}),
		)

		// ================================================
		// FACULTY/ADMIN ROUTES
		// ================================================

		// List all courses
		courses.GET(
			"",
			permDecorator.Required(courseHandler.ListCourses, []rbac.Permission{rbac.CourseList}),
		)

		// Create new course
		courses.POST(
			"",
			permDecorator.Required(courseHandler.CreateCourse, []rbac.Permission{rbac.CourseCreate}),
		)

		// Update course
		courses.PATCH(
			"/:id",
			permDecorator.Required(courseHandler.UpdateCourse, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Delete course
		courses.DELETE(
			"/:id",
			permDecorator.Required(courseHandler.DeleteCourse, []rbac.Permission{rbac.CourseDelete}),
		)

		// Publish course
		courses.POST(
			"/:id/publish",
			permDecorator.Required(courseHandler.PublishCourse, []rbac.Permission{rbac.CoursePublish}),
		)

		// Archive course
		courses.POST(
			"/:id/archive",
			permDecorator.Required(courseHandler.ArchiveCourse, []rbac.Permission{rbac.CourseArchive}),
		)

		// Get enrolled students
		courses.GET(
			"/:id/enrolled-students",
			permDecorator.Required(courseHandler.GetEnrolledStudents, []rbac.Permission{rbac.CourseRead}),
		)

		// Get materials for a course
		courses.GET(
			"/:id/materials",
			studyMaterialHandler.GetMaterialsByCourse,
		)

		// Course reviews
		// Create review for course
		courses.POST(
			"/:id/reviews",
			permDecorator.Required(courseReviewHandler.CreateReview, []rbac.Permission{rbac.ReviewCreate}),
		)

		// List reviews for course
		courses.GET(
			"/:id/reviews",
			permDecorator.Required(courseReviewHandler.ListCourseReviews, []rbac.Permission{rbac.ReviewRead}),
		)

		// Get student's review for course
		courses.GET(
			"/:id/my-review",
			permDecorator.Required(courseReviewHandler.GetStudentReview, []rbac.Permission{rbac.ReviewRead}),
		)

		// Get course review statistics
		courses.GET(
			"/:id/review-stats",
			permDecorator.Required(courseReviewHandler.GetCourseStats, []rbac.Permission{rbac.ReviewRead}),
		)

		// List orders for a course
		courses.GET(
			"/:id/orders",
			permDecorator.Required(orderHandler.ListCourseOrders, []rbac.Permission{rbac.OrderRead}),
		)

		// Get course count
		courses.GET(
			"/count",
			permDecorator.Required(courseHandler.GetCourseCount, []rbac.Permission{rbac.CourseList}),
		)

		// ================================================
		// ADMIN ONLY ROUTES
		// ================================================

		// Set featured status
		courses.PATCH(
			"/:id/featured",
			permDecorator.Required(courseHandler.SetFeatured, []rbac.Permission{rbac.AdminAccess}),
		)
	}

	log.Println("✓ Course routes initialized successfully")
}
