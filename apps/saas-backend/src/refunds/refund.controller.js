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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const required_scopes_decorator_1 = require("../api-keys/decorators/required-scopes.decorator");
const rate_limit_guard_1 = require("../rate-limiting/guards/rate-limit.guard");
let RefundController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        }), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rate_limit_guard_1.RateLimitGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRefund_decorators;
    let _getRefund_decorators;
    let _getRefundsByInvoice_decorators;
    let _getRefundsByStatus_decorators;
    let _listRefunds_decorators;
    let _processRefund_decorators;
    let _approveRefund_decorators;
    let _retryRefund_decorators;
    let _rejectRefund_decorators;
    let _cancelRefund_decorators;
    let _getRefundStats_decorators;
    let _getPendingRefunds_decorators;
    let _getRefundsReadyForRetry_decorators;
    let _processPendingRefunds_decorators;
    let _retryFailedRefunds_decorators;
    let _getTotalRefundedAmount_decorators;
    let _canFullyRefund_decorators;
    let _getRemainingRefundableAmount_decorators;
    var RefundController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createRefund_decorators = [(0, common_1.Post)(), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
            _getRefund_decorators = [(0, common_1.Get)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRefundsByInvoice_decorators = [(0, common_1.Get)('invoice/:invoiceId'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRefundsByStatus_decorators = [(0, common_1.Get)('status/:status'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _listRefunds_decorators = [(0, common_1.Get)(), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _processRefund_decorators = [(0, common_1.Post)(':id/process'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _approveRefund_decorators = [(0, common_1.Post)(':id/approve'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _retryRefund_decorators = [(0, common_1.Post)(':id/retry'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _rejectRefund_decorators = [(0, common_1.Post)(':id/reject'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _cancelRefund_decorators = [(0, common_1.Delete)(':id'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRefundStats_decorators = [(0, common_1.Get)('stats/summary'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getPendingRefunds_decorators = [(0, common_1.Get)('pending/list'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRefundsReadyForRetry_decorators = [(0, common_1.Get)('ready-retry/list'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _processPendingRefunds_decorators = [(0, common_1.Post)('batch/process'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _retryFailedRefunds_decorators = [(0, common_1.Post)('batch/retry'), (0, required_scopes_decorator_1.RequiredScopes)('write:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getTotalRefundedAmount_decorators = [(0, common_1.Get)('invoice/:invoiceId/total-refunded'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _canFullyRefund_decorators = [(0, common_1.Get)('invoice/:invoiceId/can-refund'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getRemainingRefundableAmount_decorators = [(0, common_1.Get)('invoice/:invoiceId/remaining-refundable'), (0, required_scopes_decorator_1.RequiredScopes)('read:customers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _createRefund_decorators, { kind: "method", name: "createRefund", static: false, private: false, access: { has: obj => "createRefund" in obj, get: obj => obj.createRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRefund_decorators, { kind: "method", name: "getRefund", static: false, private: false, access: { has: obj => "getRefund" in obj, get: obj => obj.getRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRefundsByInvoice_decorators, { kind: "method", name: "getRefundsByInvoice", static: false, private: false, access: { has: obj => "getRefundsByInvoice" in obj, get: obj => obj.getRefundsByInvoice }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRefundsByStatus_decorators, { kind: "method", name: "getRefundsByStatus", static: false, private: false, access: { has: obj => "getRefundsByStatus" in obj, get: obj => obj.getRefundsByStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listRefunds_decorators, { kind: "method", name: "listRefunds", static: false, private: false, access: { has: obj => "listRefunds" in obj, get: obj => obj.listRefunds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _processRefund_decorators, { kind: "method", name: "processRefund", static: false, private: false, access: { has: obj => "processRefund" in obj, get: obj => obj.processRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _approveRefund_decorators, { kind: "method", name: "approveRefund", static: false, private: false, access: { has: obj => "approveRefund" in obj, get: obj => obj.approveRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _retryRefund_decorators, { kind: "method", name: "retryRefund", static: false, private: false, access: { has: obj => "retryRefund" in obj, get: obj => obj.retryRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _rejectRefund_decorators, { kind: "method", name: "rejectRefund", static: false, private: false, access: { has: obj => "rejectRefund" in obj, get: obj => obj.rejectRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelRefund_decorators, { kind: "method", name: "cancelRefund", static: false, private: false, access: { has: obj => "cancelRefund" in obj, get: obj => obj.cancelRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRefundStats_decorators, { kind: "method", name: "getRefundStats", static: false, private: false, access: { has: obj => "getRefundStats" in obj, get: obj => obj.getRefundStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getPendingRefunds_decorators, { kind: "method", name: "getPendingRefunds", static: false, private: false, access: { has: obj => "getPendingRefunds" in obj, get: obj => obj.getPendingRefunds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRefundsReadyForRetry_decorators, { kind: "method", name: "getRefundsReadyForRetry", static: false, private: false, access: { has: obj => "getRefundsReadyForRetry" in obj, get: obj => obj.getRefundsReadyForRetry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _processPendingRefunds_decorators, { kind: "method", name: "processPendingRefunds", static: false, private: false, access: { has: obj => "processPendingRefunds" in obj, get: obj => obj.processPendingRefunds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _retryFailedRefunds_decorators, { kind: "method", name: "retryFailedRefunds", static: false, private: false, access: { has: obj => "retryFailedRefunds" in obj, get: obj => obj.retryFailedRefunds }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getTotalRefundedAmount_decorators, { kind: "method", name: "getTotalRefundedAmount", static: false, private: false, access: { has: obj => "getTotalRefundedAmount" in obj, get: obj => obj.getTotalRefundedAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _canFullyRefund_decorators, { kind: "method", name: "canFullyRefund", static: false, private: false, access: { has: obj => "canFullyRefund" in obj, get: obj => obj.canFullyRefund }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getRemainingRefundableAmount_decorators, { kind: "method", name: "getRemainingRefundableAmount", static: false, private: false, access: { has: obj => "getRemainingRefundableAmount" in obj, get: obj => obj.getRemainingRefundableAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RefundController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        refundService = __runInitializers(this, _instanceExtraInitializers);
        constructor(refundService) {
            this.refundService = refundService;
        }
        /**
         * Create a new refund request
         * POST /api/v1/refunds
         *
         * Requires: write:customers scope
         * The initiatedBy field is automatically populated from the authenticated user
         *
         * Request body:
         * - invoiceId: UUID of the invoice to refund
         * - amount: Refund amount (same currency as invoice)
         * - reason: Reason for the refund (customer_request, duplicate_charge, etc.)
         * - refundMethod: Payment method for refund (optional, defaults to original_payment_method)
         * - notes: Additional notes about the refund (optional)
         * - type: Either 'full' or 'partial' (optional, defaults to 'full')
         *
         * Returns: Created refund details
         */
        async createRefund(dto, initiatedBy) {
            if (!initiatedBy) {
                throw new common_1.BadRequestException('User authentication is required to initiate a refund');
            }
            return this.refundService.createRefund({
                ...dto,
                initiatedBy,
            });
        }
        /**
         * Get refund by ID
         * GET /api/v1/refunds/:id
         *
         * Requires: read:customers scope
         */
        async getRefund(id) {
            return this.refundService.getRefundById(id);
        }
        /**
         * Get refunds for an invoice with pagination
         * GET /api/v1/refunds/invoice/:invoiceId
         *
         * Query parameters:
         * - page: Page number (default: 1)
         * - limit: Items per page (default: 10, max: 100)
         */
        async getRefundsByInvoice(invoiceId, page, limit) {
            const pageNum = page ? parseInt(page, 10) : 1;
            const limitNum = limit ? parseInt(limit, 10) : 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.BadRequestException('Invalid pagination parameters');
            }
            return this.refundService.getRefundsByInvoice(invoiceId, pageNum, limitNum);
        }
        /**
         * Get refunds by status
         * GET /api/v1/refunds/status/:status
         *
         * Path parameters:
         * - status: One of pending, processing, completed, failed, rejected
         */
        async getRefundsByStatus(status) {
            const validStatuses = [
                'pending',
                'processing',
                'completed',
                'failed',
                'rejected',
            ];
            if (!validStatuses.includes(status)) {
                throw new common_1.BadRequestException(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
            }
            return this.refundService.getRefundsByStatus(status);
        }
        /**
         * List all refunds with optional filtering
         * GET /api/v1/refunds
         *
         * Query parameters:
         * - page: Page number (default: 1)
         * - limit: Items per page (default: 10, max: 100)
         * - status: Filter by refund status (optional)
         */
        async listRefunds(page, limit, status) {
            const pageNum = page ? parseInt(page, 10) : 1;
            const limitNum = limit ? parseInt(limit, 10) : 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.BadRequestException('Invalid pagination parameters');
            }
            return this.refundService.getAllRefunds(pageNum, limitNum, status);
        }
        /**
         * Process a refund (transition to processing/completed state)
         * POST /api/v1/refunds/:id/process
         *
         * Path parameters:
         * - id: Refund ID
         *
         * Requires: write:customers scope
         */
        async processRefund(id) {
            return this.refundService.processRefund(id);
        }
        /**
         * Approve and process a pending refund
         * POST /api/v1/refunds/:id/approve
         *
         * Path parameters:
         * - id: Refund ID
         *
         * Requires: write:customers scope
         */
        async approveRefund(id) {
            return this.refundService.approveRefund(id);
        }
        /**
         * Retry a failed refund
         * POST /api/v1/refunds/:id/retry
         *
         * Path parameters:
         * - id: Refund ID
         *
         * Requires: write:customers scope
         * Only failed refunds with retry attempts remaining can be retried
         */
        async retryRefund(id) {
            return this.refundService.retryRefund(id);
        }
        /**
         * Reject a refund
         * POST /api/v1/refunds/:id/reject
         *
         * Path parameters:
         * - id: Refund ID
         *
         * Request body:
         * - reason: Rejection reason (required)
         *
         * Requires: write:customers scope
         */
        async rejectRefund(id, reason) {
            if (!reason) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            return this.refundService.rejectRefund(id, reason);
        }
        /**
         * Cancel a pending refund
         * DELETE /api/v1/refunds/:id
         *
         * Path parameters:
         * - id: Refund ID
         *
         * Requires: write:customers scope
         * Only pending refunds can be cancelled
         */
        async cancelRefund(id) {
            return this.refundService.cancelRefund(id);
        }
        /**
         * Get refund statistics
         * GET /api/v1/refunds/stats/summary
         *
         * Requires: read:customers scope
         * Returns aggregate refund metrics
         */
        async getRefundStats() {
            return this.refundService.getRefundStats();
        }
        /**
         * Get pending refunds ready for batch processing
         * GET /api/v1/refunds/pending/list
         *
         * Requires: read:customers scope
         */
        async getPendingRefunds() {
            return this.refundService.getPendingRefunds();
        }
        /**
         * Get refunds ready for retry
         * GET /api/v1/refunds/ready-retry/list
         *
         * Requires: read:customers scope
         * Returns failed refunds that have retry attempts remaining and are past nextRetryAt
         */
        async getRefundsReadyForRetry() {
            return this.refundService.getRefundsReadyForRetry();
        }
        /**
         * Process all pending refunds in batch
         * POST /api/v1/refunds/batch/process
         *
         * Requires: write:customers scope
         * Attempts to process all pending refunds and returns summary
         */
        async processPendingRefunds() {
            return this.refundService.processPendingRefunds();
        }
        /**
         * Retry all failed refunds in batch
         * POST /api/v1/refunds/batch/retry
         *
         * Requires: write:customers scope
         * Attempts to retry all failed refunds that are ready and returns summary
         */
        async retryFailedRefunds() {
            return this.refundService.retryFailedRefunds();
        }
        /**
         * Get total refunded amount for an invoice
         * GET /api/v1/refunds/invoice/:invoiceId/total-refunded
         *
         * Path parameters:
         * - invoiceId: Invoice UUID
         *
         * Requires: read:customers scope
         * Returns the sum of all completed refunds for the invoice
         */
        async getTotalRefundedAmount(invoiceId) {
            const amount = await this.refundService.getTotalRefundedAmount(invoiceId);
            return { invoiceId, totalRefunded: amount };
        }
        /**
         * Check if invoice can be fully refunded
         * GET /api/v1/refunds/invoice/:invoiceId/can-refund
         *
         * Path parameters:
         * - invoiceId: Invoice UUID
         *
         * Requires: read:customers scope
         */
        async canFullyRefund(invoiceId) {
            const canRefund = await this.refundService.canFullyRefund(invoiceId);
            const remaining = await this.refundService.getRemainingRefundableAmount(invoiceId);
            return { invoiceId, canRefund, remainingRefundable: remaining };
        }
        /**
         * Get remaining refundable amount for an invoice
         * GET /api/v1/refunds/invoice/:invoiceId/remaining-refundable
         *
         * Path parameters:
         * - invoiceId: Invoice UUID
         *
         * Requires: read:customers scope
         */
        async getRemainingRefundableAmount(invoiceId) {
            const amount = await this.refundService.getRemainingRefundableAmount(invoiceId);
            return { invoiceId, remainingRefundable: amount };
        }
    };
    return RefundController = _classThis;
})();
exports.RefundController = RefundController;
