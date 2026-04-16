package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// TestSeriesSectionRepository handles all database operations for test series sections
type TestSeriesSectionRepository struct {
	db *gorm.DB
}

// NewTestSeriesSectionRepository creates a new test series section repository instance
func NewTestSeriesSectionRepository(db *gorm.DB) *TestSeriesSectionRepository {
	return &TestSeriesSectionRepository{db: db}
}

// Create saves a new test series section to the database
func (tsr *TestSeriesSectionRepository) Create(section *models.TestSeriesSection) error {
	if section.ID == uuid.Nil {
		section.ID = uuid.New()
	}
	if err := tsr.db.Create(section).Error; err != nil {
		return fmt.Errorf("failed to create test series section: %w", err)
	}
	return nil
}

// GetByID retrieves a test series section by its UUID
func (tsr *TestSeriesSectionRepository) GetByID(id uuid.UUID) (*models.TestSeriesSection, error) {
	var section models.TestSeriesSection
	if err := tsr.db.First(&section, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("test series section not found")
		}
		return nil, fmt.Errorf("failed to fetch test series section: %w", err)
	}
	return &section, nil
}

// GetByTestSeriesID retrieves all sections for a specific test series
func (tsr *TestSeriesSectionRepository) GetByTestSeriesID(testSeriesID uuid.UUID) ([]models.TestSeriesSection, error) {
	var sections []models.TestSeriesSection
	if err := tsr.db.Where("test_series_id = ?", testSeriesID).Order("order_index ASC").Find(&sections).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch sections by test series: %w", err)
	}
	return sections, nil
}

// Update updates an existing test series section
func (tsr *TestSeriesSectionRepository) Update(section *models.TestSeriesSection) error {
	if err := tsr.db.Save(section).Error; err != nil {
		return fmt.Errorf("failed to update test series section: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a test series section
func (tsr *TestSeriesSectionRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := tsr.db.Model(&models.TestSeriesSection{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update test series section: %w", err)
	}
	return nil
}

// Delete removes a test series section from the database
func (tsr *TestSeriesSectionRepository) Delete(id uuid.UUID) error {
	if err := tsr.db.Delete(&models.TestSeriesSection{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete test series section: %w", err)
	}
	return nil
}

// GetNextSectionOrder returns the next sequence number for a section in a test series
func (tsr *TestSeriesSectionRepository) GetNextSectionOrder(testSeriesID uuid.UUID) (int, error) {
	var maxOrder int
	if err := tsr.db.Model(&models.TestSeriesSection{}).Where("test_series_id = ?", testSeriesID).
		Select("COALESCE(MAX(order_index), 0)").
		Row().
		Scan(&maxOrder); err != nil {
		return 0, fmt.Errorf("failed to get next section order: %w", err)
	}
	return maxOrder + 1, nil
}
