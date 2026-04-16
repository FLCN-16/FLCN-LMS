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
	moduleHandler *handlers.ModuleHandler,
	lessonHandler *handlers.LessonHandler,
	studyMaterialHandler *handlers.StudyMaterialHandler,
	questionHandler *handlers.QuestionHandler,
	testSeriesHandler *handlers.TestSeriesHandler,
	attemptHandler *handlers.AttemptHandler,
	userHandler *handlers.UserHandler,
	enrollmentHandler *handlers.EnrollmentHandler,
	liveSessionHandler *handlers.LiveSessionHandler,
	leaderboardHandler *handlers.LeaderboardHandler,
	licenseHandler *handlers.LicenseHandler,
	dppHandler *handlers.DPPHandler,
	announcementHandler *handlers.AnnouncementHandler,
	courseReviewHandler *handlers.CourseReviewHandler,
	certificateHandler *handlers.CertificateHandler,
	notificationHandler *handlers.NotificationHandler,
	batchHandler *handlers.BatchHandler,
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
	InitModuleRoutes(v1, moduleHandler, permissionDecorator)
	InitLessonRoutes(v1, lessonHandler, permissionDecorator)
	InitStudyMaterialRoutes(v1, studyMaterialHandler, permissionDecorator)
	InitQuestionRoutes(v1, questionHandler, permissionDecorator)
	InitTestSeriesRoutes(v1, testSeriesHandler, permissionDecorator)
	InitAttemptRoutes(v1, attemptHandler, permissionDecorator)
	InitUserRoutes(v1, userHandler, permissionDecorator)
	InitEnrollmentRoutes(v1, enrollmentHandler, permissionDecorator)
	InitLiveSessionRoutes(v1, liveSessionHandler, permissionDecorator)
	InitLeaderboardRoutes(v1, leaderboardHandler, permissionDecorator)
	InitDPPRoutes(v1, dppHandler, permissionDecorator)
	InitAnnouncementRoutes(v1, announcementHandler, permissionDecorator)
	InitCourseReviewRoutes(v1, courseReviewHandler, permissionDecorator)
	InitCertificateRoutes(v1, certificateHandler, permissionDecorator)
	InitNotificationRoutes(v1, notificationHandler, permissionDecorator)
	InitBatchRoutes(v1, batchHandler, permissionDecorator)

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

// InitDPPRoutes initializes daily practice paper routes with permission checks
func InitDPPRoutes(
	v1 *gin.RouterGroup,
	dppHandler *handlers.DPPHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing DPP routes")

	dpp := v1.Group("/dpp")
	{
		// Create DPP
		dpp.POST(
			"",
			permDecorator.Required(dppHandler.CreateDPP, []rbac.Permission{rbac.DPPCreate}),
		)

		// Get specific DPP
		dpp.GET(
			"/:id",
			permDecorator.Required(dppHandler.GetDPP, []rbac.Permission{rbac.DPPRead}),
		)

		// List active DPPs
		dpp.GET(
			"",
			permDecorator.Required(dppHandler.ListActiveDPP, []rbac.Permission{rbac.DPPRead}),
		)

		// List DPPs by course
		dpp.GET(
			"/course/:courseId",
			permDecorator.Required(dppHandler.ListDPPByCourse, []rbac.Permission{rbac.DPPRead}),
		)

		// Get upcoming DPPs
		dpp.GET(
			"/upcoming",
			permDecorator.Required(dppHandler.GetUpcomingDPP, []rbac.Permission{rbac.DPPRead}),
		)

		// Update DPP
		dpp.PUT(
			"/:id",
			permDecorator.Required(dppHandler.UpdateDPP, []rbac.Permission{rbac.DPPUpdate}),
		)

		// Publish DPP
		dpp.PATCH(
			"/:id/publish",
			permDecorator.Required(dppHandler.PublishDPP, []rbac.Permission{rbac.DPPPublish}),
		)

		// Delete DPP
		dpp.DELETE(
			"/:id",
			permDecorator.Required(dppHandler.DeleteDPP, []rbac.Permission{rbac.DPPDelete}),
		)
	}

	log.Println("✓ DPP routes initialized successfully")
}

