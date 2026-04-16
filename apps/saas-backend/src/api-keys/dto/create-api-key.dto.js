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
exports.ApiKeyValidationResponseDto = exports.ValidateApiKeyDto = exports.UpdateApiKeyDto = exports.ApiKeyDetailDto = exports.ApiKeyResponseDto = exports.CreateApiKeyDto = exports.ALLOWED_API_KEY_SCOPES = void 0;
const class_validator_1 = require("class-validator");
/**
 * Allowed API key scopes
 * Restrict scopes to this allowlist to prevent arbitrary scope injection
 */
exports.ALLOWED_API_KEY_SCOPES = [
    'read:licenses',
    'write:licenses',
    'read:features',
    'write:features',
    'read:customers',
    'write:customers',
    'read:analytics',
    'write:analytics',
    'read:invoices',
    'write:invoices',
];
/**
 * DTO for creating a new API key
 */
let CreateApiKeyDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _scopes_decorators;
    let _scopes_initializers = [];
    let _scopes_extraInitializers = [];
    let _rateLimit_decorators;
    let _rateLimit_initializers = [];
    let _rateLimit_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    return class CreateApiKeyDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _scopes_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsIn)(exports.ALLOWED_API_KEY_SCOPES, { each: true }), (0, class_validator_1.IsOptional)()];
            _rateLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(10), (0, class_validator_1.Max)(100000), (0, class_validator_1.IsOptional)()];
            _expiresAt_decorators = [(0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: obj => "scopes" in obj, get: obj => obj.scopes, set: (obj, value) => { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _rateLimit_decorators, { kind: "field", name: "rateLimit", static: false, private: false, access: { has: obj => "rateLimit" in obj, get: obj => obj.rateLimit, set: (obj, value) => { obj.rateLimit = value; } }, metadata: _metadata }, _rateLimit_initializers, _rateLimit_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * Display name for this API key (e.g., "Gin Backend Key")
         */
        name = __runInitializers(this, _name_initializers, void 0);
        /**
         * Scopes/permissions this key has
         * Example: ['read:licenses', 'read:features', 'write:analytics']
         * Must be from ALLOWED_API_KEY_SCOPES allowlist
         */
        scopes = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
        /**
         * Rate limit (requests per hour)
         * Defaults to 1000 if not specified
         */
        rateLimit = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _rateLimit_initializers, void 0));
        /**
         * Optional expiration date (ISO 8601 format)
         */
        expiresAt = (__runInitializers(this, _rateLimit_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _expiresAt_extraInitializers);
        }
    };
})();
exports.CreateApiKeyDto = CreateApiKeyDto;
/**
 * DTO for API key response (shown only once during creation)
 * Includes the raw key for copying
 */
class ApiKeyResponseDto {
    id;
    instituteId;
    name;
    scopes;
    rateLimit;
    /**
     * The raw API key - only shown once during creation!
     * Store this securely - it cannot be retrieved later
     */
    key;
    expiresAt;
    createdAt;
    /**
     * Warning message
     */
    warning;
}
exports.ApiKeyResponseDto = ApiKeyResponseDto;
/**
 * DTO for API key details (without showing the raw key)
 * Safe to return in list/get endpoints
 */
class ApiKeyDetailDto {
    id;
    instituteId;
    name;
    scopes;
    rateLimit;
    /**
     * First 8 characters of the key hash for display (e.g., "FLCN_mk9...")
     */
    keyPreview;
    lastUsedAt;
    totalRequests;
    isActive;
    expiresAt;
    createdAt;
    updatedAt;
}
exports.ApiKeyDetailDto = ApiKeyDetailDto;
/**
 * DTO for updating an API key
 */
let UpdateApiKeyDto = (() => {
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _scopes_decorators;
    let _scopes_initializers = [];
    let _scopes_extraInitializers = [];
    let _rateLimit_decorators;
    let _rateLimit_initializers = [];
    let _rateLimit_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    return class UpdateApiKeyDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _scopes_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsIn)(exports.ALLOWED_API_KEY_SCOPES, { each: true }), (0, class_validator_1.IsOptional)()];
            _rateLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(10), (0, class_validator_1.Max)(100000), (0, class_validator_1.IsOptional)()];
            _expiresAt_decorators = [(0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: obj => "scopes" in obj, get: obj => obj.scopes, set: (obj, value) => { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _rateLimit_decorators, { kind: "field", name: "rateLimit", static: false, private: false, access: { has: obj => "rateLimit" in obj, get: obj => obj.rateLimit, set: (obj, value) => { obj.rateLimit = value; } }, metadata: _metadata }, _rateLimit_initializers, _rateLimit_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        name = __runInitializers(this, _name_initializers, void 0);
        scopes = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
        rateLimit = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _rateLimit_initializers, void 0));
        expiresAt = (__runInitializers(this, _rateLimit_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
        constructor() {
            __runInitializers(this, _expiresAt_extraInitializers);
        }
    };
})();
exports.UpdateApiKeyDto = UpdateApiKeyDto;
/**
 * DTO for validating an API key
 */
let ValidateApiKeyDto = (() => {
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    return class ValidateApiKeyDto {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        key = __runInitializers(this, _key_initializers, void 0);
        constructor() {
            __runInitializers(this, _key_extraInitializers);
        }
    };
})();
exports.ValidateApiKeyDto = ValidateApiKeyDto;
/**
 * DTO for API key validation response
 */
class ApiKeyValidationResponseDto {
    isValid;
    keyId;
    instituteId;
    scopes;
    rateLimit;
    remainingRequests;
    expiresAt;
    message;
}
exports.ApiKeyValidationResponseDto = ApiKeyValidationResponseDto;
