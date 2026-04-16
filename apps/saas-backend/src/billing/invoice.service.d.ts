import { Repository } from 'typeorm';
import { InstituteBilling } from '../master-entities/institute-billing.entity';
import { Invoice } from '../master-entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceService {
    private invoiceRepository;
    private billingRepository;
    private readonly logger;
    constructor(invoiceRepository: Repository<Invoice>, billingRepository: Repository<InstituteBilling>);
    /**
     * Create a new invoice
     */
    createInvoice(dto: CreateInvoiceDto): Promise<Invoice>;
    /**
     * Get invoice by ID
     */
    getInvoiceById(id: string): Promise<Invoice>;
    /**
     * Get all invoices for a billing record
     */
    getInvoicesByBilling(billingId: string, page?: number, limit?: number): Promise<{
        data: Invoice[];
        total: number;
    }>;
    /**
     * Get all invoices with optional filtering
     */
    getAllInvoices(page?: number, limit?: number, status?: string): Promise<{
        data: Invoice[];
        total: number;
    }>;
    /**
     * Update invoice
     */
    updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<Invoice>;
    /**
     * Mark invoice as paid
     */
    markAsPaid(id: string, paidDate?: Date, receiptId?: string): Promise<Invoice>;
    /**
     * Mark invoice as sent
     */
    markAsSent(id: string): Promise<Invoice>;
    /**
     * Cancel invoice
     */
    cancelInvoice(id: string): Promise<Invoice>;
    /**
     * Get invoice statistics for a billing record
     */
    getInvoiceStats(billingId: string): Promise<{
        totalInvoices: number;
        totalAmount: number;
        totalPaid: number;
        totalDue: number;
        paidInvoices: number;
        overdueInvoices: number;
    }>;
    /**
     * Delete invoice
     */
    deleteInvoice(id: string): Promise<void>;
    /**
     * Calculate total from line items
     */
    private calculateLineItemsTotal;
    /**
     * Get invoices by status
     */
    getInvoicesByStatus(status: string): Promise<Invoice[]>;
    /**
     * Get overdue invoices
     */
    getOverdueInvoices(): Promise<Invoice[]>;
    /**
     * Get unpaid invoices for a billing record
     */
    getUnpaidInvoicesByBilling(billingId: string): Promise<Invoice[]>;
    /**
     * Record partial payment
     */
    recordPartialPayment(id: string, amount: number, receiptId?: string): Promise<Invoice>;
    /**
     * Bulk update invoice status
     */
    bulkUpdateStatus(ids: string[], status: string): Promise<number>;
    /**
     * Get revenue for a period
     */
    getRevenueByPeriod(startDate: Date, endDate: Date): Promise<{
        totalRevenue: number;
        invoicesCount: number;
    }>;
}
//# sourceMappingURL=invoice.service.d.ts.map