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

// OrderHandler handles all order-related HTTP requests
type OrderHandler struct {
	orderService *service.OrderService
}

// NewOrderHandler creates a new order handler instance
func NewOrderHandler(orderService *service.OrderService) *OrderHandler {
	return &OrderHandler{
		orderService: orderService,
	}
}

// ListOrders godoc
// @Summary List all orders
// @Description Retrieve paginated list of all orders (admin only)
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of orders per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /orders [get]
func (oh *OrderHandler) ListOrders(c *gin.Context) {
	log.Println("[Order Handler] Listing all orders")

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

	orders, total, err := oh.orderService.ListOrders(page, limit)
	if err != nil {
		log.Printf("[Order Handler] Failed to list orders: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  orders,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetOrder godoc
// @Summary Get order by ID
// @Description Retrieve a specific order by ID
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /orders/{id} [get]
func (oh *OrderHandler) GetOrder(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid order ID: %v", err)
		response.BadRequest(c, "Invalid order ID")
		return
	}

	order, err := oh.orderService.GetOrder(id)
	if err != nil {
		log.Printf("[Order Handler] Failed to get order: %v", err)
		response.NotFound(c, "Order not found")
		return
	}

	response.Success(c, http.StatusOK, order)
}

// ListStudentOrders godoc
// @Summary List student orders
// @Description Retrieve orders for a specific student
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param studentId path string true "Student ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of orders per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /users/{studentId}/orders [get]
func (oh *OrderHandler) ListStudentOrders(c *gin.Context) {
	studentIDStr := c.Param("studentId")
	studentID, err := uuid.Parse(studentIDStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid student ID: %v", err)
		response.BadRequest(c, "Invalid student ID")
		return
	}

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

	orders, total, err := oh.orderService.ListStudentOrders(studentID, page, limit)
	if err != nil {
		log.Printf("[Order Handler] Failed to list student orders: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  orders,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// ListCourseOrders godoc
// @Summary List course orders
// @Description Retrieve orders for a specific course
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param courseId path string true "Course ID"
// @Param page query int false "Page number (default 1)" default(1)
// @Param limit query int false "Number of orders per page (default 10)" default(10)
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /courses/{courseId}/orders [get]
func (oh *OrderHandler) ListCourseOrders(c *gin.Context) {
	courseIDStr := c.Param("courseId")
	courseID, err := uuid.Parse(courseIDStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid course ID: %v", err)
		response.BadRequest(c, "Invalid course ID")
		return
	}

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

	orders, total, err := oh.orderService.ListCourseOrders(courseID, page, limit)
	if err != nil {
		log.Printf("[Order Handler] Failed to list course orders: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  orders,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateOrder godoc
// @Summary Create a new order
// @Description Create a new order for a course (student only)
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param request body service.CreateOrderRequest true "Order creation request"
// @Success 201 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Router /orders [post]
func (oh *OrderHandler) CreateOrder(c *gin.Context) {
	log.Println("[Order Handler] Creating new order")

	// Get student ID from context (set by auth middleware)
	studentID, exists := c.Get("user_id")
	if !exists {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	studentUUID, ok := studentID.(uuid.UUID)
	if !ok {
		response.BadRequest(c, "Invalid user ID format")
		return
	}

	var req service.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Order Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	order, err := oh.orderService.CreateOrder(studentUUID, &req)
	if err != nil {
		log.Printf("[Order Handler] Failed to create order: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, order)
}

// UpdateOrderStatus godoc
// @Summary Update order status
// @Description Update the status of an order (admin only)
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Param request body service.UpdateOrderStatusRequest true "Order status update request"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /orders/{id}/status [patch]
func (oh *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid order ID: %v", err)
		response.BadRequest(c, "Invalid order ID")
		return
	}

	var req service.UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[Order Handler] Invalid request: %v", err)
		response.BadRequest(c, err.Error())
		return
	}

	order, err := oh.orderService.UpdateOrderStatus(id, &req)
	if err != nil {
		log.Printf("[Order Handler] Failed to update order: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, order)
}

// CancelOrder godoc
// @Summary Cancel order
// @Description Cancel a pending order
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /orders/{id}/cancel [post]
func (oh *OrderHandler) CancelOrder(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid order ID: %v", err)
		response.BadRequest(c, "Invalid order ID")
		return
	}

	if err := oh.orderService.CancelOrder(id); err != nil {
		log.Printf("[Order Handler] Failed to cancel order: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{"message": "Order cancelled successfully"})
}

// DeleteOrder godoc
// @Summary Delete order
// @Description Delete an order (admin only)
// @Tags Orders
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Success 204
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /orders/{id} [delete]
func (oh *OrderHandler) DeleteOrder(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		log.Printf("[Order Handler] Invalid order ID: %v", err)
		response.BadRequest(c, "Invalid order ID")
		return
	}

	if err := oh.orderService.DeleteOrder(id); err != nil {
		log.Printf("[Order Handler] Failed to delete order: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusNoContent, nil)
}
