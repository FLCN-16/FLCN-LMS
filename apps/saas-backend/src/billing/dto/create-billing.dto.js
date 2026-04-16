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
exports.CreateBillingDto = void 0;
const class_validator_1 = require("class-validator");
let CreateBillingDto = (() => {
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _plan_decorators;
    let _plan_initializers = [];
    let _plan_extraInitializers = [];
    let _stripeCustomerId_decorators;
    let _stripeCustomerId_initializers = [];
    let _stripeCustomerId_extraInitializers = [];
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _amountDue_decorators;
    let _amountDue_initializers = [];
    let _amountDue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return class CreateBillingDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _instituteId_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _plan_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _stripeCustomerId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _subscriptionId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _amountDue_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: obj => "plan" in obj, get: obj => obj.plan, set: (obj, value) => { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
            __esDecorate(null, null, _stripeCustomerId_decorators, { kind: "field", name: "stripeCustomerId", static: false, private: false, access: { has: obj => "stripeCustomerId" in obj, get: obj => obj.stripeCustomerId, set: (obj, value) => { obj.stripeCustomerId = value; } }, metadata: _metadata }, _stripeCustomerId_initializers, _stripeCustomerId_extraInitializers);
            __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
            __esDecorate(null, null, _amountDue_decorators, { kind: "field", name: "amountDue", static: false, private: false, access: { has: obj => "amountDue" in obj, get: obj => obj.amountDue, set: (obj, value) => { obj.amountDue = value; } }, metadata: _metadata }, _amountDue_initializers, _amountDue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        instituteId = __runInitializers(this, _instituteId_initializers, void 0);
        plan = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
        stripeCustomerId = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _stripeCustomerId_initializers, void 0));
        subscriptionId = (__runInitializers(this, _stripeCustomerId_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
        amountDue = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _amountDue_initializers, void 0));
        currency = (__runInitializers(this, _amountDue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
        constructor() {
            __runInitializers(this, _currency_extraInitializers);
        }
    };
})();
exports.CreateBillingDto = CreateBillingDto;
