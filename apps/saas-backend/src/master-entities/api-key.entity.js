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
exports.ApiKey = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores API keys for institute integrations and third-party access.
 * Each key is hashed and associated with a specific institute.
 */
let ApiKey = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('api_keys'), (0, typeorm_1.Index)('idx_api_keys_institute', ['instituteId']), (0, typeorm_1.Index)('idx_api_keys_hash', ['keyHash']), (0, typeorm_1.Index)('idx_api_keys_active', ['isActive'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _keyHash_decorators;
    let _keyHash_initializers = [];
    let _keyHash_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _scopes_decorators;
    let _scopes_initializers = [];
    let _scopes_extraInitializers = [];
    let _rateLimit_decorators;
    let _rateLimit_initializers = [];
    let _rateLimit_extraInitializers = [];
    let _lastUsedAt_decorators;
    let _lastUsedAt_initializers = [];
    let _lastUsedAt_extraInitializers = [];
    let _totalRequests_decorators;
    let _totalRequests_initializers = [];
    let _totalRequests_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var ApiKey = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
            _keyHash_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true })];
            _name_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true })];
            _scopes_decorators = [(0, typeorm_1.Column)({ type: 'simple-array', nullable: true })];
            _rateLimit_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 1000 })];
            _lastUsedAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _totalRequests_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 0 })];
            _isActive_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
            _expiresAt_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.apiKeys, {
                    onDelete: 'CASCADE',
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _keyHash_decorators, { kind: "field", name: "keyHash", static: false, private: false, access: { has: obj => "keyHash" in obj, get: obj => obj.keyHash, set: (obj, value) => { obj.keyHash = value; } }, metadata: _metadata }, _keyHash_initializers, _keyHash_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: obj => "scopes" in obj, get: obj => obj.scopes, set: (obj, value) => { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _rateLimit_decorators, { kind: "field", name: "rateLimit", static: false, private: false, access: { has: obj => "rateLimit" in obj, get: obj => obj.rateLimit, set: (obj, value) => { obj.rateLimit = value; } }, metadata: _metadata }, _rateLimit_initializers, _rateLimit_extraInitializers);
            __esDecorate(null, null, _lastUsedAt_decorators, { kind: "field", name: "lastUsedAt", static: false, private: false, access: { has: obj => "lastUsedAt" in obj, get: obj => obj.lastUsedAt, set: (obj, value) => { obj.lastUsedAt = value; } }, metadata: _metadata }, _lastUsedAt_initializers, _lastUsedAt_extraInitializers);
            __esDecorate(null, null, _totalRequests_decorators, { kind: "field", name: "totalRequests", static: false, private: false, access: { has: obj => "totalRequests" in obj, get: obj => obj.totalRequests, set: (obj, value) => { obj.totalRequests = value; } }, metadata: _metadata }, _totalRequests_initializers, _totalRequests_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiKey = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to institute
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * Hashed API key (store hash, not the actual key)
         * Unique across all keys
         */
        keyHash = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _keyHash_initializers, void 0));
        /**
         * Display name for this API key
         * Helps users identify which key is which
         */
        name = (__runInitializers(this, _keyHash_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        /**
         * Scopes/permissions this key has
         * Example: ['read:courses', 'write:users', 'read:analytics']
         */
        scopes = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
        /**
         * Rate limit (requests per hour)
         */
        rateLimit = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _rateLimit_initializers, void 0));
        /**
         * When was this key last used?
         */
        lastUsedAt = (__runInitializers(this, _rateLimit_extraInitializers), __runInitializers(this, _lastUsedAt_initializers, void 0));
        /**
         * Total requests made with this key
         */
        totalRequests = (__runInitializers(this, _lastUsedAt_extraInitializers), __runInitializers(this, _totalRequests_initializers, void 0));
        /**
         * Whether this key is active
         */
        isActive = (__runInitializers(this, _totalRequests_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
        /**
         * When does this key expire? (optional)
         */
        expiresAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        createdAt = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to Institute
         */
        institute = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return ApiKey = _classThis;
})();
exports.ApiKey = ApiKey;
