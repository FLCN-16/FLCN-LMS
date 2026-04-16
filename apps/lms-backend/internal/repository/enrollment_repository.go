package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// EnrollmentRepository handles all database operations for enrollments
type EnrollmentRepository struct {
	db *gorm.DB
}

// NewEnrollmentRepository creates a new enrollment repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *EnrollmentRepository: New enrollment repository
func NewEnrollmentRepository(db *gorm.DB) *EnrollmentRepository {
	return &EnrollmentRepository{db: db}
}

// Create saves a new enrollment to the database
// Parameters:
//   - enrollment: The enrollment model to create
//
// Returns:
//   - error: Error if creation fails
func (er *EnrollmentRepository) Create(enrollment *models.Enrollment) error {
	if enrollment.ID == uuid.Nil {
		enrollment.ID = uuid.New()
	}
	if err := er.db.Create(enrollment).Error; err != nil {
		return fmt.Errorf("failed to create enrollment: %w", err)
	}
	return nil
}

// GetByID retrieves an enrollment by its UUID
// Parameters:
//   - id: The enrollment's UUID
//
// Returns:
//   - *models.Enrollment: The enrollment if found
//   - error: Error if enrollment not found or query fails
func (er *EnrollmentRepository) GetByID(id uuid.UUID) (*models.Enrollment, error) {
	var enrollment models.Enrollment
	if err := er.db.First(&enrollment, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("enrollment not found")
		}
		return nil, fmt.Errorf("failed to fetch enrollment: %w", err)
	}
	return &enrollment, nil
}

// GetAll retrieves all enrollments with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of enrollments
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) GetAll(page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count
	if err := er.db.Model(&models.Enrollment{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch enrollments: %w", err)
	}

	return enrollments, total, nil
}

// Update updates an existing enrollment's information
// Parameters:
//   - enrollment: The enrollment model with updated values
//
// Returns:
//   - error: Error if update fails
func (er *EnrollmentRepository) Update(enrollment *models.Enrollment) error {
	if err := er.db.Save(enrollment).Error; err != nil {
		return fmt.Errorf("failed to update enrollment: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of an enrollment
// Parameters:
//   - id: The enrollment's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"status": "active"})
//
// Returns:
//   - error: Error if update fails
func (er *EnrollmentRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := er.db.Model(&models.Enrollment{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update enrollment: %w", err)
	}
	return nil
}

// Delete removes an enrollment from the database
// Parameters:
//   - id: The enrollment's UUID
//
// Returns:
//   - error: Error if deletion fails
func (er *EnrollmentRepository) Delete(id uuid.UUID) error {
	if err := er.db.Delete(&models.Enrollment{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete enrollment: %w", err)
	}
	return nil
}

// GetByStudentID retrieves all enrollments for a specific student with pagination
// Parameters:
//   - studentID: The student's UUID
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of enrollments
//   - int64: Total count of enrollments for the student
//   - error: Error if query fails
func (er *EnrollmentRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count for student
	if err := er.db.Model(&models.Enrollment{}).Where("student_id = ?", studentID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Where("student_id = ?", studentID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch enrollments by student: %w", err)
	}

	return enrollments, total, nil
}

// GetByCourseID retrieves all enrollments for a specific course with pagination
// Parameters:
//   - courseID: The course's UUID
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of enrollments
//   - int64: Total count of enrollments for the course
//   - error: Error if query fails
func (er *EnrollmentRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count for course
	if err := er.db.Model(&models.Enrollment{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch enrollments by course: %w", err)
	}

	return enrollments, total, nil
}

// GetByStudentAndCourse retrieves an enrollment for a specific student and course
// Parameters:
//   - studentID: The student's UUID
//   - courseID: The course's UUID
//
// Returns:
//   - *models.Enrollment: The enrollment if found
//   - error: Error if enrollment not found or query fails
func (er *EnrollmentRepository) GetByStudentAndCourse(studentID, courseID uuid.UUID) (*models.Enrollment, error) {
	var enrollment models.Enrollment
	if err := er.db.Where("student_id = ? AND course_id = ?", studentID, courseID).First(&enrollment).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("enrollment not found")
		}
		return nil, fmt.Errorf("failed to fetch enrollment: %w", err)
	}
	return &enrollment, nil
}

// GetEnrollmentCount returns the total number of enrollments
// Returns:
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) GetEnrollmentCount() (int64, error) {
	var count int64
	if err := er.db.Model(&models.Enrollment{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count enrollments: %w", err)
	}
	return count, nil
}

// GetEnrollmentCountByCourse returns the total number of enrollments for a specific course
// Parameters:
//   - courseID: The course's UUID
//
// Returns:
//   - int64: Total count of enrollments for the course
//   - error: Error if query fails
func (er *EnrollmentRepository) GetEnrollmentCountByCourse(courseID uuid.UUID) (int64, error) {
	var count int64
	if err := er.db.Model(&models.Enrollment{}).Where("course_id = ?", courseID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count enrollments: %w", err)
	}
	return count, nil
}

// GetEnrollmentCountByStudent returns the total number of enrollments for a specific student
// Parameters:
//   - studentID: The student's UUID
//
// Returns:
//   - int64: Total count of enrollments for the student
//   - error: Error if query fails
func (er *EnrollmentRepository) GetEnrollmentCountByStudent(studentID uuid.UUID) (int64, error) {
	var count int64
	if err := er.db.Model(&models.Enrollment{}).Where("student_id = ?", studentID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count enrollments: %w", err)
	}
	return count, nil
}

// GetActiveEnrollments retrieves all active enrollments with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of active enrollments
//   - int64: Total count of active enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) GetActiveEnrollments(page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count of active enrollments
	if err := er.db.Model(&models.Enrollment{}).Where("status = ?", "active").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Where("status = ?", "active").Offset(offset).Limit(limit).Order("created_at DESC").Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch active enrollments: %w", err)
	}

	return enrollments, total, nil
}

// GetCompletedEnrollments retrieves all completed enrollments with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of completed enrollments
//   - int64: Total count of completed enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) GetCompletedEnrollments(page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count of completed enrollments
	if err := er.db.Model(&models.Enrollment{}).Where("status = ?", "completed").Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Where("status = ?", "completed").Offset(offset).Limit(limit).Order("created_at DESC").Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch completed enrollments: %w", err)
	}

	return enrollments, total, nil
}

// Search searches for enrollments by student or course information
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of matching enrollments
//   - int64: Total count of matching enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) Search(query string, page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query - searches by student email or course title via joins
	if err := er.db.Model(&models.Enrollment{}).
		Joins("LEFT JOIN users ON enrollments.student_id = users.id").
		Joins("LEFT JOIN courses ON enrollments.course_id = courses.id").
		Where(
			er.db.Where("users.email ILIKE ?", searchPattern).
				Or("courses.title ILIKE ?", searchPattern),
		).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.
		Joins("LEFT JOIN users ON enrollments.student_id = users.id").
		Joins("LEFT JOIN courses ON enrollments.course_id = courses.id").
		Where(
			er.db.Where("users.email ILIKE ?", searchPattern).
				Or("courses.title ILIKE ?", searchPattern),
		).
		Offset(offset).Limit(limit).Order("enrollments.created_at DESC").
		Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search enrollments: %w", err)
	}

	return enrollments, total, nil
}

