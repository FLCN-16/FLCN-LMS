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

// ModuleService handles module business logic
type ModuleService struct {
	moduleRepo *repository.ModuleRepository
	courseRepo *repository.CourseRepository
}

// NewModuleService creates a new module service instance
// Parameters:
//   - moduleRepo: Module repository for database operations
//   - courseRepo: Course repository for database operations
//
// Returns:
//   - *ModuleService: New module service instance
func NewModuleService(moduleRepo *repository.ModuleRepository, courseRepo *repository.CourseRepository) *ModuleService {
	return &ModuleService{
		moduleRepo: moduleRepo,
		courseRepo: courseRepo,
	}
}

// CreateModuleRequest represents a module creation request
type CreateModuleRequest struct {
	CourseID    uuid.UUID `json:"course_id" binding:"required"`
	Title       string    `json:"title" binding:"required,min=3,max=255"`
	Description string    `json:"description" binding:"required,min=10"`
	OrderIndex  int       `json:"order_index" binding:"min=0"`
}

// UpdateModuleRequest represents a module update request
type UpdateModuleRequest struct {
	Title       string `json:"title" binding:"omitempty,min=3,max=255"`
	Description string `json:"description" binding:"omitempty,min=10"`
	OrderIndex  *int   `json:"order_index" binding:"omitempty,min=0"`
}

// ModuleResponse represents a module in API responses
type ModuleResponse struct {
	ID          uuid.UUID `json:"id"`
	CourseID    uuid.UUID `json:"course_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	LessonCount int64     `json:"lesson_count,omitempty"`
}

// ModuleWithLessonsResponse represents a module with its lessons
type ModuleWithLessonsResponse struct {
	ID          uuid.UUID        `json:"id"`
	CourseID    uuid.UUID        `json:"course_id"`
	Title       string           `json:"title"`
	Description string           `json:"description"`
	OrderIndex  int              `json:"order_index"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	Lessons     []LessonResponse `json:"lessons,omitempty"`
}

// CreateModule creates a new module
// Parameters:
//   - req: Module creation request
//
// Returns:
//   - *ModuleResponse: Created module details
//   - error: Error if creation fails
func (ms *ModuleService) CreateModule(req *CreateModuleRequest) (*ModuleResponse, error) {
	log.Println("[Module Service] Creating new module:", req.Title)

	// Validate input
	if req.CourseID == uuid.Nil || req.Title == "" || req.Description == "" {
		return nil, errors.New("course_id, title, and description are required")
	}

	// Verify course exists
	_, err := ms.courseRepo.GetByID(req.CourseID)
	if err != nil {
		log.Printf("[Module Service] Course not found: %v", err)
		return nil, fmt.Errorf("course not found: %w", err)
	}

	// Create module
	module := &models.Module{
		ID:          uuid.New(),
		CourseID:    req.CourseID,
		Title:       req.Title,
		Description: req.Description,
		OrderIndex:  req.OrderIndex,
	}

	if err := ms.moduleRepo.Create(module); err != nil {
		log.Printf("[Module Service] Failed to create module: %v", err)
		return nil, fmt.Errorf("failed to create module: %w", err)
	}

	log.Printf("[Module Service] Module created successfully: %s", module.ID)
	return moduleToResponse(module), nil
}

// GetModule retrieves a module by ID
// Parameters:
//   - id: Module UUID
//
// Returns:
//   - *ModuleResponse: Module details
//   - error: Error if module not found
func (ms *ModuleService) GetModule(id uuid.UUID) (*ModuleResponse, error) {
	module, err := ms.moduleRepo.GetByID(id)
	if err != nil {
		log.Printf("[Module Service] Failed to get module %s: %v", id, err)
		return nil, err
	}
	return moduleToResponse(module), nil
}

// ListModules retrieves paginated list of modules
// Parameters:
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []ModuleResponse: List of modules
//   - int64: Total count of modules
//   - error: Error if query fails
func (ms *ModuleService) ListModules(page, limit int) ([]ModuleResponse, int64, error) {
	modules, total, err := ms.moduleRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Module Service] Failed to list modules: %v", err)
		return nil, 0, err
	}

	var responses []ModuleResponse
	for _, module := range modules {
		responses = append(responses, *moduleToResponse(&module))
	}

	return responses, total, nil
}

// GetModulesByCourse retrieves all modules for a specific course
// Parameters:
//   - courseID: Course UUID
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []ModuleResponse: List of course modules
//   - int64: Total count of course modules
//   - error: Error if query fails
func (ms *ModuleService) GetModulesByCourse(courseID uuid.UUID, page, limit int) ([]ModuleResponse, int64, error) {
	modules, total, err := ms.moduleRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		log.Printf("[Module Service] Failed to get modules for course %s: %v", courseID, err)
		return nil, 0, err
	}

	var responses []ModuleResponse
	for _, module := range modules {
		responses = append(responses, *moduleToResponse(&module))
	}

	return responses, total, nil
}

