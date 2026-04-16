package service

import (
	"errors"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
)

// LessonService handles lesson business logic
type LessonService struct {
	lessonRepo         *repository.LessonRepository
	moduleRepo         *repository.ModuleRepository
	lessonProgressRepo *repository.LessonProgressRepository
}

// NewLessonService creates a new lesson service instance
// Parameters:
//   - lessonRepo: Lesson repository for database operations
//   - moduleRepo: Module repository for database operations
//   - lessonProgressRepo: Lesson progress repository for database operations
//
// Returns:
//   - *LessonService: New lesson service instance
func NewLessonService(
	lessonRepo *repository.LessonRepository,
	moduleRepo *repository.ModuleRepository,
	lessonProgressRepo *repository.LessonProgressRepository,
) *LessonService {
	return &LessonService{
		lessonRepo:         lessonRepo,
		moduleRepo:         moduleRepo,
		lessonProgressRepo: lessonProgressRepo,
	}
}

// CreateLessonRequest represents a lesson creation request
type CreateLessonRequest struct {
	ModuleID        uuid.UUID `json:"module_id" binding:"required"`
	Title           string    `json:"title" binding:"required,min=3,max=255"`
	Description     string    `json:"description" binding:"required,min=10"`
	ContentType     string    `json:"content_type" binding:"required,oneof=video text pdf audio"`
	ContentURL      string    `json:"content_url" binding:"required,url"`
	DurationSeconds int       `json:"duration_seconds" binding:"min=0"`
	OrderIndex      int       `json:"order_index" binding:"min=0"`
	IsPublished     bool      `json:"is_published"`
}

// UpdateLessonRequest represents a lesson update request
type UpdateLessonRequest struct {
	Title           string `json:"title" binding:"omitempty,min=3,max=255"`
	Description     string `json:"description" binding:"omitempty,min=10"`
	ContentType     string `json:"content_type" binding:"omitempty,oneof=video text pdf audio"`
	ContentURL      string `json:"content_url" binding:"omitempty,url"`
	DurationSeconds *int   `json:"duration_seconds" binding:"omitempty,min=0"`
	OrderIndex      *int   `json:"order_index" binding:"omitempty,min=0"`
	IsPublished     *bool  `json:"is_published"`
}

// LessonResponse represents a lesson in API responses
type LessonResponse struct {
	ID              uuid.UUID `json:"id"`
	ModuleID        uuid.UUID `json:"module_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	ContentType     string    `json:"content_type"`
	ContentURL      string    `json:"content_url"`
	DurationSeconds int       `json:"duration_seconds"`
	OrderIndex      int       `json:"order_index"`
	IsPublished     bool      `json:"is_published"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// LessonDetailResponse represents detailed lesson information
type LessonDetailResponse struct {
	ID              uuid.UUID               `json:"id"`
	ModuleID        uuid.UUID               `json:"module_id"`
	Title           string                  `json:"title"`
	Description     string                  `json:"description"`
	ContentType     string                  `json:"content_type"`
	ContentURL      string                  `json:"content_url"`
	DurationSeconds int                     `json:"duration_seconds"`
	OrderIndex      int                     `json:"order_index"`
	IsPublished     bool                    `json:"is_published"`
	CreatedAt       time.Time               `json:"created_at"`
	UpdatedAt       time.Time               `json:"updated_at"`
	Progress        *LessonProgressResponse `json:"progress,omitempty"`
}

// LessonProgressResponse represents student progress on a lesson
type LessonProgressResponse struct {
	ID               uuid.UUID  `json:"id"`
	LessonID         uuid.UUID  `json:"lesson_id"`
	StudentID        uuid.UUID  `json:"student_id"`
	WatchedAt        *time.Time `json:"watched_at,omitempty"`
	WatchTimeSeconds int        `json:"watch_time_seconds"`
	IsCompleted      bool       `json:"is_completed"`
}

// CreateLesson creates a new lesson
// Parameters:
//   - req: Lesson creation request
//
// Returns:
//   - *LessonResponse: Created lesson details
//   - error: Error if creation fails
func (ls *LessonService) CreateLesson(req *CreateLessonRequest) (*LessonResponse, error) {
	log.Println("[Lesson Service] Creating new lesson:", req.Title)

	// Validate input
	if req.ModuleID == uuid.Nil || req.Title == "" || req.Description == "" || req.ContentURL == "" {
		return nil, errors.New("module_id, title, description, and content_url are required")
	}

	// Verify module exists
	_, err := ls.moduleRepo.GetByID(req.ModuleID)
	if err != nil {
		log.Printf("[Lesson Service] Module not found: %v", err)
		return nil, fmt.Errorf("module not found: %w", err)
	}

	// Validate content type
	validContentTypes := []string{"video", "text", "pdf", "audio"}
	isValidType := false
	for _, ct := range validContentTypes {
		if req.ContentType == ct {
			isValidType = true
			break
		}
	}
	if !isValidType {
		return nil, fmt.Errorf("invalid content type: %s", req.ContentType)
	}

	// Create lesson
	lesson := &models.Lesson{
		ID:              uuid.New(),
		ModuleID:        req.ModuleID,
		Title:           req.Title,
		Description:     req.Description,
		ContentType:     req.ContentType,
		ContentURL:      req.ContentURL,
		DurationSeconds: req.DurationSeconds,
		OrderIndex:      req.OrderIndex,
		IsPublished:     req.IsPublished,
	}

	if err := ls.lessonRepo.Create(lesson); err != nil {
		log.Printf("[Lesson Service] Failed to create lesson: %v", err)
		return nil, fmt.Errorf("failed to create lesson: %w", err)
	}

	log.Printf("[Lesson Service] Lesson created successfully: %s", lesson.ID)
	return lessonToResponse(lesson), nil
}

// GetLesson retrieves a lesson by ID
// Parameters:
//   - id: Lesson UUID
//
// Returns:
//   - *LessonResponse: Lesson details
//   - error: Error if lesson not found
func (ls *LessonService) GetLesson(id uuid.UUID) (*LessonResponse, error) {
	lesson, err := ls.lessonRepo.GetByID(id)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson %s: %v", id, err)
		return nil, err
	}
	return lessonToResponse(lesson), nil
}

