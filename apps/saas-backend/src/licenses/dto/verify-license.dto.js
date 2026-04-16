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
exports.RevokeLicenseResponseDto = exports.LicenseListResponseDto = exports.ListLicensesQueryDto = exports.CheckFeatureResponseDto = exports.CheckFeatureDto = exports.UpdateLicenseDto = exports.IssueLicenseDto = exports.LicenseInfoDto = exports.VerifyLicenseResponseDto = exports.VerifyLicenseDto = exports.FeatureDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Feature configuration DTO
 */
let FeatureDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    return class FeatureDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _enabled_decorators = [(0, class_validator_1.IsBoolean)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
        limit = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
        constructor() {
            __runInitializers(this, _limit_extraInitializers);
        }
    };
})();
exports.FeatureDto = FeatureDto;
/**
 * Request DTO for verifying a license
 */
let VerifyLicenseDto = (() => {
    let _licenseKey_decorators;
    let _licenseKey_initializers = [];
    let _licenseKey_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    return class VerifyLicenseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _licenseKey_decorators = [(0, class_validator_1.IsString)()];
            _timestamp_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        licenseKey = __runInitializers(this, _licenseKey_initializers, void 0);
        timestamp = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
        constructor() {
            __runInitializers(this, _timestamp_extraInitializers);
        }
    };
})();
exports.VerifyLicenseDto = VerifyLicenseDto;
/**
 * Response DTO for license verification
 */
let VerifyLicenseResponseDto = (() => {
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _organizationName_decorators;
    let _organizationName_initializers = [];
    let _organizationName_extraInitializers = [];
    let _maxUsers_decorators;
    let _maxUsers_initializers = [];
    let _maxUsers_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _cacheTTL_decorators;
    let _cacheTTL_initializers = [];
    let _cacheTTL_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class VerifyLicenseResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(['valid', 'invalid', 'expired', 'error'])];
            _organizationName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _maxUsers_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _features_decorators = [(0, class_transformer_1.Type)(() => FeatureDto)];
            _cacheTTL_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _message_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _cacheTTL_decorators, { kind: "field", name: "cacheTTL", static: false, private: false, access: { has: obj => "cacheTTL" in obj, get: obj => obj.cacheTTL, set: (obj, value) => { obj.cacheTTL = value; } }, metadata: _metadata }, _cacheTTL_initializers, _cacheTTL_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        valid;
        status = __runInitializers(this, _status_initializers, void 0);
        organizationName = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _organizationName_initializers, void 0));
        maxUsers = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        expiryDate = __runInitializers(this, _maxUsers_extraInitializers);
        features = __runInitializers(this, _features_initializers, void 0);
        cacheTTL = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _cacheTTL_initializers, void 0));
        message = (__runInitializers(this, _cacheTTL_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.VerifyLicenseResponseDto = VerifyLicenseResponseDto;
/**
 * License information DTO for responses
 */
let LicenseInfoDto = (() => {
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
    let _lastVerifiedAt_decorators;
    let _lastVerifiedAt_initializers = [];
    let _lastVerifiedAt_extraInitializers = [];
    let _verificationCount_decorators;
    let _verificationCount_initializers = [];
    let _verificationCount_extraInitializers = [];
    return class LicenseInfoDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsUUID)()];
            _licenseKey_decorators = [(0, class_validator_1.IsString)()];
            _organizationName_decorators = [(0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(['active', 'expired', 'invalid', 'suspended', 'pending'])];
            _isValid_decorators = [(0, class_validator_1.IsBoolean)()];
            _expiryDate_decorators = [(0, class_validator_1.IsOptional)()];
            _features_decorators = [(0, class_transformer_1.Type)(() => FeatureDto)];
            _maxUsers_decorators = [(0, class_validator_1.IsNumber)()];
            _lastVerifiedAt_decorators = [(0, class_validator_1.IsOptional)()];
            _verificationCount_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _isValid_decorators, { kind: "field", name: "isValid", static: false, private: false, access: { has: obj => "isValid" in obj, get: obj => obj.isValid, set: (obj, value) => { obj.isValid = value; } }, metadata: _metadata }, _isValid_initializers, _isValid_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _lastVerifiedAt_decorators, { kind: "field", name: "lastVerifiedAt", static: false, private: false, access: { has: obj => "lastVerifiedAt" in obj, get: obj => obj.lastVerifiedAt, set: (obj, value) => { obj.lastVerifiedAt = value; } }, metadata: _metadata }, _lastVerifiedAt_initializers, _lastVerifiedAt_extraInitializers);
            __esDecorate(null, null, _verificationCount_decorators, { kind: "field", name: "verificationCount", static: false, private: false, access: { has: obj => "verificationCount" in obj, get: obj => obj.verificationCount, set: (obj, value) => { obj.verificationCount = value; } }, metadata: _metadata }, _verificationCount_initializers, _verificationCount_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        id = __runInitializers(this, _id_initializers, void 0);
        licenseKey = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _licenseKey_initializers, void 0));
        organizationName = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _organizationName_initializers, void 0));
        status = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        isValid = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _isValid_initializers, void 0));
        expiryDate = (__runInitializers(this, _isValid_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
        features = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _features_initializers, void 0));
        maxUsers = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        lastVerifiedAt = (__runInitializers(this, _maxUsers_extraInitializers), __runInitializers(this, _lastVerifiedAt_initializers, void 0));
        verificationCount = (__runInitializers(this, _lastVerifiedAt_extraInitializers), __runInitializers(this, _verificationCount_initializers, void 0));
        createdAt = __runInitializers(this, _verificationCount_extraInitializers);
        updatedAt;
    };
})();
exports.LicenseInfoDto = LicenseInfoDto;
/**
 * Request DTO for issuing a new license
 */