// UpdateModule updates an existing module
// Parameters:
//   - id: Module UUID
//   - req: Update request with partial module data
//
// Returns:
//   - *ModuleResponse: Updated module details
//   - error: Error if update fails
func (ms *ModuleService) UpdateModule(id uuid.UUID, req *UpdateModuleRequest) (*ModuleResponse, error) {
	log.Printf("[Module Service] Updating module: %s", id)

	// Get existing module
	module, err := ms.moduleRepo.GetByID(id)
	if err != nil {
		log.Printf("[Module Service] Failed to get module %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if req.Title != "" {
		module.Title = req.Title
	}
	if req.Description != "" {
		module.Description = req.Description
	}
	if req.OrderIndex != nil {
		module.OrderIndex = *req.OrderIndex
	}

	if err := ms.moduleRepo.Update(module); err != nil {
		log.Printf("[Module Service] Failed to update module: %v", err)
		return nil, fmt.Errorf("failed to update module: %w", err)
	}

	log.Printf("[Module Service] Module updated successfully: %s", id)
	return moduleToResponse(module), nil
}

// DeleteModule deletes a module
// Parameters:
//   - id: Module UUID
//
// Returns:
//   - error: Error if deletion fails
func (ms *ModuleService) DeleteModule(id uuid.UUID) error {
	log.Printf("[Module Service] Deleting module: %s", id)

	// Verify module exists
	_, err := ms.moduleRepo.GetByID(id)
	if err != nil {
		log.Printf("[Module Service] Failed to get module %s: %v", id, err)
		return err
	}

	if err := ms.moduleRepo.Delete(id); err != nil {
		log.Printf("[Module Service] Failed to delete module: %v", err)
		return fmt.Errorf("failed to delete module: %w", err)
	}

	log.Printf("[Module Service] Module deleted successfully: %s", id)
	return nil
}

// SearchModules searches for modules by title or description
// Parameters:
//   - query: Search query
//   - page: Page number (1-based)
//   - limit: Number of modules per page
//
// Returns:
//   - []ModuleResponse: List of matching modules
//   - int64: Total count of matching modules
//   - error: Error if query fails
func (ms *ModuleService) SearchModules(query string, page, limit int) ([]ModuleResponse, int64, error) {
	modules, total, err := ms.moduleRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Module Service] Failed to search modules: %v", err)
		return nil, 0, err
	}

	var responses []ModuleResponse
	for _, module := range modules {
		responses = append(responses, *moduleToResponse(&module))
	}

	return responses, total, nil
}

// ReorderModules updates the order of modules in a course
// Parameters:
//   - courseID: Course UUID
//   - moduleOrders: Map of module IDs to their new order indices
//
// Returns:
//   - error: Error if reordering fails
func (ms *ModuleService) ReorderModules(courseID uuid.UUID, moduleOrders map[uuid.UUID]int) error {
	log.Printf("[Module Service] Reordering modules for course: %s", courseID)

	// Verify course exists
	_, err := ms.courseRepo.GetByID(courseID)
	if err != nil {
		log.Printf("[Module Service] Course not found: %v", err)
		return fmt.Errorf("course not found: %w", err)
	}

	// Update order for each module
	for moduleID, orderIndex := range moduleOrders {
		if err := ms.moduleRepo.UpdatePartial(moduleID, map[string]interface{}{
			"order_index": orderIndex,
		}); err != nil {
			log.Printf("[Module Service] Failed to reorder module: %v", err)
			return fmt.Errorf("failed to reorder module %s: %w", moduleID, err)
		}
	}

	log.Printf("[Module Service] Modules reordered successfully for course: %s", courseID)
	return nil
}

// GetModuleCount returns the total number of modules
// Returns:
//   - int64: Total count of modules
//   - error: Error if query fails
func (ms *ModuleService) GetModuleCount() (int64, error) {
	count, err := ms.moduleRepo.GetModuleCount()
	if err != nil {
		log.Printf("[Module Service] Failed to get module count: %v", err)
		return 0, err
	}
	return count, nil
}

// GetModuleCountByCourse returns the total number of modules in a course
// Parameters:
//   - courseID: Course UUID
//
// Returns:
//   - int64: Total count of modules in the course
//   - error: Error if query fails
func (ms *ModuleService) GetModuleCountByCourse(courseID uuid.UUID) (int64, error) {
	count, err := ms.moduleRepo.GetModuleCountByCourse(courseID)
	if err != nil {
		log.Printf("[Module Service] Failed to get module count for course: %v", err)
		return 0, err
	}
	return count, nil
}

// Helper functions

// moduleToResponse converts a Module model to a ModuleResponse
func moduleToResponse(module *models.Module) *ModuleResponse {
	return &ModuleResponse{
		ID:          module.ID,
		CourseID:    module.CourseID,
		Title:       module.Title,
		Description: module.Description,
		OrderIndex:  module.OrderIndex,
		CreatedAt:   module.CreatedAt,
		UpdatedAt:   module.UpdatedAt,
	}
}

// moduleWithLessonsToResponse converts a Module model to a ModuleWithLessonsResponse
func moduleWithLessonsToResponse(module *models.Module) *ModuleWithLessonsResponse {
	var lessonResponses []LessonResponse
	if module.Lessons != nil {
		for _, lesson := range module.Lessons {
			lessonResponses = append(lessonResponses, *lessonToResponse(&lesson))
		}
	}

	return &ModuleWithLessonsResponse{
		ID:          module.ID,
		CourseID:    module.CourseID,
		Title:       module.Title,
		Description: module.Description,
		OrderIndex:  module.OrderIndex,
		CreatedAt:   module.CreatedAt,
		UpdatedAt:   module.UpdatedAt,
		Lessons:     lessonResponses,
	}
}
