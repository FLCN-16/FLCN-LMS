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
	},
}
