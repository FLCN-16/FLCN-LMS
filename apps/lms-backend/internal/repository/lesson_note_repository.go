package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LessonNoteRepository handles database operations for lesson notes
type LessonNoteRepository struct {
	db *gorm.DB
}

// NewLessonNoteRepository creates a new LessonNoteRepository
func NewLessonNoteRepository(db *gorm.DB) *LessonNoteRepository {
	return &LessonNoteRepository{db: db}
}

// Create saves a new lesson note
func (r *LessonNoteRepository) Create(note *models.LessonNote) error {
	if note.ID == uuid.Nil {
		note.ID = uuid.New()
	}
	if err := r.db.Create(note).Error; err != nil {
		return fmt.Errorf("failed to create lesson note: %w", err)
	}
	return nil
}

// GetByID retrieves a note by ID
func (r *LessonNoteRepository) GetByID(id uuid.UUID) (*models.LessonNote, error) {
	var note models.LessonNote
	if err := r.db.First(&note, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("note not found")
		}
		return nil, fmt.Errorf("failed to fetch note: %w", err)
	}
	return &note, nil
}

// GetByLessonAndStudent retrieves all notes for a student on a specific lesson, ordered by timestamp
func (r *LessonNoteRepository) GetByLessonAndStudent(lessonID, studentID uuid.UUID) ([]models.LessonNote, error) {
	var notes []models.LessonNote
	if err := r.db.
		Where("lesson_id = ? AND student_id = ?", lessonID, studentID).
		Order("COALESCE(timestamp_seconds, 2147483647) ASC, created_at ASC").
		Find(&notes).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch lesson notes: %w", err)
	}
	return notes, nil
}

// GetByStudent retrieves all notes for a student across all lessons (paginated)
func (r *LessonNoteRepository) GetByStudent(studentID uuid.UUID, page, limit int) ([]models.LessonNote, int64, error) {
	var notes []models.LessonNote
	var total int64
	offset := (page - 1) * limit

	query := r.db.Model(&models.LessonNote{}).Where("student_id = ?", studentID)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count notes: %w", err)
	}
	if err := query.
		Preload("Lesson").
		Order("created_at DESC").
		Offset(offset).Limit(limit).
		Find(&notes).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch notes: %w", err)
	}
	return notes, total, nil
}

// Update updates a lesson note
func (r *LessonNoteRepository) Update(note *models.LessonNote) error {
	if err := r.db.Save(note).Error; err != nil {
		return fmt.Errorf("failed to update note: %w", err)
	}
	return nil
}

// Delete deletes a note — only if it belongs to the given student
func (r *LessonNoteRepository) Delete(id, studentID uuid.UUID) error {
	result := r.db.Delete(&models.LessonNote{}, "id = ? AND student_id = ?", id, studentID)
	if result.Error != nil {
		return fmt.Errorf("failed to delete note: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("note not found or not owned by student")
	}
	return nil
}
