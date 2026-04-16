"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
let StripeService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StripeService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StripeService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        billingRepository;
        logger = new common_1.Logger(StripeService.name);
        constructor(billingRepository) {
            this.billingRepository = billingRepository;
        }
        /**
         * Handle Stripe webhook events
         * Webhook signature verification should be done in the controller
         */
        async handleWebhookEvent(event) {
            this.logger.log(`Processing Stripe event: ${event.type} (ID: ${event.id})`);
            try {
                switch (event.type) {
                    case 'customer.subscription.created':
                        await this.handleSubscriptionCreated(event.data.object);
                        break;
                    case 'customer.subscription.updated':
                        await this.handleSubscriptionUpdated(event.data.object, event.data.previous_attributes);
                        break;
                    case 'customer.subscription.deleted':
                        await this.handleSubscriptionDeleted(event.data.object);
                        break;
                    case 'invoice.payment_succeeded':
                        await this.handleInvoicePaymentSucceeded(event.data.object);
                        break;
                    case 'invoice.payment_failed':
                        await this.handleInvoicePaymentFailed(event.data.object);
                        break;
                    case 'customer.updated':
                        await this.handleCustomerUpdated(event.data.object);
                        break;
                    default:
                        this.logger.warn(`Unhandled webhook event type: ${event.type}`);
                }
                this.logger.log(`Successfully processed event: ${event.type}`);
            }
            catch (error) {
                this.logger.error(`Error processing webhook event ${event.type}:`, error);
                throw error;
            }
        }
        /**
         * Handle subscription created event
         */
        async handleSubscriptionCreated(subscription) {
            const billing = await this.billingRepository.findOne({
                where: { stripeCustomerId: subscription.customer },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for customer: ${subscription.customer}`);
                return;
            }
            billing.subscriptionId = subscription.id;
            billing.status = subscription.status;
            billing.currentPeriodStart = new Date(subscription.current_period_start * 1000);
            billing.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
            billing.nextBillingDate = new Date(subscription.current_period_end * 1000);
            await this.billingRepository.save(billing);
            this.logger.log(`Subscription created for billing ID: ${billing.id}, subscription: ${subscription.id}`);
        }
        /**
         * Handle subscription updated event
         */
        async handleSubscriptionUpdated(subscription, previousAttributes) {
            const billing = await this.billingRepository.findOne({
                where: { subscriptionId: subscription.id },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for subscription: ${subscription.id}`);
                return;
            }
            // Update period information
            billing.currentPeriodStart = new Date(subscription.current_period_start * 1000);
            billing.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
            billing.nextBillingDate = new Date(subscription.current_period_end * 1000);
            // Check if status changed
            if (previousAttributes?.status &&
                previousAttributes.status !== subscription.status) {
                billing.status = subscription.status;
                if (subscription.status === 'past_due') {
                    this.logger.warn(`Subscription ${subscription.id} is past due for billing ID: ${billing.id}`);
                }
                else if (subscription.status === 'canceled') {
                    this.logger.log(`Subscription ${subscription.id} canceled for billing ID: ${billing.id}`);
                }
            }
            await this.billingRepository.save(billing);
            this.logger.log(`Subscription updated for billing ID: ${billing.id}`);
        }
        /**
         * Handle subscription deleted event
         */
        async handleSubscriptionDeleted(subscription) {
            const billing = await this.billingRepository.findOne({
                where: { subscriptionId: subscription.id },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for subscription: ${subscription.id}`);
                return;
            }
            billing.status = 'canceled';
            billing.subscriptionId = undefined;
            billing.nextBillingDate = undefined;
            await this.billingRepository.save(billing);
            this.logger.log(`Subscription deleted for billing ID: ${billing.id}`);
        }
        /**
         * Handle invoice payment succeeded event
         */
        async handleInvoicePaymentSucceeded(invoice) {
            const billing = await this.billingRepository.findOne({
                where: { subscriptionId: invoice.subscription },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for subscription: ${invoice.subscription}`);
                return;
            }
            // Update billing status to active if it was past_due
            if (billing.status === 'past_due') {
                billing.status = 'active';
            }
            billing.amountDue = 0;
            // Add invoice to history
            if (!billing.invoices) {
                billing.invoices = [];
            }
            billing.invoices.push({
                id: invoice.id,
                amount: invoice.amount_paid,
                amountDue: invoice.amount_due,
                currency: invoice.currency,
                status: 'paid',
                date: new Date(invoice.created * 1000).toISOString(),
                periodStart: new Date(invoice.period_start * 1000).toISOString(),
                periodEnd: new Date(invoice.period_end * 1000).toISOString(),
            });
            await this.billingRepository.save(billing);
            this.logger.log(`Invoice payment succeeded for billing ID: ${billing.id}, amount: ${invoice.amount_paid}`);
        }
        /**
         * Handle invoice payment failed event
         */
        async handleInvoicePaymentFailed(invoice) {
            const billing = await this.billingRepository.findOne({
                where: { subscriptionId: invoice.subscription },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for subscription: ${invoice.subscription}`);
                return;
            }
            billing.status = 'past_due';
            billing.amountDue = invoice.amount_due;
            // Add failed invoice to history
            if (!billing.invoices) {
                billing.invoices = [];
            }
            billing.invoices.push({
                id: invoice.id,
                amount: invoice.amount_paid,
                amountDue: invoice.amount_due,
                currency: invoice.currency,
                status: 'failed',
                date: new Date(invoice.created * 1000).toISOString(),
                periodStart: new Date(invoice.period_start * 1000).toISOString(),
                periodEnd: new Date(invoice.period_end * 1000).toISOString(),
            });
            await this.billingRepository.save(billing);
            this.logger.warn(`Invoice payment failed for billing ID: ${billing.id}, amount due: ${invoice.amount_due}`);
        }
        /**
         * Handle customer updated event
         */
        async handleCustomerUpdated(customer) {
            const billing = await this.billingRepository.findOne({
                where: { stripeCustomerId: customer.id },
            });
            if (!billing) {
                this.logger.warn(`Billing record not found for customer: ${customer.id}`);
                return;
            }
            // Update billing record if needed
            // Currently just logging, but can store additional customer info if needed
            this.logger.log(`Customer updated: ${customer.id}`);
        }
        /**
         * Retrieve customer from Stripe
         */
        async getStripeCustomer(customerId) {
            // This would call Stripe API in a real implementation
            // For now, just return null as we're not calling Stripe directly
            this.logger.log(`Getting customer: ${customerId}`);
            return null;
        }
        /**
         * Retrieve subscription from Stripe
         */
        async getStripeSubscription(subscriptionId) {
            // This would call Stripe API in a real implementation
            // For now, just return null as we're not calling Stripe directly
            this.logger.log(`Getting subscription: ${subscriptionId}`);
            return null;
        }
        /**
         * Update billing status
         */
        async updateBillingStatus(billingId, status) {
            const billing = await this.billingRepository.findOne({
                where: { id: billingId },
            });
            if (!billing) {
                throw new common_1.BadRequestException(`Billing record not found: ${billingId}`);
            }
            billing.status = status;
            return this.billingRepository.save(billing);
        }
        /**
         * Get billing record by institute
         */
        async getBillingByInstitute(instituteId) {
            return this.billingRepository.findOne({
                where: { instituteId },
                relations: ['institute'],
            });
        }
        /**
         * Create billing record for institute
         */
        async createBillingRecord(instituteId, stripeCustomerId) {
            const billing = this.billingRepository.create({
                instituteId,
                stripeCustomerId,
                status: 'active',
                currency: 'USD',
                invoices: [],
            });
            return this.billingRepository.save(billing);
        }
        /**
         * Retry failed payment
         */
        async retryFailedPayment(billingId) {
            const billing = await this.billingRepository.findOne({
                where: { id: billingId },
            });
            if (!billing) {
                throw new common_1.BadRequestException(`Billing record not found: ${billingId}`);
            }
            if (billing.status !== 'past_due') {
                throw new common_1.BadRequestException(`Cannot retry payment: billing status is ${billing.status}`);
            }
            // In a real implementation, this would trigger Stripe API call
            // For now, just log the action
            this.logger.log(`Retrying failed payment for billing ID: ${billingId}`);
        }
        /**
         * Cancel subscription
         */
        async cancelSubscription(billingId) {
            const billing = await this.billingRepository.findOne({
                where: { id: billingId },
            });
            if (!billing) {
                throw new common_1.BadRequestException(`Billing record not found: ${billingId}`);
            }
            if (!billing.subscriptionId) {
                throw new common_1.BadRequestException(`No active subscription found for billing ID: ${billingId}`);
            }
            // In a real implementation, this would trigger Stripe API call
            // For now, just log the action
            this.logger.log(`Canceling subscription ${billing.subscriptionId} for billing ID: ${billingId}`);
        }
    };
    return StripeService = _classThis;
})();
exports.StripeService = StripeService;
