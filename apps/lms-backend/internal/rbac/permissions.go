package rbac

// Permission format: "resource:action"
type Permission string

const (
	// ================================================
	// COURSE PERMISSIONS
	// ================================================
	CourseList    Permission = "courses:list"
	CourseCreate  Permission = "courses:create"
	CourseRead    Permission = "courses:read"
	CourseUpdate  Permission = "courses:update"
	CourseDelete  Permission = "courses:delete"
	CoursePublish Permission = "courses:publish"
	CourseArchive Permission = "courses:archive"

	// ================================================
	// MODULE PERMISSIONS
	// ================================================
	ModuleCreate Permission = "modules:create"
	ModuleRead   Permission = "modules:read"
	ModuleUpdate Permission = "modules:update"
	ModuleDelete Permission = "modules:delete"

	// ================================================
	// LESSON PERMISSIONS
	// ================================================
	LessonCreate Permission = "lessons:create"
	LessonRead   Permission = "lessons:read"
	LessonUpdate Permission = "lessons:update"
	LessonDelete Permission = "lessons:delete"

	// ================================================
	// TEST PERMISSIONS
	// ================================================
	TestCreate Permission = "tests:create"
	TestRead   Permission = "tests:read"
	TestUpdate Permission = "tests:update"
	TestDelete Permission = "tests:delete"

	// ================================================
	// USER MANAGEMENT PERMISSIONS
	// ================================================
	UserList   Permission = "users:list"
	UserCreate Permission = "users:create"
	UserRead   Permission = "users:read"
	UserUpdate Permission = "users:update"
	UserDelete Permission = "users:delete"

	// ================================================
	// ADMIN PERMISSIONS
	// ================================================
	AdminAccess Permission = "admin:access"
	AdminConfig Permission = "admin:config"

	// ================================================
	// ENROLLMENT PERMISSIONS
	// ================================================
	EnrollmentCreate Permission = "enrollments:create"
	EnrollmentRead   Permission = "enrollments:read"
	EnrollmentUpdate Permission = "enrollments:update"
	EnrollmentDelete Permission = "enrollments:delete"

	// ================================================
	// REPORT/ANALYTICS PERMISSIONS
	// ================================================
	ReportsView     Permission = "reports:view"
	AnalyticsView   Permission = "analytics:view"
	LeaderboardView Permission = "leaderboard:view"

	// ================================================
	// DPP (DAILY PRACTICE PAPER) PERMISSIONS
	// ================================================
	DPPCreate  Permission = "dpp:create"
	DPPRead    Permission = "dpp:read"
	DPPUpdate  Permission = "dpp:update"
	DPPDelete  Permission = "dpp:delete"
	DPPPublish Permission = "dpp:publish"

	// ================================================
	// ANNOUNCEMENT PERMISSIONS
	// ================================================
	AnnouncementCreate  Permission = "announcements:create"
	AnnouncementRead    Permission = "announcements:read"
	AnnouncementUpdate  Permission = "announcements:update"
	AnnouncementDelete  Permission = "announcements:delete"
	AnnouncementArchive Permission = "announcements:archive"

	// ================================================
	// COURSE REVIEW PERMISSIONS
	// ================================================
	ReviewCreate  Permission = "reviews:create"
	ReviewRead    Permission = "reviews:read"
	ReviewUpdate  Permission = "reviews:update"
	ReviewDelete  Permission = "reviews:delete"
	ReviewApprove Permission = "reviews:approve"
	ReviewReject  Permission = "reviews:reject"

	// ================================================
	// CERTIFICATE PERMISSIONS
	// ================================================
	CertificateCreate Permission = "certificates:create"
	CertificateRead  Permission = "certificates:read"
	CertificateDelete Permission = "certificates:delete"

	// ================================================
	// NOTIFICATION PERMISSIONS
	// ================================================
	NotificationRead   Permission = "notifications:read"
	NotificationUpdate Permission = "notifications:update"
	NotificationDelete Permission = "notifications:delete"

	// ================================================
	// BATCH PERMISSIONS
	// ================================================
	BatchCreate Permission = "batches:create"
	BatchRead   Permission = "batches:read"
	BatchUpdate Permission = "batches:update"
	BatchDelete Permission = "batches:delete"
	BatchEnroll Permission = "batches:enroll"

	// ================================================
	// ORDER PERMISSIONS
	// ================================================
	OrderCreate Permission = "orders:create"
	OrderRead   Permission = "orders:read"
	OrderUpdate Permission = "orders:update"
	OrderDelete Permission = "orders:delete"
)

// RolePermissions maps roles to their permissions
type RolePermissions map[string][]Permission

