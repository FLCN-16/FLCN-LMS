package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StudyMaterialRepository handles all database operations for study materials
type StudyMaterialRepository struct {
	db *gorm.DB
}

// NewStudyMaterialRepository creates a new study material repository instance
func NewStudyMaterialRepository(db *gorm.DB) *StudyMaterialRepository {
	return &StudyMaterialRepository{db: db}
}

// Create saves a new study material to the database
func (sr *StudyMaterialRepository) Create(material *models.StudyMaterial) error {
	if material.ID == uuid.Nil {
		material.ID = uuid.New()
	}
	if err := sr.db.Create(material).Error; err != nil {
		return fmt.Errorf("failed to create study material: %w", err)
	}
	return nil
}

// GetByID retrieves a study material by its UUID
func (sr *StudyMaterialRepository) GetByID(id uuid.UUID) (*models.StudyMaterial, error) {
	var material models.StudyMaterial
	if err := sr.db.First(&material, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("study material not found")
		}
		return nil, fmt.Errorf("failed to fetch study material: %w", err)
	}
	return &material, nil
}

// GetAll retrieves all study materials with pagination
func (sr *StudyMaterialRepository) GetAll(page, limit int) ([]models.StudyMaterial, int64, error) {
	var materials []models.StudyMaterial
	var total int64

	// Get total count
	if err := sr.db.Model(&models.StudyMaterial{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count study materials: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := sr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&materials).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch study materials: %w", err)
	}

	return materials, total, nil
}

// GetByCourseID retrieves all study materials for a specific course with pagination
func (sr *StudyMaterialRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.StudyMaterial, int64, error) {
	var materials []models.StudyMaterial
	var total int64

	// Get total count
	if err := sr.db.Model(&models.StudyMaterial{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count study materials: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := sr.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&materials).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch study materials: %w", err)
	}

	return materials, total, nil
}

// Update updates an existing study material's information
func (sr *StudyMaterialRepository) Update(material *models.StudyMaterial) error {
	if err := sr.db.Save(material).Error; err != nil {
		return fmt.Errorf("failed to update study material: %w", err)
	}
	return nil
}

// Delete removes a study material from the database
func (sr *StudyMaterialRepository) Delete(id uuid.UUID) error {
	if err := sr.db.Delete(&models.StudyMaterial{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete study material: %w", err)
	}
	return nil
}
