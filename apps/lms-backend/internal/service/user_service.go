package service

import (
	"errors"
	"fmt"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"flcn_lms_backend/internal/utils"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// UserService handles user business logic and authentication
type UserService struct {
	userRepo   *repository.UserRepository
	jwtManager *utils.JWTManager
}

// NewUserService creates a new user service instance
// Parameters:
//   - userRepo: User repository for database operations
//   - jwtManager: JWT manager for token operations
//
// Returns:
//   - *UserService: New user service instance
func NewUserService(userRepo *repository.UserRepository, jwtManager *utils.JWTManager) *UserService {
	return &UserService{
		userRepo:   userRepo,
		jwtManager: jwtManager,
	}
}

// RegisterRequest represents a user registration request
type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Role      string `json:"role"` // Optional; defaults to "student"
}

// LoginRequest represents a login request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RegisterResponse represents the response after successful registration
type RegisterResponse struct {
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

// LoginResponse represents the response after successful login
type LoginResponse struct {
	User      *UserResponse        `json:"user"`
	TokenPair *utils.TokenResponse `json:"tokens"`
}

// UserResponse represents a user in API responses
type UserResponse struct {
	ID                uuid.UUID  `json:"id"`
	Email             string     `json:"email"`
	FirstName         string     `json:"first_name"`
	LastName          string     `json:"last_name"`
	Phone             string     `json:"phone,omitempty"`
	ProfilePictureURL string     `json:"profile_picture_url,omitempty"`
	Role              string     `json:"role"`
	IsActive          bool       `json:"is_active"`
	LastLogin         *time.Time `json:"last_login,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

// RefreshTokenRequest represents a refresh token request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// Register creates a new user account
// Parameters:
//   - req: Registration request containing email, password, and user details
//
// Returns:
//   - *RegisterResponse: Registration response with new user details
//   - error: Error if registration fails
func (us *UserService) Register(req *RegisterRequest) (*RegisterResponse, error) {
	// Validate input
	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		return nil, errors.New("email, password, first_name, and last_name are required")
	}

	// Check if email already exists
	exists, err := us.userRepo.EmailExists(req.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to check email: %w", err)
	}
	if exists {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Set default role if not provided
	role := req.Role
	if role == "" {
		role = string(models.RoleStudent)
	}

	// Validate role
	if !isValidRole(role) {
		return nil, fmt.Errorf("invalid role: %s", role)
	}

	// Create user
	user := &models.User{
		ID:           uuid.New(),
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Role:         models.Role(role),
		IsActive:     true,
	}

	if err := us.userRepo.Create(user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &RegisterResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      string(user.Role),
		CreatedAt: user.CreatedAt,
	}, nil
}

// Login authenticates a user and returns tokens
// Parameters:
//   - req: Login request containing email and password
//
// Returns:
//   - *LoginResponse: Login response with user details and token pair
//   - error: Error if authentication fails
func (us *UserService) Login(req *LoginRequest) (*LoginResponse, error) {
	// Validate input
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	// Get user by email
	user, err := us.userRepo.GetByEmail(req.Email)
	if err != nil {
		// Avoid revealing whether email exists for security reasons
		return nil, errors.New("invalid email or password")
	}

	// Check if user is active
	if !user.IsActive {
		return nil, errors.New("user account is inactive")
	}

	// Verify password
	if !verifyPassword(user.PasswordHash, req.Password) {
		return nil, errors.New("invalid email or password")
	}

	// Update last login
	_ = us.userRepo.UpdateLastLogin(user.ID)

	// Generate token pair
	tokenPair, err := us.jwtManager.GenerateTokenPair(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &LoginResponse{
		User:      userToResponse(user),
		TokenPair: tokenPair,
	}, nil
}

// ValidateToken validates a JWT token and returns the user
// Parameters:
//   - token: JWT token string
//
// Returns:
//   - *UserResponse: User details from token
//   - error: Error if token is invalid or expired
func (us *UserService) ValidateToken(token string) (*UserResponse, error) {
	claims, err := us.jwtManager.ValidateToken(token)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	// Get fresh user data from database
	user, err := us.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if !user.IsActive {
		return nil, errors.New("user account is inactive")
	}

	return userToResponse(user), nil
}

// RefreshAccessToken generates a new access token from a refresh token
// Parameters:
//   - refreshToken: The refresh token
//
// Returns:
//   - *utils.TokenResponse: New token pair
//   - error: Error if refresh fails
func (us *UserService) RefreshAccessToken(refreshToken string) (*utils.TokenResponse, error) {
	// Validate refresh token
	claims, err := us.jwtManager.ValidateToken(refreshToken)
	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %w", err)
	}

	// Verify it's a refresh token (role should be "refresh")
	if claims.Role != "refresh" {
		return nil, errors.New("not a valid refresh token")
	}

	// Get user to verify they still exist and are active
	user, err := us.userRepo.GetByID(claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if !user.IsActive {
		return nil, errors.New("user account is inactive")
	}

	// Generate new token pair (with original role from database)
	tokenPair, err := us.jwtManager.GenerateTokenPair(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, fmt.Errorf("failed to generate new tokens: %w", err)
	}

	return tokenPair, nil
}

// GetUserByID retrieves a user by ID
// Parameters:
//   - id: User UUID
//
// Returns:
//   - *UserResponse: User details
//   - error: Error if user not found
func (us *UserService) GetUserByID(id uuid.UUID) (*UserResponse, error) {
	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return userToResponse(user), nil
}

// GetUserByEmail retrieves a user by email
// Parameters:
//   - email: User email
//
// Returns:
//   - *UserResponse: User details
//   - error: Error if user not found
func (us *UserService) GetUserByEmail(email string) (*UserResponse, error) {
	user, err := us.userRepo.GetByEmail(email)
	if err != nil {
		return nil, err
	}
	return userToResponse(user), nil
}

// UpdateUserProfile updates user profile information
// Parameters:
//   - id: User UUID
//   - firstName: New first name (optional)
//   - lastName: New last name (optional)
//   - phone: New phone number (optional)
//   - profilePictureURL: New profile picture URL (optional)
//
// Returns:
//   - *UserResponse: Updated user details
//   - error: Error if update fails
func (us *UserService) UpdateUserProfile(id uuid.UUID, firstName, lastName, phone, profilePictureURL string) (*UserResponse, error) {
	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update only provided fields
	if firstName != "" {
		user.FirstName = firstName
	}
	if lastName != "" {
		user.LastName = lastName
	}
	if phone != "" {
		user.Phone = phone
	}
	if profilePictureURL != "" {
		user.ProfilePictureURL = profilePictureURL
	}

	if err := us.userRepo.Update(user); err != nil {
		return nil, err
	}

	return userToResponse(user), nil
}

// ChangePassword changes a user's password
// Parameters:
//   - id: User UUID
//   - oldPassword: Current password
//   - newPassword: New password
//
// Returns:
//   - error: Error if password change fails
func (us *UserService) ChangePassword(id uuid.UUID, oldPassword, newPassword string) error {
	if len(newPassword) < 8 {
		return errors.New("new password must be at least 8 characters")
	}

	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Verify old password
	if !verifyPassword(user.PasswordHash, oldPassword) {
		return errors.New("current password is incorrect")
	}

	// Hash new password
	hashedPassword, err := hashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update password
	user.PasswordHash = hashedPassword
	return us.userRepo.Update(user)
}

// DeactivateUser deactivates a user account
// Parameters:
//   - id: User UUID
//
// Returns:
//   - error: Error if deactivation fails
func (us *UserService) DeactivateUser(id uuid.UUID) error {
	return us.userRepo.UpdateActiveStatus(id, false)
}

// ActivateUser activates a user account
// Parameters:
//   - id: User UUID
//
// Returns:
//   - error: Error if activation fails
func (us *UserService) ActivateUser(id uuid.UUID) error {
	return us.userRepo.UpdateActiveStatus(id, true)
}

// Helper functions

// hashPassword hashes a password using bcrypt
func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// verifyPassword verifies a password against a hash
func verifyPassword(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// isValidRole checks if a role is valid
func isValidRole(role string) bool {
	validRoles := []string{string(models.RoleStudent), string(models.RoleFaculty), string(models.RoleAdmin)}
	for _, r := range validRoles {
		if role == r {
			return true
		}
	}
	return false
}

// userToResponse converts a User model to a UserResponse
func userToResponse(user *models.User) *UserResponse {
	return &UserResponse{
		ID:                user.ID,
		Email:             user.Email,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		Phone:             user.Phone,
		ProfilePictureURL: user.ProfilePictureURL,
		Role:              string(user.Role),
		IsActive:          user.IsActive,
		LastLogin:         user.LastLogin,
		CreatedAt:         user.CreatedAt,
		UpdatedAt:         user.UpdatedAt,
	}
}

// CreateUserRequest DTO for admin user creation
type CreateUserRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Role      string `json:"role" binding:"required,oneof=student faculty admin"`
	Phone     string `json:"phone"`
}

// ListUsers retrieves all users with optional filtering
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of users per page
//   - role: Optional role filter
//
// Returns:
//   - []RegisterResponse: List of users
//   - int64: Total count
//   - error: Error if query fails
func (us *UserService) ListUsers(page, limit int, role string) ([]RegisterResponse, int64, error) {
	users, total, err := us.userRepo.List(page, limit)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]RegisterResponse, 0)
	for _, user := range users {
		if role != "" && string(user.Role) != role {
			continue
		}
		responses = append(responses, RegisterResponse{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Role:      string(user.Role),
		})
	}

	return responses, total, nil
}

// CreateUser creates a new user (admin only)
// Parameters:
//   - req: User creation request
//
// Returns:
//   - *RegisterResponse: Created user details
//   - error: Error if creation fails
func (us *UserService) CreateUser(req *CreateUserRequest) (*RegisterResponse, error) {
	// Check if user already exists
	existingUser, _ := us.userRepo.GetByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &models.User{
		ID:           uuid.New(),
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Role:         models.Role(req.Role),
		IsActive:     true,
	}

	if err := us.userRepo.Create(user); err != nil {
		return nil, err
	}

	return &RegisterResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      string(user.Role),
	}, nil
}

// UpdateUserRequest DTO for updating user info
type UpdateUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
}

// UpdateUser updates user information (admin only)
// Parameters:
//   - id: User UUID
//   - req: Update request
//
// Returns:
//   - *RegisterResponse: Updated user details
//   - error: Error if update fails
func (us *UserService) UpdateUser(id uuid.UUID, req *UpdateUserRequest) (*RegisterResponse, error) {
	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Role != "" {
		user.Role = models.Role(req.Role)
	}

	if err := us.userRepo.Update(user); err != nil {
		return nil, err
	}

	return &RegisterResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      string(user.Role),
	}, nil
}

// DeleteUser removes a user (admin only)
// Parameters:
//   - id: User UUID
//
// Returns:
//   - error: Error if deletion fails
func (us *UserService) DeleteUser(id uuid.UUID) error {
	return us.userRepo.Delete(id)
}

// GetUserByID retrieves a user by ID
// Parameters:
//   - id: User UUID
//
// Returns:
//   - *RegisterResponse: User details
//   - error: Error if user not found

// BulkImportUsers imports multiple users from CSV
// Parameters:
//   - data: CSV data string
//
// Returns:
//   - int: Number of successfully imported users
//   - error: Error if import fails
func (us *UserService) BulkImportUsers(data string) (int, error) {
	// Parse CSV and create users
	count := 0
	// TODO: Implement CSV parsing logic
	return count, nil
}

// ListUsersByRole retrieves users filtered by role
// Parameters:
//   - role: User role to filter by
//   - page: Page number (1-based)
//   - limit: Number of users per page
//
// Returns:
//   - []RegisterResponse: List of users with that role
//   - int64: Total count
//   - error: Error if query fails
func (us *UserService) ListUsersByRole(role string, page, limit int) ([]RegisterResponse, int64, error) {
	users, total, err := us.userRepo.ListByRolePaginated(role, page, limit)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]RegisterResponse, 0)
	for _, user := range users {
		responses = append(responses, RegisterResponse{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Role:      string(user.Role),
		})
	}

	return responses, total, nil
}

// GetUserCount returns the total number of users in the system
// Returns:
//   - int64: Total user count
//   - error: Error if query fails
func (us *UserService) GetUserCount() (int64, error) {
	// Use List with page 1, limit 1 to get total count
	_, total, err := us.userRepo.List(1, 1)
	return total, err
}

// ResetPassword resets a user's password
// Parameters:
//   - id: User UUID
//   - newPassword: New password
//
// Returns:
//   - error: Error if reset fails
func (us *UserService) ResetPassword(id uuid.UUID, newPassword string) error {
	user, err := us.userRepo.GetByID(id)
	if err != nil {
		return err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}

	user.PasswordHash = string(passwordHash)
	return us.userRepo.Update(user)
}

// GenerateTokensForUser generates JWT tokens for a user given their ID and role
// Used for impersonation and other scenarios where tokens are generated without password verification
func (us *UserService) GenerateTokensForUser(userID uuid.UUID, role string) (interface{}, error) {
	user, err := us.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	tokenPair, err := us.jwtManager.GenerateTokenPair(user.ID, user.Email, role)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return tokenPair, nil
}
