package repository

import (
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// QuestionOptionRepository handles all database operations for question options
type QuestionOptionRepository struct {
	db *gorm.DB
}

// NewQuestionOptionRepository creates a new question option repository instance
func NewQuestionOptionRepository(db *gorm.DB) *QuestionOptionRepository {
	return &QuestionOptionRepository{db: db}
}

// Create saves a new question option to the database
func (qor *QuestionOptionRepository) Create(option *models.QuestionOption) error {
	if option.ID == uuid.Nil {
		option.ID = uuid.New()
	}
	if err := qor.db.Create(option).Error; err != nil {
		return fmt.Errorf("failed to create question option: %w", err)
	}
	return nil
}

// GetByID retrieves a question option by its UUID
func (qor *QuestionOptionRepository) GetByID(id uuid.UUID) (*models.QuestionOption, error) {
	var option models.QuestionOption
	if err := qor.db.First(&option, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("question option not found")
		}
		return nil, fmt.Errorf("failed to fetch question option: %w", err)
	}
	return &option, nil
}

// GetByQuestionID retrieves all options for a specific question
func (qor *QuestionOptionRepository) GetByQuestionID(questionID uuid.UUID) ([]models.QuestionOption, error) {
	var options []models.QuestionOption
	if err := qor.db.Where("question_id = ?", questionID).Order("order_index ASC").Find(&options).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch question options: %w", err)
	}
	return options, nil
}

// Update updates a question option
func (qor *QuestionOptionRepository) Update(option *models.QuestionOption) error {
	if err := qor.db.Save(option).Error; err != nil {
		return fmt.Errorf("failed to update question option: %w", err)
	}
	return nil
}

// Delete removes a question option
func (qor *QuestionOptionRepository) Delete(id uuid.UUID) error {
	if err := qor.db.Delete(&models.QuestionOption{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete question option: %w", err)
	}
	return nil
}
