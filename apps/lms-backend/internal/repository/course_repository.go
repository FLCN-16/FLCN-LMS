package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CourseRepository handles all database operations for courses
type CourseRepository struct {
	db *gorm.DB
}

// NewCourseRepository creates a new course repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *CourseRepository: New course repository
func NewCourseRepository(db *gorm.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

// Create saves a new course to the database
// Parameters:
//   - course: The course model to create
//
// Returns:
//   - error: Error if creation fails
func (cr *CourseRepository) Create(course *models.Course) error {
	if course.ID == uuid.Nil {
		course.ID = uuid.New()
	}
	if err := cr.db.Create(course).Error; err != nil {
		return fmt.Errorf("failed to create course: %w", err)
	}
	return nil
}

// GetByID retrieves a course by its UUID
// Parameters:
//   - id: The course's UUID
//
// Returns:
//   - *models.Course: The course if found
//   - error: Error if course not found or query fails
func (cr *CourseRepository) GetByID(id uuid.UUID) (*models.Course, error) {
	var course models.Course
	if err := cr.db.First(&course, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("course not found")
		}
		return nil, fmt.Errorf("failed to fetch course: %w", err)
	}
	return &course, nil
}

// GetAll retrieves all courses with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []models.Course: Slice of courses
//   - int64: Total count of courses
//   - error: Error if query fails
func (cr *CourseRepository) GetAll(page, limit int) ([]models.Course, int64, error) {
	var courses []models.Course
	var total int64

	// Get total count
	if err := cr.db.Model(&models.Course{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count courses: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&courses).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch courses: %w", err)
	}

	return courses, total, nil
}

// Update updates an existing course's information
// Parameters:
//   - course: The course model with updated values
//
// Returns:
//   - error: Error if update fails
func (cr *CourseRepository) Update(course *models.Course) error {
	if err := cr.db.Save(course).Error; err != nil {
		return fmt.Errorf("failed to update course: %w", err)
	}
	return nil
}

// UpdatePartial updates specific fields of a course
// Parameters:
//   - id: The course's UUID
//   - updates: Map of fields to update (e.g., map[string]interface{}{"title": "New Title"})
//
// Returns:
//   - error: Error if update fails
func (cr *CourseRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := cr.db.Model(&models.Course{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return fmt.Errorf("failed to update course: %w", err)
	}
	return nil
}

// Delete removes a course from the database
// Parameters:
//   - id: The course's UUID
//
// Returns:
//   - error: Error if deletion fails
func (cr *CourseRepository) Delete(id uuid.UUID) error {
	if err := cr.db.Delete(&models.Course{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete course: %w", err)
	}
	return nil
}

// GetBySlug retrieves a course by its slug
// Parameters:
//   - slug: The course's slug
//
// Returns:
//   - *models.Course: The course if found
//   - error: Error if course not found or query fails
func (cr *CourseRepository) GetBySlug(slug string) (*models.Course, error) {
	var course models.Course
	if err := cr.db.First(&course, "slug = ?", slug).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("course not found")
		}
		return nil, fmt.Errorf("failed to fetch course by slug: %w", err)
	}
	return &course, nil
}

// ListByInstructor retrieves all courses by a specific instructor with pagination
// Parameters:
//   - instructorID: The instructor's UUID
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []models.Course: Slice of courses
//   - int64: Total count of courses for the instructor
//   - error: Error if query fails
func (cr *CourseRepository) ListByInstructor(instructorID uuid.UUID, page, limit int) ([]models.Course, int64, error) {
	var courses []models.Course
	var total int64

	// Get total count for instructor
	if err := cr.db.Model(&models.Course{}).Where("instructor_id = ?", instructorID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count courses: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("instructor_id = ?", instructorID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&courses).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch courses by instructor: %w", err)
	}

	return courses, total, nil
}

// GetPublishedCourses retrieves all published courses with pagination
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []models.Course: Slice of published courses
//   - int64: Total count of published courses
//   - error: Error if query fails
func (cr *CourseRepository) GetPublishedCourses(page, limit int) ([]models.Course, int64, error) {
	var courses []models.Course
	var total int64

	// Get total count of published courses
	if err := cr.db.Model(&models.Course{}).Where("is_published = ?", true).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count published courses: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("is_published = ?", true).Offset(offset).Limit(limit).Order("created_at DESC").Find(&courses).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch published courses: %w", err)
	}

	return courses, total, nil
}

// Search searches for courses by title or description
// Parameters:
//   - query: Search query string
//   - page: Page number (1-based)
//   - limit: Number of courses per page
//
// Returns:
//   - []models.Course: Slice of matching courses
//   - int64: Total count of matching courses
//   - error: Error if query fails
func (cr *CourseRepository) Search(query string, page, limit int) ([]models.Course, int64, error) {
	var courses []models.Course
	var total int64

	searchPattern := "%" + query + "%"

	// Get total count matching query
	if err := cr.db.Model(&models.Course{}).Where(
		cr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count courses: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where(
		cr.db.Where("title ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	).Offset(offset).Limit(limit).Order("created_at DESC").Find(&courses).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search courses: %w", err)
	}

	return courses, total, nil
}

// GetCourseCount returns the total number of courses
// Returns:
//   - int64: Total count of courses
//   - error: Error if query fails
func (cr *CourseRepository) GetCourseCount() (int64, error) {
	var count int64
	if err := cr.db.Model(&models.Course{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count courses: %w", err)
	}
	return count, nil
}
