package service

import (
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
)

// OrderService handles order business logic
type OrderService struct {
	orderRepo   repository.OrderRepository
	courseRepo  repository.CourseRepository
	packageRepo *repository.CoursePackageRepository
	subService  *SubscriptionService
	invService  *InvoiceService
}

// NewOrderService creates a new order service instance
func NewOrderService(orderRepo repository.OrderRepository, courseRepo repository.CourseRepository) *OrderService {
	return &OrderService{
		orderRepo:  orderRepo,
		courseRepo: courseRepo,
	}
}

// SetBillingServices wires in subscription and invoice services (called after init to avoid circular deps)
func (os *OrderService) SetBillingServices(packageRepo *repository.CoursePackageRepository, subService *SubscriptionService, invService *InvoiceService) {
	os.packageRepo = packageRepo
	os.subService = subService
	os.invService = invService
}

// OrderResponse represents an order in API responses
type OrderResponse struct {
	ID                uuid.UUID              `json:"id"`
	StudentID         uuid.UUID              `json:"student_id"`
	CourseID          uuid.UUID              `json:"course_id"`
	PackageID         *uuid.UUID             `json:"package_id"`
	Course            *CourseResponse        `json:"course,omitempty"`
	Package           *CoursePackageResponse `json:"package,omitempty"`
	OriginalPrice     float64                `json:"original_price"`
	DiscountAmount    float64                `json:"discount_amount"`
	FinalAmount       float64                `json:"final_amount"`
	CouponID          *uuid.UUID             `json:"coupon_id"`
	Status            string                 `json:"status"`
	PaymentProvider   *string                `json:"payment_provider"`
	ProviderOrderID   *string                `json:"provider_order_id"`
	ProviderPaymentID *string                `json:"provider_payment_id"`
	PaidAt            *time.Time             `json:"paid_at"`
	CreatedAt         time.Time              `json:"created_at"`
	UpdatedAt         time.Time              `json:"updated_at"`
}

// CreateOrderRequest represents an order creation request
type CreateOrderRequest struct {
	CourseID       uuid.UUID  `json:"course_id" binding:"required"`
	PackageID      *uuid.UUID `json:"package_id"`
	DiscountAmount float64    `json:"discount_amount"`
	CouponID       *uuid.UUID `json:"coupon_id"`
}

// UpdateOrderStatusRequest represents a request to update order status
type UpdateOrderStatusRequest struct {
	Status            string  `json:"status" binding:"required"`
	PaymentProvider   *string `json:"payment_provider"`
	ProviderOrderID   *string `json:"provider_order_id"`
	ProviderPaymentID *string `json:"provider_payment_id"`
}

// ListOrders retrieves paginated list of all orders
func (os *OrderService) ListOrders(page, limit int) ([]OrderResponse, int64, error) {
	orders, total, err := os.orderRepo.GetAll(page, limit)
	if err != nil {
		log.Printf("[Order Service] Failed to list orders: %v", err)
		return nil, 0, err
	}

	var responses []OrderResponse
	for _, order := range orders {
		responses = append(responses, *orderToResponse(&order))
	}

	return responses, total, nil
}

// GetOrder retrieves a single order by ID
func (os *OrderService) GetOrder(id uuid.UUID) (*OrderResponse, error) {
	order, err := os.orderRepo.GetByID(id)
	if err != nil {
		log.Printf("[Order Service] Failed to get order: %v", err)
		return nil, err
	}
	if order == nil {
		return nil, fmt.Errorf("order not found")
	}
	return orderToResponse(order), nil
}

// ListStudentOrders retrieves orders for a specific student
func (os *OrderService) ListStudentOrders(studentID uuid.UUID, page, limit int) ([]OrderResponse, int64, error) {
	orders, total, err := os.orderRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		log.Printf("[Order Service] Failed to list student orders: %v", err)
		return nil, 0, err
	}

	var responses []OrderResponse
	for _, order := range orders {
		responses = append(responses, *orderToResponse(&order))
	}

	return responses, total, nil
}

// ListCourseOrders retrieves orders for a specific course
func (os *OrderService) ListCourseOrders(courseID uuid.UUID, page, limit int) ([]OrderResponse, int64, error) {
	orders, total, err := os.orderRepo.GetByCourseID(courseID, page, limit)
	if err != nil {
		log.Printf("[Order Service] Failed to list course orders: %v", err)
		return nil, 0, err
	}

	var responses []OrderResponse
	for _, order := range orders {
		responses = append(responses, *orderToResponse(&order))
	}

	return responses, total, nil
}

