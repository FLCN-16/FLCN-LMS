package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AttemptRepository handles all database operations for attempts
type AttemptRepository struct {
	db *gorm.DB
}

// NewAttemptRepository creates a new attempt repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *AttemptRepository: New attempt repository
func NewAttemptRepository(db *gorm.DB) *AttemptRepository {
	return &AttemptRepository{db: db}
}

// Create saves a new attempt to the database
// Parameters:
//   - attempt: The attempt model to create
//
// Returns:
//   - error: Error if creation fails
func (ar *AttemptRepository) Create(attempt *models.Attempt) error {
	if attempt.ID == uuid.Nil {
		attempt.ID = uuid.New()
	}
	if err := ar.db.Create(attempt).Error; err != nil {
		return fmt.Errorf("failed to create attempt: %w", err)
	}
	return nil
}

// GetByID retrieves an attempt by its UUID
// Parameters:
//   - id: The attempt's UUID
//
// Returns:
//   - *models.Attempt: The attempt if found
//   - error: Error if attempt not found or query fails
func (ar *AttemptRepository) GetByID(id uuid.UUID) (*models.Attempt, error) {
	var attempt models.Attempt
	if err := ar.db.First(&attempt, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("attempt not found")
		}
		return nil, fmt.Errorf("failed to fetch attempt: %w", err)
	}
	return &attempt, nil
}

