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
//   - marketingHandler: Handler for public storefront endpoints
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
	orderHandler *handlers.OrderHandler,
	couponHandler *handlers.CouponHandler,
	marketingHandler *handlers.MarketingHandler,
	packageHandler *handlers.CoursePackageHandler,
	subscriptionHandler *handlers.SubscriptionHandler,
	invoiceHandler *handlers.InvoiceHandler,
	noteHandler *handlers.LessonNoteHandler,
	permissionDecorator *decorators.PermissionDecorator,
	jwtSecret string,
) {
	log.Println("[Router] Initializing all API routes")

	// Public routes (no authentication required)
	InitAuthRoutes(v1, authHandler, jwtSecret)
	InitLicenseRoutes(v1, licenseHandler)
	InitMarketingRoutes(v1, marketingHandler)

	// Protected routes (authentication required)
	InitCourseRoutes(v1, courseHandler, studyMaterialHandler, courseReviewHandler, orderHandler, permissionDecorator)
	InitInstructorCourseRoutes(v1, instructorCourseHandler, permissionDecorator)
	InitModuleRoutes(v1, moduleHandler, permissionDecorator)
	InitLessonRoutes(v1, lessonHandler, permissionDecorator)
	InitStudyMaterialRoutes(v1, studyMaterialHandler, permissionDecorator)
	InitQuestionRoutes(v1, questionHandler, permissionDecorator)
	InitTestSeriesRoutes(v1, testSeriesHandler, questionHandler, permissionDecorator)
	InitAttemptRoutes(v1, attemptHandler, permissionDecorator)
	InitUserRoutes(v1, userHandler, orderHandler, permissionDecorator)
	InitEnrollmentRoutes(v1, enrollmentHandler, permissionDecorator)
	InitLiveSessionRoutes(v1, liveSessionHandler, permissionDecorator)
	InitLeaderboardRoutes(v1, leaderboardHandler, permissionDecorator)
	InitDPPRoutes(v1, dppHandler, permissionDecorator)
	InitAnnouncementRoutes(v1, announcementHandler, permissionDecorator)
	InitCourseReviewRoutes(v1, courseReviewHandler, permissionDecorator)
	InitCertificateRoutes(v1, certificateHandler, permissionDecorator)
	InitNotificationRoutes(v1, notificationHandler, permissionDecorator)
	InitBatchRoutes(v1, batchHandler, permissionDecorator)
	InitOrderRoutes(v1, orderHandler, invoiceHandler, permissionDecorator)
	InitCouponRoutes(v1, couponHandler, permissionDecorator)
	InitPackageRoutes(v1, packageHandler, permissionDecorator)
	InitSubscriptionRoutes(v1, subscriptionHandler, permissionDecorator)
	InitInvoiceRoutes(v1, invoiceHandler, permissionDecorator)
	InitLessonNoteRoutes(v1, noteHandler, permissionDecorator)

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

		// Check eligibility for certificate
		certificates.GET(
			"/eligibility",
			permDecorator.Required(certificateHandler.CheckEligibility, []rbac.Permission{rbac.CertificateRead}),
		)

		// Verify certificate by number (public - no auth required)
		certificates.GET(
			"/verify/:number",
			certificateHandler.VerifyCertificate,
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
			"/:id/enroll",
			permDecorator.Required(batchHandler.EnrollStudent, []rbac.Permission{rbac.BatchEnroll}),
		)

		// List students in batch
		batches.GET(
			"/:id/students",
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

// InitOrderRoutes initializes order routes with permission checks
func InitOrderRoutes(
	v1 *gin.RouterGroup,
	orderHandler *handlers.OrderHandler,
	invoiceHandler *handlers.InvoiceHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing order routes")

	// Student purchase history
	v1.GET(
		"/my/orders",
		permDecorator.Required(orderHandler.GetMyOrders, []rbac.Permission{rbac.OrderRead}),
	)

	orders := v1.Group("/orders")
	{
		// List all orders (admin only)
		orders.GET(
			"",
			permDecorator.Required(orderHandler.ListOrders, []rbac.Permission{rbac.OrderRead}),
		)

		// Get specific order
		orders.GET(
			"/:id",
			permDecorator.Required(orderHandler.GetOrder, []rbac.Permission{rbac.OrderRead}),
		)

		// Create order (student)
		orders.POST(
			"",
			permDecorator.Required(orderHandler.CreateOrder, []rbac.Permission{rbac.OrderCreate}),
		)

		// Update order status (admin only)
		orders.PATCH(
			"/:id/status",
			permDecorator.Required(orderHandler.UpdateOrderStatus, []rbac.Permission{rbac.OrderUpdate}),
		)

		// Cancel order
		orders.POST(
			"/:id/cancel",
			permDecorator.Required(orderHandler.CancelOrder, []rbac.Permission{rbac.OrderUpdate}),
		)

		// Delete order (admin only)
		orders.DELETE(
			"/:id",
			permDecorator.Required(orderHandler.DeleteOrder, []rbac.Permission{rbac.OrderDelete}),
		)

		// Get invoice for an order
		orders.GET(
			"/:id/invoice",
			permDecorator.Required(invoiceHandler.GetInvoiceByOrder, []rbac.Permission{rbac.InvoiceRead}),
		)
	}

	log.Println("✓ Order routes initialized successfully")
}

// InitPackageRoutes initializes course package routes
func InitPackageRoutes(
	v1 *gin.RouterGroup,
	packageHandler *handlers.CoursePackageHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing package routes")

	packages := v1.Group("/packages")
	{
		packages.GET(
			"/:id",
			permDecorator.Required(packageHandler.GetPackage, []rbac.Permission{rbac.PackageRead}),
		)
		packages.POST(
			"",
			permDecorator.Required(packageHandler.CreatePackage, []rbac.Permission{rbac.PackageCreate}),
		)
		packages.PATCH(
			"/:id",
			permDecorator.Required(packageHandler.UpdatePackage, []rbac.Permission{rbac.PackageUpdate}),
		)
		packages.DELETE(
			"/:id",
			permDecorator.Required(packageHandler.DeletePackage, []rbac.Permission{rbac.PackageDelete}),
		)
	}

	// Course-scoped packages (admin/faculty view, all packages including inactive)
	v1.GET(
		"/courses/:id/packages",
		permDecorator.Required(packageHandler.ListPackagesByCourse, []rbac.Permission{rbac.PackageRead}),
	)

	log.Println("✓ Package routes initialized successfully")
}

// InitSubscriptionRoutes initializes subscription routes
func InitSubscriptionRoutes(
	v1 *gin.RouterGroup,
	subscriptionHandler *handlers.SubscriptionHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing subscription routes")

	v1.GET(
		"/my/subscriptions",
		permDecorator.Required(subscriptionHandler.GetMySubscriptions, []rbac.Permission{rbac.SubscriptionRead}),
	)

	v1.GET(
		"/subscriptions/:id",
		permDecorator.Required(subscriptionHandler.GetSubscription, []rbac.Permission{rbac.SubscriptionRead}),
	)

	log.Println("✓ Subscription routes initialized successfully")
}

// InitInvoiceRoutes initializes invoice routes
func InitInvoiceRoutes(
	v1 *gin.RouterGroup,
	invoiceHandler *handlers.InvoiceHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing invoice routes")

	v1.GET(
		"/my/invoices",
		permDecorator.Required(invoiceHandler.GetMyInvoices, []rbac.Permission{rbac.InvoiceRead}),
	)

	v1.GET(
		"/invoices/:id",
		permDecorator.Required(invoiceHandler.GetInvoice, []rbac.Permission{rbac.InvoiceRead}),
	)

	log.Println("✓ Invoice routes initialized successfully")
}

// InitCouponRoutes initializes coupon routes with permission checks
func InitCouponRoutes(
	v1 *gin.RouterGroup,
	couponHandler *handlers.CouponHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing coupon routes")

	coupons := v1.Group("/coupons")
	{
		// List all coupons (admin only)
		coupons.GET(
			"",
			permDecorator.Required(couponHandler.ListCoupons, []rbac.Permission{rbac.CouponRead}),
		)

		// List active coupons (public)
		coupons.GET(
			"/active",
			couponHandler.ListActiveCoupons,
		)

		// Get specific coupon (admin only)
		coupons.GET(
			"/:id",
			permDecorator.Required(couponHandler.GetCoupon, []rbac.Permission{rbac.CouponRead}),
		)

		// Create coupon (admin only)
		coupons.POST(
			"",
			permDecorator.Required(couponHandler.CreateCoupon, []rbac.Permission{rbac.CouponCreate}),
		)

		// Update coupon (admin only)
		coupons.PATCH(
			"/:id",
			permDecorator.Required(couponHandler.UpdateCoupon, []rbac.Permission{rbac.CouponUpdate}),
		)

		// Delete coupon (admin only)
		coupons.DELETE(
			"/:id",
			permDecorator.Required(couponHandler.DeleteCoupon, []rbac.Permission{rbac.CouponDelete}),
		)

		// Validate coupon (public)
		coupons.POST(
			"/validate",
			couponHandler.ValidateCoupon,
		)
	}

	log.Println("✓ Coupon routes initialized successfully")
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

		// Search study materials
		materials.GET(
			"/search",
			studyMaterialHandler.SearchStudyMaterials,
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

	log.Println("✓ Question routes initialized successfully")
}

// InitLessonNoteRoutes initializes lesson note routes
func InitLessonNoteRoutes(
	v1 *gin.RouterGroup,
	noteHandler *handlers.LessonNoteHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing lesson note routes")

	// All notes for the authenticated student
	v1.GET(
		"/my/notes",
		permDecorator.Required(noteHandler.GetMyNotes, []rbac.Permission{rbac.NoteRead}),
	)

	// Notes CRUD scoped to a lesson
	lessons := v1.Group("/lessons")
	{
		lessons.GET(
			"/:id/notes",
			permDecorator.Required(noteHandler.GetLessonNotes, []rbac.Permission{rbac.NoteRead}),
		)
		lessons.POST(
			"/:id/notes",
			permDecorator.Required(noteHandler.CreateNote, []rbac.Permission{rbac.NoteCreate}),
		)
	}

	// Individual note management
	notes := v1.Group("/notes")
	{
		notes.PATCH(
			"/:id",
			permDecorator.Required(noteHandler.UpdateNote, []rbac.Permission{rbac.NoteUpdate}),
		)
		notes.DELETE(
			"/:id",
			permDecorator.Required(noteHandler.DeleteNote, []rbac.Permission{rbac.NoteDelete}),
		)
	}

	log.Println("✓ Lesson note routes initialized successfully")
}