// ListLessons retrieves paginated list of lessons
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []LessonResponse: List of lessons
//   - int64: Total count of lessons
//   - error: Error if query fails
func (ls *LessonService) ListLessons(page, limit int) ([]LessonResponse, int64, error) {
	lessons, total, err := ls.lessonRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Lesson Service] Failed to list lessons: %v", err)
		return nil, 0, err
	}

	var responses []LessonResponse
	for _, lesson := range lessons {
		responses = append(responses, *lessonToResponse(&lesson))
	}

	return responses, total, nil
}

// GetLessonsByModule retrieves all lessons for a specific module
// Parameters:
//   - moduleID: Module UUID
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []LessonResponse: List of module lessons
//   - int64: Total count of module lessons
//   - error: Error if query fails
func (ls *LessonService) GetLessonsByModule(moduleID uuid.UUID, page, limit int) ([]LessonResponse, int64, error) {
	lessons, total, err := ls.lessonRepo.GetByModuleID(moduleID, page, limit)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lessons for module %s: %v", moduleID, err)
		return nil, 0, err
	}

	var responses []LessonResponse
	for _, lesson := range lessons {
		responses = append(responses, *lessonToResponse(&lesson))
	}

	return responses, total, nil
}

// UpdateLesson updates an existing lesson
// Parameters:
//   - id: Lesson UUID
//   - req: Update request with partial lesson data
//
// Returns:
//   - *LessonResponse: Updated lesson details
//   - error: Error if update fails
func (ls *LessonService) UpdateLesson(id uuid.UUID, req *UpdateLessonRequest) (*LessonResponse, error) {
	log.Printf("[Lesson Service] Updating lesson: %s", id)

	// Get existing lesson
	lesson, err := ls.lessonRepo.GetByID(id)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if req.Title != "" {
		lesson.Title = req.Title
	}
	if req.Description != "" {
		lesson.Description = req.Description
	}
	if req.ContentType != "" {
		lesson.ContentType = req.ContentType
	}
	if req.ContentURL != "" {
		lesson.ContentURL = req.ContentURL
	}
	if req.DurationSeconds != nil {
		lesson.DurationSeconds = *req.DurationSeconds
	}
	if req.OrderIndex != nil {
		lesson.OrderIndex = *req.OrderIndex
	}
	if req.IsPublished != nil {
		lesson.IsPublished = *req.IsPublished
	}

	if err := ls.lessonRepo.Update(lesson); err != nil {
		log.Printf("[Lesson Service] Failed to update lesson: %v", err)
		return nil, fmt.Errorf("failed to update lesson: %w", err)
	}

	log.Printf("[Lesson Service] Lesson updated successfully: %s", id)
	return lessonToResponse(lesson), nil
}

