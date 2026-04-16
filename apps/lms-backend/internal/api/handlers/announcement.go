package handlers

import (
	"net/http"
	"strconv"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AnnouncementHandler struct {
	service service.AnnouncementService
}

func NewAnnouncementHandler(service service.AnnouncementService) *AnnouncementHandler {
	return &AnnouncementHandler{service: service}
}

// CreateAnnouncement creates a new announcement
// POST /api/v1/announcements
func (h *AnnouncementHandler) CreateAnnouncement(c *gin.Context) {
	var req struct {
		Title     string     `json:"title" binding:"required"`
		Content   string     `json:"content" binding:"required"`
		CourseID  *uuid.UUID `json:"course_id"`
		BatchID   *uuid.UUID `json:"batch_id"`
		Priority  string     `json:"priority" binding:"omitempty,oneof=low normal high urgent"`
		ExpiresAt *time.Time `json:"expires_at"`
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

	announcement := &models.Announcement{
		Title:     req.Title,
		Content:   req.Content,
		AuthorID:  userID.(uuid.UUID),
		CourseID:  req.CourseID,
		BatchID:   req.BatchID,
		Priority:  req.Priority,
		Status:    "published",
		Published: true,
		ExpiresAt: req.ExpiresAt,
	}

	if req.Priority == "" {
		announcement.Priority = "normal"
	}

	if err := h.service.CreateAnnouncement(c.Request.Context(), announcement); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, announcement)
}

// GetAnnouncement retrieves a specific announcement
// GET /api/v1/announcements/:id
func (h *AnnouncementHandler) GetAnnouncement(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid announcement ID"})
		return
	}

	announcement, err := h.service.GetAnnouncement(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if announcement == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "announcement not found"})
		return
	}

	c.JSON(http.StatusOK, announcement)
}

// ListAnnouncements lists all announcements
// GET /api/v1/announcements
func (h *AnnouncementHandler) ListAnnouncements(c *gin.Context) {
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

	announcements, total, err := h.service.ListPublishedAnnouncements(c.Request.Context(), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  announcements,
		"total": total,
		"page":  page,
	})
}

// ListAnnouncementsByCourse lists announcements for a course
// GET /api/v1/announcements/course/:courseId
func (h *AnnouncementHandler) ListAnnouncementsByCourse(c *gin.Context) {
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

	announcements, total, err := h.service.ListAnnouncementsByCourse(c.Request.Context(), courseID, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  announcements,
		"total": total,
		"page":  page,
	})
}

// GetAnnouncementsForStudent gets announcements relevant to a student
// GET /api/v1/announcements/student
func (h *AnnouncementHandler) GetAnnouncementsForStudent(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user ID not found"})
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

	announcements, total, err := h.service.ListAnnouncementsForStudent(c.Request.Context(), userID.(uuid.UUID), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  announcements,
		"total": total,
		"page":  page,
	})
}

// UpdateAnnouncement updates an announcement
// PUT /api/v1/announcements/:id
func (h *AnnouncementHandler) UpdateAnnouncement(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid announcement ID"})
		return
	}

	var req struct {
		Title     string     `json:"title"`
		Content   string     `json:"content"`
		Priority  string     `json:"priority"`
		ExpiresAt *time.Time `json:"expires_at"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	announcement, err := h.service.GetAnnouncement(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if announcement == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "announcement not found"})
		return
	}

	if req.Title != "" {
		announcement.Title = req.Title
	}
	if req.Content != "" {
		announcement.Content = req.Content
	}
	if req.Priority != "" {
		announcement.Priority = req.Priority
	}
	announcement.ExpiresAt = req.ExpiresAt

	if err := h.service.UpdateAnnouncement(c.Request.Context(), announcement); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, announcement)
}

// ArchiveAnnouncement archives an announcement
// PATCH /api/v1/announcements/:id/archive
func (h *AnnouncementHandler) ArchiveAnnouncement(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid announcement ID"})
		return
	}

	if err := h.service.ArchiveAnnouncement(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "announcement archived successfully"})
}

// DeleteAnnouncement deletes an announcement
// DELETE /api/v1/announcements/:id
func (h *AnnouncementHandler) DeleteAnnouncement(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid announcement ID"})
		return
	}

	if err := h.service.DeleteAnnouncement(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "announcement deleted successfully"})
}
