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
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const institute_billing_entity_1 = require("./institute-billing.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores payment invoices for billing records.
 * One invoice per payment transaction or billing period.
 *
 * This entity is stored in the MASTER database only.
 */
let Invoice = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('invoices'), (0, typeorm_1.Index)('idx_invoices_billing', ['billingId']), (0, typeorm_1.Index)('idx_invoices_stripe_id', ['stripeInvoiceId']), (0, typeorm_1.Index)('idx_invoices_status', ['status']), (0, typeorm_1.Index)('idx_invoices_date', ['invoiceDate'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _billingId_decorators;
    let _billingId_initializers = [];
    let _billingId_extraInitializers = [];
    let _stripeInvoiceId_decorators;
    let _stripeInvoiceId_initializers = [];
    let _stripeInvoiceId_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _amountPaid_decorators;
    let _amountPaid_initializers = [];
    let _amountPaid_extraInitializers = [];
    let _amountDue_decorators;
    let _amountDue_initializers = [];
    let _amountDue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _paidDate_decorators;
    let _paidDate_initializers = [];
    let _paidDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _receiptId_decorators;
    let _receiptId_initializers = [];
    let _receiptId_extraInitializers = [];
    let _isSent_decorators;
    let _isSent_initializers = [];
    let _isSent_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _billing_decorators;
    let _billing_initializers = [];
    let _billing_extraInitializers = [];
    var Invoice = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _billingId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
            _stripeInvoiceId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _invoiceNumber_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true })];
            _invoiceDate_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
            _periodStart_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
            _periodEnd_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
            _amount_decorators = [(0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 })];
            _amountPaid_decorators = [(0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 })];
            _amountDue_decorators = [(0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 })];
            _currency_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' })];
            _status_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 50,
                    default: 'open',
                })];
            _lineItems_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _paymentMethod_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true })];
            _paidDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _dueDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _receiptId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _isSent_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
            _sentAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _billing_decorators = [(0, typeorm_1.ManyToOne)(() => institute_billing_entity_1.InstituteBilling, {
                    onDelete: 'CASCADE',
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'billingId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _billingId_decorators, { kind: "field", name: "billingId", static: false, private: false, access: { has: obj => "billingId" in obj, get: obj => obj.billingId, set: (obj, value) => { obj.billingId = value; } }, metadata: _metadata }, _billingId_initializers, _billingId_extraInitializers);
            __esDecorate(null, null, _stripeInvoiceId_decorators, { kind: "field", name: "stripeInvoiceId", static: false, private: false, access: { has: obj => "stripeInvoiceId" in obj, get: obj => obj.stripeInvoiceId, set: (obj, value) => { obj.stripeInvoiceId = value; } }, metadata: _metadata }, _stripeInvoiceId_initializers, _stripeInvoiceId_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _amountPaid_decorators, { kind: "field", name: "amountPaid", static: false, private: false, access: { has: obj => "amountPaid" in obj, get: obj => obj.amountPaid, set: (obj, value) => { obj.amountPaid = value; } }, metadata: _metadata }, _amountPaid_initializers, _amountPaid_extraInitializers);
            __esDecorate(null, null, _amountDue_decorators, { kind: "field", name: "amountDue", static: false, private: false, access: { has: obj => "amountDue" in obj, get: obj => obj.amountDue, set: (obj, value) => { obj.amountDue = value; } }, metadata: _metadata }, _amountDue_initializers, _amountDue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _paidDate_decorators, { kind: "field", name: "paidDate", static: false, private: false, access: { has: obj => "paidDate" in obj, get: obj => obj.paidDate, set: (obj, value) => { obj.paidDate = value; } }, metadata: _metadata }, _paidDate_initializers, _paidDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _receiptId_decorators, { kind: "field", name: "receiptId", static: false, private: false, access: { has: obj => "receiptId" in obj, get: obj => obj.receiptId, set: (obj, value) => { obj.receiptId = value; } }, metadata: _metadata }, _receiptId_initializers, _receiptId_extraInitializers);
            __esDecorate(null, null, _isSent_decorators, { kind: "field", name: "isSent", static: false, private: false, access: { has: obj => "isSent" in obj, get: obj => obj.isSent, set: (obj, value) => { obj.isSent = value; } }, metadata: _metadata }, _isSent_initializers, _isSent_extraInitializers);
            __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _billing_decorators, { kind: "field", name: "billing", static: false, private: false, access: { has: obj => "billing" in obj, get: obj => obj.billing, set: (obj, value) => { obj.billing = value; } }, metadata: _metadata }, _billing_initializers, _billing_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Invoice = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to the billing record
         */
        billingId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _billingId_initializers, void 0));
        /**
         * Stripe invoice ID for reference
         */
        stripeInvoiceId = (__runInitializers(this, _billingId_extraInitializers), __runInitializers(this, _stripeInvoiceId_initializers, void 0));
        /**
         * Invoice number/reference
         * Example: INV-2024-0001
         */
        invoiceNumber = (__runInitializers(this, _stripeInvoiceId_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
        /**
         * Invoice date
         */
        invoiceDate = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
        /**
         * Period start date
         */
        periodStart = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
        /**
         * Period end date
         */
        periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
        /**
         * Invoice amount (in cents to avoid floating point issues)
         * Precision: 10 digits total, 2 decimal places
         */
        amount = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
        /**
         * Amount already paid (in cents)
         */
        amountPaid = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _amountPaid_initializers, void 0));
        /**
         * Amount still due (in cents)
         */
        amountDue = (__runInitializers(this, _amountPaid_extraInitializers), __runInitializers(this, _amountDue_initializers, void 0));
        /**
         * Currency code (ISO 4217)
         * Example: USD, EUR, INR
         */
        currency = (__runInitializers(this, _amountDue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        /**
         * Invoice status
         * draft: Not yet sent
         * open: Sent, awaiting payment
         * paid: Payment received
         * uncollectible: Cannot be collected
         * void: Cancelled
         */
        status = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        /**
         * Description or line items (JSON array)
         * Example: [
         *   { description: 'Premium Plan', quantity: 1, unitPrice: 99.99 },
         *   { description: 'Tax', quantity: 1, unitPrice: 9.99 }
         * ]
         */
        lineItems = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
        /**
         * Payment method used
         * Example: credit_card, bank_transfer, etc.
         */
        paymentMethod = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
        /**
         * Date when payment was received
         */
        paidDate = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _paidDate_initializers, void 0));
        /**
         * Due date for payment
         */
        dueDate = (__runInitializers(this, _paidDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
        /**
         * Notes or memo on invoice
         */
        notes = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        /**
         * Payment receipt/transaction ID
         */
        receiptId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _receiptId_initializers, void 0));
        /**
         * Whether invoice was sent to customer
         */
        isSent = (__runInitializers(this, _receiptId_extraInitializers), __runInitializers(this, _isSent_initializers, void 0));
        /**
         * Date when invoice was sent
         */
        sentAt = (__runInitializers(this, _isSent_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
        /**
         * Timestamp when record was created
         */
        createdAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Timestamp when record was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to InstituteBilling
         * Allows: invoice.billing.instituteId, etc.
         */
        billing = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _billing_initializers, void 0));
        constructor() {
            __runInitializers(this, _billing_extraInitializers);
        }
    };
    return Invoice = _classThis;
})();
exports.Invoice = Invoice;
