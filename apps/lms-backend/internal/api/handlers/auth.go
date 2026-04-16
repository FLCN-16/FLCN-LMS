package handlers

import (
	"net/http"
	"strings"

	"flcn_lms_backend/internal/api/middleware"
	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AuthHandler handles all authentication-related HTTP requests
type AuthHandler struct {
	userService *service.UserService
}

// NewAuthHandler creates a new auth handler instance
// Parameters:
//   - userService: User service for business logic
//
// Returns:
//   - *AuthHandler: New auth handler instance
func NewAuthHandler(userService *service.UserService) *AuthHandler {
	return &AuthHandler{
		userService: userService,
	}
}

// Register godoc
// @Summary Register a new user
// @Description Create a new user account with email and password
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body service.RegisterRequest true "Registration request"
// @Success 201 {object} response.Response{data=service.RegisterResponse}
// @Failure 400 {object} response.Response
// @Failure 409 {object} response.Response
// @Router /auth/register [post]
func (ah *AuthHandler) Register(c *gin.Context) {
	var req service.RegisterRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Call service to register user
	user, err := ah.userService.Register(&req)
	if err != nil {
		// Check if email already exists
		if strings.Contains(err.Error(), "already registered") {
			response.Conflict(c, err.Error())
			return
		}
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, user)
}

// Login godoc
// @Summary Login user
// @Description Authenticate user with email and password, returns access and refresh tokens
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body service.LoginRequest true "Login request"
// @Success 200 {object} response.Response{data=service.LoginResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/login [post]
func (ah *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Call service to login
	loginResp, err := ah.userService.Login(&req)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, loginResp)
}

// RefreshToken godoc
// @Summary Refresh access token
// @Description Generate a new access token using a valid refresh token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body service.RefreshTokenRequest true "Refresh token request"
// @Success 200 {object} response.Response{data=utils.TokenResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/refresh [post]
func (ah *AuthHandler) RefreshToken(c *gin.Context) {
	var req service.RefreshTokenRequest

	// Parse and validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Call service to refresh token
	tokenPair, err := ah.userService.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, tokenPair)
}

// Logout godoc
// @Summary Logout user
// @Description Logout the current user (revokes tokens on client side)
// @Tags Auth
// @Security Bearer
// @Produce json
// @Success 200 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/logout [post]
func (ah *AuthHandler) Logout(c *gin.Context) {
	// Logout is handled on the client side by deleting tokens
	// This endpoint is here for consistency and future token revocation features
	response.Success(c, http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}

// Me godoc
// @Summary Get current user information
// @Description Retrieve information about the authenticated user
// @Tags Auth
// @Security Bearer
// @Produce json
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 401 {object} response.Response
// @Router /auth/me [get]
func (ah *AuthHandler) Me(c *gin.Context) {
	// Get user ID from middleware context
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	// Get user from service
	user, err := ah.userService.GetUserByID(userID)
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}

	response.Success(c, http.StatusOK, user)
}

// UpdateProfile godoc
// @Summary Update user profile
// @Description Update user profile information (first name, last name, phone, profile picture)
// @Tags Auth
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "Profile update request (partial fields allowed)"
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /auth/profile [patch]
func (ah *AuthHandler) UpdateProfile(c *gin.Context) {
	// Get user ID from middleware context
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	// Extract optional fields
	firstName, _ := req["first_name"].(string)
	lastName, _ := req["last_name"].(string)
	phone, _ := req["phone"].(string)
	profilePictureURL, _ := req["profile_picture_url"].(string)

	// Call service to update profile
	user, err := ah.userService.UpdateUserProfile(userID, firstName, lastName, phone, profilePictureURL)
	if err != nil {
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, user)
}

// ChangePassword godoc
// @Summary Change user password
// @Description Change the password for the authenticated user
// @Tags Auth
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body map[string]string true "Password change request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /auth/change-password [post]
func (ah *AuthHandler) ChangePassword(c *gin.Context) {
	// Get user ID from middleware context
	userID, err := middleware.GetUserID(c)
	if err != nil {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	oldPassword, ok := req["old_password"]
	if !ok || oldPassword == "" {
		response.BadRequest(c, "old_password is required")
		return
	}

	newPassword, ok := req["new_password"]
	if !ok || newPassword == "" {
		response.BadRequest(c, "new_password is required")
		return
	}

	// Call service to change password
	if err := ah.userService.ChangePassword(userID, oldPassword, newPassword); err != nil {
		if strings.Contains(err.Error(), "at least 8 characters") {
			response.BadRequest(c, err.Error())
			return
		}
		if strings.Contains(err.Error(), "incorrect") {
			response.Unauthorized(c, err.Error())
			return
		}
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"message": "Password changed successfully",
	})
}

// ValidateToken godoc
// @Summary Validate access token
// @Description Check if an access token is valid and get user information from it
// @Tags Auth
// @Security Bearer
// @Produce json
// @Success 200 {object} response.Response{data=service.UserResponse}
// @Failure 401 {object} response.Response
// @Router /auth/validate [get]
func (ah *AuthHandler) ValidateToken(c *gin.Context) {
	// Extract token from Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		response.Unauthorized(c, "Missing authorization header")
		return
	}

	// Remove "Bearer " prefix
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		response.Unauthorized(c, "Invalid authorization header format")
		return
	}

	token := parts[1]

	// Validate token and get user
	user, err := ah.userService.ValidateToken(token)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, user)
}

// ImpersonateStudent godoc
// @Summary Impersonate a student (Admin Only)
// @Description Admin can impersonate a student to test their experience and troubleshoot issues
// @Tags Auth
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body map[string]string true "Impersonation request with student_id"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 403 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /auth/impersonate [post]
func (ah *AuthHandler) ImpersonateStudent(c *gin.Context) {
	// Get admin ID from context (set by Impersonate decorator)
	adminIDInterface, exists := c.Get("adminID")
	if !exists {
		response.Forbidden(c, "Admin authentication required for impersonation")
		return
	}

	adminID := adminIDInterface.(string)

	// Parse request
	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}

	studentIDStr, ok := req["student_id"]
	if !ok || studentIDStr == "" {
		response.BadRequest(c, "student_id is required")
		return
	}

	studentID, err := uuid.Parse(studentIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid student_id format")
		return
	}

	// Get student information
	student, err := ah.userService.GetUserByID(studentID)
	if err != nil {
		response.NotFound(c, "Student not found")
		return
	}

	// Verify student is actually a student
	if student.Role != "student" {
		response.BadRequest(c, "Can only impersonate users with student role")
		return
	}

	// Generate login tokens for the student
	// Using the existing Login mechanism by creating a synthetic request
	tokenPair, err := ah.userService.GenerateTokensForUser(studentID, "student")
	if err != nil {
		response.InternalServerError(c, "Failed to generate token: "+err.Error())
		return
	}

	// Return response with impersonation information
	response.Success(c, http.StatusOK, gin.H{
		"tokens":                tokenPair,
		"student":               student,
		"impersonated_by_admin": adminID,
		"note":                  "You are logged in as a student. All actions will be recorded as this student. Use /auth/logout to end impersonation.",
	})
}
