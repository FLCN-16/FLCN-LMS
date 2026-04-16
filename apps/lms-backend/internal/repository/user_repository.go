package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserRepository handles all database operations for users
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *UserRepository: New user repository
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create saves a new user to the database
// Parameters:
//   - user: The user model to create
//
// Returns:
//   - error: Error if creation fails
func (ur *UserRepository) Create(user *models.User) error {
	if err := ur.db.Create(user).Error; err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

// GetByID retrieves a user by their UUID
// Parameters:
//   - id: The user's UUID
//
// Returns:
//   - *models.User: The user if found
//   - error: Error if user not found or query fails
func (ur *UserRepository) GetByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := ur.db.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	return &user, nil
}

// GetByEmail retrieves a user by their email address
// Parameters:
//   - email: The user's email
//
// Returns:
//   - *models.User: The user if found
//   - error: Error if user not found or query fails
func (ur *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	if err := ur.db.First(&user, "email = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	return &user, nil
}

// Update updates an existing user's information
// Parameters:
//   - user: The user model with updated values
//
// Returns:
//   - error: Error if update fails
func (ur *UserRepository) Update(user *models.User) error {
	if err := ur.db.Save(user).Error; err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a user
// Parameters:
//   - id: The user's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"first_name": "John"})
//
// Returns:
//   - error: Error if update fails
func (ur *UserRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := ur.db.Model(&models.User{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	return nil
}

// Delete removes a user from the database
// Parameters:
//   - id: The user's UUID
//
// Returns:
//   - error: Error if deletion fails
func (ur *UserRepository) Delete(id uuid.UUID) error {
	if err := ur.db.Delete(&models.User{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	return nil
}

// List retrieves a paginated list of users
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of users per page
//
// Returns:
//   - []models.User: Slice of users
//   - int64: Total count of users
//   - error: Error if query fails
func (ur *UserRepository) List(page, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Get total count
	if err := ur.db.Model(&models.User{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ur.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch users: %w", err)
	}

	return users, total, nil
}

// ListByRole retrieves all users with a specific role
// Parameters:
//   - role: The role to filter by (e.g., "student", "faculty", "admin")
//
// Returns:
//   - []models.User: Slice of users with the specified role
//   - error: Error if query fails
func (ur *UserRepository) ListByRole(role string) ([]models.User, error) {
	var users []models.User
	if err := ur.db.Where("role = ?", role).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch users by role: %w", err)
	}
	return users, nil
}

// ListByRolePaginated retrieves a paginated list of users by role
// Parameters:
//   - role: The role to filter by
//   - page: Page number (1-based)
//   - limit: Number of users per page
//
// Returns:
//   - []models.User: Slice of users
//   - int64: Total count of users with that role
//   - error: Error if query fails
func (ur *UserRepository) ListByRolePaginated(role string, page, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Get total count for role
	if err := ur.db.Model(&models.User{}).Where("role = ?", role).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ur.db.Where("role = ?", role).Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch users: %w", err)
	}

	return users, total, nil
}

// EmailExists checks if an email is already registered
// Parameters:
//   - email: The email to check
//
// Returns:
//   - bool: True if email exists
//   - error: Error if query fails
func (ur *UserRepository) EmailExists(email string) (bool, error) {
	var count int64
	if err := ur.db.Model(&models.User{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, fmt.Errorf("failed to check email: %w", err)
	}
	return count > 0, nil
}

// UpdateLastLogin updates the user's last login timestamp
// Parameters:
//   - id: The user's UUID
//
// Returns:
//   - error: Error if update fails
func (ur *UserRepository) UpdateLastLogin(id uuid.UUID) error {
	if err := ur.db.Model(&models.User{}).Where("id = ?", id).Update("last_login", gorm.Expr("NOW()")).Error; err != nil {
		return fmt.Errorf("failed to update last login: %w", err)
	}
	return nil
}

// GetActiveUsers retrieves all active users
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of users per page
//
// Returns:
//   - []models.User: Slice of active users
//   - int64: Total count of active users
//   - error: Error if query fails
func (ur *UserRepository) GetActiveUsers(page, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Get total count of active users
	if err := ur.db.Model(&models.User{}).Where("is_active = ?", true).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count active users: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ur.db.Where("is_active = ?", true).Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch active users: %w", err)
	}

	return users, total, nil
}

// UpdateActiveStatus updates the active status of a user
// Parameters:
//   - id: The user's UUID
//   - isActive: The new active status
//
// Returns:
//   - error: Error if update fails
func (ur *UserRepository) UpdateActiveStatus(id uuid.UUID, isActive bool) error {
	if err := ur.db.Model(&models.User{}).Where("id = ?", id).Update("is_active", isActive).Error; err != nil {
		return fmt.Errorf("failed to update active status: %w", err)
	}
	return nil
}

// GetUserCount returns the total number of users
// Returns:
//   - int64: Total count of users
//   - error: Error if query fails
func (ur *UserRepository) GetUserCount() (int64, error) {
	var count int64
	if err := ur.db.Model(&models.User{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count users: %w", err)
	}
	return count, nil
}

// Search searches for users by email or name
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of users per page
//
// Returns:
//   - []models.User: Slice of matching users
//   - int64: Total count of matching users
//   - error: Error if query fails
func (ur *UserRepository) Search(query string, page, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := ur.db.Model(&models.User{}).Where(
		ur.db.Where("email ILIKE ?", searchPattern).
			Or("first_name ILIKE ?", searchPattern).
			Or("last_name ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ur.db.Where(
		ur.db.Where("email ILIKE ?", searchPattern).
			Or("first_name ILIKE ?", searchPattern).
			Or("last_name ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search users: %w", err)
	}

	return users, total, nil
}
