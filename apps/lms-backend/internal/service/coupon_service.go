package service

import (
	"errors"
	"fmt"
	"log"
	"math"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"

	"github.com/google/uuid"
)

type CouponService struct {
	couponRepo      *repository.CouponRepository
	couponUsageRepo *repository.CouponUsageRepository
}

func NewCouponService(
	couponRepo *repository.CouponRepository,
	couponUsageRepo *repository.CouponUsageRepository,
) *CouponService {
	return &CouponService{
		couponRepo:      couponRepo,
		couponUsageRepo: couponUsageRepo,
	}
}

type CreateCouponRequest struct {
	Code              string    `json:"code" binding:"required,uppercase"`
	Description       string    `json:"description"`
	DiscountType      string    `json:"discount_type" binding:"required,oneof=percentage fixed"`
	DiscountValue     float64   `json:"discount_value" binding:"required,gt=0"`
	MaxDiscount       *float64  `json:"max_discount"`
	MinOrderValue     *float64  `json:"min_order_value"`
	CourseID          *uuid.UUID `json:"course_id"`
	UsageLimit        *int      `json:"usage_limit"`
	ValidFrom         time.Time `json:"valid_from" binding:"required"`
	ValidUntil        *time.Time `json:"valid_until"`
}

type ApplyCouponRequest struct {
	Code       string    `json:"code" binding:"required"`
	OrderValue float64   `json:"order_value" binding:"required,gt=0"`
	UserID     uuid.UUID `json:"user_id" binding:"required"`
}

type ValidateCouponRequest struct {
	Code       string  `json:"code" binding:"required"`
	OrderValue float64 `json:"order_value" binding:"required,gt=0"`
}

type UpdateCouponRequest struct {
	Code          string     `json:"code" binding:"required,uppercase"`
	Description   string     `json:"description"`
	DiscountType  string     `json:"discount_type" binding:"required,oneof=percentage fixed"`
	DiscountValue float64    `json:"discount_value" binding:"required,gt=0"`
	MaxDiscount   *float64   `json:"max_discount"`
	MinOrderValue *float64   `json:"min_order_value"`
	CourseID      *uuid.UUID `json:"course_id"`
	UsageLimit    *int       `json:"usage_limit"`
	ValidFrom     time.Time  `json:"valid_from" binding:"required"`
	ValidUntil    *time.Time `json:"valid_until"`
}

type CouponResponse struct {
	ID            uuid.UUID  `json:"id"`
	Code          string     `json:"code"`
	Description   string     `json:"description"`
	DiscountType  string     `json:"discount_type"`
	DiscountValue float64    `json:"discount_value"`
	MaxDiscount   *float64   `json:"max_discount"`
	MinOrderValue *float64   `json:"min_order_value"`
	CourseID      *uuid.UUID `json:"course_id"`
	UsageLimit    *int       `json:"usage_limit"`
	UsedCount     int        `json:"used_count"`
	IsActive      bool       `json:"is_active"`
	ValidFrom     time.Time  `json:"valid_from"`
	ValidUntil    *time.Time `json:"valid_until"`
	CreatedAt     time.Time  `json:"created_at"`
}

type ApplyCouponResponse struct {
	CouponID      uuid.UUID `json:"coupon_id"`
	Code          string    `json:"code"`
	DiscountType  string    `json:"discount_type"`
	DiscountValue float64   `json:"discount_value"`
	Discount      float64   `json:"discount"`
	FinalPrice    float64   `json:"final_price"`
	Message       string    `json:"message"`
}

