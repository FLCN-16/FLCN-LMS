package repository

import (
	"fmt"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CouponUsageRepository handles all database operations for coupon usage records
type CouponUsageRepository struct {
	db *gorm.DB
}

// NewCouponUsageRepository creates a new coupon usage repository instance
func NewCouponUsageRepository(db *gorm.DB) *CouponUsageRepository {
	return &CouponUsageRepository{db: db}
}

// Create saves a new coupon usage record
func (cur *CouponUsageRepository) Create(usage *models.CouponUsage) error {
	if usage.ID == uuid.Nil {
		usage.ID = uuid.New()
	}
	if err := cur.db.Create(usage).Error; err != nil {
		return fmt.Errorf("failed to create coupon usage: %w", err)
	}
	return nil
}

// GetByID retrieves a coupon usage record by ID
func (cur *CouponUsageRepository) GetByID(id uuid.UUID) (*models.CouponUsage, error) {
	var usage models.CouponUsage
	if err := cur.db.First(&usage, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("coupon usage not found")
		}
		return nil, fmt.Errorf("failed to fetch coupon usage: %w", err)
	}
	return &usage, nil
}

// GetByCouponID retrieves all usage records for a specific coupon with pagination
func (cur *CouponUsageRepository) GetByCouponID(couponID uuid.UUID, page, limit int) ([]models.CouponUsage, int64, error) {
	var usages []models.CouponUsage
	var total int64

	if err := cur.db.Model(&models.CouponUsage{}).Where("coupon_id = ?", couponID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupon usages: %w", err)
	}

	offset := (page - 1) * limit
	if err := cur.db.Where("coupon_id = ?", couponID).
		Offset(offset).
		Limit(limit).
		Order("used_at DESC").
		Find(&usages).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupon usages: %w", err)
	}

	return usages, total, nil
}

// GetByUserID retrieves all coupon usages for a specific user with pagination
func (cur *CouponUsageRepository) GetByUserID(userID uuid.UUID, page, limit int) ([]models.CouponUsage, int64, error) {
	var usages []models.CouponUsage
	var total int64

	if err := cur.db.Model(&models.CouponUsage{}).Where("student_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count user coupon usages: %w", err)
	}

	offset := (page - 1) * limit
	if err := cur.db.Where("student_id = ?", userID).
		Offset(offset).
		Limit(limit).
		Order("used_at DESC").
		Find(&usages).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch user coupon usages: %w", err)
	}

	return usages, total, nil
}

// GetByCouponAndUser retrieves usage records for a specific coupon and user
func (cur *CouponUsageRepository) GetByCouponAndUser(couponID, userID uuid.UUID, page, limit int) ([]models.CouponUsage, int64, error) {
	var usages []models.CouponUsage
	var total int64

	query := cur.db.Where("coupon_id = ? AND student_id = ?", couponID, userID)

	if err := query.Model(&models.CouponUsage{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupon usages: %w", err)
	}

	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Order("used_at DESC").Find(&usages).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupon usages: %w", err)
	}

	return usages, total, nil
}

// Delete removes a coupon usage record
func (cur *CouponUsageRepository) Delete(id uuid.UUID) error {
	if err := cur.db.Delete(&models.CouponUsage{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete coupon usage: %w", err)
	}
	return nil
}