// InitAnnouncementRoutes initializes announcement routes with permission checks
func InitAnnouncementRoutes(
	v1 *gin.RouterGroup,
	announcementHandler *handlers.AnnouncementHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing announcement routes")

	announcements := v1.Group("/announcements")
	{
		// Create announcement
		announcements.POST(
			"",
			permDecorator.Required(announcementHandler.CreateAnnouncement, []rbac.Permission{rbac.AnnouncementCreate}),
		)

		// Get specific announcement
		announcements.GET(
			"/:id",
			permDecorator.Required(announcementHandler.GetAnnouncement, []rbac.Permission{rbac.AnnouncementRead}),
		)

		// List all announcements
		announcements.GET(
			"",
			permDecorator.Required(announcementHandler.ListAnnouncements, []rbac.Permission{rbac.AnnouncementRead}),
		)

		// List announcements by course
		announcements.GET(
			"/course/:courseId",
			permDecorator.Required(announcementHandler.ListAnnouncementsByCourse, []rbac.Permission{rbac.AnnouncementRead}),
		)

		// Get announcements for authenticated student
		announcements.GET(
			"/student",
			permDecorator.Required(announcementHandler.GetAnnouncementsForStudent, []rbac.Permission{rbac.AnnouncementRead}),
		)

		// Update announcement
		announcements.PUT(
			"/:id",
			permDecorator.Required(announcementHandler.UpdateAnnouncement, []rbac.Permission{rbac.AnnouncementUpdate}),
		)

		// Archive announcement
		announcements.PATCH(
			"/:id/archive",
			permDecorator.Required(announcementHandler.ArchiveAnnouncement, []rbac.Permission{rbac.AnnouncementArchive}),
		)

		// Delete announcement
		announcements.DELETE(
			"/:id",
			permDecorator.Required(announcementHandler.DeleteAnnouncement, []rbac.Permission{rbac.AnnouncementDelete}),
		)
	}

	log.Println("✓ Announcement routes initialized successfully")
}

// InitCourseReviewRoutes initializes course review routes with permission checks
func InitCourseReviewRoutes(
	v1 *gin.RouterGroup,
	courseReviewHandler *handlers.CourseReviewHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing course review routes")

	reviews := v1.Group("/reviews")
	{
		// Get specific review
		reviews.GET(
			"/:id",
			permDecorator.Required(courseReviewHandler.GetReview, []rbac.Permission{rbac.ReviewRead}),
		)

		// Update review
		reviews.PUT(
			"/:id",
			permDecorator.Required(courseReviewHandler.UpdateReview, []rbac.Permission{rbac.ReviewUpdate}),
		)

		// Approve review (admin)
		reviews.PATCH(
			"/:id/approve",
			permDecorator.Required(courseReviewHandler.ApproveReview, []rbac.Permission{rbac.ReviewApprove}),
		)

		// Reject review (admin)
		reviews.PATCH(
			"/:id/reject",
			permDecorator.Required(courseReviewHandler.RejectReview, []rbac.Permission{rbac.ReviewReject}),
		)

		// Mark review as helpful
		reviews.POST(
			"/:id/helpful",
			permDecorator.Required(courseReviewHandler.MarkHelpful, []rbac.Permission{rbac.ReviewRead}),
		)

		// Delete review
		reviews.DELETE(
			"/:id",
			permDecorator.Required(courseReviewHandler.DeleteReview, []rbac.Permission{rbac.ReviewDelete}),
		)
	}

	// Course-specific review routes
	courses := v1.Group("/courses")
	{
		// Create review for course
		courses.POST(
			"/:courseId/reviews",
			permDecorator.Required(courseReviewHandler.CreateReview, []rbac.Permission{rbac.ReviewCreate}),
		)

		// List reviews for course
		courses.GET(
			"/:courseId/reviews",
			permDecorator.Required(courseReviewHandler.ListCourseReviews, []rbac.Permission{rbac.ReviewRead}),
		)

		// Get student's review for course
		courses.GET(
			"/:courseId/my-review",
			permDecorator.Required(courseReviewHandler.GetStudentReview, []rbac.Permission{rbac.ReviewRead}),
		)

		// Get course review statistics
		courses.GET(
			"/:courseId/review-stats",
			permDecorator.Required(courseReviewHandler.GetCourseStats, []rbac.Permission{rbac.ReviewRead}),
		)
	}

	// User's reviews
	v1.GET(
		"/my-reviews",
		permDecorator.Required(courseReviewHandler.ListMyReviews, []rbac.Permission{rbac.ReviewRead}),
	)

	log.Println("✓ Course review routes initialized successfully")
}

