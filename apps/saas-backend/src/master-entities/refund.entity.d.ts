import { Invoice } from './invoice.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores refund transactions for invoices and payments.
 * Tracks partial and full refunds with status and reason.
 *
 * This entity is stored in the MASTER database only.
 */
export declare class Refund {
    id: string;
    /**
     * Foreign key to the invoice being refunded
     */
    invoiceId: string;
    /**
     * Refund amount (in same currency as invoice)
     * Precision: 10 digits total, 2 decimal places
     */
    amount: number;
    /**
     * Refund reason
     * Examples: customer_request, duplicate_charge, damaged_product, etc.
     */
    reason: string;
    /**
     * Refund status
     * pending: Initiated, awaiting processing
     * processing: Being processed by payment gateway
     * completed: Successfully refunded
     * failed: Refund failed, may retry
     * rejected: Refund rejected by payment gateway
     */
    status: string;
    /**
     * Stripe refund ID for reference
     */
    stripeRefundId?: string;
    /**
     * Original payment/transaction ID that was refunded
     */
    originTransactionId?: string;
    /**
     * Date when refund was processed
     */
    refundDate?: Date;
    /**
     * Refund method
     * Examples: credit_card, bank_transfer, original_payment_method, etc.
     */
    refundMethod?: string;
    /**
     * Error message if refund failed
     */
    errorMessage?: string;
    /**
     * Additional notes about the refund
     */
    notes?: string;
    /**
     * Whether this is a partial or full refund
     * full: Entire invoice amount
     * partial: Only part of invoice amount
     */
    type: string;
    /**
     * Number of retry attempts made
     */
    retryCount: number;
    /**
     * Maximum retry attempts before giving up
     */
    maxRetries: number;
    /**
     * Next retry date (for failed refunds)
     */
    nextRetryAt?: Date;
    /**
     * Admin/user who initiated the refund
     */
    initiatedBy?: string;
    /**
     * Timestamp when record was created
     */
    createdAt: Date;
    /**
     * Timestamp when record was last updated
     */
    updatedAt: Date;
    /**
     * Relation to Invoice
     * Allows: refund.invoice.amount, etc.
     */
    invoice?: Invoice;
}
//# sourceMappingURL=refund.entity.d.ts.map