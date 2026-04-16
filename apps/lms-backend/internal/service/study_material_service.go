package service

import (
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
)

// StudyMaterialService handles study material business logic
type StudyMaterialService struct {
	materialRepo *repository.StudyMaterialRepository
	courseRepo   *repository.CourseRepository
}

// NewStudyMaterialService creates a new study material service instance
func NewStudyMaterialService(materialRepo *repository.StudyMaterialRepository, courseRepo *repository.CourseRepository) *StudyMaterialService {
	return &StudyMaterialService{
		materialRepo: materialRepo,
		courseRepo:   courseRepo,
	}
}

// StudyMaterialResponse represents a study material in API responses
type StudyMaterialResponse struct {
	ID          uuid.UUID `json:"id"`
	CourseID    uuid.UUID `json:"course_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	FileURL     string    `json:"file_url"`
	FileSize    int64     `json:"file_size"`
	FileType    string    `json:"file_type"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ListStudyMaterials retrieves paginated list of study materials
func (sms *StudyMaterialService) ListStudyMaterials(page, limit int) ([]StudyMaterialResponse, int64, error) {
	materials, total, err := sms.materialRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Study Material Service] Failed to list materials: %v", err)
		return nil, 0, err
	}

	var responses []StudyMaterialResponse
	for _, material := range materials {
		responses = append(responses, *materialToResponse(&material))
	}

	return responses, total, nil
}

// GetStudyMaterial retrieves a study material by ID
func (sms *StudyMaterialService) GetStudyMaterial(id uuid.UUID) (*StudyMaterialResponse, error) {
	material, err := sms.materialRepo.GetByID(id)
	if err != nil {
		log.Printf("[Study Material Service] Failed to get material %s: %v", id, err)
		return nil, err
	}
	return materialToResponse(&material), nil
}

// GetMaterialsByCourse retrieves all materials for a specific course
func (sms *StudyMaterialService) GetMaterialsByCourse(courseID uuid.UUID, page, limit int) ([]StudyMaterialResponse, int64, error) {
	materials, total, err := sms.materialRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		log.Printf("[Study Material Service] Failed to get materials for course %s: %v", courseID, err)
		return nil, 0, err
	}

	var responses []StudyMaterialResponse
	for _, material := range materials {
		responses = append(responses, *materialToResponse(&material))
	}

	return responses, total, nil
}

// CreateStudyMaterial creates a new study material with file upload
func (sms *StudyMaterialService) CreateStudyMaterial(
	courseID uuid.UUID,
	title string,
	description string,
	filename string,
	fileContent io.Reader,
) (*StudyMaterialResponse, error) {
	log.Printf("[Study Material Service] Creating study material for course: %s", courseID)

	// Verify course exists
	_, err := sms.courseRepo.GetByID(courseID)
	if err != nil {
		log.Printf("[Study Material Service] Course not found: %v", err)
		return nil, fmt.Errorf("course not found: %w", err)
	}

	// Validate input
	if title == "" || filename == "" {
		return nil, errors.New("title and filename are required")
	}

	// Create uploads directory if it doesn't exist
	uploadDir := "./uploads/study-materials"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Printf("[Study Material Service] Failed to create upload directory: %v", err)
		return nil, fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Generate unique filename
	fileID := uuid.New().String()
	ext := filepath.Ext(filename)
	savedFilename := fmt.Sprintf("%s%s", fileID, ext)
	filePath := filepath.Join(uploadDir, savedFilename)

	// Save file to disk
	file, err := os.Create(filePath)
	if err != nil {
		log.Printf("[Study Material Service] Failed to create file: %v", err)
		return nil, fmt.Errorf("failed to save file: %w", err)
	}
	defer file.Close()

	fileSize, err := io.Copy(file, fileContent)
	if err != nil {
		log.Printf("[Study Material Service] Failed to write file: %v", err)
		os.Remove(filePath)
		return nil, fmt.Errorf("failed to save file: %w", err)
	}

	// Create material record
	material := &models.StudyMaterial{
		ID:          uuid.New(),
		CourseID:    courseID,
		Title:       title,
		Description: description,
		FileURL:     fmt.Sprintf("/uploads/study-materials/%s", savedFilename),
		FileSize:    fileSize,
		FileType:    filepath.Ext(filename),
	}

	if err := sms.materialRepo.Create(material); err != nil {
		log.Printf("[Study Material Service] Failed to create material: %v", err)
		os.Remove(filePath)
		return nil, fmt.Errorf("failed to create material: %w", err)
	}

	log.Printf("[Study Material Service] Study material created successfully: %s", material.ID)
	return materialToResponse(material), nil
}

// UpdateStudyMaterial updates an existing study material
func (sms *StudyMaterialService) UpdateStudyMaterial(id uuid.UUID, updateData map[string]interface{}) (*StudyMaterialResponse, error) {
	log.Printf("[Study Material Service] Updating material: %s", id)

	// Get existing material
	material, err := sms.materialRepo.GetByID(id)
	if err != nil {
		log.Printf("[Study Material Service] Failed to get material %s: %v", id, err)
		return nil, err
	}

	// Update fields if provided
	if title, ok := updateData["title"].(string); ok && title != "" {
		material.Title = title
	}
	if description, ok := updateData["description"].(string); ok {
		material.Description = description
	}

	if err := sms.materialRepo.Update(&material); err != nil {
		log.Printf("[Study Material Service] Failed to update material: %v", err)
		return nil, fmt.Errorf("failed to update material: %w", err)
	}

	log.Printf("[Study Material Service] Material updated successfully: %s", id)
	return materialToResponse(&material), nil
}

// DeleteStudyMaterial deletes a study material and its file
func (sms *StudyMaterialService) DeleteStudyMaterial(id uuid.UUID) error {
	log.Printf("[Study Material Service] Deleting material: %s", id)

	// Get material to retrieve file path
	material, err := sms.materialRepo.GetByID(id)
	if err != nil {
		log.Printf("[Study Material Service] Failed to get material %s: %v", id, err)
		return err
	}

	// Delete file from disk
	if material.FileURL != "" {
		filePath := "." + material.FileURL
		if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
			log.Printf("[Study Material Service] Warning: Failed to delete file: %v", err)
		}
	}

	// Delete database record
	if err := sms.materialRepo.Delete(id); err != nil {
		log.Printf("[Study Material Service] Failed to delete material: %v", err)
		return fmt.Errorf("failed to delete material: %w", err)
	}

	log.Printf("[Study Material Service] Material deleted successfully: %s", id)
	return nil
}

// SearchStudyMaterials searches for study materials by query
func (sms *StudyMaterialService) SearchStudyMaterials(query string, page, limit int) ([]StudyMaterialResponse, int64, error) {
	materials, total, err := sms.materialRepo.Search(query, page, limit)
	if err != nil {
		log.Printf("[Study Material Service] Failed to search materials: %v", err)
		return nil, 0, err
	}

	var responses []StudyMaterialResponse
	for _, material := range materials {
		responses = append(responses, *materialToResponse(&material))
	}

	return responses, total, nil
}

// Helper function to convert model to response
func materialToResponse(material *models.StudyMaterial) *StudyMaterialResponse {
	return &StudyMaterialResponse{
		ID:          material.ID,
		CourseID:    material.CourseID,
		Title:       material.Title,
		Description: material.Description,
		FileURL:     material.FileURL,
		FileSize:    material.FileSize,
		FileType:    material.FileType,
		CreatedAt:   material.CreatedAt,
		UpdatedAt:   material.UpdatedAt,
	}
}