// InitCertificateRoutes initializes certificate routes with permission checks
func InitCertificateRoutes(
	v1 *gin.RouterGroup,
	certificateHandler *handlers.CertificateHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing certificate routes")

	// User certificate routes
	v1.GET(
		"/user/certificates",
		permDecorator.Required(certificateHandler.ListUserCertificates, []rbac.Permission{rbac.CertificateRead}),
	)

	// Certificate endpoints
	certificates := v1.Group("/certificates")
	{
		// List all certificates (admin)
		certificates.GET(
			"",
			permDecorator.Required(certificateHandler.ListAllCertificates, []rbac.Permission{rbac.CertificateRead}),
		)

		// Issue certificate (admin)
		certificates.POST(
			"",
			permDecorator.Required(certificateHandler.IssueCertificate, []rbac.Permission{rbac.CertificateCreate}),
		)

		// Get specific certificate
		certificates.GET(
			"/:id",
			permDecorator.Required(certificateHandler.GetCertificate, []rbac.Permission{rbac.CertificateRead}),
		)

		// Download certificate PDF
		certificates.GET(
			"/:id/download",
			permDecorator.Required(certificateHandler.DownloadCertificatePDF, []rbac.Permission{rbac.CertificateRead}),
		)

		// Verify certificate by number (public - no auth required)
		certificates.GET(
			"/:number/verify",
			certificateHandler.VerifyCertificate,
		)

		// Check eligibility for certificate
		certificates.GET(
			"/eligibility",
			permDecorator.Required(certificateHandler.CheckEligibility, []rbac.Permission{rbac.CertificateRead}),
		)
	}

	log.Println("✓ Certificate routes initialized successfully")
}

// InitNotificationRoutes initializes notification routes with permission checks
func InitNotificationRoutes(
	v1 *gin.RouterGroup,
	notificationHandler *handlers.NotificationHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing notification routes")

	notifications := v1.Group("/notifications")
	{
		// List all notifications for user
		notifications.GET(
			"",
			permDecorator.Required(notificationHandler.ListNotifications, []rbac.Permission{rbac.NotificationRead}),
		)

		// List unread notifications
		notifications.GET(
			"/unread",
			permDecorator.Required(notificationHandler.ListUnreadNotifications, []rbac.Permission{rbac.NotificationRead}),
		)

		// Get specific notification
		notifications.GET(
			"/:id",
			permDecorator.Required(notificationHandler.GetNotification, []rbac.Permission{rbac.NotificationRead}),
		)

		// Mark notification as read
		notifications.PATCH(
			"/:id/read",
			permDecorator.Required(notificationHandler.MarkAsRead, []rbac.Permission{rbac.NotificationUpdate}),
		)

		// Mark all as read
		notifications.PATCH(
			"/read-all",
			permDecorator.Required(notificationHandler.MarkAllAsRead, []rbac.Permission{rbac.NotificationUpdate}),
		)

		// Delete notification
		notifications.DELETE(
			"/:id",
			permDecorator.Required(notificationHandler.DeleteNotification, []rbac.Permission{rbac.NotificationDelete}),
		)
	}

	log.Println("✓ Notification routes initialized successfully")
}