// CreateOrder creates a new order for a course (optionally with a package)
func (os *OrderService) CreateOrder(studentID uuid.UUID, req *CreateOrderRequest) (*OrderResponse, error) {
	log.Printf("[Order Service] Creating order for student %s, course %s", studentID, req.CourseID)

	// Verify course exists and get price
	course, err := os.courseRepo.GetByID(req.CourseID)
	if err != nil {
		log.Printf("[Order Service] Course not found: %v", err)
		return nil, fmt.Errorf("course not found: %w", err)
	}

	// Determine original price — use package price when a package is selected
	originalPrice := course.Price
	if req.PackageID != nil && os.packageRepo != nil {
		pkg, pkgErr := os.packageRepo.GetByID(*req.PackageID)
		if pkgErr != nil {
			return nil, fmt.Errorf("package not found: %w", pkgErr)
		}
		if pkg.CourseID != req.CourseID {
			return nil, fmt.Errorf("package does not belong to the specified course")
		}
		if !pkg.IsActive {
			return nil, fmt.Errorf("package is not active")
		}
		originalPrice = pkg.Price
	}

	// Calculate final amount
	finalAmount := originalPrice - req.DiscountAmount
	if finalAmount < 0 {
		finalAmount = 0
	}

	order := &models.Order{
		ID:             uuid.New(),
		StudentID:      studentID,
		CourseID:       req.CourseID,
		PackageID:      req.PackageID,
		OriginalPrice:  originalPrice,
		DiscountAmount: req.DiscountAmount,
		FinalAmount:    finalAmount,
		CouponID:       req.CouponID,
		Status:         "pending",
	}

	if err := os.orderRepo.Create(order); err != nil {
		log.Printf("[Order Service] Failed to create order: %v", err)
		return nil, fmt.Errorf("failed to create order: %w", err)
	}

	log.Printf("[Order Service] Order created successfully: %s", order.ID)
	return orderToResponse(order), nil
}

// UpdateOrderStatus updates the status of an order
func (os *OrderService) UpdateOrderStatus(id uuid.UUID, req *UpdateOrderStatusRequest) (*OrderResponse, error) {
	log.Printf("[Order Service] Updating order status: %s", id)

	order, err := os.orderRepo.GetByID(id)
	if err != nil {
		log.Printf("[Order Service] Failed to get order: %v", err)
		return nil, err
	}
	if order == nil {
		return nil, fmt.Errorf("order not found")
	}

	order.Status = req.Status
	order.PaymentProvider = req.PaymentProvider
	order.ProviderOrderID = req.ProviderOrderID
	order.ProviderPaymentID = req.ProviderPaymentID

	// Set paid_at timestamp if order is completed
	if req.Status == "completed" && order.PaidAt == nil {
		now := time.Now()
		order.PaidAt = &now
	}

	if err := os.orderRepo.Update(order); err != nil {
		log.Printf("[Order Service] Failed to update order: %v", err)
		return nil, fmt.Errorf("failed to update order: %w", err)
	}

	// Auto-create subscription and invoice when order is completed
	if req.Status == "completed" && os.subService != nil && os.invService != nil {
		validityDays := 0
		if order.PackageID != nil && os.packageRepo != nil {
			if pkg, pkgErr := os.packageRepo.GetByID(*order.PackageID); pkgErr == nil {
				validityDays = pkg.ValidityDays
			}
		}

		_, subErr := os.subService.CreateSubscription(order.StudentID, order.CourseID, order.ID, order.PackageID, validityDays)
		if subErr != nil {
			log.Printf("[Order Service] Warning: failed to create subscription for order %s: %v", id, subErr)
		}

		courseName := order.Course.Title
		if courseName == "" {
			courseName = "Course"
		}
		lineItems := []InvoiceLineItem{
			{
				Description: courseName,
				Quantity:    1,
				UnitPrice:   order.OriginalPrice,
				Amount:      order.OriginalPrice,
			},
		}
		_, invErr := os.invService.GenerateForOrder(order, lineItems)
		if invErr != nil {
			log.Printf("[Order Service] Warning: failed to generate invoice for order %s: %v", id, invErr)
		}
	}

	log.Printf("[Order Service] Order updated successfully: %s", id)
	return orderToResponse(order), nil
}

// CancelOrder cancels an order
func (os *OrderService) CancelOrder(id uuid.UUID) error {
	log.Printf("[Order Service] Canceling order: %s", id)

	order, err := os.orderRepo.GetByID(id)
	if err != nil {
		log.Printf("[Order Service] Failed to get order: %v", err)
		return err
	}
	if order == nil {
		return fmt.Errorf("order not found")
	}

	// Only allow cancellation if order is pending
	if order.Status != "pending" {
		return fmt.Errorf("can only cancel pending orders")
	}

	order.Status = "cancelled"

	if err := os.orderRepo.Update(order); err != nil {
		log.Printf("[Order Service] Failed to cancel order: %v", err)
		return fmt.Errorf("failed to cancel order: %w", err)
	}

	return nil
}

// DeleteOrder deletes an order
func (os *OrderService) DeleteOrder(id uuid.UUID) error {
	log.Printf("[Order Service] Deleting order: %s", id)

	if err := os.orderRepo.Delete(id); err != nil {
		log.Printf("[Order Service] Failed to delete order: %v", err)
		return fmt.Errorf("failed to delete order: %w", err)
	}

	return nil
}

// Helper function to convert model to response
func orderToResponse(order *models.Order) *OrderResponse {
	resp := &OrderResponse{
		ID:                order.ID,
		StudentID:         order.StudentID,
		CourseID:          order.CourseID,
		PackageID:         order.PackageID,
		OriginalPrice:     order.OriginalPrice,
		DiscountAmount:    order.DiscountAmount,
		FinalAmount:       order.FinalAmount,
		CouponID:          order.CouponID,
		Status:            order.Status,
		PaymentProvider:   order.PaymentProvider,
		ProviderOrderID:   order.ProviderOrderID,
		ProviderPaymentID: order.ProviderPaymentID,
		PaidAt:            order.PaidAt,
		CreatedAt:         order.CreatedAt,
		UpdatedAt:         order.UpdatedAt,
	}

	if order.Course.ID != uuid.Nil {
		resp.Course = courseToResponse(&order.Course)
	}
	if order.Package != nil {
		resp.Package = packageToResponse(order.Package)
	}

	return resp
}