let IssueLicenseDto = (() => {
    let _organizationName_decorators;
    let _organizationName_initializers = [];
    let _organizationName_extraInitializers = [];
    let _licenseKey_decorators;
    let _licenseKey_initializers = [];
    let _licenseKey_extraInitializers = [];
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _maxUsers_decorators;
    let _maxUsers_initializers = [];
    let _maxUsers_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return class IssueLicenseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationName_decorators = [(0, class_validator_1.IsString)()];
            _licenseKey_decorators = [(0, class_validator_1.IsString)()];
            _planId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _instituteId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _expiryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _features_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => FeatureDto), (0, class_validator_1.ArrayMinSize)(1)];
            _maxUsers_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        organizationName = __runInitializers(this, _organizationName_initializers, void 0);
        licenseKey = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _licenseKey_initializers, void 0));
        planId = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
        instituteId = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        expiryDate = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
        features = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _features_initializers, void 0));
        maxUsers = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        notes = (__runInitializers(this, _maxUsers_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        constructor() {
            __runInitializers(this, _notes_extraInitializers);
        }
    };
})();
exports.IssueLicenseDto = IssueLicenseDto;
/**
 * Request DTO for updating a license
 */
let UpdateLicenseDto = (() => {
    let _organizationName_decorators;
    let _organizationName_initializers = [];
    let _organizationName_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _maxUsers_decorators;
    let _maxUsers_initializers = [];
    let _maxUsers_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return class UpdateLicenseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'expired', 'invalid', 'suspended', 'pending'])];
            _expiryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _features_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => FeatureDto)];
            _maxUsers_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            __esDecorate(null, null, _maxUsers_decorators, { kind: "field", name: "maxUsers", static: false, private: false, access: { has: obj => "maxUsers" in obj, get: obj => obj.maxUsers, set: (obj, value) => { obj.maxUsers = value; } }, metadata: _metadata }, _maxUsers_initializers, _maxUsers_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        organizationName = __runInitializers(this, _organizationName_initializers, void 0);
        status = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        expiryDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
        features = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _features_initializers, void 0));
        maxUsers = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _maxUsers_initializers, void 0));
        notes = (__runInitializers(this, _maxUsers_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
        constructor() {
            __runInitializers(this, _notes_extraInitializers);
        }
    };
})();
exports.UpdateLicenseDto = UpdateLicenseDto;
/**
 * Request DTO for checking if a feature is enabled
 */
let CheckFeatureDto = (() => {
    let _licenseKey_decorators;
    let _licenseKey_initializers = [];
    let _licenseKey_extraInitializers = [];
    let _featureName_decorators;
    let _featureName_initializers = [];
    let _featureName_extraInitializers = [];
    return class CheckFeatureDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _licenseKey_decorators = [(0, class_validator_1.IsString)()];
            _featureName_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _featureName_decorators, { kind: "field", name: "featureName", static: false, private: false, access: { has: obj => "featureName" in obj, get: obj => obj.featureName, set: (obj, value) => { obj.featureName = value; } }, metadata: _metadata }, _featureName_initializers, _featureName_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        licenseKey = __runInitializers(this, _licenseKey_initializers, void 0);
        featureName = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _featureName_initializers, void 0));
        constructor() {
            __runInitializers(this, _featureName_extraInitializers);
        }
    };
})();
exports.CheckFeatureDto = CheckFeatureDto;
/**
 * Response DTO for feature check
 */
let CheckFeatureResponseDto = (() => {
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    return class CheckFeatureResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _enabled_decorators = [(0, class_validator_1.IsBoolean)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _message_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        enabled = __runInitializers(this, _enabled_initializers, void 0);
        limit = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
        message = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _message_initializers, void 0));
        constructor() {
            __runInitializers(this, _message_extraInitializers);
        }
    };
})();
exports.CheckFeatureResponseDto = CheckFeatureResponseDto;
/**
 * Query DTO for listing licenses with filters
 */
