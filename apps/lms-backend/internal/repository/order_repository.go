package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrderRepository handles all database operations for orders
type OrderRepository struct {
	db *gorm.DB
}

// NewOrderRepository creates a new order repository instance
func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

// Create saves a new order to the database
func (or *OrderRepository) Create(order *models.Order) error {
	if order.ID == uuid.Nil {
		order.ID = uuid.New()
	}
	if err := or.db.Create(order).Error; err != nil {
		return fmt.Errorf("failed to create order: %w", err)
	}
	return nil
}

// GetByID retrieves an order by its UUID
func (or *OrderRepository) GetByID(id uuid.UUID) (*models.Order, error) {
	var order models.Order
	if err := or.db.Preload("Student").Preload("Course").Preload("Package").Preload("Coupon").First(&order, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("order not found")
		}
		return nil, fmt.Errorf("failed to fetch order: %w", err)
	}
	return &order, nil
}

// GetAll retrieves all orders with pagination
func (or *OrderRepository) GetAll(page, limit int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	// Get total count
	if err := or.db.Model(&models.Order{}).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count orders: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := or.db.Preload("Student").Preload("Course").Preload("Coupon").Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch orders: %w", err)
	}

	return orders, total, nil
}

// GetByStudentID retrieves all orders for a specific student
func (or *OrderRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	// Get total count
	if err := or.db.Model(&models.Order{}).Where("student_id = ?", studentID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count orders: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := or.db.Preload("Student").Preload("Course").Preload("Coupon").Where("student_id = ?", studentID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch orders: %w", err)
	}

	return orders, total, nil
}

// GetByCourseID retrieves all orders for a specific course
func (or *OrderRepository) GetByCourseID(courseID uuid.UUID, page, limit int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	// Get total count
	if err := or.db.Model(&models.Order{}).Where("course_id = ?", courseID).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count orders: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := or.db.Preload("Student").Preload("Course").Preload("Coupon").Where("course_id = ?", courseID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch orders: %w", err)
	}

	return orders, total, nil
}

// GetByStatus retrieves orders by status with pagination
func (or *OrderRepository) GetByStatus(status string, page, limit int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	// Get total count
	if err := or.db.Model(&models.Order{}).Where("status = ?", status).Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count orders: %w", err)
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated results
	if err := or.db.Preload("Student").Preload("Course").Preload("Coupon").Where("status = ?", status).Offset(offset).Limit(limit).Order("created_at DESC").Find(&orders).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch orders: %w", err)
	}

	return orders, total, nil
}

// Update updates an existing order
func (or *OrderRepository) Update(order *models.Order) error {
	if err := or.db.Save(order).Error; err != nil {
		return fmt.Errorf("failed to update order: %w", err)
	}
	return nil
}

// Delete removes an order from the database
func (or *OrderRepository) Delete(id uuid.UUID) error {
	if err := or.db.Delete(&models.Order{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete order: %w", err)
	}
	return nil
}

// GetByProviderOrderID retrieves an order by provider order ID
func (or *OrderRepository) GetByProviderOrderID(providerOrderID string) (*models.Order, error) {
	var order models.Order
	if err := or.db.Preload("Student").Preload("Course").Preload("Coupon").First(&order, "provider_order_id = ?", providerOrderID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch order: %w", err)
	}
	return &order, nil
}

// CheckStudentCourseOrder checks if a student has an order for a course
func (or *OrderRepository) CheckStudentCourseOrder(studentID, courseID uuid.UUID) (bool, error) {
	var count int64
	if err := or.db.Model(&models.Order{}).
		Where("student_id = ? AND course_id = ? AND status = ?", studentID, courseID, "completed").
		Count(&count).Error; err != nil {
		return false, fmt.Errorf("failed to check order: %w", err)
	}
	return count > 0, nil
}
