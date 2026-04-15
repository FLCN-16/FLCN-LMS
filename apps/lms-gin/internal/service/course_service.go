package service

import (
	"errors"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
)

// CourseService handles course business logic
type CourseService struct {
	courseRepo *repository.CourseRepository
	userRepo   *repository.UserRepository
}

// NewCourseService creates a new course service instance
// Parameters:
//   - courseRepo: Course repository for database operations
//   - userRepo: User repository for database operations
//
// Returns:
//   - *CourseService: New course service instance
func NewCourseService(courseRepo *repository.CourseRepository, userRepo *repository.UserRepository) *CourseService {
	return &CourseService{
		courseRepo: courseRepo,
		userRepo:   userRepo,
	}
}

// CreateCourseRequest represents a course creation request
type CreateCourseRequest struct {
	Title        string    `json:"title" binding:"required,min=1,max=255"`
	Description  string    `json:"description" binding:"required,min=1"`
	ThumbnailURL string    `json:"thumbnail_url" binding:"required,url"`
	InstructorID uuid.UUID `json:"instructor_id" binding:"required"`
	MaxStudents  int32     `json:"max_students" binding:"required,min=1"`
	Price        float64   `json:"price" binding:"required,min=0"`
}

// UpdateCourseRequest represents a course update request
type UpdateCourseRequest struct {
	Title        string   `json:"title" binding:"omitempty,min=1,max=255"`
	Description  string   `json:"description" binding:"omitempty,min=1"`
	ThumbnailURL string   `json:"thumbnail_url" binding:"omitempty,url"`
	MaxStudents  *int32   `json:"max_students" binding:"omitempty,min=1"`
	Price        *float64 `json:"price" binding:"omitempty,min=0"`
	Status       string   `json:"status" binding:"omitempty,oneof=draft published archived"`
	IsFeatured   *bool    `json:"is_featured" binding:"omitempty"`
}