let ListLicensesQueryDto = (() => {
    let _skip_decorators;
    let _skip_initializers = [];
    let _skip_extraInitializers = [];
    let _take_decorators;
    let _take_initializers = [];
    let _take_extraInitializers = [];
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _isValid_decorators;
    let _isValid_initializers = [];
    let _isValid_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    return class ListLicensesQueryDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _skip_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _take_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['active', 'expired', 'invalid', 'suspended', 'pending'])];
            _isValid_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _instituteId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _planId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _skip_decorators, { kind: "field", name: "skip", static: false, private: false, access: { has: obj => "skip" in obj, get: obj => obj.skip, set: (obj, value) => { obj.skip = value; } }, metadata: _metadata }, _skip_initializers, _skip_extraInitializers);
            __esDecorate(null, null, _take_decorators, { kind: "field", name: "take", static: false, private: false, access: { has: obj => "take" in obj, get: obj => obj.take, set: (obj, value) => { obj.take = value; } }, metadata: _metadata }, _take_initializers, _take_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _isValid_decorators, { kind: "field", name: "isValid", static: false, private: false, access: { has: obj => "isValid" in obj, get: obj => obj.isValid, set: (obj, value) => { obj.isValid = value; } }, metadata: _metadata }, _isValid_initializers, _isValid_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        skip = __runInitializers(this, _skip_initializers, 0);
        take = (__runInitializers(this, _skip_extraInitializers), __runInitializers(this, _take_initializers, 10));
        search = (__runInitializers(this, _take_extraInitializers), __runInitializers(this, _search_initializers, void 0));
        status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        isValid = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _isValid_initializers, void 0));
        instituteId = (__runInitializers(this, _isValid_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        planId = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
        constructor() {
            __runInitializers(this, _planId_extraInitializers);
        }
    };
})();
exports.ListLicensesQueryDto = ListLicensesQueryDto;
/**
 * Response DTO for paginated license list
 */
let LicenseListResponseDto = (() => {
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _total_decorators;
    let _total_initializers = [];
    let _total_extraInitializers = [];
    let _skip_decorators;
    let _skip_initializers = [];
    let _skip_extraInitializers = [];
    let _take_decorators;
    let _take_initializers = [];
    let _take_extraInitializers = [];
    return class LicenseListResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [(0, class_transformer_1.Type)(() => LicenseInfoDto)];
            _total_decorators = [(0, class_validator_1.IsNumber)()];
            _skip_decorators = [(0, class_validator_1.IsNumber)()];
            _take_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, null, _skip_decorators, { kind: "field", name: "skip", static: false, private: false, access: { has: obj => "skip" in obj, get: obj => obj.skip, set: (obj, value) => { obj.skip = value; } }, metadata: _metadata }, _skip_initializers, _skip_extraInitializers);
            __esDecorate(null, null, _take_decorators, { kind: "field", name: "take", static: false, private: false, access: { has: obj => "take" in obj, get: obj => obj.take, set: (obj, value) => { obj.take = value; } }, metadata: _metadata }, _take_initializers, _take_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        data = __runInitializers(this, _data_initializers, void 0);
        total = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _total_initializers, void 0));
        skip = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _skip_initializers, void 0));
        take = (__runInitializers(this, _skip_extraInitializers), __runInitializers(this, _take_initializers, void 0));
        constructor() {
            __runInitializers(this, _take_extraInitializers);
        }
    };
})();
exports.LicenseListResponseDto = LicenseListResponseDto;
/**
 * Response DTO for license revocation
 */
let RevokeLicenseResponseDto = (() => {
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _licenseKey_decorators;
    let _licenseKey_initializers = [];
    let _licenseKey_extraInitializers = [];
    let _revokedAt_decorators;
    let _revokedAt_initializers = [];
    let _revokedAt_extraInitializers = [];
    return class RevokeLicenseResponseDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _message_decorators = [(0, class_validator_1.IsString)()];
            _licenseKey_decorators = [(0, class_validator_1.IsString)()];
            _revokedAt_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _licenseKey_decorators, { kind: "field", name: "licenseKey", static: false, private: false, access: { has: obj => "licenseKey" in obj, get: obj => obj.licenseKey, set: (obj, value) => { obj.licenseKey = value; } }, metadata: _metadata }, _licenseKey_initializers, _licenseKey_extraInitializers);
            __esDecorate(null, null, _revokedAt_decorators, { kind: "field", name: "revokedAt", static: false, private: false, access: { has: obj => "revokedAt" in obj, get: obj => obj.revokedAt, set: (obj, value) => { obj.revokedAt = value; } }, metadata: _metadata }, _revokedAt_initializers, _revokedAt_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        message = __runInitializers(this, _message_initializers, void 0);
        licenseKey = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _licenseKey_initializers, void 0));
        revokedAt = (__runInitializers(this, _licenseKey_extraInitializers), __runInitializers(this, _revokedAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _revokedAt_extraInitializers);
        }
    };
})();
exports.RevokeLicenseResponseDto = RevokeLicenseResponseDto;
