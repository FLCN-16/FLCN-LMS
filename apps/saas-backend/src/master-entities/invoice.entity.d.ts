import { InstituteBilling } from './institute-billing.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores payment invoices for billing records.
 * One invoice per payment transaction or billing period.
 *
 * This entity is stored in the MASTER database only.
 */
export declare class Invoice {
    id: string;
    /**
     * Foreign key to the billing record
     */
    billingId: string;
    /**
     * Stripe invoice ID for reference
     */
    stripeInvoiceId?: string;
    /**
     * Invoice number/reference
     * Example: INV-2024-0001
     */
    invoiceNumber?: string;
    /**
     * Invoice date
     */
    invoiceDate: Date;
    /**
     * Period start date
     */
    periodStart: Date;
    /**
     * Period end date
     */
    periodEnd: Date;
    /**
     * Invoice amount (in cents to avoid floating point issues)
     * Precision: 10 digits total, 2 decimal places
     */
    amount: number;
    /**
     * Amount already paid (in cents)
     */
    amountPaid: number;
    /**
     * Amount still due (in cents)
     */
    amountDue: number;
    /**
     * Currency code (ISO 4217)
     * Example: USD, EUR, INR
     */
    currency: string;
    /**
     * Invoice status
     * draft: Not yet sent
     * open: Sent, awaiting payment
     * paid: Payment received
     * uncollectible: Cannot be collected
     * void: Cancelled
     */
    status: string;
    /**
     * Description or line items (JSON array)
     * Example: [
     *   { description: 'Premium Plan', quantity: 1, unitPrice: 99.99 },
     *   { description: 'Tax', quantity: 1, unitPrice: 9.99 }
     * ]
     */
    lineItems?: Record<string, unknown>[];
    /**
     * Payment method used
     * Example: credit_card, bank_transfer, etc.
     */
    paymentMethod?: string;
    /**
     * Date when payment was received
     */
    paidDate?: Date;
    /**
     * Due date for payment
     */
    dueDate?: Date;
    /**
     * Notes or memo on invoice
     */
    notes?: string;
    /**
     * Payment receipt/transaction ID
     */
    receiptId?: string;
    /**
     * Whether invoice was sent to customer
     */
    isSent: boolean;
    /**
     * Date when invoice was sent
     */
    sentAt?: Date;
    /**
     * Timestamp when record was created
     */
    createdAt: Date;
    /**
     * Timestamp when record was last updated
     */
    updatedAt: Date;
    /**
     * Relation to InstituteBilling
     * Allows: invoice.billing.instituteId, etc.
     */
    billing?: InstituteBilling;
}
//# sourceMappingURL=invoice.entity.d.ts.map