// CheckEnrollmentExists checks if a student is enrolled in a course
// Parameters:
//   - studentID: The student's UUID
//   - courseID: The course's UUID
//
// Returns:
//   - bool: True if enrollment exists
//   - error: Error if query fails
func (er *EnrollmentRepository) CheckEnrollmentExists(studentID, courseID uuid.UUID) (bool, error) {
	var count int64
	if err := er.db.Model(&models.Enrollment{}).
		Where("student_id = ? AND course_id = ?", studentID, courseID).
		Count(&count).Error; err != nil {
		return false, fmt.Errorf("failed to check enrollment: %w", err)
	}
	return count > 0, nil
}

// GetStudentEnrollmentsByStatus retrieves all enrollments for a student with a specific status
// Parameters:
//   - studentID: The student's UUID
//   - status: The enrollment status (e.g., "active", "completed", "suspended")
//   - page: Page number (1-based)
//   - limit: Number of enrollments per page
//
// Returns:
//   - []models.Enrollment: Slice of enrollments
//   - int64: Total count of enrollments
//   - error: Error if query fails
func (er *EnrollmentRepository) GetStudentEnrollmentsByStatus(studentID uuid.UUID, status string, page, limit int) ([]models.Enrollment, int64, error) {
	var enrollments []models.Enrollment
	var total int64

	// Get total count
	if err := er.db.Model(&models.Enrollment{}).
		Where("student_id = ? AND status = ?", studentID, status).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count enrollments: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := er.db.Where("student_id = ? AND status = ?", studentID, status).
		Offset(offset).Limit(limit).Order("created_at DESC").
		Find(&enrollments).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch enrollments: %w", err)
	}

	return enrollments, total, nil
}
