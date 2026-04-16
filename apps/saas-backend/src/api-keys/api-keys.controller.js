"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
/**
 * API Keys Controller
 *
 * Manages API key lifecycle for SaaS customers (institutes)
 * All endpoints require valid authentication
 *
 * Routes:
 * POST   /api-keys                    - Create new API key
 * GET    /api-keys                    - List API keys
 * GET    /api-keys/:keyId             - Get specific key
 * PUT    /api-keys/:keyId             - Update key
 * PATCH  /api-keys/:keyId/disable     - Disable key
 * PATCH  /api-keys/:keyId/enable      - Enable key
 * DELETE /api-keys/:keyId             - Delete key
 * GET    /api-keys/:keyId/stats       - Get usage statistics
 * POST   /api-keys/validate           - Validate a key (public)
 */
let ApiKeysController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _disable_decorators;
    let _enable_decorators;
    let _delete_decorators;
    let _getStats_decorators;
    let _validate_decorators;
    var ApiKeysController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _create_decorators = [(0, common_1.Post)(), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
            _findAll_decorators = [(0, common_1.Get)(), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _findOne_decorators = [(0, common_1.Get)(':keyId'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _update_decorators = [(0, common_1.Put)(':keyId'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _disable_decorators = [(0, common_1.Patch)(':keyId/disable'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _enable_decorators = [(0, common_1.Patch)(':keyId/enable'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _delete_decorators = [(0, common_1.Delete)(':keyId'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
            _getStats_decorators = [(0, common_1.Get)(':keyId/stats'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            _validate_decorators = [(0, common_1.Post)('validate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _disable_decorators, { kind: "method", name: "disable", static: false, private: false, access: { has: obj => "disable" in obj, get: obj => obj.disable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _enable_decorators, { kind: "method", name: "enable", static: false, private: false, access: { has: obj => "enable" in obj, get: obj => obj.enable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: obj => "delete" in obj, get: obj => obj.delete }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: obj => "getStats" in obj, get: obj => obj.getStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: obj => "validate" in obj, get: obj => obj.validate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiKeysController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        apiKeysService = __runInitializers(this, _instanceExtraInitializers);
        constructor(apiKeysService) {
            this.apiKeysService = apiKeysService;
        }
        /**
         * Create a new API key for an institute
         *
         * POST /api-keys
         *
         * Body:
         * {
         *   "name": "Production Gin Backend",
         *   "scopes": ["read:licenses", "read:features"],
         *   "rateLimit": 5000,
         *   "expiresAt": "2025-12-31T23:59:59Z"
         * }
         *
         * Returns: ApiKeyResponseDto with raw key (shown only once)
         */
        async create(createApiKeyDto, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.create(instituteId, createApiKeyDto);
        }
        /**
         * List all API keys for an institute
         *
         * GET /api-keys?instituteId=xxx&page=1&limit=10
         *
         * Returns: { data: ApiKeyDetailDto[], total: number }
         */
        async findAll(instituteId, page, limit) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            const pageNum = page ? parseInt(page, 10) : 1;
            const limitNum = limit ? parseInt(limit, 10) : 10;
            if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
                throw new common_1.BadRequestException('Invalid pagination parameters');
            }
            return this.apiKeysService.findAll(instituteId, pageNum, limitNum);
        }
        /**
         * Get a specific API key by ID
         *
         * GET /api-keys/:keyId?instituteId=xxx
         *
         * Returns: ApiKeyDetailDto (without the raw key)
         */
        async findOne(keyId, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.findOne(instituteId, keyId);
        }
        /**
         * Update an API key's properties
         *
         * PUT /api-keys/:keyId?instituteId=xxx
         *
         * Body:
         * {
         *   "name": "Updated Name",
         *   "scopes": ["read:licenses"],
         *   "rateLimit": 2000,
         *   "expiresAt": "2025-06-30T23:59:59Z"
         * }
         *
         * Returns: Updated ApiKeyDetailDto
         */
        async update(keyId, instituteId, updateApiKeyDto) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.update(instituteId, keyId, updateApiKeyDto);
        }
        /**
         * Disable an API key
         *
         * PATCH /api-keys/:keyId/disable?instituteId=xxx
         *
         * Returns: Updated ApiKeyDetailDto with isActive=false
         */
        async disable(keyId, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.disable(instituteId, keyId);
        }
        /**
         * Re-enable an API key
         *
         * PATCH /api-keys/:keyId/enable?instituteId=xxx
         *
         * Returns: Updated ApiKeyDetailDto with isActive=true
         */
        async enable(keyId, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.enable(instituteId, keyId);
        }
        /**
         * Delete an API key
         *
         * DELETE /api-keys/:keyId?instituteId=xxx
         *
         * Returns: 204 No Content
         */
        async delete(keyId, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.delete(instituteId, keyId);
        }
        /**
         * Get usage statistics for an API key
         *
         * GET /api-keys/:keyId/stats?instituteId=xxx
         *
         * Returns: { totalRequests, lastUsedAt, requestsThisHour }
         */
        async getStats(keyId, instituteId) {
            if (!instituteId) {
                throw new common_1.BadRequestException('instituteId query parameter is required');
            }
            return this.apiKeysService.getStats(instituteId, keyId);
        }
        /**
         * Validate an API key
         *
         * PUBLIC ENDPOINT - Can be called by external services (e.g., Gin backend)
         *
         * POST /api-keys/validate
         *
         * Body:
         * {
         *   "key": "FLCN_abcd1234efgh5678ijkl9012mnop3456"
         * }
         *
         * Returns: ApiKeyValidationResponseDto
         * {
         *   "isValid": true,
         *   "keyId": "xxx",
         *   "instituteId": "yyy",
         *   "scopes": ["read:licenses"],
         *   "rateLimit": 1000,
         *   "remainingRequests": 999,
         *   "expiresAt": "2025-12-31T23:59:59Z",
         *   "message": "API key is valid"
         * }
         */
        async validate(validateApiKeyDto) {
            return this.apiKeysService.validateKey(validateApiKeyDto.key);
        }
    };
    return ApiKeysController = _classThis;
})();
exports.ApiKeysController = ApiKeysController;
