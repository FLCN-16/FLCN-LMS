package repository

import (
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LessonProgressRepository handles all database operations for lesson progress
type LessonProgressRepository struct {
	db *gorm.DB
}

// NewLessonProgressRepository creates a new lesson progress repository instance
func NewLessonProgressRepository(db *gorm.DB) *LessonProgressRepository {
	return &LessonProgressRepository{db: db}
}

// Create saves a new lesson progress record
func (lpr *LessonProgressRepository) Create(progress *models.LessonProgress) error {
	if progress.ID == uuid.Nil {
		progress.ID = uuid.New()
	}
	if err := lpr.db.Create(progress).Error; err != nil {
		return fmt.Errorf("failed to create lesson progress: %w", err)
	}
	return nil
}

// GetByID retrieves lesson progress by ID
func (lpr *LessonProgressRepository) GetByID(id uuid.UUID) (*models.LessonProgress, error) {
	var progress models.LessonProgress
	if err := lpr.db.First(&progress, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("lesson progress not found")
		}
		return nil, fmt.Errorf("failed to fetch lesson progress: %w", err)
	}
	return &progress, nil
}

// GetByStudentAndLesson retrieves progress for a specific student and lesson
func (lpr *LessonProgressRepository) GetByStudentAndLesson(studentID, lessonID uuid.UUID) (*models.LessonProgress, error) {
	var progress models.LessonProgress
	if err := lpr.db.Where("student_id = ? AND lesson_id = ?", studentID, lessonID).First(&progress).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found is not an error
		}
		return nil, fmt.Errorf("failed to fetch lesson progress: %w", err)
	}
	return &progress, nil
}

// Update updates lesson progress
func (lpr *LessonProgressRepository) Update(progress *models.LessonProgress) error {
	if err := lpr.db.Save(progress).Error; err != nil {
		return fmt.Errorf("failed to update lesson progress: %w", err)
	}
	return nil
}

// Delete removes lesson progress
func (lpr *LessonProgressRepository) Delete(id uuid.UUID) error {
	if err := lpr.db.Delete(&models.LessonProgress{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete lesson progress: %w", err)
	}
	return nil
}
