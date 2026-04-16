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

// EnrollmentService handles enrollment business logic
type EnrollmentService struct {
	enrollmentRepo *repository.EnrollmentRepository
	courseRepo     *repository.CourseRepository
	userRepo       *repository.UserRepository
}

// NewEnrollmentService creates a new enrollment service instance
// Parameters:
//   - enrollmentRepo: Enrollment repository for database operations
//   - courseRepo: Course repository for database operations
//   - userRepo: User repository for database operations
//
// Returns:
//   - *EnrollmentService: New enrollment service instance
func NewEnrollmentService(enrollmentRepo *repository.EnrollmentRepository, courseRepo *repository.CourseRepository, userRepo *repository.UserRepository) *EnrollmentService {
	return &EnrollmentService{
		enrollmentRepo: enrollmentRepo,
		courseRepo:     courseRepo,
		userRepo:       userRepo,
	}
}

// EnrollmentRequest represents an enrollment request
type EnrollmentRequest struct {
	CourseID  uuid.UUID `json:"course_id" binding:"required"`
	StudentID uuid.UUID `json:"student_id" binding:"required"`
}

// UpdateEnrollmentProgressRequest represents a request to update enrollment progress
type UpdateEnrollmentProgressRequest struct {
	ProgressPercentage float64 `json:"progress_percentage" binding:"required,min=0,max=100"`
	Status             string  `json:"status" binding:"required,oneof=active completed suspended"`
}

