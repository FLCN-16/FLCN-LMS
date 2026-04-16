package handlers

import (
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// StudyMaterialHandler handles all study material-related HTTP requests
type StudyMaterialHandler struct {
	studyMaterialService *service.StudyMaterialService
}

// NewStudyMaterialHandler creates a new study material handler instance
func NewStudyMaterialHandler(studyMaterialService *service.StudyMaterialService) *StudyMaterialHandler {
	return &StudyMaterialHandler{
		studyMaterialService: studyMaterialService,
	}
}

// ListStudyMaterials godoc
// @Summary List all study materials
// @Description Retrieve paginated list of all study materials
// @Tags Study Materials
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of materials per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /study-materials [get]
func (smh *StudyMaterialHandler) ListStudyMaterials(c *gin.Context) {
	log.Println("[Study Material Handler] Listing all study materials")

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	materials, total, err := smh.studyMaterialService.ListStudyMaterials(page, limit)
	if err != nil {
		log.Printf("[Study Material Handler] Failed to list materials: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  materials,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetStudyMaterial godoc
// @Summary Get study material by ID
// @Description Retrieve a specific study material by ID
// @Tags Study Materials
// @Accept json
// @Produce json
// @Param id path string true "Study Material ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /study-materials/{id} [get]
func (smh *StudyMaterialHandler) GetStudyMaterial(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Study Material Handler] Invalid material ID: %v", err)
		response.BadRequest(c, "Invalid study material ID")
		return
	}

	material, err := smh.studyMaterialService.GetStudyMaterial(id)
	if err != nil {
		log.Printf("[Study Material Handler] Failed to get material: %v", err)
		response.NotFound(c, "Study material not found")
		return
	}

	response.Success(c, http.StatusOK, material)
}

// GetMaterialsByCourse godoc
// @Summary Get study materials for a course
// @Description Retrieve paginated list of study materials for a specific course
// @Tags Study Materials
// @Accept json
// @Produce json
// @Param courseId path string true "Course ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of materials per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /courses/{courseId}/materials [get]
func (smh *StudyMaterialHandler) GetMaterialsByCourse(c *gin.Context) {
	courseIDStr := c.Param("courseId")
	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		log.Printf("[Study Material Handler] Invalid course ID: %v", err)
		response.BadRequest(c, "Invalid course ID")
		return
	}

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	materials, total, err := smh.studyMaterialService.GetMaterialsByCourse(courseID, page, limit)
	if err != nil {
		log.Printf("[Study Material Handler] Failed to get materials for course: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  materials,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateStudyMaterial godoc
// @Summary Create a new study material
// @Description Upload and create a new study material for a course (faculty/admin only)
// @Tags Study Materials
// @Security Bearer
// @Accept multipart/form-data
// @Produce json
// @Param course_id formData string true "Course ID"
// @Param title formData string true "Material title"
// @Param description formData string false "Material description"
// @Param file formData file true "Material file"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /study-materials [post]
func (smh *StudyMaterialHandler) CreateStudyMaterial(c *gin.Context) {
	log.Println("[Study Material Handler] Creating new study material")

	courseIDStr := c.PostForm("course_id")
	if courseIDStr == "" {
		response.BadRequest(c, "course_id is required")
		return
	}

	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid course ID")
		return
	}

	title := c.PostForm("title")
	description := c.PostForm("description")

	if title == "" {
		response.BadRequest(c, "title is required")
		return
	}

	// Handle file upload
	file, header, err := c.FormFile("file")
	if err != nil {
		log.Printf("[Study Material Handler] Failed to get file: %v", err)
		response.BadRequest(c, "file is required")
		return
	}
	defer file.Close()

	// Create material with file info
	material, err := smh.studyMaterialService.CreateStudyMaterial(courseID, title, description, header.Filename, file)
	if err != nil {
		log.Printf("[Study Material Handler] Failed to create material: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, material)
}

// UpdateStudyMaterial godoc
// @Summary Update a study material
// @Description Update an existing study material metadata (faculty/admin only)
// @Tags Study Materials
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Study Material ID"
// @Param request body map[string]interface{} true "Update request (title, description)"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /study-materials/{id} [patch]
func (smh *StudyMaterialHandler) UpdateStudyMaterial(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Study Material Handler] Invalid material ID: %v", err)
		response.BadRequest(c, "Invalid study material ID")
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		log.Printf("[Study Material Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	material, err := smh.studyMaterialService.UpdateStudyMaterial(id, updateData)
	if err != nil {
		log.Printf("[Study Material Handler] Failed to update material: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, material)
}

// DeleteStudyMaterial godoc
// @Summary Delete a study material
// @Description Delete a study material and its associated file (faculty/admin only)
// @Tags Study Materials
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Study Material ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /study-materials/{id} [delete]
func (smh *StudyMaterialHandler) DeleteStudyMaterial(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Study Material Handler] Invalid material ID: %v", err)
		response.BadRequest(c, "Invalid study material ID")
		return
	}

	if err := smh.studyMaterialService.DeleteStudyMaterial(id); err != nil {
		log.Printf("[Study Material Handler] Failed to delete material: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}
