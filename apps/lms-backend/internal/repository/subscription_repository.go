package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubscriptionRepository handles database operations for subscriptions
type SubscriptionRepository struct {
	db *gorm.DB
}

// NewSubscriptionRepository creates a new SubscriptionRepository
func NewSubscriptionRepository(db *gorm.DB) *SubscriptionRepository {
	return &SubscriptionRepository{db: db}
}

// Create saves a new subscription
func (r *SubscriptionRepository) Create(sub *models.Subscription) error {
	if sub.ID == uuid.Nil {
		sub.ID = uuid.New()
	}
	if err := r.db.Create(sub).Error; err != nil {
		return fmt.Errorf("failed to create subscription: %w", err)
	}
	return nil
}

// GetByID retrieves a subscription by ID
func (r *SubscriptionRepository) GetByID(id uuid.UUID) (*models.Subscription, error) {
	var sub models.Subscription
	if err := r.db.Preload("Course").Preload("Package").First(&sub, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("subscription not found")
		}
		return nil, fmt.Errorf("failed to fetch subscription: %w", err)
	}
	return &sub, nil
}

// GetActiveByStudentAndCourse retrieves an active subscription for a student+course pair
func (r *SubscriptionRepository) GetActiveByStudentAndCourse(studentID, courseID uuid.UUID) (*models.Subscription, error) {
	var sub models.Subscription
	if err := r.db.
		Where("student_id = ? AND course_id = ? AND status = 'active'", studentID, courseID).
		Preload("Package").
		First(&sub).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch subscription: %w", err)
	}
	return &sub, nil
}

// GetByStudentID retrieves paginated subscriptions for a student
func (r *SubscriptionRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Subscription, int64, error) {
	var subs []models.Subscription
	var total int64
	offset := (page - 1) * limit

	query := r.db.Model(&models.Subscription{}).Where("student_id = ?", studentID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count subscriptions: %w", err)
	}

	if err := query.
		Preload("Course").
		Preload("Package").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&subs).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch subscriptions: %w", err)
	}

	return subs, total, nil
}

// Update updates a subscription
func (r *SubscriptionRepository) Update(sub *models.Subscription) error {
	if err := r.db.Save(sub).Error; err != nil {
		return fmt.Errorf("failed to update subscription: %w", err)
	}
	return nil
}

// ExpireSubscriptions marks subscriptions as expired when expires_at has passed
func (r *SubscriptionRepository) ExpireSubscriptions() (int64, error) {
	result := r.db.Model(&models.Subscription{}).
		Where("status = 'active' AND expires_at IS NOT NULL AND expires_at < NOW()").
		Update("status", "expired")
	if result.Error != nil {
		return 0, fmt.Errorf("failed to expire subscriptions: %w", result.Error)
	}
	return result.RowsAffected, nil
}
