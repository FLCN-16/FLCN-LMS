package service

import (
	"encoding/json"
	"fmt"
	"log"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// CoursePackageService handles course package business logic
type CoursePackageService struct {
	packageRepo *repository.CoursePackageRepository
}

// NewCoursePackageService creates a new CoursePackageService
func NewCoursePackageService(packageRepo *repository.CoursePackageRepository) *CoursePackageService {
	return &CoursePackageService{packageRepo: packageRepo}
}

// PackageFeatureDTO represents a feature item in API responses
type PackageFeatureDTO struct {
	Title      string `json:"title"`
	IsIncluded bool   `json:"is_included"`
}

// CoursePackageResponse is the API response for a course package
type CoursePackageResponse struct {
	ID            uuid.UUID           `json:"id"`
	CourseID      uuid.UUID           `json:"course_id"`
	Name          string              `json:"name"`
	Price         float64             `json:"price"`
	OriginalPrice *float64            `json:"original_price"`
	ValidityDays  int                 `json:"validity_days"`
	Features      []PackageFeatureDTO `json:"features"`
	IsActive      bool                `json:"is_active"`
	SortOrder     int                 `json:"sort_order"`
}

// CreatePackageRequest is the request body for creating a package
type CreatePackageRequest struct {
	CourseID      uuid.UUID           `json:"course_id" binding:"required"`
	Name          string              `json:"name" binding:"required"`
	Price         float64             `json:"price" binding:"required"`
	OriginalPrice *float64            `json:"original_price"`
	ValidityDays  int                 `json:"validity_days" binding:"required"`
	Features      []PackageFeatureDTO `json:"features"`
	IsActive      *bool               `json:"is_active"`
	SortOrder     int                 `json:"sort_order"`
}

// UpdatePackageRequest is the request body for updating a package
type UpdatePackageRequest struct {
	Name          *string             `json:"name"`
	Price         *float64            `json:"price"`
	OriginalPrice *float64            `json:"original_price"`
	ValidityDays  *int                `json:"validity_days"`
	Features      []PackageFeatureDTO `json:"features"`
	IsActive      *bool               `json:"is_active"`
	SortOrder     *int                `json:"sort_order"`
}

// GetPackagesByCourseSlug returns active packages for a course by its slug
func (s *CoursePackageService) GetPackagesByCourseSlug(slug string) ([]CoursePackageResponse, error) {
	packages, err := s.packageRepo.GetByCourseSlug(slug)
	if err != nil {
		log.Printf("[PackageService] Error fetching packages for slug %s: %v", slug, err)
		return nil, err
	}

	result := make([]CoursePackageResponse, 0, len(packages))
	for _, pkg := range packages {
		result = append(result, *packageToResponse(&pkg))
	}
	return result, nil
}

// GetPackagesByCourseID returns packages for a course
func (s *CoursePackageService) GetPackagesByCourseID(courseID uuid.UUID, activeOnly bool) ([]CoursePackageResponse, error) {
	packages, err := s.packageRepo.GetByCourseID(courseID, activeOnly)
	if err != nil {
		return nil, err
	}

	result := make([]CoursePackageResponse, 0, len(packages))
	for _, pkg := range packages {
		result = append(result, *packageToResponse(&pkg))
	}
	return result, nil
}

// GetPackage retrieves a single package by ID
func (s *CoursePackageService) GetPackage(id uuid.UUID) (*CoursePackageResponse, error) {
	pkg, err := s.packageRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return packageToResponse(pkg), nil
}

// CreatePackage creates a new course package
func (s *CoursePackageService) CreatePackage(req *CreatePackageRequest) (*CoursePackageResponse, error) {
	featuresJSON, err := marshalFeatures(req.Features)
	if err != nil {
		return nil, fmt.Errorf("invalid features: %w", err)
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	pkg := &models.CoursePackage{
		CourseID:      req.CourseID,
		Name:          req.Name,
		Price:         req.Price,
		OriginalPrice: req.OriginalPrice,
		ValidityDays:  req.ValidityDays,
		Features:      featuresJSON,
		IsActive:      isActive,
		SortOrder:     req.SortOrder,
	}

	if err := s.packageRepo.Create(pkg); err != nil {
		return nil, fmt.Errorf("failed to create package: %w", err)
	}

	return packageToResponse(pkg), nil
}

// UpdatePackage updates a course package
func (s *CoursePackageService) UpdatePackage(id uuid.UUID, req *UpdatePackageRequest) (*CoursePackageResponse, error) {
	pkg, err := s.packageRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		pkg.Name = *req.Name
	}
	if req.Price != nil {
		pkg.Price = *req.Price
	}
	if req.OriginalPrice != nil {
		pkg.OriginalPrice = req.OriginalPrice
	}
	if req.ValidityDays != nil {
		pkg.ValidityDays = *req.ValidityDays
	}
	if req.Features != nil {
		featuresJSON, err := marshalFeatures(req.Features)
		if err != nil {
			return nil, fmt.Errorf("invalid features: %w", err)
		}
		pkg.Features = featuresJSON
	}
	if req.IsActive != nil {
		pkg.IsActive = *req.IsActive
	}
	if req.SortOrder != nil {
		pkg.SortOrder = *req.SortOrder
	}

	if err := s.packageRepo.Update(pkg); err != nil {
		return nil, fmt.Errorf("failed to update package: %w", err)
	}

	return packageToResponse(pkg), nil
}

// DeletePackage deletes a course package
func (s *CoursePackageService) DeletePackage(id uuid.UUID) error {
	return s.packageRepo.Delete(id)
}

// --- Helpers ---

func marshalFeatures(features []PackageFeatureDTO) (datatypes.JSON, error) {
	if features == nil {
		return datatypes.JSON("[]"), nil
	}
	b, err := json.Marshal(features)
	if err != nil {
		return nil, err
	}
	return datatypes.JSON(b), nil
}

func packageToResponse(pkg *models.CoursePackage) *CoursePackageResponse {
	var features []PackageFeatureDTO
	if len(pkg.Features) > 0 {
		_ = json.Unmarshal(pkg.Features, &features)
	}
	if features == nil {
		features = []PackageFeatureDTO{}
	}

	return &CoursePackageResponse{
		ID:            pkg.ID,
		CourseID:      pkg.CourseID,
		Name:          pkg.Name,
		Price:         pkg.Price,
		OriginalPrice: pkg.OriginalPrice,
		ValidityDays:  pkg.ValidityDays,
		Features:      features,
		IsActive:      pkg.IsActive,
		SortOrder:     pkg.SortOrder,
	}
}
