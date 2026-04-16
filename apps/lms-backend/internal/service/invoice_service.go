package service

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"flcn_lms_backend/internal/models"
	"flcn_lms_backend/internal/repository"
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// InvoiceService handles invoice business logic
type InvoiceService struct {
	invoiceRepo *repository.InvoiceRepository
}

// NewInvoiceService creates a new InvoiceService
func NewInvoiceService(invoiceRepo *repository.InvoiceRepository) *InvoiceService {
	return &InvoiceService{invoiceRepo: invoiceRepo}
}

// InvoiceLineItem represents a single line on an invoice
type InvoiceLineItem struct {
	Description string  `json:"description"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	Amount      float64 `json:"amount"`
}

// InvoiceResponse is the API response for an invoice
type InvoiceResponse struct {
	ID             uuid.UUID         `json:"id"`
	InvoiceNumber  string            `json:"invoice_number"`
	StudentID      uuid.UUID         `json:"student_id"`
	OrderID        uuid.UUID         `json:"order_id"`
	LineItems      []InvoiceLineItem `json:"line_items"`
	Subtotal       float64           `json:"subtotal"`
	TaxAmount      float64           `json:"tax_amount"`
	DiscountAmount float64           `json:"discount_amount"`
	TotalAmount    float64           `json:"total_amount"`
	Status         string            `json:"status"`
	IssuedAt       time.Time         `json:"issued_at"`
}

// GenerateForOrder creates an invoice for a completed order
func (s *InvoiceService) GenerateForOrder(order *models.Order, lineItems []InvoiceLineItem) (*InvoiceResponse, error) {
	log.Printf("[InvoiceService] Generating invoice for order %s", order.ID)

	// Idempotent: return existing invoice if one already exists
	existing, err := s.invoiceRepo.GetByOrderID(order.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing invoice: %w", err)
	}
	if existing != nil {
		return invoiceToResponse(existing), nil
	}

	invoiceNumber, err := s.generateInvoiceNumber()
	if err != nil {
		return nil, fmt.Errorf("failed to generate invoice number: %w", err)
	}

	lineItemsJSON, err := marshalLineItems(lineItems)
	if err != nil {
		return nil, fmt.Errorf("invalid line items: %w", err)
	}

	inv := &models.Invoice{
		InvoiceNumber:  invoiceNumber,
		StudentID:      order.StudentID,
		OrderID:        order.ID,
		LineItems:      lineItemsJSON,
		Subtotal:       order.OriginalPrice,
		TaxAmount:      0,
		DiscountAmount: order.DiscountAmount,
		TotalAmount:    order.FinalAmount,
		Status:         "issued",
		IssuedAt:       time.Now(),
	}

	if err := s.invoiceRepo.Create(inv); err != nil {
		return nil, fmt.Errorf("failed to create invoice: %w", err)
	}

	return invoiceToResponse(inv), nil
}

// GetMyInvoices retrieves paginated invoices for a student
func (s *InvoiceService) GetMyInvoices(studentID uuid.UUID, page, limit int) ([]InvoiceResponse, int64, error) {
	invoices, total, err := s.invoiceRepo.GetByStudentID(studentID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	result := make([]InvoiceResponse, 0, len(invoices))
	for _, inv := range invoices {
		result = append(result, *invoiceToResponse(&inv))
	}
	return result, total, nil
}

// GetInvoice retrieves a single invoice by ID
func (s *InvoiceService) GetInvoice(id uuid.UUID) (*InvoiceResponse, error) {
	inv, err := s.invoiceRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return invoiceToResponse(inv), nil
}

// GetInvoiceByOrder retrieves the invoice for an order
func (s *InvoiceService) GetInvoiceByOrder(orderID uuid.UUID) (*InvoiceResponse, error) {
	inv, err := s.invoiceRepo.GetByOrderID(orderID)
	if err != nil {
		return nil, err
	}
	if inv == nil {
		return nil, fmt.Errorf("invoice not found")
	}
	return invoiceToResponse(inv), nil
}

// --- Helpers ---

func (s *InvoiceService) generateInvoiceNumber() (string, error) {
	count, err := s.invoiceRepo.CountAll()
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("INV-%06d", count+1), nil
}

func marshalLineItems(items []InvoiceLineItem) (datatypes.JSON, error) {
	if items == nil {
		return datatypes.JSON("[]"), nil
	}
	b, err := json.Marshal(items)
	if err != nil {
		return nil, err
	}
	return datatypes.JSON(b), nil
}

func invoiceToResponse(inv *models.Invoice) *InvoiceResponse {
	var lineItems []InvoiceLineItem
	if len(inv.LineItems) > 0 {
		_ = json.Unmarshal(inv.LineItems, &lineItems)
	}
	if lineItems == nil {
		lineItems = []InvoiceLineItem{}
	}

	return &InvoiceResponse{
		ID:             inv.ID,
		InvoiceNumber:  inv.InvoiceNumber,
		StudentID:      inv.StudentID,
		OrderID:        inv.OrderID,
		LineItems:      lineItems,
		Subtotal:       inv.Subtotal,
		TaxAmount:      inv.TaxAmount,
		DiscountAmount: inv.DiscountAmount,
		TotalAmount:    inv.TotalAmount,
		Status:         inv.Status,
		IssuedAt:       inv.IssuedAt,
	}
}
