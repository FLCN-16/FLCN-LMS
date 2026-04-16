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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const required_scopes_decorator_1 = require("../api-keys/decorators/required-scopes.decorator");
const api_key_guard_1 = require("../api-keys/guards/api-key.guard");
const rate_limit_decorator_1 = require("../rate-limiting/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../rate-limiting/guards/rate-limit.guard");
let BillingController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        }), (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, rate_limit_guard_1.RateLimitGuard), (0, rate_limit_decorator_1.RateLimitApiKey)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _listAllBilling_decorators;
    let _getBillingByInstitute_decorators;
    let _createBilling_decorators;
    let _updateBilling_decorators;
    let _getSubscriptionDetails_decorators;
    let _getInvoices_decorators;
    let _retryFailedPayment_decorators;
    let _cancelSubscription_decorators;
    let _updateBillingStatus_decorators;
    var BillingController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _listAllBilling_decorators = [(0, common_1.Get)(), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getBillingByInstitute_decorators = [(0, common_1.Get)(':instituteId'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _createBilling_decorators = [(0, common_1.Post)(), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
            _updateBilling_decorators = [(0, common_1.Put)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getSubscriptionDetails_decorators = [(0, common_1.Get)(':id/subscription'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getInvoices_decorators = [(0, common_1.Get)(':id/invoices'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _retryFailedPayment_decorators = [(0, common_1.Post)(':id/retry-payment'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _cancelSubscription_decorators = [(0, common_1.Post)(':id/cancel-subscription'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _updateBillingStatus_decorators = [(0, common_1.Post)(':id/status'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _listAllBilling_decorators, { kind: "method", name: "listAllBilling", static: false, private: false, access: { has: obj => "listAllBilling" in obj, get: obj => obj.listAllBilling }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getBillingByInstitute_decorators, { kind: "method", name: "getBillingByInstitute", static: false, private: false, access: { has: obj => "getBillingByInstitute" in obj, get: obj => obj.getBillingByInstitute }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createBilling_decorators, { kind: "method", name: "createBilling", static: false, private: false, access: { has: obj => "createBilling" in obj, get: obj => obj.createBilling }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateBilling_decorators, { kind: "method", name: "updateBilling", static: false, private: false, access: { has: obj => "updateBilling" in obj, get: obj => obj.updateBilling }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getSubscriptionDetails_decorators, { kind: "method", name: "getSubscriptionDetails", static: false, private: false, access: { has: obj => "getSubscriptionDetails" in obj, get: obj => obj.getSubscriptionDetails }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoices_decorators, { kind: "method", name: "getInvoices", static: false, private: false, access: { has: obj => "getInvoices" in obj, get: obj => obj.getInvoices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _retryFailedPayment_decorators, { kind: "method", name: "retryFailedPayment", static: false, private: false, access: { has: obj => "retryFailedPayment" in obj, get: obj => obj.retryFailedPayment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelSubscription_decorators, { kind: "method", name: "cancelSubscription", static: false, private: false, access: { has: obj => "cancelSubscription" in obj, get: obj => obj.cancelSubscription }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateBillingStatus_decorators, { kind: "method", name: "updateBillingStatus", static: false, private: false, access: { has: obj => "updateBillingStatus" in obj, get: obj => obj.updateBillingStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BillingController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        billingService = __runInitializers(this, _instanceExtraInitializers);
        stripeService;
        constructor(billingService, stripeService) {
            this.billingService = billingService;
            this.stripeService = stripeService;
        }
        /**
         * List all billing records
         * GET /api/v1/billing
         */
        async listAllBilling() {
            return this.billingService.findAll();
        }
        /**
         * Get billing record for a specific institute
         * GET /api/v1/billing/:instituteId
         */
        async getBillingByInstitute(instituteId) {
            return this.billingService.findByInstitute(instituteId);
        }
        /**
         * Create a new billing record
         * POST /api/v1/billing
         * Body: { instituteId, stripeCustomerId?, plan? }
         */
        async createBilling(dto) {
            const existing = await this.stripeService.getBillingByInstitute(dto.instituteId);
            if (existing) {
                throw new common_1.BadRequestException(`Billing record already exists for institute: ${dto.instituteId}`);
            }
            return this.billingService.create(dto);
        }
        /**
         * Update a billing record
         * PUT /api/v1/billing/:id
         */
        async updateBilling(id, dto) {
            return this.billingService.update(id, dto);
        }
        /**
         * Get subscription details for a billing record
         * GET /api/v1/billing/:id/subscription
         */
        async getSubscriptionDetails(id) {
            const billing = await this.billingService.findByInstitute(id);
            if (!billing) {
                throw new common_1.NotFoundException(`Billing record not found: ${id}`);
            }
            return {
                billingId: billing.id,
                subscriptionId: billing.subscriptionId,
                status: billing.status,
                plan: billing.plan,
                currentPeriodStart: billing.currentPeriodStart,
                currentPeriodEnd: billing.currentPeriodEnd,
                nextBillingDate: billing.nextBillingDate,
                amountDue: billing.amountDue,
                currency: billing.currency,
            };
        }
        /**
         * Get invoice history for a billing record
         * GET /api/v1/billing/:id/invoices
         */
        async getInvoices(id) {
            const billing = await this.billingService.findByInstitute(id);
            if (!billing) {
                throw new common_1.NotFoundException(`Billing record not found: ${id}`);
            }
            return {
                billingId: billing.id,
                invoices: billing.invoices || [],
                total: (billing.invoices || []).length,
            };
        }
        /**
         * Retry a failed payment
         * POST /api/v1/billing/:id/retry-payment
         */
        async retryFailedPayment(id) {
            await this.stripeService.retryFailedPayment(id);
            return {
                success: true,
                message: 'Payment retry initiated',
                billingId: id,
            };
        }
        /**
         * Cancel a subscription
         * POST /api/v1/billing/:id/cancel-subscription
         */
        async cancelSubscription(id) {
            await this.stripeService.cancelSubscription(id);
            return {
                success: true,
                message: 'Subscription cancellation initiated',
                billingId: id,
            };
        }
        /**
         * Update billing status
         * POST /api/v1/billing/:id/status
         * Body: { status: 'active' | 'past_due' | 'unpaid' | 'canceled' }
         */
        async updateBillingStatus(id, status) {
            const validStatuses = ['active', 'past_due', 'unpaid', 'canceled'];
            if (!validStatuses.includes(status)) {
                throw new common_1.BadRequestException(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
            }
            return this.stripeService.updateBillingStatus(id, status);
        }
    };
    return BillingController = _classThis;
})();
exports.BillingController = BillingController;
