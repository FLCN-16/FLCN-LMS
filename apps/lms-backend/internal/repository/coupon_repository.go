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
	if err := cr.db.First(&coupon, "id = ?", id).Error; err != nil {
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
	if err := cr.db.First(&coupon, "code = ?", code).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("coupon not found")
		}
		return nil, fmt.Errorf("failed to fetch coupon: %w", err)
	}
	return &coupon, nil
}

// GetAll retrieves all coupons with pagination
func (cr *CouponRepository) GetAll(page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64

	if err := cr.db.Model(&models.Coupon{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	offset := (page - 1) * limit
	if err := cr.db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupons: %w", err)
	}

	return coupons, total, nil
}

// GetActiveCoupons retrieves all active coupons
func (cr *CouponRepository) GetActiveCoupons(page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64
	now := time.Now()

	query := cr.db.Where("is_active = ? AND valid_from <= ? AND (valid_until IS NULL OR valid_until >= ?)", true, now, now)

	if err := query.Model(&models.Coupon{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count active coupons: %w", err)
	}

	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch active coupons: %w", err)
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

// UpdatePartial updates specific fields of a coupon
func (cr *CouponRepository) UpdatePartial(id uuid.UUID, updates map[string]interface{}) error {
	if err := cr.db.Model(&models.Coupon{}).Where("id = ?", id).Updates(updates).Error; err != nil {
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

// ValidateCoupon checks if a coupon can be used
func (cr *CouponRepository) ValidateCoupon(code string) (*models.Coupon, error) {
	coupon, err := cr.GetByCode(code)
	if err != nil {
		return nil, err
	}

	now := time.Now()

	// Check if active
	if !coupon.IsActive {
		return nil, fmt.Errorf("coupon is not active")
	}

	// Check validity period
	if coupon.ValidFrom.After(now) {
		return nil, fmt.Errorf("coupon is not yet valid")
	}

	if coupon.ValidUntil != nil && coupon.ValidUntil.Before(now) {
		return nil, fmt.Errorf("coupon has expired")
	}

	// Check usage limit
	if coupon.UsageLimit != nil && coupon.UsedCount >= *coupon.UsageLimit {
		return nil, fmt.Errorf("coupon usage limit exceeded")
	}

	return coupon, nil
}

// IncrementUsage increments the used count for a coupon
func (cr *CouponRepository) IncrementUsage(id uuid.UUID) error {
	if err := cr.db.Model(&models.Coupon{}).Where("id = ?", id).Update("used_count", gorm.Expr("used_count + ?", 1)).Error; err != nil {
		return fmt.Errorf("failed to increment coupon usage: %w", err)
	}
	return nil
}

// GetCouponsByCreator retrieves all coupons created by a specific user
func (cr *CouponRepository) GetCouponsByCreator(creatorID uuid.UUID, page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64

	if err := cr.db.Model(&models.Coupon{}).Where("created_by_id = ?", creatorID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	offset := (page - 1) * limit
	if err := cr.db.Where("created_by_id = ?", creatorID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch coupons: %w", err)
	}

	return coupons, total, nil
}

// SearchCoupons searches for coupons by code or description
func (cr *CouponRepository) SearchCoupons(query string, page, limit int) ([]models.Coupon, int64, error) {
	var coupons []models.Coupon
	var total int64

	searchPattern := "%" + query + "%"

	dbQuery := cr.db.Where(
		cr.db.Where("code ILIKE ?", searchPattern).
			Or("description ILIKE ?", searchPattern),
	)

	if err := dbQuery.Model(&models.Coupon{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count coupons: %w", err)
	}

	offset := (page - 1) * limit
	if err := dbQuery.Offset(offset).Limit(limit).Order("created_at DESC").Find(&coupons).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to search coupons: %w", err)
	}

	return coupons, total, nil
}