// DefaultRolePermissions defines permissions for each role
var DefaultRolePermissions = RolePermissions{
	"admin": {
		// ====== COURSE PERMISSIONS ======
		CourseList, CourseCreate, CourseRead, CourseUpdate, CourseDelete, CoursePublish, CourseArchive,

		// ====== MODULE PERMISSIONS ======
		ModuleCreate, ModuleRead, ModuleUpdate, ModuleDelete,

		// ====== LESSON PERMISSIONS ======
		LessonCreate, LessonRead, LessonUpdate, LessonDelete,

		// ====== TEST PERMISSIONS ======
		TestCreate, TestRead, TestUpdate, TestDelete,

		// ====== USER MANAGEMENT ======
		UserList, UserCreate, UserRead, UserUpdate, UserDelete,

		// ====== ADMIN PERMISSIONS ======
		AdminAccess, AdminConfig,

		// ====== ENROLLMENT PERMISSIONS ======
		EnrollmentCreate, EnrollmentRead, EnrollmentUpdate, EnrollmentDelete,

		// ====== REPORTS & ANALYTICS ======
		ReportsView, AnalyticsView, LeaderboardView,

		// ====== DPP PERMISSIONS ======
		DPPCreate, DPPRead, DPPUpdate, DPPDelete, DPPPublish,

		// ====== ANNOUNCEMENT PERMISSIONS ======
		AnnouncementCreate, AnnouncementRead, AnnouncementUpdate, AnnouncementDelete, AnnouncementArchive,

		// ====== REVIEW PERMISSIONS ======
		ReviewCreate, ReviewRead, ReviewUpdate, ReviewDelete, ReviewApprove, ReviewReject,

		// ====== CERTIFICATE PERMISSIONS ======
		CertificateCreate, CertificateRead, CertificateDelete,

		// ====== NOTIFICATION PERMISSIONS ======
		NotificationRead, NotificationUpdate, NotificationDelete,

		// ====== BATCH PERMISSIONS ======
		BatchCreate, BatchRead, BatchUpdate, BatchDelete, BatchEnroll,

		// ====== ORDER PERMISSIONS ======
		OrderCreate, OrderRead, OrderUpdate, OrderDelete,
	},

	"faculty": {
		// ====== COURSE PERMISSIONS ======
		// Faculty can create, read, update, delete, publish, archive courses
		CourseList, CourseCreate, CourseRead, CourseUpdate, CourseDelete, CoursePublish, CourseArchive,

		// ====== MODULE PERMISSIONS ======
		ModuleCreate, ModuleRead, ModuleUpdate, ModuleDelete,

		// ====== LESSON PERMISSIONS ======
		LessonCreate, LessonRead, LessonUpdate, LessonDelete,

		// ====== TEST PERMISSIONS ======
		TestCreate, TestRead, TestUpdate, TestDelete,

		// ====== ENROLLMENT PERMISSIONS ======
		EnrollmentCreate, EnrollmentRead,

		// ====== REPORTS & ANALYTICS ======
		ReportsView, AnalyticsView, LeaderboardView,

		// ====== DPP PERMISSIONS ======
		// Faculty can create, read, update, delete, and publish DPPs
		DPPCreate, DPPRead, DPPUpdate, DPPDelete, DPPPublish,

		// ====== ANNOUNCEMENT PERMISSIONS ======
		// Faculty can manage announcements
		AnnouncementCreate, AnnouncementRead, AnnouncementUpdate, AnnouncementDelete, AnnouncementArchive,

		// ====== REVIEW PERMISSIONS ======
		// Faculty can read and moderate course reviews
		ReviewRead, ReviewApprove, ReviewReject,

		// ====== CERTIFICATE PERMISSIONS ======
		// Faculty can create and read certificates
		CertificateCreate, CertificateRead,

		// ====== NOTIFICATION PERMISSIONS ======
		// Faculty can read and update their notifications
		NotificationRead, NotificationUpdate,

		// ====== BATCH PERMISSIONS ======
		// Faculty can create, read, update, delete, and enroll in batches
		BatchCreate, BatchRead, BatchUpdate, BatchDelete, BatchEnroll,

		// ====== ORDER PERMISSIONS ======
		// Faculty can read and update orders
		OrderRead, OrderUpdate,
	},

	"student": {
		// ====== COURSE PERMISSIONS ======
		// Students can only read published courses
		CourseRead, CourseList,

		// ====== MODULE PERMISSIONS ======
		ModuleRead,

		// ====== LESSON PERMISSIONS ======
		LessonRead,

		// ====== TEST PERMISSIONS ======
		TestRead,

		// ====== ENROLLMENT PERMISSIONS ======
		EnrollmentCreate, EnrollmentRead,

		// ====== REPORTS & ANALYTICS ======
		LeaderboardView,

		// ====== DPP PERMISSIONS ======
		// Students can read DPPs
		DPPRead,

		// ====== ANNOUNCEMENT PERMISSIONS ======
		// Students can read announcements
		AnnouncementRead,

		// ====== REVIEW PERMISSIONS ======
		// Students can create, read, and update their own reviews
		ReviewCreate, ReviewRead, ReviewUpdate, ReviewDelete,

		// ====== CERTIFICATE PERMISSIONS ======
		// Students can read their own certificates
		CertificateRead,

		// ====== NOTIFICATION PERMISSIONS ======
		// Students can read and update their notifications
		NotificationRead, NotificationUpdate,

		// ====== BATCH PERMISSIONS ======
		// Students can read batch information
		BatchRead,

		// ====== ORDER PERMISSIONS ======
		// Students can create and read their own orders
		OrderCreate, OrderRead,
	},
}
