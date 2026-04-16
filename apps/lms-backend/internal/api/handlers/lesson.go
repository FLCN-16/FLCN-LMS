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

// LessonHandler handles all lesson-related HTTP requests
type LessonHandler struct {
	lessonService *service.LessonService
}

// NewLessonHandler creates a new lesson handler instance
func NewLessonHandler(lessonService *service.LessonService) *LessonHandler {
	return &LessonHandler{
		lessonService: lessonService,
	}
}

// ListLessons godoc
// @Summary List all lessons
// @Description Retrieve paginated list of all lessons
// @Tags Lessons
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of lessons per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /lessons [get]
func (lh *LessonHandler) ListLessons(c *gin.Context) {
	log.Println("[Lesson Handler] Listing all lessons")

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

	lessons, total, err := lh.lessonService.ListLessons(page, limit)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to list lessons: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  lessons,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetLesson godoc
// @Summary Get lesson by ID
// @Description Retrieve a specific lesson by ID
// @Tags Lessons
// @Accept json
// @Produce json
// @Param id path string true "Lesson ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /lessons/{id} [get]
func (lh *LessonHandler) GetLesson(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Lesson Handler] Invalid lesson ID: %v", err)
		response.BadRequest(c, "Invalid lesson ID")
		return
	}

	lesson, err := lh.lessonService.GetLesson(id)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to get lesson: %v", err)
		response.NotFound(c, "Lesson not found")
		return
	}

	response.Success(c, http.StatusOK, lesson)
}

// GetLessonsByModule godoc
// @Summary Get lessons for a module
// @Description Retrieve paginated list of lessons for a specific module
// @Tags Lessons
// @Accept json
// @Produce json
// @Param moduleId path string true "Module ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of lessons per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /modules/{moduleId}/lessons [get]
func (lh *LessonHandler) GetLessonsByModule(c *gin.Context) {
	moduleIDStr := c.Param("moduleId")
	moduleID, err := uuid.Parse(moduleIDStr)
	if err != nil {
		log.Printf("[Lesson Handler] Invalid module ID: %v", err)
		response.BadRequest(c, "Invalid module ID")
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

	lessons, total, err := lh.lessonService.GetLessonsByModule(moduleID, page, limit)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to get lessons for module: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  lessons,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateLesson godoc
// @Summary Create a new lesson
// @Description Create a new lesson for a module (faculty/admin only)
// @Tags Lessons
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateLessonRequest true "Lesson creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 409 {object} response.Response
// @Router /lessons [post]
func (lh *LessonHandler) CreateLesson(c *gin.Context) {
	log.Println("[Lesson Handler] Creating new lesson")

	var req service.CreateLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Lesson Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	lesson, err := lh.lessonService.CreateLesson(&req)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to create lesson: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, lesson)
}

// UpdateLesson godoc
// @Summary Update a lesson
// @Description Update an existing lesson (faculty/admin only)
// @Tags Lessons
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Lesson ID"
// @Param request body service.UpdateLessonRequest true "Lesson update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /lessons/{id} [patch]
func (lh *LessonHandler) UpdateLesson(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Lesson Handler] Invalid lesson ID: %v", err)
		response.BadRequest(c, "Invalid lesson ID")
		return
	}

	var req service.UpdateLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Lesson Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	lesson, err := lh.lessonService.UpdateLesson(id, &req)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to update lesson: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, lesson)
}

// DeleteLesson godoc
// @Summary Delete a lesson
// @Description Delete a lesson (faculty/admin only)
// @Tags Lessons
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Lesson ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /lessons/{id} [delete]
func (lh *LessonHandler) DeleteLesson(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Lesson Handler] Invalid lesson ID: %v", err)
		response.BadRequest(c, "Invalid lesson ID")
		return
	}

	if err := lh.lessonService.DeleteLesson(id); err != nil {
		log.Printf("[Lesson Handler] Failed to delete lesson: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// SearchLessons godoc
// @Summary Search lessons
// @Description Search lessons by title or description
// @Tags Lessons
// @Accept json
// @Produce json
// @Param q query string true "Search query"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of lessons per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /lessons/search [get]
func (lh *LessonHandler) SearchLessons(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		log.Println("[Lesson Handler] Search query is empty")
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

	lessons, total, err := lh.lessonService.SearchLessons(query, page, limit)
	if err != nil {
		log.Printf("[Lesson Handler] Failed to search lessons: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  lessons,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
