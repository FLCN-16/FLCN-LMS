package repository

import (
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AttemptAnswerRepository handles all database operations for attempt answers
type AttemptAnswerRepository struct {
	db *gorm.DB
}

// NewAttemptAnswerRepository creates a new attempt answer repository instance
func NewAttemptAnswerRepository(db *gorm.DB) *AttemptAnswerRepository {
	return &AttemptAnswerRepository{db: db}
}

// Create saves a new attempt answer to the database
func (aar *AttemptAnswerRepository) Create(answer *models.AttemptAnswer) error {
	if answer.ID == uuid.Nil {
		answer.ID = uuid.New()
	}
	if err := aar.db.Create(answer).Error; err != nil {
		return fmt.Errorf("failed to create attempt answer: %w", err)
	}
	return nil
}

// GetByID retrieves an attempt answer by its UUID
func (aar *AttemptAnswerRepository) GetByID(id uuid.UUID) (*models.AttemptAnswer, error) {
	var answer models.AttemptAnswer
	if err := aar.db.First(&answer, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("attempt answer not found")
		}
		return nil, fmt.Errorf("failed to fetch attempt answer: %w", err)
	}
	return &answer, nil
}

// GetByAttemptID retrieves all answers for a specific attempt
func (aar *AttemptAnswerRepository) GetByAttemptID(attemptID uuid.UUID) ([]models.AttemptAnswer, error) {
	var answers []models.AttemptAnswer
	if err := aar.db.Where("attempt_id = ?", attemptID).Find(&answers).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch attempt answers: %w", err)
	}
	return answers, nil
}

// Update updates an attempt answer
func (aar *AttemptAnswerRepository) Update(answer *models.AttemptAnswer) error {
	if err := aar.db.Save(answer).Error; err != nil {
		return fmt.Errorf("failed to update attempt answer: %w", err)
	}
	return nil
}

// Delete removes an attempt answer
func (aar *AttemptAnswerRepository) Delete(id uuid.UUID) error {
	if err := aar.db.Delete(&models.AttemptAnswer{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete attempt answer: %w", err)
	}
	return nil
}