// InitBatchRoutes initializes batch routes with permission checks
func InitBatchRoutes(
	v1 *gin.RouterGroup,
	batchHandler *handlers.BatchHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing batch routes")

	batches := v1.Group("/batches")
	{
		// List all batches
		batches.GET(
			"",
			batchHandler.ListBatches,
		)

		// Get specific batch
		batches.GET(
			"/:id",
			batchHandler.GetBatch,
		)

		// Create batch (faculty/admin only)
		batches.POST(
			"",
			permDecorator.Required(batchHandler.CreateBatch, []rbac.Permission{rbac.BatchCreate}),
		)

		// Update batch (faculty/admin only)
		batches.PATCH(
			"/:id",
			permDecorator.Required(batchHandler.UpdateBatch, []rbac.Permission{rbac.BatchUpdate}),
		)

		// Delete batch (faculty/admin only)
		batches.DELETE(
			"/:id",
			permDecorator.Required(batchHandler.DeleteBatch, []rbac.Permission{rbac.BatchDelete}),
		)

		// Enroll student in batch
		batches.POST(
			"/:batchId/enroll",
			permDecorator.Required(batchHandler.EnrollStudent, []rbac.Permission{rbac.BatchEnroll}),
		)

		// List students in batch
		batches.GET(
			"/:batchId/students",
			batchHandler.ListBatchStudents,
		)
	}

	// Instructor-specific batch routes
	instructors := v1.Group("/instructors")
	{
		// List batches for an instructor
		instructors.GET(
			"/:instructorId/batches",
			batchHandler.ListBatchesByInstructor,
		)
	}

	log.Println("✓ Batch routes initialized successfully")
}

