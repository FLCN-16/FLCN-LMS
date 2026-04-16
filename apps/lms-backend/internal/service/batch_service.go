package service

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// BatchService handles batch business logic
type BatchService struct {
	batchRepo repository.BatchRepository
}

// NewBatchService creates a new batch service instance
func NewBatchService(batchRepo repository.BatchRepository) *BatchService {
	return &BatchService{
		batchRepo: batchRepo,
	}
}

// BatchResponse represents a batch in API responses
type BatchResponse struct {
	ID           uuid.UUID  `json:"id"`
	Name         string     `json:"name"`
	Description  *string    `json:"description"`
	Code         *string    `json:"code"`
	InstructorID *uuid.UUID `json:"instructor_id"`
	Instructor   *UserResponse `json:"instructor,omitempty"`
	MaxStudents  *int       `json:"max_students"`
	StartDate    *time.Time `json:"start_date"`
	EndDate      *time.Time `json:"end_date"`
	Status       string     `json:"status"`
	IsActive     bool       `json:"is_active"`
	StudentCount int64      `json:"student_count"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// CreateBatchRequest represents a batch creation request
type CreateBatchRequest struct {
	Name        string     `json:"name" binding:"required"`
	Description *string    `json:"description"`
	Code        *string    `json:"code"`
	MaxStudents *int       `json:"max_students"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	InstructorID *uuid.UUID `json:"instructor_id"`
}

