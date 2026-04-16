package repository

import (
	"errors"
	"fmt"

	"flcn_lms_backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// InvoiceRepository handles database operations for invoices
type InvoiceRepository struct {
	db *gorm.DB
}

// NewInvoiceRepository creates a new InvoiceRepository
func NewInvoiceRepository(db *gorm.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

// Create saves a new invoice
func (r *InvoiceRepository) Create(inv *models.Invoice) error {
	if inv.ID == uuid.Nil {
		inv.ID = uuid.New()
	}
	if err := r.db.Create(inv).Error; err != nil {
		return fmt.Errorf("failed to create invoice: %w", err)
	}
	return nil
}

// GetByID retrieves an invoice by ID
func (r *InvoiceRepository) GetByID(id uuid.UUID) (*models.Invoice, error) {
	var inv models.Invoice
	if err := r.db.Preload("Order").First(&inv, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("invoice not found")
		}
		return nil, fmt.Errorf("failed to fetch invoice: %w", err)
	}
	return &inv, nil
}

// GetByOrderID retrieves the invoice for an order
func (r *InvoiceRepository) GetByOrderID(orderID uuid.UUID) (*models.Invoice, error) {
	var inv models.Invoice
	if err := r.db.Where("order_id = ?", orderID).First(&inv).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch invoice: %w", err)
	}
	return &inv, nil
}

// GetByStudentID retrieves paginated invoices for a student
func (r *InvoiceRepository) GetByStudentID(studentID uuid.UUID, page, limit int) ([]models.Invoice, int64, error) {
	var invoices []models.Invoice
	var total int64
	offset := (page - 1) * limit

	query := r.db.Model(&models.Invoice{}).Where("student_id = ?", studentID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to count invoices: %w", err)
	}

	if err := query.Preload("Order").Order("issued_at DESC").Offset(offset).Limit(limit).Find(&invoices).Error; err != nil {
		return nil, 0, fmt.Errorf("failed to fetch invoices: %w", err)
	}

	return invoices, total, nil
}

// GetByInvoiceNumber retrieves an invoice by its number
func (r *InvoiceRepository) GetByInvoiceNumber(number string) (*models.Invoice, error) {
	var inv models.Invoice
	if err := r.db.Preload("Order").Where("invoice_number = ?", number).First(&inv).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("invoice not found")
		}
		return nil, fmt.Errorf("failed to fetch invoice: %w", err)
	}
	return &inv, nil
}

// CountByStudentThisMonth counts invoices for a student in the current month (for number generation)
func (r *InvoiceRepository) CountAll() (int64, error) {
	var count int64
	if err := r.db.Model(&models.Invoice{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count invoices: %w", err)
	}
	return count, nil
}
