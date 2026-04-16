package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LessonRepository handles all database operations for lessons
type LessonRepository struct {
	db *gorm.DB
}

// NewLessonRepository creates a new lesson repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *LessonRepository: New lesson repository
func NewLessonRepository(db *gorm.DB) *LessonRepository {
	return &LessonRepository{db: db}
}

// Create saves a new lesson to the database
// Parameters:
//   - lesson: The lesson model to create
//
// Returns:
//   - error: Error if creation fails
func (lr *LessonRepository) Create(lesson *models.Lesson) error {
	if lesson.ID == uuid.Nil {
		lesson.ID = uuid.New()
	}
	if err := lr.db.Create(lesson).Error; err != nil {
		return fmt.Errorf("failed to create lesson: %w", err)
	}
	return nil
}

// GetByID retrieves a lesson by its UUID
// Parameters:
//   - id: The lesson's UUID
//
// Returns:
//   - *models.Lesson: The lesson if found
//   - error: Error if lesson not found or query fails
func (lr *LessonRepository) GetByID(id uuid.UUID) (*models.Lesson, error) {
	var lesson models.Lesson
	if err := lr.db.First(&lesson, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("lesson not found")
		}
		return nil, fmt.Errorf("failed to fetch lesson: %w", err)
	}
	return &lesson, nil
}

// GetAll retrieves all lessons with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []models.Lesson: Slice of lessons
//   - int64: Total count of lessons
//   - error: Error if query fails
func (lr *LessonRepository) GetAll(page, limit int) ([]models.Lesson, int64, error) {
	var lessons []models.Lesson
	var total int64

	// Get total count
	if err := lr.db.Model(&models.Lesson{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count lessons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lr.db.Offset(offset).Limit(limit).Order("sequence_number ASC").Find(&lessons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch lessons: %w", err)
	}

	return lessons, total, nil
}

// Update updates an existing lesson's information
// Parameters:
//   - lesson: The lesson model with updated values
//
// Returns:
//   - error: Error if update fails
func (lr *LessonRepository) Update(lesson *models.Lesson) error {
	if err := lr.db.Save(lesson).Error; err != nil {
		return fmt.Errorf("failed to update lesson: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a lesson
// Parameters:
//   - id: The lesson's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"title": "New Title"})
//
// Returns:
//   - error: Error if update fails
func (lr *LessonRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := lr.db.Model(&models.Lesson{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update lesson: %w", err)
	}
	return nil
}

// Delete removes a lesson from the database
// Parameters:
//   - id: The lesson's UUID
//
// Returns:
//   - error: Error if deletion fails
func (lr *LessonRepository) Delete(id uuid.UUID) error {
	if err := lr.db.Delete(&models.Lesson{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete lesson: %w", err)
	}
	return nil
}

// GetByModuleID retrieves all lessons for a specific module with pagination
// Parameters:
//   - moduleID: The module's UUID
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []models.Lesson: Slice of lessons
//   - int64: Total count of lessons for the module
//   - error: Error if query fails
func (lr *LessonRepository) GetByModuleID(moduleID uuid.UUID, page, limit int) ([]models.Lesson, int64, error) {
	var lessons []models.Lesson
	var total int64

	// Get total count for module
	if err := lr.db.Model(&models.Lesson{}).Where("module_id = ?", moduleID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count lessons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lr.db.Where("module_id = ?", moduleID).Offset(offset).Limit(limit).Order("sequence_number ASC").Find(&lessons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch lessons by module: %w", err)
	}

	return lessons, total, nil
}

// GetLessonCount returns the total number of lessons
// Returns:
//   - int64: Total count of lessons
//   - error: Error if query fails
func (lr *LessonRepository) GetLessonCount() (int64, error) {
	var count int64
	if err := lr.db.Model(&models.Lesson{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count lessons: %w", err)
	}
	return count, nil
}

// GetLessonCountByModule returns the total number of lessons for a specific module
// Parameters:
//   - moduleID: The module's UUID
//
// Returns:
//   - int64: Total count of lessons for the module
//   - error: Error if query fails
func (lr *LessonRepository) GetLessonCountByModule(moduleID uuid.UUID) (int64, error) {
	var count int64
	if err := lr.db.Model(&models.Lesson{}).Where("module_id = ?", moduleID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count lessons: %w", err)
	}
	return count, nil
}

// Search searches for lessons by title or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []models.Lesson: Slice of matching lessons
//   - int64: Total count of matching lessons
//   - error: Error if query fails
func (lr *LessonRepository) Search(query string, page, limit int) ([]models.Lesson, int64, error) {
	var lessons []models.Lesson
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := lr.db.Model(&models.Lesson{}).Where(
		lr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count lessons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := lr.db.Where(
		lr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("sequence_number ASC").Find(&lessons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search lessons: %w", err)
	}

	return lessons, total, nil
}

// GetNextLessonOrder returns the next sequence number for a lesson in a module
// Parameters:
//   - moduleID: The module's UUID
//
// Returns:
//   - int: Next sequence number
//   - error: Error if query fails
func (lr *LessonRepository) GetNextLessonOrder(moduleID uuid.UUID) (int, error) {
	var maxOrder int
	if err := lr.db.Model(&models.Lesson{}).Where("module_id = ?", moduleID).
		Select("COALESCE(MAX(sequence_number), 0)").
		Row().
		Scan(&maxOrder); err != nil {
		return 0, fmt.Errorf("failed to get next lesson order: %w", err)
	}
	return maxOrder + 1, nil
}
