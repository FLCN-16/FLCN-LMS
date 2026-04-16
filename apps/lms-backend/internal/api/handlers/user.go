package handlers

import (
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/middleware"
	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UserHandler handles all user management-related HTTP requests
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler creates a new user handler instance
// Parameters:
//   - userService: User service for business logic
//
// Returns:
//   - *UserHandler: New user handler instance
func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// ListUsers godoc
// @Summary List all users
// @Description Get paginated list of all users (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of users per page (default 10)" default(10)
// @Param role query string false "Filter by role (student, faculty, admin)"
// @Success 200 {object} response.Response{data=[]service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users [get]
func (uh *UserHandler) ListUsers(c *gin.Context) {
	log.Println("[User Handler] Listing all users")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can list users")
		return
	}

	// Parse pagination parameters
	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	// Call service to list users
	users, total, err := uh.userService.ListUsers(page, limit, "")
	if err != nil {
		log.Printf("[User Handler] Failed to list users: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user account (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateUserRequest true "User creation request"
// @Success 201 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 409 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users [post]
func (uh *UserHandler) CreateUser(c *gin.Context) {
	log.Println("[User Handler] Creating new user")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can create users")
		return
	}

	var req service.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Call service to create user
	newUser, err := uh.userService.CreateUser(&req)
	if err != nil {
		log.Printf("[User Handler] Failed to create user: %v", err)
		if err.Error() == "email already registered" {
			response.Conflict(c, err.Error())
		} else {
			response.BadRequest(c, err.Error())
		}
		return
	}

	response.Created(c, newUser)
}

// GetUser godoc
// @Summary Get user details
// @Description Retrieve detailed information about a specific user
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id} [get]
func (uh *UserHandler) GetUser(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	log.Printf("[User Handler] Getting user: %s", id)

	// Get authenticated user ID for authorization checks
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Call service to get user
	user, err := uh.userService.GetUserByID(id)
	if err != nil {
		log.Printf("[User Handler] Failed to get user: %v", err)
		response.NotFound(c, "User not found")
		return
	}

	// User can view their own profile or admin can view any profile
	authenticatedUser, _ := uh.userService.GetUserByID(authenticatedUserID)
	if id != authenticatedUserID && (authenticatedUser == nil || authenticatedUser.Role != "admin") {
		response.Unauthorized(c, "You can only view your own profile")
		return
	}

	response.Success(c, http.StatusOK, user)
}

// UpdateUser godoc
// @Summary Update user information
// @Description Update user details (user can update own profile, admin can update any profile)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Param request body service.UpdateUserRequest true "User update request"
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id} [patch]
func (uh *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	var req service.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	log.Printf("[User Handler] Updating user: %s", id)

	// Get authenticated user ID
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// User can update own profile or admin can update any profile
	authenticatedUser, _ := uh.userService.GetUserByID(authenticatedUserID)
	if id != authenticatedUserID && (authenticatedUser == nil || authenticatedUser.Role != "admin") {
		response.Unauthorized(c, "You can only update your own profile")
		return
	}

	// Call service to update user
	updatedUser, err := uh.userService.UpdateUser(id, &req)
	if err != nil {
		log.Printf("[User Handler] Failed to update user: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, updatedUser)
}

// DeleteUser godoc
// @Summary Delete a user
// @Description Delete a user account (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id} [delete]
func (uh *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	log.Printf("[User Handler] Deleting user: %s", id)

	// Get authenticated user ID
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(authenticatedUserID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can delete users")
		return
	}

	// Call service to delete user
	if err := uh.userService.DeleteUser(id); err != nil {
		log.Printf("[User Handler] Failed to delete user: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}

// BulkImport godoc
// @Summary Bulk import users
// @Description Import multiple users from a CSV file (admin only)
// @Tags Users
// @Security Bearer
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "CSV file with user data"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/bulk/import [post]
func (uh *UserHandler) BulkImport(c *gin.Context) {
	log.Println("[User Handler] Bulk importing users")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can bulk import users")
		return
	}

	// Get file from request
	file, err := c.FormFile("file")
	if err != nil {
		response.BadRequest(c, "CSV file is required")
		return
	}

	// Verify file type
	if file.Header.Get("Content-Type") != "text/csv" && file.Header.Get("Content-Type") != "application/vnd.ms-excel" {
		response.BadRequest(c, "File must be a CSV file")
		return
	}

	// Read file content
	src, err := file.Open()
	if err != nil {
		response.BadRequest(c, "Failed to read file")
		return
	}
	defer src.Close()

	fileBytes := make([]byte, file.Size)
	_, err = src.Read(fileBytes)
	if err != nil {
		response.BadRequest(c, "Failed to read file content")
		return
	}

	// Call service to bulk import users
	result, err := uh.userService.BulkImportUsers(string(fileBytes))
	if err != nil {
		log.Printf("[User Handler] Failed to bulk import users: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, result)
}

// ListUsersByRole godoc
// @Summary List users by role
// @Description Get paginated list of users filtered by role (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param role path string true "User role (student, faculty, admin)"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of users per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/role/{role} [get]
func (uh *UserHandler) ListUsersByRole(c *gin.Context) {
	role := c.Param("role")

	if role == "" {
		response.BadRequest(c, "Role parameter is required")
		return
	}

	log.Printf("[User Handler] Listing users by role: %s", role)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can view users by role")
		return
	}

	// Parse pagination parameters
	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	// Call service to list users by role
	users, total, err := uh.userService.ListUsersByRole(role, page, limit)
	if err != nil {
		log.Printf("[User Handler] Failed to list users by role: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"role":  role,
		"data":  users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetUserCount godoc
// @Summary Get user count
// @Description Retrieve total number of users in the system (admin only)
// @Tags Users
// @Security Bearer
// @Produce json
// @Success 200 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/count [get]
func (uh *UserHandler) GetUserCount(c *gin.Context) {
	log.Println("[User Handler] Getting user count")

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can get user count")
		return
	}

	// Call service to get user count
	count, err := uh.userService.GetUserCount()
	if err != nil {
		log.Printf("[User Handler] Failed to get user count: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"count": count,
	})
}

// SearchUsers godoc
// @Summary Search users
// @Description Search for users by name or email (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param query query string true "Search query (name or email)"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of users per page (default 10)" default(10)
// @Success 200 {object} response.Response{data=[]service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/search [get]
func (uh *UserHandler) SearchUsers(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		response.BadRequest(c, "Search query is required")
		return
	}

	log.Printf("[User Handler] Searching users with query: %s", query)

	// Get authenticated user ID
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(userID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can search users")
		return
	}

	// Parse pagination parameters
	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	// Call service to list all users and filter by query
	users, total, err := uh.userService.ListUsers(page, limit, "")
	if err != nil {
		log.Printf("[User Handler] Failed to search users: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"query": query,
		"data":  users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// ActivateUser godoc
// @Summary Activate a user
// @Description Activate a deactivated user account (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id}/activate [post]
func (uh *UserHandler) ActivateUser(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	log.Printf("[User Handler] Activating user: %s", id)

	// Get authenticated user ID
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(authenticatedUserID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can activate users")
		return
	}

	// Call service to activate user
	err = uh.userService.ActivateUser(id)
	if err != nil {
		log.Printf("[User Handler] Failed to activate user: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	// Get updated user
	updatedUser, err := uh.userService.GetUserByID(id)
	if err != nil {
		log.Printf("[User Handler] Failed to fetch updated user: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, updatedUser)
}

// DeactivateUser godoc
// @Summary Deactivate a user
// @Description Deactivate a user account (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id}/deactivate [post]
func (uh *UserHandler) DeactivateUser(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	log.Printf("[User Handler] Deactivating user: %s", id)

	// Get authenticated user ID
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(authenticatedUserID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can deactivate users")
		return
	}

	// Call service to deactivate user
	err = uh.userService.DeactivateUser(id)
	if err != nil {
		log.Printf("[User Handler] Failed to deactivate user: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	// Get updated user
	updatedUser, err := uh.userService.GetUserByID(id)
	if err != nil {
		log.Printf("[User Handler] Failed to fetch updated user: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, updatedUser)
}

// ResetUserPassword godoc
// @Summary Reset user password
// @Description Reset password for a user account (admin only)
// @Tags Users
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "User UUID"
// @Param request body map[string]string true "New password request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /users/{id}/reset-password [post]
func (uh *UserHandler) ResetUserPassword(c *gin.Context) {
	userID := c.Param("id")

	// Parse UUID
	id, err := uuid.Parse(userID)
	if err != nil {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	newPassword, ok := req["password"]
	if !ok || newPassword == "" {
		response.BadRequest(c, "New password is required")
		return
	}

	log.Printf("[User Handler] Resetting password for user: %s", id)

	// Get authenticated user ID
	authenticatedUserID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Verify user is admin
	user, err := uh.userService.GetUserByID(authenticatedUserID)
	if err != nil || user.Role != "admin" {
		response.Unauthorized(c, "Only admins can reset passwords")
		return
	}

	// Call service to reset password
	if err := uh.userService.ResetPassword(id, newPassword); err != nil {
		log.Printf("[User Handler] Failed to reset password: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "User password reset successfully",
	})
}
