import { CreateInvoiceDto, InvoiceResponseDto, InvoiceStatsDto, UpdateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    /**
     * Create a new invoice
     * POST /api/v1/invoices
     */
    createInvoice(dto: CreateInvoiceDto): Promise<InvoiceResponseDto>;
    /**
     * Get invoice by ID
     * GET /api/v1/invoices/:id
     */
    getInvoice(id: string): Promise<InvoiceResponseDto>;
    /**
     * Get all invoices for a billing record
     * GET /api/v1/invoices/billing/:billingId
     */
    getInvoicesByBilling(billingId: string, page?: string, limit?: string): Promise<{
        data: import("../master-entities/invoice.entity").Invoice[];
        total: number;
    }>;
    /**
     * List all invoices with optional filtering
     * GET /api/v1/invoices
     */
    listInvoices(page?: string, limit?: string, status?: string): Promise<{
        data: import("../master-entities/invoice.entity").Invoice[];
        total: number;
    }>;
    /**
     * Update an invoice
     * PUT /api/v1/invoices/:id
     */
    updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<InvoiceResponseDto>;
    /**
     * Mark invoice as paid
     * POST /api/v1/invoices/:id/mark-paid
     */
    markAsPaid(id: string, receiptId?: string): Promise<InvoiceResponseDto>;
    /**
     * Record partial payment on invoice
     * POST /api/v1/invoices/:id/record-payment
     */
    recordPayment(id: string, amount: number, receiptId?: string): Promise<InvoiceResponseDto>;
    /**
     * Mark invoice as sent
     * POST /api/v1/invoices/:id/mark-sent
     */
    markAsSent(id: string): Promise<InvoiceResponseDto>;
    /**
     * Cancel/void an invoice
     * POST /api/v1/invoices/:id/cancel
     */
    cancelInvoice(id: string): Promise<InvoiceResponseDto>;
    /**
     * Delete an invoice
     * DELETE /api/v1/invoices/:id
     */
    deleteInvoice(id: string): Promise<void>;
    /**
     * Get invoice statistics for a billing record
     * GET /api/v1/invoices/:billingId/stats
     */
    getInvoiceStats(billingId: string): Promise<InvoiceStatsDto>;
    /**
     * Get unpaid invoices for a billing record
     * GET /api/v1/invoices/:billingId/unpaid
     */
    getUnpaidInvoices(billingId: string): Promise<import("../master-entities/invoice.entity").Invoice[]>;
    /**
     * Get invoices by status
     * GET /api/v1/invoices/status/:status
     */
    getInvoicesByStatus(status: string): Promise<import("../master-entities/invoice.entity").Invoice[]>;
    /**
     * Get overdue invoices
     * GET /api/v1/invoices/overdue
     */
    getOverdueInvoices(): Promise<import("../master-entities/invoice.entity").Invoice[]>;
    /**
     * Get revenue for a period
     * GET /api/v1/invoices/revenue?startDate=2024-01-01&endDate=2024-12-31
     */
    getRevenueByPeriod(startDateStr?: string, endDateStr?: string): Promise<{
        totalRevenue: number;
        invoicesCount: number;
    }>;
}
//# sourceMappingURL=invoice.controller.d.ts.map