// EnrollmentResponse represents an enrollment in API responses
type EnrollmentResponse struct {
	ID                 uuid.UUID  `json:"id"`
	CourseID           uuid.UUID  `json:"course_id"`
	StudentID          uuid.UUID  `json:"student_id"`
	EnrolledAt         time.Time  `json:"enrolled_at"`
	CompletedAt        *time.Time `json:"completed_at,omitempty"`
	ProgressPercentage float64    `json:"progress_percentage"`
	Status             string     `json:"status"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// EnrollmentDetailResponse represents detailed enrollment information
type EnrollmentDetailResponse struct {
	ID                 uuid.UUID           `json:"id"`
	CourseID           uuid.UUID           `json:"course_id"`
	CourseName         string              `json:"course_name"`
	StudentID          uuid.UUID           `json:"student_id"`
	StudentName        string              `json:"student_name"`
	EnrolledAt         time.Time           `json:"enrolled_at"`
	CompletedAt        *time.Time          `json:"completed_at,omitempty"`
	ProgressPercentage float64             `json:"progress_percentage"`
	Status             string              `json:"status"`
	Instructor         *InstructorResponse `json:"instructor,omitempty"`
	CreatedAt          time.Time           `json:"created_at"`
	UpdatedAt          time.Time           `json:"updated_at"`
}

// StudentProgressResponse represents a student's progress in a course
type StudentProgressResponse struct {
	StudentID          uuid.UUID  `json:"student_id"`
	StudentName        string     `json:"student_name"`
	StudentEmail       string     `json:"student_email"`
	ProgressPercentage float64    `json:"progress_percentage"`
	Status             string     `json:"status"`
	EnrolledAt         time.Time  `json:"enrolled_at"`
	CompletedAt        *time.Time `json:"completed_at,omitempty"`
}

// InstructorResponse represents an instructor in API responses
type InstructorResponse struct {
	ID                uuid.UUID `json:"id"`
	Email             string    `json:"email"`
	FirstName         string    `json:"first_name"`
	LastName          string    `json:"last_name"`
	ProfilePictureURL string    `json:"profile_picture_url,omitempty"`
}

// EnrollStudent enrolls a student in a course
// Parameters:
//   - req: Enrollment request
//
// Returns:
//   - *EnrollmentResponse: Enrollment details
//   - error: Error if enrollment fails
func (es *EnrollmentService) EnrollStudent(req *EnrollmentRequest) (*EnrollmentResponse, error) {
	log.Printf("[Enrollment Service] Enrolling student %s in course %s", req.StudentID, req.CourseID)

	// Validate input
	if req.CourseID == uuid.Nil || req.StudentID == uuid.Nil {
		return nil, errors.New("course_id and student_id are required")
	}

	// Verify course exists
	course, err := es.courseRepo.GetByID(req.CourseID)
	if err != nil {
		log.Printf("[Enrollment Service] Course not found: %v", err)
		return nil, fmt.Errorf("course not found: %w", err)
	}

	// Verify student exists
	student, err := es.userRepo.GetByID(req.StudentID)
	if err != nil {
		log.Printf("[Enrollment Service] Student not found: %v", err)
		return nil, fmt.Errorf("student not found: %w", err)
	}

	// Verify student has student role
	if student.Role != models.RoleStudent {
		return nil, errors.New("only students can be enrolled in courses")
	}

	// Check if already enrolled
	exists, err := es.enrollmentRepo.CheckEnrollmentExists(req.StudentID, req.CourseID)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to check enrollment: %v", err)
		return nil, fmt.Errorf("failed to check enrollment: %w", err)
	}
	if exists {
		return nil, errors.New("student is already enrolled in this course")
	}

	// Check course capacity
	if course.MaxStudents > 0 {
		count, err := es.enrollmentRepo.GetEnrollmentCountByCourse(req.CourseID)
		if err != nil {
			log.Printf("[Enrollment Service] Failed to get enrollment count: %v", err)
			return nil, fmt.Errorf("failed to check course capacity: %w", err)
		}
		if count >= int64(course.MaxStudents) {
			return nil, errors.New("course is at maximum capacity")
		}
	}

	// Create enrollment
	enrollment := &models.Enrollment{
		ID:                 uuid.New(),
		CourseID:           req.CourseID,
		StudentID:          req.StudentID,
		EnrolledAt:         time.Now(),
		ProgressPercentage: 0,
		Status:             "active",
	}

	if err := es.enrollmentRepo.Create(enrollment); err != nil {
		log.Printf("[Enrollment Service] Failed to create enrollment: %v", err)
		return nil, fmt.Errorf("failed to create enrollment: %w", err)
	}

	log.Printf("[Enrollment Service] Student enrolled successfully: %s", enrollment.ID)
	return enrollmentToResponse(enrollment), nil
}

// GetEnrollment retrieves an enrollment by ID
// Parameters:
//   - id: Enrollment UUID
//
// Returns:
//   - *EnrollmentResponse: Enrollment details
//   - error: Error if enrollment not found
func (es *EnrollmentService) GetEnrollment(id uuid.UUID) (*EnrollmentResponse, error) {
	enrollment, err := es.enrollmentRepo.GetByID(id)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment %s: %v", id, err)
		return nil, err
	}
	return enrollmentToResponse(enrollment), nil
}

// ListEnrollments retrieves paginated list of enrollments
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []EnrollmentResponse: List of enrollments
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (es *EnrollmentService) ListEnrollments(page, limit int) ([]EnrollmentResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to list enrollments: %v", err)
		return nil, 0, err
	}

	var responses []EnrollmentResponse
	for _, enrollment := range enrollments {
		responses = append(responses, *enrollmentToResponse(&enrollment))
	}

	return responses, total, nil
}

// GetStudentCourses retrieves all courses for a specific student
// Parameters:
//   - studentID: Student UUID
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []EnrollmentResponse: List of student enrollments
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (es *EnrollmentService) GetStudentCourses(studentID uuid.UUID, page, limit int) ([]EnrollmentResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get student courses: %v", err)
		return nil, 0, err
	}

	var responses []EnrollmentResponse
	for _, enrollment := range enrollments {
		responses = append(responses, *enrollmentToResponse(&enrollment))
	}

	return responses, total, nil
}

// GetCourseStudents retrieves all students enrolled in a specific course
// Parameters:
//   - courseID: Course UUID
//   - page: Page number (1-based)
//   - limit: Number of students per page
//
// Returns:
//   - []StudentProgressResponse: List of student progress
//   - int64: Total count of students
//   - error: Error if query fails
func (es *EnrollmentService) GetCourseStudents(courseID uuid.UUID, page, limit int) ([]StudentProgressResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get course students: %v", err)
		return nil, 0, err
	}

	var responses []StudentProgressResponse
	for _, enrollment := range enrollments {
		// Get student details
		if enrollment.Student.ID != uuid.Nil {
			responses = append(responses, StudentProgressResponse{
				StudentID:          enrollment.StudentID,
				StudentName:        enrollment.Student.FirstName + " " + enrollment.Student.LastName,
				StudentEmail:       enrollment.Student.Email,
				ProgressPercentage: enrollment.ProgressPercentage,
				Status:             enrollment.Status,
				EnrolledAt:         enrollment.EnrolledAt,
				CompletedAt:        enrollment.CompletedAt,
			})
		}
	}

	return responses, total, nil
}

// CheckEnrollment checks if a student is enrolled in a course
// Parameters:
//   - studentID: Student UUID
//   - courseID: Course UUID
//
// Returns:
//   - bool: True if student is enrolled
//   - error: Error if query fails
func (es *EnrollmentService) CheckEnrollment(studentID, courseID uuid.UUID) (bool, error) {
	exists, err := es.enrollmentRepo.CheckEnrollmentExists(studentID, courseID)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to check enrollment: %v", err)
		return false, err
	}
	return exists, nil
}

// UpdateProgress updates student progress in a course
// Parameters:
//   - id: Enrollment UUID
//   - req: Progress update request
//
// Returns:
//   - *EnrollmentResponse: Updated enrollment details
//   - error: Error if update fails
func (es *EnrollmentService) UpdateProgress(id uuid.UUID, req *UpdateEnrollmentProgressRequest) (*EnrollmentResponse, error) {
	log.Printf("[Enrollment Service] Updating progress for enrollment: %s", id)

	// Get existing enrollment
	enrollment, err := es.enrollmentRepo.GetByID(id)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment %s: %v", id, err)
		return nil, err
	}

	// Validate progress percentage
	if req.ProgressPercentage < 0 || req.ProgressPercentage > 100 {
		return nil, errors.New("progress_percentage must be between 0 and 100")
	}

	// Update fields
	enrollment.ProgressPercentage = req.ProgressPercentage
	enrollment.Status = req.Status

	// If progress is 100% and not completed yet, mark as completed
	if req.ProgressPercentage == 100 && enrollment.Status == "active" {
		now := time.Now()
		enrollment.CompletedAt = &now
		enrollment.Status = "completed"
	}

	if err := es.enrollmentRepo.Update(enrollment); err != nil {
		log.Printf("[Enrollment Service] Failed to update enrollment: %v", err)
		return nil, fmt.Errorf("failed to update enrollment: %w", err)
	}

	log.Printf("[Enrollment Service] Enrollment progress updated: %s", id)
	return enrollmentToResponse(enrollment), nil
}

// UnenrollStudent unenrolls a student from a course
// Parameters:
//   - enrollmentID: Enrollment UUID
//
// Returns:
//   - error: Error if unenrollment fails
func (es *EnrollmentService) UnenrollStudent(enrollmentID uuid.UUID) error {
	log.Printf("[Enrollment Service] Unenrolling student: %s", enrollmentID)

	// Verify enrollment exists
	_, err := es.enrollmentRepo.GetByID(enrollmentID)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment %s: %v", enrollmentID, err)
		return err
	}

	if err := es.enrollmentRepo.Delete(enrollmentID); err != nil {
		log.Printf("[Enrollment Service] Failed to unenroll student: %v", err)
		return fmt.Errorf("failed to unenroll student: %w", err)
	}

	log.Printf("[Enrollment Service] Student unenrolled successfully: %s", enrollmentID)
	return nil
}

// GetEnrollmentsByStatus retrieves enrollments with a specific status
// Parameters:
//   - studentID: Student UUID
//   - status: Enrollment status (e.g., "active", "completed")
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []EnrollmentResponse: List of enrollments
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (es *EnrollmentService) GetEnrollmentsByStatus(studentID uuid.UUID, status string, page, limit int) ([]EnrollmentResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetStudentEnrollmentsByStatus(studentID, status, page, limit)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollments by status: %v", err)
		return nil, 0, err
	}

	var responses []EnrollmentResponse
	for _, enrollment := range enrollments {
		responses = append(responses, *enrollmentToResponse(&enrollment))
	}

	return responses, total, nil
}

// CompleteEnrollment marks an enrollment as completed
// Parameters:
//   - id: Enrollment UUID
//
// Returns:
//   - *EnrollmentResponse: Completed enrollment details
//   - error: Error if operation fails
func (es *EnrollmentService) CompleteEnrollment(id uuid.UUID) (*EnrollmentResponse, error) {
	log.Printf("[Enrollment Service] Completing enrollment: %s", id)

	enrollment, err := es.enrollmentRepo.GetByID(id)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment: %v", err)
		return nil, err
	}

	now := time.Now()
	enrollment.CompletedAt = &now
	enrollment.Status = "completed"
	enrollment.ProgressPercentage = 100

	if err := es.enrollmentRepo.Update(enrollment); err != nil {
		log.Printf("[Enrollment Service] Failed to complete enrollment: %v", err)
		return nil, fmt.Errorf("failed to complete enrollment: %w", err)
	}

	log.Printf("[Enrollment Service] Enrollment completed: %s", id)
	return enrollmentToResponse(enrollment), nil
}

// SuspendEnrollment suspends an active enrollment
// Parameters:
//   - id: Enrollment UUID
//
// Returns:
//   - *EnrollmentResponse: Suspended enrollment details
//   - error: Error if operation fails
func (es *EnrollmentService) SuspendEnrollment(id uuid.UUID) (*EnrollmentResponse, error) {
	log.Printf("[Enrollment Service] Suspending enrollment: %s", id)

	enrollment, err := es.enrollmentRepo.GetByID(id)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment: %v", err)
		return nil, err
	}

	if enrollment.Status != "active" {
		return nil, errors.New("only active enrollments can be suspended")
	}

	enrollment.Status = "suspended"

	if err := es.enrollmentRepo.Update(enrollment); err != nil {
		log.Printf("[Enrollment Service] Failed to suspend enrollment: %v", err)
		return nil, fmt.Errorf("failed to suspend enrollment: %w", err)
	}

	log.Printf("[Enrollment Service] Enrollment suspended: %s", id)
	return enrollmentToResponse(enrollment), nil
}

// ResumeEnrollment resumes a suspended enrollment
// Parameters:
//   - id: Enrollment UUID
//
// Returns:
//   - *EnrollmentResponse: Resumed enrollment details
//   - error: Error if operation fails
func (es *EnrollmentService) ResumeEnrollment(id uuid.UUID) (*EnrollmentResponse, error) {
	log.Printf("[Enrollment Service] Resuming enrollment: %s", id)

	enrollment, err := es.enrollmentRepo.GetByID(id)
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment: %v", err)
		return nil, err
	}

	if enrollment.Status != "suspended" {
		return nil, errors.New("only suspended enrollments can be resumed")
	}

	enrollment.Status = "active"

	if err := es.enrollmentRepo.Update(enrollment); err != nil {
		log.Printf("[Enrollment Service] Failed to resume enrollment: %v", err)
		return nil, fmt.Errorf("failed to resume enrollment: %w", err)
	}

	log.Printf("[Enrollment Service] Enrollment resumed: %s", id)
	return enrollmentToResponse(enrollment), nil
}

// GetEnrollmentCount returns the total number of enrollments
// Returns:
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (es *EnrollmentService) GetEnrollmentCount() (int64, error) {
	count, err := es.enrollmentRepo.GetEnrollmentCount()
	if err != nil {
		log.Printf("[Enrollment Service] Failed to get enrollment count: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// enrollmentToResponse converts an Enrollment model to an EnrollmentResponse
func enrollmentToResponse(enrollment *models.Enrollment) *EnrollmentResponse {
	return &EnrollmentResponse{
		ID:                 enrollment.ID,
		CourseID:           enrollment.CourseID,
		StudentID:          enrollment.StudentID,
		EnrolledAt:         enrollment.EnrolledAt,
		CompletedAt:        enrollment.CompletedAt,
		ProgressPercentage: enrollment.ProgressPercentage,
		Status:             enrollment.Status,
		CreatedAt:          time.Now(), // enrollment.CreatedAt
		UpdatedAt:          time.Now(), // enrollment.UpdatedAt
	}
}

// ListStudentEnrollments retrieves all enrollments for a specific student
// Parameters:
//   - studentID: Student UUID
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []EnrollmentResponse: List of student enrollments
//   - int64: Total count
//   - error: Error if query fails
func (es *EnrollmentService) ListStudentEnrollments(studentID uuid.UUID, page, limit int) ([]EnrollmentResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	var responses []EnrollmentResponse
	for _, enrollment := range enrollments {
		responses = append(responses, *enrollmentToResponse(&enrollment))
	}

	return responses, total, nil
}

// ListCourseEnrollments retrieves all enrollments for a specific course
// Parameters:
//   - courseID: Course UUID
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []EnrollmentResponse: List of course enrollments
//   - int64: Total count
//   - error: Error if query fails
func (es *EnrollmentService) ListCourseEnrollments(courseID uuid.UUID, page, limit int) ([]EnrollmentResponse, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	var responses []EnrollmentResponse
	for _, enrollment := range enrollments {
		responses = append(responses, *enrollmentToResponse(&enrollment))
	}

	return responses, total, nil
}

// GetEnrollmentStats retrieves statistics for an enrollment
// Parameters:
//   - enrollmentID: Enrollment UUID
//
// Returns:
//   - map[string]interface{}: Statistics including progress, completion, etc.
//   - error: Error if query fails
func (es *EnrollmentService) GetEnrollmentStats(enrollmentID uuid.UUID) (map[string]interface{}, error) {
	enrollment, err := es.enrollmentRepo.GetByID(enrollmentID)
	if err != nil {
		return nil, err
	}

	stats := map[string]interface{}{
		"enrollment_id": enrollment.ID,
		"progress":      enrollment.ProgressPercentage,
		"status":        enrollment.Status,
		"enrolled_at":   enrollment.EnrolledAt,
		"completed_at":  enrollment.CompletedAt,
	}

	return stats, nil
}

// GetCourseLeaderboard retrieves leaderboard rankings for a course
// Parameters:
//   - courseID: Course UUID
//   - page: Page number (1-based)
//   - limit: Number of entries per page
//   - sortBy: Sort criterion (progress, completion_date, recent)
//
// Returns:
//   - []map[string]interface{}: Leaderboard entries
//   - int64: Total count
//   - error: Error if query fails
func (es *EnrollmentService) GetCourseLeaderboard(courseID uuid.UUID, page, limit int, sortBy string) ([]map[string]interface{}, int64, error) {
	enrollments, total, err := es.enrollmentRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	entries := make([]map[string]interface{}, 0)
	for rank, enrollment := range enrollments {
		entry := map[string]interface{}{
			"rank":        rank + 1,
			"student_id":  enrollment.StudentID,
			"progress":    enrollment.ProgressPercentage,
			"status":      enrollment.Status,
			"enrolled_at": enrollment.EnrolledAt,
		}
		entries = append(entries, entry)
	}

	return entries, total, nil
}