// GetAll retrieves all attempts with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of attempts
//   - int64: Total count of attempts
//   - error: Error if query fails
func (ar *AttemptRepository) GetAll(page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count
	if err := ar.db.Model(&models.Attempt{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch attempts: %w", err)
	}

	return attempts, total, nil
}

// Update updates an existing attempt's information
// Parameters:
//   - attempt: The attempt model with updated values
//
// Returns:
//   - error: Error if update fails
func (ar *AttemptRepository) Update(attempt *models.Attempt) error {
	if err := ar.db.Save(attempt).Error; err != nil {
		return fmt.Errorf("failed to update attempt: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of an attempt
// Parameters:
//   - id: The attempt's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"status": "completed"})
//
// Returns:
//   - error: Error if update fails
func (ar *AttemptRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := ar.db.Model(&models.Attempt{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update attempt: %w", err)
	}
	return nil
}

// Delete removes an attempt from the database
// Parameters:
//   - id: The attempt's UUID
//
// Returns:
//   - error: Error if deletion fails
func (ar *AttemptRepository) Delete(id uuid.UUID) error {
	if err := ar.db.Delete(&models.Attempt{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete attempt: %w", err)
	}
	return nil
}

// GetByStudentID retrieves all attempts by a specific student with pagination
// Parameters:
//   - studentID: The student's UUID
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of attempts
//   - int64: Total count of attempts for the student
//   - error: Error if query fails
func (ar *AttemptRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count for student
	if err := ar.db.Model(&models.Attempt{}).Where("student_id = ?", studentID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("student_id = ?", studentID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch attempts by student: %w", err)
	}

	return attempts, total, nil
}

// GetByTestSeriesID retrieves all attempts for a specific test series with pagination
// Parameters:
//   - testSeriesID: The test series' UUID
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of attempts
//   - int64: Total count of attempts for the test series
//   - error: Error if query fails
func (ar *AttemptRepository) GetByTestSeriesID(testSeriesID uuid.UUID, page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count for test series
	if err := ar.db.Model(&models.Attempt{}).Where("test_series_id = ?", testSeriesID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("test_series_id = ?", testSeriesID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch attempts by test series: %w", err)
	}

	return attempts, total, nil
}

// GetByStatus retrieves all attempts with a specific status with pagination
// Parameters:
//   - status: The attempt status (e.g., "pending", "in_progress", "completed")
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of attempts
//   - int64: Total count of attempts with that status
//   - error: Error if query fails
func (ar *AttemptRepository) GetByStatus(status string, page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count for status
	if err := ar.db.Model(&models.Attempt{}).Where("status = ?", status).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("status = ?", status).Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch attempts by status: %w", err)
	}

	return attempts, total, nil
}

// GetAttemptCount returns the total number of attempts
// Returns:
//   - int64: Total count of attempts
//   - error: Error if query fails
func (ar *AttemptRepository) GetAttemptCount() (int64, error) {
	var count int64
	if err := ar.db.Model(&models.Attempt{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count attempts: %w", err)
	}
	return count, nil
}

// GetAttemptCountByStudent returns the total number of attempts by a student
// Parameters:
//   - studentID: The student's UUID
//
// Returns:
//   - int64: Total count of attempts by the student
//   - error: Error if query fails
func (ar *AttemptRepository) GetAttemptCountByStudent(studentID uuid.UUID) (int64, error) {
	var count int64
	if err := ar.db.Model(&models.Attempt{}).Where("student_id = ?", studentID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count attempts: %w", err)
	}
	return count, nil
}

// GetByStudentAndTestSeries retrieves all attempts for a specific student and test series
// Parameters:
//   - studentID: The student's UUID
//   - testSeriesID: The test series' UUID
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of attempts
//   - int64: Total count of attempts
//   - error: Error if query fails
func (ar *AttemptRepository) GetByStudentAndTestSeries(studentID, testSeriesID uuid.UUID, page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count
	if err := ar.db.Model(&models.Attempt{}).Where("student_id = ? AND test_series_id = ?", studentID, testSeriesID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("student_id = ? AND test_series_id = ?", studentID, testSeriesID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch attempts: %w", err)
	}

	return attempts, total, nil
}

// GetCompletedAttempts retrieves all completed attempts with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of completed attempts
//   - int64: Total count of completed attempts
//   - error: Error if query fails
func (ar *AttemptRepository) GetCompletedAttempts(page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count of completed attempts
	if err := ar.db.Model(&models.Attempt{}).Where("status = ?", "completed").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("status = ?", "completed").Offset(offset).Limit(limit).Order("completed_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch completed attempts: %w", err)
	}

	return attempts, total, nil
}

// GetInProgressAttempts retrieves all in-progress attempts with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of in-progress attempts
//   - int64: Total count of in-progress attempts
//   - error: Error if query fails
func (ar *AttemptRepository) GetInProgressAttempts(page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	// Get total count of in-progress attempts
	if err := ar.db.Model(&models.Attempt{}).Where("status = ?", "in_progress").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.Where("status = ?", "in_progress").Offset(offset).Limit(limit).Order("created_at DESC").Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch in-progress attempts: %w", err)
	}

	return attempts, total, nil
}

// Search searches for attempts by student and test series information
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of attempts per page
//
// Returns:
//   - []models.Attempt: Slice of matching attempts
//   - int64: Total count of matching attempts
//   - error: Error if query fails
func (ar *AttemptRepository) Search(query string, page, limit int) ([]models.Attempt, int64, error) {
	var attempts []models.Attempt
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query - searches by student email or test series title via joins
	if err := ar.db.Model(&models.Attempt{}).
		Joins("LEFT JOIN users ON attempts.student_id = users.id").
		Joins("LEFT JOIN test_series ON attempts.test_series_id = test_series.id").
		Where(
			ar.db.Where("users.email ILIKE ?", searchPattern).
				Or("test_series.title ILIKE ?", searchPattern),
		).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count attempts: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := ar.db.
		Joins("LEFT JOIN users ON attempts.student_id = users.id").
		Joins("LEFT JOIN test_series ON attempts.test_series_id = test_series.id").
		Where(
			ar.db.Where("users.email ILIKE ?", searchPattern).
				Or("test_series.title ILIKE ?", searchPattern),
		).
		Offset(offset).Limit(limit).Order("attempts.created_at DESC").
		Find(&attempts).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search attempts: %w", err)
	}

	return attempts, total, nil
}

// GetLatestByStudentAndTestSeries retrieves the most recent attempt for a student and test series
func (ar *AttemptRepository) GetLatestByStudentAndTestSeries(studentID, testSeriesID uuid.UUID) (*models.Attempt, error) {
	var attempt models.Attempt
	if err := ar.db.Where("student_id = ? AND test_series_id = ?", studentID, testSeriesID).
		Order("created_at DESC").
		First(&attempt).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found is not an error
		}
		return nil, fmt.Errorf("failed to fetch attempt: %w", err)
	}
	return &attempt, nil
}
