package handlers

import (
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CourseReviewHandler struct {
	service service.CourseReviewService
}

func NewCourseReviewHandler(service service.CourseReviewService) *CourseReviewHandler {
	return &CourseReviewHandler{service: service}
}

// CreateReview creates a new course review
// POST /api/v1/courses/:courseId/reviews
func (h *CourseReviewHandler) CreateReview(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("courseId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	var req struct {
		Rating  int    `json:"rating" binding:"required,min=1,max=5"`
		Title   string `json:"title"`
		Comment string `json:"comment"`
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

	review := &models.CourseReview{
		CourseID:  courseID,
		StudentID: userID.(uuid.UUID),
		Rating:    req.Rating,
		Title:     req.Title,
		Comment:   req.Comment,
		Status:    "pending",
		HelpCount: 0,
	}

	if err := h.service.CreateReview(c.Request.Context(), review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, review)
}

// GetReview retrieves a specific review
// GET /api/v1/reviews/:id
func (h *CourseReviewHandler) GetReview(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	review, err := h.service.GetReview(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if review == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "review not found"})
		return
	}

	c.JSON(http.StatusOK, review)
}

// ListCourseReviews lists reviews for a course
// GET /api/v1/courses/:courseId/reviews
func (h *CourseReviewHandler) ListCourseReviews(c *gin.Context) {
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

	approved := c.Query("approved")
	var reviews []models.CourseReview
	var total int64

	if approved == "true" {
		reviews, total, err = h.service.ListApprovedReviewsByCourse(c.Request.Context(), courseID, page, pageSize)
	} else {
		reviews, total, err = h.service.ListReviewsByCourse(c.Request.Context(), courseID, page, pageSize)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  reviews,
		"total": total,
		"page":  page,
	})
}

// GetStudentReview gets a student's review for a course
// GET /api/v1/courses/:courseId/my-review
func (h *CourseReviewHandler) GetStudentReview(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("courseId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user ID not found"})
		return
	}

	review, err := h.service.GetStudentCourseReview(c.Request.Context(), courseID, userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if review == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "review not found"})
		return
	}

	c.JSON(http.StatusOK, review)
}

// ListMyReviews lists reviews created by the authenticated student
// GET /api/v1/my-reviews
func (h *CourseReviewHandler) ListMyReviews(c *gin.Context) {
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

	reviews, total, err := h.service.ListReviewsByStudent(c.Request.Context(), userID.(uuid.UUID), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  reviews,
		"total": total,
		"page":  page,
	})
}

// UpdateReview updates a review
// PUT /api/v1/reviews/:id
func (h *CourseReviewHandler) UpdateReview(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	var req struct {
		Rating  *int   `json:"rating"`
		Title   string `json:"title"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review, err := h.service.GetReview(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if review == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "review not found"})
		return
	}

	if req.Rating != nil {
		review.Rating = *req.Rating
	}
	if req.Title != "" {
		review.Title = req.Title
	}
	if req.Comment != "" {
		review.Comment = req.Comment
	}

	if err := h.service.UpdateReview(c.Request.Context(), review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, review)
}

// ApproveReview approves a review (admin only)
// PATCH /api/v1/reviews/:id/approve
func (h *CourseReviewHandler) ApproveReview(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	if err := h.service.ApproveReview(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "review approved"})
}

// RejectReview rejects a review (admin only)
// PATCH /api/v1/reviews/:id/reject
func (h *CourseReviewHandler) RejectReview(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	if err := h.service.RejectReview(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "review rejected"})
}

// MarkHelpful marks a review as helpful
// POST /api/v1/reviews/:id/helpful
func (h *CourseReviewHandler) MarkHelpful(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	if err := h.service.MarkReviewAsHelpful(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "review marked as helpful"})
}

// GetCourseStats gets course review statistics
// GET /api/v1/courses/:courseId/review-stats
func (h *CourseReviewHandler) GetCourseStats(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("courseId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	avgRating, count, err := h.service.GetCourseStats(c.Request.Context(), courseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"average_rating": avgRating,
		"review_count":   count,
	})
}

// DeleteReview deletes a review
// DELETE /api/v1/reviews/:id
func (h *CourseReviewHandler) DeleteReview(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review ID"})
		return
	}

	if err := h.service.DeleteReview(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "review deleted"})
}
