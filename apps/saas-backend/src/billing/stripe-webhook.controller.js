"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
let StripeWebhookController = (() => {
    let _classDecorators = [(0, common_1.Controller)('webhooks')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _handleStripeWebhook_decorators;
    var StripeWebhookController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleStripeWebhook_decorators = [(0, common_1.Post)('stripe'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _handleStripeWebhook_decorators, { kind: "method", name: "handleStripeWebhook", static: false, private: false, access: { has: obj => "handleStripeWebhook" in obj, get: obj => obj.handleStripeWebhook }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StripeWebhookController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        stripeService = __runInitializers(this, _instanceExtraInitializers);
        logger = new common_1.Logger(StripeWebhookController.name);
        constructor(stripeService) {
            this.stripeService = stripeService;
        }
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
        async handleStripeWebhook(req, signature) {
            if (!signature) {
                this.logger.error('Missing Stripe signature header');
                return { received: false };
            }
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!webhookSecret) {
                this.logger.error('STRIPE_WEBHOOK_SECRET environment variable not configured');
                return { received: false };
            }
            try {
                // Get raw body for signature verification
                const rawBody = req.rawBody || Buffer.from('');
                const body = typeof rawBody === 'string' ? rawBody : rawBody.toString();
                // Verify Stripe webhook signature
                const isValid = this.verifyStripeSignature(body, signature, webhookSecret);
                if (!isValid) {
                    this.logger.error('Invalid Stripe webhook signature - rejecting event');
                    return { received: false };
                }
                // Parse event from body
                const event = JSON.parse(body);
                this.logger.log(`Received Stripe webhook event: ${event.type} (ID: ${event.id})`);
                // Delegate event handling to service
                await this.stripeService.handleWebhookEvent(event);
                this.logger.log(`Successfully processed Stripe event: ${event.type}`);
                return { received: true };
            }
            catch (error) {
                this.logger.error('Error processing Stripe webhook:', error);
                throw new common_1.InternalServerErrorException('Failed to process Stripe webhook. Stripe will retry.');
            }
        }
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
        verifyStripeSignature(body, signature, secret) {
            try {
                const crypto = require('crypto');
                // Parse signature header: t=timestamp,v1=sig1,v1=sig2
                const elements = signature.split(',');
                let timestamp = null;
                const signatures = [];
                for (const element of elements) {
                    const [key, value] = element.split('=');
                    if (key?.trim() === 't') {
                        timestamp = value?.trim();
                    }
                    else if (key?.trim() === 'v1') {
                        signatures.push(value?.trim());
                    }
                }
                if (!timestamp) {
                    this.logger.warn('Missing timestamp in Stripe signature header');
                    return false;
                }
                // Validate timestamp is recent (within 5 minutes)
                // Prevents replay attacks
                const now = Math.floor(Date.now() / 1000);
                const eventTime = parseInt(timestamp, 10);
                const timeDiff = Math.abs(now - eventTime);
                if (timeDiff > 300) {
                    this.logger.warn(`Stripe webhook timestamp too old: ${timeDiff} seconds ago`);
                    return false;
                }
                // Compute expected signature
                // Stripe signs: timestamp.body using HMAC-SHA256 with webhook secret
                const signedContent = `${timestamp}.${body}`;
                const computedSignature = crypto
                    .createHmac('sha256', secret)
                    .update(signedContent)
                    .digest('hex');
                // Check if computed signature matches any in the header (Stripe sends multiple for rotation)
                let isValid = false;
                for (const sig of signatures) {
                    if (sig &&
                        crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(computedSignature, 'hex'))) {
                        isValid = true;
                        break;
                    }
                }
                if (!isValid) {
                    this.logger.warn('Stripe webhook signature verification failed - signature mismatch');
                }
                return isValid;
            }
            catch (error) {
                this.logger.error('Error verifying Stripe webhook signature:', error);
                return false;
            }
        }
    };
    return StripeWebhookController = _classThis;
})();
exports.StripeWebhookController = StripeWebhookController;
