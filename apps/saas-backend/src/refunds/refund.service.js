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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
let RefundService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RefundService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RefundService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        refundRepository;
        invoiceRepository;
        logger = new common_1.Logger(RefundService.name);
        constructor(refundRepository, invoiceRepository) {
            this.refundRepository = refundRepository;
            this.invoiceRepository = invoiceRepository;
        }
        /**
         * Create a new refund request
         */
        async createRefund(dto) {
            const invoice = await this.invoiceRepository.findOne({
                where: { id: dto.invoiceId },
            });
            if (!invoice) {
                throw new common_1.NotFoundException(`Invoice not found: ${dto.invoiceId}`);
            }
            if (invoice.status === 'void') {
                throw new common_1.BadRequestException('Cannot refund a cancelled invoice');
            }
            const refundType = dto.type || 'full';
            const maxRefundAmount = Number(invoice.amountPaid);
            if (dto.amount <= 0) {
                throw new common_1.BadRequestException('Refund amount must be greater than 0');
            }
            if (dto.amount > maxRefundAmount) {
                throw new common_1.BadRequestException(`Refund amount cannot exceed paid amount: ${maxRefundAmount}`);
            }
            const refund = this.refundRepository.create({
                invoiceId: dto.invoiceId,
                amount: dto.amount,
                reason: dto.reason,
                type: refundType,
                status: 'pending',
                refundMethod: dto.refundMethod || 'original_payment_method',
                notes: dto.notes,
                initiatedBy: dto.initiatedBy,
                retryCount: 0,
                maxRetries: 3,
            });
            const saved = await this.refundRepository.save(refund);
            this.logger.log(`Refund created: ${saved.id} for invoice: ${dto.invoiceId}, amount: ${dto.amount}`);
            return saved;
        }
        /**
         * Get refund by ID
         */
        async getRefundById(id) {
            const refund = await this.refundRepository.findOne({
                where: { id },
                relations: ['invoice'],
            });
            if (!refund) {
                throw new common_1.NotFoundException(`Refund not found: ${id}`);
            }
            return refund;
        }
        /**
         * Get all refunds for an invoice
         */
        async getRefundsByInvoice(invoiceId, page = 1, limit = 10) {
            const [refunds, total] = await this.refundRepository.findAndCount({
                where: { invoiceId },
                relations: ['invoice'],
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { data: refunds, total };
        }
        /**
         * Get refunds by status
         */
        async getRefundsByStatus(status) {
            return this.refundRepository.find({
                where: { status },
                relations: ['invoice'],
                order: { createdAt: 'DESC' },
            });
        }
        /**
         * Get all refunds with pagination
         */
        async getAllRefunds(page = 1, limit = 10, status) {
            const query = this.refundRepository.createQueryBuilder('refund');
            if (status) {
                query.where('refund.status = :status', { status });
            }
            const [refunds, total] = await query
                .leftJoinAndSelect('refund.invoice', 'invoice')
                .orderBy('refund.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data: refunds, total };
        }
        /**
         * Update refund status
         */
        async updateRefund(id, dto) {
            const refund = await this.getRefundById(id);
            if (dto.status) {
                refund.status = dto.status;
                if (dto.status === 'completed') {
                    refund.refundDate = new Date();
                }
            }
            if (dto.notes !== undefined) {
                refund.notes = dto.notes;
            }
            if (dto.refundMethod) {
                refund.refundMethod = dto.refundMethod;
            }
            const updated = await this.refundRepository.save(refund);
            this.logger.log(`Refund updated: ${id}, new status: ${refund.status}`);
            return updated;
        }
        /**
         * Process a refund (simulate Stripe processing)
         */
        async processRefund(id) {
            const refund = await this.getRefundById(id);
            if (refund.status === 'completed') {
                throw new common_1.BadRequestException('Refund is already completed');
            }
            if (refund.status === 'processing') {
                throw new common_1.BadRequestException('Refund is already being processed');
            }
            refund.status = 'processing';
            await this.refundRepository.save(refund);
            // Simulate Stripe API call for processing
            // In real implementation, call Stripe API here
            try {
                // Simulate successful processing
                const isSuccessful = Math.random() > 0.1; // 90% success rate for demo
                if (isSuccessful) {
                    refund.status = 'completed';
                    refund.refundDate = new Date();
                    refund.stripeRefundId = `re_${Date.now()}`;
                }
                else {
                    throw new Error('Refund processing failed');
                }
            }
            catch (error) {
                refund.status = 'failed';
                refund.errorMessage =
                    error instanceof Error ? error.message : 'Unknown error';
                // Schedule retry if retries remaining
                if (refund.retryCount < refund.maxRetries) {
                    refund.retryCount++;
                    refund.nextRetryAt = new Date(Date.now() + 60 * 60 * 1000); // Retry in 1 hour
                    this.logger.warn(`Refund processing failed, scheduled for retry: ${id}, attempt ${refund.retryCount}`);
                }
                else {
                    this.logger.error(`Refund processing failed and max retries exceeded: ${id}`);
                }
            }
            return this.refundRepository.save(refund);
        }
        /**
         * Retry failed refund
         */
        async retryRefund(id) {
            const refund = await this.getRefundById(id);
            if (refund.status === 'completed') {
                throw new common_1.BadRequestException('Cannot retry a completed refund');
            }
            if (refund.status === 'rejected') {
                throw new common_1.BadRequestException('Cannot retry a rejected refund');
            }
            if (refund.retryCount >= refund.maxRetries) {
                throw new common_1.BadRequestException('Maximum retry attempts reached');
            }
            refund.status = 'pending';
            refund.nextRetryAt = undefined;
            await this.refundRepository.save(refund);
            return this.processRefund(id);
        }
        /**
         * Approve refund
         */
        async approveRefund(id) {
            const refund = await this.getRefundById(id);
            if (refund.status !== 'pending') {
                throw new common_1.BadRequestException(`Cannot approve refund with status: ${refund.status}`);
            }
            return this.processRefund(id);
        }
        /**
         * Reject refund
         */
        async rejectRefund(id, reason) {
            const refund = await this.getRefundById(id);
            if (refund.status !== 'pending' && refund.status !== 'processing') {
                throw new common_1.BadRequestException(`Cannot reject refund with status: ${refund.status}`);
            }
            refund.status = 'rejected';
            refund.errorMessage = reason;
            const updated = await this.refundRepository.save(refund);
            this.logger.log(`Refund rejected: ${id}, reason: ${reason}`);
            return updated;
        }
        /**
         * Get refund statistics
         */
        async getRefundStats() {
            const refunds = await this.refundRepository.find();
            const stats = {
                totalRefunds: refunds.length,
                totalAmount: 0,
                completedRefunds: 0,
                completedAmount: 0,
                pendingRefunds: 0,
                failedRefunds: 0,
            };
            refunds.forEach((refund) => {
                stats.totalAmount += Number(refund.amount);
                if (refund.status === 'completed') {
                    stats.completedRefunds++;
                    stats.completedAmount += Number(refund.amount);
                }
                else if (refund.status === 'pending' ||
                    refund.status === 'processing') {
                    stats.pendingRefunds++;
                }
                else if (refund.status === 'failed') {
                    stats.failedRefunds++;
                }
            });
            return stats;
        }
        /**
         * Get pending refunds for batch processing
         */
        async getPendingRefunds() {
            return this.refundRepository.find({
                where: { status: 'pending' },
                relations: ['invoice'],
                order: { createdAt: 'ASC' },
            });
        }
        /**
         * Get refunds ready for retry
         */
        async getRefundsReadyForRetry() {
            const now = new Date();
            return this.refundRepository
                .createQueryBuilder('refund')
                .leftJoinAndSelect('refund.invoice', 'invoice')
                .where('refund.status = :status', { status: 'failed' })
                .andWhere('refund.retryCount < refund.maxRetries', {})
                .andWhere('refund.nextRetryAt <= :now', { now })
                .orderBy('refund.nextRetryAt', 'ASC')
                .getMany();
        }
        /**
         * Process all pending refunds
         */
        async processPendingRefunds() {
            const pendingRefunds = await this.getPendingRefunds();
            let successful = 0;
            for (const refund of pendingRefunds) {
                try {
                    await this.processRefund(refund.id);
                    successful++;
                }
                catch (error) {
                    this.logger.error(`Error processing refund ${refund.id}:`, error);
                }
            }
            this.logger.log(`Processed ${pendingRefunds.length} pending refunds, ${successful} successful`);
            return { processed: pendingRefunds.length, successful };
        }
        /**
         * Retry all failed refunds that are ready
         */
        async retryFailedRefunds() {
            const failedRefunds = await this.getRefundsReadyForRetry();
            let successful = 0;
            for (const refund of failedRefunds) {
                try {
                    await this.retryRefund(refund.id);
                    successful++;
                }
                catch (error) {
                    this.logger.error(`Error retrying refund ${refund.id}:`, error);
                }
            }
            this.logger.log(`Retried ${failedRefunds.length} failed refunds, ${successful} successful`);
            return { retried: failedRefunds.length, successful };
        }
        /**
         * Cancel a pending refund
         */
        async cancelRefund(id) {
            const refund = await this.getRefundById(id);
            if (refund.status !== 'pending') {
                throw new common_1.BadRequestException(`Cannot cancel refund with status: ${refund.status}`);
            }
            refund.status = 'rejected';
            refund.errorMessage = 'Cancelled by user';
            const updated = await this.refundRepository.save(refund);
            this.logger.log(`Refund cancelled: ${id}`);
            return updated;
        }
        /**
         * Get total refunded amount for an invoice
         */
        async getTotalRefundedAmount(invoiceId) {
            const refunds = await this.refundRepository.find({
                where: { invoiceId, status: 'completed' },
            });
            return refunds.reduce((sum, r) => sum + Number(r.amount), 0);
        }
        /**
         * Check if invoice can be fully refunded
         */
        async canFullyRefund(invoiceId) {
            const invoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
            });
            if (!invoice) {
                throw new common_1.NotFoundException(`Invoice not found: ${invoiceId}`);
            }
            const totalRefunded = await this.getTotalRefundedAmount(invoiceId);
            return totalRefunded < Number(invoice.amountPaid);
        }
        /**
         * Get remaining refundable amount for an invoice
         */
        async getRemainingRefundableAmount(invoiceId) {
            const invoice = await this.invoiceRepository.findOne({
                where: { id: invoiceId },
            });
            if (!invoice) {
                throw new common_1.NotFoundException(`Invoice not found: ${invoiceId}`);
            }
            const totalRefunded = await this.getTotalRefundedAmount(invoiceId);
            return Math.max(0, Number(invoice.amountPaid) - totalRefunded);
        }
    };
    return RefundService = _classThis;
})();
exports.RefundService = RefundService;
