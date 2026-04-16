package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ModuleRepository handles all database operations for modules
type ModuleRepository struct {
	db *gorm.DB
}

// NewModuleRepository creates a new module repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *ModuleRepository: New module repository
func NewModuleRepository(db *gorm.DB) *ModuleRepository {
	return &ModuleRepository{db: db}
}

// Create saves a new module to the database
// Parameters:
//   - module: The module model to create
//
// Returns:
//   - error: Error if creation fails
func (mr *ModuleRepository) Create(module *models.Module) error {
	if module.ID == uuid.Nil {
		module.ID = uuid.New()
	}
	if err := mr.db.Create(module).Error; err != nil {
		return fmt.Errorf("failed to create module: %w", err)
	}
	return nil
}

// GetByID retrieves a module by its UUID
// Parameters:
//   - id: The module's UUID
//
// Returns:
//   - *models.Module: The module if found
//   - error: Error if module not found or query fails
func (mr *ModuleRepository) GetByID(id uuid.UUID) (*models.Module, error) {
	var module models.Module
	if err := mr.db.First(&module, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("module not found")
		}
		return nil, fmt.Errorf("failed to fetch module: %w", err)
	}
	return &module, nil
}

// GetAll retrieves all modules with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []models.Module: Slice of modules
//   - int64: Total count of modules
//   - error: Error if query fails
func (mr *ModuleRepository) GetAll(page, limit int) ([]models.Module, int64, error) {
	var modules []models.Module
	var total int64

	// Get total count
	if err := mr.db.Model(&models.Module{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count modules: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := mr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&modules).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch modules: %w", err)
	}

	return modules, total, nil
}

// Update updates an existing module's information
// Parameters:
//   - module: The module model with updated values
//
// Returns:
//   - error: Error if update fails
func (mr *ModuleRepository) Update(module *models.Module) error {
	if err := mr.db.Save(module).Error; err != nil {
		return fmt.Errorf("failed to update module: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a module
// Parameters:
//   - id: The module's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"title": "New Title"})
//
// Returns:
//   - error: Error if update fails
func (mr *ModuleRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := mr.db.Model(&models.Module{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update module: %w", err)
	}
	return nil
}

// Delete removes a module from the database
// Parameters:
//   - id: The module's UUID
//
// Returns:
//   - error: Error if deletion fails
func (mr *ModuleRepository) Delete(id uuid.UUID) error {
	if err := mr.db.Delete(&models.Module{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete module: %w", err)
	}
	return nil
}

// GetByCourseID retrieves all modules for a specific course with pagination
// Parameters:
//   - courseID: The course's UUID
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []models.Module: Slice of modules
//   - int64: Total count of modules for the course
//   - error: Error if query fails
func (mr *ModuleRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.Module, int64, error) {
	var modules []models.Module
	var total int64

	// Get total count for course
	if err := mr.db.Model(&models.Module{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count modules: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := mr.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("sequence_number ASC").Find(&modules).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch modules by course: %w", err)
	}

	return modules, total, nil
}

// GetModuleCount returns the total number of modules
// Returns:
//   - int64: Total count of modules
//   - error: Error if query fails
func (mr *ModuleRepository) GetModuleCount() (int64, error) {
	var count int64
	if err := mr.db.Model(&models.Module{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count modules: %w", err)
	}
	return count, nil
}

// GetModuleCountByCourse returns the total number of modules for a specific course
// Parameters:
//   - courseID: The course's UUID
//
// Returns:
//   - int64: Total count of modules for the course
//   - error: Error if query fails
func (mr *ModuleRepository) GetModuleCountByCourse(courseID uuid.UUID) (int64, error) {
	var count int64
	if err := mr.db.Model(&models.Module{}).Where("course_id = ?", courseID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count modules: %w", err)
	}
	return count, nil
}

// Search searches for modules by title or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []models.Module: Slice of matching modules
//   - int64: Total count of matching modules
//   - error: Error if query fails
func (mr *ModuleRepository) Search(query string, page, limit int) ([]models.Module, int64, error) {
	var modules []models.Module
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := mr.db.Model(&models.Module{}).Where(
		mr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count modules: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := mr.db.Where(
		mr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("created_at DESC").Find(&modules).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search modules: %w", err)
	}

	return modules, total, nil
}
