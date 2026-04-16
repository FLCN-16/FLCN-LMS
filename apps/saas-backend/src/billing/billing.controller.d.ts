import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { StripeService } from './stripe.service';
export declare class BillingController {
    private readonly billingService;
    private readonly stripeService;
    constructor(billingService: BillingService, stripeService: StripeService);
    /**
     * List all billing records
     * GET /api/v1/billing
     */
    listAllBilling(): Promise<import("../master-entities/institute-billing.entity").InstituteBilling[]>;
    /**
     * Get billing record for a specific institute
     * GET /api/v1/billing/:instituteId
     */
    getBillingByInstitute(instituteId: string): Promise<import("../master-entities/institute-billing.entity").InstituteBilling>;
    /**
     * Create a new billing record
     * POST /api/v1/billing
     * Body: { instituteId, stripeCustomerId?, plan? }
     */
    createBilling(dto: CreateBillingDto): Promise<import("../master-entities/institute-billing.entity").InstituteBilling>;
    /**
     * Update a billing record
     * PUT /api/v1/billing/:id
     */
    updateBilling(id: string, dto: UpdateBillingDto): Promise<import("../master-entities/institute-billing.entity").InstituteBilling>;
    /**
     * Get subscription details for a billing record
     * GET /api/v1/billing/:id/subscription
     */
    getSubscriptionDetails(id: string): Promise<{
        billingId: string;
        subscriptionId: string | undefined;
        status: string;
        plan: string | undefined;
        currentPeriodStart: Date | undefined;
        currentPeriodEnd: Date | undefined;
        nextBillingDate: Date | undefined;
        amountDue: number | undefined;
        currency: string;
    }>;
    /**
     * Get invoice history for a billing record
     * GET /api/v1/billing/:id/invoices
     */
    getInvoices(id: string): Promise<{
        billingId: string;
        invoices: Record<string, unknown>[];
        total: number;
    }>;
    /**
     * Retry a failed payment
     * POST /api/v1/billing/:id/retry-payment
     */
    retryFailedPayment(id: string): Promise<{
        success: boolean;
        message: string;
        billingId: string;
    }>;
    /**
     * Cancel a subscription
     * POST /api/v1/billing/:id/cancel-subscription
     */
    cancelSubscription(id: string): Promise<{
        success: boolean;
        message: string;
        billingId: string;
    }>;
    /**
     * Update billing status
     * POST /api/v1/billing/:id/status
     * Body: { status: 'active' | 'past_due' | 'unpaid' | 'canceled' }
     */
    updateBillingStatus(id: string, status: string): Promise<import("../master-entities/institute-billing.entity").InstituteBilling>;
}
//# sourceMappingURL=billing.controller.d.ts.map