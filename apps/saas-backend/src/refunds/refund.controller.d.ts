import { CreateRefundDto } from './dto/create-refund.dto';
import { RefundService } from './refund.service';
export declare class RefundController {
    private readonly refundService;
    constructor(refundService: RefundService);
    /**
     * Create a new refund request
     * POST /api/v1/refunds
     *
     * Requires: write:customers scope
     * The initiatedBy field is automatically populated from the authenticated user
     *
     * Request body:
     * - invoiceId: UUID of the invoice to refund
     * - amount: Refund amount (same currency as invoice)
     * - reason: Reason for the refund (customer_request, duplicate_charge, etc.)
     * - refundMethod: Payment method for refund (optional, defaults to original_payment_method)
     * - notes: Additional notes about the refund (optional)
     * - type: Either 'full' or 'partial' (optional, defaults to 'full')
     *
     * Returns: Created refund details
     */
    createRefund(dto: CreateRefundDto, initiatedBy?: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Get refund by ID
     * GET /api/v1/refunds/:id
     *
     * Requires: read:customers scope
     */
    getRefund(id: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Get refunds for an invoice with pagination
     * GET /api/v1/refunds/invoice/:invoiceId
     *
     * Query parameters:
     * - page: Page number (default: 1)
     * - limit: Items per page (default: 10, max: 100)
     */
    getRefundsByInvoice(invoiceId: string, page?: string, limit?: string): Promise<{
        data: import("../master-entities/refund.entity").Refund[];
        total: number;
    }>;
    /**
     * Get refunds by status
     * GET /api/v1/refunds/status/:status
     *
     * Path parameters:
     * - status: One of pending, processing, completed, failed, rejected
     */
    getRefundsByStatus(status: string): Promise<import("../master-entities/refund.entity").Refund[]>;
    /**
     * List all refunds with optional filtering
     * GET /api/v1/refunds
     *
     * Query parameters:
     * - page: Page number (default: 1)
     * - limit: Items per page (default: 10, max: 100)
     * - status: Filter by refund status (optional)
     */
    listRefunds(page?: string, limit?: string, status?: string): Promise<{
        data: import("../master-entities/refund.entity").Refund[];
        total: number;
    }>;
    /**
     * Process a refund (transition to processing/completed state)
     * POST /api/v1/refunds/:id/process
     *
     * Path parameters:
     * - id: Refund ID
     *
     * Requires: write:customers scope
     */
    processRefund(id: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Approve and process a pending refund
     * POST /api/v1/refunds/:id/approve
     *
     * Path parameters:
     * - id: Refund ID
     *
     * Requires: write:customers scope
     */
    approveRefund(id: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Retry a failed refund
     * POST /api/v1/refunds/:id/retry
     *
     * Path parameters:
     * - id: Refund ID
     *
     * Requires: write:customers scope
     * Only failed refunds with retry attempts remaining can be retried
     */
    retryRefund(id: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Reject a refund
     * POST /api/v1/refunds/:id/reject
     *
     * Path parameters:
     * - id: Refund ID
     *
     * Request body:
     * - reason: Rejection reason (required)
     *
     * Requires: write:customers scope
     */
    rejectRefund(id: string, reason: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Cancel a pending refund
     * DELETE /api/v1/refunds/:id
     *
     * Path parameters:
     * - id: Refund ID
     *
     * Requires: write:customers scope
     * Only pending refunds can be cancelled
     */
    cancelRefund(id: string): Promise<import("../master-entities/refund.entity").Refund>;
    /**
     * Get refund statistics
     * GET /api/v1/refunds/stats/summary
     *
     * Requires: read:customers scope
     * Returns aggregate refund metrics
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
     * Get pending refunds ready for batch processing
     * GET /api/v1/refunds/pending/list
     *
     * Requires: read:customers scope
     */
    getPendingRefunds(): Promise<import("../master-entities/refund.entity").Refund[]>;
    /**
     * Get refunds ready for retry
     * GET /api/v1/refunds/ready-retry/list
     *
     * Requires: read:customers scope
     * Returns failed refunds that have retry attempts remaining and are past nextRetryAt
     */
    getRefundsReadyForRetry(): Promise<import("../master-entities/refund.entity").Refund[]>;
    /**
     * Process all pending refunds in batch
     * POST /api/v1/refunds/batch/process
     *
     * Requires: write:customers scope
     * Attempts to process all pending refunds and returns summary
     */
    processPendingRefunds(): Promise<{
        processed: number;
        successful: number;
    }>;
    /**
     * Retry all failed refunds in batch
     * POST /api/v1/refunds/batch/retry
     *
     * Requires: write:customers scope
     * Attempts to retry all failed refunds that are ready and returns summary
     */
    retryFailedRefunds(): Promise<{
        retried: number;
        successful: number;
    }>;
    /**
     * Get total refunded amount for an invoice
     * GET /api/v1/refunds/invoice/:invoiceId/total-refunded
     *
     * Path parameters:
     * - invoiceId: Invoice UUID
     *
     * Requires: read:customers scope
     * Returns the sum of all completed refunds for the invoice
     */
    getTotalRefundedAmount(invoiceId: string): Promise<{
        invoiceId: string;
        totalRefunded: number;
    }>;
    /**
     * Check if invoice can be fully refunded
     * GET /api/v1/refunds/invoice/:invoiceId/can-refund
     *
     * Path parameters:
     * - invoiceId: Invoice UUID
     *
     * Requires: read:customers scope
     */
    canFullyRefund(invoiceId: string): Promise<{
        invoiceId: string;
        canRefund: boolean;
        remainingRefundable: number;
    }>;
    /**
     * Get remaining refundable amount for an invoice
     * GET /api/v1/refunds/invoice/:invoiceId/remaining-refundable
     *
     * Path parameters:
     * - invoiceId: Invoice UUID
     *
     * Requires: read:customers scope
     */
    getRemainingRefundableAmount(invoiceId: string): Promise<{
        invoiceId: string;
        remainingRefundable: number;
    }>;
}
//# sourceMappingURL=refund.controller.d.ts.map