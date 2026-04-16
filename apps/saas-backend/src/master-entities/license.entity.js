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
exports.License = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
const plan_entity_1 = require("./plan.entity");
const super_admin_entity_1 = require("./super-admin.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores license information for institutes.
 * Tracks license keys, validity, features, and expiry dates.
 * These definitions are stored in the MASTER database only.
 */
let License = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('licenses')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _licenseKey_decorators;
    let _licenseKey_initializers = [];
    let _licenseKey_extraInitializers = [];
    let _organizationName_decorators;
    let _organizationName_initializers = [];
    let _organizationName_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _isValid_decorators;
    let _isValid_initializers = [];
    let _isValid_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _maxUsers_decorators;
    let _maxUsers_initializers = [];
    let _maxUsers_extraInitializers = [];
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _plan_decorators;
    let _plan_initializers = [];
    let _plan_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    let _issuedById_decorators;
    let _issuedById_initializers = [];
    let _issuedById_extraInitializers = [];
    let _issuedBy_decorators;
    let _issuedBy_initializers = [];
    let _issuedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _lastVerifiedAt_decorators;
    let _lastVerifiedAt_initializers = [];
    let _lastVerifiedAt_extraInitializers = [];
    let _verificationCount_decorators;
    let _verificationCount_initializers = [];
    let _verificationCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var License = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _licenseKey_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
            _organizationName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255 })];
            _status_decorators = [(0, typeorm_1.Column)({
                    type: 'enum',
                    enum: ['active', 'expired', 'invalid', 'suspended', 'pending'],
                    default: 'pending',
                })];
            _isValid_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
            _expiryDate_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _features_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: () => "'[]'::jsonb" })];
            _maxUsers_decorators = [(0, typeorm_1.Column)({ type: 'bigint', default: 0 })];
            _planId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
            _plan_decorators = [(0, typeorm_1.ManyToOne)(() => plan_entity_1.Plan, { onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'planId' })];
            _instituteId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            _issuedById_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
            _issuedBy_decorators = [(0, typeorm_1.ManyToOne)(() => super_admin_entity_1.SuperAdmin, { onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'issuedById' })];
            _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _lastVerifiedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _verificationCount_decorators = [(0, typeorm_1.Column)({ type: 'bigint', default: 0 })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _isValid_decorators, { kind: "field", name: "isValid", static: false, private: false, access: { has: obj => "isValid" in obj, get: obj => obj.isValid, set: (obj, value) => { obj.isValid = value; } }, metadata: _metadata }, _isValid_initializers, _isValid_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: obj => "plan" in obj, get: obj => obj.plan, set: (obj, value) => { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, null, _issuedById_decorators, { kind: "field", name: "issuedById", static: false, private: false, access: { has: obj => "issuedById" in obj, get: obj => obj.issuedById, set: (obj, value) => { obj.issuedById = value; } }, metadata: _metadata }, _issuedById_initializers, _issuedById_extraInitializers);
            __esDecorate(null, null, _issuedBy_decorators, { kind: "field", name: "issuedBy", static: false, private: false, access: { has: obj => "issuedBy" in obj, get: obj => obj.issuedBy, set: (obj, value) => { obj.issuedBy = value; } }, metadata: _metadata }, _issuedBy_initializers, _issuedBy_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _lastVerifiedAt_decorators, { kind: "field", name: "lastVerifiedAt", static: false, private: false, access: { has: obj => "lastVerifiedAt" in obj, get: obj => obj.lastVerifiedAt, set: (obj, value) => { obj.lastVerifiedAt = value; } }, metadata: _metadata }, _lastVerifiedAt_initializers, _lastVerifiedAt_extraInitializers);
            __esDecorate(null, null, _verificationCount_decorators, { kind: "field", name: "verificationCount", static: false, private: false, access: { has: obj => "verificationCount" in obj, get: obj => obj.verificationCount, set: (obj, value) => { obj.verificationCount = value; } }, metadata: _metadata }, _verificationCount_initializers, _verificationCount_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            License = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        licenseKey = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _licenseKey_initializers, void 0));
        organizationName = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _organizationName_initializers, void 0));
        status = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        isValid = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _isValid_initializers, void 0));
        expiryDate = (__runInitializers(this, _isValid_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
        features = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _features_initializers, void 0));
        maxUsers = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        planId = (__runInitializers(this, _maxUsers_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
        plan = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
        instituteId = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        institute = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        issuedById = (__runInitializers(this, _institute_extraInitializers), __runInitializers(this, _issuedById_initializers, void 0));
        issuedBy = (__runInitializers(this, _issuedById_extraInitializers), __runInitializers(this, _issuedBy_initializers, void 0));
        notes = (__runInitializers(this, _issuedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        lastVerifiedAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _lastVerifiedAt_initializers, void 0));
        verificationCount = (__runInitializers(this, _lastVerifiedAt_extraInitializers), __runInitializers(this, _verificationCount_initializers, void 0));
        createdAt = (__runInitializers(this, _verificationCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    return License = _classThis;
})();
exports.License = License;
