package handlers

import (
	"net/http"
	"strconv"
	"time"

	"flcn-lms/internal/models"
	"flcn-lms/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type DPPHandler struct {
	service service.DPPService
}

func NewDPPHandler(service service.DPPService) *DPPHandler {
	return &DPPHandler{service: service}
}

// CreateDPP creates a new daily practice paper
// POST /api/v1/dpp
func (h *DPPHandler) CreateDPP(c *gin.Context) {
	var req struct {
		Title       string     `json:"title" binding:"required"`
		Description string     `json:"description"`
		CourseID    *uuid.UUID `json:"course_id"`
		BatchID     *uuid.UUID `json:"batch_id"`
		ScheduledAt time.Time  `json:"scheduled_at" binding:"required"`
		DueAt       time.Time  `json:"due_at"`
		Status      string     `json:"status" binding:"required,oneof=draft published closed"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user ID not found"})
		return
	}

	dpp := &models.DailyPracticePaper{
		Title:       req.Title,
		Description: req.Description,
		CourseID:    req.CourseID,
		BatchID:     req.BatchID,
		CreatedByID: userID.(uuid.UUID),
		ScheduledAt: req.ScheduledAt,
		DueAt:       req.DueAt,
		Status:      req.Status,
		IsActive:    true,
	}

	if err := h.service.CreateDPP(c.Request.Context(), dpp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dpp)
}

// GetDPP retrieves a specific DPP
// GET /api/v1/dpp/:id
func (h *DPPHandler) GetDPP(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid DPP ID"})
		return
	}

	dpp, err := h.service.GetDPP(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if dpp == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DPP not found"})
		return
	}

	c.JSON(http.StatusOK, dpp)
}

// ListDPPByCourse lists DPPs for a course
// GET /api/v1/dpp/course/:courseId
func (h *DPPHandler) ListDPPByCourse(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("courseId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if ps := c.Query("pageSize"); ps != "" {
		if parsed, err := strconv.Atoi(ps); err == nil && parsed > 0 {
			pageSize = parsed
		}
	}

	dpps, total, err := h.service.ListDPPByCourse(c.Request.Context(), courseID, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  dpps,
		"total": total,
		"page":  page,
	})
}

// ListActiveDPP lists all active DPPs
// GET /api/v1/dpp
func (h *DPPHandler) ListActiveDPP(c *gin.Context) {
	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if ps := c.Query("pageSize"); ps != "" {
		if parsed, err := strconv.Atoi(ps); err == nil && parsed > 0 {
			pageSize = parsed
		}
	}

	dpps, total, err := h.service.ListActiveDPP(c.Request.Context(), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  dpps,
		"total": total,
		"page":  page,
	})
}

// UpdateDPP updates a DPP
// PUT /api/v1/dpp/:id
func (h *DPPHandler) UpdateDPP(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid DPP ID"})
		return
	}

	var req struct {
		Title       string     `json:"title"`
		Description string     `json:"description"`
		CourseID    *uuid.UUID `json:"course_id"`
		BatchID     *uuid.UUID `json:"batch_id"`
		ScheduledAt time.Time  `json:"scheduled_at"`
		DueAt       time.Time  `json:"due_at"`
		Status      string     `json:"status"`
		IsActive    *bool      `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dpp, err := h.service.GetDPP(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if dpp == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DPP not found"})
		return
	}

	// Update fields
	if req.Title != "" {
		dpp.Title = req.Title
	}
	if req.Description != "" {
		dpp.Description = req.Description
	}
	if req.CourseID != nil {
		dpp.CourseID = req.CourseID
	}
	if req.BatchID != nil {
		dpp.BatchID = req.BatchID
	}
	if !req.ScheduledAt.IsZero() {
		dpp.ScheduledAt = req.ScheduledAt
	}
	if !req.DueAt.IsZero() {
		dpp.DueAt = req.DueAt
	}
	if req.Status != "" {
		dpp.Status = req.Status
	}
	if req.IsActive != nil {
		dpp.IsActive = *req.IsActive
	}

	if err := h.service.UpdateDPP(c.Request.Context(), dpp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dpp)
}

// PublishDPP publishes a DPP
// PATCH /api/v1/dpp/:id/publish
func (h *DPPHandler) PublishDPP(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid DPP ID"})
		return
	}

	if err := h.service.PublishDPP(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "DPP published successfully"})
}

// DeleteDPP deletes a DPP
// DELETE /api/v1/dpp/:id
func (h *DPPHandler) DeleteDPP(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid DPP ID"})
		return
	}

	if err := h.service.DeleteDPP(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "DPP deleted successfully"})
}

// GetUpcomingDPP gets upcoming DPPs
// GET /api/v1/dpp/upcoming
func (h *DPPHandler) GetUpcomingDPP(c *gin.Context) {
	limit := 10
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	dpps, err := h.service.GetUpcomingDPP(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dpps})
}