// CourseResponse represents a course in API responses
type CourseResponse struct {
	ID           uuid.UUID `json:"id"`
	Title        string    `json:"title"`
	Slug         string    `json:"slug"`
	Description  string    `json:"description"`
	ThumbnailURL string    `json:"thumbnail_url"`
	InstructorID uuid.UUID `json:"instructor_id"`
	MaxStudents  int32     `json:"max_students"`
	Price        float64   `json:"price"`
	Status       string    `json:"status"`
	IsFeatured   bool      `json:"is_featured"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CourseListResponse represents course list item in API responses
type CourseListResponse struct {
	ID           uuid.UUID `json:"id"`
	Title        string    `json:"title"`
	Slug         string    `json:"slug"`
	Description  string    `json:"description"`
	ThumbnailURL string    `json:"thumbnail_url"`
	Price        float64   `json:"price"`
	Status       string    `json:"status"`
	IsFeatured   bool      `json:"is_featured"`
	CreatedAt    time.Time `json:"created_at"`
}

// CreateCourse creates a new course
// Parameters:
//   - req: Course creation request
//
// Returns:
//   - *CourseResponse: Created course details
//   - error: Error if creation fails
func (cs *CourseService) CreateCourse(req *CreateCourseRequest) (*CourseResponse, error) {
	log.Println("[Course Service] Creating new course:", req.Title)

	// Validate input
	if req.Title == "" || req.Description == "" || req.ThumbnailURL == "" {
		return nil, errors.New("title, description, and thumbnail_url are required")
	}

	// Verify instructor exists
	instructor, err := cs.userRepo.GetByID(req.InstructorID)
	if err != nil {
		log.Printf("[Course Service] Instructor not found: %v", err)
		return nil, fmt.Errorf("instructor not found: %w", err)
	}

	// Verify instructor has faculty or admin role
	if instructor.Role != models.RoleFaculty && instructor.Role != models.RoleAdmin {
		return nil, errors.New("only faculty and admin users can create courses")
	}

	// Generate slug from title
	courseSlug := slug.Make(req.Title)

	// Create course
	course := &models.Course{
		ID:           uuid.New(),
		Title:        req.Title,
		Slug:         courseSlug,
		Description:  req.Description,
		ThumbnailURL: req.ThumbnailURL,
		InstructorID: req.InstructorID,
		MaxStudents:  int(req.MaxStudents),
		Price:        req.Price,
		Status:       "draft",
		IsFeatured:   false,
	}

	if err := cs.courseRepo.Create(course); err != nil {
		log.Printf("[Course Service] Failed to create course: %v", err)
		return nil, fmt.Errorf("failed to create course: %w", err)
	}

	log.Printf("[Course Service] Course created successfully: %s", course.ID)
	return courseToResponse(course), nil
}

// GetCourse retrieves a course by ID
// Parameters:
//   - id: Course UUID
//
// Returns:
//   - *CourseResponse: Course details
//   - error: Error if course not found
func (cs *CourseService) GetCourse(id uuid.UUID) (*CourseResponse, error) {
	course, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return nil, err
	}
	return courseToResponse(course), nil
}

// GetCourseBySlug retrieves a course by slug
// Parameters:
//   - slug: Course slug
//
// Returns:
//   - *CourseResponse: Course details
//   - error: Error if course not found
func (cs *CourseService) GetCourseBySlug(courseSlug string) (*CourseResponse, error) {
	course, err := cs.courseRepo.GetBySlug(courseSlug)
	if err != nil {
		log.Printf("[Course Service] Failed to get course by slug %s: %v", courseSlug, err)
		return nil, err
	}
	return courseToResponse(course), nil
}

// ListCourses retrieves paginated list of courses
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []CourseListResponse: List of courses
//   - int64: Total count of courses
//   - error: Error if query fails
func (cs *CourseService) ListCourses(page, limit int) ([]CourseListResponse, int64, error) {
	courses, total, err := cs.courseRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Course Service] Failed to list courses: %v", err)
		return nil, 0, err
	}

	var responses []CourseListResponse
	for _, course := range courses {
		responses = append(responses, CourseListResponse{
			ID:           course.ID,
			Title:        course.Title,
			Slug:         course.Slug,
			Description:  course.Description,
			ThumbnailURL: course.ThumbnailURL,
			Price:        course.Price,
			Status:       course.Status,
			IsFeatured:   course.IsFeatured,
			CreatedAt:    course.CreatedAt,
		})
	}

	return responses, total, nil
}

// ListInstructorCourses retrieves paginated list of courses by instructor
// Parameters:
//   - instructorID: Instructor UUID
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []CourseListResponse: List of instructor's courses
//   - int64: Total count of instructor's courses
//   - error: Error if query fails
func (cs *CourseService) ListInstructorCourses(instructorID uuid.UUID, page, limit int) ([]CourseListResponse, int64, error) {
	courses, total, err := cs.courseRepo.ListByInstructor(instructorID, page, limit)
	if err != nil {
		log.Printf("[Course Service] Failed to list instructor courses: %v", err)
		return nil, 0, err
	}

	var responses []CourseListResponse
	for _, course := range courses {
		responses = append(responses, CourseListResponse{
			ID:           course.ID,
			Title:        course.Title,
			Slug:         course.Slug,
			Description:  course.Description,
			ThumbnailURL: course.ThumbnailURL,
			Price:        course.Price,
			Status:       course.Status,
			IsFeatured:   course.IsFeatured,
			CreatedAt:    course.CreatedAt,
		})
	}

	return responses, total, nil
}

// ListPublishedCourses retrieves paginated list of published courses
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []CourseListResponse: List of published courses
//   - int64: Total count of published courses
//   - error: Error if query fails
func (cs *CourseService) ListPublishedCourses(page, limit int) ([]CourseListResponse, int64, error) {
	courses, total, err := cs.courseRepo.GetPublishedCourses(page, limit)
	if err != nil {
		log.Printf("[Course Service] Failed to list published courses: %v", err)
		return nil, 0, err
	}

	var responses []CourseListResponse
	for _, course := range courses {
		responses = append(responses, CourseListResponse{
			ID:           course.ID,
			Title:        course.Title,
			Slug:         course.Slug,
			Description:  course.Description,
			ThumbnailURL: course.ThumbnailURL,
			Price:        course.Price,
			Status:       course.Status,
			IsFeatured:   course.IsFeatured,
			CreatedAt:    course.CreatedAt,
		})
	}

	return responses, total, nil
}

// SearchCourses searches for courses by title or description
// Parameters:
//   - query: Search query
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []CourseListResponse: List of matching courses
//   - int64: Total count of matching courses
//   - error: Error if query fails
func (cs *CourseService) SearchCourses(query string, page, limit int) ([]CourseListResponse, int64, error) {
	courses, total, err := cs.courseRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Course Service] Failed to search courses: %v", err)
		return nil, 0, err
	}

	var responses []CourseListResponse
	for _, course := range courses {
		responses = append(responses, CourseListResponse{
			ID:           course.ID,
			Title:        course.Title,
			Slug:         course.Slug,
			Description:  course.Description,
			ThumbnailURL: course.ThumbnailURL,
			Price:        course.Price,
			Status:       course.Status,
			IsFeatured:   course.IsFeatured,
			CreatedAt:    course.CreatedAt,
		})
	}

	return responses, total, nil
}

// UpdateCourse updates an existing course
// Parameters:
//   - id: Course UUID
//   - req: Update request with partial course data
//
// Returns:
//   - *CourseResponse: Updated course details
//   - error: Error if update fails
func (cs *CourseService) UpdateCourse(id uuid.UUID, req *UpdateCourseRequest) (*CourseResponse, error) {
	log.Printf("[Course Service] Updating course: %s", id)

	// Get existing course
	course, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if req.Title != "" {
		course.Title = req.Title
		course.Slug = slug.Make(req.Title)
	}
	if req.Description != "" {
		course.Description = req.Description
	}
	if req.ThumbnailURL != "" {
		course.ThumbnailURL = req.ThumbnailURL
	}
	if req.MaxStudents != nil {
		course.MaxStudents = int(*req.MaxStudents)
	}
	if req.Price != nil {
		course.Price = *req.Price
	}
	if req.Status != "" {
		course.Status = req.Status
	}
	if req.IsFeatured != nil {
		course.IsFeatured = *req.IsFeatured
	}

	if err := cs.courseRepo.Update(course); err != nil {
		log.Printf("[Course Service] Failed to update course: %v", err)
		return nil, fmt.Errorf("failed to update course: %w", err)
	}

	log.Printf("[Course Service] Course updated successfully: %s", id)
	return courseToResponse(course), nil
}

// DeleteCourse deletes a course
// Parameters:
//   - id: Course UUID
//
// Returns:
//   - error: Error if deletion fails
func (cs *CourseService) DeleteCourse(id uuid.UUID) error {
	log.Printf("[Course Service] Deleting course: %s", id)

	// Verify course exists
	_, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return err
	}

	if err := cs.courseRepo.Delete(id); err != nil {
		log.Printf("[Course Service] Failed to delete course: %v", err)
		return fmt.Errorf("failed to delete course: %w", err)
	}

	log.Printf("[Course Service] Course deleted successfully: %s", id)
	return nil
}

// PublishCourse publishes a course (changes status to published)
// Parameters:
//   - id: Course UUID
//
// Returns:
//   - *CourseResponse: Published course details
//   - error: Error if publishing fails
func (cs *CourseService) PublishCourse(id uuid.UUID) (*CourseResponse, error) {
	log.Printf("[Course Service] Publishing course: %s", id)

	// Get course
	course, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return nil, err
	}

	// Update status to published
	course.Status = "published"

	if err := cs.courseRepo.Update(course); err != nil {
		log.Printf("[Course Service] Failed to publish course: %v", err)
		return nil, fmt.Errorf("failed to publish course: %w", err)
	}

	log.Printf("[Course Service] Course published successfully: %s", id)
	return courseToResponse(course), nil
}

// ArchiveCourse archives a course (changes status to archived)
// Parameters:
//   - id: Course UUID
//
// Returns:
//   - *CourseResponse: Archived course details
//   - error: Error if archiving fails
func (cs *CourseService) ArchiveCourse(id uuid.UUID) (*CourseResponse, error) {
	log.Printf("[Course Service] Archiving course: %s", id)

	// Get course
	course, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return nil, err
	}

	// Update status to archived
	course.Status = "archived"

	if err := cs.courseRepo.Update(course); err != nil {
		log.Printf("[Course Service] Failed to archive course: %v", err)
		return nil, fmt.Errorf("failed to archive course: %w", err)
	}

	log.Printf("[Course Service] Course archived successfully: %s", id)
	return courseToResponse(course), nil
}

// SetFeatured toggles the featured status of a course
// Parameters:
//   - id: Course UUID
//   - featured: Whether the course should be featured
//
// Returns:
//   - *CourseResponse: Updated course details
//   - error: Error if update fails
func (cs *CourseService) SetFeatured(id uuid.UUID, featured bool) (*CourseResponse, error) {
	log.Printf("[Course Service] Setting featured status for course: %s to %v", id, featured)

	// Get course
	course, err := cs.courseRepo.GetByID(id)
	if err != nil {
		log.Printf("[Course Service] Failed to get course %s: %v", id, err)
		return nil, err
	}

	// Update featured status
	course.IsFeatured = featured

	if err := cs.courseRepo.Update(course); err != nil {
		log.Printf("[Course Service] Failed to update course featured status: %v", err)
		return nil, fmt.Errorf("failed to update course: %w", err)
	}

	log.Printf("[Course Service] Course featured status updated successfully: %s", id)
	return courseToResponse(course), nil
}

// GetCourseCount returns the total number of courses
// Returns:
//   - int64: Total count of courses
//   - error: Error if query fails
func (cs *CourseService) GetCourseCount() (int64, error) {
	count, err := cs.courseRepo.GetCourseCount()
	if err != nil {
		log.Printf("[Course Service] Failed to get course count: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// courseToResponse converts a Course model to a CourseResponse
func courseToResponse(course *models.Course) *CourseResponse {
	return &CourseResponse{
		ID:           course.ID,
		Title:        course.Title,
		Slug:         course.Slug,
		Description:  course.Description,
		ThumbnailURL: course.ThumbnailURL,
		InstructorID: course.InstructorID,
		MaxStudents:  int32(course.MaxStudents),
		Price:        course.Price,
		Status:       course.Status,
		IsFeatured:   course.IsFeatured,
		CreatedAt:    course.CreatedAt,
		UpdatedAt:    course.UpdatedAt,
	}
}