// InitModuleRoutes initializes module routes with permission checks
func InitModuleRoutes(
	v1 *gin.RouterGroup,
	moduleHandler *handlers.ModuleHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing module routes")

	modules := v1.Group("/modules")
	{
		// List all modules
		modules.GET(
			"",
			moduleHandler.ListModules,
		)

		// Get specific module
		modules.GET(
			"/:id",
			moduleHandler.GetModule,
		)

		// Search modules
		modules.GET(
			"/search",
			moduleHandler.SearchModules,
		)

		// Create module (faculty/admin only)
		modules.POST(
			"",
			permDecorator.Required(moduleHandler.CreateModule, []rbac.Permission{rbac.CourseCreate}),
		)

		// Update module (faculty/admin only)
		modules.PATCH(
			"/:id",
			permDecorator.Required(moduleHandler.UpdateModule, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Delete module (faculty/admin only)
		modules.DELETE(
			"/:id",
			permDecorator.Required(moduleHandler.DeleteModule, []rbac.Permission{rbac.CourseDelete}),
		)
	}

	// Course-specific module routes
	courses := v1.Group("/courses")
	{
		// Get modules for a course
		courses.GET(
			"/:courseId/modules",
			moduleHandler.GetModulesByCourse,
		)

		// Create module for a course
		courses.POST(
			"/:courseId/modules",
			permDecorator.Required(moduleHandler.CreateModule, []rbac.Permission{rbac.CourseCreate}),
		)
	}

	log.Println("✓ Module routes initialized successfully")
}

// InitLessonRoutes initializes lesson routes with permission checks
func InitLessonRoutes(
	v1 *gin.RouterGroup,
	lessonHandler *handlers.LessonHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing lesson routes")

	lessons := v1.Group("/lessons")
	{
		// List all lessons
		lessons.GET(
			"",
			lessonHandler.ListLessons,
		)

		// Get specific lesson
		lessons.GET(
			"/:id",
			lessonHandler.GetLesson,
		)

		// Search lessons
		lessons.GET(
			"/search",
			lessonHandler.SearchLessons,
		)

		// Create lesson (faculty/admin only)
		lessons.POST(
			"",
			permDecorator.Required(lessonHandler.CreateLesson, []rbac.Permission{rbac.CourseCreate}),
		)

		// Update lesson (faculty/admin only)
		lessons.PATCH(
			"/:id",
			permDecorator.Required(lessonHandler.UpdateLesson, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Delete lesson (faculty/admin only)
		lessons.DELETE(
			"/:id",
			permDecorator.Required(lessonHandler.DeleteLesson, []rbac.Permission{rbac.CourseDelete}),
		)
	}

	// Module-specific lesson routes
	modules := v1.Group("/modules")
	{
		// Get lessons for a module
		modules.GET(
			"/:moduleId/lessons",
			lessonHandler.GetLessonsByModule,
		)

		// Create lesson for a module
		modules.POST(
			"/:moduleId/lessons",
			permDecorator.Required(lessonHandler.CreateLesson, []rbac.Permission{rbac.CourseCreate}),
		)
	}

	log.Println("✓ Lesson routes initialized successfully")
}

// InitStudyMaterialRoutes initializes study material routes with permission checks
func InitStudyMaterialRoutes(
	v1 *gin.RouterGroup,
	studyMaterialHandler *handlers.StudyMaterialHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing study material routes")

	materials := v1.Group("/study-materials")
	{
		// List all study materials
		materials.GET(
			"",
			studyMaterialHandler.ListStudyMaterials,
		)

		// Get specific study material
		materials.GET(
			"/:id",
			studyMaterialHandler.GetStudyMaterial,
		)

		// Create study material (faculty/admin only)
		materials.POST(
			"",
			permDecorator.Required(studyMaterialHandler.CreateStudyMaterial, []rbac.Permission{rbac.CourseCreate}),
		)

		// Update study material (faculty/admin only)
		materials.PATCH(
			"/:id",
			permDecorator.Required(studyMaterialHandler.UpdateStudyMaterial, []rbac.Permission{rbac.CourseUpdate}),
		)

		// Delete study material (faculty/admin only)
		materials.DELETE(
			"/:id",
			permDecorator.Required(studyMaterialHandler.DeleteStudyMaterial, []rbac.Permission{rbac.CourseDelete}),
		)
	}

	// Course-specific material routes
	courses := v1.Group("/courses")
	{
		// Get materials for a course
		courses.GET(
			"/:courseId/materials",
			studyMaterialHandler.GetMaterialsByCourse,
		)
	}

	log.Println("✓ Study material routes initialized successfully")
}

// InitQuestionRoutes initializes question routes with permission checks
func InitQuestionRoutes(
	v1 *gin.RouterGroup,
	questionHandler *handlers.QuestionHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing question routes")

	questions := v1.Group("/questions")
	{
		// List all questions
		questions.GET(
			"",
			questionHandler.ListQuestions,
		)

		// Get specific question
		questions.GET(
			"/:id",
			questionHandler.GetQuestion,
		)

		// Validate question
		questions.GET(
			"/:id/validate",
			questionHandler.ValidateQuestion,
		)

		// Create question (faculty/admin only)
		questions.POST(
			"",
			permDecorator.Required(questionHandler.CreateQuestion, []rbac.Permission{rbac.QuestionCreate}),
		)

		// Bulk create questions (faculty/admin only)
		questions.POST(
			"/bulk",
			permDecorator.Required(questionHandler.BulkCreateQuestions, []rbac.Permission{rbac.QuestionCreate}),
		)

		// Update question (faculty/admin only)
		questions.PATCH(
			"/:id",
			permDecorator.Required(questionHandler.UpdateQuestion, []rbac.Permission{rbac.QuestionUpdate}),
		)

		// Update question options (faculty/admin only)
		questions.PATCH(
			"/:id/options",
			permDecorator.Required(questionHandler.UpdateQuestionOptions, []rbac.Permission{rbac.QuestionUpdate}),
		)

		// Delete question (faculty/admin only)
		questions.DELETE(
			"/:id",
			permDecorator.Required(questionHandler.DeleteQuestion, []rbac.Permission{rbac.QuestionDelete}),
		)
	}

	// Test series specific question routes
	testSeries := v1.Group("/test-series")
	{
		// Get questions for a test series
		testSeries.GET(
			"/:testSeriesId/questions",
			questionHandler.GetQuestionsByTestSeries,
		)

		// Create question for a test series
		testSeries.POST(
			"/:testSeriesId/questions",
			permDecorator.Required(questionHandler.CreateQuestion, []rbac.Permission{rbac.QuestionCreate}),
		)
	}

	log.Println("✓ Question routes initialized successfully")
}
