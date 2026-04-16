package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BatchRepository handles all database operations for batches
type BatchRepository struct {
	db *gorm.DB
}

// NewBatchRepository creates a new batch repository instance
func NewBatchRepository(db *gorm.DB) *BatchRepository {
	return &BatchRepository{db: db}
}

// Create saves a new batch to the database
func (br *BatchRepository) Create(batch *models.Batch) error {
	if batch.ID == uuid.Nil {
		batch.ID = uuid.New()
	}
	if err := br.db.Create(batch).Error; err != nil {
		return fmt.Errorf("failed to create batch: %w", err)
	}
	return nil
}

// GetByID retrieves a batch by its UUID
func (br *BatchRepository) GetByID(id uuid.UUID) (*models.Batch, error) {
	var batch models.Batch
	if err := br.db.Preload("Instructor").Preload("Courses").First(&batch, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("batch not found")
		}
		return nil, fmt.Errorf("failed to fetch batch: %w", err)
	}
	return &batch, nil
}

// GetAll retrieves all batches with pagination
func (br *BatchRepository) GetAll(page, limit int) ([]models.Batch, int64, error) {
	var batches []models.Batch
	var total int64

	// Get total count
	if err := br.db.Model(&models.Batch{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count batches: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := br.db.Preload("Instructor").Preload("Courses").Offset(offset).Limit(limit).Order("created_at DESC").Find(&batches).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch batches: %w", err)
	}

	return batches, total, nil
}

// GetByInstructorID retrieves all batches for a specific instructor
func (br *BatchRepository) GetByInstructorID(instructorID uuid.UUID, page, limit int) ([]models.Batch, int64, error) {
	var batches []models.Batch
	var total int64

	// Get total count
	if err := br.db.Model(&models.Batch{}).Where("instructor_id = ?", instructorID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count batches: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := br.db.Preload("Instructor").Preload("Courses").Where("instructor_id = ?", instructorID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&batches).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch batches: %w", err)
	}

	return batches, total, nil
}

// GetByCode retrieves a batch by its unique code
func (br *BatchRepository) GetByCode(code string) (*models.Batch, error) {
	var batch models.Batch
	if err := br.db.Preload("Instructor").Preload("Courses").First(&batch, "code = ?", code).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch batch: %w", err)
	}
	return &batch, nil
}

// Update updates an existing batch
func (br *BatchRepository) Update(batch *models.Batch) error {
	if err := br.db.Save(batch).Error; err != nil {
		return fmt.Errorf("failed to update batch: %w", err)
	}
	return nil
}

// Delete removes a batch from the database
func (br *BatchRepository) Delete(id uuid.UUID) error {
	if err := br.db.Delete(&models.Batch{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete batch: %w", err)
	}
	return nil
}

// GetStudentCount gets the count of students enrolled in a batch
func (br *BatchRepository) GetStudentCount(batchID uuid.UUID) (int64, error) {
	var count int64
	if err := br.db.Model(&models.BatchEnrollment{}).Where("batch_id = ?", batchID).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count students: %w", err)
	}
	return count, nil
}

// EnrollStudent adds a student to a batch
func (br *BatchRepository) EnrollStudent(batchID, studentID uuid.UUID) error {
	enrollment := &models.BatchEnrollment{
		ID:        uuid.New(),
		BatchID:   batchID,
		StudentID: studentID,
	}
	if err := br.db.Create(enrollment).Error; err != nil {
		return fmt.Errorf("failed to enroll student: %w", err)
	}
	return nil
}

// GetBatchStudents retrieves all students enrolled in a batch
func (br *BatchRepository) GetBatchStudents(batchID uuid.UUID, page, limit int) ([]models.User, int64, error) {
	var students []models.User
	var total int64

	// Get total count
	if err := br.db.Model(&models.User{}).
		Joins("INNER JOIN batch_enrollments ON batch_enrollments.student_id = users.id").
		Where("batch_enrollments.batch_id = ?", batchID).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count students: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := br.db.
		Joins("INNER JOIN batch_enrollments ON batch_enrollments.student_id = users.id").
		Where("batch_enrollments.batch_id = ?", batchID).
		Offset(offset).Limit(limit).
		Order("users.created_at DESC").
		Find(&students).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch students: %w", err)
	}

	return students, total, nil
}

// IsStudentEnrolled checks if a student is enrolled in a batch
func (br *BatchRepository) IsStudentEnrolled(batchID, studentID uuid.UUID) (bool, error) {
	var count int64
	if err := br.db.Model(&models.BatchEnrollment{}).
		Where("batch_id = ? AND student_id = ?", batchID, studentID).
		Count(&count).Error; err != nil {
		return false, fmt.Errorf("failed to check enrollment: %w", err)
	}
	return count > 0, nil
}