// CreateCoupon creates a new coupon
func (cs *CouponService) CreateCoupon(creatorID uuid.UUID, req *CreateCouponRequest) (*CouponResponse, error) {
	log.Printf("[Coupon Service] Creating coupon: %s", req.Code)

	if req.DiscountType == "percentage" && req.DiscountValue > 100 {
		return nil, errors.New("percentage discount cannot exceed 100%")
	}

	coupon := &models.Coupon{
		ID:            uuid.New(),
		Code:          req.Code,
		Description:   &req.Description,
		DiscountType:  req.DiscountType,
		DiscountValue: req.DiscountValue,
		MaxDiscount:   req.MaxDiscount,
		MinOrderValue: req.MinOrderValue,
		CourseID:      req.CourseID,
		UsageLimit:    req.UsageLimit,
		UsedCount:     0,
		ValidFrom:     req.ValidFrom,
		ValidUntil:    req.ValidUntil,
		IsActive:      true,
		CreatedByID:   creatorID,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := cs.couponRepo.Create(coupon); err != nil {
		log.Printf("[Coupon Service] Failed to create coupon: %v", err)
		return nil, fmt.Errorf("failed to create coupon: %w", err)
	}

	return cs.couponToResponse(coupon), nil
}

// GetCoupon retrieves a coupon by ID
func (cs *CouponService) GetCoupon(id uuid.UUID) (*CouponResponse, error) {
	coupon, err := cs.couponRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return cs.couponToResponse(coupon), nil
}

// ListCoupons retrieves all coupons with pagination
func (cs *CouponService) ListCoupons(page, limit int) ([]CouponResponse, int64, error) {
	coupons, total, err := cs.couponRepo.GetAll(page, limit)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]CouponResponse, len(coupons))
	for i, c := range coupons {
		responses[i] = *cs.couponToResponse(&c)
	}

	return responses, total, nil
}

// ListActiveCoupons retrieves all active coupons
func (cs *CouponService) ListActiveCoupons(page, limit int) ([]CouponResponse, int64, error) {
	coupons, total, err := cs.couponRepo.GetActiveCoupons(page, limit)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]CouponResponse, len(coupons))
	for i, c := range coupons {
		responses[i] = *cs.couponToResponse(&c)
	}

	return responses, total, nil
}

// ValidateCoupon validates a coupon and calculates the discount
func (cs *CouponService) ValidateCoupon(req *ValidateCouponRequest) (*ApplyCouponResponse, error) {
	log.Printf("[Coupon Service] Validating coupon: %s", req.Code)

	coupon, err := cs.couponRepo.ValidateCoupon(req.Code)
	if err != nil {
		return nil, fmt.Errorf("invalid coupon: %w", err)
	}

	// Check minimum order value
	if coupon.MinOrderValue != nil && req.OrderValue < *coupon.MinOrderValue {
		return nil, fmt.Errorf("order value must be at least ₹%.2f to use this coupon", *coupon.MinOrderValue)
	}

	// Calculate discount
	var discount float64
	if coupon.DiscountType == "percentage" {
		discount = req.OrderValue * (coupon.DiscountValue / 100)
		if coupon.MaxDiscount != nil {
			discount = math.Min(discount, *coupon.MaxDiscount)
		}
	} else if coupon.DiscountType == "fixed" {
		discount = coupon.DiscountValue
	}

	finalPrice := math.Max(0, req.OrderValue-discount)

	return &ApplyCouponResponse{
		CouponID:      coupon.ID,
		Code:          coupon.Code,
		DiscountType:  coupon.DiscountType,
		DiscountValue: coupon.DiscountValue,
		Discount:      discount,
		FinalPrice:    finalPrice,
		Message:       "Coupon validated successfully",
	}, nil
}

// ApplyCoupon applies a coupon to an order and returns discount details
func (cs *CouponService) ApplyCoupon(req *ApplyCouponRequest) (*ApplyCouponResponse, error) {
	log.Printf("[Coupon Service] Applying coupon: %s for user %s", req.Code, req.UserID)

	coupon, err := cs.couponRepo.ValidateCoupon(req.Code)
	if err != nil {
		return nil, fmt.Errorf("invalid coupon: %w", err)
	}

	// Check minimum order value
	if coupon.MinOrderValue != nil && req.OrderValue < *coupon.MinOrderValue {
		return nil, fmt.Errorf("order value must be at least ₹%.2f to use this coupon", *coupon.MinOrderValue)
	}

	// Calculate discount
	var discount float64
	if coupon.DiscountType == "percentage" {
		discount = req.OrderValue * (coupon.DiscountValue / 100)
		if coupon.MaxDiscount != nil {
			discount = math.Min(discount, *coupon.MaxDiscount)
		}
	} else if coupon.DiscountType == "fixed" {
		discount = coupon.DiscountValue
	}

	finalPrice := math.Max(0, req.OrderValue-discount)

	return &ApplyCouponResponse{
		CouponID:      coupon.ID,
		Code:          coupon.Code,
		DiscountType:  coupon.DiscountType,
		DiscountValue: coupon.DiscountValue,
		Discount:      discount,
		FinalPrice:    finalPrice,
		Message:       "Coupon applied successfully",
	}, nil
}