// DeleteLesson deletes a lesson
// Parameters:
//   - id: Lesson UUID
//
// Returns:
//   - error: Error if deletion fails
func (ls *LessonService) DeleteLesson(id uuid.UUID) error {
	log.Printf("[Lesson Service] Deleting lesson: %s", id)

	// Verify lesson exists
	_, err := ls.lessonRepo.GetByID(id)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson %s: %v", id, err)
		return err
	}

	if err := ls.lessonRepo.Delete(id); err != nil {
		log.Printf("[Lesson Service] Failed to delete lesson: %v", err)
		return fmt.Errorf("failed to delete lesson: %w", err)
	}

	log.Printf("[Lesson Service] Lesson deleted successfully: %s", id)
	return nil
}

// SearchLessons searches for lessons by title or description
// Parameters:
//   - query: Search query
//   - page: Page number (1-based)
//   - limit: Number of lessons per page
//
// Returns:
//   - []LessonResponse: List of matching lessons
//   - int64: Total count of matching lessons
//   - error: Error if query fails
func (ls *LessonService) SearchLessons(query string, page, limit int) ([]LessonResponse, int64, error) {
	lessons, total, err := ls.lessonRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Lesson Service] Failed to search lessons: %v", err)
		return nil, 0, err
	}

	var responses []LessonResponse
	for _, lesson := range lessons {
		responses = append(responses, *lessonToResponse(&lesson))
	}

	return responses, total, nil
}

// MarkLessonComplete marks a lesson as completed by a student
// Parameters:
//   - lessonID: Lesson UUID
//   - studentID: Student UUID
//   - watchTimeSeconds: Time spent watching/learning (in seconds)
//
// Returns:
//   - *LessonProgressResponse: Updated progress details
//   - error: Error if operation fails
func (ls *LessonService) MarkLessonComplete(lessonID, studentID uuid.UUID, watchTimeSeconds int) (*LessonProgressResponse, error) {
	log.Printf("[Lesson Service] Marking lesson complete: lesson=%s, student=%s", lessonID, studentID)

	// Verify lesson exists
	_, err := ls.lessonRepo.GetByID(lessonID)
	if err != nil {
		log.Printf("[Lesson Service] Lesson not found: %v", err)
		return nil, fmt.Errorf("lesson not found: %w", err)
	}

	// Create or update lesson progress
	now := time.Now()
	progress := &models.LessonProgress{
		ID:               uuid.New(),
		LessonID:         lessonID,
		StudentID:        studentID,
		WatchedAt:        now,
		WatchTimeSeconds: watchTimeSeconds,
		IsCompleted:      true,
	}

	// Note: This assumes the repository handles upsert logic
	if err := ls.lessonProgressRepo.Create(progress); err != nil {
		log.Printf("[Lesson Service] Failed to mark lesson complete: %v", err)
		return nil, fmt.Errorf("failed to mark lesson complete: %w", err)
	}

	log.Printf("[Lesson Service] Lesson marked as complete: %s", lessonID)
	return lessonProgressToResponse(progress), nil
}

// UpdateLessonProgress updates the progress of a student on a lesson
// Parameters:
//   - lessonID: Lesson UUID
//   - studentID: Student UUID
//   - watchTimeSeconds: Time spent watching/learning (in seconds)
//
// Returns:
//   - *LessonProgressResponse: Updated progress details
//   - error: Error if operation fails
func (ls *LessonService) UpdateLessonProgress(lessonID, studentID uuid.UUID, watchTimeSeconds int) (*LessonProgressResponse, error) {
	log.Printf("[Lesson Service] Updating lesson progress: lesson=%s, student=%s", lessonID, studentID)

	// Verify lesson exists
	_, err := ls.lessonRepo.GetByID(lessonID)
	if err != nil {
		log.Printf("[Lesson Service] Lesson not found: %v", err)
		return nil, fmt.Errorf("lesson not found: %w", err)
	}

	// Update progress
	progress := &models.LessonProgress{
		ID:               uuid.New(),
		LessonID:         lessonID,
		StudentID:        studentID,
		WatchTimeSeconds: watchTimeSeconds,
		IsCompleted:      false,
	}

	if err := ls.lessonProgressRepo.Create(progress); err != nil {
		log.Printf("[Lesson Service] Failed to update lesson progress: %v", err)
		return nil, fmt.Errorf("failed to update lesson progress: %w", err)
	}

	log.Printf("[Lesson Service] Lesson progress updated: %s", lessonID)
	return lessonProgressToResponse(progress), nil
}

