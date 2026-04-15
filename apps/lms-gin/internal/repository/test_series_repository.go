package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// TestSeriesRepository handles all database operations for test series
type TestSeriesRepository struct {
	db *gorm.DB
}

// NewTestSeriesRepository creates a new test series repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *TestSeriesRepository: New test series repository
func NewTestSeriesRepository(db *gorm.DB) *TestSeriesRepository {
	return &TestSeriesRepository{db: db}
}

// Create saves a new test series to the database
// Parameters:
//   - testSeries: The test series model to create
//
// Returns:
//   - error: Error if creation fails
func (tsr *TestSeriesRepository) Create(testSeries *models.TestSeries) error {
	if testSeries.ID == uuid.Nil {
		testSeries.ID = uuid.New()
	}
	if err := tsr.db.Create(testSeries).Error; err != nil {
		return fmt.Errorf("failed to create test series: %w", err)
	}
	return nil
}

// GetByID retrieves a test series by its UUID
// Parameters:
//   - id: The test series's UUID
//
// Returns:
//   - *models.TestSeries: The test series if found
//   - error: Error if test series not found or query fails
func (tsr *TestSeriesRepository) GetByID(id uuid.UUID) (*models.TestSeries, error) {
	var testSeries models.TestSeries
	if err := tsr.db.First(&testSeries, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("test series not found")
		}
		return nil, fmt.Errorf("failed to fetch test series: %w", err)
	}
	return &testSeries, nil
}

// GetAll retrieves all test series with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []models.TestSeries: Slice of test series
//   - int64: Total count of test series
//   - error: Error if query fails
func (tsr *TestSeriesRepository) GetAll(page, limit int) ([]models.TestSeries, int64, error) {
	var testSeriesList []models.TestSeries
	var total int64

	// Get total count
	if err := tsr.db.Model(&models.TestSeries{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count test series: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := tsr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&testSeriesList).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch test series: %w", err)
	}

	return testSeriesList, total, nil
}

// Update updates an existing test series's information
// Parameters:
//   - testSeries: The test series model with updated values
//
// Returns:
//   - error: Error if update fails
func (tsr *TestSeriesRepository) Update(testSeries *models.TestSeries) error {
	if err := tsr.db.Save(testSeries).Error; err != nil {
		return fmt.Errorf("failed to update test series: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a test series
// Parameters:
//   - id: The test series's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"title": "New Title"})
//
// Returns:
//   - error: Error if update fails
func (tsr *TestSeriesRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := tsr.db.Model(&models.TestSeries{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update test series: %w", err)
	}
	return nil
}

// Delete removes a test series from the database
// Parameters:
//   - id: The test series's UUID
//
// Returns:
//   - error: Error if deletion fails
func (tsr *TestSeriesRepository) Delete(id uuid.UUID) error {
	if err := tsr.db.Delete(&models.TestSeries{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete test series: %w", err)
	}
	return nil
}

// GetBySlug retrieves a test series by its slug
// Parameters:
//   - slug: The test series's slug
//
// Returns:
//   - *models.TestSeries: The test series if found
//   - error: Error if test series not found or query fails
func (tsr *TestSeriesRepository) GetBySlug(slug string) (*models.TestSeries, error) {
	var testSeries models.TestSeries
	if err := tsr.db.First(&testSeries, "slug = ?", slug).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("test series not found")
		}
		return nil, fmt.Errorf("failed to fetch test series by slug: %w", err)
	}
	return &testSeries, nil
}

// GetTestSeriesCount returns the total number of test series
// Returns:
//   - int64: Total count of test series
//   - error: Error if query fails
func (tsr *TestSeriesRepository) GetTestSeriesCount() (int64, error) {
	var count int64
	if err := tsr.db.Model(&models.TestSeries{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count test series: %w", err)
	}
	return count, nil
}

// Search searches for test series by title or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []models.TestSeries: Slice of matching test series
//   - int64: Total count of matching test series
//   - error: Error if query fails
func (tsr *TestSeriesRepository) Search(query string, page, limit int) ([]models.TestSeries, int64, error) {
	var testSeriesList []models.TestSeries
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := tsr.db.Model(&models.TestSeries{}).Where(
		tsr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count test series: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := tsr.db.Where(
		tsr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("created_at DESC").Find(&testSeriesList).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search test series: %w", err)
	}

	return testSeriesList, total, nil
}

// GetPublishedTestSeries retrieves all published test series with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []models.TestSeries: Slice of published test series
//   - int64: Total count of published test series
//   - error: Error if query fails
func (tsr *TestSeriesRepository) GetPublishedTestSeries(page, limit int) ([]models.TestSeries, int64, error) {
	var testSeriesList []models.TestSeries
	var total int64

	// Get total count of published test series
	if err := tsr.db.Model(&models.TestSeries{}).Where("is_published = ?", true).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count published test series: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := tsr.db.Where("is_published = ?", true).Offset(offset).Limit(limit).Order("created_at DESC").Find(&testSeriesList).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch published test series: %w", err)
	}

	return testSeriesList, total, nil
}

// GetByCourseID retrieves all test series for a specific course with pagination
// Parameters:
//   - courseID: The course's UUID
//   - page: Page number (1-based)
//   - limit: Number of test series per page
//
// Returns:
//   - []models.TestSeries: Slice of test series
//   - int64: Total count of test series for the course
//   - error: Error if query fails
func (tsr *TestSeriesRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.TestSeries, int64, error) {
	var testSeriesList []models.TestSeries
	var total int64

	// Get total count for course
	if err := tsr.db.Model(&models.TestSeries{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count test series: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := tsr.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&testSeriesList).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch test series by course: %w", err)
	}

	return testSeriesList, total, nil
}
