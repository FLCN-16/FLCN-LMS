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
exports.InstituteBilling = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores subscription and billing information for each institute.
 * One billing record per institute.
 *
 * This entity is stored in the MASTER database only.
 */
let InstituteBilling = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('billing'), (0, typeorm_1.Index)('idx_billing_institute', ['instituteId']), (0, typeorm_1.Index)('idx_billing_status', ['status'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _stripeCustomerId_decorators;
    let _stripeCustomerId_initializers = [];
    let _stripeCustomerId_extraInitializers = [];
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _plan_decorators;
    let _plan_initializers = [];
    let _plan_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _currentPeriodStart_decorators;
    let _currentPeriodStart_initializers = [];
    let _currentPeriodStart_extraInitializers = [];
    let _currentPeriodEnd_decorators;
    let _currentPeriodEnd_initializers = [];
    let _currentPeriodEnd_extraInitializers = [];
    let _nextBillingDate_decorators;
    let _nextBillingDate_initializers = [];
    let _nextBillingDate_extraInitializers = [];
    let _amountDue_decorators;
    let _amountDue_initializers = [];
    let _amountDue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _invoices_decorators;
    let _invoices_initializers = [];
    let _invoices_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var InstituteBilling = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', unique: true })];
            _stripeCustomerId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _subscriptionId_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true })];
            _plan_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true })];
            _status_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 50,
                    default: 'active',
                })];
            _currentPeriodStart_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _currentPeriodEnd_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _nextBillingDate_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
            _amountDue_decorators = [(0, typeorm_1.Column)({
                    type: 'numeric',
                    precision: 10,
                    scale: 2,
                    nullable: true,
                })];
            _currency_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 3, default: 'USD' })];
            _paymentMethod_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _invoices_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.billing, {
                    onDelete: 'CASCADE',
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _stripeCustomerId_decorators, { kind: "field", name: "stripeCustomerId", static: false, private: false, access: { has: obj => "stripeCustomerId" in obj, get: obj => obj.stripeCustomerId, set: (obj, value) => { obj.stripeCustomerId = value; } }, metadata: _metadata }, _stripeCustomerId_initializers, _stripeCustomerId_extraInitializers);
            __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
            __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: obj => "plan" in obj, get: obj => obj.plan, set: (obj, value) => { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _currentPeriodStart_decorators, { kind: "field", name: "currentPeriodStart", static: false, private: false, access: { has: obj => "currentPeriodStart" in obj, get: obj => obj.currentPeriodStart, set: (obj, value) => { obj.currentPeriodStart = value; } }, metadata: _metadata }, _currentPeriodStart_initializers, _currentPeriodStart_extraInitializers);
            __esDecorate(null, null, _currentPeriodEnd_decorators, { kind: "field", name: "currentPeriodEnd", static: false, private: false, access: { has: obj => "currentPeriodEnd" in obj, get: obj => obj.currentPeriodEnd, set: (obj, value) => { obj.currentPeriodEnd = value; } }, metadata: _metadata }, _currentPeriodEnd_initializers, _currentPeriodEnd_extraInitializers);
            __esDecorate(null, null, _nextBillingDate_decorators, { kind: "field", name: "nextBillingDate", static: false, private: false, access: { has: obj => "nextBillingDate" in obj, get: obj => obj.nextBillingDate, set: (obj, value) => { obj.nextBillingDate = value; } }, metadata: _metadata }, _nextBillingDate_initializers, _nextBillingDate_extraInitializers);
            __esDecorate(null, null, _amountDue_decorators, { kind: "field", name: "amountDue", static: false, private: false, access: { has: obj => "amountDue" in obj, get: obj => obj.amountDue, set: (obj, value) => { obj.amountDue = value; } }, metadata: _metadata }, _amountDue_initializers, _amountDue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _invoices_decorators, { kind: "field", name: "invoices", static: false, private: false, access: { has: obj => "invoices" in obj, get: obj => obj.invoices, set: (obj, value) => { obj.invoices = value; } }, metadata: _metadata }, _invoices_initializers, _invoices_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InstituteBilling = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to the institute
         * Unique constraint: one billing record per institute
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * Stripe customer ID for payment processing
         */
        stripeCustomerId = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _stripeCustomerId_initializers, void 0));
        /**
         * Stripe subscription ID
         */
        subscriptionId = (__runInitializers(this, _stripeCustomerId_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
        /**
         * Current subscription plan: free, pro, enterprise
         * Matches the plan in institutes table
         */
        plan = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
        /**
         * Subscription status
         * active: currently paying
         * past_due: payment failed, retry pending
         * unpaid: payment failed, subscription suspended
         * canceled: subscription cancelled
         */
        status = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        /**
         * Start date of current billing period
         */
        currentPeriodStart = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentPeriodStart_initializers, void 0));
        /**
         * End date of current billing period
         */
        currentPeriodEnd = (__runInitializers(this, _currentPeriodStart_extraInitializers), __runInitializers(this, _currentPeriodEnd_initializers, void 0));
        /**
         * Next billing date (when the subscription will renew)
         */
        nextBillingDate = (__runInitializers(this, _currentPeriodEnd_extraInitializers), __runInitializers(this, _nextBillingDate_initializers, void 0));
        /**
         * Amount due (if any)
         * Precision: 10 digits total, 2 decimal places
         */
        amountDue = (__runInitializers(this, _nextBillingDate_extraInitializers), __runInitializers(this, _amountDue_initializers, void 0));
        /**
         * Currency code (ISO 4217)
         * Examples: USD, EUR, INR
         */
        currency = (__runInitializers(this, _amountDue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        /**
         * Payment method information (JSON)
         * Stores encrypted payment method details
         * Example: { type: 'card', last4: '4242', expMonth: 12, expYear: 2025 }
         */
        paymentMethod = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
        /**
         * Invoice history (JSON array)
         * Stores past invoices for record keeping
         * Example: [{ id: 'inv_123', date: '2024-01-01', amount: 99.99, status: 'paid' }]
         */
        invoices = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _invoices_initializers, void 0));
        /**
         * Timestamp when record was created
         */
        createdAt = (__runInitializers(this, _invoices_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Timestamp when record was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to Institute
         * Allows: billing.institute.name, etc.
         */
        institute = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return InstituteBilling = _classThis;
})();
exports.InstituteBilling = InstituteBilling;
