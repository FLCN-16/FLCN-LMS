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
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const api_keys_module_1 = require("../api-keys/api-keys.module");
const institute_billing_entity_1 = require("../master-entities/institute-billing.entity");
const invoice_entity_1 = require("../master-entities/invoice.entity");
const rate_limiting_module_1 = require("../rate-limiting/rate-limiting.module");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
const invoice_controller_1 = require("./invoice.controller");
const invoice_service_1 = require("./invoice.service");
const stripe_webhook_controller_1 = require("./stripe-webhook.controller");
const stripe_service_1 = require("./stripe.service");
/**
 * Billing Module
 *
 * Handles subscription management, payments, invoices, and billing records
 * Integrates with Stripe for payment processing and webhook handling
 *
 * Controllers:
 * - BillingController - API endpoints for billing and subscription operations
 * - InvoiceController - API endpoints for invoice management
 * - StripeWebhookController - Webhook endpoint for Stripe events
 *
 * Services:
 * - BillingService - CRUD operations for billing records
 * - InvoiceService - Invoice management and generation
 * - StripeService - Stripe integration and webhook event handling
 */
let BillingModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([institute_billing_entity_1.InstituteBilling, invoice_entity_1.Invoice], 'master'),
                api_keys_module_1.ApiKeysModule,
                rate_limiting_module_1.RateLimitingModule,
            ],
            controllers: [billing_controller_1.BillingController, invoice_controller_1.InvoiceController, stripe_webhook_controller_1.StripeWebhookController],
            providers: [billing_service_1.BillingService, invoice_service_1.InvoiceService, stripe_service_1.StripeService],
            exports: [billing_service_1.BillingService, invoice_service_1.InvoiceService, stripe_service_1.StripeService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BillingModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BillingModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return BillingModule = _classThis;
})();
exports.BillingModule = BillingModule;
