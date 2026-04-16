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
exports.FeatureFlag = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Stores feature flags/toggles for the platform.
 * Can be global (instituteId = null) or institute-specific.
 * Allows enabling/disabling features per institute.
 *
 * Example records:
 * - flagName: "new_dashboard", instituteId: null, isEnabled: true (global)
 * - flagName: "new_dashboard", instituteId: "uuid-1", isEnabled: false (institute override)
 * - flagName: "beta_features", instituteId: "uuid-2", isEnabled: true (institute-specific)
 */
let FeatureFlag = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('feature_flags'), (0, typeorm_1.Index)('idx_feature_flags_institute', ['instituteId']), (0, typeorm_1.Index)('idx_feature_flags_name', ['flagName']), (0, typeorm_1.Index)('idx_feature_flags_institute_flag', ['instituteId', 'flagName'], {
            unique: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _flagName_decorators;
    let _flagName_initializers = [];
    let _flagName_extraInitializers = [];
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var FeatureFlag = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({
                    type: 'uuid',
                    nullable: true,
                })];
            _flagName_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 100,
                    nullable: false,
                })];
            _isEnabled_decorators = [(0, typeorm_1.Column)({
                    type: 'boolean',
                    default: false,
                    nullable: false,
                })];
            _config_decorators = [(0, typeorm_1.Column)({
                    type: 'jsonb',
                    nullable: true,
                })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.featureFlags, {
                    onDelete: 'CASCADE',
                    nullable: true,
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _flagName_decorators, { kind: "field", name: "flagName", static: false, private: false, access: { has: obj => "flagName" in obj, get: obj => obj.flagName, set: (obj, value) => { obj.flagName = value; } }, metadata: _metadata }, _flagName_initializers, _flagName_extraInitializers);
            __esDecorate(null, null, _isEnabled_decorators, { kind: "field", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FeatureFlag = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * Unique identifier for the feature flag
         */
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to institute
         * If null, this is a global flag for all institutes
         * If set, this is an institute-specific flag override
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * Name of the feature flag
         * Convention: snake_case
         * Examples: 'new_dashboard', 'beta_features', 'dark_mode'
         */
        flagName = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _flagName_initializers, void 0));
        /**
         * Whether this feature is enabled
         * true = feature is active, false = feature is disabled
         */
        isEnabled = (__runInitializers(this, _flagName_extraInitializers), __runInitializers(this, _isEnabled_initializers, void 0));
        /**
         * Configuration for this feature flag (JSON)
         * Can store:
         * - Rollout percentage (0-100)
         * - User groups
         * - Feature parameters
         * - Any other config needed
         *
         * Example:
         * {
         *   "rolloutPercentage": 50,
         *   "userGroups": ["beta_users", "internal"],
         *   "config": { "maxItems": 10, "timeout": 5000 }
         * }
         */
        config = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _config_initializers, void 0));
        /**
         * When this flag was created
         */
        createdAt = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * When this flag was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to Institute
         * null if this is a global flag
         * If set, allows access to institute details
         */
        institute = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return FeatureFlag = _classThis;
})();
exports.FeatureFlag = FeatureFlag;