// PublishLesson publishes a lesson
// Parameters:
//   - id: Lesson UUID
//
// Returns:
//   - *LessonResponse: Published lesson details
//   - error: Error if publishing fails
func (ls *LessonService) PublishLesson(id uuid.UUID) (*LessonResponse, error) {
	log.Printf("[Lesson Service] Publishing lesson: %s", id)

	// Get lesson
	lesson, err := ls.lessonRepo.GetByID(id)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson %s: %v", id, err)
		return nil, err
	}

	// Update publish status
	lesson.IsPublished = true

	if err := ls.lessonRepo.Update(lesson); err != nil {
		log.Printf("[Lesson Service] Failed to publish lesson: %v", err)
		return nil, fmt.Errorf("failed to publish lesson: %w", err)
	}

	log.Printf("[Lesson Service] Lesson published successfully: %s", id)
	return lessonToResponse(lesson), nil
}

// UnpublishLesson unpublishes a lesson
// Parameters:
//   - id: Lesson UUID
//
// Returns:
//   - *LessonResponse: Unpublished lesson details
//   - error: Error if unpublishing fails
func (ls *LessonService) UnpublishLesson(id uuid.UUID) (*LessonResponse, error) {
	log.Printf("[Lesson Service] Unpublishing lesson: %s", id)

	// Get lesson
	lesson, err := ls.lessonRepo.GetByID(id)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson %s: %v", id, err)
		return nil, err
	}

	// Update publish status
	lesson.IsPublished = false

	if err := ls.lessonRepo.Update(lesson); err != nil {
		log.Printf("[Lesson Service] Failed to unpublish lesson: %v", err)
		return nil, fmt.Errorf("failed to unpublish lesson: %w", err)
	}

	log.Printf("[Lesson Service] Lesson unpublished successfully: %s", id)
	return lessonToResponse(lesson), nil
}

// GetLessonCount returns the total number of lessons
// Returns:
//   - int64: Total count of lessons
//   - error: Error if query fails
func (ls *LessonService) GetLessonCount() (int64, error) {
	count, err := ls.lessonRepo.GetLessonCount()
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson count: %v", err)
		return 0, err
	}
	return count, nil
}

// GetLessonCountByModule returns the total number of lessons in a module
// Parameters:
//   - moduleID: Module UUID
//
// Returns:
//   - int64: Total count of lessons in the module
//   - error: Error if query fails
func (ls *LessonService) GetLessonCountByModule(moduleID uuid.UUID) (int64, error) {
	count, err := ls.lessonRepo.GetLessonCountByModule(moduleID)
	if err != nil {
		log.Printf("[Lesson Service] Failed to get lesson count for module: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// lessonToResponse converts a Lesson model to a LessonResponse
func lessonToResponse(lesson *models.Lesson) *LessonResponse {
	return &LessonResponse{
		ID:              lesson.ID,
		ModuleID:        lesson.ModuleID,
		Title:           lesson.Title,
		Description:     lesson.Description,
		ContentType:     lesson.ContentType,
		ContentURL:      lesson.ContentURL,
		DurationSeconds: lesson.DurationSeconds,
		OrderIndex:      lesson.OrderIndex,
		IsPublished:     lesson.IsPublished,
		CreatedAt:       lesson.CreatedAt,
		UpdatedAt:       lesson.UpdatedAt,
	}
}

// lessonProgressToResponse converts a LessonProgress model to a LessonProgressResponse
func lessonProgressToResponse(progress *models.LessonProgress) *LessonProgressResponse {
	return &LessonProgressResponse{
		ID:               progress.ID,
		LessonID:         progress.LessonID,
		StudentID:        progress.StudentID,
		WatchedAt:        &progress.WatchedAt,
		WatchTimeSeconds: progress.WatchTimeSeconds,
		IsCompleted:      progress.IsCompleted,
	}
}
