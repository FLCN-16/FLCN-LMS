package service

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// LessonNoteService handles lesson note business logic
type LessonNoteService struct {
	noteRepo *repository.LessonNoteRepository
}

// NewLessonNoteService creates a new LessonNoteService
func NewLessonNoteService(noteRepo *repository.LessonNoteRepository) *LessonNoteService {
	return &LessonNoteService{noteRepo: noteRepo}
}

// LessonNoteResponse is the API response for a lesson note
type LessonNoteResponse struct {
	ID               uuid.UUID `json:"id"`
	StudentID        uuid.UUID `json:"student_id"`
	LessonID         uuid.UUID `json:"lesson_id"`
	Content          string    `json:"content"`
	TimestampSeconds *int      `json:"timestamp_seconds"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CreateNoteRequest is the request body for creating a note
type CreateNoteRequest struct {
	Content          string `json:"content" binding:"required,min=1"`
	TimestampSeconds *int   `json:"timestamp_seconds"`
}

// UpdateNoteRequest is the request body for updating a note
type UpdateNoteRequest struct {
	Content          *string `json:"content"`
	TimestampSeconds *int    `json:"timestamp_seconds"`
}

// CreateNote creates a new note for a lesson
func (s *LessonNoteService) CreateNote(studentID, lessonID uuid.UUID, req *CreateNoteRequest) (*LessonNoteResponse, error) {
	log.Printf("[NoteService] Creating note for student %s on lesson %s", studentID, lessonID)

	note := &models.LessonNote{
		StudentID:        studentID,
		LessonID:         lessonID,
		Content:          req.Content,
		TimestampSeconds: req.TimestampSeconds,
	}

	if err := s.noteRepo.Create(note); err != nil {
		return nil, fmt.Errorf("failed to create note: %w", err)
	}

	return noteToResponse(note), nil
}

// GetLessonNotes returns all notes for a student on a lesson, sorted by timestamp then creation time
func (s *LessonNoteService) GetLessonNotes(lessonID, studentID uuid.UUID) ([]LessonNoteResponse, error) {
	notes, err := s.noteRepo.GetByLessonAndStudent(lessonID, studentID)
	if err != nil {
		return nil, err
	}

	result := make([]LessonNoteResponse, 0, len(notes))
	for _, n := range notes {
		result = append(result, *noteToResponse(&n))
	}
	return result, nil
}

// GetMyNotes returns all notes for a student across all lessons (paginated)
func (s *LessonNoteService) GetMyNotes(studentID uuid.UUID, page, limit int) ([]LessonNoteResponse, int64, error) {
	notes, total, err := s.noteRepo.GetByStudent(studentID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	result := make([]LessonNoteResponse, 0, len(notes))
	for _, n := range notes {
		result = append(result, *noteToResponse(&n))
	}
	return result, total, nil
}

// UpdateNote updates a note's content or timestamp
func (s *LessonNoteService) UpdateNote(noteID, studentID uuid.UUID, req *UpdateNoteRequest) (*LessonNoteResponse, error) {
	note, err := s.noteRepo.GetByID(noteID)
	if err != nil {
		return nil, err
	}

	// Ownership check
	if note.StudentID != studentID {
		return nil, fmt.Errorf("note not found or not owned by student")
	}

	if req.Content != nil {
		note.Content = *req.Content
	}
	if req.TimestampSeconds != nil {
		note.TimestampSeconds = req.TimestampSeconds
	}

	if err := s.noteRepo.Update(note); err != nil {
		return nil, err
	}

	return noteToResponse(note), nil
}

// DeleteNote deletes a note owned by the student
func (s *LessonNoteService) DeleteNote(noteID, studentID uuid.UUID) error {
	return s.noteRepo.Delete(noteID, studentID)
}

func noteToResponse(n *models.LessonNote) *LessonNoteResponse {
	return &LessonNoteResponse{
		ID:               n.ID,
		StudentID:        n.StudentID,
		LessonID:         n.LessonID,
		Content:          n.Content,
		TimestampSeconds: n.TimestampSeconds,
		CreatedAt:        n.CreatedAt,
		UpdatedAt:        n.UpdatedAt,
	}
}
