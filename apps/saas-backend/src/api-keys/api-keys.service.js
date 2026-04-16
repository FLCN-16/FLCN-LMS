"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysService = void 0;
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
/**
 * API Keys Service
 *
 * Manages API key generation, validation, and lifecycle
 * Handles secure key storage and usage tracking
 */
let ApiKeysService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApiKeysService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiKeysService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        apiKeyRepository;
        instituteRepository;
        constructor(apiKeyRepository, instituteRepository) {
            this.apiKeyRepository = apiKeyRepository;
            this.instituteRepository = instituteRepository;
        }
        /**
         * Generate a new API key
         * Format: FLCN_<random_32_chars>
         */
        generateRawKey() {
            const randomBytes = crypto.randomBytes(24).toString('hex');
            return `FLCN_${randomBytes}`;
        }
        /**
         * Hash an API key using SHA-256
         * Store only the hash in the database
         */
        hashKey(key) {
            return crypto.createHash('sha256').update(key).digest('hex');
        }
        /**
         * Create a new API key for an institute
         */
        async create(instituteId, createApiKeyDto) {
            // Verify institute exists
            const institute = await this.instituteRepository.findOne({
                where: { id: instituteId },
            });
            if (!institute) {
                throw new common_1.NotFoundException(`Institute ${instituteId} not found`);
            }
            // Generate raw key and hash it
            const rawKey = this.generateRawKey();
            const keyHash = this.hashKey(rawKey);
            // Check for duplicate hash (extremely unlikely but possible)
            const existingKey = await this.apiKeyRepository.findOne({
                where: { keyHash },
            });
            if (existingKey) {
                throw new common_1.BadRequestException('API key collision detected. Please try again.');
            }
            // Create and save the key
            const apiKey = this.apiKeyRepository.create({
                instituteId,
                keyHash,
                name: createApiKeyDto.name,
                scopes: createApiKeyDto.scopes || ['read:licenses', 'read:features'],
                rateLimit: createApiKeyDto.rateLimit || 1000,
                isActive: true,
                expiresAt: createApiKeyDto.expiresAt
                    ? new Date(createApiKeyDto.expiresAt)
                    : undefined,
            });
            await this.apiKeyRepository.save(apiKey);
            return {
                id: apiKey.id,
                instituteId: apiKey.instituteId,
                name: apiKey.name,
                scopes: apiKey.scopes,
                rateLimit: apiKey.rateLimit,
                key: rawKey, // Only returned once!
                expiresAt: apiKey.expiresAt,
                createdAt: apiKey.createdAt,
                warning: 'Save this key securely. You will not be able to see it again!',
            };
        }
        /**
         * Validate an API key
         * Returns key details if valid, null otherwise
         */
        async validateKey(key) {
            const keyHash = this.hashKey(key);
            const apiKey = await this.apiKeyRepository.findOne({
                where: { keyHash },
            });
            if (!apiKey) {
                return {
                    isValid: false,
                    message: 'Invalid API key',
                };
            }
            // Check if key is active
            if (!apiKey.isActive) {
                return {
                    isValid: false,
                    message: 'API key is inactive',
                };
            }
            // Check if key has expired
            if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
                return {
                    isValid: false,
                    message: 'API key has expired',
                };
            }
            // Update last used timestamp and request count
            apiKey.lastUsedAt = new Date();
            apiKey.totalRequests = (apiKey.totalRequests || 0) + 1;
            await this.apiKeyRepository.save(apiKey);
            // Calculate remaining requests (per hour)
            // In production, this would integrate with a rate limiter (Redis)
            const remainingRequests = apiKey.rateLimit - (apiKey.totalRequests % apiKey.rateLimit);
            return {
                isValid: true,
                keyId: apiKey.id,
                instituteId: apiKey.instituteId,
                scopes: apiKey.scopes,
                rateLimit: apiKey.rateLimit,
                remainingRequests,
                expiresAt: apiKey.expiresAt,
                message: 'API key is valid',
            };
        }
        /**
         * Check if key has a specific scope
         */
        async hasScope(key, requiredScope) {
            const keyHash = this.hashKey(key);
            const apiKey = await this.apiKeyRepository.findOne({
                where: { keyHash },
            });
            if (!apiKey || !apiKey.isActive) {
                return false;
            }
            if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
                return false;
            }
            return apiKey.scopes?.includes(requiredScope) || false;
        }
        /**
         * Get all API keys for an institute (without showing the actual key)
         */
        async findAll(instituteId, page = 1, limit = 10) {
            const [keys, total] = await this.apiKeyRepository.findAndCount({
                where: { instituteId },
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit,
            });
            const data = keys.map((key) => this.mapToDetailDto(key));
            return { data, total };
        }
        /**
         * Get a single API key by ID
         */
        async findOne(instituteId, keyId) {
            const apiKey = await this.apiKeyRepository.findOne({
                where: { id: keyId, instituteId },
            });
            if (!apiKey) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
            return this.mapToDetailDto(apiKey);
        }
        /**
         * Update an API key
         */
        async update(instituteId, keyId, updateApiKeyDto) {
            const apiKey = await this.apiKeyRepository.findOne({
                where: { id: keyId, instituteId },
            });
            if (!apiKey) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
            // Update allowed fields
            if (updateApiKeyDto.name !== undefined) {
                apiKey.name = updateApiKeyDto.name;
            }
            if (updateApiKeyDto.scopes !== undefined) {
                apiKey.scopes = updateApiKeyDto.scopes;
            }
            if (updateApiKeyDto.rateLimit !== undefined) {
                apiKey.rateLimit = updateApiKeyDto.rateLimit;
            }
            if (updateApiKeyDto.expiresAt !== undefined) {
                apiKey.expiresAt = new Date(updateApiKeyDto.expiresAt);
            }
            await this.apiKeyRepository.save(apiKey);
            return this.mapToDetailDto(apiKey);
        }
        /**
         * Disable an API key
         */
        async disable(instituteId, keyId) {
            const apiKey = await this.apiKeyRepository.findOne({
                where: { id: keyId, instituteId },
            });
            if (!apiKey) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
            apiKey.isActive = false;
            await this.apiKeyRepository.save(apiKey);
            return this.mapToDetailDto(apiKey);
        }
        /**
         * Re-enable an API key
         */
        async enable(instituteId, keyId) {
            const apiKey = await this.apiKeyRepository.findOne({
                where: { id: keyId, instituteId },
            });
            if (!apiKey) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
            apiKey.isActive = true;
            await this.apiKeyRepository.save(apiKey);
            return this.mapToDetailDto(apiKey);
        }
        /**
         * Delete an API key
         */
        async delete(instituteId, keyId) {
            const result = await this.apiKeyRepository.delete({
                id: keyId,
                instituteId,
            });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
        }
        /**
         * Get usage statistics for a key
         */
        async getStats(instituteId, keyId) {
            const apiKey = await this.apiKeyRepository.findOne({
                where: { id: keyId, instituteId },
            });
            if (!apiKey) {
                throw new common_1.NotFoundException(`API key ${keyId} not found`);
            }
            // In production, query Redis for hourly request count
            // For now, return approximate based on rate limit
            const requestsThisHour = apiKey.totalRequests % apiKey.rateLimit;
            return {
                totalRequests: apiKey.totalRequests,
                lastUsedAt: apiKey.lastUsedAt,
                requestsThisHour,
            };
        }
        /**
         * Map ApiKey entity to detail DTO (safe for public response)
         */
        mapToDetailDto(apiKey) {
            const keyPreview = apiKey.keyHash.substring(0, 8);
            return {
                id: apiKey.id,
                instituteId: apiKey.instituteId,
                name: apiKey.name,
                scopes: apiKey.scopes,
                rateLimit: apiKey.rateLimit,
                keyPreview: `${keyPreview}...`,
                lastUsedAt: apiKey.lastUsedAt,
                totalRequests: apiKey.totalRequests,
                isActive: apiKey.isActive,
                expiresAt: apiKey.expiresAt,
                createdAt: apiKey.createdAt,
                updatedAt: apiKey.updatedAt,
            };
        }
    };
    return ApiKeysService = _classThis;
})();
exports.ApiKeysService = ApiKeysService;
