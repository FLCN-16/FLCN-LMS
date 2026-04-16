package router

import (
	"log"

	"flcn_lms_backend/internal/api/decorators"
	"flcn_lms_backend/internal/api/handlers"
	"flcn_lms_backend/internal/rbac"

	"github.com/gin-gonic/gin"
)

// InitUserRoutes initializes all user management routes with permission checks
func InitUserRoutes(
	v1 *gin.RouterGroup,
	userHandler *handlers.UserHandler,
	orderHandler *handlers.OrderHandler,
	permDecorator *decorators.PermissionDecorator,
) {
	log.Println("Initializing user management routes")

	users := v1.Group("/users")
	{
		// ================================================
		// ADMIN ONLY ROUTES
		// ================================================

		// List all users
		users.GET(
			"",
			permDecorator.Required(userHandler.ListUsers, []rbac.Permission{rbac.UserList, rbac.AdminAccess}),
		)

		// Create new user
		users.POST(
			"",
			permDecorator.Required(userHandler.CreateUser, []rbac.Permission{rbac.UserCreate, rbac.AdminAccess}),
		)

		// Search users
		users.GET(
			"/search",
			permDecorator.Required(userHandler.SearchUsers, []rbac.Permission{rbac.UserList, rbac.AdminAccess}),
		)

		// Bulk import users
		users.POST(
			"/bulk-import",
			permDecorator.Required(userHandler.BulkImport, []rbac.Permission{rbac.UserCreate, rbac.AdminAccess}),
		)

		// Get specific user
		users.GET(
			"/:id",
			permDecorator.Required(userHandler.GetUser, []rbac.Permission{rbac.UserRead, rbac.AdminAccess}),
		)

		// Update user
		users.PATCH(
			"/:id",
			permDecorator.Required(userHandler.UpdateUser, []rbac.Permission{rbac.UserUpdate, rbac.AdminAccess}),
		)

		// Delete user
		users.DELETE(
			"/:id",
			permDecorator.Required(userHandler.DeleteUser, []rbac.Permission{rbac.UserDelete, rbac.AdminAccess}),
		)

		// ================================================
		// USER ORDER ROUTES
		// ================================================

		// List orders for a student
		users.GET(
			"/:id/orders",
			orderHandler.ListStudentOrders,
		)
	}

	log.Println("✓ User management routes initialized successfully")
}
