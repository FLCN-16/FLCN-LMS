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

// CouponHandler handles all coupon-related HTTP requests
type CouponHandler struct {
	couponService *service.CouponService
}

// NewCouponHandler creates a new coupon handler instance
func NewCouponHandler(couponService *service.CouponService) *CouponHandler {
	return &CouponHandler{
		couponService: couponService,
	}
}

// ListCoupons godoc
// @Summary List all coupons
// @Description Retrieve paginated list of all coupons (admin only)
// @Tags Coupons
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of coupons per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /coupons [get]
func (ch *CouponHandler) ListCoupons(c *gin.Context) {
	log.Println("[Coupon Handler] Listing all coupons")

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	coupons, total, err := ch.couponService.ListCoupons(page, limit)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to list coupons: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  coupons,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// ListActiveCoupons godoc
// @Summary List active coupons
// @Description Retrieve active coupons available for use
// @Tags Coupons
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of coupons per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /coupons/active [get]
func (ch *CouponHandler) ListActiveCoupons(c *gin.Context) {
	log.Println("[Coupon Handler] Listing active coupons")

	page := 1
	if p := c.Query("page"); p != "" {
		if pageNum, err := strconv.Atoi(p); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 10
	if l := c.Query("limit"); l != "" {
		if limitNum, err := strconv.Atoi(l); err == nil && limitNum > 0 && limitNum <= 100 {
			limit = limitNum
		}
	}

	coupons, total, err := ch.couponService.ListActiveCoupons(page, limit)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to list active coupons: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  coupons,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetCoupon godoc
// @Summary Get coupon by ID
// @Description Retrieve a specific coupon by ID (admin only)
// @Tags Coupons
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Coupon ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /coupons/{id} [get]
func (ch *CouponHandler) GetCoupon(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Coupon Handler] Invalid coupon ID: %v", err)
		response.BadRequest(c, "Invalid coupon ID")
		return
	}

	coupon, err := ch.couponService.GetCoupon(id)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to get coupon: %v", err)
		response.NotFound(c, "Coupon not found")
		return
	}

	response.Success(c, http.StatusOK, coupon)
}

// CreateCoupon godoc
// @Summary Create a new coupon
// @Description Create a new coupon (admin only)
// @Tags Coupons
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateCouponRequest true "Coupon creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /coupons [post]
func (ch *CouponHandler) CreateCoupon(c *gin.Context) {
	log.Println("[Coupon Handler] Creating new coupon")

	// Get admin ID from context (set by auth middleware)
	adminID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	adminUUID, ok := adminID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	var req service.CreateCouponRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Coupon Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	coupon, err := ch.couponService.CreateCoupon(adminUUID, &req)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to create coupon: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, coupon)
}

// UpdateCoupon godoc
// @Summary Update a coupon
// @Description Update an existing coupon (admin only)
// @Tags Coupons
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Coupon ID"
// @Param request body service.UpdateCouponRequest true "Coupon update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /coupons/{id} [patch]
func (ch *CouponHandler) UpdateCoupon(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Coupon Handler] Invalid coupon ID: %v", err)
		response.BadRequest(c, "Invalid coupon ID")
		return
	}

	var req service.UpdateCouponRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Coupon Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	coupon, err := ch.couponService.UpdateCoupon(id, &req)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to update coupon: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, coupon)
}

// DeleteCoupon godoc
// @Summary Delete a coupon
// @Description Delete a coupon (admin only)
// @Tags Coupons
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Coupon ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /coupons/{id} [delete]
func (ch *CouponHandler) DeleteCoupon(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Coupon Handler] Invalid coupon ID: %v", err)
		response.BadRequest(c, "Invalid coupon ID")
		return
	}

	if err := ch.couponService.DeleteCoupon(id); err != nil {
		log.Printf("[Coupon Handler] Failed to delete coupon: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}

// ValidateCoupon godoc
// @Summary Validate coupon and calculate discount
// @Description Validate a coupon code and calculate the discount amount
// @Tags Coupons
// @Accept json
// @Produce json
// @Param request body service.ValidateCouponRequest true "Coupon validation request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /coupons/validate [post]
func (ch *CouponHandler) ValidateCoupon(c *gin.Context) {
	log.Println("[Coupon Handler] Validating coupon")

	var req service.ValidateCouponRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Coupon Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	result, err := ch.couponService.ValidateCoupon(&req)
	if err != nil {
		log.Printf("[Coupon Handler] Failed to validate coupon: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, result)
}
