package handlers

import (
	"log"
	"net/http"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// InvoiceHandler handles invoice HTTP requests
type InvoiceHandler struct {
	invoiceService *service.InvoiceService
}

// NewInvoiceHandler creates a new InvoiceHandler
func NewInvoiceHandler(invoiceService *service.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{invoiceService: invoiceService}
}

// GetMyInvoices returns the authenticated student's invoices
// GET /my/invoices
func (h *InvoiceHandler) GetMyInvoices(c *gin.Context) {
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

	page, limit := parsePagination(c)

	invoices, total, err := h.invoiceService.GetMyInvoices(studentUUID, page, limit)
	if err != nil {
		log.Printf("[InvoiceHandler] Failed to get invoices: %v", err)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"data":  invoices,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetInvoice returns a single invoice by ID
// GET /invoices/:id
func (h *InvoiceHandler) GetInvoice(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.BadRequest(c, "Invalid invoice ID")
		return
	}

	invoice, err := h.invoiceService.GetInvoice(id)
	if err != nil {
		response.NotFound(c, "Invoice not found")
		return
	}

	response.Success(c, http.StatusOK, invoice)
}

// GetInvoiceByOrder returns the invoice for a specific order
// GET /orders/:id/invoice
func (h *InvoiceHandler) GetInvoiceByOrder(c *gin.Context) {
	orderIDStr := c.Param("id")
	orderID, err := uuid.Parse(orderIDStr)
	if err != nil {
		response.BadRequest(c, "Invalid order ID")
		return
	}

	invoice, err := h.invoiceService.GetInvoiceByOrder(orderID)
	if err != nil {
		response.NotFound(c, "Invoice not found for this order")
		return
	}

	response.Success(c, http.StatusOK, invoice)
}
