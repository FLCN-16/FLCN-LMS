package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CoursePackageRepository handles database operations for course packages
type CoursePackageRepository struct {
	db *gorm.DB
}

// NewCoursePackageRepository creates a new CoursePackageRepository
func NewCoursePackageRepository(db *gorm.DB) *CoursePackageRepository {
	return &CoursePackageRepository{db: db}
}

// Create saves a new course package
func (r *CoursePackageRepository) Create(pkg *models.CoursePackage) error {
	if pkg.ID == uuid.Nil {
		pkg.ID = uuid.New()
	}
	if err := r.db.Create(pkg).Error; err != nil {
		return fmt.Errorf("failed to create course package: %w", err)
	}
	return nil
}

// GetByID retrieves a course package by ID
func (r *CoursePackageRepository) GetByID(id uuid.UUID) (*models.CoursePackage, error) {
	var pkg models.CoursePackage
	if err := r.db.First(&pkg, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("course package not found")
		}
		return nil, fmt.Errorf("failed to fetch course package: %w", err)
	}
	return &pkg, nil
}

// GetByCourseID retrieves all active packages for a course ordered by sort_order
func (r *CoursePackageRepository) GetByCourseID(courseID uuid.UUID, activeOnly bool) ([]models.CoursePackage, error) {
	query := r.db.Where("course_id = ?", courseID)
	if activeOnly {
		query = query.Where("is_active = true")
	}
	var packages []models.CoursePackage
	if err := query.Order("sort_order ASC, created_at ASC").Find(&packages).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch course packages: %w", err)
	}
	return packages, nil
}

// GetByCourseSlug retrieves active packages for a course identified by slug
func (r *CoursePackageRepository) GetByCourseSlug(slug string) ([]models.CoursePackage, error) {
	var packages []models.CoursePackage
	if err := r.db.
		Joins("JOIN courses ON courses.id = course_packages.course_id").
		Where("courses.slug = ? AND course_packages.is_active = true", slug).
		Order("course_packages.sort_order ASC").
		Find(&packages).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch course packages: %w", err)
	}
	return packages, nil
}

// Update updates a course package
func (r *CoursePackageRepository) Update(pkg *models.CoursePackage) error {
	if err := r.db.Save(pkg).Error; err != nil {
		return fmt.Errorf("failed to update course package: %w", err)
	}
	return nil
}

// Delete deletes a course package
func (r *CoursePackageRepository) Delete(id uuid.UUID) error {
	if err := r.db.Delete(&models.CoursePackage{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete course package: %w", err)
	}
	return nil
}
