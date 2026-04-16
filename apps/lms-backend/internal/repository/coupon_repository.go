package repository

import (
	"errors"
	"fmt"
	"time"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CouponRepository handles all database operations for coupons
type CouponRepository struct {
	db *gorm.DB
}

// NewCouponRepository creates a new coupon repository instance
func NewCouponRepository(db *gorm.DB) *CouponRepository {
	return &CouponRepository{db: db}
}

// Create saves a new coupon to the database
func (cr *CouponRepository) Create(coupon *models.Coupon) error {
	if coupon.ID == uuid.Nil {
		coupon.ID = uuid.New()
	}
	if err := cr.db.Create(coupon).Error; err != nil {
		return fmt.Errorf("failed to create coupon: %w", err)
	}
	return nil
}

// GetByID retrieves a coupon by its UUID
func (cr *CouponRepository) GetByID(id uuid.UUID) (*models.Coupon, error) {
	var coupon models.Coupon
	if err := cr.db.Preload("Course").Preload("CreatedBy").First(&coupon, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("coupon not found")
		}
		return nil, fmt.Errorf("failed to fetch coupon: %w", err)
	}
	return &coupon, nil
}

// GetByCode retrieves a coupon by its code
func (cr *CouponRepository) GetByCode(code string) (*models.Coupon, error) {
	var coupon models.Coupon
	if err := cr.db.Preload("Course").Preload("CreatedBy").First(&coupon, "code = ?", code).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch coupon: %w", err)
	}
	return &coupon, nil
}

// GetAll retrieves all coupons with pagination
func (cr *CouponRepository) GetAll(page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64

	// Get total count
	if err := cr.db.Model(&models.Coupon{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Preload("Course").Preload("CreatedBy").Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupons: %w", err)
	}

	return coupons, total, nil
}

// GetActive retrieves active coupons
func (cr *CouponRepository) GetActive(page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64
	now := time.Now()

	// Get total count
	if err := cr.db.Model(&models.Coupon{}).
		Where("is_active = ? AND valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)", true, now, now).
		Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.
		Where("is_active = ? AND valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)", true, now, now).
		Preload("Course").Preload("CreatedBy").
		Offset(offset).Limit(limit).Order("created_at DESC").
		Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupons: %w", err)
	}

	return coupons, total, nil
}

// GetByCourseID retrieves coupons for a specific course
func (cr *CouponRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64

	// Get total count
	if err := cr.db.Model(&models.Coupon{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := cr.db.Where("course_id = ?", courseID).Preload("Course").Preload("CreatedBy").Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupons: %w", err)
	}

	return coupons, total, nil
}

// Update updates an existing coupon
func (cr *CouponRepository) Update(coupon *models.Coupon) error {
	if err := cr.db.Save(coupon).Error; err != nil {
		return fmt.Errorf("failed to update coupon: %w", err)
	}
	return nil
}

// Delete removes a coupon from the database
func (cr *CouponRepository) Delete(id uuid.UUID) error {
	if err := cr.db.Delete(&models.Coupon{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete coupon: %w", err)
	}
	return nil
}

// IncrementUsage increments the used count of a coupon
func (cr *CouponRepository) IncrementUsage(id uuid.UUID) error {
	if err := cr.db.Model(&models.Coupon{}).Where("id = ?", id).Update("used_count", gorm.Expr("used_count + ?", 1)).Error; err != nil {
		return fmt.Errorf("failed to increment usage: %w", err)
	}
	return nil
}

// CanUseCoupon checks if a coupon can be used
func (cr *CouponRepository) CanUseCoupon(id uuid.UUID) (bool, error) {
	var coupon models.Coupon
	now := time.Now()

	if err := cr.db.First(&coupon, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, fmt.Errorf("failed to fetch coupon: %w", err)
	}

	// Check if active
	if !coupon.IsActive {
		return false, nil
	}

	// Check validity dates
	if coupon.ValidFrom.After(now) {
		return false, nil
	}

	if coupon.ValidUntil != nil && coupon.ValidUntil.Before(now) {
		return false, nil
	}

	// Check usage limit
	if coupon.UsageLimit != nil && coupon.UsedCount >= *coupon.UsageLimit {
		return false, nil
	}

	return true, nil
}

// RecordCouponUsage records usage of a coupon
func (cr *CouponRepository) RecordCouponUsage(couponID, userID uuid.UUID, orderID *uuid.UUID) error {
	usage := &models.CouponUsage{
		ID:       uuid.New(),
		CouponID: couponID,
		UserID:   userID,
		OrderID:  orderID,
	}

	if err := cr.db.Create(usage).Error; err != nil {
		return fmt.Errorf("failed to record coupon usage: %w", err)
	}

	// Increment usage count
	return cr.IncrementUsage(couponID)
}
