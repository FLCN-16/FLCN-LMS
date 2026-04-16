package service

import (
	"context"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// NotificationService handles notification business logic
type NotificationService struct {
	notificationRepo repository.NotificationRepository
}

// NewNotificationService creates a new notification service instance
func NewNotificationService(notificationRepo repository.NotificationRepository) *NotificationService {
	return &NotificationService{
		notificationRepo: notificationRepo,
	}
}

// NotificationResponse represents a notification in API responses
type NotificationResponse struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	Type      string     `json:"type"`
	Title     string     `json:"title"`
	Message   string     `json:"message"`
	Link      *string    `json:"link"`
	IsRead    bool       `json:"is_read"`
	ReadAt    *time.Time `json:"read_at"`
	CreatedAt time.Time  `json:"created_at"`
}

// CreateNotificationRequest represents a notification creation request
type CreateNotificationRequest struct {
	UserID  uuid.UUID `json:"user_id" binding:"required"`
	Type    string    `json:"type" binding:"required"`
	Title   string    `json:"title" binding:"required"`
	Message string    `json:"message"`
	Link    *string   `json:"link"`
}

// ListNotifications retrieves paginated list of notifications for a user
func (ns *NotificationService) ListNotifications(ctx context.Context, userID uuid.UUID, page, limit int) ([]NotificationResponse, int64, error) {
	offset := (page - 1) * limit

	notifications, total, err := ns.notificationRepo.ListByUserID(ctx, userID, limit, offset)
	if err != nil {
		log.Printf("[Notification Service] Failed to list notifications: %v", err)
		return nil, 0, err
	}

	var responses []NotificationResponse
	for _, notification := range notifications {
		responses = append(responses, *notificationToResponse(&notification))
	}

	return responses, total, nil
}

// ListUnreadNotifications retrieves unread notifications for a user
func (ns *NotificationService) ListUnreadNotifications(ctx context.Context, userID uuid.UUID, page, limit int) ([]NotificationResponse, int64, error) {
	offset := (page - 1) * limit

	notifications, total, err := ns.notificationRepo.ListUnreadByUserID(ctx, userID, limit, offset)
	if err != nil {
		log.Printf("[Notification Service] Failed to list unread notifications: %v", err)
		return nil, 0, err
	}

	var responses []NotificationResponse
	for _, notification := range notifications {
		responses = append(responses, *notificationToResponse(&notification))
	}

	return responses, total, nil
}

// GetNotification retrieves a single notification by ID
func (ns *NotificationService) GetNotification(ctx context.Context, id uuid.UUID) (*NotificationResponse, error) {
	notification, err := ns.notificationRepo.GetByID(ctx, id)
	if err != nil {
		log.Printf("[Notification Service] Failed to get notification: %v", err)
		return nil, err
	}
	if notification == nil {
		return nil, fmt.Errorf("notification not found")
	}
	return notificationToResponse(notification), nil
}

// CreateNotification creates a new notification
func (ns *NotificationService) CreateNotification(ctx context.Context, req *CreateNotificationRequest) (*NotificationResponse, error) {
	log.Printf("[Notification Service] Creating notification for user: %s", req.UserID)

	notification := &models.Notification{
		ID:      uuid.New(),
		UserID:  req.UserID,
		Type:    req.Type,
		Title:   req.Title,
		Message: req.Message,
		Link:    req.Link,
	}

	if err := ns.notificationRepo.Create(ctx, notification); err != nil {
		log.Printf("[Notification Service] Failed to create notification: %v", err)
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}

	log.Printf("[Notification Service] Notification created successfully: %s", notification.ID)
	return notificationToResponse(notification), nil
}

// MarkAsRead marks a notification as read
func (ns *NotificationService) MarkAsRead(ctx context.Context, id uuid.UUID) error {
	log.Printf("[Notification Service] Marking notification as read: %s", id)

	if err := ns.notificationRepo.MarkAsRead(ctx, id); err != nil {
		log.Printf("[Notification Service] Failed to mark notification as read: %v", err)
		return fmt.Errorf("failed to mark notification as read: %w", err)
	}

	return nil
}

// MarkAllAsRead marks all notifications for a user as read
func (ns *NotificationService) MarkAllAsRead(ctx context.Context, userID uuid.UUID) error {
	log.Printf("[Notification Service] Marking all notifications as read for user: %s", userID)

	if err := ns.notificationRepo.MarkAllAsRead(ctx, userID); err != nil {
		log.Printf("[Notification Service] Failed to mark all notifications as read: %v", err)
		return fmt.Errorf("failed to mark all notifications as read: %w", err)
	}

	return nil
}

// DeleteNotification deletes a notification
func (ns *NotificationService) DeleteNotification(ctx context.Context, id uuid.UUID) error {
	log.Printf("[Notification Service] Deleting notification: %s", id)

	if err := ns.notificationRepo.Delete(ctx, id); err != nil {
		log.Printf("[Notification Service] Failed to delete notification: %v", err)
		return fmt.Errorf("failed to delete notification: %w", err)
	}

	return nil
}

// Helper function to convert model to response
func notificationToResponse(notification *models.Notification) *NotificationResponse {
	isRead := notification.ReadAt != nil
	return &NotificationResponse{
		ID:        notification.ID,
		UserID:    notification.UserID,
		Type:      notification.Type,
		Title:     notification.Title,
		Message:   notification.Message,
		Link:      notification.Link,
		IsRead:    isRead,
		ReadAt:    notification.ReadAt,
		CreatedAt: notification.CreatedAt,
	}
}
