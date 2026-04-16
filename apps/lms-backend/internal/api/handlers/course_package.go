package handlers

import (
	"log"
	"net/http"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CoursePackageHandler handles course package HTTP requests
type CoursePackageHandler struct {
	packageService *service.CoursePackageService
}

// NewCoursePackageHandler creates a new CoursePackageHandler
func NewCoursePackageHandler(packageService *service.CoursePackageService) *CoursePackageHandler {
	return &CoursePackageHandler{packageService: packageService}
}

// ListPackagesByCourse returns all active packages for a course (by course ID)
// GET /courses/:id/packages
func (h *CoursePackageHandler) ListPackagesByCourse(c *gin.Context) {
	courseIDStr := c.Param("id")
	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid course ID")
		return
	}

	activeOnly := c.Query("all") != "true"
	packages, err := h.packageService.GetPackagesByCourseID(courseID, activeOnly)
	if err != nil {
		log.Printf("[PackageHandler] Failed to list packages: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, packages)
}

// GetPackage returns a single package by ID
// GET /packages/:id
func (h *CoursePackageHandler) GetPackage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid package ID")
		return
	}

	pkg, err := h.packageService.GetPackage(id)
	if err != nil {
		response.NotFound(c, "Package not found")
		return
	}

	response.Success(c, http.StatusOK, pkg)
}

// CreatePackage creates a new course package
// POST /packages
func (h *CoursePackageHandler) CreatePackage(c *gin.Context) {
	var req service.CreatePackageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	pkg, err := h.packageService.CreatePackage(&req)
	if err != nil {
		log.Printf("[PackageHandler] Failed to create package: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, pkg)
}

// UpdatePackage updates a course package
// PATCH /packages/:id
func (h *CoursePackageHandler) UpdatePackage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid package ID")
		return
	}

	var req service.UpdatePackageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	pkg, err := h.packageService.UpdatePackage(id, &req)
	if err != nil {
		log.Printf("[PackageHandler] Failed to update package: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, pkg)
}

// DeletePackage deletes a course package
// DELETE /packages/:id
func (h *CoursePackageHandler) DeletePackage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid package ID")
		return
	}

	if err := h.packageService.DeletePackage(id); err != nil {
		log.Printf("[PackageHandler] Failed to delete package: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}
