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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const invoice_entity_1 = require("../master-entities/invoice.entity");
let InvoiceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var InvoiceService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InvoiceService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        invoiceRepository;
        billingRepository;
        logger = new common_1.Logger(InvoiceService.name);
        constructor(invoiceRepository, billingRepository) {
            this.invoiceRepository = invoiceRepository;
            this.billingRepository = billingRepository;
        }
        /**
         * Create a new invoice
         */
        async createInvoice(dto) {
            const billing = await this.billingRepository.findOne({
                where: { id: dto.billingId },
            });
            if (!billing) {
                throw new common_1.NotFoundException(`Billing record not found: ${dto.billingId}`);
            }
            const lineItemsTotal = this.calculateLineItemsTotal(dto.lineItems || []);
            const amountDue = lineItemsTotal - (dto.amountPaid || 0);
            const invoice = this.invoiceRepository.create({
                ...dto,
                amount: lineItemsTotal,
                amountDue: Math.max(0, amountDue),
                status: dto.status || 'open',
                currency: dto.currency || 'USD',
            });
            const saved = (await this.invoiceRepository.save(invoice));
            this.logger.log(`Invoice created: ${saved.id} for billing: ${dto.billingId}`);
            return saved;
        }
        /**
         * Get invoice by ID
         */
        async getInvoiceById(id) {
            const invoice = await this.invoiceRepository.findOne({
                where: { id },
                relations: ['billing'],
            });
            if (!invoice) {
                throw new common_1.NotFoundException(`Invoice not found: ${id}`);
            }
            return invoice;
        }
        /**
         * Get all invoices for a billing record
         */
        async getInvoicesByBilling(billingId, page = 1, limit = 10) {
            const [invoices, total] = await this.invoiceRepository.findAndCount({
                where: { billingId },
                relations: ['billing'],
                order: { invoiceDate: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            return { data: invoices, total };
        }
        /**
         * Get all invoices with optional filtering
         */
        async getAllInvoices(page = 1, limit = 10, status) {
            const query = this.invoiceRepository.createQueryBuilder('invoice');
            if (status) {
                query.where('invoice.status = :status', { status });
            }
            const [invoices, total] = await query
                .leftJoinAndSelect('invoice.billing', 'billing')
                .orderBy('invoice.invoiceDate', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data: invoices, total };
        }
        /**
         * Update invoice
         */
        async updateInvoice(id, dto) {
            const invoice = await this.getInvoiceById(id);
            if (dto.status === 'paid' && !invoice.paidDate && !dto.paidDate) {
                throw new common_1.BadRequestException('paidDate is required when marking invoice as paid');
            }
            if (dto.lineItems) {
                const lineItemsTotal = this.calculateLineItemsTotal(dto.lineItems);
                invoice.amount = lineItemsTotal;
                invoice.amountDue = Math.max(0, lineItemsTotal - (invoice.amountPaid || 0));
            }
            Object.assign(invoice, dto);
            const updated = await this.invoiceRepository.save(invoice);
            this.logger.log(`Invoice updated: ${id}`);
            return updated;
        }
        /**
         * Mark invoice as paid
         */
        async markAsPaid(id, paidDate, receiptId) {
            const invoice = await this.getInvoiceById(id);
            if (invoice.status === 'paid') {
                throw new common_1.BadRequestException('Invoice is already marked as paid');
            }
            invoice.status = 'paid';
            invoice.paidDate = paidDate || new Date();
            invoice.amountPaid = invoice.amount;
            invoice.amountDue = 0;
            if (receiptId) {
                invoice.receiptId = receiptId;
            }
            const updated = await this.invoiceRepository.save(invoice);
            this.logger.log(`Invoice marked as paid: ${id}`);
            return updated;
        }
        /**
         * Mark invoice as sent
         */
        async markAsSent(id) {
            const invoice = await this.getInvoiceById(id);
            invoice.isSent = true;
            invoice.sentAt = new Date();
            const updated = await this.invoiceRepository.save(invoice);
            this.logger.log(`Invoice marked as sent: ${id}`);
            return updated;
        }
        /**
         * Cancel invoice
         */
        async cancelInvoice(id) {
            const invoice = await this.getInvoiceById(id);
            if (invoice.status === 'void') {
                throw new common_1.BadRequestException('Invoice is already cancelled');
            }
            if (invoice.status === 'paid') {
                throw new common_1.BadRequestException('Cannot cancel a paid invoice');
            }
            invoice.status = 'void';
            const updated = await this.invoiceRepository.save(invoice);
            this.logger.log(`Invoice cancelled: ${id}`);
            return updated;
        }
        /**
         * Get invoice statistics for a billing record
         */
        async getInvoiceStats(billingId) {
            const invoices = await this.invoiceRepository.find({
                where: { billingId },
            });
            const now = new Date();
            const stats = {
                totalInvoices: invoices.length,
                totalAmount: 0,
                totalPaid: 0,
                totalDue: 0,
                paidInvoices: 0,
                overdueInvoices: 0,
            };
            invoices.forEach((invoice) => {
                stats.totalAmount += Number(invoice.amount);
                stats.totalPaid += Number(invoice.amountPaid);
                stats.totalDue += Number(invoice.amountDue);
                if (invoice.status === 'paid') {
                    stats.paidInvoices++;
                }
                if (invoice.status === 'open' &&
                    invoice.dueDate &&
                    invoice.dueDate < now) {
                    stats.overdueInvoices++;
                }
            });
            return stats;
        }
        /**
         * Delete invoice
         */
        async deleteInvoice(id) {
            const invoice = await this.getInvoiceById(id);
            if (invoice.status === 'paid') {
                throw new common_1.BadRequestException('Cannot delete a paid invoice');
            }
            await this.invoiceRepository.delete(id);
            this.logger.log(`Invoice deleted: ${id}`);
        }
        /**
         * Calculate total from line items
         */
        calculateLineItemsTotal(lineItems) {
            if (!lineItems || lineItems.length === 0) {
                return 0;
            }
            return lineItems.reduce((total, item) => {
                const quantity = item.quantity || 1;
                const unitPrice = item.unitPrice || 0;
                return total + quantity * unitPrice;
            }, 0);
        }
        /**
         * Get invoices by status
         */
        async getInvoicesByStatus(status) {
            return this.invoiceRepository.find({
                where: { status },
                relations: ['billing'],
                order: { invoiceDate: 'DESC' },
            });
        }
        /**
         * Get overdue invoices
         */
        async getOverdueInvoices() {
            const now = new Date();
            return this.invoiceRepository
                .createQueryBuilder('invoice')
                .leftJoinAndSelect('invoice.billing', 'billing')
                .where('invoice.status = :status', { status: 'open' })
                .andWhere('invoice.dueDate < :now', { now })
                .orderBy('invoice.dueDate', 'ASC')
                .getMany();
        }
        /**
         * Get unpaid invoices for a billing record
         */
        async getUnpaidInvoicesByBilling(billingId) {
            return this.invoiceRepository.find({
                where: { billingId, status: 'open' },
                order: { invoiceDate: 'DESC' },
            });
        }
        /**
         * Record partial payment
         */
        async recordPartialPayment(id, amount, receiptId) {
            const invoice = await this.getInvoiceById(id);
            if (invoice.status === 'paid') {
                throw new common_1.BadRequestException('Invoice is already paid');
            }
            if (invoice.status === 'void') {
                throw new common_1.BadRequestException('Cannot record payment on cancelled invoice');
            }
            if (amount <= 0) {
                throw new common_1.BadRequestException('Payment amount must be greater than 0');
            }
            invoice.amountPaid = Number(invoice.amountPaid) + amount;
            invoice.amountDue = Math.max(0, Number(invoice.amount) - Number(invoice.amountPaid));
            if (invoice.amountDue === 0) {
                invoice.status = 'paid';
                invoice.paidDate = new Date();
            }
            if (receiptId) {
                invoice.receiptId = receiptId;
            }
            const updated = await this.invoiceRepository.save(invoice);
            this.logger.log(`Partial payment recorded on invoice: ${id}, amount: ${amount}`);
            return updated;
        }
        /**
         * Bulk update invoice status
         */
        async bulkUpdateStatus(ids, status) {
            const result = await this.invoiceRepository
                .createQueryBuilder()
                .update(invoice_entity_1.Invoice)
                .set({ status })
                .where('id IN (:...ids)', { ids })
                .execute();
            this.logger.log(`Updated ${result.affected} invoices to status: ${status}`);
            return result.affected || 0;
        }
        /**
         * Get revenue for a period
         */
        async getRevenueByPeriod(startDate, endDate) {
            const invoices = await this.invoiceRepository.find({
                where: {
                    status: 'paid',
                },
            });
            const filtered = invoices.filter((inv) => inv.paidDate && inv.paidDate >= startDate && inv.paidDate <= endDate);
            const totalRevenue = filtered.reduce((sum, inv) => sum + Number(inv.amountPaid), 0);
            return {
                totalRevenue,
                invoicesCount: filtered.length,
            };
        }
    };
    return InvoiceService = _classThis;
})();
exports.InvoiceService = InvoiceService;
