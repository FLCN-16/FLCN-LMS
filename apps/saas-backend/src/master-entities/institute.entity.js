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
exports.Institute = void 0;
const typeorm_1 = require("typeorm");
const api_key_entity_1 = require("./api-key.entity");
const audit_log_entity_1 = require("./audit-log.entity");
const branch_entity_1 = require("./branch.entity");
const feature_flag_entity_1 = require("./feature-flag.entity");
const institute_billing_entity_1 = require("./institute-billing.entity");
const institute_database_entity_1 = require("./institute-database.entity");
const plan_entity_1 = require("./plan.entity");
/**
 * MASTER DATABASE ENTITY: Institute
 *
 * Represents an educational institute/organization in the FLCN-LMS platform.
 * All institute metadata is stored in the MASTER database.
 * Each institute has their own separate database for all their data.
 *
 * Example records:
 * - id: "uuid-1", slug: "pw-live", name: "Physics Wallah"
 * - id: "uuid-2", slug: "adda247", name: "ADDA247"
 * - id: "uuid-3", slug: "flcn-org", name: "FLCN"
 */
let Institute = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('institutes'), (0, typeorm_1.Index)('idx_institutes_slug', ['slug']), (0, typeorm_1.Index)('idx_institutes_domain', ['customDomain']), (0, typeorm_1.Index)('idx_institutes_active', ['isActive'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _logoUrl_decorators;
    let _logoUrl_initializers = [];
    let _logoUrl_extraInitializers = [];
    let _customDomain_decorators;
    let _customDomain_initializers = [];
    let _customDomain_extraInitializers = [];
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _subscriptionPlan_decorators;
    let _subscriptionPlan_initializers = [];
    let _subscriptionPlan_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    let _maxUsers_decorators;
    let _maxUsers_initializers = [];
    let _maxUsers_extraInitializers = [];
    let _maxCourses_decorators;
    let _maxCourses_initializers = [];
    let _maxCourses_extraInitializers = [];
    let _maxStorageGb_decorators;
    let _maxStorageGb_initializers = [];
    let _maxStorageGb_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _databases_decorators;
    let _databases_initializers = [];
    let _databases_extraInitializers = [];
    let _branches_decorators;
    let _branches_initializers = [];
    let _branches_extraInitializers = [];
    let _billing_decorators;
    let _billing_initializers = [];
    let _billing_extraInitializers = [];
    let _auditLogs_decorators;
    let _auditLogs_initializers = [];
    let _auditLogs_extraInitializers = [];
    let _apiKeys_decorators;
    let _apiKeys_initializers = [];
    let _apiKeys_extraInitializers = [];
    let _featureFlags_decorators;
    let _featureFlags_initializers = [];
    let _featureFlags_extraInitializers = [];
    var Institute = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _slug_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 50,
                    unique: true,
                    nullable: false,
                })];
            _name_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 255,
                    nullable: false,
                })];
            _logoUrl_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 500,
                    nullable: true,
                })];
            _customDomain_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 255,
                    unique: true,
                    nullable: true,
                })];
            _planId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
            _subscriptionPlan_decorators = [(0, typeorm_1.ManyToOne)(() => plan_entity_1.Plan, { nullable: true, onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'planId' })];
            _isActive_decorators = [(0, typeorm_1.Column)({
                    type: 'boolean',
                    default: true,
                    nullable: false,
                })];
            _settings_decorators = [(0, typeorm_1.Column)({
                    type: 'jsonb',
                    nullable: true,
                })];
            _maxUsers_decorators = [(0, typeorm_1.Column)({
                    type: 'integer',
                    default: 100,
                    nullable: false,
                })];
            _maxCourses_decorators = [(0, typeorm_1.Column)({
                    type: 'integer',
                    default: 50,
                    nullable: false,
                })];
            _maxStorageGb_decorators = [(0, typeorm_1.Column)({
                    type: 'integer',
                    default: 10,
                    nullable: false,
                })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _databases_decorators = [(0, typeorm_1.OneToMany)(() => institute_database_entity_1.InstituteDatabase, (database) => database.institute, {
                    eager: true,
                    cascade: true,
                    onDelete: 'CASCADE',
                })];
            _branches_decorators = [(0, typeorm_1.OneToMany)(() => branch_entity_1.Branch, (branch) => branch.institute, {
                    cascade: true,
                    onDelete: 'CASCADE',
                })];
            _billing_decorators = [(0, typeorm_1.OneToMany)(() => institute_billing_entity_1.InstituteBilling, (billing) => billing.institute, {
                    cascade: true,
                    onDelete: 'CASCADE',
                })];
            _auditLogs_decorators = [(0, typeorm_1.OneToMany)(() => audit_log_entity_1.AuditLog, (log) => log.institute, {
                    cascade: false,
                })];
            _apiKeys_decorators = [(0, typeorm_1.OneToMany)(() => api_key_entity_1.ApiKey, (key) => key.institute, {
                    cascade: true,
                    onDelete: 'CASCADE',
                })];
            _featureFlags_decorators = [(0, typeorm_1.OneToMany)(() => feature_flag_entity_1.FeatureFlag, (flag) => flag.institute, {
                    cascade: true,
                    onDelete: 'CASCADE',
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: obj => "logoUrl" in obj, get: obj => obj.logoUrl, set: (obj, value) => { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            __esDecorate(null, null, _customDomain_decorators, { kind: "field", name: "customDomain", static: false, private: false, access: { has: obj => "customDomain" in obj, get: obj => obj.customDomain, set: (obj, value) => { obj.customDomain = value; } }, metadata: _metadata }, _customDomain_initializers, _customDomain_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _subscriptionPlan_decorators, { kind: "field", name: "subscriptionPlan", static: false, private: false, access: { has: obj => "subscriptionPlan" in obj, get: obj => obj.subscriptionPlan, set: (obj, value) => { obj.subscriptionPlan = value; } }, metadata: _metadata }, _subscriptionPlan_initializers, _subscriptionPlan_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _maxCourses_decorators, { kind: "field", name: "maxCourses", static: false, private: false, access: { has: obj => "maxCourses" in obj, get: obj => obj.maxCourses, set: (obj, value) => { obj.maxCourses = value; } }, metadata: _metadata }, _maxCourses_initializers, _maxCourses_extraInitializers);
            __esDecorate(null, null, _maxStorageGb_decorators, { kind: "field", name: "maxStorageGb", static: false, private: false, access: { has: obj => "maxStorageGb" in obj, get: obj => obj.maxStorageGb, set: (obj, value) => { obj.maxStorageGb = value; } }, metadata: _metadata }, _maxStorageGb_initializers, _maxStorageGb_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _databases_decorators, { kind: "field", name: "databases", static: false, private: false, access: { has: obj => "databases" in obj, get: obj => obj.databases, set: (obj, value) => { obj.databases = value; } }, metadata: _metadata }, _databases_initializers, _databases_extraInitializers);
            __esDecorate(null, null, _branches_decorators, { kind: "field", name: "branches", static: false, private: false, access: { has: obj => "branches" in obj, get: obj => obj.branches, set: (obj, value) => { obj.branches = value; } }, metadata: _metadata }, _branches_initializers, _branches_extraInitializers);
            __esDecorate(null, null, _billing_decorators, { kind: "field", name: "billing", static: false, private: false, access: { has: obj => "billing" in obj, get: obj => obj.billing, set: (obj, value) => { obj.billing = value; } }, metadata: _metadata }, _billing_initializers, _billing_extraInitializers);
            __esDecorate(null, null, _auditLogs_decorators, { kind: "field", name: "auditLogs", static: false, private: false, access: { has: obj => "auditLogs" in obj, get: obj => obj.auditLogs, set: (obj, value) => { obj.auditLogs = value; } }, metadata: _metadata }, _auditLogs_initializers, _auditLogs_extraInitializers);
            __esDecorate(null, null, _apiKeys_decorators, { kind: "field", name: "apiKeys", static: false, private: false, access: { has: obj => "apiKeys" in obj, get: obj => obj.apiKeys, set: (obj, value) => { obj.apiKeys = value; } }, metadata: _metadata }, _apiKeys_initializers, _apiKeys_extraInitializers);
            __esDecorate(null, null, _featureFlags_decorators, { kind: "field", name: "featureFlags", static: false, private: false, access: { has: obj => "featureFlags" in obj, get: obj => obj.featureFlags, set: (obj, value) => { obj.featureFlags = value; } }, metadata: _metadata }, _featureFlags_initializers, _featureFlags_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Institute = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Unique slug identifier for the institute
         * Used in subdomain routing: pw-live.example.com
         * Format: lowercase alphanumeric with hyphens
         * Examples: 'pw-live', 'adda247', 'flcn-org'
         */
        slug = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
        /**
         * Human-readable name of the institute/organization
         * Examples: 'Physics Wallah', 'ADDA247', 'FLCN'
         */
        name = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        /**
         * Logo URL for the institute
         * Points to CDN or cloud storage
         */
        logoUrl = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
        /**
         * Custom domain for white-label/branded access
         * Example: 'www.pw.com', 'www.adda247.com'
         * When set, users can access via custom domain instead of subdomain
         * This is optional and unique across all institutes
         */
        customDomain = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _customDomain_initializers, void 0));
        /**
         * Foreign key to the subscription plan
         */
        planId = (__runInitializers(this, _customDomain_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
        /**
         * Subscription plan tier
         * Controls feature access and usage limits
         */
        subscriptionPlan = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _subscriptionPlan_initializers, void 0));
        /**
         * Whether this institute is active/enabled
         * Inactive institutes cannot make API requests
         * Set to false to suspend an institute without deleting it
         */
        isActive = (__runInitializers(this, _subscriptionPlan_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
        /**
         * Custom settings and configuration for this institute (JSON)
         * Can store:
         * - Theme preferences
         * - Feature flags
         * - Custom branding
         * - API configuration
         * - Any other institute-specific settings
         */
        settings = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
        /**
         * Maximum number of users allowed for this institute
         * Based on subscription plan
         * Enforced at application level
         */
        maxUsers = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        /**
         * Maximum number of courses allowed for this institute
         * Based on subscription plan
         */
        maxCourses = (__runInitializers(this, _maxUsers_extraInitializers), __runInitializers(this, _maxCourses_initializers, void 0));
        /**
         * Maximum storage in GB allowed for this institute
         * Based on subscription plan
         */
        maxStorageGb = (__runInitializers(this, _maxCourses_extraInitializers), __runInitializers(this, _maxStorageGb_initializers, void 0));
        /**
         * Timestamp when this institute was created
         */
        createdAt = (__runInitializers(this, _maxStorageGb_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Timestamp when this institute was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        // ========== Relations ==========
        /**
         * Relation to InstituteDatabase
         * Each institute has exactly one database configuration
         * Eagerly loaded for quick access during request routing
         */
        databases = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _databases_initializers, void 0));
        /**
         * Relation to Branch
         * Each institute can have multiple branches (locations/sub-organizations)
         */
        branches = (__runInitializers(this, _databases_extraInitializers), __runInitializers(this, _branches_initializers, void 0));
        /**
         * Relation to Billing
         * Each institute has one billing record
         */
        billing = (__runInitializers(this, _branches_extraInitializers), __runInitializers(this, _billing_initializers, void 0));
        /**
         * Audit logs for this institute
         */
        auditLogs = (__runInitializers(this, _billing_extraInitializers), __runInitializers(this, _auditLogs_initializers, void 0));
        /**
         * API keys for this institute
         */
        apiKeys = (__runInitializers(this, _auditLogs_extraInitializers), __runInitializers(this, _apiKeys_initializers, void 0));
        /**
         * Feature flags for this institute
         */
        featureFlags = (__runInitializers(this, _apiKeys_extraInitializers), __runInitializers(this, _featureFlags_initializers, void 0));
        constructor() {
            __runInitializers(this, _featureFlags_extraInitializers);
        }
    };
    return Institute = _classThis;
})();
exports.Institute = Institute;
