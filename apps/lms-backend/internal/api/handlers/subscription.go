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

// SubscriptionHandler handles subscription HTTP requests
type SubscriptionHandler struct {
	subService *service.SubscriptionService
}

// NewSubscriptionHandler creates a new SubscriptionHandler
func NewSubscriptionHandler(subService *service.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subService: subService}
}

// GetMySubscriptions returns the authenticated student's subscriptions
// GET /my/subscriptions
func (h *SubscriptionHandler) GetMySubscriptions(c *gin.Context) {
	studentID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}
	studentUUID, ok := studentID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	page, limit := parsePagination(c)

	subs, total, err := h.subService.GetMySubscriptions(studentUUID, page, limit)
	if err != nil {
		log.Printf("[SubscriptionHandler] Failed to get subscriptions: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  subs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetSubscription returns a single subscription by ID
// GET /subscriptions/:id
func (h *SubscriptionHandler) GetSubscription(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid subscription ID")
		return
	}

	sub, err := h.subService.GetSubscription(id)
	if err != nil {
		response.NotFound(c, "Subscription not found")
		return
	}

	response.Success(c, http.StatusOK, sub)
}

func parsePagination(c *gin.Context) (page, limit int) {
	page = 1
	limit = 10
	if p := c.Query("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil && n > 0 {
			page = n
		}
	}
	if l := c.Query("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}
	return
}
