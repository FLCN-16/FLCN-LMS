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

// ModuleHandler handles all module-related HTTP requests
type ModuleHandler struct {
	moduleService *service.ModuleService
}

// NewModuleHandler creates a new module handler instance
func NewModuleHandler(moduleService *service.ModuleService) *ModuleHandler {
	return &ModuleHandler{
		moduleService: moduleService,
	}
}

// ListModules godoc
// @Summary List all modules
// @Description Retrieve paginated list of modules
// @Tags Modules
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of modules per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /modules [get]
func (mh *ModuleHandler) ListModules(c *gin.Context) {
	log.Println("[Module Handler] Listing all modules")

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

	modules, total, err := mh.moduleService.ListModules(page, limit)
	if err != nil {
		log.Printf("[Module Handler] Failed to list modules: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  modules,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetModule godoc
// @Summary Get module by ID
// @Description Retrieve a specific module by ID
// @Tags Modules
// @Accept json
// @Produce json
// @Param id path string true "Module ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /modules/{id} [get]
func (mh *ModuleHandler) GetModule(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Module Handler] Invalid module ID: %v", err)
		response.BadRequest(c, "Invalid module ID")
		return
	}

	module, err := mh.moduleService.GetModule(id)
	if err != nil {
		log.Printf("[Module Handler] Failed to get module: %v", err)
		response.NotFound(c, "Module not found")
		return
	}

	response.Success(c, http.StatusOK, module)
}

// GetModulesByCourse godoc
// @Summary Get modules for a course
// @Description Retrieve paginated list of modules for a specific course
// @Tags Modules
// @Accept json
// @Produce json
// @Param courseId path string true "Course ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of modules per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /courses/{courseId}/modules [get]
func (mh *ModuleHandler) GetModulesByCourse(c *gin.Context) {
	courseIDStr := c.Param("courseId")
	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		log.Printf("[Module Handler] Invalid course ID: %v", err)
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

	modules, total, err := mh.moduleService.GetModulesByCourse(courseID, page, limit)
	if err != nil {
		log.Printf("[Module Handler] Failed to get modules for course: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  modules,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateModule godoc
// @Summary Create a new module
// @Description Create a new module for a course (faculty/admin only)
// @Tags Modules
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateModuleRequest true "Module creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 409 {object} response.Response
// @Router /modules [post]
func (mh *ModuleHandler) CreateModule(c *gin.Context) {
	log.Println("[Module Handler] Creating new module")

	var req service.CreateModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Module Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	module, err := mh.moduleService.CreateModule(&req)
	if err != nil {
		log.Printf("[Module Handler] Failed to create module: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, module)
}

// UpdateModule godoc
// @Summary Update a module
// @Description Update an existing module (faculty/admin only)
// @Tags Modules
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Module ID"
// @Param request body service.UpdateModuleRequest true "Module update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /modules/{id} [patch]
func (mh *ModuleHandler) UpdateModule(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Module Handler] Invalid module ID: %v", err)
		response.BadRequest(c, "Invalid module ID")
		return
	}

	var req service.UpdateModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Module Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	module, err := mh.moduleService.UpdateModule(id, &req)
	if err != nil {
		log.Printf("[Module Handler] Failed to update module: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, module)
}

// DeleteModule godoc
// @Summary Delete a module
// @Description Delete a module and all its lessons (faculty/admin only)
// @Tags Modules
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Module ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /modules/{id} [delete]
func (mh *ModuleHandler) DeleteModule(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Module Handler] Invalid module ID: %v", err)
		response.BadRequest(c, "Invalid module ID")
		return
	}

	if err := mh.moduleService.DeleteModule(id); err != nil {
		log.Printf("[Module Handler] Failed to delete module: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// SearchModules godoc
// @Summary Search modules
// @Description Search modules by title or description
// @Tags Modules
// @Accept json
// @Produce json
// @Param q query string true "Search query"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of modules per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /modules/search [get]
func (mh *ModuleHandler) SearchModules(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		log.Println("[Module Handler] Search query is empty")
		response.BadRequest(c, "Search query is required")
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

	modules, total, err := mh.moduleService.SearchModules(query, page, limit)
	if err != nil {
		log.Printf("[Module Handler] Failed to search modules: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  modules,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
