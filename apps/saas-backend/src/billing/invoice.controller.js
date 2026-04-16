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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const required_scopes_decorator_1 = require("../api-keys/decorators/required-scopes.decorator");
const api_key_guard_1 = require("../api-keys/guards/api-key.guard");
const rate_limit_decorator_1 = require("../rate-limiting/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../rate-limiting/guards/rate-limit.guard");
let InvoiceController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        }), (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, rate_limit_guard_1.RateLimitGuard), (0, rate_limit_decorator_1.RateLimitApiKey)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createInvoice_decorators;
    let _getInvoice_decorators;
    let _getInvoicesByBilling_decorators;
    let _listInvoices_decorators;
    let _updateInvoice_decorators;
    let _markAsPaid_decorators;
    let _recordPayment_decorators;
    let _markAsSent_decorators;
    let _cancelInvoice_decorators;
    let _deleteInvoice_decorators;
    let _getInvoiceStats_decorators;
    let _getUnpaidInvoices_decorators;
    let _getInvoicesByStatus_decorators;
    let _getOverdueInvoices_decorators;
    let _getRevenueByPeriod_decorators;
    var InvoiceController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createInvoice_decorators = [(0, common_1.Post)(), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
            _getInvoice_decorators = [(0, common_1.Get)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getInvoicesByBilling_decorators = [(0, common_1.Get)('billing/:billingId'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _listInvoices_decorators = [(0, common_1.Get)(), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _updateInvoice_decorators = [(0, common_1.Put)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _markAsPaid_decorators = [(0, common_1.Post)(':id/mark-paid'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _recordPayment_decorators = [(0, common_1.Post)(':id/record-payment'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _markAsSent_decorators = [(0, common_1.Post)(':id/mark-sent'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _cancelInvoice_decorators = [(0, common_1.Post)(':id/cancel'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _deleteInvoice_decorators = [(0, common_1.Delete)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
            _getInvoiceStats_decorators = [(0, common_1.Get)(':billingId/stats'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getUnpaidInvoices_decorators = [(0, common_1.Get)(':billingId/unpaid'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getInvoicesByStatus_decorators = [(0, common_1.Get)('status/:status'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getOverdueInvoices_decorators = [(0, common_1.Get)('overdue/list'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRevenueByPeriod_decorators = [(0, common_1.Get)('revenue/period'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _createInvoice_decorators, { kind: "method", name: "createInvoice", static: false, private: false, access: { has: obj => "createInvoice" in obj, get: obj => obj.createInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoice_decorators, { kind: "method", name: "getInvoice", static: false, private: false, access: { has: obj => "getInvoice" in obj, get: obj => obj.getInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoicesByBilling_decorators, { kind: "method", name: "getInvoicesByBilling", static: false, private: false, access: { has: obj => "getInvoicesByBilling" in obj, get: obj => obj.getInvoicesByBilling }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listInvoices_decorators, { kind: "method", name: "listInvoices", static: false, private: false, access: { has: obj => "listInvoices" in obj, get: obj => obj.listInvoices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateInvoice_decorators, { kind: "method", name: "updateInvoice", static: false, private: false, access: { has: obj => "updateInvoice" in obj, get: obj => obj.updateInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _markAsPaid_decorators, { kind: "method", name: "markAsPaid", static: false, private: false, access: { has: obj => "markAsPaid" in obj, get: obj => obj.markAsPaid }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _recordPayment_decorators, { kind: "method", name: "recordPayment", static: false, private: false, access: { has: obj => "recordPayment" in obj, get: obj => obj.recordPayment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _markAsSent_decorators, { kind: "method", name: "markAsSent", static: false, private: false, access: { has: obj => "markAsSent" in obj, get: obj => obj.markAsSent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelInvoice_decorators, { kind: "method", name: "cancelInvoice", static: false, private: false, access: { has: obj => "cancelInvoice" in obj, get: obj => obj.cancelInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteInvoice_decorators, { kind: "method", name: "deleteInvoice", static: false, private: false, access: { has: obj => "deleteInvoice" in obj, get: obj => obj.deleteInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoiceStats_decorators, { kind: "method", name: "getInvoiceStats", static: false, private: false, access: { has: obj => "getInvoiceStats" in obj, get: obj => obj.getInvoiceStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getUnpaidInvoices_decorators, { kind: "method", name: "getUnpaidInvoices", static: false, private: false, access: { has: obj => "getUnpaidInvoices" in obj, get: obj => obj.getUnpaidInvoices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getInvoicesByStatus_decorators, { kind: "method", name: "getInvoicesByStatus", static: false, private: false, access: { has: obj => "getInvoicesByStatus" in obj, get: obj => obj.getInvoicesByStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getOverdueInvoices_decorators, { kind: "method", name: "getOverdueInvoices", static: false, private: false, access: { has: obj => "getOverdueInvoices" in obj, get: obj => obj.getOverdueInvoices }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRevenueByPeriod_decorators, { kind: "method", name: "getRevenueByPeriod", static: false, private: false, access: { has: obj => "getRevenueByPeriod" in obj, get: obj => obj.getRevenueByPeriod }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InvoiceController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        invoiceService = __runInitializers(this, _instanceExtraInitializers);
        constructor(invoiceService) {
            this.invoiceService = invoiceService;
        }
        /**
         * Create a new invoice
         * POST /api/v1/invoices
         */
        async createInvoice(dto) {
            return this.invoiceService.createInvoice(dto);
        }
        /**
         * Get invoice by ID
         * GET /api/v1/invoices/:id
         */
        async getInvoice(id) {
            return this.invoiceService.getInvoiceById(id);
        }
        /**
         * Get all invoices for a billing record
         * GET /api/v1/invoices/billing/:billingId
         */
        async getInvoicesByBilling(billingId, page, limit) {
            const pageNum = page ? parseInt(page, 10) : 1;
            const limitNum = limit ? parseInt(limit, 10) : 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.BadRequestException('Invalid pagination parameters');
            }
            return this.invoiceService.getInvoicesByBilling(billingId, pageNum, limitNum);
        }
        /**
         * List all invoices with optional filtering
         * GET /api/v1/invoices
         */
        async listInvoices(page, limit, status) {
            const pageNum = page ? parseInt(page, 10) : 1;
            const limitNum = limit ? parseInt(limit, 10) : 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.BadRequestException('Invalid pagination parameters');
            }
            return this.invoiceService.getAllInvoices(pageNum, limitNum, status);
        }
        /**
         * Update an invoice
         * PUT /api/v1/invoices/:id
         */
        async updateInvoice(id, dto) {
            return this.invoiceService.updateInvoice(id, dto);
        }
        /**
         * Mark invoice as paid
         * POST /api/v1/invoices/:id/mark-paid
         */
        async markAsPaid(id, receiptId) {
            return this.invoiceService.markAsPaid(id, new Date(), receiptId);
        }
        /**
         * Record partial payment on invoice
         * POST /api/v1/invoices/:id/record-payment
         */
        async recordPayment(id, amount, receiptId) {
            if (!amount || amount <= 0) {
                throw new common_1.BadRequestException('Amount must be greater than 0');
            }
            return this.invoiceService.recordPartialPayment(id, amount, receiptId);
        }
        /**
         * Mark invoice as sent
         * POST /api/v1/invoices/:id/mark-sent
         */
        async markAsSent(id) {
            return this.invoiceService.markAsSent(id);
        }
        /**
         * Cancel/void an invoice
         * POST /api/v1/invoices/:id/cancel
         */
        async cancelInvoice(id) {
            return this.invoiceService.cancelInvoice(id);
        }
        /**
         * Delete an invoice
         * DELETE /api/v1/invoices/:id
         */
        async deleteInvoice(id) {
            return this.invoiceService.deleteInvoice(id);
        }
        /**
         * Get invoice statistics for a billing record
         * GET /api/v1/invoices/:billingId/stats
         */
        async getInvoiceStats(billingId) {
            return this.invoiceService.getInvoiceStats(billingId);
        }
        /**
         * Get unpaid invoices for a billing record
         * GET /api/v1/invoices/:billingId/unpaid
         */
        async getUnpaidInvoices(billingId) {
            return this.invoiceService.getUnpaidInvoicesByBilling(billingId);
        }
        /**
         * Get invoices by status
         * GET /api/v1/invoices/status/:status
         */
        async getInvoicesByStatus(status) {
            const validStatuses = ['draft', 'open', 'paid', 'uncollectible', 'void'];
            if (!validStatuses.includes(status)) {
                throw new common_1.BadRequestException(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
            }
            return this.invoiceService.getInvoicesByStatus(status);
        }
        /**
         * Get overdue invoices
         * GET /api/v1/invoices/overdue
         */
        async getOverdueInvoices() {
            return this.invoiceService.getOverdueInvoices();
        }
        /**
         * Get revenue for a period
         * GET /api/v1/invoices/revenue?startDate=2024-01-01&endDate=2024-12-31
         */
        async getRevenueByPeriod(startDateStr, endDateStr) {
            if (!startDateStr || !endDateStr) {
                throw new common_1.BadRequestException('startDate and endDate query parameters are required');
            }
            try {
                const startDate = new Date(startDateStr);
                const endDate = new Date(endDateStr);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new common_1.BadRequestException('Invalid date format');
                }
                if (startDate > endDate) {
                    throw new common_1.BadRequestException('startDate must be before endDate');
                }
                return this.invoiceService.getRevenueByPeriod(startDate, endDate);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                throw new common_1.BadRequestException('Invalid date parameters');
            }
        }
    };
    return InvoiceController = _classThis;
})();
exports.InvoiceController = InvoiceController;
