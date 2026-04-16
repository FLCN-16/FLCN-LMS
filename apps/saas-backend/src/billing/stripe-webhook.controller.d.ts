import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
export declare class StripeWebhookController {
    private stripeService;
    private readonly logger;
    constructor(stripeService: StripeService);
    /**
     * Handle Stripe webhook events
     * POST /webhooks/stripe
     *
     * Receives webhook events from Stripe, verifies the signature,
     * and processes the event accordingly.
     *
     * Events handled:
     * - customer.subscription.created
     * - customer.subscription.updated
     * - customer.subscription.deleted
     * - invoice.payment_succeeded
     * - invoice.payment_failed
     * - customer.updated
     */
    handleStripeWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
    /**
     * Verify Stripe webhook signature using HMAC-SHA256
     *
     * Stripe sends signatures in the format: t=timestamp,v1=signature1,v1=signature2...
     * We compute our own signature and compare using timing-safe comparison
     *
     * @param body - Raw request body (must be the exact bytes sent by Stripe)
     * @param signature - Stripe-Signature header value
     * @param secret - Webhook signing secret from Stripe dashboard
     * @returns true if signature is valid, false otherwise
     */
    private verifyStripeSignature;
}
//# sourceMappingURL=stripe-webhook.controller.d.ts.map