// UseCoupon records coupon usage
func (cs *CouponService) UseCoupon(couponID, userID uuid.UUID, courseID uuid.UUID, discountApplied float64) error {
	log.Printf("[Coupon Service] Recording coupon usage: %s", couponID)

	usage := &models.CouponUsage{
		ID:              uuid.New(),
		CouponID:        couponID,
		StudentID:       userID,
		CourseID:        courseID,
		DiscountApplied: discountApplied,
		UsedAt:          time.Now(),
	}

	if err := cs.couponUsageRepo.Create(usage); err != nil {
		return fmt.Errorf("failed to record coupon usage: %w", err)
	}

	// Increment coupon usage count
	if err := cs.couponRepo.IncrementUsage(couponID); err != nil {
		log.Printf("[Coupon Service] Warning: failed to increment coupon usage: %v", err)
	}

	return nil
}

// UpdateCoupon updates an existing coupon
func (cs *CouponService) UpdateCoupon(id uuid.UUID, req *UpdateCouponRequest) (*CouponResponse, error) {
	log.Printf("[Coupon Service] Updating coupon: %s", id)

	coupon, err := cs.couponRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.DiscountType == "percentage" && req.DiscountValue > 100 {
		return nil, errors.New("percentage discount cannot exceed 100%")
	}

	coupon.Code = req.Code
	coupon.Description = &req.Description
	coupon.DiscountType = req.DiscountType
	coupon.DiscountValue = req.DiscountValue
	coupon.MaxDiscount = req.MaxDiscount
	coupon.MinOrderValue = req.MinOrderValue
	coupon.CourseID = req.CourseID
	coupon.UsageLimit = req.UsageLimit
	coupon.ValidFrom = req.ValidFrom
	coupon.ValidUntil = req.ValidUntil
	coupon.UpdatedAt = time.Now()

	if err := cs.couponRepo.Update(coupon); err != nil {
		log.Printf("[Coupon Service] Failed to update coupon: %v", err)
		return nil, fmt.Errorf("failed to update coupon: %w", err)
	}

	return cs.couponToResponse(coupon), nil
}

// DeactivateCoupon deactivates a coupon
func (cs *CouponService) DeactivateCoupon(id uuid.UUID) error {
	return cs.couponRepo.UpdatePartial(id, map[string]interface{}{
		"is_active":  false,
		"updated_at": time.Now(),
	})
}

// ActivateCoupon activates a coupon
func (cs *CouponService) ActivateCoupon(id uuid.UUID) error {
	return cs.couponRepo.UpdatePartial(id, map[string]interface{}{
		"is_active":  true,
		"updated_at": time.Now(),
	})
}

// DeleteCoupon deletes a coupon
func (cs *CouponService) DeleteCoupon(id uuid.UUID) error {
	return cs.couponRepo.Delete(id)
}

// GetCouponUsageHistory gets usage history for a coupon
func (cs *CouponService) GetCouponUsageHistory(couponID uuid.UUID, page, limit int) ([]models.CouponUsage, int64, error) {
	return cs.couponUsageRepo.GetByCouponID(couponID, page, limit)
}

// GetUserCouponUsages gets coupon usages for a specific user
func (cs *CouponService) GetUserCouponUsages(userID uuid.UUID, page, limit int) ([]models.CouponUsage, int64, error) {
	return cs.couponUsageRepo.GetByUserID(userID, page, limit)
}

// Helper function to convert coupon to response
func (cs *CouponService) couponToResponse(coupon *models.Coupon) *CouponResponse {
	desc := ""
	if coupon.Description != nil {
		desc = *coupon.Description
	}
	return &CouponResponse{
		ID:            coupon.ID,
		Code:          coupon.Code,
		Description:   desc,
		DiscountType:  coupon.DiscountType,
		DiscountValue: coupon.DiscountValue,
		MaxDiscount:   coupon.MaxDiscount,
		MinOrderValue: coupon.MinOrderValue,
		CourseID:      coupon.CourseID,
		UsageLimit:    coupon.UsageLimit,
		UsedCount:     coupon.UsedCount,
		IsActive:      coupon.IsActive,
		ValidFrom:     coupon.ValidFrom,
		ValidUntil:    coupon.ValidUntil,
		CreatedAt:     coupon.CreatedAt,
	}
}
