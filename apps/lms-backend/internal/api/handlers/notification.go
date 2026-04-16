package handlers

import (
	"context"
	"log"
	"net/http"
	"strconv"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// NotificationHandler handles all notification-related HTTP requests
type NotificationHandler struct {
	notificationService *service.NotificationService
}

// NewNotificationHandler creates a new notification handler instance
func NewNotificationHandler(notificationService *service.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		notificationService: notificationService,
	}
}

// ListNotifications godoc
// @Summary List user notifications
// @Description Retrieve paginated list of notifications for authenticated user
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of notifications per page (default 20)" default(20)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /notifications [get]
func (nh *NotificationHandler) ListNotifications(c *gin.Context) {
	log.Println("[Notification Handler] Listing user notifications")

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 20
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	ctx := context.Background()
	notifications, total, err := nh.notificationService.ListNotifications(ctx, userUUID, page, limit)
	if err != nil {
		log.Printf("[Notification Handler] Failed to list notifications: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  notifications,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// ListUnreadNotifications godoc
// @Summary List unread notifications
// @Description Retrieve paginated list of unread notifications for authenticated user
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of notifications per page (default 20)" default(20)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /notifications/unread [get]
func (nh *NotificationHandler) ListUnreadNotifications(c *gin.Context) {
	log.Println("[Notification Handler] Listing unread notifications")

	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 20
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	ctx := context.Background()
	notifications, total, err := nh.notificationService.ListUnreadNotifications(ctx, userUUID, page, limit)
	if err != nil {
		log.Printf("[Notification Handler] Failed to list unread notifications: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  notifications,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetNotification godoc
// @Summary Get notification by ID
// @Description Retrieve a specific notification by ID
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Notification ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /notifications/{id} [get]
func (nh *NotificationHandler) GetNotification(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Notification Handler] Invalid notification ID: %v", err)
		response.BadRequest(c, "Invalid notification ID")
		return
	}

	ctx := context.Background()
	notification, err := nh.notificationService.GetNotification(ctx, id)
	if err != nil {
		log.Printf("[Notification Handler] Failed to get notification: %v", err)
		response.NotFound(c, "Notification not found")
		return
	}

	response.Success(c, http.StatusOK, notification)
}

// MarkAsRead godoc
// @Summary Mark notification as read
// @Description Mark a specific notification as read
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Notification ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /notifications/{id}/read [patch]
func (nh *NotificationHandler) MarkAsRead(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Notification Handler] Invalid notification ID: %v", err)
		response.BadRequest(c, "Invalid notification ID")
		return
	}

	ctx := context.Background()
	if err := nh.notificationService.MarkAsRead(ctx, id); err != nil {
		log.Printf("[Notification Handler] Failed to mark notification as read: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{"message": "Notification marked as read"})
}

// MarkAllAsRead godoc
// @Summary Mark all notifications as read
// @Description Mark all notifications for authenticated user as read
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Success 200 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /notifications/read-all [patch]
func (nh *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	log.Println("[Notification Handler] Marking all notifications as read")

	userID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	ctx := context.Background()
	if err := nh.notificationService.MarkAllAsRead(ctx, userUUID); err != nil {
		log.Printf("[Notification Handler] Failed to mark all notifications as read: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{"message": "All notifications marked as read"})
}

// DeleteNotification godoc
// @Summary Delete notification
// @Description Delete a specific notification
// @Tags Notifications
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Notification ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /notifications/{id} [delete]
func (nh *NotificationHandler) DeleteNotification(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Notification Handler] Invalid notification ID: %v", err)
		response.BadRequest(c, "Invalid notification ID")
		return
	}

	ctx := context.Background()
	if err := nh.notificationService.DeleteNotification(ctx, id); err != nil {
		log.Printf("[Notification Handler] Failed to delete notification: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}
