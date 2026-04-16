import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores subscription and billing information for each institute.
 * One billing record per institute.
 *
 * This entity is stored in the MASTER database only.
 */
export declare class InstituteBilling {
    id: string;
    /**
     * Foreign key to the institute
     * Unique constraint: one billing record per institute
     */
    instituteId: string;
    /**
     * Stripe customer ID for payment processing
     */
    stripeCustomerId?: string;
    /**
     * Stripe subscription ID
     */
    subscriptionId?: string;
    /**
     * Current subscription plan: free, pro, enterprise
     * Matches the plan in institutes table
     */
    plan?: string;
    /**
     * Subscription status
     * active: currently paying
     * past_due: payment failed, retry pending
     * unpaid: payment failed, subscription suspended
     * canceled: subscription cancelled
     */
    status: string;
    /**
     * Start date of current billing period
     */
    currentPeriodStart?: Date;
    /**
     * End date of current billing period
     */
    currentPeriodEnd?: Date;
    /**
     * Next billing date (when the subscription will renew)
     */
    nextBillingDate?: Date;
    /**
     * Amount due (if any)
     * Precision: 10 digits total, 2 decimal places
     */
    amountDue?: number;
    /**
     * Currency code (ISO 4217)
     * Examples: USD, EUR, INR
     */
    currency: string;
    /**
     * Payment method information (JSON)
     * Stores encrypted payment method details
     * Example: { type: 'card', last4: '4242', expMonth: 12, expYear: 2025 }
     */
    paymentMethod?: Record<string, unknown>;
    /**
     * Invoice history (JSON array)
     * Stores past invoices for record keeping
     * Example: [{ id: 'inv_123', date: '2024-01-01', amount: 99.99, status: 'paid' }]
     */
    invoices?: Record<string, unknown>[];
    /**
     * Timestamp when record was created
     */
    createdAt: Date;
    /**
     * Timestamp when record was last updated
     */
    updatedAt: Date;
    /**
     * Relation to Institute
     * Allows: billing.institute.name, etc.
     */
    institute?: Institute;
}
//# sourceMappingURL=institute-billing.entity.d.ts.map