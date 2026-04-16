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
exports.Refund = void 0;
const typeorm_1 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores refund transactions for invoices and payments.
 * Tracks partial and full refunds with status and reason.
 *
 * This entity is stored in the MASTER database only.
 */
let Refund = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('refunds'), (0, typeorm_1.Index)('idx_refunds_invoice', ['invoiceId']), (0, typeorm_1.Index)('idx_refunds_status', ['status']), (0, typeorm_1.Index)('idx_refunds_date', ['refundDate'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _stripeRefundId_decorators;
    let _stripeRefundId_initializers = [];
    let _stripeRefundId_extraInitializers = [];
    let _originTransactionId_decorators;
    let _originTransactionId_initializers = [];
    let _originTransactionId_extraInitializers = [];
    let _refundDate_decorators;
    let _refundDate_initializers = [];
    let _refundDate_extraInitializers = [];
    let _refundMethod_decorators;
    let _refundMethod_initializers = [];
    let _refundMethod_extraInitializers = [];
    let _errorMessage_decorators;
    let _errorMessage_initializers = [];
    let _errorMessage_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _retryCount_decorators;
    let _retryCount_initializers = [];
    let _retryCount_extraInitializers = [];
    let _maxRetries_decorators;
    let _maxRetries_initializers = [];
    let _maxRetries_extraInitializers = [];
    let _nextRetryAt_decorators;
    let _nextRetryAt_initializers = [];
    let _nextRetryAt_extraInitializers = [];
    let _initiatedBy_decorators;
    let _initiatedBy_initializers = [];
    let _initiatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _invoice_decorators;
    let _invoice_initializers = [];
    let _invoice_extraInitializers = [];
    var Refund = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _invoiceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
            _amount_decorators = [(0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 })];
            _reason_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
            _status_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 50,
                    default: 'pending',
                })];
            _stripeRefundId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _originTransactionId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _refundDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _refundMethod_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true })];
            _errorMessage_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _type_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 20,
                    default: 'full',
                })];
            _retryCount_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 0 })];
            _maxRetries_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 3 })];
            _nextRetryAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _initiatedBy_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _invoice_decorators = [(0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, {
                    onDelete: 'CASCADE',
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'invoiceId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _stripeRefundId_decorators, { kind: "field", name: "stripeRefundId", static: false, private: false, access: { has: obj => "stripeRefundId" in obj, get: obj => obj.stripeRefundId, set: (obj, value) => { obj.stripeRefundId = value; } }, metadata: _metadata }, _stripeRefundId_initializers, _stripeRefundId_extraInitializers);
            __esDecorate(null, null, _originTransactionId_decorators, { kind: "field", name: "originTransactionId", static: false, private: false, access: { has: obj => "originTransactionId" in obj, get: obj => obj.originTransactionId, set: (obj, value) => { obj.originTransactionId = value; } }, metadata: _metadata }, _originTransactionId_initializers, _originTransactionId_extraInitializers);
            __esDecorate(null, null, _refundDate_decorators, { kind: "field", name: "refundDate", static: false, private: false, access: { has: obj => "refundDate" in obj, get: obj => obj.refundDate, set: (obj, value) => { obj.refundDate = value; } }, metadata: _metadata }, _refundDate_initializers, _refundDate_extraInitializers);
            __esDecorate(null, null, _refundMethod_decorators, { kind: "field", name: "refundMethod", static: false, private: false, access: { has: obj => "refundMethod" in obj, get: obj => obj.refundMethod, set: (obj, value) => { obj.refundMethod = value; } }, metadata: _metadata }, _refundMethod_initializers, _refundMethod_extraInitializers);
            __esDecorate(null, null, _errorMessage_decorators, { kind: "field", name: "errorMessage", static: false, private: false, access: { has: obj => "errorMessage" in obj, get: obj => obj.errorMessage, set: (obj, value) => { obj.errorMessage = value; } }, metadata: _metadata }, _errorMessage_initializers, _errorMessage_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _retryCount_decorators, { kind: "field", name: "retryCount", static: false, private: false, access: { has: obj => "retryCount" in obj, get: obj => obj.retryCount, set: (obj, value) => { obj.retryCount = value; } }, metadata: _metadata }, _retryCount_initializers, _retryCount_extraInitializers);
            __esDecorate(null, null, _maxRetries_decorators, { kind: "field", name: "maxRetries", static: false, private: false, access: { has: obj => "maxRetries" in obj, get: obj => obj.maxRetries, set: (obj, value) => { obj.maxRetries = value; } }, metadata: _metadata }, _maxRetries_initializers, _maxRetries_extraInitializers);
            __esDecorate(null, null, _nextRetryAt_decorators, { kind: "field", name: "nextRetryAt", static: false, private: false, access: { has: obj => "nextRetryAt" in obj, get: obj => obj.nextRetryAt, set: (obj, value) => { obj.nextRetryAt = value; } }, metadata: _metadata }, _nextRetryAt_initializers, _nextRetryAt_extraInitializers);
            __esDecorate(null, null, _initiatedBy_decorators, { kind: "field", name: "initiatedBy", static: false, private: false, access: { has: obj => "initiatedBy" in obj, get: obj => obj.initiatedBy, set: (obj, value) => { obj.initiatedBy = value; } }, metadata: _metadata }, _initiatedBy_initializers, _initiatedBy_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _invoice_decorators, { kind: "field", name: "invoice", static: false, private: false, access: { has: obj => "invoice" in obj, get: obj => obj.invoice, set: (obj, value) => { obj.invoice = value; } }, metadata: _metadata }, _invoice_initializers, _invoice_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Refund = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to the invoice being refunded
         */
        invoiceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
        /**
         * Refund amount (in same currency as invoice)
         * Precision: 10 digits total, 2 decimal places
         */
        amount = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
        /**
         * Refund reason
         * Examples: customer_request, duplicate_charge, damaged_product, etc.
         */
        reason = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
        /**
         * Refund status
         * pending: Initiated, awaiting processing
         * processing: Being processed by payment gateway
         * completed: Successfully refunded
         * failed: Refund failed, may retry
         * rejected: Refund rejected by payment gateway
         */
        status = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        /**
         * Stripe refund ID for reference
         */
        stripeRefundId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _stripeRefundId_initializers, void 0));
        /**
         * Original payment/transaction ID that was refunded
         */
        originTransactionId = (__runInitializers(this, _stripeRefundId_extraInitializers), __runInitializers(this, _originTransactionId_initializers, void 0));
        /**
         * Date when refund was processed
         */
        refundDate = (__runInitializers(this, _originTransactionId_extraInitializers), __runInitializers(this, _refundDate_initializers, void 0));
        /**
         * Refund method
         * Examples: credit_card, bank_transfer, original_payment_method, etc.
         */
        refundMethod = (__runInitializers(this, _refundDate_extraInitializers), __runInitializers(this, _refundMethod_initializers, void 0));
        /**
         * Error message if refund failed
         */
        errorMessage = (__runInitializers(this, _refundMethod_extraInitializers), __runInitializers(this, _errorMessage_initializers, void 0));
        /**
         * Additional notes about the refund
         */
        notes = (__runInitializers(this, _errorMessage_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        /**
         * Whether this is a partial or full refund
         * full: Entire invoice amount
         * partial: Only part of invoice amount
         */
        type = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        /**
         * Number of retry attempts made
         */
        retryCount = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _retryCount_initializers, void 0));
        /**
         * Maximum retry attempts before giving up
         */
        maxRetries = (__runInitializers(this, _retryCount_extraInitializers), __runInitializers(this, _maxRetries_initializers, void 0));
        /**
         * Next retry date (for failed refunds)
         */
        nextRetryAt = (__runInitializers(this, _maxRetries_extraInitializers), __runInitializers(this, _nextRetryAt_initializers, void 0));
        /**
         * Admin/user who initiated the refund
         */
        initiatedBy = (__runInitializers(this, _nextRetryAt_extraInitializers), __runInitializers(this, _initiatedBy_initializers, void 0));
        /**
         * Timestamp when record was created
         */
        createdAt = (__runInitializers(this, _initiatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Timestamp when record was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to Invoice
         * Allows: refund.invoice.amount, etc.
         */
        invoice = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _invoice_initializers, void 0));
        constructor() {
            __runInitializers(this, _invoice_extraInitializers);
        }
    };
    return Refund = _classThis;
})();
exports.Refund = Refund;
