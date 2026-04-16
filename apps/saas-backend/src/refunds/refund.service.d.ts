import { Repository } from 'typeorm';
import { Invoice } from '../master-entities/invoice.entity';
import { Refund } from '../master-entities/refund.entity';
interface CreateRefundDto {
    invoiceId: string;
    amount: number;
    reason: string;
    refundMethod?: string;
    notes?: string;
    initiatedBy?: string;
    type?: 'full' | 'partial';
}
interface UpdateRefundDto {
    status?: string;
    notes?: string;
    refundMethod?: string;
}
export declare class RefundService {
    private refundRepository;
    private invoiceRepository;
    private readonly logger;
    constructor(refundRepository: Repository<Refund>, invoiceRepository: Repository<Invoice>);
    /**
     * Create a new refund request
     */
    createRefund(dto: CreateRefundDto): Promise<Refund>;
    /**
     * Get refund by ID
     */
    getRefundById(id: string): Promise<Refund>;
    /**
     * Get all refunds for an invoice
     */
    getRefundsByInvoice(invoiceId: string, page?: number, limit?: number): Promise<{
        data: Refund[];
        total: number;
    }>;
    /**
     * Get refunds by status
     */
    getRefundsByStatus(status: string): Promise<Refund[]>;
    /**
     * Get all refunds with pagination
     */
    getAllRefunds(page?: number, limit?: number, status?: string): Promise<{
        data: Refund[];
        total: number;
    }>;
    /**
     * Update refund status
     */
    updateRefund(id: string, dto: UpdateRefundDto): Promise<Refund>;
    /**
     * Process a refund (simulate Stripe processing)
     */
    processRefund(id: string): Promise<Refund>;
    /**
     * Retry failed refund
     */
    retryRefund(id: string): Promise<Refund>;
    /**
     * Approve refund
     */
    approveRefund(id: string): Promise<Refund>;
    /**
     * Reject refund
     */
    rejectRefund(id: string, reason: string): Promise<Refund>;
    /**
     * Get refund statistics
     */
    getRefundStats(): Promise<{
        totalRefunds: number;
        totalAmount: number;
        completedRefunds: number;
        completedAmount: number;
        pendingRefunds: number;
        failedRefunds: number;
    }>;
    /**
     * Get pending refunds for batch processing
     */
    getPendingRefunds(): Promise<Refund[]>;
    /**
     * Get refunds ready for retry
     */
    getRefundsReadyForRetry(): Promise<Refund[]>;
    /**
     * Process all pending refunds
     */
    processPendingRefunds(): Promise<{
        processed: number;
        successful: number;
    }>;
    /**
     * Retry all failed refunds that are ready
     */
    retryFailedRefunds(): Promise<{
        retried: number;
        successful: number;
    }>;
    /**
     * Cancel a pending refund
     */
    cancelRefund(id: string): Promise<Refund>;
    /**
     * Get total refunded amount for an invoice
     */
    getTotalRefundedAmount(invoiceId: string): Promise<number>;
    /**
     * Check if invoice can be fully refunded
     */
    canFullyRefund(invoiceId: string): Promise<boolean>;
    /**
     * Get remaining refundable amount for an invoice
     */
    getRemainingRefundableAmount(invoiceId: string): Promise<number>;
}
export {};
//# sourceMappingURL=refund.service.d.ts.map