// UpdateBatchRequest represents a batch update request
type UpdateBatchRequest struct {
	Name        *string    `json:"name"`
	Description *string    `json:"description"`
	Code        *string    `json:"code"`
	MaxStudents *int       `json:"max_students"`
	StartDate   *time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`
	Status      *string    `json:"status"`
	IsActive    *bool      `json:"is_active"`
}

// EnrollStudentRequest represents a student enrollment request
type EnrollStudentRequest struct {
	StudentID uuid.UUID `json:"student_id" binding:"required"`
}

// ListBatches retrieves paginated list of all batches
func (bs *BatchService) ListBatches(page, limit int) ([]BatchResponse, int64, error) {
	batches, total, err := bs.batchRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Batch Service] Failed to list batches: %v", err)
		return nil, 0, err
	}

	var responses []BatchResponse
	for _, batch := range batches {
		studentCount, _ := bs.batchRepo.GetStudentCount(batch.ID)
		responses = append(responses, *batchToResponse(&batch, studentCount))
	}

	return responses, total, nil
}

// GetBatch retrieves a single batch by ID
func (bs *BatchService) GetBatch(id uuid.UUID) (*BatchResponse, error) {
	batch, err := bs.batchRepo.GetByID(id)
	if err != nil {
		log.Printf("[Batch Service] Failed to get batch: %v", err)
		return nil, err
	}
	if batch == nil {
		return nil, fmt.Errorf("batch not found")
	}

	studentCount, _ := bs.batchRepo.GetStudentCount(batch.ID)
	return batchToResponse(batch, studentCount), nil
}

// ListBatchesByInstructor retrieves batches created by an instructor
func (bs *BatchService) ListBatchesByInstructor(instructorID uuid.UUID, page, limit int) ([]BatchResponse, int64, error) {
	batches, total, err := bs.batchRepo.GetByInstructorID(instructorID, page, limit)
	if err != nil {
		log.Printf("[Batch Service] Failed to list batches by instructor: %v", err)
		return nil, 0, err
	}

	var responses []BatchResponse
	for _, batch := range batches {
		studentCount, _ := bs.batchRepo.GetStudentCount(batch.ID)
		responses = append(responses, *batchToResponse(&batch, studentCount))
	}

	return responses, total, nil
}

// CreateBatch creates a new batch
func (bs *BatchService) CreateBatch(req *CreateBatchRequest) (*BatchResponse, error) {
	log.Printf("[Batch Service] Creating new batch: %s", req.Name)

	batch := &models.Batch{
		ID:           uuid.New(),
		Name:         req.Name,
		Description:  req.Description,
		Code:         req.Code,
		MaxStudents:  req.MaxStudents,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		InstructorID: req.InstructorID,
		Status:       "active",
		IsActive:     true,
	}

	if err := bs.batchRepo.Create(batch); err != nil {
		log.Printf("[Batch Service] Failed to create batch: %v", err)
		return nil, fmt.Errorf("failed to create batch: %w", err)
	}

	log.Printf("[Batch Service] Batch created successfully: %s", batch.ID)
	return batchToResponse(batch, 0), nil
}

// UpdateBatch updates an existing batch
func (bs *BatchService) UpdateBatch(id uuid.UUID, req *UpdateBatchRequest) (*BatchResponse, error) {
	log.Printf("[Batch Service] Updating batch: %s", id)

	batch, err := bs.batchRepo.GetByID(id)
	if err != nil {
		log.Printf("[Batch Service] Failed to get batch: %v", err)
		return nil, err
	}
	if batch == nil {
		return nil, fmt.Errorf("batch not found")
	}

	// Update fields if provided
	if req.Name != nil {
		batch.Name = *req.Name
	}
	if req.Description != nil {
		batch.Description = req.Description
	}
	if req.Code != nil {
		batch.Code = req.Code
	}
	if req.MaxStudents != nil {
		batch.MaxStudents = req.MaxStudents
	}
	if req.StartDate != nil {
		batch.StartDate = req.StartDate
	}
	if req.EndDate != nil {
		batch.EndDate = req.EndDate
	}
	if req.Status != nil {
		batch.Status = *req.Status
	}
	if req.IsActive != nil {
		batch.IsActive = *req.IsActive
	}

	if err := bs.batchRepo.Update(batch); err != nil {
		log.Printf("[Batch Service] Failed to update batch: %v", err)
		return nil, fmt.Errorf("failed to update batch: %w", err)
	}

	log.Printf("[Batch Service] Batch updated successfully: %s", id)
	studentCount, _ := bs.batchRepo.GetStudentCount(batch.ID)
	return batchToResponse(batch, studentCount), nil
}

// DeleteBatch deletes a batch
func (bs *BatchService) DeleteBatch(id uuid.UUID) error {
	log.Printf("[Batch Service] Deleting batch: %s", id)

	if err := bs.batchRepo.Delete(id); err != nil {
		log.Printf("[Batch Service] Failed to delete batch: %v", err)
		return fmt.Errorf("failed to delete batch: %w", err)
	}

	log.Printf("[Batch Service] Batch deleted successfully: %s", id)
	return nil
}

// EnrollStudent enrolls a student in a batch
func (bs *BatchService) EnrollStudent(batchID, studentID uuid.UUID) error {
	log.Printf("[Batch Service] Enrolling student %s in batch %s", studentID, batchID)

	// Check if already enrolled
	isEnrolled, err := bs.batchRepo.IsStudentEnrolled(batchID, studentID)
	if err != nil {
		return fmt.Errorf("failed to check enrollment: %w", err)
	}
	if isEnrolled {
		return fmt.Errorf("student already enrolled in this batch")
	}

	// Check batch capacity
	batch, err := bs.batchRepo.GetByID(batchID)
	if err != nil {
		return fmt.Errorf("batch not found: %w", err)
	}

	if batch.MaxStudents != nil {
		studentCount, err := bs.batchRepo.GetStudentCount(batchID)
		if err != nil {
			return fmt.Errorf("failed to get student count: %w", err)
		}
		if int64(*batch.MaxStudents) <= studentCount {
			return fmt.Errorf("batch is at maximum capacity")
		}
	}

	if err := bs.batchRepo.EnrollStudent(batchID, studentID); err != nil {
		log.Printf("[Batch Service] Failed to enroll student: %v", err)
		return fmt.Errorf("failed to enroll student: %w", err)
	}

	return nil
}

// ListBatchStudents retrieves students in a batch
func (bs *BatchService) ListBatchStudents(batchID uuid.UUID, page, limit int) ([]UserResponse, int64, error) {
	students, total, err := bs.batchRepo.GetBatchStudents(batchID, page, limit)
	if err != nil {
		log.Printf("[Batch Service] Failed to list batch students: %v", err)
		return nil, 0, err
	}

	var responses []UserResponse
	for _, student := range students {
		responses = append(responses, *userToResponse(&student))
	}

	return responses, total, nil
}

// Helper function to convert model to response
func batchToResponse(batch *models.Batch, studentCount int64) *BatchResponse {
	return &BatchResponse{
		ID:           batch.ID,
		Name:         batch.Name,
		Description:  batch.Description,
		Code:         batch.Code,
		InstructorID: batch.InstructorID,
		MaxStudents:  batch.MaxStudents,
		StartDate:    batch.StartDate,
		EndDate:      batch.EndDate,
		Status:       batch.Status,
		IsActive:     batch.IsActive,
		StudentCount: studentCount,
		CreatedAt:    batch.CreatedAt,
		UpdatedAt:    batch.UpdatedAt,
	}
}
