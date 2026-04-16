package service

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// CouponService handles coupon business logic
type CouponService struct {
	couponRepo repository.CouponRepository
}

// NewCouponService creates a new coupon service instance
func NewCouponService(couponRepo repository.CouponRepository) *CouponService {
	return &CouponService{
		couponRepo: couponRepo,
	}
}

// CouponResponse represents a coupon in API responses
type CouponResponse struct {
	ID            uuid.UUID  `json:"id"`
	Code          string     `json:"code"`
	Description   *string    `json:"description"`
	DiscountType  string     `json:"discount_type"`
	DiscountValue float64    `json:"discount_value"`
	MaxDiscount   *float64   `json:"max_discount"`
	MinOrderValue *float64   `json:"min_order_value"`
	CourseID      *uuid.UUID `json:"course_id"`
	UsageLimit    *int       `json:"usage_limit"`
	UsedCount     int        `json:"used_count"`
	ValidFrom     time.Time  `json:"valid_from"`
	ValidUntil    *time.Time `json:"valid_until"`
	IsActive      bool       `json:"is_active"`
	CreatedByID   uuid.UUID  `json:"created_by_id"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// CreateCouponRequest represents a coupon creation request
type CreateCouponRequest struct {
	Code         string     `json:"code" binding:"required"`
	Description  *string    `json:"description"`
	DiscountType string     `json:"discount_type" binding:"required"` // "percentage" or "fixed"
	DiscountValue float64   `json:"discount_value" binding:"required"`
	MaxDiscount  *float64   `json:"max_discount"`
	MinOrderValue *float64  `json:"min_order_value"`
	CourseID     *uuid.UUID `json:"course_id"`
	UsageLimit   *int       `json:"usage_limit"`
	ValidFrom    time.Time  `json:"valid_from" binding:"required"`
	ValidUntil   *time.Time `json:"valid_until"`
}

// UpdateCouponRequest represents a coupon update request
type UpdateCouponRequest struct {
	Description  *string    `json:"description"`
	DiscountType *string    `json:"discount_type"`
	DiscountValue *float64  `json:"discount_value"`
	MaxDiscount  *float64   `json:"max_discount"`
	MinOrderValue *float64  `json:"min_order_value"`
	UsageLimit   *int       `json:"usage_limit"`
	ValidFrom    *time.Time `json:"valid_from"`
	ValidUntil   *time.Time `json:"valid_until"`
	IsActive     *bool      `json:"is_active"`
}

// ValidateCouponRequest represents a coupon validation request
type ValidateCouponRequest struct {
	Code      string  `json:"code" binding:"required"`
	OrderAmount float64 `json:"order_amount" binding:"required"`
}

// ValidateCouponResponse represents validation response
type ValidateCouponResponse struct {
	Valid        bool    `json:"valid"`
	Message      string  `json:"message"`
	DiscountAmount float64 `json:"discount_amount,omitempty"`
	FinalAmount  float64 `json:"final_amount,omitempty"`
}

// ListCoupons retrieves paginated list of all coupons
func (cs *CouponService) ListCoupons(page, limit int) ([]CouponResponse, int64, error) {
	coupons, total, err := cs.couponRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Coupon Service] Failed to list coupons: %v", err)
		return nil, 0, err
	}

	var responses []CouponResponse
	for _, coupon := range coupons {
		responses = append(responses, *couponToResponse(&coupon))
	}

	return responses, total, nil
}

// ListActiveCoupons retrieves active coupons
func (cs *CouponService) ListActiveCoupons(page, limit int) ([]CouponResponse, int64, error) {
	coupons, total, err := cs.couponRepo.GetActive(page, limit)
	if err != nil {
		log.Printf("[Coupon Service] Failed to list active coupons: %v", err)
		return nil, 0, err
	}

	var responses []CouponResponse
	for _, coupon := range coupons {
		responses = append(responses, *couponToResponse(&coupon))
	}

	return responses, total, nil
}

// GetCoupon retrieves a single coupon by ID
func (cs *CouponService) GetCoupon(id uuid.UUID) (*CouponResponse, error) {
	coupon, err := cs.couponRepo.GetByID(id)
	if err != nil {
		log.Printf("[Coupon Service] Failed to get coupon: %v", err)
		return nil, err
	}
	if coupon == nil {
		return nil, fmt.Errorf("coupon not found")
	}
	return couponToResponse(coupon), nil
}

// CreateCoupon creates a new coupon
func (cs *CouponService) CreateCoupon(createdByID uuid.UUID, req *CreateCouponRequest) (*CouponResponse, error) {
	log.Printf("[Coupon Service] Creating coupon: %s", req.Code)

	// Validate discount type
	if req.DiscountType != "percentage" && req.DiscountType != "fixed" {
		return nil, fmt.Errorf("invalid discount type: must be 'percentage' or 'fixed'")
	}

	coupon := &models.Coupon{
		ID:            uuid.New(),
		Code:          req.Code,
		Description:   req.Description,
		DiscountType:  req.DiscountType,
		DiscountValue: req.DiscountValue,
		MaxDiscount:   req.MaxDiscount,
		MinOrderValue: req.MinOrderValue,
		CourseID:      req.CourseID,
		UsageLimit:    req.UsageLimit,
		ValidFrom:     req.ValidFrom,
		ValidUntil:    req.ValidUntil,
		IsActive:      true,
		CreatedByID:   createdByID,
	}

	if err := cs.couponRepo.Create(coupon); err != nil {
		log.Printf("[Coupon Service] Failed to create coupon: %v", err)
		return nil, fmt.Errorf("failed to create coupon: %w", err)
	}

	log.Printf("[Coupon Service] Coupon created successfully: %s", coupon.ID)
	return couponToResponse(coupon), nil
}

// UpdateCoupon updates an existing coupon
func (cs *CouponService) UpdateCoupon(id uuid.UUID, req *UpdateCouponRequest) (*CouponResponse, error) {
	log.Printf("[Coupon Service] Updating coupon: %s", id)

	coupon, err := cs.couponRepo.GetByID(id)
	if err != nil {
		log.Printf("[Coupon Service] Failed to get coupon: %v", err)
		return nil, err
	}
	if coupon == nil {
		return nil, fmt.Errorf("coupon not found")
	}

	// Update fields if provided
	if req.Description != nil {
		coupon.Description = req.Description
	}
	if req.DiscountType != nil {
		coupon.DiscountType = *req.DiscountType
	}
	if req.DiscountValue != nil {
		coupon.DiscountValue = *req.DiscountValue
	}
	if req.MaxDiscount != nil {
		coupon.MaxDiscount = req.MaxDiscount
	}
	if req.MinOrderValue != nil {
		coupon.MinOrderValue = req.MinOrderValue
	}
	if req.UsageLimit != nil {
		coupon.UsageLimit = req.UsageLimit
	}
	if req.ValidFrom != nil {
		coupon.ValidFrom = *req.ValidFrom
	}
	if req.ValidUntil != nil {
		coupon.ValidUntil = req.ValidUntil
	}
	if req.IsActive != nil {
		coupon.IsActive = *req.IsActive
	}

	if err := cs.couponRepo.Update(coupon); err != nil {
		log.Printf("[Coupon Service] Failed to update coupon: %v", err)
		return nil, fmt.Errorf("failed to update coupon: %w", err)
	}

	log.Printf("[Coupon Service] Coupon updated successfully: %s", id)
	return couponToResponse(coupon), nil
}

// DeleteCoupon deletes a coupon
func (cs *CouponService) DeleteCoupon(id uuid.UUID) error {
	log.Printf("[Coupon Service] Deleting coupon: %s", id)

	if err := cs.couponRepo.Delete(id); err != nil {
		log.Printf("[Coupon Service] Failed to delete coupon: %v", err)
		return fmt.Errorf("failed to delete coupon: %w", err)
	}

	return nil
}

// ValidateCoupon validates and calculates discount
func (cs *CouponService) ValidateCoupon(req *ValidateCouponRequest) (*ValidateCouponResponse, error) {
	log.Printf("[Coupon Service] Validating coupon: %s", req.Code)

	coupon, err := cs.couponRepo.GetByCode(req.Code)
	if err != nil {
		return &ValidateCouponResponse{
			Valid:   false,
			Message: "Coupon lookup failed",
		}, nil
	}

	if coupon == nil {
		return &ValidateCouponResponse{
			Valid:   false,
			Message: "Coupon code not found",
		}, nil
	}

	// Check if can use
	canUse, err := cs.couponRepo.CanUseCoupon(coupon.ID)
	if err != nil {
		return &ValidateCouponResponse{
			Valid:   false,
			Message: "Failed to validate coupon",
		}, nil
	}

	if !canUse {
		return &ValidateCouponResponse{
			Valid:   false,
			Message: "Coupon is not valid or has expired",
		}, nil
	}

	// Check minimum order value
	if coupon.MinOrderValue != nil && req.OrderAmount < *coupon.MinOrderValue {
		return &ValidateCouponResponse{
			Valid:   false,
			Message: fmt.Sprintf("Minimum order value is %.2f", *coupon.MinOrderValue),
		}, nil
	}

	// Calculate discount
	var discountAmount float64
	if coupon.DiscountType == "percentage" {
		discountAmount = (req.OrderAmount * coupon.DiscountValue) / 100
		if coupon.MaxDiscount != nil && discountAmount > *coupon.MaxDiscount {
			discountAmount = *coupon.MaxDiscount
		}
	} else { // fixed
		discountAmount = coupon.DiscountValue
		if discountAmount > req.OrderAmount {
			discountAmount = req.OrderAmount
		}
	}

	finalAmount := req.OrderAmount - discountAmount

	return &ValidateCouponResponse{
		Valid:           true,
		Message:         "Coupon is valid",
		DiscountAmount:  discountAmount,
		FinalAmount:     finalAmount,
	}, nil
}

// Helper function to convert model to response
func couponToResponse(coupon *models.Coupon) *CouponResponse {
	return &CouponResponse{
		ID:            coupon.ID,
		Code:          coupon.Code,
		Description:   coupon.Description,
		DiscountType:  coupon.DiscountType,
		DiscountValue: coupon.DiscountValue,
		MaxDiscount:   coupon.MaxDiscount,
		MinOrderValue: coupon.MinOrderValue,
		CourseID:      coupon.CourseID,
		UsageLimit:    coupon.UsageLimit,
		UsedCount:     coupon.UsedCount,
		ValidFrom:     coupon.ValidFrom,
		ValidUntil:    coupon.ValidUntil,
		IsActive:      coupon.IsActive,
		CreatedByID:   coupon.CreatedByID,
		CreatedAt:     coupon.CreatedAt,
		UpdatedAt:     coupon.UpdatedAt,
	}
}
