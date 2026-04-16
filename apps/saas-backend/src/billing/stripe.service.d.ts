import { Repository } from 'typeorm';
import { InstituteBilling } from '../master-entities/institute-billing.entity';
interface StripeEvent {
    id: string;
    object: string;
    api_version: string;
    created: number;
    data: {
        object: any;
        previous_attributes?: any;
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
        id: string | null;
        idempotency_key: string | null;
    };
    type: string;
}
interface StripeCustomer {
    id: string;
    email: string;
    metadata?: Record<string, string>;
}
interface StripeSubscription {
    id: string;
    customer: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    items?: {
        data: Array<{
            price: {
                id: string;
                product: string;
            };
        }>;
    };
    metadata?: Record<string, string>;
}
export declare class StripeService {
    private billingRepository;
    private readonly logger;
    constructor(billingRepository: Repository<InstituteBilling>);
    /**
     * Handle Stripe webhook events
     * Webhook signature verification should be done in the controller
     */
    handleWebhookEvent(event: StripeEvent): Promise<void>;
    /**
     * Handle subscription created event
     */
    private handleSubscriptionCreated;
    /**
     * Handle subscription updated event
     */
    private handleSubscriptionUpdated;
    /**
     * Handle subscription deleted event
     */
    private handleSubscriptionDeleted;
    /**
     * Handle invoice payment succeeded event
     */
    private handleInvoicePaymentSucceeded;
    /**
     * Handle invoice payment failed event
     */
    private handleInvoicePaymentFailed;
    /**
     * Handle customer updated event
     */
    private handleCustomerUpdated;
    /**
     * Retrieve customer from Stripe
     */
    getStripeCustomer(customerId: string): Promise<StripeCustomer | null>;
    /**
     * Retrieve subscription from Stripe
     */
    getStripeSubscription(subscriptionId: string): Promise<StripeSubscription | null>;
    /**
     * Update billing status
     */
    updateBillingStatus(billingId: string, status: string): Promise<InstituteBilling>;
    /**
     * Get billing record by institute
     */
    getBillingByInstitute(instituteId: string): Promise<InstituteBilling | null>;
    /**
     * Create billing record for institute
     */
    createBillingRecord(instituteId: string, stripeCustomerId: string): Promise<InstituteBilling>;
    /**
     * Retry failed payment
     */
    retryFailedPayment(billingId: string): Promise<void>;
    /**
     * Cancel subscription
     */
    cancelSubscription(billingId: string): Promise<void>;
}
export {};
//# sourceMappingURL=stripe.service.d.ts.map